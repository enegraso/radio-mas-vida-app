import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, StatusBar, Image, Alert, Linking, Platform } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import VersionCheck from 'react-native-version-check';
import imagelogo from "./assets/logosinfondocom.png"

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [enaPlay, setEnaPlay] = useState(false)
  const [enaPause, setEnaPause] = useState(true)

  // Check for the latest store version based on the platform
  const checkForUpdate = async () => {
    const androidPackageName = 'com.enegraso.radiomasvidaapp'; // Add your Android package name here
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'android' ? 'playStore' : 'appStore', // Check store based on platform
        packageName: Platform.OS === 'android' ? androidPackageName : '',
      });
    } catch (error) {
      console.error('Error fetching latest version: ', error);
    }

    // Check for the current version that user has
    const currentVersion = VersionCheck.getCurrentVersion() // ? "1" : VersionCheck.getCurrentVersion();
    
    if (latestVersion && latestVersion > currentVersion) {
      // Prompt user to update the app
      // You can customize this alert to match your app's design and branding, or implement your own custom update notification system.
      Alert.alert(
        'Actualizar App',
        'Por favor actualice para continuar usando la app...',
        [
          { text: 'Actualizar', onPress: () => {
            if (Platform.OS === 'android') {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.enegraso.radiomasvidaapp'); // Open Play Store for Android
            } else {
              Linking.openURL('your-ios-app-url-in-app-store'); // Open App Store for iOS
            }
          }},
          { text: 'Luego', onPress: () => {
            // You can do some action here if needed
          }}
        ]
      );
    } else {
      // App is up to date
      // You can do some action here if needed
    }
  };


  const url = "https://backend.sib-2000.com.ar/masvida"

  async function playSound() {
    console.log("Loading Sound", url);
    /*     await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        }); */
    const { sound } = await Audio.Sound.createAsync({ "uri": url });
    setSound(sound);

    console.log("Playing Sound", url);
    await sound.playAsync();
    setEnaPlay(!enaPlay)
    setEnaPause(!enaPause)
  }

  async function stopSound() {
    console.log("Stopping Sound", url);
    await sound.stopAsync();
    setSound(null)
    setEnaPlay(!enaPlay)
    setEnaPause(!enaPause)
  }

  async function pauseSound() {
    console.log("Pause Sound", url);
    await sound.pauseAsync();
    setEnaPlay(!enaPlay)
    setEnaPause(!enaPause)
  }

  async function resumeSound() {
    console.log("Resuming Sound", url);
    await sound.playAsync();
    setEnaPlay(!enaPlay)
    setEnaPause(!enaPause)
  }

  useEffect(() => {
    checkForUpdate();
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });
    return sound
      ? () => {
        console.log("Unloading Sound");
        setIsPlaying(false);
        sound.unloadAsync();
        setSound(null);
      }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={imagelogo} alt='Logo' />
      </View>
      <View style={styles.divradio}>
        <Pressable style={!enaPlay ? styles.btnradio : styles.btnradiono} disabled={enaPlay} onPress={() => { !sound ? playSound() : resumeSound() }}>
          <Text style={styles.text}>Play Radio</Text>
        </Pressable>
        <Pressable style={!enaPause ? styles.btnradio : styles.btnradiono} disabled={enaPause} onPress={() => pauseSound()}>
          <Text style={styles.text}>Pause Radio</Text>
        </Pressable>
        <Pressable style={!enaPause ? styles.btnradio : styles.btnradiono} disabled={enaPause} onPress={() => stopSound()}>
          <Text style={styles.text}>Stop Radio</Text>
        </Pressable>
      </View>
      <View style={styles.rrss}>
        <Pressable style={styles.btnrrssfacebook} onPress={() => playSound()}>
          <Text style={styles.text}>Facebook</Text>
        </Pressable>
        <Pressable style={styles.btnrrssinsta} onPress={() => playSound()}>
          <Text style={styles.text}>Instagram</Text>
        </Pressable>
        <Pressable style={styles.btnrrssyoutube} onPress={() => playSound()}>
          <Text style={styles.text}>Youtube</Text>
        </Pressable>
        <Pressable style={styles.btnradio} onPress={() => playSound()}>
          <Text style={styles.text}>X</Text>
        </Pressable>
      </View>
      <StatusBar />
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 5,
    alignContent: "center",
  },
  logo: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "center"
  },
  divradio: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-around"
  },
  btnradio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  btnradiono: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  rrss: {
    flex: 1,
    margin: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-around"
  },
  btnrrssfacebook: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  btnrrssinsta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'purple',
  },
  btnrrssyoutube: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
});