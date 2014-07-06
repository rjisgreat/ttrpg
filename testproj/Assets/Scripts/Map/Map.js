#pragma strict

var map_sample : GameObject;
var latest_map_sample : GameObject;
private var db : dbAccess;
private var stage : Map_class [];
private var stage_circle : GameObject [] ;

private var hit : RaycastHit;
private var ray : Ray;//ray we create when we touch the screen
private var current_stage : int;
private var choose_stage : int;
var btn_bk_menu : GUITexture;
//warning 

var warning : GameObject;
var suggested_lv : GUIText;
var btn_confirm : GUITexture;
var btn_close : GUITexture;


// fade gui
private var fadeTime : float = 0.7; // how long you want it to fade?
private var fadeIn : boolean = true; // "true" for fade in, and "false" for fade out
private var color : Color = Color.black; 
private var timer : float = 0;
private var screen_fadeing : boolean = false;

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

function Start (){
	db = new dbAccess();
    db.OpenDB("monster_war.db");
    // get current stage
    var sql_result : ArrayList  = db.BasicQuery("Select value from general_table where data = 'stage'");
    var stage_record : ArrayList = sql_result[0];
    current_stage = int.Parse(stage_record[0]+"");
    print("stage:"+current_stage);
    
    sql_result= db.ReadFullTable("map"); // lv and name
    
    print("length :"+sql_result.Count);
   	
    stage = new Map_class[sql_result.Count];
    stage_circle = new GameObject[current_stage];
    
    for (var i = 0 ; i < sql_result.Count ; i++){
    	var map_stage : ArrayList = sql_result[i];
        var temp_stage : Map_class = new Map_class();
        for (var s = 0 ; s < map_stage.Count ; s++){
        	var temp = map_stage[s];
        	switch(s){
    		case 0:
    			temp_stage.stage = int.Parse(""+temp);break;
    		case 1:
    			temp_stage.x = float.Parse(""+temp);break;
    		case 2:
    			temp_stage.y = float.Parse(""+temp);break;
        	}
        }
        stage[i] = temp_stage;
    }
    
	for (i = 0; i< current_stage ; i++){
		var temp_obj : Map_class = stage[i];
		var temp_pos : Vector3 = Camera.main.ViewportToWorldPoint(Vector3(temp_obj.x,temp_obj.y,0));
		temp_pos.z = map_sample.transform.position.z;
		if (i+1 < current_stage){
			stage_circle[i] = Instantiate(map_sample, temp_pos , map_sample.transform.rotation);
		}else if (i+1 == current_stage){
			stage_circle[i] = Instantiate(latest_map_sample, temp_pos , map_sample.transform.rotation);
		}
		
	}
	//print("temp :"+Camera.main.ViewportToWorldPoint(temp));
	
	
    FadeIn();
	yield WaitForSeconds(fadeTime);
    screen_fadeing = false;
}

function Update(){
	ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	
	for (var a = 0 ; a< stage_circle.length ; a++){
		stage_circle[a].transform.Rotate(Vector3.up * Time.fixedDeltaTime * 20);
	}
	//if(screen_fadeing) return;
    if(Physics.Raycast(ray,hit)){ // place the clicked object into hit
    	if(Input.GetMouseButton(0)){
    		for (var i = 0 ; i< stage_circle.length ; i++){
	    		var temp_obj : GameObject = stage_circle[i];
	    		if (temp_obj.GetInstanceID() == hit.transform.gameObject.GetInstanceID()){
	    			choose_stage = stage[i].stage;
	    			suggested_lv.text = ""+stage[i].stage*5;
	    			warning.SetActive(true);
					break;
	    		}
	    	}
    	}
     }
     if (warning.active && !screen_fadeing){
	    if(btn_confirm.GetScreenRect().Contains(Input.mousePosition)){
	        if(Input.GetMouseButtonDown(0)){
				print("confirm");
				db.BasicQuery("Update general_table set value = '"+choose_stage+"' where data = 'choose_stage'");
				exit_scene("gameplay");
				//db.BasicQuery("Update general_table set value = 'gameplay' where data = 'loading_scene'");
				
				//exit_scene("Loading_screen");
	        }
    	}
		if(btn_close.GetScreenRect().Contains(Input.mousePosition)){
	        if(Input.GetMouseButtonDown(0)){
				print("close");
				warning.SetActive(false);
	        }
	    }
    } else{
    	if(btn_bk_menu.GetScreenRect().Contains(Input.mousePosition)){
	        if(Input.GetMouseButtonDown(0)){
				exit_scene("Menu");
	        }
	    }
    }
	timer -= Time.deltaTime;
    if (timer <= 0)
    {
        timer = 0;
    }
}


function exit_scene(next_scene : String){
	FadeOut();
	yield WaitForSeconds(fadeTime);
    screen_fadeing = false;
    Application.LoadLevel(next_scene);
}
		
function OnApplicationQuit()
{
    db.CloseDB(); 
	print("close database"); 
	print("End Map");
}

public class Map_class extends MonoBehaviour{
	var stage : int;
	var x : float;
	var y : float;
}
