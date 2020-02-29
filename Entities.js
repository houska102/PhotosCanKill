class Entity{
  constructor(x,y,color,rad,ctx){
    this.x = x;
    this.y = y;
    this.color = color;
    this.rad = rad
    this.ctx = ctx
  }

  draw(dx,dy){
    this.ctx.beginPath();
    this.ctx.arc(dx,dy,this.rad,0, (360 * DEG2RAD));
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  distanceToCoords(x,y){
    let xf = 0,yf = 0;
    let u = 0;
    if(this.x<x){
      xf = (x-this.x)
    }
    else{
      xf = (this.x-x)
    }
    if(this.y<y){
      yf = (y-this.y)
    }
    else{
      yf = (this.y-y)
    }
    u = Math.sqrt(Math.pow(xf,2)+Math.pow(yf,2))
    return u;
  }

  distanceTo(entity){
    let xf = 0,yf = 0;
    let u = 0;
    if(this.x<entity.x){
      xf = (entity.x-this.x)
    }
    else{
      xf = (this.x-entity.x)
    }
    if(this.y<entity.y){
      yf = (entity.y-this.y)
    }
    else{
      yf = (this.y-entity.y)
    }
    u = Math.sqrt(Math.pow(xf,2)+Math.pow(yf,2))
    return u;
  }

}





class Player extends Entity{
  constructor(width,height,ctx){
    super(width/2,height/2,"red",20,ctx)
    this.health = 100;
    this.maxHealth = this.health;
    this.inventory = []
    // /*TESTING
    this.inventory.push(new Armor("god mode",0,0,"white","black",this.ctx,50,"boots"))
    this.inventory.push(new Weapon("OPnator",0,0,"white","black",this.ctx,999,999,999))
    // TESTING*/
    this.weapon = new Weapon("basic weapon",0,0,"white","black",this.ctx,1,20,1)
    this.helmet = new Armor("basic helmet",0,0,"white","black",this.ctx,0,"helmet")
    this.chest = new Armor("basic chest" ,0,0,"white","black",this.ctx,0,"chest")
    this.gloves = new Armor("basic gloves" ,0,0,"white","black",this.ctx,0,"gloves")
    this.pants = new Armor("basic pants" ,0,0,"white","black",this.ctx,0,"pants")
    this.boots = new Armor("basic boots" ,0,0,"white","black",this.ctx,0,"boots")
  }

  draw(dx,dy){
    super.draw(dx,dy)
    this.ctx.beginPath();
    this.ctx.fillStyle = "red"
    this.ctx.fillRect(dx-this.rad*1.5,dy-this.rad-5,((this.rad*2)*(this.health/this.maxHealth))*1.5,4)
  }

  defense(){
    return this.gloves.armor+this.chest.armor+this.pants.armor+this.boots.armor+this.helmet.armor
  }

 move (width, height) {
    for (let i = 0; i < keysPressed.length; i++) {
      switch(keysPressed[i]){
        case 38:
        case 87:
          this.y-=2;
          if(this.y<0+this.rad)this.y=0+this.rad;
          break;
        case 40:
        case 83:
          this.y+=2;
          if(this.y>height-this.rad)this.y=height-this.rad;
          break;
        case 37:
        case 65:
          this.x-=2;
          if(this.x<0+this.rad)this.x=0+this.rad;
          break;
        case 39:
        case 68:
          this.x+=2;
          if(this.x>width-this.rad)this.x=width-this.rad;
          break;
      }
    }
  }
}

class Enemy extends Entity{
  constructor(x,y,color,rad,ctx,speed,health,damage){
    super(x,y,color,rad,ctx);
    this.speed = speed;
    this.health = health;
    this.maxHealth = this.health;
    this.activated = false;
    this.coolDown = 0;
    this.coolDownMax = 30;
    this.dmg = damage;
  }

  draw (dx, dy) {
    super.draw(dx,dy)
    this.ctx.beginPath();
    this.ctx.fillStyle = "darkred"
    this.ctx.fillRect(dx - this.rad, dy - this.rad - 5, ((this.rad*2) * (this.health / this.maxHealth)), 2)
  }

  playerInRange(player){
    if (this.distanceTo(player) - this.rad < player.rad + this.rad / 3) {
      return true;
    }
    else {
      return false;
    }
  }


  active(player){
    let detection = 250;
    if(this.distanceTo(player) < detection){
      return true;
    }
    else {
      return false;
    }
  }

  damage(dmg){
    this.health -= dmg
    this.activated = true;
    if (this.health <= 0) {
      return true;
    }
    return false
  }

  moveToPlayer (player) {
    let vectorX = 0 , vy = 0;
    vectorX = this.x-player.x;
    vy = this.y-player.y;
    if (vectorX < 0) {
      vectorX *= -1;
    }
    if (vy < 0) {
      vy *= -1;
    }
    let vectorSum =   vectorX + vy;
    vectorX /= vectorSum;
    vy /= vectorSum;

    if (player.x > this.x) {
      this.x += this.speed *  vectorX
    }
    else if(player.x == this.x){
      // no need to move horizontaly
    }
    else {
      this.x -= this.speed *  vectorX
    }
    if (player.y > this.y) {
      this.y += this.speed * vy
    }
    else if (player.y == this.y) {
      // no need to move vertically
    }
    else {
      this.y -= this.speed * vy
    }
  }

  ai (player) {
    if (this.distanceTo(player) - this.rad > player.rad) {
      this.moveToPlayer(player)
    }
    if (this.playerInRange(player)) {
      if (this.coolDown >= this.coolDownMax) {
        this.coolDown = 0;
      }
      else {
        this.coolDown++;
      }
    }
    else {
      this.coolDown = 0;
    }
  }
}
