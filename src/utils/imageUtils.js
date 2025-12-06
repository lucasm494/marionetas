// utils/imageUtils.js

/**
 * Converte uma imagem importada pelo Webpack para Data URL
 */
export const importToDataURL = (imageImport) => {
  // Se já for uma string (Data URL ou URL normal)
  if (typeof imageImport === 'string') {
    return imageImport;
  }
  
  // Se for um objeto com propriedade default (Webpack import)
  if (imageImport && imageImport.default) {
    return convertImageUrlToDataURL(imageImport.default);
  }
  
  // Se for um objeto com src
  if (imageImport && imageImport.src) {
    return convertImageUrlToDataURL(imageImport.src);
  }
  
  return null;
};

/**
 * Converte uma URL de imagem para Data URL
 */
export const convertImageUrlToDataURL = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    
    img.onerror = () => {
      console.error('Erro ao carregar imagem para converter:', url);
      resolve(null);
    };
    
    img.src = url;
  });
};

/**
 * Pré-converte todas as imagens do toolbarItems para Data URLs
 */
export const preprocessToolbarItems = async (toolbarItems) => {
  const processed = { ...toolbarItems };
  
  // Converter todas as imagens em cada categoria
  for (const category in processed) {
    if (category !== 'colors') { // Cores não têm imagens
      const items = processed[category];
      for (const item of items) {
        if (item.image) {
          try {
            // Se a imagem já for uma Data URL, mantém
            if (item.image.startsWith('data:image')) {
              continue;
            }
            
            // Converter para Data URL
            item.imageData = await convertImageUrlToDataURL(item.image);
          } catch (error) {
            console.error(`Erro ao processar imagem de ${item.name}:`, error);
          }
        }
      }
    }
  }
  
  return processed;
};