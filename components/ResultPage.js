import React, { useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const ResultPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [records, setRecords] = useState([]); // 記録を保存するためのstate

  // CategorizePageから渡された情報を取得
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;

  // タイムスタンプを月・日形式で表示するヘルパー関数
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  React.useEffect(() => {
    if (timestamp && category && amount) {
      const newRecord = {
        id: timestamp,
        timestamp: formatTimestamp(timestamp),
        category: category,
        amount: amount,
      };
      setRecords(prevRecords => [newRecord, ...prevRecords]);
    }
  }, [timestamp, category, amount]);

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>残高: ￥{amount}</Text> 
      </View>

      {/* 記録のリストを表示 */}
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordRow}>
            <Text>{item.timestamp}</Text>
            <Text>{item.category}</Text>
            <Text>{item.amount}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力画面')}>
          <Text style={styles.buttonText}>Go to Input Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  balanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.0,
  },
  
  balanceText: {
    fontSize: 24,
    marginBottom: 20,
  },

  button: {
    width: '100%', 
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  buttonText: {
    fontSize: 18,
  },

  recordRow: {
    flexDirection: 'row',  // 横並びにする
    justifyContent: 'space-between', // 各項目を均等に配置
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
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

export default ResultPage;
