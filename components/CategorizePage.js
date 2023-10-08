import React from 'react';
<<<<<<< HEAD
import {StyleSheet, View, Text, } from 'react-native';

const CategorizePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>bbb</Text>
=======
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CategorizePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('残高確認画面')}>
        <Text>Go to Result Page</Text>
      </TouchableOpacity>
>>>>>>> resultpage
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
<<<<<<< HEAD
});

export default CategorizePage;
=======
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
});

export default CategorizePage;
>>>>>>> resultpage
