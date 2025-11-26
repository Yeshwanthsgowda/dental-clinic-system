# Prisma Migration Commands

## Initial Setup
```bash
# Navigate to backend directory
cd backend

# Install Prisma CLI
npm install prisma @prisma/client

# Generate Prisma Client
npx prisma generate
```

## Database Migration Commands
```bash
# Create and apply initial migration
npx prisma migrate dev --name init

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Apply pending migrations in production
npx prisma migrate deploy

# Create a new migration after schema changes
npx prisma migrate dev --name add_new_feature

# View migration status
npx prisma migrate status
```

## Database Management
```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Seed the database (if seed file exists)
npx prisma db seed

# Push schema changes without creating migration (for prototyping)
npx prisma db push
```

## Production Deployment
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Apply migrations
npx prisma migrate deploy
```