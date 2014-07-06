#pragma strict

private var start_loading : boolean = false;
var progress_bar : GUITexture;
var txt_loading : GUIText;
var background : GUITexture;
private var db : dbAccess;
private var scene : String;

function Start () {
	print("Start loading screen");
	
    db = new dbAccess();
    db.OpenDB("monster_war.db");
    
    var sql_result : ArrayList = db.BasicQuery("Select value from general_table where data = 'loading_scene'");
    var temp_array : ArrayList = sql_result[0];
    scene = temp_array[0]+"";
    print("Loading scene:"+scene);
    
	yield WaitForSeconds(1);
	start_loading = true;
	db.CloseDB();
}

function Update () {
	if (start_loading){
		var random_int : int = Random.Range(0,4);
		progress_bar.pixelInset.width += random_int;
		check_complete();
	}
}

function check_complete(){
	if (progress_bar.pixelInset.width > 0){
		start_loading = false;
		Application.LoadLevelAdditive(scene);
		yield; // skip one frame
		print("Loading page :"+scene+" is loaded completed!");
		Destroy(progress_bar);
		Destroy(txt_loading);
		Destroy(background);
		Destroy(gameObject);
	}
}