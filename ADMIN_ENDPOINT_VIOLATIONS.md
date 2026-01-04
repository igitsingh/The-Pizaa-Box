# ADMIN APP ENDPOINT AUDIT - CRITICAL FINDINGS

## **ENDPOINT VIOLATIONS FOUND**

| Page | Line | Current Endpoint | Correct Endpoint | Status |
|------|------|------------------|------------------|--------|
| **categories/page.tsx** | 83 | `/categories` | `/admin/categories` | 🔴 WRONG |
| **categories/page.tsx** | 95 | `/categories/:id` | `/admin/categories/:id` | 🔴 WRONG |
| **categories/page.tsx** | 98 | `/categories` | `/admin/categories` | 🔴 WRONG |
| **categories/page.tsx** | 112 | `/categories/:id` | `/admin/categories/:id` | 🔴 WRONG |
| **kitchen/page.tsx** | 94 | `/orders?active=true` | `/admin/kitchen/board` | 🔴 WRONG |
| **kitchen/page.tsx** | 117 | `/orders/:id/status` | `/admin/orders/:id/status` | 🔴 WRONG |
| **stock/page.tsx** | 43 | `/menu` | `/admin/menu` | 🔴 WRONG |
| **stock/page.tsx** | 57 | `/stock/items/:id` | `/admin/stock/items/:id` | 🔴 WRONG |
| **delivery-partners/page.tsx** | 54 | `/delivery-partners` | `/admin/delivery-partners` | 🔴 WRONG |
| **delivery-partners/page.tsx** | 70 | `/delivery-partners` | `/admin/delivery-partners` | 🔴 WRONG |
| **feedbacks/page.tsx** | 64 | `/feedbacks` | `/admin/feedbacks` | 🔴 WRONG |
| **feedbacks/page.tsx** | 106 | `/feedbacks/:id` | `/admin/feedbacks/:id` | 🔴 WRONG |
| **memberships/page.tsx** | 35 | `/memberships/overview` | `/admin/memberships/overview` | 🔴 WRONG |
| **memberships/page.tsx** | 36 | `/memberships/members` | `/admin/memberships/members` | 🔴 WRONG |
| **orders/page.tsx** | 193 | `/orders/:id/notifications` | `/admin/orders/:id/notifications` | 🔴 WRONG |
| **orders/page.tsx** | 209 | `/orders/:id/status` | `/admin/orders/:id/status` | 🔴 WRONG |
| **orders/page.tsx** | 223 | `/orders/:id/assign-partner` | `/admin/orders/:id/assign-partner` | 🔴 WRONG |
| **orders/page.tsx** | 268 | `/orders/:id/invoice` | `/admin/orders/:id/invoice` | 🔴 WRONG |
| **coupons/page.tsx** | 115 | `/coupons` | `/admin/coupons` | 🔴 WRONG |
| **coupons/page.tsx** | 127 | `/coupons/:id` | `/admin/coupons/:id` | 🔴 WRONG |
| **coupons/page.tsx** | 130 | `/coupons` | `/admin/coupons` | 🔴 WRONG |
| **coupons/page.tsx** | 148 | `/coupons/:id` | `/admin/coupons/:id` | 🔴 WRONG |
| **orders/[id]/page.tsx** | 115 | `/orders/:id` | `/admin/orders/:id` | 🔴 WRONG |
| **orders/[id]/page.tsx** | 116 | `/orders/:id/notifications` | `/admin/orders/:id/notifications` | 🔴 WRONG |
| **orders/[id]/page.tsx** | 134 | `/orders/:id/status` | `/admin/orders/:id/status` | 🔴 WRONG |
| **orders/[id]/page.tsx** | 144 | `/orders/:id/invoice` | `/admin/orders/:id/invoice` | 🔴 WRONG |
| **referrals/page.tsx** | 36 | `/referrals/overview` | `/admin/referrals/overview` | 🔴 WRONG |
| **referrals/page.tsx** | 37 | `/referrals/transactions` | `/admin/referrals/transactions` | 🔴 WRONG |
| **payments/page.tsx** | 37 | `/payments` | `/admin/payments` | 🔴 WRONG |
| **payments/page.tsx** | 53 | `/payments/export` | `/admin/payments/export` | 🔴 WRONG |
| **complaints/page.tsx** | 45 | `/complaints` | `/admin/complaints` | 🔴 WRONG |
| **complaints/page.tsx** | 61 | `/complaints/:id/status` | `/admin/complaints/:id/status` | 🔴 WRONG |
| **enquiries/page.tsx** | 98 | `/enquiries?...` | `/admin/enquiries?...` | 🔴 WRONG |
| **enquiries/page.tsx** | 109 | `/enquiries/stats` | `/admin/enquiries/stats` | 🔴 WRONG |
| **enquiries/page.tsx** | 118 | `/users/staff` | `/admin/users/staff` | 🔴 WRONG |
| **enquiries/page.tsx** | 172 | `/enquiries/:id` | `/admin/enquiries/:id` | 🔴 WRONG |
| **analytics/page.tsx** | 37-40 | `/metrics/*` | `/admin/metrics/*` | 🔴 WRONG |
| **page.tsx** (dashboard) | 37-39 | `/metrics/*` | `/admin/metrics/*` | 🔴 WRONG |
| **reports/page.tsx** | 52-56 | `/admin/reports/*` | ✅ CORRECT | 🟢 OK |
| **orders/page.tsx** | 149 | `/admin/orders` | ✅ CORRECT | 🟢 FIXED |
| **orders/page.tsx** | 175 | `/admin/delivery-partners` | ✅ CORRECT | 🟢 FIXED |

## **SUMMARY**

**Total Violations:** 38  
**Already Fixed:** 2  
**Remaining:** 36  

**CRITICAL:** Every admin page except reports is calling wrong endpoints!
