export const characterToolbarItems = {
  tops: [
    { id: 1, name: 'T-Shirt', type: 'top', colorable: true, category: 'clothing', emoji: '👕', icon: '👕' },
    { id: 2, name: 'Shirt', type: 'top', colorable: true, category: 'clothing', emoji: '👔', icon: '👔' },
    { id: 3, name: 'Dress', type: 'top', colorable: true, category: 'clothing', emoji: '👗', icon: '👗' },
    { id: 4, name: 'Jacket', type: 'top', colorable: true, category: 'clothing', emoji: '🧥', icon: '🧥' },
    { id: 5, name: 'Tank Top', type: 'top', colorable: true, category: 'clothing', emoji: '🎽', icon: '🎽' },
  ],
  bottoms: [
    { id: 6, name: 'Pants', type: 'bottom', colorable: true, category: 'clothing', emoji: '👖', icon: '👖' },
    { id: 7, name: 'Shorts', type: 'bottom', colorable: true, category: 'clothing', emoji: '🩳', icon: '🩳' },
    { id: 8, name: 'Skirt', type: 'bottom', colorable: true, category: 'clothing', emoji: '👘', icon: '👘' },
    { id: 9, name: 'Jeans', type: 'bottom', colorable: true, category: 'clothing', emoji: '👖', icon: '👖' },
  ],
  hair: [
    { id: 10, name: 'Short Hair', type: 'hair', colorable: true, category: 'appearance', emoji: '💇‍♂️', icon: '💇' },
    { id: 11, name: 'Long Hair', type: 'hair', colorable: true, category: 'appearance', emoji: '💇‍♀️', icon: '💇' },
    { id: 12, name: 'Curly Hair', type: 'hair', colorable: true, category: 'appearance', emoji: '🦱', icon: '🦱' },
    { id: 13, name: 'Ponytail', type: 'hair', colorable: true, category: 'appearance', emoji: '💁‍♀️', icon: '💁' },
    { id: 14, name: 'Afro', type: 'hair', colorable: true, category: 'appearance', emoji: '🦳', icon: '🦳' },
  ],
  hats: [
    { id: 15, name: 'Cap', type: 'hat', colorable: true, category: 'accessories', emoji: '🧢', icon: '🧢' },
    { id: 16, name: 'Hat', type: 'hat', colorable: true, category: 'accessories', emoji: '👒', icon: '👒' },
    { id: 17, name: 'Beanie', type: 'hat', colorable: true, category: 'accessories', emoji: '🧣', icon: '🧣' },
    { id: 18, name: 'Crown', type: 'hat', colorable: true, category: 'accessories', emoji: '👑', icon: '👑' },
    { id: 19, name: 'Helmet', type: 'hat', colorable: true, category: 'accessories', emoji: '⛑️', icon: '⛑️' },
  ],
  faces: [
    { id: 20, name: 'Happy', type: 'face', colorable: false, category: 'face', emoji: '😊', icon: '😊' },
    { id: 21, name: 'Sad', type: 'face', colorable: false, category: 'face', emoji: '😢', icon: '😢' },
    { id: 22, name: 'Angry', type: 'face', colorable: false, category: 'face', emoji: '😠', icon: '😠' },
    { id: 23, name: 'Surprised', type: 'face', colorable: false, category: 'face', emoji: '😲', icon: '😲' },
    { id: 24, name: 'Wink', type: 'face', colorable: false, category: 'face', emoji: '😉', icon: '😉' },
  ]
};

// Tab configuration with icons
export const characterTabConfig = {
  tops: { icon: '👕', title: 'Tops' },
  bottoms: { icon: '👖', title: 'Bottoms' },
  hair: { icon: '💇', title: 'Hair' },
  hats: { icon: '🧢', title: 'Hats' },
  faces: { icon: '😊', title: 'Faces' }
};

export const scenarioTabConfig = {
  backgrounds: { icon: '🌅', title: 'Backgrounds' },
  nature: { icon: '🌳', title: 'Nature' },
  furniture: { icon: '🪑', title: 'Furniture' },
  buildings: { icon: '🏠', title: 'Buildings' }
};

export const scenarioToolbarItems = {
  backgrounds: [
    { id: 101, name: 'Blue Sky', type: 'background', resizable: true, category: 'background', emoji: '🌅' },
    { id: 102, name: 'Night Sky', type: 'background', resizable: true, category: 'background', emoji: '🌃' },
    { id: 103, name: 'Mountains', type: 'background', resizable: true, category: 'background', emoji: '⛰️' },
    { id: 104, name: 'Cityscape', type: 'background', resizable: true, category: 'background', emoji: '🏙️' },
    { id: 105, name: 'Beach', type: 'background', resizable: true, category: 'background', emoji: '🏖️' },
  ],
  nature: [
    { id: 201, name: 'Tree', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌳' },
    { id: 202, name: 'Bush', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌿' },
    { id: 203, name: 'Flower', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌷' },
    { id: 204, name: 'Rock', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🪨' },
    { id: 205, name: 'Cactus', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌵' },
  ],
  furniture: [
    { id: 301, name: 'Chair', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🪑' },
    { id: 302, name: 'Table', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🪟' },
    { id: 303, name: 'Sofa', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🛋️' },
    { id: 304, name: 'Bookshelf', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '📚' },
    { id: 305, name: 'Bed', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🛏️' },
  ],
  buildings: [
    { id: 401, name: 'House', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏠' },
    { id: 402, name: 'Castle', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏰' },
    { id: 403, name: 'Shop', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏪' },
    { id: 404, name: 'School', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏫' },
  ]
};

export const colorPalette = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#FFFFFF', '#000000',
  '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

export const sampleCharacters = [
  { id: 1, name: 'Hero', type: 'character', category: 'character', emoji: '🦸‍♂️' },
  { id: 2, name: 'Villain', type: 'character', category: 'character', emoji: '🦹‍♂️' },
  { id: 3, name: 'Friend', type: 'character', category: 'character', emoji: '👫' },
  { id: 4, name: 'Animal', type: 'character', category: 'character', emoji: '🐱' },
];