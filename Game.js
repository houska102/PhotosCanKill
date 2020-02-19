class Camera{//handles drawing things on canvas following player
  constructor(canvasH,canvasW){
    this.canvasH = canvasH
    this.canvasW = canvasW
    this.fx = 0
    this.fy = 0
  }

  follow(Entity){
    this.fx = Entity.x
    this.fy = Entity.y
  }
}

class World{
  constructor(height, width, ctx){
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.terrain = [];
  }

  draw(dx,dy){
    this.ctx.beginPath();
    this.ctx.fillStyle = "grey";
    this.ctx.strokeStyle = "black"
    this.ctx.lineWidth = 5;
    this.ctx.fillRect(dx, dy, this.width, this.height);
    this.ctx.strokeRect(dx, dy, this.width, this.height);
  }
}




class Game{
  constructor(width, height, ctx){
    this.cheight = height
    this.cwidth = width
    this.height = 1200
    this.width = 1200
    this.ctx = ctx;
    this.camera = new Camera(this.cheight, this.cwidth)
    this.world = new World(this.height, this.width, this.ctx)
    this.player = new Player(this.width, this.height, this.ctx)
    this.damageNumbers = []
    this.items = []
    this.enemies = [];
    this.step = 0;
    this.diff = 0;    
    this.gameOverFlag = false
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("inventory").style.display = "none";
    while (this.spawnEnemies()) {}
    this.i = setInterval(() => {
      this.gameStep()
    },20)
  }

  clear () {
    this.ctx.clearRect(0, 0, this.cwidth, this.cheight)
  }
  drawFrame () {
    this.clear();
    this.camera.follow(this.player)
    let centerX = this.cwidth / 2
    let centerY = this.cheight / 2
    let wxOffset = 0 - this.camera.fx
    let wyOffset = 0 - this.camera.fy
    this.world.draw(centerX + wxOffset, centerY + wyOffset)
    for(let i = 0 ; i < this.items.length; i++){
      let xOffset = this.items[i].x - this.camera.fx
      let yOffset = this.items[i].y - this.camera.fy
      this.items[i].draw(centerX + xOffset, centerY + yOffset)
    }
    for(let i = 0 ; i < this.enemies.length; i++){
      let xOffset = this.enemies[i].x - this.camera.fx
      let yOffset = this.enemies[i].y - this.camera.fy
      this.enemies[i].draw(centerX + xOffset, centerY + yOffset)
    }
    this.player.draw(centerX, centerY);
    for (let i = 0; i < this.damageNumbers.length; i++) {
      let xOffset = this.damageNumbers[i].x - this.camera.fx
      let yOffset = this.damageNumbers[i].y - this.camera.fy
      this.ctx.fillStyle = "yellow"
      this.ctx.font = "10px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("-" + this.damageNumbers[i].value, centerX + xOffset, centerY + yOffset)
    }
    this.ctx.fillStyle = "red"
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Enemies left: " + this.enemies.length,50,50)
  }

  spawnEnemies () {
    let centerX = this.cwidth / 2;
    let centerY = this.cheight / 2;
    if (this.enemies.length < 200) {
      let spawnX = 0;
      let spawnY = 0;
      do {
        spawnX = getRandomInt(30, this.width-30);
        spawnY = getRandomInt(30, this.height-30);
      } while(this.player.distanceToCoords(spawnX, spawnY) < 330);
      this.enemies.push(new Enemy(spawnX,spawnY,"green",25+this.diff,this.ctx,2.4+this.diff/10,4+this.diff,10+this.diff))
      let n = getRandomInt(1,6)

      for (let i = 0;i<n;i++) {
        let sx = 0;
        let sy = 0;
        if (getRandomInt(0,1)%2 == 0) {
          sx = 1
        } else {
          sx = -1
        } if (getRandomInt(0,1) % 2 == 0){
          sy = 1
        } else {
          sy = -1
        }
        this.enemies.push(new Enemy(
          spawnX + getRandomInt(20,60) * sx,
          spawnY + getRandomInt(20,60) * sy,
          "black", 10 + this.diff,
          this.ctx,
          3 + this.diff/10,
          2 + this.diff,
          5 + this.diff
        ))
      }
      return true;
    } else {
      let spawnX = 0;
      let spawnY = 0;
      for (let i = 0; i < 2; i++) {
        do {
          spawnX = getRandomInt(30,this.width-30);
          spawnY = getRandomInt(30,this.height-30);
        } while(this.player.distanceToCoords(spawnX, spawnY) < 500);
        this.enemies.push(new Enemy(spawnX, spawnY, "purple", 60 + this.diff * 2, this.ctx, 2.1 + this.diff / 10, 60 + this.diff * 2, 20 + this.diff * 3))
      }
      return false;
    }
  }
  nextLevel (x, y) {
    this.diff += 3;
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;
    this.player.health = this.player.health > 75 ? 100 : this.player.health + 25
    while(this.spawnEnemies()){}
  }

  getAngle (x ,y) {
    let centerX = this.cwidth / 2
    let centerY = this.cheight / 2
    let xf = 0, yf = 0;
    if (centerX < x) {
      xf = (x - centerX)
    } else {
      xf = (centerX - x)
    }
    if (centerY < y) {
      yf = (y-centerY)
    } else{
      yf = (centerY - y)
    }
    xf = (x - centerX)
    yf = (y - centerY)

    let angle = Math.atan2(yf, xf);

    if (angle < 0) {
      angle = Math.PI * 2 + angle
    }
    return angle
  }

  gameOver () {
    this.ctx.fillStyle="black"
    this.ctx.fillRect(0,0,this.cwidth,this.cheight)
    this.ctx.fillStyle = "red"
    this.ctx.font = "60px Arial";
    this.ctx.textAlign="center";
    this.ctx.fillText("GAME OVER",this.cwidth / 2,this.cheight / 2)
    this.gameOverFlag = true
  }
  diplayInterface () {
    document.getElementById("sidebar").style.display = "flex";
    let inventory = document.getElementById("inventory");
    inventory.style.display = "block";


    let helmet = document.getElementById("e-helmet")
    let nhelmet = helmet.cloneNode(true)
    helmet.parentNode.replaceChild(nhelmet, helmet);
    helmet = document.getElementById("e-helmet")

    let chest = document.getElementById("e-chest")
    let nchest = chest.cloneNode(true)
    chest.parentNode.replaceChild(nchest, chest);
    chest = document.getElementById("e-chest")

    let gloves = document.getElementById("e-gloves")
    let ngloves = gloves.cloneNode(true)
    gloves.parentNode.replaceChild(ngloves, gloves);
    gloves = document.getElementById("e-gloves")

    let weapon = document.getElementById("e-weapon")
    let nweapon = weapon.cloneNode(true)
    gloves.parentNode.replaceChild(nweapon, weapon);
    weapon = document.getElementById("e-weapon")

    let pants = document.getElementById("e-pants")
    let npants = pants.cloneNode(true)
    gloves.parentNode.replaceChild(npants, pants);
    pants = document.getElementById("e-pants")

    let boots = document.getElementById("e-boots")
    let nboots = boots.cloneNode(true)
    boots.parentNode.replaceChild(nboots, boots);
    boots = document.getElementById("e-boots")

    let armor = document.getElementById("stat-armor")
    let damage = document.getElementById("stat-damage")


    armor.innerHTML = ""
    armor.append(this.player.defense())
    damage.innerHTML = ""
    damage.append(this.player.weapon.dmg)

    helmet.innerHTML = ""
    helmet.append(this.player.helmet.show())
    chest.innerHTML = ""
    chest.append(this.player.chest.show())
    gloves.innerHTML = ""
    gloves.append(this.player.gloves.show())
    weapon.innerHTML = ""
    weapon.append(this.player.weapon.show())
    pants.innerHTML = ""
    pants.append(this.player.pants.show())
    boots.innerHTML = ""
    boots.append(this.player.boots.show())
    inventory.innerHTML = "";
    for (let i = 0; i < this.player.inventory.length; i++) {
      let item = this.player.inventory[i].show()
      item.id = i
      item.draggable = "true";
      inventory.append(item)

      item.addEventListener("dragstart", (event)=> {
          // store a ref. on the dragged elem
          dragged = event.target.id;
          // make it half transparent
          event.target.style.opacity = .5;
      }, false);
      item.addEventListener("dragend", function(event) {
          // reset the transparency
          event.target.style.opacity = "";
      }, false);
      item.addEventListener("mouseenter", (event)=>{
        this.player.inventory[event.target.id].stats(false);
        if (this.player.inventory[event.target.id] instanceof Weapon) {
          this.player.weapon.stats(true);
        } else {
          switch (this.player.inventory[event.target.id].type) {
            case "helmet":
              this.player.helmet.stats(true)
              break;
            case "chest":
              this.player.chest.stats(true)
              break;
            case "gloves":
              this.player.gloves.stats(true)
              break;
            case "pants":
              this.player.pants.stats(true)
              break;
            case "boots":
              this.player.boots.stats(true)
              break;
          }
        }
      });
      item.addEventListener("mouseleave", (event) => {
        document.getElementById("equiped").innerHTML = ""
        document.getElementById("compare").innerHTML = ""
      })
    }
    helmet.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);
    helmet.addEventListener("drop", (event) => {
      event.preventDefault();
      if (this.player.inventory[dragged].type === "helmet") {
        let temp = this.player.inventory.splice(dragged, 1);
        temp = temp.pop();
        this.player.inventory.push(this.player.helmet)
        this.player.helmet = temp
        this.diplayInterface()
      } else {
        console.log("invalid item type")
      }
    }, false);

    chest.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);
    chest.addEventListener("drop", (event)=> {
      event.preventDefault();
      if (this.player.inventory[dragged].type === "chest") {
        let temp = this.player.inventory.splice(dragged,1);
        temp = temp.pop();
        this.player.inventory.push(this.player.chest)
        this.player.chest = temp
        this.diplayInterface()
      } else{
        console.log("invalid item type")
      }
    }, false);

    gloves.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);

    gloves.addEventListener("drop", (event)=> {
      event.preventDefault();
      if (this.player.inventory[dragged].type === "gloves") {
        let temp = this.player.inventory.splice(dragged, 1);
        temp = temp.pop();
        this.player.inventory.push(this.player.gloves)
        this.player.gloves = temp
        this.diplayInterface()
      } else{
        console.log("invalid item type")
      }
    }, false);

    pants.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);
    pants.addEventListener("drop", (event)=> {
      event.preventDefault();
      if(this.player.inventory[dragged].type === "pants"){
        let temp = this.player.inventory.splice(dragged,1);
        temp = temp.pop();
        this.player.inventory.push(this.player.pants)
        this.player.pants = temp
        this.diplayInterface()
      } else{
        console.log("invalid item type")
      }
    }, false);

    boots.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);
    boots.addEventListener("drop", (event)=> {
      event.preventDefault();
      if (this.player.inventory[dragged].type === "boots") {
        let temp = this.player.inventory.splice(dragged, 1);
        temp = temp.pop();
        this.player.inventory.push(this.player.boots)
        this.player.boots = temp
        this.diplayInterface()
      } else{
        console.log("invalid item type")
      }
    }, false);

    weapon.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);
    weapon.addEventListener("drop", (event)=> {
      event.preventDefault();
      if (this.player.inventory[dragged] instanceof Weapon) {
        let temp = this.player.inventory.splice(dragged, 1);
        temp = temp.pop();
        this.player.inventory.push(this.player.weapon)
        this.player.weapon = temp
        this.diplayInterface()
      }
      else{
        console.log("invalid item type")
      }
    }, false);

  }

  pause () {
    clearInterval(this.i)
    this.drawFrame();
    this.ctx.fillStyle = "red"
    this.ctx.font = "60px Arial";
    this.ctx.textAlign="center";
    this.ctx.lineWidth=3;
    this.ctx.strokeStyle="white"
    this.ctx.fillText("PAUSED", this.cwidth/2, this.cheight/2)
    this.ctx.strokeText("PAUSED", this.cwidth/2, this.cheight/2)
    this.diplayInterface()
  }
  unPause(){
    let equip = document.getElementById("sidebar");
    let inventory = document.getElementById("inventory");
    inventory.style.display= "none"
    equip.style.display= "none"
    this.i = setInterval(()=>{
      this.gameStep()
    },20)
  }

  spawnItem(x, y){
    let item = getRandomInt(1, 6)
    let rarity = getRandomInt(1, 100)
    let color = "white"
    let outline = "black"
    let amp = 1;
    let name, dmg, rng, mK, armor, type;
    if(rarity>98){
      color = "orange"
      amp = 2;
    } else if(rarity>80){
      color = "cyan"
      amp = 1.5;
    } else if(rarity>70){
      color = "blue"
      amp = 1.4
    } else if (rarity>50) {
      color = "green"
      amp = 1.2
    }
    switch (item) {
      case 1:
        name = "sword"
        dmg = getRandomInt(1 + this.diff / 3, 5 + this.diff / 3) * amp
        rng = getRandomInt(20 + this.diff, 40 + this.diff) * amp
        mK = getRandomInt(1 + this.diff / 3, 5 + this.diff / 3) * amp
        this.items.push(new Weapon(name, x, y, color, outline, this.ctx, dmg, rng, mK))
        break;
      case 2:
        name = "helmet"
        armor = getRandomInt(1+this.diff / 3, 2 + this.diff / 3) * amp
        type = "helmet"
        this.items.push(new Armor(name, x, y, color, outline, this.ctx, armor, type))
        break;
      case 3:
        name = "chest"
        armor = getRandomInt(1 + this.diff / 3, 3 + this.diff / 3) * amp
        type = "chest"
        this.items.push(new Armor(name, x, y, color, outline, this.ctx, armor, type))
        break;
      case 4:
        name = "gloves"
        armor = getRandomInt(1 + this.diff / 3, 1 + this.diff / 3) * amp
        type = "gloves"
        this.items.push(new Armor(name, x, y, color, outline, this.ctx, armor, type))
        break;
      case 5:
        name = "pants"
        armor = getRandomInt(1 + this.diff / 3, 2 + this.diff / 3) * amp
        type = "pants"
        this.items.push(new Armor(name,x,y,color,outline,this.ctx,armor,type))
        break;
      case 6:
        name = "boots"
        armor = getRandomInt(1+this.diff / 3, 2 + this.diff / 3) * amp
        type = "boots"
        this.items.push(new Armor(name, x, y, color, outline, this.ctx, armor, type))
        break;
    }
  }

  drawAttackAnimation (angl) {
      let centerX = this.cwidth / 2
      let centerY = this.cheight / 2
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, this.player.rad + this.player.weapon.range / 2, angl-Math.PI / 3, angl + Math.PI / 3)
      this.ctx.lineWidth = this.player.weapon.range;
      this.ctx.strokeStyle = "white";
      this.ctx.stroke();
  }

  processDamageNumbers () {
    return this.damageNumbers.reduce((acc, number) => {
      if (number.steps === 0) {
        number.steps--;
        number.y -= 1;
        acc.push(number)
      }
      return acc
    }, [])
  }
  overflowTest (enemyAngle, runForMin, overflowValue){
    console.log(`running attack overflow test for angle: ${enemyAngle} and overflow value: ${overflowValue} running as min: ${runForMin}`)
    if (runForMin) {
      return enemyAngle < 360 && enemyAngle > overflowValue;
    } else {
      return enemyAngle > 0 && enemyAngle < overflowValue;
    }
  }
  enemyInAttackRadius (enemyAngle, mouseClickAngle) {
    let testFlags = []
    const maxAngle = mouseClickAngle + (60 * DEG2RAD)
    const minAngle = mouseClickAngle - (60 * DEG2RAD)
    testFlags.push(maxAngle > enemyAngle && enemyAngle > minAngle)
    if (maxAngle > (360 * DEG2RAD)) {
      const overflowMax = maxAngle - (360 * DEG2RAD)
      testFlags.push(this.overflowTest(enemyAngle, false, overflowMax))
    } else if (minAngle < 0) {
      const overflowMin = (360 * DEG2RAD) + minAngle
      testFlags.push(this.overflowTest(enemyAngle, true, overflowMin))

    }
    console.log("tested enemy degrees orientation to player", enemyAngle/DEG2RAD,"pointer degrees", mouseClickAngle/DEG2RAD)
    console.log("test results: ", testFlags)
    console.log("overAll result: " + testFlags.reduce((acc, item) => acc || item, false))
    return testFlags.reduce((acc, item) => acc || item, false)
    
  }
  
  gameStep () {
    this.drawFrame();
    this.damageNumbers = this.processDamageNumbers()

    for (var i = 0; i < this.items.length; i++) {
      if ((this.player.x + this.player.rad > this.items[i].x && this.player.x - this.player.rad < this.items[i].x + 10) &&
        (this.player.y + this.player.rad > this.items[i].y && this.player.y - this.player.rad < this.items[i].y + 5)) {
          this.player.inventory.push(this.items.splice(i, 1).pop())
        }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].active(this.player)) {
        this.enemies[i].ai(this.player);
        if (this.enemies[i].coolDown >= this.enemies[i].coolDownMax) {
          let dmg = this.enemies[i].dmg - this.player.defense();
          this.player.health -= dmg < 1 ? 1 : dmg;
          this.damageNumbers.push({x:this.player.x, y:this.player.y, value:dmg, steps:50})
          if (this.player.health <= 0) {
            clearInterval(this.i)
            this.gameOver();
          }
        }
      }
    }
    if (mouseQueue.length > 0) {
      let centerX = this.cwidth / 2
      let centerY = this.cheight / 2
      let mouseClickAngle = this.getAngle(mouseQueue[0].x, mouseQueue[0].y)
      this.drawAttackAnimation(mouseClickAngle)
      let hitCount = 0;
      for (let i = 0; i < this.enemies.length; i++) {
        if (hitCount >= this.player.weapon.maxKill) {
          break;
        }
        if (this.enemies[i].active) {
          let xOffset = this.enemies[i].x - this.camera.fx
          let yOffset = this.enemies[i].y - this.camera.fy
          let enemyAngle = this.getAngle(centerX + xOffset,centerY + yOffset)
          if(this.enemyInAttackRadius(enemyAngle, mouseClickAngle) && this.enemies[i].distanceTo(this.player) - this.enemies[i].rad < this.player.rad + this.player.weapon.range){
            if (this.enemies[i].damage(this.player.weapon.dmg)) {
              if (getRandomInt(1,100) < 10 + this.diff / 3) {
                this.spawnItem(this.enemies[i].x - 5, this.enemies[i].y - 2);
              }
              this.enemies.splice(i, 1);
            }
            hitCount++
          }

        }
      }
      if (this.enemies.length <= 0) {
        this.nextLevel();
      }
      mouseQueue.shift()

    } else {
      this.player.move(this.width, this.height);
    }
    this.step++;
  }

}
