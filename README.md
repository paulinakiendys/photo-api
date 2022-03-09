# photo-api

Simple [REST API](https://fed21-photo-api.herokuapp.com/) with a [MySQL](https://www.mysql.com/) database built using [express.js](https://expressjs.com/) and [bookshelf.js](https://bookshelfjs.org/).

## Table of contents
* [Requirements](#requirements)
* [Specification](#specification)
* [Models](#models)
* [Timeline](#timeline)

## Requirements

- RESTful
- MVC framework
- Use Bookshelf as ORM
- Authentication using JWT tokens
- Hashing/salting of passwords using bcrypt
- Data validation using express-validator
- All responses must be wrapped according to the JSend specification
- All queries and responses must follow the structure specified for each endpoint
- Error handling
- Use correct HTTP status codes
- Deployed to Heroku

 
## Specification

### User

    Register new user
    Log in to get a JWT token

### Photos

    List photos
    Create a new photo
    Update a photo
    Delete a photo (and any links between photo and albums)

### Album

    List albums
    Create a new album
    Update an album
    Delete an album (and any links between album and photos)

### Album > Photos

    List photos in album
    Add photo(s) to an album
    Delete a photo from an album


## Models

![Model sketch](https://eu1proxy.itslearning.com/image/v1?u=https%3a%2f%2flh5.googleusercontent.com%2fHcP3glhitExDeyliIj93fj-87EZg_rn8hFLeRhe8rMBSWJXZ3A_Pqx9g5eTbKmR1gMnl9qNwz_kvh0QUhq6jLoVG-mNhXAfy4YE6BBPIExUeTO_Y990Siu-0ACw6VuTGLOh2t2hn&s=f28f3736fc0b4c1ebdf4972f853c9a52&h=KbM6yaoOVBKtSAeTh3uUBAc0zgbXRLoP0%2b5TH%2f6SuHI%3d)

### Album

Attributes: title

Relations: photos, user

 
### Photo

Attributes: title, url, comment (default null)

Relations: albums, user

 
### User

Attributes: email, password, first_name, last_name

Relations: albums, photos

## Timeline

2 weeks