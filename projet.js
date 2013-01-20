var Projet = function(){
	huffman = null;
	this.encodeArray = function(arr) {
		this.huffman = Huffman.treeFromArray(arr);
		return this.huffman.encodeArray(arr);
	};
	this.decodeString = function(encoded){
		return this.huffman.decode(encoded);
	};
};

function debugMode(){
	return document.getElementById('chkdebug').checked;
}

var dico = [];


function run(){
	debug_output('######### START #########');
	if(document.getElementById('radseuille').checked){
		algoSeuil();
	}else if(document.getElementById('radmatriochkas').checked){
		algoMatriochkas();
	}else{
		alert('Il faut choisir un algo !');
	}
}

function algoSeuil(){
	var content = document.getElementById('txtcontent').value;
	var maxDi   = parseFloat(document.getElementById('txtmaxdi').value);
	var maxTri  = parseFloat(document.getElementById('txtmaxtri').value);
	// Récupère les digrammes & les trigrammes & les monogrammes
	var trigrammes   = extractItemsAndClean(content , 3 , maxTri);
	var digrammes    = extractItemsAndClean(trigrammes.content , 2 , maxTri);
	var monogrammes  = extractItemsAndClean(digrammes.content , 1 , 0);
	debug_output('total : '  + (trigrammes.items.length + digrammes.items.length + monogrammes.items.length));
	debug_output('trigrammes : '  + trigrammes.items.length);
	debug_output('digrammes : '   + digrammes.items.length);
	debug_output('monogrammes : ' + monogrammes.items.length);
	toCSV(digrammes.items , 'proba');
	// Création d'un tableau unique
	var mergedItems = merge_items([trigrammes.items , digrammes.items , monogrammes.items]);
	debug_output('total merged :' + mergedItems.length);
	if(debugMode()){
		debug_output('Eléments mergés :');
		for(var i = 0 ; i < mergedItems.length ; i++){
			debug_output(mergedItems[i]);
		}
	}
	// Transformation du texte avec le tableau
	var lstText = textCleaner(content , mergedItems);
	if(debugMode()){
		debug_output('Text en tableau :');
		debug_output(lstText);
	}
	var huffman = encodeAndDecode(lstText);
	debug_output('Taille strEncoded : ' + huffman.encoded.length);
	debug_output('Taille strDecoded : ' + huffman.decoded.length);
	debug_output('Ratio : ' + huffman.ratio);
	debug_output('content == decoded ?  ' + (content == huffman.decoded ? 'oui !' : 'non...'));
}

function merge_items(lists){
	var merdedList = [];
	for(var i = 0 ; i < lists.length ; i++){
		if(lists[i] !== undefined){
			for(var j = 0 ; j < lists[i].length ; j++){
				merdedList.push(lists[i][j].value);
			}
		}
	}
	return merdedList;
}


function encodeAndDecode(ar){
	var prj = new Projet();
	var strEncoded = prj.encodeArray(ar);
	var strDecoded = prj.decodeString(strEncoded);
	if(debugMode()){
		debug_output("strEncoded => " + strEncoded);
		debug_output("strDecoded => " + strDecoded);
	}

	return {
		encoded : strEncoded ,
		decoded : strDecoded ,
		ratio   : (1 - strEncoded.length / strDecoded.length)
	}
}


function toCSV(list , key){
	var csv = '';
	for(var i = 0 ; i < list.length ; i++){
		csv+= i + ";" + list[i][key] + "\r\n";
	}
	console.log(csv);
}

