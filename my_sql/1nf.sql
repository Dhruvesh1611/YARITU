CREATE TABLE CollegeStudents_1NF (
    StudentID INT,
    StudentName VARCHAR(100) NOT NULL,
    DeptHead VARCHAR(100),
    CourseID VARCHAR(20),
    CourseName VARCHAR(100),
    Marks DECIMAL(5,2),
    Semester INT,
    CollegeName VARCHAR(150),
    CollegeAddress VARCHAR(255),
    PRIMARY KEY (StudentID, CourseID)  
);
INSERT INTO CollegeStudents_1NF
(StudentID, StudentName, DeptHead, CourseID, CourseName, Marks, Semester, CollegeName, CollegeAddress)
VALUES
(1, 'Rahul Sharma', 'Dr. Mehta', 'C101', 'Database Systems', 88.50, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(2, 'Priya Patel', 'Dr. Mehta', 'C101', 'Database Systems', 76.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(2, 'Priya Patel', 'Dr. Mehta', 'C102', 'Operating Systems', 76.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(3, 'Amit Verma', 'Dr. Singh', 'C103', 'Computer Networks', 92.00, 4, 'ABC College', 'Ahmedabad, Gujarat'),
(4, 'Neha Gupta', 'Dr. Mehta', 'C101', 'Database Systems', 85.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(5, 'Rahul Sharma', 'Dr. Mehta', 'C101', 'Database Systems', 70.00, 3, 'ABC College', 'Ahmedabad, Gujarat'),
(5, 'Rahul Sharma', 'Dr. Mehta', 'C102', 'Operating Systems', 70.00, 3, 'ABC College', 'Ahmedabad, Gujarat');

SELECT * FROM CollegeStudents_1NF;