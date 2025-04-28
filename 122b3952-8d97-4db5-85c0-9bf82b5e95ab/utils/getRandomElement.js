// utils/getRandomElement.js
module.exports = function getRandomElement(array) {
    const totalWeight = array.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of array) {
      if (random < item.weight) {
        return item;
      }
      random -= item.weight;
    }
  };