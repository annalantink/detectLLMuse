CREATE TABLE workers (
    worker_number SERIAL PRIMARY KEY,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_one (
    worker_number SERIAL PRIMARY KEY REFERENCES workers(worker_number),
    number_popups INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_two (
    worker_number SERIAL PRIMARY KEY REFERENCES workers(worker_number),
    number_popups INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE survey (
    worker_number SERIAL PRIMARY KEY REFERENCES workers(worker_number),
    number_popups INTEGER NOT NULL,
    question_1 TEXT NOT NULL,
    question_2 TEXT NOT NULL,
    question_3 TEXT NOT NULL,
    question_4 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);