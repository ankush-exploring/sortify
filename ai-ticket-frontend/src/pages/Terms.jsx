import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm text-[var(--text-primary)] leading-relaxed">
      <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 inline-block">&larr; Back</Link>
      <h1 className="text-xl font-semibold mb-6">Terms of Service</h1>

      <div className="space-y-5 text-[var(--text-primary)]">
        <p>
          These terms govern your use of Sortify, an AI-powered ticket management system.
          By accessing or using Sortify, you agree to these terms.
        </p>

        <h2 className="text-base font-semibold">1. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials
          and for all activity under your account. You must provide accurate information
          during registration.
        </p>

        <h2 className="text-base font-semibold">2. Acceptable Use</h2>
        <p>
          You agree not to misuse Sortify for unlawful activities, spam, or any form of
          abuse. Tickets must contain accurate and relevant information.
        </p>

        <h2 className="text-base font-semibold">3. AI Processing</h2>
        <p>
          Sortify uses Google Gemini AI to analyze tickets for priority, skills, and
          helpful notes. AI analysis is provided as-is and may not always be accurate.
          Moderators should review AI-generated content before taking action.
        </p>

        <h2 className="text-base font-semibold">4. Data & Privacy</h2>
        <p>
          We store ticket data, user profiles, and communication logs necessary for
          the system to function. See our <Link to="/privacy" className="underline">Privacy Policy</Link> for details.
          We do not sell your data to third parties.
        </p>

        <h2 className="text-base font-semibold">5. Limitation of Liability</h2>
        <p>
          Sortify is provided "as is" without warranties of any kind. We are not
          liable for damages arising from the use or inability to use the service.
        </p>

        <h2 className="text-base font-semibold">6. Changes</h2>
        <p>
          We may update these terms at any time. Continued use after changes means
          you accept the revised terms.
        </p>

        <p className="text-[var(--text-secondary)] pt-4">Last updated: July 2026</p>
      </div>
    </div>
  );
}
