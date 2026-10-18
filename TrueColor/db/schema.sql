-- Portable schema (MySQL/MariaDB and SQLite). Timestamps are unix seconds.
CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(32) NOT NULL PRIMARY KEY,
  invite_token CHAR(32) NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  match_score INTEGER NULL,
  passed INTEGER NULL,
  final_score INTEGER NULL,
  final_json TEXT NULL
);

CREATE TABLE IF NOT EXISTS participants (
  id CHAR(32) NOT NULL PRIMARY KEY,
  session_id CHAR(32) NOT NULL,
  role CHAR(1) NOT NULL,
  secret_hash CHAR(64) NOT NULL UNIQUE,
  name VARCHAR(40) NOT NULL,
  quiz_answers TEXT NULL,
  profile TEXT NULL,
  portal_answers TEXT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (session_id, role)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash CHAR(64) NOT NULL,
  created_at INTEGER NOT NULL
);
