import React from 'react';
import {StyleSheet, View, Text, } from 'react-native';

const ResultPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ccc</Text>
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
});
export default ResultPage;

{
  /* ここresult画面で使えそう
<ScrollView
contentInsetAdjustmentBehavior="automatic"
style={backgroundStyle}>
<Header />
<View
	style={{
	backgroundColor: isDarkMode ? Colors.black : Colors.white,
	}}>
</View>
</ScrollView> */
}
