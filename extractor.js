function extractItemsAndClean(str , size , min){
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
		// On incrémente
			nbTotal++;
		lesItems[curItem]++;
		i+= size;
	}
	// Creation et purge de la liste finale
	var lstItems      = sortListe(lesItems , min , nbTotal);
	debug_output('Nb items de taille ' + size + ' : ' + nbTotal);
	var cleanedString = cleanString(str , lstItems);
	return {
		content : cleanedString ,
		items   : lstItems
	};
}

function cleanString(str , list){
	for(var i = 0 ; i < list.length ; i++){
		str = str_replace(list[i].value , '' , str);
	}
	return str;
}

function textCleaner(str , list){
	var strArrayed = [];
	var offset     = 0;
	var nbLoop     = 0;
	var maxLoop    = str.length + 1;
	while(str != ''){
		var tri  = str.charAt(0) + str.charAt(1) + str.charAt(2);
		var di   = str.charAt(0) + str.charAt(1);
		var mono = str.charAt(0);
		// Existe das les trigrammes ?
		if(existsInArray(tri , list)){
			strArrayed.push(tri);
			offset = 3;
		}else{
			// Existe das les digrammes ?
			if(existsInArray(di , list)){
				strArrayed.push(di);
				offset = 2;
			}else{
				// c'est donc un monogramme
				strArrayed.push(mono);
				offset = 1;
			}
		}
		str = str.substring(offset);
		// Juste au cas ou ^^
		if(++nbLoop > maxLoop){
			debug_output("Out of cheese !!");
			return strArrayed;
		}
	}
	return strArrayed;
}




function sortListe(liste, min , size){
	var list = [];
	for(k in liste){
		var proba = liste[k] / size;
		if(proba >= min){
			list.push({
				value     : k ,
				occurence : liste[k] ,
				proba     : proba
			});
		}
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

function str_replace (search, replace, subject, count) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Gabriel Paderni
  // +   improved by: Philip Peterson
  // +   improved by: Simon Willison (http://simonwillison.net)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   bugfixed by: Anton Ongson
  // +      input by: Onno Marsman
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    tweaked by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   input by: Oleg Eremeev
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Oleg Eremeev
  // %          note 1: The count parameter must be passed as a string in order
  // %          note 1:  to find a global variable in which the result will be given
  // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
  // *     returns 1: 'Kevin.van.Zonneveld'
  // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
  // *     returns 2: 'hemmo, mars'
  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}

function existsInArray(value , array){
	for(var i = 0 ; i < array.length ; i++){
		if(array[i] == value){
			return true;
		}
	}
	return false;
}








