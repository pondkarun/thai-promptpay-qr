const QRCode = require('qrcode');
const path = require('path');

const defaultOptions = {
  errorCorrectionLevel: 'M',
  type: 'png',
  quality: 0.92,
  margin: 1,
  width: 500,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

/**
 * บันทึก QR Code เป็นไฟล์รูปภาพ
 * @param {string} qrPayload - QR Code payload string
 * @param {string} filename - path สำหรับบันทึกไฟล์
 * @returns {Promise<string>} - file path ที่บันทึก
 */
function saveQRCodeImage(qrPayload, filename) {
  return new Promise((resolve, reject) => {
    QRCode.toFile(filename, qrPayload, defaultOptions, function (err) {
      if (err) {
        console.error('❌ Error saving QR code image:', err);
        reject(err);
        return;
      }
      const filePath = path.resolve(filename);
      console.log('✅ QR Code image saved:', filePath);
      resolve(filePath);
    });
  });
}

/**
 * สร้าง QR Code และคืนค่า Data URL (callback version)
 * @param {string} qrPayload - QR Code payload string
 * @param {Function} callback - callback function (err, dataURL)
 */
function generateQRCodeDataURL(qrPayload, callback) {
  QRCode.toDataURL(qrPayload, defaultOptions, callback);
}

/**
 * สร้าง QR Code และคืนค่า Data URL (Promise version)
 * @param {string} qrPayload - QR Code payload string
 * @returns {Promise<string>} - Data URL (data:image/png;base64,...)
 */
function generateQRCodeBlob(qrPayload) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(qrPayload, defaultOptions, (err, url) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(url);
    });
  });
}

module.exports = {
  saveQRCodeImage,
  generateQRCodeDataURL,
  generateQRCodeBlob
};

