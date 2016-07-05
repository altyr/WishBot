var katakanaStripes = anime({
  targets: '.stripes path',
  translateX: function(target) {
    if (target.classList.contains('stripe-right')) return -1000;
    return -1000;
  },
  opacity: {
    value: 0,
    duration: 100
  },
  fill: '#FFF',
  delay: function(t, i) { return 2200 + (i * 75) },
  duration: 400,
  direction: 'reverse',
  easing: 'easeOutExpo'
});

var katakanaFills = anime({
  targets: '.katakana path',
  d: function(target) { return [target.getAttribute('data-d')] },
  opacity: {
    value: 0,
    duration: 100
  },
  fill: '#FFF',
  delay: function(t, i) { return 2400 + (i * 120) },
  duration: 1200,
  direction: 'reverse',
  easing: 'easeOutExpo'
});

var textFills = anime({
  targets: '.text-fills path',
  opacity: 0,
  delay: function(t, i) { return 3200 + (anime.random(0, 450)) },
  duration: 200,
  fill: '#FFF',
  direction: 'reverse',
  easing: 'easeOutExpo',
  complete: function() {
    anime({
      targets: '.line',
      opacity: 0,
      duration: 1500
    })
  }
});

var textpaths = anime({
  targets: '.line',
  translateX: function(target) {
    var x = 1200;
    if (target.classList.contains('hori')) return anime.random(0,1) === 1 ? x : -x;
    if (target.classList.contains('diag-right')) return x / 3;
    if (target.classList.contains('diag-left')) return x / 3;
  },
  translateY: function(target) {
    var y = 1200;
    if (target.classList.contains('vert')) return anime.random(0,1) === 1 ? y : -y;
    if (target.classList.contains('diag-right')) return -y / 3;
    if (target.classList.contains('diag-left')) return y / 3;
  },
  scale: {
    value: 4,
    duration: 500,
  },
  stroke: '#fff',
  opacity: {
    value: [1, 0],
    duration: 100,
  },
  delay: function(t, i) { return 0 + (i * 25) },
  duration: 500,
  easing: 'easeInOutQuad',
  direction: 'reverse',
  speed: 1
});