#pragma strict

var hp :int;
var hp_max : int;
var myhb : GameObject;
var player_script : Player;

function Start () {
	initial();
}
 
function Update () {
	
	hp = player_script.hp;
	hp_max = player_script.hp_max;
	
	var myhb_pos : Vector3 = new Vector3(transform.position.x,transform.position.y+1.1,transform.position.z + 0.8);
	myhb.transform.position = myhb_pos;
	
	var temp_hp : float = hp ;
	var hp_percent : float = temp_hp/hp_max;

	if(hp <= 0 && !player_script.dead){
		player_script.dead = true;
		var camera : GameObject = GameObject.FindGameObjectWithTag("MainCamera");
		var camera_script : Maincamera = camera.GetComponent("Maincamera") as Maincamera;
		if (player_script.team == 1){
			camera_script.team1_life--;
			print("team 1 life :"+camera_script.team1_life);
		} else {
			camera_script.team2_life--;
			print("team 2 life :"+camera_script.team2_life);
		}
		anim_die();
	}
	
	myhb.transform.localScale.x = hp_percent;
}

function initial(){
	player_script = GetComponent(Player);
	hp = player_script.hp;
	hp_max = player_script.hp_max;
	var rotation : Quaternion = Quaternion.Euler(72,0,0);
	
	if(player_script.team == 1) {
		myhb = Instantiate(Resources.Load("hpbar_1",typeof(GameObject)), transform.position,rotation); 
	} else {  
		myhb = Instantiate(Resources.Load("hpbar_2",typeof(GameObject)), transform.position,rotation); 
	}
	
	myhb.transform.position = transform.position;
	myhb.transform.rotation = rotation;
}

function anim_die(){
	if (animation["die"]){
			yield WaitForSeconds(0.5);
			Instantiate(Resources.Load("explosion_died",typeof(GameObject)), transform.position, transform.rotation); 
			animation.Play("die");
		}
}

function Clone(hpbar : HPBar){
	hpbar.hp = hp;
	hpbar.hp_max = hp_max;
}