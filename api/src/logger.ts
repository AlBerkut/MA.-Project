import { getLogger } from 'log4js';

const logger = getLogger();

logger.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

export default logger;
