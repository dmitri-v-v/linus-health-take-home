# Backend Engineer Coding Exam

In this exam we want you to demonstrate your proficiency in SQL and in API design.

## What is provided for you
We have provided a head start on a server and database for you, 
including a typescript project with some preconfigured dependencies 
([express](https://www.npmjs.com/package/express), [knex](https://www.npmjs.com/package/knex), 
[sqlite3](https://www.npmjs.com/package/sqlite3), [jest](https://www.npmjs.com/package/jest)).

We used NPM to configure this repository (lock file), but if you prefer to use something else (yarn, pnpm) that is okay.

There is a sample route for a health check that confirms the database is up and returns a status [here](src/routes/index.ts).
If you have other libraries you have experience with and prefer feel free to use them.

## Part 1 Database schema and seed data

We want to see you build a database schema to store patient records.  We have provided some data in [here](src/db/seeds/data.json) 
that comprised of a list of fake patient records, with each record containing basic patient demographics, appointment day, 
hospital location, and their provider's demographic information.

Example patient record:
```
{
  "given": "Priscilla",
  "family": "Kelly",
  "birthDate": "1974-03-11",
  "appointment": "2022-01-30",
  "mrn": 73909,
  "location": "Joan Health System",
  "generalPractitioner": {
    "given": "Donald",
    "family": "Paiz",
    "npi": 22954
  }
}
```

Each field in the above example patient is a required field across all patient records.

`mrn` is a unique identifier that references a single patient at a given health system.
Please ensure this value is unique in the database.

`npi` is a unique identifier that references a single provider at a given health system.
Please ensure this value is unique in the database.

Using the data provided in `src/db/seeds/data.json`, programmatically load the data 
into SQL-like database of your choice, we have provided a head start with sqlite3 and knex, 
but if you feel more comfortable with something else feel free to use it.

The database must be able to run locally on your machine.

If you choose to move forward with sqlite3 and knex you can follow the example in `src/db/migrations` 
for how to build the schema and `src/db/seeds` for seeding data.
Feel free to use the knex api or `knex.raw` to write the queries manually.

## Part 2 API Design and implementation

Now that we have a database schema and seeded data we want to create a local API endpoint 
to front the database from Part 1 that satisfies the following requirements:

* Find a list of patients filtering by `given name`, `family name`, and/or `birthdate`
* Find a patient by their `mrn`
* Find a list of patients by the practitioner's `npi`
* Find the list of appointments by a date range
* Find a list of all practitioners by location name

## Submission Criteria

You can choose any technology stack to implement this assignment.
Feel free to throw away the head starts provided and implement from scratch, 
but we place an emphasis on code quality, readability, design, and documentation.

In your submission, you must include:

* All code that you created for Part 1 and Part 2. There should be comments or annotations throughout your code.
* Unit tests for Part 2.
* A README file with:
  1. Setup instructions for Part 1
  2. Instructions on how to run your code in Part 2
  3. The reasons for your technical decisions in designing Parts 1 and 2
  4. Relevant notes about your solution. If there is any ambiguity, make a note of your assumptions.

You do not need to worry about building a frontend or authentication for this assignment.

