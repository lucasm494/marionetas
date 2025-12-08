// config/itemPositions.js

/**
 * CONFIGURAÇÃO DE POSIÇÕES DOS ITENS
 * 
 * Para editar as posições, basta alterar os valores x e y abaixo.
 * x: posição horizontal (0-100%) - 0 é esquerda, 100 é direita
 * y: posição vertical (0-100%) - 0 é topo, 100 é fundo
 */

export const itemPositions = {
  // CABEÇA
  Normal: {x: 50, y:20},
  Porco: {x: 50, y:19},
  Lobo: {x: 50, y:17},
  
  // TRONCO
  top1: { x: 51, y: 45 },
  top2: {x: 50, y: 45},      // Camisolas, camisas
  top3: { x: 50, y: 45 },   // Casacos (mesmo que top)
  
  // PERNAS
  pants1: { x: 50, y: 69.5 },    // Calças, saias
  pants2: { x: 50, y: 69.5 },
  pants3: { x: 50, y: 72 },
  
  // PÉS
  shoes1: { x: 50, y: 90 },    // Sapatos, botas
  shoes2: { x: 50, y: 90 },
  shoes3: { x: 50, y: 90 },
  
  // DEFAULT (para tipos não especificados)
  default: { x: 50, y: 50 }
};

/**
 * FUNÇÃO PARA OBTER POSIÇÃO POR TIPO DE ITEM
 * @param {string} itemType - Tipo do item (hat, top, pants, etc.)
 * @returns {Object} Posição {x, y}
 */
export const getPositionForItemID = (itemID) => {
  return itemPositions[itemID] || itemPositions.default;
};

/**
 * MAPA DE CORRESPONDÊNCIA ENTRE CATEGORIAS E TIPOS
 * Útil para quando os itens têm category em vez de type
 */
export const categoryToTypeMap = {
  hats: 'hat',
  tops: 'top', 
  pants: 'pants',
  shoes: 'shoes',
  accessories: 'accessory',
  colors: 'color'
};