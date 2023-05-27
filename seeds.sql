INSERT INTO department (name)
VALUES ("Parks"),
       ("Administration"),
       ("Health and Human Services"), 
       ("Public Works");

INSERT INTO role (title, salary, department_id) 
VALUES ('Manager', 50000.00, 1),
       ('Deputy Director', 60000.00, 2),
       ('Parks Planner', 45000.00, 1),
       ('Nurse', 40000.00, 3),
       ('Maintenance Worker', 35000.00, 4),
       ('Auditor', 55000.00, 2),
       ('Director of Public Works', 70000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Leslie', 'Knope', 1, null),
       ('Ron', 'Swanson', 2, 1),
       ('Ann', 'Perkins', 4, 1),
       ('April', 'Ludgate', 3, 1),
       ('Andy', 'Dwyer', 5, 1),
       ('Tom', 'Haverford', 3, 1),
       ('Donna', 'Meagle', 3, 2),
       ('Jerry', 'Gergich', 3, 4),
       ('Chris', 'Traeger', 6, 3),
       ('Ben', 'Wyatt', 6, 4);       