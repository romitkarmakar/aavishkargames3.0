# Aavishkar Games 3.0

## Requirements
- Provision a RabbitMQ Message broker node.
- Provision a Redis Cache Server.
- Provision a PostgreSQL Server.
- Provision a Mongodb Cluster.

## Installation
- Copy the env file and all the required api keys.
```
cpy .env.example .env
```
- Run the following to setup the redis cache server.
```
node install.js
```
- Start the development server
```
npm run dev
```
- To run the production server
```
npm start
```
- To run the consumer node to process all the data. (Always running process)
```
npm run background
```

## API Documentation

## ```/```

### ```POST /toss```
Required parameters:
- email: Email of the user

Response Syntax:
```json
{
    "status": "Int"
}
```

### ```POST /create```
Required Parameters:
- email: Email of the user
- status: Accepted values are ['winner', 'loser', 'draw']
- amount: Deal amount
- type: Name of the game (No whitespaces allowed)
```json
{
    "coins": "Int"
}
```
### ```GET /list/:game```
game: Name of the game

Response Syntax:  
```json
{
    "result": "Documents[]"
}
```

### ```GET /list```
game: Name of the game

Response Syntax:  
```json
{
    "result": "Documents[]"
}
```