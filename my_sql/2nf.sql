CREATE DATABASE CollegeDB;
USE CollegeDB;
CREATE TABLE CollegeStudents (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(100) NOT NULL,
    DeptHead VARCHAR(100),
    CourseIDs VARCHAR(255),
    CourseNames VARCHAR(255),
    Marks DECIMAL(5,2),
    Semester INT,
    CollegeName VARCHAR(150),
    CollegeAddress VARCHAR(255)
);
INSERT INTO CollegeStudents 
(StudentID, StudentName, DeptHead, CourseIDs, CourseNames, Marks, Semester, CollegeName, CollegeAddress)
VALUES
(1, 'Rahul Sharma', 'Dr. Mehta', 'C101', 'Database Systems', 88.50, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(2, 'Priya Patel', 'Dr. Mehta', 'C101,C102', 'Database Systems,Operating Systems', 76.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(3, 'Amit Verma', 'Dr. Singh', 'C103', 'Computer Networks', 92.00, 4, 'ABC College', 'Ahmedabad, Gujarat'),
(4, 'Neha Gupta', 'Dr. Mehta', 'C101', 'Database Systems', 85.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(5, 'Rahul Sharma', 'Dr. Mehta', 'C101,C102', 'Database Systems,Operating Systems', 70.00, 3, 'ABC College', 'Ahmedabad, Gujarat');

SELECT * FROM CollegeStudents;