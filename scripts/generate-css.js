const fs = require('fs');

function generatePolygon(outerRadius, innerRadius) {
  let points = [];
  for (let i = 0; i < 20; i++) {
    // 10 outer points, 10 inner points
    let r = i % 2 === 0 ? outerRadius : innerRadius;
    let angle = (i * 18 - 90) * (Math.PI / 180);
    let x = 50 + r * Math.cos(angle);
    let y = 50 + r * Math.sin(angle);
    points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(\n  ${points.join(', ')}\n)`;
}

// For a decagon, the inner points lie on the midpoint of the outer edges.
// cos(18 degrees) = 0.9510565
const decagonInnerRadius = 50 * Math.cos(18 * Math.PI / 180);

const css = `
.star-shape-morph {
  transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  clip-path: ${generatePolygon(50, decagonInnerRadius)};
}

.star-shape-morph:hover {
  clip-path: ${generatePolygon(50, 20)};
}
`;

fs.writeFileSync('d:\\CHAUPAL-A-Seal-Of-Belonging\\scratch.css', css);
console.log("CSS Generated!");
