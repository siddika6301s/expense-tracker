CREATE DATABASE IF NOT EXISTS ayesha_expense_tracker;
USE ayesha_expense_tracker;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  category_type VARCHAR(20) NOT NULL,
  CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  description VARCHAR(255),
  transaction_date DATE NOT NULL,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS budgets (
  budget_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
  UNIQUE KEY unique_category_month (user_id, category_id, month, year)
);

-- The browser-only version starts with localStorage and does not require sample rows.
