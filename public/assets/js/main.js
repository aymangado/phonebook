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
    Http.open('GET', url);
    Http.send();
    Http.onload = function () {
        callback(Http.response);
    }
}

function post(url, json, callback) {
    const Http = new XMLHttpRequest();
    // Http.responseType = 'json';
    Http.open('POST', url);
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(JSON.stringify(json));
    Http.onload = function () {
        callback(Http.response);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loadList() {
    get('http://localhost:8000/api.php/phonebook', function (response) {
        if (response.length === 0) {
            document.getElementById('no_phonebook_list').style.display = 'block';
            document.getElementById('phonebook_list_table').style.display = 'none';
        } else {
            document.getElementById('no_phonebook_list').style.display = 'none';
            document.getElementById('phonebook_list').innerHTML = '';
            for (var i = 0; i < response.length; i++) {
                var item = response[i];

                var tr = document.createElement('tr');

                var id_td = document.createElement('td');
                id_td.innerText = item.id;
                tr.appendChild(id_td);

                var full_name_td = document.createElement('td');
                full_name_td.innerText = item.full_name;
                tr.appendChild(full_name_td);

                var numbers_td = document.createElement('td');
                numbers_td.innerText = '';
                for (var ii = 0; ii < item.phone_numbers.length; ii++) {
                    numbers_td.innerText += capitalizeFirstLetter(item.phone_numbers[ii]['type']) + ': ' + item.phone_numbers[ii]['phone_number'];
                    if (ii < item.phone_numbers.length - 1) {
                        numbers_td.innerText += ' || ';
                    }
                }
                tr.appendChild(numbers_td);

                var manage_td = document.createElement('td');
                var delete_button = document.createElement('img');
                delete_button.classList.add('delete-button');
                delete_button.setAttribute('data-id', item.id);
                delete_button.addEventListener('click', function (event) {
                    deleteContact(event.target.getAttribute('data-id'));
                });
                delete_button.src = 'assets/images/delete.svg';
                manage_td.appendChild(delete_button);
                tr.appendChild(manage_td)

                document.getElementById('phonebook_list').appendChild(tr);

                if (i === response.length - 1) {
                    document.getElementById('phonebook_list_table').style.display = 'table';
                }
            }
        }
    });
}

function resetForm() {
    document.getElementById('form_full_name_error').style.display = 'none';
    document.getElementById('form_full_name_error').innerText = '';
    document.getElementById('form_full_name').value = '';
}

function closePhonebookForm() {
    document.getElementById('phonebook_form').style.display = 'none';
}

function openPhonebookForm() {
    document.getElementById('phonebook_form').style.display = 'block';
    resetForm();
    document.getElementById('form_full_name').focus();
}

function deleteContact(id) {
    post('http://localhost:8000/api.php/delete_phonebook', {
        "id": id,
    }, function () {
        loadList();
    });
}

function savePhonebookForm() {
    document.getElementById('form_full_name_error').style.display = 'none';
    document.getElementById('form_full_name_error').innerText = '';

    var full_name = document.getElementById('form_full_name').value.trim();

    if (full_name === '') {
        document.getElementById('form_full_name_error').innerText = 'Please enter the full name';
        document.getElementById('form_full_name_error').style.display = 'block';
        return;
    }

    post('http://localhost:8000/api.php/create_new_phonebook', {
        "full_name": full_name,
        "numbers": [
            {
                "phone_number": "0554323853",
                "type": "mobile"
            },
            {
                "phone_number": "0113454985",
                "type": "home"
            }
        ]
    } ,function () {
        loadList();
        closePhonebookForm();
    });
}

onLoad(function () {
    loadList();

    document.getElementById('form_full_name').addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            savePhonebookForm();
        }
    });
});