// utils/characterRenderer.js - VERSÃO CORRIGIDA E SIMPLIFICADA



// utils/characterRenderer.js

// CONSTANTES PARA CONFIGURAÇÃO (AJUSTAR AQUI!)
const CONFIG = {
  // Tamanho do canvas
  CANVAS_WIDTH: 300,
  CANVAS_HEIGHT: 400,
  
  // Escala geral
  SCALE: 2, // 2x para alta qualidade
  
  // CORPO SVG (configurações principais)
  BODY: {
    // Caminho do corpo (vem do images.js)
    IMAGE_PATH: '/images/corpo.svg',
    
    // Posição do corpo no canvas (percentagem 0-100)
    POSITION_X: 50,   // 50% = centro horizontal
    POSITION_Y: 55,   // 65% do topo (ajustar conforme necessário)
    
    // Tamanho do corpo - ESCOLHER UMA DAS OPÇÕES:
    
    // OPÇÃO 1: Tamanho fixo em pixels
    WIDTH: 200,       // largura em pixels
    HEIGHT: 300,      // altura em pixels
    
    // OPÇÃO 2: Percentagem do canvas (descomentar se quiser)
    // WIDTH_PERCENT: 66,   // 66% da largura do canvas
    // HEIGHT_PERCENT: 75,  // 75% da altura do canvas
    
    // OPÇÃO 3: Manter proporção original
    KEEP_ASPECT_RATIO: true,
    MAX_WIDTH: 220,   // largura máxima
    MAX_HEIGHT: 330,  // altura máxima
    
    // Cor de fundo do corpo (útil para debug)
    DEBUG_COLOR: 'transparent', // 'rgba(255, 200, 200, 0.3)' para ver
  },
  
  // ITENS (chapéus, roupas, etc.)
  ITEMS: {
    // Escala base dos itens
    BASE_SCALE: 1.0,
    
    // Tamanhos mínimos e máximos
    MIN_WIDTH: 40,
    MIN_HEIGHT: 40,
    MAX_WIDTH: 180,
    MAX_HEIGHT: 180,
    
    // Escalas específicas por tipo
    TYPE_SCALES: {
      hat: 1.2,       // Chapéus 20% maiores
      top: 1.1,       // Camisas 10% maiores
      pants: 1.0,     // Calças tamanho normal
      shoes: 0.9,     // Sapatos 10% menores
      accessory: 0.8, // Acessórios 20% menores
    },
    
    // Posições relativas ao corpo (offset em pixels)
    POSITION_OFFSETS: {
      hat: { x: 0, y: -100 },   // Acima do corpo
      top: { x: 0, y: -30 },    // No torso
      pants: { x: 0, y: 80 },   // Abaixo do torso
      shoes: { x: 0, y: 150 },  // Nos pés
      accessory: { x: 0, y: 0 }, // No centro (ajustar conforme item)
    },
  },
  
  // ORDEM DE RENDERIZAÇÃO (z-index)
  RENDER_ORDER: [
    'color',    // 1. Cores de fundo
    'body',     // 2. Corpo SVG
    'pants',    // 3. Calças
    'shoes',    // 4. Sapatos
    'top',      // 5. Camisa/casaco
    'hat',      // 6. Chapéu
    'accessory',// 7. Acessórios (mais em cima)
  ],
  
  // DEBUG
  DEBUG: {
    SHOW_BODY_BOUNDS: false,   // Mostrar retângulo ao redor do corpo
    SHOW_ITEM_BOUNDS: false,   // Mostrar retângulo ao redor dos itens
    SHOW_POSITION_MARKERS: false, // Mostrar marcadores de posição
  },
};

/**
 * Função auxiliar para calcular dimensões do corpo
 */
const calculateBodyDimensions = (config, canvas, bodyImg = null) => {
  let width, height;
  
  // OPÇÃO 1: Tamanho fixo
  if (config.BODY.WIDTH && config.BODY.HEIGHT) {
    width = config.BODY.WIDTH * config.SCALE;
    height = config.BODY.HEIGHT * config.SCALE;
  }
  // OPÇÃO 2: Percentagem do canvas
  else if (config.BODY.WIDTH_PERCENT && config.BODY.HEIGHT_PERCENT) {
    width = (config.BODY.WIDTH_PERCENT / 100) * canvas.width;
    height = (config.BODY.HEIGHT_PERCENT / 100) * canvas.height;
  }
  // OPÇÃO 3: Manter proporção da imagem
  else if (config.BODY.KEEP_ASPECT_RATIO && bodyImg) {
    const aspectRatio = bodyImg.naturalWidth / bodyImg.naturalHeight;
    
    // Usar largura máxima como referência
    width = Math.min(config.BODY.MAX_WIDTH * config.SCALE, canvas.width * 0.8);
    height = width / aspectRatio;
    
    // Verificar se altura não excede máximo
    if (height > config.BODY.MAX_HEIGHT * config.SCALE) {
      height = config.BODY.MAX_HEIGHT * config.SCALE;
      width = height * aspectRatio;
    }
  }
  // OPÇÃO 4: Tamanho padrão
  else {
    width = 200 * config.SCALE;
    height = 300 * config.SCALE;
  }
  
  return { width, height };
};

/**
 * Renderiza o corpo SVG
 */
const renderBody = async (ctx, canvas, config, character) => {
  console.log('🕺 Renderizando corpo SVG...');
  
  try {
    // Carregar imagem do corpo SVG
    const bodyImg = await loadImageAsync(config.BODY.IMAGE_PATH);
    
    if (!bodyImg) {
      console.warn('⚠️ Corpo SVG não carregado, usando fallback');
      renderBodyFallback(ctx, canvas, config);
      return null;
    }
    
    console.log(`✅ Corpo SVG carregado: ${bodyImg.naturalWidth}x${bodyImg.naturalHeight}`);
    
    // Calcular dimensões do corpo
    const bodyDims = calculateBodyDimensions(config, canvas, bodyImg);
    
    // Calcular posição do corpo
    const bodyCenterX = (config.BODY.POSITION_X / 100) * canvas.width;
    const bodyCenterY = (config.BODY.POSITION_Y / 100) * canvas.height;
    
    // Posição final (centralizada)
    const bodyX = bodyCenterX - bodyDims.width / 2;
    const bodyY = bodyCenterY - bodyDims.height / 2;
    
    console.log(`  Corpo: ${bodyDims.width}x${bodyDims.height} em (${bodyX}, ${bodyY})`);
    
    // DEBUG: Mostrar área do corpo
    if (config.DEBUG.SHOW_BODY_BOUNDS) {
      ctx.save();
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(bodyX, bodyY, bodyDims.width, bodyDims.height);
      
      // Marcar centro
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(bodyCenterX - 3, bodyCenterY - 3, 6, 6);
      ctx.restore();
    }
    
    // Desenhar corpo SVG
    ctx.drawImage(bodyImg, bodyX, bodyY, bodyDims.width, bodyDims.height);
    
    return {
      img: bodyImg,
      x: bodyX,
      y: bodyY,
      width: bodyDims.width,
      height: bodyDims.height,
      centerX: bodyCenterX,
      centerY: bodyCenterY
    };
    
  } catch (error) {
    console.error('❌ Erro ao renderizar corpo:', error);
    renderBodyFallback(ctx, canvas, config);
    return null;
  }
};

/**
 * Fallback caso o corpo SVG não carregue
 */
const renderBodyFallback = (ctx, canvas, config) => {
  const bodyCenterX = (config.BODY.POSITION_X / 100) * canvas.width;
  const bodyCenterY = (config.BODY.POSITION_Y / 100) * canvas.height;
  
  const width = 180 * config.SCALE;
  const height = 280 * config.SCALE;
  
  const bodyX = bodyCenterX - width / 2;
  const bodyY = bodyCenterY - height / 2;
  
  // Corpo simples (silhueta humana)
  ctx.fillStyle = '#F5D0A9'; // Cor de pele
  ctx.fillRect(bodyX, bodyY, width, height);
  
  // Cabeça
  ctx.beginPath();
  ctx.arc(bodyCenterX, bodyY + (height * 0.1), 30 * config.SCALE, 0, Math.PI * 2);
  ctx.fill();
  
  return {
    x: bodyX,
    y: bodyY,
    width,
    height,
    centerX: bodyCenterX,
    centerY: bodyCenterY
  };
};

/**
 * Calcula posição de um item relativa ao corpo
 */
const calculateItemPosition = (item, bodyInfo, config) => {
  let posX, posY;
  
  // Se o item tem posição específica, usar
  if (item.position) {
    posX = (item.position.x / 100) * (bodyInfo.width + 200);
    posY = (item.position.y / 100) * (bodyInfo.height + 200);
    posX += bodyInfo.x - 100;
    posY += bodyInfo.y - 100;
  } 
  // Senão, usar posição padrão baseada no tipo
  else {
    const offset = config.ITEMS.POSITION_OFFSETS[item.type] || { x: 0, y: 0 };
    posX = bodyInfo.centerX + (offset.x * config.SCALE);
    posY = bodyInfo.centerY + (offset.y * config.SCALE);
  }
  
  return { posX, posY };
};

/**
 * Calcula dimensões de um item
 */
const calculateItemDimensions = (item, img, config) => {
  let width, height;
  
  // Se o item tem dimensões definidas, usar
  if (item.width && item.height) {
    width = item.width * config.SCALE;
    height = item.height * config.SCALE;
  }
  // Senão, usar dimensões da imagem com escala
  else {
    const typeScale = config.ITEMS.TYPE_SCALES[item.type] || 1.0;
    const baseScale = config.ITEMS.BASE_SCALE * typeScale;
    
    width = (img.naturalWidth || 80) * baseScale * config.SCALE;
    height = (img.naturalHeight || 80) * baseScale * config.SCALE;
    
    // Manter proporção se só uma dimensão for fornecida
    if (item.width && !item.height) {
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      width = item.width * config.SCALE;
      height = width * aspectRatio;
    }
    if (!item.width && item.height) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      height = item.height * config.SCALE;
      width = height * aspectRatio;
    }
  }
  
  // Aplicar limites
  width = Math.max(config.ITEMS.MIN_WIDTH * config.SCALE, 
                  Math.min(config.ITEMS.MAX_WIDTH * config.SCALE, width));
  height = Math.max(config.ITEMS.MIN_HEIGHT * config.SCALE, 
                   Math.min(config.ITEMS.MAX_HEIGHT * config.SCALE, height));
  
  return { width, height };
};

/**
 * Função principal de renderização
 */
export const renderCharacterToCanvas = async (characterItems, canvas, options = {}) => {
  console.log('🎨 Renderizando personagem com corpo SVG...');
  
  // Merge config
  const config = { ...CONFIG, ...options };
  
  // Configurar canvas
  canvas.width = config.CANVAS_WIDTH * config.SCALE;
  canvas.height = config.CANVAS_HEIGHT * config.SCALE;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. RENDERIZAR CORPO SVG
  const bodyInfo = await renderBody(ctx, canvas, config, options.character);
  
  if (!bodyInfo) {
    console.error('Falha ao renderizar corpo');
    return null;
  }
  
  // 2. ADICIONAR "item" corpo para ordenação
  characterItems.unshift({
    id: 'body_svg',
    name: 'Corpo',
    type: 'body',
    position: { x: config.BODY.POSITION_X, y: config.BODY.POSITION_Y },
    width: bodyInfo.width / config.SCALE,
    height: bodyInfo.height / config.SCALE,
    isBody: true
  });
  
  // 3. CARREGAR IMAGENS DOS ITENS
  const itemsWithImages = await Promise.all(
    characterItems.map(async (item) => {
      if (item.type === 'color' || item.isBody) {
        return { item, img: null };
      }
      
      if (!item.image) {
        console.warn(`Item ${item.name} sem imagem`);
        return { item, img: null };
      }
      
      try {
        const img = await loadImageAsync(item.image);
        return { item, img };
      } catch (error) {
        console.error(`Erro ao carregar ${item.name}:`, error);
        return { item, img: null };
      }
    })
  );
  
  // 4. ORDENAR POR Z-INDEX
  const sortedItems = itemsWithImages.sort((a, b) => {
    const orderA = config.RENDER_ORDER.indexOf(a.item.type);
    const orderB = config.RENDER_ORDER.indexOf(b.item.type);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });
  
  // 5. RENDERIZAR ITENS
  for (const { item, img } of sortedItems) {
    if (item.isBody) continue; // Corpo já renderizado
    
    console.log(`- ${item.name} (${item.type})`);
    
    if (item.type === 'color') {
      // Fundo colorido
      if (item.color) {
        ctx.save();
        ctx.fillStyle = item.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    } else if (img) {
      // Calcular posição
      const { posX, posY } = calculateItemPosition(item, bodyInfo, config);
      
      // Calcular dimensões
      const { width: itemWidth, height: itemHeight } = calculateItemDimensions(item, img, config);
      
      // Posição final (centralizada)
      const finalX = posX - itemWidth / 2;
      const finalY = posY - itemHeight / 2;
      
      console.log(`  → ${Math.round(itemWidth)}x${Math.round(itemHeight)} em (${Math.round(finalX)}, ${Math.round(finalY)})`);
      
      // DEBUG: Mostrar área do item
      if (config.DEBUG.SHOW_ITEM_BOUNDS) {
        ctx.save();
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.strokeRect(finalX, finalY, itemWidth, itemHeight);
        ctx.restore();
      }
      
      // Desenhar item
      ctx.drawImage(img, finalX, finalY, itemWidth, itemHeight);
      
      // Aplicar cor
      if (item.color) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = item.color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(finalX, finalY, itemWidth, itemHeight);
        ctx.restore();
      }
    }
  }
  
  // DEBUG: Mostrar marcadores de posição
  if (config.DEBUG.SHOW_POSITION_MARKERS) {
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(bodyInfo.centerX - 5, bodyInfo.centerY - 5, 10, 10);
  }
  
  console.log('✅ Personagem renderizado com corpo SVG!');
  return canvas;
};

// Função loadImageAsync mantém igual...

/**
 * Cria imagem PNG do personagem
 */
export const createCharacterImage = async (character, options = {}) => {
  console.log('\n=== INICIANDO GERAÇÃO DE IMAGEM ===');
  console.log('Personagem:', character?.name);
  console.log('Número de itens:', character?.items?.length || 0);
  
  if (!character?.items || character.items.length === 0) {
    console.warn('Personagem sem itens');
    return null;
  }
  
  // Criar canvas
  const canvas = document.createElement('canvas');
  
  // Renderizar
  const result = await renderCharacterToCanvas(character.items, canvas, {
    width: 300,
    height: 400,
    scale: 2, // Alta qualidade
    backgroundColor: 'transparent',
    ...options
  });
  
  if (!result) {
    console.error('Falha na renderização');
    
    // Criar imagem de fallback para debug
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFCCCC';
    ctx.fillRect(0, 0, 300, 400);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('ERRO NA RENDERIZAÇÃO', 50, 200);
    
    return canvas.toDataURL('image/png');
  }
  
  // Converter para Data URL
  const dataUrl = canvas.toDataURL('image/png');
  console.log('✅ Imagem PNG gerada com sucesso!');
  console.log('Tamanho da Data URL:', Math.round(dataUrl.length / 1024), 'KB');
  
  return dataUrl;
};

/**
 * Carrega uma imagem (suporta URL string ou objeto do Webpack)
 */
const loadImageAsync = (src) => {
  return new Promise((resolve) => {
    // Se já for um elemento Image
    if (src instanceof HTMLImageElement) {
      if (src.complete) {
        resolve(src);
      } else {
        src.onload = () => resolve(src);
        src.onerror = () => resolve(null);
      }
      return;
    }
    
    // Extrair URL de objeto do Webpack se necessário
    let imageUrl = src;
    if (src && typeof src === 'object') {
      imageUrl = src.default || src.src || src;
    }
    
    // Se não for string, não é válido
    if (typeof imageUrl !== 'string') {
      console.warn('URL não é string:', src);
      resolve(null);
      return;
    }
    
    // Criar novo elemento Image
    const img = new Image();
    
    // IMPORTANTE: Permitir CORS para imagens do mesmo domínio
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log(`✅ Imagem carregada: ${imageUrl}`);
      resolve(img);
    };
    
    img.onerror = () => {
      console.warn(`❌ Falha ao carregar: ${imageUrl}`);
      resolve(null);
    };
    
    // Definir src
    img.src = imageUrl;
  });
};