import { InitialLoader } from "./marketplace/productsLoad/InitialLoader";
import Fastify from "fastify";
import { RestLayer } from "./rest/RestLayer";
import { ProductRepository } from "./database/ProductRepository";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";

export const KnownCategories: Set<string> = new Set();

async function run() {
  // Carrega produtos iniciais
  const allProducts = await InitialLoader.loadInitialData();
  const allowedProducts = await InitialLoader.filterOutNotAllowedCategories(allProducts);

  console.log("Allowed products: ", allowedProducts);

  // Popula categorias conhecidas
  for (let product = allowedProducts.length - 1; product >= 0; product--) {
    KnownCategories.add(allowedProducts[product].category);
  }

  const productRepository = ProductRepository.dumb(allowedProducts);

  const fastify = Fastify({ logger: true });

// 1. Primeiro CORS
await fastify.register(fastifyCors, {
  origin: "http://localhost:3000",  // ou "*" se quiser liberar tudo
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
});

// 2. Depois multipart
await fastify.register(fastifyMultipart);

// 3. Depois hooks
fastify.addHook("onRequest", (request, reply, done) => {
  console.log(`Received request: ${request.method} ${request.url}`);
  done();
});

// 4. E só por último as rotas
RestLayer.wire(fastify, productRepository);

  // Start server
  try {
    await fastify.listen({ port: 3001 });
    console.log("Server is running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

run()
  .then(() => console.log("Finished"))
  .catch((e) => console.error("Error: ", e));
