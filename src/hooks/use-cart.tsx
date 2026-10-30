import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { useProducts, type Product, type ProductState } from "@/hooks/use-products";
import { calcTotals, isValidState, saleBlock, type SaleBlock } from "@/lib/pricing";

export type CartStateOption = ProductState;

/** O que fica guardado no telemóvel: uma cópia do produto no momento em que foi adicionado. */
interface StoredItem {
  product: Product;
  quantity: number;
  state: CartStateOption;
}

/** Linha do carrinho já cruzada com o catálogo atual. */
export interface CartItem extends StoredItem {
  /** Preço que o cliente viu ao adicionar (se diferente do atual) */
  previousPrice: number | null;
  block: SaleBlock;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: StoredItem }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; state: CartStateOption; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; state: CartStateOption } }
  | { type: "REFRESH_SNAPSHOTS"; payload: Product[] }
  | { type: "CLEAR" };

const CART_STORAGE_KEY = "cart";

function readPersistedCart(): StoredItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ignora linhas antigas/inválidas (ex.: estado "GRELHADO" que já não existe)
    return parsed.filter(
      (i) => i?.product?.id && typeof i.quantity === "number" && i.quantity > 0 && isValidState(i.state),
    );
  } catch {
    return [];
  }
}

function cartReducer(items: StoredItem[], action: CartAction): StoredItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, state } = action.payload;
      const idx = items.findIndex((i) => i.product.id === product.id && i.state === state);
      if (idx >= 0) {
        const next = [...items];
        next[idx] = { ...next[idx], product, quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...items, { product, quantity, state }];
    }
    case "UPDATE_QUANTITY": {
      const { productId, state, quantity } = action.payload;
      return items
        .map((i) => (i.product.id === productId && i.state === state ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
    }
    case "REMOVE_ITEM": {
      const { productId, state } = action.payload;
      return items.filter((i) => !(i.product.id === productId && i.state === state));
    }
    case "REFRESH_SNAPSHOTS": {
      const byId = new Map(action.payload.map((p) => [p.id, p]));
      return items.map((i) => (byId.has(i.product.id) ? { ...i, product: byId.get(i.product.id)! } : i));
    }
    case "CLEAR":
      return [];
    default:
      return items;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number, state: CartStateOption) => void;
  updateQuantity: (productId: string, state: CartStateOption, quantity: number) => void;
  removeItem: (productId: string, state: CartStateOption) => void;
  clear: () => void;
  /** Aceita os preços atuais (esconde o aviso de preço alterado) */
  acceptCurrentPrices: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  hasPriceChanges: boolean;
  hasBlockingIssues: boolean;
  catalogLoaded: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [stored, dispatch] = useReducer(cartReducer, undefined, readPersistedCart);
  const { data: catalog, isSuccess } = useProducts();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Sem espaço/privado: o carrinho continua a funcionar só nesta sessão
    }
  }, [stored]);

  const acceptCurrentPrices = useCallback(() => {
    if (catalog) dispatch({ type: "REFRESH_SNAPSHOTS", payload: catalog });
  }, [catalog]);

  const value = useMemo<CartContextValue>(() => {
    const byId = new Map((catalog ?? []).map((p) => [p.id, p]));

    // Quantidade total por produto (para verificar stock somando Cru + Cozido)
    const qtyByProduct = new Map<string, number>();
    for (const i of stored) qtyByProduct.set(i.product.id, (qtyByProduct.get(i.product.id) ?? 0) + i.quantity);

    const items: CartItem[] = stored.map((i) => {
      if (!isSuccess) return { ...i, previousPrice: null, block: null };
      const live = byId.get(i.product.id);
      if (!live) return { ...i, previousPrice: null, block: "unavailable" };
      const previousPrice = live.price !== i.product.price ? i.product.price : null;
      return {
        product: live,
        quantity: i.quantity,
        state: i.state,
        previousPrice,
        block: saleBlock(live, qtyByProduct.get(live.id) ?? i.quantity),
      };
    });

    const { subtotal, deliveryFee, total } = calcTotals(
      items.filter((i) => !i.block).map((i) => ({ price: i.product.price, quantity: i.quantity })),
    );

    return {
      items,
      addItem: (product, quantity, state) => dispatch({ type: "ADD_ITEM", payload: { product, quantity, state } }),
      updateQuantity: (productId, state, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, state, quantity } }),
      removeItem: (productId, state) => dispatch({ type: "REMOVE_ITEM", payload: { productId, state } }),
      clear: () => dispatch({ type: "CLEAR" }),
      acceptCurrentPrices,
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      total,
      hasPriceChanges: items.some((i) => i.previousPrice !== null),
      hasBlockingIssues: items.some((i) => i.block !== null),
      catalogLoaded: isSuccess,
    };
  }, [stored, catalog, isSuccess, acceptCurrentPrices]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
