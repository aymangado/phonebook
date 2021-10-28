<?php

namespace Libraries;

use PDO;

class Database
{
    public $pdo;

    public function __construct()
    {
        $this->pdo = new PDO("mysql:host=" . env('MYSQL_HOST') . ";port=" . env('MYSQL_PORT') . ";dbname=" . env('MYSQL_DATABASE'), env('MYSQL_USER'), env('MYSQL_PASSWORD'), array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
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
        $phone_numbers = $this->pdo->query('SELECT * FROM phone_numbers WHERE phonebook_id IN(' . implode(',', $in) . ')')->fetchAll(PDO::FETCH_ASSOC);
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

    public function getPhonebook($id)
    {
        $statement = $this->pdo->prepare('SELECT * FROM phonebook where id = :id');

        $statement->bindParam(':id', $id);

        $statement->execute();

        $item = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            return [];
        }

        $statement = $this->pdo->prepare('SELECT * FROM phone_numbers where phonebook_id = :phonebook_id');

        $statement->bindParam(':phonebook_id', $item['id']);

        $statement->execute();

        $phone_numbers = $statement->fetchAll(PDO::FETCH_ASSOC);

        $item['phone_numbers'] = $phone_numbers;
        return $item;
    }

    public function deletePhonebook($id)
    {
        $statement = $this->pdo->prepare('DELETE FROM phonebook WHERE id = :id');
        $statement->bindParam(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $statement = $this->pdo->prepare('DELETE FROM phone_numbers WHERE phonebook_id = :phonebook_id');
        $statement->bindParam(':phonebook_id', $id, PDO::PARAM_INT);
        $statement->execute();
    }

    public function updatePhonebook($id, $full_name)
    {
        $statement = $this->pdo->prepare('UPDATE phonebook SET full_name = :full_name WHERE id = :id');
        $statement->bindParam(':id', $id, PDO::PARAM_INT);
        $statement->bindParam(':full_name', $full_name);
        $statement->execute();
    }

    public function updatePhonebookNumber($id, $number)
    {
        $statement = $this->pdo->prepare('UPDATE phone_numbers SET phone_number = :number WHERE id = :id');
        $statement->bindParam(':id', $id, PDO::PARAM_INT);
        $statement->bindParam(':number', $number);
        $statement->execute();
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
            $statement = $this->pdo->prepare('INSERT INTO phone_numbers (phonebook_id, phone_number, type) VALUES' . implode(',', $values));
            foreach ($binds as $key => $value) {
                $statement->bindValue($key, $value);
            }
            $statement->execute();
        }
    }

    public function updatePhonebookAndNumbers($id, $full_name, $numbersList)
    {
        $statement = $this->pdo->prepare('SELECT * FROM phonebook where id = :id');

        $statement->bindParam(':id', $id);

        $statement->execute();

        $item = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            return false;
        }

        $statement = $this->pdo->prepare('DELETE FROM phone_numbers WHERE phonebook_id = :phonebook_id');
        $statement->bindParam(':phonebook_id', $item['id'], PDO::PARAM_INT);
        $statement->execute();

        $now = db_now();
        $phonebook_id = $item['id'];
        $values = [];
        $binds = [];
        foreach ($numbersList as $key => $item) {
            $values[] = "(:phonebook_id_{$key},:phone_number_{$key}, :type_{$key}, :updated_date_{$key})";
            $binds["phonebook_id_{$key}"] = $phonebook_id;
            $binds["phone_number_{$key}"] = $item['phone_number'];
            $binds["type_{$key}"] = $item['type'];
            $binds["updated_date_{$key}"] = $now;
        }
        if (!empty($values) && !empty($binds)) {
            $statement = $this->pdo->prepare('INSERT INTO phone_numbers (phonebook_id, phone_number, type, updated_date) VALUES' . implode(',', $values));
            foreach ($binds as $key => $value) {
                $statement->bindValue($key, $value);
            }
            $statement->execute();
        }

        $statement = $this->pdo->prepare('UPDATE phonebook SET full_name = :full_name, updated_date = :now WHERE id = :id');
        $statement->bindParam(':id', $phonebook_id, PDO::PARAM_INT);
        $statement->bindParam(':full_name', $full_name);
        $statement->bindParam(':now', $now);
        $statement->execute();

        return true;
    }

    public function __destruct()
    {
        $this->pdo = null;
    }
}
