import { SQL } from "bun";

let postgres: SQL | null = null;
if (Bun.env.DATABASE_URL != null) {
    postgres = new SQL(Bun.env.DATABASE_URL); // Add ?sslmode=require to the url
}
if (Bun.env.DATABASE_URL == null) {
    throw new Error("No database url in env.");
}

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': `${Bun.env.FRONTEND}`,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
};

const ALLOWED_TABLES = ['task_one', 'task_two', 'survey'];

interface ResponsePayload {
    worker_number: number;
    task: string;
    number_popups: number;
    response?: string;
    question1?: string,
    question2?: string,
    question3?: string,
    question4?: string,
    question5?: string,
    question6?: string,
    question7?: string,
    question8?: string,
    question9?: string,
    question10?: string,
    question11?: string,
    question12?: string,
}

const server = Bun.serve({
    port: 8080,
    routes: {

        "/api/status": new Response("OK"),

        // Add to the table.
        "/api/response/add": {
            OPTIONS: () => {
                return new Response(null, { status: 204, headers: CORS_HEADERS });
            },
            POST: async req => {
                try {
                    const body: ResponsePayload = await req.json() as ResponsePayload;
                    const { worker_number, task, number_popups, response,
                        question1,
                        question2,
                        question3,
                        question4,
                        question5,
                        question6,
                        question7,
                        question8,
                        question9,
                        question10,
                        question11,
                        question12 } = body;
                    if (!worker_number || !task) {
                        return Response.json(
                            { error: "Missing: worker_number, task" },
                            { status: 400, headers: CORS_HEADERS }
                        );
                    }
                    if (!ALLOWED_TABLES.includes(task)) {
                        return new Response(JSON.stringify({ error: "Invalid task name" }), { status: 403, headers: CORS_HEADERS });
                    }
                    if (postgres != null) {
                        if (task == "survey") {
                            await postgres`
                                INSERT INTO survey 
                                (
                                    worker_number, 
                                    number_popups, 
                                    question_1, 
                                    question_2, 
                                    question_3, 
                                    question_4, 
                                    question_5, 
                                    question_6, 
                                    question_7, 
                                    question_8, 
                                    question_9, 
                                    question_10, 
                                    question_11, 
                                    question_12, 
                                    created_at
                                )
                                VALUES (
                                    ${worker_number}, 
                                    ${number_popups}, 
                                    ${question1}, 
                                    ${question2}, 
                                    ${question3}, 
                                    ${question4}, 
                                    ${question5}, 
                                    ${question6}, 
                                    ${question7}, 
                                    ${question8}, 
                                    ${question9}, 
                                    ${question10}, 
                                    ${question11}, 
                                    ${question12}, 
                                    NOW()
                                )
                            `;
                            return Response.json({
                                created: true,
                                worker_number,
                                number_popups,
                                response
                            }, { status: 201, headers: CORS_HEADERS, });
                        }
                        if (task == "task_one" || task == "task_two") {
                            await postgres`
                                INSERT INTO ${postgres(task)} (worker_number, number_popups, response, created_at)
                                VALUES (${worker_number}, ${number_popups}, ${response}, NOW())
                            `;
                        } else {
                            return Response.json(
                                { error: "Unknown task" },
                                { status: 400, headers: CORS_HEADERS }
                            );
                        }
                        return Response.json({
                            created: true,
                            worker_number,
                            number_popups,
                            response
                        }, { status: 201, headers: CORS_HEADERS, });
                    } else {
                        return Response.json(
                            { error: "Database not connected" },
                            { status: 503, headers: CORS_HEADERS }
                        );
                    }
                }
                catch (error) {
                    console.error("API Error:", error);
                    return Response.json(
                        { error: "Internal Server Error" },
                        { status: 400, headers: CORS_HEADERS }
                    );
                }
            },
        },

        // Get responses from a task or survey.
        "/api/response/get/:task": {
            GET: async (req) => {
                const taskName = req.params.task;
                if (!ALLOWED_TABLES.includes(taskName)) {
                    return new Response(JSON.stringify({ error: "Invalid task name" }), { status: 403, headers: CORS_HEADERS });
                }
                if (postgres != null) {
                    let data = await postgres`SELECT * FROM ${postgres(taskName)}`
                    return new Response(JSON.stringify(data, null, 2), { headers: CORS_HEADERS })
                }
                return Response.json({ status: 400, headers: CORS_HEADERS })
            }
        },

        // Gives the worker an unique number.
        "/api/worker/number": {
            GET: async () => {
                if (postgres != null) {
                    let data = await postgres`INSERT INTO workers DEFAULT VALUES RETURNING worker_number;`
                    return new Response(JSON.stringify({ "worker_number": data[0].worker_number }), { headers: CORS_HEADERS })
                }
                return Response.json({ status: 400, headers: CORS_HEADERS })
            }
        },
    },

    fetch(req) {
        return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    },
});

console.log(`Server running at ${server.url}`);