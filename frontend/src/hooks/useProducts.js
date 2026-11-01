
import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import { aVistaPublica } from "../utils/producto.js";

// Consulta el catálogo completo. Compartido por Home y ProductList.
export function useProducts() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({
    attempt: null,
    products: [],
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ signal: controller.signal })
      .then((products) =>
        setResult({
          attempt,
          products: products.map(aVistaPublica),
          error: null,
        })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;

        setResult({
          attempt,
          products: [],
          error,
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const listo = result.attempt === attempt;

  return {
    products: listo ? result.products : [],
    error: listo ? result.error : null,
    loading: !listo,
    retry,
  };
}
