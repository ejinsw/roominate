declare global {
  export interface User {
    // TODO: Add User fields
  }
  declare namespace Express {
    // TODO: Add the rest of the schema (...or import types from ORM)
    export interface Request {
      user: User;
    }
  }
}

export {};
