# Aavishkar Games 3.0

## ```/```

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
- amount: Deal amount
- type: Name of the game (No whitespaces allowed)
```json
{
    "coins": "Int"
}
```