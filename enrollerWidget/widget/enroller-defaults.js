/*Defaults: Override these for implementing with other environments*/
ENROLLER_FIELD_DEFAULTS = {
    GIVENNAME: { TYPE: "text", DISPLAY: "Given Name", MAXLENGTH: 40 },
    PREFERREDNAME: { TYPE: "text", DISPLAY: "Preferred Name", MAXLENGTH: 30 },
    MIDDLENAME: { TYPE: "text", DISPLAY: "Middle Name", MAXLENGTH: 40 },
    SURNAME: { TYPE: "text", DISPLAY: "Family Name", MAXLENGTH: 40 },
    EMAILADDRESS: {
        TYPE: "email",
        DISPLAY: "Email",
        REQUIRED: true,
        TOOLTIP: "A contact email address",
        MAXLENGTH: 60
    },
    EMAILADDRESSALTERNATIVE: {
        TYPE: "email",
        DISPLAY: "Alternative email address ",
        REQUIRED: false,
        TOOLTIP: "A contact email address",
        MAXLENGTH: 60
    },
    DOB: { TYPE: "date", DISPLAY: "Date Of Birth" },
    ORGANISATION: { TYPE: "text", DISPLAY: "Organisation", MAXLENGTH: 250 },
    MOBILEPHONE: {
        TYPE: "text",
        DISPLAY: "Mobile",
        MAXLENGTH: 10,
        PATTERN: "[0-9]{10}",
        TITLE: "Mobile numbers must be numeric, 10 characters and contain no spaces."
    },
    PHONE: { TYPE: "text", DISPLAY: "Home Phone", MAXLENGTH: 20 },
    WORKPHONE: { TYPE: "text", DISPLAY: "Work Phone", MAXLENGTH: 20 },
    FAX: { TYPE: "text", DISPLAY: "Fax", MAXLENGTH: 20 },
    VSN: {
        TYPE: "text",
        DISPLAY: "Victorian Student Number",
        MAXLENGTH: 9,
        TOOLTIP:
            "A unique identifier given to students in Victoria. See <a target='_blank' href='http://www.vcaa.vic.edu.au/'>www.vcaa.vic.edu.au</a> for more information."
    },
    TITLE: { 
      TYPE: "select", 
      DISPLAY: "Title", 
      MAXLENGTH: 10,
      VALUES: [
        { DISPLAY: "Mr", VALUE: "Mr" },
        { DISPLAY: "Mrs", VALUE: "Mrs" },
        { DISPLAY: "Ms", VALUE: "Ms" },
        { DISPLAY: "Miss", VALUE: "Miss" },
        { DISPLAY: "Other", VALUE: "Other" }
      ]
    },
    POSITION: {
        TYPE: "text",
        DISPLAY: "Position",
        TOOLTIP: "The Job Title / Position held by the student",
        MAXLENGTH: 60
    },
    CATEGORYIDS: { TYPE: "multi-select", DISPLAY: "Categories" },

    COUNTRYID: {
        TYPE: "search-select",
        DISPLAY: "Postal - Country",
        VALUES: [{ DISPLAY: "notset", VALUE: "" }],
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SCOUNTRYID"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        }
    },
    CITY: {
        TYPE: "text",
        DISPLAY: "Postal - Suburb, Locality or Town",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SCITY"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 50
    },
    STATE: {
        TYPE: "select",
        DISPLAY: "Postal - State/Territory",
        VALUES: [
            { DISPLAY: "NSW", VALUE: "NSW" },
            { DISPLAY: "VIC", VALUE: "VIC" },
            { DISPLAY: "QLD", VALUE: "QLD" },
            { DISPLAY: "SA", VALUE: "SA" },
            { DISPLAY: "WA", VALUE: "WA" },
            { DISPLAY: "TAS", VALUE: "TAS" },
            { DISPLAY: "NT", VALUE: "NT" },
            { DISPLAY: "ACT", VALUE: "ACT" },
            { DISPLAY: "Other Australian Territory", VALUE: "OTH" },
            { DISPLAY: "Overseas", VALUE: "OVS" }
        ],
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SSTATE"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        }
    },
    POSTCODE: {
        TYPE: "text",
        DISPLAY: "Postal - Postcode",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SPOSTCODE"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 10
    },
    POBOX: {
        TYPE: "text",
        DISPLAY: "Postal - Postal delivery information (PO box)",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SPOBOX"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 22
    },
    BUILDINGNAME: {
        TYPE: "text",
        DISPLAY: "Postal - Building/Property Name",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SBUILDINGNAME"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 50
    },
    STREETNO: {
        TYPE: "text",
        DISPLAY: "Postal - Street or Lot Number",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SSTREETNO"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 15
    },
    UNITNO: {
        TYPE: "text",
        DISPLAY: "Postal - Flat/Unit Details",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SUNITNO"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 30
    },
    STREETNAME: {
        TYPE: "text",
        DISPLAY: "Postal - Street Name",
        EVENTS: {
            postal_copy: {
                LISTENER: "postal_copy",
                EVENT_ACTION: "clone",
                TARGET_FIELD: "SSTREETNAME"
            },
            postal_toggle: {
                LISTENER: "postal_toggle",
                EVENT_ACTION: "toggle",
                TARGET_FIELD: "COUNTRYID"
            }
        },
        MAXLENGTH: 70
    },

    addressStreetSame: {
        TRIGGER_EVENTS: {
            postal_copy_click: {
                TRIGGER_ON: "change",
                EVENT: "postal_copy"
            },
            postal_toggle_click: {
                TRIGGER_ON: "change",
                EVENT: "postal_toggle"
            }
        },
        ID: "addressStreetSame",
        DISPLAY: "Postal",
        TYPE: "flip-switch",
        INFO_ONLY: true,
        CUSTOM: true,
        REQUIRED: false,
        FS_OFFTEXT: "Same as Street Address?",
        FS_ONTEXT: "Matches Street Address"
    },

    SUNITNO: {
        TYPE: "text",
        DISPLAY: "Street Address - Flat/Unit Details",
        MAXLENGTH: 30
    },
    SCOUNTRYID: {
        TYPE: "search-select",
        DISPLAY: "Street Address - Country",
        VALUES: [{ DISPLAY: "notset", VALUE: "" }]
    },
    SCITY: { TYPE: "text", DISPLAY: "Street Address - Suburb, Locality or Town", MAXLENGTH: 50 },
    SSTATE: {
        TYPE: "select",
        DISPLAY: "Street Address - State/Territory",
        VALUES: [
            { DISPLAY: "NSW", VALUE: "NSW" },
            { DISPLAY: "VIC", VALUE: "VIC" },
            { DISPLAY: "QLD", VALUE: "QLD" },
            { DISPLAY: "SA", VALUE: "SA" },
            { DISPLAY: "WA", VALUE: "WA" },
            { DISPLAY: "TAS", VALUE: "TAS" },
            { DISPLAY: "NT", VALUE: "NT" },
            { DISPLAY: "ACT", VALUE: "ACT" },
            { DISPLAY: "Other Australian Territory", VALUE: "OTH" },
            { DISPLAY: "Overseas", VALUE: "OVS" }
        ]
    },
    SPOSTCODE: { TYPE: "text", DISPLAY: "Street Address - Postcode", MAXLENGTH: 10 },
    SPOBOX: { TYPE: "text", DISPLAY: "Street Address - Postal delivery information (PO box)", MAXLENGTH: 22 },
    SBUILDINGNAME: { TYPE: "text", DISPLAY: "Street Address - Building/Property Name", MAXLENGTH: 50 },
    SSTREETNO: { TYPE: "text", DISPLAY: "Street Address - Street or Lot Number", MAXLENGTH: 15 },
    SSTREETNAME: { TYPE: "text", DISPLAY: "Street Address - Street Name", MAXLENGTH: 70 },

    USI: {
        TYPE: "text",
        DISPLAY: "Unique Student Identifier",
        PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
        MAXLENGTH: 10,
        TITLE: "10 Characters no 1, 0, O or I",
        TOOLTIP:
            "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
    },

    SURVEYCONTACTSTATUSCODE: {
        TYPE: "select",
        DISPLAY: "Survey Contact Status",
        VALUES: [
            { DISPLAY: "A - Available for survey use", VALUE: "A" },
            { DISPLAY: "C - Correctional facility (address or enrolment)", VALUE: "C" },
            { DISPLAY: "D - Deceased student", VALUE: "D" },
            { DISPLAY: "E - Excluded from survey use", VALUE: "E" },
            { DISPLAY: "I - Invalid address / Itinerant student (very low likelihood of response)", VALUE: "I" },
            { DISPLAY: "M - Minor – under age of 15 (not to be surveyed)", VALUE: "M" },
            { DISPLAY: "O - Overseas (address or enrolment)", VALUE: "O" }
        ],
        TOOLTIP:
            "Does the student fall under the following exclusion categories, with regards to the government Student Outcomes Survey."
    },

    HIGHESTSCHOOLLEVELID: {
        TYPE: "select",
        DISPLAY: "Highest School Level",
        TOOLTIP:
            "If you are currently enrolled in secondary education, the Highest school level completed refers to the highest school level you have actually completed and not the level you are currently undertaking. For example, if you are currently in Year 10 the Highest school level completed is Year 9.",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "Not Specified"
            },
            {
                VALUE: "2",
                DISPLAY: "Did not attend school"
            },
            {
                VALUE: "8",
                DISPLAY: "Year 8 or Below"
            },
            {
                VALUE: "9",
                DISPLAY: "Year 9"
            },
            {
                VALUE: "10",
                DISPLAY: "Year 10"
            },
            {
                VALUE: "11",
                DISPLAY: "Year 11"
            },
            {
                VALUE: "12",
                DISPLAY: "Year 12"
            }
        ]
    },
    CURRENTSCHOOLLEVEL: {
        TYPE: "select",
        DISPLAY: "Current School Level",
        VALUES: [
            { VALUE: "", DISPLAY: "Not In School" },
            { VALUE: 7, DISPLAY: "Year 7" },
            { VALUE: 8, DISPLAY: "Year 8" },
            { VALUE: 9, DISPLAY: "Year 9" },
            { VALUE: 10, DISPLAY: "Year 10" },
            { VALUE: 11, DISPLAY: "Year 11" },
            { VALUE: 12, DISPLAY: "Year 12" }
        ]
    },
    HIGHESTSCHOOLLEVELYEAR: {
        TYPE: "text",
        DISPLAY: "Year Highest School Completed",
        PATTERN: "[0-9]{4}",
        MAXLENGTH: 4,
        TITLE: "YYYY",
        TOOLTIP: "The calendar year that the highest level of schooling was completed."
    },
    EMERGENCYCONTACT: { TYPE: "text", DISPLAY: "Emergency Contact Name", MAXLENGTH: 50 },
    EMERGENCYCONTACTRELATION: {
        TYPE: "text",
        DISPLAY: "Emergency Contact Relationship",
        MAXLENGTH: 50
    },
    EMERGENCYCONTACTPHONE: { TYPE: "text", DISPLAY: "Emergency Contact Number", MAXLENGTH: 50 },
    PRIOREDUCATIONSTATUS: {
        TYPE: "select",
        DISPLAY: "Prior Education Status",
        VALUES: [{ DISPLAY: "No", VALUE: false }, { DISPLAY: "Yes", VALUE: true }],
        TOOLTIP: "Have you SUCCESSFULLY completed any higher level qualifications"
    },
    PRIOREDUCATIONIDS: {
        TYPE: "modifier-checkbox",
        DISPLAY: "Prior Education",
        TOOLTIP:
            "If you have previously completed any training, please select any relevant prior education achieved. If you have an International Qualification, and are unsure of the Australian Equivalent use the International Option.",
        MODIFIERS: [
            {
                VALUE: "A",
                DISPLAY: "Australian Qualification"
            },
            {
                VALUE: "E",
                DISPLAY: "Australian Equivalent"
            },
            {
                VALUE: "I",
                DISPLAY: "International"
            }
        ],
        VALUES: [
            {
                VALUE: "008",
                DISPLAY: "Bachelor Degree or Higher Degree level"
            },
            {
                VALUE: "410",
                DISPLAY: "Advanced Diploma or Associate Degree Level"
            },
            {
                VALUE: "420",
                DISPLAY: "Diploma Level"
            },
            {
                VALUE: "511",
                DISPLAY: "Certificate IV"
            },
            {
                VALUE: "514",
                DISPLAY: "Certificate III"
            },
            {
                VALUE: "521",
                DISPLAY: "Certificate II"
            },
            {
                VALUE: "524",
                DISPLAY: "Certificate I"
            },
            {
                VALUE: "990",
                DISPLAY: "Other education (including certificates or overseas qualifications not listed above)"
            }
        ]
    },
    DISABILITYFLAG: {
        TYPE: "select",
        DISPLAY: "Disability Status",
        VALUES: [{ DISPLAY: "No", VALUE: false }, { DISPLAY: "Yes", VALUE: true }],
        TOOLTIP: "Do you consider yourself to have a disability, impairment or long-term condition?"
    },
    DISABILITYTYPEIDS: {
        TYPE: "checkbox",
        DISPLAY: "Disabilities",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "None"
            },
            {
                VALUE: "11",
                DISPLAY: "Hearing / Deafness"
            },
            {
                VALUE: "12",
                DISPLAY: "Physical"
            },
            {
                VALUE: "13",
                DISPLAY: "Intellectual"
            },
            {
                VALUE: "14",
                DISPLAY: "Learning"
            },
            {
                VALUE: "15",
                DISPLAY: "Mental illiness"
            },
            {
                VALUE: "16",
                DISPLAY: "Acquired Brain Impairment"
            },
            {
                VALUE: "17",
                DISPLAY: "Vision"
            },
            {
                VALUE: "18",
                DISPLAY: "Medical condition"
            },
            {
                VALUE: "19",
                DISPLAY: "Other"
            }
        ],
        TOOLTIP:
            "If you indicated the presence of a disability, impairment or long-term condition, please select the area(s) in the following list.<p><em>Disability in this context does not include short-term disabling health conditions such as a fractured leg, influenza, or corrected physical conditions such as impaired vision managed by wearing glasses or lenses.</em></p>"
    },

    DISABILITY_INFO: {
        DISPLAY: "Disability Information",
        TYPE: "info_expandable",
        TOOLTIP:
            "<p>Disability in this context does not include short-term disabling health conditions such as a fractured leg, influenza, or corrected physical conditions such as impaired vision managed by wearing glasses or lenses.</p>" +
            "<p><strong>Hearing/deaf<strong></p>" +
            "<p>Hearing impairment is used to refer to a person who has an acquired mild, moderate, severe or profound hearing loss after learning to speak, communicates orally and maximises residual hearing with the assistance of amplification. A person who is deaf has a severe or profound hearing loss from, at, or near birth and mainly relies upon vision to communicate, whether through lip reading, gestures, cued speech, finger spelling and/or sign language.</p>" +
            "<p><strong>Physical<strong></p>" +
            "<p>A physical disability affects the mobility or dexterity of a person and may include a total or partial loss of a part of the body. A physical disability may have existed since birth or may be the result of an accident, illness, or injury suffered later in life; for example, amputation, arthritis, cerebral palsy, multiple sclerosis, muscular dystrophy, paraplegia, quadriplegia or post-polio syndrome.</p>" +
            "<p><strong>Intellectual<strong></p>" +
            "<p>In general, the term <em>intellectual disability</em> is used to refer to low general intellectual functioning and difficulties in adaptive behaviour, both of which conditions were manifested before the person reached the age of 18. It may result from infection before or after birth, trauma during birth, or illness.</p>" +
            "<p><strong>Learning<strong></p>" +
            "<p>A general term that refers to a heterogeneous group of disorders manifested by significant difficulties in the acquisition and use of listening, speaking, reading, writing, reasoning, or mathematical abilities. These disorders are intrinsic to the individual, presumed to be due to central nervous system dysfunction, and may occur across the life span. Problems in self-regulatory behaviours, social perception, and social interaction may exist with learning disabilities but do not by themselves constitute a learning disability.</p>" +
            "<p><strong>Mental illness<strong></p>" +
            "<p>Mental illness refers to a cluster of psychological and physiological symptoms that cause a person suffering or distress and which represent a departure from a persons usual pattern and level of functioning.</p>" +
            "<p><strong>Acquired brain impairment<strong></p>" +
            "<p>Acquired brain impairment is injury to the brain that results in deterioration in cognitive, physical, emotional or independent functioning. Acquired brain impairment can occur as a result of trauma, hypoxia, infection, tumour, accidents, violence, substance abuse, degenerative neurological diseases or stroke. These impairments may be either temporary or permanent and cause partial or total disability or psychosocial maladjustment.</p>" +
            "<p><strong>Vision<strong></p>" +
            "<p>This covers a partial loss of sight causing difficulties in seeing, up to and including blindness. This may be present from birth or acquired as a result of disease, illness or injury.</p>" +
            "<p><strong>Medical condition<strong></p>" +
            "<p>Medical condition is a temporary or permanent condition that may be hereditary, genetically acquired or of unknown origin. The condition may not be obvious or readily identifiable, yet may be mildly or severely debilitating and result in fluctuating levels of wellness and sickness, and/or periods of hospitalisation; for example, HIV/AIDS, cancer, chronic fatigue syndrome, Crohns disease, cystic fibrosis, asthma or diabetes.</p>" +
            "<p><strong>Other<strong></p>" +
            "<p>A disability, impairment or long-term condition which is not suitably described by one or several disability types in combination. Autism spectrum disorders are reported under this category.</p>",

        CUSTOM: true,
        REQUIRED: false,
        INFO_ONLY: true
    },
    LABOURFORCEID: {
        TYPE: "select",
        DISPLAY: "Employment Status",
        TOOLTIP:
            "For casual, seasonal, contract and shift work, use the current number of hours worked per week to determine whether full time (35 hours or more per week) or part-time employed (less than 35 hours per week).",
        VALUES: [
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Full-time employee",
                OPTGROUP: "",
                VALUE: 1
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Part-time employee",
                OPTGROUP: "",
                VALUE: 2
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Self-employed - not employing others",
                OPTGROUP: "",
                VALUE: 3
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Self-employed - employing others",
                OPTGROUP: "",
                VALUE: 4
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Employed - unpaid worker in a family business",
                OPTGROUP: "",
                VALUE: 5
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Unemployed - Seeking full-time work",
                OPTGROUP: "",
                VALUE: 6
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Unemployed - Seeking part-time work",
                OPTGROUP: "",
                VALUE: 7
            },
            {
                REQUIRESVALUE2: false,
                DISPLAY: "Unemployed - Not Seeking employment",
                OPTGROUP: "",
                VALUE: 8
            }
        ]
    },
    SEX: {
        TYPE: "select",
        DISPLAY: "Gender",
        VALUES: [{ VALUE: "M", DISPLAY: "Male" }, { VALUE: "F", DISPLAY: "Female" }, { VALUE: "X", DISPLAY: "Other" }]
    },
    COUNTRYOFBIRTHID: { TYPE: "search-select", DISPLAY: "Country Of Birth" },
    CITYOFBIRTH: { TYPE: "text", DISPLAY: "City Of Birth", MAXLENGTH: 50 },
    ENGLISHPROFICIENCYID: {
        TYPE: "select",
        DISPLAY: "English Proficiency",
        TOOLTIP: "How well you speak English.",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "Not Specified"
            },
            {
                VALUE: 1,
                DISPLAY: "Very Well"
            },
            {
                VALUE: 2,
                DISPLAY: "Well"
            },
            {
                VALUE: 3,
                DISPLAY: "Not Well"
            },
            {
                VALUE: 4,
                DISPLAY: "Not at all"
            }
        ]
    },
    ENGLISHASSISTANCEFLAG: {
        TYPE: "select",
        DISPLAY: "English Assistance",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "Not Specified"
            },
            {
                VALUE: true,
                DISPLAY: "Required"
            },
            {
                VALUE: false,
                DISPLAY: "Not Required"
            }
        ],
        TOOLTIP: "Please specify the level of english language assistance you require"
    },
    ATSCHOOLFLAG: {
        TYPE: "select",
        DISPLAY: "Currently At School",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "Not Specified"
            },
            {
                VALUE: true,
                DISPLAY: "Yes"
            },
            {
                VALUE: false,
                DISPLAY: "No"
            }
        ]
    },
    ATSCHOOLNAME: { TYPE: "text", DISPLAY: "School Name", MAXLENGTH: 250 },
    INDIGENOUSSTATUSID: {
        TYPE: "select",
        DISPLAY: "Indigenous Status",
        VALUES: [
            {
                VALUE: "",
                DISPLAY: "Not Specified"
            },
            {
                VALUE: 4,
                DISPLAY: "No"
            },
            {
                VALUE: 1,
                DISPLAY: "Aboriginal"
            },
            {
                VALUE: 2,
                DISPLAY: "Torres Strait Islander"
            },
            {
                VALUE: 3,
                DISPLAY: "Aboriginal & Torres Strait Islander"
            }
        ]
    },
    MAINLANGUAGEID: {
        TYPE: "search-select",
        DISPLAY: "Primary Language",
        TOOLTIP: "The main language other than English spoken at home"
    },
    COUNTRYOFCITIZENID: { TYPE: "search-select", DISPLAY: "Country Of Citizenship" },
    CITIZENSTATUSID: {
        TYPE: "search-select",
        DISPLAY: "Citizenship Status",
        VALUES: [
            { DISPLAY: "Australian Citizen", VALUE: 1 },
            { DISPLAY: "New Zealand Citizen", VALUE: 2 },
            { DISPLAY: "New Zealand Citizen (SCV - HELP loan eligible)", VALUE: 12 },
            { DISPLAY: "Australian Permanent Resident", VALUE: 3 },
            { DISPLAY: "Student Visa", VALUE: 4 },
            { DISPLAY: "Temporary Resident Visa", VALUE: 5 },
            { DISPLAY: "Visitor's Visa", VALUE: 6 },
            { DISPLAY: "Business Visa", VALUE: 7 },
            { DISPLAY: "Holiday Visa", VALUE: 8 },
            { DISPLAY: "Other Visa", VALUE: 9 },
            { DISPLAY: "Permanent Humanitarian Visa", VALUE: 10 },
            { DISPLAY: "Overseas - No Visa or Citizenship", VALUE: 11 }
        ]
    },

    INTERNATIONALCONTACTID: {
        TYPE: "search-select-add",
        DISPLAY: "International Contact",
        ADD_TYPE: "contact"
    },

    IELTS: {
        TYPE: "select",
        DISPLAY: "IELTS",
        VALUES: [
            { VALUE: "1", DISPLAY: "1.0 " },
            { VALUE: "1.5", DISPLAY: "1.5 " },
            { VALUE: "2", DISPLAY: "2.0 " },
            { VALUE: "2.5", DISPLAY: "2.5 " },
            { VALUE: "3", DISPLAY: "3.0 " },
            { VALUE: "3.5", DISPLAY: "3.5 " },
            { VALUE: "4", DISPLAY: "4.0 " },
            { VALUE: "4.5", DISPLAY: "4.5 " },
            { VALUE: "5", DISPLAY: "5.0 " },
            { VALUE: "5.5", DISPLAY: "5.5 " },
            { VALUE: "6", DISPLAY: "6.0 " },
            { VALUE: "6.5", DISPLAY: "6.5 " },
            { VALUE: "7", DISPLAY: "7.0 " },
            { VALUE: "7.5", DISPLAY: "7.5 " },
            { VALUE: "8", DISPLAY: "8.0 " },
            { VALUE: "8.5", DISPLAY: "8.5 " },
            { VALUE: "9", DISPLAY: "9.0 " }
        ]
    },

    ANZSCOCODE: {
        TYPE: "select",
        DISPLAY: "Occupation Identifier",
        TOOLTIP: "The type of occupation that may be expected for those undertaking a program of study",
        VALUES: [
            { VALUE: 100000, DISPLAY: "Managers" },
            { VALUE: 200000, DISPLAY: "Professionals" },
            { VALUE: 300000, DISPLAY: "Technicians and Trades Workers" },
            { VALUE: 400000, DISPLAY: "Community and Personal Service Workers" },
            { VALUE: 500000, DISPLAY: "Clerical and Administrative Workers" },
            { VALUE: 600000, DISPLAY: "Sales Workers" },
            { VALUE: 700000, DISPLAY: "Machinery Operators and Drivers" },
            { VALUE: 800000, DISPLAY: "Labourers" },
            { VALUE: 900000, DISPLAY: "Other" }
        ]
    },
    ANZSICCODE: {
        TYPE: "select",
        DISPLAY: "Industry Of Employment",
        TOOLTIP: "Select a value that best represents the industry the student is employed in.",
        VALUES: [
            { VALUE: "", DISPLAY: "Not Specified" },
            { VALUE: "A", DISPLAY: "Agriculture, Forestry and Fishing" },
            { VALUE: "B", DISPLAY: "Mining" },
            { VALUE: "C", DISPLAY: "Manufacturing" },
            { VALUE: "D", DISPLAY: "Electricity, Gas, Water and Waste Services" },
            { VALUE: "E", DISPLAY: "Construction" },
            { VALUE: "F", DISPLAY: "Wholesale Trade" },
            { VALUE: "G", DISPLAY: "Retail Trade" },
            { VALUE: "H", DISPLAY: "Accommodation and Food Services" },
            { VALUE: "I", DISPLAY: "Transport, Postal and Warehousing" },
            { VALUE: "J", DISPLAY: "Information Media and Telecommunications" },
            { VALUE: "K", DISPLAY: "Financial and Insurance Services" },
            { VALUE: "L", DISPLAY: "Rental, Hiring and Real Estate Services" },
            { VALUE: "M", DISPLAY: "Professional, Scientific and Technical Services" },
            { VALUE: "N", DISPLAY: "Administrative and Support Services" },
            { VALUE: "O", DISPLAY: "Public Administration and Safety" },
            { VALUE: "P", DISPLAY: "Education and Training" },
            { VALUE: "Q", DISPLAY: "Health Care and Social Assistance" },
            { VALUE: "R", DISPLAY: "Arts and Recreation Services" },
            { VALUE: "S", DISPLAY: "Other Services" }
        ]
    },
    STUDYREASONID: {
        TYPE: "select",
        DISPLAY: "Study Reason National",
        TOOLTIP:
            "Of the following categories, select the one which BEST describes the main reason you are undertaking this course/traineeship/apprenticeship",
        VALUES: [
            { VALUE: 1, DISPLAY: "To get a job" },
            { VALUE: 2, DISPLAY: "To develop my existing business" },
            { VALUE: 3, DISPLAY: "To start my own business" },
            { VALUE: 4, DISPLAY: "To try for a different career" },
            { VALUE: 5, DISPLAY: "To get a better job or promotion" },
            { VALUE: 6, DISPLAY: "It was a requirement of my job" },
            { VALUE: 7, DISPLAY: "I wanted extra skills for my job" },
            { VALUE: 8, DISPLAY: "To get into another course of study" },
            { VALUE: 11, DISPLAY: "Other reasons" },
            { VALUE: 12, DISPLAY: "For personal interest or self-development" },
            { VALUE: 13, DISPLAY: "To get skills for community/voluntary work" }
        ]
    },
    STUDYREASONID_WA: {
        TYPE: "select",
        DISPLAY: "Study Reason WA (example - do not use)",
        TOOLTIP:
            "Of the following categories, select the one which BEST describes the main reason you are undertaking this course/traineeship/apprenticeship",
        VALUES: [
            { VALUE: 1, DISPLAY: "To get a job" },
            { VALUE: 3, DISPLAY: "To get a promotion/improve my career" },
            { VALUE: 4, DISPLAY: "To start a different career" },
            { VALUE: 6, DISPLAY: "To get into another course at TAFE or University" },
            { VALUE: 8, DISPLAY: "Other reasons" },
            { VALUE: 22, DISPLAY: "To develop my own business" },
            { VALUE: 23, DISPLAY: "To start my own business" },
            { VALUE: 26, DISPLAY: "It was a requirement for my job" },
            { VALUE: 27, DISPLAY: "I wanted extra skills for my job" },
            { VALUE: 29, DISPLAY: "For personal interest" },
            { VALUE: 30, DISPLAY: "For self development" }
        ]
    },
    FUNDINGNATIONAL: {
        TYPE: "select",
        DISPLAY: "National Funding Source",
        VALUES: [
            { VALUE: 11, DISPLAY: "Commonwealth and state general purpose recurrent" },
            { VALUE: 13, DISPLAY: "Commonwealth specific purpose programs" },
            { VALUE: 15, DISPLAY: "State specific purpose programs" },
            { VALUE: 20, DISPLAY: "Domestic full fee-paying client" },
            { VALUE: 30, DISPLAY: "International full fee-paying client" },
            { VALUE: 80, DISPLAY: "Revenue earned from another training organisation" }
        ]
    },
    FUNDINGSTATE: {
        TYPE: "search-select",
        DISPLAY: "Funding Source State",
        VALUES: [
            { VALUE: "01A", DISPLAY: "2012 ATTP funding with Course/Site (01A)" },
            { VALUE: "CSD", DISPLAY: "ACE CSO Program - Disadvantaged Students (CSD)" },
            { VALUE: "CSR", DISPLAY: "ACE CSO Program - Regional or Remote Students (CSR)" },
            { VALUE: "SSP", DISPLAY: "Strategic Skills Program (SSP)" },
            {
                VALUE: "ACE",
                DISPLAY: "ACFE-funded non-accredited local courses (ACE providers only) (ACE)"
            },
            {
                VALUE: "AEL",
                DISPLAY: "Automotive Supply Chain Training Initiative (Apprentice/Trainee) (AEL)"
            },
            {
                VALUE: "AEP",
                DISPLAY: "Automotive Supply Chain Training Initiative (General, non-Apprentice/Trainee) (AEP)"
            },
            { VALUE: "BWL", DISPLAY: "Back to Work Scheme (Apprentice/Trainee) (BWL)" },
            { VALUE: "BWP", DISPLAY: "Back to Work Scheme (Non-Apprentice/Trainee) (BWP)" },
            { VALUE: "DLQ", DISPLAY: "Priority Health - Apprentice/Trainee (DLQ)" },
            { VALUE: "DQ", DISPLAY: "Priority Health - General (DQ)" },
            { VALUE: "L", DISPLAY: "Apprentice/Trainee (L)" },
            { VALUE: "LCP", DISPLAY: "Apprentice/Trainee contestable pool (LCP)" },
            { VALUE: "LQ", DISPLAY: "Additional one-off funding - Apprentice/Trainee (LQ)" },
            { VALUE: "LSG", DISPLAY: "Skills for Growth - Apprentice/Trainee (LSG)" },
            {
                VALUE: "NGP",
                DISPLAY: "Single/Teenage Parents Training Initiative Guaranteed Access Not Apprentice/Trainee (NGP)"
            },
            { VALUE: "P", DISPLAY: "General (not Apprentice/Trainee) (previously Profile) (P)" },
            { VALUE: "PSG", DISPLAY: "Skills for Growth - General (PSG)" },
            { VALUE: "Q", DISPLAY: "Additional one-off funding - General (Q)" },
            {
                VALUE: "QIL",
                DISPLAY: "Institute of Land and Food Resources - Apprentice/Trainee (QIL)"
            },
            { VALUE: "QIP", DISPLAY: "Institute of Land and Food Resources - General (QIP)" },
            { VALUE: "SCL", DISPLAY: "Retrenched Employees – Apprentice/Trainee (SCL)" },
            {
                VALUE: "SCP",
                DISPLAY: "Retrenched Employees – General (Non-Apprentice/Trainee) (SCP)"
            },
            { VALUE: "T", DISPLAY: "Tender (Priority Education and Training Program) (T)" },
            { VALUE: "WTL", DISPLAY: "Workers in Transition Program - Apprentice/Trainee (WTL)" },
            {
                VALUE: "WTP",
                DISPLAY: "Workers In Transition Program - General (not Apprentice/Trainee) (WTP)"
            },
            { VALUE: "YCL", DISPLAY: "Youth Compact - Apprentice/Trainee (TAFE only) (YCL)" },
            {
                VALUE: "YCP",
                DISPLAY: "Youth Compact - General (not Apprentice/Trainee) (TAFE only) (YCP)"
            },
            {
                VALUE: "YRL",
                DISPLAY: "Youth Compact - Apprentice/Trainee (non-TAFE RTOs only) (YRL)"
            },
            {
                VALUE: "YRP",
                DISPLAY: "Youth Compact - General (not Apprentice/Trainee) (non-TAFE RTOs only) (YRP)"
            },
            { VALUE: "Z10", DISPLAY: "Innovation fund (selected TAFE institutes only) (Z10)" },
            { VALUE: "Z35", DISPLAY: "Skills Store RPL assessment - Government funded (Z35)" },
            { VALUE: "Z75", DISPLAY: "NSW registered apprentices (Z75)" },
            {
                VALUE: "ZC",
                DISPLAY: "Corrections delivery contracted directly with TAFE institutes (ZC)"
            },
            { VALUE: "D", DISPLAY: "Training activity funded directly by DEEWR (D)" },
            {
                VALUE: "VCE",
                DISPLAY: "VCE programs (Distance Education Centre Victoria only) (VCE)"
            },
            { VALUE: "Z55", DISPLAY: "Youth employment scheme (Apprentice/Trainee) (Z55)" },
            { VALUE: "Z99", DISPLAY: "Youth Pathways Program (ACE providers only) (Z99)" },
            { VALUE: "ZP", DISPLAY: "Corrections funding through private prisons (ZP)" },
            { VALUE: "S", DISPLAY: "Fee for service (S)" },
            { VALUE: "SSG", DISPLAY: "Skills for Growth - Fee for service (SSG)" },
            { VALUE: "Z20", DISPLAY: "VET in schools (Z20)" },
            { VALUE: "Z30", DISPLAY: "ACE - Schools Partnership Program (Z30)" },
            { VALUE: "Z36", DISPLAY: "Skills Store RPL assessment - Fee for service (Z36)" },
            { VALUE: "Z70", DISPLAY: "Interstate apprentices (Z70)" },
            { VALUE: "F", DISPLAY: "Overseas full fee-paying students (F)" },
            {
                VALUE: "SI",
                DISPLAY: "Subcontracting, auspicing and partnerships with 2009 ATTP funding (SI)"
            },
            { VALUE: "11", DISPLAY: "Commonwealth and State General purpose Recurrent (11)" },
            { VALUE: "13", DISPLAY: "Commonwealth Specific Purpose programs (13)" },
            { VALUE: "15", DISPLAY: "State Specific Purpose programs (15)" },
            { VALUE: "1GT", DISPLAY: "Gap Training (1GT)" },
            { VALUE: "1SA", DISPLAY: "Skills Assessments (1SA)" },
            { VALUE: "20", DISPLAY: "Domestic full fee-paying student (20)" },
            { VALUE: "2GT", DISPLAY: "Gap Training (2GT)" },
            { VALUE: "2SA", DISPLAY: "Skills Assessments (2SA)" },
            { VALUE: "30", DISPLAY: "International full fee-paying student (30)" },
            { VALUE: "9GT", DISPLAY: "Gap Training (9GT)" },
            { VALUE: "9SA", DISPLAY: "Skills Assessments (9SA)" },
            { VALUE: "BMI", DISPLAY: "Mining Industry (BMI)" },
            { VALUE: "CCP", DISPLAY: "Civil Construction Brokerage Pilot (CCP)" },
            { VALUE: "CHL", DISPLAY: "Civil Construction Higher Level Skills (CHL)" },
            { VALUE: "CLG", DISPLAY: "Cert III Guarantee - Community Learning (CLG)" },
            { VALUE: "CLI", DISPLAY: "Community Learning Intervention (CLI)" },
            { VALUE: "CLP", DISPLAY: "Community Literacy Program (CLP)" },
            {
                VALUE: "CSG",
                DISPLAY: "Civil Construction Skills Assessment and Gap Training (CSG)"
            },
            { VALUE: "CSP", DISPLAY: "Community Services Skilling Plan (CSP)" },
            { VALUE: "CSQ", DISPLAY: "Construction Skills Queensland (CSQ)" },
            { VALUE: "ENH", DISPLAY: "Higher Level Skills program - Mainstream student (ENH)" },
            { VALUE: "ENT", DISPLAY: "Cert III Guarantee - Mainstream students (ENT)" },
            {
                VALUE: "ETR",
                DISPLAY: "ETRF Accredited Training & Employment Youth Initiatives (ETR)"
            },
            { VALUE: "F2", DISPLAY: "Strategic Purchasing Program (F2)" },
            { VALUE: "F3", DISPLAY: "User Choice competitively funded - Apprenticeships (F3)" },
            { VALUE: "GK", DISPLAY: "User Choice competitively funded - Trainees (GK)" },
            { VALUE: "GS1", DISPLAY: "Cert III Guarantee - Year 12 graduates (GS1)" },
            { VALUE: "GS2", DISPLAY: "Cert III Guarantee - User Choice Full Fee (GS2)" },
            { VALUE: "GS3", DISPLAY: "Cert III Guarantee - User Choice Partial Exemption (GS3)" },
            { VALUE: "GS4", DISPLAY: "Cert III Guarantee - User Choice Full Exemption (GS4)" },
            {
                VALUE: "HLT",
                DISPLAY: "Higher Level Skills program - Student accessing VET FEE-HELP loan (HLT)"
            },
            { VALUE: "HS1", DISPLAY: "Higher Skills Program 1 (HS1)" },
            { VALUE: "IFF", DISPLAY: "Strategic Investment Fund Fees (IFF)" },
            { VALUE: "IFN", DISPLAY: "Strategic Investment Fund No (IFN)" },
            { VALUE: "IFP", DISPLAY: "Indigenous Funding Program (IFP)" },
            { VALUE: "IP3", DISPLAY: "Cert III Guarantee - Industry Partnerships Strategy (IP3)" },
            {
                VALUE: "IPH",
                DISPLAY: "Higher Level Skills program - Industry Partnerships Strategy (IPH)"
            },
            { VALUE: "IT3", DISPLAY: "Cert III Guarantee - Indigenous Training Strategy (IT3)" },
            {
                VALUE: "ITH",
                DISPLAY: "Higher Level Skills program - Indigenous Training Strategy (ITH)"
            },
            { VALUE: "LLN", DISPLAY: "Language Literacy and Numeracy (LLN)" },
            { VALUE: "NWC", DISPLAY: "National Workforce Critical Skills (NWC)" },
            { VALUE: "NWE", DISPLAY: "National Workforce Existing Worker (NWE)" },
            { VALUE: "NWJ", DISPLAY: "National Workforce Jobseeker (NWJ)" },
            { VALUE: "PBJ", DISPLAY: "Productivity Brokerage Job Seeker (PBJ)" },
            { VALUE: "PBW", DISPLAY: "Productivity Brokerage Existing Worker (PBW)" },
            {
                VALUE: "PEW",
                DISPLAY: "Productivity Places Program - Existing Workers (Enterprise) (PEW)"
            },
            { VALUE: "PPP", DISPLAY: "Productivity Places Program (PPP)" },
            { VALUE: "PRJ", DISPLAY: "PPP (Job Seekers) (PRJ)" },
            { VALUE: "PRW", DISPLAY: "PPP (Existing Workers) (PRW)" },
            { VALUE: "PSJ", DISPLAY: "PPP Skilling Queenslanders for Work (Job Seekers) (PSJ)" },
            { VALUE: "PT1", DISPLAY: "Post-Trade Training Program (PT1)" },
            { VALUE: "RWF", DISPLAY: "Regional Workforce Development Initiative (RWF)" },
            { VALUE: "RWN", DISPLAY: "Regional Workforce Development Initiative (RWN)" },
            { VALUE: "SAT", DISPLAY: "User Choice competitively funded - School-based (SAT)" },
            { VALUE: "SC1", DISPLAY: "Short Courses Program 1 (SC1)" },
            {
                VALUE: "SJ3",
                DISPLAY:
                    "training delivered under the Single and Teenage Parent Program (STPP) - Fees paid by Government (SJ3)"
            },
            { VALUE: "SQW", DISPLAY: "Skilling Queenslanders for Work (SQW)" },
            { VALUE: "SSQ", DISPLAY: "Skilling Solutions Queensland (SSQ)" },
            {
                VALUE: "ST3",
                DISPLAY: "training delivered under the Single and Teenage Parent Program (STPP) (ST3)"
            },
            {
                VALUE: "ST5",
                DISPLAY: "training delivered under the Single and Teenage Parent Program (STPP) (ST5)"
            },
            { VALUE: "TFW", DISPLAY: "Training For Work (TFW)" },
            {
                VALUE: "TIF",
                DISPLAY: "Training Initiative for Indigenous Adults Regional/Remote (TIFIARRC) (TIF)"
            },
            { VALUE: "TRA", DISPLAY: "Training Skills Assessment and Gap Training (TRA)" },
            { VALUE: "TSC", DISPLAY: "Trade Start - Civil Construction Program (TSC)" },
            { VALUE: "TSG", DISPLAY: "Trade Start General (TSG)" },
            { VALUE: "VSS", DISPLAY: "VET in Schools (secondary school students) (VSS)" },
            { VALUE: "IT5", DISPLAY: "Indigenous VET Partnerships (IT5)" },
            { VALUE: "SQI", DISPLAY: "Training funded under Skilling QLD for Work (SQI)" },
            { VALUE: "SQT", DISPLAY: "Training funded under Certificate 3 Guarentee (SQT)" },
            { VALUE: "T02", DISPLAY: "TAFE User Choice (T02)" },
            { VALUE: "SPP", DISPLAY: "Schools Private Provider (SPP)" },
            { VALUE: "AEP", DISPLAY: "Aboriginal Employment Program (AEP)" },
            { VALUE: "AHC", DISPLAY: "Aboriginal Health Council (AHC)" },
            { VALUE: "AKP", DISPLAY: "Apprentice Kickstart Pre-apprenticeship Project (AKP)" },
            { VALUE: "DEO", DISPLAY: "DEEWR Funded Programs (Other) (DEO)" },
            { VALUE: "DEV", DISPLAY: "DEEWR Funded Programs (Vouchers) (DEV)" },
            { VALUE: "DPE", DISPLAY: "Productivity Places Program General Existing Worker (DPE)" },
            { VALUE: "FFI", DISPLAY: "International full fee paying student (FFS) (FFI)" },
            {
                VALUE: "FFO",
                DISPLAY: "Revenue from another registered training organisation (FFO)"
            },
            { VALUE: "FFS", DISPLAY: "Domestic Full Fee Paying Student (FFS) (FFS)" },
            {
                VALUE: "JRV",
                DISPLAY: "Regional Development Australia/Career Development Centre - Full Qualifications (JRV)"
            },
            { VALUE: "LCA", DISPLAY: "Learning Communities (LCA)" },
            { VALUE: "LMA", DISPLAY: "Labour Market Adjustment Initiatives (LMA)" },
            { VALUE: "NOA", DISPLAY: "Northern Futures (NOA)" },
            { VALUE: "PAT", DISPLAY: "Pre-Apprenticeship Training (PAT)" },
            {
                VALUE: "RIV",
                DISPLAY:
                    "Regional Development Australia/Career Development Centre - Skill Sets and Non-accredited (RIV)"
            },
            { VALUE: "S4A", DISPLAY: "Skills for all (S4A)" },
            { VALUE: "TGS", DISPLAY: "Training Guarantee for Secondary Students (TGSS) (TGS)" },
            { VALUE: "USC", DISPLAY: "User Choice (USC)" },
            { VALUE: "VIS", DISPLAY: "VET in Schools auspiced students (VIS)" },
            { VALUE: "WEA", DISPLAY: "Western Futures (WEA)" },
            { VALUE: "YOP", DISPLAY: "Yorke Regional Development Board Inc (YOP)" },
            { VALUE: "EYP", DISPLAY: "Eyre Regional Development Fund (EYP)" },
            { VALUE: "ICN", DISPLAY: "ICAN Student (ICN)" },
            { VALUE: "JEN", DISPLAY: "Job First Employment Non Accredited Training (JEN)" },
            { VALUE: "JEQ", DISPLAY: "Job First Employment Projects (JEQ)" },
            { VALUE: "JFS", DISPLAY: "Jobs First STL Sep 2015 (JFS)" },
            { VALUE: "RBR", DISPLAY: "RDA – Barossa (RBR)" },
            {
                VALUE: "RMR",
                DISPLAY: "Regional Development Australia – Murraylands & Riverland (RMR)"
            },
            { VALUE: "RYM", DISPLAY: "RDA – Yorke and Mid North (RYM)" },
            { VALUE: "SBA", DISPLAY: "Australian School based Apprentice (SBA)" },
            { VALUE: "WRG", DISPLAY: "WorkReady STL (WRG)" },
            { VALUE: "ABA", DISPLAY: "Abilities For All (ABA)" },
            { VALUE: "ACW", DISPLAY: "Aged Care Workforce Vocational Education Training (ACW)" },
            { VALUE: "AIC", DISPLAY: "Aboriginal Industry Clusters (AIC)" },
            { VALUE: "AtB", DISPLAY: "Apprentice to Business Owner Program (AtB)" },
            { VALUE: "ATR", DISPLAY: "Automotive Transformation Taskforce RPL (ATR)" },
            { VALUE: "AWD", DISPLAY: "ACE Workforce Development (AWD)" },
            { VALUE: "BFA", DISPLAY: "Accredited Building Family Opportunities (BFA)" },
            { VALUE: "BFN", DISPLAY: "Non-Accredited Building Family Opportunities (BFN)" },
            { VALUE: "BOC", DISPLAY: "Building Our Community (BOC)" },
            { VALUE: "CRB", DISPLAY: "Constructing Roads to a Bright Future (CRB)" },
            { VALUE: "EBP", DISPLAY: "Enterprise Based Industry Skills PPP (EBP)" },
            {
                VALUE: "FQP",
                DISPLAY: "Skills for Jobs in Regions - Full Qualification Project (FQP)"
            },
            { VALUE: "FSA", DISPLAY: "Foundation Skills Accredited (FSA)" },
            { VALUE: "FSN", DISPLAY: "Foundation Skills Non-Accredited (FSN)" },
            { VALUE: "IHW", DISPLAY: "Indigenous Health Workforce (IHW)" },
            { VALUE: "NEI", DISPLAY: "NEIS Program (Commonwealth Dept Educ) (NEI)" },
            { VALUE: "PED", DISPLAY: "Prisoner Education (PED)" },
            { VALUE: "PPP", DISPLAY: "Tauondi (PPP)" },
            { VALUE: "RFK", DISPLAY: "Regions Adelaide Hills, Fleurieu and Kangaroo Island (RFK)" },
            { VALUE: "RFN", DISPLAY: "Regions Far North (RFN)" },
            { VALUE: "RLC", DISPLAY: "Regions Limestone Coast (RLC)" },
            { VALUE: "RNE", DISPLAY: "Regions North East (RNE)" },
            { VALUE: "RNF", DISPLAY: "Regions Northern Futures (RNF)" },
            { VALUE: "RWE", DISPLAY: "Regions RDA Whyalla and Eyre Peninsula (RWE)" },
            { VALUE: "RWF", DISPLAY: "Regions RDA Western Futures (RWF)" },
            { VALUE: "RWT", DISPLAY: "Retrenched Worker Training (RWT)" },
            { VALUE: "SJF", DISPLAY: "Strategic Employment Fund (SJF)" },
            { VALUE: "SWQ", DISPLAY: "Skills in the Workplace - Qualifications (SWQ)" },
            { VALUE: "SWS", DISPLAY: "Skills in the Workplace - Skills Sets (SWS)" },
            { VALUE: "AAA", DISPLAY: "Australian Apprenticeships Access (AAA)" },
            { VALUE: "CAV", DISPLAY: "Commonwealth Funded - VAT AMC (CAV)" },
            { VALUE: "DAH", DISPLAY: "Dual Award - HE AMC (DAH)" },
            { VALUE: "DAV", DISPLAY: "Dual Award - VET AMC (DAV)" },
            { VALUE: "IAS", DISPLAY: "Indigenous Advancement Strategy (Cwth) (IAS)" },
            { VALUE: "ISF", DISPLAY: "Industry Skills Funding (Cwth) (ISF)" },
            {
                VALUE: "NPA",
                DISPLAY: "National Partnership Agreement on Skills Reform (Cwth) (NPA)"
            },
            { VALUE: "OCF", DISPLAY: "Other Commonwealth Funding (OCF)" },
            { VALUE: "SEE", DISPLAY: "Skills for Education and Employment (Cwth) (SEE)" },
            { VALUE: "SRS", DISPLAY: "Skills Recognition Services (SRS)" },
            { VALUE: "TSL", DISPLAY: "Trade Support Loans (Cwth) (TSL)" },
            { VALUE: "WDE", DISPLAY: "National Workforce Development - Existing Workers (WDE)" },
            { VALUE: "WDJ", DISPLAY: "National Workforce Development - Job Seekers (WDJ)" },
            { VALUE: "WEL", DISPLAY: "Workplace English Language and Literacy (WEL)" },
            { VALUE: "DEF", DISPLAY: "DECS Enterprise Funded (DEF)" },
            { VALUE: "FLO", DISPLAY: "FFS - ICANFLO students (FLO)" },
            { VALUE: "32", DISPLAY: "The Skills Fund - Job Seekers - Full Qualification (32)" },
            { VALUE: "207", DISPLAY: "Skills Fund Special Release – NBN Skill Sets (207)" },
            { VALUE: "29", DISPLAY: "Seasonal Industry - Skill Sets (29)" },
            { VALUE: "30", DISPLAY: "The Skills Fund – Existing Workers - Skill Sets (30)" },
            {
                VALUE: "31",
                DISPLAY: "The Skills Fund - Existing Workers - Full Qualification (31)"
            },
            { VALUE: "33", DISPLAY: "The Skills fund – Mind the Gap – Skill Sets (33)" },
            { VALUE: "37", DISPLAY: "Career Start (37)" },
            { VALUE: "51", DISPLAY: "Seasonal Industry - Skill-sets (51)" },
            { VALUE: "55", DISPLAY: "Productivity Placement Program - Job Seekers (55)" },
            { VALUE: "60", DISPLAY: "User Choice Funding (60)" },
            {
                VALUE: "80",
                DISPLAY: "Fee for Service Funding (incl. Commonwealth existing employees funding) (80)"
            },
            {
                VALUE: "85",
                DISPLAY:
                    "DEEWR Directly Funded Programs e.g. New Apprenticeship Access Programs, Retrenched workers programs. (85)"
            },
            { VALUE: "11B", DISPLAY: "Flexible Response Funding (FRF) (11B)" },
            { VALUE: "11D", DISPLAY: "Government Initiatives (11D)" },
            { VALUE: "11E", DISPLAY: "Equity Program (11E)" },
            { VALUE: "11F", DISPLAY: "Community Initiatives (11F)" },
            { VALUE: "11J", DISPLAY: "Recurrent (11J)" },
            { VALUE: "11K", DISPLAY: "User Choice (11K)" },
            { VALUE: "11L", DISPLAY: "Building Better Schools (Projects) (11L)" },
            { VALUE: "11M", DISPLAY: "Community Response Program (11M)" },
            { VALUE: "11N", DISPLAY: "VET in Schools for Urban Students (11N)" },
            { VALUE: "11P", DISPLAY: "Building Better Schools (VETiS) (11P)" },
            { VALUE: "11Q", DISPLAY: "Workready Program (11Q)" },
            { VALUE: "11S", DISPLAY: "Training for remote youth (11S)" },
            { VALUE: "11U", DISPLAY: "Australians Working Together (11U)" },
            { VALUE: "11V", DISPLAY: "VET in Schools for Remote Students (11V)" },
            { VALUE: "11W", DISPLAY: "Pre-Employment (11W)" },
            { VALUE: "11Y", DISPLAY: "Projects (11Y)" },
            { VALUE: "11Z", DISPLAY: "Other recurrent funding (11Z)" },
            { VALUE: "ETP", DISPLAY: "ETP (ETP)" },
            { VALUE: "11C", DISPLAY: "Productivity Places Program ? Existing Workers (11C)" },
            { VALUE: "13A", DISPLAY: "Joint Indigenous Funding Pool (13A)" },
            { VALUE: "13C", DISPLAY: "Productivity Places Program ? Job Seekers (13C)" },
            {
                VALUE: "13E",
                DISPLAY: "Indigenous Education Strategic Initiatives Program (IESIP) (13E)"
            },
            { VALUE: "13Z", DISPLAY: "Other specific funding (13Z)" },
            { VALUE: "LMT", DISPLAY: "LMT (LMT)" },
            { VALUE: "20A", DISPLAY: "Australian fee for service enrolments (20A)" },
            {
                VALUE: "20K",
                DISPLAY: "Australian Fee for service Apprenticeships / Traineeships (20K)"
            },
            { VALUE: "30A", DISPLAY: "Overseas full fee paying enrolments (30A)" },
            { VALUE: "80A", DISPLAY: "Revenue earned from another RTO (80A)" },
            { VALUE: "AAP", DISPLAY: "Australian Apprenticeships (AAP)" },
            { VALUE: "SRI", DISPLAY: "Better Linkages (SRI)" },
            { VALUE: "FFS", DISPLAY: "Fee For Service (FFS)" },
            { VALUE: "TSS", DISPLAY: "Tech Savvy Seniors (TSS)" },
            { VALUE: "190", DISPLAY: "Targeted Priorities & Part Qualifications (190)" },
            { VALUE: "192", DISPLAY: "Targeted Priorities & Part Qualifications (192)" }
        ]
    },
    SOURCECODEID: {
        DISPLAY: "Contact Source",
        VALUES: [],
        TYPE: "search-select"
    }
};

ENROLLER_PAYMENT_METHODS = {
    DISPLAY: "Payment Method",
    VALUES: [
        {
            VALUE: "invoice",
            DISPLAY: "Invoice"
        },
        {
            VALUE: "payment",
            DISPLAY: "Credit Card Payment"
        },
        {
            VALUE: "tentative",
            DISPLAY: "Tentative"
        }
    ],
    TYPE: "select"
};

ENROLLER_FUNCTION_DEFAULTS = {
    courseSearch: function(params, callback) {
        var axToken = null;
        var resource = "callResource";
        params.displayLength = 100;
        if (params.AXTOKEN != null) {
            resource = "callResourceAX";
            axToken = params.AXTOKEN;
        }

        var domainFilter = params.domain_filter;
        if (domainFilter != null && domainFilter !== "") {
            try {
                domainFilter = domainFilter.split(",");
            } catch (error) {
                console.log(error);
                console.log("DOMAIN FILTER ERROR");
            }
        }

        var showNoDomain = params.show_no_domain != null ? params.show_no_domain : null;

        if (params.show_no_domain != null) {
            delete params.show_no_domain;
        }

        if (params.domain_filter != null) {
            delete params.domain_filter;
        }

        var domainFilterExclude = params.domain_filter_exclude != null ? params.domain_filter_exclude : null;
        if (params.domain_filter_exclude != null) {
            delete params.domain_filter_exclude;
        }

        var onlyPublic = false;
        if (params.PUBLIC == 1 || params.PUBLIC == true) {
            onlyPublic = true;
        }

        function checkSpacesAndCourse(instance, courseList) {
            var instanceHasSpace = instance.TYPE == "w" && instance.PARTICIPANTVACANCY >= 1;
            var courseFound = false;

            if (instance.DOMAINID === 0 || instance.DOMAINID == null) {
                if (showNoDomain === false) {
                    return false;
                }
            }

            if (
                instance.GROUPEDCOURSEID != null &&
                (instance.GROUPEDCOURSEISSIMULTANEOUS == 1 || instance.GROUPEDCOURSEISSIMULTANEOUS === true)
            ) {
                var groupMax = instance.GROUPEDMAXPARTICIPANTS;
                var current = instance.GROUPEDPARTICIPANTS;
                if (current < groupMax && instanceHasSpace) {
                    instanceHasSpace = true;

                    // Adjust the vacancy value to reflect what is remaining as per the group size.
                    if (instance.PARTICIPANTVACANCY > groupMax - current) {
                        instance.PARTICIPANTVACANCY = groupMax - current;
                    }
                } else {
                    instanceHasSpace = false;
                }
            }

            if (instanceHasSpace && courseList != null) {
                jQuery.each(courseList, function(i, course) {
                    if (course.VALUE == instance.ID) {
                        courseFound = true;
                    }
                });
            } else if (courseList == null && instanceHasSpace && instance.TYPE == "w") {
                courseFound = true;
            } else if (instance.TYPE == "p") {
                courseFound = true;
            } else if (instance.TYPE == "el") {
                courseFound = true;
            }

            if (courseFound && domainFilter != null && domainFilter.length > 0) {
                if (instance.DOMAINID != null && instance.DOMAINID !== 0) {
                    if (Array.isArray(domainFilter)) {
                        if (domainFilter.indexOf(instance.DOMAINID + "") > -1) {
                            if (domainFilterExclude === true) {
                                courseFound = false;
                            }
                        } else {
                            if (domainFilterExclude === false) {
                                courseFound = false;
                            }
                        }
                    }
                }
            }

            return courseFound;
        }
        //params.action = "axip_course_instance_search";
        if (resource == "callResource") {
            callResource("callResource", "/course/instance/search", "POST", params, function(result) {
                /*Remove any EnrolmentOpen = 0 records*/
                var instanceList = [];
                var instanceIdList = {};
                if ((params.type == "all" || params.type == "w" || params.type == null) && onlyPublic) {
                    ENROLLER_FIELD_HELPERS.getCourses({ type: "w", displayLength: 200 }, function(courseList) {
                        if (result[0] !== undefined) {
                            jQuery.each(result, function(i, instance) {
                                if (instanceIdList[instance.INSTANCEID] != null) {
                                } else {
                                    if (instance.ENROLMENTOPEN == 1) {
                                        instanceIdList[instance.INSTANCEID] = true;
                                    }
                                    var addToList = checkSpacesAndCourse(instance, courseList);

                                    if (addToList) {
                                        instanceList.push(instance);
                                    }
                                }
                            });
                        }

                        if (callback != null) {
                            callback(instanceList);
                        }
                    });
                } else {
                    if (result[0] !== undefined) {
                        jQuery.each(result, function(i, instance) {
                            if (instanceIdList[instance.INSTANCEID] != null) {
                            } else {
                                if (instance.ENROLMENTOPEN == 1) {
                                    instanceIdList[instance.INSTANCEID] = true;
                                    var addToList = checkSpacesAndCourse(instance, null);
                                    if (addToList) {
                                        instanceList.push(instance);
                                    }
                                }
                            }
                        });
                    }

                    if (callback != null) {
                        callback(instanceList);
                    }
                }
            });
        } else {
            callResourceAX(
                "callResourceAX",
                "/course/instance/search",
                "POST",
                params,
                function(result) {
                    /*Remove any EnrolmentOpen = 0 records*/
                    var instanceList = [];
                    var instanceIdList = {};
                    if ((params.type == "all" || params.type == "w" || params.type == null) && onlyPublic) {
                        ENROLLER_FIELD_HELPERS.getCourses({ type: "w", displayLength: 200 }, function(courseList) {
                            if (result[0] !== undefined) {
                                jQuery.each(result, function(i, instance) {
                                    if (instanceIdList[instance.INSTANCEID] != null) {
                                    } else {
                                        if (instance.ENROLMENTOPEN == 1) {
                                            if (instance.ENROLMENTOPEN == 1) {
                                                instanceIdList[instance.INSTANCEID] = true;
                                            }
                                            var addToList = checkSpacesAndCourse(instance, courseList);

                                            if (addToList) {
                                                instanceList.push(instance);
                                            }
                                        }
                                    }
                                });
                            }

                            if (callback != null) {
                                callback(instanceList);
                            }
                        });
                    } else {
                        if (result[0] !== undefined) {
                            jQuery.each(result, function(i, instance) {
                                if (instanceIdList[instance.INSTANCEID] != null) {
                                } else {
                                    if (instance.ENROLMENTOPEN == 1) {
                                        instanceIdList[instance.INSTANCEID] = true;
                                        var addToList = checkSpacesAndCourse(instance, null);
                                        if (addToList) {
                                            instanceList.push(instance);
                                        }
                                    }
                                }
                            });
                        }

                        if (callback != null) {
                            callback(instanceList);
                        }
                    }
                },
                axToken
            );
        }
    },
    courseEnrol: function(method, enrolmentParams, paymentParams, callback) {
        var success = true;

        if (method == "payment") {
            callResource("callResource", "/payment", "POST", paymentParams, function(result) {
                /*check to see if the payment went through (invoiceID will be null if it failed)*/
                if (result.INVOICEID != undefined) {
                    enrolmentParams.INVOICEID = result.INVOICEID;
                    callResource("callResource", "/course/enrol", "POST", enrolmentParams, function(enrolmentResult) {
                        if (enrolmentResult.CONTACTID != undefined && enrolmentResult.LEARNERID != undefined) {
                            callback(success, enrolmentResult);
                        } else {
                            success = false;
                            callback(success, enrolmentResult);
                        }
                    });
                } else {
                    success = false;
                    callback(success, result);
                }
            });
        } else {
            callResource("callResource", "/course/enrol", "POST", enrolmentParams, function(enrolmentResult) {
                if (enrolmentResult.CONTACTID != undefined && enrolmentResult.LEARNERID != undefined) {
                    callback(success, enrolmentResult);
                } else {
                    success = false;
                    callback(success, enrolmentResult);
                }
            });
        }
    },
    courseDetail: function(course, callback) {
        var params = {
            ID: course.ID,
            TYPE: course.TYPE
        };
        callResource("callResource", "/course/detail", "GET", params, function(data) {
            if (data != undefined) {
                callback(data);
            }
        });
    },
    getDiscounts: function(params, callback) {
        callResource("callResource", "/discounts", "GET", params, function(discounts) {
            callback(discounts);
        });
    },
    calculateDiscounts: function(params, callback) {
        callResource("callResource", "/course/discounts", "GET", params, function(discounts) {
            callback(discounts);
        });
    },
    updateContact: function(contactID, params, callback) {
        callResource("callResource", "/contact/" + contactID, "PUT", params, function(response) {
            if (callback != null) {
                callback(response);
            }
        });
    },
    addContact: function(params, callback) {
        var axToken = null;

        var resource = "callResource";
        if (params.AXTOKEN != null) {
            resource = "callResourceAX";
            axToken = params.AXTOKEN;
        }
        if (resource == "callResource") {
            callResource("callResource", "/contact/", "POST", params, function(data) {
                if (callback != null) {
                    if (data.existing_contact != null) {
                        callback(data);
                    } else {
                        callback(data.CONTACTID);
                    }
                }
            });
        } else {
            callResourceAX(
                "callResourceAX",
                "/contact/",
                "POST",
                params,
                function(data) {
                    if (callback != null) {
                        if (data.existing_contact != null) {
                            callback(data);
                        } else {
                            callback(data.CONTACTID);
                        }
                    }
                },
                axToken
            );
        }
    },
    userLogin: function(params, callback) {
        callResource("callResource", "/user/login", "POST", params, function(data) {
            if (data != undefined) {
                callback(data);
            }
        });
    },
    updatePortfolio: function(params, callback) {
        var method = "POST";
        if (params.portfolioID != undefined) {
            method = "PUT";
        }
        callResource("callResource", "/contact/portfolio/", method, params, function(response) {
            callback(response);
        });
    },
    uploadPortfolioFile: function(formData, callback, progressUpdate, token) {
        callResourceFile(
            "/contact/portfolio/file",
            "POST",
            formData,
            function(response) {
                callback(response);
            },
            function(e) {
                if (e.lengthComputable) {
                    progressUpdate(e.loaded, e.total);
                }
            },
            token
        );
    },
    getPortfolioFile: function(params, callback) {
        callResource("callResource", "/contact/portfolio/file", "GET", params, function(response) {
            callback(response);
        });
    },
    getPortfolio: function(params, callback) {
        callResource("callResource", "/contact/portfolio/", "GET", params, function(data) {
            callback(data);
        });
    },
    getPortfolioChecklist: function(params, callback) {
        callResource("callResource", "/portfolio/checklist/", "GET", params, function(data) {
            callback(data);
        });
    },
    createUser: function(params, callback) {
        callResource("callResource", "/user/", "post", params, function(data) {
            if (data != undefined) {
                callback(data);
            }
        });
    },
    resetPassword: function(params, callback) {
        callResource("callResource", "/user/forgotPassword", "POST", params, function(data) {
            callback(data);
        });
    },
    contactSearch: function(params, callback, axToken) {
        var resource = "callResource";
        if (params.AXTOKEN != null) {
            resource = "callResourceAX";
            axToken = params.AXTOKEN;
        }
        if (axToken != null && axToken != "") {
            resource = "callResourceAX";
        }
        params.displayLength = 20;

        if (resource == "callResource") {
            callResource("callResource", "/contacts/search", "GET", params, function(data) {
                if (data[0] != null) {
                    jQuery.each(data, function(i, record) {
                        if (record.GIVENNAME == null) {
                            record.GIVENNAME = "";
                        }
                        if (record.SURNAME == null) {
                            record.SURNAME = "";
                        }
                        if (record.ORGANISATION == null) {
                            record.ORGANISATION = "";
                        }
                    });
                }
                callback(data);
            });
        } else {
            callResourceAX(
                "callResourceAX",
                "/contacts/search",
                "GET",
                params,
                function(data) {
                    if (data[0] != null) {
                        jQuery.each(data, function(i, record) {
                            if (record.GIVENNAME == null) {
                                record.GIVENNAME = "";
                            }
                            if (record.SURNAME == null) {
                                record.SURNAME = "";
                            }
                            if (record.ORGANISATION == null) {
                                record.ORGANISATION = "";
                            }
                        });
                    }
                    callback(data);
                },
                axToken
            );
        }
    },
    courseEnquire: function(params, callback, axToken) {
        var resource = "callResource";
        if (axToken != null) {
            resource = "callResourceAX";
        } else {
            axToken = null;
        }
        callResource(
            resource,
            "/course/enquire",
            "POST",
            params,
            function(data) {
                callback(data);
            },
            axToken
        );
    },
    contactNote: function(params, callback, axToken) {
        var resource = "callResource";
        if (axToken != null) {
            resource = "callResourceAX";
        } else {
            axToken = null;
        }
        callResource(
            resource,
            "/contact/note",
            "POST",
            params,
            function(data) {
                callback(data);
            },
            axToken
        );
    },
    courseEnrolments: function(params, callback) {
        params.returnError = true;
        if (params.type == "el") {
            callResource("callResource", "/contact/enrolments/" + params.contactID, "GET", params, function(response) {
                callback(response);
            });
        } else {
            callResource("callResource", "/course/enrolments", "GET", params, function(response) {
                callback(response);
            });
        }
    },

    contactEnrolments: function(params, callback) {
        params.returnError = true;
        params.displayLength = 100;
        callResource("callResource", "/contact/enrolments/" + params.contactID, "GET", params, function(response) {
            callback(response);
        });
    },
    getAgentData: function(params, callback) {
        callResource("callResource", "/agent/", "GET", params, function(data) {
            callback(data);
        });
    },
    getClientOrganisation: function(orgID, callback) {
        callResource("callResource", "/organisation/" + orgID, "GET", {}, function(data) {
            callback(data);
        });
    },
    paymentInvoice: function(paymentParams, callback) {
        var success = true;
        paymentParams.returnError = true;
        callResource("callResource", "/payment", "POST", paymentParams, function(paymentResult) {
            /*check to see if the payment went through (invoiceID will be null if it failed)*/
            if (paymentResult.INVOICEID != undefined) {
                callback(success, paymentResult);
            } else {
                success = false;
                callback(success, paymentResult);
            }
        });
    },

    ePaymentRules: function(params, callback) {
        callResource("callResource", "/accounting/external/debit_success/term/search", "GET", params, function(rules) {
            callback(rules);
        });
    },

    ePaymentRulesEzyPay: function(params, callback) {
        callResource("callResource", "/accounting/ecommerce/ezypay/plan/searchActive", "GET", params, function(rules) {
            callback(rules);
        });
    },
    ePaymentFeesEzypay: function(params, callback) {
        callResource("callResource", "/accounting/ecommerce/ezypay/fees", "GET", {}, function(fees) {
            callback(fees);
        });
    },

    ePaymentStatus: function(params, callback) {
        ePaymentCheckStatus(params, callback);
    },
    ePaymentNextStep: function(params, callback) {
        ePaymentNext(params, callback);
    },
    getInvoiceDetails: function(invoiceID, callback) {
        callResource("callResource", "/accounting/invoice/" + invoiceID, "GET", {}, function(invoiceDat) {
            if (invoiceDat != null) {
                callback(invoiceDat);
            }
        });
    },
    ePaymentInitiate: function(params, callback) {
        ENROLLER_FUNCTION_DEFAULTS.getInvoiceDetails(params.invoiceID, function(invoiceDat) {
            if (invoiceDat != null) {
                params.invoiceGUID = invoiceDat.INVGUID;
                delete params.invoiceID;
                ePayment(params, function(rules) {
                    callback(rules);
                });
            }
        });
    },
    getInstanceItems: function(params, callback) {
        courseInstanceItems(params, callback);
    },

    getHasEnrolmentHash: function(params, callback) {
        hasEnrolmentByReference(params, callback);
    },
    sendRemindersForHashes: function(params, callback) {
        sendReminderByReference(params, callback);
    },
    flagOthersAsRedundant: function(params, callback) {
        flagEnrolmentsAsRedundantByReference(params, callback);
    },
    verifyUSI: function(params, callback) {
        validateUSI(params, callback);
    },
    checkForUser: function(params, callback) {
        checkForUser(params, callback);
    },
    beginPaymentFlow: function(params, callback) {
        beginPaymentFlow(params, callback);
    },
    getPaymentFlowForm: function(params, callback) {
        paymentFlowForm(params, callback);
    },

    beginEZFlow: function(params, callback) {
        beginEZFlow(params, callback);
    },
    triggerEnrolmentResumption: function(params, callback) {
        triggerEnrolment(params, callback);
    },
    retrieveORGABN: function(params, callback) {
        retrieveABN(params, callback);
    },
    updateORGABN: function(params, callback) {
        updateABN(params, callback);
    }
};
ENROLLER_FIELD_HELPERS = {
    LANGUAGE_LIST: "contactsaggregates.mainlanguagecode",
    COUNTRY_LIST: "contactsaggregates.countryofcitizencode",
    QUALIFICATION_LIST: "classes.diplomaid",
    WORKSHOPTYPE_LIST: "workshops.programcodeid",
    CATEGORY_LIST: "contactsaggregates.contactcategoryfilter",

    getListByReference: function(reference, callback) {
        callResource("callResource", "/report/field", "GET", { fieldReference: reference }, function(fieldDefinition) {
            var countries = fieldDefinition.VALUEOPTIONS;

            callback(countries);
        });
    },
    getQualifications: function(callback) {
        var params = { type: "p", displayLength: 200 };
        if (typeof ENROLLER_FIELD_DEFAULTS_vars !== "undefined") {
            if (ENROLLER_FIELD_DEFAULTS_vars.allCourses) {
                ENROLLER_FIELD_HELPERS.getListByReference(ENROLLER_FIELD_HELPERS.QUALIFICATION_LIST, function(data) {
                    callback(data);
                });
            }
        } else {
            ENROLLER_FIELD_HELPERS.getCourses(params, callback);
        }
    },
    getCourses: function(params, callback) {
        params.isActive = 1;
        callResource("callResource", "/courses", "GET", params, function(courseList) {
            var courseListArray = [];
            if (courseList[0] != null) {
                jQuery.each(courseList, function(i, course) {
                    var name = course.CODE + " - " + course.NAME;
                    if (course.STREAMNAME != null) {
                        name = name + " (" + course.STREAMNAME + ")";
                    }
                    var temp = { DISPLAY: name, VALUE: course.ID };
                    courseListArray.push(temp);
                });
                callback(courseListArray);
            } else {
                callback(null);
            }
        });
    },
    getWorkshopTypes: function(callback) {
        var params = { type: "w", displayLength: 200 };
        if (typeof ENROLLER_FIELD_DEFAULTS_vars !== "undefined") {
            if (ENROLLER_FIELD_DEFAULTS_vars.f) {
                ENROLLER_FIELD_HELPERS.getListByReference(ENROLLER_FIELD_HELPERS.WORKSHOPTYPE_LIST, callback);
            }
        } else {
            ENROLLER_FIELD_HELPERS.getCourses(params, callback);
        }
    },
    getCustomFields: function(callback) {
        callResource("callResource", "/customFields", "GET", { linkto: "contact" }, function(customFields) {
            var fieldList = {};
            if (customFields != null) {
                if (customFields[0] != null) {
                    $.each(customFields, function(i, customField) {
                        var field = {
                            DISPLAY: customField.LABEL
                        };
                        //console.log(customField);
                        if (
                            customField.TYPE == "select" ||
                            customField.TYPE == "radio" ||
                            customField.TYPE == "select-multi"
                        ) {
                            field.TYPE = "select";
                            field.VALUES = [];
                            if (customField.TYPE == "select-multi") {
                                field.TYPE = "multi-select";
                            }
                            var options = customField.OPTIONS;
                            if (!$.isArray(options)) {
                                options = options.split(",");
                            }
                            $.each(options, function(n, option) {
                                var value = { VALUE: option, DISPLAY: option };
                                field.VALUES.push(value);
                            });
                        } else if (customField.TYPE == "date") {
                            field.TYPE = "date";
                        } else {
                            field.TYPE = "text";
                        }
                        var fieldID = "CUSTOMFIELD_" + customField.VARIABLENAME.toUpperCase();
                        fieldList[fieldID] = field;
                    });
                }
            }

            callback(fieldList);
        });
    },
    getLocations: function(callback) {
        callResource("callResource", "/course/locations", "GET", { onlyFuture: true }, function(locations) {
            callback(locations);
        });
    },
    contactSources: function(params, callback) {
        params.onlyPublic = true;
        params.onlyActive = true;
        callResource("callResource", "/contact/sources", "GET", params, function(data) {
            callback(data);
        });
    }
};

ENROLLER_STEP_DEFAULTS = {
    userLogin: {
        DISPLAY: "Login",
        TYPE: "user-login"
    },
    contactSearch: {
        BLURB_TOP: "Switch the active Student or add another.",
        contactList: null,
        DISPLAY: "Contact",
        TYPE: "contact-search"
    },
    contactGeneral: {
        DISPLAY: "General Details",
        TYPE: "contact-update",
        FIELDS: {
            GIVENNAME: ENROLLER_FIELD_DEFAULTS.GIVENNAME,
            MIDDLENAME: ENROLLER_FIELD_DEFAULTS.MIDDLENAME,
            SURNAME: ENROLLER_FIELD_DEFAULTS.SURNAME,
            EMAILADDRESS: ENROLLER_FIELD_DEFAULTS.EMAILADDRESS,
            USI: ENROLLER_FIELD_DEFAULTS.USI,
            DOB: ENROLLER_FIELD_DEFAULTS.DOB,
            ORGANISATION: ENROLLER_FIELD_DEFAULTS.ORGANISATION,
            POSITION: ENROLLER_FIELD_DEFAULTS.POSITION,
            MOBILEPHONE: ENROLLER_FIELD_DEFAULTS.MOBILEPHONE,
            PHONE: ENROLLER_FIELD_DEFAULTS.PHONE,
            WORKPHONE: ENROLLER_FIELD_DEFAULTS.WORKPHONE
        }
    },
    contactCRICOS: {
        DISPLAY: "CRICOS Details",
        TYPE: "contact-update",
        FIELDS: {
            COUNTRYOFCITIZENID: ENROLLER_FIELD_DEFAULTS.COUNTRYOFCITIZENID,
            INTERNATIONALCONTACTID: ENROLLER_FIELD_DEFAULTS.INTERNATIONALCONTACTID,
            IELTS: ENROLLER_FIELD_DEFAULTS.IELTS
        }
    },

    contactAvetmiss: {
        DISPLAY: "AVETMISS Details",
        TYPE: "contact-update",
        FIELDS: {
            CITYOFBIRTH: ENROLLER_FIELD_DEFAULTS.CITYOFBIRTH,
            COUNTRYOFBIRTHID: ENROLLER_FIELD_DEFAULTS.COUNTRYOFBIRTHID,
            MAINLANGUAGEID: ENROLLER_FIELD_DEFAULTS.MAINLANGUAGEID,
            ENGLISHASSISTANCEFLAG: ENROLLER_FIELD_DEFAULTS.ENGLISHASSISTANCEFLAG,

            HIGHESTSCHOOLLEVELID: ENROLLER_FIELD_DEFAULTS.HIGHESTSCHOOLLEVELID,
            HIGHESTSCHOOLLEVELYEAR: ENROLLER_FIELD_DEFAULTS.HIGHESTSCHOOLLEVELYEAR,
            ATSCHOOLFLAG: ENROLLER_FIELD_DEFAULTS.ATSCHOOLFLAG,
            CURRENTSCHOOLLEVEL: ENROLLER_FIELD_DEFAULTS.CURRENTSCHOOLLEVEL,
            LABOURFORCEID: ENROLLER_FIELD_DEFAULTS.LABOURFORCEID,
            INDIGENOUSSTATUSID: ENROLLER_FIELD_DEFAULTS.INDIGENOUSSTATUSID,
            ANZSCOCODE: ENROLLER_FIELD_DEFAULTS.ANZSCOCODE,
            ANZSICCODE: ENROLLER_FIELD_DEFAULTS.ANZSICCODE,
            PRIOREDUCATIONIDS: ENROLLER_FIELD_DEFAULTS.PRIOREDUCATIONIDS,
            DISABILITYTYPEIDS: ENROLLER_FIELD_DEFAULTS.DISABILITYTYPEIDS
        }
    },

    contactAddress: {
        DISPLAY: "Address",
        TYPE: "contact-update",
        FIELDS: {
            SUNITNO: ENROLLER_FIELD_DEFAULTS.SUNITNO,
            SSTREETNO: ENROLLER_FIELD_DEFAULTS.SSTREETNO,
            SBUILDINGNAME: ENROLLER_FIELD_DEFAULTS.SBUILDINGNAME,
            SSTREETNAME: ENROLLER_FIELD_DEFAULTS.SSTREETNAME,
            SCITY: ENROLLER_FIELD_DEFAULTS.SCITY,
            SSTATE: ENROLLER_FIELD_DEFAULTS.SSTATE,
            SPOSTCODE: ENROLLER_FIELD_DEFAULTS.SPOSTCODE,
            SPOBOX: ENROLLER_FIELD_DEFAULTS.SPOBOX,
            SCOUNTRYID: ENROLLER_FIELD_DEFAULTS.SCOUNTRYID,
            addressStreetSame: ENROLLER_FIELD_DEFAULTS.addressStreetSame,
            UNITNO: ENROLLER_FIELD_DEFAULTS.UNITNO,
            STREETNO: ENROLLER_FIELD_DEFAULTS.STREETNO,
            BUILDINGNAME: ENROLLER_FIELD_DEFAULTS.BUILDINGNAME,
            STREETNAME: ENROLLER_FIELD_DEFAULTS.STREETNAME,
            CITY: ENROLLER_FIELD_DEFAULTS.CITY,
            STATE: ENROLLER_FIELD_DEFAULTS.STATE,
            POSTCODE: ENROLLER_FIELD_DEFAULTS.POSTCODE,
            POBOX: ENROLLER_FIELD_DEFAULTS.POBOX,
            COUNTRYID: ENROLLER_FIELD_DEFAULTS.COUNTRYID
        }
    },

    emergencyContact: {
        DISPLAY: "Emergency Contact",
        TYPE: "contact-update",
        FIELDS: {
            EMERGENCYCONTACT: ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACT,
            EMERGENCYCONTACTRELATION: ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACTRELATION,
            EMERGENCYCONTACTPHONE: ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACTPHONE
        }
    },

    /*supports adding a list of courses to filter results, or outright searching*/
    courses: {
        retrieveQualificationsList: ENROLLER_FIELD_HELPERS.getQualifications,
        retrieveWorkshopTypesList: ENROLLER_FIELD_HELPERS.getWorkshopTypes,
        searchFunction: ENROLLER_FUNCTION_DEFAULTS.courseSearch,

        get_locations: ENROLLER_FIELD_HELPERS.getLocations,
        DISPLAY: "Course",
        TYPE: "courses",
        COURSE_TYPES: [{ DISPLAY: "Short Course", VALUE: "w" }, { DISPLAY: "Qualification", VALUE: "p" }]
    },
    portfolio: {
        ISCRICOS: true,
        PORTFOLIOCHECKLISTID: null,
        DISPLAY: "Documentation",
        TYPE: "portfolio"
    },
    review: {
        DISPLAY: "Review Details",
        TYPE: "review"
    },
    agentCourses: {
        DISPLAY: "Review Courses",
        TYPE: "agent-courses"
    },
    billing: {
        checkForInvoice: function() {},
        processFunction: function() {},
        DISPLAY: "Billing",
        TYPE: "enrol",
        paymentMethods: ENROLLER_PAYMENT_METHODS
    }
};

ENROLMENT_DEFAULT_CONFIGS = {
  DEFAULT_CONFIG: {
    DISPLAY: "Default Configuration",
    ID: "DEFAULT_CONFIG",
    CONFIG: {
      enroller_steps: {
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login"
        },

        contactGeneral: {
          DISPLAY: "General Details",
          TYPE: "contact-update",
          FIELDS: {
            GIVENNAME: ENROLLER_FIELD_DEFAULTS.GIVENNAME,
            MIDDLENAME: ENROLLER_FIELD_DEFAULTS.MIDDLENAME,
            SURNAME: ENROLLER_FIELD_DEFAULTS.SURNAME,
            EMAILADDRESS: ENROLLER_FIELD_DEFAULTS.EMAILADDRESS,
            USI: ENROLLER_FIELD_DEFAULTS.USI,
            DOB: ENROLLER_FIELD_DEFAULTS.DOB,
            ORGANISATION: ENROLLER_FIELD_DEFAULTS.ORGANISATION,
            POSITION: ENROLLER_FIELD_DEFAULTS.POSITION,
            MOBILEPHONE: ENROLLER_FIELD_DEFAULTS.MOBILEPHONE,
            PHONE: ENROLLER_FIELD_DEFAULTS.PHONE,
            WORKPHONE: ENROLLER_FIELD_DEFAULTS.WORKPHONE
          }
        },

        usi_validation: {
          DISPLAY: "USI",
          TYPE: "usi-validation"
        },

        contactAvetmiss: {
          DISPLAY: "AVETMISS Details",
          TYPE: "contact-update",
          FIELDS: {
            CITYOFBIRTH: ENROLLER_FIELD_DEFAULTS.CITYOFBIRTH,
            COUNTRYOFBIRTHID: ENROLLER_FIELD_DEFAULTS.COUNTRYOFBIRTHID,
            MAINLANGUAGEID: ENROLLER_FIELD_DEFAULTS.MAINLANGUAGEID,

            ENGLISHASSISTANCEFLAG:
              ENROLLER_FIELD_DEFAULTS.ENGLISHASSISTANCEFLAG,

            HIGHESTSCHOOLLEVELID: ENROLLER_FIELD_DEFAULTS.HIGHESTSCHOOLLEVELID,
            HIGHESTSCHOOLLEVELYEAR:
              ENROLLER_FIELD_DEFAULTS.HIGHESTSCHOOLLEVELYEAR,
            ATSCHOOLFLAG: ENROLLER_FIELD_DEFAULTS.ATSCHOOLFLAG,
            CURRENTSCHOOLLEVEL: ENROLLER_FIELD_DEFAULTS.CURRENTSCHOOLLEVEL,
            LABOURFORCEID: ENROLLER_FIELD_DEFAULTS.LABOURFORCEID,
            INDIGENOUSSTATUSID: ENROLLER_FIELD_DEFAULTS.INDIGENOUSSTATUSID,
            ANZSCOCODE: ENROLLER_FIELD_DEFAULTS.ANZSCOCODE,
            ANZSICCODE: ENROLLER_FIELD_DEFAULTS.ANZSICCODE,
            PRIOREDUCATIONIDS: ENROLLER_FIELD_DEFAULTS.PRIOREDUCATIONIDS,
            DISABILITYTYPEIDS: ENROLLER_FIELD_DEFAULTS.DISABILITYTYPEIDS
          }
        },

        contactAddress: {
          DISPLAY: "Address",
          TYPE: "contact-update",
          FIELDS: {
            SUNITNO: ENROLLER_FIELD_DEFAULTS.SUNITNO,
            SSTREETNO: ENROLLER_FIELD_DEFAULTS.SSTREETNO,
            SBUILDINGNAME: ENROLLER_FIELD_DEFAULTS.SBUILDINGNAME,
            SSTREETNAME: ENROLLER_FIELD_DEFAULTS.SSTREETNAME,
            SCITY: ENROLLER_FIELD_DEFAULTS.SCITY,
            SSTATE: ENROLLER_FIELD_DEFAULTS.SSTATE,
            SPOSTCODE: ENROLLER_FIELD_DEFAULTS.SPOSTCODE,
            SPOBOX: ENROLLER_FIELD_DEFAULTS.SPOBOX,
            SCOUNTRYID: ENROLLER_FIELD_DEFAULTS.SCOUNTRYID,
            addressStreetSame: ENROLLER_FIELD_DEFAULTS.addressStreetSame,
            UNITNO: ENROLLER_FIELD_DEFAULTS.UNITNO,
            STREETNO: ENROLLER_FIELD_DEFAULTS.STREETNO,
            BUILDINGNAME: ENROLLER_FIELD_DEFAULTS.BUILDINGNAME,
            STREETNAME: ENROLLER_FIELD_DEFAULTS.STREETNAME,
            CITY: ENROLLER_FIELD_DEFAULTS.CITY,
            STATE: ENROLLER_FIELD_DEFAULTS.STATE,
            POSTCODE: ENROLLER_FIELD_DEFAULTS.POSTCODE,
            POBOX: ENROLLER_FIELD_DEFAULTS.POBOX,
            COUNTRYID: ENROLLER_FIELD_DEFAULTS.COUNTRYID
          }
        },

        emergencyContact: {
          DISPLAY: "Emergency Contact",
          TYPE: "contact-update",
          FIELDS: {
            EMERGENCYCONTACT: ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACT,
            EMERGENCYCONTACTRELATION:
              ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACTRELATION,
            EMERGENCYCONTACTPHONE: ENROLLER_FIELD_DEFAULTS.EMERGENCYCONTACTPHONE
          }
        },

        /*supports adding a list of courses to filter results, or outright searching*/
        courses: {
          retrieveQualificationsList: ENROLLER_FIELD_HELPERS.getQualifications,
          retrieveWorkshopTypesList: ENROLLER_FIELD_HELPERS.getWorkshopTypes,
          searchFunction: ENROLLER_FUNCTION_DEFAULTS.courseSearch,

          get_locations: ENROLLER_FIELD_HELPERS.getLocations,
          DISPLAY: "Course",
          TYPE: "courses",
          COURSE_TYPES: [
            { DISPLAY: "Short Course", VALUE: "w" },
            { DISPLAY: "Qualification", VALUE: "p" }
          ]
        },

        review: {
          DISPLAY: "Review Details",
          TYPE: "review"
        },

        billing: {
          checkForInvoice: function() {},
          processFunction: function() {},
          DISPLAY: "Billing",
          TYPE: "enrol",
          paymentMethods: ENROLLER_PAYMENT_METHODS
        }
      },
      step_order: [
        "userLogin",
        "contactGeneral",
        "usi_validation",
        "contactAvetmiss",
        "contactAddress",
        "emergencyContact",
        "courses",
        "review",
        "billing"
      ],
      config_name: "Default"
    }
  },
  ACCRED_GROUP_ENROL: {
    DISPLAY: "Accredited Enrolment - Group",
    ID: "ACCRED_GROUP_ENROL",
    CONFIG: {
      enroller_steps: {
        contactGeneral: {
          ID: "contactGeneral",
          DISPLAY: "Personal Details",
          TYPE: "contact-update",
          FIELDS: {
            TitleEntry: {
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "Other"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                CopyMr_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMr",
                  VALUE_RESTRICTION: "Mr"
                },
                CopyMrs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMrs",
                  VALUE_RESTRICTION: "Mrs"
                },
                CopyMiss_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMiss",
                  VALUE_RESTRICTION: "Miss"
                },
                CopyMs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMs",
                  VALUE_RESTRICTION: "Ms"
                },
                ShowOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "ShowOther",
                  VALUE_RESTRICTION: "Other"
                },
                MrHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrHide",
                  VALUE_RESTRICTION: "Mr"
                },
                MrsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrsHide",
                  VALUE_RESTRICTION: "Mrs"
                },
                MsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MsHide",
                  VALUE_RESTRICTION: "Ms"
                },
                MissHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MissHide",
                  VALUE_RESTRICTION: "Miss"
                },
                RemoveOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "RemoveOther",
                  VALUE_RESTRICTION: "Other"
                }
              },
              ID: "TitleEntry",
              DISPLAY: "Title",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            TITLE: {
              EVENTS: {
                CopyMrs: {
                  LISTENER: "CopyMrs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMs: {
                  LISTENER: "CopyMs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMiss: {
                  LISTENER: "CopyMiss",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMr: {
                  LISTENER: "CopyMr",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                ShowOther: {
                  LISTENER: "ShowOther",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "TitleEntry"
                },
                MissHide: {
                  LISTENER: "MissHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrHide: {
                  LISTENER: "MrHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrsHide: {
                  LISTENER: "MrsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MsHide: {
                  LISTENER: "MsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                RemoveOther: {
                  LISTENER: "RemoveOther",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "blank"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "TITLE",
              DISPLAY: "Please enter your title",
              TYPE: "text",
              MAXLENGTH: "10",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Other",
                  VALUE: ""
                }
              ],
              DYNAMIC: true
            },
            blank: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "blank",
              DISPLAY: "Hidden blank field for removing title value",
              TYPE: "text",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            GIVENNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "GIVENNAME",
              DISPLAY: "Given Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            PREFERREDNAME: {
              TYPE: "text",
              DISPLAY: "Preferred Name",
              MAXLENGTH: 30
            },
            MIDDLENAME: {
              TYPE: "text",
              DISPLAY: "Middle Name",
              MAXLENGTH: 40
            },
            SURNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SURNAME",
              DISPLAY: "Last Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            DOB: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DOB",
              DISPLAY: "Date Of Birth",
              TYPE: "date",
              REQUIRED: true,
              INFO_ONLY: false
            },
            USI: {
              TYPE: "text",
              DISPLAY: "Unique Student Identifier",
              PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
              MAXLENGTH: 10,
              TITLE: "10 Characters no 1, 0, O or I",
              TOOLTIP:
                "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
            },
            SEX: {
              VALUES: [
                {
                  DISPLAY: "Male",
                  VALUE: "M"
                },
                {
                  DISPLAY: "Female",
                  VALUE: "F"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "X"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SEX",
              DISPLAY: "Gender",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "TitleEntry",
            "TITLE",
            "blank",
            "GIVENNAME",
            "PREFERREDNAME",
            "MIDDLENAME",
            "SURNAME",
            "DOB",
            "USI",
            "SEX"
          ],
          HEADER: "Personal Details"
        },
        contactAvetmiss: {
          ID: "contactAvetmiss",
          DISPLAY: "Nationality ",
          TYPE: "contact-update",
          FIELDS: {
            CitizenshipDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "CitizenshipDetailsInfo",
              DISPLAY: "Citizenship",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            COUNTRYOFBIRTHID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "COUNTRYOFBIRTHID",
              DISPLAY: "Country Of Birth",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            CITIZENSTATUSID: {
              VALUES: [
                {
                  DISPLAY: "Australian Citizen",
                  VALUE: 1
                },
                {
                  DISPLAY: "New Zealand Citizen",
                  VALUE: 2
                },
                {
                  DISPLAY: "Australian Permanent Resident",
                  VALUE: 3
                },
                {
                  DISPLAY: "Student Visa",
                  VALUE: 4
                },
                {
                  DISPLAY: "Temporary Resident Visa",
                  VALUE: 5
                },
                {
                  DISPLAY: "Visitor's Visa",
                  VALUE: 6
                },
                {
                  DISPLAY: "Business Visa",
                  VALUE: 7
                },
                {
                  DISPLAY: "Holiday Visa",
                  VALUE: 8
                },
                {
                  DISPLAY: "Other Visa",
                  VALUE: 9
                },
                {
                  DISPLAY: "Permanent Humanitarian Visa",
                  VALUE: 10
                },
                {
                  DISPLAY: "Overseas - No Visa or Citizenship",
                  VALUE: 11
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "CITIZENSTATUSID",
              DISPLAY: "Citizenship Status",
              TYPE: "search-select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            COUNTRYOFCITIZENID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "COUNTRYOFCITIZENID",
              DISPLAY: "Country Of Citizenship",
              TYPE: "search-select",
              REQUIRED: false
            },
            LanguageDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "LanguageDetailsInfo",
              DISPLAY: "Language",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            LanguageOtherThanEnglish: {
              VALUES: [
                {
                  DISPLAY: "Yes",
                  VALUE: "Yes"
                },
                {
                  DISPLAY: "No",
                  VALUE: "1201"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                copyLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "copyLanguage",
                  VALUE_RESTRICTION: "1201"
                },
                hideLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hideLanguage",
                  VALUE_RESTRICTION: "1201"
                },
                showLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "showLanguage",
                  VALUE_RESTRICTION: "Yes"
                }
              },
              ID: "LanguageOtherThanEnglish",
              DISPLAY: "Do you speak a language other than english at home?",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            MAINLANGUAGEID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {
                copyLanguage: {
                  LISTENER: "copyLanguage",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "LanguageOtherThanEnglish"
                },
                hideLanguage: {
                  LISTENER: "hideLanguage",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "GIVENNAME"
                },
                showLanguage: {
                  LISTENER: "showLanguage",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "MAINLANGUAGEID",
              DISPLAY: "Language spoken most often",
              TYPE: "search-select",
              REQUIRED: false,
              TOOLTIP:
                "If you speak more than one language, please indicate the one that is spoken most often",
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            ENGLISHPROFICIENCYID: {
              TYPE: "select",
              DISPLAY: "English Proficiency",
              TOOLTIP: "How well you speak English.",
              VALUES: [
                {
                  VALUE: "",
                  DISPLAY: "Not Specified"
                },
                {
                  VALUE: 1,
                  DISPLAY: "Very Well"
                },
                {
                  VALUE: 2,
                  DISPLAY: "Well"
                },
                {
                  VALUE: 3,
                  DISPLAY: "Not Well"
                },
                {
                  VALUE: 4,
                  DISPLAY: "Not at all"
                }
              ]
            }
          },
          FIELD_ORDER: [
            "CitizenshipDetailsInfo",
            "COUNTRYOFBIRTHID",
            "CITIZENSTATUSID",
            "COUNTRYOFCITIZENID",
            "LanguageDetailsInfo",
            "LanguageOtherThanEnglish",
            "MAINLANGUAGEID",
            "ENGLISHPROFICIENCYID"
          ]
        },
        contactAddress: {
          ID: "contactAddress",
          DISPLAY: "Address",
          TYPE: "contact-update",
          FIELDS: {
            streetAddress: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "streetAddress",
              DISPLAY: "Street Address",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            ResidenceInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "ResidenceInfo",
              DISPLAY:
                "Please provide the physical address (street number and name not post office box) where you usually reside rather than any temporary address at which you reside for training, work or other purposes before returning to your home.  If you are from a rural area use the address from your state or territory’s ‘rural property addressing’ or ‘numbering’ system as your residential street address",
              TYPE: "info_expandable",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false
            },
            SBUILDINGNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SBUILDINGNAME",
              DISPLAY: "Building/property name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              TOOLTIP:
                "Building/property name is the official place name or common usage name for an address site, including the name of a building, Aboriginal community, homestead, building complex, agricultural property, park or unbounded address site.",
              INFO_ONLY: false
            },
            SUNITNO: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SUNITNO",
              DISPLAY: "Flat/unit details",
              TYPE: "text",
              MAXLENGTH: "30",
              REQUIRED: false,
              INFO_ONLY: false
            },
            SSTREETNO: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTREETNO",
              DISPLAY: "Street or lot number",
              TYPE: "text",
              MAXLENGTH: "15",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SSTREETNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTREETNAME",
              DISPLAY: "Street Name",
              TYPE: "text",
              MAXLENGTH: "70",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SPOBOX: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SPOBOX",
              DISPLAY: "Street Address - Postal delivery information (PO box)",
              TYPE: "text",
              MAXLENGTH: "22",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            SCITY: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SCITY",
              DISPLAY: "Suburb, locality or town",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SSTATE: {
              VALUES: [
                {
                  DISPLAY: "NSW",
                  VALUE: "NSW"
                },
                {
                  DISPLAY: "VIC",
                  VALUE: "VIC"
                },
                {
                  DISPLAY: "QLD",
                  VALUE: "QLD"
                },
                {
                  DISPLAY: "SA",
                  VALUE: "SA"
                },
                {
                  DISPLAY: "WA",
                  VALUE: "WA"
                },
                {
                  DISPLAY: "TAS",
                  VALUE: "TAS"
                },
                {
                  DISPLAY: "NT",
                  VALUE: "NT"
                },
                {
                  DISPLAY: "ACT",
                  VALUE: "ACT"
                },
                {
                  DISPLAY: "Other Australian Territory",
                  VALUE: "OTH"
                },
                {
                  DISPLAY: "Overseas",
                  VALUE: "OVS"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTATE",
              DISPLAY: "State/Territory",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SPOSTCODE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SPOSTCODE",
              DISPLAY: "Postcode",
              TYPE: "text",
              MAXLENGTH: "10",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SCOUNTRYID: {
              VALUES: [
                {
                  DISPLAY: "notset",
                  VALUE: ""
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SCOUNTRYID",
              DISPLAY: "Country",
              TYPE: "search-select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            addressStreetSame: {
              EVENTS: {},
              TRIGGER_EVENTS: {
                postal_copy_click: {
                  TRIGGER_ON: "click",
                  EVENT: "postal_copy",
                  VALUE_RESTRICTION: ""
                }
              },
              ID: "addressStreetSame",
              DISPLAY: "Copy Residential Address to Postal",
              TYPE: "button",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true,
              FS_OFFTEXT: "Same as Street Address?",
              FS_ONTEXT: "Matches Street Address"
            },
            postalAddress: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "postalAddress",
              DISPLAY: "Postal Address",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            BUILDINGNAME: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SBUILDINGNAME"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "BUILDINGNAME",
              DISPLAY: "Building/property name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              TOOLTIP:
                "Building/property name is the official place name or common usage name for an address site, including the name of a building, Aboriginal community, homestead, building complex, agricultural property, park or unbounded address site.",
              INFO_ONLY: false
            },
            UNITNO: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SUNITNO"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "UNITNO",
              DISPLAY: "Flat/unit details",
              TYPE: "text",
              MAXLENGTH: "30",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STREETNO: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTREETNO"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STREETNO",
              DISPLAY: "Street or lot number",
              TYPE: "text",
              MAXLENGTH: "15",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STREETNAME: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTREETNAME"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STREETNAME",
              DISPLAY: "Street Name",
              TYPE: "text",
              MAXLENGTH: "70",
              REQUIRED: false,
              INFO_ONLY: false
            },
            POBOX: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SPOBOX"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "POBOX",
              DISPLAY: "Postal delivery information (PO Box)",
              TYPE: "text",
              MAXLENGTH: "22",
              REQUIRED: false,
              INFO_ONLY: false
            },
            CITY: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SCITY"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "CITY",
              DISPLAY: "Suburb, locality or town",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STATE: {
              VALUES: [
                {
                  DISPLAY: "NSW",
                  VALUE: "NSW"
                },
                {
                  DISPLAY: "VIC",
                  VALUE: "VIC"
                },
                {
                  DISPLAY: "QLD",
                  VALUE: "QLD"
                },
                {
                  DISPLAY: "SA",
                  VALUE: "SA"
                },
                {
                  DISPLAY: "WA",
                  VALUE: "WA"
                },
                {
                  DISPLAY: "TAS",
                  VALUE: "TAS"
                },
                {
                  DISPLAY: "NT",
                  VALUE: "NT"
                },
                {
                  DISPLAY: "ACT",
                  VALUE: "ACT"
                },
                {
                  DISPLAY: "Other Australian Territory",
                  VALUE: "OTH"
                },
                {
                  DISPLAY: "Overseas",
                  VALUE: "OVS"
                }
              ],
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTATE"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STATE",
              DISPLAY: "State/Territory",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            POSTCODE: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SPOSTCODE"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "POSTCODE",
              DISPLAY: "Postcode",
              TYPE: "text",
              MAXLENGTH: "10",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: false,
              INFO_ONLY: false
            },
            COUNTRYID: {
              VALUES: [
                {
                  DISPLAY: "notset",
                  VALUE: ""
                }
              ],
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SCOUNTRYID"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "COUNTRYID",
              DISPLAY: "Country",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "streetAddress",
            "ResidenceInfo",
            "SBUILDINGNAME",
            "SUNITNO",
            "SSTREETNO",
            "SSTREETNAME",
            "SPOBOX",
            "SCITY",
            "SSTATE",
            "SPOSTCODE",
            "SCOUNTRYID",
            "addressStreetSame",
            "postalAddress",
            "BUILDINGNAME",
            "UNITNO",
            "STREETNO",
            "STREETNAME",
            "POBOX",
            "CITY",
            "STATE",
            "POSTCODE",
            "COUNTRYID"
          ]
        },
        emergencyContact: {
          ID: "emergencyContact",
          DISPLAY: "Emergency Contact",
          TYPE: "contact-update",
          FIELDS: {
            EMERGENCYCONTACT: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACT",
              DISPLAY: "Contact Name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            EMERGENCYCONTACTRELATION: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACTRELATION",
              DISPLAY: "Relationship",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            EMERGENCYCONTACTPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACTPHONE",
              DISPLAY: "Contact Number",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "EMERGENCYCONTACT",
            "EMERGENCYCONTACTRELATION",
            "EMERGENCYCONTACTPHONE"
          ],
          HEADER: "Emergency Contact "
        },
        review: {
          DISPLAY: "Review Details",
          TYPE: "review",
          ID: "review"
        },
        billing: {
          DISPLAY: "Billing",
          TYPE: "enrol",
          paymentMethods: {
            DISPLAY: "Payment Method",
            VALUES: [
              {
                VALUE: "invoice",
                DISPLAY: "Invoice"
              },
              {
                VALUE: "payment",
                DISPLAY: "Credit Card Payment"
              }
            ],
            TYPE: "select"
          },
          ID: "billing"
        },
        ContactDetails: {
          ID: "ContactDetails",
          DISPLAY: "Contact Details",
          TYPE: "contact-update",
          FIELDS: {
            EMAILADDRESS: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMAILADDRESS",
              DISPLAY: "Email",
              TYPE: "email",
              MAXLENGTH: "60",
              REQUIRED: true,
              TOOLTIP: "A contact email address",
              INFO_ONLY: false
            },
            EMAILADDRESSALTERNATIVE: {
              TYPE: "email",
              DISPLAY: "Alternative email address ",
              REQUIRED: false,
              TOOLTIP: "A contact email address",
              MAXLENGTH: 60
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            POSITION: {
              TYPE: "text",
              DISPLAY: "Position",
              TOOLTIP: "The Job Title / Position held by the student",
              MAXLENGTH: 60
            },
            MOBILEPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "MOBILEPHONE",
              DISPLAY: "Mobile",
              TYPE: "text",
              TITLE:
                "Mobile numbers must be numeric, 10 characters and contain no spaces.",
              PATTERN: "[0-9]{10}",
              MAXLENGTH: "10",
              REQUIRED: true,
              INFO_ONLY: false
            },
            PHONE: {
              TYPE: "text",
              DISPLAY: "Home Phone",
              MAXLENGTH: 20
            },
            WORKPHONE: {
              TYPE: "text",
              DISPLAY: "Work Phone",
              MAXLENGTH: 20
            }
          },
          FIELD_ORDER: [
            "EMAILADDRESS",
            "EMAILADDRESSALTERNATIVE",
            "ORGANISATION",
            "POSITION",
            "MOBILEPHONE",
            "PHONE",
            "WORKPHONE"
          ],
          HEADER: "Contact Details"
        },
        AdditionalDetails: {
          ID: "AdditionalDetails",
          DISPLAY: "Additional Details",
          TYPE: "contact-update",
          FIELDS: {
            DisabilityDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DisabilityDetailsInfo",
              DISPLAY: "Disabilities",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            DISABILITYFLAG: {
              VALUES: [
                {
                  DISPLAY: "No",
                  VALUE: false
                },
                {
                  DISPLAY: "Yes",
                  VALUE: true
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                hide_disabilities_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_disabilities",
                  VALUE_RESTRICTION: "false"
                },
                show_disabilities_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_disabilities",
                  VALUE_RESTRICTION: "true"
                }
              },
              ID: "DISABILITYFLAG",
              DISPLAY:
                "Do you consider yourself to have a disability, impairment or long-term condition?",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false,
              TOOLTIP: null
            },
            DISABILITYTYPEIDS: {
              VALUES: [
                {
                  DISPLAY: "Hearing / Deafness",
                  VALUE: "11"
                },
                {
                  DISPLAY: "Physical",
                  VALUE: "12"
                },
                {
                  DISPLAY: "Intellectual",
                  VALUE: "13"
                },
                {
                  DISPLAY: "Learning",
                  VALUE: "14"
                },
                {
                  DISPLAY: "Mental illness",
                  VALUE: "15"
                },
                {
                  DISPLAY: "Acquired Brain Impairment",
                  VALUE: "16"
                },
                {
                  DISPLAY: "Vision",
                  VALUE: "17"
                },
                {
                  DISPLAY: "Medical condition",
                  VALUE: "18"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "19"
                }
              ],
              EVENTS: {
                show_disabilities: {
                  LISTENER: "show_disabilities",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "disabilityQuestion"
                },
                hide_disabilities: {
                  LISTENER: "hide_disabilities",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "disabilityQuestion"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "DISABILITYTYPEIDS",
              DISPLAY:
                "If you indicated the presence of a disability, impairment or long-term condition, please select the area(s) in the following list",
              TYPE: "checkbox",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              TOOLTIP: null
            },
            AdditionalDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "AdditionalDetailsInfo",
              DISPLAY: "Additional Details",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            INDIGENOUSSTATUSID: {
              VALUES: [
                {
                  DISPLAY: "No",
                  VALUE: 4
                },
                {
                  DISPLAY: "Aboriginal",
                  VALUE: 1
                },
                {
                  DISPLAY: "Torres Strait Islander",
                  VALUE: 2
                },
                {
                  DISPLAY: "Aboriginal & Torres Strait Islander",
                  VALUE: 3
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "INDIGENOUSSTATUSID",
              DISPLAY: "Indigenous Status",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            LABOURFORCEID: {
              VALUES: [
                {
                  DISPLAY: "Full-time employee",
                  VALUE: 1
                },
                {
                  DISPLAY: "Part-time employee",
                  VALUE: 2
                },
                {
                  DISPLAY: "Self-employed - not employing others",
                  VALUE: 3
                },
                {
                  DISPLAY: "Self-employed – employing others",
                  VALUE: "4"
                },
                {
                  DISPLAY: "Employed - unpaid worker in a family business",
                  VALUE: 5
                },
                {
                  DISPLAY: "Unemployed - Seeking full-time work",
                  VALUE: 6
                },
                {
                  DISPLAY: "Unemployed - Seeking part-time work",
                  VALUE: 7
                },
                {
                  DISPLAY: "Unemployed - Not Seeking employment",
                  VALUE: 8
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "LABOURFORCEID",
              DISPLAY:
                "Of the following categories, which best describes your current employment status?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "For casual, seasonal, contract and shift work, use the current number of hours worked per week to determine whether full time (35 hours or more per week) or part-time employed (less than 35 hours per week).",
              INFO_ONLY: false
            },
            SOURCECODEID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SOURCECODEID",
              DISPLAY: "How did you hear about us?",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "DisabilityDetailsInfo",
            "DISABILITYFLAG",
            "DISABILITYTYPEIDS",
            "AdditionalDetailsInfo",
            "INDIGENOUSSTATUSID",
            "LABOURFORCEID",
            "SOURCECODEID"
          ]
        },
        EducationalHistory: {
          ID: "EducationalHistory",
          DISPLAY: "Schooling",
          TYPE: "contact-update",
          FIELDS: {
            SecondaryEdDetails: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SecondaryEdDetails",
              DISPLAY: "Secondary Education",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            HIGHESTSCHOOLLEVELID: {
              VALUES: [
                {
                  DISPLAY: "Did not attend school",
                  VALUE: "2"
                },
                {
                  DISPLAY: "Year 8 or Below",
                  VALUE: "8"
                },
                {
                  DISPLAY: "Year 9",
                  VALUE: "9"
                },
                {
                  DISPLAY: "Year 10",
                  VALUE: "10"
                },
                {
                  DISPLAY: "Year 11",
                  VALUE: "11"
                },
                {
                  DISPLAY: "Year 12",
                  VALUE: "12"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                hide_high_school_fields_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_high_school_fields",
                  VALUE_RESTRICTION: "2"
                },
                show_high_school_fields_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields",
                  VALUE_RESTRICTION: "12"
                },
                show_high_school_fields8_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields8",
                  VALUE_RESTRICTION: "8"
                },
                show_high_school_fields9_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields9",
                  VALUE_RESTRICTION: "9"
                },
                show_high_school_fields10_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields10",
                  VALUE_RESTRICTION: "10"
                },
                show_high_school_fields11_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields11",
                  VALUE_RESTRICTION: "11"
                }
              },
              ID: "HIGHESTSCHOOLLEVELID",
              DISPLAY: "What is your highest completed school level?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "If you are currently enrolled in secondary education, the Highest school level completed refers to the highest school level you have actually completed and not the level you are currently undertaking. For example, if you are currently in Year 10 the Highest school level completed is Year 9.",
              INFO_ONLY: false
            },
            HIGHESTSCHOOLLEVELYEAR: {
              EVENTS: {
                hide_high_school_fields: {
                  LISTENER: "hide_high_school_fields",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "HIGHESTSCHOOLLEVELID"
                },
                show_high_school_fields: {
                  LISTENER: "show_high_school_fields",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields8: {
                  LISTENER: "show_high_school_fields8",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields9: {
                  LISTENER: "show_high_school_fields9",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields10: {
                  LISTENER: "show_high_school_fields10",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "HIGHESTSCHOOLLEVELYEAR",
              DISPLAY: "Year Highest School Completed",
              TYPE: "text",
              TITLE: "YYYY",
              PATTERN: "[0-9]{4}",
              MAXLENGTH: "4",
              REQUIRED: false,
              TOOLTIP:
                "The calendar year that the highest level of schooling was completed.",
              INFO_ONLY: false,
              HIDE_INITIALLY: "visible"
            },
            ATSCHOOLFLAG: {
              VALUES: [
                {
                  DISPLAY: "Not Specified",
                  VALUE: ""
                },
                {
                  DISPLAY: "Yes",
                  VALUE: true
                },
                {
                  DISPLAY: "No",
                  VALUE: false
                }
              ],
              EVENTS: {
                hide_high_school_fields: {
                  LISTENER: "hide_high_school_fields",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "HIGHESTSCHOOLLEVELID"
                },
                show_high_school_fields: {
                  LISTENER: "show_high_school_fields",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields8: {
                  LISTENER: "show_high_school_fields8",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields9: {
                  LISTENER: "show_high_school_fields9",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields10: {
                  LISTENER: "show_high_school_fields10",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields11: {
                  LISTENER: "show_high_school_fields11",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "ATSCHOOLFLAG",
              DISPLAY:
                "Are you still enrolled in secondary or senior secondary education?",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "visible"
            },
            TertiaryEducationDetails: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "TertiaryEducationDetails",
              DISPLAY: "Previous qualifications achieved",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            PRIOREDUCATIONSTATUS: {
              VALUES: [
                {
                  DISPLAY: "Yes",
                  VALUE: true
                },
                {
                  DISPLAY: "No",
                  VALUE: false
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                show_prior_ed_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_prior_ed",
                  VALUE_RESTRICTION: "true"
                },
                hide_prior_ed_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_prior_ed",
                  VALUE_RESTRICTION: "false"
                }
              },
              ID: "PRIOREDUCATIONSTATUS",
              DISPLAY:
                "Have you successfully completed any post-secondary education?",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            PRIOREDUCATIONIDS: {
              VALUES: [
                {
                  DISPLAY: "Bachelor Degree or Higher Degree level",
                  VALUE: "008"
                },
                {
                  DISPLAY: "Advanced Diploma or Associate Degree Level",
                  VALUE: "410"
                },
                {
                  DISPLAY: "Diploma Level",
                  VALUE: "420"
                },
                {
                  DISPLAY: "Certificate IV",
                  VALUE: "511"
                },
                {
                  DISPLAY: "Certificate III",
                  VALUE: "514"
                },
                {
                  DISPLAY: "Certificate II",
                  VALUE: "521"
                },
                {
                  DISPLAY: "Certificate I",
                  VALUE: "524"
                },
                {
                  DISPLAY:
                    "Other education (including certificates or overseas qualifications not listed above)",
                  VALUE: "990"
                }
              ],
              EVENTS: {
                show_prior_ed: {
                  LISTENER: "show_prior_ed",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "PriorEducationStatus"
                },
                hide_prior_ed: {
                  LISTENER: "hide_prior_ed",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "PriorEducationStatus"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "PRIOREDUCATIONIDS",
              DISPLAY: "Prior Education",
              TYPE: "modifier-checkbox",
              REQUIRED: false,
              TOOLTIP: "Select any relevant prior education achieved.",
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              MODIFIERS: [
                {
                  VALUE: "",
                  DISPLAY: "Not Specified"
                },
                {
                  VALUE: "A",
                  DISPLAY: "Australian Qualification"
                },
                {
                  VALUE: "E",
                  DISPLAY: "Australian Equivalent"
                },
                {
                  VALUE: "I",
                  DISPLAY: "International"
                }
              ]
            }
          },
          FIELD_ORDER: [
            "SecondaryEdDetails",
            "HIGHESTSCHOOLLEVELID",
            "HIGHESTSCHOOLLEVELYEAR",
            "ATSCHOOLFLAG",
            "TertiaryEducationDetails",
            "PRIOREDUCATIONSTATUS",
            "PRIOREDUCATIONIDS"
          ]
        },
        contactSearch: {
          DISPLAY: "Active User",
          TYPE: "contact-search",
          ID: "contactSearch"
        },
        groupBooking: {
          DISPLAY: "Review Participants",
          TYPE: "group-booking",
          ID: "groupBooking",
          BLURB_BOTTOM:
            "When you have finished booking all participants, please continue to enrol."
        },
        enrolOptions: {
          DISPLAY: "Study Reason",
          TYPE: "enrol-details",
          FIELDS: {
            STUDYREASONID: {
              VALUES: [
                {
                  DISPLAY: "To get a job",
                  VALUE: 1
                },
                {
                  DISPLAY: "To develop my existing business",
                  VALUE: 2
                },
                {
                  DISPLAY: "To start my own business",
                  VALUE: 3
                },
                {
                  DISPLAY: "To try for a different career",
                  VALUE: 4
                },
                {
                  DISPLAY: "To get a better job or promotion",
                  VALUE: 5
                },
                {
                  DISPLAY: "It was a requirement of my job",
                  VALUE: 6
                },
                {
                  DISPLAY: "I wanted extra skills for my job",
                  VALUE: 7
                },
                {
                  DISPLAY: "To get into another course of study",
                  VALUE: 8
                },
                {
                  DISPLAY: "Other reasons",
                  VALUE: 11
                },
                {
                  DISPLAY: "For personal interest or self-development",
                  VALUE: 12
                },
                {
                  DISPLAY: "To get skills for community/voluntary work",
                  VALUE: 13
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "STUDYREASONID",
              DISPLAY:
                "Of the following categories, select the one which best describes the main reason you are undertaking this course?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "Select the value that best represents the reason for study.",
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["STUDYREASONID"],
          ID: "enrolOptions",
          HEADER: "Study Reason"
        },
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login",
          ID: "userLogin"
        },
        TermsConditions: {
          ID: "TermsConditions",
          DISPLAY: "Declaration",
          TYPE: "contact-note",
          noteCodeID: "88",
          emailTo: "",
          FIELDS: {
            TermAgreement: {
              VALUES: [
                {
                  DISPLAY:
                    "I declare that the information I have provided to the best of my knowledge is true and correct. I consent to the collection, use and disclosure of my personal information in accordance with the Privacy Notice above.",
                  VALUE: "Agreed"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "TermAgreement",
              DISPLAY: "Do you agree?",
              TYPE: "flip-switch",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true,
              FS_ONTEXT: "You have agreed",
              FS_OFFTEXT: "Click here to agree"
            },
            StudentSignature: {
              ID: "StudentSignature",
              TYPE: "signature",
              DISPLAY: "Signature",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: true,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["TermAgreement", "StudentSignature"],
          BUTTON_TEXT: "Continue",
          BLURB_TOP:
            "I agree that the information I have provided is to the best of my knowledge true."
        }
      },
      step_order: [
        "userLogin",
        "contactSearch",
        "contactGeneral",
        "ContactDetails",
        "contactAddress",
        "emergencyContact",
        "contactAvetmiss",
        "EducationalHistory",
        "AdditionalDetails",
        "enrolOptions",
        "TermsConditions",
        "review",
        "groupBooking",
        "billing"
      ],
      config_name: "Accredited Enrolment - Group",
      allow_learners: true,
      stylesheet: "enrol_minimal.css",
      group_booking: true,
      step_layout: "left",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      enrolment_response_text:
        "Enrolment was successfully completed. A confirmation will be sent to the student along with an invoice / receipt, if generated.",
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: true,
      disable_on_complete: true,
      add_purchase_order: false,
      allow_free_bookings: true,
      always_free_bookings: false,
      always_suppress_notifications: false,
      request_signature: false,
      enquiry_on_tentative: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      invoice_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      complete_step_events: false,
      use_display_select_placeholder: false,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: true,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: false,
      payer_australia_only: false,
      enquiry_single_click: false,
      enquiry_complete_events: false,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true,
      payment_flow: false,
      sync_with_class_schedule: false
    }
  },
  SHORT_COURSE: {
    DISPLAY: "Basic Enrolment - Single",
    ID: "SHORT_COURSE",
    CONFIG: {
      enroller_steps: {
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login"
        },
        contactGeneral: {
          ID: "contactGeneral",
          DISPLAY: "General Details",
          TYPE: "contact-update",
          FIELDS: {
            PersonalDetails: {
              ID: "PersonalDetails",
              TYPE: "information",
              DISPLAY: "Personal Details",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: false,
              INFO_ONLY: true
            },
            TitleEntry: {
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "Other"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                CopyMr_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMr",
                  VALUE_RESTRICTION: "Mr"
                },
                CopyMrs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMrs",
                  VALUE_RESTRICTION: "Mrs"
                },
                CopyMiss_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMiss",
                  VALUE_RESTRICTION: "Miss"
                },
                CopyMs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMs",
                  VALUE_RESTRICTION: "Ms"
                },
                ShowOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "ShowOther",
                  VALUE_RESTRICTION: "Other"
                },
                MrHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrHide",
                  VALUE_RESTRICTION: "Mr"
                },
                MrsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrsHide",
                  VALUE_RESTRICTION: "Mrs"
                },
                MsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MsHide",
                  VALUE_RESTRICTION: "Ms"
                },
                MissHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MissHide",
                  VALUE_RESTRICTION: "Miss"
                },
                RemoveOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "RemoveOther",
                  VALUE_RESTRICTION: "Other"
                }
              },
              ID: "TitleEntry",
              DISPLAY: "Title",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            TITLE: {
              EVENTS: {
                CopyMrs: {
                  LISTENER: "CopyMrs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMs: {
                  LISTENER: "CopyMs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMiss: {
                  LISTENER: "CopyMiss",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMr: {
                  LISTENER: "CopyMr",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                ShowOther: {
                  LISTENER: "ShowOther",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "TitleEntry"
                },
                MissHide: {
                  LISTENER: "MissHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrHide: {
                  LISTENER: "MrHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrsHide: {
                  LISTENER: "MrsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MsHide: {
                  LISTENER: "MsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                RemoveOther: {
                  LISTENER: "RemoveOther",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "blank"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "TITLE",
              DISPLAY: "Please enter your title",
              TYPE: "text",
              MAXLENGTH: "10",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Other",
                  VALUE: ""
                }
              ],
              DYNAMIC: true
            },
            blank: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "blank",
              DISPLAY: "Hidden blank field for removing title value",
              TYPE: "text",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            GIVENNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "GIVENNAME",
              DISPLAY: "Given Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            MIDDLENAME: {
              TYPE: "text",
              DISPLAY: "Middle Name",
              MAXLENGTH: 40
            },
            SURNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SURNAME",
              DISPLAY: "Last Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            DOB: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DOB",
              DISPLAY: "Date Of Birth",
              TYPE: "date",
              REQUIRED: true,
              INFO_ONLY: false
            },
            USI: {
              TYPE: "text",
              DISPLAY: "Unique Student Identifier",
              PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
              MAXLENGTH: 10,
              TITLE: "10 Characters no 1, 0, O or I",
              TOOLTIP:
                "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
            },
            SEX: {
              VALUES: [
                {
                  DISPLAY: "Male",
                  VALUE: "M"
                },
                {
                  DISPLAY: "Female",
                  VALUE: "F"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "X"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SEX",
              DISPLAY: "Gender",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            "Contact Details": {
              ID: "Contact Details",
              TYPE: "information",
              DISPLAY: "Contact Details",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: false,
              INFO_ONLY: true
            },
            EMAILADDRESS: {
              TYPE: "email",
              DISPLAY: "Email",
              REQUIRED: true,
              TOOLTIP: "A contact email address",
              MAXLENGTH: 60
            },
            MOBILEPHONE: {
              TYPE: "text",
              DISPLAY: "Mobile",
              MAXLENGTH: "10",
              PATTERN: "[0-9]{10}",
              TITLE:
                "Mobile numbers must be numeric, 10 characters and contain no spaces.",
              ID: "MOBILEPHONE",
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: true,
              INFO_ONLY: false
            },
            WORKPHONE: {
              TYPE: "text",
              DISPLAY: "Work Phone",
              MAXLENGTH: 20
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            POSITION: {
              TYPE: "text",
              DISPLAY: "Position",
              TOOLTIP: "The Job Title / Position held by the student",
              MAXLENGTH: 60
            }
          },
          FIELD_ORDER: [
            "PersonalDetails",
            "TitleEntry",
            "TITLE",
            "blank",
            "GIVENNAME",
            "MIDDLENAME",
            "SURNAME",
            "DOB",
            "USI",
            "SEX",
            "Contact Details",
            "EMAILADDRESS",
            "MOBILEPHONE",
            "WORKPHONE",
            "ORGANISATION",
            "POSITION"
          ]
        },
        review: {
          DISPLAY: "Review Details",
          TYPE: "review",
          ID: "review"
        },
        billing: {
          DISPLAY: "Billing",
          TYPE: "enrol",
          paymentMethods: {
            DISPLAY: "Payment Method",
            VALUES: [
              {
                VALUE: "invoice",
                DISPLAY: "Invoice"
              },
              {
                VALUE: "payment",
                DISPLAY: "Credit Card Payment"
              },
              {
                VALUE: "tentative",
                DISPLAY: "Tentative Enrolment"
              }
            ],
            TYPE: "select"
          },
          ID: "billing"
        }
      },
      step_order: ["userLogin", "contactGeneral", "review", "billing"],
      config_name: "Basic Enrolment - Single",
      step_layout: "left",
      stylesheet: "enrol_flat.css",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_learners: true,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      enrolment_response_text:
        "Enrolment was successfully completed. A confirmation will be sent to the student along with an invoice / receipt, if generated.",
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: true,
      disable_on_complete: true,
      group_booking: false,
      allow_free_bookings: true,
      always_free_bookings: false,
      always_suppress_notifications: false,
      request_signature: false,
      enquiry_on_tentative: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      add_purchase_order: false,
      invoice_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      complete_step_events: false,
      use_display_select_placeholder: true,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: false,
      payment_flow: false,
      sync_with_class_schedule: false,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: false,
      payer_australia_only: false,
      enquiry_single_click: false,
      enquiry_complete_events: false,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true
    }
  },
  ACCREDITED_SINGLE: {
    DISPLAY: "Accredited Enrolment - Single",
    ID: "ACCREDITED_SINGLE",
    CONFIG: {
      enroller_steps: {
        contactGeneral: {
          ID: "contactGeneral",
          DISPLAY: "Personal Details",
          TYPE: "contact-update",
          FIELDS: {
            TitleEntry: {
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "Other"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                CopyMr_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMr",
                  VALUE_RESTRICTION: "Mr"
                },
                CopyMrs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMrs",
                  VALUE_RESTRICTION: "Mrs"
                },
                CopyMiss_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMiss",
                  VALUE_RESTRICTION: "Miss"
                },
                CopyMs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMs",
                  VALUE_RESTRICTION: "Ms"
                },
                ShowOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "ShowOther",
                  VALUE_RESTRICTION: "Other"
                },
                MrHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrHide",
                  VALUE_RESTRICTION: "Mr"
                },
                MrsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrsHide",
                  VALUE_RESTRICTION: "Mrs"
                },
                MsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MsHide",
                  VALUE_RESTRICTION: "Ms"
                },
                MissHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MissHide",
                  VALUE_RESTRICTION: "Miss"
                },
                RemoveOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "RemoveOther",
                  VALUE_RESTRICTION: "Other"
                }
              },
              ID: "TitleEntry",
              DISPLAY: "Title",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            TITLE: {
              EVENTS: {
                CopyMrs: {
                  LISTENER: "CopyMrs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMs: {
                  LISTENER: "CopyMs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMiss: {
                  LISTENER: "CopyMiss",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMr: {
                  LISTENER: "CopyMr",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                ShowOther: {
                  LISTENER: "ShowOther",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "TitleEntry"
                },
                MissHide: {
                  LISTENER: "MissHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrHide: {
                  LISTENER: "MrHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrsHide: {
                  LISTENER: "MrsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MsHide: {
                  LISTENER: "MsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                RemoveOther: {
                  LISTENER: "RemoveOther",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "blank"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "TITLE",
              DISPLAY: "Please enter your title",
              TYPE: "text",
              MAXLENGTH: "10",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Other",
                  VALUE: ""
                }
              ],
              DYNAMIC: true
            },
            blank: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "blank",
              DISPLAY: "Hidden blank field for removing title value",
              TYPE: "text",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            GIVENNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "GIVENNAME",
              DISPLAY: "Given Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            PREFERREDNAME: {
              TYPE: "text",
              DISPLAY: "Preferred Name",
              MAXLENGTH: 30
            },
            MIDDLENAME: {
              TYPE: "text",
              DISPLAY: "Middle Name",
              MAXLENGTH: 40
            },
            SURNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SURNAME",
              DISPLAY: "Last Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            DOB: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DOB",
              DISPLAY: "Date Of Birth",
              TYPE: "date",
              REQUIRED: true,
              INFO_ONLY: false
            },
            USI: {
              TYPE: "text",
              DISPLAY: "Unique Student Identifier",
              PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
              MAXLENGTH: 10,
              TITLE: "10 Characters no 1, 0, O or I",
              TOOLTIP:
                "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
            },
            SEX: {
              VALUES: [
                {
                  DISPLAY: "Male",
                  VALUE: "M"
                },
                {
                  DISPLAY: "Female",
                  VALUE: "F"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "X"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SEX",
              DISPLAY: "Gender",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "TitleEntry",
            "TITLE",
            "blank",
            "GIVENNAME",
            "PREFERREDNAME",
            "MIDDLENAME",
            "SURNAME",
            "DOB",
            "USI",
            "SEX"
          ],
          HEADER: "Personal Details"
        },
        contactAvetmiss: {
          ID: "contactAvetmiss",
          DISPLAY: "Nationality ",
          TYPE: "contact-update",
          FIELDS: {
            CitizenshipDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "CitizenshipDetailsInfo",
              DISPLAY: "Citizenship",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            COUNTRYOFBIRTHID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "COUNTRYOFBIRTHID",
              DISPLAY: "Country Of Birth",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            CITIZENSTATUSID: {
              VALUES: [
                {
                  DISPLAY: "Australian Citizen",
                  VALUE: 1
                },
                {
                  DISPLAY: "New Zealand Citizen",
                  VALUE: 2
                },
                {
                  DISPLAY: "Australian Permanent Resident",
                  VALUE: 3
                },
                {
                  DISPLAY: "Student Visa",
                  VALUE: 4
                },
                {
                  DISPLAY: "Temporary Resident Visa",
                  VALUE: 5
                },
                {
                  DISPLAY: "Visitor's Visa",
                  VALUE: 6
                },
                {
                  DISPLAY: "Business Visa",
                  VALUE: 7
                },
                {
                  DISPLAY: "Holiday Visa",
                  VALUE: 8
                },
                {
                  DISPLAY: "Other Visa",
                  VALUE: 9
                },
                {
                  DISPLAY: "Permanent Humanitarian Visa",
                  VALUE: 10
                },
                {
                  DISPLAY: "Overseas - No Visa or Citizenship",
                  VALUE: 11
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "CITIZENSTATUSID",
              DISPLAY: "Citizenship Status",
              TYPE: "search-select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            COUNTRYOFCITIZENID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "COUNTRYOFCITIZENID",
              DISPLAY: "Country Of Citizenship",
              TYPE: "search-select",
              REQUIRED: false
            },
            LanguageDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "LanguageDetailsInfo",
              DISPLAY: "Language",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            LanguageOtherThanEnglish: {
              VALUES: [
                {
                  DISPLAY: "Yes",
                  VALUE: "Yes"
                },
                {
                  DISPLAY: "No",
                  VALUE: "1201"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                copyLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "copyLanguage",
                  VALUE_RESTRICTION: "1201"
                },
                hideLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hideLanguage",
                  VALUE_RESTRICTION: "1201"
                },
                showLanguage_change: {
                  TRIGGER_ON: "change",
                  EVENT: "showLanguage",
                  VALUE_RESTRICTION: "Yes"
                }
              },
              ID: "LanguageOtherThanEnglish",
              DISPLAY: "Do you speak a language other than english at home?",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            MAINLANGUAGEID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {
                copyLanguage: {
                  LISTENER: "copyLanguage",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "LanguageOtherThanEnglish"
                },
                hideLanguage: {
                  LISTENER: "hideLanguage",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "GIVENNAME"
                },
                showLanguage: {
                  LISTENER: "showLanguage",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "MAINLANGUAGEID",
              DISPLAY: "Language spoken most often",
              TYPE: "search-select",
              REQUIRED: false,
              TOOLTIP:
                "If you speak more than one language, please indicate the one that is spoken most often",
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            ENGLISHPROFICIENCYID: {
              TYPE: "select",
              DISPLAY: "English Proficiency",
              TOOLTIP: "How well you speak English.",
              VALUES: [
                {
                  VALUE: "",
                  DISPLAY: "Not Specified"
                },
                {
                  VALUE: 1,
                  DISPLAY: "Very Well"
                },
                {
                  VALUE: 2,
                  DISPLAY: "Well"
                },
                {
                  VALUE: 3,
                  DISPLAY: "Not Well"
                },
                {
                  VALUE: 4,
                  DISPLAY: "Not at all"
                }
              ]
            }
          },
          FIELD_ORDER: [
            "CitizenshipDetailsInfo",
            "COUNTRYOFBIRTHID",
            "CITIZENSTATUSID",
            "COUNTRYOFCITIZENID",
            "LanguageDetailsInfo",
            "LanguageOtherThanEnglish",
            "MAINLANGUAGEID",
            "ENGLISHPROFICIENCYID"
          ]
        },
        contactAddress: {
          ID: "contactAddress",
          DISPLAY: "Address",
          TYPE: "contact-update",
          FIELDS: {
            streetAddress: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "streetAddress",
              DISPLAY: "Usual Residential Address",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            ResidenceInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "ResidenceInfo",
              DISPLAY:
                "Please provide the physical address (street number and name not post office box) where you usually reside rather than any temporary address at which you reside for training, work or other purposes before returning to your home.  If you are from a rural area use the address from your state or territory’s ‘rural property addressing’ or ‘numbering’ system as your residential street address. ",
              TYPE: "info_expandable",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false
            },
            SBUILDINGNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SBUILDINGNAME",
              DISPLAY: "Building/property name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              TOOLTIP:
                "Building/property name is the official place name or common usage name for an address site, including the name of a building, Aboriginal community, homestead, building complex, agricultural property, park or unbounded address site.",
              INFO_ONLY: false
            },
            SUNITNO: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SUNITNO",
              DISPLAY: "Flat/unit details",
              TYPE: "text",
              MAXLENGTH: "30",
              REQUIRED: false,
              INFO_ONLY: false
            },
            SSTREETNO: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTREETNO",
              DISPLAY: "Street or lot number",
              TYPE: "text",
              MAXLENGTH: "15",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SSTREETNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTREETNAME",
              DISPLAY: "Street Name",
              TYPE: "text",
              MAXLENGTH: "70",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SPOBOX: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SPOBOX",
              DISPLAY: "Street Address - Postal delivery information (PO box)",
              TYPE: "text",
              MAXLENGTH: "22",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            SCITY: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SCITY",
              DISPLAY: "Suburb, locality or town",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SPOSTCODE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SPOSTCODE",
              DISPLAY: "Postcode",
              TYPE: "text",
              MAXLENGTH: "10",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SSTATE: {
              VALUES: [
                {
                  DISPLAY: "NSW",
                  VALUE: "NSW"
                },
                {
                  DISPLAY: "VIC",
                  VALUE: "VIC"
                },
                {
                  DISPLAY: "QLD",
                  VALUE: "QLD"
                },
                {
                  DISPLAY: "SA",
                  VALUE: "SA"
                },
                {
                  DISPLAY: "WA",
                  VALUE: "WA"
                },
                {
                  DISPLAY: "TAS",
                  VALUE: "TAS"
                },
                {
                  DISPLAY: "NT",
                  VALUE: "NT"
                },
                {
                  DISPLAY: "ACT",
                  VALUE: "ACT"
                },
                {
                  DISPLAY: "Other Australian Territory",
                  VALUE: "OTH"
                },
                {
                  DISPLAY: "Overseas",
                  VALUE: "OVS"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SSTATE",
              DISPLAY: "State/Territory",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            SCOUNTRYID: {
              VALUES: [
                {
                  DISPLAY: "notset",
                  VALUE: ""
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SCOUNTRYID",
              DISPLAY: "Country",
              TYPE: "search-select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            addressStreetSame: {
              EVENTS: {},
              TRIGGER_EVENTS: {
                postal_copy_click: {
                  TRIGGER_ON: "click",
                  EVENT: "postal_copy",
                  VALUE_RESTRICTION: ""
                }
              },
              ID: "addressStreetSame",
              DISPLAY: "Copy Residential Address to Postal",
              TYPE: "button",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true,
              FS_OFFTEXT: "Same as Street Address?",
              FS_ONTEXT: "Matches Street Address"
            },
            postalAddress: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "postalAddress",
              DISPLAY: "Postal Address",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            BUILDINGNAME: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SBUILDINGNAME"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "BUILDINGNAME",
              DISPLAY: "Building/property name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              TOOLTIP:
                "Building/property name is the official place name or common usage name for an address site, including the name of a building, Aboriginal community, homestead, building complex, agricultural property, park or unbounded address site.",
              INFO_ONLY: false
            },
            UNITNO: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SUNITNO"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "UNITNO",
              DISPLAY: "Flat/Unit details",
              TYPE: "text",
              MAXLENGTH: "30",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STREETNO: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTREETNO"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STREETNO",
              DISPLAY: "Street or lot number",
              TYPE: "text",
              MAXLENGTH: "15",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STREETNAME: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTREETNAME"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STREETNAME",
              DISPLAY: "Street Name",
              TYPE: "text",
              MAXLENGTH: "70",
              REQUIRED: false,
              INFO_ONLY: false
            },
            POBOX: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SPOBOX"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "POBOX",
              DISPLAY: "Postal delivery information (PO box)",
              TYPE: "text",
              MAXLENGTH: "22",
              REQUIRED: false,
              INFO_ONLY: false
            },
            CITY: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SCITY"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "CITY",
              DISPLAY: "Suburb, locality or town",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            STATE: {
              VALUES: [
                {
                  DISPLAY: "NSW",
                  VALUE: "NSW"
                },
                {
                  DISPLAY: "VIC",
                  VALUE: "VIC"
                },
                {
                  DISPLAY: "QLD",
                  VALUE: "QLD"
                },
                {
                  DISPLAY: "SA",
                  VALUE: "SA"
                },
                {
                  DISPLAY: "WA",
                  VALUE: "WA"
                },
                {
                  DISPLAY: "TAS",
                  VALUE: "TAS"
                },
                {
                  DISPLAY: "NT",
                  VALUE: "NT"
                },
                {
                  DISPLAY: "ACT",
                  VALUE: "ACT"
                },
                {
                  DISPLAY: "Other Australian Territory",
                  VALUE: "OTH"
                },
                {
                  DISPLAY: "Overseas",
                  VALUE: "OVS"
                }
              ],
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SSTATE"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "STATE",
              DISPLAY: "State/Territory",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            POSTCODE: {
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SPOSTCODE"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "POSTCODE",
              DISPLAY: "Postcode",
              TYPE: "text",
              MAXLENGTH: "10",
              PATTERN: "^[0-9]*",
              TITLE: "Please enter a numerical value",
              REQUIRED: false,
              INFO_ONLY: false
            },
            COUNTRYID: {
              VALUES: [
                {
                  DISPLAY: "notset",
                  VALUE: ""
                }
              ],
              EVENTS: {
                postal_copy: {
                  LISTENER: "postal_copy",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "SCOUNTRYID"
                },
                postal_toggle: {
                  LISTENER: "postal_toggle",
                  EVENT_ACTION: "toggle",
                  TARGET_FIELD: "COUNTRYID"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "COUNTRYID",
              DISPLAY: "Country",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "streetAddress",
            "ResidenceInfo",
            "SBUILDINGNAME",
            "SUNITNO",
            "SSTREETNO",
            "SSTREETNAME",
            "SPOBOX",
            "SCITY",
            "SPOSTCODE",
            "SSTATE",
            "SCOUNTRYID",
            "addressStreetSame",
            "postalAddress",
            "BUILDINGNAME",
            "UNITNO",
            "STREETNO",
            "STREETNAME",
            "POBOX",
            "CITY",
            "STATE",
            "POSTCODE",
            "COUNTRYID"
          ]
        },
        emergencyContact: {
          ID: "emergencyContact",
          DISPLAY: "Emergency Contact",
          TYPE: "contact-update",
          FIELDS: {
            EMERGENCYCONTACT: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACT",
              DISPLAY: "Contact Name",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            EMERGENCYCONTACTRELATION: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACTRELATION",
              DISPLAY: "Relationship",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            },
            EMERGENCYCONTACTPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMERGENCYCONTACTPHONE",
              DISPLAY: "Contact Number",
              TYPE: "text",
              MAXLENGTH: "50",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "EMERGENCYCONTACT",
            "EMERGENCYCONTACTRELATION",
            "EMERGENCYCONTACTPHONE"
          ],
          HEADER: "Emergency Contact "
        },
        review: {
          DISPLAY: "Review Details",
          TYPE: "review",
          ID: "review"
        },
        billing: {
          DISPLAY: "Billing",
          TYPE: "enrol",
          paymentMethods: {
            DISPLAY: "Payment Method",
            VALUES: [
              {
                VALUE: "invoice",
                DISPLAY: "Invoice"
              },
              {
                VALUE: "payment",
                DISPLAY: "Credit Card Payment"
              }
            ],
            TYPE: "select"
          },
          ID: "billing"
        },
        ContactDetails: {
          ID: "ContactDetails",
          DISPLAY: "Contact Details",
          TYPE: "contact-update",
          FIELDS: {
            EMAILADDRESS: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EMAILADDRESS",
              DISPLAY: "Email",
              TYPE: "email",
              MAXLENGTH: "60",
              REQUIRED: true,
              TOOLTIP: "A contact email address",
              INFO_ONLY: false
            },
            EMAILADDRESSALTERNATIVE: {
              TYPE: "email",
              DISPLAY: "Alternative email address ",
              REQUIRED: false,
              TOOLTIP: "A contact email address",
              MAXLENGTH: 60
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            POSITION: {
              TYPE: "text",
              DISPLAY: "Position",
              TOOLTIP: "The Job Title / Position held by the student",
              MAXLENGTH: 60
            },
            MOBILEPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "MOBILEPHONE",
              DISPLAY: "Mobile",
              TYPE: "text",
              TITLE:
                "Mobile numbers must be numeric, 10 characters and contain no spaces.",
              PATTERN: "[0-9]{10}",
              MAXLENGTH: "10",
              REQUIRED: true,
              INFO_ONLY: false
            },
            PHONE: {
              TYPE: "text",
              DISPLAY: "Home Phone",
              MAXLENGTH: 20
            },
            WORKPHONE: {
              TYPE: "text",
              DISPLAY: "Work Phone",
              MAXLENGTH: 20
            }
          },
          FIELD_ORDER: [
            "EMAILADDRESS",
            "EMAILADDRESSALTERNATIVE",
            "ORGANISATION",
            "POSITION",
            "MOBILEPHONE",
            "PHONE",
            "WORKPHONE"
          ],
          HEADER: "Contact Details"
        },
        AdditionalDetails: {
          ID: "AdditionalDetails",
          DISPLAY: "Additional Details",
          TYPE: "contact-update",
          FIELDS: {
            DisabilityDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DisabilityDetailsInfo",
              DISPLAY: "Disabilities",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            DISABILITYFLAG: {
              VALUES: [
                {
                  DISPLAY: "No",
                  VALUE: false
                },
                {
                  DISPLAY: "Yes",
                  VALUE: true
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                hide_disabilities_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_disabilities",
                  VALUE_RESTRICTION: "false"
                },
                show_disabilities_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_disabilities",
                  VALUE_RESTRICTION: "true"
                }
              },
              ID: "DISABILITYFLAG",
              DISPLAY:
                "Do you consider yourself to have a disability, impairment or long-term condition? ",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false,
              TOOLTIP: null
            },
            DISABILITYTYPEIDS: {
              VALUES: [
                {
                  DISPLAY: "Hearing / Deafness",
                  VALUE: "11"
                },
                {
                  DISPLAY: "Physical",
                  VALUE: "12"
                },
                {
                  DISPLAY: "Intellectual",
                  VALUE: "13"
                },
                {
                  DISPLAY: "Learning",
                  VALUE: "14"
                },
                {
                  DISPLAY: "Mental illness",
                  VALUE: "15"
                },
                {
                  DISPLAY: "Acquired Brain Impairment",
                  VALUE: "16"
                },
                {
                  DISPLAY: "Vision",
                  VALUE: "17"
                },
                {
                  DISPLAY: "Medical condition",
                  VALUE: "18"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "19"
                }
              ],
              EVENTS: {
                show_disabilities: {
                  LISTENER: "show_disabilities",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "disabilityQuestion"
                },
                hide_disabilities: {
                  LISTENER: "hide_disabilities",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "disabilityQuestion"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "DISABILITYTYPEIDS",
              DISPLAY:
                "If you indicated the presence of a disability, impairment or long-term condition, please select the area(s) in the following list",
              TYPE: "checkbox",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              TOOLTIP: null
            },
            AdditionalDetailsInfo: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "AdditionalDetailsInfo",
              DISPLAY: "Additional Details",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            INDIGENOUSSTATUSID: {
              VALUES: [
                {
                  DISPLAY: "No",
                  VALUE: 4
                },
                {
                  DISPLAY: "Aboriginal",
                  VALUE: 1
                },
                {
                  DISPLAY: "Torres Strait Islander",
                  VALUE: 2
                },
                {
                  DISPLAY: "Aboriginal & Torres Strait Islander",
                  VALUE: 3
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "INDIGENOUSSTATUSID",
              DISPLAY: "Indigenous Status",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false
            },
            LABOURFORCEID: {
              VALUES: [
                {
                  DISPLAY: "Full-time employee",
                  VALUE: 1
                },
                {
                  DISPLAY: "Part-time employee",
                  VALUE: 2
                },
                {
                  DISPLAY: "Self-employed - not employing others",
                  VALUE: 3
                },
                {
                  DISPLAY: "Self-employed - employing others",
                  VALUE: "4"
                },
                {
                  DISPLAY: "Employed - unpaid worker in a family business",
                  VALUE: 5
                },
                {
                  DISPLAY: "Unemployed - Seeking full-time work",
                  VALUE: 6
                },
                {
                  DISPLAY: "Unemployed - Seeking part-time work",
                  VALUE: 7
                },
                {
                  DISPLAY: "Unemployed - Not Seeking employment",
                  VALUE: 8
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "LABOURFORCEID",
              DISPLAY:
                "Of the following categories, which best describes your current employment status?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "For casual, seasonal, contract and shift work, use the current number of hours worked per week to determine whether full time (35 hours or more per week) or part-time employed (less than 35 hours per week).",
              INFO_ONLY: false
            },
            SOURCECODEID: {
              DYNAMIC: true,
              VALUES: [],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SOURCECODEID",
              DISPLAY: "How did you hear about us?",
              TYPE: "search-select",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: [
            "DisabilityDetailsInfo",
            "DISABILITYFLAG",
            "DISABILITYTYPEIDS",
            "AdditionalDetailsInfo",
            "INDIGENOUSSTATUSID",
            "LABOURFORCEID",
            "SOURCECODEID"
          ]
        },
        EducationalHistory: {
          ID: "EducationalHistory",
          DISPLAY: "Schooling",
          TYPE: "contact-update",
          FIELDS: {
            SecondaryEdDetails: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SecondaryEdDetails",
              DISPLAY: "Secondary Education",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            HIGHESTSCHOOLLEVELID: {
              VALUES: [
                {
                  DISPLAY: "Did not attend school",
                  VALUE: "2"
                },
                {
                  DISPLAY: "Year 8 or Below",
                  VALUE: "8"
                },
                {
                  DISPLAY: "Year 9",
                  VALUE: "9"
                },
                {
                  DISPLAY: "Year 10",
                  VALUE: "10"
                },
                {
                  DISPLAY: "Year 11",
                  VALUE: "11"
                },
                {
                  DISPLAY: "Year 12",
                  VALUE: "12"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                hide_high_school_fields_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_high_school_fields",
                  VALUE_RESTRICTION: "2"
                },
                show_high_school_fields_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields",
                  VALUE_RESTRICTION: "12"
                },
                show_high_school_fields8_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields8",
                  VALUE_RESTRICTION: "8"
                },
                show_high_school_fields9_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields9",
                  VALUE_RESTRICTION: "9"
                },
                show_high_school_fields10_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields10",
                  VALUE_RESTRICTION: "10"
                },
                show_high_school_fields11_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_high_school_fields11",
                  VALUE_RESTRICTION: "11"
                }
              },
              ID: "HIGHESTSCHOOLLEVELID",
              DISPLAY: "What is your highest completed school level?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "If you are currently enrolled in secondary education, the Highest school level completed refers to the highest school level you have actually completed and not the level you are currently undertaking. For example, if you are currently in Year 10 the Highest school level completed is Year 9.",
              INFO_ONLY: false
            },
            HIGHESTSCHOOLLEVELYEAR: {
              EVENTS: {
                hide_high_school_fields: {
                  LISTENER: "hide_high_school_fields",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "HIGHESTSCHOOLLEVELID"
                },
                show_high_school_fields: {
                  LISTENER: "show_high_school_fields",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields8: {
                  LISTENER: "show_high_school_fields8",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields9: {
                  LISTENER: "show_high_school_fields9",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields10: {
                  LISTENER: "show_high_school_fields10",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "HIGHESTSCHOOLLEVELYEAR",
              DISPLAY: "Year Highest School Completed",
              TYPE: "text",
              TITLE: "YYYY",
              PATTERN: "[0-9]{4}",
              MAXLENGTH: "4",
              REQUIRED: false,
              TOOLTIP:
                "The calendar year that the highest level of schooling was completed.",
              INFO_ONLY: false,
              HIDE_INITIALLY: "visible"
            },
            ATSCHOOLFLAG: {
              VALUES: [
                {
                  DISPLAY: "Not Specified",
                  VALUE: ""
                },
                {
                  DISPLAY: "Yes",
                  VALUE: true
                },
                {
                  DISPLAY: "No",
                  VALUE: false
                }
              ],
              EVENTS: {
                hide_high_school_fields: {
                  LISTENER: "hide_high_school_fields",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "HIGHESTSCHOOLLEVELID"
                },
                show_high_school_fields: {
                  LISTENER: "show_high_school_fields",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields8: {
                  LISTENER: "show_high_school_fields8",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields9: {
                  LISTENER: "show_high_school_fields9",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields10: {
                  LISTENER: "show_high_school_fields10",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                },
                show_high_school_fields11: {
                  LISTENER: "show_high_school_fields11",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "GIVENNAME"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "ATSCHOOLFLAG",
              DISPLAY:
                "Are you still enrolled in secondary or senior secondary education?",
              TYPE: "select",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "visible"
            },
            TertiaryEducationDetails: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "TertiaryEducationDetails",
              DISPLAY: "Previous qualifications achieved",
              TYPE: "information",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: true
            },
            PRIOREDUCATIONSTATUS: {
              VALUES: [
                {
                  DISPLAY: "Yes",
                  VALUE: true
                },
                {
                  DISPLAY: "No",
                  VALUE: false
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                show_prior_ed_change: {
                  TRIGGER_ON: "change",
                  EVENT: "show_prior_ed",
                  VALUE_RESTRICTION: "true"
                },
                hide_prior_ed_change: {
                  TRIGGER_ON: "change",
                  EVENT: "hide_prior_ed",
                  VALUE_RESTRICTION: "false"
                }
              },
              ID: "PRIOREDUCATIONSTATUS",
              DISPLAY:
                "Have you successfully completed any post-secondary education?",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            PRIOREDUCATIONIDS: {
              VALUES: [
                {
                  DISPLAY: "Bachelor Degree or Higher Degree level",
                  VALUE: "008"
                },
                {
                  DISPLAY: "Advanced Diploma or Associate Degree Level",
                  VALUE: "410"
                },
                {
                  DISPLAY: "Diploma Level",
                  VALUE: "420"
                },
                {
                  DISPLAY: "Certificate IV",
                  VALUE: "511"
                },
                {
                  DISPLAY: "Certificate III",
                  VALUE: "514"
                },
                {
                  DISPLAY: "Certificate II",
                  VALUE: "521"
                },
                {
                  DISPLAY: "Certificate I",
                  VALUE: "524"
                },
                {
                  DISPLAY:
                    "Other education (including certificates or overseas qualifications not listed above)",
                  VALUE: "990"
                }
              ],
              EVENTS: {
                show_prior_ed: {
                  LISTENER: "show_prior_ed",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "PriorEducationStatus"
                },
                hide_prior_ed: {
                  LISTENER: "hide_prior_ed",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "PriorEducationStatus"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "PRIOREDUCATIONIDS",
              DISPLAY: "Prior Education",
              TYPE: "modifier-checkbox",
              REQUIRED: false,
              TOOLTIP: "Select any relevant prior education achieved.",
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              MODIFIERS: [
                {
                  VALUE: "",
                  DISPLAY: "Not Specified"
                },
                {
                  VALUE: "A",
                  DISPLAY: "Australian Qualification"
                },
                {
                  VALUE: "E",
                  DISPLAY: "Australian Equivalent"
                },
                {
                  VALUE: "I",
                  DISPLAY: "International"
                }
              ]
            }
          },
          FIELD_ORDER: [
            "SecondaryEdDetails",
            "HIGHESTSCHOOLLEVELID",
            "HIGHESTSCHOOLLEVELYEAR",
            "ATSCHOOLFLAG",
            "TertiaryEducationDetails",
            "PRIOREDUCATIONSTATUS",
            "PRIOREDUCATIONIDS"
          ]
        },
        enrolOptions: {
          DISPLAY: "Study Reason",
          TYPE: "enrol-details",
          FIELDS: {
            STUDYREASONID: {
              VALUES: [
                {
                  DISPLAY: "To get a job",
                  VALUE: 1
                },
                {
                  DISPLAY: "To develop my existing business",
                  VALUE: 2
                },
                {
                  DISPLAY: "To start my own business",
                  VALUE: 3
                },
                {
                  DISPLAY: "To try for a different career",
                  VALUE: 4
                },
                {
                  DISPLAY: "To get a better job or promotion",
                  VALUE: 5
                },
                {
                  DISPLAY: "It was a requirement of my job",
                  VALUE: 6
                },
                {
                  DISPLAY: "I wanted extra skills for my job",
                  VALUE: 7
                },
                {
                  DISPLAY: "To get into another course of study",
                  VALUE: 8
                },
                {
                  DISPLAY: "Other reasons",
                  VALUE: 11
                },
                {
                  DISPLAY: "For personal interest or self-development",
                  VALUE: 12
                },
                {
                  DISPLAY: "To get skills for community/voluntary work",
                  VALUE: 13
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "STUDYREASONID",
              DISPLAY:
                "Of the following categories, select the one which best describes the main reason you are undertaking this course?",
              TYPE: "select",
              REQUIRED: true,
              TOOLTIP:
                "Select the value that best represents the reason for study.",
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["STUDYREASONID"],
          ID: "enrolOptions",
          HEADER: "Study Reason"
        },
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login",
          ID: "userLogin"
        },
        TermsConditions: {
          ID: "TermsConditions",
          DISPLAY: "Declaration & Privacy Notice",
          TYPE: "contact-note",
          noteCodeID: "88",
          emailTo: "",
          FIELDS: {
            TermAgreement: {
              VALUES: [
                {
                  DISPLAY:
                    "I declare that the information I have provided to the best of my knowledge is true and correct. I consent to the collection, use and disclosure of my personal information in accordance with the Privacy Notice above.",
                  VALUE: "Agreed"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "TermAgreement",
              DISPLAY: "Student Declaration",
              TYPE: "flip-switch",
              CUSTOM: true,
              REQUIRED: true,
              INFO_ONLY: false,
              DYNAMIC: true,
              FS_ONTEXT: "You have agreed",
              FS_OFFTEXT: "Click here to agree"
            },
            StudentSignature: {
              ID: "StudentSignature",
              TYPE: "signature",
              DISPLAY: "Student Signature",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: true,
              INFO_ONLY: false
            },
            ParentSignature: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "ParentSignature",
              DISPLAY: "Parent/Guardian Signature",
              TYPE: "signature",
              CUSTOM: true,
              REQUIRED: false,
              TOOLTIP:
                "Parental/guardian consent is required for all students under the age of 18.",
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["TermAgreement", "StudentSignature", "ParentSignature"],
          BUTTON_TEXT: "Continue",
          BLURB_TOP:
            'Privacy Notice\n\nUnder the Data Provision Requirements 2012, [replace with RTO NAME] is required to collect personal information about you and to disclose that personal information to the National Centre for Vocational Education Research Ltd (NCVER).\n\nYour personal information (including the personal information contained on this enrolment form and your training activity data) may be used or disclosed by [replace with RTO NAME] for statistical, regulatory and research purposes. [replace with RTO NAME] may disclose your personal information for these purposes to third parties, including:\n\n<li>School – if you are a secondary student undertaking VET, including a school-based apprenticeship or traineeship;\n<li>Employer – if you are enrolled in training paid by your employer;\n<li>Commonwealth and State or Territory government departments and authorised agencies;\n<li>NCVER;\n<li>Organisations conducting student surveys; and\n<li>Researchers.</li>\n\nPersonal information disclosed to NCVER may be used or disclosed for the following purposes:\n\n<li>Issuing a VET Statement of Attainment or VET Qualification, and populating Authenticated VET Transcripts;\n<li>facilitating statistics and research relating to education, including surveys;\n<li>understanding how the VET market operates, for policy, workforce planning and consumer information; and\n<li>administering VET, including program administration, regulation, monitoring and evaluation.</li>\n\nYou may receive an NCVER student survey which may be administered by an NCVER employee, agent or third party contractor. You may opt out of the survey at the time of being contacted.\n\nNCVER will collect, hold, use and disclose your personal information in accordance with the Privacy Act 1988 (Cth), the VET Data Policy and all NCVER policies and protocols (including those published on NCVER’s website at <a href="http://www.ncver.edu.au" target="_blank">www.ncver.edu.au</a>).'
        }
      },
      step_order: [
        "userLogin",
        "contactGeneral",
        "ContactDetails",
        "contactAddress",
        "emergencyContact",
        "contactAvetmiss",
        "EducationalHistory",
        "AdditionalDetails",
        "enrolOptions",
        "TermsConditions",
        "review",
        "billing"
      ],
      config_name: "Accredited Enrolment - Single",
      allow_learners: true,
      stylesheet: "enrol_minimal.css",
      group_booking: false,
      step_layout: "left",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      enrolment_response_text:
        "Enrolment was successfully completed. A confirmation will be sent to the student along with an invoice / receipt, if generated.",
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: true,
      disable_on_complete: true,
      add_purchase_order: false,
      allow_free_bookings: true,
      always_free_bookings: false,
      always_suppress_notifications: false,
      request_signature: false,
      enquiry_on_tentative: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      invoice_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      complete_step_events: false,
      use_display_select_placeholder: false,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: true,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: false,
      payer_australia_only: false,
      enquiry_single_click: false,
      enquiry_complete_events: false,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true,
      payment_flow: false,
      sync_with_class_schedule: false
    }
  },
  GROUP_SHORT_COURSE: {
    DISPLAY: "Basic Enrolment - Group",
    ID: "GROUP_SHORT_COURSE",
    CONFIG: {
      enroller_steps: {
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login"
        },
        contactGeneral: {
          ID: "contactGeneral",
          DISPLAY: "General Details",
          TYPE: "contact-update",
          FIELDS: {
            PersonalDetails: {
              ID: "PersonalDetails",
              TYPE: "information",
              DISPLAY: "Personal Details",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: false,
              INFO_ONLY: true
            },
            TitleEntry: {
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "Other"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {
                CopyMr_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMr",
                  VALUE_RESTRICTION: "Mr"
                },
                CopyMrs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMrs",
                  VALUE_RESTRICTION: "Mrs"
                },
                CopyMiss_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMiss",
                  VALUE_RESTRICTION: "Miss"
                },
                CopyMs_change: {
                  TRIGGER_ON: "change",
                  EVENT: "CopyMs",
                  VALUE_RESTRICTION: "Ms"
                },
                ShowOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "ShowOther",
                  VALUE_RESTRICTION: "Other"
                },
                MrHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrHide",
                  VALUE_RESTRICTION: "Mr"
                },
                MrsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MrsHide",
                  VALUE_RESTRICTION: "Mrs"
                },
                MsHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MsHide",
                  VALUE_RESTRICTION: "Ms"
                },
                MissHide_change: {
                  TRIGGER_ON: "change",
                  EVENT: "MissHide",
                  VALUE_RESTRICTION: "Miss"
                },
                RemoveOther_change: {
                  TRIGGER_ON: "change",
                  EVENT: "RemoveOther",
                  VALUE_RESTRICTION: "Other"
                }
              },
              ID: "TitleEntry",
              DISPLAY: "Title",
              TYPE: "select",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              DYNAMIC: true
            },
            TITLE: {
              EVENTS: {
                CopyMrs: {
                  LISTENER: "CopyMrs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMs: {
                  LISTENER: "CopyMs",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMiss: {
                  LISTENER: "CopyMiss",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                CopyMr: {
                  LISTENER: "CopyMr",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "TitleEntry"
                },
                ShowOther: {
                  LISTENER: "ShowOther",
                  EVENT_ACTION: "show",
                  TARGET_FIELD: "TitleEntry"
                },
                MissHide: {
                  LISTENER: "MissHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrHide: {
                  LISTENER: "MrHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MrsHide: {
                  LISTENER: "MrsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                MsHide: {
                  LISTENER: "MsHide",
                  EVENT_ACTION: "hide",
                  TARGET_FIELD: "TitleEntry"
                },
                RemoveOther: {
                  LISTENER: "RemoveOther",
                  EVENT_ACTION: "clone",
                  TARGET_FIELD: "blank"
                }
              },
              TRIGGER_EVENTS: {},
              ID: "TITLE",
              DISPLAY: "Please enter your title",
              TYPE: "text",
              MAXLENGTH: "10",
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden",
              VALUES: [
                {
                  DISPLAY: "Mr",
                  VALUE: "Mr"
                },
                {
                  DISPLAY: "Mrs",
                  VALUE: "Mrs"
                },
                {
                  DISPLAY: "Ms",
                  VALUE: "Ms"
                },
                {
                  DISPLAY: "Miss",
                  VALUE: "Miss"
                },
                {
                  DISPLAY: "Other",
                  VALUE: ""
                }
              ],
              DYNAMIC: true
            },
            blank: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "blank",
              DISPLAY: "Hidden blank field for removing title value",
              TYPE: "text",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false,
              HIDE_INITIALLY: "hidden"
            },
            GIVENNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "GIVENNAME",
              DISPLAY: "Given Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            MIDDLENAME: {
              TYPE: "text",
              DISPLAY: "Middle Name",
              MAXLENGTH: 40
            },
            SURNAME: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SURNAME",
              DISPLAY: "Last Name",
              TYPE: "text",
              MAXLENGTH: "40",
              REQUIRED: true,
              INFO_ONLY: false
            },
            DOB: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "DOB",
              DISPLAY: "Date Of Birth",
              TYPE: "date",
              REQUIRED: true,
              INFO_ONLY: false
            },
            USI: {
              TYPE: "text",
              DISPLAY: "Unique Student Identifier",
              PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
              MAXLENGTH: 10,
              TITLE: "10 Characters no 1, 0, O or I",
              TOOLTIP:
                "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
            },
            SEX: {
              VALUES: [
                {
                  DISPLAY: "Male",
                  VALUE: "M"
                },
                {
                  DISPLAY: "Female",
                  VALUE: "F"
                },
                {
                  DISPLAY: "Other",
                  VALUE: "X"
                }
              ],
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "SEX",
              DISPLAY: "Gender",
              TYPE: "select",
              REQUIRED: true,
              INFO_ONLY: false
            },
            "Contact Details": {
              ID: "Contact Details",
              TYPE: "information",
              DISPLAY: "Contact Details",
              CUSTOM: true,
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: false,
              INFO_ONLY: true
            },
            EMAILADDRESS: {
              TYPE: "email",
              DISPLAY: "Email",
              REQUIRED: true,
              TOOLTIP: "A contact email address",
              MAXLENGTH: 60
            },
            MOBILEPHONE: {
              TYPE: "text",
              DISPLAY: "Mobile",
              MAXLENGTH: "10",
              PATTERN: "[0-9]{10}",
              TITLE:
                "Mobile numbers must be numeric, 10 characters and contain no spaces.",
              ID: "MOBILEPHONE",
              EVENTS: {},
              TRIGGER_EVENTS: {},
              REQUIRED: true,
              INFO_ONLY: false
            },
            WORKPHONE: {
              TYPE: "text",
              DISPLAY: "Work Phone",
              MAXLENGTH: 20
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            POSITION: {
              TYPE: "text",
              DISPLAY: "Position",
              TOOLTIP: "The Job Title / Position held by the student",
              MAXLENGTH: 60
            }
          },
          FIELD_ORDER: [
            "PersonalDetails",
            "TitleEntry",
            "TITLE",
            "blank",
            "GIVENNAME",
            "MIDDLENAME",
            "SURNAME",
            "DOB",
            "USI",
            "SEX",
            "Contact Details",
            "EMAILADDRESS",
            "MOBILEPHONE",
            "WORKPHONE",
            "ORGANISATION",
            "POSITION"
          ]
        },
        review: {
          DISPLAY: "Review Details",
          TYPE: "review",
          ID: "review"
        },
        billing: {
          DISPLAY: "Billing",
          TYPE: "enrol",
          paymentMethods: {
            DISPLAY: "Payment Method",
            VALUES: [
              {
                VALUE: "invoice",
                DISPLAY: "Invoice"
              },
              {
                VALUE: "payment",
                DISPLAY: "Credit Card Payment"
              },
              {
                VALUE: "tentative",
                DISPLAY: "Tentative"
              }
            ],
            TYPE: "select"
          }
        },
        contactSearch: {
          DISPLAY: "Active User",
          TYPE: "contact-search",
          ID: "contactSearch"
        },
        groupBooking: {
          DISPLAY: "Review Participants",
          TYPE: "group-booking",
          ID: "groupBooking",
          BLURB_BOTTOM:
            "When you have finished booking all participants, please continue to enrol."
        }
      },
      step_order: [
        "userLogin",
        "contactSearch",
        "contactGeneral",
        "review",
        "groupBooking",
        "billing"
      ],
      config_name: "Basic Enrolment - Group",
      step_layout: "left",
      stylesheet: "enrol_flat.css",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_learners: true,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      enrolment_response_text:
        "Enrolment was successfully completed. A confirmation will be sent to the student along with an invoice / receipt, if generated.",
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: true,
      disable_on_complete: true,
      group_booking: true,
      allow_free_bookings: true,
      always_free_bookings: false,
      always_suppress_notifications: false,
      request_signature: false,
      enquiry_on_tentative: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      add_purchase_order: false,
      invoice_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      complete_step_events: false,
      use_display_select_placeholder: true,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: false,
      payment_flow: false,
      sync_with_class_schedule: false,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: false,
      payer_australia_only: false,
      enquiry_single_click: false,
      enquiry_complete_events: false,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true
    }
  },
  COURSE_DETAIL_ENQUIRY: {
    DISPLAY: "Course Details Enquiry",
    ID: "COURSE_DETAIL_ENQUIRY",
    CONFIG: {
      enroller_steps: {
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login"
        },
        complete: {
          DISPLAY: "Complete",
          TYPE: "complete"
        },
        PersonalDetails: {
          ID: "PersonalDetails",
          DISPLAY: "Personal Details",
          TYPE: "contact-update",
          FIELDS: {
            DOB: {
              TYPE: "date",
              DISPLAY: "Date Of Birth"
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            MOBILEPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "MOBILEPHONE",
              DISPLAY: "Mobile Phone",
              TYPE: "text",
              MAXLENGTH: "20",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["DOB", "ORGANISATION", "MOBILEPHONE"],
          HEADER: "Personal Details"
        },
        enquire: {
          ID: "enquire",
          DISPLAY: "Enquire",
          TYPE: "course-enquiry",
          noteCodeID: "88",
          emailTo: "",
          FIELDS: {
            AdditionalComment: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "AdditionalComment",
              DISPLAY: "Reason For Enquiry",
              TYPE: "text-area",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["AdditionalComment"]
        }
      },
      step_order: ["userLogin", "PersonalDetails", "enquire", "complete"],
      config_name: "Course Details Enquiry",
      step_layout: "left",
      stylesheet: "enrol_minimal.css",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_learners: true,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: false,
      disable_on_complete: true,
      group_booking: false,
      add_purchase_order: false,
      allow_free_bookings: false,
      always_free_bookings: false,
      always_suppress_notifications: false,
      invoice_on_tentative: true,
      request_signature: false,
      enquiry_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      complete_step_events: true,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      enrolment_response_text: "Your Enquiry was successfully submitted.",
      use_display_select_placeholder: false,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: false,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: true,
      payer_australia_only: false,
      enquiry_single_click: true,
      enquiry_complete_events: true,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true,
      payment_flow: false,
      sync_with_class_schedule: false
    }
  },
  GENERAL_COURSE_ENQUIRY: {
    DISPLAY: "General Course Enquiry",
    ID: "GENERAL_COURSE_ENQUIRY",
    CONFIG: {
      enroller_steps: {
        userLogin: {
          DISPLAY: "Login",
          TYPE: "user-login"
        },
        step_1507508655811: {
          ID: "step_1507508655811",
          DISPLAY: "Personal Details",
          TYPE: "contact-update",
          FIELDS: {
            DOB: {
              TYPE: "date",
              DISPLAY: "Date Of Birth"
            },
            ORGANISATION: {
              TYPE: "text",
              DISPLAY: "Organisation",
              MAXLENGTH: 250
            },
            MOBILEPHONE: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "MOBILEPHONE",
              DISPLAY: "Mobile Phone",
              TYPE: "text",
              MAXLENGTH: "20",
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["DOB", "ORGANISATION", "MOBILEPHONE"],
          HEADER: "Personal Details"
        },
        complete: {
          DISPLAY: "Complete",
          TYPE: "complete"
        },
        courses: {
          DISPLAY: "Course Select",
          TYPE: "courses",
          COURSE_TYPES: [
            {
              DISPLAY: "Short Course",
              VALUE: "w"
            },
            {
              DISPLAY: "Qualification",
              VALUE: "p"
            }
          ],
          COLUMNS: [
            {
              title: "Code",
              data: "CODE",
              visible: true,
              className: "priority-4"
            },
            {
              title: "Course",
              data: "COURSENAME",
              visible: true,
              className: "priority-1"
            },
            {
              title: "Instance Name",
              data: "NAME",
              visible: true,
              className: "priority-4"
            },
            {
              title: "Start Date",
              data: "STARTDATE",
              orderData: 4,
              visible: true,
              className: "priority-3"
            },
            {
              title: "Start_Date_SORT",
              data: "STARTDATE_SORT",
              visible: false,
              className: "priority-0"
            },
            {
              title: "Finish Date",
              data: "FINISHDATE",
              orderData: 6,
              visible: true,
              className: "priority-4"
            },
            {
              title: "Finish_Date_SORT",
              data: "FINISHDATE_SORT",
              visible: false,
              className: "priority-0"
            },
            {
              title: "Location",
              data: "LOCATION",
              visible: true,
              className: "priority-3"
            },
            {
              title: "InstanceID",
              data: "INSTANCEID",
              visible: false,
              className: "priority-0"
            },
            {
              title: "Vacancy",
              data: "PARTICIPANTVACANCY",
              visible: true,
              className: "priority-2"
            },
            {
              title: "Cost",
              data: "DISPLAYPRICE",
              visible: true,
              className: "priority-1"
            },
            {
              title: "Select",
              data: "SELECT",
              visible: true,
              className: "priority-1"
            },
            {
              title: "Public",
              data: "PUBLIC",
              visible: false,
              className: "priority-0"
            }
          ],
          ID: "courses"
        },
        enquire: {
          ID: "enquire",
          DISPLAY: "Enquire",
          TYPE: "course-enquiry",
          noteCodeID: "88",
          emailTo: "",
          FIELDS: {
            EnquiryMessage: {
              EVENTS: {},
              TRIGGER_EVENTS: {},
              ID: "EnquiryMessage",
              DISPLAY: "Reason For Enquiry",
              TYPE: "text-area",
              CUSTOM: true,
              REQUIRED: false,
              INFO_ONLY: false
            }
          },
          FIELD_ORDER: ["EnquiryMessage"],
          BLURB_TOP: "Thank you for expressing interest in this course."
        }
      },
      step_order: [
        "userLogin",
        "step_1507508655811",
        "courses",
        "enquire",
        "complete"
      ],
      config_name: "General Course Enquiry",
      step_layout: "left",
      stylesheet: "enrol_flat.css",
      adjust_field_labels: true,
      required_complete_check: true,
      terminology_student: "Student",
      cost_terminology: "Fee",
      course_terminology: "Course",
      instance_terminology: "Course Instance",
      login_or_create: true,
      contact_create_only: false,
      allow_clients: false,
      allow_learners: true,
      allow_agents: false,
      allow_trainers: false,
      user_course_search: false,
      add_course_selector: true,
      location_filter: false,
      contact_search_buttons: true,
      contact_search_button_autocreate: true,
      enquiry_response_text: "Your Enquiry was successfully submitted.",
      note_response_text: "Your data was successfully submitted.",
      discounts_available: false,
      disable_on_complete: true,
      group_booking: false,
      add_purchase_order: false,
      allow_free_bookings: false,
      always_free_bookings: false,
      always_suppress_notifications: false,
      invoice_on_tentative: true,
      request_signature: false,
      enquiry_on_tentative: false,
      allow_update_payer_details: false,
      payer_address_required: false,
      show_step_info_block: false,
      enquiry_requires_course: false,
      enquiry_requires_complete: false,
      user_contact_create: false,
      complete_step_events: true,
      post_enrolment_widget: false,
      round_to_dollar: false,
      allow_mixed_inhouse_public: false,
      legacy_enrolment_mode: false,
      enrolment_response_text: "Your Enquiry was successfully submitted.",
      use_display_select_placeholder: true,
      payer_terminology: "Payer",
      enrolling_terminology: "Enrolling",
      enrol_terminology: "Enrol",
      enrolment_terminology: "Enrolment",
      payment_method_selector_terminology: "Payment Method",
      enrol_invoice_terminology: "Enrol and Send Invoice",
      enrol_payment_terminology: "Pay and Enrol",
      enrol_tentative_terminology: "Enrol Tentatively",
      enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
      invoice_selector_terminology: "Send Invoice",
      cc_payment_selector_terminology: "Credit Card",
      tentative_selector_terminology: "Tentative Enrolment",
      direct_debit_selector_terminology: "Direct Debit",
      create_user_start: false,
      contact_validation_check: false,
      confirm_emails: false,
      client_course_filter: false,
      domain_filter_exclude: false,
      show_no_domain: true,
      use_registration_form: false,
      payment_flow: false,
      sync_with_class_schedule: false,
      workshop_extra_billable_items: false,
      multiple_workshop_override: "no_override",
      payment_tentative: false,
      direct_debit_tentative: false,
      invoice_tentative: false,
      hide_cost_fields: false,
      show_payer: true,
      payer_australia_only: false,
      enquiry_single_click: true,
      enquiry_complete_events: true,
      allow_inhouse_enrolment: false,
      inhouse_confirm_bookings: false,
      let_babies_enrol: true
    }
  }
};
