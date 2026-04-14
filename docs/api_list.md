# BloodLink API Documentation

This document provides a comprehensive list of all API endpoints available in the BloodLink backend. Use the `{{baseUrl}}` as the standard prefix (e.g., `http://localhost:5000/api/v1`).

---

## 1. Authentication Module (`/auth`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/auth/register` | Register a new user (USER, HOSPITAL, ORGANISATION) | No | All |
| POST | `/auth/login` | Login and receive access/refresh tokens | No | All |
| POST | `/auth/logout` | Invalidate current session | Yes | All |
| POST | `/auth/refresh-token` | Renew access token using refresh token | No | All |
| POST | `/auth/change-password` | Update account password | Yes | All |
| POST | `/auth/forgot-password` | Request password reset OTP | No | All |
| POST | `/auth/reset-password` | Reset password using OTP | No | All |

---

## 2. User & Donor Module (`/users`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/users/me` | Fetch current user's profile | Yes | All |
| PUT | `/users/me` | Update current user's profile | Yes | All |
| GET | `/users/donation-history` | View personal donation history | Yes | USER |
| GET | `/users/donors` | Search available blood donors (filtering by location/group) | Yes | All |

---

## 3. Post Module (`/posts`)

Any role can create posts. `BLOOD_DONATION` posts track donor history.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/posts` | Create a new post (BLOOD_FINDING, BLOOD_DONATION, HELPING) | Yes | USER, HOSPITAL, ORG |
| GET | `/posts` | Get all posts (includes filters) | No | Public |
| GET | `/posts/:id` | Get details of a single post | No | Public |
| GET | `/posts/user/:userId` | Get all posts of a single user | Yes | All |
| PATCH | `/posts/:id` | Update post details | Yes | Author/Admin |
| DELETE | `/posts/:id` | Soft delete a post | Yes | Author/Admin |
| PATCH | `/posts/:id/resolve` | Mark a blood finding post as resolved | Yes | Author |
| PATCH | `/posts/:id/approve` | Approve a post for visibility | Yes | ADMIN |
| PATCH | `/posts/:id/verify` | Verify the authenticity of a post | Yes | ADMIN |

---

## 4. Hospital Module (`/hospitals`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/hospitals/record-donation` | Record a donor's blood donation | Yes | HOSPITAL |
| GET | `/hospitals/donation-records` | View donation records managed by the hospital | Yes | HOSPITAL |
| PATCH | `/hospitals/requests/:requestId` | Update blood request status | Yes | USER |

---

## 5. Organisation Module (`/organisations`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/organisations/volunteers` | Add a donor to organisation's volunteer list | Yes | ORG |
| GET | `/organisations/volunteers` | List organisation volunteers | Yes | ORG |
| PATCH | `/organisations/volunteers/:bloodDonorId/donation-date` | Update legacy/unregistered volunteer donation date | Yes | ORG |
| GET | `/organisations/volunteers/history` | View donation history of volunteers | Yes | ORG |

---

## 6. Admin Module (`/admin`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/admin/analytics` | Fetch system-wide activity dashboard statistics | Yes | ADMIN |
| GET | `/admin/users` | List all users in the system | Yes | ADMIN |
| PATCH | `/admin/users/:id/status` | Update account status (Approve/Reject/Block) | Yes | ADMIN |
| GET | `/admin/hospitals` | List all registered hospitals | Yes | ADMIN |
| PATCH | `/admin/hospitals/:id/status` | Update hospital registration status | Yes | ADMIN |
| GET | `/admin/organisations` | List all registered organisations | Yes | ADMIN |
| PATCH | `/admin/organisations/:id/status` | Update organisation registration status | Yes | ADMIN |

---

## 7. Payments Module (`/payments`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/payments/initiate` | Initiate an SSLCommerz payment for help posts | Yes | USER |
| POST | `/payments/success` | Payment successful callback (IPN) | No | Gateway |
| POST | `/payments/fail` | Payment failed callback | No | Gateway |
| POST | `/payments/cancel` | Payment cancelled callback | No | Gateway |
| POST | `/payments/ipn` | Instant Payment Notification handler | No | Gateway |

---

## 8. Management Module (`/manage-admins`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/manage-admins` | Create a new Admin account | Yes | SUPER_ADMIN |
| GET | `/manage-admins` | List all Admin accounts | Yes | SUPER_ADMIN |
| GET | `/manage-admins/:id` | Fetch specific Admin details | Yes | SUPER_ADMIN |
| PATCH | `/manage-admins/:id` | Update Admin profile details | Yes | SUPER_ADMIN |
| PATCH | `/manage-admins/:id/access` | Toggle Admin access rights | Yes | SUPER_ADMIN |
| DELETE | `/manage-admins/:id` | Delete an Admin account | Yes | SUPER_ADMIN |

---

## 9. Engagement Module (`/posts/engagement`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/posts/engagement/like` | Toggle like on a post | Yes | All |
| POST | `/posts/engagement/comment` | Add a comment to a post | Yes | All |
| GET | `/posts/engagement/:postId/comments` | Fetch all comments for a post | No | Public |

---

> [!IMPORTANT]
> **Authorization Header**: All "Auth Required" endpoints require a valid JWT Bearer Token: `Authorization: Bearer <token>`.
>
> **Cookie Support**: Logout and token refresh operations utilize the `refreshToken` stored in cookies for enhanced security.

> [!TIP]
> **Post Categorization**:
> - `BLOOD_FINDING`: For receivers looking for blood.
> - `BLOOD_DONATION`: For donors or hospitals organizing camps.
> - `HELPING`: For crowdfunding or medical assistance requests.


# BloodLink API List

Base URL: `http://localhost:5000/api/v1`
🔐 = Auth required (Bearer Token)

---

## 1. Auth Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/auth/register` | নতুন User / Hospital / Organisation রেজিস্ট্রেশন |
| POST | `/auth/login` | লগইন, accessToken রিটার্ন করে |
| POST | `/auth/refresh-token` | Refresh token দিয়ে নতুন accessToken নেওয়া |
| POST | `/auth/change-password` 🔐 | পুরনো পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট |
| POST | `/auth/forgot-password` | OTP পাঠানোর জন্য ইমেইল সাবমিট |
| POST | `/auth/reset-password` | OTP ও নতুন পাসওয়ার্ড দিয়ে রিসেট |

---

## 2. User & Donor Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| GET | `/users/me` 🔐 | নিজের প্রোফাইল দেখা |
| PUT | `/users/me` 🔐 | নিজের প্রোফাইল আপডেট |
| GET | `/users/donors` | রক্তের গ্রুপ ও এলাকা দিয়ে ডোনার খোঁজা |
| GET | `/users/donation-history` 🔐 | নিজের ডোনেশন ইতিহাস দেখা |

---

## 3. Post Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| GET | `/posts` | সব পোস্ট দেখা (filter: type, bloodGroup) |
| GET | `/posts/:id` | নির্দিষ্ট একটি পোস্টের বিস্তারিত |
| POST | `/posts` 🔐 | নতুন পোস্ট তৈরি (BLOOD_FINDING / BLOOD_DONATION / HELPING) |
| PATCH | `/posts/:id` 🔐 | পোস্ট এডিট করা |
| DELETE | `/posts/:id` 🔐 | পোস্ট ডিলিট করা |
| PATCH | `/posts/:id/resolve` 🔐 | পোস্ট resolved হিসেবে মার্ক করা (Author) |
| PATCH | `/posts/:id/approve` 🔐 | Helping পোস্ট অ্যাপ্রুভ করা (Admin) |
| PATCH | `/posts/:id/verify` 🔐 | পোস্ট verified/highlighted করা (Admin) |

---

## 4. Post Engagement Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/posts/engagement/like` 🔐 | পোস্টে লাইক টগল (like/unlike) |
| POST | `/posts/engagement/comment` 🔐 | পোস্টে কমেন্ট করা (reply সাপোর্ট: parentId) |
| GET | `/posts/engagement/:postId/comments` | পোস্টের সব কমেন্ট দেখা |

---

## 5. Hospital Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/hospitals/record-donation` 🔐 | হাসপাতালে ডোনেশন রেকর্ড করা |
| PATCH | `/hospitals/requests/:requestId` 🔐 | ডোনার রিকোয়েস্টের স্ট্যাটাস আপডেট (ACCEPTED/REJECTED) |
| GET | `/hospitals/donation-records` 🔐 | হাসপাতালের সব ডোনেশন রেকর্ড দেখা |

---

## 6. Organisation Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/organisations/volunteers` 🔐 | নতুন ভলান্টিয়ার যোগ করা |
| GET | `/organisations/volunteers` 🔐 | সংস্থার সব ভলান্টিয়ার দেখা |
| GET | `/organisations/volunteers/history` 🔐 | ভলান্টিয়ারদের ডোনেশন ইতিহাস |
| PATCH | `/organisations/volunteers/:bloodDonorId/donation-date` 🔐 | ভলান্টিয়ারের ডোনেশন তারিখ ম্যানুয়ালি আপডেট |

---

## 7. Admin Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| GET | `/admin/users` 🔐 | সব ইউজার দেখা (filter: role, accountStatus) |
| PATCH | `/admin/users/:id/status` 🔐 | ইউজারের অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন |
| GET | `/admin/analytics` 🔐 | সিস্টেমের সামগ্রিক পরিসংখ্যান দেখা |
| GET | `/admin/hospitals` 🔐 | সব হাসপাতাল দেখা (filter: accountStatus) |
| PATCH | `/admin/hospitals/:id/status` 🔐 | হাসপাতালের স্ট্যাটাস আপডেট |
| GET | `/admin/organisations` 🔐 | সব সংস্থা দেখা (filter: accountStatus) |
| PATCH | `/admin/organisations/:id/status` 🔐 | সংস্থার স্ট্যাটাস আপডেট |

---

## 8. Manage Admins Module (Super Admin Only)

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/manage-admins` 🔐 | নতুন Admin তৈরি করা |
| GET | `/manage-admins` 🔐 | সব Admin-এর তালিকা |
| GET | `/manage-admins/:id` 🔐 | একজন Admin-এর বিস্তারিত |
| PATCH | `/manage-admins/:id` 🔐 | Admin তথ্য আপডেট |
| PATCH | `/manage-admins/:id/access` 🔐 | Admin-এর অ্যাক্সেস স্ট্যাটাস পরিবর্তন |

---

## 9. Notification Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| GET | `/notifications` 🔐 | নিজের সব নোটিফিকেশন দেখা |
| PATCH | `/notifications/mark-all-read` 🔐 | সব নোটিফিকেশন পঠিত হিসেবে মার্ক |
| PATCH | `/notifications/:id` 🔐 | একটি নির্দিষ্ট নোটিফিকেশন পঠিত মার্ক |

---

## 10. Payment Module

| Method | Endpoint | বিবরণ |
|--------|----------|-------|
| POST | `/payments/initiate` 🔐 | পেমেন্ট শুরু করা (amount, reason) |
| POST | `/payments/success` | পেমেন্ট সফল callback (transactionId query param) |
| POST | `/payments/ipn` | Payment IPN (Instant Payment Notification) হ্যান্ডেল |

---

**মোট API:** 43টি &nbsp;|&nbsp; **Module:** 10টি