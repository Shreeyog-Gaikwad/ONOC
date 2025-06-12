import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const Preview = () => {
  const { uri, name, type } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const encodeFirebaseUrl = (originalUrl) => {
    try {
      if (!originalUrl || typeof originalUrl !== 'string') return '';
   
      if (!originalUrl.includes('firebasestorage.googleapis.com')) {
        return originalUrl;
      }
      
      const decoded = decodeURIComponent(originalUrl);
      if (decoded.includes('/o/')) {
        const baseUrl = originalUrl.split('/o/')[0];
        const pathAndQuery = originalUrl.split('/o/')[1];
        const [path, query] = pathAndQuery.split('?');
        const encodedPath = encodeURIComponent(path);
        return `${baseUrl}/o/${encodedPath}?${query}`;
      }
      return originalUrl;
    } catch (e) {
      console.error('Error encoding URL:', e);
      return originalUrl;
    }
  };

  const encodedUrl = encodeFirebaseUrl(uri);
  
  const fileExtension = (encodedUrl || '').split('?')[0].split('.').pop().toLowerCase();
  const isPDF = /\.pdf$/i.test(encodedUrl.split('?')[0]) || type === 'pdf';
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(encodedUrl.split('?')[0]) || type === 'image';

  const handleOpenInBrowser = async () => {
    if (encodedUrl) {
      await WebBrowser.openBrowserAsync(encodedUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{name || "Document Preview"}</Text>
        <TouchableOpacity 
          style={styles.externalButton}
          onPress={handleOpenInBrowser}
        >
          <Ionicons name="open-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {isImage ? (
          <Image
            source={{ uri: encodedUrl }}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Failed to load image');
            }}
            resizeMode="contain"
          />
        ) : isPDF ? (
          <WebView
            source={{ uri: encodedUrl }}
            style={styles.pdf}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Failed to load PDF');
            }}
          />
        ) : (
          <View style={styles.unsupportedContainer}>
            <Ionicons name="document-outline" size={80} color="#ccc" />
            <Text style={styles.unsupportedText}>
              This file type cannot be previewed in the app
            </Text>
            <TouchableOpacity 
              style={styles.openButton}
              onPress={handleOpenInBrowser}
            >
              <Text style={styles.openButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3629B7" />
            <Text style={styles.loadingText}>Loading document...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#E9446A" />
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity 
              style={styles.openButton}
              onPress={handleOpenInBrowser}
            >
              <Text style={styles.openButtonText}>Try Open in Browser</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  externalButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pdf: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: '#E9446A',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unsupportedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: '#3629B7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  openButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});