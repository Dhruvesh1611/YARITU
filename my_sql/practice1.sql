
CREATE DATABASE employs;
USE employs;

CREATE TABLE staff (
    name VARCHAR(100),
    age INT,
    degree VARCHAR(100),
    num INT
);

SET SQL_SAFE_UPDATES = 0;

UPDATE staff
SET degree = 'MTech'
WHERE name = 'Dhruvesh Shyara';

SET SQL_SAFE_UPDATES = 1; -- (optional: turn it back on after update)



INSERT INTO staff (name, age, degree,num) VALUES
('Dhruvesh Shyara', 20, 'BTech',12345),
('Khushi Patel', 19, 'IT',12345),
('Kanishka Trivedi', 21, 'BTech',12345);


SELECT * FROM staff;
