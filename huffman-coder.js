var Huffman;

Huffman = {
  treeFromText: function(text) {
    var builder;
    builder = new Huffman.TreeBuilder(text);
    return builder.build();
  },
  treeFromArray: function(arr) {
    var builder;
    builder = new Huffman.TreeBuilder(arr , true);
    return builder.build();
  }
};


Huffman.CoreHelpers = {
  isArray: function(obj) {
    return !!(obj && obj.constructor === Array);
  },
  lpad: function(string, length) {
    length || (length = 8);
    while (string.length < length) {
      string = "0" + string;
    }
    return string;
  }
};


Huffman.Tree = (function() {

  function Tree(root) {
    this.root = root;
    this.root || (this.root = new Huffman.Tree.Node);
  }

  Tree.prototype.encode = function(text) {
    return this.bitStringToString(this.encodeBitString(text));
  };
  Tree.prototype.encodeArray = function(arr) {
    return this.bitStringToString(this.encodeBitArray(arr));
  };

  Tree.prototype.decode = function(text) {
    var bitString, d, decoded, direction, node, _i, _len, _ref;
    bitString = this.stringToBitString(text);
    decoded = "";
    node = this.root;
    _ref = bitString.split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      direction = _ref[_i];
      d = direction === '0' ? 'left' : 'right';
      node = node[d];
      if (node.isLeaf()) {
        decoded += node.value;
        node = this.root;
      }
    }
    return decoded;
  };

  Tree.prototype.encodeBitString = function(text) {
    var chr, encoded, _i, _len, _ref;
    encoded = "";
    _ref = text.split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      chr = _ref[_i];
      encoded += this.bitValue(chr);
    }
    return encoded;
  };
  Tree.prototype.encodeBitArray = function(arr) {
    var chr, encoded, _i, _len, _ref;
    encoded = "";
    _ref = arr;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      chr = _ref[_i];
      encoded += this.bitValue(chr);
    }
    return encoded;
  };

  Tree.prototype.bitStringToString = function(bitString) {
    var encoded, i, padByte, _i;
    padByte = 8 - bitString.length % 8;
    for (i = _i = 0; 0 <= padByte ? _i < padByte : _i > padByte; i = 0 <= padByte ? ++_i : --_i) {
      bitString += "0";
    }
    encoded = (function() {
      var _j, _ref, _results;
      _results = [];
      for (i = _j = 0, _ref = bitString.length; _j < _ref; i = _j += 8) {
        _results.push(String.fromCharCode(parseInt(bitString.substr(i, 8), 2)));
      }
      return _results;
    })();
    return encoded.join('') + padByte.toString();
  };

  Tree.prototype.stringToBitString = function(bitString) {
	var str = '';
    var chr, pad, pieces, _i, _len;
    pieces = bitString.split('');
    pad = parseInt(pieces.pop());
    for (_i = 0, _len = pieces.length; _i < _len; _i++) {
      chr = pieces[_i];
	  if(chr !== undefined){
		str+= Huffman.CoreHelpers.lpad(chr.charCodeAt(0).toString(2));
	  }
    }
    //pieces = pieces.join('');
    return str;//pieces.substr(0, pieces.length - pad);
  };

  Tree.prototype.bitValue = function(chr) {
    if (this.leafCache == null) {
      this.generateLeafCache();
    }
    return this.leafCache[chr];
  };

  Tree.prototype.generateLeafCache = function(node, path) {
    var _ref;
    if ((_ref = this.leafCache) == null) {
      this.leafCache = {};
    }
    node || (node = this.root);
    path || (path = "");
    if (node.isLeaf()) {
      return this.leafCache[node.value] = path;
    } else {
      this.generateLeafCache(node.left, path + "0");
      return this.generateLeafCache(node.right, path + "1");
    }
  };

  Tree.prototype.encodeTree = function() {
    return this.root.encode();
  };

  return Tree;

})();

Huffman.Tree.decodeTree = function(data) {
  return new Huffman.Tree(Huffman.Tree.parseNode(data));
};

Huffman.Tree.parseNode = function(data) {
  var node;
  node = new Huffman.Tree.Node();
  if (Huffman.CoreHelpers.isArray(data)) {
    node.left = Huffman.Tree.parseNode(data[0]);
    node.right = Huffman.Tree.parseNode(data[1]);
  } else {
    node.value = data;
  }
  return node;
};

Huffman.Tree.Node = (function() {

  function Node() {
    this.left = this.right = this.value = null;
  }

  Node.prototype.isLeaf = function() {
    var _ref;
    return (this.left === (_ref = this.right) && _ref === null);
  };

  Node.prototype.encode = function() {
    if (this.value) {
      return this.value;
    } else {
      return [this.left.encode(), this.right.encode()];
    }
  };

  return Node;

})();




Huffman.TreeBuilder = (function() {

  function TreeBuilder(text , isArray) {
	  if(isArray === undefined){
		this.text = text;
	  }else{
		this.arr = text;
	  }
  };
  TreeBuilder.prototype.build = function() {
    var combinedList, frequencyTable;
    frequencyTable = this.buildFrequencyTable();
    combinedList = this.combineTable(frequencyTable);
    return Huffman.Tree.decodeTree(this.compressCombinedTable(combinedList));
  };

  TreeBuilder.prototype.buildFrequencyTable = function() {
    var chr, frequency, table, tableHash, _i, _len, _ref, _ref1;
    tableHash = {};
	if(this.text === undefined){
		_ref = this.arr;
	}else{
		_ref = this.text.split('');
	}
	console.log(_ref);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      chr = _ref[_i];
      if ((_ref1 = tableHash[chr]) == null) {
        tableHash[chr] = 0;
      }
      tableHash[chr] += 1;
    }
    table = [];
    for (chr in tableHash) {
      frequency = tableHash[chr];
      table.push([frequency, chr]);
    }
    table.sort(this.frequencySorter);
    return table;
  };

  TreeBuilder.prototype.frequencySorter = function(a, b) {
    if (a[0] > b[0]) {
      return 1;
    } else {
      if (a[0] < b[0]) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  TreeBuilder.prototype.combineTable = function(table) {
    var first, second;
    while (table.length > 1) {
      first = table.shift();
      second = table.shift();
      table.push([first[0] + second[0], [first, second]]);
      table.sort(this.frequencySorter);
    }
    return table[0];
  };

  TreeBuilder.prototype.compressCombinedTable = function(table) {
    var value;
    value = table[1];
    if (Huffman.CoreHelpers.isArray(value)) {
      return [this.compressCombinedTable(value[0]), this.compressCombinedTable(value[1])];
    } else {
      return value;
    }
  };

  return TreeBuilder;

})();


