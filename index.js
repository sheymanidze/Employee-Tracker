const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const mysql = require('mysql');
require('console.table');


connection.connect(function (err) {
  if (err) throw err;
  optionsStart();
})

function optionsStart() {
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'View All Employess By Depatment', 'View All Emplyees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Departments', 'Add New Department', 'Remove Department', 'View All Roles', 'Add New Role', 'Remove Role', 'View total utilized budget']
  })
    .then((answer) => {
      switch (answer.start) {
        case 'View All Employees':
          allEmployees();
          break;

        case 'View All Employess By Depatment':
          empByDepartment();
          break;

        case 'View All Emplyees by Manager':
          empByManager();
          break;

        case 'Add Employee':
          addEmp();
          break;

        case 'Remove Employee':
          removeEmp();
          break;

        case 'Update Employee Role':
          updateEmpRole();
          break;

        case 'Update Employee Manager':
          updateEmpManager();
          break;

        case 'View All Departments':
          allDepartments();
          break;

        case 'Add New Department':
          addDepartment();
          break;

        case 'Remove Department':
          removeDepartment();
          break;

        case 'View All Roles':
          allRoles();
          break;

        case 'Add New Role':
          addRole();
          break;

        case 'Remove Role':
          removeRole();
          break;
      }
    })
};

//View All Employees
const allEmployees = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;

    console.table(res)

    optionsStart()

  });
}

//View All Departments

const allDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    console.table(res)

    optionsStart()

  });
}

//View All Roles
const allRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;

    console.table(res)

    optionsStart()

  });
}