<?php 
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/
?>
<h2 class="StepTitle">Login</h2>
<div class="enrolment_steps">
   <div class="alert alert-danger" role="alert" style="display: none;" id="axip_login_error"></div>    
  <form class="form">
    <div class="form-group">
      <label class="sr-only mandatory" for="email">Email address</label>
      <input type="email" class="form-control" id="email" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label class="sr-only mandatory" for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password">
    </div>
    
    <p>(or)</p>
    <div class="form-group">
        <a class="btn btn-default" id="axip_new_user">New User</a>
    </div>
    
  </form>
</div>