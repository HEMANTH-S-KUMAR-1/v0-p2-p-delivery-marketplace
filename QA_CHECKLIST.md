# RouteDrop — End-to-End Manual Testing Checklist

> **How to use:** Copy this file into Notion, GitHub Issues, or any Markdown-compatible tool and tick off each item as you test.
> Mark each item `[x]` when it passes, or add a note if it fails.
>
> **Test Environment Prerequisites:**
> - Local dev server running (`npm run dev` → `http://localhost:3000`)
> - `.env.local` configured with valid Supabase, Razorpay (test-mode keys: `rzp_test_…`), and platform account credentials
> - Razorpay test-mode enabled in the dashboard
> - Two separate browser sessions (or incognito windows) ready — one for the **Sender** and one for the **Traveler**

---

## 1. Authentication & Onboarding

### 1.1 New User Signup

| # | Action | Expected Result |
|---|--------|----------------|
| — | Navigate to `/signup` | Signup form is rendered with no console errors |

- [ ] **TC-AUTH-01** — Enter a valid email and a password of ≥ 8 characters, then click **Sign Up**. → Account is created, user is redirected to `/dashboard`, and the header shows the authenticated user avatar/menu.
- [ ] **TC-AUTH-02** — Click **Sign Up** with the **email field empty**. → HTML5 / form validation prevents submission; a "required" error is shown inline.
- [ ] **TC-AUTH-03** — Enter an invalid email format (e.g., `notanemail`) and submit. → Validation error "Please enter a valid email" is shown; the request is never sent to Supabase.
- [ ] **TC-AUTH-04** — Enter a valid email but leave the password field empty and submit. → Validation error is shown; form does not submit.
- [ ] **TC-AUTH-05** — Enter a valid email and a password shorter than the minimum (e.g., `abc`) and submit. → Supabase or form validation returns an error explaining the password requirement.
- [ ] **TC-AUTH-06** — Try to sign up with an email that is already registered. → Error message "User already registered" (or equivalent Supabase error) is displayed without crashing the page.
- [ ] **TC-AUTH-07** — While on the signup form, toggle the **eye icon** on the password field. → Password text becomes visible / is hidden correctly.

### 1.2 Login — Password Mode

| # | Action | Expected Result |
|---|--------|----------------|
| — | Navigate to `/login` | Login page loads; the **Password** tab is active by default |

- [ ] **TC-LOGIN-01** — Enter valid credentials and click **Sign In**. → User is redirected to `/dashboard`; session cookie is set.
- [ ] **TC-LOGIN-02** — Enter a valid email but wrong password and click **Sign In**. → Error message "Invalid login credentials" (or equivalent) shown in the red error banner; the user stays on `/login`.
- [ ] **TC-LOGIN-03** — Leave both email and password empty and click **Sign In**. → HTML5 required validation fires; form does not submit.
- [ ] **TC-LOGIN-04** — Enter an invalid email format and click **Sign In**. → Inline validation error shown before the request is sent.
- [ ] **TC-LOGIN-05** — After a successful login, navigate to `/login` directly. → User is redirected away from the login page (or the dashboard is shown), not shown the form again.
- [ ] **TC-LOGIN-06** — Click the **eye icon** to toggle password visibility. → Password text toggles between visible and hidden.

### 1.3 Login — Email OTP Mode

- [ ] **TC-OTP-01** — Switch to the **Email OTP** tab, enter a valid registered email, click **Send OTP**. → Success banner "A 6-digit code was sent to …" is shown; loading spinner appears during the request and disappears afterwards.
- [ ] **TC-OTP-02** — Enter an invalid email format in OTP mode and click **Send OTP**. → Validation error is shown; no API call is made.
- [ ] **TC-OTP-03** — In the OTP entry screen, enter the correct 6-digit code received by email and click **Verify**. → User is logged in and redirected to `/dashboard`.
- [ ] **TC-OTP-04** — Enter an incorrect or expired OTP code. → Error message from Supabase is shown; user stays on the OTP entry screen.
- [ ] **TC-OTP-05** — Click **Send OTP** on an unregistered email. → Supabase returns an appropriate error or creates a new account (depending on the `shouldCreateUser` setting); no unhandled crash occurs.

### 1.4 Aadhaar KYC Flow

> **Note:** The KYC endpoint is at `POST /api/kyc/verify`. In dev mode it uses a mock that succeeds for any valid 12-digit Aadhaar number.

- [ ] **TC-KYC-01** — While logged in, submit a valid 12-digit Aadhaar number (e.g., `123456789012`). → Loading indicator shown during the request. On success, a "Verified" badge appears in the UI and `kyc_status = 'verified'` is confirmed in the Supabase `users` table.
- [ ] **TC-KYC-02** — Submit an Aadhaar number with fewer than 12 digits (e.g., `12345`). → API returns HTTP 422 with error "Invalid Aadhaar number format. Must be 12 digits."; the UI shows the error inline and does **not** update the KYC status.
- [ ] **TC-KYC-03** — Submit an Aadhaar number with non-numeric characters (e.g., `12345ABCD678`). → Same 422 error as above; badge is **not** shown.
- [ ] **TC-KYC-04** — Submit a valid Aadhaar while logged out (no session). → API returns HTTP 401 "Unauthorized"; the UI prompts the user to log in first.
- [ ] **TC-KYC-05** — After a successful KYC verification, attempt to verify again. → The masked Aadhaar (e.g., `XXXX-XXXX-0012`) and the `ref` are returned; the `aadhaar_ref` column in the database is overwritten without error.
- [ ] **TC-KYC-06** — Confirm in Supabase that the `users` table row has `kyc_status = 'verified'` and `aadhaar_ref = 'SETU-…'` after a successful verification.

---

## 2. Sender Flow — Booking & Matching

### 2.1 Route Search

- [ ] **TC-SEND-01** — Navigate to `/` (landing page). In the **Send a Parcel** tab, select **From** city "Tumkur", **To** city "Bengaluru", choose a date, and click **Find Travelers**. → Browser navigates to `/send?from=Tumkur&to=Bengaluru&date=<chosen-date>`; a list of available traveler cards is rendered.
- [ ] **TC-SEND-02** — Navigate to `/send` without any query parameters. → Default values ("Mumbai" → "Pune") are used; traveler cards are still rendered without a blank page or error.
- [ ] **TC-SEND-03** — Confirm the route header correctly reflects the searched **From** and **To** cities from the URL query parameters.
- [ ] **TC-SEND-04** — Verify that each traveler card shows: **Name**, **Rating**, **Trip count**, **KYC-verified badge** (for all verified travelers), **Departure time**, **Vehicle type icon**, **Trunk space label**, and **Asking price**.
- [ ] **TC-SEND-05** — Verify all mock travelers (`T-001` through `T-005`) are displayed with unique details.

### 2.2 Pricing Verification

- [ ] **TC-PRICE-01** — On the checkout screen, confirm the **Escrow Amount** displayed equals `askingPrice + ₹20` (platform fee). E.g., for Rahul Sharma (₹250 asking price) the total should be **₹270**.
- [ ] **TC-PRICE-02** — Select each of the five traveler profiles in turn and verify the checkout screen consistently shows `travelerAskingPrice + 20` as the escrow total.
- [ ] **TC-PRICE-03** — Verify the price breakdown on the booking confirmation screen correctly separates **Delivery Fee** and **Platform Fee (₹20)**.

### 2.3 Traveler Capacity / Availability

- [ ] **TC-CAPACITY-01** — Verify that a traveler with **Small** trunk space is visually distinct from one with **Large** trunk space (different badge color per the `trunkColors` mapping).
- [ ] **TC-CAPACITY-02** — (When live Supabase data is connected) Attempt to book a traveler whose trip is already at maximum capacity. → A "Fully Booked" state is shown; the **Book Now** button is disabled or absent.

### 2.4 Checkout & Booking Confirmation

- [ ] **TC-CHECKOUT-01** — Click **Book Now** on any traveler card. → The checkout screen appears showing traveler summary, route, parcel details fields, and the escrow breakdown.
- [ ] **TC-CHECKOUT-02** — On the checkout screen, click **← Back to results**. → The traveler results list is restored; previously selected traveler is deselected.
- [ ] **TC-CHECKOUT-03** — Fill in parcel details (type, weight) and click **Confirm & Pay ₹<amount>**. → A loading state is shown; on success, the **Booking Confirmed** screen appears with a Tracking ID (`RD-2026-XXXX`) and the escrow amount.
- [ ] **TC-CHECKOUT-04** — On the confirmation screen, click **Track Delivery**. → Browser navigates to `/track`.
- [ ] **TC-CHECKOUT-05** — On the confirmation screen, click **New Search**. → Returns to the traveler results list with the same route; form is reset.

---

## 3. Escrow Payment Flow (Razorpay)

> Use Razorpay **test-mode** card: `4111 1111 1111 1111`, Expiry: any future date, CVV: any 3 digits.
> Use Razorpay **test-mode** UPI VPA: `success@razorpay`.

### 3.1 Successful Payment

- [ ] **TC-PAY-01** — Complete a booking checkout. When the Razorpay payment modal opens, enter valid test card details and click **Pay**. → Payment succeeds; the Razorpay modal closes; the booking confirmation screen is shown.
- [ ] **TC-PAY-02** — In the Supabase `deliveries` table, verify the row for this delivery has `razorpay_order_id` populated and `escrow_status = 'held'`.
- [ ] **TC-PAY-03** — In the Razorpay test dashboard, confirm the order shows **Paid** status and the correct amount (in paise).
- [ ] **TC-PAY-04** — Repeat TC-PAY-01 using a test UPI VPA (`success@razorpay`). → Same successful outcome.

### 3.2 Failed Payment

- [ ] **TC-PAY-05** — In the Razorpay modal, use the failure test card (`4000 0000 0000 0002`) or select **Simulate Failure** in test mode and attempt payment. → Payment fails; an error message is shown in the Razorpay modal; the user is returned to the checkout screen.
- [ ] **TC-PAY-06** — After a failed payment, verify in Supabase that the delivery row does **not** have `escrow_status = 'held'`; it should remain in its pre-payment state.
- [ ] **TC-PAY-07** — Close the Razorpay modal without paying. → The booking checkout screen is shown again; no orphan order is created in the database.

### 3.3 Order Cancellation & Refund

- [ ] **TC-CANCEL-01** — After a successful escrow payment (`escrow_status = 'held'`), cancel the booking before pickup. → The cancellation UI is triggered; a refund is initiated via Razorpay test-mode.
- [ ] **TC-CANCEL-02** — After cancellation, verify in Supabase that `status = 'cancelled'` and `escrow_status = 'refunded'` (or equivalent) is set on the delivery row.
- [ ] **TC-CANCEL-03** — In the Razorpay test dashboard, confirm a refund is issued for the full amount.

### 3.4 API Guard Tests (via curl / REST client)

- [ ] **TC-API-01** — Call `POST /api/payments/create-escrow` without a session cookie. → HTTP 401 "Unauthorized".
- [ ] **TC-API-02** — Call `POST /api/payments/create-escrow` with a valid session but a `deliveryId` that belongs to a **different** sender. → HTTP 403 "Forbidden".
- [ ] **TC-API-03** — Call `POST /api/payments/create-escrow` with a missing `deliveryId` or `amount`. → HTTP 400 with "deliveryId and amount are required".
- [ ] **TC-API-04** — Call `POST /api/payments/release-escrow` with `otp` that is not exactly 4 digits (e.g., `12345`). → HTTP 400 "OTP must be exactly 4 digits".
- [ ] **TC-API-05** — Call `POST /api/payments/release-escrow` on a delivery whose `escrow_status` is already `'released'`. → HTTP 409 "Payment has already been released for this delivery."

---

## 4. Traveler Flow & Active Delivery

### 4.1 Post a New Trip

- [ ] **TC-TRAV-01** — Navigate to `/travel`. Confirm the **Post a Trip** form is shown by default.
- [ ] **TC-TRAV-02** — Fill in all required fields (origin city, destination city, date, vehicle type) and click **Post My Trip**. → A success confirmation screen is shown with the trip summary (route, date, vehicle icon).
- [ ] **TC-TRAV-03** — Attempt to click **Post My Trip** with the **vehicle type** not selected. → The **Post My Trip** button remains disabled (since `canPost` requires all fields).
- [ ] **TC-TRAV-04** — Attempt to submit the form with the **date field** empty. → The button remains disabled or HTML5 validation prevents submission.
- [ ] **TC-TRAV-05** — After successfully posting a trip, click **View Delivery Requests**. → The requests list screen is shown, populated with mock package requests matching the posted route.
- [ ] **TC-TRAV-06** — (When live Supabase is connected) Confirm the new trip row appears in the Supabase `trips` table with `traveler_id = current_user.id` and correct route/date values.
- [ ] **TC-TRAV-07** — (Sender flow, separate session) Search for the same route the traveler just posted. → The newly posted trip appears in the sender's traveler results on `/send`.

### 4.2 Accepting a Delivery Request

- [ ] **TC-TRAV-08** — On the requests list, click **Accept** on a package request card. → The accepted delivery detail screen is shown with the sender's name, route, parcel details, and the earnings badge.
- [ ] **TC-TRAV-09** — On the accepted delivery screen, click **Start Delivery**. → Browser navigates to `/track` (the milestone tracker).
- [ ] **TC-TRAV-10** — (When live Supabase connected) After accepting, verify the `deliveries` table row has `status = 'accepted'` and the correct `trip_id` and `sender_id`.

### 4.3 Milestone Updates

- [ ] **TC-MILE-01** — On `/track`, confirm the four milestones are rendered: **Picked Up**, **In Transit**, **Reached Destination City**, **Delivered (Enter OTP)**.
- [ ] **TC-MILE-02** — Click **Confirm Pickup**. → Milestone 1 turns green with a checkmark; Milestone 2 becomes the active step and shows the **Mark In Transit** button.
- [ ] **TC-MILE-03** — Click **Mark In Transit**. → Milestone 2 completes; Milestone 3 becomes active with the **Mark Arrived** button.
- [ ] **TC-MILE-04** — Click **Mark Arrived**. → Milestone 3 completes; Milestone 4 becomes active and shows the **4-digit OTP input** field.
- [ ] **TC-MILE-05** — Confirm that milestones 1–3 cannot be re-clicked or undone once marked complete (buttons are absent or disabled for done steps).
- [ ] **TC-MILE-06** — Confirm that Milestone 4 (**Enter OTP & Complete**) is **not** actionable until Milestone 3 has been completed (the button is disabled and the OTP input is not visible).

### 4.4 The Critical OTP Handoff

- [ ] **TC-OTP-D-01** — At Milestone 4, enter a **correct 4-digit OTP** (matching `delivery_otp` in the database for this delivery) and click **Enter OTP & Complete**. → A loading spinner appears labelled "Verifying…"; on success, the **Delivery Complete!** screen is shown with earnings breakdown.
- [ ] **TC-OTP-D-02** — At Milestone 4, enter a **wrong 4-digit OTP** (e.g., `0000` when the correct OTP is different). → An error message is displayed (e.g., "Invalid OTP. Please ask the sender for the correct code."); the tracker stays on Milestone 4; the OTP field is cleared for re-entry.
- [ ] **TC-OTP-D-03** — Enter the wrong OTP **three consecutive times**. → An appropriate error is shown each time; the milestone tracker does **not** advance; the escrow is **not** released (verify in Supabase that `escrow_status` remains `'held'`).
- [ ] **TC-OTP-D-04** — Try to click **Enter OTP & Complete** with fewer than 4 digits in the OTP field (e.g., `123`). → The button remains disabled because `otpValue.length !== 4`; no API call is made.
- [ ] **TC-OTP-D-05** — Try to type **letters** in the OTP field. → Only digits are accepted; letters are stripped by the `replace(/\D/g, "")` filter.
- [ ] **TC-OTP-D-06** — After the correct OTP is accepted (demo mode), verify the **Delivery Complete!** screen shows the correct payout amount (80% of the total escrow amount).

---

## 5. Payouts & Database Sync

### 5.1 Escrow Release & Split Verification

- [ ] **TC-PAYOUT-01** — After entering the correct OTP, verify in Supabase `deliveries` table: `escrow_status = 'released'`, `status = 'delivered'`, and `otp_verified_at` is populated with the current timestamp.
- [ ] **TC-PAYOUT-02** — Check the API response JSON from `POST /api/payments/release-escrow` contains a `breakdown` object with: `total`, `travelerShare` (= 80% of total), and `platformShare` (= 20% of total). Example: for ₹250 total → `travelerShare: 200`, `platformShare: 50`.
- [ ] **TC-PAYOUT-03** — Verify the `transferIntent` object in the API response has two entries: one for `traveler_<traveler_id>` and one for the platform account, with amounts in paise matching the 80/20 split.
- [ ] **TC-PAYOUT-04** — (When Razorpay Route is activated) In the Razorpay dashboard, confirm two linked-account transfers appear: 80% to the traveler's linked account and 20% to the platform account.
- [ ] **TC-PAYOUT-05** — Attempt to call `POST /api/payments/release-escrow` a **second time** for the same already-released delivery. → HTTP 409 "Payment has already been released for this delivery." — no double-payout occurs.

### 5.2 Dashboard Data Integrity

- [ ] **TC-DASH-01** — After a completed delivery, navigate to `/dashboard`. → The completed booking appears in the **Booking History** section with status **Delivered**.
- [ ] **TC-DASH-02** — As the traveler, navigate to `/dashboard`. → The completed trip appears in the **Trip History** section with the correct earnings amount (80% share).
- [ ] **TC-DASH-03** — Verify that a booking in `escrow_status = 'held'` (payment made, not yet delivered) appears as **In Progress** and not **Delivered** in the dashboard.

---

## 6. Edge Cases & UI Stress Tests

### 6.1 Mobile Responsiveness

- [ ] **TC-MOB-01** — Open `/` on a viewport of 375 × 812 px (iPhone SE / 13 size). → Hero section, tabs, CTA buttons, and navigation are all readable and tappable without horizontal scroll.
- [ ] **TC-MOB-02** — Open `/send` on a 375 px wide viewport. → Traveler cards stack vertically; all text, icons, and buttons are visible without overflow.
- [ ] **TC-MOB-03** — Open `/track` on a 375 px wide viewport. → The milestone tracker vertical layout is preserved; the OTP input and action buttons are fully usable.
- [ ] **TC-MOB-04** — Open `/travel` on a 375 px wide viewport. → The "Post a Trip" form fields and dropdowns are accessible and the **Post My Trip** button is within the viewport.
- [ ] **TC-MOB-05** — Test dark mode on all pages (toggle the theme if a theme switcher is available). → All text remains legible; no white-on-white or black-on-black contrast issues.

### 6.2 Network Drop Scenarios

- [ ] **TC-NET-01** — While on Milestone 1 of `/track`, simulate a network drop (disable WiFi / throttle to Offline in DevTools), then click **Confirm Pickup**. → The UI shows a loading spinner; the fetch fails gracefully (the code catches network errors); no unhandled exception is thrown; the milestone does **not** advance to a false "completed" state.
- [ ] **TC-NET-02** — On the Milestone 4 OTP screen, enter the correct OTP and click **Enter OTP & Complete** while offline. → The API call fails; the local demo fallback still advances the UI (per current demo-mode logic), **or** an inline error is shown — document the actual behavior and verify it is intentional.
- [ ] **TC-NET-03** — During the Razorpay payment modal, drop the network connection after the modal opens but before confirming payment. → Razorpay modal shows a timeout / error; the delivery `escrow_status` in Supabase remains `null` / pre-payment.
- [ ] **TC-NET-04** — Restore the connection and retry payment after a network drop. → The payment can be re-initiated without creating a duplicate order.

### 6.3 Concurrent / Race Conditions

- [ ] **TC-RACE-01** — Open the same delivery in two browser tabs as the traveler. Click **Confirm Pickup** in both simultaneously. → Only one milestone advancement is persisted; the second click either shows "already completed" or is a no-op.
- [ ] **TC-RACE-02** — Open the same trip in two separate sender sessions and attempt to book the same traveler simultaneously. → Only one booking is confirmed; the second receives an appropriate error or is placed in a queue.

### 6.4 Form & Input Validation Edge Cases

- [ ] **TC-EDGE-01** — On the `/send` search form, select the same city for **From** and **To** (e.g., Mumbai → Mumbai). → An inline validation message such as "Origin and destination cannot be the same" is shown and the form does not submit.
- [ ] **TC-EDGE-02** — On the `/send` search form, select a date in the **past**. → An error or warning is shown; the form does not navigate to stale results.
- [ ] **TC-EDGE-03** — On the Aadhaar KYC form, enter an all-zero Aadhaar number (`000000000000`, 12 digits). → In the current mock implementation, this succeeds (passes the `/^\d{12}$/` regex). Document this as a known limitation to address before production by adding a real Setu/DigiLocker API call.
- [ ] **TC-EDGE-04** — Navigate directly to `/dashboard` without being logged in. → User is redirected to `/login` (auth guard) instead of seeing a blank or broken dashboard.
- [ ] **TC-EDGE-05** — Call `POST /api/kyc/verify` with an Aadhaar number containing spaces (e.g., `1234 5678 9012`). → The API strips whitespace (`replace(/\s/g, "")`) and processes the 12-digit number correctly.

### 6.5 Security Checks

- [ ] **TC-SEC-01** — Attempt to call `POST /api/payments/release-escrow` as the **sender** (not the traveler assigned to the delivery). → HTTP 403 "Forbidden" — only the assigned traveler can trigger release.
- [ ] **TC-SEC-02** — Confirm that `RAZORPAY_KEY_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are **never** returned in any API response or exposed in the browser's Network tab.
- [ ] **TC-SEC-03** — Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL` (safe to expose) appear in client-side code, but `SUPABASE_SERVICE_ROLE_KEY` does not.

---

## 7. Pre-Launch Sign-Off

Complete all sections above before proceeding to production. This final checklist confirms overall readiness.

- [ ] All **TC-AUTH-\*** tests passed
- [ ] All **TC-LOGIN-\*** and **TC-OTP-\*** tests passed
- [ ] All **TC-KYC-\*** tests passed
- [ ] All **TC-SEND-\*** and **TC-PRICE-\*** tests passed
- [ ] All **TC-PAY-\*** and **TC-API-\*** tests passed
- [ ] All **TC-TRAV-\*** and **TC-MILE-\*** tests passed
- [ ] All **TC-OTP-D-\*** (delivery OTP) tests passed
- [ ] All **TC-PAYOUT-\*** and **TC-DASH-\*** tests passed
- [ ] All **TC-MOB-\***, **TC-NET-\***, **TC-RACE-\***, **TC-EDGE-\***, and **TC-SEC-\*** tests passed
- [ ] No P0 or P1 bugs remain open
- [ ] Razorpay live-mode keys swapped in (remove `rzp_test_…` prefix)
- [ ] Real Setu/DigiLocker KYC API integrated (replacing the mock in `/api/kyc/verify/route.ts`)
- [ ] Razorpay Route transfers uncommented and tested in `/api/payments/release-escrow/route.ts`
- [ ] `.env.local` confirmed absent from the deployed build (checked in `.gitignore`)

---

*Generated for RouteDrop v1.0 · Last updated: 2026-02-23*
