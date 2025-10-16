CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

CREATE TABLE IF NOT EXISTS "student_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" text NOT NULL,
	"game_mode" text NOT NULL,
	"question" text NOT NULL,
	"student_answer" text NOT NULL,
	"correct_answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"timestamp" text NOT NULL
);
