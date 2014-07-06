#pragma strict

var background : Texture2D;
var logo : Texture2D;
 
private var hScrollbarValue : float ;
public var scrollPosition : Vector2 = Vector2.zero;
var myStyle:GUIStyle;
private var db : dbAccess;
private var monster_box : Player [];
private var monster_style : GUIStyle []; 
private var team_arraylist : ArrayList;
var team_monster_style : GUIStyle []; 
private var blank_team_icon : Texture2D;
private var empty_team_icon : Texture2D;
private var window_bg : Texture2D;

var column : int = 3;
var column_last : int;
var side_offset : int = 10 ;
var side_length : float ;
var team_side_length : float;
var monster_menu : GameObject ;

var property_skin : GUISkin;
private var previous_press : boolean = false;
private var press_duration : float = 0;

private var clicked_index : int=0;
private var window_shown : boolean = false;
private var ss_list : SS_table [];


private var fadeTime : float = 0.7; // how long you want it to fade?
private var fadeIn : boolean = true; // "true" for fade in, and "false" for fade out
private var color : Color = Color32(255f,255f,255f,0); 
private var timer : float = 0;
private var screen_fadeing : boolean = false;


var black_screen : GameObject;
var fadeout : boolean = false;
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
 
   // GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), GameProperty.blackScreen);

 
function Update(){
	//spinning_cam();
	timer -= Time.deltaTime;
	black_screen.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0.5,0.6,5));
	black_screen.transform.rotation = Quaternion.Euler(transform.rotation.x-90,transform.rotation.y,transform.rotation.z);
    if (timer <= 0)
    {
        timer = 0;
    }
    if(fadeout){
		SetAlpha(black_screen.renderer.material,false);	
    } else {
		SetAlpha(black_screen.renderer.material,true);
    }
}

function spinning_cam(){
	transform.Rotate(Vector3.up * Time.deltaTime * 5, Space.World);
}

function Start(){ 
	FadeOut();
	db = new dbAccess();
    db.OpenDB("monster_war.db");
    
    side_length = Screen.width / 2 / column -side_offset;
    team_side_length = Screen.height /3 - 20;
    team_arraylist = new ArrayList();
    team_arraylist = Team_arrayList.team_arraylist;
    
    var temp_array : ArrayList = db.BasicQuery("Select * from monster_box");
    print("monster_box count :"+temp_array.Count);
    monster_box = new Player[temp_array.Count];
    monster_style = new GUIStyle[temp_array.Count];
    team_monster_style  = new GUIStyle[3];  
    
    blank_team_icon = General.getTexture("occupied",false);
    empty_team_icon = General.getTexture("empty",false);
    
    for (var a = 0; a< temp_array.Count;a++){
    	monster_style[a] = new GUIStyle();
   		monster_style[a].normal.textColor = Color.white; 
    }
    for (a = 0; a< 3;a++){
    	team_monster_style[a] = new GUIStyle();
   		team_monster_style[a].normal.textColor = Color.white;  
   		team_monster_style[a].normal.background = General.getTexture("A",false);
    }
    print("size :"+monster_box.length);
    for (var x = 0 ; x < temp_array.Count ; x++){
		var temp_array1 : ArrayList  = temp_array[x] as ArrayList;
		var new_player_script : Player = new Player();
		var team_selected : boolean ;
	    for (var y = 0 ; y < temp_array1.Count ; y++){
	    	var temp = temp_array1[y]; 
	    	switch(y){
			case 0:
				new_player_script.lv = int.Parse(""+temp);
				break;
			case 1:
				new_player_script.mon_name = ""+temp;
				new_player_script.icon = General.getTexture(""+temp,true);
				monster_style[x].normal.background = new_player_script.icon;
				break;
			case 2:
				new_player_script.exp = int.Parse(""+temp); 
				break;
			case 3:
				new_player_script.team = int.Parse(""+temp); 
				if (int.Parse(""+temp) == 1){ 
					team_selected = true;
	    		}
				break;
			case 4:
				new_player_script.own_index = int.Parse(""+temp);
				break;
			case 5:
				new_player_script.mon_index = int.Parse(""+temp);
				break;
	    	}
	    }
	    
	    // get monster other ability
    	var monster_ability : ArrayList = db.BasicQuery("Select * from monster_list where name ='"+new_player_script.mon_name+"'");
    	var monster_record : ArrayList = monster_ability[0] as ArrayList;
        for (var s = 0 ; s < monster_record.Count ; s++){
        	temp = monster_record[s];
        	//print("temp:"+temp);
        	switch(s){
    		case 0:
    			//monster_box[i].lv = int.Parse(""+temp);
    			break;
    		case 1:
    			//monster_box[i].mon_name = ""+temp;
    			break;
    		case 2:
    			var hp = int.Parse(""+temp);
    			new_player_script.hp = hp;
    			new_player_script.hp_max = hp;
    			break;
    		case 3:
    			var mp = int.Parse(""+temp);
    			new_player_script.mp = mp;
    			new_player_script.mp_max = mp;break;
    		case 4:
    			new_player_script.str = int.Parse(""+temp);break;
    		case 5:
    			new_player_script.def = int.Parse(""+temp);break;
    		case 6:
    			new_player_script.spd = int.Parse(""+temp);break;
    		case 7:
    			new_player_script.range = int.Parse(""+temp);break;
    		case 8:
    			//monster_box[i].exp = int.Parse(""+temp);
    			break;
    		case 9:
    			new_player_script.type = ""+temp;break;
    		case 11: 
    			new_player_script.ss_index = int.Parse(""+temp);break;
    			
        	}
        }
        //new_player_script.Clone(monster_box[x]);
	    
		Lv_system.check_up_lv(new_player_script,true);
		monster_box[x] = new_player_script;
	    if(team_selected) {
	    	team_arraylist.Add(new_player_script);	
	    }
    } 
    ss_list =  GameProperty.ss_list;
    // insert the ss into player     
    for(var i = 0; i < monster_box.Length ; i++){
    	for( s = 0; s< ss_list.length; s++){
    		var ss_index : int = ss_list[s].ss_index;
    		if(monster_box[i].ss_index == ss_index){
    			monster_box[i].ss = ss_list[s].ss;
    			monster_box[i].ss_type = ss_list[s].ss_type;
    		}
    	}
	}
    
    print("team_arraylist.Count : "+team_arraylist.Count); 
    window_bg = General.getTexture("map_background",false);
}

private var monster_icon : Texture2D ;
// Make the contents of the window
function DoMyWindow (windowID : int) { 
	//print("width :"+window_bg.width +" height :"+window_bg.height);
	GUI.Label (new Rect (0, 0, window_bg.width,window_bg.height), window_bg);
	
	if (GUI.Button (new Rect (Screen.width*0.8-110,10,100,20), "Cancel")){
		window_shown = false;
	} 
	//Debug.Log("id: " + GUIUtility.hotControl);
	var temp_player_script : Player = monster_box[clicked_index];
	 
	GUI.skin.label.fontSize = 16;
	GUI.skin.label.normal.textColor = Color.black; 
	//GUI.skin.window.normal.background =  window_bg;
	 
	GUI.Label (Rect (20, 20, 150, 150), monster_icon);
	GUI.Label (Rect (20, 200, 120, 30), "HP :"+temp_player_script.hp+"/"+temp_player_script.hp);
	GUI.Label (Rect (20, 230, 120, 30), "MP :"+temp_player_script.mp+"/"+temp_player_script.mp);
	GUI.Label (Rect (200, 30, 100, 25), temp_player_script.mon_name);
	GUI.Label (Rect (300, 30, 100, 25), "Lv"+temp_player_script.lv);
	GUI.Label (Rect (200, 75, 100, 25), "Str :"+temp_player_script.str);
	GUI.Label (Rect (200, 100, 100, 25), "Def :"+temp_player_script.def);
	GUI.Label (Rect (200, 125, 100, 25), "Spd :"+temp_player_script.spd);
	GUI.Label (Rect (200, 150, 100, 25), "Range :"+temp_player_script.range);
	GUI.Label (Rect (200, 175, 200, 25), "S.S :"+temp_player_script.ss);
	
	if(team_arraylist.Count < 3){
		if (GUI.Button (Rect (Screen.width/2*0.8 - 50, Screen.height*0.7,100,20), "Choose")){
			var own_index : int = temp_player_script.own_index;
			if (team_arraylist.Count !=3){ 
				if (check_exist_team(own_index)){
					print(monster_box[clicked_index].mon_name+" already existed in team!");
				} else {
					team_arraylist.Add(monster_box[clicked_index]);
					db.Update_monster(monster_box[clicked_index].own_index,"team","1");
					window_shown = false;
				}
			} else {
				print("3 monsters already!");
			}
		} 
	}
}
var window_rect : Rect =  Rect (Screen.width * 0.1, Screen.height * 0.1, Screen.width*0.8, Screen.height*0.8);
	
function OnGUI(){ 
	
   if (fadeIn)
    {
        color.a = timer / fadeTime;
    }
    else
    {
        color.a = 1 - (timer / fadeTime);
    }
    
    GUI.color = color;
	//print("GUI.color :"+GUI.color+" color:"+color);
	
	if(window_shown){ 
		window_rect =  Rect (Screen.width * 0.1, Screen.height * 0.1, Screen.width*0.8, Screen.height*0.8);
		GUI.Window (0,window_rect, DoMyWindow,"");
	}
	
	//  put the monster box from db
	var temp : float = float.Parse(monster_box.length+"") / column;
	var row : int = Mathf.Ceil(temp);
	var rest : int = monster_box.length % column;
	//print("row :"+row);
	//print("rest :"+rest);
	var x : int ; 
	var y :int;
	
	scrollPosition = GUI.BeginScrollView (new Rect(Screen.width/2, 50 ,Screen.width/2,Screen.height-100),scrollPosition,new Rect(0,0,Screen.width/2-100,(side_length+5) * row));
	//var index : int ;
	
	for (x = 0 ; x < row ; x++){
		if (rest != 0){
			if (x == row -1){
				column_last = rest;
		    } else {
		    	column_last = column;
		    }
	    } else {
	    	column_last = column;
	    }
    	//print("x :"+x+"column:"+column+" column_last:"+column_last);
	    for (y = 0 ; y < column_last ; y++){
			GUI.BeginGroup(Rect(y*(side_length+5), x*(side_length+5) ,side_length,side_length));
			var index = x * column + y;
			//GUI.TextArea(new Rect(0,0,Screen.width/2,Screen.height),innerText); 
			var temp_style : GUIStyle = new GUIStyle();
			temp_style = monster_style[index];
			if (!monster_box) print("monster_box is null");
			var own_index : int = monster_box[index].own_index;
			var mon_name : String = monster_box[index].mon_name;
			
			if (check_exist_team(own_index)){
				temp_style.normal.background = blank_team_icon ;
			} else {
				temp_style.normal.background = monster_box[index].icon;
			}
			
			//Graphics.DrawTexture(Rect(0,0,60,60), blank_team_icon);
			
			if(GUI.Button(Rect(0,0, side_length, side_length), "Lv"+monster_box[index].lv, temp_style) && !window_shown){
				// clicked button 
				if (check_exist_team(own_index)){
					break;
				}
				monster_icon = General.getTexture(monster_box[index].mon_name,true);
				clicked_index = index;
				print(mon_name+" is pressed "+team_arraylist.Count);     
				window_shown = true;
		    }
		    //The group has to be told to end.
		    GUI.EndGroup();
	    }
	}
    
	GUI.EndScrollView(); 
	for (x = 0 ;x < 3 ; x++){
		var top : int = side_offset ;  
		var left : int = side_offset*(x+1) + team_side_length*x;
		//var style : GUIStyle = new GUIStyle();
		var lv : String = "";
		var temp_player : Player;
		
		if (team_arraylist.Count > x){ 
			temp_player = team_arraylist[x] as Player; 
			//print("name :"+temp_player.mon_name);
			team_monster_style[x].normal.background = temp_player.icon; 
			//style.normal.background = temp_player.icon; 
			lv = "Lv"+temp_player.lv;
		} else{ 
			team_monster_style[x].normal.background = empty_team_icon; 
		}
		if(GUI.Button(Rect(top,left, team_side_length, team_side_length), lv,team_monster_style[x]) && !window_shown){
			if (team_arraylist.Count > x){ // confirm there is an monster
				temp_player = team_arraylist[x] as Player; 
				db.Update_monster(temp_player.own_index,"team","0");
				team_arraylist.RemoveAt(x); 
			}
	    } 
    }
    
    if(GUI.Button(Rect(Screen.width/2-50,Screen.height-100, 50, 50),"Finish") && !window_shown){
        fadeout = true;
        FadeIn();
	} 
}  

function OnApplicationQuit()
{
    db.CloseDB(); 
	print("close database"); 
	print("End Team arrange");
}

function check_exist_team (own_index : int){
	for (var a : Player in team_arraylist){
		if (a.own_index == own_index){
			return true; 
		}
	}
	return false;
}

public function SetAlpha (material :Material, fadein : boolean ) {
//	var a : int = fadein? -1 : 1;
	if(fadein){
		if(material.color.a > 0){
	    	material.color -= new Color(0,0,0,Time.deltaTime*1f/fadeTime);
	    	print("color a :"+material.color.a);
	 	} else{
	 		material.color.a = 0;
	 	}   
	}else if(fadeout){
		
		if(material.color.a < 1){
	    	material.color += new Color(0,0,0,Time.deltaTime/fadeTime);
	    	print("color a :"+material.color.a);
	 	} else{
	 		material.color.a = 1;
	 		fadeout = false;
        	Application.LoadLevel("Menu");
	 	}   
	}
}