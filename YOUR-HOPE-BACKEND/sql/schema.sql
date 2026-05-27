CREATE DATABASE IF NOT EXISTS your_hope_db
		CHARACTER SET utf8mb4
		COLLATE utf8mb4_unicode_ci;

USE your_hope_db;

-- ── USERS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    user_id       INT           AUTO_INCREMENT PRIMARY KEY,

    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    job           VARCHAR(120)  NULL,
    age           TINYINT       NULL CHECK (age IS NULL OR age BETWEEN 1 AND 120),
    gender        ENUM('male','female','other','prefer_not_to_say') NULL,
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

-- ── CLINICS / MENTAL HEALTH SERVICES ──────────────────────────────
CREATE TABLE IF NOT EXISTS clinics (
    clinic_id      INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(180) NOT NULL,
    type           ENUM('Clinic','Hospital','NGO','Service') NOT NULL DEFAULT 'Clinic',
    category       VARCHAR(120) NULL,
    location       VARCHAR(150) NULL,
    phone          VARCHAR(50)  NULL,
    email          VARCHAR(150) NULL,
    website        VARCHAR(255) NULL,
    map_url        VARCHAR(500) NULL,
    opening_hours  VARCHAR(255) NULL,
    target_group   VARCHAR(150) NULL,
    nssf           ENUM('Yes','No') DEFAULT 'No',
    services       TEXT NULL,
    description    TEXT NULL,
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_clinic_type (type),
    INDEX idx_clinic_nssf (nssf),
    INDEX idx_clinic_location (location),
    FULLTEXT INDEX ft_clinic_search (name, category, location, services, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── APPOINTMENTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    clinic_id        INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason           VARCHAR(500) NULL,
    status           ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(clinic_id) ON DELETE CASCADE,
    INDEX idx_appointment_user_date (user_id, appointment_date),
    INDEX idx_appointment_clinic_date (clinic_id, appointment_date),
    INDEX idx_appointment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── RECOMMENDATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    level             ENUM('Normal','Mild','Moderate','Severe','Extremely Severe') NOT NULL,
    language          ENUM('eng','kh') NOT NULL DEFAULT 'eng',
    title             VARCHAR(180) NOT NULL,
    summary           TEXT NOT NULL,
    tips              JSON NULL,
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_recommendation_level_lang (level, language),
    INDEX idx_recommendation_level (level),
    INDEX idx_recommendation_lang (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── CHAT MESSAGES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    role       ENUM('user','assistant') NOT NULL,
    message    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── MOTIVATIONAL QUOTES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
    quote_id   INT AUTO_INCREMENT PRIMARY KEY,
    quote_text TEXT NOT NULL,
    language   ENUM('eng','kh') NOT NULL DEFAULT 'eng',
    category   VARCHAR(60) DEFAULT 'hope',
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quote_lang_active (language, is_active),
    INDEX idx_quote_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── STARTER DATA ──────────────────────────────────────────────────
INSERT IGNORE INTO recommendations (level, language, title, summary, tips) VALUES
('Normal','eng','Normal Level','Your scores are in a healthy range. Keep maintaining good mental health habits.', JSON_ARRAY('Keep a regular sleep schedule.','Exercise regularly.','Practice mindfulness or journaling.')),
('Mild','eng','Mild Level','Some symptoms are present. Small daily habits may help improve your mental wellness.', JSON_ARRAY('Reduce screen time before sleep.','Talk with someone you trust.','Use short breathing exercises.')),
('Moderate','eng','Moderate Level','Your symptoms are more noticeable. Consider getting support early.', JSON_ARRAY('Consider speaking with a counselor.','Build a bedtime routine.','Use gentle exercise or mindfulness.')),
('Severe','eng','Severe Level','Your symptoms are high. Professional support is strongly recommended.', JSON_ARRAY('Contact a mental health professional.','Visit a clinic or hospital if symptoms affect daily life.','Ask someone trusted to support you.')),
('Extremely Severe','eng','Extremely Severe Level','Your symptoms are very severe. Please seek professional help as soon as possible.', JSON_ARRAY('Contact professional support immediately.','Use emergency support if necessary.','Do not handle this alone.')),
('Normal','kh','កម្រិតធម្មតា','ពិន្ទុរបស់អ្នកស្ថិតក្នុងកម្រិតល្អ។ សូមបន្តរក្សាទម្លាប់ល្អសម្រាប់សុខភាពផ្លូវចិត្ត។', JSON_ARRAY('រក្សាកាលវិភាគគេងឱ្យបានទៀងទាត់។','ហាត់ប្រាណឱ្យបានទៀងទាត់។','សាកល្បងសរសេរកំណត់ហេតុ ឬហាត់ដកដង្ហើម។')),
('Mild','kh','កម្រិតស្រាល','មានរោគសញ្ញាមួយចំនួន។ ទម្លាប់ល្អប្រចាំថ្ងៃអាចជួយឱ្យសុខភាពផ្លូវចិត្តប្រសើរឡើង។', JSON_ARRAY('កាត់បន្ថយការប្រើទូរស័ព្ទមុនគេង។','និយាយជាមួយមនុស្សដែលអ្នកទុកចិត្ត។','សាកល្បងលំហាត់ដកដង្ហើមខ្លីៗ។'));

INSERT IGNORE INTO quotes (quote_text, language, category) VALUES
('Healing takes time, and asking for help is a courageous step.', 'eng', 'hope'),
('Your feelings are valid, and your story matters.', 'eng', 'support'),
('Small progress is still progress.', 'eng', 'growth'),
('Mental health is just as important as physical health.', 'eng', 'wellness'),
('ការជាសះស្បើយត្រូវការពេលវេលា ហើយការសុំជំនួយគឺជាជំហានដ៏ក្លាហាន។', 'kh', 'hope'),
('អារម្មណ៍របស់អ្នកមានតម្លៃ ហើយរឿងរ៉ាវរបស់អ្នកសំខាន់។', 'kh', 'support'),
('ការរីកចម្រើនតិចតួច ក៏នៅតែជាការរីកចម្រើន។', 'kh', 'growth');



DESCRIBE users;
DESCRIBE dass_test_results;
DESCRIBE dass_test_answers;

select *from users;
select *from dass_test_answers;
select *from dass_test_results;
