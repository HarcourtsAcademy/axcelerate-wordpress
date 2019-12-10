<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */
class AX_Settings_Tab_Feature_Test
{

    const feature_test_key = 'axip_feature_test_settings';

    public function __construct()
    {
    }
    public function register_settings()
    {

        add_settings_section('section_feature_test', __('Feature Test', 'axip'), array(
            &$this,
            'section_feature_test_desc',
        ), self::feature_test_key);
        //register_setting ( self::feature_test_key, 'ax_feature' );

        add_settings_field('ax_test_ds', __('Debitsuccess:', 'axip'), array(
            &$this,
            'render_debitsuccess',
        ), self::feature_test_key, 'section_feature_test');

/*
add_settings_field ( 'ax_test_res', __ ( 'Resumption:', 'axip' ), array (
&$this,
'render_resumption'
), self::feature_test_key, 'section_feature_test' );

add_settings_field ( 'ax_test_ver_c', __ ( 'Verify Configs:', 'axip' ), array (
&$this,
'render_verify_configs'
), self::feature_test_key, 'section_feature_test' );
 */

    }

    public function section_feature_test_desc()
    {
        wp_register_style('ax_auto_gen', plugins_url('/css/ax-auto-gen.css', AXIP_PLUGIN_NAME), array(), AXIP_PLUGIN_VERSION);
        wp_enqueue_style('ax_auto_gen');

        wp_register_script('ax-feature-test', plugins_url('/js/ax_feature_test.js', AXIP_PLUGIN_NAME), array(), AXIP_PLUGIN_VERSION);
        wp_enqueue_script('ax-feature-test');
        wp_localize_script('ax-feature-test', 'ax_feature_test', array(
            'ajaxURL' => admin_url('admin-ajax.php'),
        ));

        echo 'Test features will function as intended.';
    }

    public function test_status_block($test_id, $test_name)
    {
        return
            '<div class="' . $test_id . ' ax-test-block ag-collapsible-outer">
                <span class="ax-test-name">' . $test_name . '</span>
                <div class="ax-test-status-holder">
                <span class="status pending">Pending</span>
                <span class="message"></span>
               
                </div>
            </div>';
    }

    public function render_ds_config_tests()
    {
        $enrollerWidgetSettings = get_option('ax_enroller_widget_settings');
        $mapping_settings = get_option('ax_config_comp_mapping_settings');
        $mapped = json_decode($mapping_settings, true, 10);
        $redirectPostID = get_option('ax_enrol_event_redirect_url');
        $configArray = array();
        $url = "";
        if (isset($redirectPostID)) {
            $url = esc_url(get_permalink($redirectPostID));
        }

        if (!empty($enrollerWidgetSettings)) {
            $data = json_decode($enrollerWidgetSettings, true, 10);

            foreach ($data as $key => $value) {
                $tempArray = array(
                    'ID' => $key,
                    'CONFIG_ID' => $key,
                    'MAP_LINK' => $url,
                    'MAP_PAGE_ID' => $redirectPostID,

                );
                if (!empty($value['config_name'])) {
                    $tempArray['CONFIG_NAME'] = $value['config_name'];
                } else {
                    $tempArray['CONFIG_NAME'] = "Config_ID: " . $key;
                }
                $hasRedirectURL = false;

                if (isset($mapped[$tempArray['CONFIG_ID']])) {
                    $config = $mapped[$tempArray['CONFIG_ID']];
                    if (!empty($config)) {
                        $url = esc_url(get_permalink($config["PAGE_ID"]));
                        $tempArray['MAP_LINK'] = $url;
                        $tempArray['MAP_PAGE_ID'] = $config["PAGE_ID"];
                        $hasRedirectURL = true;
                    }
                }

                array_push($configArray, $tempArray);

                echo self::test_status_block(
                    'ax_ds_config_test_' . $tempArray['CONFIG_ID'],
                    'Config: ' . $tempArray['CONFIG_NAME']
                );

                if ($hasRedirectURL) {
                    echo self::test_status_block(
                        'ax_ds_landing_test_' . $tempArray['CONFIG_ID'],
                        'Config Landing Page: ' . $tempArray['CONFIG_NAME']
                    );
                }

            }
        }

        return $configArray;
    }

    public function render_debitsuccess()
    {
        echo '<h4>aXcelerate Tests:</h4>';
        echo self::test_status_block('ax_ds_flag_test', 'aX Setting Enabled');
        echo self::test_status_block('ax_ds_terms_test', 'aX DS Terms Set');
        echo self::test_status_block('ax_ds_credential_test', 'aX DS Credentials Check');
        echo '<h4>Config Tests:</h4>';
        $configs = self::render_ds_config_tests();
        echo '<h4>Default Redirect Page:</h4>';
        echo self::test_status_block(
            'ax_ds_landing_test_default',
            'Default Landing Page: '
        );
        echo '<h4>Resumption Tests:</h4>';
        echo self::test_status_block('ax_resumption_setting_test', 'Resumption Enabled');
        echo self::test_status_block('ax_resumption_template_test', 'Resumption Template');

        echo '<button class="button button-primary" id="ax_ds_run_test">Run Test</button>';
    }

    public function render_resumption()
    {
        echo '<h4>Resumption Tests:</h4>';
        echo self::test_status_block('ax_resumption_setting_test', 'Resumption Enabled');
        echo self::test_status_block('ax_resumption_template_test', 'Resumption Template');

        echo '<button class="button button-primary" id="ax_resumption_run_test">Run Test</button>';
    }

    public function render_verify_configs()
    {
        echo '<button class="button button-primary" id="ax_verify_config_run_test">Run Test</button>';
    }

}
