<?php
session_start();
include('connection.php');

class LoginUser extends connection
{
    function __construct()
    {
        $this->connectionDB();
    }

  function login()
  {
      $user_name = $_REQUEST['username'];
      $user_pass = $_REQUEST['password'];

      // print_r($user_name);
      // print_r($user_pass);
      // exit();

      $check_sql = "select id,user_name,password from tbl_users where user_name='$user_name' and password='$user_pass'";
    //  echo $check_sql;
      $check_query = pg_query($check_sql);

      $rs = pg_fetch_array($check_query);
    //  print_r($rs);
    //  exit();
      if ($rs['user_name'] == $user_name && $rs['password']==$user_pass) {
          $_SESSION['un1']=$rs['user_name'];
          $_SESSION['uid']=$rs['id'];
          header("Location:../index.php");
		   $this->closeConnection();
          return "success";
      }else{
		   $this->closeConnection();
          header("Location:../login.php");
      }
  }

}
   $loginuser=new LoginUser();

   if(isset($_SESSION['un1'])){
       echo "you are already login";
   }else {
       echo $loginuser->login();
   }
?>