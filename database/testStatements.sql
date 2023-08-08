#Game
select *
from game;

#Activity
select *
from activity
where id_team1 = 1
   or id_team2 = 1;

select *
from activity
where (id_team1 = 1
   or id_team2 = 1) and
    (timestamp > '2023-08-08 15:22:13' or timestamp is null);

select * from activity
order by timestamp desc;

insert into activity (id_game, id_team1, id_team2, id_winner, timestamp)
values (?, ?, ?, ?, ?);

update activity
set id_winner = ?,
    timestamp = ?
where id = ?
  and id_winner IS NULL;

update activity
set id_game   = ?,
    id_team1  = ?,
    id_team2  = ?,
    id_winner = ?
where id = ?;

delete
from activity
where id = ?
  and plan = 0;

#Team
select id, name, teampartner1, teampartner2, guess, clique
from team;
select id, name, teampartner1, teampartner2, guess, clique
from team
where id = 1;

#Guess
update team
set guess = ?
where id = ?;

#Login / Session
select s.id_team, t.admin, count(e.id) as eastereggs
from session s
         join team t on t.id = s.id_team
         left join summergames.easteregg e on t.id = e.id_team and s.token is not null
where token = ?;

SELECT s.id_team, t.admin, COUNT(e.id) AS eastereggs FROM session s  JOIN team t ON t.id = s.id_team LEFT JOIN easteregg e ON t.id = e.id_team where token = ? group by s.id_team, t.admin;


select id
from team
where id = ?
  and password = ?;

insert into session (token, id_team)
VALUES (?, ?);

#Eastereggs
select *
from easteregg
where id_team = ?;

select * from activity;
update activity set timestamp = '2021-07-24 12:00:00' where id = 1;

#test for duplicates
select  id_team1, id_team2, count(*)
from activity
group by  id_team1, id_team2