# Setup Answer Template

ใช้เมื่อ user ถามว่า setup หรือ run project อย่างไร

| ขั้นตอน | คำสั่ง | หมายเหตุ |
|---|---|---|
| 1. ติดตั้ง dependencies | `npm install` | ใช้ npm เป็นหลัก |
| 2. สร้าง env | `cp .env.example .env` | อย่า reuse secret จริงจากตัวอย่าง |
| 3. Generate Prisma Client | `npx prisma generate` | จำเป็นเพราะใช้ custom output |
| 4. ตรวจ lint | `npm run lint` | ใช้เฉพาะ script ที่มีจริง |
| 5. รัน dev server | `npm run dev` | เปิด local development |

## ข้อควรระวัง

- ห้าม invent script ที่ไม่มีใน `package.json`
- ห้ามรันคำสั่ง migration/database destructive ระหว่าง onboarding
- ถ้าพูดถึง Docker ให้ตรวจ `Dockerfile` คู่กับ `next.config.ts`
