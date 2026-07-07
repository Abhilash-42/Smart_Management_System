import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  math: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  science: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  english: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  hindi: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  socialStudies: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  total: Number,
  percentage: Number,
  grade: String,
  status: String
}, { timestamps: true });

StudentSchema.pre('save', function(next) {
  const subjects = ['math', 'science', 'english', 'hindi', 'socialStudies'];
  let total = 0;
  
  subjects.forEach(subject => {
    total += this[subject];
  });
  
  this.total = total;
  this.percentage = Math.round((total / 500) * 100);
  
  // Grade calculation
  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B';
  else if (this.percentage >= 60) this.grade = 'C';
  else if (this.percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  
  // Status calculation
  if (this.percentage >= 75) this.status = 'Excellent';
  else if (this.percentage >= 50) this.status = 'Average';
  else this.status = 'Poor';
  
  next();
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);