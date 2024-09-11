const config = require('../config');

function formatDateNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
                app.get('connection').query(`insert into session (token, id_team, timestamp) VALUES (${token}, ${id}, '${formatDateNow()}');`, function (err, result) {
                    if (err) {
                        res.status(500).json(err).end()
                        return
                    }
                    if (result) {
                        res.cookie(config.cookieName, token, {expires : new Date(253402300000000)}).json({token: token})
                    }
                })
            })
        }
    )

    app.get('/teams', async function (req, res) {
        app.get('connection').query('select id, name, teampartner1 as partner1, teampartner2 as partner2, clique from team order by name;', function (err, rows) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            res.json(rows).end()
        })
    })
}