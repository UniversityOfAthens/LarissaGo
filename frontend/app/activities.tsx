import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://10.0.2.2:8000/api/activities/';

  useEffect(() => {
    const fetchActivities = async () => {
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
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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
      <Text style={tw`text-xl mb-4`}>All Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`mb-4 p-4 border border-gray-200 rounded`}>
            <Text style={tw`text-lg font-bold`}>{item.title}</Text>
            <Text style={tw`text-sm`}>{item.description}</Text>
            <Text style={tw`text-sm`}>Points: {item.points}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Activities;
