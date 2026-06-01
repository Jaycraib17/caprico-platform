export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            Last Updated: April 29, 2026
          </p>
          <p className="text-gray-700 leading-relaxed mb-10">
            Welcome to Capri Remote. We are committed to protecting your privacy
            and ensuring full transparency about how we collect, use, and
            safeguard your personal information. This Privacy Policy explains
            our practices regarding data collected through our website and
            mobile application.
          </p>

          <div className="prose prose-gray max-w-none">
            {/* ── 1. DATA WE COLLECT ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              1. Data We Collect
            </h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              Information You Provide
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address, password
                (stored encrypted), first name, last name
              </li>
              <li>
                <strong>Job Preferences:</strong> Your country, preferred job
                categories, experience level, employment types, timezone
              </li>
              <li>
                <strong>Saved Jobs &amp; Companies:</strong> Jobs and companies
                you bookmark within the app
              </li>
              <li>
                <strong>Job Alerts:</strong> Custom search filters you save for
                email notifications
              </li>
              <li>
                <strong>Application Tracking:</strong> Job applications you
                track — company name, job title, status, notes, follow-up dates
              </li>
              <li>
                <strong>Support Tickets:</strong> Any information you provide
                when contacting customer support
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              Information We Collect Automatically
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Usage Analytics:</strong> Pages viewed, features used,
                time spent in the app, device type, operating system, and app
                version — collected only after you give explicit consent during
                onboarding
              </li>
              <li>
                <strong>Purchase Data:</strong> In-app purchase transaction IDs,
                purchase dates, and product IDs (processed and validated via
                RevenueCat)
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              Information We Do NOT Collect
            </h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>We do not collect your resume content</li>
              <li>
                We do not collect your social security number or any government
                ID
              </li>
              <li>
                We do not collect precise location data (country-level only)
              </li>
              <li>We do not track you across other apps or websites</li>
            </ul>

            {/* ── 2. HOW WE USE YOUR DATA ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              2. How We Use Your Data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>
                Show you relevant remote job opportunities based on your country
                and preferences
              </li>
              <li>
                Send you email alerts when new jobs match your saved searches
                (only if you opt in)
              </li>
              <li>
                Send you push notifications for job matches (only if you opt in)
              </li>
              <li>Process in-app purchases for premium services</li>
              <li>Respond to your support requests</li>
              <li>
                Improve our app and services through anonymous usage analytics
                (only with your consent)
              </li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>

            {/* ── 3. THIRD-PARTY DATA SHARING ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              3. Third-Party Data Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share your data with the following third parties:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                RevenueCat — In-App Purchase Management
              </h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>
                  <strong>What we share:</strong> Your Apple / Google anonymous
                  identifier, purchase transaction data, product IDs
                </li>
                <li>
                  <strong>Why:</strong> To validate in-app purchases and manage
                  your purchase history
                </li>
                <li>
                  <strong>Their privacy policy:</strong>{" "}
                  <a
                    href="https://www.revenuecat.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    https://www.revenuecat.com/privacy
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Analytics — Internal Analytics Only
              </h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>
                  <strong>What we collect:</strong> Anonymous usage data (pages
                  viewed, features used, device type, app version)
                </li>
                <li>
                  <strong>Why:</strong> To understand how users interact with
                  our app and improve the experience
                </li>
                <li>
                  <strong>Important:</strong> We do not use any external
                  analytics provider (e.g., Google Analytics, Mixpanel). All
                  analytics data is stored solely on our own servers and is
                  never shared with third parties
                </li>
                <li>
                  <strong>Consent:</strong> Analytics are only collected after
                  you explicitly consent during onboarding
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Email Service Provider — Job Alerts
              </h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>
                  <strong>What we share:</strong> Your email address and saved
                  search preferences
                </li>
                <li>
                  <strong>Why:</strong> To send you job alert emails (only if
                  you opt in)
                </li>
                <li>
                  <strong>Consent:</strong> Email alerts are only sent if you
                  explicitly enable them in Settings
                </li>
              </ul>
            </div>

            <p className="text-gray-700 font-semibold mb-6">
              We do NOT sell your data to third parties — ever.
            </p>

            {/* ── 4. YOUR RIGHTS & CHOICES ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              4. Your Rights &amp; Choices
            </h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Access Your Data
            </h3>
            <p className="text-gray-700 mb-4">
              You can request a copy of the data we hold about you by emailing{" "}
              <a
                href="mailto:support@capriremote.com?subject=Data Access Request"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                support@capriremote.com
              </a>{" "}
              with the subject <em>"Data Access Request"</em>.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Delete Your Data
            </h3>
            <p className="text-gray-700 mb-4">
              You can request deletion of your account and all associated data
              by emailing{" "}
              <a
                href="mailto:support@capriremote.com?subject=Delete My Account"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                support@capriremote.com
              </a>{" "}
              with the subject <em>"Delete My Account"</em>. We will permanently
              delete your data within 30 days.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Revoke Consent
            </h3>
            <p className="text-gray-700 mb-2">
              You can revoke consent for data collection at any time:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
              <li>Disable push notifications in Settings → Notifications</li>
              <li>Disable email notifications in Settings → Notifications</li>
              <li>Delete your account to remove all stored data</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Opt Out of Analytics
            </h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
              <li>
                <strong>iOS:</strong> Settings → Privacy &amp; Security →
                Analytics &amp; Improvements → Share iPhone Analytics (disable)
              </li>
              <li>
                <strong>Android:</strong> Settings → Google → Ads → Opt out of
                Ads Personalization
              </li>
              <li>
                You may also contact us to request removal of any analytics data
                we have stored
              </li>
            </ul>

            {/* ── 5. DATA RETENTION ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              5. Data Retention
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-800 border-b border-gray-200">
                      Data Type
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-800 border-b border-gray-200">
                      Retention Period
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3">Account &amp; Profile Data</td>
                    <td className="px-4 py-3">While your account is active</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Job Alerts &amp; Saved Jobs</td>
                    <td className="px-4 py-3">While your account is active</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Purchase Records</td>
                    <td className="px-4 py-3">
                      7 years (tax / legal compliance)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Support Tickets</td>
                    <td className="px-4 py-3">3 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Analytics Data</td>
                    <td className="px-4 py-3">
                      Anonymized and retained for 2 years
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Deleted Accounts</td>
                    <td className="px-4 py-3">
                      Permanently deleted within 30 days of request
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── 6. DATA SECURITY ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We protect your data using:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>
                Industry-standard encryption (TLS/SSL) for all data in transit
              </li>
              <li>
                Encrypted password storage using Argon2 (industry best practice)
              </li>
              <li>Secure cloud infrastructure with access controls</li>
              <li>Regular security audits and dependency updates</li>
              <li>
                Strict internal access controls limiting who can view your data
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              However, no method of transmission over the internet is 100%
              secure. While we use commercially reasonable means to protect your
              information, we cannot guarantee absolute security.
            </p>

            {/* ── 7. CHILDREN'S PRIVACY ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Capri Remote is not intended for users under 13 years old. We do
              not knowingly collect personal information from children under 13.
              If you believe we have collected data from a child under 13,
              please contact us immediately at{" "}
              <a
                href="mailto:support@capriremote.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                support@capriremote.com
              </a>{" "}
              and we will delete it promptly.
            </p>

            {/* ── 8. COOKIES AND TRACKING ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              8. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our website uses cookies solely to maintain your login session and
              remember your preferences. We do not use advertising cookies or
              cross-site tracking cookies. You can control cookies through your
              browser settings, though disabling them may affect login
              functionality.
            </p>

            {/* ── 9. INTERNATIONAL DATA TRANSFERS ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your data in accordance with this Privacy Policy and
              applicable laws, including GDPR and CCPA.
            </p>

            {/* ── 10. CHANGES TO THIS POLICY ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting a notice in the app,
              sending an email to your registered email address, and updating
              the "Last Updated" date at the top of this page. Your continued
              use of Capri Remote after changes become effective constitutes
              acceptance of the updated policy.
            </p>

            {/* ── 11. APP STORE PRIVACY NUTRITION LABEL ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              11. App Store Privacy Nutrition Label
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For transparency, here is what we report to Apple for the App
              Store Privacy Nutrition Label:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  Data Used to Track You
                </h4>
                <p className="text-sm text-gray-600">None</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  Data Linked to You
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Contact Info (email)</li>
                  <li>User Content (saved jobs, alerts, tracking)</li>
                  <li>Identifiers (user ID)</li>
                  <li>Purchases (in-app purchase history)</li>
                  <li>Usage Data (app interactions)</li>
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  Data Not Linked to You
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Diagnostics (crash reports)</li>
                  <li>Performance data</li>
                </ul>
              </div>
            </div>

            {/* ── 12. COMPLIANCE ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              12. Legal Compliance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This Privacy Policy is designed to comply with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
              <li>
                Apple App Store Guidelines 5.1.1 and 5.1.2 (Privacy &amp; Data
                Use)
              </li>
              <li>GDPR — General Data Protection Regulation (EU)</li>
              <li>CCPA — California Consumer Privacy Act (US)</li>
              <li>CAN-SPAM Act (US email regulations)</li>
            </ul>

            {/* ── 13. CONTACT ── */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
              13. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Privacy Inquiries:</strong>{" "}
                <a
                  href="mailto:privacy@capriremote.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  privacy@capriremote.com
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong>{" "}
                <a
                  href="mailto:support@capriremote.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  support@capriremote.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Data Deletion:</strong>{" "}
                <a
                  href="mailto:support@capriremote.com?subject=Delete My Account"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  support@capriremote.com
                </a>{" "}
                — Subject: "Delete My Account"
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </a>
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Terms of Service →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
