define(function() {

  function render(parameters) {
    chosenfy();
    $('loader').hide();
    onGenreFilterChange();
    onStatusFilterChange();
    onScrollToBottom();
    onSearchByName();
  }

  function clear() {
    $('.movie').fadeOut(function() {
      $('.movie').remove();
    });
  }

  function showLoader() {
    $('.loader').fadeIn();
  }

  function hideLoader() {
    $('.loader').fadeOut(); 
  }

  function chosenfy() {
    $('select').chosen({disable_search: true});
  }

  function onToggleMovieStatusClick(context) {
    $('.toggle-movie-status', context).click(function() {
      var listItem = $(this).parents('li'),
          movieId = listItem.attr('id'),
          movieTitle = listItem.find('.title').text(),
          button = $(this);

      if (listItem.hasClass('watched')) {
        listItem.removeClass('watched');
        button.text('+ Assistido');
        window.movies.unflagWatched(movieId);
      } else {
        listItem.addClass('watched');
        button.text('Não assistido?');
        window.movies.flagWatched(movieId, movieTitle);
      }
    });
  }

  function onGenreFilterChange() {
    $('.genre-filter').change(function() {
      clear();
      window.genreFilter = $(this).val();
      window.currentPage = 1;
      window.movies.load(window.currentPage, window.genreFilter);
    });
  }

  function onStatusFilterChange() {
    $('.status-filter').change(function() {
      window.statusFilter = $(this).val();

      filterByStatus();

      if (isPageFull() == false) {
        window.currentPage++;
        window.movies.load(window.currentPage, window.genreFilter);
      }
    });
  }

  function onSearchByName() {
    $('.search-by-name').keypress(function(e) {
      if (e.which == 13) {
        var movieName = $(this).val();

        if (movieName != '') {
          clear();
          window.movies.searchByName(movieName);
          return false;
        }
      }
    });
  }

  function filterByStatus() {
    if (window.statusFilter == 'watched') {
      hideNotWatched();
    } else if (window.statusFilter == 'suggested') {
      hideWatched();
    } else {
      showAll();
    }

    function hideNotWatched() {
      $('.watched').fadeIn();
      $('.movie').not('.watched').hide();
    }

    function hideWatched() {
      $('.movie').not('.watched').fadeIn();
      $('.watched').hide();
    }

    function showAll() {
      $('.movie').fadeIn();
    }
  }

  function isPageFull() {
    var movie = $('.movie:visible').last(),
        position = movie.position().top + movie.outerHeight(true);
    
    return (position > $(window).height());
  }

  function onScrollToBottom() {
    $(window).scroll(function() {
      if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        window.currentPage++;
        window.movies.load(window.currentPage, window.genreFilter);   
      }
    });
  }

  function print(movie) {
    var loader = $('.loader'),
        template = new EJS({url: 'javascripts/views/movie.ejs'}).render(movie);

    loader.before(template);
    filterByStatus();
    hideLoader();

    var item = $('#' + movie.id);
    onToggleMovieStatusClick(item);
  }

  return {
    render:render,
    print:print,
    clear:clear,
    isPageFull:isPageFull,
    showLoader:showLoader,
    hideLoader:hideLoader
  };

});