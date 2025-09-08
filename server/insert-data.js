const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'akaki_church',
  user: 'church_admin',
  password: 'church_password_2024',
});

async function insertData() {
  try {
    console.log('Connecting to database...');
    
    // Check current data
    const memberCount = await pool.query('SELECT COUNT(*) FROM members');
    const paymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    console.log(`Current members: ${memberCount.rows[0].count}`);
    console.log(`Current payments: ${paymentCount.rows[0].count}`);
    
    if (parseInt(memberCount.rows[0].count) > 1) {
      console.log('Data already exists!');
      return;
    }
    
    console.log('Inserting dummy data...');
    
    // Insert members first
    const membersSQL = `
      INSERT INTO members (member_id, first_name, last_name, email, phone, address, date_of_birth, gender, marital_status, occupation, monthly_income, membership_date, created_by) VALUES
      ('AFGC001', 'Abebe', 'Kebede', 'abebe.kebede@email.com', '+251911123456', 'Addis Ababa, Bole', '1985-03-15', 'male', 'married', 'Teacher', 8000.00, '2020-01-15', 1),
      ('AFGC002', 'Almaz', 'Tesfaye', 'almaz.tesfaye@email.com', '+251922234567', 'Addis Ababa, Kirkos', '1990-07-22', 'female', 'single', 'Nurse', 12000.00, '2020-02-10', 1),
      ('AFGC003', 'Dawit', 'Haile', 'dawit.haile@email.com', '+251933345678', 'Addis Ababa, Yeka', '1982-11-08', 'male', 'married', 'Engineer', 25000.00, '2020-03-05', 1),
      ('AFGC004', 'Hanan', 'Girma', 'hanan.girma@email.com', '+251944456789', 'Addis Ababa, Arada', '1988-05-12', 'female', 'married', 'Accountant', 15000.00, '2020-04-20', 1),
      ('AFGC005', 'Mulugeta', 'Assefa', 'mulugeta.assefa@email.com', '+251955567890', 'Addis Ababa, Gulele', '1975-09-30', 'male', 'married', 'Business Owner', 35000.00, '2020-05-15', 1)
      ON CONFLICT (member_id) DO NOTHING;
    `;
    
    await pool.query(membersSQL);
    console.log('Members inserted');
    
    // Insert some payments
    const paymentsSQL = `
      INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
      (1, 1, 2024, 800.00, 200.00, 100.00, 1100.00, '2024-01-15', 'bank_transfer', 1),
      (2, 1, 2024, 1200.00, 300.00, 0.00, 1500.00, '2024-01-16', 'cash', 1),
      (3, 1, 2024, 2500.00, 500.00, 200.00, 3200.00, '2024-01-17', 'bank_transfer', 1),
      (1, 2, 2024, 800.00, 250.00, 0.00, 1050.00, '2024-02-15', 'bank_transfer', 1),
      (2, 2, 2024, 1200.00, 350.00, 100.00, 1650.00, '2024-02-16', 'cash', 1),
      (3, 2, 2024, 2500.00, 600.00, 300.00, 3400.00, '2024-02-17', 'bank_transfer', 1),
      (4, 2, 2024, 1500.00, 450.00, 200.00, 2150.00, '2024-02-18', 'mobile_money', 1),
      (5, 2, 2024, 3500.00, 900.00, 400.00, 4800.00, '2024-02-19', 'bank_transfer', 1),
      (1, 3, 2024, 800.00, 300.00, 150.00, 1250.00, '2024-03-15', 'bank_transfer', 1),
      (2, 3, 2024, 1200.00, 400.00, 200.00, 1800.00, '2024-03-16', 'cash', 1)
      ON CONFLICT (member_id, payment_month, payment_year) DO NOTHING;
    `;
    
    await pool.query(paymentsSQL);
    console.log('Payments inserted');
    
    // Verify
    const newMemberCount = await pool.query('SELECT COUNT(*) FROM members');
    const newPaymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    console.log(`New member count: ${newMemberCount.rows[0].count}`);
    console.log(`New payment count: ${newPaymentCount.rows[0].count}`);
    
    console.log('✅ Data inserted successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

insertData();