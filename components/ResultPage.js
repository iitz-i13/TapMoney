import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Swipeable } from 'react-native-gesture-handler';

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.resetButton} onPress={resetData}>
          <Text>Reset</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const resetData = async () => {
    // アラートの表示
    Alert.alert(

      'データリセット',  // タイトル
      '全データを初期化してもよろしいですか？\n データを復元することはできません',  // メッセージ
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {  // OKを選択した場合の処理
            try {
              await AsyncStorage.removeItem('records');  // データを初期化
              setRecords([]);  // ステートも初期化
            } catch (error) {
              console.error('Failed to reset data:', error);
            }
          }
        }
      ],
      {cancelable: false}
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* ここで残高を計算して表示 */}
        <Text style={styles.headerText}>残高： {calculateBalance()}円</Text>
      </View>

      <View style={styles.recordHeader}>
        <Text style={styles.headerItem}>日付</Text>
        <Text style={styles.headerItem}>カテゴリー</Text>
        <Text style={styles.headerItem}>金額</Text>
      </View>

      {/* 記録のリストを表示 */}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={records}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
            <TouchableOpacity
              onPress={async () => {
                let storedRecords = JSON.parse(
                  await AsyncStorage.getItem('records'),
                );
                const recordWithMemo = storedRecords.find(
                  record => record.id === item.id,
                );
                openMemoPage(recordWithMemo);
              }}>
              <View
                style={[
                  item.amount > 0
                    ? styles.incomeBackground
                    : styles.expenseBackground,
                  styles.recordRow,
                ]}>
                <View style={styles.leftGroup}>
                  <Text style={styles.dateText}>{item.timestamp}</Text>
                  <Text>{item.category}</Text>
                  <Text style={styles.smallMemo}>
                    {item.memo
                      ? item.memo.length > 10
                        ? item.memo.slice(0, 10) + '...'
                        : item.memo
                      : ' '}
                  </Text>
                </View>
                <Text>{item.amount} 円</Text>
              </View>
            </TouchableOpacity>
        renderItem={({ item }) => (
          <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
            <View 
              style={[
                item.amount > 0 ? styles.incomeBackground : styles.expenseBackground,
                styles.recordRow
              ]}
            >
              <Text>{item.timestamp}</Text>
              <Text>{item.category}</Text>
              <Text>{item.amount} 円</Text>
            </View>
          </Swipeable>
        )}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },

  header: {
    justifyContent: 'center',  // 垂直方向（縦）に中央に配置
    alignItems: 'center',      // 水平方向（横）に中央に配置
    height: 70,               // ヘッダーの高さを設定
    borderBottomWidth: 1,     // 下の境界線
    borderColor: '#33CC66',
    backgroundColor: '#33CC66', 
  },

  headerText: {
    fontSize: 24,
    color: 'white'
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
    fontSize: 18,
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
  },

  incomeBackground: {
    backgroundColor: 'lightgreen',
  },

  expenseBackground: {
    backgroundColor: '#FFB6C1',
  },

  recordRow: {
    flexDirection: 'row', // 横並びにする
    justifyContent: 'space-between', // 各項目を均等に配置
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
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
    height: 60, // footerの高さを確定的にする
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
    backgroundColor: '#fff', // footerの背景を白に
  },
});

export default ResultPage;
