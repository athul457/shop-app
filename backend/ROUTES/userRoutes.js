const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addAddress,
  deleteAddress,
  updateUserProfile
} = require('../CONTROLLERS/userController');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetypes = /image\/jpeg|image\/png|image\/webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/profile').put(protect, upload.single('image'), updateUserProfile);
router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteUser)
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser);

router.route('/address').post(protect, addAddress);
router.route('/address/:addressId').delete(protect, deleteAddress);

module.exports = router;
