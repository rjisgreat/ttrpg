#pragma strict

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
var exp : int;
var exp_next : int;
 
var mon_icon :  GUITexture;
var str_value : GUIText;
var def_value : GUIText;
var spd_value : GUIText;
var range_value : GUIText;
var hp_value : GUIText;
var mp_value : GUIText;
var exp_value : GUIText;
var exp_next_value : GUIText;
var lv_value : GUIText;
var name_value : GUIText;
var menu_close : GUITexture;

var monster : GameObject ;

var show_state : int = 0;
private var show_speed : float = 15;
private var cam_obj : GameObject;

function Update(){ 
	// detect close monster menu
	if(menu_close.GetScreenRect().Contains(Input.mousePosition)){
        if(Input.GetMouseButtonDown(0)){
			show_state = 3;
			var cam_script : Maincamera = cam_obj.GetComponent("Maincamera");
			cam_script.longpress = false;  
			
			print("Close"); 
			//cam_script.longpress = false;
        }
    }
	switch(show_state)
	{
	case 1: // moving to screen
		//print("x :"+transform.position.x);
		transform.Translate(Vector3(-0.1,0,0)* Time.deltaTime *show_speed);
		if(transform.position.x < 5.08){ 
			transform.position.x = 5.08;
			show_state = 2;
		}
		break;
	case 2: // shown in the screen
		break;
	case 3:
		//print("x :"+transform.position.x);
		transform.Translate(Vector3(0.1,0,0)* Time.deltaTime *show_speed);
		if(transform.position.x > 6.5){ 
			transform.position.x = 6.5;
			show_state = 0;
		}
	default : 
		break;
	} 
}

function update_value (obj : GameObject){ 
	if(!obj) print("obj is null");
	cam_obj = obj;
	var hpbar = monster.GetComponent(HPBar);
	var player = monster.GetComponent(Player);
	str_value.text = ""+player.str ;
	def_value.text = ""+player.def ;
	spd_value.text = ""+player.spd ;
	range_value.text = ""+player.range ;
	hp_value.text = hpbar.hp+"/"+hpbar.hp_max ;
	mp_value.text = player.mp+"/"+player.mp_max  ;
	var exp_next : int = Lv_system.exp_list[player.lv-1];
	exp_value.text = player.exp+"/"+exp_next ;
	lv_value.text = "Lv"+player.lv ;
	name_value.text = player.mon_name ;  
	var tex: Texture2D = General.getTexture(player.mon_name,true);
    if(tex != null){ 
    	mon_icon.guiTexture.texture = tex;
    }
}