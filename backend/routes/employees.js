const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// GET: لیست همه کارکنان
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: افزودن کارمند جدید
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    const newEmployee = new Employee({ name, email, position, department, salary });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: ویرایش کارمند
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: حذف کارمند
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
