// app/types.ts
export interface User {
    id: number;
    email: string;
    name: string;
    googleId: string;
    picture?: string | null;
  }