const { parseBarcode } = require('promptparse');
const { billPayment, botBarcode } = require('promptparse/generate');
const { saveQRCodeImage, generateQRCodeDataURL } = require('./utils/qrcode');
const { saveBarcodeImage } = require('./utils/barcode');

// ข้อมูล BOT Barcode (PromptPay Bill Payment) - รูปแบบดิบ (มีช่องว่าง)
const inputBarcode = '|099400016301108 50A0230680100001 0000000105542003108 20000';

console.log('='.repeat(60));
console.log('PromptPay QR Code Generator');
console.log('='.repeat(60));
console.log('Original BOT Barcode (input):', inputBarcode);
console.log('');

// ฟังก์ชันสำหรับสร้าง QR Code และ Barcode
function generateCodes(qrPayload, barcodeData) {
  // สร้าง QR Code image (Data URL)
  generateQRCodeDataURL(qrPayload, function (err, url) {
    if (err) {
      console.error('❌ Error generating QR code:', err);
      return;
    }
    console.log('✅ QR Code generated successfully!');
    console.log('Data URL length:', url.length, 'characters');
    console.log('');
    
    // บันทึกเป็นไฟล์รูปภาพ
    saveQRCodeImage(qrPayload, 'qrcode.png');
    
    // สร้าง Code 128 Barcode จาก BOT Barcode ที่ถูกต้องตามมาตรฐาน
    // ใช้ botBarcode function เพื่อสร้าง Barcode ที่มี Carriage Return ตามมาตรฐาน BOT
    console.log('📊 Generating Code 128 Barcode (BOT Standard)...');
    saveBarcodeImage(barcodeData, 'barcode.png');
  });
}

// แยกข้อมูลจาก BOT Barcode: |099400016301108 50A0230680100001 0000000105542003108 20000
// Format: |[billerId] [ref1] [ref2] [amount]
const parts = inputBarcode.split(' ');
const billerId = parts[0].substring(1); // ลบ | ออก
const ref1 = parts[1];
const ref2 = parts[2];
const amount = parseFloat(parts[3]) / 100; // แปลงจากสตางค์เป็นบาท

console.log('📋 Parsed BOT Barcode data:');
console.log('  - Biller ID:', billerId);
console.log('  - Reference 1:', ref1);
console.log('  - Reference 2:', ref2);
console.log('  - Amount:', amount, 'THB');
console.log('');

// สร้าง BOT Barcode ที่ถูกต้องตามมาตรฐาน (ใช้ Carriage Return แทนช่องว่าง)
// สำคัญ: ต้องใช้ botBarcode function เพื่อสร้าง Barcode ที่มี CR ตามมาตรฐาน BOT
const standardBOTBarcode = botBarcode({
  billerId: billerId,
  ref1: ref1,
  ref2: ref2,
  amount: amount
});

console.log('📊 Standard BOT Barcode (with CR):');
console.log('  Raw:', JSON.stringify(standardBOTBarcode));
console.log('  Length:', standardBOTBarcode.length, 'characters');
console.log('');

// สร้าง EMVCo QR Code
const qrPayload = billPayment({
  billerId: billerId,
  ref1: ref1,
  ref2: ref2,
  amount: amount
});

console.log('📋 EMVCo QR Payload:', qrPayload);
console.log('Payload length:', qrPayload.length, 'characters');
console.log('');

generateCodes(qrPayload, standardBOTBarcode);
