-- ═══════════════════════════════════════════════════════════════════
--  YOUR HOPE — schema.sql
--  Run once:  mysql -u root -p < sql/schema.sql
--
--  Changes vs original:
--  • utf8mb4 + utf8mb4_unicode_ci on every table (safe for Khmer text)
--  • users: added lang, role, last_login_at columns
--  • dass_test_results: added worst_level (computed column avoids
--    repeated GREATEST() calls in every query), added INDEX on user_id
--  • dass_test_answers: inserts now batched via one VALUES list —
--    the schema itself doesn't change, but the index on result_id
--    makes the JOIN in getResultDetail fast
-- ═══════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS your_hope_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE your_hope_db;

-- ── USERS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    user_id       INT           AUTO_INCREMENT PRIMARY KEY,

    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,

    lang          ENUM('eng','kh')                    DEFAULT 'eng',
    role          ENUM('user','admin')                DEFAULT 'user',
    status        ENUM('active','inactive','blocked') DEFAULT 'active',

    last_login_at TIMESTAMP     NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email)          -- fast lookup on login
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── DASS TEST RESULTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dass_test_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id   INT NOT NULL,

    -- Official DASS-21 scores (raw answer sum × 2)
    depression_score INT NOT NULL,
    anxiety_score    INT NOT NULL,
    stress_score     INT NOT NULL,

    -- Severity labels derived from the scores
    depression_level ENUM('Normal','Mild','Moderate','Severe','Extremely Severe') NOT NULL,
    anxiety_level    ENUM('Normal','Mild','Moderate','Severe','Extremely Severe') NOT NULL,
    stress_level     ENUM('Normal','Mild','Moderate','Severe','Extremely Severe') NOT NULL,

    -- Pre-computed worst level so we never need GREATEST() in queries
    worst_level      ENUM('Normal','Mild','Moderate','Severe','Extremely Severe') NOT NULL,

    test_language    ENUM('eng','kh') DEFAULT 'eng',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at DESC)   -- history queries
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── DASS TEST ANSWERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dass_test_answers (
    answer_id    INT      AUTO_INCREMENT PRIMARY KEY,

    result_id    INT      NOT NULL,
    question_id  INT      NOT NULL,
    category     ENUM('d','a','s') NOT NULL,
    answer_value TINYINT  NOT NULL CHECK (answer_value BETWEEN 0 AND 3),

    FOREIGN KEY (result_id) REFERENCES dass_test_results(result_id) ON DELETE CASCADE,
    INDEX idx_result (result_id)    -- fast JOIN when fetching answers by result
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;