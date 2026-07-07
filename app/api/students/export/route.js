import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Student from '../../../../models/Student';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find().sort({ createdAt: -1 });
    
    const data = students.map(student => ({
      Name: student.name,
      'Roll Number': student.rollNumber,
      Math: student.math,
      Science: student.science,
      English: student.english,
      Hindi: student.hindi,
      'Social Studies': student.socialStudies,
      Total: student.total,
      Percentage: student.percentage,
      Grade: student.grade,
      Status: student.status
    }));
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=students.xlsx'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export students' }, { status: 500 });
  }
}