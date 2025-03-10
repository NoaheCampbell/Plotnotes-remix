import { query } from "~/utils/pool";

export interface Term {
  id: number;
  userId: number;
  term: string;
  description: string;
  category?: string;
}

export class TermModel {
  // Create a new term
  static async create({ userId, term, description, category }: { userId: number; term: string; description: string; category?: string }): Promise<Term> {
    const result = await query(
      "INSERT INTO terms (user_id, term, description, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, term, description, category || null]
    );
    const row = result.rows[0] as unknown as Term;
    return row;
  }

  // Find all terms for a user
  static async findByUserId(userId: number): Promise<Term[]> {
    const result = await query(
      "SELECT * FROM terms WHERE user_id = $1",
      [userId]
    );
    return result.rows as unknown as Term[]; // Cast to unknown first, then to Term[]
  }

  // Find a term by ID
  static async findById(id: number): Promise<Term | null> {
    const result = await query(
      "SELECT * FROM terms WHERE id = $1",
      [id]
    );
    const row = result.rows[0];
    return row ? (row as unknown as Term) : null;
  }

  // Update a term
  static async update(id: number, updates: { term?: string; description?: string; category?: string }): Promise<Term> {
    const { term, description, category } = updates;
    const result = await query(
      "UPDATE terms SET term = COALESCE($1, term), description = COALESCE($2, description), category = COALESCE($3, category) WHERE id = $4 RETURNING *",
      [term || null, description || null, category || null, id]
    );
    const row = result.rows[0] as unknown as Term;
    return row;
  }

  // Delete a term
  static async delete(id: number): Promise<void> {
    await query(
      "DELETE FROM terms WHERE id = $1",
      [id]
    );
  }
}