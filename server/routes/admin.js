const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const User = require('../../models/User');

// @route   GET api/admin/pending-approvals
// @desc    Get all users pending approval
// @access  Private/Admin
router.get('/pending-approvals', [auth, admin], async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(pendingUsers);
  } catch (err) {
    console.error('Server error in fetching pending approvals:', err.message);
    res.status(500).send({ msg: 'Server error while fetching pending users' });
  }
});

// @route   PUT api/admin/approve/:id
// @desc    Approve a user
// @access  Private/Admin
router.put('/approve/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ msg: 'User is not pending approval' });
    }
    
    user.status = 'active';
    await user.save();
    
    res.json({ msg: 'User approved successfully' });
  } catch (err) {
    console.error('Server error in approving user:', err.message);
    res.status(500).send({ msg: 'Server error while approving user' });
  }
});

// @route   DELETE api/admin/reject/:id
// @desc    Reject a user
// @access  Private/Admin
router.delete('/reject/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ msg: 'User is not pending approval' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'User rejected successfully' });
  } catch (err) {
    console.error('Server error in rejecting user:', err.message);
    res.status(500).send({ msg: 'Server error while rejecting user' });
  }
});

module.exports = router;