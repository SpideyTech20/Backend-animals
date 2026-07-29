CREATE TABLE IF NOT EXISTS animals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    num_legs INT NOT NULL
);

INSERT INTO animals (name, num_legs)
VALUES
('DOG', 4),
('CAT', 4),
('SPIDER', 8),
('CHICKEN', 2);