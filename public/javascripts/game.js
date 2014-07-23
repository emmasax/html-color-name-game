var game = game || {};

jQuery(function($){
  
  var numColors,
      score,
      lives,
      ua = navigator.userAgent,
      event = (ua.match(/iPad/i)) ? "touchstart" : "click",
      colorSets = [yellows, blues, reds, purples, pinks, greens, greys, oranges],
      set,
      viewportheight,
      viewportwidth,
      halfviewport;

  viewportheight = window.innerHeight;
  viewportwidth = window.innerWidth;
  halfviewport = viewportheight / 2;
  
  var init = function() {
    score = 0;
    numColors = 0;
    lives = 5;
    
    $('.start').trigger(event);
  },

  checkAnswer = function() {
    // $(this).css("-webkit-animation-play-state", "paused");
    var currentQuestion = "rgb(" + $('h1').attr('data-rgb') + ")",
        chosenColor = $(this).css('color');

    if($(this).hasClass('correct')) {
      score++;
      $('.result').text("Score: " + score);
      $('h1').addClass('next').text('Correct, next?');
      $('ul.colors li').off(event, checkAnswer);
      $('h1.next').trigger(event);
    }
    else {
      lives--;
      $('.lives').text('Lives: ' + lives).fadeIn();
      if(lives > 0) {
        $('.extra').html('No, try again');
      }
      else {
        $('li.correct').addClass("show");
        $('li:not(.corrent)').addClass("hide");
        $('.result')
          .html('Your high score: ' + score)
          .after('<p><a class="tweet-this" href="https://twitter.com/intent/tweet?source=webclient&text=I+got+'+score+'+colours+right!+Can+you+beat+me?+http%3A%2F%2Fhtml-color-name-game.heroku.com/">Tweet it</a></p>');
        $('.lives').hide();
        $('h1').addClass('new').text('No lives left. New game?');
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
      console.log("Chosen colour: " + set);
      return newColor;
    }
  },
  
  chooseQuestion = function() {
    // get color set
    set = Math.floor(Math.random()*(colorSets.length));
    console.log("Chosen set: " + set);
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
      $('ul.colors').append('<li class="no'+i+' '+isCorrect+'"><span style="background-color: '+options[i]+'"></span></li>');
    });
    showColor(count);
    setInterval(function() { count++; if (count < 4) { showColor(count); } }, 250);

  },
  
  showColor = function(count) {
    $('ul.colors li.no'+count).fadeIn();
  };
  
  // event handlers
  // $('h1.new').live(event, function() {
  //   $('.result').text('');
  //   $('ul.colors li').remove();
  //   chooseQuestion();
  //   $(this).removeClass('new');
  // });
  //
  // $('h1.next').live(event, function() {
  //   $('ul.colors li').remove();
  //   chooseQuestion();
  //   $(this).removeClass('next');
  // });
  
  $('.start').live(event, function() {
    $('ul.setup').remove();
    $('h1').after('<ul class="colors" />');
    chooseQuestion();
    $(this).removeClass('start');
  });
  
  $(init);
  
}(jQuery));