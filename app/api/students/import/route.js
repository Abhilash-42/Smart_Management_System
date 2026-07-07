import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Student from '../../../../models/Student';
import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    await connectDB();
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const row of data) {
      try {
        // Check for duplicate roll number
        const existing = await Student.findOne({ rollNumber: row['Roll Number'] });
        if (existing) {
          errorCount++;
          errors.push(`Duplicate roll number: ${row['Roll Number']}`);
          continue;
        }
        
        const student = new Student({
          name: row.Name,
          rollNumber: row['Roll Number'],
          math: row.Math,
          science: row.Science,
          english: row.English,
          hindi: row.Hindi,
          socialStudies: row['Social Studies']
        });
        
        await student.save();
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Error importing ${row.Name}: ${error.message}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      successCount,
      errorCount,
      errors
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to import students' }, { status: 500 });
  }
}