$(function() {
  
  $('button').click(function() {
    var start = new Date().getTime(),  
        elapsed = '0.0';  

    window.setInterval(function() {  
      var time = new Date().getTime() - start;  
      elapsed = Math.floor(time / 100) / 10;  
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }  
      $('p').text(elapsed);  
    }, 100);
    
  });
  
});
