import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import ActivityLog from '../../../models/ActivityLog';

export async function GET() {
  try {
    await connectDB();
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(20);
    
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const activity = new ActivityLog({
      action: body.action,
      user: body.user,
      details: body.details
    });
    
    await activity.save();
    
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}