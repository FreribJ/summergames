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
    app.get('/admin/guess', function (req, res) {
        app.get('connection').query(`select id as id_team, guess from team;`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows).end()
            else
                res.status(404).json({message: 'No Guess found'}).end()
        })
    })

    app.get('/admin/teams', function (req, res) {
        app.get('connection').query('select id, name, teampartner1 as partner1, teampartner2 as partner2, clique, password from team;', function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    //TODO: get admin eastereggs

    app.get('/admin/activities', function (req, res) {
        app.get('connection').query(`select * from activity order by timestamp desc;`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.get('/admin/activity/:id', function (req, res) {
        app.get('connection').query(`select * from activity where id = ${req.params.id};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            else if (rows.length > 0)
                res.json(rows[0]).end()
            else
                res.status(404).json({message: 'Activity not found'}).end()
        })
    })

    app.put('/admin/activity/:id', function (req, res) {
        const id = req.params.id
        const id_game = req.body.gameId
        const id_team1 = req.body.team1Id
        const id_team2 = req.body.team2Id
        const id_winner = req.body.winnerId
         app.get('connection').query(`update activity set id_game = ${id_game}, id_team1 = ${id_team1}, id_team2 = ${id_team2}, id_winner = ${id_winner}, ${id_winner == null ? 'timestamp = null' : 'timestamp = \'' + formatDateNow() + '\''} where id = ${id};`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.delete('/admin/activity/:id', function (req, res) {
        const id = req.params.id
        app.get('connection').query(`delete from activity where id = ${id} and plan = 0;`, function (err, rows) {
            if (err)
                res.status(500).json(err).end()
            res.json(rows).end()
        })
    })

    app.get('/admin/acceptentries', function (req, res) {
        res.json({acceptEntries: app.get('acceptentries')}).end()
    })

    app.put('/admin/acceptentries', function (req, res) {
        app.set('acceptentries', req.body.acceptEntries)
        res.json({acceptEntries: app.get('acceptentries')}).end()
    })
}