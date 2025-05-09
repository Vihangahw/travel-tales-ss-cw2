const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./travel_tales.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    username TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    country_name TEXT,
    visit_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER,
    followed_id INTEGER,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER,
    post_id INTEGER,
    is_like BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id)
  )`);
});

module.exports = db;