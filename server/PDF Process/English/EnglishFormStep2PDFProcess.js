import fs from 'fs';
import path from 'path';

/**
 * Generate PDF for Form 2 - Non-Agency Disclosure and Acknowledgment Agreement
 * @param {Object} doc - PDFKit document instance
 * @param {Object} form2Data - Form 2 data including signatures and dates
 * @param {string} userName - Participant name
 * @param {string} sigDir - Directory containing signature images
 * @returns {PDFDocument} - PDFKit document instance
 */
export const generateForm2PDF = (doc, form2Data, userName, sigDir) => {
  // PAGE 2 - FORM 2 - Non-Agency Disclosure and Acknowledgment Agreement
  doc.addPage();
  const margin = 50;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  let y = 50;
  
  // PADI Logo on left (approximately 70x70 size)
  const logoPath = path.join(path.dirname(sigDir), '..', 'src', 'assets', 'padi-logo.svg');
  // For now, we'll draw a circle placeholder for PADI logo (you can replace with actual logo image)
  doc.save();
  doc.circle(margin + 30, y + 30, 30).lineWidth(2).stroke();
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
     .text('PADI', margin + 12, y + 25, { width: 40, align: 'center' });
  doc.restore();
  
  // Header with angled black background (parallelogram shape)
  const headerY = y + 10;
  const headerHeight = 28;
  const angleOffset = 8; // Creates the slant on right side
  
  doc.save();
  doc.fillColor('#000000');
  // Draw parallelogram: left side straight, right side angled
  doc.polygon(
    [margin + 90, headerY], // top left
    [pageWidth - margin + angleOffset, headerY], // top right (extended)
    [pageWidth - margin, headerY + headerHeight], // bottom right
    [margin + 90, headerY + headerHeight] // bottom left
  ).fill();
  doc.restore();
  
  // Header text in white
  doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold')
     .text('Non-Agency Disclosure and Acknowledgment Agreement', margin + 100, headerY + 8, {
       width: pageWidth - margin - 110,
       align: 'left'
     });
  
  y = headerY + headerHeight + 8;
  
  // Red warning text (italicized)
  doc.fillColor('#CC0000').fontSize(7.5).font('Helvetica-Oblique')
     .text('In European Union and European Free Trade Association countries use alternative form.', margin, y);
  y += 10;
  
  // Bold instruction
  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold')
     .text('Please read carefully and fill in all blanks before signing.', margin, y);
  y += 14;
  
  // Main paragraph with filled-in information
  doc.fontSize(7.5).font('Helvetica');
  const diveCenterName = form2Data.dive_center_name || '_______________';
  const instructorNames = form2Data.instructor_names || '_______________';
  
  const paragraph1 = `I understand and agree that PADI Members ("Members"), including ${diveCenterName} and/or ${instructorNames} and/or any individual PADI Instructors associated with the program in which I am participating, are licensed to use various PADI Trademarks and to conduct PADI training, but are not agents, employees or franchises of PADI Americas, Inc., or its affiliate and subsidiary corporations ("PADI"). I further understand that Member business activities are independent, and are neither owned nor operated by PADI, and that while PADI establishes the standards for PADI diver training programs, it is not responsible for, nor does it have the right to control, the operation of the Members' business activities and the day-to-day conduct of PADI programs and supervision of divers by the Members or their associated staff. I further understand and agree on behalf of myself, my heirs and my estate that in the event of an injury or death during this activity, neither I nor my estate shall seek to hold PADI liable for the actions, inactions or negligence of ${diveCenterName} and/or the instructors and staff associated with the activity.`;
  
  doc.text(paragraph1, margin, y, { width: pageWidth - 2 * margin, align: 'justify', lineGap: 1.5 });
  y = doc.y + 12;
  
  // Liability Release header with angled black background (parallelogram)
  const header2Y = y;
  const header2Height = 24;
  const angleOffset2 = 6;
  
  doc.save();
  doc.fillColor('#000000');
  // Draw parallelogram: left side straight, right side angled
  doc.polygon(
    [margin, header2Y], // top left
    [pageWidth - margin + angleOffset2, header2Y], // top right (extended)
    [pageWidth - margin, header2Y + header2Height], // bottom right
    [margin, header2Y + header2Height] // bottom left
  ).fill();
  doc.restore();
  
  // Header text in white
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold')
     .text('Liability Release and Assumption of Risk Agreement', margin + 10, header2Y + 6);
  
  y = header2Y + header2Height + 8;
  
  // Red warning text (italicized)
  doc.fillColor('#CC0000').fontSize(7.5).font('Helvetica-Oblique')
     .text('In European Union and European Free Trade Association countries use alternative form.', margin, y);
  y += 10;
  
  // Bold instruction
  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold')
     .text('Please read carefully and fill in all blanks before signing.', margin, y);
  y += 14;
  
  // Main content paragraphs - Column layout like the original
  doc.fontSize(6.8).font('Helvetica');
  
  // Left column text
  const leftColumnText = `I hereby affirm that I am aware that skin and scuba diving have inherent risks which may result in serious injury or death.

I understand that diving with compressed air involves certain inherent risks, including but not limited to decompression sickness, embolism or other hyperbaric/air expansion injury that require treatment in a recompression chamber. I further understand that the open water diving trips which are necessary for training and for certification may be conducted at a site that is remote, either by time or distance or both, from such a recompression chamber. I still choose to proceed with such instructional dives in spite of the possible absence of a recompression chamber in proximity to the dive site.

I understand and agree that neither my instructor(s), ${diveCenterName} nor PADI Americas, Inc., nor its affiliate and subsidiary corporations, nor any of their respective employees, officers, agents, contractors or assigns (hereinafter referred to as "Released Parties") may be held liable or responsible in any way for any injury, death or other damages to me or my family, heirs, or assigns that may occur as a result of my participation in this diving program or as a result of the negligence of any party, including the Released Parties, whether passive or active.

In consideration of being allowed to participate in this course (and optional Adventure Dive), hereinafter referred to as "program," I hereby personally assume all risks of this program, whether foreseen or unforeseen, that may befall me while I am a participant in this program including, but not limited to, the academic or confined water and/or open water activities.`;
  
  // Right column text
  const rightColumnText = `I hereby understand that skin diving and scuba diving are physically strenuous activities and that I will be exerting myself during this program, and that if I am injured as a result of heart attack, panic, hyperventilation, drowning or any other cause, that I expressly assume the risk of said injuries and that I will not hold the Released Parties responsible for the same.

I further state that I am of lawful age and legally competent to sign this liability release, or that I have acquired the written consent of my parent or guardian as evidenced by their signatures below. I understand that the terms herein are contractual and not a mere recital, and that I have signed this Agreement of my own free act and with the knowledge that I hereby agree to waive my legal rights. I further agree that if any provision of this Agreement is found to be unenforceable or invalid, that provision shall be severed from this Agreement. The remainder of this Agreement will then be construed as though the unenforceable provision had never been contained herein.

I understand and agree that I am not only giving up my right to sue the Released Parties but also any rights my heirs, assigns, or beneficiaries may have to sue the Released Parties resulting from my death. I further represent I have the authority to do so and that my heirs, assigns, or beneficiaries will be estopped from claiming otherwise because of my representations to the Released Parties.`;
  
  const columnWidth = (pageWidth - 2 * margin - 15) / 2;
  const startY = y;
  
  // Left column
  doc.text(leftColumnText, margin, startY, { 
    width: columnWidth, 
    align: 'justify', 
    lineGap: 1.2 
  });
  
  const leftColumnHeight = doc.y - startY;
  
  // Right column
  doc.text(rightColumnText, margin + columnWidth + 15, startY, { 
    width: columnWidth, 
    align: 'justify', 
    lineGap: 1.2 
  });
  
  const rightColumnHeight = doc.y - startY;
  
  y = startY + Math.max(leftColumnHeight, rightColumnHeight) + 8;
  
  // Exemption clause in caps (bold box)
  doc.fontSize(6.5).font('Helvetica-Bold');
  const exemptionText = `BY THIS INSTRUMENT AGREE TO EXEMPT AND RELEASE MY INSTRUCTORS, ${diveCenterName ? diveCenterName.toUpperCase() : '_______________'}, PADI AMERICAS, INC., AND ALL RELATED ENTITIES AS DEFINED ABOVE, FROM ALL LIABILITY OR RESPONSIBILITY WHATSOEVER FOR PERSONAL INJURY, PROPERTY DAMAGE OR WRONGFUL DEATH HOWEVER CAUSED, INCLUDING BUT NOT LIMITED TO, THE NEGLIGENCE OF THE RELEASED PARTIES, WHETHER PASSIVE OR ACTIVE.`;
  
  doc.text(exemptionText, margin, y, { width: pageWidth - 2 * margin, align: 'justify', lineGap: 1.2 });
  y = doc.y + 10;
  
  // Declaration in caps
  doc.fontSize(7).font('Helvetica-Bold');
  const declaration = `I HAVE FULLY INFORMED MYSELF AND MY HEIRS OF THE CONTENTS OF THIS NON-AGENCY DISCLOSURE AND ACKNOWLEDGMENT AGREEMENT AND LIABILITY RELEASE AND ASSUMPTION OF RISK AGREEMENT BY READING BOTH BEFORE SIGNING BELOW ON BEHALF OF MYSELF AND MY HEIRS.`;
  
  doc.text(declaration, margin, y, { width: pageWidth - 2 * margin, align: 'left', lineGap: 1.5 });
  y = doc.y + 14;
  
  // Signature section with box outline
  doc.save();
  doc.rect(margin, y, pageWidth - 2 * margin, 80).stroke();
  doc.restore();
  
  doc.fontSize(7.5).font('Helvetica').fillColor('#000000');
  let currentY = y + 5;
  
  // Participant signature
  doc.text('Participant\'s Signature', margin + 5, currentY);
  doc.text('Date (Day / Month / Year)', pageWidth - margin - 130, currentY);
  
  // Signature line
  currentY += 15;
  doc.moveTo(margin + 5, currentY + 25).lineTo(pageWidth - margin - 140, currentY + 25).stroke();
  
  if (form2Data.participant_signature) {
    const fullPath = form2Data.participant_signature.startsWith('data:') 
      ? null 
      : path.join(sigDir, form2Data.participant_signature);
    
    if (fullPath && fs.existsSync(fullPath)) {
      try {
        doc.image(fullPath, margin + 10, currentY, { width: 120, height: 30, fit: [120, 30] });
      } catch (e) {
        doc.fontSize(7).text('(Signature)', margin + 10, currentY + 10);
      }
    }
  }
  
  // Date line
  doc.moveTo(pageWidth - margin - 130, currentY + 25).lineTo(pageWidth - margin - 5, currentY + 25).stroke();
  if (form2Data.participant_signature_date) {
    doc.fontSize(7).text(form2Data.participant_signature_date, pageWidth - margin - 125, currentY + 10);
  }
  
  currentY += 35;
  
  // Guardian signature section (if exists)
  if (form2Data.guardian_signature) {
    // Draw separator line
    doc.moveTo(margin, currentY).lineTo(pageWidth - margin, currentY).stroke();
    currentY += 5;
    
    doc.fontSize(7.5).font('Helvetica');
    doc.text('Signature of Parent or Guardian (where applicable)', margin + 5, currentY);
    doc.text('Date (Day / Month / Year)', pageWidth - margin - 130, currentY);
    
    currentY += 15;
    doc.moveTo(margin + 5, currentY + 25).lineTo(pageWidth - margin - 140, currentY + 25).stroke();
    
    const fullPath = form2Data.guardian_signature.startsWith('data:') 
      ? null 
      : path.join(sigDir, form2Data.guardian_signature);
    
    if (fullPath && fs.existsSync(fullPath)) {
      try {
        doc.image(fullPath, margin + 10, currentY, { width: 120, height: 30, fit: [120, 30] });
      } catch (e) {
        doc.fontSize(7).text('(Signature)', margin + 10, currentY + 10);
      }
    }
    
    doc.moveTo(pageWidth - margin - 130, currentY + 25).lineTo(pageWidth - margin - 5, currentY + 25).stroke();
    if (form2Data.guardian_signature_date) {
      doc.fontSize(7).text(form2Data.guardian_signature_date, pageWidth - margin - 125, currentY + 10);
    }
  }
  
  // Footer at bottom of page
  doc.fontSize(6.5).font('Helvetica').fillColor('#000000');
  doc.text('Product No. 10072  (Rev. 10/16)  Version 4.03', margin, pageHeight - 30, { align: 'left' });
  doc.text('© PADI 2016', pageWidth - margin - 80, pageHeight - 30, { align: 'right' });

  return doc;
};
