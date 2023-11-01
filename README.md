 # Voucher Pool


## Build and Run

```bash
$ docker-compose up --build
```

## Running migration

```bash
# run migration
$ docker-compose exec api yarn migrate:dev
```

## Browser Swagger
[swagger](http://localhost:3000/voucher-pool/api/docs/)


## Database Schema
![Database Schema](/schema.png "Database Schema")


### Tasks
* [x] Design a database schema
* [x] Write an application
* [x] API endpoint for verifying and redeeming vouchers
* [x] Implement API Rate Limiting: Protect the API from abuse by implementing rate limiting on the endpoints.
* [x] Use Database Transactions: Ensure data consistency by implementing use of transactions in your application.
* [ ] Write unit tests
* [x] Using Typescript
* [x] A nice little Readme on how to run
* [x] ***PLUS POINT:*** Writing swagger for the API
* [x] ***PLUS POINT:*** Docker file to setup the whole application with all the dependencies (database, nodejs)