-- SQLite
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS todos;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    username VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    title VARCHAR(140) NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    title VARCHAR(140) NOT NULL,
    content TEXT,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    user_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO users (
    username,
    password
) VALUES (
    "tame84",
    "$argon2id$v=19$m=65536,t=3,p=4$sNV95gEtzin4HETSmSLX/g$tlO5p0d/ymzFqQYLGx4fl3Pg8NuSWgjltruSMg+lZpQ"
);

INSERT INTO categories (
    title,
    user_id
) VALUES (
    "IRL",
    1
);

INSERT INTO todos (
    title,
    content,
    user_id,
    category_id
) VALUES (
    "Faire les courses",
    "Liste de courses: bananes, oeufs, lait, steak, pain",
    1,
    1
);

