var app = {
  config: {
    genre: '',
    api_key: 'b23b7cd56841618914283936bf8e1727',
    base_url: 'http://api.themoviedb.org/3/',
    include_adult: true
  },

  ui: {
    genreSelector: $('.genre-selector', '.user-input'),
    submitBtn: $('.submit-button', '.user-input'),
    movieList: $('.movie-list', '.search-results')
  },

  init: function() {
    app.populateGenreSelector();
    app.binder();
  },

  populateGenreSelector: function() {
    $.getJSON(app.config.base_url + 'genre/list?api_key=' + app.config.api_key + '&callback=?', {},
      function(data) {
        $.each(data.genres, function(i, genre) {
          app.ui.genreSelector.append('<option value="' + genre.id + '">' + genre.name + '</option>');
        });
      }
    );
  },

  binder: function() {
    app.ui.submitBtn.click(function() {
      app.getSelectedGenre();
      app.showMovies(1);
    });
  },

  getSelectedGenre: function() {
    app.config.genre = app.ui.genreSelector.val();
  },

  showMovies: function(page) {
    $.getJSON(app.config.base_url + 'genre/' + app.config.genre + '/movies?include_adult= ' + app.config.include_adult + '&page=' + page + '&api_key=' + app.config.api_key + '&callback=?', {},
      function(data) {
        $.each(data.results, function(i, movie) {
          app.ui.movieList.append('<li>' + movie.original_title + '</li>');
        });
        if (page <= data.total_pages) {
          page++;
          app.showMovies(page);
        }
      }
    );
  }
};

$(document).ready(function() { app.init(); });