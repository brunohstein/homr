var app = {
  config: {
    genre: '',
    baseUrl: 'http://api.filmaster.com',
    minimumAverageScore: 7.5,
    minimumNumberOfVotes: 150
  },

  ui: {
    userInput: $('.user-input'),
    movieList: $('.movie-list'),
    seenList: $('.seen-list'),
    seenMoviesTitle: $('.seen-movies-title'),
    loadingMessage: $('.loading-message'),
    genreSelector: $('.genre-selector')
  },

  init: function() {
    app.ui.movieList.hide();
    app.ui.loadingMessage.hide();
    app.ui.seenMoviesTitle.hide();
    app.bindGenreSelector();
    app.showSeenMovies();
  },

  bindGenreSelector: function() {
    app.ui.genreSelector.chosen({'disable_search': true});

    app.ui.genreSelector.change(function() {
      app.config.genre = $(this).val();
      app.ui.genreSelector.fadeOut();
      app.ui.userInput.fadeOut(function() {
        $(this).remove();
        app.ui.loadingMessage.fadeIn();
        app.ui.movieList.fadeIn();
      });
      app.getMovies(1);
    });
  },

  bindSeenButton: function() {
    $('.seen-button').click(function() {
      $(this).parents('li').fadeOut(function() {
        localStorage.setItem(app.ui.movieList.find('li').first().find('.movie-title').text(), 'seen');
        $(this).remove();
        app.showSeenMovies();
      });
      return false;
    });
  },

  bindPassButton: function() {
    $('.pass-button').click(function() {
      $(this).parents('li').fadeOut(function() {
        if ($('.the-end').length > 0) {
          $('.the-end').before($(this));
        } else {
          $(this).appendTo(app.ui.movieList);
        };
        $(this).attr('style', '');
      });
      return false;
    });
  },

  bindRemoveButton: function() {
    $('.remove-movie').click(function() {
      $(this).parents('li').fadeOut(function() {
        localStorage.setItem(app.ui.movieList.find('li').first().find('.movie-title').text(), 'removed');
        $(this).remove();
      });
      return false;
    });
  },

  bindRetryButton: function() {
    $('.retry-button').click(function() {
      window.location.reload(true);
      return false;
    });
  },

  bindRemoveMovieFromSeen: function() {
    $('.remove-movie-from-seen-button').click(function() {
      for (var i = 0; i < localStorage.length; i++){
        var value = localStorage[localStorage.key(i)];
        if (value == $(this).prev('.seen-movie').text()) {
          localStorage.removeItem(localStorage.key(i));
          app.showSeenMovies();
        }
      }
      return false;
    });
  },

  getMovies: function(page) {
    $.ajax({
      url: app.config.baseUrl + '/1.1/ranking/film/?tags= ' + app.config.genre + '&page=' + page,
      dataType: 'jsonp',
      success: successCallback
    });

    function successCallback(data) {
      var movies = new Array();
      $.each(data.objects, function(i, movie) {
        if (i < 9) {
          if (movie.average_score >= app.config.minimumAverageScore & movie.number_of_votes >= app.config.minimumNumberOfVotes) {
            for (var i = 0; i < localStorage.length; i++) { // temp
              var value = localStorage[localStorage.key(i)];
              if (value == movie.title_localized) {
                localStorage.setItem(localStorage.key(i), 'seen');
              }
            };
            var exists = false;
            for (var i = 0; i < localStorage.length; i++) {
              var value = localStorage[localStorage.key(i)];
              if (localStorage.key(i) == movie.title_localized) {
                exists = true;
              }
            };
            if (exists == false) {
              movies.push(movie);
            };
          }
        } else if (i == 9) {
          app.ui.loadingMessage.fadeOut('fast');
          app.showMovies(movies);
          if (movie.average_score >= app.config.minimumAverageScore) {
            if (movie.number_of_votes >= app.config.minimumNumberOfVotes) {
              for (var i = 0; i < localStorage.length; i++) { // temp
                var value = localStorage[localStorage.key(i)];
                if (value == movie.title_localized) {
                  localStorage.setItem(localStorage.key(i), 'seen');
                }
              };
              var exists = false;
              for (var i = 0; i < localStorage.length; i++) {
                var value = localStorage[localStorage.key(i)];
                if (localStorage.key(i) == movie.title_localized) {
                  exists = true;
                }
              };
              if (exists == false) {
                movies.push(movie);
              };
            }
            page++;
            app.getMovies(page);
          } else {
            app.ui.movieList.append([
              '<li class="the-end">',
                '<h3>The end.',
                  '<small>You are good to go by your own.</small>',
                '</h3>',
                '<a href="#" class="retry-button">Try another genre</a>',
              '</li>'
            ].join(''));
            app.bindRetryButton();
          }
        }
      });
    };
  },

  showMovies: function(movies) {
    $.each(movies, function(i, movie) {
      app.ui.movieList.append([
        '<li>',
          '<div class="movie-picture">',
            '<img src="' + app.config.baseUrl + movie.hires_image + '">',
          '</div>',
          '<div class="movie-id">',
            '<h2 class="movie-title">' + movie.title_localized +
              '<a class="youtube-link" title="Watch a trailer!" href="http://www.youtube.com/results?search_query=' + movie.title_localized + '+' + movie.release_year + '+trailer" target="_blank"></a>',
            '</h2>',
            '<h3 class="movie-director">' + movie.directors[0].surname + ' (' + movie.release_year + ')</h3>',
          '</div>',
          '<div class="movie-info">',
            "<a href='#' class='seen-button'>I've seen it!</a>",
            '<a href="#" class="pass-button">Hm, not now</a>',
            "<a href='#' class='remove-button'>Never show this</a>",
          '</div>',
        '</li>'
      ].join(''));
    });
    app.bindSeenButton();
    app.bindPassButton();
  },

  showSeenMovies: function() {
    if (localStorage.length > 0) {
      app.ui.seenMoviesTitle.fadeIn();
    };

    app.ui.seenList.html('');

    for (var i = 0; i < localStorage.length; i++){
      var value = localStorage[localStorage.key(i)];
      if (value == 'seen') {
        app.ui.seenList.append([
          '<li>',
            '<span class="seen-movie">' + localStorage.key(i) + '</span>',
            '<a href="#" class="remove-movie-from-seen-button" title="I have not seen this movie">x</a>',
          '</li>'
        ].join(''));
        app.bindRemoveMovieFromSeen();
      }
    }
  }
};

$(document).ready(function() {
  app.init();
  $('body').addClass('visible');
});