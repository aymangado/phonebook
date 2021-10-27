<?php

namespace Libraries;

class Autoload
{
    private $file_ext = '.php';

    public function __construct()
    {
        spl_autoload_register([$this, 'loader']);
    }

    public function loader($className)
    {
        include_once BASE_PATH . '/' . str_replace('\\', '/', $className) . $this->file_ext;
    }
}