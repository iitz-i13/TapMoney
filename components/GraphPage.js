import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute ,useFocusEffect} from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {Swipeable} from 'react-native-gesture-handler';

const GraphPage = () => {
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0)); // Monthly data state
  const navigation = useNavigation();
  const route = useRoute();
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;
  const [records, setRecords] = useState([]); 
  useFocusEffect(
    React.useCallback(() => {
      const fetchRecords = async () => {
        try {
          const storedRecords = await AsyncStorage.getItem('records');
          if (storedRecords !== null) {
            setRecords(JSON.parse(storedRecords));
          }
        } catch (error) {
          console.error('Failed to fetch records:', error);
        }
      };

      fetchRecords();
    }, []),
  );

  const acc ={}

  const monthlyTotals = records.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    const key =  date.getMonth() + 1; // timestampをキーとして使用
    const amount = record.amount;
    if (!acc[key]) {
      // その月の初めの記録なので金額を初期化
      acc[key] = amount;
    } else {
      // 既に金額が設定されている場合、金額を加算
      acc[key] += amount;
    }
    return acc;
  }, {});

  const generateMonthLabels = () => {
    const labels = [];
    for (let i = 1; i <= 12; i++) {
      labels.push(`${i} 月`);
    }
    return labels;
  };
  const generateDataArray = (monthlyTotals) => {
    return generateMonthLabels().map((label) => {
      const key = label.replace(' 月', '');
      return monthlyTotals[key] || 0;
    });
  };
  

  const chartData = {
    labels: generateMonthLabels(),
    datasets: [
      {
        data: generateDataArray(monthlyTotals),
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      },
    ],
  };
  
  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={{ flex: 1 }}>
      <LineChart
        data={chartData}
        width={390}
        height={400}
        chartConfig={chartConfig}
     />
     <View>
        {Object.keys(monthlyTotals).map((timestamp) => (
          <View key={timestamp} style={styles.monthlyTotalItem}>
            <Text>{timestamp}</Text>
            <Text>{monthlyTotals[timestamp]} 円</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text>Date: {item.timestamp}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Amount: {item.amount} 円</Text>
          </View>
        )}
      />
      <FlatList
        data={monthlyTotals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.monthlyItem}>
            <Text>Month {index + 1} Total: {item} 円</Text>
          </View>
        )}
      /> 
      {/* その他のコンポーネントや要素をここに追加 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力')}>
          <Text style={styles.buttonText}>Go to Input Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// スタイルの定義 (既存のスタイルを維持)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },

  // ... (その他のスタイル)
});

export default GraphPage;
