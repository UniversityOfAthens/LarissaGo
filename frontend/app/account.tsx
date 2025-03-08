// MyAccount.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

interface User {
  username: string;
  email: string;
  points: number;
}

const MyAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_URL = 'http://10.0.2.2:8000/api/my-account/';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl mb-4`}>My Account</Text>
      <Text style={tw`text-lg mb-2`}>Username: {user?.username}</Text>
      <Text style={tw`text-lg mb-2`}>Email: {user?.email}</Text>
      <Text style={tw`text-lg`}>Points: {user?.points}</Text>

      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded mt-6`}
        onPress={() => router.push('/rewards')}
      >
        <Text style={tw`text-white text-center text-lg`}>Redeem your points!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyAccount;
