import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert,Dimensions } from 'react-native';
import { useNavigation, useRoute ,useFocusEffect} from '@react-navigation/native';
import { LineChart, BarChart} from 'react-native-chart-kit';
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
        //color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        //color: (opacity = 1) => 'black',
      },
    ],
  };
  const { width, height } = Dimensions.get('window');

// チャートのサイズを計算
const chartWidth = width  ; // 画面幅から余白を引く
const chartHeight = height - 50; // 適切な高さを設定
  
  const chartConfig = {
    //backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    fillShadowGradient: 'white',
    color: (opacity = 1) => `black`,
    //color: (opacity = 1) => 'white',
    strokeWidth: 2,
  };

  return (
    <View style={{ flex: 1 }}>
       <LineChart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        withShadow = {false}
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
          <Text style={styles.buttonText}>金額入力画面へ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// スタイルの定義 (既存のスタイルを維持)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },

  header: {
    justifyContent: 'center', // 垂直方向（縦）に中央に配置
    alignItems: 'center', // 水平方向（横）に中央に配置
    height: 70, // ヘッダーの高さを設定
    borderBottomWidth: 1, // 下の境界線
    borderColor: '#33CC66',
    backgroundColor: '#33CC66',
  },

  headerText: {
    fontSize: 24,
    color: 'white',
  },

  dateAndCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },

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

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'white',
  },

  headerItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20, // この値は適切に調整してください
  },

  headerDateItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, // この値は適切に調整してください
  },

  dateText: {
    marginLeft: 5,
    marginRight: 40, //日付とカテゴリーの間の空白
  },

  incomeBackground: {
    backgroundColor: 'lightgreen',
  },

  expenseBackground: {
    backgroundColor: '#FFB6C1',
  },

  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },

  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // これにより金額の部分のスペースを取らないようにします
  },

  categoryContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryText: {
    textAlign: 'center',
  },


  listContent: {
    paddingBottom: 60, // footerの高さに合わせて調整
  },

  deleteButton: {
    backgroundColor: 'red',
    borderColor: 'red', // 枠の色を赤にする
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },

  deleteText: {
    color: 'white',
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
