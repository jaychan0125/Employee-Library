DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE 
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    first_name VARCHAR(30), 
    last_name VARCHAR(30),0
 0 0 0 role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- view tables:
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

-- add into: 
INSERT INTO department (name) 
VALUES (?);

INSERT INTO role (title, salary, department_id) 
VALUES (?, ?, ?);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES (?, ?, ?, ?);

-- update employee role: 
UPDATE employee 
SET role_id = (?)
WHERE id = (?);



