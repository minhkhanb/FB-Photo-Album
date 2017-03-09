var OP = window.OP || {};

OP.Login = function () {
    var $items = $('.items'), $album = $('.album');
    $items.append($('<ul />'));
    $album.append($('<ul />'));
    var $loginStatus = $('.loginStatus'),
        $btnLogin = $('.btnLogin'),
        $btnLogout = $('.btnLogout'),
        $showAlbum = $('.showAlbum');

    $btnLogin.on('click', function (e) {
        e.preventDefault();
        FB.login(function (res) {
            if (res.authResponse) {
                $loginStatus.html('Logged in');
            }
            else {
                $loginStatus.html('Not logged in');
            }
        });
    });

    $btnLogout.on('click', function (e) {
        e.preventDefault();
        FB.logout();
        $loginStatus.html('Not logged in');
    });

    $showAlbum.css('cursor', 'pointer').on('click', function (e) {
        e.preventDefault();
        OP.FBAlbum();
    });
}

OP.FBAlbum = function () {
    var id = 'me', $ul = $('.album').find('ul');
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            var accessToken = response.authResponse.accessToken;
            console.log('response', JSON.stringify(response, null, 2));
            // Load Facebook photos
            FB.api('/' + id + '/albums', function (res) {
                console.log('res', JSON.stringify(res, null, 2));

                var albumId = 0, albums = res.data;
                for (; albumId < albums.length; albumId++) {
                    (function (album, id) {
                        var $img = $('<img src="https://graph.facebook.com/' + album.id + '/picture?type=album&access_token=' + accessToken + '" alt="' + album.name + '" />'), $title = $('<span />'), $li = $('<li />');
                        $title.html(album.name);
                        $li.attr('data-id',album.id).append($img);
                        $li.append($title);
                        $ul.append($li);
                    })(albums[albumId], albumId);
                }

            });
        } else {
            return false;
        }
    });

    $('.album').delegate('li', 'click', function (e) {
        e.preventDefault();
        var albumId = $(this).attr('data-id');
        OP.FBPhotoAlbum(albumId);
    });
}

OP.FBPhotoAlbum = function (albumId) {
    var $ul = $('.items').find('ul');
    $ul.html('');
    FB.api('/' + albumId + '/photos?fields=id,picture,source,height,width,images&limit=500', function (response) {
        if (response.data) {
            var photoId = 0, items = response.data;
            for (; photoId < items.length; photoId++) {
                (function (photo, id) {
                    var $img = $('<img />'), $li = $('<li />');
                    $img.attr('src', photo.source);
                    $li.append($img);
                    $ul.append($li);
                })(items[photoId], photoId);
            }
        } else {
            return false;
        }
    });
}

OP.init = function () {
    OP.Login();
}

$(document).ready(OP.init);