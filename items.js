class item{
  constructor(name, x, y, color, outline, ctx){
    this.name = name
    this.x = x;
    this.y = y;
    this.color = color;
    this.outline = outline
    this.ctx = ctx;
  }
  draw(dx, dy){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.outline;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(dx, dy, 10, 5);
    this.ctx.strokeRect(dx, dy, 10, 5);
  }


}


class Weapon extends item{
  constructor(name, x, y, color, outline, ctx, dmg, range, maxKill){
    super(name, x, y, color, outline, ctx)
    this.dmg = dmg;
    this.range = range;
    this.maxKill = maxKill
  }
  show () {
    let element = document.createElement("span");
    element.className = "item"
    element.style.background = 'url("images/sword.png")'
    element.style.background += " " + this.color
    return element
  }
  stats (bar) {
    let cont
    if (bar) {
      cont = document.getElementById("equiped");
    } else {
      cont = document.getElementById("compare")
    }
    cont.innerHTML= `name:${this.name} <br />damage:${this.dmg} <br />range:${this.range} <br />max hits:${this.maxKill} <br />`

  }
}

class Armor extends item{
  constructor(name,x,y,color,outline,ctx,armor,type){
    super(name,x,y,color,outline,ctx)
    this.armor = armor
    this.type = type;
  }
  show () {
    let element = document.createElement("span");
    element.className = "item"
    switch (this.type) {
      case "helmet":
        element.style.background = 'url("images/helmet.png")'
        break;
      case "chest":
        element.style.background = 'url("images/chest.png")'
        break;
      case "gloves":
        element.style.background = 'url("images/gloves.png")'
        break;
      case "pants":
        element.style.background = 'url("images/pants.png")'
        break;
      case "boots":
        element.style.background = 'url("images/boots.png")'
        break;
    }
    element.style.background += " " + this.color
    return element
  }
  stats (bar) {
    let cont
    if (bar) {
      cont = document.getElementById("equiped");
    } else {
      cont = document.getElementById("compare")
    }
    cont.innerHTML= `name:${this.name}<br />type:${this.type}<br />armor:${this.armor}<br />`

  }
}
