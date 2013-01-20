var nbTri = 0;
function getAllChars(value){
	var lesChars = {};
	for(var i = 0 ; i < value.length ; i++){
		var curLettre = value.charAt(i);
		// N'existe pas
		if(lesChars[curLettre] === undefined){
			lesChars[curLettre] = 0
		}
		// On incrémente
		lesChars[curLettre]++;
	}
	return lesChars;
}

function getAllCharsAsList(value){
	var dico = getAllChars(value);
	var list = [];
	for(k in dico){
		if(dico[k] / nbTri >= 1 / 300){
			list.push({
				lettre    : k ,
				occurence : dico[k] ,
				proba     : dico[k] / value.length
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

function sortDico(dico){
	var list = [];
	for(k in dico){
		if(dico[k] / nbTri >= 1 / 250){
			list.push({
				lettre    : k ,
				occurence : dico[k] ,
				proba     : dico[k] / nbTri
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

function printDico(dico){
	for(k in dico){
		console.log(k + "\t" + dico[k]);
	}
}

function printList(list){
	for(var i = 0 ; i < list.length ; i++){
		console.log('"' + list[i].lettre + "\"\t" + list[i].proba);
	}
}



function getAllDigrams(value){
	var lesDigrams = {};
	for(var i = 0 ; i < value.length ; i++){
		var curDigram = value.charAt(i) + value.charAt(i + 1);
		// N'existe pas
		if(lesDigrams[curDigram] === undefined){
			lesDigrams[curDigram] = 0
		}
		// On incrémente
		lesDigrams[curDigram]++;
	}
	return lesDigrams;
}

function getAllTrigrams(value){
	var lesTrigrams = {};
	for(var i = 0 ; i < value.length ; i++){
		var curTrigram = value.charAt(i) + value.charAt(i + 1) + value.charAt(i + 2);
		// N'existe pas
		if(lesTrigrams[curTrigram] === undefined){
			nbTri++;
			lesTrigrams[curTrigram] = 0
		}
		// On incrémente
		lesTrigrams[curTrigram]++;
	}
	return lesTrigrams;
}

function fusionTriAlphaAndSort(alpha , tri){
	for(var i = 0 ; i < alpha.length ; i++){
		tri.push(alpha[i]);
	}
	tri.sort(function(a , b){
		return b.proba - a.proba;
	});
	return tri;
}

