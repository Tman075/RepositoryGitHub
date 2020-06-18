'use strict';

class Creature {
    constructor(id,name, speed, dimension, x,y, dir,attack ) {
		this.id=id;
        this.name = name;
		
		this.speed = speed;
		this.speed_cn = speed;
		
		this.dimension=dimension;
		
		this.pX=x;
		this.pY=y;
		this.direction=dir;
		this.attack=attack;
    }

}

module.exports = Creature;