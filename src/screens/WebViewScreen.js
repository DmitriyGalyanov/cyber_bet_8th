import React from 'react';

import {Text, View} from 'react-native';

import {WebView} from 'react-native-webview';

import {log} from '../logger';


/**
 * Creates a Full-Screen-sized WebView using passed url
 * @param {{url: string}} props
 */
export const WebViewScreen = React.memo(props => {
	const {url} = props;
	log.webViewScreen('\nWebViewScreen URL:', url, '\n');

	return (
		<View style={{flex: 1}}>
			{/* <Text>
				{url}
			</Text> */}
			<WebView
				source={{
					uri: url
				}}
				onLoadStart={() => log.webViewScreen('WebView load started')}
				onLoadEnd={() => log.webViewScreen('WebView load ended')}
			/>
		</View>
	)
})