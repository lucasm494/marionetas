// data/toolbarItems.js - VERSÃO SIMPLIFICADA

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
    { 
      id: 'hat1', 
      name: 'Baseball Cap', 
      image: '/images/items/hat1.png',  // Caminho DIRETO
      type: 'hat',
      width: 60,
      height: 40
    },
    { 
      id: 'hat2', 
      name: 'Top Hat', 
      image: '/images/items/hat2.png',
      type: 'hat',
      width: 50,
      height: 60
    },
    { 
      id: 'hat3', 
      name: 'Crown', 
      image: '/images/items/hat3.png',
      type: 'hat',
      width: 55,
      height: 45
    }
  ],
  tops: [
    { 
      id: 'top1', 
      name: 'T-Shirt', 
      image: '/images/items/top1.png',
      type: 'top',
      width: 80,
      height: 100
    },
    // ... outros items
  ],
  pants: [
    { 
      id: 'pants1', 
      name: 'Jeans', 
      image: '/images/items/pants1.png',
      type: 'pants',
      width: 70,
      height: 90
    },
    // ... outros items
  ],
  shoes: [
    { 
      id: 'shoes1', 
      name: 'Sneakers', 
      image: '/images/items/shoes1.png',
      type: 'shoes',
      width: 40,
      height: 30
    },
    // ... outros items
  ],
  accessories: [
    { 
      id: 'acc1', 
      name: 'Glasses', 
      image: '/images/items/acc1.png',
      type: 'accessory',
      width: 50,
      height: 20
    },
    // ... outros items
  ],
  colors: [
    { id: 'color1', name: 'Red', color: '#FF0000', type: 'color' },
    // ... outras cores
  ]
};