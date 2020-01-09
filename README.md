# Aavishkar Games 3.0

## ```/sevenup```

### ```POST /toss```
Required parameters:
- email: Email of the user

Response Syntax:
```json
{
    "result": "Int"
}
```

### ```POST /create```
Required Parameters:
- email: Email of the user
- status: Accepted values are ['winner', 'loser', 'draw']
```json
{
    "coins": "Int"
}
```

## ```/profile```

### ```POST /register```
Required Parameters:
- email: Email of the newly registered user
```json
{
    "coins": "Int"
}
```

## ```/install```
Install all the settings in the database.