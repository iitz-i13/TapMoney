import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
import { LineChart, BarChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GraphPage = () => {
  const navigation = useNavigation();
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

  const monthlyTotals = records.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    const key =  date.getMonth() + 1; // timestampをキーとして使用
    const amount = record.amount;
    if (!acc[key]) {
      // その月の初めの記録なので金額を初期化
      acc[key] = Math.floor(amount);
    } else {
      // 既に金額が設定されている場合、金額を加算
      acc[key] += Math.floor(amount);
    }
    return acc;
  }, {});
  
  const generateMonthLabels = () => {
    const labels = [];
    for (let i = 1; i <= 12; i++) {
      labels.push(`${i}`);
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
      },
      {
        data: Array(12).fill(0), // 12ヶ月分の0データ
        color: (opacity = 2) => `rgba(0, 255, 255, ${opacity})`,
        strokeWidth: 0,
        // fillShadowGradientOpacity: 1,
        fillShadowGradient: 'black',  // 0円の位置に黒い線
      },
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
     
      {/* その他のコンポーネントや要素をここに追加 */}
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