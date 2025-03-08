// shapeUtils.js
export const randomShapePath = () => {
    // Define a few simple polygon paths
    const shapes = [
      // Each path is a closed polygon in a 100x100 viewBox
      "M10 10 L60 10 L80 40 L50 70 L10 60 Z",
      "M15 15 L75 15 L95 60 L60 95 L15 80 Z",
      "M5 5 L50 10 L80 50 L60 80 L10 70 Z",
    ];
  
    // Pick one randomly
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  };
  