// Importar todas as imagens
import images from './images';

export const characterTabConfig = {
  hats: { icon: '👒', title: 'Hats', category: 'head' },
  tops: { icon: '👕', title: 'Tops', category: 'torso' },
  pants: { icon: '👖', title: 'Pants', category: 'legs' },
  shoes: { icon: '👟', title: 'Shoes', category: 'feet' },
  accessories: { icon: '👓', title: 'Accessories', category: 'accessory' },
  colors: { icon: '🎨', title: 'Colors', category: 'colors' }
};

export const characterToolbarItems = {
  hats: [
    { id: 'hat1', name: 'Baseball Cap', image: images.hat1, type: 'hat' },
    { id: 'hat2', name: 'Top Hat', image: images.hat2, type: 'hat' },
    { id: 'hat3', name: 'Crown', image: images.hat3, type: 'hat' }
  ],
  tops: [
    { id: 'top1', name: 'T-Shirt', image: images.top1, type: 'top' },
    { id: 'top2', name: 'Jacket', image: images.top2, type: 'top' },
    { id: 'top3', name: 'Dress', image: images.top3, type: 'top' }
  ],
  pants: [
    { id: 'pants1', name: 'Jeans', image: images.pants1, type: 'pants' },
    { id: 'pants2', name: 'Shorts', image: images.pants2, type: 'pants' },
    { id: 'pants3', name: 'Skirt', image: images.pants3, type: 'pants' }
  ],
  shoes: [
    { id: 'shoes1', name: 'Sneakers', image: images.shoes1, type: 'shoes' },
    { id: 'shoes2', name: 'Boots', image: images.shoes2, type: 'shoes' },
    { id: 'shoes3', name: 'Sandals', image: images.shoes3, type: 'shoes' }
  ],
  accessories: [
    { id: 'acc1', name: 'Glasses', image: images.acc1, type: 'accessory' },
    { id: 'acc2', name: 'Watch', image: images.acc2, type: 'accessory' },
    { id: 'acc3', name: 'Necklace', image: images.acc3, type: 'accessory' },
    { id: 'acc4', name: 'Bag', image: images.acc4, type: 'bag' }
  ],
  colors: [
    { id: 'color1', name: 'Red', color: '#FF0000', type: 'color' },
    { id: 'color2', name: 'Green', color: '#00FF00', type: 'color' },
    { id: 'color3', name: 'Blue', color: '#0000FF', type: 'color' },
    { id: 'color4', name: 'Yellow', color: '#FFFF00', type: 'color' },
    { id: 'color5', name: 'Magenta', color: '#FF00FF', type: 'color' },
    { id: 'color6', name: 'Cyan', color: '#00FFFF', type: 'color' },
    { id: 'color7', name: 'Orange', color: '#FFA500', type: 'color' },
    { id: 'color8', name: 'Purple', color: '#800080', type: 'color' },
    { id: 'color9', name: 'Pink', color: '#FFC0CB', type: 'color' },
    { id: 'color10', name: 'Brown', color: '#A52A2A', type: 'color' },
    { id: 'color11', name: 'Black', color: '#000000', type: 'color' },
    { id: 'color12', name: 'White', color: '#FFFFFF', type: 'color' }
  ]
};