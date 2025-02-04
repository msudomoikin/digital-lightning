let audio = new Audio("sound.wav");

class LineGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.lines = [];
    this.lineSpacingMax = 20;
    this.lineSpacingMin = 50;
    this.lineSpacing =
      Math.floor(
        Math.random() * (this.lineSpacingMax - this.lineSpacingMin + 1)
      ) + this.lineSpacingMin;
    this.angles = [
      { dx: 0, dy: 1 }, // Straight down
      { dx: 1, dy: 1 }, // Down-right
      { dx: -1, dy: 1 }, // Down-left
    ];
    this._lineWidth = 1;
    this._strokeWidth = 1;
    this._lineSpacingOptions = [100, 250, 500, 750, 1000];
    this._lineColor = "#00e2f4";
  }

  generateInitialLine() {
    this.lines = [
      {
        start: { x: this.width / 2, y: 0 },
        end: { x: this.width / 2, y: this.lineSpacing },
        children: [],
      },
    ];
  }

  shouldDivide() {
    return Math.random() < 0.7;
  }

  divideLine(line) {
    const divisionCount = Math.floor(Math.random() * 2) + 1 || 0; // 1-3 lines

    line.children = Array.from({ length: divisionCount }, () => {
      const angle = this.angles[Math.floor(Math.random() * this.angles.length)];
      return {
        start: { ...line.end },
        end: {
          x: line.end.x + angle.dx * this.lineSpacing,
          y: line.end.y + angle.dy * this.lineSpacing,
        },
        children: [],
      };
    });

    return line.children;
  }

  processLines() {
    const processLineRecursively = (line) => {
      // Stop if line goes out of canvas
      if (line.end.y > this.height) {
        return;
      }

      // Potentially divide line
      if (this.shouldDivide()) {
        line.children = this.divideLine(line);
        line.children.forEach(processLineRecursively);
      }
    };

    // Start processing from root lines
    this.lines.forEach(processLineRecursively);
  }

  drawLines() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = this._lineColor;

    this.ctx.lineWidth = this._lineWidth;

    const drawLineRecursively = (line) => {
      this.ctx.beginPath();
      this.ctx.moveTo(line.start.x, line.start.y);
      this.ctx.lineTo(line.end.x, line.end.y);
      this.ctx.stroke();

      // Recursively draw child lines
      line.children.forEach(drawLineRecursively);
    };

    this.lines.forEach(drawLineRecursively);
  }

  regenerate() {
    this.generateInitialLine();
    this.processLines();
    this.drawLines();
    audio.play();
  }
}

// Setup
const canvas = document.getElementById("generativeCanvas");
const lineGenerator = new LineGenerator(canvas);

// Regenerate on click
canvas.addEventListener("click", () => {
  lineGenerator.regenerate();
});

// Regenerate on mouse move
document.addEventListener("mousemove", () => lineGenerator.regenerate());

// Regenerate automatically
setInterval(() => {
  lineGenerator.regenerate();
}, 2000);

// Maybe add some effects
// lineGenerator.ctx.filter = 'drop-shadow(0px 0px 2px lime)';
