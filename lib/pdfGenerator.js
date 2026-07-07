import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateStudentReport(student) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  
  // Header
  page.drawText('STUDENT ACADEMIC REPORT', {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.43, 0.16, 0.85)
  });
  
  page.drawLine({
    start: { x: 50, y: height - 60 },
    end: { x: width - 50, y: height - 60 },
    thickness: 2,
    color: rgb(0.43, 0.16, 0.85)
  });
  
  // Student Information
  const infoY = height - 100;
  page.drawText('Student Information', {
    x: 50,
    y: infoY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Name: ${student.name}`, {
    x: 50,
    y: infoY - 30,
    size: 12,
    font: font,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Roll Number: ${student.rollNumber}`, {
    x: 50,
    y: infoY - 50,
    size: 12,
    font: font,
    color: rgb(0, 0, 0)
  });
  
  // Subject Marks
  const marksY = infoY - 90;
  page.drawText('Subject-wise Marks', {
    x: 50,
    y: marksY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  
  const subjects = [
    ['Math', student.math],
    ['Science', student.science],
    ['English', student.english],
    ['Hindi', student.hindi],
    ['Social Studies', student.socialStudies]
  ];
  
  let currentY = marksY - 30;
  subjects.forEach(([subject, score]) => {
    page.drawText(`${subject}:`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(`${score}`, {
      x: 200,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0)
    });
    
    currentY -= 25;
  });
  
  // Performance Summary
  const summaryY = currentY - 30;
  page.drawText('Performance Summary', {
    x: 50,
    y: summaryY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  
  const summaryData = [
    ['Total Marks:', `${student.total}/500`],
    ['Percentage:', `${student.percentage}%`],
    ['Grade:', student.grade],
    ['Status:', student.status]
  ];
  
  let summaryCurrentY = summaryY - 30;
  summaryData.forEach(([label, value]) => {
    page.drawText(label, {
      x: 50,
      y: summaryCurrentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(value, {
      x: 200,
      y: summaryCurrentY,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    summaryCurrentY -= 25;
  });
  
  // Footer
  page.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  return await pdfDoc.save();
}