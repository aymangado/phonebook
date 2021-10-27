function onLoad(callback) {
    if(window.attachEvent) {
        window.attachEvent('onload', callback);
    } else {
        if(window.onload) {
            var currentOnload = window.onload;
            window.onload = function(evt) {
                currentOnload(evt);
                callback(evt);
            };
        } else {
            window.onload = callback;
        }
    }
}
function get(url, callback) {
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function () {
        console.log(Http.responseText)
        callback(Http.responseText);
    }
}


onLoad(function () {
    get('http://localhost:8000/api.php/phonebook', function (response) {

    });
});