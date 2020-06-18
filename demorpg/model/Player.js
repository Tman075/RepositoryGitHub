'use strict';

class Player {
    constructor(name,x,y, skills = [],direction, righthand, lefthand, head,body,neck, legs, feet, hands) {
        this.name = name;
        this.skills = skills;
		this.pX=x;
		this.pY=y;
		
		this.direction=direction;
		
		this.righthand=righthand;
		this.lefthand=lefthand;
		this.head=head;
		this.body=body;
		this.neck=neck;
		this.legs=legs;
		this.feet=feet;
		this.hands=hands;
		
    }

	/*set SetX(x){ this.pX=x;};
	set SetY(y){ this.pY=y};
	get GetX(){ return this.pX};
	get GetY(){ return this.pY};*/
	
	
    toString() {
        return this.name + ' ' + this.skills.join(',');
    }
}

module.exports = Player;