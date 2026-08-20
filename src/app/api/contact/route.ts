import { Resend } from "resend";

import { contactSchema } from "@/lib/contact-schema";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "รูปแบบข้อมูลไม่ถูกต้อง", fieldErrors: null },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "ข้อมูลไม่ถูกต้อง",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  if (website) {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.error("Contact form: missing Resend configuration");
    return Response.json(
      { error: "ระบบยังไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่ภายหลัง" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[ติดต่อ] ${subject}`,
    text: [
      `ชื่อ: ${name}`,
      `อีเมล: ${email}`,
      `หัวข้อ: ${subject}`,
      "",
      "ข้อความ:",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Contact form: Resend send failed", error);
    return Response.json(
      { error: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}