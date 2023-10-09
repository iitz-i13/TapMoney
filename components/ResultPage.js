import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [records, setRecords] = useState([]); // 記録を保存するためのstate

  // CategorizePageから渡された情報を取得
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;

  // タイムスタンプを月・日形式で表示するヘルパー関数
  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  React.useEffect(() => {
    // AsyncStorageから記録を読み出す
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
  }, []);

  React.useEffect(() => {
    const addNewRecord = async () => {
      if (timestamp && category && amount) {
        const newRecord = {
          id: timestamp,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.balanceText}>残高: ￥{amount}</Text>
      </View>

      {/* 記録のリストを表示 */}
      <FlatList
        contentContainerStyle={styles.listContent} // ここにスタイルを適用する
        data={records}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
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

  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, // ヘッダーの高さを設定
    borderBottomWidth: 1, // 下の境界線
    borderBottomColor: 'lightgray',
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
    flexDirection: 'row', // 横並びにする
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

  listContent: {
    // ここに新しいスタイルを追加
    paddingBottom: 60, // footerの高さに合わせて調整
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60, // footerの高さを確定的にする
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    backgroundColor: '#fff', // footerの背景を白に
  },
});

export default ResultPage;
