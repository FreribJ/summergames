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
    console.log('Connected to db')
})

//Cookie parser
const sessionParser = async function (req, res, next) {
    if (req.path == '/login' || req.path == '/teams') {
        next()
        return
    }

    console.log(req.path)

    let token;
    if (req.cookies[config.cookieName]) {
        token = req.cookies[config.cookieName];
        console.log(token)
        app.get('connection').query(`select s.id_team, t.admin from session s join team t on t.id = s.id_team where token = ${token}`, function (err, result) {
            if (err) {
                res
                    .status(500)
                    .json(err)
                    .end()
            }
            console.log(result)
            if (result.length > 0) {
                if (req.path.startsWith('/admin') && !result[0].admin) {
                    res
                        .status(401)
                        .json({message: 'No admin privileges'})
                        .end()
                } else {
                    req.session = result[0];
                    next()
                }
            } else {
                res
                    .status(401)
                    .json({message: 'Token not found'})
                    .end()
                // .redirect('/login')
            }
        })
    } else {
        res
            .status(401)
            .json({message: 'No Cookie set'})
            // .redirect('/login')
            .end()
    }
}

//Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://192.168.178.74',
    accessControlAllowOrigin: 'http://192.168.178.74',
    credentials: true
}))
app.use(cookieParser('sommerspiele2023'))
app.use(sessionParser);

//Routes
require('./routes/public')(app)
require('./routes/private')(app)
require('./routes/admin')(app)

app.listen(config.port, function () {
    console.log(`App started on port ${config.port}`);
});