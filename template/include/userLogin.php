<?php 
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/
?>

<script type="text/javascript">
jQuery(function($){

	$('#axip_forgot_password').on('click', function(){
		$(".axip_user_reset").show();
		$("#axip_user_form").hide();
	});
	$('#axip_reset_password').on('click', function(){
		var resetData = {};
		resetData.action = 'axip_user_reset_action';
		resetData.username = $('#reset_username').val();
		resetData.email = $('#reset_email').val();
		$.ajax({
			type: "POST",
			url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
			dataType: 'JSON',
			data: resetData,
			beforeSend: function( xhr ) {
				$("#axip_ajaxLoader").show();
			},
			success: function(result) {
				$(".axip_user_reset").hide();
				$("#axip_user_form").show();
				$("#axip_ajaxLoader").hide();
				if(result.STATUS == 'error')
				{
					$("#axip_login_error").empty().append(result.MSG).show();
				}
				else{
					$("#axip_login_error").empty().append("An email has been sent with reset details. Please reset your password through the link provided, then enter your new password below.").show();
				}
				}
		});
	});

	
});

</script>
<h2 class="StepTitle">User</h2>
<div class="enrolment_steps">
   <div class="alert alert-danger" role="alert" style="display: none;" id="axip_login_error"></div>    
  <form class="form" id="axip_user_form">
    <div class="form-group">
      <label class="sr-only mandatory" for="username">Username</label>
      <input type="text" class="form-control" id="username" placeholder="Enter Username">
    </div>
    <div class="form-group">
      <label class="sr-only mandatory" for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password">
    </div>
     <div class="form-group">
        <a class="btn btn-default" id="axip_forgot_password">Forgot Password?</a>
    </div>
    <p>(or)</p>
    <div class="form-group">
        <a class="btn btn-default" id="axip_new_user">New User</a>
    </div>
    
  </form>
  
  <div class="axip_user_reset" style="display:none">
  		<div class="form-group">
      		<label class="sr-only mandatory" for="reset_username">Username</label>
      		<input type="text" class="form-control" id="reset_username" placeholder="Enter Username">
    	</div>
    	<div class="form-group">
      		<label class="sr-only mandatory" for="email">Email address</label>
      		<input type="email" class="form-control" id="reset_email" placeholder="Enter email">
    	</div>
    	<div class="form-group">
       		<a class="btn btn-default" id="axip_reset_password">Reset Password</a>
    	</div>
  </div>
  

</div>