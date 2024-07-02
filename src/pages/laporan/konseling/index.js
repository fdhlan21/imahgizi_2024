import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URLKonseling } from '../../../utils/storedata/storedata';

export default function FormKonseling({ navigation }) {
  const [form, setForm] = useState({
    waktukegiatan: '',
    materikonseling: '',
    pendata: '',
    foto: null,
    nik: '',
    namaibu: '',
    kelompok_resiko: ''
  });

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Pengguna membatalkan pemilihan gambar');
      } else if (response.error) {
        console.log('Error:', response.error);
      } else {
        const imageUri = response.assets ? response.assets[0]?.uri : null;
        if (imageUri) {
          RNFS.readFile(imageUri, 'base64')
            .then((base64data) => {
              setForm({ ...form, foto: base64data });
              alert('Gambar Profile Berhasil di Unggah');
            })
            .catch((error) => {
              console.error('Terjadi Kesalahan', error);
            });
        }
      }
    });
  };

  const [selectedDateText, setSelectedDateText] = useState('Waktu Kegiatan');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateTextColor, setSelectedDateTextColor] = useState('gray');

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = date => {
    setForm({ ...form, waktukegiatan: date });
    setSelectedDateText(
      `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
    );
    setSelectedDateTextColor('black');
  };

  const handleSaveDate = () => {
    const currentDate = form.waktukegiatan || new Date();
    setForm({ ...form, waktukegiatan: currentDate });
    setSelectedDateText(
      `${currentDate.getDate()} - ${currentDate.getMonth() + 1} - ${currentDate.getFullYear()}`
    );
    setSelectedDateTextColor('black');
    setShowDatePicker(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('user');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setForm(prevForm => ({ ...prevForm, pendata: userData.username }));
        }

        const storedNamaIbu = await AsyncStorage.getItem('namaibu');
        const storedNik = await AsyncStorage.getItem('nik');
        const storedKelompokResiko = await AsyncStorage.getItem('kelompok_resiko');
        if (storedNamaIbu && storedNik && storedKelompokResiko) {
          setForm(prevForm => ({ ...prevForm, namaibu: storedNamaIbu, nik: storedNik, kelompok_resiko: storedKelompokResiko }));
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSimpan = () => {
    if (!form.waktukegiatan) {
      alert("Waktu Kegiatan harus diisi!");
    } else if (!form.materikonseling) {
      alert("Materi Konseling harus diisi!");
    } else if (!form.pendata) {
      alert("Pendata harus diisi!");
    } else if (!form.foto) {
      alert("Anda harus mengunggah foto!");
    } else {
      axios.post(URLKonseling, form)
        .then(response => {
          if (response.data.status === 200) {
            alert("Data Berhasil di Simpan!");
            navigation.replace("HomeScreen");
          } else {
            alert("Terjadi Kesalahan!");
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{
        padding: 10, backgroundColor: colors.primary, flexDirection: "row", borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10, justifyContent: 'center',
      }}>
        <View style={{ left: -110 }}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
          </TouchableOpacity>
        </View>

        <View style={{ left: -10 }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: 'white', }}>Konseling</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ marginTop: 0, }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Waktu Kegiatan</Text>
            <View style={styles.dateContainer}>
              <Text style={{ ...styles.dateText, color: selectedDateTextColor }}>
                {selectedDateText}
              </Text>
              <PickerDate 
                initialDate={form.waktukegiatan || new Date()} 
                showDatePicker={showDatePicker} 
                handleDateChange={handleDateChange} 
                handleSaveDate={handleSaveDate} 
                toggleDatePicker={toggleDatePicker} 
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Materi Konseling</Text>
              <TextInput
                style={styles.input}
                placeholder='Materi Konseling'
                placeholderTextColor='gray'
                value={form.materikonseling}
                onChangeText={value => setForm({ ...form, materikonseling: value })}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Pendata</Text>
              <TextInput
                style={styles.input}
                placeholder='Pendata'
                placeholderTextColor='gray'
                value={form.pendata}
                onChangeText={value => setForm({ ...form, pendata: value })}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Unggah Foto</Text>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Pilih Foto</Text>
              </TouchableOpacity>
              {form.foto && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>Foto Terpilih</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Image source={{ uri: `data:image/jpeg;base64,${form.foto}` }} style={styles.selectedImage} />
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={handleSimpan} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const PickerDate = ({ initialDate, showDatePicker, handleDateChange, handleSaveDate, toggleDatePicker }) => (
  <TouchableOpacity onPress={toggleDatePicker} style={styles.calendarIconContainer}>
    <Image style={styles.calendarIcon} source={Calendar} />
    <Modal isVisible={showDatePicker}>
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Pilih Tanggal Kegiatan</Text>
        <DatePicker
          style={styles.datePicker}
          date={initialDate}
          mode="date"
          textColor='black'
          onDateChange={handleDateChange}
        />
        <TouchableOpacity onPress={handleSaveDate} style={styles.button}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'gray',
  },
  calendarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    height: 20,
    width: 20,
    tintColor: colors.primary,
  },
  datePickerContainer: {
    height: 280,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  datePickerLabel: {
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  datePicker: {
    alignSelf: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.success,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: 40,
    width: 100,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    textAlign: 'center',
  },
  selectedImage: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    textAlign: 'center',
  },
});
