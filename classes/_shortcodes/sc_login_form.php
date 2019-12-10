<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */

if (!class_exists('AX_Login_Form')) {

    class AX_Login_Form
    {
        function __construct()
        {
            add_shortcode('ax_login_form', 'AX_Login_Form::sc_login_form');
        }

        public static function sc_login_form($atts = array(), $content = null)
        {
            $default_stylesheet = plugins_url('/css/ax-standard.css', AXIP_PLUGIN_NAME);
            wp_register_script(
                'ax-login-form',
                plugins_url('js/sc_login_form.js', __FILE__),
                array('jquery'),
                AXIP_PLUGIN_VERSION
            );
            wp_enqueue_script('ax-login-form');
            wp_localize_script('ax-login-form', 'login_vars', array(
                'ajaxURL' => admin_url('admin-ajax.php'),
            ));

            wp_register_style('ax-standard', $default_stylesheet, array(), AXIP_PLUGIN_VERSION);
            wp_enqueue_style('ax-standard');

            $loginForm = true;
            $args = shortcode_atts(
                array(
                    'custom_css' => '',
                    'class_to_add' => '',
                    'wrap_tag' => '',
                ),
                $atts
            );
            $sessionID = session_id();


            if (!empty($sessionID) && !empty($_SESSION['AXTOKEN'])) {
                $loginForm = false;
            }

            $nonce = wp_create_nonce('ax_login'); // add to _nonce field
            $nonceLC = wp_create_nonce('ax_login_create');

            $postURL = "";//esc_url( admin_url( 'admin-post.php' ) );
            $html = '<div class="ax-login-form ax-form-standard" ' . ($loginForm ? '' : 'style="display:none"') . '>';
            $html .= self::renderLoginForm($nonce, $postURL);
            $html .= '</div>';

            $html .= '<div class="ax-login-forgot-form ax-form-standard" style="display:none">';
            $html .= self::renderForgotForm($nonce);
            $html .= '</div>';


            $html .= '<div class="ax-login-create-form ax-form-standard" style="display:none">';
            $html .= self::renderCreateForm($nonceLC, $postURL);
            $html .= '</div>';



            $html .= '<div class="ax-logout-form ax-form-standard" ' . (!$loginForm ? '' : 'style="display:none"') . '>';
            $html .= self::renderLogoutForm($nonce);
            $html .= '</div>';
            return $html;



        }
        static function renderLoginForm($nonce, $postURL = "")
        {

            $html = '<form action="' . $postURL . '" method="post" class="ax_login_form">';
            $html .= '<input type="hidden" name="action" value="ax_login">';
            $html .= '<input name="_nonce" type="hidden" value="' . $nonce . '">';
            $html .= '<p><label for="username">Username:</label><input type="text" name="username" required/></p>';
            $html .= '<p><label for="password">Password:</label><input type="password" name="password" required autocomplete="current-password"/></p>';
            $html .= '<div class="input-group right">';
            $html .= '<button type="button" class="btn button btn-outline-secondary ax-forgot" value="forgot">Forgot Password</button>';
            $html .= '<button type="button" class="btn button btn-outline-secondary ax-create" value="create">Create Account</button>';
            $html .= '<button type="submit" class="btn button button-primary" value="Submit Form">Login</button>';
            $html .= '</div></form>';
            return $html;
        }

        static function renderForgotForm($nonce){
            $html = '<form action="" method="post" class="ax_login_forgot_form">';
            $html .= '<input name="_nonce" type="hidden" value="' . $nonce . '">';
            $html .= '<input type="hidden" name="action" value="ax_forgot">';
            $html .= '<p><label for="username">Username:</label><input type="text" name="username" required/></p>';
            $html .= '<p><label for="email_address">Email Address:</label><input type="email" name="email_address" required pattern="^([a-zA-Z0-9]+[a-zA-Z0-9._%\-\+]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$"/></p>';
            $html .= '<div class="input-group right">';
            $html .= '<button type="button" class="btn button btn-outline-secondary ax-login" value="login">User Login</button>';
            $html .= '<button type="submit"  class="btn button button-primary" value="Submit Form">Forgot Password</button>';
            $html.= '</div>';

            $html .='</form>';
            return $html;
        }
        static function renderCreateForm($nonceLC)
        {

            $html = '<form action="" method="post" class="ax_login_create_form">';
            $html .= '<input name="_nonce_lc" type="hidden" value="' . $nonceLC . '">';
            $html .= '<input type="hidden" name="action" value="ax_new_contact_user">';
            $html .= '<p><label for="given_name">Given Name:</label><input type="text" name="given_name" required/></p>';
            $html .= '<p><label for="surname">Surname:</label><input type="text" name="surname" required/></p>';
            $html .= '<p><label for="email_address">Email Address:</label><input type="email" name="email_address" required pattern="^([a-zA-Z0-9]+[a-zA-Z0-9._%\-\+]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$"/></p>';

            $html .= '<p><label for="password">Password:</label><input type="password" name="password" title="6 Characters, must have at least one lowercase, one uppercase and one number." required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$" /></p>';
            $html .= '<p><label for="password_verify">Verify Password:</label><input type="password" name="password_verify" required/></p>';

            $html .= '<div class="input-group right">';
            $html .= '<button type="button" class="btn button btn-outline-secondary ax-login" value="login">User Login</button>';
            $html .= '<button type="submit"  class="btn button button-primary" value="Submit Form">Create Account</button>';
            $html .= '</div></form>';
            return $html;
        }

        static function renderLogoutForm($nonce)
        {
            $html = '<form action="" method="post" class="ax_logout_form">';
            $html .= '<input type="hidden" name="action" value="ax_logout">';
            $html .= '<input name="_nonce" type="hidden" value="' . $nonce . '">';

            $html .= '<button type="submit"   class="btn button button-primary"  value="Submit Form">Logout</button></form>';
            return $html;
        }
    }



    $AX_Login_Form = new AX_Login_Form();

    if (class_exists('WPBakeryShortCode') && class_exists('AX_VC_PARAMS') && class_exists('WPBakeryShortCodesContainer')) {
        vc_map(array(
            "name" => __("aX Login form", "axcelerate"),
            "base" => "ax_login_form",
            "icon" => plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
            "content_element" => true,
            "description" => __("Login Form", "axcelerate"),
            "show_settings_on_create" => true,
            "is_container" => false,
            "as_parent" => array('only' => ''),

            "category" => array(
                'aX Parent Codes',
                'Content'
            ),
            'params' => array()
        ));
        class WPBakeryShortCode_aX_Login_Form extends WPBakeryShortCode
        {
        }
    }
}