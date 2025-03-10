import { query } from "~/utils/pool";
import type { User } from "~/types";

export class UserModel {
  static async findOrCreate({ email, name, googleId, picture }: { email: string; name: string; googleId: string; picture?: string }): Promise<User> {
    try {
      const result = await query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0] as unknown as { userid: number; email: string; name: string; google_id: string; picture: string | null };
        const mappedUser: User = {
          id: row.userid,
          email: row.email,
          name: row.name,
          googleId: row.google_id,
          picture: row.picture,
        };
        return mappedUser;
      }

      const newUser = await query(
        "INSERT INTO users (email, name, google_id, picture) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, name, googleId, picture || null]
      );

      const insertedRow = newUser.rows[0] as unknown as { userid: number; email: string; name: string; google_id: string; picture: string | null };
      const mappedInsertedUser: User = {
        id: insertedRow.userid,
        email: insertedRow.email,
        name: insertedRow.name,
        googleId: insertedRow.google_id,
        picture: insertedRow.picture,
      };
      return mappedInsertedUser;
    } catch (error) {
      console.error("Database error in findOrCreate:", error);
      throw error;
    }
  }
}