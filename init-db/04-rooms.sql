CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    avatar VARCHAR(255) NULL,
    is_archive BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS room_characters (
    room_id INT NOT NULL,
    character_id INT NOT NULL,

    PRIMARY KEY (room_id, character_id),

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room_users (
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, room_id),

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    character_id INT NOT NULL,
    action_type ENUM('action', 'dialogue', 'thought', 'event'),
    message_text TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);