import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  Image,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignupNavigation = () => {
    router.push('/signup');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        Alert.alert('Login Failed', 'Invalid credentials');
        return;
      }

      const data = await response.json();
      console.log(data);
      // Save tokens using AsyncStorage
      await AsyncStorage.setItem('accessToken', data.access);
      await AsyncStorage.setItem('refreshToken', data.refresh);

      Alert.alert('Login Successful', 'You are now logged in!', [
        {
          text: 'OK',
          onPress: () => router.replace('/dashboard'),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
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

      {/* Bottom container with the login form */}
      <View style={tw`flex-1 justify-center p-5 px-16`}>
        <Text style={tw`text-2xl mb-5`}>Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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
        style={tw`bg-blue-500 rounded-full py-3 px-6`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-center text-lg`}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignupNavigation} style={tw`mt-4`}>
        <Text style={tw`text-blue-500 text-center`}>
          Don't have an account? Sign up
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
    height: '40%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden', // ensures the image is clipped to the border radius
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Login;
