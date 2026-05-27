# 💎 Premium Subscription System - Complete Implementation Guide

## ✅ FEATURES IMPLEMENTED

### 1. **Database Schema** ✓
- Added `is_premium` column to `jobs` table for premium job flagging
- Created `applications` table for premium application tracking
  - Tracks status, notes, follow-up dates
  - Links to users and jobs
- Added indexes for optimal query performance

### 2. **Backend APIs** ✓

#### Stripe Integration (`/apps/web/src/app/api/stripe/`)
- **Checkout** (`/checkout/route.js`): Creates Stripe checkout sessions with trial support
- **Webhook** (`/webhook/route.js`): Handles subscription lifecycle events
  - Subscription created/updated
  - Subscription canceled
  - Payment succeeded/failed

#### Application Tracker (`/apps/web/src/app/api/applications/`)
- **GET `/api/applications`**: Fetch user's tracked applications (Premium only)
- **POST `/api/applications`**: Add new application to tracker (Premium only)
- **PATCH `/api/applications/[id]`**: Update application status/notes
- **DELETE `/api/applications/[id]`**: Remove application from tracker

#### Existing Premium Logic
- `/api/premium/status`: Check if user has active premium
- `/api/saved-jobs`: Enforces 5-job limit for free users
- `/api/saved-searches`: Enforces 3-alert limit for free users

### 3. **Paywall Components** ✓

#### Web Paywall (`/apps/web/src/components/Paywall.jsx`)
**Features:**
- Dynamic content based on trigger (`premium_job`, `saved_jobs_limit`, `alerts_limit`, `application_tracker`)
- Lists all premium benefits with icons
- $9.99/month pricing display
- "Start Free Trial" and "Upgrade Now" buttons
- Urgency messaging ("Join 1,000+ premium members")
- Connects to `/api/stripe/checkout`

#### Mobile Paywall (`/apps/mobile/src/components/PaywallModal.jsx`)
**Features:**
- Bottom sheet modal design
- Context-aware messaging based on trigger
- **Mobile compliance**: Shows "Premium Available on Web" notice
- Opens web browser to complete upgrade (due to app store policies)
- Same premium benefits list as web

### 4. **Premium Pages** ✓

#### Application Tracker (`/apps/web/src/app/tracker/page.jsx`)
**Features:**
- Premium-only access (shows paywall for free users)
- View all tracked applications
- Update status (Applied → Interviewing → Offer → Rejected → Accepted → Withdrawn)
- Add/edit notes for each application
- Track follow-up dates
- Delete applications
- Empty state with CTA to browse jobs

#### Resume Tools (`/apps/web/src/app/resume-tools/page.jsx`)
**Features:**
- Expert tips for remote job applications (free)
  - Optimize for Remote Work
  - Tailor for Remote Roles
  - Stand Out Remotely
- Resume templates (1 free, 2 premium)
  - Modern Remote Professional (free)
  - Executive Remote Leader (premium)
  - Minimalist Remote (premium)
- Premium upsell CTA at bottom

## 🎯 PREMIUM FEATURES BREAKDOWN

### For FREE Users:
- Browse all jobs (premium jobs blurred/locked)
- Save up to 5 jobs
- Create up to 3 job alerts
- Access basic resume tips
- 1 free resume template

### For PREMIUM Users ($9.99/month):
1. **Exclusive Premium Jobs** 👑
   - Early access to high-paying positions
   - Jobs tagged with premium badge
   - Full details visible (not blurred)

2. **Unlimited Saves & Alerts** 📌
   - Save unlimited jobs
   - Create unlimited custom job alerts
   - Instant notifications (vs delayed for free)

3. **Application Tracker** 📊
   - Track all applications in one place
   - Update status through hiring pipeline
   - Add notes and follow-up reminders
   - Never miss a follow-up

4. **Resume Tools** 📝
   - Premium resume templates
   - Expert tips and guidance
   - (Future: AI-powered resume reviews)
   - (Future: 1-on-1 career coaching)

## 🔧 HOW TO USE THE SYSTEM

### For Admins: Mark Jobs as Premium
```javascript
// In the admin panel or via API:
UPDATE jobs
SET is_premium = true
WHERE id = 'job-uuid-here';
```

### For Developers: Add Premium Checks
```javascript
// Check if user is premium (client-side)
import useUser from "@/utils/useUser";

const { data: user } = useUser();
const isPremium = user?.is_premium;

// Check if user is premium (server-side)
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const session = await auth();
const [user] = await sql`
  SELECT is_premium, premium_expires_at 
  FROM auth_users 
  WHERE id = ${session.user.id}
`;

const isPremiumActive = user.is_premium && 
  (!user.premium_expires_at || new Date(user.premium_expires_at) > new Date());
```

### For Users: Upgrade Flow
1. User hits a premium limit or clicks a premium job
2. Paywall modal appears with benefits and pricing
3. User clicks "Start Free Trial" or "Upgrade Now"
4. Redirected to Stripe Checkout
5. After payment, webhook updates user's `is_premium` status
6. User gets instant access to all premium features

## 📱 MOBILE COMPLIANCE

### Why No In-App Payments?
Due to Apple App Store and Google Play Store policies:
- Apps must use their in-app purchase systems (30% commission)
- Alternative: Web-based subscriptions (what we implemented)

### Mobile User Experience:
1. User taps premium feature in mobile app
2. PaywallModal shows: "Premium Available on Web"
3. "Upgrade on Web" button opens device browser
4. User completes payment on web
5. Returns to app with premium access

This approach is used by major apps like Netflix, Spotify, etc.

## 🚀 TO-DO FOR FULL STRIPE INTEGRATION

### Current Status: **Demo Mode**
The checkout endpoint returns a mock URL. To go live with Stripe:

### 1. Install Stripe SDK
```bash
npm install stripe
```

### 2. Add Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...  # Your recurring price ID from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...  # For webhook signature verification
```

### 3. Update Checkout Route (`/apps/web/src/app/api/stripe/checkout/route.js`)
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  // ... existing code ...
  
  // Replace mock with real Stripe session:
  const stripeSession = await stripe.checkout.sessions.create(checkoutSession);
  return Response.json({ url: stripeSession.url });
}
```

### 4. Update Webhook Route (`/apps/web/src/app/api/stripe/webhook/route.js`)
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // ... rest of webhook logic ...
}
```

### 5. Configure Stripe Webhook
In Stripe Dashboard → Developers → Webhooks:
- Add endpoint: `https://your-domain.com/api/stripe/webhook`
- Select events:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## 🎨 UI/UX OPTIMIZATIONS IMPLEMENTED

### Conversion Tactics:
✅ Urgency messaging ("Join 1,000+ premium members")
✅ Clear benefit highlights with icons
✅ Social proof in paywall
✅ 7-day free trial option
✅ Two-step CTA (Try Free vs Buy Now)
✅ "Maybe Later" option (reduces friction)
✅ Context-aware messaging based on trigger

### Premium Job Display:
✅ Crown badge on premium jobs
✅ Gradient premium pill
✅ Blurred content for non-premium users
✅ Lock overlay with unlock button
✅ Prevents accidental clicks on blurred content

### Natural Upgrade Prompts:
✅ When saving 6th job (free limit)
✅ When creating 4th alert (free limit)
✅ When clicking premium job
✅ When accessing application tracker
✅ Resume tools page CTA

## 📊 CONVERSION METRICS TO TRACK

Recommended analytics to add:
1. **Paywall Views** by trigger type
2. **Trial Start Rate**
3. **Purchase Rate** (without trial)
4. **Trial to Paid Conversion Rate**
5. **Churn Rate** (cancellations)
6. **Premium Job Click Rate**
7. **Feature Usage** (which premium features are most used)

## 🔗 INTEGRATION CHECKLIST

- [x] Database schema updated
- [x] Stripe checkout endpoints created
- [x] Stripe webhook handler implemented
- [x] Paywall components built (web + mobile)
- [x] Application tracker page created
- [x] Resume tools page created
- [x] Premium job badge UI added
- [x] Saved jobs limit enforcement
- [x] Alerts limit enforcement
- [ ] Install Stripe SDK
- [ ] Add Stripe keys to environment
- [ ] Configure Stripe webhook in dashboard
- [ ] Test full payment flow
- [ ] Set up subscription management portal

## 💡 TIPS FOR MAXIMIZING CONVERSIONS

1. **Test Different Trial Lengths**: 7-day vs 14-day vs 30-day
2. **A/B Test Pricing**: $9.99 vs $12.99 vs $7.99
3. **Add Testimonials**: Real user success stories in paywall
4. **Highlight Savings**: "Save 20% with annual plan"
5. **Time-Limited Offers**: "50% off your first month"
6. **Personalization**: Show user how many premium jobs match their profile
7. **Exit Intent**: Show paywall when user tries to leave site

---

**System Status**: ✅ **READY FOR TESTING**
**Next Step**: Add Stripe credentials and test checkout flow
