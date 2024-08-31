import {
    createCategory,
    editCategory,
    getAllCategories,
    getUniqueCategory,
    removeCategory,
} from "../../handlers/categories.handler.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export function categoriesRoutes(fastify, opts, done) {
    fastify.get("/", getAllCategories);
    fastify.get("/:id", getUniqueCategory);
    fastify.post("/", createCategory);
    fastify.put("/:id", editCategory);
    fastify.delete("/:id", removeCategory);

    done();
}
