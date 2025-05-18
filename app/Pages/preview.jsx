import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const Preview = () => {
  const { url, name } = useLocalSearchParams();

  const getCleanPath = (urlString) => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.pathname; 
  } catch {
    return '';
  }
};

const cleanPath = typeof url === 'string' ? getCleanPath(url) : '';

const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanPath);


  console.log('Preview URL:', url);
  console.log('Clean path:', cleanPath);
  console.log('Is valid image URL:', isImage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {isImage ? (
        <Image
          source={{ uri: url }}
          style={styles.image}
          onError={() => console.log('Image failed to load')}
        />
      ) : (
        <Text style={styles.error}>Cannot preview this file type</Text>
      )}
    </View>
  );
};


export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});


