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
    choices: ['View All Employees', 'View All Emplyees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Departments', 'Add New Department', 'Remove Department', 'View All Roles', 'Add New Role', 'Remove Role', 'View total utilized budget']
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
  {
    type: 'list',
    name: 'role.title',
    message: "Please choose employee's role",
    choices: ["Marketing Manager", "Marketing Assistant", "Sales Manager", "Sales Representative", "Account Manager", "Account Assistant", "IT Manager", "Tech Support", "Developer", "Human Resources"]
  },
  {
    type: 'rawlist',
    name: 'manager_id',
    message: 'Please choose manager ID of employee you would like to add',
    choices() {
      const managerChoices = [];
      res.forEach((manager_id) => {
        managerChoices.push(manager_id)
      });
      return managerChoices;
    }
  },
  {
    type: 'rawlist',
    name: 'department',
    message: 'Please choose department of employee you would like to add ',
    choices() {
      const depChoices = [];
      res.forEach((department_name) => {
        depChoices.push(department_name)
      });
      return depChoices;
    }
  }

  ]).then((answer) => {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name,
    role.salary, employee.manager_id 
      FROM employee
      INNER JOIN role on role.id = employee.role_id
      INNER JOIN department ON department.id = role.department_id`, (err, res) => {
      // {
      //   first_name: answer.first_name,
      //   last_name: answer.last_name,
      //   title: answer.role.title,
      //   manager_id: answer.manager_id
      //}, 
      if (err) throw err;

      console.table(res)

      addEmp();

      optionsStart()
    })
  })
}

//Add Department
const addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'department_name',
    message: 'Please add new Department Name'
  }]).then((answer) => {
    connection.query(`INSERT INTO department VALUES (?)`, (err, res) => {
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
const empByManager = () => {
  connection.query(`SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS full_name FROM employee INNER JOIN role ON employee.role_id=role.id
  INNER JOIN department ON department.id=role.department_id
  WHERE role.title  IN ('Marketing Manager', 'Sales Manager', 'Account Manager', 'IT Manager', 'Human Resources');`,
    function (err, res) {
      let managerList = [];
      let managerID = {};

      res.forEach(({ full_name, id }) => {
        managerList.push(full_name);
        managerID[full_name] = id;
      });

      console.table(res);


      inquirer.prompt([{
        type: 'list',
        name: 'byManager',
        message: 'Please choose the manager to view employees',
        choices: managerList
      }]).then((answer) => {
        let selectedManager = managerID[answer.managerList];
        connection.query(`SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS full_name, department_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id=role.department_id WHERE manager_id=?;`,
          {
            manager_id: selectedManager
          },
          function (err, manager) {
            console.table(manager)
          })
        optionsStart()

      });
    })
}

//Delete Employee (removeEmp)

// const removeEmp = () => {
//   const queryRemEmp = `SELECT * FROM employee`
//   connection.query(queryRemEmp, (err, res) => {
//     if (err) throw err;
//     inquirer.prompt([{
//       type: 'list',
//       name: 'employeeID',
//       message: 'Please select an employee you would like to delete from the list',
//       choices: res.map(employee = {
//         return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
//       })
//     }]).then(answer => {
//       const queryRemEmp1 = `DELETE FROM employee WHERE ?`
//       connection.query(queryRemEmp1, [{ id: answer.employeeID }], (err) => {
//         if (err) throw err;
//         console.table(res);
//         optionsStart();
//       })

//     })
//   })

// };



//Delete Departments (removeDepartment)

//Delete Roles (removeRole)

//View the total utilized budget of a department (totalBudget)
const totalBudget = () => {
  inquirer.prompt([{
    type: 'rawlist',
    name: 'debBud',
    message: 'Please choose the department ID to view total utilized budget',
    choices: ['CEO', 'Marketing', 'Sales', 'Accounting', 'IT', 'HR']
  }]).then((answer) => {
    connection.query('SELECT department_id, title SUM (salary) FROM role GROUP by department_id;', {
      department_id: answer.depBud
    },
      (err, res) => {
        if (err) throw err;
        console.table(res);
        optionsStart();
      })
  })
}
