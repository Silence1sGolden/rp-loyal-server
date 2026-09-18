SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

CREATE TABLE IF NOT EXISTS stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    preview_id INT NULL,
    play_type ENUM('1v1', 'group') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Связь с таблицей пользователей
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS story_play_styles (
    story_id INT NOT NULL,
    play_style ENUM('one-line', 'semi-para', 'para+', 'novella') NOT NULL,

    PRIMARY KEY (story_id, play_style),
    -- Связь с таблицей историй
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS story_tags (
    story_id INT NOT NULL,
    tag_slug VARCHAR(100) NOT NULL,

    PRIMARY KEY (story_id, tag_slug),

    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_slug) REFERENCES tags(slug) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS story_applications (
    id VARCHAR(255) NOT NULL UNIQUE,
    story_id INT NOT NULL,
    character_id INT NOT NULL,
    author_id INT NOT NULL,
    covering_letter VARCHAR(300) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (story_id, character_id),
    -- Связь с таблицей историй и пользователей
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);