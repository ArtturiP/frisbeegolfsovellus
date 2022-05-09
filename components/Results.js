import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Modal, Text } from 'react-native';
import * as SQLite from'expo-sqlite';
import { Button, Icon, Input, } from'react-native-elements';

const db = SQLite.openDatabase('resultsdb.db');

export default function Results() {

  const [track, setTrack] = useState('');
  const [par, setPar] = useState('');
  const [throws, setThrows] = useState('');
  const score = throws - par;
  const [trackday, setTrackday] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //sqlite tapahtumia
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists trackday (id integer primary key not null, track text, par int, throws int, score int);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into trackday (track, par, throws, score) values (?, ?, ?, ?);',
        [track, par, throws, score]);    
      }, null, updateList)}

  const updateList = () => {
    db.transaction(tx => {    
      tx.executeSql('select * from trackday order by score;', [], (_, { rows }) =>
        setTrackday(rows._array)
      );
    }, null, null);
    console.log(trackday);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => { 
        tx.executeSql('delete from trackday where id = ?;', [id]);
      }, null, updateList)
  }

  const listSeparator = () => {   //rajat listan objekteille
    return (
      <View
        style={{
          height: 1,
          width: "80%",
          backgroundColor: "#CED0CE",
          marginLeft: "10%"
        }}
      />
    );
  };
  
  

  return (
    <View>
      <View style={{flexDirection: "row"}}>
        <View style={{ width: "75%"}}>
          <Input 
            placeholder='Rata'
            label='RATA'
            onChangeText={track => setTrack(track)} 
            value={track} />
        </View>
        <View style={{ width: "25%"}}>
          <Button
            style={styles.button}
            title="Tyhjennä"
            onPress={() => setTrack('')}
          /> 
        </View>
      </View>

      <View style={{flexDirection: "row"}}>
        <View style={{ width: "75%"}}>
          <Input 
            placeholder='0'
            label='PAR'
            onChangeText={par => setPar(par)} 
            value={par} />
        </View>
        <View style={{ width: "25%"}}>
          <Button
            title="Tyhjennä"
            onPress={() => setPar('')}
          />
        </View>
      </View>

      <View style={{flexDirection: "row"}}>
        <View style={{ width: "75%"}}>      
          <Input 
            placeholder='0'
            label='HEITOT'
            onChangeText={throws => setThrows(throws)} 
            value={throws} />
        </View>
        <View style={{ width: "25%"}}>
          <Button
            title="Tyhjennä"
            onPress={() => setThrows('')}
          />
        </View>
      </View>
     




      <Button
      onPress={saveItem}
      icon={
        <Icon
          type='font-awesome'
          name='save'
          size={20}
          color="white"
        />
        }
        title=" TALLENNA"
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <FlatList
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={{flexDirection: "row"}}>
                    <View style={{ width: "75%"}}>
                      <Text style={styles.title}>{item.track}</Text>
                      <Text>Par: {item.par}</Text>
                      <Text>Heitot: {item.throws}</Text>
                      <Text style={styles.bold}>Tulos: {item.score}</Text>
                    </View>
                    <View style={{ width: "25%", justifyContent: "center"}}>
                    <Icon
                      style={styles.icon}
                      name='delete'
                      color='red'
                      onPress={() => deleteItem(item.id)}
                    />
                    </View>
                  </View>)}
                data={trackday}
                ItemSeparatorComponent={listSeparator}
              />  

            <Button
              onPress={() => setModalVisible(!modalVisible)}
              title="Sulje"
            />
            </View>
          </View>

        </Modal>
        <View style={{marginTop: 20}}>
          <Button
            onPress={() => setModalVisible(true)}
            title="Näytä tuloksesi"
          />
        </View>


 

    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
    
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5
  },
  title: {
    fontSize: 20, 
    color: '#333',
    textAlign: 'center',
  },
  bold: {
    fontWeight: "bold"
  }

});
