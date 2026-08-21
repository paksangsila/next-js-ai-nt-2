# Database Setup

สร้างฐานข้อมูลใหม่ ชื่อว่า ecommerce หรือใช้ฐานข้อมูลเดิมในไฟล์ .env.example ถ้ามีอยู่แล้ว และเพิ่มข้อมูลตัวอย่างไปที่ตาราง (ใช้เฉพาะการตั้งค่าครั้งแรก และเมื่อ user ถามเรื่อง database setup หรือ seed data เท่านั้้น)

- ถ้ายังไม่มีฐานข้อมูล Mariadb ให้อ่านไฟล์นี้ เพื่อติดตั้ง `assets/install_mariadb_with_docker.txt`

- ถ้ายังไม่มีตารางให้อ่านไฟล์นี้เพื่อสร้างตาราง `assets/create_table_ecommerce.sql`


## Command for migrate

```bash
npx prisma db push
```

## Seed Data

- ถ้า Database พร้อมแล้วให้รันคำสั่ง sql นี้ เพื่อเพิ่มข้อมูลเริ่มต้น `assets/insert_data_example.sql`