const { google } = require("googleapis");

const createDriveClient = async (
  clientId,
  clientSecret,
  redirectUri,
  refreshToken
) => {
  const client = new google.auth.OAuth2({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  });

  client.setCredentials({ refresh_token: refreshToken });
  const driveClient = await google.drive({
    version: "v3",
    auth: client,
  });

  const sheetClient = await google.sheets({
    version: "v4",
    auth: client,
  });
  return {
    client,
    driveClient,
    sheetClient,
  };
};

module.exports = createDriveClient;
