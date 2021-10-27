# Phonebook manager

Simple project to store and manage phone numbers contacts.

## Installation

1. Make sure you have Docker Compose installed: https://docs.docker.com/compose/

2. Clone this repo locally by running the following command:
    ```sh    
    git clone git@github.com:aymangado/phonebook.git phonebook
    ```
3. Run the following command in project directory:
   ```ssh
   cp .env.template .env
   ```
4. Run the following command in project directory:
   ```ssh
   ./run start
   ```
4. Run the following command in project directory:
   ```ssh
   ./run import_database
   ```
5. Open [http://localhost:8000/](http://localhost:8000/) on your browser.