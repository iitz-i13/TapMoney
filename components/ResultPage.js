import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {Swipeable} from 'react-native-gesture-handler';

const ResultPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const testData = [
    { id: '22', timestamp: '2023-10-14T10:00:00.000Z', category: '交通費', amount: -1500 },
    { id: '21', timestamp: '2023-10-14T10:00:00.000Z', category: '食費', amount: -1200 },
    { id: '20', timestamp: '2023-10-13T10:00:00.000Z', category: '食費', amount: -3400 },
    { id: '19', timestamp: '2023-10-11T10:00:00.000Z', category: '交通費', amount: -1600 },
    { id: '18', timestamp: '2023-10-10T10:00:00.000Z', category: '食費', amount: -2500 },
    { id: '17', timestamp: '2023-10-08T10:00:00.000Z', category: '趣味', amount: -2000 },
    { id: '16', timestamp: '2023-10-08T10:00:00.000Z', category: '趣味', amount: -3100 },
    { id: '15', timestamp: '2023-10-07T10:00:00.000Z', category: '収入', amount: 10000 },
    { id: '14', timestamp: '2023-10-06T10:00:00.000Z', category: '交通費', amount: -1200 },
    { id: '13', timestamp: '2023-10-03T10:00:00.000Z', category: '食費', amount: -2700 },
    { id: '12', timestamp: '2023-10-03T10:00:00.000Z', category: '趣味', amount: -4500 },
    { id: '11', timestamp: '2023-10-03T10:00:00.000Z', category: '交通費', amount: -1500 },
    { id: '10', timestamp: '2023-10-02T10:00:00.000Z', category: '食費', amount: -3200 },
    { id: '09', timestamp: '2023-10-01T10:00:00.000Z', category: '収入', amount: 20000 },
    { id: '08', timestamp: '2023-09-3T10:00:00.000Z', category: '収入', amount: 5000 },
    { id: '07', timestamp: '2023-08-31T10:00:00.000Z', category: '収入', amount: 8000 },
    { id: '06', timestamp: '2023-07-31T10:00:00.000Z', category: '収入', amount: -4000 },
    { id: '05', timestamp: '2023-06-30T10:00:00.000Z', category: '収入', amount: -5000 },
    { id: '04', timestamp: '2023-05-31T10:00:00.000Z', category: '収入', amount: 6000 },
    { id: '03', timestamp: '2023-04-30T10:00:00.000Z', category: '収入', amount: -4000 },
    { id: '02', timestamp: '2023-03-31T10:00:00.000Z', category: '収入', amount: 4500 },
    { id: '01', timestamp: '2023-02-28T10:00:00.000Z', category: '収入', amount: 5356 },
    { id: '00', timestamp: '2023-01-31T10:00:00.000Z', category: '収入', amount: 2000 }
];

  const [records, setRecords] = useState([]); // 記録を保存するためのstate

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
    }, [])
  );

  const initializeTestData = async () => {
  try {
    // AsyncStorageから記録を取得
    const storedRecords = await AsyncStorage.getItem('records');

    // データがnull（存在しない）の場合、テストデータをAsyncStorageにセットする
    if (storedRecords === null) {
      await AsyncStorage.setItem('records', JSON.stringify(testData));
      setRecords(testData);
    } else {
      setRecords(JSON.parse(storedRecords));
    }
  } catch (error) {
    console.error('Failed to initialize test data:', error);
  }
};

useEffect(() => {
  initializeTestData();
}, []);

  // CategorizePageから渡された情報を取得
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;

  const openMemoPage = async item => {
    navigation.navigate('メモ', {item: item, memo: item.memo});
    // ここでrecordsの情報の再取得
    try {
      let storedRecords = await AsyncStorage.getItem('records');
      if (storedRecords) {
        setRecords(JSON.parse(storedRecords));
      }
    } catch (error) {
      console.error('Failed to fetch updated records:', error);
    }
  };

  const formatNumberWithCommas = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // タイムスタンプを月・日形式で表示するヘルパー関数
  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.resetButton} onPress={showGraphPage}>
            <Text>グラフ表示</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetData} >
            <Text>初期化</Text>
          </TouchableOpacity>
        </View>
        
      ),
    });
  }, [navigation]);

  const showGraphPage = () => {
    navigation.navigate('グラフ表示', {data: records});
  };

  const resetData = async () => {
    // アラートの表示
    Alert.alert(
      'データリセット', // タイトル
      '全てのデータを削除します\n データを復元することはできません\n 本当に初期化しますか？', // メッセージ
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'はい',
          onPress: async () => {
            // OKを選択した場合の処理
            try {
              await AsyncStorage.removeItem('records'); // データを初期化
              setRecords([]); // ステートも初期化
            } catch (error) {
              console.error('Failed to reset data:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  React.useEffect(() => {
    const addNewRecord = async () => {
      if (timestamp && category && amount) {
        const newId = uuid.v4();

        const newRecord = {
          id: newId,
          timestamp: timestamp,
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
    return formatNumberWithCommas(
      records.reduce((acc, record) => acc + parseFloat(record.amount), 0),
    );
  };

  const renderRightActions = (item) => {
    const handleDelete = async () => {
      const updatedRecords = records.filter(record => record.id !== item.id);
      setRecords(updatedRecords);
      await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
    };

    return (
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>削除</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>残高： {calculateBalance()}円</Text>
      </View>

      <View style={styles.recordHeader}>
        <Text style={styles.headerDateItem}>日付</Text>
        <Text style={styles.headerItem}>カテゴリー</Text>
        <Text style={styles.headerItem}>金額</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={records}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
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
                  <View style={styles.dateAndCategory}>
                    <Text style={styles.dateText}>
                      {formatTimestamp(item.timestamp)}
                    </Text>
                    <View style={styles.categoryContainer}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.smallMemo}>
                    {item.memo
                      ? item.memo.length > 10
                        ? item.memo.slice(0, 10) + '...'
                        : item.memo
                      : ' '}
                  </Text>
                </View>
                <Text style={styles.amountText}>
                  {formatNumberWithCommas(item.amount)} 円
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力', )}>
          <Text style={styles.buttonText}>金額入力へ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerRow: {
    flexDirection: 'row',
  }, 

  resetButton: {
    marginLeft: 10, 
  },

  header: {
    justifyContent: 'center', // 垂直方向（縦）に中央に配置
    alignItems: 'center', // 水平方向（横）に中央に配置
    height: 70, // ヘッダーの高さを設定
    borderBottomWidth: 1, // 下の境界線
    borderColor: '#00FF99',
    backgroundColor: '#00FF99',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },

  dateAndCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    width: '100%',
    padding: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 28,
    color: 'black',
  },

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#EEEEEE',
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

  categoryText: {
    textAlign: 'center',
    fontSize: 15,
  },

  amountText: {
    textAlign: 'center',
    fontSize: 15,
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
    padding: 12,
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

  smallMemo: {
    fontSize: 12,
    color: 'gray', // 好みの色に調整することができます
    marginLeft: -15,
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
    fontWeight: 'bold',
    fontSize: 15,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
    backgroundColor: '#fff',
  },
});

export default ResultPage;