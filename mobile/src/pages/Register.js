import React from 'react'
import { WebView } from 'react-native-webview'

export default function Register() {
    return <WebView source={{ uri: 'http://192.168.15.3:3000' }} style={{ flex: 1 }}/>
}
