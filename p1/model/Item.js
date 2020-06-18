'use strict';

class Item {
   constructor(id,x,y, name, damage, pathimage,equip  ) {
        this.id=id;
		this.name=name;
		this.pX=x;
		this.pY=y;
		this.damage=damage;
		this.pathimage=pathimage;
		this.equip=equip; //se vuoto vuol dire ceh deve essere usato

   }
}

module.exports = Item;