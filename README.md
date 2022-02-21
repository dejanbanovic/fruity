# Prerequisites

Running this API server requires following:

- Node.js 16 (Check version with: `node -v`)
- npm 8 (Check version with: `npm -v`)
- Database hosted on PostgreSQL 14,

# Setup

After cloning repo run `npm install`. \
Then create `.env` file in the repository root, with correct settings to access the PostgreSQL instance. User has to be an owner of the database in PostgreSQL. Here is an example file:

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=fruity
PGUSER=fruity
PGPASSWORD=fruity
```

---

**IMPORTANT** \
`PGUSER` configured MUST be an owner of the database `PGDATABASE`. If the user is not owner, the migration scripts will not work.

---

To create a database structure run: \
`npm run db:migrate` \
After the database structure has been set up you can run `npm run start:dev` which will run the application on port 3000 and make API available to testing. There is also a SwaggerUI page available (http://localhost:3000/api).

# Tests

Application also has quite an extensive list of e2e tests. To thoroughly test the application it is neccessary that the database has some set of test data. This data is provided in the script `db\test.sql` which completely resets the database configured in the `.env` file and prepares it for e2e test execution. This can also be done quickly with `npm run db:test`. After the database is setup for test execution, e2e test can be launched with `npm run test:e2e`. Those two commands are also set up to run sequentially with `npm run test:e2e:clean`
