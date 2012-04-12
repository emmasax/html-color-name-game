var game = game || {};

jQuery(function($){
  
  var numColors,
      score,
      lives,
      ua = navigator.userAgent,
      event = (ua.match(/iPad/i)) ? "touchstart" : "click",
      colorSets = [yellows, blues, reds, purples, pinks, greens, greys],
      set,
      viewportheight,
      viewportwidth,
      halfviewport;

  viewportheight = window.innerHeight;
  viewportwidth = window.innerWidth;
  halfviewport = viewportheight / 2;
  
  var init = function() {
    var bodyHeight = viewportheight-50;
    if(bodyHeight < 530) {
      bodyHeight = 530;
      halfviewport = 280;
    }

    $('body').css('height', bodyHeight+'px');
    $('.lives').css('top', (halfviewport-70)+'px'); //310
    $('h1').css('top', (halfviewport-30)+'px'); //350
    $('.result').css('top', (halfviewport+50)+'px'); //430
    $('.tweet-this').css('top', (halfviewport+130)+'px').css('left', ((viewportwidth/2)-30)+'px');
        
    score = 0;
    numColors = 0;
    lives = 3;
  },

  checkAnswer = function() {
    // $(this).css("-webkit-animation-play-state", "paused");
    var currentQuestion = "rgb(" + $('h1').attr('data-rgb') + ")",
        chosenColor = $(this).css('color');

    if($(this).hasClass('correct')) {
      $('li.correct').css("font-size", "350px");
      $('li:not(.correct)').css("font-size", "200px");
      score++;
      $('.result').text(score);
      $('h1').addClass('next').text('Correct, next?');
      $('ul.colors li').off(event, checkAnswer);
    }
    else {
      lives--;
      $('.lives').text(lives + ' lives left').fadeIn();
      if(lives > 0) {
        $('.result').text('Try again!');
      }
      else {
        $('li.correct').css("font-size", "330px");
        $('li:not(.correct)').css("font-size", "200px");
        $('.result').text('High score: ' + score);
        if(score > 1) {
          $('.result').after('<a class="tweet-this" href="https://twitter.com/intent/tweet?source=webclient&text=I+got+'+score+'+colours+right!+Can+you+beat+me?+http%3A%2F%2Fhtml-color-name-game.heroku.com/">Tweet this</a>');
        }        
        $('.lives').hide();
        $('h1').addClass('new').text('Sorry no! New game?');
        $('ul.colors li').off(event, checkAnswer);
        init();
      }
    }
  },
  
  getNewColor = function(existing, set) {
    var newColor = colorSets[set][Math.floor(Math.random() * (numColors))];
    var exists = false;

    $.each(existing, function(i, v) {
      if(newColor["hex"] == v) {
        exists = true;
      }
    });
    
    if(exists) {
      return getNewColor(existing, set);
    }
    else {
      return newColor;
    }
  },
  
  chooseQuestion = function() {
    // get color set
    set = Math.floor(Math.random() * (colorSets.length));
    numColors = 0;
    $.each(colorSets[set], function() {
      numColors++;
    });
    
    var colorNum = getNewColor('', set);
    $('h1').attr("data-rgb", colorNum["rgb"]).text(colorNum["color"] + '?');
    displayOptions(colorNum["hex"], set);
    $('ul.colors li').on(event, checkAnswer);
  },
  
  displayOptions = function(colorNum, set) {
    var options = [colorNum],
        count = 0;

    for(i = 1; i < 4; i++) {
      var thenewcolor = getNewColor(options, set);
      options[i] = thenewcolor["hex"];
    }

    options.sort(function() { return 0.5 - Math.random() });
    $.each(options, function(i, v) {
      isCorrect = "";
      if(colorNum == options[i]) {
        isCorrect = 'correct';
      }
      $('ul.colors').append('<li class="no'+i+' '+isCorrect+'" style="color: '+options[i]+'">✮</li>');
    });
    showColor(count);
    setInterval(function() { count++; if (count < 4) { showColor(count); } }, 250);

  },
  
  showColor = function(count) {
    $('ul.colors li.no'+count).fadeIn();
  };
  
  // event handlers
  $('h1.new').live(event, function() {
    $('.result').text('');
    $('ul.colors li').remove();
    chooseQuestion();
    $(this).removeClass('new');
  });

  $('h1.next').live(event, function() {
    $('ul.colors li').remove();
    chooseQuestion();
    $(this).removeClass('next');
  });
  
  $('h1.start').live(event, function() {
    $('ul.setup').fadeOut();
    $('h1').after('<ul class="colors" />');
    chooseQuestion();
    $(this).removeClass('start');
  });
  
  
  $(init);
  
}(jQuery));