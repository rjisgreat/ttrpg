#pragma strict

var speed :int = 4;
private var swipe_speed : int = 5;
private var selectedCamera : Camera;
var MINSCALE : float = 2.0F;
var MAXSCALE : float= 5.0F;
var minPinchSpeed : float= 10.0F;
var varianceInDistances : float = 5.0F;
private var touchDelta : float= 0.0F;
private var prevDist : Vector2 = new Vector2(0,0);
private var curDist : Vector2= new Vector2(0,0);
private var speedTouch0 : float= 0.0F;
private var speedTouch1 : float= 0.0F;

// Use this for initialization
function Start () 
{
	print("CameraZoomPinch");
	selectedCamera = Camera.main;
}

// Update is called once per frame
function Update () 
{
	// pinch
	if (Input.touchCount == 2 && Input.GetTouch(0).phase == TouchPhase.Moved && Input.GetTouch(1).phase == TouchPhase.Moved) 
	{
		curDist = Input.GetTouch(0).position - Input.GetTouch(1).position; //current distance between finger touches
		prevDist = ((Input.GetTouch(0).position - Input.GetTouch(0).deltaPosition) - (Input.GetTouch(1).position - Input.GetTouch(1).deltaPosition)); //difference in previous locations using delta positions
		touchDelta = curDist.magnitude - prevDist.magnitude;
		speedTouch0 = Input.GetTouch(0).deltaPosition.magnitude / Input.GetTouch(0).deltaTime;
	 	speedTouch1 = Input.GetTouch(1).deltaPosition.magnitude / Input.GetTouch(1).deltaTime;

	//selectedCamera.fieldOfView smaller = zoom in 
	//selectedCamera.fieldOfView larger = zoom out 
	
	 if ((touchDelta + varianceInDistances <= 1) && (speedTouch0 > minPinchSpeed) && (speedTouch1 > minPinchSpeed) && (selectedCamera.fieldOfView < 55))
	 {
		selectedCamera.fieldOfView = Mathf.Clamp(selectedCamera.fieldOfView + (1 * speed),15,90);
	 }
	 

	 if ((touchDelta +varianceInDistances > 1) && (speedTouch0 > minPinchSpeed) && (speedTouch1 > minPinchSpeed) && (selectedCamera.fieldOfView > 20))
	 {
	 	selectedCamera.fieldOfView = Mathf.Clamp(selectedCamera.fieldOfView - (1 * speed),15,90);
	 }
		print("selectedCamera :"+selectedCamera.fieldOfView);
	} 
	
	// swap
	if(Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Moved){
		var touchDeltaPosition : Vector2 = Input.GetTouch(0).deltaPosition;
		print(touchDeltaPosition);
    	transform.Translate(-touchDeltaPosition.x * swipe_speed * Time.deltaTime, -touchDeltaPosition.y * swipe_speed * Time.deltaTime, 0);
	}    
}
