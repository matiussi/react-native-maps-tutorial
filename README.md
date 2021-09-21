# Como utilizar React Native Maps com Expo

## O que iremos ver

- [Visão Geral](#visão-geral) 
- [Configurando o projeto](#configurando-o-projeto)
  - [Instalando o React Native](#instalando-o-react-native)
  - [Instalando as Dependências](#instalando-as-dependências)
  - [Rodando o projeto](#rodando-o-projeto)
- [Instanciando o mapa](#instanciando-mapa)
- [Adicionando marcadores](#adicionando-marcadores)
- [Obtendo a posição atual](#obtendo-a-posição-atual) 
- [Obtendo a posição em tempo real](#posicao-tempo-real)
- [Obtendo direções](#obtendo-direções)
- [Melhorando a interação com o mapa](#melhorando-a-interação-com-o-mapa)

## Visão Geral

discorrer sobre alguma coisa da qual eu ainda não sei.
Primeiramente iremos aprender como exibir um mapa utilizando o componente `React Native Maps`, também veremos como criar um marcador personalizado.
Em seguida vamos utilizar a API `expo-location` para que possamos obter a localização atual do usuário, com a localização atual em maõs depois iremos aprender a criar rotas utilizando o `react-native-maps-directions`. Para finalizar vamos aprender a controlar a câmera para dar maior liberdade ao usuário.

## Configurando o projeto

### Instalando o React Native

Para instalar o React Native é super simples :D, basta instalar o Expo CLI utilizando o comandos comandos abaixo:

``` 
npm install -g expo-cli
```

ou

```
yarn global add expo-cli 
```

Com o Expo CLI instalado em sua máquina agora só precisaremos criar um novo projeto, para isto basta utilizar os comandos:

```
expo init react-native-maps-tutorial

cd react-native-maps-tutorial
```

### Instalando as dependências

Antes de iniciarmos de fato a aplicação precisaremos instalar as seguintes dependências: 
- `expo-location`: API responsável por obter as informações de geolocalização
- `react-native-maps`: Componente responsável por apresentar as informações visuais, como mapa, marcadores e direções
- `react-native-maps-directions`: Componente responsável por calcular uma rota entre duas coordenadas, utilizando a **Google Maps API Directions**

```
expo install expo-location
expo install react-native-maps
npm install -react-native-maps-directions
ou
yarn install -react-native-maps-directions
```

### Rodando o projeto

Com as dependências instaladas podemos iniciar nossa aplicação a partir do comando:

```
npm start 

Caso esteja utilizando yarn:

yarn start
```


Após iniciarmos nossa aplicação a seguinte tela será apresentada:


<p align="center">
   <img alt="Dev tools" src="https://i.imgur.com/UeMDGOn.png" />
</p>
<p align="center">
	Dev Tools
</p>


Ao utilizar o Expo podemos facilmente rodar o projeto em nossos smartphones, para isso precisaremos apenas fazer o download do [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR&gl=US) e escanear o QR code apresentado. Caso possua algum emulador instalado em seu computador, primeiramente faça o download do Expo Go, em seguida selecione a opção **Run on Android device/emulator**. 
Após alguns instantes a seguinte tela será apresentada, indicando que nosso aplicativo foi iniciado com sucesso.


<p align="center">
   <img alt="Tela inicial" src="https://i.imgur.com/vWnWYrd.png" />
</p>
<p align="center">
   Tela inicial React Native
</p>

## Instanciando o mapa

De forma a deixar nosso código mais organizado, iremos separar o mapa e os marcadores em componentes, mas sinta-se a vontade para fazer da maneira que mais lhe agrada.
Criaremos uma pasta chamada components, e dentro dela vamos criar os arquivos `Map.js` e `CustomMarker.js`

<p align="center">
   <img alt="Tela inicial" src="https://i.imgur.com/oDHRK4f.png" />
</p>
<p align="center">
	Estrutura das pastas do projeto
</p>

Por hora iremos modificar apenas o arquivo `Map.js`, para exibir o mapa na tela é super simples, precisamos apenas importar um `MapView` e definir sua posição inicial utilizando `initialRegion` ou `initialCamera`. Neste exemplo utilizaremos `camera` ao invés de `region`, por ser mais fácil de ser manipulada e por possuir propriedades mais amigáveis, como zoom e rotação. 
A `camera` de nosso `MapView` contém as propriedades **obrigatórias** 
   - `center`: Recebe uma `latitude` e uma `longitude` que serão responsáveis por centralizar o mapa
   - `pitch`: Ângulo de inclinação da câmera
   - `heading`: Ângulo de rotação da câmera variando de `0` até `360`
   - `altitude`: Define a "zoom" da câmera quando estivermos utilizando o iOS MapKit, ignorado pelo Google Maps
   - `zoom`: Define o zoom da câmera quando estivermos utilizando o Google Maps 
  
Por fim, precisaremos definir um estilo ao nosso mapa para que ele possa ser exibido corretamente na tela, de modo a evitar futuras dores de cabeça iremos utilizar a propriedade `...StyleSheet.absoluteFillObject`, que consiste em definir uma posição absoluta e setar os atributos `top`, `right`, `bottom`, `left` iguais a 0.

📃 **/components/Map.js**
 ```javascript
 import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

const Map = () => {
   return ( 
      <MapView style={styles.map}
      initialCamera={{
        center:{
          latitude: 37.78825,
          longitude: -122.4324,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
        
      }}
    />
    );
}

const styles = StyleSheet.create({
   map: {
     ...StyleSheet.absoluteFillObject,
   },
 });

export default Map;
 ```


Agora só precisaremos importar o compontente Map.js no arquivo App.js

📃 **/App.js**
```javascript
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Map from './components/Map'

export default function App() {
  return (
    <View style={styles.container}>
      <Map></Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Voilà, nosso primeiro mapa foi criado com sucesso! **Algumas vezes as mudanças feitas em código podem não refletir no seu smartphone ou emulador, se isso vier a ocorrer selecione o terminal e pressione a tecla `r` para que os aplicativos sejam recarregados**.

<div style="text-align:center"><img alt="Tela inicial" src="https://i.imgur.com/tk3Relu.png" /></div>
<p style="text-align: center">
	Mapa com posição inicial manualmente
</p>


## Adicionando marcadores

Com nosso mapa em funcionamento chegou a hora de adicionarmos um marcador sobre ele, vamos acessar o arquivo `CustomMarker.js`, dentro dele importaremos um `Marker` a partir do `react-native-maps`, queremos que cada marcador seja único e possua uma posição distinta, ou estilo se for necessário, para isso iremos passar um id, uma latitude, uma longitude e uma cor via props do nosso componente. 
Um `<Marker>` permite que sejam adicionadas tags em seu corpo, neste exemplo criaremos um marcador utilizando apenas `Views`, também adicionaremos  um `Callout`, que exibirá uma janela personalizada quando clicarmos em um marcador, neste exemplo decidi criar um marcador do zero apenas para fins demonstrativos, vale ressaltar que um marcador pode possuir texto, imagens, etc... O limite é sua criatividade :D

📃 **components/CustomMarker.js**
```javascript
import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

const CustomMarker = (
  {
    id,
    latitude,
    longitude,
    color
  }) => {

  return (
    <Marker
      identifier={id}
      key={id}
      //Definindo as coordenadas do marcador
      coordinate={{ 
        latitude: latitude,
        longitude: longitude,
      }}
      style={styles.marker}
    >

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
      ]}></View>
      {/* Caso queira customizar totalmente a aparência de um Callout através de seus filhos, atribua à ele a propriedade tooltip=true */}
      <Callout  style={styles.callout}>
        <View>
          <Text style={styles.title}>Meu primeiro marcador :D </Text>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBody: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerDot:{
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

export default CustomMarker;
```

Em seguida basta realizar a importação do CustomMarker.js dentro do Map.js

📃 **components/Map.js**
```javascript
import CustomMarker from './CustomMarker';
```
Por fim basta criarmos um `<CustomMarker>` com as propriedades desejadas dentro do `<MapView>`

📃 **components/Map.js**
```javascript
<MapView>
...
  <CustomMarker
    latitude={37.78825}
    longitude={-122.4324}
    color={"#0F9D58"}
    id={'1'}
  >
  </CustomMarker>
</MapView>
```
___
<br>
<p align="center">
   <img alt="Mapa exibindo um marcador personalizado" src="https://i.imgur.com/3hzC2sJ.png" />
</p>
<p align="center">
	Mapa exibindo um marcador personalizado
</p>


## Obtendo a posição atual

Agora que já sabemos como criar um mapa e um marcador vamos partir para um exemplo mais interessante, ao invés de utilizarmos uma localização fixa como foi definido anteriormente, iremos obter a localização atual do usuário utilizando o método `watchPositionAsync()` da API `expo-location`.

Para que possamos utilizar o método `watchPositionAsync()` **é de extrema importância obter as permissões de localização do usuário**, portando esta é a primeira coisa que devemos fazer antes de obter a localização atual em si.

Após obtermos as permissões necessárias podemos partir para o método `watchPositionAsync(options, callback)` em si, neste exemplo utilizaremos apenas os seguintes parâmetros:
  - **options (objeto)**
    - **accuracy:** Acurácia a qual será obtida a localização, quanto maior o nível mais exata será a posição atual
    - **timeInterval:** Tempo mínimo de espera entre cada atualização em milissegundos 
    - **distanceInterval:** Realiza uma atualização se a localização mudou em X metros
  - **callback:** Função que é chamada a cada atualização da localização, recebe um objeto do tipo [Location Object](https://docs.expo.dev/versions/latest/sdk/location/#locationobject) como primeiro argumento, **será a partir deste objeto que obteremos a latitude e longitude atuais**.


Agora que já temos um ideia como o `watchPositionAsync()` funciona vamos partir para a implementação, primeiros vamos importar os recursos necessários.

```javascript
   import React, { useEffect, useState } from "react";
   import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
```

Em seguida criaremos um estado `camera` que será responsável por armazenar a localização atual recebida do `watchPositionAsync()` e as demais propriedades obrigatórias de uma `MapView.camera` 

```javascript
  //Map.js
   const [camera, setCamera] = useState({
      center:{
         latitude: 0,
         longitude: 0
      },
      pitch: 0,
      heading: 0,
      altitude: 1000,
      zoom: 16,
   });
```

Com o estado já criado vamos agora podemos obter a localização

```javascript
 //Map.js
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
               //Alterando o centro da câmera, mas mantendo as demais propriedades intactas
               setCamera( prevCamera => ({
                  ...prevCamera,
                  center: {
                     latitude: loc.coords.latitude,
                     longitude: loc.coords.longitude,
                  }
               }));
            }
            );
         } catch (err) {
            console.warn('Algo deu errado...');
         }
      }
      startTracking();
   }, []);
```

Ao invés de utilizarmos um `CustomMarker` para exibir a posição atual do usuário vamos usar a propriedade `showsUserLocation=true` do `MapView`. Também vamos adicionar as propriedades `showsMyLocationButton={false}` para desabilitar o botão de centralizar a localização atual, pois iremos criar nosso próprio botão, e `zoomControlEnabled={true}` para que sejam exibidos os botões de zoom, por fim iremos adicionar a propriedade `loadingEnabled={true}` para indicar que o mapa está sendo carregado e `loadingBackgroundColor={'#fff'}`.
Nos testes que realizei em smartphones os botões nativos do `MapView` eram mostrados normalmente, porém em emuladores eles simplesmente desapareciam... Para contornar o problema é necessário forçar o mapa a realizar uma nova renderização.\
Como queremos que a câmera siga o usuário vamos substituir a propriedade `intialCamera` por apenas `camera` em nosso `MapView`

Após realizar as mudanças nosso `Map.js` ficará da seguinte forma:

📃 **components/Map.js**
```javascript
import React, { useEffect, useState} from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView from "react-native-maps";

import CustomMarker from './CustomMarker';
import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';


const Map = () => {

   const [currentLocation, setCurrentLocation] = useState(null);

   useEffect(() => {
      const startTracking = async () => {
         let { status } = await requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            alert('Permissões para acessar a localização foram negadas.');
            return;
         }
         try {
            await watchPositionAsync({
               accuracy: Accuracy.Highest,
               timeInterval: 5000,
               distanceInterval: 50,
            }, (loc) => {
               setCamera( prevCamera => ({
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

   return (
      <MapView
         style={styles.map}
         camera={camera}
         showsUserLocation={true}
         showsMyLocationButton={false}
         zoomControlEnabled={true}
         loadingEnabled={true}
         loadingBackgroundColor={'#fff'}
      >
         <CustomMarker
            latitude={-23.5544}
            longitude={-46.6296}
            color={"#0F9D58"}
            id={'1'}
         >
         </CustomMarker>
         <CustomMarker
            latitude={-23.5583}
            longitude={-46.6282}
            id={'2'}
         >
         </CustomMarker>
      </MapView>
   );
}
const styles = StyleSheet.create({
   map: {
      ...StyleSheet.absoluteFillObject,
   },
});

export default Map;
```
___
<br>
<p align="center">
   <img alt="Tela inicial" src="https://i.imgur.com/Im5UZYT.gif" width="540" height="960" />
</p>
<p align="center">
	Câmera seguindo a posição atual do usuário
</p>


## Obtendo direções

Para que possamos obter as direções para determinado marcador é fundamental que tenhamos em mãos um chave da API do Google
...explicar depois

Com a chave da API em mãos, iremos utilizar o componente `react-native-maps-directions` que será reponsável mostrar a rota entre duas coordenadas. 
Importaremos o `MapViewDirections` dentro do arquivo `Map.js`, e o adicionaremos dentro do `MapView`, o `MapViewDirections` possui como propriedades **obrigatórias**
`origin`, `destination` e `apikey`. Assim que as direções entre o destino e a origem forem buscadas, um `MapView.Polyline` entre os dois pontos será desenhado. Sempre que uma das duas sofrer mudanças, novas direções serão buscadas e renderizadas.\
Agora criaremos um estado `destinationLocation` que será resposável por armazenar a localização de destino, em nosso caso vamos obter a localização de destino ao clicar em determinado marcador, faremos algumas pequenas mudanças para que nosso componente `CustomMarker` receba uma função que será atribuida ao evento `onPress` do marcador, sempre que ele for clicado iremos setar a `destinationLocation` de acordo com as coordenadas do marcador clicado. Por hora, vamos desativar o `<Callout>` dos marcadores para uma melhor visualização.

📃 **components/Map.js**
```javascript
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView from "react-native-maps";
import CustomMarker from './CustomMarker';
import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapViewDirections from "react-native-maps-directions";


const Map = () => {

   const APIKEY = "SUA CHAVE API";

   const [currentLocation, setCurrentLocation] = useState(null);
   const [destinationLocation, setDestinationLocation] = useState(null);

   useEffect(() => {
      const startTracking = async () => {
         let { status } = await requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            alert('Permissões para acessar a localização foram negadas.');
            return;
         }
         try {
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

   const getDirections = (latitude, longitude) => {
      setDestinationLocation({
         latitude: latitude,
         longitude: longitude 
      })
   }

   return (
         <>
            <MapView
               style={styles.map}
               camera={center}
               showsUserLocation={true}
               showsMyLocationButton={false}
               zoomControlEnabled={true}
               loadingEnabled={true}
               loadingBackgroundColor={'#fff'}
            >
               <CustomMarker
                  latitude={-23.5544}
                  longitude={-46.6296}
                  color={"#0F9D58"}
                  id={'1'}
                  onPress={getDirections}
               >
               </CustomMarker>
               <CustomMarker
                  latitude={-23.5583}
                  longitude={-46.6282}
                  id={'2'}
                  onPress={getDirections}
               >
               </CustomMarker>
               {/* Checando se o destino está setado para então obter as rotas */}
               {destinationLocation ?
                  <MapViewDirections
                     origin={
                        currentLocation.center
                     }
                     destination={
                        destinationLocation.region
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
                     onError={(errorMessage) => {
                        alert('Erro ao obter direções...');
                     }}
                  >
                  </MapViewDirections>
                  :
                  null
               }
            </MapView>
         </>
   );
}
const styles = StyleSheet.create({
   map: {
      ...StyleSheet.absoluteFillObject,
   },
});

export default Map;
```
___

📃 **components/CustomMarker.js**
```javascript
import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

const CustomMarker = (
  {
    id,
    latitude,
    longitude,
    color,
    onPress,
  }) => {

  return (
    <Marker
      identifier={id}
      key={id}
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      //Chamando a funcão getDirections() para obter as rotas
      onPress={() => onPress(latitude, longitude)}
    >
      <View style={styles.markerWrapper}>
        <View style={[
          styles.markerBody,
          {
            backgroundColor: color || "#4285F4",
          },
        ]}>
          <View style={styles.markerDot}></View>
        </View>
        <View style={[
          styles.markerArrow,
          {
            borderBottomColor: color || "#4285F4",
          }
        ]}></View>
      </View>
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

export default CustomMarker;
 ```

Após clicarmos em determinado marcador iremos obter uma rota conforme a imagem abaixo

<p align="center">
   <img alt="Rota entre dois marcadores" src="https://i.imgur.com/JDwdkMs.png" />
</p>
<p align="center">
   Rota entre dois marcadores
</p>

## Melhorando a interação com o mapa

### Principais problemas

Com as funcionalidades básicas de nossa aplicação já implementadas chegou a hora de melhorar a experiência do usuário ao utilizar o mapa, você pode ter notado que sempre quando tentamos navegar pelo mapa câmera irá voltar bruscamente para a posição atual do usuário, não dando liberdade alguma navegar pelo mapa, para evitar que isso ocorra vamos implementar um botão para centralizar a câmera e seguir o usuário, e uma função para remover a câmera fixa, caso seja identificado um gesto no mapa.

Também temos um problema relacionado as rotas, sempre que uma rota é definida a câmera irá focar no marcador de destino, uma abordagem mais interessante seria centralizar duas coordenadas (posição atual e marcador de destino) na tela, contudo isso será feito apenas quando a rota for definida para evitar futuros problemas relacionados à câmera.

Por último mas não menos importante, em alguns emuladores testados os botões nativos do `react-native-maps` simplesmente não aparecem, como podem ter notado pelas imagens acima onde um botão de zoom deveria aparecer, para contornar o problema podemos forçar o mapa a realizar uma nova renderização ou criar nossos próprios botões de zoom.

### Corrigindo a renderização dos botões

Para que possamos resolver os problemas acima citados será necessário utilizarmos o hook `useRef`, que será responsável por armazenar uma referência do componente `<MapView>`, com isso poderemos acessar suas propriedas e métodos, principalmente aquele relacionadas à câmera.


📃 **components/Map.js**
```javascript
//Definindo uma referência para o mapa para que possamos utilizar seus métodos
const mapRef = useRef(null);
<MapView
   ...
   ref={mapRef}
>
</MapView>
```
Após definida nossa referência precisaremos criar um estado `mapReady` para verificar se a primeira renderização ocorreu, após isso vamos alterar a propriedade `style` do nosso `<MapView>` para setar seu `style` de acordo com o estado `mapReady`, também adicionaremos a propriedade `onMapReady` que irá chamar uma função callback utilizando o hook `useCallback` e assim que mudará o estado `mapReady` forçando uma nova renderização no mapa.\
Solução apresentada por [kiullikki](https://github.com/kiullikki) disponível em [React Native Maps issue #3026](https://github.com/react-native-maps/react-native-maps/issues/3026#issuecomment-641192209)

📃 **components/Map.js**
```javascript
const handleMapReady = useCallback(() => {
   setMapReady(true);
   }, [mapRef, setMapReady]);
   ...
<MapView
   //Re-renderizando o mapa para evitar que os botões nativos desapareçam
   style={mapReady ? styles.map : {}} 
   ...
   //Chamando a função handleMapReady quando o mapa estiver totalmente carregado
    onMapReady={handleMapReady}
   >
</MapView>

```

Prontinho, agora nosso botão de zoom está sendo exibido normalmente

<p align="center">
   <img alt="Mapa com botões nativos corrigidos" src="https://i.imgur.com/Cdy1h2u.png" />
</p>
<p align="center">
   Mapa com botões nativos corrigidos
</p>

### Centralizando dois marcadores

Nosso próximo passo será centralizar duas coordernadas (posição atual e destino) após a rota inicial ser gerada, primeiro criaremos um estado `shouldFitMarkers` que será responsável por controlar quando os marcadores deverão ser centralizados, também iremos importar as `Dimensions` do React Native para que possamos obter o tamanho e altura da tela, que serão usadas para calcular o padding entre as bordas da tela.\
Em nosso componente `<MapViewDirections>` vamos adicionar a propriedade `onReady` que irá retornar uma callback quando a rota for obtida com sucesso, contendo um objeto com as propriedas `{distance, duration, coordinates, fare, waypointOrder}`, dentro da callback iremos verificar se o estado `shouldFitMarkers` é verdadeiro, caso seja iremos utilizar o método `fitToCoordinates` a partir do nosso `mapRef`, o método recebe como parâmetros um array de coordenadas e um segundo parâmetro opcional contendo as opções de espaçamento e animação.\
Sabendo que nosso objetivo será centralizar as coordenadas **apenas** quando a rota for definida, não podemos esquecer de setar o estado `shouldFitMarkers` para falso logo após utilizarmos a função `fitToCoordinates`, senão sempre que uma nova rota for calculada haverá uma nova centralização das coordenadas, fazendo com que o usuário perca o controle sobre a câmera.

📃 **components/Map.js**
```javascript
//Estado responsável por controlar quando a câmera deve ser centralizada entre duas coordenadas
const [shouldFitMarkers, setShouldFitMarkers] = useState(true);

const { width, height } = Dimensions.get('window');
...
//Setando o estado para verdadeiro sempre que um CustomMarker for clicado
const getDirections = (latitude, longitude) => {
   ...
   setShouldFitMarkers(true);
}
<MapViewDirections>
   ...
   //Centralizando as coordenadas após obter um rota com sucesso
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
         setShouldFitMarkers(false)
      }                        
}}
</MapViewDirections>
```

### Corrigindo a câmera fixa

Chegamos em umas das partes cruciais de nosso projeto, que diz respeito ao controle da câmera por parte do usuário, por enquanto não é possível navegar livremente pelo mapa enquanto mudamos de posição, pois se a posição do mapa for alterada via gesto o mapa centralizará novamente em nossa posição atual. 
A `camera` de nosso `MapView` estava sendo controlada apenas pelo estado `camera.center` que definia seu centro, para oferecermos uma maior liberdade ao usuário permitindo que ele navegue livremente pelo mapa nós devemos criar um estado `followUserLocation` que será responsável por definir quando a `camera` de nosso `MapView` deve, ou não, fixar na posição atual do usuário, inicialmente possuíra valor `true`, para que ao iniciar o mapa a câmera siga o usuário. Em nosso `<MapView>` vamos adicionar a propriedade `onRegionChangeComplete`, uma callback que será chamada quando o `<MapView>` for alterado, seja por gesto do usuário ou uma mudança automática, o método retorna uma `Region` e um booleano `isGesture` para verificar se a mudança ocorreu via gesto ou não, utilizaremos apenas o `isGesture`, o método `onRegionChangeComplete` irá realizar a chamada da função  

```javascript
const [followUserLocation, setFollowUserLocation] = useState(true);
...
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
...
<MapView
   ...
   camera={followUserLocation ?
      camera
      :
      null
   }
   ...
   onRegionChangeComplete={(region, isGesture) => handleMapCamera(isGesture)}
>
</MapView>
```

as demais propriedades foram definidas de maneira estática assim que inicializamos o estado `camera`, para podermos oferecer uma maior liberdade ao usuário permitindo o controle do zoom e da rotação, nós devemos criar um estado `followUserLocation` que será responsável por definir quando a `camera` de nosso `MapView` deve, ou não, fixar na posição atual do usuário

criaremos uma função `handleMapCamera()` que irá obter as propriedades do `MapView.camera` a partir do `mapRef` e passar os valores para nosso estado `camera`

vamos criar um estado `followUserLocation` que será responsável por definir quando a `camera` de nosso `MapView` deve, ou não, fixar na posição atual do usuário. Também será adicionada a propriedade `onRegionChangeComplete`

Para sanar este problema vamos criar um estado `followUserLocation` que será responsável por controlar quando a **câmera do mapa** deverá ou não seguir a posição atual do usuário.

Em seguida criaremos a função `handleMapCamera`  
