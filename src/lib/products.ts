import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/interface/product";

export async function readProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "public", "base", "products.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as Product[];
}
