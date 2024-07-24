/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {io} from 'socket.io-client';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const socket = useRef(io('http://192.168.0.100:3000'))?.current;
  const [value, setValue] = useState<string>('10');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected', socket.id);
      socket.emit('events', {test: 'test'});
      // socket.emit('identity', 0, (response: any) =>
      //   console.log('Identity:', response),
      // );
    });
    socket.on('events', function (data) {
      // console.log('event', data);
      setValue(data);
    });
    socket.on('exception', function (data) {
      console.log('event', data);
    });
    socket.on('disconnect', function () {
      console.log('Disconnected');
    });
  }, []);
  const [inputText, setInputText] = useState<string>('');
  const [receiveMessage, setReceiveMessage] = useState<string>('');

  const sendMessage = useCallback(() => {
    socket.emit('identity', inputText, (response: any) => {
      setReceiveMessage(response);
    });
  }, [inputText]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>回复消息：{receiveMessage}</Text>

          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            onChangeText={text => setInputText(text)}
            defaultValue={inputText}
          />
          <Button
            onPress={() => {
              // Alert.alert('你点击了按钮！');
              sendMessage();
            }}
            title="点我！"
          />
          {/* <Text style={{padding: 10, fontSize: 42}}>
            {text
              .split(' ')
              .map(word => word && '🍕')
              .join(' ')}
          </Text> */}
          {/* <Section title="Step One">server:{value}</Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
