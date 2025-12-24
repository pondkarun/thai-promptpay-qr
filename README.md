# thai-bot-barcode-generator

ไลบรารีสำหรับสร้าง QR Code และ Barcode จาก BOT Barcode input สำหรับระบบ PromptPay ของประเทศไทย รองรับทั้งการบันทึกเป็นไฟล์และส่งออกเป็น blob/data URL format

## 📋 ขอบเขต (Scope)

ไลบรารีนี้ถูกออกแบบมาเพื่อ:

- **แปลง BOT Barcode** จากรูปแบบดิบ (raw format) เป็น QR Code และ Barcode ที่ใช้งานได้
- **รองรับเฉพาะ BOT Barcode format** ตามมาตรฐานธนาคารแห่งประเทศไทย
- **สร้างภาพ QR Code และ Barcode** ในรูปแบบ PNG
- **รองรับการใช้งานในระบบ PromptPay** ของทุกธนาคารในประเทศไทย

### ⚠️ ข้อจำกัด (Limitations)

- **รองรับเฉพาะ BOT Barcode format** เท่านั้น (ไม่รองรับ QR Code format อื่นๆ)
- **รองรับเฉพาะ Bill Payment** (ไม่รองรับรูปแบบอื่นๆ เช่น Dynamic QR)
- **ต้องใช้ BOT Barcode input ที่ถูกต้อง** ตามรูปแบบ: `|[billerId] [ref1] [ref2] [amount]`
- **Barcode ต้องไม่เกิน 62 หลัก** (ไม่รวม Carriage Return) ตามมาตรฐาน BOT

## 🎯 ความสามารถ (Capabilities)

### ✅ สิ่งที่ทำได้

1. **แปลง BOT Barcode เป็น QR Code (EMVCo Standard)**
   - สร้าง QR Code ตามมาตรฐาน EMVCo
   - รองรับทุกธนาคารในประเทศไทย (KBank, SCB, BBL, KTB, TMB, และอื่นๆ)
   - Error Correction Level: M (Medium)
   - ขนาดภาพ: 500x500 pixels (ปรับแต่งได้)

2. **แปลง BOT Barcode เป็น Barcode (Code 128)**
   - สร้าง Barcode ตามมาตรฐาน BOT
   - ใช้ Code 128 format (auto-select A/B/C)
   - รองรับ Carriage Return (\r) ตามมาตรฐาน BOT
   - ขนาดภาพ: 1600x250 pixels
   - ความสูง: 120 pixels (มากกว่า 1 cm ตามมาตรฐาน)

3. **รองรับการส่งออกหลายรูปแบบ**
   - ✅ บันทึกเป็นไฟล์ PNG (เลือก path ได้)
   - ✅ ส่งออกเป็น blob/data URL (data:image/png;base64,...)
   - ✅ รองรับทั้ง Promise และ Callback

4. **รองรับ TypeScript**
   - มี TypeScript definitions ครบถ้วน
   - Type-safe API
   - รองรับทั้ง ES modules และ CommonJS

5. **รองรับทุกธนาคาร**
   - KBank (กสิกรไทย)
   - SCB (ไทยพาณิชย์)
   - BBL (กรุงเทพ)
   - KTB (กรุงไทย)
   - TMB (ทหารไทย)
   - และธนาคารอื่นๆ ที่รองรับ PromptPay

### 📊 ขนาดและประสิทธิภาพ

- **QR Code**: 500x500 pixels, PNG format, ~50-100 KB
- **Barcode**: 1600x250 pixels, PNG format, ~10-20 KB
- **Data URL**: Base64 encoded, พร้อมใช้งานใน HTML/Web
- **ความเร็ว**: สร้าง QR Code/Barcode ได้ในเวลา < 100ms

## 📦 การติดตั้ง

```bash
npm install thai-bot-barcode-generator
```

## 🚀 การใช้งาน

### JavaScript

```javascript
const {
  generateFromBarcode,
  generateQRCodeBlobFromBarcode,
  generateBarcodeBlobFromBarcode,
  saveFromBarcode
} = require('thai-bot-barcode-generator');

// BOT Barcode input
const inputBarcode = '|123456789012345 ABC123456789012 12345678901234567890 10000';
```

### TypeScript

```typescript
import {
  generateFromBarcode,
  generateQRCodeBlobFromBarcode,
  generateBarcodeBlobFromBarcode,
  saveFromBarcode,
  GenerateOptions
} from 'thai-bot-barcode-generator';

const inputBarcode = '|123456789012345 ABC123456789012 12345678901234567890 10000';
```

## 📖 ตัวอย่างการใช้งาน

### 1. สร้างเป็น blob/data URL

```javascript
// สร้างทั้ง QR Code และ Barcode เป็น blob
const result = await generateFromBarcode(inputBarcode, {
  returnBlob: true
});

console.log('QR Code:', result.qrCode); // data:image/png;base64,...
console.log('Barcode:', result.barcode); // data:image/png;base64,...
console.log('Parsed Data:', result.parsedData);
// {
//   billerId: '123456789012345',
//   ref1: 'ABC123456789012',
//   ref2: '12345678901234567890',
//   amount: 100
// }
```

### 2. บันทึกเป็นไฟล์ (เลือก path เอง)

```javascript
// บันทึก QR Code และ Barcode เป็นไฟล์
const result = await saveFromBarcode(
  inputBarcode,
  './output/qrcode.png',  // path สำหรับ QR Code
  './output/barcode.png'  // path สำหรับ Barcode
);

console.log('QR Code saved to:', result.qrCodePath);
console.log('Barcode saved to:', result.barcodePath);
```

### 3. สร้างเฉพาะ QR Code เป็น blob

```javascript
// สร้างเฉพาะ QR Code เป็น blob
const qrBlob = await generateQRCodeBlobFromBarcode(inputBarcode);
console.log('QR Code Data URL:', qrBlob);
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### 4. สร้างเฉพาะ Barcode เป็น blob

```javascript
// สร้างเฉพาะ Barcode เป็น blob
const barcodeBlob = await generateBarcodeBlobFromBarcode(inputBarcode);
console.log('Barcode Data URL:', barcodeBlob);
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### 5. ใช้ generateFromBarcode แบบผสม

```javascript
// สร้าง blob และบันทึกไฟล์พร้อมกัน
const blobResult = await generateFromBarcode(inputBarcode, {
  returnBlob: true
});

const fileResult = await saveFromBarcode(
  inputBarcode,
  './output/qrcode.png',
  './output/barcode.png'
);
```

## 📚 API Reference

### `parseBOTBarcode(inputBarcode: string): ParsedBarcodeData`

แปลง BOT Barcode input เป็นข้อมูลที่ใช้ได้

**Parameters:**
- `inputBarcode` - BOT Barcode string (เช่น: "|123456789012345 ABC123456789012 12345678901234567890 10000")

**Returns:**
```typescript
{
  billerId: string;
  ref1: string;
  ref2: string;
  amount: number;
}
```

### `generateFromBarcode(inputBarcode: string, options?: GenerateOptions): Promise<GenerateBlobResult | GenerateFileResult>`

สร้าง QR Code และ Barcode จาก inputBarcode

**Parameters:**
- `inputBarcode` - BOT Barcode string
- `options` - ตัวเลือกการสร้าง
  - `qrOutputPath?: string` - path สำหรับบันทึก QR Code
  - `barcodeOutputPath?: string` - path สำหรับบันทึก Barcode
  - `returnBlob?: boolean` - ถ้าเป็น true จะคืนค่าเป็น blob/data URL

**Returns:**
- ถ้า `returnBlob = true`: `{ qrCode: string, barcode: string, parsedData, qrPayload, barcodeData }`
- ถ้าบันทึกไฟล์: `{ qrCodePath?: string, barcodePath?: string, parsedData, qrPayload, barcodeData }`

### `generateQRCodeBlobFromBarcode(inputBarcode: string): Promise<string>`

สร้าง QR Code เป็น blob/data URL

**Returns:** Data URL string (data:image/png;base64,...)

### `generateBarcodeBlobFromBarcode(inputBarcode: string): Promise<string>`

สร้าง Barcode เป็น blob/data URL

**Returns:** Data URL string (data:image/png;base64,...)

### `saveFromBarcode(inputBarcode: string, qrOutputPath: string, barcodeOutputPath: string): Promise<GenerateFileResult>`

บันทึก QR Code และ Barcode เป็นไฟล์

**Returns:** Object ที่มี `qrCodePath` และ `barcodePath`

## 📝 BOT Barcode Format

BOT Barcode format: `|[billerId] [ref1] [ref2] [amount]`

- `billerId` - รหัสผู้รับเงิน (15 หลัก)
- `ref1` - Reference 1 (15 หลัก)
- `ref2` - Reference 2 (20 หลัก)
- `amount` - จำนวนเงิน (หน่วย: สตางค์)

**ตัวอย่าง:**
```
|123456789012345 ABC123456789012 12345678901234567890 10000
```

หมายเหตุ: จำนวนเงิน `10000` = 100.00 บาท (10000 สตางค์)

### ข้อกำหนด BOT Barcode

- **ความยาว**: ไม่เกิน 62 หลัก (ไม่รวม Carriage Return)
- **Format**: ต้องมี Carriage Return (\r) ระหว่างฟิลด์
- **Prefix**: ต้องขึ้นต้นด้วย `|`
- **Encoding**: Code 128 (auto-select A/B/C)

## 🔧 TypeScript Support

ไลบรารีนี้รองรับ TypeScript โดยมี type definitions ครบถ้วน

```typescript
import {
  generateFromBarcode,
  GenerateOptions,
  GenerateBlobResult,
  GenerateFileResult
} from 'thai-bot-barcode-generator';

const options: GenerateOptions = {
  returnBlob: true
};

const result: GenerateBlobResult = await generateFromBarcode(inputBarcode, options);
```

## 📦 Dependencies

- `canvas` - สำหรับสร้าง Barcode image
- `jsbarcode` - สำหรับสร้าง Code 128 Barcode
- `promptparse` - สำหรับสร้าง EMVCo QR Code payload
- `qrcode` - สำหรับสร้าง QR Code image

## 🌏 รองรับธนาคาร

ไลบรารีนี้รองรับทุกธนาคารในประเทศไทยที่รองรับ PromptPay:

- ✅ ธนาคารกสิกรไทย (KBank)
- ✅ ธนาคารไทยพาณิชย์ (SCB)
- ✅ ธนาคารกรุงเทพ (BBL)
- ✅ ธนาคารกรุงไทย (KTB)
- ✅ ธนาคารทหารไทยธนชาต (TMB)
- ✅ ธนาคารอื่นๆ ที่รองรับ PromptPay

## 📄 License

ISC

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
