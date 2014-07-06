#pragma strict

static var team_arraylist : ArrayList;

function Start () {
}

function Awake()
{
	team_arraylist = new ArrayList();
	DontDestroyOnLoad(gameObject);
}