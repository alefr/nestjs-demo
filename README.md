# MovieApi - NestJS

Project for comparing different technology stacks.

## Tech stack
* NodeJS
* NestJS

## Requirements

### Required
* [ ] Rest API for at least one resource
  * [x] GET
  * [X] POST
  * [ ] DELETE
  * [ ] PUT
  * [ ] Proper status codes (404, 409, 200, 201 with Location, 204)
* [x] Internal three tier layer architecture (or corresponding which simplifies testing of different layers).
* [x] Dependency injection (or corresponding for each test to simplify testing and configuration).
* [x] SQL database, preferably with ORM (NOSql might be fine)
* [x] Validation of dtos
* [x] Tests
  * [x] Unit tests where appropriate
  * [x] API Tests (Rest layer)
  * [x] Database integration tests (h2 in memory is fine)
* [ ] Pipeline running in Gitlab: https://docs.gitlab.com/ee/user/packages/workflows/monorepo.html
  * [x] Build
  * [ ] Test with reports
  * [x] Sonar analysis, with code coverage 
* [x] Containerization
  * [x] Build container
  * [x] Push to container registry

### Optional
* [ ] Swagger
* [ ] GraphQL API
* [ ] Metrics
* [ ] Securing the API
* [ ] HATEOAS
* [ ] Profile support for different dev properties (h2 database, mocking of data...)
* [ ] External integration (http, messaging)
* [ ] Database migrations
