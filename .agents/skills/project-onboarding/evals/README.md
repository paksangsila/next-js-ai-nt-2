# Evals

ชุด eval แบบสั้นสำหรับสอน มี 2 เคสพอ:

1. `setup-thai` ตรวจว่า agent ตอบ setup เป็นภาษาไทยแบบตาราง และไม่ invent script
2. `docker-gotcha` ตรวจว่า agent เจอ mismatch ระหว่าง Dockerfile กับ next.config.ts

แนวทางรันจริง:

- Run once with this skill
- Run once without this skill
- Compare outputs using assertions in `evals.json`
