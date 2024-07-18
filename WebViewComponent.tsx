// import React from 'react';
// import {Linking, StyleSheet, View, StatusBar} from 'react-native';
// import WebView from 'react-native-webview';

// const WebViewComponent: React.FC = () => {
//   const handleShouldStartLoadWithRequest = (request: any) => {
//     // Open external links in the browser, otherwise open in the WebView
//     const isExternalLink = !request.url.startsWith(
//       'https://hey.speak-to.ai/valto',
//     );
//     if (isExternalLink) {
//       Linking.openURL(request.url);
//       return false;
//     }
//     return true;
//   };

//   return (
//     <View style={styles.container}>
//       {/* <StatusBar hidden={true} /> */}
//       <WebView
//         source={{uri: 'https://hey.speak-to.ai/valto'}}
//         style={styles.webview}
//         scalesPageToFit={true}
//         startInLoadingState={true}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
//         hideKeyboardAccessoryView={true}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   webview: {
//     flex: 1,
//   },
// });

// export default WebViewComponent;
