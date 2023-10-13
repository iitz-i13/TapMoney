import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
import { LineChart, BarChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GraphPage = () => {
  const navigation = useNavigation();
  const [records, setRecords] = useState([]); 
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 

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

  const monthlyTotals = records.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    const monthIndex = date.getMonth() + 1;
    const amount = record.amount;
    acc[monthIndex] = (acc[monthIndex] || 0) + Math.floor(amount);
    return acc;
  }, {});
  
  const accumulateTotals = (monthlyTotals) => {
    let accumulated = 0;
    const accumulatedTotals = {};
    for (let i = 1; i <= 12; i++) {
      accumulated += monthlyTotals[i] || 0;
      accumulatedTotals[i] = accumulated;
    }
    return accumulatedTotals;
  }
  
  const accumulatedData = accumulateTotals(monthlyTotals);
  
  const generateMonthLabels = (accumulatedData) => {
    const labels = [];
    for (let i = 1; i <= currentMonth; i++) { // currentMonthまでループ 今後変える必要あり
      if (accumulatedData[i] !== undefined) {
        labels.push(`${i}`);
      }
    }
    return labels;
  }; 

  const generateDataArray = (accumulatedData) => {
    const labels = generateMonthLabels(accumulatedData);
    return labels.map((label) => accumulatedData[label]);
  };
  
  const chartData = {
    labels: generateMonthLabels(accumulatedData),
    datasets: [
      {
        data: generateDataArray(accumulatedData),
      }
    ],
  };

  const { width, height } = Dimensions.get('window');
  const chartWidth = width  ; // 画面幅から余白を引く
  const chartHeight = height - 50; // 適切な高さを設定
  
  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0, // 小数点 
    color: (opacity = 1) => `black`,
    strokeWidth: 3,
  };

  return (
    <View style={{ flex: 1 }}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        withShadow={false}
        segments={5}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力')}>
          <Text style={styles.buttonText}>金額入力へ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 20,
    backgroundColor: '#CCFFCC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 28,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
});
export default GraphPage;