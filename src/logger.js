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
		webview_data_from_storage: 6,
		setters: 7,
		webViewScreen: 8,
		component_app_state: 9,
		component_game_state: 10,
	},
	async: false, //true
	dateFormat: "local",
	printLevel: true,
	printDate: true,
	enabled: true,
});

import { FileLogger } from "react-native-file-logger";

FileLogger.configure();