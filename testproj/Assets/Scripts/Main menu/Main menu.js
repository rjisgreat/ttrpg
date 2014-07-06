#pragma strict


// fade gui
private var fadeTime : float = 1; // how long you want it to fade?
private var fadeIn : boolean = true; // "true" for fade in, and "false" for fade out
private var color : Color = Color.black; 
private var timer : float = 0;
private var screen_fadeing : boolean = false;

var background_music : AudioClip ;

var icon_bg : GUITexture;

function Start(){
	General.get_black_texture();
	FadeIn();
}

function Update(){
	
    if(Input.GetMouseButtonDown(0)){
    	if(!screen_fadeing && icon_bg.active){
		    if(icon_bg.GetScreenRect().Contains(Input.mousePosition)){
		    	click_icon_bg();
		    }
	    }
    }
	
	timer -= Time.deltaTime;
    if (timer <= 0)
    {
        timer = 0;
        screen_fadeing = false;
    }
}

function click_icon_bg(){

	FadeOut();
	yield WaitForSeconds(fadeTime);
	icon_bg.gameObject.SetActive(false);
	screen_fadeing = false;	
	FadeIn();
	yield WaitForSeconds(fadeTime);
	screen_fadeing = false;	
}

function OnMouseDown()
{
    // if we clicked the play button
    if(!icon_bg.active){
	    if (this.name == "txt_startGame")
	    {
	        // load the game
	        if(!screen_fadeing){
		        FadeOut();
		        yield WaitForSeconds(fadeTime);
    			screen_fadeing = false;	
		        Application.LoadLevel("Menu");
	        }
	    } else {
	    	print("=.=");
	    }
    }
}

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