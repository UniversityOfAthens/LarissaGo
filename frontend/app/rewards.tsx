import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

interface Reward {
  id: number;
  title: string;
  points_needed: number;
  can_purchase: boolean;
  action: string; // "Redeem" if the user can purchase; otherwise "Earn more"
}

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const REWARDS_API_URL = 'http://10.0.2.2:8000/api/rewards/';

  // Fetch the rewards list
  const fetchRewards = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }
      const response = await fetch(REWARDS_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch rewards");
      }
      const data = await response.json();
      setRewards(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // Handle redeem action for a reward
  const handleRedeem = async (rewardId: number, canPurchase: boolean) => {
    if (!canPurchase) {
      Alert.alert(
        "Not enough points",
        "You don't have enough points to redeem this reward. Earn more points by completing activities.",
        [
          { text: "Go to Activities", onPress: () => router.push('/activities') },
          { text: "Cancel", style: 'cancel' }
        ]
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert("Error", "No token found. Please login.");
        return;
      }
      const response = await fetch(`http://10.0.2.2:8000/api/rewards/${rewardId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to redeem reward");
      }
      const resData = await response.json();
      Alert.alert("Success", resData.detail || "Reward redeemed successfully.");
      // Optionally refresh the rewards list
      fetchRewards();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  // Render a single reward item
  const renderReward = ({ item }: { item: Reward }) => (
    <View style={tw`mb-4 p-4 border rounded`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.title}</Text>
      <Text style={tw`mb-2`}>Points Needed: {item.points_needed}</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded`}
        onPress={() => handleRedeem(item.id, item.can_purchase)}
      >
        <Text style={tw`text-white text-center`}>{item.action}</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl mb-4`}>Available Rewards</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReward}
      />
    </View>
  );
};

export default Rewards;
