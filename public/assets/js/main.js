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

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updatePhonebookFullName(id, full_name, callback) {
    post('http://localhost:8000/api.php/update_phonebook_full_name', {
        "id": id,
        "full_name": full_name,
    } ,function () {
        callback();
    });
}

function updatePhonebookNumber(id, number, callback) {
    post('http://localhost:8000/api.php/update_phonebook_number', {
        "id": id,
        "number": number,
    } ,function () {
        callback();
    });
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
                var full_name_td_dev = document.createElement('div');
                full_name_td_dev.innerText = item.full_name;
                full_name_td_dev.setAttribute('data-id', item.id);
                full_name_td_dev.addEventListener('click', function (event) {
                    event.target.setAttribute('contenteditable', 'true');
                    event.target.focus();
                });
                full_name_td_dev.addEventListener('keydown', function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        updatePhonebookFullName(event.target.getAttribute('data-id'), event.target.innerText, function () {
                            event.target.setAttribute('contenteditable', 'false');
                        });
                    }
                });
                full_name_td.appendChild(full_name_td_dev);
                tr.appendChild(full_name_td);

                var numbers_td = document.createElement('td');
                numbers_td.innerText = '';
                for (var ii = 0; ii < item.phone_numbers.length; ii++) {
                    var number_type_span = document.createElement('span');
                    number_type_span.innerText = capitalizeFirstLetter(item.phone_numbers[ii]['type']) + ': ';
                    var number_span = document.createElement('span');
                    number_span.innerText = item.phone_numbers[ii]['phone_number'];
                    number_span.setAttribute('data-id', item.phone_numbers[ii]['id']);
                    number_span.addEventListener('click', function (event) {
                        event.target.setAttribute('contenteditable', 'true');
                        event.target.focus();
                    });
                    number_span.addEventListener('keydown', function (event) {
                        if (event.keyCode === 13) {
                            event.preventDefault();
                            updatePhonebookNumber(event.target.getAttribute('data-id'), event.target.innerText, function () {
                                event.target.setAttribute('contenteditable', 'false');
                            });
                        }
                    });
                    var number_div = document.createElement('div');
                    number_div.appendChild(number_type_span);
                    number_div.appendChild(number_span);
                    numbers_td.appendChild(number_div);
                }
                tr.appendChild(numbers_td);

                var updated_date_td = document.createElement('td');
                updated_date_td.style.whiteSpace = 'nowrap';
                var updated_date = new Date(item.updated_date);
                updated_date_td.innerText = pad(updated_date.getHours()) + ':' + pad(updated_date.getMinutes()) + ':' + pad(updated_date.getSeconds()) + ' - ' + updated_date.getDate() + '/' + updated_date.getMonth() + '/' + updated_date.getFullYear();
                tr.appendChild(updated_date_td);

                var manage_td = document.createElement('td');
                var delete_button = document.createElement('img');
                delete_button.classList.add('delete-button');
                delete_button.setAttribute('data-id', item.id);
                delete_button.addEventListener('click', function (event) {
                    deleteContact(event.target.getAttribute('data-id'));
                });
                delete_button.src = 'assets/images/delete.png';
                manage_td.appendChild(delete_button);
                var edit_button = document.createElement('img');
                edit_button.classList.add('edit-button');
                edit_button.setAttribute('data-id', item.id);
                edit_button.addEventListener('click', function (event) {
                    editContact(event.target.getAttribute('data-id'));
                });
                edit_button.src = 'assets/images/edit.png';
                manage_td.appendChild(edit_button);
                tr.appendChild(manage_td);

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
    document.getElementById('form_phonebook_id').value = '';

    var row = document.getElementById('phonebook_form_number_list').lastElementChild;
    var cloned_row = row.cloneNode(true);
    document.getElementById('phonebook_form_number_list').innerHTML = '';
    document.getElementById('phonebook_form_number_list').appendChild(cloned_row);
    document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('select')[0].value = '';
    document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('input')[0].value = '';
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

function addNumber() {
    if (document.getElementById('phonebook_form_number_list').getElementsByTagName('label').length === 10) {
        alert('You have reach the maximum number of phone numbers');
    } else {
        var row = document.getElementById('phonebook_form_number_list').lastElementChild;
        var cloned_row = row.cloneNode(true);
        document.getElementById('phonebook_form_number_list').appendChild(cloned_row);
        document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('select')[0].value = '';
        document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('input')[0].value = '';
    }
}

function deleteNumber(event) {
    if (document.getElementById('phonebook_form_number_list').getElementsByTagName('label').length === 1) {
        var row = document.getElementById('phonebook_form_number_list').lastElementChild;
        row.getElementsByTagName('select')[0].value = '';
        row.getElementsByTagName('input')[0].value = '';
    } else {
        event.target.closest('label').remove()
    }
}

function savePhonebookForm() {
    var has_error = false;
    var done_labels_loop = false;

    document.getElementById('form_full_name_error').style.display = 'none';
    document.getElementById('form_full_name_error').innerText = '';

    var full_name = document.getElementById('form_full_name').value.trim();

    if (full_name === '') {
        document.getElementById('form_full_name_error').innerText = 'Please enter the full name';
        document.getElementById('form_full_name_error').style.display = 'block';
        has_error = true;
    }

    var labels = document.getElementById('phonebook_form_number_list').getElementsByTagName('label');

    var numbers = [];

    for (i = 0; i < labels.length; i++) {
        labels[i].getElementsByClassName('error')[0].innerHTML = '';
        labels[i].getElementsByClassName('error')[0].style.display = 'none';

        if (labels[i].getElementsByTagName('select')[0].value === '') {
            labels[i].getElementsByClassName('error')[0].innerHTML = 'Please select the phone type';
            labels[i].getElementsByClassName('error')[0].style.display = 'block';
            has_error = true;
        }

        if (labels[i].getElementsByTagName('input')[0].value === '') {
            labels[i].getElementsByClassName('error')[0].innerHTML = 'Please enter the phone number';
            labels[i].getElementsByClassName('error')[0].style.display = 'block';
            has_error = true;
        }

        numbers.push({
            type: labels[i].getElementsByTagName('select')[0].value,
            phone_number: labels[i].getElementsByTagName('input')[0].value,
        });

        if (i === labels.length - 1) {
            done_labels_loop = true;
        }
    }

    if (done_labels_loop && !has_error) {
        if (document.getElementById('form_phonebook_id').value.trim() === '') {
            post('http://localhost:8000/api.php/create_new_phonebook', {
                "full_name": full_name,
                "numbers": numbers,
            }, function () {
                loadList();
                closePhonebookForm();
            });
        } else {
            post('http://localhost:8000/api.php/update_phonebook_and_numbers', {
                "id": document.getElementById('form_phonebook_id').value.trim(),
                "full_name": full_name,
                "numbers": numbers,
            }, function () {
                loadList();
                closePhonebookForm();
            });
        }
    }
}

function editContact(id) {
    post('http://localhost:8000/api.php/get_phonebook', {
        'id': id,
    }, function (response) {
        openPhonebookForm();
        response = JSON.parse(response);
        document.getElementById('form_full_name').value = response.full_name;
        document.getElementById('form_phonebook_id').value = response.id;

        for (var i = 0; i < response.phone_numbers.length; i++) {
            if (i > 0) {
                var row = document.getElementById('phonebook_form_number_list').lastElementChild;
                var cloned_row = row.cloneNode(true);
                document.getElementById('phonebook_form_number_list').appendChild(cloned_row);
            }
            document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('select')[0].value = response.phone_numbers[i].type;
            document.getElementById('phonebook_form_number_list').lastElementChild.getElementsByTagName('input')[0].value = response.phone_numbers[i].phone_number;
        }
    });
}

function startSavePhonebookForm(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        savePhonebookForm();
    }
}

onLoad(function () {
    loadList();
});