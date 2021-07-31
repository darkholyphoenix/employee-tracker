const inquirer = require("inquirer");
const db = require("./db/connection");



function starterPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "mainListChoices",
            message: "What would you like to do?",
            choices: ['View All Departments', 'View All Roles', 'View All Employees', "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"]
          }
        ])
        .then((mainSelection) => {
          if (mainSelection.mainListChoices === "View All Departments") {
            viewDepartments();
          } else if (mainSelection.mainListChoices === "View All Roles") {
            viewRoles();
          } else if (mainSelection.mainListChoices === "View All Employees") {
            viewEmployees();
          } else if (mainSelection.mainListChoices === "Add A Department") {
            addDepartment();
          } else if (mainSelection.mainListChoices === "Add A Role") {
            addRole();
          } else if (mainSelection.mainListChoices === "Add An Employee") {
            addEmployee();
          } else if (mainSelection.mainListChoices === "Update An Employee Role") {
            updateEmployee();
          };

        })}

function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.log(result)
        console.table(result);
      });
    
  
}

function viewRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.table(result);
      });

}

function viewEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.table(result);
      });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartment",
            message: "What department would you like to add?",
          },
        ])
        .then(departmentName => {
    
    const sql = `INSERT INTO department (name) VALUES ${departmentName.addDepartment}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        });

    }) 
}

function addRole () {
    inquirer.prompt([
        {
            type: "input",
            name: "addRoleName",
            message: "What is the name of the role?"
          },
          {
            type: "input",
            name: "addRoleSalary",
            message: "What is the amount of the salary?"
          },
          {
            type: "list",
            name: "departmentList",
            message: "Select which department this role is with."
          },
        ])
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params = [
      body.name
    ];
    db.query(sql, (err, rows) => {
        if (err) throw err;
          return;
        });
}

// const addEmployee = () => {

// }

// const updateEmployee = () => {

// }


starterPrompt();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
  });