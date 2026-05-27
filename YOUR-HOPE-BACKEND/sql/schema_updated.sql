-- ═══════════════════════════════════════════════════════════════════
--  YOUR HOPE — migrate.sql
--  Run this on your EXISTING database to add the missing columns
--  and indexes WITHOUT losing any data.
--
--  Run:  mysql -u root -p your_hope_db < sql/migrate.sql
-- ═══════════════════════════════════════════════════════════════════
USE your_hope_db;

-- ── STEP 1: Fix charset on all tables ──────────────────────────────
ALTER TABLE users
    CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE dass_test_results
    CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE dass_test_answers
    CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ── STEP 2: Add missing columns to users ───────────────────────────
ALTER TABLE users
    ADD COLUMN lang          ENUM('eng', 'kh')                     DEFAULT 'eng'    AFTER password_hash,
    ADD COLUMN role          ENUM('user', 'admin')                  DEFAULT 'user'   AFTER lang,
    ADD COLUMN last_login_at TIMESTAMP NULL                                          AFTER status;


-- ── STEP 3: Add worst_level column to dass_test_results ────────────
ALTER TABLE dass_test_results
    ADD COLUMN worst_level ENUM(
        'Normal',
        'Mild',
        'Moderate',
        'Severe',
        'Extremely Severe'
    ) NOT NULL DEFAULT 'Normal' AFTER stress_level;

-- Back-fill worst_level for any existing rows
-- (picks whichever of the three levels is the most severe)
UPDATE dass_test_results
SET worst_level = CASE
    WHEN GREATEST(
        FIELD(depression_level, 'Normal','Mild','Moderate','Severe','Extremely Severe'),
        FIELD(anxiety_level,    'Normal','Mild','Moderate','Severe','Extremely Severe'),
        FIELD(stress_level,     'Normal','Mild','Moderate','Severe','Extremely Severe')
    ) = FIELD(depression_level, 'Normal','Mild','Moderate','Severe','Extremely Severe')
        THEN depression_level
    WHEN GREATEST(
        FIELD(depression_level, 'Normal','Mild','Moderate','Severe','Extremely Severe'),
        FIELD(anxiety_level,    'Normal','Mild','Moderate','Severe','Extremely Severe'),
        FIELD(stress_level,     'Normal','Mild','Moderate','Severe','Extremely Severe')
    ) = FIELD(anxiety_level, 'Normal','Mild','Moderate','Severe','Extremely Severe')
        THEN anxiety_level
    ELSE stress_level
END
WHERE result_id > 0;


-- ── STEP 4: Add answer_value constraint to dass_test_answers ───────
ALTER TABLE dass_test_answers
    MODIFY COLUMN answer_value TINYINT NOT NULL CHECK (answer_value BETWEEN 0 AND 3);


-- ── STEP 5: Add missing indexes ────────────────────────────────────
-- Check and add index on users.email
ALTER TABLE users
    ADD INDEX idx_email (email);

-- Check and add composite index on dass_test_results (user_id, created_at)
ALTER TABLE dass_test_results
    ADD INDEX idx_user_created (user_id, created_at DESC);

-- Check and add index on dass_test_answers.result_id
ALTER TABLE dass_test_answers
    ADD INDEX idx_result (result_id);


-- ── VERIFY ─────────────────────────────────────────────────────────
-- Run these SELECTs to confirm everything looks correct after migration

DESCRIBE users;
DESCRIBE dass_test_results;
DESCRIBE dass_test_answers;