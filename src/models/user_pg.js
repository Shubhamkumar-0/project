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
