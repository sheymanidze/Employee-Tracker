const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const mysql = require('mysql');
const figlet = require('figlet');
const { printTable } = require("console-table-printer");


connection.connect(function (err) {
  if (err) throw err;
  console.log(figlet.textSync('EMPLOYEE TRACKER', {
    font: 'Big Money-se',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
  }))
  optionsStart();
})

function optionsStart() {
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'View All Departments', 'Add New Department', 'Remove Department', 'View All Roles', 'Add New Role', 'Remove Role', 'View total utilized budget', 'Exit']
  })
    .then((answer) => {
      switch (answer.start) {
        case 'View All Employees':
          allEmployees();
          break;

        case 'View All Employees by Manager':
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
          console.log(figlet.textSync('Thank You', {
            font: 'Big Money-se'
          }));
          connection.end();
      }
    })
};

//View All Employees
const allEmployees = () => {
  connection.query(

    `SELECT employee.id AS Employee, employee.first_name AS FirsName, employee.last_name AS LastName, role.title AS Title,
    department.name AS Department,
    role.salary AS Salary, concat(b.first_name, ' ',b.last_name) as Manager
     FROM employee
     LEFT OUTER JOIN employee b ON employee.manager_id = b.id 
     LEFT JOIN role ON (role.id = employee.role_id) 
     LEFT JOIN department ON (department.id = role.department_id)
     ORDER BY employee.id;
     ` , (err, res) => {
    if (err) throw err;

    printTable(res);

    optionsStart();

  });
}

//View All Departments

const allDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    printTable(res);

    optionsStart();

  });
}

//View All Roles
const allRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;

    printTable(res)

    optionsStart()

  });
}

//Add Employee
const addEmp = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'first_name',
    message: 'Please provide First Name of employee you would like to add'
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
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, newEmp, (err, res) => {
              if (err) throw err;

              allEmployees();
            })
          })
        })
      })
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
    connection.query(`INSERT INTO department (name) VALUES (?)`, answer.department_name, (err) => {
      if (err) throw err;
      allDepartments();
    })
  })
}

//Add Role
const addRole = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    let departmentArray = [];
    res.forEach(element => {
      departmentArray.push(element.name);
    });
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Please choose the department',
        choices: departmentArray
      },
      {
        type: 'input',
        name: 'title',
        message: 'Please type the role you would like to add'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please provide the salary for the role'
      },

    ]).then((answer) => {
      let departmentId;
      res.forEach((element) => {
        if (answer.department === element.name) {
          departmentId = element.id
        };
      });
      connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.title, answer.salary, departmentId],
        (err) => {
          if (err) throw err;
          allRoles();
        })
    })
  });
}

//Update Employee Roles(updateEmpRole)
const updateEmpRole = () => {
  connection.query(`SELECT 
    employee.id, employee.first_name, employee.last_name
    FROM employee`, (err, res) => {
    if (err) throw err;

    const chooseEmp = res.map(item => ({ name: `${item.first_name} ${item.last_name}`, value: item.id }))
    connection.query(`SELECT role.id, role.title FROM role`, (err, response) => {

      const roles = response.map(item => ({ "name": item.title, "value": item.id }));
      inquirer.prompt([{
        type: 'list',
        name: 'emp',
        message: 'Please choose an employee you would like to update role for',
        choices: chooseEmp
      },
      {
        type: 'list',
        name: 'chRole',
        message: 'Please choose new role',
        choices: roles
      }
      ]).then((answer) => {
        connection.query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`, [answer.chRole, answer.emp], (err) => {
          if (err) throw err;
          allEmployees();
        });

      });
    });

  });
};

//Update Employee Manager (updateEmpManager) will be added later



// View Employee by Manager (empByManager)
const empByManager = () => {
  connection.query(
    `SELECT 
    a.first_name AS FirstName,
    a.last_name AS LastName,
    concat(b.first_name, ' ',b.last_name) as Manager
    FROM employee a
    LEFT OUTER JOIN employee b ON a.manager_id = b.id 
    ORDER BY Manager;`, (err, res) => {
    if (err) throw err;
    printTable(res);
    optionsStart();
  })
}


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
        allEmployees();
      })

    })
  })

};



//Delete Departments (removeDepartment)

const removeDepartment = () => {
  const remDep = 'SELECT * FROM department'
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
        allDepartments();
      })
    })
  })
}

//Delete Roles (removeRole)
const removeRole = () => {
  const remRole = 'SELECT * FROM role'
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
        allRoles();
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
      printTable(res);
      optionsStart();
    })
}