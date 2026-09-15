CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    avatar VARCHAR(255) NULL,

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS roles_request (
    roles_id INT NOT NULL,
    sender_id INT NOT NULL,
    character_id INT NOT NULL UNIQUE,
    cover_letter VARCHAR(255) NULL,

    FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE CASCADE 
);