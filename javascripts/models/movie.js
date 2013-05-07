define(['helpers/database'], function(database) {

  function Movie(id, title, year, directorFirstName, directorLastName, image, genre, rating, votes) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.director = directorFirstName + ' ' + directorLastName;
    this.image = 'http://api.filmaster.com' + image;
    this.genre = genre;
    this.rating = rating;
    this.votes = votes;

    this.isWatched = function() {
      var watchedMovies = database.get('watched'),
          isWatched = false;

      for (w = 0; w < watchedMovies.length; w++) {
        if (this.id == watchedMovies[w].id) {
          isWatched = true;
        };
      }

      return isWatched;
    }

    this.isWellRated = function() {
      return (this.rating >= 7.5 && this.votes >= 150);
    }
  }

  return Movie;

});