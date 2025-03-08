import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Svg, { Path, Text as SVGText } from 'react-native-svg';
import { useRouter } from 'expo-router';

interface Activity {
  id: number;
  title: string | null;
  description: string;
  points: number;
  completed?: boolean;  // Added optional property
}

interface PositionedActivity extends Activity {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Helper to check overlap of bounding boxes
function boxesOverlap(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

// Finds a random position that does not overlap existing shapes
function findNonOverlappingPosition(
  shapeWidth: number,
  shapeHeight: number,
  placed: PositionedActivity[],
  canvasWidth: number,
  canvasHeight: number,
  maxAttempts = 50
) {
  for (let i = 0; i < maxAttempts; i++) {
    // Keep a 20px margin from edges
    const minX = 20;
    const maxX = canvasWidth - shapeWidth - 20;
    const minY = 20;
    const maxY = canvasHeight - shapeHeight - 20;

    if (maxX < minX || maxY < minY) {
      return { x: 20, y: 20 };
    }

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    let overlapFound = false;
    for (const p of placed) {
      if (boxesOverlap(x, y, shapeWidth, shapeHeight, p.x, p.y, p.width, p.height)) {
        overlapFound = true;
        break;
      }
    }

    if (!overlapFound) {
      return { x, y };
    }
  }
  return { x: 20, y: 20 };
}

// Compute polygon path
function getPolygonPath(width: number, height: number) {
  const safeW = isNaN(width) ? 100 : width;
  const safeH = isNaN(height) ? 60 : height;
  return `
    M 10,0
    L ${safeW - 10},0
    L ${safeW},${safeH / 2}
    L ${safeW - 10},${safeH}
    L 10,${safeH}
    L 0,${safeH / 2}
    Z
  `;
}

const Activities = () => {
  const [activities, setActivities] = useState<PositionedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  // Define a larger canvas for scrolling (e.g., 2x screen size)
  const canvasWidth = screenWidth * 2;
  const canvasHeight = screenHeight * 2;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }
        const response = await fetch('http://10.0.2.2:8000/api/activities/', {
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

        const placed: PositionedActivity[] = [];

        data.forEach((item) => {
          const safeTitle = typeof item.title === 'string' ? item.title : 'Untitled';
          const shapeWidth = Math.max(100, safeTitle.length * 12);
          const shapeHeight = 60;
          const { x, y } = findNonOverlappingPosition(
            shapeWidth,
            shapeHeight,
            placed,
            canvasWidth,
            canvasHeight
          );

          placed.push({
            ...item,
            title: safeTitle,
            x,
            y,
            width: shapeWidth,
            height: shapeHeight,
          });
        });

        setActivities(placed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [canvasWidth, canvasHeight]);

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
    <View style={tw`flex-1`}>
      <TouchableOpacity
        style={[
          tw`absolute top-8 left-5 z-10 p-2 bg-white rounded-xl`,
        ]}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={tw`font-bold text-black`}>Back</Text>
      </TouchableOpacity>

      {/* Outer ScrollView for horizontal scrolling */}
      <ScrollView horizontal>
        {/* Inner ScrollView for vertical scrolling */}
        <ScrollView contentContainerStyle={{ width: canvasWidth, height: canvasHeight }}>
          <ImageBackground
            source={require('../public/map.png')}
            style={{ width: canvasWidth, height: canvasHeight }}
          >
            {activities.map((item) => {
              // For completed activities, use a random colorful background.
              // Otherwise, use white.
              const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
              const fillColor = item.completed ? randomColor : "#ffffff";
              const path = getPolygonPath(item.width, item.height);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(`/activity/${item.id}`)}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                  }}
                >
                  <Svg width={item.width} height={item.height}>
                    <Path d={path} fill={fillColor} />
                    <SVGText
                      x={item.width / 2}
                      y={item.height / 2}
                      fill="black"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {item.title}
                    </SVGText>
                  </Svg>
                </TouchableOpacity>
              );
            })}
          </ImageBackground>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Activities;
