var position, paused, words, speed, text, width;
position = 0;
speed = .7;

text = 'The greatest want of the world is the want of men--men who will not be bought or sold, men who in their inmost souls are true and honest, men who do not fear to call sin by its right name, men whose conscience is as true to duty as the needle to the pole, men who will stand for the right though the heavens fall.  {Ed 57.3}';
$('.scroller').html(text);
width = $('.scroller').width();

console.log(width);

$('.scroller').animate({left:'-' + width + 'px'},width*2);