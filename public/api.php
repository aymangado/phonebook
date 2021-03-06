<?php
session_name('phonebook');

session_start();

require_once __DIR__ . '/../boot.php';

// Autoload
require_once BASE_PATH . DIRECTORY_SEPARATOR . 'Libraries' . DIRECTORY_SEPARATOR . 'Autoload.php';
new Libraries\Autoload();

function fire()
{
    $parts = explode('?', $_SERVER['REQUEST_URI']);

    $path = trim($parts[0], '/');

    $uri_parts = explode('/', $path);

    $request_method = strtolower($_SERVER['REQUEST_METHOD']);

    if (end($uri_parts) == 'phonebook' and $request_method === 'get') {
        (new Controllers\PhonebookController)->all();
    } else if (end($uri_parts) == 'create_new_phonebook' and $request_method === 'post') {
        (new Controllers\PhonebookController)->createNewPhonebook();
    } else if (end($uri_parts) == 'delete_phonebook' and $request_method === 'post') {
        (new Controllers\PhonebookController)->deletePhonebook();
    } else if (end($uri_parts) == 'update_phonebook_full_name' and $request_method === 'post') {
        (new Controllers\PhonebookController)->updatePhonebook();
    } else if (end($uri_parts) == 'update_phonebook_number' and $request_method === 'post') {
        (new Controllers\PhonebookController)->updatePhonebookNumber();
    } else if (end($uri_parts) == 'get_phonebook' and $request_method === 'post') {
        (new Controllers\PhonebookController)->getPhonebook();
    } else if (end($uri_parts) == 'update_phonebook_and_numbers' and $request_method === 'post') {
        (new Controllers\PhonebookController)->updatePhonebookAndNumbers();
    }
}

header('Access-Control-Allow-Origin: ' . env('BASE_URL'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');

fire();

exit(0);