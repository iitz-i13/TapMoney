import React from 'react';
<<<<<<< HEAD
import {StyleSheet, View, Text, } from 'react-native';

const ResultPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ccc</Text>
=======
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ResultPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      {/* この部分はそのままで、他のコンテンツを追加することも可能。 */}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('金額入力画面')}>
          <Text style={styles.buttonText}>Go to Input Page</Text>
        </TouchableOpacity>
      </View>
>>>>>>> resultpage
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
<<<<<<< HEAD
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ResultPage;
=======
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
>>>>>>> resultpage
