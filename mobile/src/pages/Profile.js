import React from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview';

export default function Profile({ route, navigation }) {
    const { github_username } = route.params
    if(!github_username || !github_username.length != 0) return navigation.navigate('Mains')
    return <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${github_username}` }}/>
}
 