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
		text = 'The greatest want of the world is the want of men--men who will not be bought or sold, men who in their inmost souls are true and honest, men who do not fear to call sin by its right name, men whose conscience is as true to duty as the needle to the pole, men who will stand for the right though the heavens fall.  {Ed 57.3}'
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









