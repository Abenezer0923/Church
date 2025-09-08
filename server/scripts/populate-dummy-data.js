const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'akaki_church',
  user: process.env.DB_USER || 'church_admin',
  password: process.env.DB_PASSWORD || 'church_password_2024',
});

async function populateDummyData() {
  try {
    console.log('🚀 Starting to populate dummy data...');
    
    // Read the dummy data SQL file
    const dummyDataPath = path.join(__dirname, '../database/dummy-data.sql');
    const dummyDataSQL = fs.readFileSync(dummyDataPath, 'utf8');
    
    // Execute the SQL
    await pool.query(dummyDataSQL);
    
    console.log('✅ Dummy data populated successfully!');
    
    // Verify the data
    const memberCount = await pool.query('SELECT COUNT(*) FROM members');
    const paymentCount = await pool.query('SELECT COUNT(*) FROM monthly_payments');
    
    console.log(`📊 Data Summary:`);
    console.log(`   - Members: ${memberCount.rows[0].count}`);
    console.log(`   - Tithing Records: ${paymentCount.rows[0].count}`);
    
    // Show monthly totals for 2024
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
    
    console.log(`\n📈 Monthly Totals for 2024:`);
    monthlyTotals.rows.forEach(row => {
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      console.log(`   - ${monthNames[row.payment_month]}: ${row.payment_count} payments, ${parseFloat(row.total_amount).toLocaleString()} ETB`);
    });
    
    // Show top contributors
    const topContributors = await pool.query(`
      SELECT 
        m.first_name,
        m.last_name,
        SUM(mp.total_amount) as total_contributed
      FROM members m
      JOIN monthly_payments mp ON m.id = mp.member_id
      WHERE mp.payment_year = 2024
      GROUP BY m.id, m.first_name, m.last_name
      ORDER BY total_contributed DESC
      LIMIT 5
    `);
    
    console.log(`\n🏆 Top Contributors for 2024:`);
    topContributors.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.first_name} ${row.last_name}: ${parseFloat(row.total_contributed).toLocaleString()} ETB`);
    });
    
  } catch (error) {
    console.error('❌ Error populating dummy data:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
populateDummyData();