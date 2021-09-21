import React, { useEffect, useState, useCallback, useRef } from "react";
import { Animated, StyleSheet, View, Dimensions, TouchableOpacity, Image } from "react-native";
import MapView from "react-native-maps";
import CustomMarker from './CustomMarker';
import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapViewDirections from "react-native-maps-directions";


const Map = () => {

   const APIKEY = "AIzaSyD_Uf7-gpYZuPGFJJ4D6neQs1h6S46zCd4";

   const [destinationLocation, setDestinationLocation] = useState(null);
   const [selectedDestination, setSelectedDestination] = useState(null);
   const [mapReady, setMapReady] = useState(false);
   const [shouldFitMarkers, setShouldFitMarkers] = useState(true);
   const [followUserLocation, setFollowUserLocation] = useState(true);
   const [camera, setCamera] = useState({
      center: {
         latitude: 0,
         longitude: 0
      },
      pitch: 0,
      heading: 0,
      altitude: 1000,
      zoom: 16,
   });

   const mapRef = useRef(null);

   const { width, height } = Dimensions.get('window');


   useEffect(() => {
      //Criando a função para iniciar o monitoramento da localização usuário
      const startTracking = async () => {
         let { status } = await requestForegroundPermissionsAsync();
         //Obtendo permissões de localização, é necesário que a permissão do usuário seja concedida para que possamos obter sua localização
         if (status !== 'granted') {
            alert('Permissões para acessar a localização foram negadas.');
            return;
         }
         try {
            /* A função abaixo realiza o monitoramento da posição atual do usuário de acordo com os parâmetros
               e retorna uma callback sempre que obtém a localização, a partir da callback iremos obter um objeto do tipo LocationObject */
            await watchPositionAsync({
               accuracy: Accuracy.Highest,
               timeInterval: 5000,
               distanceInterval: 50,
            }, (loc) => {
               setCamera(prevCamera => ({
                  ...prevCamera,
                  center: {
                     latitude: loc.coords.latitude,
                     longitude: loc.coords.longitude,
                  }
               }));
            }
            );
         } catch (err) {
            console.warn('Algo deu errado...')
         }
      }
      startTracking();
   }, []);

   //Selecionando um marcador para que seja exibido um botão e então setar o destino
   const selectDestination = (latitude, longitude) => {
      setSelectedDestination({
         latitude: latitude,
         longitude: longitude
      })
   }
   //Definindo um destino para o marcador selecionado
   const getDirections = () => {
      setDestinationLocation(selectedDestination)
      setShouldFitMarkers(true);
      setFollowUserLocation(false);
   }
   const removeDirections = () => {
      setFollowUserLocation(false);
      setDestinationLocation(false);
      setSelectedDestination(false);
   }
   const handleMapReady = useCallback(() => {
      setMapReady(true);
   }, [mapRef, setMapReady]);

   const handleMapCamera = async ({ isGesture }) => {
      const camera = await mapRef.current.getCamera();
      setCamera(prevCamera => ({
         ...prevCamera,
         heading: camera.heading,
         pitch: camera.pitch,
         altitude: camera.altitude ? camera.altitude : 0,
         zoom: camera.zoom
      }));
      if (followUserLocation) {
         if (isGesture) {
            setFollowUserLocation(false);
         }
      }
   }
   const handleFollowUserLocation = () => {
      if (mapRef.current) {
         mapRef.current.animateCamera({
            center: {
               latitude: camera.center.latitude,
               longitude: camera.center.longitude,
            },
            pitch: camera.pitch,
            heading: camera.heading,
            altitude: camera.altitude,
            zoom: camera.zoom <= 13 ? 17 : camera.zoom, //Aproximando a câmera caso ela esteja muito distante
         }, { duration: 2000 });
      }
      setTimeout(() =>{
         setFollowUserLocation(true)
      }, 5000);
   }

   return (
      <>
         <MapView
            style={mapReady ? styles.map : {}}
            camera={followUserLocation ?
               camera
               :
               null
            }
            showsUserLocation={true}
            showsMyLocationButton={false}
            zoomControlEnabled={true}
            ref={mapRef}
            //Chamando a função handleMapReady quando o mapa estiver totalmente carregado
            onMapReady={handleMapReady}
            onRegionChangeComplete={(region, isGesture) => handleMapCamera(isGesture)}
         >
            <CustomMarker
               latitude={-23.5544}
               longitude={-46.6296}
               color={"#0F9D58"}
               id={'1'}
               onPress={selectDestination}
            >
            </CustomMarker>
            <CustomMarker
               latitude={-23.5583}
               longitude={-46.6282}
               id={'2'}
               onPress={selectDestination}
            >
            </CustomMarker>

            {destinationLocation ?
               <MapViewDirections
                  origin={
                     camera.center
                  }
                  destination={
                     destinationLocation
                  }
                  apikey={APIKEY}
                  strokeWidth={3}
                  strokeColor="#4285F4"
                  lineDashPattern={[0]}
                  //Define se o Google Maps API deve reorganizar os waypoints para obter uma rota mais rápida
                  optimizeWaypoints={true}
                  //Define se a MapView.Polilyne deve resetar ou não na hora de calcular a rota, se as linhas apresentarem bugs sete o valor para false
                  resetOnChange={false}
                  onError={(errorMessage) => {
                     alert('Erro ao obter direções...');
                  }}
                  //Centralizando os marcadores após definir a rota
                  onReady={result => {
                     if (shouldFitMarkers) {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                           edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                           }
                        })
                        handleMapCamera(false);
                        setShouldFitMarkers(false)
                     }
                  }}
               >
               </MapViewDirections>
               :
               null
            }
         </MapView>
         <View style={styles.buttonWrapper}>
            {selectedDestination && destinationLocation ?
               <TouchableOpacity
                  style={[styles.mapButton, { backgroundColor: '#DB4437', height: 40, width: 40 }]}
                  onPress={() => removeDirections()}
               >
                  <Image style={styles.icon} source={require('../assets/clear.png')}>
                  </Image>
               </TouchableOpacity>
               :
               null
            }
            {selectedDestination ?
               (
                  <TouchableOpacity
                     style={[styles.mapButton, { backgroundColor: '#4285F4' }]}
                     onPress={() => getDirections()}
                  >
                     <Image style={styles.icon} source={require('../assets/directions.png')}>
                     </Image>
                  </TouchableOpacity>
               )
               :
               null
            }
            <TouchableOpacity
               style={[styles.mapButton, { backgroundColor: '#fff' }]}
               onPress={() => handleFollowUserLocation()}
            >
               <Image style={styles.icon} source={require('../assets/my-location.png')}>
               </Image>
            </TouchableOpacity>
         </View>
      </>
   );
}
const styles = StyleSheet.create({
   map: {
      ...StyleSheet.absoluteFillObject,
   },
   buttonWrapper: {
      position: 'absolute',
      bottom: 120,
      right: 0,
      marginRight: 10,
      alignItems: 'center'
   },
   mapButton: {
      width: 55,
      height: 55,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   icon: {
      width: 25,
      height: 25,
      resizeMode: 'stretch'
   },

});


export default Map;