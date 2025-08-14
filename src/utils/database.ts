import { Note } from "@/types/db";
import { PGlite } from "@electric-sql/pglite";

export const db = new PGlite("idb://my-pgdata");

export class Database {
  static async getNotes(): Promise<Note[]> {
    const notes = await db.exec("SELECT * FROM notes");
    return notes[0].rows as Note[];
  }

  static async initialize() {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY, 
        title TEXT, 
        content TEXT, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static async createNote(note: Omit<Note, 'created_at' | 'updated_at'>) {
    await db.exec(
      `INSERT INTO notes (id, title, content) VALUES (${note.id}, '${note.title}', '${note.content}')`
    );
  }

  static async updateNote(note: Pick<Note, 'title' | 'content'>, noteId: number) {
    await db.exec(
      `UPDATE notes SET title = '${note.title}', content = '${note.content}', updated_at = CURRENT_TIMESTAMP WHERE id = ${noteId} RETURNING *`
    );
  }

  static async deleteNote(noteId: number) {
    await db.exec(`DELETE FROM notes WHERE id = ${noteId}`);
  }

  static async getNoteById(noteId: number) {
    const note = await db.exec(`SELECT * FROM notes WHERE id = ${noteId}`);
    return note[0].rows[0] as Note;
  }

  static async resetDatabase() {
    await db.exec(`DROP TABLE IF EXISTS notes`);
    await this.initialize();
  }
}

