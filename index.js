const inquirer = require("inquirer");
const db = require("./db/connection");



function starterPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "mainListChoices",
            message: "What would you like to do?",
            choices: ['View All Departments', 'View All Roles', 'View All Employees', "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit"]
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
          } else if (mainSelection.mainListChoices === "Quit") {
            quitTracker();
          }

        })}

function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.log(result)
        console.table(result);
      });
      starterPrompt();
  
}

function viewRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.table(result);
      });
      starterPrompt();

}

function viewEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, result) => {
      if (err) throw err;
        console.table(result);
      });
      starterPrompt();
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
        if (err) throw err;
        console.log(`Department has been added.`);
        console.table(result);
        starterPrompt();
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
                console.log("Role has been added");
                console.table(result);
                starterPrompt();
                });
        ``})
        })
    
}



function addEmployee () {
    // one is call from the sql table
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, roleData) => {
        if (err) throw err;
        const employeeRole = roleData.map((role) => 
        (   {name: role.title, value: role.id
        }));
        console.log (employeeRole)


    const mngerSql = `SELECT * FROM employee`;
    db.query(mngerSql, (err, employeeData) =>{
        if (err) throw err;
        console.log(employeeData);
        const mnger = employeeData.map((employee) =>
        ({name: employee.first_name + ' ' + employee.last_name, value: employee.manager_id}))
        
        
        return inquirer.prompt([
    {
        type: "input",
        name: "employeeFirstName",
        message: "What is the first name of the employee?"
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "What is the last name of the employee?"
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
        choices: mnger
      },
    ])
    .then(employData => {

        const sqlEmployment = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

        
        const params = [
          employData.employeeFirstName,
          employData.employeeLastName,
          employData.roleList,
          employData.departmentList
        ];
        db.query(sqlEmployment, params, (err, result) => {
            if (err) throw err;
            console.log("Employee has been added")
            console.table(result);
            starterPrompt();
            });
    ``})
    })
   })
   
}

function updateEmployee() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, employeeData) =>{
        if (err) throw err;
        const employeeList = employeeData.map((employee) =>
        ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}))

    const roleSql = `SELECT * FROM role`;
    db.query(roleSql, (err, roleData) => {
        if (err) throw err;
        const employeeRole = roleData.map((role) => 
        (   {name: role.title, value: role.id
        }));

        return inquirer.prompt([
            {
                type: "list",
                name: "updateEmployee",
                message: "Which employee's role would you like to update?",
                choices: employeeList
              },
              {
                type: "list",
                name: "roleList",
                message: "Select which new role this employee is assigned:",
                choices: employeeRole
              }
            ])
            .then(updateSelection => {
              
              const updateRole = 
              `UPDATE employee SET role_id = ? WHERE id = ?`;
              
              const params = [
                updateSelection.roleList,
                updateSelection.updateEmployee
                
              ];
              db.query(updateRole, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated")
                console.table(result);
                starterPrompt();
                });
        })
       })
    })
    // starterPrompt();
  }
   
  function quitTracker(){
    console.log("Goodbye")
    process.exit();
}

starterPrompt();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
  });