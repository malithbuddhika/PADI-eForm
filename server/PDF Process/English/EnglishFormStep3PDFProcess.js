import fs from 'fs';
import path from 'path';

/**
 * Generate PDF for Form 3 - Diver Medical Participant Questionnaire
 * @param {Object} doc - PDFKit document instance
 * @param {Object} form3Data - Form 3 data including medical questions and signatures
 * @param {string} userName - Participant name
 * @param {string} sigDir - Directory containing signature images
 * @returns {PDFDocument} - PDFKit document instance
 */
export const generateForm3PDF = (doc, form3Data, userName, sigDir) => {
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

  // PAGE 3 - FORM 3 - Medical Questionnaire
  doc.addPage();
  doc.fontSize(16).text('Form 3: Diver Medical Participant Questionnaire', { underline: true });
  doc.moveDown();
  doc.fontSize(10).text('Medical questionnaire responses and signatures.');
  doc.moveDown();
  
  if (form3Data.formData) {
    doc.fontSize(10).text('Main Questions:');
    for (let i = 1; i <= 10; i++) {
      const answer = form3Data.formData[`q${i}`];
      if (answer) {
        doc.text(`Q${i}: ${answer.toUpperCase()}`);
      }
    }
    doc.moveDown();
    
    // Show box answers if any "yes" responses
    const boxes = ['boxA', 'boxB', 'boxC', 'boxD', 'boxE', 'boxF', 'boxG'];
    boxes.forEach(box => {
      const boxData = form3Data.formData[box];
      if (boxData && Object.values(boxData).some(v => v === 'yes')) {
        doc.text(`${box.toUpperCase()} responses included`);
      }
    });
    doc.moveDown();
  }
  
  let currentY = doc.y;
  addSignature(doc, form3Data.participant_signature, 'Participant Signature', currentY);
  currentY = doc.y + 80;
  
  if (form3Data.participant_signature_date) {
    doc.fontSize(10).text(`Date: ${form3Data.participant_signature_date}`, 50, currentY);
    currentY += 20;
  }
  
  if (form3Data.guardian_signature) {
    addSignature(doc, form3Data.guardian_signature, 'Guardian Signature', currentY);
    currentY = doc.y + 80;
    if (form3Data.guardian_signature_date) {
      doc.fontSize(10).text(`Date: ${form3Data.guardian_signature_date}`, 50, currentY);
    }
  }

  return doc;
};
