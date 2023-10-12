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
  const [records, setRecords] = useState([]); // 記録を保存するためのstate

  // CategorizePageから渡された情報を取得
  const timestamp = route.params?.timestamp;
  const category = route.params?.category;
  const amount = route.params?.amount;

  const openMemoPage = item => {
    navigation.navigate('メモ', {item: item, memo: item.memo});
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
        <TouchableOpacity style={styles.resetButton} onPress={resetData}>
          <Text>初期化</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
          text: 'OK',
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

  const renderRightActions = item => {
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
        {/* ここで残高を計算して表示 */}
        <Text style={styles.headerText}>残高： {calculateBalance()}円</Text>
      </View>

      <View style={styles.recordHeader}>
        <Text style={styles.headerDateItem}>日付</Text>
        <Text style={styles.headerItem}>カテゴリー</Text>
        <Text style={styles.headerItem}>金額</Text>
      </View>

      {/* 記録のリストを表示 */}
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
                      {formatTimestamp(timestamp)}
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
          onPress={() => navigation.navigate('グラフ表示')}>
          <Text style={styles.buttonText}>グラフ表示へ</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
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
    backgroundColor: '#FF773E',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
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
