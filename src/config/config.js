const discordClientSettings = {
  discordClientId: process.env.clientId || null,
};

const giphySettings = {
  apiKey: 'dc6zaTOxFJmzC' // apologies to whomever this belongs to, it was on a public github and I am too lazy to make an account
};

const logSettings = {
  writeToFile: false || process.env.WRITETOFILE,
  logColors: process.env.LOGCOLORS === 'false' ? 'none': 'all',
};

export {discordClientSettings, giphySettings, logSettings};