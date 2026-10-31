# Make My Marriage --- API Design

**Document status:** MVP implementation baseline\
**Version:** 1.0\
**Last updated:** 1 November 2026\
**Backend:** Java + Spring Boot\
**Database:** MongoDB Atlas\
**Media storage:** Cloudflare R2\
**API style:** REST / JSON\
**Base path:** `/api/v1`

> This document translates the agreed MVP product scope into an
> implementable API contract. Endpoint names and payloads below are
> proposed design conventions, not claims that the APIs already exist.
> Items marked **Decision needed** require product confirmation before
> implementation.

## 1. Product and scope constraints

Make My Marriage is a responsive web application for an Indian family to
organize one marriage. The MVP is intentionally limited to **exactly one
wedding/marriage**.

Hard constraints: - Do not introduce multi-wedding, multi-tenant,
organization/workspace, or wedding-switching concepts. - A user may not
belong to multiple weddings. - Do not add subscription, plan, billing,
payment, invoice, or subscription collection APIs in V1. These are
deferred to Version 2. - No vendor portal/vendor management module,
seating optimization, travel/accommodation management, or AI photo/face
recognition in V1. - Live streaming is an external integration: store
and present an organizer-configured external stream URL; do not build a
streaming platform. - The agreed stack is Angular, Java Spring Boot,
MongoDB Atlas, Cloudflare R2, and Render. - Supported interface
languages: English, Hindi, and Marathi.

## 2. API conventions

### 2.1 Base URL and headers

Example base URL:

``` text
https://<api-host>/api/v1
```

Headers:

``` http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access-token>
Accept-Language: en
```

`Authorization` is required for organizer and couple endpoints. Guest
endpoints may use a short-lived guest access token issued after
invitation-link validation or OTP verification.

### 2.2 Naming and pagination

-   Use plural resource names: `/events`, `/guests`, `/expenses`.
-   Use `camelCase` in JSON.
-   Use ISO-8601 timestamps in UTC, e.g. `2026-12-10T09:30:00Z`.
-   Use ISO date strings for date-only fields, e.g. `2026-12-10`.
-   Use MongoDB ObjectId values serialized as strings.
-   Paginated list response convention:

``` json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalItems": 0,
  "totalPages": 0,
  "hasNext": false
}
```

Common query parameters: `page`, `size`, `sort`, `direction`, `search`,
and resource-specific filters. Default page size: 20; maximum: 100.

### 2.3 Standard success and error responses

Single-resource success:

``` json
{
  "data": {
    "id": "6650f4...",
    "name": "Wedding"
  },
  "message": "Request completed successfully"
}
```

Error:

``` json
{
  "timestamp": "2026-11-01T00:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "path": "/api/v1/events"
}
```

Recommended status codes: - `200 OK`: successful read/update/action. -
`201 Created`: resource created. - `202 Accepted`: asynchronous work
accepted. - `204 No Content`: successful deletion where no response body
is needed. - `400 Bad Request`: invalid input. - `401 Unauthorized`:
missing/invalid authentication. - `403 Forbidden`: authenticated but not
permitted. - `404 Not Found`: resource does not exist or is not visible
to caller. - `409 Conflict`: duplicate/conflicting state transition. -
`413 Payload Too Large`: upload too large. -
`415 Unsupported Media Type`: unsupported file type. -
`429 Too Many Requests`: rate limit. - `500 Internal Server Error`:
unexpected server failure.

Never return stack traces, secrets, storage credentials, OTP values, or
internal exception details to clients.

## 3. Authentication and access model

### 3.1 Actors

  -----------------------------------------------------------------------
  Actor                               Access
  ----------------------------------- -----------------------------------
  Couple / primary owner              Full access to wedding
                                      configuration and all modules

  Couple / co-organizer               Shared organizer access according
                                      to assigned permissions

  Family organizer                    Access only to modules and actions
                                      explicitly granted

  Guest                               Limited access through invitation
                                      link and/or OTP; RSVP and permitted
                                      event/gallery content

  Public visitor                      Public wedding website content
                                      only, if the couple enables it
  -----------------------------------------------------------------------

There is one wedding context in V1. Do not model a user-to-many-weddings
relationship.

### 3.2 Authentication endpoints

  -------------------------------------------------------------------------
  Method                  Endpoint                  Purpose
  ----------------------- ------------------------- -----------------------
  POST                    `/auth/register`          Register an organizer
                                                    account

  POST                    `/auth/login`             Authenticate with
                                                    email/password

  POST                    `/auth/refresh`           Rotate/refresh access
                                                    token

  POST                    `/auth/logout`            Revoke refresh
                                                    token/session

  POST                    `/auth/forgot-password`   Request password reset

  POST                    `/auth/reset-password`    Complete password reset

  GET                     `/auth/me`                Return current account
                                                    and assigned
                                                    role/permissions

  POST                    `/auth/change-password`   Change authenticated
                                                    user's password
  -------------------------------------------------------------------------

Registration request:

``` json
{
  "fullName": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "StrongPassword!"
}
```

Login request:

``` json
{
  "email": "aarav@example.com",
  "password": "StrongPassword!"
}
```

Login response:

``` json
{
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<secure-refresh-token>",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "6650f4...",
      "fullName": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "COUPLE_OWNER"
    }
  }
}
```

Security requirements: - Hash passwords using BCrypt or Argon2; never
store plaintext passwords. - Prefer refresh tokens in Secure, HttpOnly,
SameSite cookies for browser clients. - Keep access tokens short-lived;
rotate refresh tokens and revoke on logout. - Apply rate limits to
login, password reset, OTP send and OTP verify. - Do not reveal whether
an email exists in password-reset responses. - Enforce authorization on
the server for every protected operation; hiding UI controls is not
authorization.

### 3.3 Guest invitation and OTP access

Guests should not need a full organizer account. A guest can open a
secure invitation link and, where configured, verify a one-time password
sent to the invited contact.

  --------------------------------------------------------------------------------------
  Method                  Endpoint                               Purpose
  ----------------------- -------------------------------------- -----------------------
  POST                    `/guest-access/invitations/validate`   Validate invitation
                                                                 token

  POST                    `/guest-access/otp/send`               Send OTP to invited
                                                                 contact

  POST                    `/guest-access/otp/verify`             Verify OTP and issue
                                                                 guest token

  GET                     `/guest-access/me`                     Return guest identity
                                                                 and allowed access

  POST                    `/guest-access/logout`                 End guest session
  --------------------------------------------------------------------------------------

OTP verify request:

``` json
{
  "invitationToken": "<opaque-token>",
  "otp": "123456"
}
```

The response must contain only the guest's allowed event, RSVP and
gallery access. Invitation tokens and OTPs must be random, time-limited,
single-use where applicable, stored hashed where practical, and never
logged.

**Decision needed:** whether OTP is mandatory for every guest, optional
for selected invitations, or replaced by signed invitation links for
low-risk public content.

## 4. Wedding setup and dashboard

The MVP contains one wedding record. The setup flow creates that record
once. There must not be a `weddingId` selector or a
create-another-wedding workflow.

  -----------------------------------------------------------------------
  Method                  Endpoint                Purpose
  ----------------------- ----------------------- -----------------------
  POST                    `/wedding/setup`        Create the single
                                                  wedding record during
                                                  initial setup

  GET                     `/wedding`              Read wedding details

  PATCH                   `/wedding`              Update wedding details

  GET                     `/dashboard/summary`    Dashboard counts and
                                                  summary

  GET                     `/dashboard/activity`   Recent activity feed
  -----------------------------------------------------------------------

Example setup request:

``` json
{
  "title": "Aarav & Ananya Wedding",
  "brideName": "Ananya Sharma",
  "groomName": "Aarav Sharma",
  "weddingDate": "2027-02-14",
  "timezone": "Asia/Kolkata",
  "primaryLanguage": "en",
  "enabledLanguages": ["en", "hi", "mr"],
  "venue": {
    "name": "Example Lawns",
    "address": "Pune, Maharashtra"
  }
}
```

Wedding response should include `id`, couple names, date, timezone,
venue, website settings, enabled languages, created/updated timestamps.
Only an authorized couple organizer may update sensitive wedding
settings.

Dashboard summary example:

``` json
{
  "data": {
    "eventCount": 4,
    "guestCount": 180,
    "invitedCount": 150,
    "acceptedCount": 95,
    "pendingRsvpCount": 35,
    "taskCount": 28,
    "completedTaskCount": 12,
    "expenseTotal": 425000,
    "recentActivity": []
  }
}
```

## 5. Organizer and permissions

  ------------------------------------------------------------------------------------------
  Method                  Endpoint                                   Purpose
  ----------------------- ------------------------------------------ -----------------------
  GET                     `/organizers`                              List organizers

  POST                    `/organizers/invitations`                  Invite a family
                                                                     organizer

  POST                    `/organizers/invitations/{token}/accept`   Accept organizer
                                                                     invitation

  GET                     `/organizers/{organizerId}`                Get organizer details

  PATCH                   `/organizers/{organizerId}`                Update organizer
                                                                     profile/permissions

  DELETE                  `/organizers/{organizerId}`                Revoke organizer access

  GET                     `/permissions/catalog`                     Return supported
                                                                     permission keys
  ------------------------------------------------------------------------------------------

Example organizer invitation:

``` json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "permissions": [
    "EVENTS_READ",
    "EVENTS_WRITE",
    "GUESTS_READ",
    "GUESTS_WRITE",
    "RSVP_READ"
  ]
}
```

Suggested permission keys: - `WEDDING_READ`, `WEDDING_WRITE` -
`ORGANIZERS_READ`, `ORGANIZERS_WRITE` - `EVENTS_READ`, `EVENTS_WRITE`,
`EVENTS_DELETE` - `GUESTS_READ`, `GUESTS_WRITE`, `GUESTS_DELETE` -
`INVITATIONS_READ`, `INVITATIONS_SEND` - `RSVP_READ`, `RSVP_WRITE` -
`GALLERY_READ`, `GALLERY_WRITE`, `GALLERY_DELETE` - `TASKS_READ`,
`TASKS_WRITE`, `TASKS_DELETE` - `EXPENSES_READ`, `EXPENSES_WRITE`,
`EXPENSES_DELETE` - `REPORTS_READ`, `REPORTS_EXPORT` - `WEBSITE_READ`,
`WEBSITE_WRITE` - `LIVESTREAM_READ`, `LIVESTREAM_WRITE`

The couple owner retains control over organizer access. A family
organizer must not grant themselves additional permissions.

## 6. Events

  -----------------------------------------------------------------------------
  Method                  Endpoint                      Purpose
  ----------------------- ----------------------------- -----------------------
  GET                     `/events`                     List events

  POST                    `/events`                     Create event

  GET                     `/events/{eventId}`           Get event details

  PATCH                   `/events/{eventId}`           Update event

  DELETE                  `/events/{eventId}`           Delete/archive event

  GET                     `/events/{eventId}/summary`   Event-specific
                                                        guest/RSVP/gallery
                                                        summary
  -----------------------------------------------------------------------------

Example:

``` json
{
  "name": "Haldi Ceremony",
  "description": "Haldi celebration",
  "eventType": "HALDI",
  "startAt": "2027-02-13T04:30:00Z",
  "endAt": "2027-02-13T07:30:00Z",
  "timezone": "Asia/Kolkata",
  "venue": {
    "name": "Family Residence",
    "address": "Pune, Maharashtra"
  },
  "visibility": "INVITED_GUESTS"
}
```

Validate that event end time is after start time. Events are part of the
single wedding, not independently owned wedding tenants.

## 7. Guest management, invitations and RSVP

### 7.1 Guests

  Method   Endpoint                     Purpose
  -------- ---------------------------- -----------------------------------
  GET      `/guests`                    List/search guests
  POST     `/guests`                    Create guest
  POST     `/guests/bulk-import`        Import guests from CSV
  GET      `/guests/{guestId}`          Get guest
  PATCH    `/guests/{guestId}`          Update guest
  DELETE   `/guests/{guestId}`          Archive/delete guest
  GET      `/guests/{guestId}/events`   List assigned events
  PUT      `/guests/{guestId}/events`   Replace guest's event assignments

Guest example:

``` json
{
  "fullName": "Meera Patil",
  "email": "meera@example.com",
  "phone": "+919876543210",
  "familyGroup": "Bride Family",
  "preferredLanguage": "mr",
  "notes": "Vegetarian",
  "eventIds": ["event-id-1", "event-id-2"]
}
```

Keep dietary information optional and access-controlled. Do not collect
unnecessary sensitive personal data.

### 7.2 Invitations

  Method   Endpoint                               Purpose
  -------- -------------------------------------- -----------------------------------
  POST     `/invitations`                         Create invitation for guest/event
  POST     `/invitations/send`                    Send pending invitations
  POST     `/invitations/{invitationId}/resend`   Resend invitation
  GET      `/invitations`                         List/filter invitations
  GET      `/invitations/{invitationId}`          Get invitation status

Example send request:

``` json
{
  "guestIds": ["guest-id-1", "guest-id-2"],
  "eventIds": ["event-id-1"],
  "channels": ["EMAIL"]
}
```

Email is in the agreed baseline. SMS is a planned channel from the
earlier scope discussion; confirm provider, cost and launch requirement
before enabling it. Do not add WhatsApp in V1.

### 7.3 RSVP

  Method   Endpoint                    Purpose
  -------- --------------------------- ---------------------------------
  GET      `/guest/rsvp`               Guest reads their RSVP requests
  PUT      `/guest/rsvp/{eventId}`     Guest submits/updates RSVP
  GET      `/events/{eventId}/rsvps`   Organizer lists event RSVPs
  GET      `/rsvps/summary`            Overall RSVP summary

RSVP request:

``` json
{
  "status": "ACCEPTED",
  "attendeeCount": 2,
  "message": "Looking forward to it"
}
```

Allowed status values: `PENDING`, `ACCEPTED`, `DECLINED`, `MAYBE`. The
guest may respond only for events assigned to that guest. Organizer
reports must aggregate counts without exposing another guest's private
invitation token.

## 8. Attendance / check-in

Attendance/check-in was proposed as part of the earlier V1 feature list;
confirm whether it is required for launch.

  ------------------------------------------------------------------------------------------
  Method                  Endpoint                                   Purpose
  ----------------------- ------------------------------------------ -----------------------
  GET                     `/events/{eventId}/attendance`             List attendance

  POST                    `/events/{eventId}/attendance/check-in`    Check in a guest

  PATCH                   `/events/{eventId}/attendance/{guestId}`   Correct attendance
                                                                     record

  GET                     `/events/{eventId}/attendance/summary`     Attendance counts
  ------------------------------------------------------------------------------------------

Check-in request:

``` json
{
  "guestId": "guest-id-1",
  "attendeeCount": 2,
  "checkedInAt": "2027-02-13T05:10:00Z"
}
```

## 9. Photo gallery and media uploads

### 9.1 V1 gallery behavior

-   Galleries/albums are associated with wedding events.
-   Photographer/authorized organizer uploads photos.
-   Guests see only galleries/albums permitted for their event access.
-   The couple/authorized organizers can manage the complete gallery.
-   Store media objects in Cloudflare R2; MongoDB stores metadata and
    object keys, not image binaries.
-   Use thumbnails/optimized variants where implemented.
-   Do not implement AI face recognition, face grouping, or automatic
    "photos I appear in" filtering in V1.

### 9.2 Album and photo APIs

  ----------------------------------------------------------------------------
  Method                  Endpoint                     Purpose
  ----------------------- ---------------------------- -----------------------
  GET                     `/events/{eventId}/albums`   List event albums
                                                       visible to caller

  POST                    `/events/{eventId}/albums`   Create album

  GET                     `/albums/{albumId}`          Get album

  PATCH                   `/albums/{albumId}`          Update album

  DELETE                  `/albums/{albumId}`          Archive/delete album

  GET                     `/albums/{albumId}/photos`   List photos

  POST                    `/media/uploads/presign`     Request signed R2
                                                       upload URL

  POST                    `/media/uploads/complete`    Confirm upload and save
                                                       metadata

  GET                     `/photos/{photoId}`          Get photo metadata and
                                                       authorized view URL

  DELETE                  `/photos/{photoId}`          Delete photo and
                                                       schedule object removal

  POST                    `/photos/bulk-delete`        Bulk delete selected
                                                       photos
  ----------------------------------------------------------------------------

Presign request:

``` json
{
  "fileName": "haldi-001.jpg",
  "contentType": "image/jpeg",
  "fileSizeBytes": 2457600,
  "eventId": "event-id-1",
  "albumId": "album-id-1"
}
```

Presign response:

``` json
{
  "data": {
    "uploadId": "upload-id",
    "objectKey": "wedding/events/event-id-1/albums/album-id-1/uuid.jpg",
    "uploadUrl": "https://<signed-r2-upload-url>",
    "method": "PUT",
    "expiresAt": "2026-11-01T00:15:00Z",
    "requiredHeaders": {
      "Content-Type": "image/jpeg"
    }
  }
}
```

Complete request:

``` json
{
  "uploadId": "upload-id",
  "objectKey": "wedding/events/event-id-1/albums/album-id-1/uuid.jpg",
  "fileName": "haldi-001.jpg",
  "contentType": "image/jpeg",
  "fileSizeBytes": 2457600,
  "eventId": "event-id-1",
  "albumId": "album-id-1"
}
```

Upload security: - The backend authorizes the upload before issuing a
short-lived signed URL. - Validate MIME type, extension, file size,
event/album access and allowed image formats. - Never expose R2 access
keys or secret credentials to Angular. - Use random object keys; do not
trust client-supplied paths. - Verify object existence/size after upload
before marking it available. - Use short-lived signed download URLs or
an authenticated media proxy. - Deletion should remove metadata and the
R2 object safely; define retry handling for failed object deletion.

**Decision needed:** upload size/count limits, supported formats,
thumbnail generation mechanism, retention/deletion policy, guest
download permission, and whether guests may upload photos. Current
baseline assumes authorized photographer/organizer uploads.

## 10. Tasks

  Method   Endpoint                   Purpose
  -------- -------------------------- ---------------------
  GET      `/tasks`                   List/filter tasks
  POST     `/tasks`                   Create task
  GET      `/tasks/{taskId}`          Get task
  PATCH    `/tasks/{taskId}`          Update task
  DELETE   `/tasks/{taskId}`          Delete/archive task
  PATCH    `/tasks/{taskId}/status`   Change task status

Task example:

``` json
{
  "title": "Finalize invitation design",
  "description": "Approve the final invitation artwork",
  "assigneeOrganizerId": "organizer-id",
  "dueDate": "2027-01-10",
  "priority": "HIGH",
  "status": "TODO"
}
```

Suggested statuses: `TODO`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`.
Suggested priorities: `LOW`, `MEDIUM`, `HIGH`.

## 11. Expenses

Expense tracking is for recording and monitoring wedding expenses. It is
not a payment-processing or billing feature.

  Method   Endpoint                  Purpose
  -------- ------------------------- ---------------------------
  GET      `/expenses`               List/filter expenses
  POST     `/expenses`               Create expense
  GET      `/expenses/{expenseId}`   Get expense
  PATCH    `/expenses/{expenseId}`   Update expense
  DELETE   `/expenses/{expenseId}`   Delete/archive expense
  GET      `/expenses/summary`       Totals by category/status
  GET      `/expenses/export`        Export expense report

Example:

``` json
{
  "title": "Venue advance",
  "category": "VENUE",
  "amount": 50000,
  "currency": "INR",
  "expenseDate": "2026-11-01",
  "paymentStatus": "PAID",
  "paidBy": "Aarav",
  "notes": "Advance paid to venue"
}
```

Do not store card/bank credentials or initiate payments. Expense
`paymentStatus` is a bookkeeping field only.

## 12. Wedding website and public content

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  GET                     `/public/wedding-site/{slug}`   Read enabled public
                                                          wedding website

  GET                     `/website/settings`             Read website settings
                                                          as organizer

  PATCH                   `/website/settings`             Update website settings

  PATCH                   `/website/publish`              Publish/unpublish
                                                          website
  -------------------------------------------------------------------------------

Public API must return only explicitly published fields. Do not expose
guest lists, phone numbers, private notes, expense data, organizer
permissions, or private albums.

## 13. External livestream link

  --------------------------------------------------------------------------------
  Method                  Endpoint                         Purpose
  ----------------------- -------------------------------- -----------------------
  GET                     `/events/{eventId}/livestream`   Get configured stream
                                                           details if caller is
                                                           allowed

  PUT                     `/events/{eventId}/livestream`   Set/update external
                                                           stream link

  DELETE                  `/events/{eventId}/livestream`   Remove stream link
  --------------------------------------------------------------------------------

Example:

``` json
{
  "provider": "YOUTUBE",
  "url": "https://www.youtube.com/live/example",
  "visibility": "INVITED_GUESTS",
  "startsAt": "2027-02-14T10:00:00Z"
}
```

The application stores and displays a link. It does not ingest, encode,
record, or distribute video itself. Provider allowlist and URL
validation are required.

## 14. Notifications

  Method   Endpoint                                 Purpose
  -------- ---------------------------------------- -----------------------------------
  GET      `/notifications`                         List current user's notifications
  PATCH    `/notifications/{notificationId}/read`   Mark one as read
  POST     `/notifications/read-all`                Mark all as read
  GET      `/notification-preferences`              Get preferences
  PATCH    `/notification-preferences`              Update preferences

Notification events may include organizer invitations, RSVP updates,
task assignments and reminders. Email delivery is part of the baseline.
SMS channel and reminder schedules need provider/product confirmation.
Do not send duplicate messages on retries; use idempotency keys or a
notification outbox.

## 15. Reports and exports

  -----------------------------------------------------------------------
  Method                  Endpoint                Purpose
  ----------------------- ----------------------- -----------------------
  GET                     `/reports/guests`       Guest and invitation
                                                  report

  GET                     `/reports/rsvp`         RSVP report

  GET                     `/reports/expenses`     Expense report

  GET                     `/reports/tasks`        Task progress report

  GET                     `/reports/attendance`   Attendance report, if
                                                  check-in is enabled
  -----------------------------------------------------------------------

Support CSV export initially where useful. PDF generation is optional
and should not block the core MVP.

## 16. Health and operational endpoints

  Method   Endpoint                       Purpose
  -------- ------------------------------ --------------------
  GET      `/actuator/health`             Application health
  GET      `/actuator/health/readiness`   Readiness
  GET      `/actuator/health/liveness`    Liveness

Expose only safe health information publicly. Secure other actuator
endpoints.

## 17. Core workflows

### 17.1 Organizer onboarding

1.  Organizer registers and verifies their account.
2.  Organizer logs in.
3.  Organizer calls `POST /wedding/setup` once.
4.  Backend creates the single wedding and owner membership/role.
5.  Organizer creates events, invites family organizers, and adds
    guests.

### 17.2 Guest invitation and RSVP

1.  Organizer creates guest records.
2.  Organizer assigns guests to events.
3.  Organizer creates and sends invitations.
4.  Guest opens invitation link.
5.  Guest validates link and completes OTP if required.
6.  Guest views permitted event details and submits RSVP.
7.  Organizer sees updated RSVP summaries.

### 17.3 Photo upload and viewing

1.  Authorized organizer requests an upload URL.
2.  Backend validates access and returns a short-lived R2 signed URL.
3.  Browser uploads directly to R2.
4.  Browser calls upload completion endpoint.
5.  Backend verifies object and stores photo metadata in MongoDB.
6.  Authorized guests view event albums through permission-checked APIs.

### 17.4 Organizer permission check

Every request must be evaluated against the authenticated identity,
role, permission set, and resource. A client-supplied `organizerId`,
`guestId`, `eventId`, or object key is not proof of authorization.

## 18. Cross-cutting implementation requirements

-   Validate all request DTOs using Jakarta Bean Validation.
-   Use centralized exception handling (`@RestControllerAdvice`).
-   Use DTOs rather than exposing MongoDB documents directly.
-   Add request correlation IDs and structured logs; redact tokens,
    OTPs, passwords, and personal data.
-   Apply CORS allowlists, HTTPS, secure cookies, CSRF protection where
    cookie-based authentication is used, and rate limiting.
-   Add audit records for permission changes, invitation sending, guest
    data changes, media deletion and expense edits.
-   Use idempotency for externally visible actions such as invitation
    sends and upload completion.
-   Use asynchronous processing for email and image variants where
    appropriate.
-   Add OpenAPI/Swagger documentation and integration tests for
    role/permission boundaries.
-   All list endpoints must be paginated and bounded.
-   Use soft deletion where recovery/audit is required; define permanent
    deletion behavior for personal data.

## 19. Decisions to close before implementation

1.  Organizer registration: email/password only, or social login too?
2.  Guest access: OTP always, OTP optionally, or secure invitation link
    only for some content?
3.  Email and SMS providers and whether SMS is in launch scope.
4.  Attendance/check-in: required in V1 or later?
5.  Gallery: photographer-only uploads or guest uploads too?
6.  Media limits, thumbnail processing, download policy and retention.
7.  Livestream provider allowlist and whether the feature is required at
    launch.
8.  Website slug rules and which fields are public.
9.  Exact organizer permission presets.
10. CSV/PDF export requirements.

## 20. Explicitly out of scope

No endpoints should be created for: - Subscription plans, subscriptions,
billing, invoices or recurring payments (Version 2). - Payment gateway
transactions. - Multiple weddings, wedding switching, tenant/workspace
management. - Vendor portal or vendor marketplace. - Seating
optimization. - Travel or accommodation booking. - AI/face recognition
or automatic guest-photo matching. - Native livestream infrastructure. -
WhatsApp messaging in V1.
