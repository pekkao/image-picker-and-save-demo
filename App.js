import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import UploadScreen from './components/UploadScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <UploadScreen />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})