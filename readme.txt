=== aXcelerate Integration Plugin ===
Tags: comments, spam
Requires at least: 4.6
Tested up to: 5.0

Integrates Wordpress with the aXcelerate Student Management System

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the aXcelerate Integration Plugin Tab screen to configure the plugin

https://axcelerate.atlassian.net/wiki/spaces/WP/pages/102146626/Wordpress+Plugin+Install+Upgrade+and+Initial+Setup

== Description ==

With versions of the Wordpress Plugin above 2.8 an entirely new system for creating Course Lists, Course Detail Pages, Enrolment forms and Enquiry forms has been introduced. This significantly changes how Website Integrations are done, to offer substantial improvements in customisation and features.

Shortcodes

With version 2.8, a substantial number of new shortcodes have been added to the Plugin, allowing content pulled dynamically from aXcelerate to be added directly into existing pages within Wordpress.
The shortcodes have been fully implemented into Wordpress's page editor, allowing them to be added and configured within the editor, without a need to consult an external reference.

Course List ShortCodes
Top Level Shortcode : ax_course_list
The top level shortcode utilises a premade "template" that will embed lower level shortcodes into the page, allowing a full course list to be built simply by adding just the ax_course_list shortcode to a page. Click here for further information.

Course Details ShortCodes
Top Level Shortcode : ax_course_details
The top level shortcode utilises a premade "template" that will embed lower level shortcodes into the page, allowing a full course details page to be built simply by adding just the ax_course_details shortcode to a page. Click here for further information.

Course Instances ShortCodes
Top Level Shortcode : ax_course_instance_list
The top level shortcode utilises a premade "template" that will embed lower level shortcodes into the page, allowing course instance lists to be built simply by adding just the ax_course_instance_list shortcode to a page. Click here for further information.

Enrolment Widget
With the move to a new framework, a new replacement Enrolment/Enquiry form has been introduced. The legacy enrolment form is still in place, but can easily be replaced by the new, more customisable and feature rich Enrolment Widget.

Existing sites can switch to the enrolment widget, without having to rebuild the course list / details pages, though a setting on the old Enrolment aXpage. 


It is highly recommended however to use the new shortcode framework, as it allows better integration with Wordpress Themes and pages.
To view an upgrade guide for legacy websites, see the upgrade guide.
See the Help Section dedicated to the Enrolment Widget for more information. 

Enquiry Widget
With version 2.8.07+ of the WP Plugin, an Enquiry Widget is available in addition to the enrolment widget. This Enquiry Widget is a single form, built using the Enroller Widget Framework. It cannot be used for enrolments or portfolio uploads.
See the Help Section dedicated to Enquiries for more information.

Course Mapping
Along with the ShortCodes and Enrolment Widget a new feature has been added to allow more control over which pages the Course list will direct to for the Course Details pages. Note this is Only available with the shortcode course list.
What the tool does is allow a Course to be paired with a Wordpress Page. This page will be considered the drilldown page / details page for that course, and be used in the course list over the default page.
This allows dedicated pages to be created for courses, allowing further control over SEO and other factors, and providing friendly URLS.

The Events Calendar Integration
The 2.8 Version of the Wordpress Plugin comes with an optional integration with The Events Calendar (free and paid versions). This integration creates "events" for upcoming Course Instances, allowing them to be utilised within The Events Calendar product family.
See the Help Section dedicated to The Events Calendar for more information.

Enroller Events
Enroller Events are actions taken on completion of an enrolment. Specifically they are a combination of Settings, Shortcodes and Triggers. They can be used in conjunction with other systems, such as Post Enrolment Events to enable complex enrolment processes.
See the Help Section dedicated to Enroller Events for more information.

Enrolment Resumption
Enrolment Resumption is a system by which students who have started, but not yet finished enrolments can resume their enrolment from the point at which they left the Enrolment Widget. It uses email notifications to the student that provide them with a URL which remains valid for two days.
See the Help Section dedicated to Enrolment Resumption for more information.

Post Enrolment System
The Post Enrolment System is designed to allow additional information to be captured after a student has been successfully enrolled into a course.
See the Help Section dedicated to the Post Enrolment System for more information.


== Changelog ==

= 2.9.07 = 

* Improvements to the Ezypay Payment process
* Guarantor form added for under 18s to the Debitsuccess payment process
* Contact Types introduced for Contact-Update, Address and Contact-Note step types, allowing updates to contacts performing different roles in the enrolment process. EG Payers.

= 2.9.06.02 =

* Changed how country and language lists are loaded into the enrolment form. 

= 2.9.06 =

* New Payment Method support with Ezypay
* Updated eWAY payment gateway to use newer API 

= 2.9.04.1 =
* Update to email format check for newer domain names.

= 2.9.04 =
* Minor fixes for the Complex Course Search Tool.

= 2.9.02 =
* A new setting to sync unit enrolment dates with class schedule is now available in the enrolment widget.
* Default Accredited Enrolment configurations have been updated. Address, Study Reason, Language Spoken, Employment Status, Title and Student Declaration fields have been altered.  
* Course Details Enquiry default configuration has been updated.

= 2.9.01 =
* New Contact Address step type that uses the Google Places API to lookup and auto-populate addresses.
* Corrected an issue preventing clearing data added to fields within the Config Builder.
* Improved the behaviour of the review step when using the Shopping Cart feature.
* Increased the maximum number of courses returned in the settings area for Course-> Config Mapping.
* Signature fields will now properly reset when switching between contacts.
* Added new settings for an SSO mechanism to be introduced at a later date.

= 2.8.19 =
* Handle portfolio uploads when resuming enrolments.
* New Feature Testing system, implemented to check if a feature is ready to use. DebitSuccess tests implemented.
* Config builder improvements.

= 2.8.18 =
* A new Enroller Step is available for Enrolment Widgets. USI Verification allows USI's to be verified in form, prior to enrolment.
* A new setting to apply Registration Form Defaults for fields such as National Funding Source is now available for the enrolment widget.
* Config Builder improvements.
* Various minor tweaks to the Enrolment Widget and process.

= 2.8.17 =
* Workshop Additional/Extra Items - display and select additional items with workshops when booking.
* Domain filtering selection in enrolment widget.
* Other enrolments of the contact into the course will now be detected when starting a new enrolment session.

= 2.8.16.4 =
* Fixes for PHP 7.2.
* Class Unit Workshop setting which changes the behaviour of class enrolments with linked workshops. Can be set to no workshop enrolment, default behaviour, or switch to no workshop enrolment only if the course has multiple workshops per unit.

= 2.8.16.2 =
* InHouse Course support for non-client users. New settings allow inhouse courses to be processed by the enrolment widget, allowing enrolment without requiring a Client User role.

= 2.8.16.1 =
* New Enrolment Widget setting to allow users to be generated at the start of the enrolment process.
* Site Wide Login Support / Session tracking. Users can now log in using a shortcode or enrolment widget. They will be tracked on the site for the duration of their active session.
* Complex Course Search tool: a new AJAX driven search tool to support searching for course instances, with inbuilt filters and other functionality.

= 2.8.16 =
* DebitSuccess Support (beta) - Beta support for payment via DebitSuccess.


== Arbitrary section ==
