# คู่มือการ Publish Package ขึ้น npm

## 📋 ขั้นตอนการ Publish

### 1. เตรียมข้อมูลใน package.json

ตรวจสอบให้แน่ใจว่ามีข้อมูลครบถ้วน:
- ✅ `name`: ชื่อ package (ต้อง unique บน npm)
- ✅ `version`: เวอร์ชัน (ใช้ semantic versioning)
- ✅ `description`: คำอธิบาย package
- ✅ `author`: ชื่อผู้พัฒนา (หรือลบออกถ้าไม่ต้องการ)
- ✅ `license`: ใบอนุญาต
- ✅ `repository`: URL ของ Git repository (ถ้ามี)
- ✅ `files`: ระบุไฟล์ที่จะ publish (ถ้าไม่ระบุจะ publish ทั้งหมด)

### 2. สำหรับ Scoped Package (@thai/promptpay-qr)

**สำคัญ:** Scoped package จะเป็น **private** โดย default

ถ้าต้องการ publish เป็น **public** (ฟรี):
```bash
npm publish --access public
```

ถ้าต้องการ publish เป็น **private** (ต้องมี npm paid plan):
```bash
npm publish
```

### 3. ตรวจสอบข้อมูลก่อน Publish

```bash
# ตรวจสอบว่า package.json ถูกต้อง
npm pack --dry-run

# ดูว่ามีไฟล์อะไรบ้างที่จะถูก publish
npm pack

# ดูเนื้อหาในไฟล์ .tgz ที่สร้างขึ้น
tar -tzf *.tgz
```

### 4. Login เข้า npm

```bash
# Login เข้า npm account
npm login

# ตรวจสอบว่า login แล้ว
npm whoami
```

**หมายเหตุ:** 
- ถ้ายังไม่มี npm account ให้ไปสมัครที่ https://www.npmjs.com/signup
- สำหรับ scoped package (@thai/promptpay-qr) ต้องมี npm organization หรือใช้ `--access public`

### 5. Publish Package

```bash
# Publish เป็น public (สำหรับ scoped package)
npm publish --access public

# หรือถ้าเป็น unscoped package
npm publish
```

### 6. ตรวจสอบผลลัพธ์

หลังจาก publish สำเร็จ:
- ไปดูที่ https://www.npmjs.com/package/@thai/promptpay-qr
- ทดสอบติดตั้ง: `npm install @thai/promptpay-qr`

## 🔄 การอัปเดต Version

เมื่อต้องการอัปเดต package:

```bash
# อัปเดต version ตาม semantic versioning
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)

# จากนั้น publish อีกครั้ง
npm publish --access public
```

## ⚠️ สิ่งที่ต้องระวัง

1. **Version ไม่สามารถย้อนกลับได้** - เมื่อ publish แล้วไม่สามารถลบหรือแก้ไข version เดิมได้
2. **ชื่อ Package** - ชื่อ package ไม่สามารถเปลี่ยนได้หลังจาก publish แล้ว
3. **Scoped Package** - ต้องใช้ `--access public` ถ้าต้องการให้เป็น public (ฟรี)
4. **ไฟล์ที่จะ Publish** - ตรวจสอบ `files` field ใน package.json หรือ `.npmignore`

## 📝 Checklist ก่อน Publish

- [ ] ตรวจสอบ package.json ให้ครบถ้วน
- [ ] ตรวจสอบ README.md ให้มีข้อมูลครบถ้วน
- [ ] ตรวจสอบ TypeScript definitions (index.d.ts)
- [ ] ทดสอบว่า package ทำงานได้ถูกต้อง
- [ ] ตรวจสอบ dependencies ว่าถูกต้อง
- [ ] ตรวจสอบว่าไม่มี sensitive data ใน code
- [ ] Login npm แล้ว
- [ ] ตรวจสอบ version number
- [ ] รัน `npm pack --dry-run` เพื่อดูว่ามีไฟล์อะไรบ้าง

## 🚀 Quick Start

```bash
# 1. Login npm
npm login

# 2. ตรวจสอบ package
npm pack --dry-run

# 3. Publish (public สำหรับ scoped package)
npm publish --access public

# 4. ตรวจสอบผลลัพธ์
npm view @thai/promptpay-qr
```

## 📚 เอกสารเพิ่มเติม

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Scoped Packages](https://docs.npmjs.com/about-scoped-packages)

