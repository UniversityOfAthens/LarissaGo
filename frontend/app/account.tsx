import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

// Replace with the path to your default avatar image:
const DEFAULT_AVATAR = require('./../public/default-avatar.png');

interface User {
  username: string;
  email: string;
  points: number;
}

interface Activity {
  id: number;
  title: string | null;
  description: string;
  points: number;
}

const MyAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recLoading, setRecLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_USER_URL = 'http://10.0.2.2:8000/api/my-account/';
  const API_ACTIVITIES_URL = 'http://10.0.2.2:8000/api/activities/';

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }
        const response = await fetch(API_USER_URL, {
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

  // Fetch activities for the "Activities Just For You" section
  useEffect(() => {
    const fetchRecommendedActivities = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          // If token isn't available, just exit.
          setRecLoading(false);
          return;
        }
        const response = await fetch(API_ACTIVITIES_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data: Activity[] = await response.json();
        let recs: Activity[] = [];
        if (data.length <= 2) {
          recs = data;
        } else {
          // Pick two distinct random activities
          const indices = new Set<number>();
          while (indices.size < 2) {
            indices.add(Math.floor(Math.random() * data.length));
          }
          recs = Array.from(indices).map((idx) => data[idx]);
        }
        setRecommendedActivities(recs);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setRecLoading(false);
      }
    };

    fetchRecommendedActivities();
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
    <ScrollView style={tw`flex-1 bg-blue-50`}>
      <TouchableOpacity
        style={[
          tw`absolute top-8 left-5 z-10 p-2 bg-white rounded-xl`,
        ]}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={tw`font-bold text-black`}>Back</Text>
      </TouchableOpacity>
      {/* Header Section (Profile Info) */}
      <View style={tw`bg-green-300 p-6 rounded-b-3xl items-center`}>
        {/* Avatar */}
        <Image
          source={DEFAULT_AVATAR}
          style={tw`w-24 h-24 rounded-full mb-3`}
        />

        {/* User Info */}
        <Text style={tw`text-2xl font-bold text-gray-800`}>
          {user?.username || 'Guest User'}
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          {user?.email || 'No email'}
        </Text>

        {/* Points */}
        <View style={tw`mt-3 bg-white px-4 py-2 rounded-2xl`}>
          <Text style={tw`text-base text-gray-700`}>
            Points: {user?.points ?? 0}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={tw`px-4 pt-4 pb-8`}>
        {/* Actions Row */}
        <View style={tw`flex-row justify-around mb-6`}>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-full`}
            onPress={() => router.push('/activities')}
          >
            <Text style={tw`text-white font-semibold`}>Explore Activities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-green-500 py-2 px-4 rounded-full`}
            onPress={() => router.push('/rewards')}
          >
            <Text style={tw`text-white font-semibold`}>Redeem Points</Text>
          </TouchableOpacity>
        </View>

        {/* Activities Just For You */}
        <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
          Activities Just For You
        </Text>
        {recLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedActivities.map((activity) => (
              <View key={activity.id} style={tw`bg-white mr-3 p-4 rounded-lg w-48`}>
                <Text style={tw`text-base font-bold mb-1`}>
                  {activity.title || 'Untitled'}
                </Text>
                <TouchableOpacity onPress={() => router.push(`/activity/${activity.id}`)}>
                  <Text style={tw`text-blue-500 font-semibold`}>Learn more</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Additional Info Section */}
        <View style={tw`mt-6`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
            Additional Info
          </Text>
          <Text style={tw`text-sm text-gray-600`}>
            Here you could display more fields about the user, e.g. phone number, 
            address, membership level, or anything else relevant to your app.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyAccount;
