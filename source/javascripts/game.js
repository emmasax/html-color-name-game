var game = game || {};

jQuery(function($){
  
  var numColors,
      score,
      lives,
      ua = navigator.userAgent,
      event = (ua.match(/iPad/i)) ? "touchstart" : "click",
      colorSets = [blues, reds, purples, pinks, greens],
      set;

  var init = function() {
    score = 0;
    numColors = 0;
    lives = 3;
  },

  checkAnswer = function() {
    // $(this).css("-webkit-animation-play-state", "paused");
    var currentQuestion = "rgb(" + $('h1').attr('data-rgb') + ")",
        chosenColor = $(this).css('color');

    if($(this).hasClass('correct')) {
      $('li.correct').css("font-size", "400px");
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
        $('li.correct').css("font-size", "400px");
        $('li:not(.correct)').css("font-size", "200px");
        $('.result').text('High score: '+score);
        $('.lives').fadeOut();
        $('h1').addClass('new').text('Sorry, new game?');
        $('ul.colors li').off(event, checkAnswer);
        init();
      }
    }
  },
  
  getNewColor = function(existing, set) {
    var newColor = colorSets[set][Math.floor(Math.random()*numColors)];
    
    if(newColor["hex"] == existing) {
      getNewColor(existing, set);
    }
    else {
      return newColor;
    }
  },
  
  chooseQuestion = function() {
    // get color set
    set = Math.floor(Math.random()*colorSets.length);
    numColors = 0;
    $.each(colorSets[set], function() {
      numColors++;
    });
    console.log(set + " " + numColors);
    
    var colorNum = getNewColor('', set);
    $('h1').attr("data-rgb", colorNum["rgb"]).text(colorNum["color"]);
    displayOptions(colorNum["hex"], set);
    $('ul.colors li').on(event, checkAnswer);
  },
  
  displayOptions = function(colorNum, set) {
    console.log(set);
    var options = [colorNum, getNewColor(colorNum, set)["hex"], getNewColor(colorNum, set)["hex"], getNewColor(colorNum, set)["hex"]],
        count = 0;
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