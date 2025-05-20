/**
 * Salva um valor no localStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} value - Valor a ser armazenado
 */
export function saveToStorage(key, value) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error)
  }
}

/**
 * Recupera um valor do localStorage
 * @param {string} key - Chave para recuperação
 * @returns {any} - Valor recuperado
 */
export function getFromStorage(key) {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error("Erro ao recuperar do localStorage:", error)
    return null
  }
}

/**
 * Remove um valor do localStorage
 * @param {string} key - Chave para remoção
 */
export function removeFromStorage(key) {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error)
  }
}
