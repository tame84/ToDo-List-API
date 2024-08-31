import Fastify from "fastify";
import { todosRoutes } from "./routes/v1/todos.routes.js";

const fastify = Fastify();

fastify.register(todosRoutes, { prefix: "/v1/todos" });

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
