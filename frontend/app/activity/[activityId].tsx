import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import tw from 'twrnc';
import clockIcon from './../../public/icons/clock.png';
import cloudIcon from './../../public/icons/cloud.png';
import starIcon from './../../public/icons/star.png';

interface ActivityData {
  id: number;
  title: string;
  description: string;
  points: number;
  image?: string;       // URL to the image
  time_hours?: number;  // Time in hours
  weather?: number;     // Weather indication
  star_rating?: number; // Star rating (e.g., out of 5)
  completed?: boolean;  // Whether the user completed this activity
}

export default function ActivityDetailScreen() {
  // Remove header by setting headerShown to false
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityDetailContent />
    </>
  );
}

function ActivityDetailContent() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();

  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL = `http://10.0.2.2:8000/api/activities/${activityId}/`;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setErrorMessage('No token found. Please login.');
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
          throw new Error('Failed to fetch activity');
        }
        const data: ActivityData = await response.json();
        setActivity(data);
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [API_URL]);

  const handleComplete = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please login.');
        return;
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to complete activity');
      }
      const resData = await response.json();
      Alert.alert('Success', resData.detail || 'Activity completed!');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator />
      </View>
    );
  }

  if (errorMessage || !activity) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>
          Error: {errorMessage || 'Activity not found.'}
        </Text>
      </View>
    );
  }

  // Destructure the fields for convenience
  const {
    title,
    description,
    points,
    image,
    time_hours,
    weather,
    star_rating,
    completed,
  } = activity;

  // Default location
  const location = 'Larisa';

  // For responsive design, get the screen height
  const { height: screenHeight } = Dimensions.get('window');

  return (
    <ScrollView style={tw`bg-white`}>
      <TouchableOpacity
        style={tw`absolute top-8 left-5 z-10 p-2 bg-white rounded-xl`}
        onPress={() => router.push('/activities')}
      >
        <Text style={tw`font-bold text-black`}>Back</Text>
      </TouchableOpacity>
      <View style={tw`flex-1 rounded-[50px] overflow-hidden`}>
        <View style={[tw`w-full relative items-center`, { height: screenHeight * 0.5 }]}>
          {/* Actual image */}
          {image ? (
            <Image
              source={{ uri: `http://10.0.2.2:8000${image}` }}
              style={tw`absolute w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{ uri: 'https://placehold.co/400x400' }}
              style={tw`absolute w-[200px] h-[200px]`}
              resizeMode="cover"
            />
          )}

          <View
            style={[
              tw`absolute mx-4 rounded-[15px] p-4 flex-row justify-between`,
              {
                top: 355,
                backgroundColor: 'rgba(29, 29, 29, 0.5)',
              },
            ]}
          >
            {/* Left side: Title + Location (stacked) */}
            <View>
              <Text style={tw`text-white text-2xl pr-4 font-semibold`}>
                {title}
              </Text>
              <Text style={tw`text-gray-300 text-lg mt-1`}>
                {location}
              </Text>
            </View>

            {/* Right side: "Points" label + value (stacked, aligned right) */}
            <View style={tw`items-end`}>
              <Text style={tw`text-gray-300 text-base`}>Points</Text>
              <Text style={tw`text-gray-300 text-2xl font-medium`}>
                {points}
              </Text>
            </View>
          </View>
        </View>

        {/* Main content (below the image) */}
        <View style={tw`px-6 pt-6`}>
          <Text style={tw`text-[22px] font-semibold text-[#1b1b1b] mb-2`}>
            {title}
          </Text>

          {/* Row with time_hours, weather, star_rating */}
          <View style={tw`flex-row items-center mb-4`}>
            {/* Time */}
            {time_hours !== undefined && (
              <View style={tw`flex-row items-center mr-4`}>
                <View style={tw`w-8 h-8 bg-[#ececec] rounded-md mr-2 items-center justify-center`}>
                  <Image
                    source={clockIcon}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={tw`text-[#7e7e7e] text-lg`}>
                  {time_hours} hours
                </Text>
              </View>
            )}

            {/* Weather */}
            {weather !== undefined && (
              <View style={tw`flex-row items-center mr-4`}>
                <View style={tw`w-8 h-8 bg-[#ececec] rounded-md mr-2 items-center justify-center`}>
                  <Image
                    source={cloudIcon}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={tw`text-[#7e7e7e] text-lg`}>
                  {weather} °C
                </Text>
              </View>
            )}

            {/* Star Rating */}
            {star_rating !== undefined && (
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-8 h-8 bg-[#ececec] rounded-md mr-2 items-center justify-center`}>
                  <Image
                    source={starIcon}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={tw`text-[#7e7e7e] text-lg`}>
                  {star_rating}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={tw`text-[#a4a4a4] text-base leading-6 mb-24`}>
            {description || 'No description provided.'}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleComplete}
          disabled={completed}
          style={[
            tw`absolute left-4 right-4 rounded-[20px] justify-center`,
            completed ? tw`bg-gray-500` : tw`bg-[#1a1a1a]`,
            {
              bottom: 20,
              height: 66,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 13 },
              shadowOpacity: 0.12,
              shadowRadius: 26,
              elevation: 5,
            },
          ]}
        >
          <Text style={tw`text-white text-xl font-medium text-center`}>
            {completed ? 'Completed' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
