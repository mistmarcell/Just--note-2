const Note = require('../models/Note');
const AppError = require('../utils/AppError');

const getNotes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      tags,
      archived,
      favorite,
      pinned,
      sort = '-updatedAt',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { owner: req.user._id };

    if (archived !== undefined) query.archived = archived === 'true';
    if (favorite !== undefined) query.favorite = favorite === 'true';
    if (pinned !== undefined) query.pinned = pinned === 'true';

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase());
      query.tags = { $in: tagList };
    }

    const sortOptions = {
      '-updatedAt': { pinned: -1, updatedAt: -1 },
      'updatedAt': { pinned: -1, updatedAt: 1 },
      '-createdAt': { pinned: -1, createdAt: -1 },
      'createdAt': { pinned: -1, createdAt: 1 },
      'title': { pinned: -1, title: 1 },
      '-title': { pinned: -1, title: -1 },
    };

    const sortObj = sortOptions[sort] || sortOptions['-updatedAt'];

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notes, total] = await Promise.all([
      Note.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Note.countDocuments(query),
    ]);

    res.json({
      success: true,
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, color, category, tags } = req.body;
    const note = await Note.create({
      title,
      content: content || '',
      color: color || '#1e293b',
      category: category || 'Personal',
      tags: tags || [],
      owner: req.user._id,
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content, color, category, tags } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, content, color, category, tags },
      { new: true, runValidators: true }
    );
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};

const toggleArchive = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    note.archived = !note.archived;
    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    note.favorite = !note.favorite;
    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return next(new AppError('Note not found.', 404));
    }
    note.pinned = !note.pinned;
    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [total, archived, favorite, categories] = await Promise.all([
      Note.countDocuments({ owner: req.user._id }),
      Note.countDocuments({ owner: req.user._id, archived: true }),
      Note.countDocuments({ owner: req.user._id, favorite: true }),
      Note.distinct('category', { owner: req.user._id }),
    ]);

    res.json({
      success: true,
      stats: { total, archived, favorite, categories },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  toggleArchive,
  toggleFavorite,
  togglePin,
  getStats,
};
