import {useState, useEffect, FC} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import {io} from 'socket.io-client';
import {ChatProps, IMsg, IMsgResponse} from './type';
import GuidUtils from '../utils/guid';

/** 聊天 */
const Chat: FC<ChatProps> = ({userId}) => {
  const [socket, setSocket] = useState<any>();
  const [inputMsg, setInputMsg] = useState<string>('hello world1');
  // const [recMsgs, setRecMsgs] = useState<IRecMsg[]>([]);
  // const [sendMsgs, setSendMsgs] = useState<ISendMsg[]>([]);
  const [mgs, setMsgs] = useState<IMsg[]>([]);
  // const [userId, setUserId] = useState<string>();

  const sendMsg = () => {
    if (!userId || !inputMsg) return;
    const chatMessage: IMsg = {
      id: GuidUtils.getGuid(),
      senderId: userId,
      receiverId: userId === '1' ? '2' : '1',
      msg: inputMsg,
      timestamp: new Date(),
    };
    socket.emit('message', chatMessage, (response: IMsgResponse) => {
      if (response.status === 'success') {
        // 发送成功则显示在消息列
        setMsgs([...mgs, {...response.data}]);
      }
    });
    // setInputMsg('');
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
      <FlatList
        data={mgs.sort(
          (a, b) => a.timestamp?.getTime?.() - b.timestamp?.getTime?.(),
        )}
        renderItem={({item}) => {
          const isSelfSendMsg = item.senderId === userId;
          return (
            <View
              style={[
                styles.msgContainer,
                {
                  justifyContent: isSelfSendMsg ? 'flex-end' : 'flex-start',
                },
              ]}>
              {isSelfSendMsg ? (
                <View>
                  <Text>{item.msg} :我 </Text>
                </View>
              ) : (
                <View>
                  <Text>
                    {item.receiverId}: {item.msg}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        // keyExtractor={(item, index) => item.id}
      />
      <View>
        <Text>User ID:{userId}</Text>
        {/* <TextInput defaultValue={''} onChangeText={text => setUserId(text)} /> */}
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

const styles = StyleSheet.create({
  msgContainer: {
    width: '100%',
    display: 'flex',
    backgroundColor: 'red',
    // marginTop: 32,
    // paddingHorizontal: 24,
  },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
});

export default Chat;
