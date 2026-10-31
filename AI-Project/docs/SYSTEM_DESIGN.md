# Make My Marriage --- System Design Architecture

**Document status:** MVP implementation baseline\
**Version:** 1.0\
**Architecture style:** Modular monolith\
**Frontend:** Angular\
**Backend:** Java Spring Boot\
**Database:** MongoDB Atlas\
**Object storage:** Cloudflare R2\
**Hosting:** Render

## 1. Overview

Make My Marriage is a responsive web application that helps an Indian
family plan and coordinate one marriage. The application provides a
shared organizer experience and controlled guest access for wedding
information, invitations, RSVP, event galleries, tasks and expenses.

The V1 system is a **modular monolith**. It is one deployable Spring
Boot backend organized into clear business modules. Do not split it into
microservices for the MVP.

## 2. Fixed V1 constraints

-   Exactly one wedding/marriage per deployment.
-   No multi-wedding, multi-tenant, workspace or wedding-switching
    design.
-   A user cannot belong to multiple weddings.
-   Subscription plans, billing, payments and subscription collections
    are deferred to Version 2.
-   No AI functionality or AI photo recognition in V1.
-   No vendor portal, seating optimization, or travel/accommodation
    module.
-   Livestream is an external URL integration only.
-   Language support: English, Hindi and Marathi.
-   Initial product platform: responsive web application.

## 3. High-level architecture

``` mermaid
flowchart TB
    Browser[Angular Responsive Web App]
    CDN[Static Hosting / HTTPS]
    API[Spring Boot REST API]
    Auth[Authentication and Authorization]
    Modules[Modular Monolith]
    Mongo[(MongoDB Atlas)]
    R2[(Cloudflare R2)]
    Email[Email Provider]
    SMS[SMS Provider - if enabled]
    External[External Livestream Provider]
    Render[Render Application Hosting]

    Browser --> CDN
    Browser -->|HTTPS JSON| API
    API --> Auth
    Auth --> Modules
    Modules --> Mongo
    Browser -->|Signed upload/download URLs| R2
    Modules -->|Sign URL / verify metadata| R2
    Modules --> Email
    Modules -.-> SMS
    Browser -->|External link| External
    Render --- API
```

The frontend never connects directly to MongoDB. The frontend does not
receive R2 secret credentials. All authorization and business rules live
in Spring Boot.

## 4. Frontend architecture

Suggested Angular feature areas:

``` text
src/app/
  core/
    auth/
    guards/
    interceptors/
    services/
    layout/
  shared/
    components/
    pipes/
    directives/
    models/
  features/
    onboarding/
    dashboard/
    wedding/
    organizers/
    events/
    guests/
    invitations/
    rsvp/
    gallery/
    tasks/
    expenses/
    website/
    livestream/
    notifications/
    reports/
  i18n/
```

Frontend responsibilities: - Responsive layouts for desktop, tablet and
mobile. - Organizer dashboard and guest-facing pages. - Route guards for
navigation convenience; backend remains authoritative for
authorization. - HTTP interceptor for access token handling. - Form
validation and user-friendly API errors. - English, Hindi and Marathi
localization. - Paginated lists, filters, loading states and empty
states. - Direct-to-R2 media upload using short-lived signed URLs. -
Never store long-lived secrets in browser storage.

## 5. Backend modular monolith

Suggested package structure:

``` text
com.makemymarriage
  config/
  common/
    exception/
    response/
    validation/
    security/
    audit/
  auth/
    controller/
    service/
    repository/
    dto/
    model/
  wedding/
  organizer/
  event/
  guest/
  invitation/
  rsvp/
  attendance/          # include if confirmed for V1
  gallery/
  media/
  task/
  expense/
  website/
  livestream/
  notification/
  report/
```

Each module owns its controllers, DTOs, services, repositories and
domain models. Modules communicate through service interfaces or
application events rather than reaching into another module's
repository.

### 5.1 Module responsibilities

  Module         Responsibility
  -------------- ------------------------------------------------------------
  Auth           Organizer registration/login, JWT, refresh, password reset
  Wedding        Singleton wedding configuration and dashboard summary
  Organizer      Couple/family organizer membership and permissions
  Event          Event schedule, venue and event lifecycle
  Guest          Guest records, search, import and event assignments
  Invitation     Invitation tokens, delivery status and resend
  RSVP           Guest responses and organizer summaries
  Attendance     Event check-in, if retained in V1
  Gallery        Albums, photo metadata and visibility
  Media          R2 signed URLs, upload verification and deletion
  Task           Task assignment, due dates and status
  Expense        Expense records, categories and totals
  Website        Published public wedding page
  Livestream     External provider URL configuration
  Notification   In-app notifications and email/SMS dispatch
  Report         Guest, RSVP, expense, task and attendance exports

## 6. Authentication and authorization

### Organizer authentication

-   Email/password registration and login.
-   Password hashing with BCrypt or Argon2.
-   Short-lived JWT access token.
-   Refresh-token rotation and revocation.
-   Email verification and password reset.
-   Role and permission enforcement in backend service/security layer.

### Guest authentication

-   Secure invitation link.
-   OTP verification if required by the chosen guest-access policy.
-   Short-lived guest session/token.
-   Guest can only see their own RSVP and permitted event content.

### Authorization model

Use role-based access control plus explicit permissions: - Couple owner:
full control. - Couple co-organizer: organizer permissions. - Family
organizer: only assigned module permissions. - Guest: limited guest
routes and permitted resources. - Public visitor: published wedding
website only.

Every API must check resource-level access. Never rely only on Angular
route guards or hidden buttons.

## 7. Single-wedding model

The system is configured around one primary wedding record: - The
onboarding flow creates it once. - A unique singleton key prevents a
second wedding record. - All events, guests, expenses, tasks, albums and
settings belong to that one wedding context. - Do not add a tenant
resolver, tenant ID, wedding switcher, workspace selector or
user-to-many-weddings mapping.

This is a deliberate V1 product constraint, not a temporary UI
limitation.

## 8. Main data flows

### 8.1 Organizer onboarding

``` mermaid
sequenceDiagram
    actor Organizer
    participant UI as Angular
    participant API as Spring Boot
    participant DB as MongoDB Atlas
    Organizer->>UI: Register / Login
    UI->>API: POST /auth/register or /auth/login
    API->>DB: Create/find user
    API-->>UI: Access token and user profile
    Organizer->>UI: Complete wedding setup
    UI->>API: POST /wedding/setup
    API->>DB: Atomic singleton wedding insert
    DB-->>API: Created or duplicate conflict
    API-->>UI: Wedding details
```

### 8.2 Invitation and RSVP

``` mermaid
sequenceDiagram
    actor Organizer
    actor Guest
    participant UI as Angular
    participant API as Spring Boot
    participant DB as MongoDB
    participant Mail as Email Provider
    Organizer->>UI: Select guests and events
    UI->>API: Create/send invitations
    API->>DB: Save invitation and outbox event
    API->>Mail: Send invitation
    Mail-->>Guest: Invitation link
    Guest->>UI: Open link
    UI->>API: Validate link / OTP flow
    API->>DB: Validate invitation and guest
    API-->>UI: Limited guest session
    Guest->>UI: Submit RSVP
    UI->>API: PUT /guest/rsvp/{eventId}
    API->>DB: Upsert RSVP
    API-->>UI: RSVP confirmation
```

### 8.3 Photo upload

``` mermaid
sequenceDiagram
    actor Organizer
    participant UI as Angular
    participant API as Spring Boot
    participant R2 as Cloudflare R2
    participant DB as MongoDB
    Organizer->>UI: Select photos
    UI->>API: Request upload URL
    API->>DB: Validate album/event permissions
    API->>R2: Create signed upload URL
    API-->>UI: Signed URL and object key
    UI->>R2: Upload image bytes
    UI->>API: Confirm upload
    API->>R2: Verify object metadata
    API->>DB: Save photo metadata
    API-->>UI: Photo available
```

### 8.4 Guest gallery read

1.  Guest authenticates through the configured guest-access flow.
2.  API loads guest identity and event assignments.
3.  API checks album visibility and event assignment.
4.  API returns only permitted photo metadata and short-lived view URLs.
5.  R2 serves the media object through the signed URL.

## 9. Media and storage design

Cloudflare R2 is the object store for original photos and optional
thumbnails. MongoDB contains metadata only.

Important controls: - Signed URLs must be short-lived. - Object keys
must be random and generated by the backend. - Validate file size, MIME
type and extension. - Check authorization before issuing upload and
download URLs. - Verify upload completion server-side. - Avoid public
buckets for private guest photos. - Do not put storage secrets in
Angular. - Define upload limits, thumbnail strategy, download policy,
retention and deletion behavior before launch.

The MVP uses event-wise galleries. It does not automatically identify
which guests appear in which photographs.

## 10. Notifications and asynchronous work

Use a notification outbox pattern: 1. Business operation writes its
database change and an outbox record. 2. A scheduled worker polls
pending outbox records. 3. Worker sends email (and SMS only if enabled).
4. Worker records provider result and retries transient failures with
backoff. 5. Idempotency prevents duplicate invitations/notifications.

Do not block a normal API response while sending bulk email. For a small
MVP, a Spring scheduled worker is sufficient; a separate message broker
is not required unless measured load justifies it.

## 11. Deployment architecture

Target hosting: - Angular static frontend hosted on a suitable static
hosting target. - Spring Boot API deployed on Render. - MongoDB Atlas
managed database. - Cloudflare R2 object storage. - External email
provider. - External livestream provider link.

Suggested environments: - Local development. - Staging/test. -
Production.

Keep environment-specific settings in environment variables or managed
secrets: - MongoDB connection string. - JWT signing secret/private
key. - R2 account/bucket/access credentials. - Email provider
credentials. - Allowed frontend origins. - Public API URL.

Never commit `.env`, secrets, database credentials or production tokens
to Git.

## 12. Security design

-   HTTPS everywhere.
-   Password hashing and token rotation.
-   Secure cookie settings if refresh tokens use cookies.
-   CORS allowlist.
-   CSRF protection when cookie-based auth requires it.
-   Rate limits for login, OTP and password reset.
-   Input validation and output DTOs.
-   Server-side permission and resource checks.
-   Signed private media URLs.
-   Secret management through deployment environment.
-   Audit logging for sensitive operations.
-   Redaction of personal data and tokens from logs.
-   Dependency scanning and regular patching.
-   Backups and tested restore procedures.

## 13. Reliability, performance and observability

MVP recommendations: - Paginate guests, photos, expenses, tasks and
notifications. - Add MongoDB indexes for actual query patterns. - Use
thumbnail images for gallery grids. - Lazy-load images and use
responsive image sizes. - Use asynchronous email dispatch. - Add
health/readiness endpoints. - Use structured logs with correlation
IDs. - Monitor API latency, error rate, database connectivity, R2
failures and email delivery. - Define backup frequency, retention and
recovery objectives before production.

Do not add Redis, Kafka, microservices or Kubernetes by default.
Introduce infrastructure only when a demonstrated requirement justifies
it.

## 14. Scalability path

The MVP is deliberately a modular monolith. Keep module boundaries clear
so that high-load capabilities can be extracted later if needed.
Potential future areas include media processing and notification
delivery. This is a future option, not a V1 requirement.

Long-term SaaS or multi-wedding support would require a separate
architecture review, data isolation model, authorization redesign and
migration plan. Do not pre-build multi-tenancy in V1.

## 15. Out of scope

-   Multi-wedding / multi-tenant support.
-   Subscription, plan, billing and payment infrastructure.
-   Vendor login or vendor management portal.
-   Seating optimization.
-   Travel/accommodation.
-   AI and facial recognition.
-   Internally hosted livestreaming.
-   WhatsApp messaging in V1.
-   Microservices, Kafka, Kubernetes or Redis unless separately
    justified.
