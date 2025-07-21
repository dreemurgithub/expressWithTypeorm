import { Client } from 'pg';
import { AppDataSource } from '../data-source';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
const isPostgresDataSource = (options: any): options is PostgresConnectionOptions => {
  return options.type === 'postgres';
};
export const createDatabaseIfNotExists = async (config: DatabaseConfig): Promise<void> => {
  const { database, ...connectionConfig } = config;
  const client = new Client({
    host: connectionConfig.host,
    port: connectionConfig.port,
    user: connectionConfig.user,
    password: connectionConfig.password,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      'SELECT datname FROM pg_catalog.pg_database WHERE datname = $1',
      [database]
    );

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      console.log(`Creating database: ${database}`);
      await client.query(`CREATE DATABASE "${database}"`);
      console.log(`Database '${database}' created successfully`);
    } else {
      console.log(`Database '${database}' already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
};
const extractDatabaseConfig = (): DatabaseConfig => {
  if (!isPostgresDataSource(AppDataSource.options)) {
    throw new Error('This function only supports PostgreSQL databases');
  }
  const options = AppDataSource.options as PostgresConnectionOptions;
  return {
    host: options.host || 'localhost',
    port: options.port || 5432,
    user: options.username || 'postgres',
    password: `${options.password}` || '',
    database: options.database || '',
  };
};

/**
 * Initialize database connection and run migrations
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Extract config from DataSource
    const config = extractDatabaseConfig();

    // Create database if it doesn't exist
    await createDatabaseIfNotExists(config);

    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      console.log('Initializing database connection...');
      await AppDataSource.initialize();
      console.log('Database connection initialized successfully');
    }

    // Run pending migrations
    await runMigrations();
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('Running database migrations...');
    const migrations = await AppDataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`Executed ${migrations.length} migrations:`);
      migrations.forEach(migration => {
        console.log(`  ✓ ${migration.name}`);
      });
    } else {
      console.log('No pending migrations found');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Revert the last migration
 */
export const revertLastMigration = async (): Promise<void> => {
  try {
    console.log('Reverting last migration...');
    await AppDataSource.undoLastMigration();
    console.log('Last migration reverted successfully');
  } catch (error) {
    console.error('Migration revert failed:', error);
    throw error;
  }
};

/**
 * Drop all tables and recreate from entities (DANGER: Only for development)
 */
export const resetDatabase = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database reset is not allowed in production');
  }

  try {
    console.log('Dropping database schema...');
    await AppDataSource.dropDatabase();
    
    console.log('Synchronizing database schema...');
    await AppDataSource.synchronize();
    
    console.log('Database reset completed');
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
};

/**
 * Check database connection health
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!AppDataSource.isInitialized) {
      return false;
    }
    
    // Simple query to check connection
    await AppDataSource.query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

/**
 * Get current database connection instance
 */
export const getDatabase = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return AppDataSource;
};

/**
 * Gracefully close database connection
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};
