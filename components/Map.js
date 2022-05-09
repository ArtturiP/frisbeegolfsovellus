import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import {API_KEY} from "@env";

export default function Map() {
  const initial = {   //kartan koordinaatit
    latitude: 61.92411,
    longitude: 25.748151,
    latitudeDelta: 0.3000,
    longitudeDelta: 0.2000
  };
  const [tracks, setTracks] = useState([]);
  const [region, setRegion] = useState(initial);
  const [location, setLocation] = useState(null); 
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  // sijainnin haku kartalle
  const getLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location); 

    console.log(location);
    setLat((location.coords.latitude).toString());
    setLon((location.coords.longitude).toString());
    const { latitude, longitude } = location.coords;
    setRegion({ ...region, latitude: latitude, longitude: longitude });
    getCoordinates;
  }

  // ratojen haku kartalle
  const getCoordinates = async () => {  
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=frisbeegolf&location=' + lat + '%2C' + lon + '&radius=50000&key=' + API_KEY;

    try {
      const response = await fetch(url);
      const data = await response.json();


      for (let i = 0; i < data.results.length; i++) {
        setTracks((tracks) => [...tracks, { name: data.results[i].name, coordinates: { latitude: data.results[i].geometry.location.lat , longitude: data.results[i].geometry.location.lng } }] 
        )}

      console.log(tracks);
    } catch (error) {
      console.error('fail', error.message);
    }

  }


  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.buttonUp]}
        onPress={getLocation}
      >
        <Text style={styles.title}>Näytä sijaintisi</Text>
      </Pressable>
      
      <MapView
        style={styles.map}
        region={region}
      >
        <Marker
          pinColor={'blue'}
          coordinate={{ latitude: Number(lat) , longitude: Number(lon) }}
          title='Oma Sijaintisi'
        />
        {tracks.map((item, index) => (
          <Marker key={index} title={item.name} coordinate={item.coordinates} onCalloutPress={() => Clipboard.setString(item.name)}>
            <Callout>
              <View>
                <Text>{item.name} </Text>
              </View>
            </Callout>
          </Marker>

        ))}
      </MapView>

      <Pressable
        style={[styles.buttonDown]}
        onPress={getCoordinates}
      >
        <Text style={styles.title}>Näytä radat</Text>
      </Pressable>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  title: {
    fontSize: 20, 
    color: '#333',
    textAlign: 'center',
  },
  buttonDown: {
    backgroundColor: '#1E90FF',
    width: 355,
    height: 40,
    borderRadius: 15,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonUp: {
    backgroundColor: '#1E90FF',
    width: 355,
    height: 40,
    borderRadius: 15,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

});