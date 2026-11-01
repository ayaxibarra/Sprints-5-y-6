import { useCallback, useEffect, useState } from "react";
import { getProductById } from "../services/productService.js";

// Consulta un producto por id. Al cambiar el id (o reintentar) vuelve a estado de carga
// sin mostrar el producto anterior.
export function useProduct(id) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, product: null, error: null });
  const key = `${id}#${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    getProductById(id, { signal: controller.signal })
      .then((product) => setResult({ key, product, error: null }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setResult({ key, product: null, error });
      });

    return () => controller.abort();
  }, [id, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const listo = result.key === key;

  return {
    product: listo ? result.product : null,
    error: listo ? result.error : null,
    loading: !listo,
    retry,
  };
}