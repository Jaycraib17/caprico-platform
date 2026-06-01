# App Store Submission Checklist — Capri Remote

## ✅ Code Compliance (COMPLETE)

- [x] **Explicit data collection consent** in onboarding
- [x] **Mandatory consent checkbox** before user can proceed
- [x] **Push notification consent alert** with clear explanation
- [x] **Email notification consent alert** with clear explanation
- [x] **Opt-in defaults** for all notifications (not opt-out)
- [x] **Clear privacy disclosures** in onboarding flow
- [x] **Links to Privacy Policy and Terms** in onboarding

---

## 📝 Privacy Policy Updates (ACTION REQUIRED)

### Step 1: Update Web Privacy Policy
File: `/apps/web/src/app/privacy/page.jsx`

Use the template in `PRIVACY_POLICY_TEMPLATE.md` to add:

- [ ] **Data We Collect** section (list all data types)
- [ ] **Third-Party Data Sharing** section (RevenueCat, analytics provider)
- [ ] **Your Rights & Choices** section (access, delete, revoke consent)
- [ ] **Data Retention** section (how long you keep data)
- [ ] **Data Security** section (how you protect data)
- [ ] **Contact information** for privacy requests

**Estimated time**: 30-45 minutes

### Step 2: Verify Privacy Policy is Live
- [ ] Visit `https://capriremote.com/privacy` and confirm it loads
- [ ] Verify all sections from template are included
- [ ] Test links from mobile app onboarding screen

---

## 🏗️ App Store Connect Setup (ACTION REQUIRED)

### Step 1: Upload Build
- [ ] Open Xcode
- [ ] Select "Any iOS Device" as destination
- [ ] Product → Archive
- [ ] Wait for archive to complete
- [ ] Click "Distribute App"
- [ ] Select "App Store Connect"
- [ ] Upload build
- [ ] Wait for processing (10-30 minutes)

**Estimated time**: 30-60 minutes (including processing)

### Step 2: Set App Category
- [ ] Go to App Store Connect → Capri Remote → App Information
- [ ] Set **Primary Category**: Business (or Productivity)
- [ ] Set **Secondary Category** (optional): Utilities
- [ ] Click "Save"

**Estimated time**: 2 minutes

### Step 3: Set Privacy Policy URL
- [ ] Go to App Store Connect → Capri Remote → App Information
- [ ] Find "Privacy Policy URL (en-US)"
- [ ] Enter: `https://capriremote.com/privacy`
- [ ] Click "Save"

**Estimated time**: 1 minute

### Step 4: Attach Build to Version 1.0
- [ ] Go to App Store Connect → Capri Remote → iOS App → 1.0 Prepare for Submission
- [ ] Scroll to "Build" section
- [ ] Click "+ Build"
- [ ] Select your uploaded build
- [ ] Click "Done"

**Estimated time**: 2 minutes

### Step 5: Fix In-App Purchase Metadata

For each of the 4 in-app purchases, add metadata:

#### resume_starter_pack
- [ ] Go to: In-App Purchases → resume_starter_pack
- [ ] Add **Display Name**: "Resume Starter Pack"
- [ ] Add **Description**: "Get your resume ready for remote jobs with our starter pack including basic templates and formatting tips."
- [ ] Upload **Review Screenshot** (screenshot showing this purchase in your app)
- [ ] Click "Save"

#### resume_bundle
- [ ] Go to: In-App Purchases → resume_bundle
- [ ] Add **Display Name**: "Complete Resume Bundle"
- [ ] Add **Description**: "Everything you need to create a standout resume: premium templates, AI review, and expert tips for remote job applications."
- [ ] Upload **Review Screenshot**
- [ ] Click "Save"

#### resume_review
- [ ] Go to: In-App Purchases → resume_review
- [ ] Add **Display Name**: "AI Resume Review"
- [ ] Add **Description**: "Get instant AI-powered feedback on your resume with actionable suggestions to improve your chances of landing remote interviews."
- [ ] Upload **Review Screenshot**
- [ ] Click "Save"

#### resume_rewrite
- [ ] Go to: In-App Purchases → resume_rewrite
- [ ] Add **Display Name**: "Professional Resume Rewrite"
- [ ] Add **Description**: "Have our AI completely rewrite your resume to highlight your remote work skills and optimize for applicant tracking systems."
- [ ] Upload **Review Screenshot**
- [ ] Click "Save"

**Estimated time**: 20-30 minutes

---

## 📸 Screenshots & Assets (ALREADY COMPLETE)

- [x] 3 screenshots uploaded for en-US
- [x] App icon set
- [x] App name set

---

## 📋 Final Pre-Submission Checklist

### App Store Connect
- [ ] Build uploaded and processed
- [ ] Build attached to version 1.0
- [ ] Primary category set
- [ ] Privacy Policy URL set
- [ ] All 4 in-app purchases have metadata
- [ ] Review contact info is set (already done ✅)
- [ ] App description is set (already done ✅)
- [ ] Keywords are set (already done ✅)
- [ ] Screenshots uploaded (already done ✅)

### Privacy & Compliance
- [ ] Privacy Policy updated with all required sections
- [ ] Privacy Policy URL is live and accessible
- [ ] Data collection consent in app (already done ✅)
- [ ] Notification consent alerts in app (already done ✅)

### Testing
- [ ] Test onboarding flow and verify consent checkbox works
- [ ] Test push notification toggle shows consent alert
- [ ] Test email notification toggle shows consent alert
- [ ] Test Privacy Policy link opens correctly
- [ ] Test Terms of Service link opens correctly
- [ ] Test all 4 in-app purchases can be initiated
- [ ] Test restore purchases functionality

---

## 🚀 Submit for Review

Once all checkboxes above are complete:

1. [ ] Go to App Store Connect → Capri Remote → 1.0 Prepare for Submission
2. [ ] Review all information one final time
3. [ ] Scroll to bottom
4. [ ] Click "Add for Review"
5. [ ] Click "Submit for Review"

**Review time**: Typically 24-48 hours (can be up to 7 days)

---

## 📊 Estimated Total Time

| Task | Time |
|------|------|
| Update Privacy Policy | 30-45 min |
| Upload build to App Store Connect | 30-60 min |
| Set category, privacy URL, attach build | 5 min |
| Fix in-app purchase metadata | 20-30 min |
| Final testing | 15-20 min |
| **TOTAL** | **~2-3 hours** |

---

## ⚠️ Common Issues & Solutions

### "Build is invalid"
- Make sure you incremented the build number in Xcode
- Verify all required capabilities are enabled
- Check for missing entitlements

### "Privacy Policy URL is not accessible"
- Verify the URL loads in a browser
- Make sure it's HTTPS (not HTTP)
- Check for any redirect issues

### "In-app purchase screenshot required"
- Take a screenshot of your app showing the purchase UI
- Must be actual device screenshot (not simulator)
- Should clearly show the product name and price

### "App rejected for privacy issues"
- Double-check your Privacy Policy includes ALL data types
- Verify consent prompts are working in the app
- Make sure you're not collecting data before consent

---

## 📞 Need Help?

- **App Store Connect Issues**: https://developer.apple.com/contact/
- **Privacy Questions**: privacy@capriremote.com
- **Technical Support**: support@capriremote.com

---

**Good luck with your submission! 🎉**
