#pragma strict

private var effect : GameObject;
var start_round : int = 0;
var current_team : int = 0 ;
var player_script : Player;
private var ss_camera : Camera;
private var main_camera : Camera;

function Awake () {
}

function Start(){
	for (var c : Camera in Camera.allCameras){
		switch(c.gameObject.tag){
		case "ss_camera": 
			ss_camera = c;
			break;
		case "MainCamera":
			main_camera = c;
			break;
		default : break;
		}
	}
	if(!main_camera){
		print("cannot find main_camera");
	}
	start_round = GameProperty.round;
	current_team = GameProperty.current_team;
	player_script = GetComponent(Player);
	initial();
}

function Update () {
	if(!effect)return;
	var current_round : int = GameProperty.round;
	if(current_round - start_round >= 2 && current_team == GameProperty.current_team
		&& player_script.ssed){
		complete();
	}
	var temp_vector3 : Vector3 = transform.position;
	effect.transform.position = Vector3(temp_vector3.x,1,temp_vector3.z);	
}

function initial(){
	if(player_script.lv<=5){
		player_script.hp += 200;
		player_script.hp_max += 200;
		player_script.str += 20;
		player_script.def += 20;
	} else if (player_script.lv<=10) { 
		player_script.hp += 250;
		player_script.hp_max += 250;
		player_script.str += 30;
		player_script.def += 30;
	} else if (player_script.lv<=15){ 
		player_script.hp += 300;
		player_script.hp_max += 300;
		player_script.str += 40;
		player_script.def += 40;
	} else {
		player_script.hp += 350;
		player_script.hp_max += 350;
		player_script.str += 50;
		player_script.def += 50;
	}
	set_ss_camera(true);
	var temp_vector3 : Vector3 = transform.position;
	effect = Instantiate(Resources.Load("effect/redflare_loop",typeof(GameObject)), 
	Vector3(temp_vector3.x,1,temp_vector3.z), transform.rotation); 
	player_script.ssed = true;
	yield General.ScaleObject(transform,1.5,1);
	yield WaitForSeconds(0.5);
	set_ss_camera(false);
}

function complete(){
	if(player_script.lv<=5){
		player_script.hp_max -= 200;
		player_script.str -= 20;
		player_script.def -= 20;
	} else if (player_script.lv<=10) { 
		player_script.hp_max -= 250;
		player_script.str -= 30;
		player_script.def -= 30;
	} else if (player_script.lv<=15){ 
		player_script.hp_max -= 300;
		player_script.str -= 40;
		player_script.def -= 40;
	} else {
		player_script.hp_max -= 350;
		player_script.str -= 50;
		player_script.def -= 50;
	}
	if(player_script.hp>player_script.hp_max){
		player_script.hp = player_script.hp_max;
	}
	set_ss_camera(true);
	player_script.ssed = false;
	yield General.ScaleObject(transform,(0.667),1);
	yield WaitForSeconds(0.5);
	set_ss_camera(false);
	Destroy(effect);
	Destroy(this);
}

function set_ss_camera(active : boolean){
	if (active){
		var pos = transform.position;
		ss_camera.transform.position = Vector3(pos.x+2,3,pos.z+1.5);
		ss_camera.transform.LookAt(Vector3(pos.x,pos.y+1,pos.z));
		main_camera.depth = -1;
	} else {
		main_camera.depth = 1;
	}
}