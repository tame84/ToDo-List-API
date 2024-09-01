import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { todosRoutes } from "./routes/v1/todos.routes.js";
import { categoriesRoutes } from "./routes/v1/categories.routes.js";
import { authRoutes } from "./routes/v1/auth.routes.js";

const fastify = Fastify();
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
    secret: readFileSync(join(rootDir, "secret-key")).toString(),
    cookieName: "session",
    cookie: { secure: process.env.NODE_ENV === "prod" },
});

fastify.register(todosRoutes, { prefix: "/v1/todos" });
fastify.register(categoriesRoutes, { prefix: "/v1/categories" });
fastify.register(authRoutes, { prefix: "/v1/auth" });

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT });
        console.log(`Serveur démarré sur http:/localhost:${process.env.PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
