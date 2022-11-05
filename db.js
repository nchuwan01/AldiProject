/* connects to the database */
let mysql = require('mysql');
let PTODATA = require('./PTOAccrualBrackets.json');
let PTOUserData = require('./PTOUserSeedData.json');
//console.log(JSON.parse(ObjectT[0].Name));

//console.log(ObjectT.length);
let con = mysql.createConnection({
    host: '45.55.136.114',
    user: 'kingsF2022',
    password: 'kings_r_here!',
    database: 'kingsF2022'
});



con.connect((err) => {
    console.log(PTOUserData.length);
    console.log(PTODATA.length);
    if (err) return console.error('error: ' + err.message);

    for (let i = 0; i < PTOUserData.length; i++) {
        //   employeeid	firstName	lastName	email	leaderid	hiredate	role	yearsWorked

        var employeeid = PTOUserData[i].EmployeeId,
            firstName = PTOUserData[i].FirstName,
            lastName = PTOUserData[i].LastName,
            email = PTOUserData[i].Email,
            leaderid = PTOUserData[i].LeaderId,
            hiredate = PTOUserData[i].HireDate,
            role = PTOUserData[i].Role;

        var FindDate = PTOUserData[i].HireDate.split("-");
        let year = FindDate[0];
        let month = FindDate[1];
        let dateSplit = FindDate[2].split("T");
        let day = dateSplit[0];

        let TodayDate = new Date();
        let yearToday = TodayDate.getFullYear();
        let monthToday = (TodayDate.getMonth()) + 1;
        let dayToday = (TodayDate.getDay()) - 1;

        let totalDaysYear = (yearToday - year) * 365;
        let totalDaysMonth = (monthToday - month) * 30.4;
        let totalDays = dayToday - day;
        let totalDaysCount = parseInt((totalDaysYear + totalDaysMonth + totalDays) / 365);
        yearsWorked5 = totalDaysCount;

        var insertStatement =
            ` INSERT INTO employee values(?, ?, ?, ?,?,?,?,?)`;
        var items = [employeeid, firstName, lastName, email, leaderid, hiredate, role, yearsWorked5];

        con.query(insertStatement, items,
            (err, results, filds) => {
                return console.log(err);
            }
        )

        for(let j=0; j<PTODATA.length; j++)
        {
            var  employeeid = PTOUserData[i].EmployeeId;
            let vd = PTODATA[j].VacationPerYear;
            let pd = PTODATA[j].PersonalPerYear;
            let sd =  PTODATA[j].SickPerYear;

            var insertStatement = `INSERT INTO ptoBalance values(?, ?, ?, ?)`;
            var items = [employeeid,vd,pd,sd];

            if(PTODATA[j].Role == PTOUserData[i].Role)
            {
                while(totalDaysCount > PTODATA[j].NumberOfYears)
                {
                    totalDaysCount -= 1;
                }
                if(totalDaysCount == PTODATA[j].NumberOfYears)
                {
                    con.query(insertStatement, items,
                        (err, results, fields) => {return console.log(err);});
                }
            }

        }


    }


    for(let i=0; i<PTODATA.length; i++)
    {
        var yearsWorked = PTODATA[i].NumberOfYears,
            role = PTODATA[i].Role,
            maxVac = PTODATA[i].MaxVacation,
            vacPerYear = PTODATA[i].VacationPerYear,
            vacAccuralDate = PTODATA[i].VacationAccuralDate,
            maxPer = PTODATA[i].MaxPersonal,
            perPerYear = PTODATA[i].PersonalPerYear,
            perAccuralDate= PTODATA[i].PersonalAccuralDate,
            maxSick = PTODATA[i].MaxSick,
            sickPerYear = PTODATA[i].SickPerYear,
            sickAccural = PTODATA[i].SickAccuralDate;

        var insertStatement =
            `INSERT INTO accural values(?, ?, ?, ?,?,?,?,?,?,?,?)`;
        var items = [yearsWorked, role, maxVac, vacPerYear,vacAccuralDate,maxPer,perPerYear,perAccuralDate,maxSick,sickPerYear,sickAccural ];

        /*
                     con.query(insertStatement, items,
                         (err, results, fields) => {return console.log(err);});*/

        /*   for(let j = 0; j < PTOUserData.length; j++)
           {
               if(PTOUserData[j].Role == PTODATA[i].Role)
               {
                   var FindDate = PTOUserData[j].HireDate.split("-");
                   let year = FindDate[0];
                   let month = FindDate[1];
                   let dateSplit = FindDate[2].split("T");
                   let day = dateSplit[0];
                   let TodayDate = new Date();
                   let yearToday = TodayDate.getFullYear();
                   let monthToday = (TodayDate.getMonth()) + 1;
                   let dayToday = (TodayDate.getDay()) - 1;
                   let totalDaysYear = (yearToday - year) * 365;
                   let totalDaysMonth = (monthToday - month) * 30.4;
                   let totalDays = dayToday - day;
                   let totalYearsCount = parseInt((totalDaysYear + totalDaysMonth + totalDays) / 365);
                   var  employeeid = PTOUserData[j].EmployeeId;
                   let vd = PTODATA[i].VacationPerYear;
                   let pd = PTODATA[i].PersonalPerYear;
                   let sd =  PTODATA[i].SickPerYear;*/

        /*
                             var insertStatement =
                                 `INSERT INTO ptoBalance values(?, ?, ?, ?)`;
                             var items = [employeeid,vd,pd,sd];
                            if(totalYearsCount == PTODATA[i].NumberOfYears)
                            {
                                con.query(insertStatement, items,
                                    (err, results, fields) => {return console.log(err);});
                            }
                            else if(totalYearsCount <= PTODATA[i].NumberOfYears)
                            {
                                con.query(insertStatement, items,
                                    (err, results, fields) => {return console.log(err);});
                            }
        */


    }




});


module.exports = con;