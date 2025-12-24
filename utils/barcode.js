const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับสร้าง Code 128 Barcode ตามมาตรฐาน BOT
// รองรับทุกธนาคาร (KBank, SCB, และอื่นๆ)
// BOT Barcode format: |[billerId]\r[ref1]\r[ref2]\r[amount]
// สำคัญ: ต้องใช้ Carriage Return (\r) ระหว่างฟิลด์ตามมาตรฐาน BOT
function saveBarcodeImage(barcodeData, filename) {
  try {
    // ตรวจสอบและเตรียมข้อมูล barcode
    // BOT Barcode format: |[billerId]\r[ref1]\r[ref2]\r[amount]
    // ข้อมูลจาก botBarcode() function จะมี Carriage Return (\r) อยู่แล้ว
    let cleanBarcodeData = barcodeData;
    
    // ตรวจสอบว่ามีอักขระ | หรือไม่
    if (!cleanBarcodeData.startsWith('|')) {
      console.warn('⚠️  Warning: Barcode data should start with | character');
      console.warn('   Adding | prefix...');
      cleanBarcodeData = '|' + cleanBarcodeData;
    }
    
    // ตรวจสอบว่ามี Carriage Return หรือไม่ (มาตรฐาน BOT)
    if (!cleanBarcodeData.includes('\r')) {
      console.warn('⚠️  Warning: Barcode data should contain Carriage Return (\\r) characters');
      console.warn('   This may cause issues with some banks (e.g., SCB)');
    }
    
    // ตรวจสอบความยาว (BOT กำหนดไม่เกิน 62 หลัก)
    // หมายเหตุ: ความยาวนี้อาจรวม CR characters ด้วย
    const dataLength = cleanBarcodeData.replace(/\r/g, '').length;
    if (dataLength > 62) {
      console.warn('⚠️  Warning: Barcode data (excluding CR) exceeds 62 characters (BOT standard)');
      console.warn('   Current length (excluding CR):', dataLength, 'characters');
    }
    
    // สร้าง canvas สำหรับ barcode
    // ความสูงอย่างน้อย 1 cm (ประมาณ 38 pixels ที่ 96 DPI)
    // ใช้ขนาดที่เหมาะสมสำหรับการสแกน
    const canvas = createCanvas(1600, 250);
    
    // สร้าง Code 128 barcode ตามมาตรฐาน BOT
    // ใช้ CODE128 (auto-select) เพื่อรองรับ Carriage Return และตัวอักษร/ตัวเลข
    // CODE128 จะเลือก CODE128A/B/C อัตโนมัติตามข้อมูลที่เหมาะสม
    JsBarcode(canvas, cleanBarcodeData, {
      format: 'CODE128',  // ใช้ CODE128 auto-select เพื่อรองรับ CR และทุกธนาคาร
      width: 2,            // ปรับ width ให้เหมาะสม (ไม่หนาเกินไป)
      height: 120,         // ความสูงประมาณ 3.2 cm ที่ 96 DPI (มากกว่า 1 cm ตามมาตรฐาน)
      displayValue: true,
      fontSize: 20,
      margin: 10,          // margin ที่เหมาะสม
      background: '#FFFFFF',
      lineColor: '#000000',
      textAlign: 'center',
      textPosition: 'bottom',
      textMargin: 3
    });
    
    // บันทึกเป็นไฟล์ PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    
    const filePath = path.resolve(filename);
    console.log('✅ Barcode (Code 128) image saved:', filePath);
    console.log('Barcode data (with CR):', JSON.stringify(cleanBarcodeData));
    console.log('Barcode length (with CR):', cleanBarcodeData.length, 'characters');
    console.log('Barcode length (excluding CR):', cleanBarcodeData.replace(/\r/g, '').length, 'characters');
    console.log('   (BOT standard: max 62 characters excluding CR)');
  } catch (err) {
    console.error('❌ Error saving barcode image:', err);
    throw err;
  }
}

module.exports = {
  saveBarcodeImage
};

