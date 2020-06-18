'use strict';

class Door {
    constructor(x,y,u, key,direction,open) {
        this.key=key;
		this.pX=x;
		this.pY=y;
		this.pU=u;
		this.direction=direction;
		this.open=open;
		this.closing=1;
		this.closing_cn=1;
		this.opening=false;
    }

	/*set SetX(x){ this.pX=x;};
	set SetY(y){ this.pY=y};
	get GetX(){ return this.pX};
	get GetY(){ return this.pY};*/
	
	
}

module.exports = Door;