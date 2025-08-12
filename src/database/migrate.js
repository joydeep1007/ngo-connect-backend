import supabase from '../config/database.js';

const createVolunteersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      interest VARCHAR(100) NOT NULL,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
    CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
    CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: query });
    
    if (error) {
      // If RPC doesn't work, try direct SQL execution
      const { error: sqlError } = await supabase
        .from('volunteers')
        .select('id')
        .limit(1);
      
      if (sqlError && sqlError.code === '42P01') {
        // Table doesn't exist, we need to create it manually
        console.log('Creating table manually through Supabase dashboard...');
        console.log('Please create the volunteers table in your Supabase dashboard with this SQL:');
        console.log(query);
        throw new Error('Please create the table manually in Supabase dashboard');
      }
    }
    
    console.log('Volunteers table created successfully');
  } catch (error) {
    console.error('Error creating volunteers table:', error);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await createVolunteersTable();
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('\n📝 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL query:');
    console.log(`
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  interest VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at);
    `);
    process.exit(1);
  }
};

runMigrations();