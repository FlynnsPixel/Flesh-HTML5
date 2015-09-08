var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["UNDEFINED"] = 0] = "UNDEFINED";
    KeyCode[KeyCode["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCode[KeyCode["TAB"] = 9] = "TAB";
    KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
    KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
    KeyCode[KeyCode["CTRL"] = 17] = "CTRL";
    KeyCode[KeyCode["ALT"] = 18] = "ALT";
    KeyCode[KeyCode["PAUSE_BREAK"] = 19] = "PAUSE_BREAK";
    KeyCode[KeyCode["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
    KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCode[KeyCode["END"] = 35] = "END";
    KeyCode[KeyCode["HOME"] = 36] = "HOME";
    KeyCode[KeyCode["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KeyCode[KeyCode["UP_ARROW"] = 38] = "UP_ARROW";
    KeyCode[KeyCode["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KeyCode[KeyCode["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KeyCode[KeyCode["INSERT"] = 45] = "INSERT";
    KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
    KeyCode[KeyCode["NUM_0"] = 48] = "NUM_0";
    KeyCode[KeyCode["NUM_1"] = 49] = "NUM_1";
    KeyCode[KeyCode["NUM_2"] = 50] = "NUM_2";
    KeyCode[KeyCode["NUM_3"] = 51] = "NUM_3";
    KeyCode[KeyCode["NUM_4"] = 52] = "NUM_4";
    KeyCode[KeyCode["NUM_5"] = 53] = "NUM_5";
    KeyCode[KeyCode["NUM_6"] = 54] = "NUM_6";
    KeyCode[KeyCode["NUM_7"] = 55] = "NUM_7";
    KeyCode[KeyCode["NUM_8"] = 56] = "NUM_8";
    KeyCode[KeyCode["NUM_9"] = 57] = "NUM_9";
    KeyCode[KeyCode["A"] = 65] = "A";
    KeyCode[KeyCode["B"] = 66] = "B";
    KeyCode[KeyCode["C"] = 67] = "C";
    KeyCode[KeyCode["D"] = 68] = "D";
    KeyCode[KeyCode["E"] = 69] = "E";
    KeyCode[KeyCode["F"] = 70] = "F";
    KeyCode[KeyCode["G"] = 71] = "G";
    KeyCode[KeyCode["H"] = 72] = "H";
    KeyCode[KeyCode["I"] = 73] = "I";
    KeyCode[KeyCode["J"] = 74] = "J";
    KeyCode[KeyCode["K"] = 75] = "K";
    KeyCode[KeyCode["L"] = 76] = "L";
    KeyCode[KeyCode["M"] = 77] = "M";
    KeyCode[KeyCode["N"] = 78] = "N";
    KeyCode[KeyCode["O"] = 79] = "O";
    KeyCode[KeyCode["P"] = 80] = "P";
    KeyCode[KeyCode["Q"] = 81] = "Q";
    KeyCode[KeyCode["R"] = 82] = "R";
    KeyCode[KeyCode["S"] = 83] = "S";
    KeyCode[KeyCode["T"] = 84] = "T";
    KeyCode[KeyCode["U"] = 85] = "U";
    KeyCode[KeyCode["V"] = 86] = "V";
    KeyCode[KeyCode["W"] = 87] = "W";
    KeyCode[KeyCode["X"] = 88] = "X";
    KeyCode[KeyCode["Y"] = 89] = "Y";
    KeyCode[KeyCode["Z"] = 90] = "Z";
    KeyCode[KeyCode["WINDOWS_LEFT"] = 91] = "WINDOWS_LEFT";
    KeyCode[KeyCode["WINDOWS_RIGHT"] = 92] = "WINDOWS_RIGHT";
    KeyCode[KeyCode["SELECT"] = 93] = "SELECT";
    KeyCode[KeyCode["NUMPAD_0"] = 96] = "NUMPAD_0";
    KeyCode[KeyCode["NUMPAD_1"] = 97] = "NUMPAD_1";
    KeyCode[KeyCode["NUMPAD_2"] = 98] = "NUMPAD_2";
    KeyCode[KeyCode["NUMPAD_3"] = 99] = "NUMPAD_3";
    KeyCode[KeyCode["NUMPAD_4"] = 100] = "NUMPAD_4";
    KeyCode[KeyCode["NUMPAD_5"] = 101] = "NUMPAD_5";
    KeyCode[KeyCode["NUMPAD_6"] = 102] = "NUMPAD_6";
    KeyCode[KeyCode["NUMPAD_7"] = 103] = "NUMPAD_7";
    KeyCode[KeyCode["NUMPAD_8"] = 104] = "NUMPAD_8";
    KeyCode[KeyCode["NUMPAD_9"] = 105] = "NUMPAD_9";
    KeyCode[KeyCode["MULTIPLY"] = 106] = "MULTIPLY";
    KeyCode[KeyCode["ADD"] = 107] = "ADD";
    KeyCode[KeyCode["SUBTRACT"] = 109] = "SUBTRACT";
    KeyCode[KeyCode["DECIMAL_POINT"] = 110] = "DECIMAL_POINT";
    KeyCode[KeyCode["DIVIDE"] = 111] = "DIVIDE";
    KeyCode[KeyCode["F1"] = 112] = "F1";
    KeyCode[KeyCode["F2"] = 113] = "F2";
    KeyCode[KeyCode["F3"] = 114] = "F3";
    KeyCode[KeyCode["F4"] = 115] = "F4";
    KeyCode[KeyCode["F5"] = 116] = "F5";
    KeyCode[KeyCode["F6"] = 117] = "F6";
    KeyCode[KeyCode["F7"] = 118] = "F7";
    KeyCode[KeyCode["F8"] = 119] = "F8";
    KeyCode[KeyCode["F9"] = 120] = "F9";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["F11"] = 122] = "F11";
    KeyCode[KeyCode["F12"] = 123] = "F12";
    KeyCode[KeyCode["NUM_LOCK"] = 144] = "NUM_LOCK";
    KeyCode[KeyCode["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    KeyCode[KeyCode["SEMICOLON"] = 186] = "SEMICOLON";
    KeyCode[KeyCode["EQUALS"] = 187] = "EQUALS";
    KeyCode[KeyCode["COMMA"] = 188] = "COMMA";
    KeyCode[KeyCode["DASH"] = 189] = "DASH";
    KeyCode[KeyCode["PERIOD"] = 190] = "PERIOD";
    KeyCode[KeyCode["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
    KeyCode[KeyCode["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
    KeyCode[KeyCode["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
    KeyCode[KeyCode["BACK_SLASH"] = 220] = "BACK_SLASH";
    KeyCode[KeyCode["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
    KeyCode[KeyCode["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
})(KeyCode || (KeyCode = {}));
;
var MouseButtonID;
(function (MouseButtonID) {
    MouseButtonID[MouseButtonID["UNKNOWN"] = 0] = "UNKNOWN";
    MouseButtonID[MouseButtonID["LEFT"] = 1] = "LEFT";
    MouseButtonID[MouseButtonID["MIDDLE"] = 2] = "MIDDLE";
    MouseButtonID[MouseButtonID["RIGHT"] = 3] = "RIGHT";
})(MouseButtonID || (MouseButtonID = {}));
;
var Key = (function () {
    function Key() {
        this.pressed = false;
        this.down = false;
        this.key_code = KeyCode.UNDEFINED;
    }
    return Key;
})();
;
var MouseButton = (function () {
    function MouseButton(button_id) {
        this.pressed = false;
        this.down = false;
        this.button_id = button_id;
    }
    return MouseButton;
})();
;
var last_key = KeyCode.SINGLE_QUOTE;
var key_list = [];
var mouse_list = [];
var mouse_wheel_delta_y;
var mouse_wheel_moving = false;
function init_input() {
    for (var n = 0; n < last_key; ++n) {
        var key = new Key();
        key.key_code = KeyCode.UNDEFINED;
        var code = KeyCode[n];
        if (code != undefined) {
            key.key_code = KeyCode[n];
        }
        key_list[n] = key;
    }
    mouse_list[0] = new MouseButton(MouseButtonID.UNKNOWN);
    mouse_list[1] = new MouseButton(MouseButtonID.LEFT);
    mouse_list[2] = new MouseButton(MouseButtonID.MIDDLE);
    mouse_list[3] = new MouseButton(MouseButtonID.RIGHT);
    document.ontouchstart = function (e) {
    };
    document.ontouchend = function (e) {
    };
    document.onmousedown = function (e) {
        get_mouse_button(e.button + 1).down = true;
        get_mouse_button(e.button + 1).pressed = true;
    };
    document.onmouseup = function (e) {
        get_mouse_button(e.button + 1).down = false;
        get_mouse_button(e.button + 1).pressed = false;
    };
    document.onmousewheel = function (e) {
        mouse_wheel_delta_y = e.wheelDeltaY;
        mouse_wheel_moving = true;
    };
    document.onkeydown = function (e) {
        if (key_list[e.keyCode].key_code == KeyCode.UNDEFINED) {
            console.log("key down of key code " + e.keyCode + " is unknown");
            return;
        }
        if (!key_list[e.keyCode].down) {
            key_list[e.keyCode].pressed = true;
            key_list[e.keyCode].down = true;
        }
    };
    document.onkeyup = function (e) {
        if (key_list[e.keyCode].key_code == KeyCode.UNDEFINED) {
            console.log("key up of key code " + e.keyCode + " is unknown");
            return;
        }
        key_list[e.keyCode].pressed = false;
        key_list[e.keyCode].down = false;
    };
}
function update_input() {
    for (var n = 0; n < key_list.length; ++n) {
        if (key_list[n].key_code != KeyCode.UNDEFINED) {
            key_list[n].pressed = false;
        }
    }
    for (var n = 0; n < mouse_list.length; ++n) {
        mouse_list[n].pressed = false;
    }
    mouse_wheel_moving = false;
}
function get_key(key_code) {
    if (key_code < 0 || key_code >= key_list.length) {
        console.log("key code " + key_code + " is out of bounds");
        return key_list[0];
    }
    else if (key_list[key_code].key_code == KeyCode.UNDEFINED) {
        console.log("key code " + key_code + " is undefined");
        return key_list[0];
    }
    return key_list[key_code];
}
function is_key_down(key_code) {
    return get_key(key_code).down;
}
function is_key_pressed(key_code) {
    return get_key(key_code).pressed;
}
function get_mouse_button(button_id) {
    if (button_id < 0 || button_id >= mouse_list.length) {
        console.log("button id " + button_id + " is out of bounds");
        return mouse_list[0];
    }
    return mouse_list[button_id];
}
function is_mouse_button_down(button_id) {
    return get_mouse_button(button_id).down;
}
function is_mouse_button_pressed(button_id) {
    return get_mouse_button(button_id).pressed;
}
