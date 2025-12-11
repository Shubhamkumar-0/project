import pool from "../config/db_postgres.js";

// Create a new user
export const createUser = async (name, email, hashedPassword, role) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, email, hashedPassword, role];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export async function updateUserById(id, data) {
  try {
    const { name, email, password } = data;

    let query = `
      UPDATE users 
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING id, name, email, role, created_at
    `;

    let values = [name, email, id];

    // If password update required
    if (password) {
      query = `
        UPDATE users 
        SET name = $1, email = $2, password = crypt($3, gen_salt('bf'))
        WHERE id = $4
        RETURNING id, name, email, role, created_at
      `;
      values = [name, email, password, id];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("DB Update Error:", error);
    throw error;
  }
}


// Find user by email (used for login)
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

// ⭐ FIX: Add findUserById here ⭐
export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
