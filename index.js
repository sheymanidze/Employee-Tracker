const inquirer = require('inquirer');
const express = require('express');
const connect = require('./config/connection.js');
const mysql = require('mysql');
const cTable = require('console.table')

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


function optionsStart() {
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
          removeRole();
          break;
      }
    })
};

//View All Employees
function allEmployees() {
  const queryEmp = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager, department.name AS department
  FROM employee
  LEFT JOIN role ON employee.role_id=department.id
  LEFT JOIN employee manager ON employee.manager_id=manager.id`

  connection.query(queryEmp, (err, data) => {
    if (err) throw err;
    console.table(data);
    optionsStart();
  })
}

//View All Employess By Depatment
//function empByDepartment()

//class mainData {
 // constructor(connection) {
// this.connection = connection;
// }
//get AllEmployees(){
// return this.connection
//.promise()  
//.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager, department.name AS department
 // FROM employee
 // LEFT JOIN role ON employee.role_id=role.id
//LEFT JOIN department role.department_id=department.id`)
//.catch(err=>err)
//}
//}