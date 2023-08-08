function formatDateNow() {
    return formatDate(new Date());
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = async function (app) {
    app.get('/checkLogin', async function (req, res) {
        console.log(req.session.easterEggs)
        res.json({success: true, admin: req.session.admin, easterEggs: req.session.easterEggs}).end();
    })

    app.get('/team', async function (req, res) {
        app.get('connection').query(`select id, name, teampartner1 as partner1, teampartner2 as partner2, clique from team where id = ${req.session.id_team};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows[0]).end()
            else
                res.status(404).json({message: 'Team not found'}).end()
        })
    })

    app.get('/games', async function (req, res) {
        app.get('connection').query('select * from game;', function (err, rows) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            res.json(rows).end()
        })
    })

    app.get('/activities', async function (req, res) {
        let date = new Date()
        if (!req.query.since) {
            app.get('connection').query(`select * from activity where id_team1 = ${req.session.id_team} or id_team2 = ${req.session.id_team} order by timestamp desc;`, function (err, rows) {
                if (err) {
                    res.status(500).json(err).end()
                    return
                }
                res.json({lastUpdate: date.getTime(), activities: rows}).end()
            })
        } else {
            app.get('connection').query(`select * from activity where (id_team1 = ${req.session.id_team} or id_team2 = ${req.session.id_team}) and timestamp > '${formatDate(new Date(parseInt(req.query.since)))}' order by timestamp desc;`, function (err, rows) {
                if (err) {
                    res.status(500).json(err).end()
                    return
                }
                res.json({lastUpdate: date.getTime(), activities: rows}).end()
            })
        }
    })

    app.post('/activity', async function (req, res) {
        if (!app.get('acceptentries')) {
            res.status(403).json({message: 'Entries are closed'}).end()
            return
        }
        const id_game = req.body.gameId
        const id_team1 = req.session.id_team
        const id_team2 = req.body.opponentId
        const id_winner = req.body.state === 'won' ? req.session.id_team : req.body.opponentId
        app.get('connection').query(`insert into activity (id_game, id_team1, id_team2, id_winner, timestamp) values (${id_game}, ${id_team1}, ${id_team2}, ${id_winner}, '${formatDateNow()}');`, function (err, result) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            res.json(result).end()
        })
    })

    app.put('/activity/:id', async function (req, res) {
        if (!app.get('acceptentries')) {
            res.status(403).json({message: 'Entries are closed'}).end()
            return
        }
        const id = req.params.id
        const id_winner = req.body.winnerId
        const id_team = req.session.id_team
        app.get('connection').query(`update activity set id_winner = ${id_winner}, timestamp = '${formatDateNow()}' where id = ${id} and id_winner is null and plan = 1 and (id_team1 = ${id_team} or id_team2 = ${id_team});`, function (err, result) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            if (result && result.affectedRows === 0) {
                res.status(409).json({message: 'Plan already filled out or not a plan at all'})
                return
            }
            res.json(result).end()
        })
    })

    app.get('/guess', async function (req, res) {
        app.get('connection').query(`select guess from team where id = ${req.session.id_team};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows[0].guess).end()
            else
                res.status(404).json({message: 'Team not found'}).end()
        })
    })

    app.put('/guess', async function (req, res) {
        if (!app.get('acceptentries')) {
            res.status(403).json({message: 'Entries are closed'}).end()
            return
        }
        const id = req.session.id_team
        const guess = req.body.guess
        app.get('connection').query(`update team set guess = ${guess} where id = ${id};`, function (err, rows) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            res.json(guess).end()
        })
    })

    app.get('/eastereggs', async function (req, res) {
        app.get('connection').query(`select id from easteregg where id_team = ${req.session.id_team};`, function (err, rows) {
            if (err) {
                res.status(500).json(err).end()
                return
            }
            res.json(rows).end()
        })
    })

    app.post('/easteregg', async function (req, res) {
        const id = req.body.id
        const id_team = req.session.id_team
        app.get('connection').query(`insert into easteregg (id, id_team, timestamp) values (${id}, ${id_team}, '${formatDateNow()}');`, function (err, result) {
            if (err) {
                if (err.errno == 1062)
                    res.status(409).json({message: 'EasterEgg already found'}).end()
                else
                    res.status(500).json(err).end()
                return
            }
            res.json(result).end()
        })
    })
}