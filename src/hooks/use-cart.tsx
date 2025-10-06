import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "@/components/ui/product-card";

export type CartStateOption = "CRU" | "COZIDO" | "GRELHADO";

export interface CartItem {
  product: Product;
  quantity: number;
  state: CartStateOption;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; state: CartStateOption } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; state: CartStateOption; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; state: CartStateOption } }
  | { type: "CLEAR" };

const CART_STORAGE_KEY = "cart";

function readPersistedCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return { items: [] };
    return { items: parsed };
  } catch {
    return { items: [] };
  }
}

function writePersistedCart(state: CartState) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // ignore persistence errors
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, state: itemState } = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === product.id && i.state === itemState
      );
      if (existingIndex >= 0) {
        const next = [...state.items];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return { items: next };
      }
      return { items: [...state.items, { product, quantity, state: itemState }] };
    }
    case "UPDATE_QUANTITY": {
      const { productId, state: itemState, quantity } = action.payload;
      const next = state.items
        .map((i) =>
          i.product.id === productId && i.state === itemState ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0);
      return { items: next };
    }
    case "REMOVE_ITEM": {
      const { productId, state: itemState } = action.payload;
      return {
        items: state.items.filter((i) => !(i.product.id === productId && i.state === itemState)),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number, state: CartStateOption) => void;
  updateQuantity: (productId: string, state: CartStateOption, quantity: number) => void;
  removeItem: (productId: string, state: CartStateOption) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readPersistedCart);

  useEffect(() => {
    writePersistedCart(state);
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      items: state.items,
      addItem: (product, quantity, stateOption) =>
        dispatch({ type: "ADD_ITEM", payload: { product, quantity, state: stateOption } }),
      updateQuantity: (productId, stateOption, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, state: stateOption, quantity } }),
      removeItem: (productId, stateOption) =>
        dispatch({ type: "REMOVE_ITEM", payload: { productId, state: stateOption } }),
      clear: () => dispatch({ type: "CLEAR" }),
      totalItems,
      subtotal,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

