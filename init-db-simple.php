<?php
$host = '127.0.0.1';
$user = 'u803669722_aituition_user';
$pass = 'AiTuition2024PassKiara467551';
$db = 'u803669722_423ai';

$c = @new mysqli($host, $user, $pass, $db);
if($c->connect_error) die("FAIL: ".$c->connect_error);

echo "OK: Connected\n";

$tables = [
  "CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255), password_hash VARCHAR(255), subscription_tier ENUM('free','basic','pro') DEFAULT 'free', trial_start_date DATE, trial_used TINYINT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS syllabus_structures (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, board VARCHAR(50), class_level VARCHAR(10), subject VARCHAR(100), structure_name VARCHAR(255), chapters_json JSON, INDEX idx_bcs (board, class_level, subject)) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS study_plans (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED, board VARCHAR(50), class_level VARCHAR(10), subject VARCHAR(100), child_name VARCHAR(255), language VARCHAR(10) DEFAULT 'en', chapters_json JSON, plan_data LONGTEXT, trial_start_date DATE, status ENUM('active','paused','expired') DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS daily_sessions (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, plan_id INT UNSIGNED, user_id INT UNSIGNED, day_number SMALLINT UNSIGNED, topic VARCHAR(500), lecture_content LONGTEXT, quiz_questions JSON, quiz_answers JSON, quiz_score TINYINT UNSIGNED, completed TINYINT DEFAULT 0, completed_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_plan_day (plan_id, day_number), FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS quiz_results (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, session_id INT UNSIGNED, user_id INT UNSIGNED, plan_id INT UNSIGNED, score TINYINT UNSIGNED, total TINYINT UNSIGNED DEFAULT 5, chapter VARCHAR(255), weak_topics JSON, taken_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (session_id) REFERENCES daily_sessions(id) ON DELETE CASCADE, INDEX idx_user_quiz (user_id, taken_at)) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS payments (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED, razorpay_order_id VARCHAR(100) NOT NULL UNIQUE, razorpay_payment_id VARCHAR(100), amount_paise INT UNSIGNED, plan_type VARCHAR(50), billing_period ENUM('monthly','quarterly','yearly'), class_tier VARCHAR(20), board VARCHAR(50), status ENUM('created','paid','failed') DEFAULT 'created', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB CHARACTER SET utf8mb4",

  "CREATE TABLE IF NOT EXISTS user_progress (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL UNIQUE, current_streak SMALLINT UNSIGNED DEFAULT 0, longest_streak SMALLINT UNSIGNED DEFAULT 0, total_sessions SMALLINT UNSIGNED DEFAULT 0, avg_quiz_score DECIMAL(4,2), weekly_study_mins SMALLINT UNSIGNED DEFAULT 0, last_study_date DATE, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB CHARACTER SET utf8mb4",
];

foreach($tables as $sql) {
  if($c->query($sql)) echo "OK: Table created\n";
  else echo "WARN: ".$c->error."\n";
}

echo "SUCCESS: Database initialized\n";
$c->close();
?>
