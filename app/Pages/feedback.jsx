import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '@/config/FirebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const Feedback = () => {
  const router = useRouter();
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (feedbackText.trim().length < 5) {
      Alert.alert('Error', 'Please provide more detailed feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid,
        userEmail: user?.email,
        userName: user?.displayName,
        type: feedbackType,
        message: feedbackText,
        rating: rating,
        createdAt: serverTimestamp(),
        status: 'pending',
        device: Platform.OS,
        appVersion: '1.0.0',
      });

      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={rating >= star ? 'star' : 'star-outline'}
              size={32}
              color={rating >= star ? '#FFC107' : '#BBBBBB'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3629B7" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Feedback</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How would you rate our app?</Text>
          {renderRatingStars()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                feedbackType === 'suggestion' && styles.selectedTypeButton,
              ]}
              onPress={() => setFeedbackType('suggestion')}
            >
              <Ionicons
                name="bulb-outline"
                size={20}
                color={feedbackType === 'suggestion' ? '#3629B7' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  feedbackType === 'suggestion' && styles.selectedTypeText,
                ]}
              >
                Suggestion
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                feedbackType === 'issue' && styles.selectedTypeButton,
              ]}
              onPress={() => setFeedbackType('issue')}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={feedbackType === 'issue' ? '#3629B7' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  feedbackType === 'issue' && styles.selectedTypeText,
                ]}
              >
                Report Issue
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                feedbackType === 'appreciation' && styles.selectedTypeButton,
              ]}
              onPress={() => setFeedbackType('appreciation')}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={feedbackType === 'appreciation' ? '#3629B7' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  feedbackType === 'appreciation' && styles.selectedTypeText,
                ]}
              >
                Appreciation
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Feedback</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us what you think about the app, or report any issues you've encountered..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={feedbackText}
            onChangeText={setFeedbackText}
          />
        </View>

        <Text style={styles.disclaimer}>
          Your feedback helps us improve the app experience. Thank you for taking the time to share your thoughts!
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting || feedbackText.trim().length < 5}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3629B7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: '31%',
  },
  selectedTypeButton: {
    backgroundColor: '#e8e4ff',
    borderWidth: 1,
    borderColor: '#3629B7',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  selectedTypeText: {
    color: '#3629B7',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    height: 150,
    fontSize: 16,
    color: '#333',
  },
  disclaimer: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#3629B7',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});