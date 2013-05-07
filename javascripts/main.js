require.config({urlArgs: "bust=" + (new Date()).getTime()});

require(['controllers/movies'], function(movies) {

  movies.start();

});