var Twit = require('twit')
var config = require('./config.js')
var T = new Twit(config);

//poetry theme
var themes = ['happy', 'since', 'time', 'yesterday', 'but', 'today', 'so'];
var poemText;

//define a function to check whether two arrays are equal
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}


const instertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;


//analyze the text and add line breaks
var rita = require('rita');
function analyze(poem){

	//randomly choose a word from the tweet and push it to the title array
	var poemArray = poem.split(' ');
	var newTheme = Math.floor((Math.random() * poemArray.length));
	while (poemArray[newTheme]== ''){
		var newTheme = Math.floor((Math.random() * poemArray.length));
	}

	themes.push(poemArray[newTheme]);
	// use rita package to analyze the sentences.
	var rs = rita.RiString(poem);
	var stresses = rs.features().stresses.split(' ');

	var stressP = [];
	for (var i = 0; i < stresses.length; i++) {
  		if(stresses[i].search("/0")!= -1){
  			stressP.push(i);
  		}
  	}

  	//add line breaks based on the streeses
	for (var i = poemArray.length-1; i >=0; i--) {
		if (stressP.includes(i)){
			poemArray.splice(i+1, 0, '\n');
		}
		if(arraysEqual(stresses.splice(i,5), [ 1, 1, 1, 1, 1 ])){
			poemArray.splice(i+3, 0, '\n');
		}
	}

	let string = poemArray.join(' ');
	while(string.search('\n ')!=-1){
		string = string.replace(/\n /g, '\n');
	}
	return string;

}

//remove all the urls in the text
function removeUrl(str_){
	var urlS = str_.indexOf("https://");
	var urlE = str_.indexOf(" ", urlS);
	
	if (urlS == -1) {
		return str_;		//if there's no url, just return the string as it is
	}else if (urlE == -1){
		var replaced = str_.slice(urlS);
		var display = str_.replace(replaced, '');
		return display;		//if there's only one url at the end of the string, remove that and return
	}else{
		var replaced = str_.slice(urlS, urlE);
		var left = str_.replace(replaced, '');
		return removeUrl(left);		//if there are multiple urls, call the removeUrl function again
	}
}

//remove all the punctuation marks and emojis, leave only words
function removeP(_str){
	_str = _str.replace(/_/g, ' ')
	return _str.replace(/[^\w\s]|#/g, "");
}

var x = 0;

//function that actually run the bot
function postText(_x){
	var wordCounts = [];
	var finals = []
	T.get('search/tweets', 
			{ q: `${themes[_x]} lang="en" -filter:retweets -filter:replies`, count: 50}, 
			  function(err, data, response) {
			  	if (data.statuses.length == 0) {
			  		x = 0;
			  		return;
			  	}
			  	//first remove all the truncated text
				for (var i = data.statuses.length-1; i >= 0; i--) {
			   		if(data.statuses[i].truncated==true){
			   			data.statuses.splice(i,1);
			   		}
			   	}

			   	//remove all the links and punctuation marks in the original tweet
			   	for (var i = 0; i < data.statuses.length; i++) {
			   		// console.log(data.statuses[i].text)
			   		var urlMoved = removeUrl(data.statuses[i].text);
			   		// console.log(urlMoved);
			   		var final = removeP(urlMoved);
			   		finals.push(final);
			   	}

			   	//choose the tweets randomly
			   	while(typeof(finals[choose]) == 'undefined'){
			   		console.log("choosing tweets")
			   		var choose = Math.floor((Math.random() * finals.length));
			   	}
	  			poemText =finals[choose];
	  			//add title, analyze the sentence and capitalize the first word at each line
	  			var postText = '#' + themes[_x].toUpperCase()+'\n'+'\n'+analyze(poemText);
	  			for (var i = 0; i < postText.length; i++) {
	  				if(postText[i]=='\n' && postText[i+1]!='\n' && typeof(postText[i+1]) != 'undefined'){
	  					// console.log(postText[i+1].toUpperCase());
	  					postText = postText.substring(0,i+1)+postText[i+1].toUpperCase()+postText.substring(i+2);
	  				}
	  			}
	  			console.log(postText);
	  			//post it!
	  	// 		T.post('statuses/update', { status: postText }, function(err, data, response) {
	  	// 			console.log(data);
	  	// 			console.log(postText);
				// })

			})
}

postText(x);

//run the bot every 50 seconds
setInterval(function() {
	x++;
    if(x < themes.length){
	    postText(x)
	}
	else return;	
}, 2000);


 