import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function Home() {
  const router = useRouter();

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold mb-10`}>Welcome to LarissaGo</Text>
      
      <TouchableOpacity 
        style={tw`bg-blue-500 py-3 px-6 rounded mb-4`}
        onPress={() => router.push('/login')}
      >
        <Text style={tw`text-white text-lg`}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={tw`bg-green-500 py-3 px-6 rounded`}
        onPress={() => router.push('/signup')}
      >
        <Text style={tw`text-white text-lg`}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
