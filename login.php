<?php
session_start();
$loc='http://' . $_SERVER['HTTP_HOST'];
if(isset($_SESSION['un1'])){
    header("Location:".$loc. "/grab_qaqc/index.php");

}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome Grab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="generator" content="Codeply">
    <link rel="shortcut icon" type="image/ico" href="" />

	<link rel="stylesheet" href="lib/bootstrap/4.1.3/dist/css/bootstrap.min.css" />
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"  />
	<link rel="stylesheet" href="lib/bootstrap-select/1.13.1/dist/css/bootstrap-select.min.css">
	<link rel="stylesheet" href="assets/css/login.css" />

	<style>
		.formControl
		{
			border-color: #e8e8e8;
		}
	</style>
</head>
<body>
<div class="container-fluid">
	<div class="row no-gutter">
		<div class="d-none d-md-flex col-md-4 col-lg-6 bg-image">

		</div>
		<div class="col-md-8 col-lg-6" style="background-color: #e8e8e8">
			<div class="login d-flex align-items-center py-5">
				<div class="container">
                    <div class="uuLogo text-center mb-5">
                        <img src="assets/img/logo.png" width="280" height="70" alt="">
                    </div>
					<h2 class="spaceTech text-muted text-center mb-0"><span class=" text-uppercase text-success" style="font-family: 'Muli', sans-serif;font-weight: bold;">AeroGrab</span></h2>
					<h5 class="spaceTech text-muted text-center mb-5">Aerograb POI Collection</h5>
                    <div class="row">
						<div class="col-md-9 col-lg-8 mx-auto">
							<h3 class="login-heading mb-4">Login</h3>
							<form method="post" action="services/login.php">
								<div class="form-label-group">
									<input type="text" name="username" id="inputEmail" class="form-control formControl" placeholder="Username" required autofocus>
									<label for="inputEmail" style="color: #6C757D;">Username</label>
								</div>

								<div class="form-label-group">
									<input type="password" name="password" id="inputPassword" class="form-control formControl" placeholder="Password" required>
									<label for="inputPassword" style="color: #6C757D;">Password</label>
								</div>

								<div class="custom-control custom-checkbox mb-3">
									<!--<input type="checkbox" class="custom-control-input" id="customCheck1">-->
									<!--<label class="custom-control-label" for="customCheck1">Remember password</label>-->
									&nbsp;
								</div>
								<button class="btn btn-lg btn-success btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</button>
								<div class="text-center">
									&nbsp;<!--<a class="small" href="#">Forgot password?</a>-->
								</div>
							</form>
						</div>
					</div>
					<p class="text-muted text-center">Developed by <a href="" target="_blank" style="color: #28A745;">ASSB</a></p>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="lib/jquery/3.3.1/dist/jquery.min.js"></script>
<script src="lib/popper/popper.min.js"></script>
<script src="lib/bootstrap/4.1.3/dist/js/bootstrap.min.js"></script>
</body>
</html>
