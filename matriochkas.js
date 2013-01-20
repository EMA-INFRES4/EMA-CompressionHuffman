function algoMatriochkas(){
	var content = document.getElementById('txtcontent').value;
	// Récupération des trigrammes, digrammes et carctères
	var listTrigrammes = extractItems(content , 3);
	var listDigrammes  = extractItems(content , 2);
	var listCaractres  = extractItems(content , 1);
	debug_output('NB Trigrammes : ' + listTrigrammes.length);
	debug_output('NB Digrammes : '  + listDigrammes.length);
	debug_output('NB Caractres : '  + listCaractres.length);
	debug_output('Total : '  + (listTrigrammes.length + listDigrammes.length + listCaractres.length));
	
	if(debugMode()){
		debug_output("\n**** TRIGRAMMES ****\n" + scan(listTrigrammes));
		debug_output("\n**** DIGRAMMES ****\n"  + scan(listDigrammes));
		debug_output("\n**** CRACTERES ****\n"  + scan(listCaractres));
	}
	// Optimisation: On met dans des dicos
	// pour éviter d'avoir à boucler trop de fois
	var dicoTri = convert2dico(listTrigrammes);
	var dicoDi  = convert2dico(listDigrammes);
	var dicoChr = convert2dico(listCaractres);
	
	// On va créer le dictionnaire final
	var dicoGrammes = [];
	for(tri in dicoTri){
		var tProb = dicoTri[tri].proba;
		// Creation des composantes
		var di1  = tri.charAt(0) + tri.charAt(1);
		var ch1  = tri.charAt(2);
		var moy1 = (dicoDi[di1] === undefined || dicoChr[ch1] === undefined) ? 0 : (dicoDi[di1].proba + dicoChr[ch1].proba) / 2;
		
		var di2  = tri.charAt(1) + tri.charAt(2);
		var ch2  = tri.charAt(0);
		var moy2 = (dicoDi[di2] === undefined || dicoChr[ch2] === undefined) ? 0 : (dicoDi[di2].proba + dicoChr[ch2].proba) / 2;
		// Une des deux moyennes est plus grande ?
		if(moy1 > tProb || moy2 > tProb){
			// Oui, mais laquelle ?
			if(moy1 > tProb){
				dicoDi[di1]  = undefined; // On enleve le digramme
				dicoChr[ch1] = undefined; // On enleve le caractere
				dicoGrammes.push(di1);
				dicoGrammes.push(ch1);
			}else {
				dicoDi[di2]  = undefined;
				dicoChr[ch2] = undefined; // On enleve le caractere
				dicoGrammes.push(di2);
				dicoGrammes.push(ch2);
			}
		}else{
			dicoGrammes.push(tri);
		}
	}
	debug_output("Taille dico intermediaire: " + dicoGrammes.length);
	if(debugMode()){
		for(var k in dicoGrammes){
			debug_output(dicoGrammes[k]);
		}
	}
	
	// Suppression des doublons
	var dicoFinal = [];
	for(var k in dicoGrammes){
		var grm = dicoGrammes[k];
		if(!in_array(grm , dicoFinal)){
			dicoFinal.push(grm);
		}
	}
	debug_output("Taille dico final: " + dicoFinal.length);
	if(debugMode()){
		for(var k in dicoFinal){
			debug_output(dicoGrammes[k]);
		}
	}
	// Conversion du texte en tableau
	var lstText = textCleaner(content , dicoFinal);
	if(debugMode()){
		debug_output('Text en tableau :');
		debug_output(lstText);
	}
	// Encodage
	var huffman = encodeAndDecode(lstText);
	debug_output('Taille strEncoded : ' + huffman.encoded.length);
	debug_output('Taille strDecoded : ' + huffman.decoded.length);
	debug_output('Ratio : ' + huffman.ratio);
	debug_output('content == decoded ?  ' + (content == huffman.decoded ? 'oui !' : 'non...'));
}

function convert2dico(list , noValue){
	var dico = [];
	for(var i = 0 ; i < list.length ; i++){
		if(noValue === undefined){
			dico[list[i]['value']] = list[i];
		}else{
			dico[list[i]] = list[i];
		}
	}
	return dico;
}

function scan(obj){
	var str = '';
	for(k in obj[0]){
		str += k + "\t|";
	}
	str+= "\n";
	for(var i = 0 ; i < obj.length ; i++){
		for(k in obj[i]){
			str +=obj[i][k] + "\t|";
		}
		str+= "\n";
	}
	return str;
}


function extractItems(str , size){
	var _str = '';
	var lesItems = {};
	var nbTotal = 0;
	// Prends tous les Ngrammes
	for(var i = 0 ; i < str.length ; i++){
		var curItem = '';
		for(var j = 0 ; j < size ; j++){
			curItem+= str.charAt(i + j);
		}
		// N'existe pas
		if(lesItems[curItem] === undefined){
			lesItems[curItem] = 0;
		}
		nbTotal++;
		// On incrémente
		lesItems[curItem]++;
		i+= size;
	}
	// Creation de la liste finale
	var lstItems = sortListeWithoutCleaning(lesItems , nbTotal);
	//debug_output('Nb items de taille ' + size + ' : ' + nbTotal);
	return lstItems;
}


function sortListeWithoutCleaning(liste, size){
	var list = [];
	for(k in liste){
		var proba = liste[k] / size;
		list.push({
			value     : k ,
			occurence : liste[k] ,
			proba     : proba
		});
	}
	list.sort(function(a , b){
		if(a.proba === undefined){
			return b.occurence - a.occurence;
		}else{
			return b.proba - a.proba;
		}
	});
	return list;
}


function in_array (needle, haystack, argStrict) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: vlado houba
  // +   input by: Billy
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: true
  // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
  // *     returns 2: false
  // *     example 3: in_array(1, ['1', '2', '3']);
  // *     returns 3: true
  // *     example 3: in_array(1, ['1', '2', '3'], false);
  // *     returns 3: true
  // *     example 4: in_array(1, ['1', '2', '3'], true);
  // *     returns 4: false
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
}


