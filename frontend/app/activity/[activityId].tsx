// activity/[activityId].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import tw from 'twrnc';

interface ActivityData {
  id: number;
  title: string;
  description: string;
  points: number;
}

export default function ActivityDetailScreen() {
  // Get dynamic parameter from the URL
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

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>{activity.title}</Text>
      <Text style={tw`text-base mb-4`}>{activity.description}</Text>
      <Text style={tw`text-lg mb-8`}>Points: {activity.points}</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 py-3 px-6 rounded`}
        onPress={handleComplete}
      >
        <Text style={tw`text-white text-lg text-center`}>Complete</Text>
      </TouchableOpacity>
    </View>
  );
}
