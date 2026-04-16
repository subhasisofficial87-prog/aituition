<?php
/**
 * Simple connection test - run this on Hostinger to verify MySQL connectivity
 * Access at: https://aituition.in/test-connection.php
 */

// Exact credentials from server.js / deploy.py
$host = '127.0.0.1';
$user = 'u803669722_u803669722_qzn';
$password = 'Sub:6AAU:#Ug467551';
$database = 'u803669722_u803669722_qzn';

echo "=== AITuition MySQL Connection Test ===\n\n";
echo "Attempting connection with:\n";
echo "  Host: $host\n";
echo "  User: $user\n";
echo "  Database: $database\n";
echo "  Password: (hidden)\n\n";

try {
    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) {
        echo "❌ Connection FAILED\n";
        echo "Error Code: " . $conn->connect_errno . "\n";
        echo "Error Message: " . $conn->connect_error . "\n";
        exit(1);
    }

    echo "✅ Connection SUCCESSFUL\n\n";

    // Check tables
    $result = $conn->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '$database'");

    if ($result) {
        echo "📊 Tables found:\n";
        $tables = [];
        while ($row = $result->fetch_assoc()) {
            $tables[] = $row['TABLE_NAME'];
            echo "  • " . $row['TABLE_NAME'] . "\n";
        }
        echo "\nTotal: " . count($tables) . " tables\n\n";
    }

    // Check user count
    $count_result = $conn->query("SELECT COUNT(*) as cnt FROM users");
    if ($count_result) {
        $row = $count_result->fetch_assoc();
        echo "👥 Users in database: " . $row['cnt'] . "\n";
    }

    // Check syllabus count
    $syll_result = $conn->query("SELECT COUNT(*) as cnt FROM syllabus_structures");
    if ($syll_result) {
        $row = $syll_result->fetch_assoc();
        echo "📚 Syllabus structures: " . $row['cnt'] . "\n";
    }

    $conn->close();
    echo "\n✅ All checks passed!\n";

} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
    exit(1);
}
?>
