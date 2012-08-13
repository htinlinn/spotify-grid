var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;

exports.init = init;

function init() {
	createPage();

	window.onresize = resize;
}

function resize() {
	var offset = Math.floor((window.innerWidth - 20) / 190);
	var container = document.getElementById('container');
	container.style.width = offset * 190 + 'px';
	container.style.margin = '0 auto';
	container.style.paddingTop = '10px';
}

function loadAlbum(player, uri) {
	models.Album.fromURI(uri, function(album) { 
	    player.context = album;
	});	
}

function createPage() {
	var library = models.library;
	var albums = library.albums;

	albums.sort(function(a, b) {
		var keyA = a.artist.name;
		var keyB = b.artist.name;

		if (keyA == null && keyB == null) return 0;
		else if (keyA == null) return 1;
		else if (keyB == null) return -1;
		
		if (keyA.toLowerCase() > keyB.toLowerCase()) {
			return 1;
		} else if (keyA.toLowerCase() < keyB.toLowerCase()) { 
			return -1;
		} else {
			var secKeyA = a.name;
			var secKeyB = b.name;

			if (secKeyA == null && secKeyB == null) return 0;
			else if (secKeyA == null) return 1;
			else if (secKeyB == null) return -1;

			if (secKeyA.toLowerCase() > secKeyB.toLowerCase()) { 
				return 1;
			} else if (secKeyA.toLowerCase() < secKeyB.toLowerCase()) {
				return -1;
			} else {
				return 0;
			}
		}
	});

	var list = document.getElementById('the_grid');
	var last_list_item = list.firstChild;

	for (var i = albums.length - 1; i >= 0; i--) {
		var album = albums[i];

		if (album.uri != null) {
			var list_item = document.createElement('li');

			var figure = document.createElement('div');
			figure.className = 'figure';

			var name = document.createElement('div');
			name.className = 'name';
			name.innerHTML = '<a class=\"name_link\" href=\"' + album.uri + '\">' + album.name + '</a>';

			var artist = document.createElement('div');
			artist.className = 'artist';
			artist.innerHTML = '<a class=\"artist_link\"  href=\"' + album.artist.uri + '\">' + album.artist.name + '</a>';
		
			var views = sp.require('sp://import/scripts/api/views');
			var player = new views.Player();
			loadAlbum(player, album.uri);

			figure.appendChild(player.node); 
			figure.appendChild(name);
			figure.appendChild(artist);

			list_item.appendChild(figure);

			list.insertBefore(list_item, last_list_item);
			last_list_item = list_item;
		}
	};

	resize();
}
