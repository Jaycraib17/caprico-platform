# Capri Remote - Compliance & Readiness Checklist

## ✅ App Store Compliance (iOS)

### Privacy & Data Collection
- [x] Privacy Policy created and accessible (`/privacy` on web, linked in mobile settings)
- [x] Terms of Service created and accessible (`/terms` on web, linked in mobile settings)
- [x] Data consent messaging added to onboarding
- [x] Privacy policy explains what data is collected (country, email, saved jobs, preferences)
- [x] Privacy policy explains purpose of data collection (job recommendations, alerts)
- [x] Privacy policy includes data retention and deletion policy
- [x] Contact email provided for privacy inquiries (privacy@capriremote.com)

### Payments & Monetization
- [x] **Premium subscriptions removed from mobile app** (App Store compliance)
- [x] Premium features are web-only
- [x] No external payment methods (Stripe, PayPal) in mobile app
- [x] Mobile app is free to use without in-app purchases

### Permissions & Consent
- [x] Onboarding includes data usage consent messaging
- [x] Country data collection explained in onboarding
- [x] Notification toggles in settings (placeholder for future implementation)
- [ ] **TODO:** Implement pre-permission screen for push notifications (when notifications are added)

---

## 🌐 Web Features (Available)

### Premium Subscription
- Premium is available via web at `/premium` (if implemented)
- Features: Unlimited job alerts, ad-free browsing, priority support
- Payment processing via Stripe (web only)

---

## 📱 Mobile Features (Current State)

### Navigation
- **Home** - Browse curated remote jobs
- **Companies** - View companies hiring remotely
- **Saved** - Manage saved jobs and job alerts
- **Settings** - Account preferences, legal links, sign out

### Removed/Disabled Features
- ❌ Premium tab (removed for App Store compliance)
- ❌ In-app purchases (not implemented)
- ❌ External payment links (removed)

---

## 🔒 Privacy & Security

### Data Protection
- ✅ HTTPS/TLS encryption in transit
- ✅ Password hashing with Argon2
- ✅ Session-based authentication
- ✅ No data selling policy

### User Rights
- ✅ Access: Users can request their data
- ✅ Correction: Users can update their profile
- ✅ Deletion: Users can delete their account
- ✅ Opt-out: Users can unsubscribe from alerts
- ✅ Data portability: Available on request

---

## 📋 Legal Pages

### Web
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/about` - About Capri Remote
- `/contact` - Contact & Support

### Mobile
- Settings → Privacy Policy (opens web version)
- Settings → Terms of Service (opens web version)
- Settings → Contact Support (mailto link)

---

## 🎨 Branding & Consistency

### Name
- ✅ Consistent branding as "Capri Remote" across all platforms
- ✅ No conflicting titles (removed "Remote No Gatekeeping")

### Messaging
- ✅ "Curated Remote Jobs, Alerts & Career Tools"
- ✅ "Verified remote opportunities from real companies hiring globally"
- ✅ "No scams, just quality jobs updated daily"

---

## 🚀 Pre-Launch Checklist

### Required Before App Store Submission
- [x] Privacy Policy accessible and complete
- [x] Terms of Service accessible and complete
- [x] No external payment methods in mobile app
- [x] Data consent messaging in onboarding
- [x] Contact information provided (support@capriremote.com)
- [x] App name and branding consistent
- [ ] **App Store listing prepared** (screenshots, description, keywords)
- [ ] **Developer account set up** (Apple Developer Program)
- [ ] **App icons and assets finalized**

### Recommended Before Launch
- [x] About page created
- [x] Contact page created
- [x] Footer with legal links on web
- [x] Trust indicators (verified jobs, curated, updated daily)
- [ ] User testing and QA
- [ ] Performance testing
- [ ] Accessibility review

---

## 📞 Support Contacts

- **General:** hello@capriremote.com
- **Support:** support@capriremote.com
- **Privacy:** privacy@capriremote.com
- **Legal:** legal@capriremote.com
- **Feedback:** feedback@capriremote.com

---

## ⚠️ Known Limitations

### Mobile
- Push notifications: UI toggles exist but backend not implemented
- Profile editing: Settings link exists but page not implemented
- Premium features: Disabled on mobile, available on web only

### Both Platforms
- OAuth providers: Only email auth is currently enabled
- Resume tools: Mentioned in messaging but not yet implemented
- Advanced search: Basic filters implemented, advanced features pending

---

## 🔄 Next Steps

1. **Test all legal pages and links** - Ensure privacy policy, terms, and contact pages load correctly
2. **Deploy to production** - Make sure legal pages are accessible at production URLs
3. **Prepare App Store listing** - Screenshots, description, keywords, pricing (free)
4. **Submit for review** - Apple App Store submission
5. **Monitor user feedback** - Track reports and feedback after launch

---

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Maintained by:** Capri Remote Team
