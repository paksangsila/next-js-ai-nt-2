# Project Notes

สรุปเฉพาะสิ่งที่ developer ใหม่ต้องรู้

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + MariaDB
- better-auth สำหรับ authentication
- Zustand สำหรับ cart state ฝั่ง client

## Scripts

ใช้เฉพาะ script ที่มีใน `package.json`

```bash
npm run dev
npm run build
npm run start
npm run lint
```

ถ้าไม่มี `test` หรือ `typecheck` ห้าม invent ขึ้นมาเอง

## Prisma gotchas

- `schema.prisma` ใช้ custom generator output เช่น `../generated/prisma`
- หลัง `npm install` ควรรัน `npx prisma generate`
- ถ้าใช้ driver adapter ต้องตรวจ `src/lib/prisma.ts`
- ระหว่าง onboarding ห้ามรันคำสั่งที่เปลี่ยน database schema โดยไม่ขออนุญาต

## Docker gotcha

ถ้า `Dockerfile` copy `.next/standalone` แต่ `next.config.ts` ไม่มี `output: "standalone"` ให้เตือนว่า Docker build/runtime ยังไม่พร้อม

## Env

- ให้ copy `.env.example` เป็น `.env`