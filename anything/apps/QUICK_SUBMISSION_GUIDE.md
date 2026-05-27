# Quick Submission Guide — Capri Remote

## ✅ Code Compliance: COMPLETE

All App Store guideline violations have been fixed in the code. No further code changes needed.

---

## 🚀 3 Steps to Submit

### Step 1: Update Privacy Policy (30-45 min)

**File**: `/apps/web/src/app/privacy/page.jsx`

**What to do**:
1. Open `PRIVACY_POLICY_TEMPLATE.md`
2. Copy all sections into your privacy page
3. Replace `[Your Analytics Provider]` with your actual provider (e.g., "Google Analytics", "Mixpanel", etc.)
4. Add your company address
5. Update "Last Updated" date to today
6. Deploy to production
7. Verify it's live at `https://capriremote.com/privacy`

**Critical sections to include**:
- ✅ Data We Collect (list all types)
- ✅ Third-Party Data Sharing (RevenueCat + analytics provider)
- ✅ Your Rights & Choices (access, delete, revoke)
- ✅ Data Retention (how long you keep data)
- ✅ Contact information

---

### Step 2: Upload Build (30-60 min)

**In Xcode**:
1. Select "Any iOS Device" as destination
2. Product → Archive
3. Wait for archive to complete
4. Click "Distribute App"
5. Select "App Store Connect"
6. Follow prompts to upload
7. Wait for processing (10-30 minutes)

**In App Store Connect**:
1. Go to: Capri Remote → iOS App → 1.0 Prepare for Submission
2. Scroll to "Build" section
3. Click "+ Build"
4. Select your uploaded build
5. Click "Done"

---

### Step 3: Fix In-App Purchase Metadata (20-30 min)

**For each of the 4 products**, add:

#### resume_starter_pack
- **Display Name**: Resume Starter Pack
- **Description**: Get your resume ready for remote jobs with our starter pack including basic templates and formatting tips.

#### resume_bundle
- **Display Name**: Complete Resume Bundle
- **Description**: Everything you need to create a standout resume: premium templates, AI review, and expert tips for remote job applications.

#### resume_review
- **Display Name**: AI Resume Review
- **Description**: Get instant AI-powered feedback on your resume with actionable suggestions to improve your chances of landing remote interviews.

#### resume_rewrite
- **Display Name**: Professional Resume Rewrite
- **Description**: Have our AI completely rewrite your resume to highlight your remote work skills and optimize for applicant tracking systems.

**Where to add**:
1. App Store Connect → Capri Remote → In-App Purchases
2. Click each product ID
3. Add Display Name and Description
4. Click "Save"

---

## ✅ Already Complete

You don't need to do these — they're already done:

- ✅ App name set
- ✅ Privacy Policy URL set (`https://capriremote.com/privacy`)
- ✅ Primary category set
- ✅ App description set
- ✅ Keywords set
- ✅ Screenshots uploaded
- ✅ Review contact info set
- ✅ In-app purchase pricing configured
- ✅ Age rating set
- ✅ Available in 175 territories

---

## 🧪 Test Before Submitting

1. **Onboarding Flow**
   - Open app fresh (delete and reinstall if needed)
   - Go through onboarding
   - Verify privacy slide shows data collection list
   - Verify consent checkbox is required
   - Verify "Continue" is disabled until consent is checked

2. **Analytics Consent**
   - Complete onboarding WITHOUT checking consent
   - Verify no analytics events are sent (check network tab)
   - Delete app, reinstall
   - Complete onboarding WITH consent checked
   - Verify analytics events are sent

3. **Notification Consent**
   - Go to Settings
   - Toggle "Push Notifications" ON
   - Verify alert appears with clear explanation
   - Click "Enable"
   - Verify toggle stays ON
   - Toggle OFF, then ON again
   - Verify alert appears again

4. **Privacy Policy Link**
   - In onboarding, tap "Privacy Policy" link
   - Verify it opens `https://capriremote.com/privacy`
   - Verify all sections from template are present

---

## 📤 Submit for Review

Once all 3 steps above are complete:

1. Go to: App Store Connect → Capri Remote → 1.0 Prepare for Submission
2. Review all information
3. Scroll to bottom
4. Click "Add for Review"
5. Click "Submit for Review"

**Review time**: Typically 24-48 hours

---

## ⚠️ Common Mistakes to Avoid

1. **Don't skip the Privacy Policy update** — Apple will reject if it doesn't match what's in the app
2. **Don't forget to attach the build** — You can upload a build but forget to attach it to version 1.0
3. **Don't leave in-app purchase metadata blank** — Even though they're consumables, descriptions help reviewers
4. **Don't test in simulator** — Test on a real device to verify everything works

---

## 📊 Submission Checklist

### Before Clicking "Submit for Review"

- [ ] Privacy Policy updated and live at `https://capriremote.com/privacy`
- [ ] Build uploaded and attached to version 1.0
- [ ] All 4 in-app purchases have Display Name and Description
- [ ] Tested onboarding consent flow on real device
- [ ] Tested notification consent alerts on real device
- [ ] Verified Privacy Policy link opens correctly
- [ ] Verified Terms of Service link opens correctly

### After Submission

- [ ] Monitor App Store Connect for status updates
- [ ] Check email for any messages from Apple Review Team
- [ ] Be ready to respond to any questions within 24 hours

---

## 🎯 What Changed in the Code

### New Files Created
1. `/apps/mobile/src/utils/consent.js` — Consent storage utility
2. `/apps/FINAL_COMPLIANCE_SUMMARY.md` — Complete compliance summary
3. `/apps/PRIVACY_POLICY_TEMPLATE.md` — Privacy Policy template
4. `/apps/QUICK_SUBMISSION_GUIDE.md` — This file

### Files Modified
1. `/apps/mobile/src/utils/analytics.js` — Added consent checks
2. `/apps/mobile/src/app/onboarding.jsx` — Added consent checkbox and storage
3. `/apps/mobile/src/app/(tabs)/settings.jsx` — Added notification consent alerts

### What the Changes Do
- **Analytics**: No tracking until user explicitly consents in onboarding
- **Notifications**: Explicit consent alert when user enables push/email notifications
- **Privacy**: Clear disclosure of all data collected with mandatory consent checkbox

---

## 📞 Support

- **App Store Connect**: https://developer.apple.com/contact/
- **Privacy Questions**: privacy@capriremote.com
- **Technical Support**: support@capriremote.com

---

**Total time to submission: ~2-3 hours**

**Good luck! 🚀**
