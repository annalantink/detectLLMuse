CREATE TABLE summarize_one (
    worker_number SERIAL PRIMARY KEY,
    worker VARCHAR(255) NOT NULL,
    number_popups INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);