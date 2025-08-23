import { FastifyInstance } from "fastify";
import { ProductRepository } from "../../../database/ProductRepository";
import { Models } from "./Models";
import { Models as RawModel } from "../Models";
import { KnownCategories } from "../../../index";

interface GetByIdParams {
  id: string; 
}

interface UpdateExistingBody {
  name: string;
  description: string;
  price: number;
  category: string;
  pictureUrl: string;
}

export class UpdateExisting {
  private static opts = {
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          category: { type: "string" },
          pictureUrl: { type: "string" },
        },
      },
      response: {
        200: Models.ProductResponseSchema,
        400: RawModel.ErrorResponseSchema,
      },
    },
  };

  public static wire(
    fastify: FastifyInstance,
    productRepository: ProductRepository
  ) {
    fastify.put<{ Params: GetByIdParams; Body: UpdateExistingBody }>(
      "/api/product/:id",
      UpdateExisting.opts,
      async (request: any, reply: any) => {
        const id = (request.params.id); 
        const updateBody = request.body as UpdateExistingBody;

        let productFromDB = productRepository.getById(id);
        if (!productFromDB) {
          reply.status(404).send({ error: "Product not found" });
          return;
        }

        if (updateBody.category !== undefined) {
          const category = updateBody.category;
          if (!KnownCategories.has(category)) {
            reply.status(400).send({
              message: `Category '${category}' is not recognized. Valid categories are: [${Array.from(
                KnownCategories
              ).join(", ")}]`,
            });
            return; 
          }
          productFromDB.category = category;
        }

        if (updateBody.name !== undefined) {
          productFromDB.name = updateBody.name;
        }
        if (updateBody.description !== undefined) {
          productFromDB.description = updateBody.description;
        }
        if (updateBody.price !== undefined) {
          productFromDB.price = updateBody.price;
        }
        if (updateBody.pictureUrl !== undefined) {
          productFromDB.pictureUrl = updateBody.pictureUrl;
        }

        const updatedProduct = {
          ...productFromDB,
          id,
        };

        const saved = productRepository.updateExisting(id, updatedProduct);

        reply.send(saved);
      }
    );
  }
}
