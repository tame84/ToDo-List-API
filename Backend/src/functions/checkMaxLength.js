import { MaxLengthExceedError } from "../errors/customErrors.js";

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const checkMaxLength = (request, reply, target, maxLength) => {
    if (target.length > maxLength) {
        reply.status(400);
        throw new MaxLengthExceedError("Le nombre de caractère maximal a été dépassé.");
    }
};
