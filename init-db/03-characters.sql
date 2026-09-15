CREATE TABLE IF NOT EXISTS characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NULL,
    avatar_id INT NULL,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255) NULL,
    gender VARCHAR(255) NULL,
    age INT NULL,
    appearance TEXT NULL,
    history TEXT NULL
);