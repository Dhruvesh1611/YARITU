CREATE DATABASE mydb;
USE mydb;

CREATE TABLE students (
    roll_no INT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    city VARCHAR(100)
);

INSERT INTO students(roll_no, name, age, city) VALUES
(1, 'dhruvesh shyara', 20, 'Vadodara'),
(2, 'Khushi Patel', 19, 'Surat'),
(3, 'kanishka trivedi', 21, 'Rajkot');

SELECT * FROM students;