var i, paused, words, speed, text;

var speedSlider = new Dragdealer('speed', {
	x: .7,
	animationCallback: function(value) { speed = value; }
});

function initializeReader() {
	pause();

	if (text == undefined && localStorage.getItem('text') == null) {
		text = 'The greatest want of the world is the want of men--men who will not be bought or sold, men who in their inmost souls are true and honest, men who do not fear to call sin by its right name, men whose conscience is as true to duty as the needle to the pole, men who will stand for the right though the heavens fall.  {Ed 57.3}'
		i = 0;
	} else if (text == undefined) {
		text = localStorage.getItem('text');
		i = localStorage.getItem('progress');
	} else {
		localStorage.setItem('text', text);
	}
	
	words = text.split(/[\s-–—]+/);
	steralizeText();
	length = words.length;
	$('.text').val(text);
	$('.reader').html(words[i]);
	updateProgress();
	speedSlider.setValue(speed);
}

function steralizeText() {
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
	
	length = words.length;
}

function updateProgress() {
	progress.setValue(i / length);
	localStorage.setItem('progress', i);
}


var width = $('.scroller').width()
var progress = new Dragdealer('progress', {
	animationCallback: function(value) {
		if (paused) {
			i = Math.round(value * length);
			$('.reader').html(words[i]);
		}
	},
	callback: function(value) {
		if (!paused) {
			i = Math.round(value * length);
			$('.reader').html(words[i]);
		}
	}
});

function play() {
	paused = false;
	$('.play').html('Pause');
	if (i == length) i = 0;
	step();
}

function step() {
	if (paused) return;
	setTimeout(function() {
		if (!paused) {
			$('.reader').html(words[i]);
			i++;
			updateProgress();
		} else {
			return;
		}
		if (i < length) {
			step();
		} else {
			pause();
		}
	}, ((1 - speed) * 300) + 100);
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
	if (paused) {
		play();
	} else {
		pause();
	}
}

$('.play').click(function() {
	togglePlayPause();
});

$('.rewind').click(function() {
	rewind();
});

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
				if (paused) updateProgress();
				break;

			case 38: // up
				speedSlider.setValue(speed + .05);
				break;

			case 39: // right
				if (i <= length - 10) {
					i = i + 10;
				} else {
					i = length;
				}
				if (paused) updateProgress();
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
Fix last word shutter
*/









