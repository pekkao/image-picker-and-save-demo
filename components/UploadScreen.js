import React, { useState } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../Config';

const UploadScreen = () => {

  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });
    const source = {uri: result.assets[0].uri}
    console.log(source)
    setImage(source)
  };

  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, 'images/' + filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  return(
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Text>Pick an Image</Text> 
      </TouchableOpacity> 
      <View>
      {image && <Image source={{uri: image.uri}} style={{width: 300, height: 300}}/>} 
      <TouchableOpacity onPress={uploadImage}>
        <Text>Upload Image</Text> 
      </TouchableOpacity> 
      </View> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UploadScreen;