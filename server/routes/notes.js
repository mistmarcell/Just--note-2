const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  toggleArchive,
  toggleFavorite,
  togglePin,
  getStats,
} = require('../controllers/noteController');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getNotes);
router.get('/:id', getNote);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  ],
  validate,
  createNote
);

router.put(
  '/:id',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  ],
  validate,
  updateNote
);

router.delete('/:id', deleteNote);
router.put('/:id/archive', toggleArchive);
router.put('/:id/favorite', toggleFavorite);
router.put('/:id/pin', togglePin);

module.exports = router;
