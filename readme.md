# Database

## Model

```
Post
  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  user!: User;

User
  @OneToMany(() => Post, post => post.user)
  posts!: Post[];
```

## Migrations

```
typeorm:create path-to-migrations
typeorm:create src/migrations/CreateInitialTables
```
```
// check src\database\connection.ts
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
```


## Connection and initialization

```
// check src\database\connection.ts
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
```

```
export const initializeDatabase = async (): Promise<void> => {
  try {
    const config = extractDatabaseConfig(); // DatabaseConfig from the typeorm

    // Create database if it doesn't exist
    await createDatabaseIfNotExists(config); // create the database first

    // Initialize the data source
    if (!AppDataSource.isInitialized) await AppDataSource.initialize(); // connect the data-source to the typeorm Model

    // Run pending migrations
    await runMigrations(); // the migrations we have with typeorm:create path-to-migrations
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
```

# Controller

## 