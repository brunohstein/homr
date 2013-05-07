define(['views/movies', 'models/movie', 'helpers/database'], function(view, Movie, database) {

  function start() {
    window.movies = this;
    view.render({});
    database.drop('suggested');
    window.currentPage = 1;
    window.genreFilter = '';
    load(window.currentPage, window.genreFilter);
  }

  function load(page, genre) {
    view.showLoader();
    var api = 'http://api.filmaster.com';

    $.ajax({
      url: api + '/1.1/ranking/film/?tags=' + genre + '&page=' + page,
      dataType: 'jsonp',
      success: successCallback
    });

    function successCallback(data) {
      for (m = 0; m < data.objects.length; m++) {

        var movie = new Movie(
                      data.objects[m].imdb_code,
                      data.objects[m].title_localized,
                      data.objects[m].release_year,
                      data.objects[m].directors[0].name,
                      data.objects[m].directors[0].surname,
                      data.objects[m].hires_image,
                      data.objects[m].tags,
                      data.objects[m].average_score,
                      data.objects[m].number_of_votes
                    );

        if (movie.isWatched()) {
          movie.status = 'watched';
        }

        view.print(movie);

        if (m == 9 & (view.isPageFull() == false || window.currentPage < 3)) {
          window.currentPage++;
          load(window.currentPage, window.genreFilter);
        } else if (m == 9 & view.isPageFull() == true) {
          view.hideLoader();
        }
      }
    }
  }

  function searchByName(movieTitle) {
    view.showLoader();

    var api = 'http://api.filmaster.com';

    $.ajax({
      url: api + '/1.1/search/film/?phrase=' + movieTitle,
      dataType: 'jsonp',
      success: successCallback
    });

    function successCallback(data) {
      for (m = 0; m < data.best_results.length; m++) {
        var movie = new Movie(
                      data.best_results[m].imdb_code,
                      data.best_results[m].title_localized,
                      data.best_results[m].release_year,
                      data.best_results[m].directors[0].name,
                      data.best_results[m].directors[0].surname,
                      data.best_results[m].hires_image,
                      data.best_results[m].tags,
                      data.best_results[m].average_score,
                      data.best_results[m].number_of_votes
                    );

        view.print(movie);
      }
    }
  }

  function loadWatched() {
    view.showLoader();

    var watchedMovies = database.get('watched'),
        api = 'http://api.filmaster.com';

    for (i = 0; i < watchedMovies.length; i++) {
      $.ajax({
        url: api + '/1.1/search/film/?phrase=' + watchedMovies[i].title,
        dataType: 'jsonp',
        success: successCallback
      });

      function successCallback(data) {
        var movie = new Movie(
                      data.best_results[0].imdb_code,
                      data.best_results[0].title_localized,
                      data.best_results[0].release_year,
                      data.best_results[0].directors[0].name,
                      data.best_results[0].directors[0].surname,
                      data.best_results[0].hires_image,
                      data.best_results[0].tags,
                      data.best_results[0].average_score,
                      data.best_results[0].number_of_votes
                    );

        movie.status = 'watched';
        view.print(movie);
      }
    }
  }

  function flagWatched(movieId, movieTitle) {
    var stored = database.get('watched'),
        found = false;

    for (i = 0; i < stored.length; i++) {
      if (movieId == stored[i].id) {
        found = true;
      }
    }

    if (found == false) {
      var movie = { id: movieId, title: movieTitle };
      database.put('watched', movie);
    }
  }

  function unflagWatched(movieId) {
    var watchedStored = database.get('watched');

    for (i = 0; i < watchedStored.length; i++) {
      if (watchedStored[i].id === movieId) {
        watchedStored.splice(i, 1);
        database.replace('watched', watchedStored);
      }
    }
  }

  return {
    start:start,
    load:load,
    searchByName:searchByName,
    loadWatched:loadWatched,
    flagWatched:flagWatched,
    unflagWatched:unflagWatched
  };

});