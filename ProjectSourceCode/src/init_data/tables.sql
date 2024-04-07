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
    date DATE NOT NULL,
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
    move VARCHAR(20) NOT NULL,
    num INT NOT NULL
);

CREATE TABLE games_to_moves (
    game_id INT NOT NULL,
    move_id INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (move_id) REFERENCES moves(move_id)
);