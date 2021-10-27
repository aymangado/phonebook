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
    Http.responseType = 'json';
    Http.open("GET", url);
    Http.send();
    Http.onload = function () {
        callback(Http.response);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function closePhonebookForm() {
    document.getElementById('phonebook_form').style.display = 'none';
}

function openPhonebookForm() {
    document.getElementById('phonebook_form').style.display = 'block';
}

onLoad(function () {
    get('http://localhost:8000/api.php/phonebook', function (response) {
        if (response.length === 0) {
            document.getElementById('no_phonebook_list').style.display = 'block';
        } else {
            for (var i = 0; i < response.length; i++) {
                var item = response[i];

                var tr = document.createElement('tr');

                var id_td = document.createElement('td');
                id_td.innerText = item.id;
                tr.appendChild(id_td)

                var full_name_td = document.createElement('td');
                full_name_td.innerText = item.full_name;
                tr.appendChild(full_name_td)

                var numbers_td = document.createElement('td');
                numbers_td.innerText = '';
                for (var ii = 0; ii < item.phone_numbers.length; ii++) {
                    numbers_td.innerText += capitalizeFirstLetter(item.phone_numbers[ii]['type']) + ': ' + item.phone_numbers[ii]['phone_number'];
                    if (ii < item.phone_numbers.length - 1) {
                        numbers_td.innerText += ' || ';
                    }
                }
                tr.appendChild(numbers_td)

                document.getElementById('phonebook_list').appendChild(tr);

                if (i === response.length - 1) {
                    document.getElementById('phonebook_list_table').style.display = 'block';
                }
            }
        }
    });
});