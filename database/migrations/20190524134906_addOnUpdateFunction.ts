import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
      NEW.modified = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `
  return knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION)
}

export async function down(knex: Knex): Promise<any> {
  const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`
  return knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION)
}
