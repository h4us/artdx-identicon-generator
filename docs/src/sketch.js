let triangles = [];
const colors = ['#00e', '#000', 'transparent'];

function setup() {
  createCanvas(360, 360, SVG);
  noLoop();
  noStroke();

  const cols = 2;
  const rows = 2;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // 三角形の情報を初期化
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cellWidth;
      const y = j * cellHeight;
      triangles.push(...createTriangles(x, y, cellWidth, cellHeight));
    }
  }
  redraw(); // 初期描画
}

function draw() {
  clear(); // キャンバスをクリアして透明背景を維持
  triangles.forEach(({ x1, y1, x2, y2, x3, y3, color }) => {
    color === 'transparent' ? noFill() : fill(color);
    triangle(x1, y1, x2, y2, x3, y3);
  });
}

// 三角形を作成
function createTriangles(x, y, w, h) {
  const halfW = w / 2;
  const halfH = h / 2;
  return [
    { x1: x, y1: y, x2: x + halfW, y2: y + halfH, x3: x, y3: y + h, color: random(colors) }, // 左上
    { x1: x + w, y1: y, x2: x + halfW, y2: y + halfH, x3: x, y3: y, color: random(colors) }, // 右上
    { x1: x, y1: y + h, x2: x + halfW, y2: y + halfH, x3: x + w, y3: y + h, color: random(colors) }, // 左下
    { x1: x + w, y1: y + h, x2: x + halfW, y2: y + halfH, x3: x + w, y3: y, color: random(colors) } // 右下
  ];
}

// マウスクリック時に三角形の色を切り替える
function mousePressed() {
  triangles.some(t => {
    if (isInsideTriangle(mouseX, mouseY, t)) {
      t.color = colors[(colors.indexOf(t.color) + 1) % colors.length];
      redraw(); // 再描画
      return true; // クリック対象が見つかったらループを終了
    }
    return false;
  });
}

// 点が三角形内にあるかを判定
function isInsideTriangle(px, py, { x1, y1, x2, y2, x3, y3 }) {
  const area = calculateArea(x1, y1, x2, y2, x3, y3);
  const area1 = calculateArea(px, py, x2, y2, x3, y3);
  const area2 = calculateArea(x1, y1, px, py, x3, y3);
  const area3 = calculateArea(x1, y1, x2, y2, px, py);

  // 点が三角形内にある場合、3つの部分面積の合計が元の面積と等しい
  return abs(area - (area1 + area2 + area3)) < 0.1;
}

// 三角形の面積を計算
function calculateArea(x1, y1, x2, y2, x3, y3) {
  return abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
}

// キーを押したときに SVG を保存
function keyPressed() {
  if (key === 's' || key === 'S') {
    const timestamp = getTimestamp(); // タイムスタンプを取得
    save(`icon-${timestamp}.svg`); // タイムスタンプ付きのファイル名で保存
  }
}

// タイムスタンプを生成
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}