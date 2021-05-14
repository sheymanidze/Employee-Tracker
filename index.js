const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const mysql = require('mysql');
const cTable = require('console.table');


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
    res.forEach(({
      id,
      first_name,
      last_name,
      role_id,
      manager_id
    }) => {
      console.table(id, first_name, last_name, role_id, manager_id)
      //console.log(`| ${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id} |`);
    });
    //console.log('----------------------------');
    optionsStart()

  });
}



// function allEmployees() {
//   const queryEmp = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager, department.name AS department
//   FROM employee
//   LEFT JOIN role ON employee.role_id=department.id
//   LEFT JOIN employee manager ON employee.manager_id=manager.id`

//   connection.query(queryEmp, (err, data) => {
//     if (err) throw err;
//     console.table(data);
//     optionsStart();
//   })
// }

//View All Employess By Depatment
// function empByDepartment() {
//   const queryByDep = ('SELECT * FROM department');

//   connection.query(queryByDep, (err, answer) => {
//     if (err) throw err;
//     const department = response.map(element => {
//       return { name: `${element.name}` }
//     });
//     inquirer.prompt([{
//       type: 'list',
//       name: 'depatments',
//       message: 'Please chose a department',
//       choices: department
//     }]).then(answer => {
//       const queryEmpByDep = `SELECT employee.first_name, employee.last_name, employee.role_id AS role,  CONCAT(manager.first_name, ' ',manager.last_name) AS manager, department.name AS department
//       FROM employee
//       LEFT JOIN employee ON employee.role_id=role.id
//       LEFT JOIN employee manager ON employee.manager_id=manager.id
//       LEFT JOIN department ON role.department_id=department.id
//       WHERE ?`

//       connection.query(queryEmpByDep, [{ name: answer.departments }], function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         optionsStart();
//       })
//     })

//   })
// };

//View Employee by Manager

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
//LEFT JOIN department ON role.department_id=department.id`)
//.catch(err=>err)
//}
//}