import { NotAuthenticatedError } from "../errors/customErrors.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const verifyUser = (request, reply) => {
    if (!request.session.get("user")) {
        reply.status(403);
        throw new NotAuthenticatedError("L'utilisateur n'est pas connecté.");
    }
    return request.session.get("user").id;
};
