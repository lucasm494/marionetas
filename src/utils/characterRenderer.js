// utils/characterRenderer.js

// CONSTANTES PARA CONFIGURAÇÃO - AJUSTAR AQUI!
const CONFIG = {
  // Tamanho do canvas final
  CANVAS_WIDTH: 50,
  CANVAS_HEIGHT: 100,
  
  // Qualidade (1 = normal, 2 = HD, 3 = ultra HD)
  SCALE: 3,
  
  // CORPO SVG
  BODY: {
    IMAGE_PATH: '/images/inicial.png',
    
    // Posição do corpo no canvas (percentagem 0-100)
    POSITION_X: 50,   // Centro horizontal
    POSITION_Y: 50,   // 65% do topo
    
    // Tamanho do corpo (ajustar conforme o SVG)
    WIDTH: 50,
    HEIGHT: 80,
    
    // Para manter proporção do SVG (descomentar se quiser)
    //KEEP_ASPECT_RATIO: true,
    //MAX_WIDTH: 20,
    //MAX_HEIGHT: 30,
  },
  
  // ITENS - AJUSTAR TAMANHOS E POSIÇÕES
  ITEMS: {
    // Escala base de todos os itens
    BASE_SCALE: 0.6,
    
    // Tamanhos mínimos e máximos (em pixels)
    MIN_WIDTH: 20,
    MIN_HEIGHT: 20,
    MAX_WIDTH: 80,
    MAX_HEIGHT: 80,
    
    // Escalas específicas por tipo
    TYPE_SCALES: {
      hat: 0.5,       // Chapéus 20% maiores
      top: 1.0,       // Camisas 10% maiores
      pants: 1.0,     // Calças tamanho normal
      shoes: 0.5,     // Sapatos 10% menores
    },
    
    // Posições relativas ao corpo (offset em pixels)
    POSITION_OFFSETS: {
      hat: { x: 0, y: 0 },   // Acima do corpo
      top: { x: 0, y: 0 },    // No torso
      pants: { x: 0, y: 0 },   // Abaixo do torso
      shoes: { x: 0, y: 0 },  // Nos pés
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
    'accessory',// 7. Acessórios
  ],
};

/**
 * Carrega uma imagem (suporta URL string ou Data URL)
 */
const loadImageAsync = (src) => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    
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
    
    // Se for Data URL (imagem pintada) ou URL normal
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log(`✅ Imagem carregada: ${src.substring(0, 50)}...`);
      resolve(img);
    };
    
    img.onerror = () => {
      console.warn(`❌ Falha ao carregar imagem: ${src.substring(0, 50)}...`);
      resolve(null);
    };
    
    img.src = src;
  });
};

/**
 * Renderiza o corpo SVG
 */
const renderBody = async (ctx, canvas, config) => {
  console.log('🕺 Renderizando corpo SVG...');
  
  try {
    // Carregar imagem do corpo SVG
    const bodyImg = await loadImageAsync(config.BODY.IMAGE_PATH);
    
    if (!bodyImg) {
      console.warn('⚠️ Corpo SVG não carregado');
      return renderBodyFallback(ctx, canvas, config);
    }
    
    console.log(`✅ Corpo SVG: ${bodyImg.naturalWidth}x${bodyImg.naturalHeight}`);
    
    // Calcular dimensões
    const width = config.BODY.WIDTH * config.SCALE;
    const height = config.BODY.HEIGHT * config.SCALE;
    
    // Calcular posição
    const centerX = (config.BODY.POSITION_X / 100) * canvas.width;
    const centerY = (config.BODY.POSITION_Y / 100) * canvas.height;
    
    // Posição final (centralizada)
    const x = centerX - width / 2;
    const y = centerY - height / 2;
    
    console.log(`  Corpo: ${width}x${height} em (${x}, ${y})`);
    
    // Desenhar corpo
    ctx.drawImage(bodyImg, x, y, width, height);
    
    return {
      x, y, width, height,
      centerX, centerY
    };
    
  } catch (error) {
    console.error('❌ Erro ao renderizar corpo:', error);
    return renderBodyFallback(ctx, canvas, config);
  }
};

/**
 * Fallback se o corpo não carregar
 */
const renderBodyFallback = (ctx, canvas, config) => {
  const centerX = (config.BODY.POSITION_X / 100) * canvas.width;
  const centerY = (config.BODY.POSITION_Y / 100) * canvas.height;
  
  const width = 180 * config.SCALE;
  const height = 280 * config.SCALE;
  
  const x = centerX - width / 2;
  const y = centerY - height / 2;
  
  // Silhueta simples
  ctx.fillStyle = '#F5D0A9';
  ctx.fillRect(x, y, width, height);
  
  return { x, y, width, height, centerX, centerY };
};

/**
 * Calcula posição de um item
 */
const calculateItemPosition = (item, bodyInfo, config) => {
  let posX, posY;
  
  // Se o item tem posição definida no CharacterBody
  if (item.position) {
    // Converter posição relativa (0-100) para pixels
    // Assumindo que a posição é relativa à área do corpo
    posX = bodyInfo.centerX + ((item.position.x - 50) * config.SCALE);
    posY = bodyInfo.centerY + ((item.position.y - 50) * config.SCALE);
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
  
  // PRIORIDADE 1: Dimensões definidas no item
  if (item.width && item.height) {
    width = item.width * config.ITEMS.BASE_SCALE;
    height = item.height * config.ITEMS.BASE_SCALE;
  }
  // PRIORIDADE 2: Usar dimensões da imagem com escala
  else if (img) {
    const typeScale = config.ITEMS.TYPE_SCALES[item.type] || 1.0;
    const baseScale = config.ITEMS.BASE_SCALE * typeScale;
    
    width = (img.naturalWidth || 80) * baseScale * config.SCALE;
    height = (img.naturalHeight || 80) * baseScale * config.SCALE;
  }
  // PRIORIDADE 3: Tamanhos padrão
  else {
    const defaultSizes = {
      hat: { width: 120, height: 80 },
      top: { width: 140, height: 120 },
      pants: { width: 100, height: 100 },
      shoes: { width: 80, height: 40 },
      accessory: { width: 60, height: 60 },
    };
    
    const defaultSize = defaultSizes[item.type] || { width: 80, height: 80 };
    width = defaultSize.width * config.SCALE;
    height = defaultSize.height * config.SCALE;
  }
  
  // Aplicar limites
  width = Math.max(config.ITEMS.MIN_WIDTH * config.SCALE, 
                  Math.min(config.ITEMS.MAX_WIDTH * config.SCALE, width));
  height = Math.max(config.ITEMS.MIN_HEIGHT * config.SCALE, 
                   Math.min(config.ITEMS.MAX_HEIGHT * config.SCALE, height));
  
  return { width, height };
};

/**
 * Processa e renderiza um item PINTADO
 */
const renderPaintedItem = async (ctx, item, posX, posY, width, height, config) => {
  console.log(`🎨 Processando item: ${item.name}`);
  
  // PRIORIDADE ABSOLUTA: Usar paintedImage se existir
  if (item.paintedImage) {
    console.log(`  → Usando IMAGEM PINTADA pelo utilizador`);
    
    try {
      const paintedImg = await loadImageAsync(item.paintedImage);
      
      if (paintedImg) {
        // Desenhar a imagem pintada EXATAMENTE como foi criada
        ctx.drawImage(paintedImg, posX, posY, width, height);
        return true;
      } else {
        console.warn(`  ⚠️ paintedImage não carregada, usando fallback`);
      }
    } catch (error) {
      console.error(`  ❌ Erro ao carregar paintedImage:`, error);
    }
  }
  
  // PRIORIDADE 2: Usar imagem original + cor (modo antigo)
  if (item.image) {
    console.log(`  → Usando imagem original + cor`);
    
    try {
      const originalImg = await loadImageAsync(item.image);
      
      if (originalImg) {
        // Desenhar imagem original
        ctx.drawImage(originalImg, posX, posY, width, height);
        
        // Aplicar cor se existir (modo antigo de colorir)
        if (item.color) {
          ctx.save();
          ctx.globalCompositeOperation = 'source-atop';
          ctx.fillStyle = item.color;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(posX, posY, width, height);
          ctx.restore();
        }
        return true;
      }
    } catch (error) {
      console.error(`  ❌ Erro ao carregar imagem original:`, error);
    }
  }
  
  // PRIORIDADE 3: Item de cor (fundo)
  if (item.type === 'color' && item.color) {
    console.log(`  → Aplicando cor de fundo: ${item.color}`);
    ctx.save();
    ctx.fillStyle = item.color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    return true;
  }
  
  console.warn(`  ⚠️ Item sem imagem renderizável`);
  return false;
};

/**
 * Função principal de renderização
 */
export const renderCharacterToCanvas = async (characterItems, canvas, options = {}) => {
  console.log('🎨 INICIANDO RENDERIZAÇÃO DE PERSONAGEM');
  console.log('Items recebidos:', characterItems);
  
  // Verificar paintedImages
  characterItems.forEach((item, i) => {
    if (item.paintedImage) {
      console.log(`Item ${i} (${item.name}) tem paintedImage:`, 
        item.paintedImage.substring(0, 50) + '...');
    }
  });
  
  // Merge config
  const config = { ...CONFIG, ...options };
  
  // Configurar canvas
  canvas.width = config.CANVAS_WIDTH * config.SCALE;
  canvas.height = config.CANVAS_HEIGHT * config.SCALE;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. RENDERIZAR CORPO SVG
  const bodyInfo = await renderBody(ctx, canvas, config);
  
  // 2. ADICIONAR "item" corpo para ordenação
  const allItems = [
    {
      id: 'body_svg',
      name: 'Corpo',
      type: 'body',
      isBody: true
    },
    ...characterItems
  ];
  
  // 3. ORDENAR POR Z-INDEX
  const sortedItems = [...allItems].sort((a, b) => {
    const orderA = config.RENDER_ORDER.indexOf(a.type);
    const orderB = config.RENDER_ORDER.indexOf(b.type);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });
  
  console.log(`Renderizando ${sortedItems.length} itens ordenados`);
  
  // 4. RENDERIZAR CADA ITEM NA ORDEM CORRETA
  for (const item of sortedItems) {
    if (item.isBody) continue; // Corpo já foi renderizado
    
    console.log(`\n--- Renderizando: ${item.name || item.type} ---`);
    
    // Para itens de cor (fundo), renderizar primeiro
    if (item.type === 'color') {
      await renderPaintedItem(ctx, item, 0, 0, canvas.width, canvas.height, config);
      continue;
    }
    
    // Calcular posição do item
    const { posX, posY } = calculateItemPosition(item, bodyInfo, config);
    
    // Calcular dimensões (precisa da imagem para cálculo correto)
    let itemImg = null;
    if (item.paintedImage) {
      itemImg = await loadImageAsync(item.paintedImage);
    } else if (item.image) {
      itemImg = await loadImageAsync(item.image);
    }
    
    const { width: itemWidth, height: itemHeight } = calculateItemDimensions(item, itemImg, config);
    
    // Posição final (centralizada)
    const finalX = posX - itemWidth / 2;
    const finalY = posY - itemHeight / 2;
    
    console.log(`  Posição: (${Math.round(finalX)}, ${Math.round(finalY)})`);
    console.log(`  Tamanho: ${Math.round(itemWidth)}x${Math.round(itemHeight)}`);
    
    // Renderizar item (com paintedImage se existir)
    await renderPaintedItem(ctx, item, finalX, finalY, itemWidth, itemHeight, config);
  }
  
  console.log('✅ RENDERIZAÇÃO COMPLETA!');
  return canvas;
};

/**
 * Cria imagem PNG do personagem
 */
export const createCharacterImage = async (character, options = {}) => {
  console.log('\n🖼️ CRIANDO IMAGEM PARA PERSONAGEM:', character?.name);
  
  if (!character?.items || character.items.length === 0) {
    console.warn('Personagem sem itens');
    return null;
  }
  
  // DEBUG: Verificar itens
  console.log('Número de itens:', character.items.length);
  character.items.forEach((item, i) => {
    console.log(`Item ${i}: ${item.name} (${item.type})`);
    console.log(`  Tem paintedImage?`, !!item.paintedImage);
    console.log(`  Tem cor?`, !!item.color);
  });
  
  // Criar canvas
  const canvas = document.createElement('canvas');
  
  // Renderizar
  const result = await renderCharacterToCanvas(character.items, canvas, {
    ...options,
    characterName: character.name // Para debug
  });
  
  if (!result) {
    console.error('❌ Falha na renderização');
    return null;
  }
  
  // Converter para Data URL
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  console.log(`✅ Imagem gerada: ${Math.round(dataUrl.length / 1024)} KB`);
  
  return dataUrl;
};

/**
 * Gera imagens para múltiplos personagens
 */
export const generateCharacterImagesBatch = async (characters, options = {}) => {
  console.log(`\n🔄 GERANDO ${characters.length} IMAGENS`);
  
  const charactersWithImages = await Promise.all(
    characters.map(async (character) => {
      try {
        const imageUrl = await createCharacterImage(character, options);
        
        return {
          ...character,
          characterImage: imageUrl,
          imageGeneratedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error(`❌ Erro ao gerar imagem para ${character.name}:`, error);
        return character;
      }
    })
  );
  
  const successful = charactersWithImages.filter(c => c.characterImage).length;
  console.log(`✅ ${successful}/${characters.length} imagens geradas com sucesso`);
  
  return charactersWithImages;
};

// Exportar apenas o necessário
export default {
  createCharacterImage,
  generateCharacterImagesBatch,
  renderCharacterToCanvas
};