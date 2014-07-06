#pragma strict

static var exp_list = new Array();
static var lv_up_ratio : Lv_up[] = new Lv_up [4];

static var db : dbAccess;
static function check_up_lv(player_script : Player , player_hp : HPBar , exp : boolean){
	
	if (db == null){
	    db = new dbAccess();
	    db.OpenDB("monster_war.db");
		print("db is null");
	}
	// update the lv according to the exp
	var new_lv : int = player_script.lv;
	Debug.Log("new_lv :"+new_lv);
	
	if (exp){
		for ( var i = 0; i < exp_list.length ; i++){
			//Debug.Log("player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
			if(player_script.exp > int.Parse(""+exp_list[i])){
				new_lv = i+2; // exp_list[0] = 280; 
				//print("new lv :"+new_lv);
			}else {
				Debug.Log("break player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
				break;
			}
		}
	}
	//var uped_lv : int = new_lv - player_script.lv;
	//if(uped_lv == 0) return ;
	
	player_script.lv = new_lv;
	
	// get the monster property of lv1
	var sql_result : ArrayList = db.BasicQuery("Select * from monster_list where name = '"+player_script.mon_name+"'") as ArrayList;
    
	var temp_player_script : Player = new Player();
	for (i = 0 ; i < sql_result.Count ; i++){
    	var monster_record : ArrayList = sql_result[i] as ArrayList;
        for (var s : int= 0 ; s < monster_record.Count ; s++){
        	var temp = monster_record[s];
        	switch(s){
    		case 0:
    			temp_player_script.lv = 1;break;
    		case 1:
    			temp_player_script.mon_name = ""+temp;
    			break;
    		case 2:
    			var hp :int = int.Parse(""+temp);
    			temp_player_script.hp = hp;
    			temp_player_script.hp_max = hp;
    			temp_player_script.hp = hp;
    			temp_player_script.hp_max = hp;break;
    		case 3:
    			var mp : int= int.Parse(""+temp);
    			temp_player_script.mp = mp;
    			temp_player_script.mp_max = mp;break;
    		case 4:
    			temp_player_script.str = int.Parse(""+temp);break;
    		case 5:
    			temp_player_script.def = int.Parse(""+temp);break;
    		case 6:
    			temp_player_script.spd = int.Parse(""+temp);break;
    		case 7:
    			temp_player_script.range = int.Parse(""+temp);break;
    			
        	}
        }
    }
	
    player_script.exp_next = int.Parse(""+exp_list[player_script.lv-1]);

	// calculate the new property depends on monster's lv
	
	var uped_lv : int = new_lv - 1;
	Debug.Log("uped_lv :"+uped_lv);
		
	for (i = 0 ; i < lv_up_ratio.length ; i++){
		if(player_script.type == lv_up_ratio[i].type){
			player_script.hp = temp_player_script.hp + lv_up_ratio[i].hp * uped_lv;
			print("temp_player_script.hp :"+temp_player_script.hp);
			print("lv_up_ratio[i].hp :"+lv_up_ratio[i].hp);
			player_script.hp_max = player_script.hp;
			player_script.mp = temp_player_script.mp + lv_up_ratio[i].mp * uped_lv;
			player_script.mp_max = player_script.mp;
			player_script.str = temp_player_script.str + lv_up_ratio[i].str * uped_lv;
			player_script.def = temp_player_script.def + lv_up_ratio[i].def * uped_lv;
		}
	}
	print(player_script.ToString());
}

static function check_up_lv(player_script : Player, exp : boolean){
	
	if (db == null){
	    db = new dbAccess();
	    db.OpenDB("monster_war.db");
		print("db is null");
	}
	// update the lv according to the exp
	var new_lv : int = player_script.lv;
	Debug.Log("new_lv :"+new_lv);
	
	if (exp){
		for ( var i = 0; i < exp_list.length ; i++){
			//Debug.Log("player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
			if(player_script.exp > int.Parse(""+exp_list[i])){
				new_lv = i+2; // exp_list[0] = 280; 
				//print("new lv :"+new_lv);
			}else {
				Debug.Log("break player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
				break;
			}
		}
	}
	//var uped_lv : int = new_lv - player_script.lv;
	//if(uped_lv == 0) return ;
	
	player_script.lv = new_lv;
	
	// get the monster property of lv1
	var sql_result : ArrayList = db.BasicQuery("Select * from monster_list where name = '"+player_script.mon_name+"'") as ArrayList;
    
	var temp_player_script : Player = new Player();
	for (i = 0 ; i < sql_result.Count ; i++){
    	var monster_record : ArrayList = sql_result[i] as ArrayList;
        for (var s : int= 0 ; s < monster_record.Count ; s++){
        	var temp = monster_record[s];
        	switch(s){
    		case 0:
    			temp_player_script.lv = 1;break;
    		case 1:
    			temp_player_script.mon_name = ""+temp;
    			break;
    		case 2:
    			var hp :int = int.Parse(""+temp);
    			temp_player_script.hp = hp;
    			temp_player_script.hp_max = hp;
    			temp_player_script.hp = hp;
    			temp_player_script.hp_max = hp;break;
    		case 3:
    			var mp : int= int.Parse(""+temp);
    			temp_player_script.mp = mp;
    			temp_player_script.mp_max = mp;break;
    		case 4:
    			temp_player_script.str = int.Parse(""+temp);break;
    		case 5:
    			temp_player_script.def = int.Parse(""+temp);break;
    		case 6:
    			temp_player_script.spd = int.Parse(""+temp);break;
    		case 7:
    			temp_player_script.range = int.Parse(""+temp);break;
    			
        	}
        }
    }
	print("player_script.lv :"+player_script.lv);
    player_script.exp_next = int.Parse(""+exp_list[player_script.lv-1]);

	// calculate the new property depends on monster's lv
	
	var uped_lv : int = new_lv - 1;
	Debug.Log("uped_lv :"+uped_lv);
		
	for (i = 0 ; i < lv_up_ratio.length ; i++){
		if(player_script.type == lv_up_ratio[i].type){
			player_script.hp = temp_player_script.hp + lv_up_ratio[i].hp * uped_lv;
			print("temp_player_script.hp :"+temp_player_script.hp);
			print("lv_up_ratio[i].hp :"+lv_up_ratio[i].hp);
			player_script.hp_max = player_script.hp;
			player_script.mp = temp_player_script.mp + lv_up_ratio[i].mp * uped_lv;
			player_script.mp_max = player_script.mp;
			player_script.str = temp_player_script.str + lv_up_ratio[i].str * uped_lv;
			player_script.def = temp_player_script.def + lv_up_ratio[i].def * uped_lv;
		}
	}
	print(player_script.ToString());
}


static function check_up_lv(player_script : Player){

	var new_lv : int = 1;
	for ( var i = 0; i < exp_list.length ; i++){
		Debug.Log("player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
		if(player_script.exp > int.Parse(""+exp_list[i])){
			new_lv = i+2; // exp_list[0] = 280; 
			//print("new lv :"+new_lv);
		}else {
			//Debug.Log("break player_script.exp :"+player_script.exp+" a:"+int.Parse(""+exp_list[i]));
			break;
		}
	}
	
	var uped_lv : int = new_lv - player_script.lv;
	//if(uped_lv == 0) return ;
	
	player_script.lv = new_lv;
	if (db == null){
	    db = new dbAccess();
	    db.OpenDB("monster_war.db");
		print("db is null");
	}
	db.Update_monster(player_script.own_index,"level",new_lv+"");
	
    player_script.exp_next = int.Parse(""+exp_list[player_script.lv-1]);
	Debug.Log("uped_lv :"+uped_lv);
	for (i = 0 ; i < lv_up_ratio.length ; i++){
		if(player_script.type == lv_up_ratio[i].type){
			player_script.hp += lv_up_ratio[i].hp * uped_lv;
			player_script.hp_max = player_script.hp;
			player_script.mp += lv_up_ratio[i].mp * uped_lv;
			player_script.mp_max = player_script.mp;
			player_script.str += lv_up_ratio[i].str * uped_lv;
			player_script.def += lv_up_ratio[i].def * uped_lv;
		}
	}
}

public class Lv_up{
	var type : String ;
	var hp : float ;
	var mp : float ;
	var str : float;
	var def : float;
}