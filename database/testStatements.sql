#Game
select * from game;

#Activity
select * from activity where id_team1 = 1 or id_team2 = 1;

insert into activity (id_game, id_team1, id_team2, id_winner, timestamp) values (?, ?, ?, ?, ?);
update activity set id_winner = ?, timestamp = ? where id = ? and id_winner IS NULL;
update activity set id_game = ?, id_team1 = ?, id_team2 = ?, id_winner = ? where id = ?;

#Team
select id, name, teampartner1, teampartner2, guess, clique from team;
select id, name, teampartner1, teampartner2, guess, clique from team where id = 1;

#Guess
update team set guess = ? where id = ?

#Login / Session
select s.id_team, t.admin
from session s
join team t on t.id = s.id_team
where token = 1111;

select id from team where id = ? and password = ?;

insert into session (token, id_team) VALUES (?, ?);