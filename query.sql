SELECT role.title, role.salary, department.name AS department_name
FROM role
JOIN department ON role.department_id = department.id;


SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id
FROM employee
JOIN role ON employee.role_id = role.id
JOIN employee ON employee.manager_id = employee.id;
