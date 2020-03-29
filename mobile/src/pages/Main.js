import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location' //[1] => faz uma requisição ao usuario para saber alguma coisa delete; [2] => pegar a posição do usuario
import { MaterialIcons } from "@expo/vector-icons"

import api from '../services/api'
import { connect, disconnect, subscribeToDevs } from '../services/socket'

export default function Main({ navigation }){
    const [ devs, setDevs ] = useState([])
    const [ currentReg, setCurrentReg ] = useState({})
    const [ techs, SetTechs ] = useState('')
    /*const [ style, setStyle ] = useState({
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: "row"
    })*/
    
    useEffect(() => {
        async function loadInitialPos(){
            const { granted } = await requestPermissionsAsync()

            if ( granted ) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })
                const { latitude, longitude } = coords

                setCurrentReg({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04, //calculos navais para pegar o zoom
                    longitudeDelta: 0.04  //
                })
            }
        }

        loadInitialPos()
    }, [])

    useEffect(() => {
        subscribeToDevs(dev => setDevs([...devs, dev]))
        async function getThings() {
            if (currentReg) {
                const { latitude, longitude } = currentReg
                const response = await api.get('/search', {
                    params: {
                        latitude,
                        longitude,
                        techs
                    }
                })
                setDevs(response.data.devFilter)
            }
        }
        getThings()
    }, [devs])

    /*useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => {
            setStyle({
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                zIndex: 5,
                flexDirection: "row"
            })
        })
    
        Keyboard.addListener('keyboardDidHide', () => {
            setStyle({
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                zIndex: 5,
                flexDirection: "row"
            })
        })
    },[])*/

    function setupSocketIO() {
        disconnect()
        const { latitude, longitude } = currentReg
        connect(
            latitude,
            longitude,
            techs
        )
    }
    
    async function loadDevs() {
        const { latitude, longitude } = currentReg
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        })
        setupSocketIO()
        setDevs(response.data.devFilter)
    }

    function handleRegionChange(reg) {
        setCurrentReg(reg)
    }

    if(!currentReg) return null

    return (
        <>
        <View style={styles.viewStyle}>
            <MapView 
                onRegionChangeComplete={handleRegionChange} 
                style={styles.mapStyle} 
                initialRegion={currentReg}
            >
                {devs.map(dev => (
                    <Marker 
                        key={dev._id}
                        coordinate={{ 
                            latitude: dev.location.coordinates[0], 
                            longitude: dev.location.coordinates[1]
                        }}
                    >
                    <Image source={{ uri: dev.avatar_url }} style={styles.devImgStyle}/>
                    <Callout onPress={() => navigation.navigate('Profile', { github_username: dev.github_username })}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text> 
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>     
                        </View>    
                    </Callout> 
                </Marker>
                ))}
            </MapView>
        </View>

        <View style={styles.searchForm}>
            <TextInput 
                style={styles.searchInpt}
                placeholder="Buscar devs"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={SetTechs}
            />

            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#FFF"/>
            </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.navigateButton}
            onPress={() => navigation.navigate('Register')}  
        >
            <Text style={styles.textStyle}>
                Register A Dev
            </Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1
    },
    mapStyle: {
        flex: 1
    },
    devImgStyle: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "#FFF"
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devTechs: {
        marginTop: 5
    },
    devBio: {
        color: "#666",
        marginTop: 5
    },
    searchForm: {
       position: 'absolute',
       top: 20,
       left: 20,
       right: 20,
       zIndex: 5,
       flexDirection: "row",
    },
    searchInpt: {
        flex: 1,
        height: 50,
        backgroundColor: "#fff",
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 3,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: "#8e4dff",
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 15,
    },
    navigateButton: {
        position: "absolute",
        top: 100,
        left: 70,
        width: 200,
        height: 25,
        backgroundColor: "#8e4dff",
        borderRadius: 5
    },
    textStyle: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    }
})