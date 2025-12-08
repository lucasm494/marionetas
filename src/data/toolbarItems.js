// data/toolbarItems.js - VERSÃO SIMPLIFICADA

export const characterTabConfig = {
  hats: { icon: '/images/items/hat2.png', title: 'Hats', category: 'head' },
  tops: { icon: '/images/items/top1.png', title: 'Tops', category: 'torso' },
  pants: { icon: '/images/items/pants2.png', title: 'Pants', category: 'legs' },
  shoes: { icon: '/images/items/shoes1.png', title: 'Shoes', category: 'feet' },
  accessories: { icon: '/images/items/pistol.png', title: 'Accessories', category: 'accessory' },
  colors: { icon: '🎨', title: 'Colors', category: 'colors' }
};

export const characterToolbarItems = {
  hats: [
    { 
      id: 'hat1', 
      name: 'Normal', 
      image: '/images/items/cara_pessoa.png',  // Caminho DIRETO
      type: 'hat',
      width: 60,
      height: 40
    },
    { 
      id: 'Porco', 
      name: 'Top Hat', 
      image: '/images/items/cara_porco.png',
      type: 'hat',
      width: 50,
      height: 60
    },
    { 
      id: 'Lobo', 
      name: 'Crown', 
      image: '/images/items/cara_lobo.png',
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
      position:{
        x:51,
        y:38
      },
      width: 234,
      height: 143
    },
    { 
      id: 'top2', 
      name: 'T-Shirt', 
      image: '/images/items/top2.png',
      type: 'top',
      width: 132,
      height: 144
    },
    { 
      id: 'top3', 
      name: 'T-Shirt', 
      image: '/images/items/top3.png',
      type: 'top',
      width: 80,
      height: 100
    }
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
    { 
      id: 'pants2', 
      name: 'Jeans', 
      image: '/images/items/pants2.png',
      type: 'pants',
      width: 70,
      height: 90
    },
    { 
      id: 'pants3', 
      name: 'Jeans', 
      image: '/images/items/pants3.png',
      type: 'pants',
      width: 70,
      height: 90
    }
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
    { 
      id: 'shoes2', 
      name: 'Sneakers', 
      image: '/images/items/shoes2.png',
      type: 'shoes',
      width: 40,
      height: 30
    },
    { 
      id: 'shoes3', 
      name: 'Sneakers', 
      image: '/images/items/shoes3.png',
      type: 'shoes',
      width: 40,
      height: 30
    }
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
    {
      id: 'acc2',
      name: 'Pistol',
      image: '/images/items/pistol.png',
      type: 'accessory',
      width: 100,
      height: 20,
    }
    // ... outros items
  ],
  colors: [
    { id: 'color1', name: 'Red', color: '#FF0000', type: 'color' },
    { id: 'color2', name: 'Blue', color: '#0026ffff', type:'color'},
    { id: 'color3', name: 'Pink', color: '#ee00ffff', type:'color'},
    { id: 'color4', name: 'Green', color: '#0dff00ff', type:'color'},
    { id: 'color5', name: 'Yellow', color: '#ffc800ff', type:'color'}
    // ... outras cores
  ]
};