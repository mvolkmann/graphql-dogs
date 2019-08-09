const fs = require('fs');
const PgConnection = require('postgresql-easy');

const dbConfig = {database: 'dogs', user: 'postgres'};
const pg = new PgConnection(dbConfig);

const filePath = process.argv[2];
if (!filePath) {
  console.error('usage: node load-db {file-path}');
  process.exit(1);
}

const json = fs.readFileSync(filePath);
const data = JSON.parse(json);

async function load() {
  for (const family of data.families) {
    const {address, dogs, people} = family;
    const addressId = await pg.insert('address', address);
    const familyId = await pg.insert('family', {addressId});
    for (const person of people) {
      await pg.insert('person', {...person, familyId});
    }
    for (const dog of dogs) {
      await pg.insert('dog', {...dog, familyId});
    }
  }

  process.exit(0);
}

load();
