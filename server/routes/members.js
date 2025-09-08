const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all members (Admin and Super Admin)
router.get('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, u.first_name as created_by_name, u.last_name as created_by_lastname
      FROM members m
      LEFT JOIN users u ON m.created_by = u.id
      WHERE m.is_active = true
    `;
    let params = [];

    if (search) {
      query += ` AND (m.first_name ILIKE $1 OR m.last_name ILIKE $1 OR m.member_id ILIKE $1 OR m.email ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM members WHERE is_active = true';
    let countParams = [];
    
    if (search) {
      countQuery += ` AND (first_name ILIKE $1 OR last_name ILIKE $1 OR member_id ILIKE $1 OR email ILIKE $1)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      members: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single member
router.get('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM members WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new member
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('monthly_income').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      first_name, last_name, email, phone, address, date_of_birth,
      gender, marital_status, occupation, monthly_income
    } = req.body;

    // Generate member ID
    const memberIdResult = await pool.query('SELECT COUNT(*) FROM members');
    const memberCount = parseInt(memberIdResult.rows[0].count) + 1;
    const member_id = `AFGC${memberCount.toString().padStart(4, '0')}`;

    const result = await pool.query(
      `INSERT INTO members (
        member_id, first_name, last_name, email, phone, address, 
        date_of_birth, gender, marital_status, occupation, monthly_income, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        member_id, first_name, last_name, email, phone, address,
        date_of_birth, gender, marital_status, occupation, monthly_income, req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update member
router.put('/:id', [
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  body('first_name').optional().notEmpty().trim(),
  body('last_name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('monthly_income').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      first_name, last_name, email, phone, address, date_of_birth,
      gender, marital_status, occupation, monthly_income
    } = req.body;

    const result = await pool.query(
      `UPDATE members SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        address = COALESCE($5, address),
        date_of_birth = COALESCE($6, date_of_birth),
        gender = COALESCE($7, gender),
        marital_status = COALESCE($8, marital_status),
        occupation = COALESCE($9, occupation),
        monthly_income = COALESCE($10, monthly_income),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND is_active = true
      RETURNING *`,
      [first_name, last_name, email, phone, address, date_of_birth, gender, marital_status, occupation, monthly_income, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete member (soft delete)
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE members SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;