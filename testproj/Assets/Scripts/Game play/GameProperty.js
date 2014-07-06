#pragma strict

static var current_exp : int;
static var current_money : int;
static var lv_up_factor : float = 1.05;
var stage : int;
static var mon_index : int ;
static var blackScreen : Texture2D; // add a black texture here
static var round : int;
static var current_team : int;
static var ss_list : SS_table[];
static var mon_box_size : int;

static function reset(){
	current_exp = 0;
	current_money = 0;
}
