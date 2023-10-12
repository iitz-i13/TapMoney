import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- 追加

const CategorizePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [buttonText, setButtonText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [incomeButtons, setIncomeButtons] = useState(['収入']);
  const [expenseButtons, setExpenseButtons] = useState([
    '食費',
    '交通費',
    '趣味',
  ]);

  // ボタン追加の関数
  const addIncomeButton = async () => {
    if (buttonText) {
      const newButtons = [...incomeButtons, buttonText];
      setIncomeButtons(newButtons);
      await AsyncStorage.setItem('incomeButtons', JSON.stringify(newButtons));
      setButtonText('');
    }
  };

  const addExpenseButton = async () => {
    if (buttonText) {
      const newButtons = [...expenseButtons, buttonText];
      setExpenseButtons(newButtons);
      await AsyncStorage.setItem('expenseButtons', JSON.stringify(newButtons));
      setButtonText('');
    }
  };

  useEffect(() => {
    const fetchButtons = async () => {
      const storedIncomeButtons = await AsyncStorage.getItem('incomeButtons');
      const storedExpenseButtons = await AsyncStorage.getItem('expenseButtons');
      if (storedIncomeButtons) {
        setIncomeButtons(JSON.parse(storedIncomeButtons));
      }
      if (storedExpenseButtons) {
        setExpenseButtons(JSON.parse(storedExpenseButtons));
      }
    };

    fetchButtons();
  }, []);

  const deleteIncomeButton = async index => {
    const newButtons = [...incomeButtons];
    newButtons.splice(index, 1);
    setIncomeButtons(newButtons);
    await AsyncStorage.setItem('incomeButtons', JSON.stringify(newButtons));
  };
  const deleteExpenseButton = async index => {
    const newButtons = [...expenseButtons];
    newButtons.splice(index, 1);
    setExpenseButtons(newButtons);
    await AsyncStorage.setItem('expenseButtons', JSON.stringify(newButtons));
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

  const CategoryButton = ({title, onPress, style}) => {
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* editボタン */}
      <View style={styles.editButtonContainer}>
        <Button title={showInput ? 'Done' : 'Edit'} onPress={toggleInputForm} />
      </View>

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
                onPress={addIncomeButton}
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 5,
                  width: 150,
                  backgroundColor: '#DDFFDD',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Text style={buttonText}>収入項目として追加</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addExpenseButton}
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 5,
                  width: 150,
                  backgroundColor: '#FFDDDD',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Text style={buttonText}>支出項目として追加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/*InputPageから渡されたの金額表示*/}
      <Text style={styles.amountText}>{receivedAmount} 円</Text>

      <ScrollView style={styles.scrollView}>
        {/* 収入ボタンリストの描画 */}
        {incomeButtons.map((buttonText, index) => (
          <View
            key={`income-${index}`}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <CategoryButton
              title={buttonText}
              onPress={() => handleCategoryPress(buttonText)}
              style={styles.incomeButton}
            />
            {showInput && (
              <TouchableOpacity
                onPress={() => deleteIncomeButton(index)}
                style={{padding: 5, backgroundColor: 'red', marginLeft: 10}}>
                <Text style={{color: 'white'}}>削除</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {/* 支出ボタンリストの描画 */}
        {expenseButtons.map((buttonText, index) => (
          <View
            key={`expense-${index}`}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <CategoryButton
              title={buttonText}
              onPress={() => handleCategoryPress(buttonText, true)}
              style={styles.expenseButton}
            />
            {showInput && (
              <TouchableOpacity
                onPress={() => deleteExpenseButton(index)}
                style={{padding: 5, backgroundColor: 'red', marginLeft: 10}}>
                <Text style={{color: 'white'}}>削除</Text>
              </TouchableOpacity>
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
  buttonText: {
    fontSize: 20, // ここを調整して目的のフォントサイズに設定
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
