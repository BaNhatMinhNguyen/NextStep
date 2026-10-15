export const stages = ["Before Arrival", "Arrival and First Week", "First Month", "During Your Studies"] as const;
export const statuses = ["Not Started", "In Progress", "Completed", "Not Applicable"] as const;
export type Status = typeof statuses[number];
export type Priority = "Required" | "Recommended" | "Conditional";
export type Source = { title: string; url: string; category: string; reviewed?: string };
export const sources: Record<string, Source> = {
  orientationUndergrad: {"title": "OISS undergraduate orientation", "url": "https://oiss.tulane.edu/oiss-f-1-undergraduate-orientation", "category": "OISS", "reviewed": "2026-09-22"},
  payment: {"title": "Student account payments", "url": "https://studentaccounts.tulane.edu/payment-options", "category": "Career & Academic", "reviewed": "2026-09-22"},
  insuranceExemption: {"title": "International insurance exemptions", "url": "https://campushealth.tulane.edu/insurance-billing/health-insurance-requirements/international-student-health-insurance-exemption", "category": "Campus Health", "reviewed": "2026-09-22"},
  ssn: {"title": "OISS: applying for an SSN", "url": "https://oiss.tulane.edu/applying-social-security-number", "category": "OISS", "reviewed": "2026-09-22"},
  cpt: {"title": "OISS: Curricular Practical Training", "url": "https://oiss.tulane.edu/curricular-practical-training-cpt", "category": "OISS", "reviewed": "2026-09-22"},
  opt: {"title": "OISS: Optional Practical Training", "url": "https://oiss.tulane.edu/optional-practical-training-opt", "category": "OISS", "reviewed": "2026-09-22"},

  oiss: {title:"OISS",url:"https://oiss.tulane.edu/",category:"OISS",reviewed:"2026-09-14"},
  new: {title:"Newly admitted students",url:"https://oiss.tulane.edu/newly-admitted-students",category:"OISS",reviewed:"2026-09-14"},
  checkin: {title:"OISS online check-in",url:"https://oiss.tulane.edu/iglobal-check",category:"OISS",reviewed:"2026-09-22"},
  f1: {title:"Current F-1 student guidance",url:"https://oiss.tulane.edu/current-f-1-students",category:"OISS",reviewed:"2026-09-22"},
  advisor: {title:"Meet an OISS advisor",url:"https://oiss.tulane.edu/make-appointment-international-student-scholar-advisor",category:"OISS",reviewed:"2026-09-22"},
  i94: {title:"CBP I-94 portal",url:"https://i94.cbp.dhs.gov/",category:"OISS"},
  housing: {title:"Housing & move-in",url:"https://housing.tulane.edu/fall-move",category:"Housing",reviewed:"2026-09-14"},
  health: {title:"New to Tulane: health checklist",url:"https://campushealth.tulane.edu/for-you/new-to-tulane",category:"Campus Health",reviewed:"2026-09-22"},
  patientPortal: {title:"Patient Portal",url:"https://tulane.medicatconnect.com/",category:"Campus Health",reviewed:"2026-09-15"},
  immunization: {title:"New-student immunization guidance",url:"https://campushealth.tulane.edu/immunizations/new-students",category:"Campus Health",reviewed:"2026-09-22"},
  form: {title:"Immunization forms & submission",url:"https://campushealth.tulane.edu/immunizations/form",category:"Campus Health",reviewed:"2026-09-22"},
  internationalHealth: {title:"International student health guidance",url:"https://campushealth.tulane.edu/international-students",category:"Campus Health",reviewed:"2026-09-22"},
  compliance: {title:"Check immunization compliance",url:"https://campushealth.tulane.edu/immunizations/check-your-compliance-status",category:"Campus Health",reviewed:"2026-09-14"},
  cdcTravel: {title:"CDC: plan travel vaccinations",url:"https://wwwnc.cdc.gov/travel/page/travel-vaccines",category:"Campus Health",reviewed:"2026-09-14"},
  mmr: {title:"CDC: measles & international travel",url:"https://www.cdc.gov/measles/travel/index.html",category:"Campus Health",reviewed:"2026-09-14"},
  tb: {title:"CDC: TB blood-test timing",url:"https://www.cdc.gov/tb/hcp/testing-diagnosis/interferon-gamma-release-assay.html",category:"Campus Health",reviewed:"2026-09-14"},
  bank: {title:"Chase branch locator",url:"https://locator.chase.com/",category:"Banking",reviewed:"2026-09-14"},
  shuttle: {title:"Tulane shuttles & transportation",url:"https://shuttles.tulane.edu/",category:"Transportation"},
  career: {title:"International student career resources",url:"https://oiss.tulane.edu/career-resources-international-students",category:"Career & Academic"},
  orientation: {title:"OISS orientation requirements",url:"https://oiss.tulane.edu/oiss-online-orientation",category:"OISS",reviewed:"2026-09-22"},
  status: {title:"OISS: maintaining F-1 status",url:"https://oiss.tulane.edu/maintaining-your-f-1-status",category:"OISS",reviewed:"2026-09-22"},
  visa: {title:"OISS: visa application steps",url:"https://oiss.tulane.edu/getting-visa-and-traveling-united-states",category:"OISS",reviewed:"2026-09-21"},
  travel: {title:"OISS: travel documents",url:"https://oiss.tulane.edu/traveling-united-states-f-or-j-status",category:"OISS",reviewed:"2026-09-21"},
  ds160: {title:"State Department: DS-160 application",url:"https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application.html",category:"OISS",reviewed:"2026-09-21"},
  cbp: {title:"CBP: retrieve your I-94",url:"https://www.cbp.gov/travel/international-visitors/i-94",category:"OISS",reviewed:"2026-09-21"},
  firstYear: {title:"First-year student checklist",url:"https://firstyear.tulane.edu/new-student-checklist",category:"Career & Academic",reviewed:"2026-09-21"},
  modules: {title:"First-year Canvas modules",url:"https://firstyear.tulane.edu/new-student-modules",category:"Career & Academic",reviewed:"2026-09-21"},
  registration: {title:"Registrar: registration and holds",url:"https://registrar.tulane.edu/registration",category:"Career & Academic",reviewed:"2026-09-21"},
  advising: {title:"College Advising appointments",url:"https://advising.tulane.edu/",category:"Career & Academic",reviewed:"2026-09-21"},
  splash: {title:"Splash Card photo and collection",url:"https://splashcard.tulane.edu/online-photo-submission",category:"Housing",reviewed:"2026-09-21"},
  wellness: {title:"Required wellness courses and login",url:"https://campushealth.tulane.edu/departments/well/ehealth-tools/wellness-courses",category:"Campus Health",reviewed:"2026-09-21"},
  appointments: {title:"Campus Health: book an appointment",url:"https://campushealth.tulane.edu/patient-portal/schedule-appointments",category:"Campus Health",reviewed:"2026-09-21"},
  airport: {title:"MSY rideshare pickup",url:"https://flymsy.com/ride-app-2/",category:"Transportation",reviewed:"2026-09-21"},
  shuttleRoutes: {title:"Tulane shuttle routes and schedules",url:"https://shuttles.tulane.edu/fixed-shuttle-lines",category:"Transportation",reviewed:"2026-09-21"},
};

// Action destinations are separate from supporting articles. Use stable public
// portal URLs, never a student's session URL, course ID, or private upload link.
export const actionLinks = {
  insuranceExemption:{url:"https://www.k12insight.com/Lets-Talk/embed.aspx?L=PR6T18F3B3LT",source:"insuranceExemption"},
  ssa:{url:"https://secure.ssa.gov/ossnap/public/landingOSsnap",source:"ssn"},
  canvas:{url:"https://tulane.instructure.com/",source:"orientation"},
  iglobal:{url:"https://iss.tulane.edu/istart/controllers/client/ClientEngine.cfm",source:"checkin"},
  outlook:{url:"https://outlook.com/tulane.edu",source:"new"},
  gibson:{url:"https://gibson.tulane.edu/",source:"registration"},
  housing:{url:"https://tulane.starrezhousing.com/StarRezPortalX/",source:"firstYear"},
  classes:{url:"https://classschedule.tulane.edu/Search.aspx",source:"registration"},
  patient:{url:"https://tulane.medicatconnect.com/",source:"patientPortal"},
  immunizationForm:{url:"https://campushealth.tulane.edu/sites/default/files/2026-03/tulane-immunization-compliance-form-undergraduate-3-3-26.pdf",source:"form"},
  wellness:{url:"https://tulanestudents-la.safecolleges.com/",source:"wellness"},
  sevis:{url:"https://www.fmjfee.com/i901fee/index.htm",source:"visa"},
  ds160:{url:"https://ceac.state.gov/genniv/",source:"ds160"},
  embassy:{url:"https://www.usembassy.gov/",source:"ds160"},
  i94:{url:"https://i94.cbp.dhs.gov/",source:"cbp"},
  oissAdvisor:{url:"https://calendly.com/warrenfjones",source:"advisor"},
  collegeAdvisor:{url:"https://calendly.com/d/cswm-bnr-yn5",source:"advising"},
  handshake:{url:"https://tulane.joinhandshake.com/explore",source:"career"},
  bank:{url:"https://www.chase.com/locator",source:"bank"},
  shuttleTracker:{url:"https://tulane.passiogo.com/",source:"shuttle"},
  shuttleRoutes:{url:"https://shuttles.tulane.edu/fixed-shuttle-lines",source:"shuttleRoutes"},
  airportPickup:{url:"https://flymsy.com/ride-app-2/",source:"airport"},
  oissEmail:{url:"mailto:oiss@tulane.edu",source:"orientation"},
  checkinHelp:{url:"mailto:khingora@tulane.edu",source:"checkin"},
  housingEmail:{url:"mailto:housing@tulane.edu",source:"housing"},
  splashEmail:{url:"mailto:splashcard@tulane.edu",source:"splash"},
  immunizationEmail:{url:"mailto:immunizations@tulane.edu",source:"form"},
  wellnessEmail:{url:"mailto:whp@tulane.edu",source:"wellness"},
} as const;
export type ActionId = keyof typeof actionLinks;
export type LinkedText = {label:string;action:ActionId};
export type TaskText = string | (string | LinkedText)[];
export type Task = {
  id:string; title:string; stage:0|1|2|3; priority:Priority; category:string;
  steps:TaskText[]; sources:string[]; action?:LinkedText; condition?:string; prepare?:string[]; note?:TaskText;
  timing?:string; reviewed?:string;
  offset?:number; readyAt?:number; dependencies?:string[]; health?:boolean;
};
export const tasks:Task[] = [
  {
    "id": "enrollment",
    "title": "Review your enrollment checklist",
    "stage": 0,
    "priority": "Recommended",
    "category": "Enrollment",
    "offset": -45,
    "steps": [
      [
        "Sign in to ",
        {
          "label": "Canvas",
          "action": "canvas"
        },
        " and select your New Student Modules."
      ],
      "Complete each released module and the New Student Checklist inside the course.",
      [
        "Check ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        " for enrollment messages. Add assigned dates with each task’s reminder button."
      ]
    ],
    "sources": [
      "modules",
      "firstYear"
    ],
    "note": "These first-year modules are separate from OISS Online Orientation.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open new-student modules",
      "action": "canvas"
    }
  },
  {
    "id": "orientation",
    "title": "Complete OISS online orientation",
    "stage": 0,
    "priority": "Required",
    "category": "OISS",
    "offset": -21,
    "steps": [
      [
        "Open ",
        {
          "label": "Canvas",
          "action": "canvas"
        },
        " → OISS Online Orientation."
      ],
      "Complete the F-1/J-1 rights and responsibilities quiz, Title IX assignment, and OISS Important Tips quiz.",
      "Confirm all three items are submitted before iGlobal check-in and in-person orientation."
    ],
    "sources": [
      "orientation"
    ],
    "note": [
      "Course missing? ",
      {
        "label": "Email OISS",
        "action": "oissEmail"
      },
      " to request access. Course and assignment links appear after you sign in."
    ],
    "timing": "Complete before iGlobal check-in and your assigned OISS orientation.",
    "reviewed": "2026-09-22",
    "action": {
      "label": "Open Canvas",
      "action": "canvas"
    }
  },
  {
    "id": "visa-travel",
    "title": "Prepare your I-20 and visa",
    "stage": 0,
    "priority": "Required",
    "category": "OISS",
    "offset": -35,
    "steps": [
      "Check the details on your Tulane I-20. Print and sign it; ask OISS to correct any errors.",
      [
        "For an initial F-1 application, pay the ",
        {
          "label": "I-901 SEVIS fee",
          "action": "sevis"
        },
        " if not already paid, and save the receipt."
      ],
      [
        "If you need a visa, submit your ",
        {
          "label": "DS-160 application",
          "action": "ds160"
        },
        " and print its barcode confirmation."
      ],
      [
        "Use your ",
        {
          "label": "U.S. embassy or consulate",
          "action": "embassy"
        },
        " to arrange the visa appointment and payment. Take your I-20, passport and requested supporting documents."
      ]
    ],
    "sources": [
      "visa",
      "ds160",
      "advisor"
    ],
    "note": [
      "Already have a visa or transferring from another U.S. school? ",
      {
        "label": "Book an OISS appointment",
        "action": "oissAdvisor"
      },
      " if unsure which steps apply. Visa appointment systems vary by country."
    ],
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open DS-160 application",
      "action": "ds160"
    }
  },
  {
    "id": "housing",
    "title": "Confirm housing and move-in",
    "stage": 0,
    "priority": "Required",
    "category": "Housing",
    "offset": -28,
    "steps": [
      [
        "Sign in to the ",
        {
          "label": "Housing Portal",
          "action": "housing"
        },
        ". Submit any unfinished housing application and check your room assignment when released."
      ],
      [
        "In ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        ", find Housing’s move-in confirmation. Save your assigned time, arrival location and check-in code."
      ],
      "Use Edit dates to save your move-in date. Label luggage with your name and Splash ID.",
      [
        "If your flight conflicts with your assigned arrival, ",
        {
          "label": "email Housing",
          "action": "housingEmail"
        },
        " to arrange the next step."
      ]
    ],
    "sources": [
      "housing",
      "firstYear"
    ],
    "note": "Your assigned move-in message takes priority over general schedules.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open Housing Portal",
      "action": "housing"
    }
  },
  {
    "id": "registration",
    "title": "Register for your first semester",
    "stage": 0,
    "priority": "Required",
    "category": "Enrollment",
    "offset": -21,
    "steps": [
      [
        "Open ",
        {
          "label": "Schedule of Classes",
          "action": "classes"
        },
        " → View Registration Holds; resolve any listed holds."
      ],
      "Register for courses agreed with your advisor; submit and confirm your registration.",
      "Check Current Schedule: undergraduates normally need 12 credits, with no more than 3 online credits counting toward that minimum."
    ],
    "sources": [
      "registration",
      "firstYear",
      "status"
    ],
    "note": [
      "Get OISS approval before dropping below full-time enrollment. ",
      {
        "label": "Book your undergraduate OISS advisor",
        "action": "oissAdvisor"
      },
      " if unsure."
    ],
    "reviewed": "2026-09-22",
    "timing": "Use your assigned registration window and the term’s add/drop dates.",
    "action": {
      "label": "Open registration",
      "action": "classes"
    }
  },
  {
    "id": "health-records",
    "title": "Review your vaccination records",
    "stage": 0,
    "priority": "Recommended",
    "category": "Campus Health",
    "health": true,
    "steps": [
      [
        "Gather provider vaccine records or download the ",
        {
          "label": "Tulane undergraduate form",
          "action": "immunizationForm"
        },
        "."
      ],
      "Have your clinician check missing records and sign/stamp the form if you use it."
    ],
    "sources": [
      "form",
      "immunization",
      "cdcTravel"
    ],
    "prepare": [
      "Existing vaccination records and relevant lab results",
      "Printed undergraduate immunization form, if using it"
    ],
    "note": "A provider-issued vaccination record can replace the Tulane form.",
    "reviewed": "2026-09-22",
    "action": {
      "label": "Download immunization form",
      "action": "immunizationForm"
    }
  },
  {
    "id": "health-vaccines",
    "title": "Plan any missing vaccinations",
    "stage": 0,
    "priority": "Conditional",
    "category": "Campus Health",
    "health": true,
    "dependencies": [
      "health-records"
    ],
    "steps": [
      [
        "Show your clinician your records and the ",
        {
          "label": "Tulane form",
          "action": "immunizationForm"
        },
        "."
      ],
      "Confirm any missing doses and coordinate TB testing before booking.",
      "Keep the updated records for upload."
    ],
    "sources": [
      "form",
      "cdcTravel",
      "mmr",
      "tb"
    ],
    "prepare": [
      "Existing vaccination records",
      "Tulane’s undergraduate immunization form"
    ],
    "note": "Only a clinician can decide which doses you need. Existing immunity may already satisfy a requirement.",
    "reviewed": "2026-09-21",
    "condition": "Only if your clinician confirms missing doses.",
    "action": {
      "label": "Download immunization form",
      "action": "immunizationForm"
    }
  },
  {
    "id": "health-tb-risk",
    "title": "Complete your TB risk assessment",
    "stage": 0,
    "priority": "Required",
    "category": "Campus Health",
    "health": true,
    "steps": [
      [
        "Open ",
        {
          "label": "Patient Portal",
          "action": "patient"
        },
        " → Forms → Individual TB Risk Assessment."
      ],
      "Submit the questionnaire. Follow the testing instructions shown with your result."
    ],
    "sources": [
      "immunization",
      "patientPortal"
    ],
    "note": "Submit health information only in the Patient Portal.",
    "reviewed": "2026-09-22",
    "action": {
      "label": "Complete TB assessment",
      "action": "patient"
    }
  },
  {
    "id": "health-tb-test",
    "title": "Arrange TB testing if required",
    "stage": 0,
    "priority": "Conditional",
    "category": "Campus Health",
    "health": true,
    "dependencies": [
      "health-tb-risk"
    ],
    "steps": [
      [
        "Check your result and messages in ",
        {
          "label": "Patient Portal",
          "action": "patient"
        },
        "."
      ],
      [
        "Confirm the requested test with ",
        {
          "label": "Campus Health",
          "action": "immunizationEmail"
        },
        " and arrange it with your clinician."
      ],
      "Upload the requested lab report in Patient Portal → Upload Documents."
    ],
    "sources": [
      "immunization",
      "internationalHealth",
      "tb",
      "form"
    ],
    "note": "Follow your portal instructions. Ask Campus Health to resolve differences between general and international testing guidance.",
    "reviewed": "2026-09-22",
    "condition": "Only if Campus Health requires follow-up testing.",
    "action": {
      "label": "Open Patient Portal",
      "action": "patient"
    }
  },
  {
    "id": "health-submit",
    "title": "Submit your immunization records",
    "stage": 0,
    "priority": "Required",
    "category": "Campus Health",
    "health": true,
    "steps": [
      [
        "Open ",
        {
          "label": "Patient Portal",
          "action": "patient"
        },
        " → Immunization → Enter Dates; enter your vaccine dates and submit."
      ],
      "Use Upload Documents for your form or provider records and required lab reports. Each file must be under 4 MB.",
      "Check secure messages after review (up to five business days)."
    ],
    "sources": [
      "form",
      "health",
      "patientPortal"
    ],
    "note": "Allow up to five business days for review. Uploading records does not mean they have been approved.",
    "prepare": [
      "Readable scan or photo of the signed form or provider records",
      "Required lab reports, if applicable"
    ],
    "reviewed": "2026-09-22",
    "action": {
      "label": "Upload immunization records",
      "action": "patient"
    }
  },
  {
    "id": "health-check",
    "title": "Check your compliance status",
    "stage": 0,
    "priority": "Required",
    "category": "Campus Health",
    "health": true,
    "dependencies": [
      "health-submit"
    ],
    "steps": [
      [
        "Open ",
        {
          "label": "Patient Portal",
          "action": "patient"
        },
        " → Immunization and check your status."
      ],
      "If Not Compliant, open View your immunization history → Missing Immunization.",
      "Submit missing evidence. Mark this task complete when the portal shows Compliant, Verified."
    ],
    "sources": [
      "compliance",
      "form",
      "patientPortal"
    ],
    "note": "NextStep completion does not change your university status.",
    "reviewed": "2026-09-22",
    "action": {
      "label": "Check my compliance",
      "action": "patient"
    }
  },
  {
    "id": "wellness",
    "title": "Complete required wellness courses",
    "stage": 0,
    "priority": "Required",
    "category": "Campus Health",
    "steps": [
      [
        "Sign in to ",
        {
          "label": "Tulane’s wellness course portal",
          "action": "wellness"
        },
        " with your Tulane email and password."
      ],
      "Complete your assigned AlcoholEdu and undergraduate sexual violence prevention courses, plus any other assigned wellness courses.",
      "Check that each assigned course shows completion and save its confirmation."
    ],
    "sources": [
      "wellness",
      "health"
    ],
    "note": [
      "Courses unavailable or login trouble? ",
      {
        "label": "Email the wellness team",
        "action": "wellnessEmail"
      },
      ". Use the assignments and dates for your entry cohort."
    ],
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open wellness courses",
      "action": "wellness"
    }
  },
  {
    "id": "travel-documents",
    "title": "Prepare your travel documents",
    "stage": 0,
    "priority": "Required",
    "category": "OISS",
    "offset": -7,
    "steps": [
      "Pack your passport, signed I-20 and visa if required in your carry-on, with your admission letter and funding evidence.",
      [
        "Print your ",
        {
          "label": "I-901 SEVIS payment receipt",
          "action": "sevis"
        },
        ". Keep copies of important documents separately from the originals."
      ],
      [
        "Check the program dates on your I-20. ",
        {
          "label": "Contact OISS",
          "action": "oissEmail"
        },
        " before travel if anything is wrong or your visa is delayed."
      ]
    ],
    "sources": [
      "travel",
      "visa",
      "new"
    ],
    "prepare": [
      "Valid passport and F-1 visa, if required",
      "Printed, signed I-20 and SEVIS fee receipt",
      "Admission letter and evidence of funding"
    ],
    "note": "For initial F-1 entry, arrival cannot be earlier than 30 days before the I-20 program start. Transfers and other situations need individual guidance.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Retrieve SEVIS receipt",
      "action": "sevis"
    }
  },
  {
    "id": "arrival-transport",
    "title": "Plan your trip to campus",
    "stage": 0,
    "priority": "Recommended",
    "category": "Transportation",
    "offset": -7,
    "steps": [
      [
        "Find your move-in destination and time in ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        ". If arriving before your housing opens, arrange somewhere to stay first."
      ],
      "Choose a taxi or rideshare that fits your arrival. Enter your assigned check-in destination, not just “Tulane University.”",
      [
        "At MSY, rideshare pickup is outside Level 1 baggage claim, on the middle curb. Check your app and the ",
        {
          "label": "MSY pickup map",
          "action": "airportPickup"
        },
        " for your provider’s zone."
      ]
    ],
    "sources": [
      "airport",
      "housing"
    ],
    "note": "For Fall 2026 move-in, Housing lists 2900 Ben Weiner Drive for the vehicle queue. Use your assigned instructions for other dates or after-hours arrival.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "View MSY pickup map",
      "action": "airportPickup"
    }
  },
  {
    "id": "i94",
    "title": "Access your latest I-94",
    "stage": 1,
    "priority": "Required",
    "category": "OISS",
    "offset": 0,
    "readyAt": 1,
    "steps": [
      [
        "Open ",
        {
          "label": "CBP I-94",
          "action": "i94"
        },
        " → Get Most Recent I-94 after entering the U.S."
      ],
      "Retrieve and save the record. Check F-1, D/S, and your latest entry date.",
      [
        "Record missing or incorrect? ",
        {
          "label": "Contact OISS",
          "action": "oissEmail"
        },
        " for correction instructions."
      ]
    ],
    "sources": [
      "cbp",
      "status",
      "checkin"
    ],
    "note": "Enter identity details only on CBP’s website. NextStep does not collect them.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Get my I-94",
      "action": "i94"
    }
  },
  {
    "id": "checkin",
    "title": "Complete OISS online check-in",
    "stage": 1,
    "priority": "Required",
    "category": "OISS",
    "offset": 1,
    "readyAt": 1,
    "dependencies": [
      "orientation",
      "i94"
    ],
    "steps": [
      [
        "After U.S. entry, open ",
        {
          "label": "iGlobal",
          "action": "iglobal"
        },
        " → Requests → Pre-Arrival (your school)."
      ],
      "Choose E-Forms → F-1 Student Check-in. Enter your local address, attach the requested records, and submit.",
      [
        "Watch ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        " for approval or corrections; allow 5–10 days for review."
      ]
    ],
    "sources": [
      "checkin",
      "status"
    ],
    "note": [
      "Form missing or inaccessible? ",
      {
        "label": "Email the check-in contact",
        "action": "checkinHelp"
      },
      ". Submit documents only in iGlobal; your NextStep checkmark does not confirm OISS approval."
    ],
    "timing": "Submit after U.S. entry, before OISS orientation. The general limit is 30 days after your I-20 program start; an earlier assigned deadline takes priority.",
    "prepare": [
      "Tulane ID number and U.S. residential address",
      "Clear passport biographical-page and visa images; entry stamp if issued",
      "Your latest I-94 record"
    ],
    "reviewed": "2026-09-22",
    "action": {
      "label": "Open iGlobal check-in",
      "action": "iglobal"
    }
  },
  {
    "id": "movein",
    "title": "Complete your assigned move-in",
    "stage": 1,
    "priority": "Required",
    "category": "Housing",
    "readyAt": 1,
    "steps": [
      [
        "Retrieve your move-in confirmation and check-in code from ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        "; arrive at the assigned location and time."
      ],
      "Show your code to Housing staff. Collect your room key and check-in packet, including your Splash Card if prepared.",
      "After check-in, follow staff directions to unload and reach your residence hall.",
      [
        "Arriving late? ",
        {
          "label": "Email Housing",
          "action": "housingEmail"
        },
        " for after-hours check-in instructions before heading to your room."
      ]
    ],
    "sources": [
      "housing"
    ],
    "note": "Your check-in code and location are student-specific; use your own Housing confirmation.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Find my move-in instructions",
      "action": "outlook"
    }
  },
  {
    "id": "splashcard",
    "title": "Submit your Splash Card photo",
    "stage": 0,
    "priority": "Required",
    "category": "Campus services",
    "offset": -28,
    "readyAt": 0,
    "steps": [
      [
        "Search ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        " for “Splash Card.” Use the personal photo-upload link and code in that email."
      ],
      "Upload a clear, front-facing color photo on a plain light background.",
      "Watch for the approval email; Splash Card Services lists up to three business days. Resubmit if the photo is rejected.",
      [
        "No upload invitation? ",
        {
          "label": "Email Splash Card Services",
          "action": "splashEmail"
        },
        " with your full name, Tulane email and student ID."
      ]
    ],
    "sources": [
      "splash",
      "housing"
    ],
    "note": "Each student receives a personal upload link. Your prepared card is normally included in your move-in packet.",
    "reviewed": "2026-09-21",
    "timing": "Submit and have your photo approved before arrival. Use the upload deadline in your assigned email.",
    "action": {
      "label": "Find my photo-upload invitation",
      "action": "outlook"
    }
  },
  {
    "id": "enrollment-followup",
    "title": "Resolve remaining enrollment steps",
    "stage": 1,
    "priority": "Conditional",
    "category": "Enrollment",
    "offset": 3,
    "readyAt": 1,
    "steps": [
      [
        "Sign in to ",
        {
          "label": "Gibson",
          "action": "gibson"
        },
        " and check for the “You currently have holds” banner."
      ],
      "Open each hold, note the responsible office and complete the missing action it identifies.",
      [
        "Return to ",
        {
          "label": "Schedule of Classes",
          "action": "classes"
        },
        " → Current Schedule to confirm your registered courses."
      ],
      [
        "Need help resolving a course issue? ",
        {
          "label": "Book College Advising",
          "action": "collegeAdvisor"
        },
        " and take the hold message or registration error."
      ]
    ],
    "sources": [
      "registration",
      "advising"
    ],
    "reviewed": "2026-09-21",
    "action": {
      "label": "Check registration holds",
      "action": "classes"
    }
  },
  {
    "id": "bank",
    "title": "Prepare for a bank appointment",
    "stage": 2,
    "priority": "Recommended",
    "category": "Banking",
    "offset": 10,
    "readyAt": 2,
    "steps": [
      [
        "Enter your campus address in the ",
        {
          "label": "Chase branch locator",
          "action": "bank"
        },
        " and select a nearby branch, or use your preferred bank."
      ],
      "Call the branch using its listed number. Say you are an international F-1 student and confirm accepted ID, address proof and appointment availability.",
      "Confirm account fees and any opening deposit, then bring the documents the branch requests."
    ],
    "sources": [
      "bank"
    ],
    "prepare": [
      "Identification the branch confirms it accepts",
      "Requested proof of address and student status"
    ],
    "note": "Chase is one example, not an endorsement. Requirements vary; an SSN is not assumed to be required.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Find a nearby bank branch",
      "action": "bank"
    }
  },
  {
    "id": "campus-health",
    "title": "Locate Campus Health services",
    "stage": 2,
    "priority": "Recommended",
    "category": "Campus Health",
    "offset": 12,
    "readyAt": 2,
    "steps": [
      [
        "When you need a routine visit, sign in to ",
        {
          "label": "Patient Portal",
          "action": "patient"
        },
        " → Appointments."
      ],
      "Choose the clinic, visit type and reason; submit, then choose an available time.",
      "Confirm the appointment in your portal’s To Do List. Bring your student ID and insurance card."
    ],
    "sources": [
      "appointments",
      "health"
    ],
    "note": "Book only if you need care. Learning how to access services is separate from required immunization compliance.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open appointment booking",
      "action": "patient"
    }
  },
  {
    "id": "campus-transport",
    "title": "Find your campus transportation",
    "stage": 2,
    "priority": "Recommended",
    "category": "Transportation",
    "offset": 14,
    "readyAt": 2,
    "steps": [
      [
        "Use ",
        {
          "label": "Passio GO live tracking",
          "action": "shuttleTracker"
        },
        " to locate a Tulane shuttle and nearby stops."
      ],
      [
        "Choose your route in ",
        {
          "label": "shuttle schedules",
          "action": "shuttleRoutes"
        },
        " and check its operating days and departure time."
      ],
      "Go to the listed stop and check live tracking again before leaving."
    ],
    "sources": [
      "shuttle",
      "shuttleRoutes"
    ],
    "reviewed": "2026-09-21",
    "action": {
      "label": "Track my shuttle",
      "action": "shuttleTracker"
    }
  },
  {
    "id": "academic-support",
    "title": "Find academic and campus support",
    "stage": 2,
    "priority": "Recommended",
    "category": "Career & Academic",
    "offset": 18,
    "readyAt": 2,
    "steps": [
      [
        "Use ",
        {
          "label": "College Advising booking",
          "action": "collegeAdvisor"
        },
        " to choose an available advising appointment."
      ],
      "Describe the course, major or academic question you need help with and confirm your appointment.",
      [
        "Check your course list in ",
        {
          "label": "Schedule of Classes",
          "action": "classes"
        },
        "; bring your questions and any registration error messages."
      ]
    ],
    "sources": [
      "advising",
      "registration"
    ],
    "note": "For your first pre-arrival advising session, use the invitation sent after your New Student Module 2 checklist.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Book College Advising",
      "action": "collegeAdvisor"
    }
  },
  {
    "id": "maintain-status",
    "title": "Update your address or contact details",
    "stage": 3,
    "priority": "Conditional",
    "category": "OISS",
    "readyAt": 3,
    "steps": [
      [
        "Open ",
        {
          "label": "iGlobal",
          "action": "iglobal"
        },
        " and select the Address/Update form."
      ],
      "Submit changed address or contact details within 10 days of the change.",
      "Keep the confirmation; reopen this task whenever your details change."
    ],
    "sources": [
      "status",
      "checkin"
    ],
    "note": "Your original check-in already includes your address. Do not submit a duplicate update if nothing has changed.",
    "reviewed": "2026-09-22",
    "condition": "When your U.S. address or contact details change.",
    "timing": "Within 10 days of the change. Add the change date in Profile & dates.",
    "action": {
      "label": "Update my details in iGlobal",
      "action": "iglobal"
    }
  },
  {
    "id": "career",
    "title": "Explore career and work guidance",
    "stage": 3,
    "priority": "Recommended",
    "category": "Career & Academic",
    "readyAt": 3,
    "steps": [
      [
        "Sign in to ",
        {
          "label": "Tulane Handshake",
          "action": "handshake"
        },
        " to find student jobs, internships and career events."
      ],
      "Save positions of interest and note the employer, duties, location and proposed dates.",
      [
        "Before starting work, ",
        {
          "label": "meet with your OISS advisor",
          "action": "oissAdvisor"
        },
        " to confirm the authorization and paperwork your situation requires."
      ]
    ],
    "sources": [
      "career",
      "status",
      "advisor"
    ],
    "note": "A job listing is not work authorization. SSN, CPT and OPT are conditional, not universal first-year tasks.",
    "reviewed": "2026-09-21",
    "action": {
      "label": "Open Tulane Handshake",
      "action": "handshake"
    }
  },
  {
    "id": "orientation-inperson",
    "title": "Attend OISS undergraduate orientation",
    "stage": 1,
    "priority": "Required",
    "category": "OISS",
    "readyAt": 1,
    "steps": [
      [
        "Find your assigned orientation in ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        "."
      ],
      "Complete OISS Online Orientation and iGlobal check-in beforehand.",
      "Attend your session. If you missed it, contact OISS for the next step."
    ],
    "sources": [
      "orientationUndergrad"
    ],
    "action": {
      "label": "Find my orientation details",
      "action": "outlook"
    },
    "timing": "Fall 2026: August 12, sign-in 8:30 AM; session 9–10:15 AM, Lake Theater. Other intakes: use your assigned schedule.",
    "dependencies": [
      "orientation",
      "checkin"
    ],
    "reviewed": "2026-09-22"
  },
  {
    "id": "tuition",
    "title": "Check your bill and payment deadline",
    "stage": 0,
    "priority": "Required",
    "category": "Enrollment",
    "steps": [
      [
        "Open ",
        {
          "label": "Gibson",
          "action": "gibson"
        },
        " → View Online Account."
      ],
      "Check your balance, aid credits, and the due date on your statement. Add that date below.",
      "Arrange any balance due through the official student accounts portal; confirm the payment clears."
    ],
    "sources": [
      "payment"
    ],
    "action": {
      "label": "Open my student account",
      "action": "gibson"
    },
    "note": "Use the date on your own bill. A scholarship does not necessarily cover every charge.",
    "timing": "Deadline is student-specific; confirm it in your account.",
    "reviewed": "2026-09-22"
  },
  {
    "id": "insurance",
    "title": "Check your T-SHIP coverage",
    "stage": 0,
    "priority": "Recommended",
    "category": "Campus Health",
    "steps": [
      [
        "Check ",
        {
          "label": "Tulane Outlook",
          "action": "outlook"
        },
        " for your insurance enrollment message."
      ],
      "New international students are automatically enrolled in T-SHIP; no standard opt-in action is needed.",
      "Follow the insurer’s instructions to save your insurance card and check your coverage dates."
    ],
    "sources": [
      "health",
      "insuranceExemption"
    ],
    "action": {
      "label": "Find my insurance email",
      "action": "outlook"
    },
    "note": "An exemption is a separate, conditional process. Do not assume a domestic-student waiver applies.",
    "reviewed": "2026-09-22"
  },
  {
    "id": "insurance-exemption",
    "title": "Request an insurance exemption, if eligible",
    "stage": 0,
    "priority": "Conditional",
    "category": "Campus Health",
    "condition": "Only if you have qualifying U.S.-based group coverage and want an exemption.",
    "steps": [
      [
        "Open the ",
        {
          "label": "international insurance exemption form",
          "action": "insuranceExemption"
        },
        "."
      ],
      "Ask Campus Health to assess your plan; provide the requested coverage documents in its approved channel.",
      "Wait for a written decision. Keep T-SHIP unless Campus Health confirms an exemption."
    ],
    "sources": [
      "insuranceExemption"
    ],
    "action": {
      "label": "Request an exemption",
      "action": "insuranceExemption"
    },
    "timing": "Ask Campus Health for the deadline that applies to your request.",
    "note": "Approval is case-by-case and is not guaranteed.",
    "reviewed": "2026-09-22"
  },
  {
    "id": "ssn",
    "title": "Apply for an SSN for authorized work",
    "stage": 2,
    "priority": "Conditional",
    "category": "OISS",
    "readyAt": 2,
    "condition": "Only with a qualifying job offer and authorization; enrollment alone is not enough.",
    "steps": [
      [
        "Confirm eligibility and active SEVIS status with ",
        {
          "label": "your OISS advisor",
          "action": "oissAdvisor"
        },
        "; obtain required employment letters."
      ],
      [
        "Start the ",
        {
          "label": "SSA first-time number application",
          "action": "ssa"
        },
        " and save your confirmation; arrange the required office visit."
      ],
      "Bring the originals requested for your work category. Never email your SSN or upload it here."
    ],
    "sources": [
      "ssn"
    ],
    "action": {
      "label": "Start the SSA application",
      "action": "ssa"
    },
    "prepare": [
      "Passport, visa, I-20 and printed I-94",
      "OISS/employer letters or other employment authorization required for your category"
    ],
    "note": "OISS advises waiting 10–12 days after approved check-in and confirming active SEVIS status before applying. Obtain the OISS letter before an SSA appointment for campus work.",
    "dependencies": [
      "checkin"
    ],
    "reviewed": "2026-09-22"
  },
  {
    "id": "work-authorization",
    "title": "Confirm CPT / OPT before off-campus work",
    "stage": 3,
    "priority": "Conditional",
    "category": "OISS",
    "readyAt": 3,
    "condition": "If you are considering an off-campus job, internship, or practical training.",
    "steps": [
      [
        "Book ",
        {
          "label": "your undergraduate OISS advisor",
          "action": "oissAdvisor"
        },
        " and bring the offer, duties and proposed dates."
      ],
      "Confirm whether CPT or OPT applies and whether you meet its eligibility rules.",
      "Follow the authorized application route. Do not start until the required authorization and start date are in place."
    ],
    "sources": [
      "cpt",
      "opt",
      "status"
    ],
    "action": {
      "label": "Book an OISS appointment",
      "action": "oissAdvisor"
    },
    "note": "CPT is curriculum-related; OPT is a different authorization route. These are not automatic first-year permissions.",
    "reviewed": "2026-09-22"
  },
  {
    "id": "travel-signature",
    "title": "Check your travel signature before a trip",
    "stage": 3,
    "priority": "Conditional",
    "category": "OISS",
    "readyAt": 3,
    "condition": "Before travel outside the U.S. during your program.",
    "steps": [
      [
        "Book ",
        {
          "label": "your OISS advisor",
          "action": "oissAdvisor"
        },
        " to confirm documents and whether you need a fresh I-20 travel signature."
      ],
      "Submit the request through the channel OISS assigns; allow time before departure.",
      "Check your signed I-20, passport and any required visa before returning."
    ],
    "sources": [
      "travel",
      "advisor"
    ],
    "action": {
      "label": "Arrange a travel-signature check",
      "action": "oissAdvisor"
    },
    "timing": "Before international travel; use your confirmed travel dates.",
    "reviewed": "2026-09-22"
  }
];
export const categories = ["All resources","OISS","Housing","Banking","Campus Health","Transportation","Career & Academic"];
