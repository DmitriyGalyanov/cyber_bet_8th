import {createSlice} from '@reduxjs/toolkit';


export const webViewSlice = createSlice({
	name: 'webViewData',
	initialState: {
		remoteConfigUrl: '',
		deepLinkGatheredData: '',

		finalUrl: '',

		shouldRenderWebViewExclusively: false,
	},

	reducers: {
		setRemoteConfigUrl: (state, action) => {
			state.remoteConfigUrl = action.payload;
		},
		setDeepLinkGatheredData: (state, action) => {
			state.deepLinkGatheredData = action.payload;
		},

		setFinalUrl: (state, action) => {
			state.finalUrl = action.payload;
		},

		setShouldRenderWebViewExclusively: (state, action) => {
			state.shouldRenderWebViewExclusively = action.payload;
		},
	},
});

export const {
	setRemoteConfigUrl,
	setDeepLinkGatheredData,

	setFinalUrl,

	setShouldRenderWebViewExclusively,
} = webViewSlice.actions;

export const selectWebViewData = state => state.webViewSlice;

export default webViewSlice.reducer;