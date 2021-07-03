<?php
session_start();
unset($_SESSION['un1']);
unset($_SESSION['uid']);
//session_destroy();

header("Location:../login.php");
exit;
?>