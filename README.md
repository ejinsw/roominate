# Table of Contents

### Frontend
1. [Environment Setup](#environment-setup-frontend)
2. [Project Hierarchy](#project-hierarchy-1)
3. [Code Examples](#code-examples)
   - [React Components](#react-components)
   - [Server-Side](#server-side)
4. [Frontend Environment Variables](#frontend-environment-variables)

### Backend
1. [Environment Setup](#environment-setup-backend)
2. [Project Hierarchy](#project-hierarchy-2)
3. [How to Use Prisma ORM](#how-to-use-prisma-orm)
   - [Adding a Model to the Schema](#adding-a-model-to-the-schema)
   - [Relating Models](#relating-models)
   - [Updating MongoDB w/ Schema Changes](#updating-mongodb-w-schema-changes)
   - [Using Prisma Client (in code)](#using-prisma-client-in-code)
4. [Endpoints](#endpoints)
5. [Backend Environment Variables](#backend-environment-variables)

# Frontend

## Environment Setup Frontend

Run these commands

```bash
cd frontend
npm install
npm run dev
```

Create a .env file in the root directory with the following contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:9000/api
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Hierarchy
__App Router__ - Pages and Layouts hierarchy `/src/app/`

__Components__ - All accessory components organized by page `/src/components/**/*.{jsx,tsx}`

__Static__ - All static files `/public/`

__Environment Variables__ - .env file for development `/.env`

## Code Examples
### React Components
```tsx
"use client"  // Required at top of file in order to use client-side features like useState() or useEffect()

import { useState } from "react";

// Add props to interface like so...
interface Props {
    // ...add properties here 
    // i.e. 
    textField: string;
    numberField: number;
}

// Finally react function...
export function ComponentName({textField, numberField} : Props) {
    //...some code
    return <>{/* ...some html */}</>
}
```

### Server-Side
```ts
// '/src/app/<route_path>/route.ts'

// ...GET/POST/UPDATE/DELETE functions
export async function GET(request: Request) {
    // ...server-side code
}
```

**NOTE: Always fetch using env variable! This will help when deploying in the future!

# Backend

## Environment Setup Backend

Run these commands

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

Create a .env file in the root directory with the following contents:
```env
PORT=9000
DATABASE_URL="mongodb+srv://ejinsw:Bokchoy1@cluster0.0ob8v.mongodb.net/Roominate?retryWrites=true&w=majority&appName=Cluster0"
```

This will start the server by default on [http://localhost:9000](http://localhost:9000).

## Project Hierarchy
__Server__ - Node.js Server `/src/app.ts`

__Routes__ - All route handlers `/src/routes/**/*.{js,ts}`

__Controllers__ - All controller handlers `/src/controllers/**/*.{js,ts}`

__Typing__ - TypeScript Global interface `/src/types/index.d.ts`

__Prisma__ - Prisma Schema `/prisma/schema.prisma` Prisma Client `/src/config/prisma.ts`

__Environment Variables__ - .env file for development `/.env`

## How to Use Prisma ORM
Prisma ORM provides 

### Adding a Model to the Schema
Models are Prisma's way of creating a MongoDB collection or a PostgreSQL table while using syntax similar to creating a JavaScript object.

Each one requires an __id__ field which should be written exactly as shown.
```prisma
model ModelName {
  id String @id @default(auto()) @map("_id") @db.ObjectId 
  //...additional fields
}
```

Other fields can be created the same way one might expect with the pattern being `name Type <Options>` and can be made optional with a `?` placed directly after the name.

## Relating Models
Relating models can be done as so...
```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId

  posts     Post[] // One-to-many relation
}

model Post {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
    //...fields

  userId    String     @db.ObjectId // required parent id
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade) // reference to parent
}
```

### Updating MongoDB w/ Schema Changes
After making changes to the schema, the DB will not be aligned. You must push changes using the Prisma CLI using the following terminal command:
```bash
npx prisma db push
```

### Using Prisma Client (in code)
Prisma Client makes accessing collections and querying databases into a simple process of calling methods. 

First import Prisma Client from `/src/config/prisma.ts` like so... 

```ts
import { prisma } from "../config/prisma"; // path may vary based on location
```

Then call its methods like any other object!

__Useful Methods__
- Adding to a collection `const newUser = await prisma.user.create({ data: { ...fields... }, });`
- Retrieve all in a collection `const allUsers = await prisma.user.findMany({ include: { ...fields... } })`
- Retrieve a single entry `const specificUser = await prisma.user.findUnique({ where { ...filter... } })`
- Remove a single entry `await prisma.user.delete({ where: { ...filter... } })`
- Update an entry `await prisma.user.delete({ where: { ...filter... }, data: { ...updated fields... } })`
