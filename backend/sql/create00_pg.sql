-- PostgreSQL 10+
-- Mon 05 Nov 2018 02:57:10 PM PST
-- Model: DTC    Version: 1.0

-- -----------------------------------------------------
-- Schema dtc
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS "public" CASCADE;

-- -----------------------------------------------------
-- Schema dtc
-- -----------------------------------------------------
CREATE SCHEMA "public";
SET search_path TO public;

-- -----------------------------------------------------
-- Table `.`debate_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS debate_session (
  id CHAR(36) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- ended TIMESTAMP NULL,
  topic VARCHAR(45) NULL,
  PRIMARY KEY (id));


-- -----------------------------------------------------
-- Table `.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id VARCHAR(36) NOT NULL,
  xp INT NOT NULL default 0,
  status SMALLINT NOT NULL default 0,
  username VARCHAR(45) NULL,
  email VARCHAR(64) NULL,
  credits INT NOT NULL default 0,
  -- badges TEXT NULL,
  data jsonb NOT NULL default '{}'::jsonb,
  PRIMARY KEY (id))
;


-- -----------------------------------------------------
-- Table `.`debate_review`
-- -----------------------------------------------------
/* CREATE TABLE IF NOT EXISTS debate_review (
  created TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  review TEXT NOT NULL,
  aggrement boolean NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  debate_session_id CHAR(36) NOT NULL,
  PRIMARY KEY (user_id, debate_session_id)
 ,
  CONSTRAINT fk_debate_review_debate_session1
    FOREIGN KEY (debate_session_id)
    REFERENCES debate_session (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX fk_debate_review_users1_idx ON debate_review (user_id ASC);
CREATE INDEX fk_debate_review_debate_session1_idx ON debate_review (debate_session_id ASC);
*/
/* CONSTRAINT fk_debate_review_users1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, */

-- -----------------------------------------------------
-- Table `.`debate_session_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS debate_session_users (
  user_id VARCHAR(36) NOT NULL,
  debate_session_id CHAR(36) NOT NULL,
  -- badges TEXT NULL, -- needed?
  side SMALLINT NULL,
  character SMALLINT NULL,
  review jsonb NULL,
  review_aggrement boolean NULL,
  end_created TIMESTAMP NULL,
  bailed boolean,
  error TEXT NULL,
  PRIMARY KEY (user_id, debate_session_id)
 ,
 /*  CONSTRAINT fk_users_has_debate_session_users1
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, */
  CONSTRAINT fk_users_has_debate_session_debate_session1
    FOREIGN KEY (debate_session_id)
    REFERENCES debate_session (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
;

CREATE INDEX fk_users_has_debate_session_debate_session1_idx ON debate_session_users (debate_session_id ASC);
CREATE INDEX fk_users_has_debate_session_users1_idx ON debate_session_users (user_id ASC);


/* SET SQL_MODE=@OLD_SQL_MODE; */
/* SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; */
/* SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; */
