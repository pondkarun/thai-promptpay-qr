const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { parseBarcode } = require('promptparse');
const { billPayment } = require('promptparse/generate');

// ข้อมูล BOT Barcode (PromptPay Bill Payment)
const botBarcode = '|099400016301108 50A0230680100001 0000000105542003108 20000';

console.log('='.repeat(60));
console.log('PromptPay QR Code Generator');
console.log('='.repeat(60));
console.log('Original BOT Barcode:', botBarcode);
console.log('');

// ฟังก์ชันสำหรับบันทึก QR Code เป็นไฟล์รูปภาพ
function saveQRCodeImage(qrPayload, filename) {
  QRCode.toFile(filename, qrPayload, {
    errorCorrectionLevel: 'M',
    type: 'png',
    quality: 0.92,
    margin: 1,
    width: 500,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }, function (err) {
    if (err) {
      console.error('❌ Error saving QR code image:', err);
      return;
    }
    const filePath = path.resolve(filename);
    console.log('✅ QR Code image saved:', filePath);
  });
}

// วิธีที่ 1: แปลง BOT Barcode เป็น EMVCo QR Code
const parsedBarcode = parseBarcode(botBarcode);

if (parsedBarcode) {
  // แปลง BOT Barcode เป็น QR Tag 30 (Bill Payment)
  const qrPayload = parsedBarcode.toQrTag30();
  
  console.log('📋 Method: Convert BOT Barcode to EMVCo QR');
  console.log('EMVCo QR Payload:', qrPayload);
  console.log('Payload length:', qrPayload.length, 'characters');
  console.log('');
  
  // สร้าง QR Code image (Data URL)
  QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }, function (err, url) {
    if (err) {
      console.error('❌ Error generating QR code:', err);
      return;
    }
    console.log('✅ QR Code generated successfully!');
    console.log('Data URL length:', url.length, 'characters');
    console.log('');
    
    // บันทึกเป็นไฟล์รูปภาพ
    saveQRCodeImage(qrPayload, 'qrcode.png');
  });
} else {
  // วิธีที่ 2: สร้าง EMVCo QR Code ใหม่จากข้อมูล
  // แยกข้อมูลจาก BOT Barcode: |099400016301108 50A0230680100001 0000000105542003108 20000
  // Format: |[billerId] [ref1] [ref2] [amount]
  const parts = botBarcode.split(' ');
  const billerId = parts[0].substring(1); // ลบ | ออก
  const ref1 = parts[1];
  const ref2 = parts[2];
  const amount = parseFloat(parts[3]) / 100; // แปลงจากสตางค์เป็นบาท
  
  console.log('📋 Method: Generate EMVCo QR from parsed data');
  console.log('Parsed data:');
  console.log('  - Biller ID:', billerId);
  console.log('  - Reference 1:', ref1);
  console.log('  - Reference 2:', ref2);
  console.log('  - Amount:', amount, 'THB');
  console.log('');
  
  // สร้าง EMVCo QR Code ใหม่
  const qrPayload = billPayment({
    billerId: billerId,
    ref1: ref1,
    ref2: ref2,
    amount: amount
  });
  
  console.log('EMVCo QR Payload:', qrPayload);
  console.log('Payload length:', qrPayload.length, 'characters');
  console.log('');
  
  // สร้าง QR Code image (Data URL)
  QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }, function (err, url) {
    if (err) {
      console.error('❌ Error generating QR code:', err);
      return;
    }
    console.log('✅ QR Code generated successfully!');
    console.log('Data URL length:', url.length, 'characters');
    console.log('');
    
    // บันทึกเป็นไฟล์รูปภาพ
    saveQRCodeImage(qrPayload, 'qrcode.png');
  });
}