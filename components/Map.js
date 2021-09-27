import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView from "react-native-maps";
import CustomMarker from './CustomMarker';
import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import Button from './Button';

const Map = () => {

   const APIKEY = "SUA CHAVE API";

   //Estado responsável por armazenar as informações da câmera do mapa
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
   //Estado responsável por armazenar a posição selecionar a posição de destino e exibir o botão obter direções
   const [selectedDestination, setSelectedDestination] = useState(null);
   //Estado responsável por armazenar as coordenadas de destino
   const [destinationLocation, setDestinationLocation] = useState(null);
   //Estado responsável por checar quando a primeira renderização do mapa foi realizada
   const [mapReady, setMapReady] = useState(false);
   //Estado responsável por controlar quando a câmera deve ser centralizada entre duas coordenadas(posição atual e marcador de destino)
   const [shouldFitMarkers, setShouldFitMarkers] = useState(true);
   //Estado responsável por controlar quando a câmera deve seguir o usuário 
   const [followUserLocation, setFollowUserLocation] = useState(true);

   //Definindo uma referência para o mapa para que possamos utilizar seus métodos
   const mapRef = useRef(null);

   //Altura de largura da janela da aplicação
   const { width, height } = Dimensions.get('window');

   useEffect(() => {
      const startTracking = async () => {
         //Obtendo permissões de localização, é necesário que a permissão do usuário seja concedida para que possamos obter sua localização
         let { status } = await requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            alert('Permissões para acessar a localização foram negadas.');
            return;
         }
         try {
            /* A função abaixo realiza o monitoramento da posição atual do usuário de acordo com os parâmetros fornecidos
               e retorna uma callback sempre que obtém a localização, a partir da callback iremos obter um objeto contendo as coordenadas */
            await watchPositionAsync({
               accuracy: Accuracy.Highest,
               timeInterval: 5000,
               distanceInterval: 10,

            }, (loc) => {
               /*
                  Setando o estado da câmera a partir do operador spread, pois desejamos manter as demais propriedades da câmera intactas,
                  senão o utilizarmos o spread precisaremos definir as demais propriedas novamente, 
                  fugindo do nosso objeto de criar uma câmera dinâmica
               */
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

   //Selecionando um marcador que poderá ser utilizado para criar uma rota
   const selectDestination = (latitude, longitude) => {
      setSelectedDestination({
         latitude,
         longitude,
      });
   }
   //Definindo as coordenadas de destino
   const getDirections = () => {
      //Após defirnir o estado destinationLocation o <MapViewDirections> irá traçar uma rota
      setDestinationLocation(selectedDestination);
      setShouldFitMarkers(true);
      //Setar como falso para evitar que a câmera volte ao usuário
      setFollowUserLocation(false);
   }

   //Removendo o marcador selecionado e a rota
   const removeDirections = () => {
      setDestinationLocation(false);
      setSelectedDestination(false);
   }

   /* 
      Setando o estado mapReady para forçar o mapa a realizar um nova renderização
      utilize apenas se optar por usar os botões nativos do React Native Maps
   */
   const handleMapReady = useCallback(() => {
      setMapReady(true);
   }, [mapRef, setMapReady]);

   /*
      Obtendo MapView.camera e copiando seus valores para o estado camera
      para que possamos manter um câmera dinâmica
   */
   const handleMapCamera = async ({ isGesture }) => {
      const cameraRef = await mapRef.current.getCamera();
      setCamera(prevCamera => ({
         ...prevCamera,
         heading: cameraRef.heading,
         pitch: cameraRef.pitch,
         altitude: cameraRef.altitude ? cameraRef.altitude : 0,
         zoom: cameraRef.zoom
      }));
      //Se a câmera estiver fixa e for detecado um gesto, significa que o usuário deseja navegar livremente pelo mapa
      if (followUserLocation && isGesture) {
         setFollowUserLocation(false);
      }
   }
   //Função responsável por realizar uma animação até a posição atual do usuário e fixar a câmera 
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
            zoom: camera.zoom <= 13 ? 17.6 : camera.zoom, //Aproximando a câmera caso ela esteja muito distante
         }, { duration: 2000 });
      }
      /* 
         O método animateCamera() não possui callback, então não sabemos quando a animação de fato terminou 
         por isso utilizaremos um setTimeout setando o estado após 3 segundos
      */
      setTimeout(() => {
         setFollowUserLocation(true);
      }, 3000)
   }

   return (
      <>
         <MapView
            style={mapReady ? styles.map : {}}
            // style={styles.map}
            camera={followUserLocation ?
               camera
               :
               null
            }
            //Mostrar posição atual do usuário
            showsUserLocation={true}
            //Escondendo o botão de ir até a localização atual
            showsMyLocationButton={false}
            //Ativando botões de zoom nativos do mapa
            zoomControlEnabled={true}
            ref={mapRef}
            //Chamando a função handleMapReady será chamada quando o mapa estiver totalmente carregado
            onMapReady={handleMapReady}
            //Chamando a função handleMapCamera quando a region (câmera) do mapa mudar, seja através de gesto ou de forma automática 
            onRegionChangeComplete={(region, isGesture) => handleMapCamera(isGesture)}
            /*Se o usuário estiver com um marcador selecionado e tocar no mapa quando não houver uma rota definida 
               o estado que armazena as coordenadas do marcador será limpo */
            onPress={!destinationLocation ? () => setSelectedDestination(null) : null}
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
            <CustomMarker
               latitude={-20.902314}
               longitude={-51.376989}
               id={'2'}
               onPress={selectDestination}
            >
            </CustomMarker>

            {/* Calculando rota apenas quando o estado destinationLocation possuir as coordenadas */}
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
                  /*Define se a MapView.Polilyne deve resetar ou não na hora de calcular a rota, 
                  se as linhas apresentarem bugs sete o valor para false*/
                  resetOnChange={false}
                  //Definindo uma rota com maior precisão, evitando que a rota mostrada "corte caminho" pelo mapa
                  precision={'high'}
                  onError={(errorMessage) => {
                     alert('Erro ao obter direções...');
                  }}
                  //Centralizando a posição atual e o marcador de destino após obter a rota com sucesso
                  onReady={result => {
                     if (shouldFitMarkers) {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                           edgePadding: {
                              right: (width / 10),
                              bottom: (height / 10),
                              left: (width / 10),
                              top: (height / 10),
                           }
                        })
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
            {/* Botão remover rota, necessário possuir uma rota selecionada para ser exibido */}
            {selectedDestination && destinationLocation ?
               <Button
                  backgroundColor={'#DB4437'}
                  heigth={40}
                  width={40}
                  icon={require('../assets/clear.png')}
                  onPress={() => removeDirections()}
               />
               :
               null
            }
            {/* Botão obter localização, necessário possuir um marcador selecionado para ser exibido */}
            {selectedDestination ?
               <Button
                  backgroundColor={'#4285F4'}
                  icon={require('../assets/directions.png')}
                  onPress={() => getDirections()}
               />
               :
               null
            }
            {/* Botão para centralizar a posição atual do usuário */}
            <Button
               icon={require('../assets/my-location.png')}
               onPress={() => handleFollowUserLocation()}
            />
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
      alignItems: 'center',
      elevation: 10
   }
});


export default Map;