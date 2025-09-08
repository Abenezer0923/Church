const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function insertDummyData() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'akaki_church',
    user: 'church_admin',
    password: 'church_password_2024',
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    
    console.log('📊 Checking current data...');
    
    // Check current member count
    const memberResult = await client.query('SELECT COUNT(*) FROM members');
    const paymentResult = await client.query('SELECT COUNT(*) FROM monthly_payments');
    
    console.log(`Current members: ${memberResult.rows[0].count}`);
    console.log(`Current payments: ${paymentResult.rows[0].count}`);
    
    if (memberResult.rows[0].count > 1) {
      console.log('✅ Data already exists! Let me show you what we have:');
      
      // Show monthly totals
      const monthlyTotals = await client.query(`
        SELECT 
          payment_month,
          COUNT(*) as payment_count,
          SUM(total_amount) as total_amount
        FROM monthly_payments 
        WHERE payment_year = 2024 
        GROUP BY payment_month 
        ORDER BY payment_month
      `);
      
      console.log('\n📈 Monthly Totals for 2024:');
      monthlyTotals.rows.forEach(row => {
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        console.log(`   - ${monthNames[row.payment_month]}: ${row.payment_count} payments, ${parseFloat(row.total_amount).toLocaleString()} ETB`);
      });
      
      return;
    }
    
    console.log('📝 Inserting dummy data...');
    
    // Read and execute the dummy data SQL
    const dummyDataPath = path.join(__dirname, 'server/database/dummy-data.sql');
    const dummyDataSQL = fs.readFileSync(dummyDataPath, 'utf8');
    
    await client.query(dummyDataSQL);
    
    console.log('✅ Dummy data inserted successfully!');
    
    // Verify the insertion
    const newMemberResult = await client.query('SELECT COUNT(*) FROM members');
    const newPaymentResult = await client.query('SELECT COUNT(*) FROM monthly_payments');
    
    console.log(`\n📊 New Data Summary:`);
    console.log(`   - Members: ${newMemberResult.rows[0].count}`);
    console.log(`   - Tithing Records: ${newPaymentResult.rows[0].count}`);
    
    // Show monthly totals
    const monthlyTotals = await client.query(`
      SELECT 
        payment_month,
        COUNT(*) as payment_count,
        SUM(total_amount) as total_amount
      FROM monthly_payments 
      WHERE payment_year = 2024 
      GROUP BY payment_month 
      ORDER BY payment_month
    `);
    
    console.log('\n📈 Monthly Totals for 2024:');
    monthlyTotals.rows.forEach(row => {
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      console.log(`   - ${monthNames[row.payment_month]}: ${row.payment_count} payments, ${parseFloat(row.total_amount).toLocaleString()} ETB`);
    });
    
    console.log('\n🎉 Done! Refresh your dashboard to see the charts with data.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Database connection failed. Make sure Docker containers are running:');
      console.log('   docker-compose up -d');
    }
  } finally {
    await client.end();
  }
}

insertDummyData();