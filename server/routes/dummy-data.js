const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'akaki_church',
  user: process.env.DB_USER || 'church_admin',
  password: process.env.DB_PASSWORD || 'church_password_2024',
});

// POST /api/dummy-data/populate
router.post('/populate', async (req, res) => {
  try {
    console.log('🚀 Starting dummy data population...');
    
    // Check if data already exists
    const memberCount = await pool.query('SELECT COUNT(*) FROM members');
    const paymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    if (parseInt(memberCount.rows[0].count) > 1) {
      return res.json({
        success: true,
        message: 'Dummy data already exists',
        data: {
          members: memberCount.rows[0].count,
          payments: paymentCount.rows[0].count
        }
      });
    }
    
    // Insert sample members
    const membersSQL = `
      INSERT INTO members (member_id, first_name, last_name, email, phone, address, date_of_birth, gender, marital_status, occupation, monthly_income, membership_date, created_by) VALUES
      ('AFGC001', 'Abebe', 'Kebede', 'abebe.kebede@email.com', '+251911123456', 'Addis Ababa, Bole', '1985-03-15', 'male', 'married', 'Teacher', 8000.00, '2020-01-15', 1),
      ('AFGC002', 'Almaz', 'Tesfaye', 'almaz.tesfaye@email.com', '+251922234567', 'Addis Ababa, Kirkos', '1990-07-22', 'female', 'single', 'Nurse', 12000.00, '2020-02-10', 1),
      ('AFGC003', 'Dawit', 'Haile', 'dawit.haile@email.com', '+251933345678', 'Addis Ababa, Yeka', '1982-11-08', 'male', 'married', 'Engineer', 25000.00, '2020-03-05', 1),
      ('AFGC004', 'Hanan', 'Girma', 'hanan.girma@email.com', '+251944456789', 'Addis Ababa, Arada', '1988-05-12', 'female', 'married', 'Accountant', 15000.00, '2020-04-20', 1),
      ('AFGC005', 'Mulugeta', 'Assefa', 'mulugeta.assefa@email.com', '+251955567890', 'Addis Ababa, Gulele', '1975-09-30', 'male', 'married', 'Business Owner', 35000.00, '2020-05-15', 1),
      ('AFGC006', 'Selamawit', 'Bekele', 'selamawit.bekele@email.com', '+251966678901', 'Addis Ababa, Nifas Silk', '1992-12-03', 'female', 'single', 'Doctor', 28000.00, '2020-06-10', 1),
      ('AFGC007', 'Tekle', 'Mekonen', 'tekle.mekonen@email.com', '+251977789012', 'Addis Ababa, Kolfe', '1980-04-18', 'male', 'married', 'Lawyer', 22000.00, '2020-07-25', 1),
      ('AFGC008', 'Meron', 'Tadesse', 'meron.tadesse@email.com', '+251988890123', 'Addis Ababa, Akaky', '1987-08-14', 'female', 'divorced', 'Marketing Manager', 18000.00, '2020-08-12', 1)
      ON CONFLICT (member_id) DO NOTHING;
    `;
    
    await pool.query(membersSQL);
    
    // Insert sample payments for multiple months
    const paymentsSQL = `
      INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
      -- January 2024
      (1, 1, 2024, 800.00, 200.00, 100.00, 1100.00, '2024-01-15', 'bank_transfer', 1),
      (2, 1, 2024, 1200.00, 300.00, 0.00, 1500.00, '2024-01-16', 'cash', 1),
      (3, 1, 2024, 2500.00, 500.00, 200.00, 3200.00, '2024-01-17', 'bank_transfer', 1),
      (4, 1, 2024, 1500.00, 400.00, 150.00, 2050.00, '2024-01-18', 'mobile_money', 1),
      (5, 1, 2024, 3500.00, 800.00, 300.00, 4600.00, '2024-01-19', 'bank_transfer', 1),
      
      -- February 2024
      (1, 2, 2024, 800.00, 250.00, 0.00, 1050.00, '2024-02-15', 'bank_transfer', 1),
      (2, 2, 2024, 1200.00, 350.00, 100.00, 1650.00, '2024-02-16', 'cash', 1),
      (3, 2, 2024, 2500.00, 600.00, 300.00, 3400.00, '2024-02-17', 'bank_transfer', 1),
      (4, 2, 2024, 1500.00, 450.00, 200.00, 2150.00, '2024-02-18', 'mobile_money', 1),
      (5, 2, 2024, 3500.00, 900.00, 400.00, 4800.00, '2024-02-19', 'bank_transfer', 1),
      (6, 2, 2024, 2800.00, 700.00, 250.00, 3750.00, '2024-02-20', 'bank_transfer', 1),
      
      -- March 2024
      (1, 3, 2024, 800.00, 300.00, 150.00, 1250.00, '2024-03-15', 'bank_transfer', 1),
      (2, 3, 2024, 1200.00, 400.00, 200.00, 1800.00, '2024-03-16', 'cash', 1),
      (3, 3, 2024, 2500.00, 700.00, 400.00, 3600.00, '2024-03-17', 'bank_transfer', 1),
      (6, 3, 2024, 2800.00, 650.00, 300.00, 3750.00, '2024-03-18', 'bank_transfer', 1),
      (7, 3, 2024, 2200.00, 550.00, 250.00, 3000.00, '2024-03-19', 'cash', 1),
      
      -- April 2024
      (4, 4, 2024, 1500.00, 500.00, 250.00, 2250.00, '2024-04-15', 'mobile_money', 1),
      (5, 4, 2024, 3500.00, 1000.00, 500.00, 5000.00, '2024-04-16', 'bank_transfer', 1),
      (8, 4, 2024, 1800.00, 450.00, 200.00, 2450.00, '2024-04-17', 'mobile_money', 1),
      (1, 4, 2024, 800.00, 350.00, 200.00, 1350.00, '2024-04-20', 'bank_transfer', 1),
      (2, 4, 2024, 1200.00, 450.00, 250.00, 1900.00, '2024-04-21', 'cash', 1),
      
      -- May 2024
      (3, 5, 2024, 2500.00, 900.00, 600.00, 4000.00, '2024-05-15', 'bank_transfer', 1),
      (6, 5, 2024, 2800.00, 750.00, 400.00, 3950.00, '2024-05-16', 'bank_transfer', 1),
      (7, 5, 2024, 2200.00, 650.00, 350.00, 3200.00, '2024-05-17', 'cash', 1),
      (8, 5, 2024, 1800.00, 500.00, 200.00, 2500.00, '2024-05-18', 'mobile_money', 1),
      (1, 5, 2024, 800.00, 400.00, 250.00, 1450.00, '2024-05-20', 'bank_transfer', 1),
      
      -- June 2024
      (2, 6, 2024, 1200.00, 500.00, 300.00, 2000.00, '2024-06-15', 'cash', 1),
      (4, 6, 2024, 1500.00, 550.00, 300.00, 2350.00, '2024-06-16', 'mobile_money', 1),
      (5, 6, 2024, 3500.00, 1100.00, 600.00, 5200.00, '2024-06-17', 'bank_transfer', 1),
      (6, 6, 2024, 2800.00, 750.00, 400.00, 3950.00, '2024-06-18', 'bank_transfer', 1),
      (7, 6, 2024, 2200.00, 650.00, 350.00, 3200.00, '2024-06-19', 'cash', 1),
      
      -- July 2024
      (1, 7, 2024, 800.00, 450.00, 300.00, 1550.00, '2024-07-15', 'bank_transfer', 1),
      (3, 7, 2024, 2500.00, 1000.00, 700.00, 4200.00, '2024-07-16', 'bank_transfer', 1),
      (8, 7, 2024, 1800.00, 600.00, 300.00, 2700.00, '2024-07-17', 'mobile_money', 1),
      (2, 7, 2024, 1200.00, 550.00, 350.00, 2100.00, '2024-07-18', 'cash', 1),
      (4, 7, 2024, 1500.00, 600.00, 350.00, 2450.00, '2024-07-19', 'mobile_money', 1),
      
      -- August 2024
      (5, 8, 2024, 3500.00, 1300.00, 800.00, 5600.00, '2024-08-15', 'bank_transfer', 1),
      (6, 8, 2024, 2800.00, 850.00, 500.00, 4150.00, '2024-08-16', 'bank_transfer', 1),
      (7, 8, 2024, 2200.00, 750.00, 450.00, 3400.00, '2024-08-17', 'cash', 1),
      (1, 8, 2024, 800.00, 500.00, 350.00, 1650.00, '2024-08-18', 'bank_transfer', 1),
      (2, 8, 2024, 1200.00, 600.00, 400.00, 2200.00, '2024-08-19', 'cash', 1),
      
      -- September 2024
      (3, 9, 2024, 2500.00, 1100.00, 800.00, 4400.00, '2024-09-01', 'bank_transfer', 1),
      (8, 9, 2024, 1800.00, 650.00, 350.00, 2800.00, '2024-09-02', 'mobile_money', 1),
      (4, 9, 2024, 1500.00, 650.00, 400.00, 2550.00, '2024-09-03', 'mobile_money', 1),
      (5, 9, 2024, 3500.00, 1200.00, 700.00, 5400.00, '2024-09-04', 'bank_transfer', 1),
      (1, 9, 2024, 800.00, 550.00, 400.00, 1750.00, '2024-09-05', 'bank_transfer', 1)
      ON CONFLICT (member_id, payment_month, payment_year) DO NOTHING;
    `;
    
    await pool.query(paymentsSQL);
    
    // Get final counts
    const finalMemberCount = await pool.query('SELECT COUNT(*) FROM members');
    const finalPaymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    // Get monthly summary
    const monthlyTotals = await pool.query(`
      SELECT 
        payment_month,
        COUNT(*) as payment_count,
        SUM(total_amount) as total_amount
      FROM monthly_payments 
      WHERE payment_year = 2024 
      GROUP BY payment_month 
      ORDER BY payment_month
    `);
    
    console.log('✅ Dummy data populated successfully!');
    
    res.json({
      success: true,
      message: 'Dummy data populated successfully!',
      data: {
        members: finalMemberCount.rows[0].count,
        payments: finalPaymentCount.rows[0].count,
        monthlyTotals: monthlyTotals.rows
      }
    });
    
  } catch (error) {
    console.error('Error populating dummy data:', error);
    res.status(500).json({
      success: false,
      message: 'Error populating dummy data',
      error: error.message
    });
  }
});

// GET /api/dummy-data/status
router.get('/status', async (req, res) => {
  try {
    const memberCount = await pool.query('SELECT COUNT(*) FROM members');
    const paymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    const monthlyTotals = await pool.query(`
      SELECT 
        payment_month,
        COUNT(*) as payment_count,
        SUM(total_amount) as total_amount
      FROM monthly_payments 
      WHERE payment_year = 2024 
      GROUP BY payment_month 
      ORDER BY payment_month
    `);
    
    res.json({
      success: true,
      data: {
        members: memberCount.rows[0].count,
        payments: paymentCount.rows[0].count,
        monthlyTotals: monthlyTotals.rows
      }
    });
    
  } catch (error) {
    console.error('Error getting data status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting data status',
      error: error.message
    });
  }
});

module.exports = router;