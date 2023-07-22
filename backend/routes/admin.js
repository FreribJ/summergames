module.exports = async function (app) {
    app.get('/admin/guess', async function (req, res) {
        app.get('connection').query(`select id as id_team, guess from team;`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows).end()
            else
                res.status(404).json({message: 'No Guess found'}).end()
        })
    })

    app.get('/admin/teams', async function (req, res) {
        app.get('connection').query('select id, name, teampartner1 as partner1, teampartner2 as partner2, clique, password from team;', function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.get('/admin/activities', async function (req, res) {
        app.get('connection').query(`select * from activity;`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.get('/admin/activity/:id', async function (req, res) {
        app.get('connection').query(`select * from activity where id = ${req.params.id};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows[0]).end()
            else
                res.status(404).json({message: 'Activity not found'}).end()
        })
    })

    app.put('/admin/activity/:id', async function (req, res) {
        const id = req.params.id
        const id_game = req.body.gameId
        const id_team1 = req.body.team1Id
        const id_team2 = req.body.team2Id
        const id_winner = req.body.winnerId
         app.get('connection').query(`update activity set id_game = ${id_game}, id_team1 = ${id_team1}, id_team2 = ${id_team2}, id_winner = ${id_winner} where id = ${id};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })
}