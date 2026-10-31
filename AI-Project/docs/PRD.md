# Make My Marriage --- Product Requirements Document (PRD)

**Product:** Make My Marriage\
**Document status:** MVP/V1 baseline for review and implementation\
**Version:** 1.0\
**Last updated:** 1 November 2026\
**Target market:** Indian families\
**Platform:** Responsive web application

## 1. Product vision

Make My Marriage helps a family plan and coordinate a wedding from one
shared digital space. It brings together the couple, family organizers
and invited guests so that event details, invitations, RSVPs, photos,
tasks and expenses are easier to manage.

The initial product should be simple, polished, mobile-friendly and
practical for families who coordinate wedding activities across
relatives and event groups.

## 2. Problem statement

Wedding planning is often coordinated across calls, messaging groups,
spreadsheets, email threads and scattered photo albums. This creates
common problems: - Event details are repeated and become inconsistent. -
Guest lists and invitation status are difficult to track. - RSVP
responses are scattered. - Family members do not have a clear division
of responsibilities. - Tasks and expenses are difficult to monitor
together. - Guests struggle to find event details and relevant
photographs. - Wedding information is spread across several tools.

Make My Marriage provides one shared application for the agreed V1
planning and guest-experience workflows.

## 3. Target users and personas

### 3.1 Couple / primary organizers

The bride and groom, or the designated couple account owner, set up the
wedding, invite organizers, create events, manage guests, review RSVPs
and oversee tasks and expenses.

Needs: - One dashboard with an overview. - Control over access and
permissions. - Visibility into guests, RSVPs, tasks and expenses. - A
polished wedding website and gallery.

### 3.2 Family organizers

Parents, siblings and trusted relatives help manage assigned parts of
the wedding.

Needs: - Shared access without sharing the couple's password. -
Permissions limited to their responsibilities. - Ability to manage
assigned events, guests, tasks or expenses.

### 3.3 Guests

Invited family members and friends need convenient access to event
information and RSVP.

Needs: - Open an invitation on mobile. - Access without a complicated
account-registration process. - View only relevant event information. -
Respond to invitations. - View permitted event photographs.

### 3.4 Public visitors

Visitors may view the published public wedding website, but must not see
private guest or organizer information.

## 4. Product scope and hard constraints

### 4.1 V1 scope

The MVP is for **exactly one wedding/marriage**. It is not a
multi-wedding SaaS product in this version.

Hard restrictions: - No multiple weddings. - No multi-tenant or
workspace architecture. - No user belonging to multiple weddings. - No
wedding switcher. - No subscription plans, billing, payment processing
or subscription collections in V1. These are deferred to Version 2.

### 4.2 Product/platform decisions

  Area                  Decision
  --------------------- ------------------------------------
  Audience              Indian families
  Platform              Responsive web
  Frontend              Angular
  Backend               Java Spring Boot
  Database              MongoDB Atlas
  Photo/media storage   Cloudflare R2
  Hosting               Render
  Architecture          Modular monolith
  Languages             English, Hindi, Marathi
  AI                    Not in MVP
  Livestream            External provider link/integration

## 5. MVP feature requirements

Priority meanings: - **P0:** Required for a usable MVP. - **P1:**
Important V1 capability; confirm exact launch cut before
implementation. - **Later:** Not included in the MVP.

### 5.1 Authentication and account access --- P0

Requirements: - Organizer registration and login. - Secure password
storage. - Logout and session/token lifecycle. - Password reset. -
Couple owner and family organizer access. - Permission-based module
access. - Guest access through secure invitation link and OTP flow, with
final OTP policy to be confirmed.

Acceptance criteria: - An unauthenticated user cannot access organizer
routes or APIs. - A family organizer cannot perform actions outside
assigned permissions. - Guests cannot access another guest's private
RSVP or invitation data. - Passwords and OTPs are never stored or logged
in plaintext.

### 5.2 Wedding setup and dashboard --- P0

Requirements: - Initial setup of the single wedding. - Capture couple
names, wedding date, timezone and venue. - Configure preferred and
enabled languages. - Dashboard showing key counts and recent activity.

Acceptance criteria: - Only one wedding can be configured in the
environment. - A second setup attempt is rejected with a clear
message. - Dashboard values reflect current events, guests, RSVPs, tasks
and expenses.

### 5.3 Organizer management and permissions --- P0

Requirements: - Couple can invite trusted family organizers. - Couple
can assign module-level permissions. - Couple can update or revoke
organizer access. - Organizers use their own accounts.

Acceptance criteria: - Organizer permissions are enforced by backend
APIs. - Revoked organizers lose access immediately or when their current
token/session is revalidated. - Family organizers cannot elevate their
own permissions.

### 5.4 Event management --- P0

Requirements: - Create, view, edit and archive wedding events. - Capture
event name/type, description, date/time, timezone and venue. - Associate
guests, invitations, RSVPs and galleries with events.

Acceptance criteria: - Event end time must be after event start time. -
Event information is displayed consistently to organizers and permitted
guests. - Guest event visibility is restricted to assigned events unless
the couple explicitly publishes information publicly.

### 5.5 Guest management --- P0

Requirements: - Add, edit, search and archive guests. - Capture name and
contact information. - Group guests by family/group. - Assign guests to
one or more events. - Support CSV import if included in launch cut.

Acceptance criteria: - Organizers can search and filter guests. -
Duplicate handling is defined for email/phone. - Guest private notes are
never shown in guest-facing views. - Guests can access only their own
invitation/RSVP context.

### 5.6 Invitations and RSVP --- P0

Requirements: - Create and send invitations for selected
guests/events. - Email delivery is part of the baseline. - Track
invitation delivery/status. - Resend invitations. - Guest can accept,
decline or mark maybe for assigned events. - Organizer can view
event-wise and overall RSVP summaries. - Reminder emails may be
configured.

Acceptance criteria: - Each guest can have one current RSVP per event. -
A guest cannot RSVP for an event to which they are not assigned. -
Invitation sending is idempotent to prevent accidental duplicate
sends. - Delivery failures are visible to organizers.

SMS was discussed as a possible invitation channel; provider, cost and
launch inclusion must be confirmed. WhatsApp is not in V1.

### 5.7 Wedding website --- P0/P1

Requirements: - A public-facing wedding page with couple names, wedding
information and selected event details. - Configurable publish/unpublish
control. - Localized content in English, Hindi and Marathi where
supplied. - Public page displays only approved content.

Acceptance criteria: - Private guest data, organizer data, notes and
expenses are never exposed publicly. - Unpublished website content is
not publicly accessible. - Public content is controlled by the couple.

### 5.8 Photo gallery --- P0

Requirements: - Event-wise albums. - Authorized organizer/photographer
uploads photos. - Photos stored in Cloudflare R2. - MongoDB stores photo
metadata and object keys. - Guests see galleries only for events/albums
they are allowed to access. - Couple/authorized organizers can manage
the full gallery. - Support image thumbnails/optimized variants where
practical.

Acceptance criteria: - R2 credentials never reach the browser. - Upload
and download URLs are short-lived and issued only after authorization. -
Guests cannot enumerate or download private photos from other events. -
Gallery is paginated/lazy-loaded and works on mobile.

Explicitly not included: - AI face recognition. - Automatic detection of
which guest appears in each photograph. - Personalized face-matched
guest galleries.

An earlier idea proposed opt-in selfie-based face matching, manual
tagging fallback and personalized photo links. This remains a future
concept, not an approved V1 requirement.

### 5.9 Tasks and responsibilities --- P0/P1

Requirements: - Create tasks. - Assign tasks to organizers. - Set due
date, priority and status. - Track completion.

Acceptance criteria: - Organizers can filter tasks by status, due date
and assignee. - Users without task permissions cannot modify tasks. -
Dashboard shows task progress.

### 5.10 Expense tracking --- P0/P1

Requirements: - Record wedding expenses. - Categorize expenses. -
Capture amount, date, payment status and notes. - Show totals and
category summaries. - Export data if included in launch cut.

Acceptance criteria: - Currency is explicit; INR is the default for the
initial Indian audience. - Amounts use safe decimal/minor-unit
handling. - Only authorized organizers can view or edit expense
records. - This is expense bookkeeping, not payment processing.

### 5.11 Notifications --- P0/P1

Requirements: - Email invitations and relevant reminders. - In-app
notifications for organizer activity such as RSVP updates or task
assignments. - Delivery status and retry handling.

Acceptance criteria: - Failed sends can be retried safely. - Retrying
does not create duplicate messages. - Users can manage supported
notification preferences.

### 5.12 External livestream link --- P1 / confirm launch cut

Requirements: - Organizer can configure an external livestream provider
URL for an event. - Permitted guests can see the link. - Organizer can
update or remove the link.

Acceptance criteria: - Only approved external URLs are accepted. - Link
visibility follows event access rules. - The product does not host or
process the video stream.

### 5.13 Attendance/check-in --- P1 / confirm launch cut

Attendance/check-in appeared in an earlier V1 feature proposal. Confirm
whether it is required for the initial release.

Potential requirements: - Organizer can mark a guest as checked in for
an event. - Event-level attendance summary is available. - Duplicate
check-in is handled safely.

## 6. Explicit exclusions

The following are not part of V1: - Subscription plans, recurring
subscriptions, billing and subscription collections (Version 2). -
Payment gateway or wedding vendor payments. - Multiple weddings,
multi-tenancy, workspaces or wedding switching. - User membership in
multiple weddings. - Vendor login, vendor portal or vendor
marketplace. - Seating optimization/table assignment. - Travel and
accommodation management. - AI features, AI recommendations and AI
photo/face recognition. - Internally built livestreaming or video
hosting. - WhatsApp messaging. - Advanced analytics beyond operational
summaries.

## 7. Key user journeys

### 7.1 Couple onboarding

1.  Couple organizer registers.
2.  Organizer verifies account and logs in.
3.  Organizer creates the single wedding profile.
4.  Organizer adds events.
5.  Organizer invites family organizers and assigns permissions.
6.  Organizer adds guests and assigns them to events.

### 7.2 Family organizer workflow

1.  Family organizer receives invitation.
2.  Organizer accepts and creates/signs into account.
3.  System loads only assigned modules.
4.  Organizer manages permitted guests/events/tasks/expenses.
5.  Couple can change or revoke permissions.

### 7.3 Guest RSVP workflow

1.  Guest receives invitation.
2.  Guest opens secure invitation link.
3.  Guest verifies access using the configured link/OTP policy.
4.  Guest views event details.
5.  Guest accepts, declines or marks maybe.
6.  Couple and organizers see updated RSVP counts.

### 7.4 Photo gallery workflow

1.  Authorized photographer/organizer selects an event album.
2.  Upload is authorized by backend.
3.  Browser uploads directly to Cloudflare R2 using a short-lived signed
    URL.
4.  Backend verifies upload and stores metadata.
5.  Guests assigned to the event view permitted album content.

### 7.5 Wedding expense workflow

1.  Authorized organizer records an expense.
2.  Expense is categorized and saved.
3.  Dashboard totals update.
4.  Couple reviews expenses by category and date.

## 8. Non-functional requirements

### Security and privacy

-   HTTPS for all traffic.
-   Secure password hashing.
-   Short-lived access tokens and refresh-token rotation.
-   Server-side RBAC/permission checks.
-   Rate limiting for authentication and OTP.
-   Private media by default.
-   Short-lived signed R2 URLs.
-   No secrets in source control or browser bundles.
-   Audit sensitive organizer and financial actions.
-   Minimize collection and exposure of guest personal information.

### Performance

-   Paginate large guest, photo, expense and task lists.
-   Use indexes for search and filtering.
-   Lazy-load gallery images and use thumbnails.
-   Avoid synchronous bulk email delivery in request threads.
-   Set measurable response-time targets before production load testing.

### Availability and recovery

-   Use managed MongoDB Atlas and backups.
-   Define backup retention and recovery objectives.
-   Monitor application, database, email and object-storage errors.
-   Provide health/readiness endpoints.

### Accessibility and usability

-   Responsive design for mobile-first guest usage.
-   Clear navigation and understandable forms.
-   Keyboard-accessible controls and readable contrast.
-   Useful empty, loading and error states.
-   Localized user-facing content in English, Hindi and Marathi.

## 9. Success metrics

Initial product metrics to instrument: - Percentage of setup flows
completed. - Number of events created. - Guests added per wedding. -
Invitation send success rate. - RSVP response rate. - Percentage of
guests accessing event information. - Gallery upload success rate and
gallery view activity. - Tasks completed by due date. - Expense records
created and categorized. - API error rate and median/p95 response time.

Do not set numeric targets until a pilot or baseline is available.

## 10. Release plan

### Phase 0 --- Foundation

-   Repository and project setup.
-   Angular shell and Spring Boot modular structure.
-   MongoDB Atlas connectivity.
-   Environment/secrets configuration.
-   Authentication and permission foundation.
-   Single-wedding setup.

### Phase 1 --- Core planning

-   Dashboard.
-   Organizers and permissions.
-   Events.
-   Guest management.
-   Invitations and RSVP.

### Phase 2 --- Wedding operations

-   Tasks.
-   Expenses.
-   Wedding website.
-   Notifications and reports.

### Phase 3 --- Guest experience

-   Event-wise gallery.
-   Cloudflare R2 upload/view flows.
-   External livestream link if confirmed.
-   Attendance/check-in if confirmed.
-   Responsive and localization polish.

## 11. Open product decisions

The following must be explicitly decided before implementation or
release: 1. Is organizer registration restricted to invitation, or can
the couple owner self-register? 2. Is guest OTP mandatory, optional, or
only required for private content? 3. Which email provider will be used?
4. Is SMS required in V1, and which provider? 5. Are guest CSV import
and exports required at launch? 6. Is attendance/check-in in the launch
scope? 7. Is livestream-link configuration required at launch? 8. Can
guests upload their own photos, or only photographers/organizers? 9.
What are image upload size/count limits and supported formats? 10. Are
gallery downloads allowed for guests? 11. How long should guest access
and photo galleries remain available after the wedding? 12. Which
wedding website sections are public by default? 13. What are the exact
permission presets for family organizers? 14. Are expenses and tasks P0
launch blockers or P1 follow-on capabilities?

## 12. Definition of MVP completion

The MVP is ready for a controlled pilot when: - A couple can create and
manage the one wedding. - Couple can add family organizers and restrict
their permissions. - Events and guests can be managed. - Invitations can
be sent and guest RSVPs captured. - Guest access is secure and scoped to
the guest's permitted events. - Event-wise galleries can be uploaded to
R2 and viewed securely. - Tasks and expenses can be recorded and
reviewed. - Public wedding website content can be published without
exposing private data. - Core flows work on mobile and desktop. -
Critical authorization, validation, upload and invitation tests pass. -
Production secrets, backups, monitoring and error handling are
configured.

## 13. Future direction --- Version 2 (not part of this PRD's MVP build)

Subscription plans, billing and payment capabilities are explicitly
deferred to Version 2. A future SaaS or multi-wedding direction must be
separately scoped and must not be introduced into the V1 data model or
APIs.
