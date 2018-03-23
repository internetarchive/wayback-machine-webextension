<!DOCTYPE html>
<html>
<head>

</style>
</head>
<body>
htjuyuyj
<?php
$conn = mysqli_connect('servername','uname','pass','database');
if (!$conn) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql = "UPDATE logg SET firstversion = firstversion+1";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}

$conn->close();
?>
</body>
</html>