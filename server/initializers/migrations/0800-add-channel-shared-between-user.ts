import * as Sequelize from 'sequelize'

async function up (utils: {
  transaction: Sequelize.Transaction
  queryInterface: Sequelize.QueryInterface
  sequelize: Sequelize.Sequelize
}): Promise<void> {
  {
    const query = `
    CREATE TABLE IF NOT EXISTS "videoChannelSharedBetweenUsers"(
      "id" serial,
      "videoChannelId" INTEGER NOT NULL REFERENCES "videoChannel" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE,
      "userId" INTEGER NOT NULL REFERENCES "user" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE,
      "createdAt" timestamp with time zone NOT NULL,
      "updatedAt" timestamp with time zone NOT NULL,
      PRIMARY KEY ("id")
    );
    `

    await utils.sequelize.query(query, { transaction : utils.transaction })
  }
}

function down (options) {
  throw new Error('Not implemented.')
}

export {
  up,
  down
}
