-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    refresh_token VARCHAR(255) NULL
);

-- Insert data into the "users" table
INSERT INTO users (name, email, password, is_admin, refresh_token)
VALUES ('Admin Admin', 'admin@example.com', '$2a$10$crdgX9KRJFp66pBctcoL7eOKUO7OrC/Vfmyg9qF/pSpaR7Nvn3nEW', true, NULL),
('John Doe', 'user@example.com', '$2a$10$VNVjiegJzCoJvzsPeMuTVOdyOSIgKsk4WfnC9XimAV7LcUY4qIodC', false, NULL);
