#pragma strict

var team_manage : GUITexture;
var adventure : GUITexture;
var setting : GUITexture;
var btn_close_warning : GUITexture;
var shop : GUITexture;
var warning : GameObject;
private var db : dbAccess;


// fade gui
private var fadeTime : float = 0.7; // how long you want it to fade?
private var fadeIn : boolean = true; // "true" for fade in, and "false" for fade out
private var color : Color = Color.black; 
private var timer : float = 0;
private var screen_fadeing : boolean = false;

var music : GameObject;

// fade gui function 
function FadeIn()
{
    timer = fadeTime;
    fadeIn = true;
    screen_fadeing = true;
}

function FadeOut()
{
    timer = fadeTime;
    fadeIn = false;
    screen_fadeing = true;
}

function OnGUI()
{ 
    if (fadeIn)
    {
        color.a = timer / fadeTime;
    }
    else
    {
        color.a = 1 - (timer / fadeTime);
    }
    
    GUI.color = color;
    GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), GameProperty.blackScreen);
}

function Start(){

	var audioPlayer : GameObject = GameObject.FindGameObjectWithTag("Audio");
	if (!audioPlayer){
		Instantiate(music, Vector3(0,0,0), Quaternion.identity); 
	}
	print("menu music play");
	db = new dbAccess();
    db.OpenDB("monster_war.db");
    if(!GameProperty.blackScreen){
		General.get_black_texture();
    }
	get_exp_list();
	get_ss_list();
	get_mon_index();
	get_lv_ratio();
	get_mon_box_size();
	FadeIn();
	yield WaitForSeconds(fadeTime);
    screen_fadeing = false;
    	
}

function check_full_team() : int {	
    var temp_array : ArrayList = db.BasicQuery("Select * from monster_box where team = 1");
    //print("Team count :"+temp_array.Count);
    return temp_array.Count;
}

function get_lv_ratio(){
	var sql_result : ArrayList = db.ReadFullTable("lv_up_ratio");
	// import lv_up_ratio from database
    for (var i = 0 ; i < sql_result.Count ; i++){
    	var lv_up_ratio : ArrayList = sql_result[i] as ArrayList;
    	var temp_lv_up : Lv_up = new Lv_up();
        for (var s = 0 ; s < lv_up_ratio.Count ; s++){
        	var temp = lv_up_ratio[s];
        	//print("temp :"+temp);
        	switch(s){
    		case 0:
    			temp_lv_up.type = ""+temp;break;
    		case 1:
    			temp_lv_up.hp = float.Parse(""+temp);break;
    		case 2:
    			temp_lv_up.mp = float.Parse(""+temp);break;
    		case 3:
    			temp_lv_up.str = float.Parse(""+temp);break;
    		case 4:
    			temp_lv_up.def = float.Parse(""+temp);break;
        	}
        }
    	Lv_system.lv_up_ratio[i] = temp_lv_up;
    }
}
function get_exp_list(){
	    
    var sql_result:ArrayList = db.ReadFullTable("lv_up_exp");
    
    // import exp_list from database
    for (var i = 0 ; i < sql_result.Count ; i++){
    	var exp_list : ArrayList = sql_result[i] as ArrayList;
        for (var s = 0 ; s < exp_list.Count ; s++){
        	var temp = exp_list[s];
        	switch(s){
    		case 1:
    			Lv_system.exp_list.Push(int.Parse(""+temp));break;
        	}
        }
    }
}

function get_ss_list(){
	    // read the skill info
    var sql_result :ArrayList = db.ReadFullTable("ss_table");
    
    GameProperty.ss_list = new SS_table[sql_result.Count];
    
    for (var i = 0 ; i < sql_result.Count ; i++){
    	GameProperty.ss_list[i] = new SS_table();
    	var ss_arrayList : ArrayList = sql_result[i] as ArrayList;
        for (var s = 0 ; s < ss_arrayList.Count ; s++){
        	var temp = ss_arrayList[s];
        	switch(s){
    		case 0: 
    			GameProperty.ss_list[i].ss_index = int.Parse(""+temp);
    			break;
    		case 1: 
    			GameProperty.ss_list[i].ss =""+temp;
    			break;
    		case 2:
    			GameProperty.ss_list[i].ss_type = ""+temp;
    			break;
    		case 4:
    			GameProperty.ss_list[i].mp_need = int.Parse(""+temp);
    			break;
        	}
        }
    }
}

function get_mon_box_size(){
	// get mon_box_size
    var sql_result :ArrayList= db.BasicQuery("Select value from general_table where data = 'mon_box_size'");
    var monster_record :ArrayList= sql_result[0] as ArrayList;
    GameProperty.mon_box_size = int.Parse(monster_record[0]+"");
    print("GameProperty.mon_box_size:"+GameProperty.mon_box_size);
}

function get_mon_index(){
	// get mon_index
    var sql_result :ArrayList= db.BasicQuery("Select value from general_table where data = 'mon_index'");
    var monster_record :ArrayList= sql_result[0] as ArrayList;
    GameProperty.mon_index = int.Parse(monster_record[0]+"");
    print("GameProperty.mon_index:"+GameProperty.mon_index);
}

function Update(){ 
	if (Input.GetMouseButtonDown(0)){
		
	    if (!warning.active){
	    	var temp_vector3 :Vector3 ;
			if(team_manage.GetScreenRect().Contains(Input.mousePosition)){
				print("Team");
				temp_vector3 = team_manage.gameObject.transform.localScale;
				team_manage.gameObject.transform.localScale *= 0.9;
				exit_scene("Team_arrange",team_manage);
		    }
			if(setting.GetScreenRect().Contains(Input.mousePosition)){
				print("setting");
		    }
		    
			if(adventure.GetScreenRect().Contains(Input.mousePosition)){
				if (check_full_team() < 3){
					print("The team is not completed.");
					warning.SetActive(true);
				} else {
					print("adventure");
					exit_scene("Map",adventure);
				}
		    }
		    if(shop.GetScreenRect().Contains(Input.mousePosition)){
				print("shop");
				exit_scene("Shop",shop);
		    }
	    } else {
	    	
			if(btn_close_warning.GetScreenRect().Contains(Input.mousePosition)){
				warning.SetActive(false);
		    }
	    }
    }
	timer -= Time.deltaTime;
    if (timer <= 0)
    {
        timer = 0;
    }
}

function exit_scene(next_scene : String,button: GUITexture){
	var temp_transform : Transform = button.gameObject.transform;
	var temp_vector3 : Vector3 = Vector3(0.3f,0.15f,1);
	General.ScaleObject(temp_transform,temp_vector3,0.1);
	yield WaitForSeconds(0.1);
	temp_vector3 = Vector3(0.15f,0.4f,1);
	General.ScaleObject(temp_transform,temp_vector3,0.1);
	yield WaitForSeconds(0.1);
	temp_vector3 = Vector3(0.2f,0.3f,1);
	General.ScaleObject(temp_transform,temp_vector3,0.1);
	yield WaitForSeconds(0.1);
	FadeOut();
	yield WaitForSeconds(fadeTime);
    screen_fadeing = false;
    Application.LoadLevel(next_scene);
}

function OnApplicationQuit()
{
    db.CloseDB(); 
	print("close database"); 
	print("End Menu");
}