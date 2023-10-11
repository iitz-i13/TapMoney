import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const InputPage = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("0");
  const [previousInput, setPreviousInput] = useState("0");
  const [operation, setOperation] = useState(null);
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    // focus イベントのリスナーを追加
    const unsubscribe = navigation.addListener('focus', () => {
      setInput("0"); // input を初期化
    });

    // クリーンアップ関数を返すことで、イベントリスナーを削除します。
    return unsubscribe;
  }, [navigation]);

  const handlePress = (value) => {
    let newInput;
    if (value === "00") {
      // input が 0 だけで構成されている場合は 00 を追加しない
      if (/^0+$/.test(input)) {
        return;
      }
      newInput = input + "00";
    } else {
      // input が 0 だけで構成されている場合は新しい入力の数字に置き換える
      if (/^0+$/.test(input)) {
        newInput = value;
      } else {
        newInput = input + value;
      }
    }
    if (parseInt(newInput.replace(/,/g, "")) >= 1000000) {
      // 1,000,000を超える場合は、Alert ダイアログを表示
      Alert.alert(
        "入力エラー", // タイトル
        "100万以上は入力できません。", // メッセージ
        [
          { text: "OK", onPress: () => { } } // ボタン
        ]
      );
      return;
    }

    setInput(formatNumberWithCommas(newInput.replace(/,/g, "")));
  };

  const handleOperation = (op) => {
    if (!input) return;
    setPreviousInput(input);
    setInput("");
    setOperation(op);
  };

  const handleEqual = () => {
    if (!previousInput || !input) return;

    let result;
    setInput(String(result));
    setPreviousInput("");
    setOperation(null);
    // →ボタンを押したときに属性選択画面に遷移する処理を追加
    navigation.navigate('属性選択', { amount: input });
  };

  const handleClear = () => {
    setInput("0");
    setPreviousInput("0");
    setOperation(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{input}</Text>
      </View>
      <View style={styles.buttons}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '00'].map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              if (button === 'C') {
                handleClear();
              } else if (button === '→') {
                handleEqual();
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
          if (input === "0" || input === "00") {
            Alert.alert(
              "入力エラー", // タイトル
              "0は無効な入力です。", // メッセージ
              [
                { text: "OK", onPress: () => { } } // ボタン
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

