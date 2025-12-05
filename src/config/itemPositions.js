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
  hat: { x: 50, y: 10 },      // Chapéus - topo da cabeça
  hair: { x: 50, y: 15 },     // Cabelo - meio da cabeça
  face: { x: 50, y: 22 },     // Rosto/olhos
  glasses: { x: 50, y: 22 },  // Óculos (mesmo que face)
  
  // TRONCO
  top: { x: 50, y: 42 },      // Camisolas, camisas
  jacket: { x: 50, y: 42 },   // Casacos (mesmo que top)
  
  // ACESSÓRIOS
  accessory: { x: 50, y: 30 }, // Colares, gravatas
  bag: { x: 30, y: 60 },      // Bolsa no lado esquerdo
  watch: { x: 20, y: 50 },    // Relógio no pulso esquerdo
  
  // PERNAS
  pants: { x: 50, y: 68 },    // Calças, saias
  
  // PÉS
  shoes: { x: 50, y: 92 },    // Sapatos, botas
  
  // DEFAULT (para tipos não especificados)
  default: { x: 50, y: 50 }
};

/**
 * FUNÇÃO PARA OBTER POSIÇÃO POR TIPO DE ITEM
 * @param {string} itemType - Tipo do item (hat, top, pants, etc.)
 * @returns {Object} Posição {x, y}
 */
export const getPositionForItemType = (itemType) => {
  return itemPositions[itemType] || itemPositions.default;
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