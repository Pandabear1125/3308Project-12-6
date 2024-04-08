-------------------------------------------------------------
-- Create Tables
-------------------------------------------------------------

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users_to_games;
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS games_to_moves;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    bio VARCHAR(250),
    earned_points INT,
    current_points INT
);

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY, 
    date VARCHAR(50) NOT NULL,
    player_white INT,
    player_black INT,

    FOREIGN KEY (player_white) REFERENCES users(user_id),
    FOREIGN KEY (player_black) REFERENCES users(user_id)
);

CREATE TABLE users_to_games (
    user_id INT NOT NULL,
    game_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE moves (
    move_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    move VARCHAR(20) NOT NULL,
    num INT NOT NULL,

    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE games_to_moves (
    game_id INT NOT NULL,
    move_id INT NOT NULL,

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (move_id) REFERENCES moves(move_id)
);

-------------------------------------------------------------
-- Insert Test Data
-------------------------------------------------------------

INSERT INTO users (username, password) 
VALUES
    ('guest', 'guest0'),
    ('bob2', 'bob1'),
    ('bob3', 'bob2'),
    ('bob4', 'bob3'),
    ('bob5', 'bob4'),
    ('bob6', 'bob5'),
    ('bob7', 'bob6'),
    ('bob8', 'bob7'),
    ('bob9', 'bob8');

INSERT INTO games (date, player_white, player_black)
VALUES 
    ('today', 2, 3),
    ('tomorrow', 1, 2),
    ('yesterday', 4, 2);

INSERT INTO moves (game_id, move, num)
VALUES
    (1, 'GHI', 3),
    (1, 'ABC', 1),
    (1, 'DEF', 2),
    (2, '123', 1),
    (2, '456', 2);

INSERT INTO games_to_moves (game_id, move_id) 
VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5);

INSERT INTO users_to_games (user_id, game_id)
VALUES
    (2, 1),
    (2, 2),
    (2, 3),
    (4, 3),
    (1, 2),
    (3, 1);

-------------------------------------------------------------
-- Test querries
-------------------------------------------------------------

-- Find all moves given a game id
-- SELECT (moves.num, moves.move) FROM moves 
--     JOIN games_to_moves
--     ON moves.move_id = games_to_moves.move_id
-- WHERE games_to_moves.game_id = 1
-- ORDER BY moves.num ASC;

-- Find all of a user's games
-- SELECT games FROM users
-- JOIN users_to_games
-- ON users_to_games.user_id = users.user_id
-- JOIN games
-- ON users_to_games.game_id = games.game_id
-- WHERE users.user_id = 2;

-- Update a user's current points
