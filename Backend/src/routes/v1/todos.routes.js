import {
    appendCategory,
    completeTodo,
    createTodo,
    getAllTodos,
    getUniqueTodo,
    removeTodo,
} from "../../handlers/todos.handler.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export function todosRoutes(fastify, opts, done) {
    fastify.get("/", getAllTodos);
    fastify.get("/:id", getUniqueTodo);
    fastify.post("/", createTodo);
    fastify.put("/:id", completeTodo);
    fastify.delete("/:id", removeTodo);
    fastify.put("/:id/:categoryId", appendCategory);

    done();
}
