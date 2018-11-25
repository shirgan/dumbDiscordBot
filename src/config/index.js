
import {discordClientSettings, giphySettings, logSettings} from './config';
import {initDi} from './di';
import * as discord from './discord/index';

const init = initDi.bind(null, {discord, discordClientSettings, giphySettings, logSettings});

export {init, logSettings};