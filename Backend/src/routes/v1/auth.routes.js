import { logIn, logOut, signUp } from "../../handlers/auth.handler.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export function authRoutes(fastify, opts, done) {
    fastify.post("/signup", signUp);
    fastify.post("/login", logIn);
    fastify.post("/logout", logOut);

    done();
}
