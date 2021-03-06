/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
export default class ImageGetter {
  getImageUrl(searchTerm, callback, errorCallback) {
    // Google image search - 100 searches per day.
    // https://developers.google.com/image-search/
    var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
      '?v=1.0&q=' + encodeURIComponent(searchTerm);
    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    // The Google image search API responds with JSON, so let Chrome parse it.
    x.responseType = 'json';
    x.onload = function() {
      // Parse and process the response from Google Image Search.
      var response = x.response;
      if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
          errorCallback('No response from Google Image search!');
          return;
        }
        var firstResult = response.responseData.results[0];
        // Take the thumbnail instead of the full image to get an approximately
        // consistent image size.
        var imageUrl = firstResult.tbUrl;
        var width = parseInt(firstResult.tbWidth);
        var height = parseInt(firstResult.tbHeight);
        console.assert(
          typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
          'Unexpected respose from the Google Image Search API!');
        callback(imageUrl, width, height);
    };
    x.onerror = function() {
      errorCallback('Network error.');
    };
    x.send();
  }
}
