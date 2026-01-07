CREATE TABLE workers (
    pid TEXT PRIMARY KEY,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_one (
    pid TEXT PRIMARY KEY REFERENCES workers(pid),
    number_popups INTEGER NOT NULL,
    number_tabswitch INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_two (
    pid TEXT PRIMARY KEY REFERENCES workers(pid),
    number_popups INTEGER NOT NULL,
    number_tabswitch INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE survey (
    pid TEXT PRIMARY KEY REFERENCES workers(pid),
    number_popups INTEGER NOT NULL,
    number_tabswitch INTEGER NOT NULL,
    question_1 TEXT,
    question_2 TEXT,
    question_3 TEXT,
    question_4 TEXT,
    question_5 TEXT,
    question_6 TEXT,
    question_7 TEXT,
    question_8 TEXT,
    question_9 TEXT,
    question_10 TEXT,
    question_11 TEXT,
    question_12 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);