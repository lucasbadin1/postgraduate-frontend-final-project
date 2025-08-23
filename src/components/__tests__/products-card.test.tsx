import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/components/product-card";

// Mock do contexto
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/contexts/products-context", () => {
  return {
    useProducts: () => ({
      updateProduct: mockUpdate,
      deleteProduct: mockDelete,
    }),
  };
});

const mockProduct = {
  id: 1,
  name: "Teclado Mecânico",
  category: "Periféricos",
  price: 199.9,
  description: "Um teclado gamer top.",
  pictureUrl: "",
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra os dados do produto corretamente", () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);

    expect(getByText("Teclado Mecânico")).toBeInTheDocument();
    expect(getByText("Periféricos")).toBeInTheDocument();
    expect(getByText("R$ 199.90")).toBeInTheDocument();
    expect(getByText("Um teclado gamer top.")).toBeInTheDocument();
  });

  it("entra no modo de edição ao clicar em 'Editar'", async () => {
    const { getByText, getByPlaceholderText } = render(
      <ProductCard product={mockProduct} />
    );

    await userEvent.click(getByText("Editar"));

    expect(getByPlaceholderText("Nome do produto")).toBeInTheDocument();
    expect(getByPlaceholderText("Categoria")).toHaveValue("Periféricos");
    expect(getByPlaceholderText("Preço (ex.: 199.90)")).toHaveValue("199.9");
  });

  it("chama updateProduct ao salvar edição", async () => {
    const { getByText, getByPlaceholderText } = render(
      <ProductCard product={mockProduct} />
    );

    await userEvent.click(getByText("Editar"));

    const inputNome = getByPlaceholderText("Nome do produto");
    await userEvent.clear(inputNome);
    await userEvent.type(inputNome, "Teclado Novo");

    await userEvent.click(getByText("Salvar"));

    expect(mockUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        name: "Teclado Novo",
      })
    );
  });

  it("cancela edição ao clicar em 'Cancelar'", async () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
      <ProductCard product={mockProduct} />
    );

    await userEvent.click(getByText("Editar"));

    const inputNome = getByPlaceholderText("Nome do produto");
    await userEvent.clear(inputNome);
    await userEvent.type(inputNome, "Outro Nome");

    await userEvent.click(getByText("Cancelar"));

    expect(getByText("Teclado Mecânico")).toBeInTheDocument();
    expect(queryByPlaceholderText("Nome do produto")).toBeNull();
  });

  it("chama deleteProduct ao confirmar exclusão", async () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    const { getByText } = render(<ProductCard product={mockProduct} />);

    await userEvent.click(getByText("Excluir"));

    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it("não chama deleteProduct se cancelar exclusão", async () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    const { getByText } = render(<ProductCard product={mockProduct} />);

    await userEvent.click(getByText("Excluir"));

    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("não renderiza botões de ação se hideActions for true", () => {
    const { queryByText } = render(
      <ProductCard product={mockProduct} hideActions />
    );

    expect(queryByText("Editar")).toBeNull();
    expect(queryByText("Excluir")).toBeNull();
  });
});
