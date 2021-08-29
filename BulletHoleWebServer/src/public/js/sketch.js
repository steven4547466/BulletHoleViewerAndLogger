let cam;
let holes;
let data;
let offsetX;
let offsetY;
let bx;
let by;
let curServer;
let curRound;
let colors;
let extraShapes;

function setup() {
  createCanvas(800, 800, WEBGL);
  cam = createCamera();
  bx = 0;
  by = 0;
  offsetX = width / 2;
  offsetY = width / 2;
  holes = [];
  extraShapes = []
  fetch(window.location.protocol + "//" + window.location.host + "/bullets")
    .then(response => response.json())
    .then(d => {
      data = d
      curServer = '1';
      curRound = null;
      if (data[curServer]) curRound = data[curServer][Object.keys(data[curServer])[0]];
    })
  colors = {
    "Earth green": [39, 70, 45],
    "Slime green": [80, 109, 84],
    "Bright bluish green": [0, 143, 156],
    "Black": [27, 42, 53],
    "Deep blue": [33, 84, 185],
    "Dark blue": [0, 16, 176],
    "Navy blue": [0, 32, 96],
    "Parsley green": [44, 101, 29],
    "Dark green": [40, 127, 71],
    "Teal": [18, 238, 212],
    "Smoky grey": [91, 93, 105],
    "Steel blue": [82, 124, 174],
    "Storm blue": [51, 88, 130],
    "Lapis": [16, 42, 220],
    "Dark indigo": [61, 21, 133],
    "Camo": [58, 125, 21],
    "Sea green": [52, 142, 64],
    "Shamrock": [91, 154, 76],
    "Toothpaste": [0, 255, 255],
    "Sand blue": [116, 134, 157],
    "Medium blue": [110, 153, 202],
    "Bright blue": [13, 105, 172],
    "Really blue": [0, 0, 255],
    "Mulberry": [89, 34, 89],
    "Forest green": [31, 128, 29],
    "Bright green": [75, 151, 75],
    "Grime": [127, 142, 100],
    "Lime green": [0, 255, 0],
    "Pastel blue-green": [159, 243, 233],
    "Fossil": [159, 161, 172],
    "Electric blue": [9, 137, 207],
    "Lavender": [140, 91, 159],
    "Royal purple": [98, 37, 209],
    "Eggplant": [123, 0, 123],
    "Sand green": [120, 144, 130],
    "Moss": [124, 156, 107],
    "Artichoke": [138, 171, 133],
    "Sage green": [185, 196, 177],
    "Pastel light blue": [175, 221, 255],
    "Cadet blue": [159, 173, 192],
    "Cyan": [4, 175, 236],
    "Alder": [180, 128, 255],
    "Lilac": [167, 94, 155],
    "Plum": [123, 47, 123],
    "Bright violet": [107, 50, 124],
    "Olive": [193, 190, 66],
    "Brownish yellowish green": [164, 189, 71],
    "Olivine": [148, 190, 129],
    "Laurel green": [168, 189, 153],
    "Quill grey": [223, 223, 222],
    "Ghost grey": [202, 203, 209],
    "Pastel Blue": [128, 187, 219],
    "Pastel violet": [177, 167, 255],
    "Pink": [255, 102, 204],
    "Hot pink": [255, 0, 191],
    "Magenta": [170, 0, 170],
    "Crimson": [151, 0, 0],
    "Deep orange": [255, 176, 0],
    "New Yeller": [255, 255, 0],
    "Medium green": [161, 196, 140],
    "Mint": [177, 229, 166],
    "Pastel green": [204, 255, 204],
    "Light stone grey": [229, 228, 223],
    "Light blue": [180, 210, 228],
    "Baby blue": [152, 194, 219],
    "Carnation pink": [255, 152, 220],
    "Persimmon": [255, 89, 89],
    "Really red": [255, 0, 0],
    "Bright red": [196, 40, 28],
    "Maroon": [117, 0, 0],
    "Gold": [239, 184, 56],
    "Bright yellow": [245, 205, 48],
    "Daisy orange": [248, 217, 109],
    "Cool yellow": [253, 234, 141],
    "Pastel yellow": [255, 255, 204],
    "Pearl": [231, 231, 236],
    "Fog": [199, 212, 228],
    "Mauve": [224, 178, 208],
    "Sunrise": [212, 144, 189],
    "Terra Cotta": [190, 104, 98],
    "Dusty Rose": [163, 75, 75],
    "Cocoa": [86, 36, 36],
    "Neon orange": [213, 115, 61],
    "Bright orange": [218, 133, 65],
    "Wheat": [241, 231, 199],
    "Buttermilk": [254, 243, 187],
    "Institutional white": [248, 248, 248],
    "White": [242, 243, 243],
    "Light reddish violet": [232, 186, 200],
    "Pastel orange": [255, 201, 201],
    "Salmon": [255, 148, 148],
    "Tawny": [150, 85, 85],
    "Rust": [143, 76, 42],
    "CGA brown": [170, 85, 0],
    "Brownish yellowish orange": [226, 155, 64],
    "Cashmere": [211, 190, 150],
    "Khaki": [226, 220, 188],
    "Lily white": [237, 234, 234],
    "Seashell": [233, 218, 218],
    "Pastel brown": [255, 204, 153],
    "Light orange": [234, 184, 146],
    "Medium red": [218, 134, 122],
    "Burgundy": [136, 62, 62],
    "Reddish brown": [105, 64, 40],
    "Cork": [188, 155, 93],
    "Burlap": [199, 172, 120],
    "Beige": [202, 191, 163],
    "Oyster": [187, 179, 178],
    "Mid gray": [205, 205, 205],
    "Brick yellow": [215, 197, 154],
    "Nougat": [204, 142, 105],
    "Brown": [124, 92, 70],
    "Pine Cone": [108, 88, 75],
    "Fawn brown": [160, 132, 79],
    "Sand red": [149, 121, 119],
    "Hurricane grey": [149, 137, 136],
    "Cloudy grey": [171, 168, 158],
    "Linen": [175, 148, 131],
    "Copper": [150, 103, 102],
    "Dark orange": [160, 95, 53],
    "Dirt brown": [86, 66, 54],
    "Bronze": [126, 104, 63],
    "Dark stone grey": [99, 95, 98],
    "Medium stone grey": [163, 162, 165],
    "Flint": [105, 102, 92],
    "Dark taupe": [90, 76, 66],
    "Burnt Sienna": [106, 57, 9],
    "Really black": [17, 17, 17],
  }
}

window.updateP5 = (server, round) => {
  holes = []
  extraShapes = []
  curServer = server;
  curRound = round;
  data[curServer][curRound].availableColors = Object.keys(colors)
  data[curServer][curRound].enabledUsers = Object.keys(data[curServer][curRound])
  let userArea = document.getElementById("users")
  while (userArea.firstChild) {
    userArea.removeChild(userArea.firstChild);
  }
  let dropdowns = []
  for (let [userId, d] of Object.entries(data[curServer][curRound])) {
    if (!d.bullets) continue;
    let colorIndex = ~~(Math.random() * data[curServer][curRound].availableColors.length)
    let color = colors[data[curServer][curRound].availableColors[colorIndex]]
    data[curServer][curRound].availableColors.splice(colorIndex, 1)
    data[curServer][curRound][userId].color = color
    let brightness = Math.round(((parseInt(color[0]) * 299) +
      (parseInt(color[1]) * 587) +
      (parseInt(color[2]) * 114)) / 1000);
    let textColor = (brightness > 125) ? 'black' : 'white';
    let dropdownDiv = document.createElement("div")
    dropdownDiv.classList.add("dropdown")
    dropdownDiv.id = `dropdown-${userId}`
    dropdownDiv.style.width = "100%";

    dropdowns.push(dropdownDiv)

    let dropDownTrigger = document.createElement("div")
    dropDownTrigger.classList.add("dropdown-trigger")
    dropDownTrigger.style.width = "100%";
    dropdownDiv.appendChild(dropDownTrigger)

    let button = document.createElement("button")
    button.classList.add("enabled")
    button.id = `${userId}-dropdown-button`
    button.style = `color: ${textColor}; background-color: rgb(${color.join(", ")}); width:50%; text-align: center; margin-top:0.5em;`
    button.innerText = d.name
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      if (dropdownDiv.classList.contains("is-active")) {
        dropdownDiv.classList.toggle("is-active")
      } else {
        for (let dropdown of dropdowns) {
          dropdown.classList.remove("is-active")
        }
        dropdownDiv.classList.add("is-active")
      }
      // let dropdownContent = document.querySelector(`#dropdown-${userId} .dropdown-content`)
      // if (window.setUserEnabled(userId, false, true)) {
      //   button.classList.add("enabled")
      // } else {
      //   button.classList.remove("enabled")
      // }
    })

    let dropDownMenuDiv = document.createElement("div")
    dropDownMenuDiv.classList.add("dropdown-menu")
    dropDownMenuDiv.id = `${userId}-dropdown-menu`
    dropDownMenuDiv.role = "menu"
    dropDownMenuDiv.style.width = "100%"
    dropdownDiv.appendChild(dropDownMenuDiv)

    let dropDownContentDiv = document.createElement("div")
    dropDownContentDiv.classList.add("dropdown-content")
    dropDownContentDiv.id = `${userId}-dropdown-content`
    dropDownContentDiv.style.width = "50%"
    dropDownMenuDiv.appendChild(dropDownContentDiv)

    let toggle = document.createElement("button")
    toggle.classList.add("dropdown-item", "is-dark", "button")
    toggle.innerText = "Toggle"
    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      if (window.setUserEnabled(userId, false, true)) {
        button.classList.add("enabled")
      } else {
        button.classList.remove("enabled")
      }
    })
    dropDownContentDiv.appendChild(toggle)

    let teleportToBullet = document.createElement("button")
    teleportToBullet.classList.add("dropdown-item", "is-dark", "button")
    teleportToBullet.innerText = "Teleport"
    teleportToBullet.addEventListener("click", function (event) {
      event.stopPropagation();
      if (button.classList.contains("enabled")) {
        let bullets = holes.filter((bullet) => bullet.userId == userId)
        let bulletNum = parseInt(prompt(`Enter bullet number to teleport to (1-${bullets.length})`, "1")) - 1
        try {
          if (isNaN(bulletNum)) return;
          let pos = bullets[bulletNum].point
          cam.setPosition(pos.x - 100, pos.y, pos.z);
          cam.lookAt(pos.x, pos.y, pos.z);
        } catch (e) {
          alert("Bullet number is out of bounds. Max: " + bullets.length)
        }
      }
    })
    dropDownContentDiv.appendChild(teleportToBullet)

    let teleportToBulletGroup = document.createElement("button")
    teleportToBulletGroup.classList.add("dropdown-item", "is-dark", "button")
    teleportToBulletGroup.innerText = "Teleport to group"
    teleportToBulletGroup.addEventListener("click", function (event) {
      event.stopPropagation();
      if (data[curServer][curRound][userId].bulletGroups.length == 0) {
        alert("No bullet groups fround.")
        return;
      }
      if (button.classList.contains("enabled")) {
        let groupNum = parseInt(prompt(`Enter bullet group number to teleport to (1-${data[curServer][curRound][userId].bulletGroups.length})`, "1")) - 1
        try {
          if (isNaN(groupNum)) return;
          let pos = data[curServer][curRound][userId].bulletGroups[groupNum][0].point
          cam.setPosition(pos.x - 100, pos.y, pos.z);
          cam.lookAt(pos.x, pos.y, pos.z);
        } catch (e) {
          alert("Bullet group number is out of bounds. Max: " + data[curServer][curRound][userId].bulletGroups.length)
        }
      }
    })
    dropDownContentDiv.appendChild(teleportToBulletGroup)

    // let connectGroup = document.createElement("button")
    // connectGroup.classList.add("dropdown-item", "is-dark", "button")
    // connectGroup.innerText = "Connect group"
    // connectGroup.addEventListener("click", function (event) {
    //   event.stopPropagation();
    //   if (button.classList.contains("enabled")) {
    //     let groupNum = parseInt(prompt(`Enter bullet group number to connect (1-${data[curServer][curRound][userId].bulletGroups.length})`, "1")) - 1
    //     try {
    //       let prevBullet;
    //       for (let bullet of data[curServer][curRound][userId].bulletGroups[groupNum]) {
    //         if (prevBullet == null) {
    //           prevBullet = bullet;
    //           continue;
    //         }
    //         if (getDist(bullet.point, prevBullet.point) < 1000) {
    //           connectPoints(bullet.point, prevBullet.point)
    //         }
    //         prevBullet = bullet
    //       }
    //     } catch (e) {
    //       console.error(e)
    //       alert("Bullet group number is out of bounds. Max: " + data[curServer][curRound][userId].bulletGroups.length)
    //     }
    //   }
    // })
    // dropDownContentDiv.appendChild(connectGroup)

    let regroup = document.createElement("button")
    regroup.classList.add("dropdown-item", "is-dark", "button")
    regroup.innerText = "Regroup"
    regroup.addEventListener("click", function (event) {
      event.stopPropagation();
      if (button.classList.contains("enabled")) {
        let groupRadius = parseInt(prompt(`Enter a distance (default 4)`, "4")) * 250
        if (isNaN(groupRadius)) return;
        data[curServer][curRound][userId].bulletGroups = defineGroups(userId, groupRadius)
      }
    })
    dropDownContentDiv.appendChild(regroup)

    dropDownTrigger.appendChild(button)
    userArea.appendChild(dropdownDiv)
    for (let bullet of d.bullets) {
      holes.push(new BulletHole(userId, new Point3D(parseFloat(bullet.x * 250), parseFloat(bullet.y * -250), parseFloat(bullet.z * 250)), color))
    }
    data[curServer][curRound][userId].bulletGroups = defineGroups(userId)
  }

  let toggleAll = document.createElement("button")
  toggleAll.innerText = "Toggle all"
  toggleAll.style = `width:50%; text-align: center; margin-top:3em;`
  toggleAll.classList.add("button", "is-dark")

  toggleAll.addEventListener("click", () => {
    for (let [userId, d] of Object.entries(data[curServer][curRound])) {
      let button = document.getElementById(`${userId}-dropdown-button`)
      if (window.setUserEnabled(userId, false, true)) {
        button.classList.add("enabled")
      } else {
        button.classList.remove("enabled")
      }
    }
  })

  userArea.appendChild(toggleAll)

  userArea.appendChild(document.createElement("br"))

  let regroupAll = document.createElement("button")
  regroupAll.innerText = "Regroup all"
  regroupAll.style = `width:50%; text-align: center; margin-top:0.5em;`
  regroupAll.classList.add("button", "is-dark")

  regroupAll.addEventListener("click", () => {
    let groupRadius = parseInt(prompt(`Enter a distance (default 4)`, "4")) * 250
    if (isNaN(groupRadius)) return;
    for (let [userId, d] of Object.entries(data[curServer][curRound])) {
      data[curServer][curRound][userId].bulletGroups = defineGroups(userId, groupRadius)
    }
  })

  userArea.appendChild(regroupAll)
};

window.setUserEnabled = (userId, enabled, toggle) => {
  if (data[curServer] && data[curServer][curRound]) {
    let index = data[curServer][curRound].enabledUsers.indexOf(userId)
    if (toggle) {
      if (index == -1) {
        data[curServer][curRound].enabledUsers.push(userId)
        return true;
      } else {
        data[curServer][curRound].enabledUsers.splice(index, 1)
        return false;
      }
    } else {
      if (enabled && index == -1) {
        data[curServer][curRound].enabledUsers.push(userId)
        return true;
      } else if (!enabled && index != -1) {
        data[curServer][curRound].enabledUsers.splice(index, 1)
        return false;
      }
    }
  }
}

function connectPoints(point1, point2) {
  let point = new Point3D((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2)
  extraShapes.push(new Box(point, [3, getDist(point1, point2), 3], [0, 0, 0], 0, 0, Math.atan2(point.y, point.x)))
}

function getDist(point1, point2) {
  return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2) + Math.pow((point1.z - point2.z), 2))
}

function getBulletsAround(userId, checkBullet, maxDist, toReturn) {
  if (toReturn.length == 0) toReturn.push(checkBullet)
  for (let bullet of holes.filter(b => b.userId == userId)) {
    if (bullet == checkBullet || toReturn.includes(bullet)) continue;
    if (getDist(bullet.point, checkBullet.point) < maxDist) {
      toReturn.push(bullet)
      toReturn = getBulletsAround(userId, bullet, maxDist, toReturn)
    }
  }
  return toReturn
}

function defineGroups(userId, maxDist) {
  let groups = []
  for (let bullet of holes.filter(b => b.userId == userId)) {
    if (groups.some(g => g.includes(bullet))) continue;
    groups.push(getBulletsAround(userId, bullet, maxDist || 1000, []))
  }
  return groups.filter(t => t.length > 5)
}

// function keyPressed() {
//   if (keyCode == 70) {
//     let pos = holes[0].point;
//     cam.setPosition(pos.x - 100, pos.y, pos.z);
//     cam.lookAt(pos.x, pos.y, pos.z);
//   }
// }

function draw() {
  background("#4f4f4f");
  ambientLight(60, 60, 60);
  if (keyIsDown(87)) {
    cam.move(0, 0, -5);
  }
  if (keyIsDown(83)) {
    cam.move(0, 0, 5);
  }
  if (keyIsDown(68)) {
    cam.move(5, 0, 0);
  }
  if (keyIsDown(65)) {
    cam.move(-5, 0, 0);
  }
  if (keyIsDown(81)) {
    cam.move(0, -5, 0);
  }
  if (keyIsDown(69)) {
    cam.move(0, 5, 0);
  }
  if (keyIsDown(40)) {
    cam.tilt(0.02);
  }
  if (keyIsDown(39)) {
    cam.pan(-0.02);
  }
  if (keyIsDown(38)) {
    cam.tilt(-0.02);
  }
  if (keyIsDown(37)) {
    cam.pan(0.02);
  }
  for (let bulletHole of holes) {
    if (data[curServer] && data[curServer][curRound] && data[curServer][curRound].enabledUsers.includes(bulletHole.userId))
      bulletHole.draw();
  }
  for (let shape of extraShapes) {
    shape.draw()
  }
}

function mousePressed() {
  offsetX = mouseX - bx;
  offsetY = mouseY - by;
}

function mouseWheel(e) {
  if (e.delta > 0) {
    cam.move(0, 0, 100);
  } else {
    cam.move(0, 0, -100);
  }
}

function mouseDragged(e) {
  let px = bx;
  let py = by;
  bx = mouseX - offsetX;
  by = mouseY - offsetY;
  let up = by > py;
  let down = by < py;
  let left = px < bx;
  let right = px > bx;
  cam.tilt(up ? 0.01 * Math.abs(py - by) * 0.3 : down ? -0.01 * Math.abs(py - by) * 0.3 : 0);
  cam.pan(right ? 0.01 * Math.abs(px - bx) * 0.3 : left ? -0.01 * Math.abs(px - bx) * 0.3 : 0);
}

class BulletHole {
  constructor(userId, point, color) {
    this.userId = userId;
    this.point = point;
    this.color = color || [100, 100, 100];
    this.size = 5;
  }

  draw() {
    push();
    translate(this.point.x, this.point.y, this.point.z);
    rotateY(300);
    rotateX(180);
    fill(this.color[0], this.color[1], this.color[2]);
    sphere(this.size, 200, 200);
    pop();
  }
}

class Box {
  constructor(point, size, color, xRotation, yRotation, zRotation) {
    this.point = point;
    this.color = color || [100, 100, 100];
    this.size = size || [1, 3, 1];
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
  }

  draw() {
    push();
    angleMode(RADIANS);
    translate(this.point.x, this.point.y, this.point.z);
    rotateZ(this.zRotation);
    // rotateY(this.yRotation);
    // rotateX(this.xRotation)
    fill(this.color[0], this.color[1], this.color[2]);
    box(this.size[0], this.size[1], this.size[2]);
    pop();
  }
}

class Point3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distanceToCamera() {
    return Math.sqrt(Math.pow(this.x - cam.eyeX, 2) + Math.pow(this.z - cam.eyeY, 2) + Math.pow(this.z - cam.eyeZ, 2))
  }

  rotationToCamera() {
    return [atan((cam.eyeY - this.y) / (Math.abs(cam.eyeX) - Math.abs(this.x))), atan((cam.eyeY - this.y) / (Math.abs(cam.eyeZ) - Math.abs(this.z)))]
  }
}