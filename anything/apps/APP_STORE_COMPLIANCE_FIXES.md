# App Store Compliance Fixes — Capri Remote

## ✅ Privacy & Data Collection Compliance (Guideline 5.1.1, 5.1.2)

### Changes Made

#### 1. **Explicit Data Collection Disclosure** (`/apps/mobile/src/app/onboarding.jsx`)
- ✅ Added dedicated privacy slide (#2) that explicitly lists ALL data collected:
  - Country and job preferences
  - App usage analytics
  - Purchase transaction data via RevenueCat
  - Support ticket information
- ✅ Added **mandatory consent checkbox** — users cannot proceed without checking "I agree to the data collection and use described above"
- ✅ Continue button is disabled until consent is given
- ✅ Clear language about data encryption, no selling, and deletion rights

#### 2. **Notification Consent Prompts** (`/apps/mobile/src/app/(tabs)/settings.jsx`)
- ✅ Added explicit consent alerts when users first enable push notifications
- ✅ Added explicit consent alerts when users first enable email notifications
- ✅ Each alert clearly explains:
  - What notifications they will receive
  - That promotional/marketing notifications require separate explicit consent
  - Users can unsubscribe anytime
- ✅ Toggles now default to `false` (opt-in, not opt-out)

### What You Still Need to Do

#### **Update Your Privacy Policy** (CRITICAL)
Your Privacy Policy (at `https://capriremote.com/privacy`) MUST explicitly include:

1. **Data Collection Section** — List exactly:
   - User country and job preferences (stored in database)
   - App usage analytics (via your analytics service)
   - Purchase transaction data (via RevenueCat)
   - Support ticket information (when users contact support)
   - User IDs and email addresses (for authentication)

2. **Third-Party Data Sharing** — Explicitly name:
   - **RevenueCat** — "We share your Apple ID and purchase transaction data with RevenueCat for in-app purchase management and receipt validation"
   - **Your Analytics Provider** — "We use [service name] to collect anonymous usage data to improve the app"

3. **Data Retention & Deletion** — Add:
   - How long you keep data
   - How users can request data deletion (email support@capriremote.com)
   - That deleted data is permanently removed within 30 days

4. **User Rights** — Add:
   - Right to access their data
   - Right to revoke consent
   - Right to request data deletion
   - How to exercise these rights

#### **App Store Connect Privacy Policy URL**
- ⚠️ Set the Privacy Policy URL in App Store Connect (currently missing for en-US)
- Go to: App Store Connect → Your App → App Information → Privacy Policy URL
- Enter: `https://capriremote.com/privacy`

---

## ✅ Push Notification Compliance (Guideline 4.5.4)

### Changes Made
- ✅ Push notifications now default to **disabled** (opt-in)
- ✅ Explicit consent alert shown when user first enables push notifications
- ✅ Alert clearly states notifications are for job alerts, not promotions
- ✅ Separate consent required for any promotional notifications

### Best Practice
If you ever want to send promotional push notifications in the future:
1. Add a separate toggle in settings: "Promotional Notifications"
2. Show another explicit consent alert explaining promotional content
3. Never send promotional content to users who haven't opted in

---

## 📋 App Store Connect Submission Checklist

### ❌ Must Fix Before Submission

1. **Upload a Build**
   - Build your app in Xcode
   - Archive and upload to App Store Connect via Xcode or Transporter
   - Wait for processing (can take 10-30 minutes)

2. **Select Primary Category**
   - Go to: App Store Connect → Your App → App Information
   - Set Primary Category: **Business** or **Productivity**
   - Set Secondary Category (optional): **Utilities**

3. **Attach Build to Version 1.0**
   - Go to: App Store Connect → Your App → Version 1.0
   - Under "Build" section, click "Select a build before you submit your app"
   - Choose your uploaded build

4. **Fix In-App Purchase Metadata**
   All 4 in-app purchases are missing metadata. For each one:
   - Go to: App Store Connect → Your App → In-App Purchases
   - Click each product ID:
     - `resume_starter_pack`
     - `resume_bundle`
     - `resume_review`
     - `resume_rewrite`
   - Add **Display Name** (what users see in the app)
   - Add **Description** (what the service includes)
   - Add **Review Screenshot** (screenshot showing the purchase in your app)

   Example for `resume_review`:
   - Display Name: "AI Resume Review"
   - Description: "Get instant AI-powered feedback on your resume with actionable suggestions to improve your chances of landing interviews."

5. **Set Privacy Policy URL**
   - Go to: App Store Connect → Your App → App Information
   - Under "Privacy Policy URL (en-US)", enter: `https://capriremote.com/privacy`

### ⚠️ Recommended (Not Blocking)

- Review contact info is set ✅
- Screenshots uploaded ✅
- App description is set ✅
- Keywords are set ✅

---

## 🎯 Summary

### What Was Fixed in Code
1. ✅ Explicit data collection consent in onboarding
2. ✅ Mandatory consent checkbox before proceeding
3. ✅ Explicit notification consent alerts in settings
4. ✅ Opt-in (not opt-out) for all notifications
5. ✅ Clear language about promotional vs. functional notifications

### What You Need to Do
1. ❌ Update Privacy Policy at `https://capriremote.com/privacy` (see details above)
2. ❌ Upload a build to App Store Connect
3. ❌ Set primary category
4. ❌ Attach build to version 1.0
5. ❌ Add metadata to all 4 in-app purchases
6. ❌ Set Privacy Policy URL in App Store Connect

### Timeline
- Code changes: ✅ Complete
- Privacy Policy update: ~30 minutes
- App Store Connect setup: ~1 hour
- Build upload + processing: ~30-60 minutes
- **Total estimated time to submission-ready: 2-3 hours**

---

## 📞 Support

If you have questions about:
- **Privacy compliance**: Review Apple's [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- **In-app purchases**: Review [In-App Purchase Guidelines](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase)
- **App Store Connect**: Check [App Store Connect Help](https://help.apple.com/app-store-connect/)

Good luck with your submission! 🚀
