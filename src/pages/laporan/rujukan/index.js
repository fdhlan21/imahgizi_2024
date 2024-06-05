import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { URLRujukan } from '../../../utils/storedata/storedata';

export default function FromRujukan({ navigation }) {
  const [form, setForm] = useState({
    waktukegiatan: '',
    kepemilikanjkn: '',
    jenisjkn:'',
    riwayatpenyakit:'',
    fasilitas: '',
    pendata: '', // State untuk pendata
    foto: null, // State untuk gambar yang dipilih
  });

  const [selectedDateText, setSelectedDateText] = useState('Waktu Kegiatan');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateTextColor, setSelectedDateTextColor] = useState('gray');

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setForm({ ...form, waktukegiatan: date });
    setSelectedDateText(`${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`);
    setSelectedDateTextColor('black');
  };

  const handleSaveDate = () => {
    setShowDatePicker(false);
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
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

  const HandleSimpan = () => {
    if (!form.waktukegiatan) {
      alert("Waktu Kegiatan harus diisi!");
    } else if (!form.kepemilikanjkn) {
      alert("Kepemilikan JKN harus diisi!");
    } else if (!form.fasilitas) {
      alert("Fasilitas yang Dijadikan Rujukan harus diisi!");
    } else if (!form.foto) {
      alert("Anda harus mengunggah foto!");
    } else if (!form.pendata) {
      alert("Nama Pendata harus diisi!");
    } else {
      console.log(form);

      axios
        .post(URLRujukan, form)
        .then(response => {
          console.log(response.data);

          if (response.data.status == 200) {
            console.log(response.data);
            alert("Data Berhasil di Simpan!");
            navigation.replace("HomeScreen");
          } else {
            alert("Terjadi kesalahan");
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

  const PickerDate = () => {
    const initialDate = form.waktukegiatan || new Date();

    return (
      <TouchableOpacity onPress={toggleDatePicker} style={styles.iconContainer}>
        <Image style={styles.calendarIcon} source={Calendar} />
        <Modal isVisible={showDatePicker}>
          <View style={styles.datePickerContainer}>
            <Text style={{ fontFamily: 'Poppins-Regular', marginTop: 10 }}>Pilih Tanggal Kegiatan</Text>
            <DatePicker
              style={{ alignSelf: 'center', marginTop: 10 }}
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
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 10, backgroundColor: colors.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
          </TouchableOpacity>
          <View style={{ left: -138 }}>
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, color: 'white' }}>Rujukan</Text>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ marginTop: '10%' }}>
            {/* WAKTU PENDAFTARAN */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Waktu Kegiatan</Text>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateText, { color: selectedDateTextColor }]}>
                {selectedDateText}
              </Text>
              <PickerDate />
            </View>

            {/* KEPEMILIKAN JKN */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Kepemilikan JKN</Text>
              <TextInput style={styles.input} placeholder='Kepemilikan JKN' placeholderTextColor='gray'
                value={form.kepemilikanjkn} onChangeText={value => setForm({ ...form, kepemilikanjkn: value })}
              />
            </View>

                {/* JENIS JKN */}
                <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Jenis JKN</Text>
              <TextInput style={styles.input} placeholder='Jenis JKN' placeholderTextColor='gray'
                value={form.jenisjkn} onChangeText={value => setForm({ ...form,jenisjkn : value })}
              />
            </View>

                {/* RIWAYAT PENYAKIT */}
                <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Riwayat Penyakit</Text>
              <TextInput style={styles.input} placeholder='Riwayat Penyakit' placeholderTextColor='gray'
                value={form.riwayatpenyakit} onChangeText={value => setForm({ ...form, riwayatpenyakit: value })}
              />
            </View>

            {/* FASILITAS YANG DIJADIKAN RUJUKAN */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Fasilitas Yang Dijadikan Rujukan</Text>
              <TextInput style={styles.input} placeholder='Fasilitas Yang Dijadikan Rujukan' placeholderTextColor='gray'
                value={form.fasilitas} onChangeText={value => setForm({ ...form, fasilitas: value })}
              />
            </View>

            {/* INPUT PENDATA */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Nama Pendata</Text>
              <TextInput style={styles.input} placeholder='Nama Pendata' placeholderTextColor='gray'
                value={form.pendata} onChangeText={value => setForm({ ...form, pendata: value })}
              />
            </View>

            {/* UPLOAD FOTO */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", left: 2 }}>Unggah Foto</Text>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Pilih Foto</Text>
              </TouchableOpacity>

              {form.foto && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, textAlign: "center" }}>Foto Terpilih</Text>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${form.foto}` }}
                      style={{ width: 150, height: 150, marginTop: 10 }}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* SIMPAN */}
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={HandleSimpan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    color: 'black',
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  dateInputContainer: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    left: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    height: '100%',
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
