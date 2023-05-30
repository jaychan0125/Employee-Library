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
            console.log(`SELECTED: ${directory}`    );
            directoryChoice(directory)
            //switch statement to functions calls 
        })
        .catch((err) => {
            console.error(err);
        })
};


function directoryChoice(directory) {
    switch (directory) {
        // view
        case 'View all departments':
            db.query('SELECT * FROM department', (err, results) => {
                if (err) {
                    console.error(err);
                }
                console.log('View all departments');
                console.table(results);
            });
            init();
            break;
        case 'View all roles':
            db.query('SELECT role.id, role.title, department.name AS department,  role.salary FROM role JOIN department ON role.department_id = department.id;', (err, results) => {
                if (err) {
                    console.error(err);
                }
                console.log('View all roles');
                console.table(results);
            });
            init();
            break;
        case 'View all employees':
            db.query('SELECT * FROM employee', (err, results) => {
                if (err) {
                    console.error(err);
                }
                console.log('View all employees');
                console.table(results);
            });
            init();
            break;
        // add
        case 'Add a department':
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
                        db.query('SELECT * FROM department', (err, results) => {
                            if (err) {
                                console.error(err);
                            }
                            console.table(results);
                        });
                    })
                    init();
                });
            break;
        case 'Add a role':
            db.query('SELECT * FROM department', (err, results) => {
                const departments = results.map(results => (`${results.id}. ${results.name}`))
            });
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
                    name: 'departmentId',
                    choices: department,

                }
            ])
                .then((results) => {
                    const { roleTitle, salary, departmentId } = results;
                    console.log(`the role to be added is ${roleTitle}`)
                    db.query('INSERT INTO department (title, salary, department_id) VALUES (?, ?, ?);', [roleTitle, salary, departmentId], (err, results) => {
                        if (err) {
                            console.error(err);
                        }
                        console.log(`${roleTitle} successfully added!`, results);
                        db.query('SELECT * FROM department', (err, results) => {
                            if (err) {
                                console.error(err);
                            }
                            console.table(results);
                        });
                    })
                    init();
                });
            break;
        case 'Add an employee':
            return console.log('Add an employee');
            break;
        // update
        case 'Update an employee role':
            return console.log('Update an employee role');
            break;
        case 'Exit':
            return;
            break;
    }
};

