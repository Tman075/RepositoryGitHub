
var express = require("express"),     
bodyParser = require("body-parser"),    
cors = require('cors') 
server = express(); 

var http = require('http');
var fs = require('fs');
var path = require('path');

server.use(cors()); //questo per abilitare il cors altrimenti i client non lo "vede"

//body parser for parsing request body 

server.use(bodyParser.json()); 
server.use(bodyParser.urlencoded({ extended: true })); 

//temperary store for `main` in memory 

//var mainStore = []; 

var map = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1],
		[0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		]
		
var map_swap = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1],
		[0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		]

var Player=require('../model/Player.js');		
var player= new  Player("P1",5,8,[],'n');
var Creature=require('../model/Creature.js');
var Item=require('../model/Item.js');
var Door=require('../model/Door.js');
var Groups=require('../model/Groups.js');
var GroupsItem=require('../model/GroupsItem.js');
var Wall=require('../model/Wall.js');


var AllCreatures=new Array();
var AllItems=new Array();
var AllDoors=new Array();
var AllWalls=new Array();



var limX=17;
var limY=12;


/*
var MyObjectOrSomeCleverName = require("./my_object.js");
var my_obj_instance = new MyObjectOrSomeCleverName("foobar");
my_obj_instance.foo(); // => "foobar"
*/

//https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
// node --inspect index.js
// node --inspect-brk ServerWEB.js
// chrome://inspect/#devices



function TrasferisciMatrice(){
		for (var i=0; i<13; i++){
		 for (var j=0; j<17; j++){
			     map[i][j]=map_swap[i][j];
			}
	   }
}

/////////////////////////////////////////

function CheckClose(cr){
	if (cr.direction=='s' ){ 
	    if ((cr.pX<limX && map[cr.pY][cr.pX+1]!=0) && (cr.pX>0 && map[cr.pY][cr.pX-1]!=0)) return 'n';
		else return '';
	}
	if (cr.direction=='n' ){ 
	    if ((cr.pX<limX && map[cr.pY][cr.pX+1]!=0) && (cr.pX>0 && map[cr.pY][cr.pX-1]!=0)) return 's';
		else return '';
	}
	if (cr.direction=='w' ){ 
	    if ((cr.pY<limY && map[cr.pY+1][cr.pX]!=0) && (cr.pY>0 && map[cr.pY-1][cr.pX]!=0)) return 'e';
		else return '';
	}
	if (cr.direction=='e' ){ 
	    if ((cr.pY<limY && map[cr.pY+1][cr.pX]!=0) && (cr.pY>0 && map[cr.pY-1][cr.pX]!=0)) return 'w';
		else return '';
	}
}

/////////////////////////////////////////

function CheckParty(cr){
	
	    var ris='';
		for (var j=1;j<3; j++){
			if  (cr.pY<2 || CheckOpen(cr.pY-j,cr.pX)==false) 
				break;
			else 
				//if ( cr.pY>2 && (map[cr.pY-j][cr.pX])==8) {
				if ( cr.pY>2 && ((cr.pY-j)==player.pY && cr.pX==player.pX)) {
				   console.log("------------ ---------- -------"); 
				   console.log("-------- ti ho trovato! -------"); 
				   console.log("------------ ---------- -------"); 	
                   ris='n';				   
				}
	    }
		for (var j=1;j<3; j++){
			if  (cr.pY>(limY-2) || CheckOpen(cr.pY+j,cr.pX)==false) 
				break;
			else 
				if ( cr.pY<(limY-2) && ((cr.pY+j)==player.pY && cr.pX==player.pX)) {
				   console.log("------------ ---------- -------"); 
				   console.log("-------- ti ho trovato! -------"); 
				   console.log("------------ ---------- -------"); 			   
				   ris='s';
				}
	    }
		for (var j=1;j<3; j++){
			if  (cr.pX<2 || CheckOpen(cr.pY,cr.pX-j)==false ) break;
			else 
				if ( cr.pX>2 && (cr.pY==player.pY && (cr.pX-j)==player.pX)) {
				   console.log("------------ ---------- -------"); 
				   console.log("-------- ti ho trovato! -------"); 
				   console.log("------------ ---------- -------"); 			   
				   ris='w';
				}
	    }
		for (var j=1;j<3; j++){
			if  (cr.pX>(limX-2) || CheckOpen(cr.pY,cr.pX+j)==false) break;
			else 
				if ( cr.pX<(limX-2) && (cr.pY==player.pY && (cr.pX+j)==player.pX)) {
				   console.log("------------ ---------- -------"); 
				   console.log("-------- ti ho trovato! -------"); 
				   console.log("------------ ---------- -------"); 			   
				   ris='e';
				}
	    }
		return ris;
}
/////////////////////////////////////////

function CheckOpen(cY,cX){
	
	for (var j=0;j<AllDoors.length;j++){
	   if  (AllDoors[j].pY==cY && AllDoors[j].pX==cX) {
		   return AllDoors[j].open;
	   }  	 
	}
	
	
	for (var j=0;j<AllWalls.length;j++){
	   if  (AllWalls[j].pY==cY && AllWalls[j].pX==cX) {
	       console.log("------------ ---------- -------"); 			   
	       console.log("------------ "+AllWalls[j].pY+" " +AllWalls[j].pX + " -------"); 			   
		   console.log("------------ ---------- -------"); 			   
		   return AllWalls[j].illusion;
	   }  
	   if (j==(AllWalls.length-1)) return true;
	}
	
	//if (map[cY][cX]==0) return true;
	if (map[cY][cX]=='X') return true;
	
	if (cY==player.pY && cX==player.pX) return true;
	   
	return false;
	
}

/////////////////////////////////////////

function Ai0_MR(){
	for  (var i=0; i<AllCreatures.length; i++){
		console.log("creatura n "+i +" "+AllCreatures[0].creature1.name+" speed "+AllCreatures[i].speed+" "+AllCreatures[i].speed_cn);
		console.log("creatura n "+i +" "+AllCreatures[0].creature2.name+" speed "+AllCreatures[i].speed+" "+AllCreatures[i].speed_cn);
		console.log("-----------------------------------------------------------------------------------------------------------------------");
	 map[AllCreatures[i].pY][AllCreatures[i].pX]=9;
	 
	 if (AllCreatures[i].speed_cn==0) {
		    var whereIam=CheckParty(AllCreatures[i]);
		    if (whereIam ==''){
		 
				 if (AllCreatures[i].direction=='n') {
				 
					 if ( AllCreatures[i].pY-1>=0 && CheckOpen(AllCreatures[i].pY-1,AllCreatures[i].pX) == true ) AllCreatures[i].pY=AllCreatures[i].pY-1;
					 else { 
						 if (CheckClose(AllCreatures[i])!='') AllCreatures[i].direction='s';
						 else {
							 var rn=Math.floor(Math.random() * 11);
							 if (rn<5) AllCreatures[i].direction='e';
							 else AllCreatures[i].direction='w';
						 }
					 }
				 } else if (AllCreatures[i].direction=='w') {
					 //map[AllCreatures[i].pY][AllCreatures[i].pX-1]==0
					 if ( AllCreatures[i].pX-1>=0 && CheckOpen(AllCreatures[i].pY,AllCreatures[i].pX-1)==true ) AllCreatures[i].pX=AllCreatures[i].pX-1;
					 else { 
						 if (CheckClose(AllCreatures[i])!='') AllCreatures[i].direction='e';
						 else {
							 var rn=Math.floor(Math.random() * 11);
							 if (rn<5) AllCreatures[i].direction='s';
							 else AllCreatures[i].direction='n';
						 }
					 }
				 } else if (AllCreatures[i].direction=='s') {
					 ////////
					 if (AllCreatures[i].pY<limY && map[AllCreatures[i].pY+1][AllCreatures[i].pX]==9) {
						 console.log("--------------------- OCCUPATO! ----------------------------- ");
						 
					 }    
					 ////////
					 //map[AllCreatures[i].pY+1][AllCreatures[i].pX]==0
					 if (AllCreatures[i].pY<limY && CheckOpen(AllCreatures[i].pY+1,AllCreatures[i].pX)== true  ) AllCreatures[i].pY=AllCreatures[i].pY+1;
					 else { 
						 if (CheckClose(AllCreatures[i])!='') AllCreatures[i].direction='n';
						 else {
							 var rn=Math.floor(Math.random() * 11);
							 if (rn<5) AllCreatures[i].direction='e';
							 else AllCreatures[i].direction='w';
						 }
					 }
				 } else if (AllCreatures[i].direction=='e') {
					 // map[AllCreatures[i].pY][AllCreatures[i].pX+1]==0 
					 if (AllCreatures[i].pX+1<limX &&   CheckOpen(AllCreatures[i].pY,AllCreatures[i].pX+1)== true  ) AllCreatures[i].pX=AllCreatures[i].pX+1;
					 else { 
						 if (CheckClose(AllCreatures[i])!='') AllCreatures[i].direction='w';
						 else {
							 var rn=Math.floor(Math.random() * 11);
							 if (rn<5) AllCreatures[i].direction='n';
							 else AllCreatures[i].direction='s';
						 }
					 }
				    }
		 }  else { 
				   AllCreatures[i].direction=whereIam; 
				   //if (whereIam=='s' && map[AllCreatures[i].pY+1][AllCreatures[i].pX]!=8  ) AllCreatures[i].pY=AllCreatures[i].pY+1;
				   if (whereIam=='s' && ((AllCreatures[i].pY+1)!=player.pY || AllCreatures[i].pX!=player.pX  )) 
					   AllCreatures[i].pY=AllCreatures[i].pY+1;
				   if (whereIam=='n' && ((AllCreatures[i].pY-1)!=player.pY || AllCreatures[i].pX!=player.pX  )) 
					   AllCreatures[i].pY=AllCreatures[i].pY-1;
				   if (whereIam=='w' && ((AllCreatures[i].pY)!=player.pY || AllCreatures[i].pX-1!=player.pX  ) ) 
					   AllCreatures[i].pX=AllCreatures[i].pX-1;
				   if (whereIam=='e' && ((AllCreatures[i].pY)!=player.pY || AllCreatures[i].pX+1!=player.pX  ) ) 
					   AllCreatures[i].pX=AllCreatures[i].pX+1;
				}
		 AllCreatures[i].speed_cn=AllCreatures[i].speed;
 	 }
	 else AllCreatures[i].speed_cn--;
	}
}

/////////////////////////////////////////

function CheckItems(){
    for (var j=0;j<AllItems.length;j++){

		map[AllItems[j].pY][AllItems[j].pX]='X';
		console.log(" name item "+AllItems[j].GetItem[0].name);
		console.log(" name item "+AllItems[j].GetItem[1].name);
	}
}

/////////////////////////////////////////


function CheckDoors(){
    for (var j=0;j<AllDoors.length;j++){
		
		if (AllDoors[j].open==false) {
			
		    if (AllDoors[j].opening==true) {
			AllDoors[j].pU=AllDoors[j].pU+0.1;
			if  (AllDoors[j].pU>1.9) { AllDoors[j].opening=false; map[AllDoors[j].pY][AllDoors[j].pX]='D'; AllDoors[j].open=true; }
	    }	
		}
		else {
			if (AllDoors[j].opening==true) {
			AllDoors[j].pU=AllDoors[j].pU-0.1;
			if  (AllDoors[j].pU<=1) { AllDoors[j].opening=false; map[AllDoors[j].pY][AllDoors[j].pX]='d'; AllDoors[j].open=false; }
	    }	
		}
		
	}
	
}

function OpenCloseDoor(y,x){
	
	 for (var j=0;j<AllDoors.length;j++){
		if  (AllDoors[j].pY==y && AllDoors[j].pX==x) {
			 AllDoors[j].opening=true;
		    /* if (AllDoors[j].open==false) { AllDoors[j].opening=true; }
			 else AllDoors[j].open=false;*/
		}
	}
 }

/////////////////////////////////////////
function Create(){
	var creature= new  Creature("Cobold", 5,1);
	var creature2= new  Creature("Zombie", 5,1);

	var group= new Groups(2,12,'s',creature);
	
	group.creature2=creature2;
	
	var group2=new Groups(0,0,'e',new  Creature("Blob", 6,4));
	
	AllCreatures.push(group);
	AllCreatures.push(group2);
	
	var item= new  Item("Dagger");
	var item2= new  Item("Sword");
	
	var groupIt=new GroupsItem(10,2,item);
	groupIt.InsertItem=item2;
	AllItems.push(groupIt);
	//x,y,key,direction,open)
	var door=new Door(5,7,1,0,'o',false);
	var door2=new Door(6,2,1,0,'v',false);
	//var groupsDoor=new GroupsDoor(5,7,door);
	AllDoors.push(door);
	AllDoors.push(door2);
	
	
	for (var i=0; i<limY; i++){
		 for (var j=0; j<limX; j++){
			     if (map_swap[i][j]==1) {
						var wall=new Wall(j,i,false);	
						AllWalls.push(wall);
				 }
			}
	   }
	
	
}

/////////////////////////////////////////
function WhatDoor(y,x){
	for (var j=0;j<AllDoors.length;j++){
	    if (AllDoors[j].pY==y && AllDoors[j].pX==x)return true;
	}
    return false;
}



/////////////////////////////////////////
function OpenDoor(){
	if (player.direction=='n') {
		if (WhatDoor(player.pY-1,player.pX)== true) OpenCloseDoor(player.pY-1,player.pX);
	}
	if (player.direction=='w') {
		if (WhatDoor(player.pY,player.pX-1)== true) OpenCloseDoor(player.pY,player.pX-1);
	}
	if (player.direction=='s') {
		if (WhatDoor(player.pY+1,player.pX)== true) OpenCloseDoor(player.pY+1,player.pX);
	}
	if (player.direction=='e') {
		if (WhatDoor(player.pY,player.pX+1)== true) OpenCloseDoor(player.pY,player.pX+1);
	}
}
/////////////////////////////////////////

function PlayerMovement(key){
	        if (key=='open') OpenDoor();
				
			/////////////////////////////////////////////////////////
	        if (key=='rleft') {
				if (player.direction=='n') player.direction='w';
				else if (player.direction=='w') player.direction='s';
				else if (player.direction=='s') player.direction='e';
				else if (player.direction=='e') player.direction='n';
			}
			else 
				if (key=='rright') {
				if (player.direction=='n') player.direction='e';
				else if (player.direction=='e') player.direction='s';
				else if (player.direction=='s') player.direction='w';
				else if (player.direction=='w') player.direction='n';
			}
			else
	        if (player.direction=='n') {
				if (key=='up' && player.pY>0) player.pY=player.pY-1;
				else
					 if (key=='down' && player.pY<limY) player.pY=player.pY+1;
				else
					 if (key=='left'&& player.pX>0) player.pX=player.pX-1;
				else
					 if (key=='right' && player.pX<limX) player.pX=player.pX+1;
			}
			else
			if (player.direction=='w') {
				if (key=='up' && player.pX>0) player.pX=player.pX-1;
				else
					 if (key=='down' && player.pX<limX) player.pX=player.pX+1;
				else
					 if (key=='left' && player.pY<limY) player.pY=player.pY+1;
				else
					 if (key=='right' && player.pY>0) player.pY=player.pY-1;
			}
			else
			if (player.direction=='s') {
				if (key=='up'  && player.pY<limY ) player.pY=player.pY+1;
				else
					 if (key=='down' && player.pY>0) player.pY=player.pY-1;
				else
					 if (key=='left'  && player.pX<limX) player.pX=player.pX+1;
				else
					 if (key=='right'  && player.pX>0) player.pX=player.pX-1;
			}
			else
			if (player.direction=='e') {
				if (key=='up'  && player.pX+1<limX) player.pX=player.pX+1;
				else
					 if (key=='down'  && player.pX>0) player.pX=player.pX-1;
				else
					 if (key=='left'  && player.pY>0) player.pY=player.pY-1;
				else
					 if (key=='right'  && player.pY<limY) player.pY=player.pY+1;
			}
}
 
 
/////////////////////////////////////////
Create();

//GET all mains 
server.get('/main', function (req, res) { 
           var xp=player.pX;
		   var yp=player.pY;
		   //var yc=creature.pY;
		   //var xc=creature.pX;
		  
	       TrasferisciMatrice();
		   //map[yc][xc]=9;
		   map[yp][xp]=8;
		   CheckItems();
		   CheckDoors();
		   Ai0_MR();
		   
           res.json(map); 
}); 

//GET player
server.get('/main/player', function (req, res) { 
           res.json(player); 
}); 

//GET doors
server.get('/main/doors', function (req, res) { 
           res.json(AllDoors); 
}); 

//GET creatures
server.get('/main/creatures', function (req, res) { 
           res.json(AllCreatures); 
}); 


//GET the main with specified id 
/*server.get('/main/:id', function (req, res) {   
           
		  }); */

server.get ('/main/:immagine', function (req, res) { 
     var dir=__dirname.substr(0,(__dirname.search("controller")));
     res.sendFile(dir+"/images/"+req.params.immagine);
});
		  
/*http.createServer(function (request, response) {
	console.log('request starting...');

    var filePath = '.' + request.url;
    fs.readFile(filePath, function(error, content) {
		if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': "images" });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': "images" });
            response.end(content, 'utf-8');
        }
		  
	});
});*/


//POST new main 
server.post('/main', function (req, res) {     
	
			 PlayerMovement(req.body.key);
 
			 var xp=player.pX;
			 var yp=player.pY;
             //map.push(req.body); 
			 TrasferisciMatrice();
			 map[yp][xp]=8;			 
			 res.json(map); 
			 }); 
//PUT edited main in-place of main with specified id 
server.put('/main/:id', function (req, res) {   
             console.log("PUT "+req.params.id+" "+req.body);  
             map[req.params.id] = req.body     
			 res.json(req.body); 
			}); 

//DELETE main with specified id 
server.delete('/main/:id', function (req, res) {     
              map.splice(req.params.id, 1)     
			  res.json(req.body); 
			  }); 

//START SERVER 
server.listen(3000, function () {     
         console.log("Server running"); })
		 
		 
		 /*

I solved this problem this way:

    I run this command:

    npm config set strict-ssl false

    Then set npm to run with http, instead of https:

    npm config set registry "http://registry.npmjs.org/"

    Then I install packages using this syntax:

    npm --proxy http://username:password@cacheaddress.com.br:80 install packagename

Skip the username:password part if proxy doesn't require you to authenticate
*/