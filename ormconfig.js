module.exports = {
    type: 'postgres',
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: ["dist/**/*.entity{ .ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations_history",
    migrationsRun: true,
    cli: {
        "migrationsDir": "src/migrations"
    }
    
}
