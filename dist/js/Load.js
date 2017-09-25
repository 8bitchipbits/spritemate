'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Load = function () {
  function Load(config, eventhandler) {
    _classCallCheck(this, Load);

    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_load_input();
  }

  _createClass(Load, [{
    key: 'setup_load_input',
    value: function setup_load_input() {
      var element = document.createElement('div');
      element.innerHTML = '<input type="file" id="input-load" style="display: none">';
      var fileInput = element.firstChild;
      document.body.append(fileInput);
      var that = this;
      fileInput.addEventListener('change', function () {
        that.read_file_data(fileInput);
      });
    }
  }, {
    key: 'read_file_data',
    value: function read_file_data(fileInput) {
      var _this = this;

      var file = fileInput.files[0];

      if (file.name.match(/\.(spm|spd|spr)$/)) {
        var reader = new FileReader();
        reader.onload = function () {
          if (file.name.match(/\.(spm)$/)) {
            _this.parse_file_spritemate(reader.result);
          }
          if (file.name.match(/\.(spd|spr)$/)) {
            _this.parse_file_spritepad(reader.result);
          }
          _this.eventhandler.onLoad();
          $('#input-load').remove(); // by removing the input field and reassigning it, reloading the same file will work
          _this.setup_load_input();
        };

        if (file.name.match(/\.(spm)$/)) {
          reader.readAsText(file);
        }

        if (file.name.match(/\.(spd|spr)$/)) {
          reader.readAsBinaryString(file);
        }
      } else {
        alert("File not supported, .spm or .spd files only");
      }
    }
  }, {
    key: 'parse_file_spritemate',
    value: function parse_file_spritemate(file) {
      this.imported_file = JSON.parse(file);
    }
  }, {
    key: 'parse_file_spritepad',
    value: function parse_file_spritepad(file) {

      this.sprite_count = Math.floor(file.length / 64);
      console.log("Number of sprites: " + this.sprite_count);
      console.log("bytes left: " + file.length % 64);

      this.imported_file = {};
      this.imported_file.colors = { "t": 11, "m1": 8, "m2": 3 };
      this.imported_file.sprites = [];
      this.imported_file.current_sprite = 0;
      this.imported_file.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2

      var sprite = {
        color: 1,
        multicolor: false,
        double_x: false,
        double_y: false,
        pixels: []
      };

      var binary = "";
      for (var i = 9; i < 65 + 7; i++) {
        // convert data in SPR file into binary
        binary += ("0000000" + file.charCodeAt(i).toString(2)).slice(-8);
      }

      binary = binary.replace(/0/g, "t");
      binary = binary.replace(/1/g, "i");
      binary = binary.match(/.{1,24}/g);

      for (var _i = 0; _i < binary.length; _i++) {
        binary[_i] = binary[_i].split("");
        sprite.pixels.push(binary[_i]);
      }

      this.imported_file.sprites.push(sprite);
      console.log(this.imported_file);
    }
  }, {
    key: 'get_imported_file',
    value: function get_imported_file() {
      return this.imported_file;
    }
  }]);

  return Load;
}();