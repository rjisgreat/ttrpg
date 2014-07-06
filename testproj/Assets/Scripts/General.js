#pragma strict


static function getTexture(fileName : String,monster : boolean){
	
	var filePath : String;
	
	if (monster){
		//filePath = Application.dataPath + "/Resources/monster_image/"+fileName+".png";
		return Resources.Load("monster_image/"+fileName) as Texture2D;
		//return Instantiate(Resources.Load("monster_image/"+fileName) as Texture2D);
		
	} else {
		//filePath = Application.dataPath + "/Texture/"+fileName+".png";
		//return Instantiate(Resources.Load("Texture/"+fileName) as Texture2D);
		return Resources.Load("Texture/"+fileName) as Texture2D;
		
	}
    
	
	var tex = new Texture2D(1, 1);
	
	if (System.IO.File.Exists(filePath))
	{
	    var bytes = System.IO.File.ReadAllBytes(filePath);
	    tex.LoadImage(bytes);
	}
	return tex; 
}

static function getModel(model_name : String){
	
	var loadedObject : GameObject = Instantiate(Resources.Load("model/"+model_name));
	return loadedObject;
}

static function MoveObject (thisTransform : Transform, startPos : Vector3, endPos : Vector3, time : float) {
    var i = 0.0;
    var rate = 1.0/time;
    while (i < 1.0) {
        i += Time.fixedDeltaTime * rate;
        thisTransform.position = Vector3.Lerp(startPos, endPos, i);
        yield; 
    }
}

static function ScaleObject (thisTransform : Transform, targetScale : float, time : float) {
    var i = 0.0;
    var rate = 1.0/time;
    var current_scale : Vector3 = thisTransform.localScale;
    var target_scale : Vector3 = Vector3 (current_scale.x*targetScale,current_scale.y*targetScale,current_scale.z*targetScale);
    while (i < 1.0) {
        i += Time.fixedDeltaTime * rate;
        thisTransform.localScale = Vector3.Lerp(current_scale, target_scale, i);
        yield; 
    }
}


static function ScaleObject (thisTransform : Transform, targetScale : Vector3, time : float) {
    var i = 0.0;
    var rate = 1.0/time;
    var current_scale : Vector3 = thisTransform.localScale;
    while (i < 1.0) {
        i += Time.fixedDeltaTime * rate;
        thisTransform.localScale = Vector3.Lerp(current_scale, targetScale, i);
        yield; 
    }
}

static function get_black_texture(){
	GameProperty.blackScreen = General.getTexture("black",false);
}
