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
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = departmentName.addDepartment;
    db.query(sql, params, (err, result) => {
        console.log(`The id of ${params} has been added.`);
        if (err) throw err;
        });

    }) 
}

function addRole() {
        // one is call from the sql table
        const sql = `SELECT * FROM department`;
        db.query(sql, (err, deptData) =>{
            if (err) throw err;
            const dept = deptData.map((department) => 
            ({ name: department.name, value: department.id}));
            console.log(dept)

            return inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?"
          },
          {
            type: "input",
            name: "roleSalary",
            message: "What is the amount of the salary?"
          },
          {
            type: "list",
            name: "departmentList",
            message: "Select which department this role is with.",
            choices: dept
          },
        ])
        .then(roleData => {
            const sqlDept = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

            
            const params = [
              roleData.roleName,
              roleData.roleSalary,
              roleData.departmentList
            ];
            db.query(sqlDept, params, (err, result) => {
                if (err) throw err;
                
                });
        ``})
        })
    
}



function addEmployee () {
    // one is call from the sql table
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, roleData) => {
        if (err) throw err;
        const employeeRole = roleData.map((id,title, salary, department) => 
        (   {name: `${title} ${salary} ${department}`, 
            value: `${id}`
        }));
        console.log (employeeRole)


    const mngerSql = `SELECT * FROM employee`;
    db.query(mngerSql, (err, employeeData) =>{
        if (err) throw err;
        console.log(employeeData);
        const mnger = employeeData.map((id,first_name, last_name, role_id, manager_id) =>
        ({name: `${first_name} ${last_name} ${role_id}`, 
        value: manager_id}))
        
        return inquirer.prompt([
    {
        type: "input",
        name: "employeeFirstName",
        message: "What is the first name of the employee?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the second name of the employee?"
      },
      {
        type: "list",
        name: "roleList",
        message: "Select which role this employee is assigned:",
        choices: employeeRole
      },
      {
        type: "list",
        name: "departmentList",
        message: "Select which manager is overseeing this employee:",
        choices: `${mnger}, No one`
      },
    ])
    .then(employData => {

        if(employData.departmentList === 'No one') {
            employData.departmentList === 'NULL'
        }
        const sqlEmployment = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

        
        const params = [
          employData.employeeFirstName,
          employData.employeeLastName,
          employData.roleList,
          employData.departmentList
        ];
        db.query(sqlEmployment, params, (err, result) => {
            if (err) throw err;
            
            });
    ``})
    })
   })
}

const updateEmployee = () => {

}


starterPrompt();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
  });