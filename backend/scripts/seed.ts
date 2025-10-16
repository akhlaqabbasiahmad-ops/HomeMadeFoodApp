import * as path from 'path';
import { DataSource } from 'typeorm';

// Create a direct database configuration for the seeder
const databaseConfig = {
  type: 'sqlite' as const,
  database: path.join(__dirname, '../data/homemadefood.sqlite'),
  entities: [path.join(__dirname, '../src/infrastructure/database/entities/*.ts')],
  synchronize: true,
  logging: true,
};

async function runSeeder() {
  console.log('🚀 Starting database seeding process...');
  
  const dataSource = new DataSource(databaseConfig);
  
  try {
    await dataSource.initialize();
    console.log('📦 Database connection established');
    
    // Simple seeding logic
    console.log('📝 Note: Use the API endpoint http://localhost:3000/api/v1/test/seed to seed data');
    console.log('🎯 The backend server provides test data seeding through the TestController');
    
    console.log('🎉 Database connection successful! Use the API to seed data.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

runSeeder();