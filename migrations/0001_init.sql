CREATE TABLE games (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	password_hash TEXT NOT NULL,
	created_at INTEGER NOT NULL
);

CREATE TABLE admin_sessions (
	token_hash TEXT PRIMARY KEY,
	game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
	created_at INTEGER NOT NULL
);

CREATE TABLE participants (
	id TEXT PRIMARY KEY,
	game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
	name TEXT NOT NULL,
	position INTEGER NOT NULL,
	-- the participant this person gives a present to; NULL until they have drawn
	gives_to TEXT REFERENCES participants(id),
	-- hash of the browser token that claimed this name when drawing
	token_hash TEXT,
	drawn_at INTEGER
);

CREATE INDEX participants_game ON participants(game_id);
-- nobody can be drawn twice
CREATE UNIQUE INDEX participants_gives_to ON participants(gives_to);
CREATE UNIQUE INDEX participants_game_name ON participants(game_id, name COLLATE NOCASE);
