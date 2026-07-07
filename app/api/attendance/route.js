import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Attendance from '../../../models/Attendance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    await connectDB();
    
    const query = {};
    if (date) {
      query.date = new Date(date);
    }
    
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNumber');
    
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Handle bulk attendance
    if (Array.isArray(body)) {
      const results = [];
      for (const record of body) {
        const existing = await Attendance.findOne({
          studentId: record.studentId,
          date: new Date(record.date)
        });
        
        if (existing) {
          existing.status = record.status;
          await existing.save();
          results.push(existing);
        } else {
          const attendance = new Attendance(record);
          await attendance.save();
          results.push(attendance);
        }
      }
      return NextResponse.json(results, { status: 201 });
    }
    
    // Handle single attendance
    const existing = await Attendance.findOne({
      studentId: body.studentId,
      date: new Date(body.date)
    });
    
    if (existing) {
      existing.status = body.status;
      await existing.save();
      return NextResponse.json(existing);
    }
    
    const attendance = new Attendance(body);
    await attendance.save();
    
    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}