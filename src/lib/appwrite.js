
import { Client, Account, TablesDB, ID, Query,  Permission,Role } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6acba69b003b9c83899b");

export const account = new Account(client);
export const tablesDB = new TablesDB(client);

export const DATABASE_ID = "6acba7c40023f04db6a1";
export const TABLE_ID = "6acbb06f00046a5f37fc";

export { ID, Query,  Permission,Role };

// Databbase id 6acba7c40023f04db6a1
// Collection id 6acbb06f00046a5f37fc
// Project id 6acba69b003b9c83899b
