<?php
// Base path
define('BASE_PATH', __DIR__);

// Helper
require_once BASE_PATH . DIRECTORY_SEPARATOR . 'helper.php';

// .env
require_once BASE_PATH . DIRECTORY_SEPARATOR . 'Libraries' . DIRECTORY_SEPARATOR . 'Env.php';
define('ENV_DATA', (new \Libraries\Env)->data());
function env($key, $default = '')
{
    $env = unserialize(ENV_DATA);
    if (key_exists($key, $env)) {
        if (strtolower($env[$key]) === 'true' OR strtolower($env[$key]) === 'false') {
            return strtolower($env[$key]) === 'true';
        } else {
            return $env[$key];
        }
    }

    return $default;
}