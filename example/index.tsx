import { createLogger } from '../.';

const logger = createLogger({
	level: 'TRACE'
});

logger.info({ systemsOnline: true }, 'Booting up system...');
logger.warn({ errorCode: 1 }, 'Filters were not loaded.');
logger.error({ cause: '...' }, 'Failed to update recipient!');
logger.debug('AuthModule', { doesThisWork: true }, 'Now...was this called?');
logger.trace({ thing: 1 }, "What's up with this?");
