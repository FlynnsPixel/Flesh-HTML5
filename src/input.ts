
/**
* list of ascii key code identifiers
**/
enum KeyCode {

  UNDEFINED = 0,
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  SHIFT = 16,
  CTRL = 17,
  ALT = 18,

  PAUSE_BREAK = 19,
  CAPS_LOCK = 20,
  ESCAPE = 27,
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  END = 35,
  HOME = 36,

  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,

  INSERT = 45,
  DELETE = 46,

  NUM_0 = 48,
  NUM_1 = 49,
  NUM_2 = 50,
  NUM_3 = 51,
  NUM_4 = 52,
  NUM_5 = 53,
  NUM_6 = 54,
  NUM_7 = 55,
  NUM_8 = 56,
  NUM_9 = 57,

  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,

  WINDOWS_LEFT = 91,
  WINDOWS_RIGHT = 92,
  SELECT = 93,

  NUMPAD_0 = 96,
  NUMPAD_1 = 97,
  NUMPAD_2 = 98,
  NUMPAD_3 = 99,
  NUMPAD_4 = 100,
  NUMPAD_5 = 101,
  NUMPAD_6 = 102,
  NUMPAD_7 = 103,
  NUMPAD_8 = 104,
  NUMPAD_9 = 105,
  MULTIPLY = 106,
  ADD = 107,
  SUBTRACT = 109,
  DECIMAL_POINT = 110,
  DIVIDE = 111,

  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,

  NUM_LOCK = 144,
  SCROLL_LOCK = 145,
  SEMICOLON = 186,
  EQUALS = 187,
  COMMA = 188,
  DASH = 189,
  PERIOD = 190,
  FORWARD_SLASH = 191,
  GRAVE_ACCENT = 192,
  OPEN_BRACKET = 219,
  BACK_SLASH = 220,
  CLOSE_BRACKET = 221,
  SINGLE_QUOTE = 222
};

var last_key = KeyCode.SINGLE_QUOTE;

class Key {

  pressed = false;
  down = false;
  key_code: KeyCode = KeyCode.UNDEFINED;
};

var keys_down: Key[] = [];

function init_input() {
  for (var n = 0; n < last_key; ++n) {
    var key = new Key();
    key.key_code = KeyCode.UNDEFINED;
    var code = KeyCode[n];
    if (code != undefined) {
      key.key_code = (<any>KeyCode)[n];
    }
    keys_down[n] = key;
  }

  document.ontouchstart = on_mouse_down;
  document.ontouchend = on_mouse_up;
  document.onmousedown = on_mouse_down;
  document.onmouseup = on_mouse_up;

  document.onkeydown = function (e: KeyboardEvent) {
  	if (e.keyCode == 187) {
  		dest_scale += .1;
  	}else if (e.keyCode == 189) {
  		dest_scale -= .1;
  	}

  	dest_scale = (dest_scale < .1 ) ? .1 : dest_scale;
  	dest_scale = (dest_scale > 2) ? 2 : dest_scale;

    if (keys_down[e.keyCode].key_code == KeyCode.UNDEFINED) {
      console.log("key down of key code " + e.keyCode + " is unknown");
      return;
    }

  	keys_down[e.keyCode].pressed = true;
  	keys_down[e.keyCode].down = true;
  };

  document.onkeyup = function (e: KeyboardEvent) {
  	if (keys_down[38]) {
  		var v = box1.body.GetLinearVelocity();
  		v.y = -4;
  		box1.body.SetLinearVelocity(v);
  	}

    if (keys_down[e.keyCode].key_code == KeyCode.UNDEFINED) {
      console.log("key up of key code " + e.keyCode + " is unknown");
      return;
    }

  	keys_down[e.keyCode].pressed = false;
  	keys_down[e.keyCode].down = false;
  }
}


function on_mouse_down() {

}

function on_mouse_up() {

}
