//Thanks to Riseno and Ethical for coordinates, testing and stuff.
const	{protocol} = require('tera-data-parser'),
		Command = require('command'),		
		HARROWHOLD = 9950,
		MARKER = 556,			 // big Flower
		COORDS = [
		{x:-7364,y:-83180,z:1},  // Front (head)
		{x:-8946,y:-84887,z:1},  // Right-Back leg
		{x:-8686,y:-85301,z:1},  // Right-Back leg 2
		{x:-8620,y:-83531,z:1},  // Right-Front leg
		{x:-6667,y:-85440,z:1},  // Left-Back leg
		{x:-7403,y:-85814,z:1},  // Left-Back leg 2
		{x:-6411,y:-84057,z:1},  // Left-Front leg
		{x:-6353,y:-84872,z:1},  // Left-Middle
		{x:-8908,y:-84001,z:1}]; // Right-Middle

module.exports = function hhmarker(dispatch) {
	const command = Command(dispatch)
	let enabled = true,
		inDung = false,
		uid = 999999999,
		name = '',
		markers = [];
	
	command.add('hhmarker', () => {
		if(enabled){
			enabled = false;
			ClearSpawns()
			command.message('HH-Marker p4 module toggled OFF');
		}
		else if(!enabled){
			enabled = true;
			SpawnMarkers()
			command.message('HH-Marker p4 module toggled ON');
		}
		else{
			command.message('Invalid input');
		}
	});
	
	dispatch.hook('S_LOGIN', 9, (event) => {
		name = event.name;
	});
	
	dispatch.hook('S_LOAD_TOPO', 3, (event) => {
		ClearSpawns();
		if(event.zone == HARROWHOLD){
			inDung = true;
		}
	});
	
	dispatch.hook('C_LOAD_TOPO_FIN', 1, (event) => {
		if(enabled)
		{
			SpawnMarkers()
		}
	});
	
	function SpawnMarkers(){
		if(inDung){
			for(let i in COORDS){
			SpawnThing(COORDS[i],MARKER);
			}
		}
	}
	
	function ClearSpawns(){
		if(markers){
			for(let i in markers){
				Despawn(markers[i]);
			}
			markers = [];
		}
	}
	
	function SpawnThing(position,item){
		dispatch.toClient('S_SPAWN_COLLECTION', 4, {
			gameId : uid,
			id : item,
			amount : 1,
			loc : position,
			angle: Math.PI,
			extractor : 0,
			extractorDisabled : 0,
			extractorDisabledTime : 0
		});
		markers.push(uid);
		uid--;
	}
	
	function Despawn(uid){
	dispatch.toClient('S_DESPAWN_COLLECTION', 1, {
			uid : uid,
			unk : 0
		});
	}

}
