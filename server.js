const inquirer = require('inquirer');
const express = require('express');
const sequelize = require('./config/connection');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


function init() {
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'View All Employess By Depatment', 'View All Emplyees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Departments', 'Add New Department', 'Remove Department', 'View All Roles', 'Add New Role', 'Remove Role']
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
          removeRole;
          break;
      }
    })
};

//View All Employees

