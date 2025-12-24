const { parseBarcode } = require('promptparse');
const { billPayment, botBarcode } = require('promptparse/generate');
const { saveQRCodeImage, generateQRCodeDataURL, generateQRCodeBlob } = require('./utils/qrcode');
const { saveBarcodeImage, generateBarcodeDataURL, generateBarcodeBlob } = require('./utils/barcode');

/**
 * แปลง BOT Barcode input เป็นข้อมูลที่ใช้ได้
 * @param {string} inputBarcode - BOT Barcode string (เช่น: "|099400016301108 50A0230680100001 0000000105542003108 20000")
 * @returns {Object} - Object ที่มี billerId, ref1, ref2, amount
 */
function parseBOTBarcode(inputBarcode) {
  // Format: |[billerId] [ref1] [ref2] [amount]
  const parts = inputBarcode.trim().split(' ');
  const billerId = parts[0].substring(1); // ลบ | ออก
  const ref1 = parts[1];
  const ref2 = parts[2];
  const amount = parseFloat(parts[3]) / 100; // แปลงจากสตางค์เป็นบาท

  return {
    billerId,
    ref1,
    ref2,
    amount
  };
}

/**
 * สร้าง QR Code และ Barcode จาก inputBarcode
 * @param {string} inputBarcode - BOT Barcode string
 * @param {Object} options - ตัวเลือกการสร้าง
 * @param {string} options.qrOutputPath - path สำหรับบันทึก QR Code (ถ้าไม่ระบุจะไม่บันทึกไฟล์)
 * @param {string} options.barcodeOutputPath - path สำหรับบันทึก Barcode (ถ้าไม่ระบุจะไม่บันทึกไฟล์)
 * @param {boolean} options.returnBlob - ถ้าเป็น true จะคืนค่าเป็น blob/data URL แทนการบันทึกไฟล์
 * @returns {Promise<Object>} - Object ที่มี qrCode และ barcode (เป็น blob/data URL ถ้า returnBlob = true)
 */
async function generateFromBarcode(inputBarcode, options = {}) {
  const { qrOutputPath, barcodeOutputPath, returnBlob = false } = options;

  // แปลง inputBarcode
  const { billerId, ref1, ref2, amount } = parseBOTBarcode(inputBarcode);

  // สร้าง BOT Barcode ที่ถูกต้องตามมาตรฐาน
  const standardBOTBarcode = botBarcode({
    billerId,
    ref1,
    ref2,
    amount
  });

  // สร้าง EMVCo QR Code payload
  const qrPayload = billPayment({
    billerId,
    ref1,
    ref2,
    amount
  });

  const result = {};

  // สร้าง QR Code
  if (returnBlob) {
    result.qrCode = await generateQRCodeBlob(qrPayload);
  } else if (qrOutputPath) {
    await saveQRCodeImage(qrPayload, qrOutputPath);
    result.qrCodePath = qrOutputPath;
  }

  // สร้าง Barcode
  if (returnBlob) {
    result.barcode = await generateBarcodeBlob(standardBOTBarcode);
  } else if (barcodeOutputPath) {
    await saveBarcodeImage(standardBOTBarcode, barcodeOutputPath);
    result.barcodePath = barcodeOutputPath;
  }

  return {
    ...result,
    parsedData: { billerId, ref1, ref2, amount },
    qrPayload,
    barcodeData: standardBOTBarcode
  };
}

/**
 * สร้าง QR Code เป็น blob/data URL
 * @param {string} inputBarcode - BOT Barcode string
 * @returns {Promise<string>} - Data URL (data:image/png;base64,...)
 */
async function generateQRCodeBlobFromBarcode(inputBarcode) {
  const { billerId, ref1, ref2, amount } = parseBOTBarcode(inputBarcode);
  const qrPayload = billPayment({ billerId, ref1, ref2, amount });
  return await generateQRCodeBlob(qrPayload);
}

/**
 * สร้าง Barcode เป็น blob/data URL
 * @param {string} inputBarcode - BOT Barcode string
 * @returns {Promise<string>} - Data URL (data:image/png;base64,...)
 */
async function generateBarcodeBlobFromBarcode(inputBarcode) {
  const { billerId, ref1, ref2, amount } = parseBOTBarcode(inputBarcode);
  const standardBOTBarcode = botBarcode({ billerId, ref1, ref2, amount });
  return await generateBarcodeBlob(standardBOTBarcode);
}

/**
 * บันทึก QR Code และ Barcode เป็นไฟล์
 * @param {string} inputBarcode - BOT Barcode string
 * @param {string} qrOutputPath - path สำหรับบันทึก QR Code
 * @param {string} barcodeOutputPath - path สำหรับบันทึก Barcode
 * @returns {Promise<Object>} - Object ที่มี qrCodePath และ barcodePath
 */
async function saveFromBarcode(inputBarcode, qrOutputPath, barcodeOutputPath) {
  return await generateFromBarcode(inputBarcode, {
    qrOutputPath,
    barcodeOutputPath,
    returnBlob: false
  });
}

module.exports = {
  generateFromBarcode,
  generateQRCodeBlobFromBarcode,
  generateBarcodeBlobFromBarcode,
  saveFromBarcode,
  parseBOTBarcode,
  // Export utils functions for advanced usage
  qrcode: require('./utils/qrcode'),
  barcode: require('./utils/barcode')
};

