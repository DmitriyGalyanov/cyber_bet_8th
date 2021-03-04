import { logger, consoleTransport } from 'react-native-logs';

export const log = logger.createLogger({
	severity: "debug",
	transport: consoleTransport,
	levels: {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
		returns: 4,
		component_state: 5, //change to AppInside state
		setters: 6,
		webViewScreen: 7,
		component_app_state: 8,
	},
	async: false, //true
	dateFormat: "local",
	printLevel: true,
	printDate: true,
	enabled: true,
});

import { FileLogger } from "react-native-file-logger";

FileLogger.configure();