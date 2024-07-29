import {useState, useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';
import {io} from 'socket.io-client';
import {
  // IRecMsgResponse,
  // IRecMsg,
  // ISendMsgResponse,
  // ISendMsg,
  IMsg,
  IMsgResponse,
} from './type';

/** 聊天 */
const Chat = () => {
  const [socket, setSocket] = useState<any>();
  const [inputMsg, setInputMsg] = useState<string>('hello world1');
  // const [recMsgs, setRecMsgs] = useState<IRecMsg[]>([]);
  // const [sendMsgs, setSendMsgs] = useState<ISendMsg[]>([]);
  const [mgs, setMsgs] = useState<IMsg[]>([]);
  const [userId, setUserId] = useState<string>();

  const sendMsg = () => {
    if (!userId || !inputMsg) return;
    const chatMessage: IMsg = {
      senderId: userId,
      receiverId: userId === '1' ? '2' : '1',
      msg: inputMsg,
      timestamp: new Date(),
    };
    socket.emit('message', chatMessage, (response: IMsgResponse) => {
      if (response.status === 'success') {
        // 发送成功则显示在消息列
        setMsgs([...mgs, {...response.data}]);
        // setSendMsgs([...sendMsgs, {...response.data}]);
      }
    });
    setInputMsg('');
  };

  const recMsg = (response: IMsgResponse) => {
    if (response.status === 'success') {
      // 接收成功则显示在消息列
      setMsgs([...mgs, {...response.data}]);
      // setRecMsgs([...recMsgs, {...data.data}]);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const newSocket = io('http://192.168.0.100:3000', {query: {userId}});
    newSocket.on('connect', () => {
      console.log('Connected', userId);
    });
    newSocket.on('disconnect', () => {
      console.log('Disconnected', userId);
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [userId]);

  useEffect(() => {
    socket?.on('message', (data: IMsgResponse) => {
      recMsg(data);
    });
  }, [socket, recMsg]);

  return (
    <SafeAreaView>
      {/* <FlatList
        data={recMsgs}
        renderItem={({item}) => (
          <Text>
            {item.senderId}: {item.message}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      /> */}
      {/* <FlatList
        data={sendMsgs}
        renderItem={({item}) => (
          <Text>
            {userId}: {item.message}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      /> */}
      <View>
        <Text>User ID:</Text>
        <TextInput defaultValue={''} onChangeText={text => setUserId(text)} />
      </View>
      <View>
        <TextInput
          defaultValue={inputMsg}
          onChangeText={text => setInputMsg(text)}
        />
        <Button
          title="Send"
          onPress={() => {
            sendMsg();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
