// activities.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Svg, { Path, Text as SVGText } from 'react-native-svg';
import { useRouter } from 'expo-router';

interface Activity {
  id: number;
  title: string;
  description: string;
  points: number;
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://10.0.2.2:8000/api/activities/';
  const router = useRouter();

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

  // Helper functions to compute dimensions and polygon path
  const getDimensionsForTitle = (title: string) => {
    const width = Math.max(100, title.length * 12);
    const height = 60;
    return { width, height };
  };

  const getPolygonPath = (width: number, height: number) => {
    return `
      M 10,0
      L ${width - 10},0
      L ${width},${height / 2}
      L ${width - 10},${height}
      L 10,${height}
      L 0,${height / 2}
      Z
    `;
  };

  const renderActivity = ({ item }: { item: Activity }) => {
    const { width, height } = getDimensionsForTitle(item.title);
    const path = getPolygonPath(width, height);
    const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;

    return (
      <TouchableOpacity onPress={() => router.push(`/activity/${item.id}`)}>
        <View style={tw`mb-5`}>
          <Svg width={width} height={height}>
            <Path d={path} fill={randomColor} />
            <SVGText
              x={width / 2}
              y={height / 2}
              fill="black"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {item.title}
            </SVGText>
          </Svg>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl mb-4`}>All Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActivity}
      />
    </View>
  );
};

export default Activities;
