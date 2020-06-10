This project focus on the offering collection

# Running the Project

# Development

## Running the project

* Install Docker and Docker compose (https://docs.docker.com/compose/install/)
* Clone the source code
* Run: `sudo docker-compose -f docker-compose.dev.yml up --build`
* Access: http://localhost:8100/pages/

## Accessing the database

* Install any mysql client (ex: MySQL Workbench)
* Run the whole project with docker compose (as above described) and connect to the database with the following data: `mysql -s -u devuser --port 9955 --host 127.0.0.1 -p` (password is in docker-compose.dev.yml for developement and docker-compose.prod.yml for production - ex: devpass). Then execute `use offerings_db;` and then `show tables;`

# Production

* Log into the production server
* Enter the project directory
* To stop servers: `sudo docker-compose -f docker-compose.prod.yml down`
* To start servers: `sudo docker-compose -f docker-compose.prod.yml up -d --build`
* From time to time there is a problem whenever building the docker image. If that is the case try to remove all docker containers (`sudo docker rm $(sudo docker ps -a -q)`) and all docker images (`sudo docker rmi $(sudo docker images -q) --force`) then start docker-compose up again (command above)
