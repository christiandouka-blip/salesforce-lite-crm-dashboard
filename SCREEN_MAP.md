# Salesforce CRM Clone Navigation Map

## Login and Entry Flow

login-main
│
├── Log In
│   ├── if username or password is empty → show validation error
│   └── if username and password are filled → home-dashboard
│
├── Forgot Your Password?
│   └── forgot-password
│
├── Use Custom Domain
│   └── custom-domain
│
├── Log In with Email
│   └── use-email-address
│
├── Try for Free
│   └── free-crm-signup
│
└── Get free CRM
    └── free-crm-signup


## Forgot Password Flow

forgot-password
│
├── Continue
│   ├── if username is empty → show validation error
│   └── if username is filled → show reset confirmation message
│
├── Cancel
│   └── login-main
│
├── How do I verify my identity?
│   └── how-do-i-verify-identity
│
└── Use Your Email Address
    └── use-email-address


## Use Email Address Flow

use-email-address
│
├── Continue
│   ├── if email is empty → show validation error
│   └── if email is filled → show reset confirmation message
│
└── Cancel
    └── forgot-password


## Verify Identity Help Flow

how-do-i-verify-identity
│
├── Back
│   └── forgot-password
│
└── Login
    └── login-main


## Custom Domain Flow

custom-domain
│
├── Continue
│   ├── if custom domain is empty → show validation error
│   └── if custom domain is filled → show custom domain confirmation
│
└── Back
    └── login-main


## Free CRM Signup Flow

free-crm-signup
│
├── Next
│   ├── if required fields are empty → show validation error
│   └── if required fields are filled → home-dashboard
│
└── Login Dropdown
    ├── Salesforce Login → login-main
    ├── Marketing Cloud Login → marketing-cloud-login
    └── Trailblazer Account → trailblazer-login


## Marketing Cloud Login Flow

marketing-cloud-login
│
├── Next
│   ├── if username is empty → show validation error
│   └── if username is filled → home-dashboard
│
└── Remember Me
    └── toggle checkbox


## Trailblazer Login Flow

trailblazer-login
│
├── Google → show selected provider message
├── Salesforce → login-main
├── MuleSoft → show selected provider message
├── Spiff → show selected provider message
├── View More Options → expand extra provider options
├── Next
│   ├── if business email is empty → show validation error
│   └── if business email is filled → home-dashboard
└── Sign up for free → free-crm-signup


## Dashboard Navigation

home-dashboard
│
├── Home → home-dashboard
├── Contacts → contacts
├── Accounts → accounts
├── Sales → leads
├── Service → cases
├── Marketing → coming-soon message
├── Commerce → coming-soon message
├── Your Account → account menu
└── To Do List → open bottom drawer


## Dashboard Page Routes

accounts
│
├── New → open New Account modal
├── Import → open Import modal
├── Assign Label → open Assign Label modal
├── Search this list → filter table
└── Add an Account → open New Account modal

leads
│
├── New → open New Lead modal
├── Import → open Import modal
├── Add to Campaign → open campaign modal
├── Send Email → open email modal
├── Change Owner → open owner modal
└── Add a Lead → open New Lead modal

cases
│
├── New → open New Case modal
├── Change Owner → open owner modal
├── Merge Cases → open merge modal
├── Printable View → open printable view modal
├── Assign Label → open label modal
└── Add a Case → open New Case modal

contacts
│
├── Import → open Import modal
├── Add to Campaign → open campaign modal
├── Send Email → open email modal
├── New → open New Contact modal
├── Assign Label → open label modal
├── Add a Contact → open New Contact modal
└── Sign Up suggestion card → show signup confirmation


## Global Dashboard Behavior

Top search bar → show search suggestions

Settings icon → open settings menu

Help icon → open help menu

Notification icon → open notifications menu

Profile icon → open profile menu

Refresh icon → refresh current table state

Filter icon → open filter panel

Edit pencil icon → open edit mode message

Logout → login-main


## State Management

Store active screen in localStorage.

Store fake authenticated state in localStorage.

Restore previous screen on refresh.

Preserve navigation state until logout.


## Completion Rule

No button, link, menu, tab, card, sidebar item, or form control may be left inactive.