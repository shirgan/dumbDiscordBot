import { createContainer, asValue } from 'awilix';

const initDi = ({discord, discordClientSettings, giphySettings}, mediator) => {
  mediator.once('init', (logger) => {
    const bootstrapContainer = createContainer();
    const connectionsContainer = createContainer();

    bootstrapContainer.register({
      discord: asValue(discord),
      discordClientSettings: asValue(discordClientSettings),
      giphySettings: asValue(giphySettings),
      logger: asValue(logger)
    });

    bootstrapContainer.cradle.discord.connect(mediator);

    mediator.emit('boot.ready', bootstrapContainer, connectionsContainer);
  });
};

export default initDi;