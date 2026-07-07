import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Student from '../../../../../models/Student';
import { generateStudentReport } from '../../../../../lib/pdfGenerator';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const student = await Student.findById(params.id);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    const pdfBytes = await generateStudentReport(student);
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=student_report_${student.rollNumber}.pdf`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}