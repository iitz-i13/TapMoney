import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const InputPage = () => {
  const [input, setInput] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  const [operation, setOperation] = useState(null);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };  

  const handlePress = (value) => {
    let newInput = input + value;
  
    if (input === "0" && value !== "0") {
      setInput(formatNumberWithCommas(value));
    } else if (input !== "0" || (input === "0" && value !== "0")) {
      setInput(formatNumberWithCommas(newInput.replace(/,/g, "")));
    }
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
  };

  const handleClear = () => {
    setInput("");
    setPreviousInput("");
    setOperation(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{input}</Text>
      </View>
      <View style={styles.buttons}>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C','0', '→'].map((button, index) => (
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
        style={styles.centerButton}  // 修正したスタイル名
        onPress={() => navigation.navigate('属性選択画面')}>
        <Text>Go to Categorize Page</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}  // 修正したスタイル名
          onPress={() => navigation.navigate('残高確認画面')}>
          <Text style={styles.buttonText}>Go to Result Page</Text>
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
  centerButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },

  footerButton: {  // 新しいスタイル名
    width: '100%', 
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  display: {
    flex: 2,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  displayText: {
    fontSize: 36,
  },
  buttons: {
    flex: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: '23%',
    height: '23%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 35, // widthやheightの半分の値にする
    margin: 5 // ボタン間のスペースを作るために追加
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
