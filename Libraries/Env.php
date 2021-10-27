<?php

namespace Libraries;


class Env
{
    private $file_path;

    public function __construct()
    {
        $this->file_path = BASE_PATH . DIRECTORY_SEPARATOR . '.env';
    }

    public function file_exists()
    {
        return file_exists($this->file_path);
    }

    public function get_file_data()
    {
        $data = [];
        if ($this->file_exists()) {
            $file = fopen($this->file_path, 'r');
            if (!$file) {
                die('.env cannot be opened');
            }

            while (!feof($file)) {
                $line = fgets($file);
                $line_parts = explode('=', $line);
                $part_0 = trim($line_parts[0]);
                if ($part_0 == '') {
                    continue;
                }
                $data[$part_0] = trim(trim($line_parts[1]), '"');
            }

            fclose($file);
        }

        return $data;
    }

    public function data()
    {
        return serialize($this->get_file_data());
    }
}