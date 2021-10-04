# Como utilizar React Native Maps com Expo

## O que iremos ver

- [Visão Geral](#📝-visão-geral) 
- [Configurando o projeto](#⚙️-configurando-o-projeto)
  - [Instalando o Expo CLI](#🛠️-instalando-o-expo-cli)
  - [Instalando as Dependências](#🛠️-instalando-as-dependências)
  - [Iniciando a aplicação](#🚀-iniciando-a-aplicação)
- [Exibindo o mapa](#🌎-exibindo-o-mapa)
- [Adicionando marcadores](#📍-adicionando-marcadores)
- [Obtendo a posição atual](#🌎-obtendo-a-posição-atual) 
- [Obtendo direções](#↪️-obtendo-direções)
- [Melhorando a interação com o mapa](#👩‍💻-melhorando-a-interação-com-o-mapa)
  - [Principais problemas](#📑-principais-problemas)
    - [Corrigindo a renderização dos botões](#🔨-corrigindo-a-renderização-dos-botões)
    - [Centralizando dois marcadores](#🔨-centralizando-dois-marcadores)
    - [Corrigindo a câmera fixa](#🔨-corrigindo-a-câmera-fixa)
- [Criando botões personalizados](#📱-criando-botões-personalizados)
  - [Componente Button.js](#📱-componente-buttonjs)
    - [Botão centralizar posição atual](#🌎-botão-centralizar-posição-atual)
    - [Botão obter direções](#↪️-botão-obter-direções)
    - [Botão remover rota](#❌-botão-remover-rota)
- [Como obter uma chave API do Google](#🔑-como-obter-uma-chave-api-do-google)
- [Conclusão](#conclusão)
- [Código da aplicação](https://github.com/matiussi/react-native-maps-tutorial)

## 📝 Visão Geral

Este tutorial possui como objetivo criar um mapa interativo que permita uma navegação agradável ao usuário, utilizando os componentes [React Native Maps](https://github.com/react-native-maps/react-native-maps), [React Native Maps Directions](https://github.com/bramus/react-native-maps-directions) e [Expo Location API](https://docs.expo.dev/versions/latest/sdk/location) como base para nosso projeto.
 
Inicialmente aprenderemos a exibir um mapa e adicionar marcadores utilizando o componente [React Native Maps](https://github.com/react-native-maps/react-native-maps). Em seguida utilizaremos a [Expo Location API](https://docs.expo.dev/versions/latest/sdk/location) para monitorarmos a localização atual do usuário, com a localização em mãos aprenderemos a criar rotas utilizando o [React Native Maps Directions](https://github.com/bramus/react-native-maps-directions). Para finalizar será apresentada uma solução para realizar o controle da câmera e serão realizadas melhorias na usabilidade da aplicação.

## ⚙️ Configurando o projeto

### 🛠️ Instalando o Expo CLI

Com o intuito de facilitar o desenvolvimento utilizaremos o [Expo CLI](#https://docs.expo.dev/workflow/expo-cli/), Expo CLI é um aplicativo de linha de comando que é a principal interface entre o desenvolvedor e o [Expo Tools](#https://expo.dev/tools). Você o usará para uma variedade de tarefas, como: Criar novos projetos. Desenvolvendo seu aplicativo: executando o servidor de projeto, visualizando logs, abrindo seu aplicativo em um simulador. 
Para instalar o Expo CLI utilize o comandos comandos abaixo:

``` 
npm install -g expo-cli
```

ou

```
yarn global add expo-cli 
```

Com o Expo CLI instalado agora só precisaremos criar um novo projeto, para isto basta utilizar os comandos:

```
expo init react-native-maps-tutorial

cd react-native-maps-tutorial
```

### 🛠️ Instalando as dependências

Antes de iniciarmos de fato a programar nossa aplicação precisaremos instalar as seguintes dependências: 
- `expo-location`: API responsável por obter as informações de geolocalização
- `react-native-maps`: Componente responsável por apresentar as informações visuais, como mapa e marcadores
- `react-native-maps-directions`: Componente responsável por desenhar uma rota entre duas coordenadas, utilizando o [Google Maps API Directions](#https://developers.google.com/maps/documentation/directions/overview)

```
expo install expo-location
expo install react-native-maps
npm install -react-native-maps-directions
ou
yarn add -react-native-maps-directions
```

### 🚀 Iniciando a aplicação

Com as dependências instaladas podemos iniciar nossa aplicação a partir do comando:

```
npm start 

ou

yarn start
```


Após iniciar a aplicação será aberto em seu navegador a página developer tools, caso a página não seja exibida pressione a tecla `d` no terminal.


<p align="center">
   <img alt="Expo Developer tools" src="https://i.imgur.com/UeMDGOn.png" />
</p>
<p align="center">
	Expo Developer Tools
</p>


Ao utilizar o Expo podemos facilmente rodar a aplicação em nossos smartphones ou emuladores, para isto basta fazer o download do [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR&gl=US) e escanear o QR code apresentado no Developer Tools. Caso possua algum emulador instalado em seu computador, primeiramente faça o download do Expo Go, em seguida selecione a opção **Run on Android device/emulator**, ou pressione a tecla `a` no terminal. 
Após alguns instantes a seguinte tela será apresentada, indicando que nosso aplicativo foi iniciado com sucesso.


<p align="center">
   <img alt="Tela inicial React Native" src="https://i.imgur.com/vWnWYrd.png" />
</p>
<p align="center">
   Tela inicial React Native
</p>

## 🌎 Exibindo o mapa

Neste projeto iremos separar o mapa e os marcadores em diferentes componentes, mas sinta-se a vontade para fazer da maneira que mais lhe agrada.
Criaremos uma pasta chamada components, e dentro dela vamos criar os arquivos `Map.js` e `CustomMarker.js`

<p align="center">
   <img alt="Estrutura das pastas do projeto" src="https://i.imgur.com/oDHRK4f.png" />
</p>
<p align="center">
	Estrutura das pastas do projeto
</p>

Por hora modificaremos apenas o arquivo `Map.js`, o arquivo será responsável por conter um `<MapView>` e AS funções que estão diretamente ligadas a ele, como obter localização atual, funções relacionadas à câmera e seleção de marcadores, por exemplo.

Para exibir o mapa é super simples, precisamos apenas importar um `MapView` e definir sua posição inicial utilizando `initialRegion` ou `initialCamera`. Neste exemplo utilizaremos `camera` ao invés de `region`, por ser mais fácil de ser manipulada e por possuir propriedades mais amigáveis, como zoom, rotação e inclinação. 
A `camera` de nosso `MapView` contém as propriedades **obrigatórias:** 
   - `center`: Recebe uma `latitude` e uma `longitude` que serão responsáveis por centralizar o mapa
   - `pitch`: Ângulo de inclinação da câmera
   - `heading`: Ângulo de rotação da câmera variando de `0` até `360`
   - `altitude`: Define o "zoom" da câmera quando estivermos utilizando o iOS MapKit, ignorado pelo Google Maps
   - `zoom`: Define o zoom da câmera quando estivermos utilizando o Google Maps 
  
Por fim, precisaremos definir um estilo ao nosso mapa para que ele possa ser exibido corretamente na tela, utilizaremos a propriedade `...StyleSheet.absoluteFillObject`, que consiste em definir uma posição absoluta e setar os atributos `top`, `right`, `bottom`, `left` iguais a 0.

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


Agora só precisaremos importar o componente `Map.js` no arquivo App.js

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

Voilà, nosso primeiro mapa foi criado com sucesso! **Algumas vezes as mudanças feitas em código podem não refletir em seu smartphone ou emulador, se isso vier a ocorrer selecione o terminal e pressione a tecla `r` para recarregar os aplicativos**.

<p align="center">
   <img alt="Mapa com posição inicial definida manualmente" src="https://i.imgur.com/tk3Relu.png" />
</p>
<p align="center">
	Mapa com posição inicial definida manualmente
</p>


## 📍 Adicionando marcadores

Com nosso mapa em funcionamento chegou a hora de adicionarmos um marcador sobre ele, vamos acessar o arquivo `CustomMarker.js`, dentro dele importaremos um `Marker` a partir do `react-native-maps`, queremos que cada marcador seja único e possua uma posição distinta, ou estilo se for necessário, portanto nosso marcador receberá um id, uma latitude, uma longitude e uma cor via props. 
Um `<Marker>` permite que sejam adicionadas diferentes tags em seu corpo, neste exemplo criaremos um marcador utilizando `Views` e também adicionaremos um `Callout` que exibirá uma janela personalizada quando clicarmos em um marcador. *Nesse exemplo decidi criar um marcador do zero apenas para fins demonstrativos*, vale ressaltar que um marcador pode possuir texto, ícones/imagens, etc... O limite é sua criatividade :D.

**Nota:** Não é possível adicionar eventos `onPress` nos botões dentro de um `Callout`, o evento funciona apenas no `Callout`, não em seus filhos. Essa é uma limitação da biblioteca do Google Maps. 

 Para garantir que nossos marcadores não sejam redesenhados sempre que `<MapView>` sofrer mudanças vamos adicionar a propriedade `tracksViewChanges` e definir seu valor como falso, resultando em uma melhora na performance. Outra medida que podemos utilizar para otimizar nosso app diminuindo a quantidade de renderizações desnecessárias seria utilizar o `React.memo`, o `React.memo` basicamente irá observar as props do componente, caso elas sofram alterações será realizada uma nova renderização, caso contrário o React utilizará a versão [memoizada](https://en.wikipedia.org/wiki/Memoization) do componente, pulando uma possível nova renderização. Dependendo do tipo de aplicação que esteja desenvolvendo seu mapa pode conter centenas ou milhares de marcadores, para evitar que todos esses marcadores sejam renderizados simultaneamente utilize alguma bibloteca que realize o agrupamento dos marcador como o  [React Native Map Clustering](https://github.com/venits/react-native-map-clustering) por exemplo.

📃 **components/CustomMarker.js**
```javascript
import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

function CustomMarker(
  {
    id,
    latitude,
    longitude,
    color
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
      /* 
        Permite que os marcadores personalizados monitorem alterações visuais e sejam redesenhados,
        para obter maior performance é recomendado deixar a propriedade desativada
      */
      tracksViewChanges={false}
    >
      {/* Adicionando uma cor personalizada de acordo com as props */}
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
      <Callout style={styles.callout}>
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
```

Em seguida basta realizar a importação do componente `CustomMarker.js` dentro de `Map.js`

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


## 🌎 Obtendo a posição atual

Agora que já sabemos como criar um mapa e adicionar um marcador vamos partir para um exemplo mais interessante, ao invés de utilizarmos uma localização fixa como foi definido anteriormente, iremos inicializar o mapa de acordo com a localização atual do usuário, a partir do método `watchPositionAsync()` da `Expo Location API`

Para que possamos utilizar o método `watchPositionAsync()` **é de extrema importância obter as permissões de localização do usuário**, portando esta será a primeira verificação que devemos fazer antes de obter a localização atual.

Após obtermos as permissões necessárias podemos partir para o método `watchPositionAsync(options, callback)`, neste exemplo utilizaremos apenas os seguintes parâmetros:
  - **options (objeto)**
    - **accuracy:** Acurácia a qual será obtida a localização, quanto maior o nível, mais exata em relação à realidade
    - **timeInterval:** Tempo mínimo de espera entre cada atualização em milissegundos 
    - **distanceInterval:** Realiza uma atualização se a posição mudou em X metros
  - **callback:** Função que é chamada a cada atualização da localização, recebe um objeto do tipo [Location Object](https://docs.expo.dev/versions/latest/sdk/location/#locationobject) como primeiro argumento, **será a partir deste objeto que obteremos a latitude e a longitude**.


Agora que já sabemos como o `watchPositionAsync()` funciona vamos partir para a implementação, primeiro vamos importar os recursos necessários.

```javascript
   import React, { useEffect, useState } from "react";
   import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
```

Em seguida criaremos um estado `camera` que será responsável por armazenar a localização atual recebida do `watchPositionAsync()` e as demais propriedades obrigatórias de uma `MapView.camera` 

```javascript
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

Com o estado criado, agora basta obtermos a localização atual

```javascript
   useEffect(() => {
      const startTracking = async () => {
         let { status } = await requestForegroundPermissionsAsync();
         //Obtendo permissões de localização, é necesário que as permissões sejam concedidas para que possamos obter a localização do usuário         
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
               distanceInterval: 50,
            }, (loc) => {
               /*
                  Setando o estado da câmera a partir do operador spread, pois desejamos manter as demais propriedades da câmera intactas,
                  senão o utilizarmos o spread precisaremos definir as demais propriedas novamente, 
                  fugindo do nosso objetivo de criar uma câmera dinâmica
               */
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

Ao invés de utilizarmos um `CustomMarker` para exibir a posição atual do usuário vamos usar a propriedade `showsUserLocation=true` do `MapView`. 
Também vamos adicionar as propriedades `showsMyLocationButton={false}` para desabilitar o botão nativo de centralizar a localização, pois iremos criar nosso próprio botão,  `zoomControlEnabled={true}` para que sejam exibidos os botões de zoom, `loadingEnabled={true}` para indicar que o mapa está sendo carregado e `loadingBackgroundColor={'#fff'}`, por fim  `toolbarEnabled={false}` para desabilitar os botões Navegação e Abrir Com Maps nativos que aparecem quando clicamos em um marcador.

Como queremos que a câmera siga o usuário vamos substituir a propriedade `intialCamera` por apenas `camera` em nosso `MapView`. Após realizar as mudanças nosso `Map.js` ficará da seguinte forma:

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
         toolbarEnabled={false}
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


## ↪️ Obtendo direções

Para que possamos obter as direções e criar nossas rotas é fundamental possuir uma chave API do Google Maps, ao final do tutorial dediquei uma seção  ensinando a [obter uma chave API](#🔑-como-obter-uma-chave-api-do-google).

Com a chave da API em mãos, será hora de utilizar o componente `react-native-maps-directions`, o componente será responsável por enviar uma requisição ao **Directions API** e obter a rota entre duas coordenadas. Assim que as direções entre o destino e a origem forem obtidas, um `MapView.Polyline` entre os dois pontos será desenhado. Sempre que a origem ou destino sofrerem mudanças, novas direções serão buscadas e renderizadas.

Importaremos o `MapViewDirections` no arquivo `Map.js`, e o adicionaremos **dentro** do `<MapView>`. O `<MapViewDirections>` possui como propriedades **obrigatórias:**
`origin`, `destination` e `apikey`.
Agora criaremos um estado `destinationLocation` que será responsável por armazenar a localização de destino, por enquanto vamos obter a localização de destino ao clicar em determinado marcador, faremos algumas pequenas mudanças para que nosso componente `CustomMarker` receba uma função que será atribuída ao evento `onPress` do marcador, sempre que ele for clicado iremos definir a `destinationLocation` de acordo com as coordenadas do marcador clicado. Por hora, vamos desativar o `<Callout>` dos marcadores para uma melhor visualização.

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
               toolbarEnabled={false}
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
               {/* Calculando rota apenas quando o estado destinationLocation possuir as coordenadas */}
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
                     /* Define se a MapView.Polilyne deve resetar ou não na hora de calcular a rota, 
                        se as linhas apresentarem bugs sete o valor para false*/
                     resetOnChange={false}
                     //Definindo uma rota com maior precisão, evitando que a rota mostrada "corte caminho" pelo mapa
                     precision={'high'}
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

## 👩‍💻 Melhorando a interação com o mapa

### 📑 Principais problemas

Com as funcionalidades básicas de nossa aplicação já implementadas, chegou a hora de melhorar a experiência do usuário ao utilizar o mapa, em alguns casos os botões nativos do `react-native-maps` simplesmente não aparecem, como podem ter notado pela imagem acima onde os botões de controle de zoom deveriam estar visíveis, para contornar o problema podemos forçar o mapa a realizar uma nova renderização ou criar nossos próprios botões de zoom.

Também temos um problema relacionado as rotas, sempre que uma rota é definida a câmera não fará absolutamente nada, uma abordagem mais interessante seria centralizar as duas coordenadas (posição atual e marcador de destino) a partir de uma animação, semelhante a quando traçamos uma rota no Google Maps.

Quando tentamos navegar pelo mapa a câmera volta bruscamente para a posição atual do usuário após alguns instantes, não provendo liberdade alguma para explorar o mapa. De forma a evitar que isso ocorra vamos implementar uma função para remover a câmera fixa caso seja identificado um gesto no mapa, mais adiante criaremos o [Botão centralizar posição atual](#botão-centralizar-posição-atual) que irá fixar a câmera na posição atual do usuário e segui-lo.


#### 🔨 Corrigindo a renderização dos botões

Para resolver os problemas citados acima será necessário utilizarmos o hook `useRef`, que será responsável por armazenar uma referência do componente `<MapView>`, com isso poderemos acessar suas propriedades e métodos.


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
**Avance para o próximo tópico caso não deseje utilizar os botões nativos do React Native Maps.**

Após definida nossa referência precisaremos criar um estado `mapReady` para verificar se a primeira renderização do `<MapView>` ocorreu, em seguida vamos alterar a propriedade `style` do nosso `<MapView>` para setar seu `style` de acordo com o estado `mapReady`, também adicionaremos a propriedade `onMapReady` ao nosso `<MapView>` que irá chamar a função `handleMapReady()` quando o mapa estiver totalmente carregado, setando o estado `mapReady` para verdadeiro e forçando uma nova renderização no mapa.\
Solução apresentada por [kiullikki](https://github.com/kiullikki) disponível em [React Native Maps issue #3026](https://github.com/react-native-maps/react-native-maps/issues/3026#issuecomment-641192209).

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

#### 🔨 Centralizando dois marcadores

O próximo passo será centralizar duas coordenadas (posição atual e destino) após a rota inicial ser gerada, primeiro criaremos um estado `shouldFitMarkers` que será responsável por controlar quando os marcadores deverão ser centralizados na tela, também importaremos as `Dimensions` do React Native para que possamos obter a largura e altura da tela, que serão usadas para calcular um espaçamento entre as bordas da tela.

Em nosso componente `<MapViewDirections>` vamos adicionar a propriedade `onReady` que chamará uma callback quando a rota for obtida com sucesso, essa callback contém um objeto com as propriedades `distance`, `duration`, `coordinates`, `fare`, `waypointOrder`, dentro da callback iremos verificar se o estado `shouldFitMarkers` possui valor verdadeiro, caso seja iremos utilizar o método `fitToCoordinates` do `<MapView>` a partir do nosso `mapRef`, o método recebe como parâmetros um array de coordenadas e um segundo parâmetro opcional contendo as opções de espaçamento e animação.

O objetivo será centralizar as coordenadas **apenas** quando a rota for definida, não podemos esquecer de setar o estado `shouldFitMarkers` para falso logo após utilizarmos a função `fitToCoordinates`, senão sempre que uma nova rota for calculada haverá uma nova centralização das coordenadas, fazendo com que o usuário perca o controle sobre a câmera.

📃 **components/Map.js**
```javascript
//Estado responsável por controlar quando a câmera deve ser centralizada entre duas coordenadas(posição atual e marcador de destino)
const [shouldFitMarkers, setShouldFitMarkers] = useState(true);

//Altura e largura da janela da aplicação
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
               right: (width / 10),
               bottom: (height / 10),
               left: (width / 10),
               top: (height / 10),
            }
         })
         setShouldFitMarkers(false)
      }                        
}}
</MapViewDirections>
```


#### 🔨 Corrigindo a câmera fixa

Chegamos em umas das etapas cruciais de nosso projeto, que diz respeito ao controle da câmera por parte do usuário, por enquanto não é possível navegar livremente pelo mapa enquanto nossa posição muda, pois se a posição do mapa for alterada via gesto o mapa centralizará novamente em nossa posição atual após alguns instantes, pois não estamos realizando controle algum, apenas definindo que o `MapView.camera` possui o valor da posição atual obtida através do `watchPositionAsync()`.

Para prover uma navegação mais agradável pelo mapa vamos criar um estado `followUserLocation` que será responsável por definir quando a `camera` de nosso `MapView` deve, ou não, fixar na posição atual do usuário, inicialmente o estado será definido com valor `true`, para que ao iniciar a aplicação câmera siga o usuário. Em nosso `<MapView>` vamos adicionar a propriedade `onRegionChangeComplete`, uma callback que será chamada sempre que `<MapView>` for alterado, seja por gesto do usuário ou uma mudança automática, o método retorna uma `Region` e um booleano `isGesture` para verificar se a mudança ocorreu via gesto ou não, utilizaremos apenas o `isGesture`, o método `onRegionChangeComplete` irá realizar a chamada da função `handleMapCamera()`.

A função `handleMapCamera()` será responsável por obter as informações adicionais de uma `MapView.camera` e salvá-las no estado `camera` para que possamos manter o zoom, rotação e/ou inclinação, por fim será realizada uma verificação para remover a câmera fixa se um gesto for detectado. 

```javascript
const [followUserLocation, setFollowUserLocation] = useState(true);
...
/*
   Obtendo a MapView.camera e copiando seus valores para o estado camera
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

## 📱 Criando botões personalizados

Anteriormente vimos uma abordagem para controlar câmera livremente, entretanto não definimos como fixá-la e seguir o usuário, também não criamos nenhuma maneira de remover uma rota definida. Para tornar a navegação por parte do usuário mais interessante criaremos um botão para centralizar a posição e fixar a câmera, um botão para obter rotas quando um marcador estiver selecionado, e por fim um botão para remover uma rota definida.

### 📱 Componente Button.js

Vamos criar um novo componente chamado `Button.js` que será responsável por gerar um botão de acordo com as propriedades fornecidas, como tamanho, cor, ícone e a função que ele chamará, queremos que cada botão seja único, mas ao mesmo tempo compartilhem algumas propriedades de estilo entre si.

📃 **components/Button.js**

```javascript
import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

const Button = ({
   backgroundColor='#fff', 
   width = 50, 
   heigth = 50,
   icon,
   onPress
}) => {
   return (
      <TouchableOpacity
      //Adicionando um estilo personalizado de acordo com as props
         style={[
            styles.mapButton, 
            {
               backgroundColor: backgroundColor, 
               height: heigth, 
               width: width 
            }
         ]}
         onPress={() => onPress()}
      >
         <Image style={styles.icon} source={icon}> 
         </Image>
      </TouchableOpacity>
   );
}
const styles = StyleSheet.create({

   mapButton: {
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
   }
});
export default Button;
```

Agora vamos ao nosso `Map.js`, dentro de nosso `React.Fragment` (`<></>`) e abaixo de nosso `<MapView>` criaremos uma `<View style={styles.buttonWrapper}>` para envolver todos os nosso botões. 

#### 🌎 Botão centralizar posição atual

Nosso primeiro botão será o botão `centralizar posição atual`, criaremos a função `handleFollowUserLocation()` que será invocada pelo botão, a função irá realizar uma animação até a posição atual do usuário, após terminada a animação definiremos o estado `followUserLocation` como verdadeiro, a partir deste momento nossa `MapView.camera` passará a seguir o usuário.

📃 **components/Map.js**
```javascript
...
//Função responsável por realizar uma animação até a posição atual do usuário e fixar a câmera
const handleFollowUserLocation = () => {
   if (mapRef.current) {
      mapRef.current.animateCamera(
         {
            center: {
               latitude: camera.center.latitude,
               longitude: camera.center.longitude,
            },
            pitch: camera.pitch,
            heading: camera.heading,
            altitude: camera.altitude,
            zoom: camera.zoom <= 13 ? 17 : camera.zoom, //Aproximando a câmera caso ela esteja muito distante
         },
         { duration: 2000 }
      );
   }
   /* 
      O método animateCamera() não possui callback, então não sabemos quando a animação de fato terminou 
      por isso utilizaremos um setTimeout setando o estado após 3 segundos
   */
   setTimeout(() => {
      setFollowUserLocation(true);
   }, 3000);
};
...
<>
   <MapView>
      ...
   </MapView>
   <View style={styles.buttonWrapper}>
      <Button
         icon={require("../assets/my-location.png")}
         onPress={() => handleFollowUserLocation()}
      />
   </View>
</>;
```

#### ↪️ Botão obter direções

Ao invés de obtermos as direções clicando em um marcador vamos partir para uma abordagem mais interessante, quando o usuário clicar sobre um marcador, o marcador será selecionado e o botão `obter direções` será exibido, caso o usuário deseje traçar uma rota até o marcador ele precisará clicar no botão.

Criaremos um estado `selectedDestination` que irá conter as coordenadas do marcador selecionado, o estado também será responsável por controlar quando o botão `obter direções` será exibido, faremos uma pequena mudança em nosso código, ao invés de passarmos a função `getDirections()` aos nossos marcadores, iremos passar a função `selectDestination()`, esta função basicamente define o estado `selectedDestination` com as coordenadas do marcador clicado. Agora quem realizará a chamada da função `getDirections()` será nosso botão `obter direções`, que receberá os valores do marcador selecionado irá passá-los para o estado `destinationLocation`.

📃 **components/Map.js**

```javascript
...
//Selecionando um marcador que poderá ser utilizado para criar uma rota
const selectDestination = (latitude, longitude) => {
   setSelectedDestination({
      latitude,
      longitude,
   });
}
//Definindo as coordenadas de destino
const getDirections = () => {
   //Após definir o estado destinationLocation o <MapViewDirections> irá traçar uma rota
   setDestinationLocation(selectedDestination);
   setShouldFitMarkers(true);
   //Setar como falso para evitar que a câmera volte ao usuário
   setFollowUserLocation(false);
}
...
<MapView>
...
   <CustomMarker>
   ...
   onPress={selectDestination}
   </CustomMarker>
</MapView>
<View style={styles.buttonWrapper}>
   {selectedDestination ?
      <Button
         backgroundColor={'#4285F4'}
         icon={require('../assets/directions.png')}
         onPress={() => getDirections()}
      />
      :
      null
   }
</View>
...
```

#### ❌ Botão remover rota

Para finalizar criaremos o botão `remover rotas`, mas antes vamos adicionar a propriedade `onPress()` em nosso `<MapView>` para que ao tocar no mapa será removida a seleção de um marcador caso não esteja nenhuma rota definida, agora podemos criar nosso botão `remover rota` que invocará a função `removeDirections()`, a função basicamente limpará os estados `selectedDestination` e `destinationLocation`.

📃 **components/Map.js**

```javascript
... 
//Removendo o marcador selecionado e a rota
const removeDirections = () => {
   setDestinationLocation(false);
   setSelectedDestination(false);
}
...
<MapView
   ...
   onPress={!destinationLocation ? () => setSelectedDestination(null) : null}
>
</MapView>
<View style={styles.buttonWrapper}>
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
</View>
```

Após adicionarmos todos os botões o resultado final pode ser conferido abaixo

<p align="center">
   <img alt="Demonstrando o funcionamento dos botões personalizados" src="https://i.imgur.com/a3nTCBB.gif" width="540" height="960" />
</p>
<p align="center">
   Demonstrando o funcionamento dos botões personalizados
</p>

## 🔑 Como obter uma chave API do Google

Com sua conta do Google logada acesse o [Google Cloud Console](#https://console.cloud.google.com), em seguida clique na opção **Selecione um Projeto** -> **Novo Projeto**
<p align="center">
   <img alt="Criando um novo projeto Google Cloud Platform" src="https://i.imgur.com/rqayNvf.png" />
</p>
<p align="center">
   Criando um novo projeto Google Cloud Platform
</p>

Defina um nome para seu projeto e clique em **Criar**.

<p align="center">
   <img alt="Definindo um nome para o novo projeto" src="https://i.imgur.com/Yv1v3E0.png" />
</p>
<p align="center">
   Definindo um nome para o novo projeto
</p>

Após alguns instantes o projeto será criado e você será direcionado para o dashboard, selecione o **Menu de Navegação** ao lado esquerdo -> **API e Serviços** -> **Credenciais**

<p align="center">
   <img alt="Acessando as configurações de credenciais" src="https://i.imgur.com/mC5Vxm7.png" />
</p>
<p align="center">
   Acessando as configurações de credenciais
</p>

Em seguida clique em **Criar Credenciais** -> **Chave de API**, esta será a chave utilizada para realizarmos as requisições para a/as APIs do Google.

<p align="center">
   <img alt="Criando uma Chave API" src="https://i.imgur.com/4zBzVVO.png" />
</p>
<p align="center">
   Criando uma Chave API
</p>

Ainda no menu APIs e serviços selecione a opção **Biblioteca** e selecione a opção **Directions API**, em seguida basta clicar no botão **Ativar**

<p align="center">
   <img alt="Biblioteca de APIs do Google" src="https://i.imgur.com/nK4rnev.png" />
</p>
<p align="center">
   Biblioteca de APIs do Google
</p>

Por fim precisaremos criar uma **Conta de Faturamento**, selecione o menu lateral e clique em **Faturamento**, em seguida clique no botão **Adicionar Conta de Faturamento**, siga as instruções preenchendo os formulários com seus dados pessoais, vale lembrar é necessário adicionar um **cartão de crédito**.
Com a conta de faturamento criado, agora podemos adicionar a chave API ao nosso projeto, é possível ativar mais APIs conforme sua necessidade, apenas fique atento à quais APIs estão ativas para determinada chave.


## Conclusão

Neste projeto vimos como é possível criar uma aplicação utilizando `React Native Maps`, `React Native Maps Directions` e `Expo Location`, focando em uma experiência mais agradável para o usuário, utilizamos apenas parte dos recursos que esses componentes/API tem a oferecer, se deseja aprofundar-se no assunto é recomendado que leia as devidas documentações com paciência, também existem alguns exemplos nos repositórios do [React Native Maps](https://github.com/react-native-maps/react-native-maps/tree/master/example) e [React Native Maps Directions](https://github.com/bramus/react-native-maps-directions) utilizando componentes de classe.

Quaisquer dúvidas, sugestões ou críticas, por favor deixe uma mensagem o/.

O código completo da aplicação está disponível no [GitHub](#https://github.com/matiussi/react-native-maps-tutorial)



