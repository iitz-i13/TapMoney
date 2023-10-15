import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MemoPage = ({ route, navigation }) => {
  const [memo, setMemo] = useState(route.params?.item.memo || '');
  const [errorMessage, setErrorMessage] = useState('');

  const saveMemo = async () => {
    try {
      let storedRecords = JSON.parse(await AsyncStorage.getItem('records')) || [];
      const updatedRecord = { ...route.params.item, memo: memo };
      const index = storedRecords.findIndex(
        record => record.id === updatedRecord.id,
      );

      if (index !== -1) {
        storedRecords[index] = updatedRecord;
      } else {
        storedRecords.push(updatedRecord);
      }

      await AsyncStorage.setItem('records', JSON.stringify(storedRecords));
      navigation.navigate('残高確認');
    } catch (error) {
      console.error('Failed to save memo:', error);
      setErrorMessage('メモの保存に失敗しました。');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView>
        <TextInput
          autoFocus={true}
          style={styles.textInput}
          placeholder="メモを入力"
          value={memo}
          onChangeText={setMemo}
          maxLength={100}
          onSubmitEditing={saveMemo}
          returnKeyType="done"
        />
        {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
        <Button title="保存" onPress={saveMemo} />
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
