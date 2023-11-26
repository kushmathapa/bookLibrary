## List all books

```
curl --location --request GET 'http://localhost:5000/' \
```

### Response

```
{
    "1": {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "reviews": {}
    },
    "2": {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales",
        "reviews": {}
    },
    "3": {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy",
        "reviews": {}
    },
    "4": {
        "author": "Unknown",
        "title": "The Epic Of Gilgamesh",
        "reviews": {}
    },
    "5": {
        "author": "Unknown",
        "title": "The Book Of Job",
        "reviews": {}
    },
    "6": {
        "author": "Unknown",
        "title": "One Thousand and One Nights",
        "reviews": {}
    },
    "7": {
        "author": "Unknown",
        "title": "Njál's Saga",
        "reviews": {}
    },
    "8": {
        "author": "Jane Austen",
        "title": "Pride and Prejudice",
        "reviews": {}
    },
    "9": {
        "author": "Honoré de Balzac",
        "title": "Le Père Goriot",
        "reviews": {}
    },
    "10": {
        "author": "Samuel Beckett",
        "title": "Molloy, Malone Dies, The Unnamable, the trilogy",
        "reviews": {}
    }
}
```

## List Books by ISBN

```
curl --location --request GET 'http://localhost:5000/isbn/{isbnNumber}' \
```

### Response

```
{
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
}
```

## List Books by Author

```
curl --location --request GET 'http://localhost:5000/author/{authorName}' \
```

### Response

```
[
    {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy",
        "reviews": {}
    }
]
```

## List Books by Title

```
curl --location --request GET 'http://localhost:5000/title/{bookTitle}' \
```

### Response

```
[
    {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales",
        "reviews": {}
    }
]
```

## List Book reviews by Book's ISBN

```
curl --location --request GET 'http://localhost:5000/review/{isbnNumber}' \
```

### Response

```
{
    "testuser2": "Book review added by 2nd user ",
    "testuser1": "Book review added by 1st user "
}
```

## Register into the App

```
curl --location --request POST 'http://localhost:5000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "<yourDesiredUsername>",
    "password": "<yourPassword>"
}'
```

### Response

```
200 OK: {
    "message": "User has been registered successfully."
}

429: {
    "message": "Duplicate user"
}

400:{
    "message": "Please provide username and password"
}
```

## Login with registered credential into the App

```
curl --location --request POST 'http://localhost:5000/customer/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "<yourRegisteredUsername>",
    "password": "<yourRegisteredPassword>"
}'
```

### Response

```
200 OK: User successfully logged in

401: {
    "message": "Invalid grant. Username and password mismatch"
}

400:{
    "message": "Please provide username and password"
}
```

## Add a book review

### Only registered user can add a book review.

### Register user via /register and generate authentication token from /customer/login

### Since acess token is saved in the backend itself, you do not need to pass access token in the header of your request

```
curl --location --request PUT 'http://localhost:5000/customer/auth/review/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "review": "Book review added by 2nd user "
}'
```

### Response

```
200: {
    "message": "Book review added successfully for user:testuser1"
}
403: {
    "message": "User is not logged in"
}
404: {
    "message": "Book with isbn: 133 is not available in our library"
}
```

### Review is added for the logged in user

## Delete a book review

```
curl --location --request DELETE 'http://localhost:5000/customer/auth/review/1' \
```

### Review of the book added by the user is deleted if it exist.

### Response

```
200: {
    "message": "Book review deleted successfully for user:testuser1"
}
403: {
    "message": "User is not logged in"
}
404: {
    "message": "Book with isbn: 133 is not available in our library"
}
404: {
    "message": "Book review for user: testuser2 not found"
}
```
