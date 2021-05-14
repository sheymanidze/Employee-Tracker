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
    choices: ['View All Employees', 'View All Emplyees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Departments', 'Add New Department', 'Remove Department', 'View All Roles', 'Add New Role', 'Remove Role', 'View total utilized budget', 'Exit']
  })
    .then((answer) => {
      switch (answer.start) {
        case 'View All Employees':
          allEmployees();

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

        case 'View total utilized budget':
          totalBudget();
          break;
        default:
          connection.end();
      }
    })
};

//View All Employees
const allEmployees = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title,  department.name AS 'department', employee.manager_id, role.salary FROM employee 
  INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id= department.id;`, (err, res) => {
    if (err) throw err;

    console.table(res);

    optionsStart();

  });
}

//View All Departments

const allDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    console.table(res);

    optionsStart();

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

//Add Employee
const addEmp = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'first_name',
    message: 'Please provide First Name of employee you would like to add',

  },
  {
    type: 'input',
    name: 'last_name',
    message: 'Please provide Last Name of employee you would like to add'
  },
  ]).then((answer) => {
    const newEmp = [answer.first_name, answer.last_name]
    connection.query(`SELECT role.id, role.title FROM role`, (err, res) => {
      if (err) throw err;
      const roles = res.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([{
        type: 'list',
        name: 'role',
        message: "Please choose employee's role",
        choices: roles
      }
      ]).then(response => {
        const role = response.role;
        newEmp.push(role);
        connection.query(`SELECT * FROM employee`, (err, res) => {
          if (err) throw err;
          const mg = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));
          inquirer.prompt([{
            type: 'list',
            name: 'manager',
            message: 'Please choose manager of employee you would like to add',
            choices: mg
          }

          ]).then(response => {
            const manager = response.manager;
            newEmp.push(manager);
            // connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, newEmp, (err) => {
            //   if (err) throw err;
            //   allEmployees();

            // connection.query(`INSERT INTO employee SET ?`,
            //   {
            //     first_name: response.first_name,
            //     last_name: response.last_name,
            //     role: response.role,
            //     manager: response.manager
            //   }, function (err, res) {
            //     console.table(res)
            //     allEmployees();
            //   })
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES`, [response.first_name, response.last_name, response.role, response.manager], newEmp, (err, res) => {

              if (err) throw err;

              console.table(res)

              allEmployees();

              optionsStart()
            })
          })

        })
      })
    })
  })
}


// const addEmp = () => {
//   inquirer.prompt([{
//     type: 'input',
//     name: 'first_name',
//     message: 'Please provide First Name of employee you would like to add',

//   },
//   {
//     type: 'input',
//     name: 'last_name',
//     message: 'Please provide Last Name of employee you would like to add'
//   },
//   {
//     type: 'list',
//     name: 'role.title',
//     message: "Please choose employee's role",
//     choices: ["Marketing Manager", "Marketing Assistant", "Sales Manager", "Sales Representative", "Account Manager", "Account Assistant", "IT Manager", "Tech Support", "Developer", "Human Resources"]
//   },
//   {
//     type: 'rawlist',
//     name: 'manager_id',
//     message: 'Please choose manager ID of employee you would like to add',
//     choices() {
//       const managerChoices = [];
//       res.forEach((manager_id) => {
//         managerChoices.push(manager_id)
//       });
//       return managerChoices;
//     }
//   },
//   {
//     type: 'rawlist',
//     name: 'department',
//     message: 'Please choose department of employee you would like to add ',
//     choices() {
//       const depChoices = [];
//       res.forEach((department_name) => {
//         depChoices.push(department_name)
//       });
//       return depChoices;
//     }
//   }

//   ]).then((answer) => {
//     connection.query(`INSERT INTO employee (first_name, role_id, manager_id) VALUES`, [answer.first_name, answer.last_name, answer.role, answer.manager], (err, res) => {
//       // {
//       //   first_name: answer.first_name,
//       //   last_name: answer.last_name,
//       //   title: answer.role.title,
//       //   manager_id: answer.manager_id
//       //}, 
//       if (err) throw err;

//       console.table(res)

//       addEmp();

//       optionsStart()
//     })
//   })
// }

//Add Department
const addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'department_name',
    message: 'Please add new Department Name'
  }]).then((answer) => {
    connection.query(`INSERT INTO department SET ?)`,
      {
        department_name: answer.department_name

      }, (err, res) => {
        if (err) throw err;

        console.table(res);

        allDepartments();
        optionsStart();

      })
  })
}

//Add Role
const addRole = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'title',
    message: 'Please type the role you would like to add'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Please provide the salary for the role'
  },
  {
    type: 'input',
    name: 'department_id',
    message: 'Please provide with department ID'
  }
  ]).then((answer) => {
    connection.query('INSERT INTO roles SET ?', (err, res) => {
      if (err) throw err;

      console.table(res);

      allRoles();

      optionsStart();
    })
  })
}

//Update Employee Roles (updateEmpRole)


//Update Employee Manager (updateEmpManager)



//View Employee by Manager (empByManager)
// const empByManager = () => {
//   connection.query(`SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS full_name FROM employee INNER JOIN role ON employee.role_id=role.id
//   INNER JOIN department ON department.id=role.department_id
//   WHERE role.title  IN ('Marketing Manager', 'Sales Manager', 'Account Manager', 'IT Manager', 'Human Resources');`,
//     function (err, res) {
//       let managerList = [];
//       let managerID = {};

//       res.forEach(({ full_name, id }) => {
//         managerList.push(full_name);
//         managerID[full_name] = id;
//       });

//       console.table(res);


//       inquirer.prompt([{
//         type: 'list',
//         name: 'byManager',
//         message: 'Please choose the manager to view employees',
//         choices: managerList
//       }]).then((answer) => {
//         let selectedManager = managerID[answer.managerList];
//         connection.query(`SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS full_name, department_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id=role.department_id WHERE manager_id=?;`,
//           {
//             manager_id: selectedManager
//           },
//           function (err, manager) {
//             console.table(manager)
//           })
//         optionsStart()

//       });
//     })
// }

//Delete Employee (removeEmp)

const removeEmp = () => {
  const queryRemEmp = `SELECT * FROM employee`
  connection.query(queryRemEmp, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: 'list',
      name: 'employeeID',
      message: 'Please select an employee you would like to delete from the list',
      choices: res.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
      })
    }]).then(answer => {
      const queryRemEmp1 = `DELETE FROM employee WHERE ?`
      connection.query(queryRemEmp1, [{ id: answer.employeeID }], (err) => {
        if (err) throw err;
        console.table(res);
        optionsStart();
      })

    })
  })

};



//Delete Departments (removeDepartment)

const removeDepartment = () => {
  const remDep = '`SELECT * FROM department'
  connection.query(remDep, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: 'list',
      name: 'dep_id',
      message: 'Please select a department you would like to delete from the list',
      choices: res.map(department => {
        return { name: `${department.name}`, value: department.id }
      })
    }]).then(answer => {
      const remDep2 = `DELETE FROM department WHERE ?`
      connection.query(remDep2, [{ id: answer.dep_id }], (err) => {
        if (err) throw err;
        console.table(res);
        optionsStart();
      })
    })
  })
}

//Delete Roles (removeRole)
const removeRole = () => {
  const remRole = '`SELECT * FROM role'
  connection.query(remRole, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: 'list',
      name: 'role',
      message: 'Please select a  role you would like to delete from the list',
      choices: res.map(role => {
        return { name: `${role.title}`, value: role.id }
      })
    }]).then(answer => {
      const remRole2 = `DELETE FROM role WHERE ?`
      connection.query(remRole2, [{ id: answer.role }], (err) => {
        if (err) throw err;
        console.table(res);
        optionsStart();
      })
    })
  })
}

//View the total utilized budget of a department (totalBudget)
const totalBudget = () => {
  connection.query(`
  SELECT role.department_id AS ID, 
  department.name AS Department,
  SUM(salary) AS Budget
  FROM  role  
  INNER JOIN department ON role.department_id = department.id 
  GROUP BY  role.department_id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      optionsStart();
    })
}
