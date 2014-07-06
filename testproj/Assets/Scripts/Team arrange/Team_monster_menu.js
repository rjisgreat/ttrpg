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
var lv_value : GUIText;
var name_value : GUIText;
var menu_close : GUITexture;

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