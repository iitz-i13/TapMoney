import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InputPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
    alignItems: 'center',
    justifyContent: 'center',
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

export default InputPage;
