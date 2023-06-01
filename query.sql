SELECT r.title, r.salary, d.name AS department_name
FROM role r
JOIN department d ON r.department_id = d.id;


SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS manager 
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d ON d.id = r.department_id
LEFT JOIN employee AS mgr ON mgr.id = e.manager_id
ORDER BY e.id ASC;

