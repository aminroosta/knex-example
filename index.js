const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./data.db",
  },
});

// arelationship is usually implemented by having a foreign key
// reference another table's primary key.
// If we make the foreign key unique, the relationship will be one to one.
async function example_one_to_one() {
  await knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("name");
    })
    .createTable("accounts", (table) => {
      table.increments("id");
      table.string("name");
      // here we have a foreign key to another table's primary key
      // the foreign key is unique, therefore the relationship is one to one.
      table.integer("user_id").unsigned().unique().references("users.id");
    });

  const insertedRows = await knex("users").insert({ name: "Tim" });
  // ...and using the insert id, insert into the other table.
  await knex("accounts").insert({
    name: "knex",
    user_id: insertedRows[0],
  });

  // Query both of the rows.
  const selectedRows = await knex("users")
    .join("accounts", "users.id", "accounts.user_id")
    .select("users.name as user", "accounts.name as account");

  console.log(selectedRows);
}

// run the exmaple
(async () => {
  try {
    await example_one_to_one();
  } catch (e) {
    console.error(e);
  }
})();
