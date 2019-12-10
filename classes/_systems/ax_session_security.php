<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die();

/* -------------------------------------------- */

/**
 * A class that controls session stuff
 *
 * @author Rob Bisson <rob.bisson@axcelerate.com.au>
 */
class AX_Session_Security
{

    public static function setupPHPSession()
    {
        add_action('init', 'AX_Session_Security::startSession', 1);
    }
    public static function startSession()
    {
        $sessions_enabled = get_option('ax_global_login', 0) == 1;
        if ($sessions_enabled) {
            $session = session_id();
            if (empty($session)) {
                session_start();
            }

            if (!empty($_SESSION['AXTOKEN'])) {
                $current = time();
                if (empty($_SESSION['EXPIRES'])) {
                    session_destroy();
                    error_log(print_r('Session destroyed:no_expiry', true));
                } else {
                    if ($current > $_SESSION['EXPIRES']) {
                        session_destroy();
                        error_log(print_r('Session destroyed:expired', true));
                    } else if (($current + (60 * 15)) > $_SESSION['EXPIRES']) {
                        $AxcelerateAPI = new AxcelerateAPI();
                        $params = array('contactID' => $_SESSION['CONTACTID']);
                        $contact = $AxcelerateAPI->callResourceAX($params, '/contact/' . $_SESSION['CONTACTID'], 'GET', $_SESSION['AXTOKEN']);
                        if (is_object($contact)) {
                            if (!empty($contact->CONTACTID)) {
                                $_SESSION['CONTACT'] = $contact;
                                $_SESSION['CONTACTID'] = $contact->CONTACTID;
                                $_SESSION['EXPIRES'] = time() + (60 * 60);
                                error_log(print_r('Session renewed', true));
                            } else {
                                session_destroy();
                                error_log(print_r('Session destroyed', true));
                            }
                        } else {
                            session_destroy();
                            error_log(print_r('Session ?', true));
                        }


                    }
                }

            }
        }




    }
    /**
     * Create the session, including a unique session token.
     *
     * @param [string|int] $contactID - The ID of the originating contact
     * @param [string]     $IP - IP address
     * 
     * @return [array|null]
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function setupSession($contactID, $IP)
    {
        if (empty($contactID) || empty($IP)) {
            return null;
        }
        $sessionID = "";
        $time = current_time('mysql');
        $sessionID = wp_hash($contactID . "_" . $time);
        $sessionRecord = array(
            'session_id' => $sessionID,
            'primary_contact' => $contactID,
            'allowed_contacts' => array(
                $contactID
            ),
            'ip_address' => $IP
        );

        $sessionStored = self::updateSession($sessionID, $sessionRecord);

        if (!empty($sessionStored)) {
            return $sessionStored;
        }

        return null;
    }

    /**
     * Get the session data from WP DB
     *
     * @param [string] $sessionID - The session token
     * 
     * @return [array] - returns session object
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function retrieveSession($sessionID)
    {
        $sessionRecord = get_transient('ax_enrol_session_' . $sessionID);
        if (is_array($sessionRecord)) {
            return $sessionRecord;
        } else {
            return null;
        }

    }

    /**
     * Update an existing session with new data
     * Will bump the timeout period
     *
     * @param [string] $sessionID - The session token
     * @param [array]  $sessionRecord - new session data
     * 
     * @return [array|null]
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function updateSession($sessionID, $sessionRecord)
    {
        //Need to decide the timeout on this.
        if (empty($sessionRecord) || empty($sessionID)) {
            return null;
        }

        set_transient('ax_enrol_session_' . $sessionID, $sessionRecord, 5 * DAY_IN_SECONDS);
        $response = get_transient('ax_enrol_session_' . $sessionID, $sessionRecord);

        if (is_array($response)) {

            return $response;
        }
        return null;

    }

    /**
     * Check to see if a session is allowed to see contact.
     *
     * @param [string]     $sessionID - The session token
     * @param [int|string] $contactID - The contact ID
     * 
     * @return [boolean]
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function canSeeContact($sessionID, $contactID)
    {

        if (empty($contactID) || empty($sessionID)) {
            return false;
        }
        $sessionRecord = self::retrieveSession($sessionID);

        if (is_array($sessionRecord)) {
            if ($sessionRecord['allowed_contacts']) {
    
                //check if the contact exists in array
                //note without strict this should check string vs number etc
                if (in_array($contactID, $sessionRecord['allowed_contacts'])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Update an existing session to allow it to see a contact
     *
     * @param [string]     $sessionID - The session token
     * @param [int|string] $contactID - The contact to be allowed
     * 
     * @return [boolean|null]
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function addAllowedContact($sessionID, $contactID)
    {
        if (empty($contactID) || empty($sessionID)) {
            return null;
        }
        $sessionRecord = self::retrieveSession($sessionID);
        if (is_array($sessionRecord)) {
            if ($sessionRecord['allowed_contacts']) {
                if (in_array($contactID, $sessionRecord['allowed_contacts'])) {
                    return true;
                } else {
                    array_push($sessionRecord['allowed_contacts'], $contactID);
                }
            } else {
                //This should never be called;
                $sessionRecord['allowed_contacts'] = array($contactID);
            }
            $update = self::updateSession($sessionID, $sessionRecord);

        }
    }

    public static function endpointRequireCheck($endpoint, $method = "GET")
    {

        if (empty($endpoint) || empty($method)) {
            return null;
        }

        $REQUIRED_ENDPOINTS
            = array(
            '/contacts/search' => array(
                'methods' => array(
                    'GET'
                )
            ),
            '/contact/' => array(
                'methods' => array(
                    'GET', 'PUT'
                )
            ),
            '/contacts' => array(
                'methods' => array(
                    'GET'
                )
            ),
        );

        $requiredKeys = array_keys($REQUIRED_ENDPOINTS);

        foreach ($requiredKeys as $key => $requiredEndpoint) {
            
            //Possibly will have to revisit this, not sure about the /contact/ one.

            if (!(strpos($requiredEndpoint, $endpoint) === false)) {

                $method = strtoupper($method);
                $methodsArray = $REQUIRED_ENDPOINTS[$requiredEndpoint]['methods'];

                if (in_array($method, $methodsArray)) {

                    return $requiredEndpoint;
                }
            }

        }
        return false;
    }
    public static function endpointRequireSession($endpoint, $method = "GET", $sessionExists = false)
    {
        if (empty($endpoint) || empty($method)) {
            return null;
        }

        $REQUIRED_ENDPOINTS
            = array(
            '/user/login' => array(
                'methods' => array(
                    'POST'
                )
            ),
            '/contact/' => array(
                'methods' => array(
                    'POST'
                )
            ),
        );
        if ($sessionExists) {
            $REQUIRED_ENDPOINTS['/contacts/search'] = array(
                'methods' => array(
                    'GET'
                )
            );
        }

        $requiredKeys = array_keys($REQUIRED_ENDPOINTS);

        foreach ($requiredKeys as $key => $requiredEndpoint) {
            
            //Possibly will have to revisit this, not sure about the /contact/ one.

            if (!(strpos($requiredEndpoint, $endpoint) === false)) {
                if ($requiredEndpoint == "/contact/") {
                    //check for contact source call etc
                    if (strpos($endpoint, '/contact/s') === false) {
                        $method = strtoupper($method);
                        $methodsArray = $REQUIRED_ENDPOINTS[$requiredEndpoint]['methods'];

                        if (in_array($method, $methodsArray)) {
                            return $requiredEndpoint;
                        }
                    }
                } else {
                    $method = strtoupper($method);
                    $methodsArray = $REQUIRED_ENDPOINTS[$requiredEndpoint]['methods'];

                    if (in_array($method, $methodsArray)) {
                        return $requiredEndpoint;
                    }
                }

            }

        }
        return false;
    }


    public static function addAllowedContacts($sessionID, $contactList)
    {
        if (!is_array($contactList) || empty($sessionID)) {
            return null;
        }
        $sessionRecord = self::retrieveSession($sessionID);
        if (is_array($sessionRecord)) {
            if (key_exists('allowed_contacts', $sessionRecord)) {
                $allowedContacts = $sessionRecord['allowed_contacts'];
                foreach ($contactList as $contact) {

                    if (is_object($contact)) {
                        $contactID = $contact->CONTACTID;
                        if (!empty($contactID)) {
                            if (!in_array($contactID, $allowedContacts)) {
                                array_push($allowedContacts, $contactID);
                            }
                        }

                    } else if (key_exists('CONTACTID', $contact)) {
                        $contactID = $contact['CONTACTID'];

                        if (!in_array($contactID, $allowedContacts)) {
                            array_push($allowedContacts, $contactID);
                        }
                    }
                }
                $sessionRecord['allowed_contacts'] = $allowedContacts;
            } else {
                //This should never be called;
                $sessionRecord['allowed_contacts'] = array($contactID);
            }
            $update = self::updateSession($sessionID, $sessionRecord);
            return true;

        }
    }
}

