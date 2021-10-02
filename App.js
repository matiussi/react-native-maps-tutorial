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
    justifyContent: 'center'
  }
});
