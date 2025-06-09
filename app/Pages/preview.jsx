import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

const Preview = () => {
  const { url, name } = useLocalSearchParams();

  // Helper to encode Firebase URL
  const encodeFirebaseUrl = (originalUrl) => {
    try {
      const decoded = decodeURIComponent(originalUrl);
      const baseUrl = originalUrl.split('/o/')[0];
      const pathAndQuery = originalUrl.split('/o/')[1];
      const [path, query] = pathAndQuery.split('?');
      const encodedPath = encodeURIComponent(path);
      return `${baseUrl}/o/${encodedPath}?${query}`;
    } catch (e) {
      return originalUrl;
    }
  };

  const encodedUrl = typeof url === 'string' ? encodeFirebaseUrl(url) : '';
  const isImage = /\.jpg|jpeg|png|gif|webp$/i.test(encodedUrl.split('?')[0]);
  const isPDF = /\.pdf$/i.test(encodedUrl.split('?')[0]);

  console.log('url :', url);
  console.log('Encoded URL:', encodedUrl);
  console.log('Is image:', isImage);
  console.log('Is PDF:', isPDF);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {isImage ? (
        <Image
          source={{ uri: encodedUrl }}
          style={styles.image}
          onError={() => console.log('Image failed to load:', encodedUrl)}
        />
      ) : isPDF ? (
        <WebView
          source={{ uri: encodedUrl }}
          style={styles.pdf}
          onError={(e) => console.log('PDF failed to load', e.nativeEvent)}
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
  },
  pdf: {
    flex: 1,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
