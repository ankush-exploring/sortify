import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm text-[var(--text-primary)] leading-relaxed">
      <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 inline-block">&larr; Back</Link>
      <h1 className="text-xl font-semibold mb-6">Privacy Policy</h1>

      <div className="space-y-5">
        <p>
          This policy explains how Sortify collects, uses, and protects your personal
          information when you use our ticket management platform.
        </p>

        <h2 className="text-base font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account information: email address and hashed password</li>
          <li>Profile data: name, role, and skills (for moderators)</li>
          <li>Ticket data: titles, descriptions, and AI analysis results</li>
          <li>Communication logs: email notifications sent through the system</li>
        </ul>

        <h2 className="text-base font-semibold">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To authenticate users and manage access control</li>
          <li>To process and assign support tickets to appropriate moderators</li>
          <li>To send email notifications (welcome emails, ticket assignments)</li>
          <li>To improve AI ticket triage accuracy</li>
        </ul>

        <h2 className="text-base font-semibold">Data Storage & Security</h2>
        <p>
          Your data is stored securely in MongoDB with encryption in transit (TLS).
          Passwords are hashed using bcrypt before storage. We retain ticket data
          as long as your account is active.
        </p>

        <h2 className="text-base font-semibold">Third-Party Services</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Gemini AI</strong> — analyzes ticket content for triage</li>
          <li><strong>Resend</strong> — sends transactional emails</li>
          <li><strong>MongoDB</strong> — database hosting</li>
        </ul>
        <p>These providers process data only as necessary to deliver their services.</p>

        <h2 className="text-base font-semibold">Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data
          by contacting <a href="mailto:sortify.help@gmail.com" className="underline">sortify.help@gmail.com</a>.
          We will respond within 30 days.
        </p>

        <h2 className="text-base font-semibold">Cookies</h2>
        <p>
          Sortify does not use tracking cookies. We use localStorage only for theme
          preference and authentication token persistence.
        </p>

        <p className="text-[var(--text-secondary)] pt-4">Last updated: July 2026</p>
      </div>
    </div>
  );
}
