import { db } from "../db/database.js";
import { TodoNotFoundError, TitleNotProvidedError } from "../errors/customErrors.js";
import { isCompletedToBoolean } from "../functions/isCompletedToBoolean.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getAllTodos = async (request, reply) => {
    const todos = db.prepare("SELECT * FROM todos ORDER BY id DESC;").all();
    todos.forEach((todo) => {
        Object.assign(todo, { isCompleted: isCompletedToBoolean(todo.isCompleted) });
    });

    reply.send(todos);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getUniqueTodo = async (request, reply) => {
    const todo = db.prepare("SELECT * FROM todos WHERE id = ?;").get(request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new TodoNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    Object.assign(todo, { isCompleted: isCompletedToBoolean(todo.isCompleted) });

    reply.send(todo);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const createTodo = async (request, reply) => {
    const { title, content } = request.body;

    if (title === undefined || / *(.+)/gm.exec(title)[1] === " ") {
        throw new TitleNotProvidedError("Le titre de la To-Do n'est pas fourni ou est vide.");
    }

    db.prepare("INSERT INTO todos (title, content) VALUES (?, ?);").run(title, content);

    reply.send("Created");
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const completeTodo = async (request, reply) => {
    const todo = db.prepare("SELECT * FROM todos WHERE id = ?;").get(request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new TodoNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("UPDATE todos SET isCompleted = 1 WHERE id = ?;").run(request.params.id);

    Object.assign(todo, { isCompleted: isCompletedToBoolean(1) });

    reply.send(todo);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const removeTodo = async (request, reply) => {
    const todo = db.prepare("SELECT * FROM todos WHERE id = ?;").get(request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new TodoNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("DELETE FROM todos WHERE id = ?;").run(request.params.id);

    reply.send("Deleted");
};
