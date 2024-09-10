const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
const config = require('./config');

const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "summergames"
});

db.connect(function (err) {
    if (err) throw err;
    app.set('connection', db)

    console.log('Connected to db\n')
})

app.set('acceptentries', false)

//Cookie parser
const sessionParser = async function (req, res, next) {
    console.log("New Server Request:")
    console.log("Path: ", req.path)

    if (req.path == '/login' || req.path == '/teams') {
        console.log("No login required \n")
        next()
        return
    }


    let token;
    if (req.cookies[config.cookieName]) {
        token = req.cookies[config.cookieName];
        console.log("Login Token: ",token)
        app.get('connection').query(`SELECT s.id_team, t.admin, COUNT(e.id) AS easterEggs FROM session s  JOIN team t ON t.id = s.id_team LEFT JOIN easteregg e ON t.id = e.id_team where token = ${token} group by s.id_team, t.admin;`, function (err, result) {
            if (err) {
                console.log("Failure! DB Failure:", err, "\n")
                res
                    .status(500)
                    .json(err)
                    .end()
            }
            if (result.length > 0) {
                if (req.path.startsWith('/admin') && !result[0].admin) {
                    console.log("Failure! No admin privileges\n")
                    res
                        .status(401)
                        .json({message: 'No admin privileges'})
                        .end()
                } else {
                    console.log("Success! TeamID:", result[0].id_team, "\n")
                    req.session = result[0];
                    next()
                }
            } else {
                console.log("Failure! No Token found\n")
                res
                    .status(401)
                    .json({message: 'Token not found'})
                    .end()
            }
        })
    } else {
        console.log("Failure! No cookie set\n")
        res
            .status(401)
            .json({message: 'No Cookie set'})
            .end()
    }
}

//Middlewares
app.use(express.json());
app.use(cors({
    origin: `http://${config.allowedIp}`,
    accessControlAllowOrigin: `http://${config.allowedIp}`,
    credentials: true
}))
app.use(cookieParser('sommerspiele2023'))
app.use(sessionParser);

//Routes
require('./routes/public')(app)
require('./routes/private')(app)
require('./routes/admin')(app)

app.listen(config.port, function () {
    console.log(`App started on port ${config.port}\n`);
});