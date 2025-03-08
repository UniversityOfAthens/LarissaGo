import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        Alert.alert('Signup Failed', 'Please check your details and try again');
        return;
      }

      const signupData = await response.json();
      console.log('Signup data:', signupData);

      // Automatically log in after a successful signup
      const loginResponse = await fetch('http://10.0.2.2:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        Alert.alert('Login Failed', 'Please try logging in manually');
        return;
      }

      const loginData = await loginResponse.json();
      console.log('Login data:', loginData);

      // Save tokens using AsyncStorage
      await AsyncStorage.setItem('accessToken', loginData.access);
      await AsyncStorage.setItem('refreshToken', loginData.refresh);

      Alert.alert('Signup Successful', 'You are now logged in!', [
        { text: 'OK', onPress: () => router.replace('/dashboard') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  const handleLoginNavigation = () => {
    router.push('/login');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top container with an image, curved bottom border */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../public/kastro.jpg')}
          style={styles.image}
        />
      </View>

      {/* Bottom container with the signup form */}
      <View style={tw`flex-1 justify-center p-5 px-16`}>
        <Text style={tw`text-2xl mb-5`}>Sign Up</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={tw`border rounded-lg border-gray-300 mb-3 p-2`}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={tw`border rounded-lg border-gray-300 mb-3 p-2`}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={tw`border rounded-lg border-gray-300 mb-5 p-2`}
        />

        <TouchableOpacity
          style={tw`bg-green-500 rounded-full py-3 px-6`}
          onPress={handleSignup}
        >
          <Text style={tw`text-white text-center text-lg`}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link to navigate to Login */}
        <TouchableOpacity onPress={handleLoginNavigation} style={tw`mt-4`}>
          <Text style={tw`text-blue-500 text-center`}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the curved image container
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '40%',           // Adjust height as needed
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',      // Clips the image to the rounded border
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Signup;
