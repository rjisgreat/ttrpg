#pragma strict

public class Player extends MonoBehaviour{
	
	var mon_name : String;
	var lv : int; 
	var hp :int;
	var hp_max : int;
	var mp : int;
	var mp_max : int;
	var str : int;
	var def : int;
	var spd : int; // movement speed
	var range : int; //normal attack range
	var exp_worth : int; // worth how many exp when being killed
	var exp : int; // gained exp
	var exp_next : int; // next level exp
	var type : String;
	var team : int;
	var attacked : boolean;
	var moved : boolean;
	var ssed: boolean;
	var pre_pos : Vector3;
	var dead : boolean;
	var icon : Texture2D;
	var own_index : int;
	var mon_index : int;
	var ss_index : int;
	var ss : String;
	var ss_type : String;
	
	
	function Player(){
		attacked = false;
		moved = false;
		dead = false;
		ssed = false;
	}
	
	function Clone( player : Player){
		player.mon_name = mon_name;
		player.lv = lv;
		player.hp = hp;
		player.hp_max = hp_max;
		player.mp_max = mp_max;
		player.mp = mp;
		player.str = str;
		player.def = def;
		player.spd = spd;
		player.range = range;
		player.exp_worth = exp_worth;
		player.exp = exp;
		player.exp_next = exp_next;
		player.type = type;
		player.team = team;
		player.attacked = attacked;
		player.moved = moved;
		player.pre_pos = pre_pos;
		player.dead = dead;
		player.icon = icon;
		player.own_index = own_index;
		player.mon_index = mon_index;
		player.ss = ss;
		player.ss_index = ss_index;
		player.ss_type = ss_type;
		print("mon_name :"+mon_name);
	}
	
	function ToString() : String{
		return "mon_name:"+mon_name+" lv:"+lv+" hp:"+hp+" hp_max:"+hp_max+" mp:"+mp+" mp_max:"+mp_max+" str:"+str+
		" def:"+def+" spd:"+spd+" range:"+range+" exp:"+exp+" worth:"+exp_worth+" next:"+exp_next+" type:"+type+
		" team:"+team;
		
	}
}