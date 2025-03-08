import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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

      const data = await response.json();
      console.log(data);
      Alert.alert('Signup Successful', 'Your account has been created!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  const handleLoginNavigation = () => {
    router.push('/login');
  };

  return (
    <View style={tw`flex-1 justify-center p-5`}>
      <Text style={tw`text-2xl mb-5`}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={tw`border border-gray-300 mb-3 p-2`}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={tw`border border-gray-300 mb-3 p-2`}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`border border-gray-300 mb-5 p-2`}
      />
      <Button title="Sign Up" onPress={handleSignup} />

      {/* Link to navigate to login.tsx */}
      <TouchableOpacity onPress={handleLoginNavigation} style={tw`mt-4`}>
        <Text style={tw`text-blue-500 text-center`}>
          Already have an account?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
