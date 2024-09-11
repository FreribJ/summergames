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
    name varchar(255),
    description varchar(2000)
);

create table activity
(
    id        serial primary key,
    id_game   bigint not null,
    id_team1  bigint not null,
    id_team2  bigint not null,
    id_winner bigint,
    plan boolean not null default false,
    timestamp timestamp
);

create table session
(
    id      serial primary key,
    token   bigint UNIQUE,
    id_team bigint,
    timestamp timestamp
);

create table easteregg
(
    id bigint,
    id_team bigint,
    primary key (id, id_team),
    timestamp timestamp
);
