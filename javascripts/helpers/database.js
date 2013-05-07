define(function() {
  
  function get(key) {
    if (localStorage.getItem(key) === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  function put(key, movie) {
    var stored = get(key);
    stored.push(movie);
    localStorage.setItem(key, JSON.stringify(stored));
  }

  function replace(key, array) {
    localStorage.setItem(key, JSON.stringify(array)); 
  }

  function drop(key) {
    localStorage.removeItem(key);
  }

  return {
    get:get,
    put:put,
    drop:drop,
    replace:replace
  };

});