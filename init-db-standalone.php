#!/usr/bin/env php
<?php
/**
 * Standalone database initialization script
 * Run via SSH: php init-db-standalone.php
 */

// Database credentials
$host = '127.0.0.1';
$user = 'u803669722_aituition_user';
$password = 'AiTuition2024PassKiara467551';
$database = 'u803669722_423ai';

echo "=== AITuition Database Initialization ===\n\n";
echo "Connecting to: $database as $user\n";

try {
    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) {
        die("[FAIL] Connection failed: " . $conn->connect_error . "\n");
    }

    echo "[OK] Connected to database\n\n";

    // SQL statements to create tables
    $sql_statements = [
        "CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            subscription_tier ENUM('free','basic','pro') NOT NULL DEFAULT 'free',
            trial_start_date DATE NULL,
            trial_used TINYINT(1) NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS syllabus_structures (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            board VARCHAR(50) NOT NULL,
            class_level VARCHAR(10) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            structure_name VARCHAR(255) NOT NULL,
            chapters_json JSON NOT NULL,
            INDEX idx_bcs (board, class_level, subject)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS study_plans (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            board VARCHAR(50) NOT NULL,
            class_level VARCHAR(10) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            child_name VARCHAR(255) NOT NULL,
            language VARCHAR(10) NOT NULL DEFAULT 'en',
            chapters_json JSON NOT NULL,
            plan_data LONGTEXT NOT NULL,
            trial_start_date DATE NOT NULL,
            status ENUM('active','paused','expired') NOT NULL DEFAULT 'active',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS daily_sessions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id INT UNSIGNED NOT NULL,
            user_id INT UNSIGNED NOT NULL,
            day_number SMALLINT UNSIGNED NOT NULL,
            topic VARCHAR(500) NOT NULL,
            lecture_content LONGTEXT NULL,
            quiz_questions JSON NULL,
            quiz_answers JSON NULL,
            quiz_score TINYINT UNSIGNED NULL,
            completed TINYINT(1) NOT NULL DEFAULT 0,
            completed_at DATETIME NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_plan_day (plan_id, day_number),
            FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS quiz_results (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            session_id INT UNSIGNED NOT NULL,
            user_id INT UNSIGNED NOT NULL,
            plan_id INT UNSIGNED NOT NULL,
            score TINYINT UNSIGNED NOT NULL,
            total TINYINT UNSIGNED NOT NULL DEFAULT 5,
            chapter VARCHAR(255) NOT NULL,
            weak_topics JSON NULL,
            taken_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES daily_sessions(id) ON DELETE CASCADE,
            INDEX idx_user_quiz (user_id, taken_at)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS payments (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
            razorpay_payment_id VARCHAR(100) NULL,
            amount_paise INT UNSIGNED NOT NULL,
            plan_type VARCHAR(50) NOT NULL,
            billing_period ENUM('monthly','quarterly','yearly') NOT NULL,
            class_tier VARCHAR(20) NOT NULL,
            board VARCHAR(50) NOT NULL,
            status ENUM('created','paid','failed') NOT NULL DEFAULT 'created',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",

        "CREATE TABLE IF NOT EXISTS user_progress (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL UNIQUE,
            current_streak SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            longest_streak SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            total_sessions SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            avg_quiz_score DECIMAL(4,2) NULL,
            weekly_study_mins SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            last_study_date DATE NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB CHARACTER SET utf8mb4",
    ];

    // Execute each SQL statement
    $table_count = 0;
    foreach ($sql_statements as $sql) {
        if ($conn->query($sql)) {
            // Extract table name from SQL
            preg_match('/CREATE TABLE IF NOT EXISTS (\w+)/', $sql, $matches);
            echo "[OK] " . (isset($matches[1]) ? $matches[1] : 'Table') . " created\n";
            $table_count++;
        } else {
            echo "[WARN] " . $conn->error . "\n";
        }
    }

    echo "\n[OK] Created $table_count tables\n\n";

    // Insert sample syllabi
    $syllabi = [
        ['CBSE','10','Mathematics','CBSE Class 10 Maths',['Real Numbers','Polynomials','Linear Equations in Two Variables','Quadratic Equations','Arithmetic Progressions','Triangles','Coordinate Geometry','Introduction to Trigonometry','Some Applications of Trigonometry','Circles','Areas Related to Circles','Surface Areas and Volumes','Statistics','Probability']],
        ['CBSE','10','Science','CBSE Class 10 Science',['Chemical Reactions and Equations','Acids Bases and Salts','Metals and Non-metals','Carbon and its Compounds','Life Processes','Control and Coordination','How do Organisms Reproduce','Heredity','Light – Reflection and Refraction','Human Eye and Colourful World','Electricity','Magnetic Effects of Electric Current','Our Environment']],
        ['CBSE','6','Science','CBSE Class 6 Science',['Food: Where Does It Come From?','Components of Food','Fibre to Fabric','Sorting Materials into Groups','Separation of Substances','Changes Around Us','Getting to Know Plants','Body Movements','The Living Organisms and Their Surroundings','Motion and Measurement of Distances','Light Shadows and Reflections','Electricity and Circuits','Fun with Magnets','Water','Air Around Us']],
        ['CBSE','12','Physics','CBSE Class 12 Physics',['Electric Charges and Fields','Electrostatic Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics and Optical Instruments','Wave Optics','Dual Nature of Radiation and Matter','Atoms','Nuclei','Semiconductor Electronics']],
        ['CBSE','5','English','CBSE Class 5 Marigold',['Ice-Cream Man / Wonderful Waste','Teamwork / Flying Together','My Shadow / Robinson Crusoe','Crying / My Elder Brother','The Lazy Frog / Rip Van Winkle','Class Discussion / The Talkative Barber','Topsy-Turvy Land / Gulliver\'s Travels','Nobody\'s Friend / The Little Bully','Sing a Song of People / Around the World','Malu Bhalu / Who Will Be Nina\'s Friend']],
        ['CBSE','9','Social Science','CBSE Class 9 SST',['The French Revolution','Socialism in Europe and the Russian Revolution','Nazism and the Rise of Hitler','Forest Society and Colonialism','India – Size and Location','Physical Features of India','Drainage','Climate','Natural Vegetation and Wildlife','Population','What is Democracy? Why Democracy?','Constitutional Design','Electoral Politics','Working of Institutions','Democratic Rights','The Story of Village Palampur','People as Resource','Poverty as a Challenge','Food Security in India']],
        ['ICSE','10','Mathematics','ICSE Class 10 Maths',['Commercial Mathematics (GST Banking)','Ratio and Proportion','Factorization','Matrices','Quadratic Equations','Arithmetic Progressions','Coordinate Geometry','Similarity','Loci','Circles','Constructions','Mensuration','Trigonometry','Statistics','Probability']],
        ['CBSE','8','Science','CBSE Class 8 Science',['Crop Production and Management','Microorganisms','Coal and Petroleum','Combustion and Flame','Conservation of Plants and Animals','Reproduction in Animals','Reaching the Age of Adolescence','Force and Pressure','Friction','Sound','Chemical Effects of Electric Current','Some Natural Phenomena','Light']],
    ];

    echo "Inserting sample syllabi...\n";
    $inserted = 0;
    foreach ($syllabi as $s) {
        $stmt = $conn->prepare("INSERT INTO syllabus_structures (board, class_level, subject, structure_name, chapters_json) VALUES (?, ?, ?, ?, ?)");
        $chapters_json = json_encode($s[4]);
        $stmt->bind_param("sssss", $s[0], $s[1], $s[2], $s[3], $chapters_json);
        if ($stmt->execute()) {
            $inserted++;
        }
        $stmt->close();
    }

    echo "[OK] Inserted $inserted syllabi\n\n";

    $conn->close();
    echo "[OK] Database initialization complete!\n";

} catch (Exception $e) {
    die("[FAIL] Error: " . $e->getMessage() . "\n");
}
?>
