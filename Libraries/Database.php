<?php

namespace Libraries;

use PDO;

class Database
{
    public $pdo;

    public function __construct()
    {
        $this->pdo = new PDO("mysql:host=".env('MYSQL_HOST').";port=".env('MYSQL_PORT').";dbname=".env('MYSQL_DATABASE'), env('MYSQL_USER'), env('MYSQL_PASSWORD'),  array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
    }

    public function phoneBookList()
    {
        $list = $this->pdo->query('SELECT * FROM phonebook')->fetchAll(PDO::FETCH_ASSOC);
        if (!$list) {
            return [];
        }
        $in = [];
        foreach ($list as $key => $item) {
            $in[] = $item['id'];
        }
        $phone_numbers = $this->pdo->query('SELECT * FROM phone_numbers WHERE phonebook_id IN('.implode(',', $in).')')->fetchAll(PDO::FETCH_ASSOC);
        foreach ($list as $key => $item) {
            $list[$key]['phone_numbers'] = [];
            foreach ($phone_numbers as $phone_number_item) {
                if ($phone_number_item['phonebook_id'] == $item['id']) {
                    $list[$key]['phone_numbers'][] = $phone_number_item;
                }
            }
        }
        return $list;
    }

    public function insertPhoneBook($name, $numbersList)
    {
        $this->pdo->prepare('INSERT INTO phonebook (full_name) VALUES (?)')->execute([$name]);
        $phonebook_id = $this->pdo->lastInsertId();
        $values = [];
        $binds = [];
        foreach ($numbersList as $key => $item) {
            $values[] = "(:phonebook_id_{$key},:phone_number_{$key}, :type_{$key})";
            $binds["phonebook_id_{$key}"] = $phonebook_id;
            $binds["phone_number_{$key}"] = $item['phone_number'];
            $binds["type_{$key}"] = $item['type'];
        }
        if (!empty($values) && !empty($binds)) {
            $statement = $this->pdo->prepare('INSERT INTO phone_numbers (phonebook_id, phone_number, type) VALUES'. implode(',', $values));
            foreach($binds as $key => $value)
            {
                $statement->bindValue($key, $value);
            }
            $statement->execute();
        }
    }

    public function __destruct()
    {
        $this->pdo = null;
    }
}