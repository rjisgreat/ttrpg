#pragma strict

var myTimer : float;

function Update(){
	if (myTimer > 0){
		myTimer -= Time.deltaTime;
	} else {
		Destroy(gameObject);
	}
	var pos = new Vector3(transform.position.x,transform.position.y+0.1,transform.position.z);
	transform.position = pos;
}
