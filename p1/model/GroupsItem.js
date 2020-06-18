'use strict'

//var Creature=require('../Creature.js');

var listofitem=new Array();

class GroupsItem {
    constructor(x,y, item  ) {
        
		this.item=item;
		this.pX=x;
		this.pY=y;
		listofitem.push(item);
			
	//	};
    }
	
	set InsertItem(item){
     	listofitem.push(item);
    }
	
	get GetItem(){
		return listofitem;
	}
}



module.exports = GroupsItem
;

