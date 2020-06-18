'use strict'

//var Creature=require('../Creature.js');

var listofcreature=new Array();

class Groups {
    constructor(x,y, dir, creature  ) {
        
        //this.listofcreature=new Array();
		//this.creature=creature;
		this.pX=x;
		this.pY=y;
		this.direction=dir;
		
		/*this.speed = creature.speed;
		this.speed_cn = creature.speed;*/
		
		this.speed = creature.speed;
		this.speed_cn = creature.speed;
		//InsertCreature(this.creature);
	  //  this.list = function() {
	   //  listofcreature.push(creature);
	 
       this.creature1=creature;
	   this.creature2=null;
	   this.creature3=null;
	   this.creature4=null;
	
	 		
	
    }
	
	
	
	get GetCreatures(){
		return listofcreature;
	}
}



module.exports = Groups
;

