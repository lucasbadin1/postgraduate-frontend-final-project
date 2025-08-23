import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductsProvider } from "@/contexts/products-context";
import ProductsPage from "../page";

const mockProducts = [
  { id: 1, name: "Fone Bluetooth", price: 99.9, category: "Áudio", pictureUrl: "" },
  { id: 2, name: "Mouse Gamer", price: 49.9, category: "Periféricos", pictureUrl: "" },
];

jest.mock("@/contexts/products-context", () => {
  const actual = jest.requireActual("@/contexts/products-context");
  return {
    ...actual,
    useProducts: () => ({
      products: mockProducts,
      addProduct: jest.fn(),
    }),
  };
});

describe("ProductsPage", () => {
  it("mostra todos os produtos inicialmente", () => {
    const utils = render(
      <ProductsProvider>
        <ProductsPage />
      </ProductsProvider>
    );

    expect(utils.getByText("Fone Bluetooth")).toBeInTheDocument();
    expect(utils.getByText("Mouse Gamer")).toBeInTheDocument();
  });

  it("filtra produtos pelo código com debounce", async () => {
    const utils = render(
      <ProductsProvider>
        <ProductsPage />
      </ProductsProvider>
    );

    const input = utils.getByPlaceholderText(/digite o código/i);
    await userEvent.type(input, "1");

    expect(await utils.findByText("Fone Bluetooth")).toBeInTheDocument();
    expect(utils.queryByText("Mouse Gamer")).toBeNull();
  });

  it("filtra produtos pela categoria", async () => {
    const utils = render(
      <ProductsProvider>
        <ProductsPage />
      </ProductsProvider>
    );

    const select = utils.getByRole("combobox");
    await userEvent.selectOptions(select, "Periféricos");

    expect(await utils.findByText("Mouse Gamer")).toBeInTheDocument();
    expect(utils.queryByText("Fone Bluetooth")).toBeNull();
  });

  it("mostra mensagem de nenhum produto encontrado", async () => {
    const utils = render(
      <ProductsProvider>
        <ProductsPage />
      </ProductsProvider>
    );

    const input = utils.getByPlaceholderText(/digite o código/i);
    await userEvent.type(input, "999"); 

    expect(await utils.findByText(/nenhum produto encontrado/i)).toBeInTheDocument();
  });
});
