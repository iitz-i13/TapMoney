import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CategorizePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => navigation.navigate('残高確認画面')}>
        <Text>食費</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => navigation.navigate('残高確認画面')}>
        <Text>交通費</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => navigation.navigate('残高確認画面')}>
        <Text>趣味</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.expenseButton]}
        onPress={() => navigation.navigate('残高確認画面')}>
        <Text>その他</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.incomeButton]}
        onPress={() => navigation.navigate('残高確認画面')}>
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
