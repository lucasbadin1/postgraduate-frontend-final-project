import { FastifyInstance } from "fastify";
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { ProductRepository } from "../../../database/ProductRepository";
import { KnownCategories } from "../../../index";
import { CreateNew } from "./CreateNew";

interface CsvProduct {
  name: string;
  description: string;
  price: string;
  category: string;
  pictureUrl: string;
}

export class UploadProducts {
  public static wire(fastify: FastifyInstance, productRepository: ProductRepository) {

    fastify.post("/api/product/upload", async (request: any, reply: any) => {
      const file = await request.file();
      if (!file) {
        return reply.status(400).send({ message: "Nenhum arquivo enviado" });
      }
      if (!file.filename.toLowerCase().endsWith(".csv")) {
        return reply.status(400).send({ message: "Extensão de arquivo inválida" });
      }

      const uploadDir = path.join(process.cwd(), "base", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, file.filename);

      await new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(uploadPath);
        file.file.pipe(ws);
        file.file.on("end", resolve);
        file.file.on("error", reject);
      });

      const valid: any[] = [];
      const invalid: any[] = [];

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(uploadPath)
          .pipe(parse({ columns: true, skip_empty_lines: true }))
          .on("data", (row: CsvProduct) => {
            const errors: string[] = [];
            if (!row.name?.trim()) errors.push("Nome obrigatório");
            if (!row.price || isNaN(Number(row.price))) errors.push("Preço inválido");
            if (!row.category?.trim() || !KnownCategories.has(row.category.trim())) {
              errors.push("Categoria inválida");
            }

            if (errors.length === 0) {
              valid.push({
                name: row.name.trim(),
                description: row.description?.trim() || "",
                price: Number(row.price),
                category: row.category.trim(),
                pictureUrl: row.pictureUrl?.trim() || "/placeholder.png",
              });
            } else {
              invalid.push({ row, errors });
            }
          })
          .on("end", () => resolve())
          .on("error", (err) => reject(err));
      });

      return reply.send({ valid, invalid });
    });

    fastify.post("/api/product/upload/save", async (request: any, reply: any) => {
      const { products } = request.body;
      if (!Array.isArray(products)) {
        return reply.status(400).send({ message: "Produtos inválidos" });
      }

      const results: any[] = [];
      for (const p of products) {
        try {
          const saved = CreateNew.createProduct(productRepository, p);
          results.push({ status: "sucesso", saved });
        } catch (err: any) {
          results.push({ product: p.name, status: "falha", error: err.message });
        }
      }

      return reply.send(results);
    });
  }
}
