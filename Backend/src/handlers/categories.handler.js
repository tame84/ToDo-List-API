import { db } from "../db/database.js";
import { RecordNotFoundError } from "../errors/customErrors.js";
import { verifyUser } from "../functions/auth.js";
import { checkMaxLength } from "../functions/checkMaxLength.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getAllCategories = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const categories = db.prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY id DESC;").all(userId);

    reply.send(categories);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const getUniqueCategory = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const category = db
        .prepare("SELECT * FROM categories WHERE user_id = ? AND id = ?;")
        .get(userId, request.params.id);

    if (category === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La catégorie avec l'id ${request.params.id} est introuvable.`);
    }

    reply.send(category);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const createCategory = async (request, reply) => {
    const userId = verifyUser(request, reply);
    const { title } = request.body;

    if (title === undefined || / *(.+)/gm.exec(title)[1] === " ") {
        reply.status(400);
        throw new ElementNotProvidedError("Le titre de la catégorie n'est pas fourni ou est vide.");
    }

    checkMaxLength(request, reply, title, 140);

    db.prepare("INSERT INTO categories (title, user_id) VALUES (?, ?);").run(title, userId);

    reply.status(201);
    reply.send("Created");
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const editCategory = async (request, reply) => {
    const userId = verifyUser(request, reply);
    const { title } = request.body;

    if (title === undefined || / *(.+)/gm.exec(title)[1] === " ") {
        reply.status(400);
        throw new ElementNotProvidedError("Le titre de la catégorie n'est pas fourni ou est vide.");
    }

    checkMaxLength(request, reply, title, 140);

    const category = db
        .prepare("SELECT * FROM categories WHERE user_id = ? AND id = ?;")
        .get(userId, request.params.id);

    if (category === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La catégorie avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("UPDATE categories SET title = ? WHERE user_id = ? AND id = ?;").run(title, userId, request.params.id);

    Object.assign(category, { title });

    reply.send(category);
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const removeCategory = async (request, reply) => {
    const userId = verifyUser(request, reply);

    const todo = db.prepare("SELECT * FROM categories WHERE user_id = ? AND id = ?;").get(userId, request.params.id);

    if (todo === undefined) {
        reply.status(404);
        throw new RecordNotFoundError(`La catégorie avec l'id ${request.params.id} est introuvable.`);
    }

    db.prepare("DELETE FROM categories WHERE id = ?;").run(request.params.id);

    reply.status(204);
};
