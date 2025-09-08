const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all payments
router.get('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, member_id, year, month } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, m.first_name, m.last_name, m.member_id as member_code,
             u.first_name as recorded_by_name, u.last_name as recorded_by_lastname
      FROM monthly_payments p
      JOIN members m ON p.member_id = m.id
      LEFT JOIN users u ON p.recorded_by = u.id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 0;

    if (member_id) {
      paramCount++;
      query += ` AND p.member_id = $${paramCount}`;
      params.push(member_id);
    }

    if (year) {
      paramCount++;
      query += ` AND p.payment_year = $${paramCount}`;
      params.push(year);
    }

    if (month) {
      paramCount++;
      query += ` AND p.payment_month = $${paramCount}`;
      params.push(month);
    }

    query += ` ORDER BY p.payment_date DESC, p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM monthly_payments p
      JOIN members m ON p.member_id = m.id
      WHERE 1=1
    `;
    let countParams = [];
    let countParamCount = 0;

    if (member_id) {
      countParamCount++;
      countQuery += ` AND p.member_id = $${countParamCount}`;
      countParams.push(member_id);
    }

    if (year) {
      countParamCount++;
      countQuery += ` AND p.payment_year = $${countParamCount}`;
      countParams.push(year);
    }

    if (month) {
      countParamCount++;
      countQuery += ` AND p.payment_month = $${countParamCount}`;
      countParams.push(month);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      payments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get member payment history
router.get('/member/:memberId', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const result = await pool.query(
      `SELECT p.*, m.first_name, m.last_name, m.member_id as member_code
       FROM monthly_payments p
       JOIN members m ON p.member_id = m.id
       WHERE p.member_id = $1
       ORDER BY p.payment_year DESC, p.payment_month DESC`,
      [memberId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get member payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Record new payment
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  body('member_id').isInt(),
  body('payment_month').isInt({ min: 1, max: 12 }),
  body('payment_year').isInt({ min: 2020 }),
  body('tithe_amount').optional().isNumeric(),
  body('offering_amount').optional().isNumeric(),
  body('special_offering').optional().isNumeric(),
  body('total_amount').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      member_id, payment_month, payment_year, tithe_amount = 0,
      offering_amount = 0, special_offering = 0, total_amount,
      payment_date, payment_method = 'cash', notes
    } = req.body;

    // Check if payment already exists for this member and month/year
    const existingPayment = await pool.query(
      'SELECT id FROM monthly_payments WHERE member_id = $1 AND payment_month = $2 AND payment_year = $3',
      [member_id, payment_month, payment_year]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(400).json({ message: 'Payment already recorded for this month' });
    }

    // Verify member exists
    const memberCheck = await pool.query('SELECT id FROM members WHERE id = $1 AND is_active = true', [member_id]);
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const result = await pool.query(
      `INSERT INTO monthly_payments (
        member_id, payment_month, payment_year, tithe_amount, offering_amount,
        special_offering, total_amount, payment_date, payment_method, notes, recorded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        member_id, payment_month, payment_year, tithe_amount, offering_amount,
        special_offering, total_amount, payment_date || new Date(), payment_method, notes, req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment
router.put('/:id', [
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  body('tithe_amount').optional().isNumeric(),
  body('offering_amount').optional().isNumeric(),
  body('special_offering').optional().isNumeric(),
  body('total_amount').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      tithe_amount, offering_amount, special_offering, total_amount,
      payment_date, payment_method, notes
    } = req.body;

    const result = await pool.query(
      `UPDATE monthly_payments SET 
        tithe_amount = COALESCE($1, tithe_amount),
        offering_amount = COALESCE($2, offering_amount),
        special_offering = COALESCE($3, special_offering),
        total_amount = COALESCE($4, total_amount),
        payment_date = COALESCE($5, payment_date),
        payment_method = COALESCE($6, payment_method),
        notes = COALESCE($7, notes)
      WHERE id = $8 RETURNING *`,
      [tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM monthly_payments WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment statistics
router.get('/stats/summary', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    // Monthly totals for the year
    const monthlyStats = await pool.query(
      `SELECT 
        payment_month,
        SUM(tithe_amount) as total_tithe,
        SUM(offering_amount) as total_offering,
        SUM(special_offering) as total_special,
        SUM(total_amount) as total_amount,
        COUNT(DISTINCT member_id) as unique_members,
        COUNT(*) as payment_count
      FROM monthly_payments 
      WHERE payment_year = $1
      GROUP BY payment_month
      ORDER BY payment_month`,
      [year]
    );

    // Overall stats for the current period
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const overallStats = await pool.query(
      `SELECT
        (
          SELECT SUM(tithe_amount)
          FROM monthly_payments
          WHERE payment_year = $1 AND payment_month = $2
        ) as current_month_tithe,
        (
          SELECT COUNT(DISTINCT member_id)
          FROM monthly_payments
          WHERE payment_year = $1 AND payment_month = $2
        ) as current_month_members,
        (
          SELECT SUM(tithe_amount)
          FROM monthly_payments
          WHERE payment_year = $1
        ) as yearly_tithe,
        (
          SELECT COUNT(DISTINCT member_id)
          FROM monthly_payments
          WHERE payment_year = $1
        ) as paying_members`,
      [currentYear, currentMonth]
    );

    res.json({
      year: parseInt(year),
      monthly: monthlyStats.rows,
      summary: overallStats.rows[0]
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;