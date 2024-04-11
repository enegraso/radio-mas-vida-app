import { useEffect, useRef, useState, version } from 'react';
import { View, StyleSheet, Pressable, Text, StatusBar, Image, Alert, Linking, Platform } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import VersionCheck from 'react-native-version-check-expo';
import imagelogo from "./assets/logosinfondocom.png"
import ministerlogo from "./assets/logoministerio.webp"
import { AntDesign, Entypo, FontAwesome6 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';


export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [enaPlay, setEnaPlay] = useState(false)
  const [enaPause, setEnaPause] = useState(true)


  /*
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
           {
             text: 'Actualizar', onPress: () => {
               if (Platform.OS === 'android') {
                 Linking.openURL('https://play.google.com/store/apps/details?id=com.enegraso.radiomasvidaapp'); // Open Play Store for Android
               } else {
                 Linking.openURL('your-ios-app-url-in-app-store'); // Open App Store for iOS
               }
             }
           },
           {
             text: 'Luego', onPress: () => {
               // You can do some action here if needed
             }
           }
         ]
       );
     } else {
       // App is up to date
       // You can do some action here if needed
     }
   };
  */

  const url = "https://backend.sib-2000.com.ar/masvida"

  async function playSound() {
    console.log("Loading Sound", url);
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      /*       playsInSilentModeIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: true, */
    });
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
    return sound
      ? () => {
        console.log("Unloading Sound");
        setIsPlaying(false);
        sound.unloadAsync();
        setSound(null);
        checkForUpdate()
        console.log("First Time");
      }
      : undefined

  }, [sound]);

  // funcion para ver red social en navegador
  const _handlePressButtonAsync = async (web) => {
    let result = await WebBrowser.openBrowserAsync(web);
    setResult(result);
  };


 VersionCheck.needUpdate()
    .then(async res => {
      if (res.isNeeded) {
        Alert.alert(
          'Actualizar App',
          'Por favor actualice para continuar usando la app...',
          [
            {
              text: 'Actualizar', onPress: () => {
                if (Platform.OS === 'android') {
                  Linking.openURL(res.storeUrl); // Open Play Store for Android
                } else {
                  Linking.openURL('your-ios-app-url-in-app-store'); // Open App Store for iOS
                }
              }
            },
            {
              text: 'Luego', onPress: () => {
                // You can do some action here if needed
              }
            }
          ]
        );
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image style={styles.divimglogo} source={imagelogo} alt='Logo' />
      </View>
      <View style={styles.divradio}>
        <Pressable style={!enaPlay ? styles.btnradio : styles.btnradiono} disabled={enaPlay} onPress={() => { !sound ? playSound() : resumeSound() }}>
          <AntDesign name="play" size={24} color="white" />
        </Pressable>
        <Pressable style={!enaPause ? styles.btnradio : styles.btnradiono} disabled={enaPause} onPress={() => pauseSound()}>
          <AntDesign name="pause" size={24} color="white" />
        </Pressable>
        <Pressable style={!enaPause ? styles.btnradio : styles.btnradiono} disabled={enaPause} onPress={() => stopSound()}>
          <Entypo name="controller-stop" size={24} color="white" />
        </Pressable>
      </View>
      <View style={styles.volumebar}>
        <Image style={styles.divimglogo} source={ministerlogo} alt='Logo' />
      </View>
      <View style={styles.rrss}>
        <Pressable style={styles.btnrrssfacebook} onPress={() => { _handlePressButtonAsync("https://www.facebook.com/profile.php?id=100082970127079") }}>
          <Entypo name="facebook-with-circle" size={32} color="white" />
        </Pressable>
        <Pressable style={styles.btnrrssinsta} onPress={() => { _handlePressButtonAsync("https://www.instagram.com/ministeriomasvida_bragado/?hl=es") }}>
          <Entypo name="instagram-with-circle" size={32} color="white" />
        </Pressable>
        <Pressable style={styles.btnrrssyoutube} onPress={() => { _handlePressButtonAsync("https://www.youtube.com/@MINISTERIOMASVIDABRAGADO") }}>
          <Entypo name="youtube-with-circle" size={32} color="white" />
        </Pressable>
        <Pressable style={styles.btnrrssx} onPress={() => { _handlePressButtonAsync("https://www.google.com.ar/maps/place/F.+Argentinos+489,+Bragado,+Provincia+de+Buenos+Aires/@-35.1152852,-60.4786487,17z/data=!4m5!3m4!1s0x95bedc328f288219:0xbabd0d53247da704!8m2!3d-35.1154783!4d-60.4761596?entry=ttu") }}>
          <FontAwesome6 name="location-pin" size={32} color="white" />
        </Pressable>
      </View>
      <View style={styles.divfooter}>
        <Pressable onPress={() => { _handlePressButtonAsync("https://sib-2000.com.ar") }}>
          <Text>Version: {VersionCheck.getCurrentVersion()} by SIB 2000</Text>
        </Pressable></View>
      <StatusBar />
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A1EFA",
    padding: 5,
    alignContent: "center",
  },
  logo: {
    flex: 3,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  divimglogo: {
    width: "90%",
    height: "90%",
    resizeMode: "contain"
  },
  divradio: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 30,
    alignContent: "center",
    justifyContent: "space-around",
    backgroundColor: "lightgrey"
  },
  btnradio: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
    height: 75,
    width: 75,
  },
  btnradiono: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'grey',
    height: 75,
    width: 75,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  volumebar: {
    flex: 3,
    margin: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-around",
    overflow: "hidden"
  },
  rrss: {
    flex: 1,
    margin: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: "center",
    justifyContent: "space-around",
    // backgroundColor: "green"
  },
  btnrrssfacebook: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
    backgroundColor: 'blue',
    height: 75,
    width: 75,
  },
  btnrrssinsta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
    backgroundColor: 'purple',
    height: 75,
    width: 75,
  },
  btnrrssyoutube: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
    backgroundColor: 'red',
    height: 75,
    width: 75,
  },
  btnrrssx: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
    backgroundColor: 'cyan',
    height: 75,
    width: 75,
  },
  divfooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  }
});