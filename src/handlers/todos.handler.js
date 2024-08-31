import { db } from "../db/database.js";
import { RecordNotFoundError, ElementNotProvidedError } from "../errors/customErrors.js";
import { isCompletedToBoolean } from "../functions/isCompletedToBoolean.js";
import { verifyUser } from "../functions/auth.js";
import { checkMaxLength } from "../functions/checkMaxLength.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getAllTodos = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todos = db.prepare("SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC;").all(userId);
    todos.forEach((todo) => {
        Object.assign(todo, { is_completed: isCompletedToBoolean(todo.is_completed) });
    });

    reply.send(todos);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getUniqueTodo = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todo = db.prepare("SELECT * FROM todos WHERE user_id = ? AND id = ?;").get(userId, request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    Object.assign(todo, { is_completed: isCompletedToBoolean(todo.is_completed) });

    reply.send(todo);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const createTodo = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const { title, content } = request.body;

    if (title === undefined || / *(.+)/gm.exec(title)[1] === " ") {
        reply.status(400);
        throw new ElementNotProvidedError("Le titre de la To-Do n'est pas fourni ou est vide.");
    }

    checkMaxLength(request, reply, title, 140);

    db.prepare("INSERT INTO todos (title, content, user_id) VALUES (?, ?, ?);").run(title, content, userId);

    reply.status(201);
    reply.send("Created");
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const completeTodo = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todo = db.prepare("SELECT * FROM todos WHERE user_id = ? AND id = ?;").get(userId, request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("UPDATE todos SET is_completed = 1 WHERE user_id = ? AND id = ?;").run(userId, request.params.id);

    Object.assign(todo, { is_completed: isCompletedToBoolean(1) });

    reply.send(todo);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const removeTodo = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todo = db.prepare("SELECT * FROM todos WHERE user_id = ? AND id = ?;").get(userId, request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La To-Do avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("DELETE FROM todos WHERE user_id = ? AND id = ?;").run(userId, request.params.id);

    reply.status(204);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const appendCategory = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todo = db.prepare("SELECT * FROM todos WHERE user_id = ? AND id = ?;").get(userId, request.params.id);
    const category = db
        .prepare("SELECT * FROM categories WHERE user_id = ? AND id = ?;")
        .get(userId, request.params.categoryId);

    if (todo === undefined || category === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(
            `La To-Do avec l'id ${request.params.id} ou la catégorie avec l'id ${request.params.categoryId} sont introuvables.`
        );
    }

    db.prepare("UPDATE todos SET category_id = ? WHERE user_id = ? AND id = ?;").run(
        request.params.categoryId,
        userId,
        request.params.id
    );

    Object.assign(todo, { category_id: Number(request.params.categoryId) });

    reply.send(todo);
};
