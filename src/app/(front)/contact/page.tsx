"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  RiFacebookFill,
  RiInstagramFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from "@remixicon/react"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactFormValues } from "@/lib/contact-schema"

type FormStatus = "idle" | "pending" | "success" | "error"

const contactInfo = [
  {
    icon: MapPin,
    label: "ที่อยู่",
    value: "123 ถนนตัวอย่าง แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500",
  },
  {
    icon: Phone,
    label: "โทรศัพท์",
    value: "02-123-4567",
  },
  {
    icon: Mail,
    label: "อีเมล",
    value: "contact@cosci.com",
  },
  {
    icon: Clock,
    label: "เวลาทำการ",
    value: "จันทร์ - ศุกร์ 09:00 - 18:00 น.",
  },
]

const socialLinks = [
  { icon: RiFacebookFill, label: "Facebook", href: "https://facebook.com" },
  { icon: RiInstagramFill, label: "Instagram", href: "https://instagram.com" },
  { icon: RiTwitterXFill, label: "X (Twitter)", href: "https://x.com" },
  { icon: RiYoutubeFill, label: "YouTube", href: "https://youtube.com" },
]

const faqs = [
  {
    question: "ใช้เวลานานเท่าไหร่ในการได้รับคำตอบ?",
    answer:
      "ทีมงานจะตอบกลับภายใน 1-2 วันทำการ หลังจากได้รับข้อความของคุณ",
  },
  {
    question: "สามารถสั่งซื้อสินค้าทางโทรศัพท์ได้หรือไม่?",
    answer:
      "ได้ครับ สามารถติดต่อผ่านเบอร์โทรในช่วงเวลาทำการเพื่อสั่งซื้อได้",
  },
  {
    question: "มีบริการส่งสินค้าไปต่างจังหวัดหรือไม่?",
    answer:
      "มีครับ เราส่งสินค้าทั่วประเทศผ่านบริษัทขนส่งชั้นนำ ค่าจัดส่งคำนวณตามน้ำหนัก",
  },
  {
    question: "ต้องการแจ้งปัญหาสินค้า ต้องทำอย่างไร?",
    answer:
      "ส่งรายละเอียดปัญหาพร้อมหมายเลขคำสั่งซื้อผ่านฟอร์มติดต่อ เพื่อให้ทีมงานตรวจสอบและช่วยเหลือได้อย่างรวดเร็ว",
  },
]

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setStatus("pending")
    setServerError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = (await response.json()) as {
        ok?: boolean
        error?: string
        fieldErrors?: Record<string, string[] | undefined>
      }

      if (!response.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            const message = messages?.[0]
            if (message && field !== "root") {
              form.setError(field as keyof ContactFormValues, {
                type: "server",
                message,
              })
            }
          }
        }
        setServerError(result.error ?? "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
        setStatus("error")
        return
      }

      form.reset()
      setStatus("success")
    } catch {
      setServerError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง")
      setStatus("error")
    }
  }

  const isPending = status === "pending"

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mx-auto max-w-xl text-center font-medium text-4xl tracking-[-0.045em] sm:text-[2.75rem]/[1.2]">
          ติดต่อเรา
        </h2>
        <p className="mt-3 text-center text-lg text-muted-foreground tracking-[-0.01em] sm:text-2xl">
          สอบถามข้อมูลเพิ่มเติมหรือติดต่อทีมงาน เรายินดีให้บริการ
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          {/* Left: contact info */}
          <section aria-labelledby="contact-info-heading">
            <h3
              id="contact-info-heading"
              className="text-xl font-medium tracking-[-0.015em]"
            >
              ข้อมูลติดต่อ
            </h3>

            <div className="mt-6 grid gap-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border p-5"
                >
                  <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{label}</h4>
                    <p className="mt-1 text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="font-medium">ติดตามเรา</h4>
              <div className="mt-3 flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <Button key={label} asChild size="icon" variant="outline">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3
                id="faq-heading"
                className="text-xl font-medium tracking-[-0.015em]"
              >
                คำถามที่พบบ่อย
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border px-5 py-4"
                  >
                    <summary className="cursor-pointer font-medium outline-none [&::-webkit-details-marker]:hidden">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Right: contact form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>ส่งข้อความถึงเรา</CardTitle>
              <CardDescription>
                กรอกข้อมูลด้านล่าง แล้วทีมงานจะติดต่อกลับโดยเร็วที่สุด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                aria-describedby="contact-form-status"
              >
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
                        <Input
                          {...field}
                          id="contact-name"
                          autoComplete="name"
                          placeholder="ชื่อของคุณ"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.error ? "contact-name-error" : undefined
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError
                            id="contact-name-error"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-email">อีเมล</FieldLabel>
                        <Input
                          {...field}
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.error ? "contact-email-error" : undefined
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError
                            id="contact-email-error"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="subject"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-subject">หัวข้อ</FieldLabel>
                        <Input
                          {...field}
                          id="contact-subject"
                          placeholder="หัวข้อที่ต้องการติดต่อ"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.error
                              ? "contact-subject-error"
                              : undefined
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError
                            id="contact-subject-error"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
                        <Textarea
                          {...field}
                          id="contact-message"
                          rows={6}
                          placeholder="พิมพ์ข้อความของคุณที่นี่..."
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.error
                              ? "contact-message-error"
                              : undefined
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError
                            id="contact-message-error"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <div aria-hidden="true" className="sr-only">
                    <label htmlFor="contact-website">เว็บไซต์</label>
                    <input
                      id="contact-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...form.register("website")}
                    />
                  </div>

                  <div id="contact-form-status" aria-live="polite">
                    {status === "success" && (
                      <p
                        role="status"
                        className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground"
                      >
                        ส่งข้อความสำเร็จแล้ว ขอบคุณที่ติดต่อเรา
                      </p>
                    )}
                    {status === "error" && serverError && (
                      <p
                        role="alert"
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      >
                        {serverError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending && <Spinner />}
                    {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
