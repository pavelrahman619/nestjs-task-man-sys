# nestjs-task-man-sys

## Backend Setup & Useful Commands

### 1. Install dependencies
```sh
cd backend
yarn install
# or
npm install

# Initialize Prisma (if not already done)
npx prisma init --datasource-provider postgresql --output ../generated/prisma

# Edit your .env or set DATABASE_URL in prisma/schema.prisma

# Generate Prisma Client
npx prisma generate

# Run migrations (after editing schema.prisma)
npx prisma migrate dev --name init

3. Environment Variables
Create a .env file in the root or backend directory with:

DATABASE_URL="postgresql://postgres:123@localhost:5434/nest"

4. Start the Backend Server
yarn start:dev
# or
npm run start:dev