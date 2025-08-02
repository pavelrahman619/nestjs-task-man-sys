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


5. Start Prisma
yarn prisma studio


Reference:
https://www.youtube.com/watch?v=GHTA143_b-s

App Screenshots:

<img width="1913" height="922" alt="image" src="https://github.com/user-attachments/assets/de3353e3-8ada-4217-a8e9-a37ae7c6f847" />

<img width="1915" height="928" alt="image" src="https://github.com/user-attachments/assets/9c688a20-ad7f-47db-9671-2f3a18e638f5" />

<img width="1914" height="925" alt="image" src="https://github.com/user-attachments/assets/d8e0211e-c791-4383-8b2e-5ce4d3f1aeed" />

<img width="1915" height="924" alt="image" src="https://github.com/user-attachments/assets/a3a99741-2af5-4916-a33b-e1a0aae22318" />

// add these images
![Screenshot 2025-08-02 171334](./images/Screenshot%202025-08-02%20171334.png)
![Screenshot 2025-08-02 171303](./images/Screenshot%202025-08-02%20171303.png)
![Screenshot 2025-08-02 171223](./images/Screenshot%202025-08-02%20171223.png)
![Screenshot 2025-08-02 171352](./images/Screenshot%202025-08-02%20171352.png)
