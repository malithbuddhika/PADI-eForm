import mysql from 'mysql2/promise';

async function createTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'padi'
  });

  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS complete_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        form1_data JSON,
        form2_data JSON,
        form3_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES \`user\`(id) ON DELETE CASCADE
      )
    `;
    
    await connection.execute(sql);
    console.log('✅ Table complete_submissions created successfully');
    
    // Verify
    const [rows] = await connection.execute('SHOW TABLES LIKE "complete_submissions"');
    console.log('✅ Table exists:', rows.length > 0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

createTable();
