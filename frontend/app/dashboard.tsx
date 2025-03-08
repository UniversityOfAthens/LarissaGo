import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import '../style/main.css';

export default function Dashboard() {
  const router = useRouter();

  const handleAccountPress = () => {
    router.push('/account'); // Ensure you have an account.tsx screen or adjust accordingly.
  };

  // Optionally, you can add a handler for the "Play" button if needed.
  const handlePlayPress = () => {
    // Navigate to the game screen or perform any action.
    console.log('Play pressed');
  };

  return (
    <View style={tw`flex-1`}>
      <div className='backgroundmain'>
        {/* Header with the account icon */}
        <View style={tw`flex-row justify-between items-center p-4 border-b border-gray-200 rounded-sm`}>
          <Text style={tw`text-xl font-bold`}>Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="black"
            onPress={handleAccountPress} />
          </TouchableOpacity>
        </View>

        <div className='center glass'>
          <h1>Explore Larissa</h1>
        </div>
        
        
        {/* <View style={tw 'flex-auto items-center'}></> */}

        <View style={tw`flex-1 justify-center items-center`}>
          <TouchableOpacity 
            style={tw`bg-blue-500 py-3 px-8 rounded`} 
          >
            <Text style={tw`text-white text-2xl`}>Play</Text>
          </TouchableOpacity>
        </View>
        </div>
    </View>
  );
}
