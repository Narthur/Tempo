var i, paused, words, speed, text;

var speedSlider = new Dragdealer('speed', {
	x: .7,
	animationCallback: function(value) { speed = value; }
});

function initializeReader() {
	pause();
	
	if (text == undefined) {
		loadText();
	} else {
		saveText();
	}
	
	prepareWords();
	loadIntoPage();
	updateProgress();
	speedSlider.setValue(speed);
}

function loadText() {
	if (localStorage == undefined || localStorage.getItem('text') == null) {
		text =

['Two roads diverged in a yellow wood,',
'And sorry I could not travel both',
'And be one traveler, long I stood',
'And looked down one as far as I could',
'To where it bent in the undergrowth;',

'Then took the other, as just as fair,',
'And having perhaps the better claim,',
'Because it was grassy and wanted wear;',
'Though as for that the passing there',
'Had worn them really about the same,',
 
'And both that morning equally lay',
'In leaves no step had trodden black.',
'Oh, I kept the first for another day!',
'Yet knowing how way leads on to way,',
'I doubted if I should ever come back.',

'I shall be telling this with a sigh',
'Somewhere ages and ages hence:',
'Two roads diverged in a wood, and I—',	
'I took the one less traveled by,',
'And that has made all the difference.',
'— Robert Frost'].join('\n');

		i = 0;
	} else {
		text = localStorage.getItem('text');
		i = localStorage.getItem('progress');
	}
}

function saveText() {
	if (localStorage != undefined) localStorage.setItem('text', text);
}

function prepareWords() {
	words = text.split(/[\s-–—]+/);
	steralizeWords();
}

function steralizeWords() {
	var bannedCharacters = [' ', '{', '}'];
	
	for (k = 0; k < bannedCharacters.length; k++) {
		for (j = 0; j < words.length; j++) {
			if (words[j].indexOf(bannedCharacters[k]) > -1) {
				words.splice(j,1);
				j--;
			}
		}
	}
	
	for (j = 0; j < words.length; j++) {
		if (words[j].length == 0) {
			words.splice(j,1);
			j--;
		}
	}
}

function loadIntoPage() {
	$('.text').val(text);
	$('.reader').html(words[i]);
}

function updateProgress() {
	progress.setValue(i / words.length);
	if (localStorage != undefined) localStorage.setItem('progress', i);
}

var progress = new Dragdealer('progress', {
	animationCallback: function(value) {
		if (paused) {
			i = Math.round(value * words.length);
			$('.reader').html(words[i]);
		}
	},
	callback: function(value) {
		if (!paused) {
			i = Math.round(value * words.length);
			$('.reader').html(words[i]);
		}
	}
});

function play() {
	paused = false;
	$('.play').html('Pause');
	if (i >= words.length) i = 0;
	loadNextWord();
}

function loadNextWord() {
	var delay = ((1 - speed) * 300) + 100;
	if (paused) return;
	$('.reader').html(words[i]);
	i++;
	updateProgress();
	if (i >= words.length) setTimeout(pause, delay);
	if (!paused) setTimeout(loadNextWord, delay);
}

function pause() {
	paused = true;
	$('.play').html('Play');
}

function rewind() {
	pause();
	i = 0;
	updateProgress();
}

function togglePlayPause() {
	if (paused) { play() } else { pause() }
}

$('.play').click(togglePlayPause);

$('.rewind').click(rewind);

$('.load').click(function() {
	pause()
	text = $('.text').val();
	$('.loader').hide("slow");
	initializeReader();
	rewind();
});

$('.toggle').click(function() {
	$('.loader').toggle("slow");
});

$(document).keydown(function(e) {
	if (e.target.nodeName != 'TEXTAREA') {
		switch(e.which) {
			case 8: // backspace
				rewind();
				break;
		
			case 32: // space
				togglePlayPause();
				break;
		
			case 37: // left
				if (i >= 10) {
					i = i - 10;
				} else {
					i = 0;
				}
				updateProgress();
				break;

			case 38: // up
				speedSlider.setValue(speed + .05);
				break;

			case 39: // right
				if (i <= words.length - 10) {
					i = i + 10;
				} else {
					i = words.length;
				}
				updateProgress();
				break;

			case 40: // down
				speedSlider.setValue(speed - .05);
				break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	}
});

initializeReader();

/*
ToDo:
Add full-screen mode
Make it automatically remove page numbers
Make loader pop-up
*/









