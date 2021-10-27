<?php

namespace Libraries;


class Controller
{
    public $request;
    public $server;
    public $queries = [];
    public $post = [];

    public function __construct()
    {
        $this->server = $_SERVER;
        $this->request = $_REQUEST;
        $this->queries = $_GET;
        $this->set_post();
    }

    public function set_post()
    {
        $headers = getallheaders();
        $headers = array_change_key_case($headers, CASE_LOWER);
        if (key_exists(strtolower('content-type'), $headers) AND $headers['content-type'] === 'application/json') {
            $this->post = (array)json_decode(file_get_contents('php://input'), true);
        } else {
            $this->post = $_POST;
        }
    }

    public function ajax_response($data = [])
    {
        header('Content-type: application/json; charset=utf-8');
        if (is_bool($data) OR is_null($data)) {
            $data = [
                'status' => $data,
            ];
        }
        echo json_encode($data);
    }
    public function ajax_error_response($data, $code)
    {
        header('HTTP/1.1 ' . $code, true, $code);
        header('Content-type: application/json; charset=utf-8');
        echo json_encode(['error' => $data]);
    }
}