#pragma strict

var txt_money : GUIText;
var btn_card : GUITexture; 
var btn_mon_box_enlargement : GUITexture; 
var btn_bk_menu : GUITexture;

private var db : dbAccess;
private var money : int ;
//warning 
var warning : GameObject;
var btn_close_warning : GUITexture;
var txt_warning_message : GUIText;
private var purchased : boolean = false;

var target: GameObject;
var playing_anim : String;
var btn_attack : GUITexture;
var btn_confirm : GUITexture;

var emtpy_target : GameObject;
var shop_bg : GameObject;

var spotlight_a: GameObject;
var spotlight_b: GameObject;

private var shop_fadeing : boolean = false;
private var pointA : Vector3;
private var pointB : Vector3;

// fade gui
private var fadeTime : float = 1; // how long you want it to fade?
private var fadeIn : boolean = true; // "true" for fade in, and "false" for fade out
private var color : Color = Color.black; 
private var timer : float = 0;
private var screen_fadeing : boolean = false;

//mon_menu  
var mon_menu : GameObject; 
var btn_menu_close : GUITexture;
var mon_icon : GUITexture;
var txt_lv : GUIText;
var txt_name : GUIText;
var txt_hp : GUIText;
var txt_mp : GUIText;
var txt_str : GUIText;
var txt_def : GUIText;
var txt_spd : GUIText;
var txt_range : GUIText;
var txt_type : GUIText;

private var mon_index : int;

// fade gui function 
function FadeIn()
{
    timer = fadeTime;
    fadeIn = true;
}

function FadeOut()
{
    timer = fadeTime;
    fadeIn = false;
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

function Awake () {
	db = new dbAccess();
    db.OpenDB("monster_war.db");
    if(!GameProperty.blackScreen){
		General.get_black_texture();
    }
}

function Start(){
	pointA = shop_bg.transform.position;
	pointB = pointA;
	pointB.x = -0.5;

	var sql_result : ArrayList = db.BasicQuery("Select value from general_table where data = 'money'");
    var money_array : ArrayList= sql_result[0] as ArrayList;
    money = int.Parse(money_array[0]+"");
    txt_money.text = "$ "+money;	
    target = GameObject.FindGameObjectWithTag("Player");
	FadeIn();   
	print("index:"+GameProperty.mon_index);
	mon_index = GameProperty.mon_index;
    get_mon_index();
}

function get_mon_number(){
	// get number of monster in monster box
    var sql_result :ArrayList= db.BasicQuery("Select * from monster_box");
    print("mon size :"+sql_result.Count);
    //var monster_record :ArrayList= sql_result[0] as ArrayList;
    return sql_result.Count;
}

function Update () {	

	if (Input.GetMouseButtonDown(0)){
		if(!warning.active && !screen_fadeing){
			if(btn_card.GetScreenRect().Contains(Input.mousePosition)){
				if(money < 100){
					txt_warning_message.text = "You have not enough money\n to buy this item!";
					warning.SetActive(true);
				} else {
					if (get_mon_number() >= GameProperty.mon_box_size){
						txt_warning_message.text = "Monster box is not enough\n size!";
						warning.SetActive(true);
					} else {
						txt_warning_message.text = "Transaction Completed.";
						money -= 100;
						db.BasicQuery("Update general_table set value = '"+money+"' where data = 'money'");
						warning.SetActive(true);
	    				txt_money.text = "$ "+money;
	    				purchased = true;
    				}
				}
		    } 
		    
		    if (btn_mon_box_enlargement.GetScreenRect().Contains(Input.mousePosition)){
		    	if(money < 50){
		    		txt_warning_message.text = "You have not enough money\n to buy this item!";
					warning.SetActive(true);
				} else {
					txt_warning_message.text = "Monster box size :"+GameProperty.mon_box_size;
					money -= 50;
					db.BasicQuery("Update general_table set value = '"+money+"' where data = 'money'");
    				txt_money.text = "$ "+money;
    				GameProperty.mon_box_size = GameProperty.mon_box_size +1;
    				print("GameProperty.mon_box_size :"+ GameProperty.mon_box_size);
    				db.BasicQuery("Update general_table set value = '"+GameProperty.mon_box_size+"' where data = 'mon_box_size'");
					warning.SetActive(true);
					
				}
		    }
		    
		    if(btn_bk_menu.GetScreenRect().Contains(Input.mousePosition)){
	    		bk_menu();
		    }
		    
	    } else {
	    	if(!screen_fadeing){
			    if (btn_close_warning.GetScreenRect().Contains(Input.mousePosition)){
			    	warning.SetActive(false);
			    	if (purchased){
			    		purchase(); 
			    	}
			    }
		    }
	    }
	    if (!shop_bg.active){
	    	
		    if (btn_attack.GetScreenRect().Contains(Input.mousePosition)){
		    	display_anim();
		    }
		    if (btn_confirm.GetScreenRect().Contains(Input.mousePosition)){
		    	if (!shop_fadeing){
			    	shop_bg.SetActive(true);
		    		show_shop ();
	    		}
		    } 
		    if (mon_menu.active){
			    if (btn_menu_close.GetScreenRect().Contains(Input.mousePosition)){
			    	close_property();
			    } 
		    }
	    } 
	}
	if (target){
		spinning_cam();
	}
	
	timer -= Time.deltaTime;
    if (timer <= 0)
    {
        timer = 0;
    }
}

function purchase(){
	spotlight_a.SetActive(false);
	spotlight_b.SetActive(false);
	btn_attack.gameObject.SetActive(false);
	btn_confirm.gameObject.SetActive(false);
	FadeOut();
	screen_fadeing = true;
    yield WaitForSeconds(fadeTime);  
    mon_menu.SetActive(true);
	fade_shop ();
	shop_bg.SetActive(false);
	FadeIn();
	purchased = false; 
	draw_mon();
}

function close_property(){   
	FadeOut(); 
    yield WaitForSeconds(fadeTime);    
	FadeIn();     
    mon_menu.SetActive(false);
    yield WaitForSeconds(fadeTime); 
	spotlight_a.SetActive(true);
    yield WaitForSeconds(0.5); 
	spotlight_b.SetActive(true);
	btn_attack.gameObject.SetActive(true);
	btn_confirm.gameObject.SetActive(true);
	Instantiate(Resources.Load("explosion"),Vector3(0,1,0),Quaternion.Euler(0, 0, 0));
	screen_fadeing = false;
	
}

function display_anim(){
	target.animation.Play("attack");
	target.animation.PlayQueued("walk");
}

function draw_mon(){
	var sql_result : ArrayList = db.BasicQuery("Select * from monster_list");
	
	var ran_index : int = 0;
	//ran_index = Random.Range(0,sql_result.Count-1);
	ran_index = Random.Range(0,5);
	print("random :"+ran_index);
	
	/*switch(ran_index){
	case 0 : ran_index = 0;
		break;
	case 1 : ran_index = 1;
		break;
	case 2 : ran_index = 5;
		break;
	case 3 : ran_index = 7;
		break;
	case 4 : ran_index = 8;
		break;
	}*/
	
	var name : String = "";
	var index : String = "";
	var monster_record : ArrayList = sql_result[ran_index] as ArrayList; 
	 
	for (var s : int = 0 ; s < monster_record.Count ; s++){
    	var temp = monster_record[s]; 
		print("temp :"+s+" "+temp);
    	switch(s){
    	case 0: 
    		//new_player_script.lv = 1; 
    		index = ""+temp; 
    		break;
		case 1:
			print(temp+" is drawed"); 
			//new_player_script.mon_name = ""+temp; 
			name = ""+temp;
			txt_name.text = ""+temp;
			mon_icon.texture = General.getTexture(""+temp,true);
			var temp_pos : Vector3 = Vector3(0,0,0);
			var rotation : Quaternion = Quaternion.Euler(0, 0, 0);
			target = Instantiate(Resources.Load("model/"+temp),temp_pos,rotation) as GameObject;
			target.tag = "Player";
			target.transform.localScale.x = 3;
			target.transform.localScale.y = 3;
			target.transform.localScale.z = 3;
			target.animation.Play("walk");
		 	break; 
		case 2:   
    		//new_player_script.hp = int.Parse(""+temp);
			var hp: int = int.Parse(""+temp);
			txt_hp.text = hp+"/"+hp;
			break;
		case 3: 
    		//new_player_script.mp = int.Parse(""+temp);
			txt_mp.text = temp+"/"+temp;
			break;
		case 4: 
    		//new_player_script.str = int.Parse(""+temp);
			txt_str.text = ""+temp;
			break;
		case 5:
			txt_def.text = ""+temp;
			break;
		case 6:
			txt_spd.text = ""+temp;
			break;
		case 7:
			txt_range.text = ""+temp;
			break;
		case 8:
			//monster_box[i].exp = int.Parse(""+temp);
			break;
		case 9:
			txt_type.text = ""+temp;
			break;
		}
	} 
	txt_lv.text = "Lv 1";  
	GameProperty.mon_index ++;
	  
	print("Update general_table set value = '"+GameProperty.mon_index+"' where data = 'mon_index'");
	print("Insert into monster_box values (1,'"+name+"',0,0,"+GameProperty.mon_index+","+index+")");
	db.BasicQuery("Update general_table set value = '"+GameProperty.mon_index+"' where data = 'mon_index'");
	db.BasicQuery("Insert into monster_box values (1,'"+name+"',0,0,"+GameProperty.mon_index+","+index+")");
	
	//print(new_player_script.ToString()); 
}

function fade_shop () {
	shop_fadeing = true;
	print("fade in");
    yield General.MoveObject(shop_bg.transform, pointA, pointB, 1.0);
	shop_fadeing = false;
	print("fade out");
}

function show_shop () {
	shop_fadeing = true;
    yield General.MoveObject(shop_bg.transform, pointB, pointA, 1.0);
	shop_fadeing = false;
	if (target){
		Destroy(target);
		target = null;
	}
}

function MoveObject (thisTransform : Transform, startPos : Vector3, endPos : Vector3, time : float) {
    var i = 0.0;
    var rate = 1.0/time;
    while (i < 1.0) {
        i += Time.fixedDeltaTime * rate;
        thisTransform.position = Vector3.Lerp(startPos, endPos, i);
        yield; 
    }
}


function OnApplicationQuit()
{
    db.CloseDB(); 
	print("close database"); 
	print("End Menu");
}

function spinning_cam(){
	transform.LookAt(emtpy_target.transform);
    transform.Translate(Vector3.right * Time.deltaTime * 5);
}
 
function bk_menu(){
	FadeOut();
	yield WaitForSeconds(fadeTime); 
	Application.LoadLevel("Menu");
}

function get_mon_index(){
	// get mon_index
    var sql_result :ArrayList= db.BasicQuery("Select value from general_table where data = 'mon_index'");
    var monster_record :ArrayList= sql_result[0] as ArrayList;
    GameProperty.mon_index = int.Parse(monster_record[0]+"");
    print("GameProperty.mon_index:"+GameProperty.mon_index);
}