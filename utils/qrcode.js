const QRCode = require('qrcode');
const path = require('path');

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

// ฟังก์ชันสำหรับสร้าง QR Code และคืนค่า Data URL
function generateQRCodeDataURL(qrPayload, callback) {
  QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }, callback);
}

module.exports = {
  saveQRCodeImage,
  generateQRCodeDataURL
};

