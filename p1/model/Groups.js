'use strict'

//var Creature=require('../Creature.js');

var listofcreature=new Array();

class Groups {
    constructor(x,y, dir, creature  ) {
        
        //this.listofcreature=new Array();
		this.creature=creature;
		this.pX=x;
		this.pY=y;
		this.direction=dir;
		
		this.speed = creature.speed;
		this.speed_cn = creature.speed;
		//InsertCreature(this.creature);
	  //  this.list = function() {
	     listofcreature.push(creature);
			
	//	};
    }
	
	set InsertCreature(creature){
     	listofcreature.push(creature);
    }
	
	get GetCreatures(){
		return listofcreature;
	}
}



module.exports = Groups
;

