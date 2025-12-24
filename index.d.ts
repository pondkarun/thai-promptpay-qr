/**
 * Parsed BOT Barcode data
 */
export interface ParsedBarcodeData {
  billerId: string;
  ref1: string;
  ref2: string;
  amount: number;
}

/**
 * Options for generating QR Code and Barcode
 */
export interface GenerateOptions {
  /** Path to save QR Code image file */
  qrOutputPath?: string;
  /** Path to save Barcode image file */
  barcodeOutputPath?: string;
  /** If true, returns blob/data URL instead of saving files */
  returnBlob?: boolean;
}

/**
 * Result from generateFromBarcode when returnBlob is true
 */
export interface GenerateBlobResult {
  /** QR Code as data URL (data:image/png;base64,...) */
  qrCode: string;
  /** Barcode as data URL (data:image/png;base64,...) */
  barcode: string;
  /** Parsed BOT Barcode data */
  parsedData: ParsedBarcodeData;
  /** EMVCo QR Code payload string */
  qrPayload: string;
  /** Standard BOT Barcode data string */
  barcodeData: string;
}

/**
 * Result from generateFromBarcode when saving files
 */
export interface GenerateFileResult {
  /** Path where QR Code was saved */
  qrCodePath?: string;
  /** Path where Barcode was saved */
  barcodePath?: string;
  /** Parsed BOT Barcode data */
  parsedData: ParsedBarcodeData;
  /** EMVCo QR Code payload string */
  qrPayload: string;
  /** Standard BOT Barcode data string */
  barcodeData: string;
}

/**
 * QR Code utility functions
 */
export interface QRCodeUtils {
  /** Save QR Code to file */
  saveQRCodeImage(qrPayload: string, filename: string): Promise<string>;
  /** Generate QR Code data URL (callback version) */
  generateQRCodeDataURL(qrPayload: string, callback: (err: Error | null, url: string) => void): void;
  /** Generate QR Code data URL (Promise version) */
  generateQRCodeBlob(qrPayload: string): Promise<string>;
}

/**
 * Barcode utility functions
 */
export interface BarcodeUtils {
  /** Save Barcode to file */
  saveBarcodeImage(barcodeData: string, filename: string): string;
  /** Generate Barcode data URL */
  generateBarcodeDataURL(barcodeData: string): Promise<string>;
  /** Generate Barcode data URL (alias) */
  generateBarcodeBlob(barcodeData: string): Promise<string>;
}

/**
 * Parse BOT Barcode input string to structured data
 * @param inputBarcode - BOT Barcode string (e.g., "|099400016301108 50A0230680100001 0000000105542003108 20000")
 * @returns Parsed BOT Barcode data
 */
export function parseBOTBarcode(inputBarcode: string): ParsedBarcodeData;

/**
 * Generate QR Code and Barcode from BOT Barcode input
 * @param inputBarcode - BOT Barcode string
 * @param options - Generation options
 * @returns Promise with result (blob or file paths)
 */
export function generateFromBarcode(
  inputBarcode: string,
  options?: GenerateOptions
): Promise<GenerateBlobResult | GenerateFileResult>;

/**
 * Generate QR Code as blob/data URL from BOT Barcode
 * @param inputBarcode - BOT Barcode string
 * @returns Promise with data URL (data:image/png;base64,...)
 */
export function generateQRCodeBlobFromBarcode(inputBarcode: string): Promise<string>;

/**
 * Generate Barcode as blob/data URL from BOT Barcode
 * @param inputBarcode - BOT Barcode string
 * @returns Promise with data URL (data:image/png;base64,...)
 */
export function generateBarcodeBlobFromBarcode(inputBarcode: string): Promise<string>;

/**
 * Save QR Code and Barcode to files
 * @param inputBarcode - BOT Barcode string
 * @param qrOutputPath - Path to save QR Code
 * @param barcodeOutputPath - Path to save Barcode
 * @returns Promise with file paths
 */
export function saveFromBarcode(
  inputBarcode: string,
  qrOutputPath: string,
  barcodeOutputPath: string
): Promise<GenerateFileResult>;

/**
 * QR Code utility functions
 */
export const qrcode: QRCodeUtils;

/**
 * Barcode utility functions
 */
export const barcode: BarcodeUtils;
