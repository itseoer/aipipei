import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  score: number;
  analysis: string;
  suggestions: string[];
  timestamp: Date;
  testType: 'basic' | 'advanced';
  user1: {
    name: string;
    birthDate?: Date;
  };
  user2: {
    name: string;
    birthDate?: Date;
  };
  metadata?: {
    [key: string]: any;
  };
}

const ResultSchema = new Schema<IResult>({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    index: true,
  },
  analysis: {
    type: String,
    required: true,
  },
  suggestions: [{
    type: String,
    required: true,
  }],
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  testType: {
    type: String,
    enum: ['basic', 'advanced'],
    required: true,
    index: true,
  },
  user1: {
    name: {
      type: String,
      required: true,
    },
    birthDate: Date,
  },
  user2: {
    name: {
      type: String,
      required: true,
    },
    birthDate: Date,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// 创建复合索引
ResultSchema.index({ score: 1, timestamp: -1 });
ResultSchema.index({ testType: 1, timestamp: -1 });
ResultSchema.index({ 'user1.name': 1, 'user2.name': 1 });

// 添加虚拟字段
ResultSchema.virtual('ageAtTest').get(function() {
  if (this.user1.birthDate && this.user2.birthDate) {
    const date1 = new Date(this.user1.birthDate);
    const date2 = new Date(this.user2.birthDate);
    const ageDiff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  }
  return null;
});

// 添加实例方法
ResultSchema.methods.generateShareText = function(): string {
  return `${this.user1.name}和${this.user2.name}的缘分指数为${this.score}%！\n${this.analysis}`;
};

// 添加静态方法
ResultSchema.statics.findByNames = async function(name1: string, name2: string) {
  return this.find({
    $or: [
      { 'user1.name': name1, 'user2.name': name2 },
      { 'user1.name': name2, 'user2.name': name1 },
    ],
  }).sort({ timestamp: -1 });
};

export const Result = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema); 