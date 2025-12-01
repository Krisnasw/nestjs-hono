# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

## 2. Install Dependencies

```bash
bun install
```

## 3. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=mysql://root:@localhost:3306/boilerplate
```

## 4. Setup Database

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE boilerplate;"

# Push schema to database
bun run db:push
```

## 5. Run the Application

```bash
bun run start:dev
```

The server will start on `http://localhost:3000`

## 6. Test the API

```bash
# Health check
curl http://localhost:3000/api

# Swagger documentation
open http://localhost:3000/api-docs
```

## Next Steps

- Add your own modules in `src/modules/`
- Define database schema in `src/shared/database/schema.ts`
- Configure Redis and RabbitMQ if needed
- Read the [full documentation](./README.md)

## Common Commands

```bash
# Development
bun run start:dev          # Start with hot reload

# Database
bun run db:push            # Push schema changes
bun run db:studio          # Open database GUI
bun run db:generate        # Generate migrations

# Testing
bun run test               # Run tests
bun run test:e2e           # Run e2e tests

# Production
bun run build              # Build for production
bun run start:prod         # Run production build
```

## Troubleshooting

### Database connection error
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Port already in use
- Change PORT in .env
- Or kill the process using port 3000

### Module not found errors
- Run `bun install` again
- Clear node_modules and reinstall

## Need Help?

- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed information
- Review [README.md](./README.md) for full documentation
- Check the example module in `src/modules/hello/`
