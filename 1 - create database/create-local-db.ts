import * as pg from "pg";
import knex from "knex";

import { serverLogger } from "../../src/logger";
import { getDbConfigOptions } from "../../src/config/generate-config";

const createLocalDb = async (): Promise<void> => {
  const options = await getDbConfigOptions();

  const pgClient = new pg.Client({ ...options, database: "postgres" });

  try {
    await pgClient.connect();
    await pgClient.query(`CREATE DATABASE "${options.database}"`);
  } catch (error) {
    serverLogger.error(error);
  } finally {
    await pgClient.end();
  }

  const db = knex({ connection: await getDbConfigOptions(), client: "pg" });
  await db.migrate.latest({ directory: "scripts/db/migrations" });
  await db.destroy();
};

createLocalDb();
