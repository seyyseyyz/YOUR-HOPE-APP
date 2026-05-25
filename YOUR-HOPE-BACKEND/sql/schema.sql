CREATE DATABASE IF NOT EXISTS your_hope_db;

USE your_hope_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    status ENUM('active', 'inactive', 'blocked')
    DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE dass_test_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    depression_score INT NOT NULL,
    anxiety_score INT NOT NULL,
    stress_score INT NOT NULL,

    depression_level ENUM(
        'Normal',
        'Mild',
        'Moderate',
        'Severe',
        'Extremely Severe'
    ) NOT NULL,

    anxiety_level ENUM(
        'Normal',
        'Mild',
        'Moderate',
        'Severe',
        'Extremely Severe'
    ) NOT NULL,

    stress_level ENUM(
        'Normal',
        'Mild',
        'Moderate',
        'Severe',
        'Extremely Severe'
    ) NOT NULL,

    test_language ENUM('eng', 'kh')
    DEFAULT 'eng',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE dass_test_answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,

    result_id INT NOT NULL,

    question_id INT NOT NULL,

    category ENUM('d', 'a', 's') NOT NULL,

    answer_value TINYINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (result_id)
    REFERENCES dass_test_results(result_id)
    ON DELETE CASCADE
);
