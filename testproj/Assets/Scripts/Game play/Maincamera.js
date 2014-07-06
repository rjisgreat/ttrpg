#pragma strict

private var hit : RaycastHit;
private var ray : Ray;//ray we create when we touch the screen
private var player : Transform; // focused player
private var player_attacked : Transform; // player being attacked
private var action : int ; 
// 0 : idle , 1 : move , 2 : attack , 3 : s.s
private var player_script : Player;
private var player_attacked_script : Player;
//private var player_attacked_hp : HPBar;
//private var round : int;
//private var current_team : int;
private var menu_state : String;

private var prefab : GameObject; 
private var gridX = 10; 
private var gridY = 10; 
private var cube_ground : GameObject[,] = new GameObject[10,10];
private var cube_ground_property : Cube_property[,] = new Cube_property[10,10];
private var startTime: float = 0;

var cube_ground_sam : GameObject;
var team1_life :int;
var team2_life :int;
var victory_board : GameObject;
var victory_logo : GUITexture;
var monster1 : GameObject ;
var monster2 : GameObject ;
var monster3 : GameObject ;
var enemy_monster1 : GameObject ;
var enemy_monster2 : GameObject ;
var enemy_monster3 : GameObject ;
var monster_menu : GameObject;
var stage : int = 1;
var money : int = 0;

private var db : dbAccess;
private var monster_box : Player [] = new Player[3];
private var monster_box_hp : HPBar [] = new HPBar[3];
private var enemy_monster_box : Player [] = new Player[3];
private var enemy_monster_box_hp : HPBar [] = new HPBar[3];
private var ai : boolean = true;  
private var current_ai_index : int = 0;
private var monster_gameObj_box : GameObject[] = new GameObject[3];
private var enemy_monster_gameObj_box : GameObject[] = new GameObject[3];

// s.s
private var ss_range : ArrayList = new ArrayList();
private var ss_list : SS_table[];

//warning
var warning : GameObject;
var warning_title : GUIText;
var warning_msg : GUIText;
var warning_btn_close : GUITexture;

var audioClip : AudioClip [];

//camera 

var ss_camera : Camera ;
private var main_camera : Camera;

function Start () { 
	for (var y = 0; y < gridY; y++) { 
		for (var x = 0;x < gridX; x++) { 
			var pos = Vector3 (x, -0.5, y); 
			cube_ground[x,y] = Instantiate(cube_ground_sam, pos, cube_ground_sam.transform.rotation); 
			cube_ground[x,y].GetComponent(Animation).enabled= false;
			cube_ground_property[x,y] = cube_ground[x,y].GetComponent(Cube_property);
			cube_ground_property[x,y].x=x;
			cube_ground_property[x,y].z=y;
			cube_ground_property[x,y].used = false;
		} 
	} 
	main_camera = GetComponent(Camera);
	
	var audio : GameObject = GameObject.FindGameObjectWithTag("Audio");
	if (audio) {
		Destroy(audio);
	}
	
	GameProperty.reset();
	
	db = new dbAccess();
    db.OpenDB("monster_war.db");
    
    var sql_result : ArrayList = db.BasicQuery("Select * from monster_box where team = 1");
    print("length :"+sql_result.Count);
    
    var i : int ;
    var s : int ;
    var temp;
    var hp : int ;
    var mp : int ;
    
    for (i = 0 ; i < sql_result.Count ; i++){
    	var monster_record : ArrayList = sql_result[i] as ArrayList;
    	for (s = 0 ; s < monster_record.Count ; s++){
        	temp = monster_record[s];
        	switch(s){
    		case 1:
    			var temp_pos : Vector3 = Vector3(0,0,0);
				switch(i){
					case 0:temp_pos = Vector3(0,0,9);
						break;
					case 1:temp_pos = Vector3(4,0,9);
						break;
					case 2:temp_pos = Vector3(8,0,9);
						break;
				}
				var rotation : Quaternion = Quaternion.Euler(0, 180, 0);
    			monster_gameObj_box[i] = Instantiate(Resources.Load("model/"+temp),temp_pos,rotation) as GameObject;
				monster_gameObj_box[i].tag = "Player";
				monster_box[i] = monster_gameObj_box[i].AddComponent(Player);
				var box_collider : BoxCollider = monster_gameObj_box[i].AddComponent(BoxCollider);
				box_collider.center.y = 0.5;  
				box_collider.size.x = 1;
				box_collider.size.y = 1;
				box_collider.size.z = 1;
				monster_box_hp[i] = monster_gameObj_box[i].AddComponent(HPBar);
				
       		 	monster_gameObj_box[i].animation.Play("idle");
       		 	break;
    		}
    	}
    }
    
    // import player team
    
    for (i = 0 ; i < sql_result.Count ; i++){
    // get monster lv , name , exp
    	//var monster_record : ArrayList = sql_result[i] as ArrayList;
    	monster_record = sql_result[i] as ArrayList;
    	var new_player_script : Player = new Player();
    	var new_player_hp : HPBar = new HPBar();
    	
    	for (s = 0 ; s < monster_record.Count ; s++){
        	temp = monster_record[s];
        	switch(s){
    		case 0:
    			new_player_script.lv = int.Parse(""+temp);break;
    		case 1:
    			new_player_script.mon_name = ""+temp;break;
    		case 2:
    			new_player_script.exp = int.Parse(""+temp);break;
    		case 3:
    			new_player_script.team = int.Parse(""+temp);break;
    		case 4:
    			new_player_script.own_index = int.Parse(""+temp);break;
    		case 5:
    			new_player_script.mon_index = int.Parse(""+temp);break;	
    		}
    	}
    	// get monster other ability
    	var monster_ability : ArrayList = db.BasicQuery("Select * from monster_list where name ='"+new_player_script.mon_name+"'");
    	monster_record = monster_ability[0] as ArrayList;
        for (s = 0 ; s < monster_record.Count ; s++){
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
    			hp = int.Parse(""+temp);
    			new_player_script.hp = hp;
    			new_player_script.hp_max = hp;
    			new_player_hp.hp = hp;
    			new_player_hp.hp_max = hp;
    			break;
    		case 3:
    			mp = int.Parse(""+temp);
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
        new_player_script.Clone(monster_box[i]);
        new_player_hp.Clone(monster_box_hp[i]);
    }
    
    for (var z : Player in monster_box){
    	print(z.ToString());
    }
    
    // get current stage
    sql_result = db.BasicQuery("Select value from general_table where data = 'choose_stage'");
    monster_record = sql_result[0] as ArrayList;
    stage = int.Parse(monster_record[0]+"");
    print("stage:"+stage);
    
     // get current money
    sql_result = db.BasicQuery("Select value from general_table where data = 'money'");
    monster_record = sql_result[0] as ArrayList;
    money = int.Parse(monster_record[0]+"");
    print("money:"+money);
    
    // import enemy
    //sql_result = db.BasicQuery("Select * from monster_list where name in (select monster_name from enemy_monster where stage = "+stage+")");
    sql_result = db.BasicQuery("SELECT * FROM enemy_monster, monster_list where enemy_monster.monster_name = monster_list.name and enemy_monster.stage="+stage); 
    
    for (i = 0 ; i < 3 ; i++){
    	var enemy_monster_record : ArrayList = sql_result[i] as ArrayList;
        for (s = 0 ; s < enemy_monster_record.Count ; s++){
        	temp = enemy_monster_record[s];
        	switch(s){
    		case 1:
    			temp_pos = Vector3(0,0,0);
				switch(i){
					case 0:temp_pos = Vector3(1,0,0);
						break;
					case 1:temp_pos = Vector3(5,0,0);
						break;
					case 2:temp_pos = Vector3(9,0,0);
						break;
				}
				rotation = Quaternion.Euler(0, 0, 0);
    			enemy_monster_gameObj_box[i] = Instantiate(Resources.Load("model/"+temp),temp_pos,rotation) as GameObject;
				enemy_monster_gameObj_box[i].tag = "Player";
				enemy_monster_box[i] = enemy_monster_gameObj_box[i].AddComponent(Player);
				box_collider = enemy_monster_gameObj_box[i].AddComponent(BoxCollider);
				box_collider.center.y = 0.5;  
				box_collider.size.x = 1;
				box_collider.size.y = 1;
				box_collider.size.z = 1;
				enemy_monster_box_hp[i] = enemy_monster_gameObj_box[i].AddComponent(HPBar);
				
       		 	enemy_monster_gameObj_box[i].animation.Play("idle");
       		 	break;
        	}
        }
    }
   
    for (i = 0 ; i < 3 ; i++){
    	enemy_monster_record = sql_result[i] as ArrayList;
        for (s = 0 ; s < enemy_monster_record.Count ; s++){
        	temp = enemy_monster_record[s];
        	switch(s){
    		case 0:
    			enemy_monster_box[i].lv = int.Parse(""+temp);break;
    		case 1:
    			enemy_monster_box[i].mon_name = ""+temp;
    			break;
    		case 6:
    			hp = int.Parse(""+temp);
    			enemy_monster_box[i].hp = hp;
    			enemy_monster_box[i].hp_max = hp;
    			enemy_monster_box_hp[i].hp = hp;
    			enemy_monster_box_hp[i].hp_max = hp;break;
    		case 7:
    			mp = int.Parse(""+temp);
    			enemy_monster_box[i].mp = mp;
    			enemy_monster_box[i].mp_max = mp;break;
    		case 8:
    			enemy_monster_box[i].str = int.Parse(""+temp);break;
    		case 9:
    			enemy_monster_box[i].def = int.Parse(""+temp);break;
    		case 10:
    			enemy_monster_box[i].spd = int.Parse(""+temp);break;
    		case 11:
    			enemy_monster_box[i].range = int.Parse(""+temp);break;
    		case 13:
    			enemy_monster_box[i].type = ""+temp;break;
    		case 15:	
    			enemy_monster_box[i].ss_index = int.Parse(""+temp);break;
        	}
        }
    } 
   /* // read the skill info
    sql_result = db.ReadFullTable("ss_table");
    
    ss_list = new SS_table[sql_result.Count];
    
    for (i = 0 ; i < sql_result.Count ; i++){
    	ss_list[i] = new SS_table();
    	var ss_arrayList : ArrayList = sql_result[i] as ArrayList;
        for (s = 0 ; s < ss_arrayList.Count ; s++){
        	temp = ss_arrayList[s];
        	switch(s){
    		case 0: 
    			ss_list[i].ss_index = int.Parse(""+temp);
    			break;
    		case 1: 
    			ss_list[i].ss =""+temp;
    			break;
    		case 2:
    			ss_list[i].ss_type = ""+temp;
    			break;
    		case 4:
    			ss_list[i].mp_need = int.Parse(""+temp);
    			break;
        	}
        }
    }*/
    ss_list = GameProperty.ss_list ;
        
    // insert the ss into player     
    for(i = 0; i < monster_box.Length ; i++){
    	monster_box[i].exp_next = int.Parse(""+Lv_system.exp_list[monster_box[i].lv-1]);
    	Lv_system.check_up_lv(monster_box[i],monster_box_hp[i],true);
    	for(s = 0; s< ss_list.length; s++){
    		var ss_index : int = ss_list[s].ss_index;
    		if(monster_box[i].ss_index == ss_index){
    			monster_box[i].ss = ss_list[s].ss;
    			monster_box[i].ss_type = ss_list[s].ss_type;
    		}
    	}
	}
	
	// insert the exp next into enemy     
    for(i = 0; i < monster_box.Length ; i++){
    	enemy_monster_box[i].exp_next = int.Parse(""+Lv_system.exp_list[enemy_monster_box[i].lv-1]);
    	Lv_system.check_up_lv(enemy_monster_box[i],enemy_monster_box_hp[i],false);
    	for(s = 0; s< ss_list.length; s++){
    		ss_index = ss_list[s].ss_index;
    		if(enemy_monster_box[i].ss_index == ss_index){
    			enemy_monster_box[i].ss = ss_list[s].ss;
    			enemy_monster_box[i].ss_type = ss_list[s].ss_type;
    		}
    	}
	}
    
	for(var temp_player : GameObject in GameObject.FindGameObjectsWithTag("Player")){
		var temp_player_script : Player = temp_player.GetComponent("Player") as Player;
		if(temp_player_script.team == 1){
			team1_life++;
		} else {
			team2_life++;
		}
		print("name :"+temp_player_script.mon_name+".");
		
		var tex: Texture2D = General.getTexture(temp_player_script.mon_name,true);
	    if(tex != null){ 
//	    	temp_player.renderer.material.mainTexture = tex;
	    }
	} 
	resetTexture_ground();
	
} 

function playsound(clip : int){
	audio.clip = audioClip[clip];
	audio.Play();
}

function Awake(){
	action = 0 ;
	GameProperty.round = 1;
	GameProperty.current_team = 1;
	menu_state = "no_player";
	//print("arrayList count :"+Team_arrayList.team_arraylist.Count);
	
} 

 function OnGUI()
{
	var z_pos = 100 ;	 
	if(longpress || GameProperty.current_team == 2){
		return ;
	}
	GUI.Label(new Rect( Screen.width - 100, 0, z_pos, 50 ),"Round "+GameProperty.round);
	GUI.Label(new Rect( Screen.width - 100, 50, z_pos, 50 ),"Team "+GameProperty.current_team+" turn");
	switch(menu_state){
		case "choose_player":
			if(player_script.dead)break;
			
			if(!player_script.moved){
			    if( GUI.Button( new Rect( 0, 0, z_pos, 50 ), "Move" )) {
			   	 	action = 1;
//			   	 	print("move "+player_script.spd);
			        show_range(player_script.spd,false,3);
			    }
			} else if (!player_script.attacked ) {
				if( GUI.Button( new Rect( 0, 150, z_pos, 50 ), "Undo" ) ) {
		    		//cancel_player();
		    		undo_movement();
		    	}
			}
			if (!player_script.attacked ){
			    if( GUI.Button( new Rect( 0, 50, z_pos, 50 ), "Attack" )) {
			        action = 2;
			        show_range(player_script.range,false,player_script.team);
			    }
			    if(!player_script.ssed){
					if( GUI.Button( new Rect( 0, 100, z_pos, 50 ), "S.S" ) ) {
						print("ss count:"+ss_list.length+" index:"+(player_script.ss_index-1));
						
						if(player_script.mp >= ss_list[player_script.ss_index-1].mp_need){
				    		//undying_rage();
				    		var ss_name : String ;
				    		if(player_script.ss_type != "intensive"){
				    			action = 3 ;
				    			ss_name = "range_"+player_script.ss;
				    		}else {
				    			ss_name = player_script.ss;
				    			player_script.mp -= ss_list[player_script.ss_index-1].mp_need;

				    		}
			    			StartCoroutine(ss_name);
			    		} else {
			    			warning_msg.text = "Not enough mp!";
			    			fade_in_warning();
			    			break;
			    		}
			    	}
		    	}
			}
			
			if( GUI.Button( new Rect( 0, 200, z_pos, 50 ), "Cancel" ) ) {
	    		cancel_player();
	    	}
			break;
		case "no_player":
			if( GUI.Button( new Rect( 0, Screen.height-100, z_pos, 50 ), "End Turn" ) ) {
	    		check_end_turn_clear();
		    }
		    if( GUI.Button( new Rect( 0, Screen.height-50, z_pos, 50 ), "Setting" ) ) {
		    	menu_state = "finished";
		    }
			break;
		case  "end_turn_not_clear":
			GUI.Label(new Rect( 0, 0, z_pos, 100 ),"There has monsters not yet attack");
			if( GUI.Button( new Rect( 0, Screen.height-100, z_pos, 50 ), "Continue" ) ) {
	    		end_turn();
		    }
		    if( GUI.Button( new Rect( 0, Screen.height-50, z_pos, 50 ), "Cancel" ) ) {
		    	menu_state = "no_player";
		    }
			break;
		case "finished":
		
		    if( GUI.Button( new Rect( 0, Screen.height-50, z_pos, 50 ), "Back to Menu" ) ) {
		    	Application.LoadLevel("Menu");
		    }
			break;
		case "moving":
			break;
		default : 
			print("error: "+menu_state);
			break;
	}
}

var moving : boolean = false;

function Update () {

	if(warning.active){
		fade_out_warning();
	} else {
		mouseEvent();
		if(menu_state !="finished")
			check_victory();
		if (moving){
			move_animation(clickedPosition);  
		} 
	}
} 

function fade_out_warning(){
	if (Input.GetMouseButtonDown(0)){
		if(warning_btn_close.GetScreenRect().Contains(Input.mousePosition)){
			var temp_pos : Vector3 = warning.transform.position;
			temp_pos.x = 1.5;
			yield General.MoveObject(warning.transform, warning.transform.position,temp_pos, 0.2);
			warning.SetActive(false);
		}
	}
}

function fade_in_warning(){
	if(!warning.active){
		var temp_pos : Vector3 = warning.transform.position;
		temp_pos.x = 0.5;
		yield General.MoveObject(warning.transform, warning.transform.position,temp_pos, 0.2);
		warning.SetActive(true);
	}
}

function ai_system(index : int){ 
	print("AI "+index+" turn.");
	var temp_obj : GameObject = enemy_monster_gameObj_box[index];
	var enemy_monster_script : Player = temp_obj.GetComponent(Player);
	//var enemy_monster_hp : HPBar = temp_obj.GetComponent(HPBar);
	if(enemy_monster_script.dead) {
		check_next_ai();
		return; 
	}
	var closest_enemy : GameObject ; 
	var closest_pos_diff : int = 20;  
	
	player = temp_obj.transform;
	player_script = player.GetComponent(Player);
	
	// check pos_diff 
	// hit the cloest enemy
	for (var i = 0 ;i< monster_gameObj_box.length;i++){ 
		var temp_monster_script : Player = monster_gameObj_box[i].GetComponent(Player);
		if (temp_monster_script.dead) 
			continue;
		var temp_pos_diff : int = pos_diff(monster_gameObj_box[i].transform.position,temp_obj.transform.position) ;
		if(temp_pos_diff < closest_pos_diff){
			closest_pos_diff = temp_pos_diff;
			closest_enemy = monster_gameObj_box [i] ; 
			print("Closest enemy is "+i);
		}
	}
	
	var target_pos : Vector3 = closest_enemy.transform.position;
	var attacker_pos :Vector3 = player.position;
	// first check any enemy in attack range , if so , 	attack directly
	// no then move towards the enemy . Attack if availble
	
	player_attacked = closest_enemy.transform;
	player_attacked_script = player_attacked.GetComponent(Player);
	//player_attacked_hp = player_attacked.GetComponent(HPBar);
	
	if (closest_pos_diff <= enemy_monster_script.range){
		print("AI :"+player_script.mon_name+" attack "+player_attacked_script.mon_name);
		if (!enemy_monster_script.attacked){
			attack();
			return;
		}
	} else { // cant attack directly
		var temp_arrayList : ArrayList = show_range(player_script.spd,true,3);
		var closest_pos : Vector3 ;
		var diff : int = 20;
		// find the closet pos
		for (var temp_vector3 : Vector3 in temp_arrayList){
			var temp_diff : int = pos_diff(temp_vector3,target_pos);
			if (temp_diff <= diff){
				diff = temp_diff;
				closest_pos = temp_vector3;
			}
		}
		print("closest_pos :"+closest_pos);
		print("ori diff :"+pos_diff(attacker_pos , target_pos));
		move(closest_pos);
	}
}

var clickedObj : String;
var longpress : boolean;

function mouseEvent(){
	ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (moving)return;
    if(Physics.Raycast(ray,hit)){ // place the clicked object into hit
    	if(Input.GetMouseButtonDown(0)){
    		clickedObj = hit.collider.tag;
    		print(clickedObj);
    		startTime = 0;
    		//longpress = false;
    	}
    	if(clickedObj == "Player"){
    		//print("Clicked Player");
	     	if(Input.GetMouseButton(0)){
	     		if(!longpress){
	    			startTime += Time.deltaTime;
		    		if (startTime > 0.5){
		    			//print("longpress");
		    			var monster_menu_script : Monster_menu = monster_menu.GetComponent(Monster_menu);
		    			monster_menu_script.monster = hit.transform.gameObject;
		    			monster_menu_script.update_value(gameObject); 
		    			monster_menu_script.show_state = 1;
		    			longpress = true;
		    		}
	    		}
	     	}
     	}
    	if(Input.GetMouseButtonUp(0)){ //left click
    		clickedObj = "";
	    	switch(hit.collider.tag){
	    	case "Player":
	    		if (longpress){
	    			//print("longpress");
	    			return ;
	    		}
	    		switch(action){
	    		case 0:
	    			choose_player();
	    			break;
	    		case 2:
					player_attacked = hit.transform;
					player_attacked_script = player_attacked.GetComponent("Player") as Player;
					//player_attacked_hp = player_attacked.GetComponent("HPBar") as HPBar;
					if (player_attacked_script.hp <=0){
						return;
					}
					if (player_script.team == player_attacked_script.team){
						print("teammate");
						cancel_player();
						choose_player();
					} else {
	    				attack();
	    			}
	    			break; 
	    		case 3: 
	    			if (player_script.ss_type == "aoe"){
		    			StartCoroutine(player_script.ss);
		    		}else {
		    			player_attacked = hit.transform;
						player_attacked_script = player_attacked.GetComponent("Player") as Player;
						if (player_attacked_script.hp <=0){
							return;
						}
						if (player_script.team != player_attacked_script.team){
							player_script.mp -= ss_list[player_script.ss_index-1].mp_need;
		    				StartCoroutine(player_script.ss);
		    			}
		    		}
					break;
	    		default:
	    			break;
	    		}
	    		
		        break;
			case "cube_ground":
				print("dllm "+action);
				switch (action){
				case 1: 
					move(hit.point);
					break;
				case 3:
		    		if (player_script.ss_type == "aoe"){
						player_script.mp -= ss_list[player_script.ss_index-1].mp_need;
		    			StartCoroutine(player_script.ss);
		    		}
					break;
				default: 
					cancel_player();
					break;
				}
				break;
			case "ground":
				break;
			default:
				action = 0;
				player = null;
				menu_state = "no_player";
				break; 
	    	}
     	}
     }
}

var direction : int = 1;

function undying_rage(){
	var undying_class : Undying_rage = player.gameObject.AddComponent(Undying_rage);
}

function range_rabadon_guillotine(){
	ss_range = show_range(1,true,player_script.team);
} 

function rabadon_guillotine() { 
	if(ss_range.Contains(player_attacked.position)){
		set_ss_camera(true);
		player.animation.Play("attack");
		player.animation.PlayQueued("idle");
		player.LookAt(player_attacked);
		var damage_ratio : float = 0;
		
		if(player_script.lv<=5){
			damage_ratio = 1.4;
		} else if (player_script.lv<=10) { 
			damage_ratio = 1.5;
		} else if (player_script.lv<=15){ 
			damage_ratio = 1.6;
		} else {
			damage_ratio = 1.7;
		}
		
		player_script.attacked = true;
		player_script.moved = true;
		action = 0;
		resetTexture_ground(); 
		yield WaitForSeconds(0.5);
		Instantiate(Resources.Load("effect/dark_circle",typeof(GameObject)), player_attacked.position, player_attacked.rotation); 
		Instantiate(Resources.Load("effect/ground_fire",typeof(GameObject)), player_attacked.position, player_attacked.rotation); 
		
		var damage : float = player_script.str * damage_ratio * (100.0/parseFloat((100 + player_attacked_script.def)));
		player_attacked_script.hp -= damage;
	   
		check_target_died();
		
		var txt_damage : TextMesh = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), player_attacked.position, transform.rotation);
		txt_damage.text = "-"+Mathf.FloorToInt(damage);
		print("damage:"+damage);
		set_ss_camera(false);
	}
}

function range_transfusion(){
	ss_range = show_range(3,true,player_script.team);
}

function transfusion(){
	print("transfusion");
	if(ss_range.Contains(player_attacked.position)){
		set_ss_camera(true);
		player.animation.Play("attack");
		player.animation.PlayQueued("idle");
		player.LookAt(player_attacked);
		var damage_ratio : float = 1;
		var transfusion_ratio : float = 0;
		
		if(player_script.lv<=5){
			transfusion_ratio = 0.3;
			damage_ratio = 1.0;
		} else if (player_script.lv<=10) { 
			transfusion_ratio = 0.35;
			damage_ratio = 1.1;
		} else if (player_script.lv<=15){ 
			transfusion_ratio = 0.4;
			damage_ratio = 1.2;
		} else {
			transfusion_ratio = 0.45;
			damage_ratio = 1.3;
		}
		
		player_script.attacked = true;
		player_script.moved = true;
		action = 0;
		resetTexture_ground(); 
		yield WaitForSeconds(0.5);
		var player_attacked_pos : Vector3 = player_attacked.position;
		var purcle_circle : GameObject = Instantiate(Resources.Load("effect/purple_circle",typeof(GameObject)), 
		Vector3(player_attacked_pos.x,1,player_attacked_pos.z), player_attacked.rotation); 		
		yield WaitForSeconds(0.5);
		
		var damage : float = player_script.str * damage_ratio * (100.0/parseFloat((100 + player_attacked_script.def)));
		player_attacked_script.hp -= damage;
		var txt_damage : TextMesh = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), player_attacked.position, transform.rotation);
		txt_damage.text = "-"+Mathf.FloorToInt(damage);
		
		check_target_died();
		var player_pos : Vector3 = player.transform.position;
		yield General.MoveObject(purcle_circle.transform,purcle_circle.transform.position,
		Vector3(player_pos.x,1,player_pos.z),2);
		//yield WaitForSeconds(0.5);
		Instantiate(Resources.Load("effect/red_cross",typeof(GameObject)), player.transform.position, Quaternion.Euler(0,0,0)); 
		Destroy(purcle_circle);
		var heal : float = damage * transfusion_ratio;
		player_script.hp += heal;
		if (player_script.hp > player_script.hp_max){
			player_script.hp = player_script.hp_max;
		}
		txt_damage = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), player.transform.position, transform.rotation);
		txt_damage.text = "+"+Mathf.FloorToInt(heal);
		set_ss_camera(false);
		/**/
	}
}

function range_heal_cc(){
	var team : int = (player_script.team == 1)? 2: 1; 
	var range : int = 0;
	if(player_script.lv<=5){
		range = 1;
	} else if (player_script.lv<=10) { 
		range = 2;
	} else if (player_script.lv<=15){ 
		range = 3;
	} else {
		range = 4;
	}
	ss_range = show_range(range,true,team);
}

function heal_cc(){
	var team:int = player_script.team;
	var a : int = 0 ;
	var b : int = 0;
	var temp_vector3 : Vector3;
	var temp_obj : GameObject;
	var current_pos : Vector3 = player.transform.position ; 
 	player_script.attacked = true;
	player_script.moved = true;
	action = 0;
	resetTexture_ground(); 
	set_ss_camera(true);
 
	player.animation.Play("attack");
	player.animation.PlayQueued("idle");
	
	for(a = 0 ; a < monster_gameObj_box.length ; a++){
		if (team == 2){
			temp_obj = enemy_monster_gameObj_box[a];
		} else {
			temp_obj = monster_gameObj_box[a];
		}
		temp_vector3 = temp_obj.transform.position ; 
		for (b = 0 ; b < ss_range.Count ; b++){
			var ss_vector3 :Vector3 = ss_range[b];
			
			print("temp: "+temp_vector3+" ss: "+ss_vector3);
			
			if (temp_vector3 == ss_vector3){
				player_attacked_script = temp_obj.GetComponent(Player);
				var damage : float = player_script.hp_max * 0.3;
				player_attacked_script.hp += damage;
				if(player_attacked_script.hp>player_attacked_script.hp_max){
					player_attacked_script.hp = player_attacked_script.hp_max;
				}
			   
				check_target_died();
				print(player_attacked_script.mon_name+" is s.sed");
				Instantiate(Resources.Load("effect/red_cross",typeof(GameObject)), temp_vector3, Quaternion.Euler(0,0,0)); 
		
				var txt_damage : TextMesh = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), temp_vector3,Quaternion.Euler(72,0,0));
				txt_damage.text = "+"+Mathf.FloorToInt(damage);
			}
		}
	}
	yield WaitForSeconds(0.5);
	set_ss_camera(false);
}

function range_power_shot(){
    resetTexture_ground();  
	var temp_arrayList = new ArrayList();
	var pos : Vector3 = player.position;
//	print("ss pos:"+pos);  
	var range: int = 0;
	if(player_script.lv<=5){
		range = 3;
	} else if (player_script.lv<=10) { 
		range = 5;
	} else if (player_script.lv<=15){ 
		range = 7;
	} else {
		range = 9;
	}
	
	for(var a : int = 0; a< range;a++){
		switch(direction){
		case 1:
			pos = pos + Vector3(0,0,1);
			break;
		case 2:
			pos = pos + Vector3(1,0,0);
			break;
		case 3:
			pos = pos + Vector3(0,0,-1);
			break;
		case 4:
			pos = pos + Vector3(-1,0,0);
			break;
		}
		if(!(pos.x >=0 && pos.x < 10 && pos.z >= 0 && pos.z <10)){
			break;
		}
		cube_ground[pos.x,pos.z].GetComponent(Animation).enabled = true; 
		temp_arrayList.Add(Vector3(pos.x,0,pos.z));
		
	}
	direction = (direction >= 4)? 1 : direction+1;
	
	ss_range = temp_arrayList;
}
 
function power_shot(){
	
	set_ss_camera(true);
	var team:int = player_script.team;
	var a : int = 0 ;
	var b : int = 0;
	var temp_vector3 : Vector3;
	var temp_obj : GameObject;
	var current_pos : Vector3 = player.transform.position ; 
	var new_pos : Vector3 = Vector3 (current_pos.x, 1 ,current_pos.z);
	var shoot_direction : Quaternion = Quaternion.Euler(0,(direction-1)* 90,0);
	var shoot_obj : GameObject = Instantiate(Resources.Load("effect/rocket_fire",typeof(GameObject)),new_pos,shoot_direction);
	
	player.rotation = Quaternion.Euler(0,(direction-2)* 90,0);;
	player_script.attacked = true;
	player_script.moved = true;
	action = 0;
	resetTexture_ground(); 
	player.animation.Play("attack");
	player.animation.PlayQueued("idle");
	yield WaitForSeconds(0.5);
	yield General.MoveObject(shoot_obj.transform, new_pos, ss_range[ss_range.Count-1], 0.5);
	Destroy(shoot_obj);
	
	for(a = 0 ; a < monster_gameObj_box.length ; a++){
		if (team == 1){
			temp_obj = enemy_monster_gameObj_box[a];
		} else {
			temp_obj = monster_gameObj_box[a];
		}
		temp_vector3 = temp_obj.transform.position ; 
		for (b = 0 ; b < ss_range.Count ; b++){
			var ss_vector3 :Vector3 = ss_range[b];
			if (temp_vector3 == ss_vector3){
				player_attacked_script = temp_obj.GetComponent(Player);
				if(player_attacked_script.dead) continue;
				var damage : float = player_script.str * 1.1 * (100.0/parseFloat((100 + player_attacked_script.def)));
				player_attacked_script.hp -= damage;
			   
				check_target_died();
				print(player_attacked_script.mon_name+" is s.sed");
				Instantiate(Resources.Load("explosion_attack",typeof(GameObject)), temp_vector3, Quaternion.Euler(0,0,0)); 
		
				var txt_damage : TextMesh = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), temp_vector3,Quaternion.Euler(72,0,0));
				txt_damage.text = "-"+Mathf.FloorToInt(damage);
			}
		}
	}
	set_ss_camera(false);
}

function attack(){
	
	var diff : int = pos_diff(player.position,player_attacked.position);
	print("diff :"+diff);
	if (diff <= player_script.range){
		
		// damage formula
		player.LookAt(player_attacked);
		player.animation.Play("attack");
		player.animation.PlayQueued("idle");
		var damage : float = player_script.str * (100.0/parseFloat((100 + player_attacked_script.def)));
		player_attacked_script.hp -= damage;
	   
		check_target_died();
		
		player_script.attacked = true;
		player_script.moved = true;
		action = 0;
		resetTexture_ground(); 
		yield WaitForSeconds(0.5);
		Instantiate(Resources.Load("explosion_attack",typeof(GameObject)), player_attacked.position, player_attacked.rotation); 
		
		var txt_damage : TextMesh = Instantiate(Resources.Load("txt_hp",typeof(TextMesh)), player_attacked.position, transform.rotation);
		txt_damage.text = "-"+Mathf.FloorToInt(damage);
		print("damage:"+damage);
		playsound(0);
		
	} else {
		print("Too far. "+player_script.mon_name+" cannot attack");
	}
	check_next_ai();
} 

function check_target_died(){
	if (player_attacked_script.hp <= 0){
		player_attacked_script.hp = 0; 
		
		var temp_exp : int = (player_attacked_script.hp_max/10 + player_attacked_script.str+player_attacked_script.def);
		var exp : int = temp_exp * Mathf.Pow(GameProperty.lv_up_factor,player_attacked_script.lv);
		print("exp:"+exp +" current exp "+GameProperty.current_exp);				
		GameProperty.current_exp += exp;
		GameProperty.current_money += exp/10;	
	}
}

var clickedPosition : Vector3 ; 

function move(target_pos : Vector3){
	clickedPosition = target_pos;
	clickedPosition.x = Mathf.Ceil(clickedPosition.x-0.5);
	clickedPosition.y = 0;
	clickedPosition.z = Mathf.Ceil(clickedPosition.z-0.5); 
	var diff : int = pos_diff(player.position,clickedPosition);
	print("diff :"+diff);
	print("player_script.spd :"+player_script.spd);
	if (diff <= player_script.spd){
		moving = true;
		menu_state =  "moving";
		player_script.pre_pos = player.transform.position;
	} else {
		// too far to move, cancel the movement
		return;
	}
}

function check_next_ai(){
	if (ai && GameProperty.current_team == 2){
		yield WaitForSeconds(.5f);
		switch(current_ai_index){
			case 0 :
			case 1 :current_ai_index ++;
				ai_system(current_ai_index);
				break;
			case 2 :end_turn();
				break;
		}
	}
}
	

function move_animation(target_pos : Vector3){  
	var x : float = player.transform.position.x;
	var z : float = player.transform.position.z;
	var time_ratio : float = 6;  
	//print("diff x"+(x - target_pos.x) +"time :"+Time.deltaTime *time_ratio); 
	//print("x :"+x+" target x:"+ target_pos.x+"time :"+Time.deltaTime *time_ratio); 
	player.gameObject.animation.Play("walk");
	var time : float = Time.fixedDeltaTime *time_ratio;	
	var offset : float = 0.1;
	if (x - target_pos.x > offset){
		x-= time;
		player.transform.position.x = x;  
		player.transform.rotation = Quaternion.Euler(0, 270, 0);
		return;
	} else if (x - target_pos.x < -offset){
		x+= time;
		player.transform.position.x = x;  
		player.transform.rotation = Quaternion.Euler(0, 90, 0);
		return;
	} 
	
	if (z - target_pos.z > offset){
		z-= time;
		player.transform.position.z = z;  
		player.transform.rotation = Quaternion.Euler(0, 180, 0);
		return;
	} else if (z - target_pos.z < -offset){
		z+= time;
		player.transform.position.z = z;  
		player.transform.rotation = Quaternion.Euler(0, 0, 0);
		return;
	} 
	
	moving = false; 
	var ori_pos : Vector3 = player_script.pre_pos;
	cube_ground_property[ori_pos.x,ori_pos.z].used = false;
	cube_ground_property[clickedPosition.x,clickedPosition.z].used = true;
	player.transform.position = clickedPosition;
	
	player_script.moved = true; 
	menu_state = "choose_player";
	action = 0;
	player.gameObject.animation.Play("idle");
	resetTexture_ground();
	if (ai && GameProperty.current_team == 2){ // enemy team
		if (!player_script.attacked){
			attack();
		}
	}
} 


function pos_diff(a:Vector3 , b:Vector3) : float{
	return Mathf.Abs(a.x-b.x) + 
			   Mathf.Abs(a.z - b.z);
}

function choose_player(){
	// chose a player 

    var temp_player = hit.transform;
    var temp_player_script : Player = temp_player.GetComponent("Player") as Player;
    //print("team :"+temp_player_script.team);
    if(temp_player_script.team == GameProperty.current_team){
    	menu_state = "choose_player";
    	player = temp_player;
    	player_script = temp_player_script;
//    	hit.collider.renderer.material.color = Color.yellow;
    } else {
    	menu_state = "no_player";
    	player = null;
    	player_script = null;
    }
}

function cancel_player(){
	print("cancel player");
	action = 0;
	player = null;
	menu_state = "no_player";
	resetTexture_ground();
}

// check turn end with/without attack
function check_end_turn_clear(){ 
	
	for(var temp_player : GameObject in GameObject.FindGameObjectsWithTag("Player"))
	{
		var temp_player_script : Player = temp_player.GetComponent("Player") as Player;
		var temp_player_hp : HPBar = temp_player.GetComponent("HPBar") as HPBar;
		
	    if(temp_player_script.team == GameProperty.current_team && temp_player_hp.hp != 0)
	    {
	    	if (!temp_player_script.attacked){
	    		menu_state = "end_turn_not_clear";
	    		return;
	    	}
	   }
	}
	end_turn();
}

function end_turn(){
	for(var temp_player : GameObject in GameObject.FindGameObjectsWithTag("Player"))
	{
		var temp_player_script : Player = temp_player.GetComponent("Player") as Player;
	    temp_player_script.moved = false;
	    temp_player_script.attacked = false;
	//    temp_player.renderer.material.color = Color.white;
	}
	if (GameProperty.current_team == 2 ){
		GameProperty.current_team = 1;
		GameProperty.round++;
	} else {
		GameProperty.current_team = 2;
		ai_turn();
	}
	menu_state = "no_player";
}

function ai_turn(){
	current_ai_index = 0;
	ai_system(current_ai_index);
}

function show_range(range : int , return_need : boolean ,team : int){ // team : skipped team
	resetTexture_ground();  
	var temp_arrayList = new ArrayList();
	var player_pos_arrayList = new ArrayList(); 
	var temp_obj : GameObject;
	
	switch(team){
	case 1:
		for (temp_obj in monster_gameObj_box){
			player_pos_arrayList.Add(temp_obj.transform.position);
		}
		break; 
	case 2: 
		for (temp_obj in enemy_monster_gameObj_box){
			player_pos_arrayList.Add(temp_obj.transform.position);
		} 
		break; 
	case 3: 
	 	for (temp_obj in monster_gameObj_box){
			player_pos_arrayList.Add(temp_obj.transform.position);
		} 
		for (temp_obj in enemy_monster_gameObj_box){
			player_pos_arrayList.Add(temp_obj.transform.position);
		}
		break;
	}
	for (var y = 0; y < 10; y++) { 
		for (var x = 0;x < 10; x++) { 
			if (pos_diff(player.position,Vector3(x,0,y)) <= range){
				// skip the used block
				if (player_pos_arrayList.Contains(Vector3(x,0,y))){
					continue;
				}
				cube_ground[x,y].GetComponent(Animation).enabled = true; 
				var temp_vector3 : Vector3 = Vector3(x,0,y);
				temp_arrayList.Add(temp_vector3);
			}
		} 
	}  
	if (return_need){
		return temp_arrayList;
	}
}


function resetTexture_ground(){
	for (var y = 0; y < gridY; y++) { 
		for (var x = 0;x < gridX; x++) { 
			cube_ground[x,y].GetComponent(Animation).enabled = false;
			cube_ground[x,y].renderer.material.color = Color.white;
			cube_ground_property[x,y].used = false;
		} 
	} 
	
    for (var temp_monster_obj : GameObject in monster_gameObj_box){
		var temp_pos : Vector3 = temp_monster_obj.transform.position;
//		print(temp_pos);
		cube_ground_property[temp_pos.x,temp_pos.z].used = true;
    }
    
    for (temp_monster_obj in enemy_monster_gameObj_box){
    	temp_pos = temp_monster_obj.transform.position;
//    	print(temp_pos);
    	cube_ground_property[temp_pos.x,temp_pos.z].used = true;
    }
    
}

function check_victory(){
	var victory_pos : Vector3;
	if (team1_life == 0 || team2_life == 0){
		//defeat
		if (team1_life == 0){
			victory_logo.guiTexture.texture = General.getTexture("defeat",false);
		}
		victory_pos = victory_board.transform.position;
		victory_pos.y = -0.2;
		victory_board.transform.position = victory_pos;
		menu_state = "finished";
		print("This game gains "+GameProperty.current_exp+" exp");
		print("This game gains "+GameProperty.current_money+" money");
		for(var temp_player : Player in monster_box){
			temp_player.exp += GameProperty.current_exp;
			temp_player.exp = (temp_player.exp > 18360)? 18360 : temp_player.exp; // max exp{
			
			print(temp_player.mon_name+" becomed "+temp_player.exp+" exp.");
			//var temp: String = "Update monster_box SET exp ="+temp_player.exp+" WHERE monster_name = '"+temp_player.mon_name;
			
			//print(temp);
			//db.BasicQuery(temp);
			print("Update monster_box set exp = "+temp_player.exp+" where own_index = "+temp_player.own_index);
        
			
			db.Update_monster(temp_player.own_index,"exp",temp_player.exp+"");
			var new_stage : int = (stage >=3) ? 3 : stage +1;
			var new_money : int = money + GameProperty.current_money;
			db.BasicQuery("Update general_table set value = '"+new_stage+"' where data = 'stage'");
			db.BasicQuery("Update general_table set value = '"+new_money+"' where data = 'money'");
				
		}
	}
}

function set_ss_camera(active : boolean){
	if (active){
		var pos = player.position;
		ss_camera.transform.position = Vector3(pos.x+2,2.5,pos.z+1.5);
		ss_camera.transform.LookAt(Vector3(pos.x,pos.y+1,pos.z));
		main_camera.depth = -1;
	} else {
		main_camera.depth = 1;
	}
}

function undo_movement(){
	player.transform.position = player_script.pre_pos;
	player_script.moved = false;
	action = 0;
	resetTexture_ground();
}

function OnApplicationQuit()
{
    db.CloseDB();
	print("close database");
}