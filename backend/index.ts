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
                    }, { status: 201 });
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
                    return new Response(JSON.stringify(data, null, 2))
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