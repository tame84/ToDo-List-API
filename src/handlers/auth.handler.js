import { db } from "../db/database.js";
import { hash, verify } from "argon2";
import { InvalidCredentialsError, NotAuthenticatedError, UserAlreadyExistsError } from "../errors/customErrors.js";
import { checkMaxLength } from "../functions/checkMaxLength.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const signUp = async (request, reply) => {
    const { username, password } = request.body;

    if (username === undefined || password === undefined) {
        reply.status(400);
        throw new InvalidCredentialsError("Les identifiants d'enregistrement ne sont pas fournis.");
    }

    checkMaxLength(request, reply, username, 16);

    const user = db.prepare("SELECT * FROM users WHERE username = ?;").get(username);

    if (user === undefined) {
        checkMaxLength(request, reply, password, 24);

        db.prepare("INSERT INTO users (username, password) VALUES (?, ?);").run(username, await hash(password));

        reply.status(201);
        reply.send("Sign Up");
        return;
    }
    reply.status(409);
    throw new UserAlreadyExistsError("Ce nom d'utilisateur est déjà utilisé.");
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const logIn = async (request, reply) => {
    const { username, password } = request.body;

    if (username === undefined || password === undefined) {
        reply.status(400);
        throw new InvalidCredentialsError("Les identifiants de connexion ne sont pas fournis.");
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ?;").get(username);

    if (user !== undefined && (await verify(user.password, password))) {
        request.session.set("user", {
            id: user.id,
            username: user.username,
        });
        request.session.authenticated = true;
        return;
    }
    reply.status(401);
    throw new InvalidCredentialsError("Les identifiants sont invalides.");
};

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const logOut = async (request, reply) => {
    if (request.session.authenticated) {
        request.session.destroy();
    } else {
        reply.status(403);
        throw new NotAuthenticatedError("L'utilisateur n'est pas connecté.");
    }
};
