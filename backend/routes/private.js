module.exports = async function (app) {
    app.get('/checkLogin', async function (req, res) {

        res.json({ success: true, admin: req.session.admin }).end();
    })

    app.get('/teams', async function (req, res) {
        app.get('connection').query('select id, name, teampartner1 as partner1, teampartner2 as partner2, clique from team;', function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
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
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.get('/activities', async function (req, res) {
        app.get('connection').query(`select * from activity where id_team1 = ${req.session.id_team} or id_team2 = ${req.session.id_team};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.post('/activity', async function (req, res) {
        const id_game = req.body.gameId
        const id_team1 = req.session.id_team
        const id_team2 = req.body.opponentId
        const id_winner = req.body.state === 'won' ? req.session.id_team : req.body.opponentId
        // const timestamp = new Date()
        //TODO: add timestamp
        app.get('connection').query(`insert into activity (id_game, id_team1, id_team2, id_winner) values (${id_game}, ${id_team1}, ${id_team2}, ${id_winner});`, function (err, result) {
            if (err)
                res.status(500).json(err).end()
            console.log(result)
            res.json(result).end()
        })
    })

    app.put('/activity/:id', async function (req, res) {
        const id = req.params.id
        const id_winner = req.body.winnerId
        const id_team = req.session.id_team
        //TODO: ergänzne, dass man nur einmal was eintragen kann
        //TODO: ergänzen, dass man nur pläne bearbeiten kann
        //TODO: ergänzen, dass man nur activitäten wo man selber drin ist bearbeiten kann: ... and (id_team1 = ${id_team) or id_team2 = ${id_team})
        app.get('connection').query(`update activity set id_winner = ${id_winner} where id = ${id} and id_winner is null and plan = 1;`, function (err, result) {
            if (err)
                res.status(500).json(err).end()
            if (result.affectedRows === 0)
                res.status(404).json({message: 'Plan already filled out or not a plan at all'})
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
        const id = req.session.id_team
        const guess = req.body.guess
        app.get('connection').query(`update team set guess = ${guess} where id = ${id};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(guess).end()
        })
    })

    app.get('/eastereggs', async function (req, res) {
        app.get('connection').query(`select id from easteregg where id_team = ${req.session.id_team};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.post('/easteregg', async function (req, res) {
        const id = req.body.id
        const id_team = req.session.id_team
        // const timestamp = new Date()
        //TODO: add timestamp
        app.get('connection').query(`insert into easteregg (id, id_team) values (${id}, ${id_team});`, function (err, result) {
            if (err)
                res.status(500).json(err).end()
            console.log(result)
            res.json(result).end()
        })
    })
}