import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const CategorizePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // InputPageから渡された数字を取得
  const receivedAmount = route.params?.amount || '0'; // <-- ここで数字を取得

  const handleCategoryPress = category => {
    const timestamp = new Date().toISOString();
    navigation.navigate('残高確認', {
      timestamp: timestamp,
      category: category,
      amount: receivedAmount,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.amountText}>{receivedAmount} 円</Text>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => handleCategoryPress('食費')}>
        <Text>食費</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => handleCategoryPress('交通費')}>
        <Text>交通費</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => handleCategoryPress('趣味')}>
        <Text>趣味</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => handleCategoryPress('その他')}>
        <Text>その他</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.incomeButton]}
        onPress={() => handleCategoryPress('収入')}>
        <Text>収入</Text>
      </TouchableOpacity>
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
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  expenseButton: {
    backgroundColor: '#FFDDDD', // 薄い赤色
  },
  incomeButton: {
    backgroundColor: '#DDFFDD', // 薄い緑色
  },
});

export default CategorizePage;
