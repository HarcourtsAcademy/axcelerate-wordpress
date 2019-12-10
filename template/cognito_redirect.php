<?php
echo '<script src="https://cdn.polyfill.io/v2/polyfill.js?features=es6"></script>';
$url = plugins_url('../js/amazon-cognito-auth.min.js', __FILE__);
echo '<script src="' . $url . '"></script>';

$css = plugins_url('../css/bootstrap.min.css', __FILE__);
echo '<link rel="stylesheet" href="' . $css . '" type="text/css" media="all">';
$home_url = home_url();

$redirect_url = get_option('ax_cognito_redirect_url', get_site_url(null, 'cognito_redirect', null));
$signout_url = $redirect_url . "/signout";
if (strpos($signout_url, '//signout') !== false) {
    $signout_url = str_replace('//signout', '/signout', $signout_url);
}

$client_id = get_option('ax_cognito_client_id', "");
$user_pool_id = get_option('ax_cognito_user_pool', "");

$domainUrl = get_option('ax_cognito_domain', "");
$ajax = admin_url('admin-ajax.php');

$state_hash = '';
if (array_key_exists('state_hash', $_REQUEST)) {
    $state_hash = $_REQUEST['state_hash'];
}

if (!empty($state_hash)) {
    $stateObj = AX_Cognito_Auth::get_status_from_hash($state_hash);
}

// Add javascript function here to "call" the parent

// Things to consider still - how do we ensure that the email validation etc works as intended? Ie what is the process for signing up....
 ?>

<style>
.overlay{
    display:flex;
    justify-content:center;
    align-items:center;
    height: 100%;
}
.progress{
    display:flex;
    width: 50%;
}
</style>

<script>
    var stateObject = <?php if (!empty($stateObj)) {echo json_encode($stateObj);} else {echo '""';}?>;
    console.log(stateObject);
    var ajaxURL = "<?php echo $ajax ?>"

    function progressOverlay(progress) {
        if (progress + 10 > 100) {
                progress = 0;
            } else {
                progress = progress + 10;
            }
        if(document.getElementById('progress_bar')){
            document.getElementById('progress_bar').style.width = progress + "%";

        }

        setTimeout(function() {
                progressOverlay(progress);
            }, 200);

    }


    function onLoad(){

        function onSignOut(){
            open(location, '_self').close();
        }
        function showSignedIn(session) {

            // if logged in and here for some reason, then redirect
            if (session) {

                var params = {
                    action: 'set_cognito_session',
                    session:session
                };
                if(window._wp_nonce != null){
                    params.security = window._wp_nonce;
                }

                var hashed = location.hash;
                var split = hashed.split('&');

                for (var index = 0; index < split.length; index++) {
                    var element = split[index];
                    if(element.indexOf('state') === 0){

                        var stateToken = element.split('=')[1];
                        if(location.href.indexOf('state_hash')<0){

                            open(location.pathname + '?state_hash='+stateToken, '_self');
                        }
                        else if(stateObject){

                            open(stateObject.url+ '?state='+stateToken, '_self');
                        }

                    }
                }
                if(location.href.indexOf('state_hash')> 0){
                    var stateHash =  "<?php echo $state_hash ?>";
                    if(stateObject){
                        open(stateObject.url+ '?state='+stateHash, '_self');
                    }
                }


                /**
                 * jQuery.ajax({
                    type: "POST",
                    url: ajaxURL,
                    dataType: "JSON",

                    data: params,

                    success: function(result) {
                        if(result.success){
                            //window.close();
                        }

                    }
                });
                */
             /*    var closeB = document.getElementById('close_button');
                var prog = document.getElementById('progress_hold');
                if(opener){
                    if(opener.cognitoLoad){

                        // opener.cognitoLoad(session);
                        localStorage.setItem('cognito', JSON.stringify(session));
                        localStorage.setItem('cognito_ident', JSON.stringify(session.idToken.payload));
                        if(session.accessToken){
                            prog.style.display = "none";
                            progressOverlay = function(){};
                            closeB.style.display = "block";
                            console.log('here2')
                            open(location, '_self').close();
                        }
                    }
                    else{

                        localStorage.setItem('cognito', JSON.stringify(session));
                        localStorage.setItem('cognito_ident', JSON.stringify(session.idToken.payload));
                        if(session.accessToken){
                            prog.style.display = "none";
                            progressOverlay = function(){};
                            closeB.style.display = "block";
                            console.log('here3')
                            open(location, '_self').close();
                        }
                    }


                }
                else{
                    // add function to redirect to another page, after calling an ajax method to set session data.

                    localStorage.setItem('cognito', JSON.stringify(session));
                    localStorage.setItem('cognito_ident', JSON.stringify(session.idToken.payload));
                    if(session.accessToken){
                        prog.style.display = "none";
                        progressOverlay = function(){};
                        closeB.style.display = "block";
                        console.log('here4')
                        open(location, '_self').close();
                    }
                } */


            }
        }
        var authData = {
            ClientId : "<?php echo $client_id ?>", // Your client id here
            AppWebDomain : "<?php echo $domainUrl ?>",
            TokenScopesArray : ['phone', 'email', 'profile','openid', 'aws.cognito.signin.user.admin'], // e.g.,
            RedirectUriSignIn : "<?php echo $redirect_url ?>",
            RedirectUriSignOut : "<?php echo $signout_url ?>",
            //IdentityProvider : '', // e.g. 'Facebook',
            UserPoolId : "<?php echo $user_pool_id ?>", // Your user pool id here
            AdvancedSecurityDataCollectionFlag :false, // e.g. true
        };

        var auth = new AmazonCognitoIdentity.CognitoAuth(authData);

        var theSpecialResumeHash = '<?php echo $state_hash ?>';

        auth.setState(theSpecialResumeHash);

        if(location.search.indexOf('sign_out')> -1){
            // url param to trigger sign out
            if(location.search.indexOf('sign_in')>-1){
                localStorage.signOutIn = 1;
            }
            auth.signOut();

        }
        else if(location.pathname.indexOf('signout') > -1){
            // sign out complete.

            if(localStorage.signOutIn == 1){
                localStorage.signOutIn = 0;

                auth.getSession();
            }
            else{
                onSignOut();
            }

        }
        else{
            auth.userhandler = {


                onSuccess: function(result) {
                    //alert("Sign in success");
                    showSignedIn(result);
                },
                onFailure: function(err) {
                    alert("Error!");
                }
            };

            var curUrl = window.location.href;
            var session = auth.parseCognitoWebResponse(curUrl);
            console.log(session);

            if(!session){
                auth.getSession();
            }
        }



    }
    progressOverlay(0);
    setTimeout(function(){
        onLoad();
    }, 600);



</script>
<div class="overlay">
        <button id="close_button" style="display: none;background: #337ab7;border: none;color: #fff;padding: 8px 16px;font-size: 20px;font-weight: 300;" type="button" onclick="window.open('', '_self', ''); window.close();">Continue</button>
        <div class="progress" id="progress_hold" >
            <div id="progress_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"  aria-valuemin="0" aria-valuemax="100" ></div>
        </div>
</div>

<?php
