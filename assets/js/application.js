var app = {
  config: {
    genre: '',
    baseUrl: 'http://api.filmaster.com',
    minimumAverageScore: 7.8,
    minimumNumberOfVotes: 100
  },

  ui: {
    movieList: $('.movie-list'),
    seenList: $('.seen-list'),
    seenMoviesTitle: $('.seen-movies-title'),
    loadingMessage: $('.loading-message'),
    genreSelector: $('.genre-selector')
  },

  init: function() {
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
      $(".chzn-container").fadeOut(function() {
        $(this).remove();
        app.ui.loadingMessage.fadeIn();
      });
      app.getMovies(1);
    });
  },

  bindSeenButton: function() {
    $('.seen-button').click(function() {
      $(this).parents('li').fadeOut(function() {
        localStorage.setItem(localStorage.length + 1, app.ui.movieList.find('li').first().find('.movie-title').text());
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

  bindRetryButton: function() {
    $('.retry-button').click(function() {
      window.location.reload(true);
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
            movies.push(movie);
          }
        } else if (i == 9) {
          app.ui.loadingMessage.fadeOut('fast');
          app.showMovies(movies);
          if (movie.average_score >= app.config.minimumAverageScore) {
            if (movie.number_of_votes >= app.config.minimumNumberOfVotes) {
              movies.push(movie);
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
            '<h2 class="movie-title">' + movie.title_localized + '</h2>',
            '<h3 class="movie-director">' + movie.directors[0].surname + ' (' + movie.release_year + ')</h3>',
          '</div>',
          '<div class="movie-info">',
            '<p class="movie-description">' + movie.description + '</p>',
            '<a href="#" class="seen-button">I have already seen it!</a>',
            '<a href="#" class="pass-button">Hm, not now.</a>',
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
    }
    
    app.ui.seenList.html('');

    for (var i = 1; i <= localStorage.length; i++)  {
      app.ui.seenList.append([
        '<li>',
          localStorage.getItem(i) +
        '</li>'
      ].join(''));
    }
  }
};

$(document).ready(function() {
  app.init();
  $('body').addClass('visible');
});