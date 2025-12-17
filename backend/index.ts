import { SQL } from "bun";

let postgres: SQL | null = null;
console.log(Bun.env.DATABASE_URL);
if (Bun.env.DATABASE_URL != null) {
    postgres = new SQL(Bun.env.DATABASE_URL); // Add ?sslmode=require to the url
    console.log("Connected")
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


interface ResponsePayload {
    worker: string;
    number_popups: number;
    response: string;
}

const server = Bun.serve({
    port: 8080,
    routes: {

        "/api/status": new Response("OK"),

        "/api/response/add": {
            OPTIONS: () => {
                return new Response(null, { status: 204, headers: CORS_HEADERS });
            },
            POST: async req => {
                try {
                    const body: ResponsePayload = await req.json() as ResponsePayload;
                    const { worker, number_popups, response } = body;
                    if (postgres != null) {
                        console.log(body)
                        await postgres`
                        INSERT INTO summarize_one (worker, number_popups, response, created_at)
                        VALUES (${worker}, ${number_popups}, ${response}, NOW())
                    `;
                    } else {
                        return Response.json({ status: 400 })
                    }
                    return Response.json({
                        created: true,
                        worker,
                        number_popups,
                        response
                    }, { status: 201, headers: CORS_HEADERS, });
                } catch (error) {
                    console.error("API Error:", error);
                    return Response.json({ status: 400 })
                }
            },
        },

        "/api/response/get": {
            GET: async () => {
                if (postgres != null) {
                    let data = await postgres`SELECT * FROM summarize_one`
                    console.log(data)
                    return new Response(JSON.stringify(data, null, 2), { headers: CORS_HEADERS })
                }
                return Response.json({ status: 400 })
            }
        },
    },

    fetch(req) {
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Server running at ${server.url}`);