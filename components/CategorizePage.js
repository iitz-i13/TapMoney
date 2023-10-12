import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategorizePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [buttonText, setButtonText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [items, setItems] = useState([
    {type: 'income', label: '収入'},
    {type: 'expense', label: '食費'},
    {type: 'expense', label: '交通費'},
    {type: 'expense', label: '趣味'},
  ]);

  const resetButtons = async () => {
    setItems([
      {type: 'income', label: '収入'},
      {type: 'expense', label: '食費'},
      {type: 'expense', label: '交通費'},
      {type: 'expense', label: '趣味'},
    ]);
    await AsyncStorage.removeItem('items');
  };

  // 属性項目の最大数を定義
  const MAX_ITEMS = 10;

  //属性項目追加
  const addItem = async type => {
    if (!buttonText.trim()) {
      // trimを使って空白のみの場合も考慮
      Alert.alert(
        'エラー',
        '新しい項目名を入力してください。',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    // 既存の同じタイプの項目と新しい項目名が一致するかをチェック
    const duplicateItem = items.find(
      item => item.type === type && item.label === buttonText.trim(),
    );
    if (duplicateItem) {
      Alert.alert(
        'エラー',
        `すでに「${buttonText}」という名前の${
          type === 'income' ? '収入' : '支出'
        }項目が存在します。`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }

    // 属性項目の最大数を超えて追加しようとした場合の制限とアラート
    if (items.length >= MAX_ITEMS) {
      Alert.alert(
        'エラー',
        `属性項目は${MAX_ITEMS}個までしか追加できません。`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }

    const newItem = {type: type, label: buttonText};
    const newItems = [newItem, ...items];
    setItems(newItems);
    await AsyncStorage.setItem('items', JSON.stringify(newItems));
    setButtonText('');
  };

  //項目の順番変更
  const moveItem = (index, direction) => {
    if (
      (index === 0 && direction === 'up') ||
      (index === items.length - 1 && direction === 'down')
    ) {
      return;
    }

    const newItems = [...items];
    const itemToMove = newItems[index];

    if (direction === 'up') {
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = itemToMove;
    } else if (direction === 'down') {
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = itemToMove;
    }

    setItems(newItems);
  };

  //ヘッダーの編集ボタン
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', paddingRight: 10}}>
          {showInput ? (
            <React.Fragment>
              <Button title="完了" onPress={toggleInputForm} />
            </React.Fragment>
          ) : (
            <Button title="編集" onPress={toggleInputForm} />
          )}
        </View>
      ),
    });
  }, [showInput, navigation]);

  const deleteItem = async index => {
    const itemName = items[index].label; // 削除しようとしているアイテムの名前を取得
    Alert.alert(
      '確認', // タイトル
      `${itemName}を削除してもよろしいですか？`, // メッセージ
      [
        {
          text: 'キャンセル',
          onPress: () => console.log('キャンセル'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
            await AsyncStorage.setItem('items', JSON.stringify(newItems));
          },
        },
      ],
      {cancelable: false},
    );
  };

  const toggleInputForm = () => {
    setShowInput(!showInput);
  };

  const receivedAmount = route.params?.amount || '0';

  const handleCategoryPress = (category, isExpense = false) => {
    const timestamp = new Date().toISOString();
    let finalAmount = receivedAmount;

    // isExpenseがtrueであれば、amountをマイナスにする
    if (isExpense) {
      finalAmount = (-1 * parseFloat(receivedAmount)).toString();
    }

    navigation.navigate('残高確認', {
      timestamp: timestamp,
      category: category,
      amount: finalAmount,
    });
  };

  const CategoryButton = ({title, onPress, style, disabled}) => {
    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={disabled ? null : onPress}
        activeOpacity={disabled ? 1 : 0.2}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showInput && (
        <View>
          {/* ボタンの追加 */}
          <View style={styles.addButtonContainer}>
            <TextInput
              placeholder="新項目名を入力"
              value={buttonText}
              onChangeText={text => setButtonText(text)}
              maxLength={18}
              style={{
                marginTop: 10,
                borderWidth: 2,
                borderColor: '#ccc',
                width: 150,
                padding: 10,
                marginBottom: 1,
                alignItems: 'center',
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => addItem('income')}
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 5,
                  width: 150,
                  backgroundColor: '#DDFFDD',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Text style={styles.addbuttonText}>収入項目として追加</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addItem('expense')}
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 5,
                  width: 150,
                  backgroundColor: '#FFDDDD',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Text style={styles.addbuttonText}>支出項目として追加</Text>
              </TouchableOpacity>
            </View>

            {/* リセットボタン */}
            <View style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    '確認', // タイトル
                    '属性項目を初期化しますか？', // メッセージ
                    [
                      {
                        text: 'キャンセル',
                        onPress: () => console.log('キャンセル'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: resetButtons,
                      },
                    ],
                    {cancelable: false},
                  );
                }}
                style={{padding: 5, backgroundColor: 'red', marginLeft: 10}}>
                <Text style={{color: 'white'}}>属性項目を初期化</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/*InputPageから渡されたの金額表示*/}
      {!showInput && (
        <Text style={styles.amountText}>
          {receivedAmount.toLocaleString('ja-JP')} 円
        </Text>
      )}

      <ScrollView
        style={[styles.scrollView, !showInput && styles.scrollViewFullWidth]}>
        {items.map((item, index) => (
          <View
            key={`${item.type}-${index}`}
            style={[
              {flexDirection: 'row', alignItems: 'center', marginTop: 10},
              !showInput && styles.itemCentered,
            ]}>
            <CategoryButton
              title={item.label}
              onPress={() =>
                handleCategoryPress(item.label, item.type === 'expense')
              }
              style={
                item.type === 'income'
                  ? styles.incomeButton
                  : styles.expenseButton
              }
              disabled={showInput}
            />
            {showInput && (
              <>
                {index !== 0 && (
                  <TouchableOpacity
                    onPress={() => moveItem(index, 'up')}
                    style={{
                      padding: 5,
                      backgroundColor: 'lightblue',
                      marginLeft: 10,
                    }}>
                    <Text>↑</Text>
                  </TouchableOpacity>
                )}
                {index !== items.length - 1 && (
                  <TouchableOpacity
                    onPress={() => moveItem(index, 'down')}
                    style={{
                      padding: 5,
                      backgroundColor: 'lightblue',
                      marginLeft: 10,
                    }}>
                    <Text>↓</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteItem(index)}
                  style={{padding: 5, backgroundColor: 'red', marginLeft: 10}}>
                  <Text style={{color: 'white'}}>削除</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {},
  scrollViewFullWidth: {
    width: '100%',
  },
  itemCentered: {
    justifyContent: 'center',
    width: '100%',
  },

  buttonText: {
    fontSize: 20, // フォントサイズ設定
  },
  addbuttonText: {
    fontSize: 15, // フォントサイズ設定
  },
  editButtonContainer: {
    alignSelf: 'flex-end',
    position: 'absolute', // 絶対位置指定
    top: 10, // 上からの距離
    right: 10, // 右からの距離
  },
  addButtonContainer: {
    justifyContent: 'center', // 子要素を垂直方向の中央に配置
    alignItems: 'center', // 子要素を水平方向の中央に配置
    width: '100%', // 画面全体の幅を取る
  },
  amountText: {
    marginTop: 10,
    fontSize: 36,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  addbutton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  deletebutton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'right',
  },

  expenseButton: {
    width: 200,
    backgroundColor: '#FFDDDD', // 薄い赤色
  },
  incomeButton: {
    width: 200,
    backgroundColor: '#DDFFDD', // 薄い緑色
  },
});

export default CategorizePage;
