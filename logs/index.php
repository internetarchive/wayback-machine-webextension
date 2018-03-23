<!DOCTYPE html>
<html>
<head>

</style>
</head>
<body>
<?php
$conn = mysqli_connect('servername','uname','pass','database');
if (!$conn) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql = "SELECT * FROM logg";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
echo "<table>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>savenow</td><td>" . $row['savenow'] . "</td></tr><tr><td>resent version</td><td>" . $row['resentversion'] . "</td></tr><tr><td>first version</td><td>" . $row['firstversion'] ."</td></tr><tr><td>overview</td><td>" . $row['overview'] ."</td></tr><tr><td>uploadfiles</td><td>" . $row['uploadfiles'] ."</td></tr><tr><td>alexa</td><td>" . $row['alexa'] ."</td></tr><tr><td>alexamore</td><td>" . $row['alexamore'] ."</td></tr><tr><td>whois</td><td>" . $row['whois'] ."</td></tr><tr><td>whoismore</td><td>" . $row['whoismore'] ."</td></tr><tr><td>tweets</td><td>" . $row['tweets'] ."</td></tr><tr><td>sile map</td><td>" . $row['sitemap'] ."</td></tr><tr><td>fb</td><td>" . $row['fb'] ."</td></tr><tr><td>tw</td><td>" . $row['tw'] ."</td></tr><tr><td>gp</td><td>" . $row['gp'] ."</td></tr><tr><td>ln</td><td>" . $row['ln'] ."</td></tr><tr><td>about</td><td>" . $row['about'] ."</td></tr>";
    }
echo "</table>";
} else {
    echo "0 results";
}

$conn->close();
?>
</body>
</html>			