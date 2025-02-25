// ProfilePictureScreen.js [MODIFICADO]
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  Alert, 
  Dimensions 
} from "react-native";
import CustomNavBar from "../components/CustomNavBar";
import { useNavigation } from "@react-navigation/native";
import { useRegisterContext } from "../context/RegisterContext";
import * as ImagePicker from "expo-image-picker";
// Importar gesture handler y reanimated (ya incluidos en Expo)
import { PanGestureHandler, PinchGestureHandler } from "react-native-gesture-handler";
import Animated, { 
  useSharedValue, 
  useAnimatedGestureHandler, 
  useAnimatedStyle 
} from "react-native-reanimated";

const ProfilePictureScreen = () => {
  const navigation = useNavigation();
  const { registerData, setRegisterData } = useRegisterContext();
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  // Para definir el tamaño del contenedor de recorte (círculo)
  const cropSize = 300;

  // Shared values para la traslación y escala
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryStatus.status !== "granted") {
          Alert.alert("Se necesitan permisos para acceder a la galería.");
        }
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          Alert.alert("Se necesitan permisos para acceder a la cámara.");
        }
      }
    })();
  }, []);

  // Función para seleccionar imagen desde la galería
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.5,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setBase64Image(asset.base64);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen: ", error);
      Alert.alert("Error al seleccionar la imagen");
    }
  };

  // Función para tomar foto con la cámara
  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.5,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setBase64Image(asset.base64);
      }
    } catch (error) {
      console.error("Error al tomar la foto: ", error);
      Alert.alert("Error al tomar la foto");
    }
  };

  // Gestores de gestos con reanimated
  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translationX.value = event.translationX;
      translationY.value = event.translationY;
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleContinue = () => {
    if (!base64Image) {
      Alert.alert("Por favor, selecciona o toma una imagen");
      return;
    }
    // Guardar en el contexto la imagen y la transformación aplicada
    setRegisterData({
      ...registerData,
      photos: [base64Image],
      crop: {
        translationX: translationX.value,
        translationY: translationY.value,
        scale: scale.value,
      },
    });
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <CustomNavBar />
      <Text style={styles.title}>Sube y ajusta tu foto de perfil</Text>
      {imageUri ? (
        <View style={styles.cropContainer}>
          <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
            <Animated.View style={{ flex: 1 }}>
              <PanGestureHandler onGestureEvent={panGestureHandler}>
                <Animated.Image 
                  source={{ uri: imageUri }} 
                  style={[styles.croppableImage, animatedImageStyle]} 
                  resizeMode="cover" 
                />
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </View>
      ) : (
        <View style={styles.imagePlaceholderContainer}>
          <Text style={styles.imagePlaceholder}>Imagen Aquí</Text>
        </View>
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Seleccionar imagen de galería</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
        <Text style={styles.uploadButtonText}>Tomar foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 10, 
    backgroundColor: "#FFE4CF", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 
  },
  cropContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    backgroundColor: "#E82561",
    marginBottom: 20,
  },
  croppableImage: {
    width: 300,
    height: 300,
  },
  imagePlaceholderContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#E82561",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: { 
    color: "#fff", 
    fontSize: 16 
  },
  uploadButton: {
    backgroundColor: "#E82561",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePictureScreen;
