// Author: Jaydeep Ingle

/**
 * handler to download PDF link
 */
function downloadPDF() {
	fetchImages().then(function(images) {
		var doc = new jsPDF();
		for (var i = 0; i < images.length; i++) {
			if (images[i]) {
				doc.addImage(images[i].data, 'PNG', 10, 50);
			}
		}
		doc.save("Map.pdf");
	});
}
/**
 * Fetches the tiles as base64 image urls using drone API
 * 
 * @returns promise object which is resolved when all the images are added.
 */
function fetchImages() {
	return new DroneDeploy({
		version : 1
	}).then(function(droneAPI) {
		return fetchTiles(droneAPI);
	}).then(function(tilesResponse) {
		return convertTilesToBase64(tilesResponse.tiles);
	});
}

/**
 * Fetches the tiles using the droneAPI
 * 
 * @param droneAPI -
 *            the drone api
 * @returns promise object resolved when tiles have been fetched.
 */
function fetchTiles(droneAPI) {
	return droneAPI.Plans.getCurrentlyViewed().then(function(plan) {
		return droneAPI.Tiles.get({
			planId : plan.id,
			layerName : 'ortho',
			zoom : 17
		})
	});
}

/**
 * 
 * @param tiles -
 *            the tile URLs
 * @returns {Promise}
 */
function convertTilesToBase64(tiles) {
	var promise = new Promise(function(resolve) {
		var images = [];
		var x = 0;
		for (var i = 0; i < tiles.length; i++) {
			getImageAsBase64(tiles[i], function(data, imgIndex) {
				images[imgIndex] = data;
				x++;
				if (x == tiles.length) {
					resolve(images);
				}
			}, i);
		}
	});
	return promise;
}

/**
 * Fetches the image from the given url and converts it into base64 format
 * 
 * @param url -
 *            url of the image
 * @param callback -
 *            callback called when the image is fetched.
 * @param callbackArgs -
 *            variable number of additional arguments to pass with the callback.
 *            First argument to the callback will be the base64 representation
 *            of image
 */
function getImageAsBase64(url, callback, callbackArgs) {
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	var cbArgs = Array.prototype.slice.call(arguments, 2);
	img.onload = function() {
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL('image/png');
		var args = [ {
			height : this.height,
			width : this.width,
			data : dataURL,
			src : url
		} ];
		if (cbArgs != null)
			args = args.concat(cbArgs);
		callback.apply(null, args);
		canvas = null;
	};
	img.onerror = function() {
		callback.apply(null, cbArgs);
	};
	img.src = url;
}