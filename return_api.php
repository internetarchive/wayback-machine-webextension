<?php
if($_SERVER['REQUEST_METHOD']=='POST'){
    $admin_email = "info@archive.org";
    $email = $_REQUEST['email'];
    $subject=$_REQUEST['subject'];
    $comment=$_REQUEST['feedback'];
    mail($admin_email, "$subject", $comment, "From:" . $email);
    header("Location: https://archive.org/");
}
else{
    echo error;
}
?>