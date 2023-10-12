import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const InputPage = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState(0);  // 数値として初期化

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInput(0); // input を初期化
    });

    return unsubscribe;
  }, [navigation]);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePress = (value) => {
    let newInput = input;

    if (value === "00") {
      if (input === 0) {
        return;
      }
      newInput = input * 100;
    } else {
      if (input === 0) {
        newInput = parseInt(value, 10);
      } else {
        newInput = input * 10 + parseInt(value, 10);
      }
    }

    if (newInput >= 1000000) {
      Alert.alert("入力エラー", "100万以上は入力できません。", [{ text: "はい" }]);
      return;
    }

    setInput(newInput);
  };

  const handleClear = () => {
    setInput(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{formatNumberWithCommas(input)}</Text> 
      </View>
      <View style={styles.buttons}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '00'].map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              if (button === 'C') {
                handleClear();
              } else {
                handlePress(button);
              }
            }}>
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => {
          // 入力が「0」または「00」の場合、Alertを表示して処理を終了
          if (input === 0) {
            Alert.alert(
              "入力エラー", // タイトル
              "0は無効な入力です。", // メッセージ
              [
                { text: "はい", onPress: () => { } } // ボタン
              ]
            );
            return;
          }
          // 通常の画面遷移処理
          navigation.navigate('属性選択', { amount: input });
        }}>
        <Text style={styles.buttonText}>属性選択へ</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}  // 修正したスタイル名
          onPress={() => navigation.navigate('残高確認')}>
          <Text style={styles.buttonText}>残高確認へ</Text>
        </TouchableOpacity>
      </View>
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
  display: {
    position: 'absolute', // 位置を絶対値に設定
    top: 10, // 画面の最上部に配置
    width: '100%', // 画面の幅いっぱいに表示
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'lightgray', // 境界線の色（オプション）
    padding: 10, // 必要に応じてパディングを追加して、テキストが端にくっつかないようにする
    backgroundColor: '#fff', // 背景色を設定（オプション）
  },

  displayText: {
    fontSize: 36,
  },

  centerButton: {
    marginTop: 20,
    paddingVertical: 15,  // 縦方向のパディングを増やす
    paddingHorizontal: 60,  // 横方向のパディングを増やす
    backgroundColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },


  footerButton: {  // 新しいスタイル名
    width: '100%',
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '80%',  // この値は適切に調整してください
    marginTop: -10,
  },

  button: {
    // width: '33.33%',  // 3つのボタンが1行に並ぶように33.33%に設定
    width: 80,  // この値は適切に調整してください
    height: 80, // この値は適切に調整してください
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,  // ボタン間のスペースを追加
    borderRadius: 42.5,  // widthまたはheightの半分の値
    backgroundColor: '#f5f5f5',  // 背景色を追加（オプション）
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

export default InputPage;
