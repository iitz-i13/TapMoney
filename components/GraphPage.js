import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Swipeable } from 'react-native-gesture-handler';

const GraphPage = () => {
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0)); // 月次データのstate
  const navigation = useNavigation();
  const route = useRoute();
  const [records, setRecords] = useState([]);
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;
  React.useEffect(() => {
    const addNewRecord = async () => {
      if (timestamp && category && amount) {
        const newId = uuid.v4();

        const newRecord = {
          id: newId,
          timestamp: formatTimestamp(timestamp),
          category: category,
          amount: amount,
        };

        // AsyncStorageから記録を読み出す
        let storedRecords = [];
        try {
          const result = await AsyncStorage.getItem('records');
          if (result !== null) {
            storedRecords = JSON.parse(result);
          }
        } catch (error) {
          console.error('Failed to fetch records:', error);
        }

        // 新しい記録を追加
        const updatedRecords = [newRecord, ...storedRecords];
        setRecords(updatedRecords); // ステートを更新

        // 更新された記録をAsyncStorageに保存
        try {
          await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
        } catch (error) {
          console.error('Failed to save record:', error);
        }
      }
    };

    addNewRecord();
  }, [timestamp, category, amount]);
  const calculateMonthlyTotals = (records) => {
    const monthlyTotals = {};
  
    records.forEach((record) => {
      const date = new Date(record.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月は0から11で表現されているため+1
  
      const key = `${year}-${month}`;
      if (!monthlyTotals[key]) {
        monthlyTotals[key] = 0;
      }
  
      monthlyTotals[key] += record.amount;
    });
  
    return monthlyTotals;
  };
  const calculateBalance = () => {
    return records.reduce((acc, record) => acc + parseFloat(record.amount), 0);
  };

  const renderRightActions = (progress, dragX, item) => {
    const handleDelete = async () => {
      const updatedRecords = records.filter(record => record.id !== item.id);
      setRecords(updatedRecords);
      await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
    };

    return (
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };
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
  
  const monthlyTotals = calculateMonthlyTotals(records); // calculateMonthlyTotalsは前のコードで定義
  
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
      {/* records の内容を表示 */}
      <Text>Records: {JSON.stringify(records)}</Text>
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