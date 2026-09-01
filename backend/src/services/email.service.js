const nodemailer = require("nodemailer");

const { enqueue } = require("../config/queue");

const APP_NAME = "Student Collab";

// Lazy singleton — created on first use, reused for the lifetime of the process.
let transporter = null;

function getTransporter() {
   if (transporter) {
      return transporter;
   }

   const host = process.env.SMTP_HOST;

   if (!host) {
      return null; // No SMTP configured, so the email is logged instead
   }

   const port = Number(process.env.SMTP_PORT) || 587;
   const user = process.env.SMTP_USER;

   transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 uses TLS, 587/25 use STARTTLS
      auth: user ? { user, pass: process.env.SMTP_PASSWORD } : undefined,
   });

   return transporter;
}

function appUrl(path) {
   const base = process.env.APP_URL || "http://localhost:5173";

   return `${base}${path}`;
}

function buildText({ greeting, lines, actionLabel, actionPath }) {
   return [
      greeting,
      "",
      ...lines,
      "",
      `${actionLabel}: ${appUrl(actionPath)}`,
      "",
      APP_NAME,
   ]
      .join("\n")
      .trim();
}

const templates = {
   // Tells a project owner that somebody applied to their project.
   applicationReceived: ({
      ownerName,
      applicantName,
      projectTitle,
      projectId,
      applicationMessage,
   }) => ({
      subject: `${applicantName} applied to "${projectTitle}"`,
      greeting: `Hi ${ownerName},`,
      lines: [
         `${applicantName} applied to join your project "${projectTitle}".`,
         `They wrote: "${applicationMessage}"`,
      ],
      actionLabel: "Review the application",
      actionPath: `/projects/${projectId}`,
   }),

   // Tells an applicant they are on the team.
   applicationAccepted: ({ applicantName, projectTitle, projectId }) => ({
      subject: `You were accepted into "${projectTitle}"`,
      greeting: `Hi ${applicantName},`,
      lines: [
         `You are now part of the team on "${projectTitle}".`,
         "Open the project to meet the rest of the team and get started.",
      ],
      actionLabel: "Open the project",
      actionPath: `/projects/${projectId}`,
   }),

   // Tells an applicant their application was turned down.
   applicationRejected: ({ applicantName, projectTitle }) => ({
      subject: `Your application to "${projectTitle}" was not accepted`,
      greeting: `Hi ${applicantName},`,
      lines: [
         `Your application to "${projectTitle}" was not accepted this time.`,
         "There are plenty of other projects looking for people with your skills.",
      ],
      actionLabel: "Find another project",
      actionPath: "/projects",
   }),

   // Tells a student the project owner removed them from the team.
   teamMemberRemoved: ({ memberName, projectTitle }) => ({
      subject: `You were removed from "${projectTitle}"`,
      greeting: `Hi ${memberName},`,
      lines: [`You are no longer part of the team on "${projectTitle}".`],
      actionLabel: "Browse other projects",
      actionPath: "/projects",
   }),

   // Tells a student their teammate reviewed them once the project closed.
   reviewReceived: ({ revieweeName, revieweeId, projectTitle, rating, comment }) => ({
      subject: `You received a review for "${projectTitle}"`,
      greeting: `Hi ${revieweeName},`,
      lines: [
         `You received a ${rating} star review for your work on "${projectTitle}".`,
         `"${comment}"`,
      ],
      actionLabel: "View your profile",
      actionPath: `/users/${revieweeId}`,
   }),
};

// Builds one of the templates above and hands it to the queue. Throwing on an
// unknown key keeps a typo from silently sending nothing.
async function queueNotification(template, to, data) {
   const build = templates[template];

   if (!build) {
      throw new Error(`Unknown email template: ${template}`);
   }

   const { subject, ...body } = build(data);

   await enqueue("sendEmail", { to, subject, text: buildText(body) });
}

// Internal sender, called by the queue worker. This one DOES throw, so a failed
// send is retried. If SMTP is not configured the email is just printed.
async function deliverEmail(to, subject, text) {
   if (!to) {
      console.error(`Email skipped, no recipient for: ${subject}`);
      return;
   }

   const mailer = getTransporter();

   if (!mailer) {
      console.log(`\n[email:dev] to=${to}\n  subject="${subject}"\n  ${text}\n`);
      return;
   }

   await mailer.sendMail({
      from: process.env.SMTP_FROM || `${APP_NAME} <no-reply@student-collab.local>`,
      to,
      subject,
      text,
   });
}

module.exports = {
   deliverEmail,
   queueNotification,
   templates,
};
