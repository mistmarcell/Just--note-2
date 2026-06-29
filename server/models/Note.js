const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    default: '',
    maxlength: [10000, 'Content cannot exceed 10000 characters'],
  },
  color: {
    type: String,
    default: '#1e293b',
  },
  category: {
    type: String,
    default: 'Personal',
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  pinned: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

noteSchema.index({ owner: 1, pinned: -1, updatedAt: -1 });
noteSchema.index({ owner: 1, archived: 1, favorite: 1 });

module.exports = mongoose.model('Note', noteSchema);
