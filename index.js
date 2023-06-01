require('dotenv').config()
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//CONNECT TO THE LOCAL DATABASE
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: 'employee_tracker_db'
    },
);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
        return;
    }
    console.log(`Connected to the database`);
    init();
});

function directoryChoice(directory, callback) {
    switch (directory) {
        // view
        case 'View all departments':
            displayDepartments(callback);
            break;
        case 'View all roles':
            displayRoles(callback);
            break;
        case 'View all employees':
            displayEmployees(callback);
            break;
        // add
        case 'Add a department':
            addDepartment(callback);
            break;
        case 'Add a role':
            addRole(callback);
            break;
        case 'Add an employee':
            addEmployee(callback);
            break;
        // update
        case 'Update an employee role':
            updateEmployee(callback);
            break;
        case 'Exit':
            db.end();
            break;
    }
};

// initialize and show directory 
function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                messages: 'What do you wanna do?',
                name: 'directory',
                choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit']
            }
        ])
        .then((response) => {
            const directory = response.directory
            console.log(`SELECTED: ${directory}`);
            // run switch statement function with parameter:directory, THEN init() after directoryChoice() as a callback function
            directoryChoice(directory, () => {
                init();
            });
        })
        .catch((err) => {
            console.error(err);
        });
};

// display:
function displayDepartments(callback) {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.error(err);
        }
        console.table(results, [], [], 20);
        callback();
    });
};

function displayRoles(callback) {
    db.query('SELECT role.id, role.title, department.name AS department,  role.salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
        if (err) {
            console.error(err);
        }
        console.table(results, [], [], 20);
        callback();
    });
};

function displayEmployees(callback) {
    db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS manager FROM employee e JOIN role r ON r.id = e.role_id JOIN department d ON d.id = r.department_id LEFT JOIN employee AS mgr ON mgr.id = e.manager_id ORDER BY e.id ASC;', (err, results) => {
        if (err) {
            console.error(err);
        }
        console.table(results, [], [], 20);
        callback();
    });
};

// add:
function addDepartment(callback) {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the name of the department you would like to insert.',
            name: 'departmentName'
        }
    ])
        .then((results) => {
            const departmentName = results.departmentName
            console.log(`the department name to be added is ${departmentName}`)
            db.query('INSERT INTO department (name) VALUES (?);', departmentName, (err, results) => {
                if (err) {
                    console.error(err);
                }
                console.log(`${departmentName} successfully added!`, results);
            });
            // displayDepartments();
            callback();
        });
};

function addRole(callback) {
    db.query('SELECT * FROM department', (err, results) => {
        const departments = results.map(results => (`${results.id}. ${results.name}`))
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the name of the role you would like to insert.',
                name: 'roleTitle'
            },
            {
                type: 'number',
                message: 'Enter the salary of role (eg, 50000.00).',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Enter the department the role belongs to.',
                name: 'departmentIdName',
                choices: departments,
            }
        ])
            .then((results) => {
                const { roleTitle, salary, departmentIdName } = results;
                const [id, name] = departmentIdName.split('. ');
                const departmentId = parseInt(id);
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [roleTitle, salary, departmentId], (err, results) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(`${roleTitle} successfully added!`, results);
                });
                // displayRoles();
                callback();
            })
    });
};

function addEmployee(callback) {
    db.query('SELECT * FROM role;', (err, roleResults) => {
        const roleChoices = roleResults.map((roleResults) => (
            {
                name: `${roleResults.id}. ${roleResults.title}`,
                value: roleResults.id
            }
        ));
        db.query('SELECT * FROM employee', (err, empResults) => {
            const managers = empResults.map((empResult) => (
                {
                    name: `${empResult.id}. ${empResult.first_name} ${empResult.last_name}`,
                    value: empResult.id
                }
            ));
            //create a managerChoices array COMBINING value:null AND the managers array just made^ (...managers)
            const managerChoices = [{ name: 'No Managaer', value: null }, ...managers];
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Enter the first name of the employee you would like to insert.',
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: 'Enter the last name of the employee you would like to insert.',
                    name: 'lastName'
                },
                {
                    type: 'list',
                    message: 'Please choose a role Id for the employee.',
                    name: 'roleId',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    message: 'Please choose a manager for the employee.',
                    name: 'managerId',
                    choices: managerChoices
                }
            ])
                .then((results) => {
                    const { firstName, lastName, roleId, managerId } = results;
                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [firstName, lastName, roleId, managerId], (err, results) => {
                        if (err) {
                            console.error(err);
                        }
                        console.log(`${firstName} successfully added!`, results);
                        // displayEmployees();
                        callback();
                    });
                });
        });
    });
};

// update:
function updateEmployee(callback) {
    db.query('SELECT * FROM employee', (err, empResults) => {
        const employeeChoices = empResults.map((empResult) => (
            {
                name: `${empResult.id}. ${empResult.first_name} ${empResult.last_name}`,
                value: empResult.id
            }
        ));
        db.query('SELECT * FROM role', (err, roleResults) => {
            const roleChoices = roleResults.map((roleResults) => (
                {
                    name: `${roleResults.id}. ${roleResults.title}`,
                    value: roleResults.id
                }
            ))
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which employoee would you like to update?',
                    name: 'updateEmployee',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    message: 'Which role do you want to assign the selected employee?',
                    name: 'updateRole',
                    choices: roleChoices
                }
            ])
                .then((results) => {
                    const { updateRole, updateEmployee } = results;
                    db.query('UPDATE employee SET role_id = (?) WHERE id = (?);', [updateRole, updateEmployee], (err, results) => {
                        if (err) {
                            console.error(err);
                        }
                        console.log(`Employee successfully updated!`, results)
                        callback();
                    })
                });
        });
    });
};