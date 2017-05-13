-- https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/

BEGIN;

CREATE USER regular_user WITH PASSWORD 'regular_password';
--CREATE USER admin_user WITH PASSWORD 'admin_password';

--CREATE EXTENSION pgcrypto;
--SELECT gen_random_uuid()
CREATE EXTENSION "uuid-ossp";
--SELECT uuid_generate_v1mc()
CREATE EXTENSION citext;

CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.when_updated := now();
  RETURN NEW;
END;
$$;

-- If you want to add logging to your db
--CREATE TABLE log (
--  seq SERIAL PRIMARY KEY
--, key TEXT NOT NULL -- some kind of identifier - perhaps just the app that's using it
--, log_level TEXT
--, log TEXT NOT NULL
--, when_added TIMESTAMP NOT NULL DEFAULT NOW()
--);
--CREATE INDEX log__key ON log (key);
--CREATE INDEX log__log_level ON log (log_level);
--CREATE INDEX log__when_added ON log (when_added);

-- A configuration set, such as for different clients, perhaps including passwords and stuff?
--CREATE TABLE config ( -- probably better to use one row, many columns?
--  seq SERIAL PRIMARY KEY
--, key TEXT NOT NULL
--, value TEXT NOT NULL
--);

CREATE TABLE person (
  email CITEXT PRIMARY KEY
, display_name TEXT -- do we even fill this in?
, password_hash TEXT NOT NULL -- salts are stored with the password
, role TEXT NOT NULL DEFAULT 'user'
, is_active BOOL NOT NULL DEFAULT TRUE
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX person__email ON person (email);
CREATE INDEX person__role ON person (role);
CREATE INDEX person__is_active ON person (is_active);
CREATE INDEX person__when_added ON person (when_added);
CREATE INDEX person__when_updated ON person (when_updated);

CREATE TABLE person_display_image (
  person_display_image_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc()
, seq SERIAL
, email CITEXT NOT NULL
, image_id UUID NOT NULL
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX person_display_image__email ON person_display_image (email);
CREATE INDEX person_display_image__when_added ON person_display_image (when_added);
CREATE INDEX person_display_image__when_updated ON person_display_image (when_updated);

CREATE TABLE image (
  image_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc()
, seq SERIAL
, image BYTEA NOT NULL -- get size with octet_length(string)
, name TEXT
, mimetype TEXT
, width INT
, height INT
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX image__when_added ON image (when_added);
CREATE INDEX image__when_updated ON image (when_updated);

CREATE TABLE reset_code (
  seq SERIAL PRIMARY KEY
, email CITEXT NOT NULL
, reset_code TEXT NOT NULL
, used BOOLEAN NOT NULL DEFAULT FALSE
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX reset_code__email__reset_code__used__when_added ON reset_code (email, reset_code, used, when_added);
CREATE INDEX reset_code__when_added ON reset_code (when_added);
CREATE INDEX reset_code__when_updated ON reset_code (when_updated);

CREATE TABLE session (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc()
, email CITEXT NOT NULL
, ipaddress TEXT NOT NULL -- need something, plus location?, device identifier?
, os TEXT NOT NULL -- ios, android, maybe web?
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
, when_expire TIMESTAMP -- null means it never expires
);
CREATE INDEX session__email ON session (email);
CREATE INDEX session__when_added ON session (when_added);
CREATE INDEX session__when_updated ON session (when_updated);
CREATE INDEX session__when_expire ON session (when_expire);

CREATE TABLE game (
  game_id CITEXT PRIMARY KEY
, player_turn INT NOT NULL DEFAULT 0
, first_player_id TEXT NOT NULL
, first_player_name TEXT NOT NULL
, first_player_pieces TEXT NOT NULL
, second_player_id TEXT
, second_player_name TEXT
, second_player_pieces TEXT
, when_added TIMESTAMP NOT NULL DEFAULT NOW()
, when_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX game__first_player_id ON game (first_player_id);
CREATE INDEX game__second_player_id ON game (second_player_id);
CREATE INDEX game__when_added ON game (when_added);
CREATE INDEX game__when_updated ON game (when_updated);

-- Only for Mobile apps - google fcm --
---------------------------------------
--CREATE TABLE push_notification (
--  push_id TEXT PRIMARY KEY
--, email CITEXT NOT NULL -- you can only have push notifications if you're signed in
--, session_id UUID NOT NULL
--, when_added TIMESTAMP NOT NULL DEFAULT NOW()
--);
--CREATE INDEX push_notification__email ON push_notification (email);
--CREATE INDEX push_notification__session_id ON push_notification (session_id);
--CREATE INDEX push_notification__when_added ON push_notification (when_added);

-- Trigger for each table that should have its timestamp updated whenever an update is called
-- http://dba.stackexchange.com/questions/62033/how-to-reuse-an-update-trigger-for-multiple-tables-in-postgresql
DO $$ BEGIN
  EXECUTE (
  SELECT string_agg('
    CREATE TRIGGER update_timestamp
      BEFORE UPDATE ON ' || quote_ident(t) || '
      FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();
  ', E'\n')
FROM unnest('{person, person_display_image, image, reset_code, session, game}'::text[]) t -- list your tables here
  );
END $$;




-- Permissions --
-----------------
--GRANT INSERT ON log TO regular_user;
GRANT SELECT, INSERT, UPDATE ON person TO regular_user;
GRANT SELECT, INSERT ON person_display_image TO regular_user;
GRANT SELECT, INSERT ON image TO regular_user;
GRANT SELECT, INSERT, UPDATE ON reset_code TO regular_user;
GRANT SELECT, INSERT, DELETE ON session TO regular_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON game TO regular_user;
--GRANT SELECT, INSERT, DELETE ON push_notification TO regular_user;

-- When you don't want to worry about sequences
GRANT SELECT, USAGE ON ALL SEQUENCES IN SCHEMA public TO regular_user;

-- Lets ignore the admin user for now --
--GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_user;
--GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_user;


-- How to do permissions properly, if you care enough to get around to this --
------------------------------------------------------------------------------
----ACCESS BD
--REVOKE CONNECT ON DATABASE toast FROM PUBLIC;
--GRANT  CONNECT ON DATABASE toast  TO regular_user;
--
----ACCESS SCHEMA
--REVOKE ALL     ON SCHEMA public FROM PUBLIC;
--GRANT  USAGE   ON SCHEMA public  TO user;
--
----ACCESS TABLES
--REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC ;
--GRANT SELECT                         ON ALL TABLES IN SCHEMA public TO read_only ;
--GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO read_write ;
--GRANT ALL                            ON ALL TABLES IN SCHEMA public TO admin ;

COMMIT;
