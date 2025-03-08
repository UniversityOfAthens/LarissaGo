import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Svg, { Path, Text as SVGText } from 'react-native-svg';
import { useRouter } from 'expo-router';

interface Activity {
  id: number;
  title: string | null;   // Title can be string or null/undefined
  description: string;
  points: number;
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
  screenWidth: number,
  screenHeight: number,
  maxAttempts = 50
) {
  // We'll try up to `maxAttempts` times
  for (let i = 0; i < maxAttempts; i++) {
    // Keep a 20px margin from edges
    const minX = 20;
    const maxX = screenWidth - shapeWidth - 20;
    const minY = 20;
    const maxY = screenHeight - shapeHeight - 20;

    // If there's not enough space, bail out
    if (maxX < minX || maxY < minY) {
      // We'll place at 0,0 as a fallback
      return { x: 0, y: 0 };
    }

    // Pick random x,y
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    // Check overlap
    let overlapFound = false;
    for (const p of placed) {
      if (boxesOverlap(x, y, shapeWidth, shapeHeight, p.x, p.y, p.width, p.height)) {
        overlapFound = true;
        break;
      }
    }

    if (!overlapFound) {
      // Found a valid position
      return { x, y };
    }
  }

  // If all attempts fail, fallback to (20, 20)
  return { x: 20, y: 20 };
}

// Compute polygon path
function getPolygonPath(width: number, height: number) {
  // Guard in case something is NaN
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

  // Screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
          // Guard the title
          const safeTitle = typeof item.title === 'string' ? item.title : 'Untitled';

          // Compute shape dimensions
          const shapeWidth = Math.max(100, safeTitle.length * 12);
          const shapeHeight = 60;

          // Find a non-overlapping position
          const { x, y } = findNonOverlappingPosition(
            shapeWidth,
            shapeHeight,
            placed,
            screenWidth,
            screenHeight
          );

          placed.push({
            ...item,
            title: safeTitle, // store the guarded title
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
  }, [screenWidth, screenHeight]);

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
    <View style={tw`flex-1 bg-white`}>
      {activities.map((item) => {
        // Generate a random pastel color
        const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;

        // Build the polygon path
        const path = getPolygonPath(item.width, item.height);

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/activity/${item.id}`)}
            style={[
              {
                position: 'absolute',
                left: item.x,
                top: item.y,
              },
            ]}
          >
            <Svg width={item.width} height={item.height}>
              <Path d={path} fill={randomColor} />
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
    </View>
  );
};

export default Activities;
