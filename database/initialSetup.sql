create table team
(
    id           serial primary key,
    name         varchar(255)              not null,
    teampartner1 varchar(255)              not null,
    teampartner2 varchar(255)              not null,
    guess        integer default 0         not null,
    clique       enum ('jannes', 'mattes') not null,
    password     varchar(255)              not null,
    admin        boolean default false     not null
);


create table game
(
    id   serial primary key,
    name varchar(255)
);

drop table activity;
create table activity
(
    id        serial primary key,
    id_game   bigint not null references game (id),
    id_team1  bigint not null references team (id),
    id_team2  bigint not null references team (id),
    id_winner bigint references team (id),
    plan boolean not null default false,
    timestamp timestamp
);

create table session
(
    id      serial primary key,
    token   bigint UNIQUE,
    id_team bigint references team (id),
    timestamp timestamp
);
alter table session add column timestamp timestamp;

# TODO: add timestamp
create table easteregg
(
    id bigint,
    id_team bigint references team (id),
    primary key (id, id_team),
    timestamp timestamp
);
