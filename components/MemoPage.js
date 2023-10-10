import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MemoPage = ({route, navigation}) => {
  const [memo, setMemo] = useState(route.params?.item.memo || '');

  const saveMemo = async () => {
    const updatedRecord = {...route.params.item, memo: memo};

    try {
      let storedRecords = JSON.parse(await AsyncStorage.getItem('records'));
      const index = storedRecords.findIndex(
        record => record.id === updatedRecord.id,
      );
      storedRecords[index] = updatedRecord;
      await AsyncStorage.setItem('records', JSON.stringify(storedRecords));
      navigation.navigate('残高確認');
      } catch (error) {
        console.error('Failed to save memo:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView>
        <TextInput
          autoFocus={true}
          style={styles.textInput}
          placeholder="メモを入力"
          value={memo}
          onChangeText={setMemo}
          maxLength={100}
          multiline={true}
          onSubmitEditing={saveMemo}
          returnKeyType="done"
        />
        <Button title="Save" onPress={saveMemo} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default MemoPage;
