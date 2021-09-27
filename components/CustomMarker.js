import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

function CustomMarker(
  {
    id,
    latitude,
    longitude,
    color,
    onPress,
  }) {


  return (
    <Marker
      identifier={id}
      key={id}
      //Definindo as coordenadas do marcador
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      //Chamando a funcão para selecionar o marcador
      onPress={() => onPress(latitude, longitude)}
      /* 
        Permite que os marcadores personalizados monitorem alterações visuais e sejam redesenhados,
        para obter maior performance é recomendado deixar a propriedade desativada
      */
      tracksViewChanges={false}
    >
      <View style={styles.markerWrapper}>
        {/* Adicionando uma cor personalizada de acordo com as props */}
        <View style={[
          styles.markerBody,
          {
            backgroundColor: color || "#4285F4", //Caso nenhuma cor seja passada via props, o marcador será exibido na cor azul
          },
        ]}>
          <View style={styles.markerDot}></View>
        </View>
        <View style={[
          styles.markerArrow,
          {
            borderBottomColor: color || "#4285F4",
          }
        ]}>
        </View>
      </View>
      {/* Caso queira customizar totalmente a aparência de um Callout através de seus filhos, atribua à ele a propriedade tooltip=true */}
      {/* <Callout  style={styles.callout}>
        <View>
          <Text style={styles.title}>Meu primeiro marcador :D </Text>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
      </Callout> */}
    </Marker>
  );
}

const styles = StyleSheet.create({

  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  markerBody: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: "180deg" }],
    marginTop: -10,
  },
  callout: {
    width: 250,
    height: 100,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 5
  }

});

/* As props de nosso componente não sofrerão alteração durante o tempo de execução, 
então utilizaremos o React.memo para evitar renderizações desnecessárias */
export default CustomMarker = React.memo(CustomMarker);