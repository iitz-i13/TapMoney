import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const ResultPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // CategorizePageから渡された情報を取得
  const { timestamp, category, amount } = route.params;

  return (
    <View style={styles.container}>
      
      <Text>タイムスタンプ: {timestamp}</Text>
      <Text>カテゴリー: {category}</Text>
      <Text>料金: {amount}</Text>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力画面')}>
          <Text style={styles.buttonText}>Go to Input Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  button: {
    width: '100%', 
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  buttonText: {
    fontSize: 18,
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

export default ResultPage;
