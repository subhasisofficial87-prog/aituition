<?php
$host = '127.0.0.1';
$user = 'u803669722_u803669722_qzn';
$password = 'Sub:6AAU:#Ug467551';
$database = 'u803669722_u803669722_qzn';

try {
    $conn = new mysqli($host, $user, $password, $database);

    if ($conn->connect_error) {
        echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
        exit;
    }

    // Check if tables exist
    $result = $conn->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '$database'");

    $tables = [];
    while ($row = $result->fetch_assoc()) {
        $tables[] = $row['TABLE_NAME'];
    }

    // Try a simple query
    $users_result = $conn->query("SELECT COUNT(*) as count FROM users");
    $users_count = $users_result->fetch_assoc()['count'];

    echo json_encode([
        'success' => true,
        'connected' => true,
        'tables' => $tables,
        'users_count' => $users_count,
        'host' => $host,
        'user' => $user,
        'database' => $database
    ]);

    $conn->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
