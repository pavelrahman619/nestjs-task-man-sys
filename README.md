# Task Management System

A full-stack task management application built with NestJS (backend) and React (frontend).

## Features

- **Authentication**: JWT-based login/registration with secure token management
- **Task Management**: Create, read, update, and delete tasks with status tracking
- **User-Specific Data**: Each user can only access their own tasks
- **Real-time Updates**: Optimistic UI updates with TanStack Query
- **Responsive Design**: Modern React components with CSS styling

## Tech Stack

**Backend (NestJS)**
- NestJS with TypeScript
- Prisma ORM with PostgreSQL
- JWT Authentication with Passport
- RESTful API design
- Docker for development database

**Frontend (React)**
- React 19 with Vite
- TanStack Query for state management
- Context API for authentication
- Modern hooks and components
- CSS modules for styling

## Quick Start

### Backend Setup

### 1. Install Dependencies

```sh
cd backend
yarn install
# or
npm install
```

### 2. Setup Database

```sh
# Initialize Prisma (if not already done)
npx prisma init --datasource-provider postgresql --output ../generated/prisma

# Generate Prisma Client
npx prisma generate

# Run migrations (after editing schema.prisma)
npx prisma migrate dev --name init
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:123@localhost:5434/nest"
```

### 4. Start the Backend Server

```sh
yarn start:dev
# or
npm run start:dev
```

### Frontend Setup

```sh
cd frontend
yarn install
yarn dev
```

## Screenshots

<img src="./images/Screenshot%202025-08-02%20171334.png" width="100%" alt="Task Management System Screenshot 1" >

<img src="./images/Screenshot%202025-08-02%20171303.png" width="100%" alt="Task Management System Screenshot 2" >

<img src="./images/Screenshot%202025-08-02%20171223.png" width="100%" alt="Task Management System Screenshot 3" >

<img src="./images/Screenshot%202025-08-02%20171352.png" width="100%" alt="Task Management System Screenshot 4" >
