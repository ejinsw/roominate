# Table of Contents

### Frontend
- [Environment Setup](#environment-setup)
- [Project Hierarchy](#project-hierarchy)
- [Code Examples](#code-examples)
  - [React Components](#react-components)
  - [Server-Side](#server-side)

### Backend
- [Environment Setup](#environment-setup)
- [Project Hierarchy](#project-hierarchy)
- [Endpoints](#endpoints)

# Frontend

## Environment Setup

Run these commands

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Hierarchy
__App Router__ - Pages and Layouts hierarchy `/src/app/`

__Components__ - All accessory components organized by page `/src/components/**/*.{jsx,tsx}`

__Static__ - All static files `/public/`

__Environment Variables__ - .env file for development `/next-env.d.ts`

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

# Backend

## Environment Setup

Run these commands

```bash
npm install
npm run dev
```

This will start the server by default on [http://localhost:9000](http://localhost:9000).

## Project Hierarchy
__Server__ - Node.js Server `/src/app.ts`

__Routes__ - All route handlers `/src/routes/**/*.{js,ts}`

__Controllers__ - All controller handlers `/src/controllers/**/*.{js,ts}`

__Typing__ - TypeScript Global interface `/src/types/index.d.ts`

__Environment Variables__ - .env file for development `/.env`

## Endpoints
* TODO: List all endpoints here
