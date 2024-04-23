# Dmitri Vassiliev's Linus Health Coding Exam Solution

Side note: Prior to this I haven't used `knex` library, so some of this was me just learning how to use it.

Also, I did not add any additional packages to the project other than the ones it came with. Sometimes there are very strict rules about which third=party packages can be added and which can't, so I decided to err on the side of safety, especially since all of the functionality could be added without any more. They would only be needed for niceties/extras.

I created a git repo in this project, so you should be able to look at all my commits if you were interested.

## Setup Instructions

Run `npm install`.

## Run Instructions

Run `npm start`.

## Technical Decisions

### Part 1: Database Schema

* I decided to have two tables: `patient` and `provider`. It seemed like the most simple solution to enable the desired functionality while keeping the data well-organized. The `patient` table has a FK to the `provider` table for the "general practitioner". I considered adding an additional table for `appointment` where it would be a FK to the patient and a FK to the provider tables, with a location and appointment date, but for this scope it seemed like unnecessary complexity. If I saw that `data.json` contained entries for the same patient but with different appointment dates and locations, then I would infer that we'd need a separate table to capture that information.

* I decided for the `patient` and `provider` tables to have separate auto-incrementing `id`s as the PK, for a few reasons:
    1. It makes it easier to anonymize logs and such if you can refer to an arbitrary `id` rather than the identifying `mrn` or `npi`. 
    2. It allows to change either `npi` or `mrn` value (in case it was entered incorrectly) for a patient or provider without too much hassle, and without redoing FK references.
    3. Doing joins on a numerical `id` usually performs better than on string values.

* Obviously the `mrn` and `npi` columns needed a unique index constraint on them.

* I also decided to log each migration script after it was completed as that helps to figure out what the state of the DB is.

### Part 2: Seeding Script

* I decided to clear the tables before seeding just to start with a clean slate every server startup. In real deployments you would most definitely not want to do that.

* I decided to process the records in chunks of 100 to manage memory usage during the processing phase. When working with large dataset, the operations performed on the data can create additional memory overhead. 

* I decided to use the knex `merge` function on conflicting provider data (conflicts on npi). This often happens with typos in names and such.

* It only adds the patient if a provider was added for them, as I noticed that there were no records of patients without GPs.

* I wanted a log of records added, but without including sensitive patient or provider data, so I decided to hash the record data, so that you could still look up the log for a particular record by re-doing the hash of that record.

* In case future data files were enormous, I wanted to switch to using `JSONStream` to stream incoming data records rather than loading them all into memory at once.

* I noticed that there were mrn collisions when adding the patients, but they seemed like the colliding patient records were for completely different people, so without being able to discuss as to how this can happen, I decided to ignore the collisions, unlike with the providers.

### Part 3: Router

* From Phase Two requirements, I gathered that there were four types of information that would be returned:
    1. List of patients
    2. Patient Details
    3. List of appointments
    4. List of providers
and so the three API endpoint resources went along with them: `/patients`, `/appointments`, and `/providers`.

* I tried to add as much query parameter data validation as I could reasonably do in that time frame. It mostly focuses on making sure the params are strings, and that any dates are in proper date format. Any time an input was not valid, a 400 response is generated with an appropriate error message.

* I added Express middleware for error handling. This not only helps to manage uncaught errors, but also allows us to do things that would apply to ALL errors, such as sanitizing sensitive data from the message. 

### Part 3: Patients API Endpoint

* I realized that if `/patients` was called without any query params, it would return ALL the patients. If the DB contained millions of records, this is not something you want. So I decided to require at least one filter (i.e. query parameter) to be present in the request. Alternatively, I could have added paging to not have that restriction, but paging would then need to be applied to the other endpoints too for consistency in the responses, which would add a lot of complexity.

* I realized that the npi, although a provider property, could also be added to the patients endpoint and service since it dealt with getting a list of patients. It turned out elegantly as just another patients query parameter.

* For queries returning lists of patients, I decided to include only the core patient data, as usually these kinds of endpoints are used for list views, and so don't need entire patient dataset. Basically, if you could query by it, it was included in the data returned in the list (except the `npi`). That made the most sense.

* For the patient details endpoint, I decided not to include general practitioner info. This was a toss-up, but I leaned in this direction for efficiency, of both the implementation, and retrieval - with many many patient records, not having to do the join with provider table to get their details would result in a snappier application.

* I decided to return 404 for both not finding the patient by the specified MRN, and for list queries that returned no results. It seems a bit more consistent that if nothing matching the request was found, you get a 404 back.

* I made sure to order the patients array so that re-trying the same request would result in the same response. One, this makes it eaiser to add caching later, and two it makes it more consistent that, for example, refreshing a page would not give you results in an arbitrary order.

* There's a shortcut where if the `npi` was provided, but no providers matched it, we returned an empty list right away as we immediately knew that no way all the query parameter filters would be satisfied.

### Part 4: Appointments API Endpoint

* The list of appointments, even though technically patient data, became its own endpoint because it represented a different resource - appointments. In the future, if the appointment data became more complex, we wouldn't need to change the /patients endpoint at all.

* As such, I decided that the response of appointments would return relevant appointment data structured in a way to say "this is an appointment on this day, at this location, between this patient and this provider".

### Part 5: Providers API Endpoint

* I made the `location` query parameter required because again I didn't want to return all providers if no query params were provided at all without any paging.

* Again in the list response, I only included core provider data - first name, last name, and their npi.

## Unit Tests

* After quickly jotting down all the things that would need to be tested, I realized that it would take way more time than I had given the 2-3 hour time commitment, so I just stubbed them as what each unit test would test.

## To Dos:
Some things I would have wanted to add but didn't have time/scope for:

[x] Add any uncaught error handling via Express middleware functionality

[ ] Add a table for keeping track of completed data seeds so don't have to reseed on every server start.

[ ] Add input sanitizaton via `express-validator`

[ ] Switch to using absolute import paths via `module-alias` package.

[x] Anonymmize seeding logs (hash function?)

[ ] Use JSONStream to read the seed file.

[ ] Add indices to tables

[ ] Fix: `npm WARN deprecated @types/knex@0.16.1: This is a stub types definition. knex provides its own type definitions, so you do not need this installed.`

[ ] Fix `npm WARN deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs`
