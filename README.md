# Phonebook manager

Simple project to store and manage contacts.

## Description

Phonebook manager without using any (PHP, CSS, JavaScript) packages.

## Installation


1. Make sure you have Docker Compose installed: https://docs.docker.com/compose/

2. Clone this repo locally by running the following command:
    ```sh    
    git clone git@github.com:aymangado/phonebook.git phonebook
    ```
### On linux and macOS

3. Run the following command in project directory, and I recommend you to leave the configurations as it:
   ```ssh
   cp .env.template .env
   ```
4. Run the following command in project directory to start docker containers:
   ```ssh
   ./run start
   ```
5. Run the following command in project directory to import database backup:
   ```ssh
   ./run import_database
   ```
6. Open [http://localhost:8000/](http://localhost:8000/) on your browser.


### On windows

3. Rename .env.template to .env in the project root folder.
4. Open the command line.
5. Go to project folder from the command line.
6. Enter the following commands one by one:
   ```ssh
   cd docker
   ```
   
   ```ssh
   docker-compose --env-file ../.env -p phonebook up -d
   ```
   
   ```ssh
   docker-compose --env-file ../.env -p phonebook exec mysql bash -c "/import_database_backup.sh"
   ```
7. Open [http://localhost:8000/](http://localhost:8000/) on your browser.

## How to use
1. To create a new contact just click on create new contact button in home screen.
2. To update full name of any contact, just click on the name, and it will be editable area then rename the full name, and press enter button to update it in the database.
3. To update any number of any contact, just click on the number that you want to update it, and it will be editable area then rename the number, and press enter button to update it in the database.
4. To update all contact data in form just click on edit button.