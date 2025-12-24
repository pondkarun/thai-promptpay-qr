const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const fs = require('fs');
const path = require('path');

const defaultBarcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 120,
  displayValue: true,
  fontSize: 20,
  margin: 10,
  background: '#FFFFFF',
  lineColor: '#000000',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 3
};

/**
 * เตรียมและตรวจสอบข้อมูล barcode
 * @param {string} barcodeData - Barcode data string
 * @returns {string} - Cleaned barcode data
 */
function prepareBarcodeData(barcodeData) {
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
  const dataLength = cleanBarcodeData.replace(/\r/g, '').length;
  if (dataLength > 62) {
    console.warn('⚠️  Warning: Barcode data (excluding CR) exceeds 62 characters (BOT standard)');
    console.warn('   Current length (excluding CR):', dataLength, 'characters');
  }
  
  return cleanBarcodeData;
}

/**
 * สร้าง canvas และ barcode
 * @param {string} barcodeData - Barcode data string
 * @returns {Canvas} - Canvas object with barcode
 */
function createBarcodeCanvas(barcodeData) {
  const cleanBarcodeData = prepareBarcodeData(barcodeData);
  const canvas = createCanvas(1600, 250);
  
  JsBarcode(canvas, cleanBarcodeData, defaultBarcodeOptions);
  
  return { canvas, cleanBarcodeData };
}

/**
 * บันทึก Barcode เป็นไฟล์รูปภาพ
 * @param {string} barcodeData - Barcode data string
 * @param {string} filename - path สำหรับบันทึกไฟล์
 * @returns {string} - file path ที่บันทึก
 */
function saveBarcodeImage(barcodeData, filename) {
  try {
    const { canvas, cleanBarcodeData } = createBarcodeCanvas(barcodeData);
    
    // บันทึกเป็นไฟล์ PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    
    const filePath = path.resolve(filename);
    console.log('✅ Barcode (Code 128) image saved:', filePath);
    console.log('Barcode data (with CR):', JSON.stringify(cleanBarcodeData));
    console.log('Barcode length (with CR):', cleanBarcodeData.length, 'characters');
    console.log('Barcode length (excluding CR):', cleanBarcodeData.replace(/\r/g, '').length, 'characters');
    console.log('   (BOT standard: max 62 characters excluding CR)');
    
    return filePath;
  } catch (err) {
    console.error('❌ Error saving barcode image:', err);
    throw err;
  }
}

/**
 * สร้าง Barcode และคืนค่า Data URL
 * @param {string} barcodeData - Barcode data string
 * @returns {Promise<string>} - Data URL (data:image/png;base64,...)
 */
function generateBarcodeDataURL(barcodeData) {
  return new Promise((resolve, reject) => {
    try {
      const { canvas } = createBarcodeCanvas(barcodeData);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * สร้าง Barcode และคืนค่า Data URL (alias for generateBarcodeDataURL)
 * @param {string} barcodeData - Barcode data string
 * @returns {Promise<string>} - Data URL (data:image/png;base64,...)
 */
function generateBarcodeBlob(barcodeData) {
  return generateBarcodeDataURL(barcodeData);
}

module.exports = {
  saveBarcodeImage,
  generateBarcodeDataURL,
  generateBarcodeBlob
};

