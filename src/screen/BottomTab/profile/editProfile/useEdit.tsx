import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
  import { Alert } from 'react-native';
 import ImagePicker from "react-native-image-crop-picker";

const useEdit = () => {
  const navigation = useNavigation();
  const [imagePrfile, setImagePrfile] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingKey, setEditingKey] = useState('');
const [editingValue, setEditingValue] = useState('');

  const pickImageFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
       compressImageQuality: 0.4,
    mediaType: 'photo',
    // compressImageQuality: 0.2,


    })
      .then((image: any) => {
        setImagePrfile(image)
        setIsModalVisible(false);
      })
      .catch((error) => console.log(error));
  };

  const takePhotoFromCamera = async () => {
    try {
      const image: any = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,

    compressImageQuality: 0.4,
    mediaType: 'photo',


      });
      setImagePrfile(image)
      setIsModalVisible(false);
    } catch (error: any) {
      // Alert.alert('Error', error.message);
    }
  };
  return {
    navigation,
    takePhotoFromCamera,
    imagePrfile, setImagePrfile,
    isModalVisible, setIsModalVisible,
    pickImageFromGallery,
    modalVisible, setModalVisible,
    editingKey, setEditingKey,
    editingValue, setEditingValue,
  };
  
};

export default useEdit;
