// Simple script to populate dummy data
// Run this with: node populate-data.js

const { exec } = require('child_process');

console.log('🚀 Populating dummy data for Akaki Full Gospel Church...');

// Execute the populate script
exec('node server/scripts/populate-dummy-data.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`⚠️  Warning: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('🎉 Done! Your dashboard should now show beautiful charts with data.');
  console.log('💡 Restart your Docker containers to see the changes:');
  console.log('   docker-compose down && docker-compose up --build');
});