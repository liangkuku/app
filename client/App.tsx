import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  FlatList,
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
import Chat from './src/chat/chat';

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

// interface IReceiverMessage {
//   senderId: string;
//   message: string;
// }

// const userId = '123';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // const [socket, setSocket] = useState<any>();

  // useEffect(() => {
  //   const newSocket = io('http://192.168.0.100:3000', {query: {userId}});
  //   newSocket.on('connect', () => {
  //     console.log('Connected', newSocket.id);
  //   });
  //   newSocket.on('disconnect', function () {
  //     console.log('Disconnected');
  //   });
  //   setSocket(newSocket);
  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

  // const [inputMessage, setInputMessage] = useState<string>('123');
  // const [receiverMessages, setReceiveMessage] = useState<IReceiverMessage[]>(
  //   [],
  // );

  // const sendMessage = () => {
  //   const chatMessage = {
  //     senderId: userId,
  //     receiveId: '456',
  //     message: inputMessage,
  //     timestamp: new Date(),
  //   };
  //   socket.emit('message', chatMessage, (response: any) => {
  //     setReceiveMessage(response);
  //   });
  //   setInputMessage('');
  // };

  return (
    <SafeAreaView>
      <Chat />
      <Text>------</Text>
      <Chat />
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
