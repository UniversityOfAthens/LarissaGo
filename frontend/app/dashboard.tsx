import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const Dashboard = () => {
  const router = useRouter();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top container with an image, curved bottom border */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../public/larisa.jpg')}
          style={styles.image}
        />
      </View>

      {/* Content section */}
      <View style={tw`flex-1 items-center pb-24 justify-center px-4`}>
        {/* Title */}
        <Text style={tw`text-2xl font-bold mb-2 py-8`}>Welcome to LarissaGo!</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-6 rounded-full mb-4 w-3/4`}
          onPress={() => router.push('/activities')}
        >
          <Text style={tw`text-white text-lg text-center`}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-green-500 py-3 px-6 rounded-full w-3/4`}
          onPress={() => router.push('/rewards')}
        >
          <Text style={tw`text-white text-lg text-center`}>Redeem your points</Text>
        </TouchableOpacity>

        {/* Additional link to My Account */}
        <TouchableOpacity onPress={() => router.push('/account')} style={tw`mt-4`}>
          <Text style={tw`text-green-500 text-lg text-center`}>My account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Example of combining Tailwind + manual style for curved borders
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '40%', // Adjust as needed
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden', // Ensures the image is clipped to the border radius
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the container
  },
});

export default Dashboard;
