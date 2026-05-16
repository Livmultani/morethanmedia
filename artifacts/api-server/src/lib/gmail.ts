import nodemailer from "nodemailer";

const TO_EMAIL = "livkaurmultani@gmail.com";
const FROM_EMAIL = "livkaurmultani@gmail.com";

function getTransporter() {
  const appPassword = process.env["GMAIL_APP_PASSWORD"];
  if (!appPassword) {
    throw new Error("GMAIL_APP_PASSWORD environment variable is not set.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: FROM_EMAIL,
      pass: appPassword,
    },
  });
}

export async function sendContactEmail(params: {
  name: string;
  contact: string;
  message: string;
}): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"More Than Media" <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    subject: `New message from More Than Media website`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#333">
        <h2 style="color:#c06080;border-bottom:2px solid #f0d6e0;padding-bottom:12px">
          New message from your website
        </h2>
        <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">
          <tr>
            <td style="padding:10px 12px;font-weight:bold;width:130px;background:#fdf5f8">Name</td>
            <td style="padding:10px 12px">${params.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#fdf5f8">Contact</td>
            <td style="padding:10px 12px">${params.contact}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;vertical-align:top;background:#fdf5f8">Message</td>
            <td style="padding:10px 12px;white-space:pre-wrap">${params.message}</td>
          </tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">
          Sent via the More Than Media website · morethanmedia campaign
        </p>
      </div>
    `,
  });
}
