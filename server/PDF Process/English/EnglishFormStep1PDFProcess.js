import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate PDF for Form 1 - Standard Safe Diving Practices Statement
 * @param {Object} form1Data - Form 1 data including signatures and dates
 * @param {string} userName - Participant name
 * @param {string} sigDir - Directory containing signature images
 * @returns {PDFDocument} - PDFKit document instance
 */
export const generateForm1PDF = (doc, form1Data, userName, sigDir) => {
  // Helper to add signature image
  const addSignature = (doc, signaturePath, label, yPosition) => {
    if (signaturePath) {
      const fullPath = signaturePath.startsWith('data:') 
        ? null 
        : path.join(sigDir, signaturePath);
      
      if (fullPath && fs.existsSync(fullPath)) {
        doc.fontSize(10).text(label, 50, yPosition);
        try {
          doc.image(fullPath, 50, yPosition + 15, { width: 200, height: 60 });
        } catch (e) {
          doc.text('(Signature image error)', 50, yPosition + 15);
        }
      } else {
        doc.fontSize(10).text(`${label}: (No signature)`, 50, yPosition);
      }
    }
  };

  // FORM 1 - Standard Safe Diving Practices
  doc.fontSize(18).text('PADI e-Forms - Complete Submission', { align: 'center' });
  doc.fontSize(12).text(`Participant: ${userName}`, { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(16).text('Form 1: Standard Safe Diving Practices Statement', { underline: true });
  doc.moveDown();
  doc.fontSize(10).text('This form confirms understanding of safe diving practices.');
  doc.moveDown();
  
  if (form1Data.birthdate) {
    doc.text(`Birthdate: ${form1Data.birthdate}`);
    doc.moveDown(0.5);
  }
  
  let currentY = doc.y;
  addSignature(doc, form1Data.participant_signature, 'Participant Signature', currentY);
  currentY = doc.y + 80;
  
  if (form1Data.participant_signature_date) {
    doc.fontSize(10).text(`Date: ${form1Data.participant_signature_date}`, 50, currentY);
    currentY += 20;
  }
  
  if (form1Data.guardian_signature) {
    addSignature(doc, form1Data.guardian_signature, 'Guardian Signature', currentY);
    currentY = doc.y + 80;
    if (form1Data.guardian_signature_date) {
      doc.fontSize(10).text(`Date: ${form1Data.guardian_signature_date}`, 50, currentY);
    }
  }

  return doc;
};
