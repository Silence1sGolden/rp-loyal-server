SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (filename, path)
VALUES ('5c206c7a-44f0-464e-b628-56bc1b5a6159.webp', '/uploads/5c206c7a-44f0-464e-b628-56bc1b5a6159.webp'),
       ('843acb45-e1d8-4c51-9668-13126eb46cba.webp', '/uploads/843acb45-e1d8-4c51-9668-13126eb46cba.webp');
