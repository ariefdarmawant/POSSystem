
# POSSystem

Built using **Express** + **Sequelize** + **PostgreSQL**


## API List
AUTH
`POST /login`: (params: username and password) 
`POST /register`: (params: username and password) 
`POST /refreshJwt`: (params: refreshToken) -> to fetch new Jwt Token for front end local storage

TRANSACTIONS
`GET /transactions`: (queryParams: type, minAmount, maxAmount, sortBy, sortType, page and size) -> to fetch transactions with optional sortBy Date and amount and optional filter by transaction type and amount range + Pagination 

`GET /transactions/id` : fetch transaction with specific id

`PATCH /transactions/id` : update transaction with specific id

`POST /transactions/` : push a new transaction

`DELETE /transactions/id` : delete transaction with specific ID
