const config = require('../config');

module.exports = function (app) {
    app.post('/login', async function (req, res) {

            const id = req.body.id
            const password = req.body.password

            await app.get('connection').query(`select id from team where id = ${id} and password = '${password}'`, function (err, rows) {
                if (err) {
                    res.status(500).json(err).end()
                    return
                }
                if (rows.length === 0) {
                    res.status(401).json({message: 'incorrect password'}).end()
                    return
                }

                let token = Math.floor(Math.random() * 1000000)
                app.get('connection').query(`insert into session (token, id_team) VALUES (${token}, ${id});`, function (err, result) {
                    if (err) {
                        res.status(500).json(err).end()
                        return
                    }
                    if (result) {
                        res.cookie(config.cookieName, token).json({token: token})
                    }
                })
            })
        }
    )
}