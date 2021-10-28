<?php

namespace Controllers;

use Libraries\Controller;
use Libraries\Database;

class PhonebookController extends Controller
{
    public function all()
    {
        $this->ajax_response((new Database())->phoneBookList());
    }
    public function createNewPhonebook()
    {
        (new Database())->insertPhoneBook($this->post['full_name'], $this->post['numbers']);
        $this->ajax_response(['status' => true]);
    }
    public function deletePhonebook()
    {
        (new Database())->deletePhonebook($this->post['id']);
        $this->ajax_response(['status' => true]);
    }
    public function updatePhonebook()
    {
        (new Database())->updatePhonebook($this->post['id'], $this->post['full_name']);
        $this->ajax_response(['status' => true]);
    }
    public function updatePhonebookNumber()
    {
        (new Database())->updatePhonebookNumber($this->post['id'], $this->post['number']);
        $this->ajax_response(['status' => true]);
    }
}