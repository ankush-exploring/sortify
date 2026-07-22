import { Link } from "react-router-dom";

export default function Docs() {
  const sections = [
    {
      title: "What is Sortify?",
      body: "Sortify is an AI-powered ticket management system. Create support tickets and get automatic priority classification, skill tagging, and moderator assignment — all driven by AI analysis.",
    },
    {
      title: "Roles",
      body: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>User</strong> — Create and manage your own tickets. Default role on signup.</li>
          <li><strong>Moderator</strong> — View and resolve all tickets. Auto-assigned tickets matching their skills.</li>
          <li><strong>Admin</strong> — Full access. Manage users, roles, view all tickets, delete any ticket.</li>
        </ul>
      ),
    },
    {
      title: "How tickets work",
      body: (
        <ol className="list-decimal pl-5 space-y-1">
          <li>You create a ticket with a title and description.</li>
          <li>The AI (Groq) analyzes it — assigns a priority (critical/high/medium/low), extracts related skills, and writes helpful notes.</li>
          <li>The ticket status changes to <strong>IN_PROGRESS</strong> once analysis completes.</li>
          <li>A moderator with matching skills gets auto-assigned and notified via email.</li>
          <li>You can view the AI analysis under the "AI analysis" section on the ticket detail page.</li>
        </ol>
      ),
    },
    {
      title: "Email verification",
      body: "When you sign up, a 6-digit verification code is sent to your email. You must enter this code to complete registration. This ensures only valid email addresses can create accounts.",
    },
    {
      title: "Admin panel",
      body: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Navigate to <strong>/admin</strong> to manage users.</li>
          <li><strong>Users</strong> tab — View all users, filter by role, search by email, edit roles and skills.</li>
          <li><strong>Tickets</strong> tab — (Coming soon) View all tickets across the system.</li>
          <li><strong>Roles</strong> tab — Reference for what each role can do.</li>
        </ul>
      ),
    },
    {
      title: "Deleting tickets",
      body: "Ticket creators and admins can delete a ticket from the ticket detail page. A confirmation dialog prevents accidental deletion.",
    },
    {
      title: "Tech stack",
      body: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Frontend:</strong> React 19, Vite, Tailwind CSS v4, daisyUI</li>
          <li><strong>Backend:</strong> Express 5, MongoDB, Mongoose</li>
          <li><strong>Auth:</strong> JWT (JSON Web Tokens)</li>
          <li><strong>AI:</strong> Groq API (llama-3.3-70b-versatile)</li>
          <li><strong>Email:</strong> Resend</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8">Documentation</h1>
      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold mb-2">{s.title}</h2>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed">{s.body}</div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-[var(--text-secondary)]">
        Still have questions?{" "}
        <a href="mailto:sortify.help@gmail.com" className="text-[var(--text-primary)] hover:underline">
          sortify.help@gmail.com
        </a>
      </p>
    </div>
  );
}
