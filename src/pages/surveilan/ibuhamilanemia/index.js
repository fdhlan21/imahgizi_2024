import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert, Picker } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import { URLIbuHamilAnemia } from '../../../utils/storedata/storedata';

// Import data JSON
import kecamatanDesaData from '../../../assets/kecamatan_desa.json';

const getDesaOptions = (kecamatan) => {
  return kecamatanDesaData
    .filter(item => item.Kecamatan.toLowerCase().replace(/\s/g, '') === kecamatan)
    .map(item => ({ label: item.Desa, value: item.Desa.toLowerCase().replace(/\s/g, '') }));
};

export default function FormIbuHamilAnemia({ navigation }) {
  const initialKecamatan = 'bantarkalong';

  const [form, setForm] = useState({
    namaibu: '',
    anakke: '',
    nik: '',
    usiaibu: '',
    alamat: initialKecamatan,
    desa: '',
    usiakehamilan: '',
    hasilpengukuranhb: '',
    waktupendataan: '',
    pendata: '',
  });

  useEffect(() => {
    const desaOptions = getDesaOptions(initialKecamatan);
    if (desaOptions.length > 0) {
      setForm(prevForm => ({ ...prevForm, desa: desaOptions[0].value }));
    }

    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('user');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log('User Data:', userData);
          setForm(prevForm => ({ ...prevForm, pendata: userData.username }));
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  const [selectedDateText, setSelectedDateText] = useState('Waktu Pendataan');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateTextColor, setSelectedDateTextColor] = useState('gray');

  const kecamatanOptions = [
    ...new Set(kecamatanDesaData.map(item => item.Kecamatan))
  ].map(kecamatan => ({ label: kecamatan, value: kecamatan.toLowerCase().replace(/\s/g, '') }));

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = date => {
    setForm({ ...form, waktupendataan: date });
    setSelectedDateText(
      `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
    );
    setSelectedDateTextColor('black');
  };

  const handleSaveDate = () => {
    const currentDate = form.waktupendataan || new Date();
    setForm({ ...form, waktupendataan: currentDate });
    setSelectedDateText(
      `${currentDate.getDate()} - ${currentDate.getMonth() + 1} - ${currentDate.getFullYear()}`
    );
    setSelectedDateTextColor('black');
    setShowDatePicker(false);
  };

  const PickerDate = () => {
    const initialDate = form.waktupendataan || new Date();

    return (
      <TouchableOpacity onPress={toggleDatePicker}>
        <Image style={{ height: 20, width: 20, tintColor: colors.primary, bottom: 5 }} source={Calendar} />
        <Modal isVisible={showDatePicker}>
          <View style={styles.datePickerContainer}>
            <Text style={{ fontFamily: 'Poppins-Regular', marginTop: 10 }}>Pilih Tanggal Pendataan</Text>
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

  const handleSimpan = () => {
    if ((form.namaibu.length === 0) || (form.anakke.length === 0) || (form.nik.length === 0) || (form.usiaibu.length === 0) || (form.alamat.length === 0) || (form.desa.length === 0) || (form.usiakehamilan.length === 0) || (form.hasilpengukuranhb.length === 0)) {
      alert("Mohon Isi Semua Field");
    } else {
      if (!form.waktupendataan) {
        const currentDate = new Date();
        setForm({ ...form, waktupendataan: currentDate });
        setSelectedDateText(
          `${currentDate.getDate()} - ${currentDate.getMonth() + 1} - ${currentDate.getFullYear()}`
        );
        setSelectedDateTextColor('black');
      }

      axios
        .post(URLIbuHamilAnemia, { ...form, waktupendataan: form.waktupendataan || new Date() })
        .then(response => {
          console.log('Response:', response.data);
          if (response.data.status === 200) {
            AsyncStorage.setItem('namaibu', form.namaibu);
            AsyncStorage.setItem('nik', form.nik);
            AsyncStorage.setItem('kelompok_resiko', 'Ibu Hamil Anemia'); // Menyimpan kelompok resiko
            alert("Data Berhasil di Simpan!");
            navigation.replace("SubmenuLaporan");
          } else {
            alert(`Terjadi Kesalahan: ${response.data.message || 'Unknown error'}`);
          }
        })
        .catch(error => {
          console.error('Error:', error.response ? error.response.data : error.message);
          alert(`Terjadi Kesalahan: ${error.response ? error.response.data.message : error.message}`);
        });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
     
      {/* Header */}
      <View style={{
        padding: 10, backgroundColor: colors.primary, flexDirection: "row", borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10, justifyContent: 'center',
      }}>
        <View style={{ left: -100 }}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
          </TouchableOpacity>
        </View>

        <View style={{ left: -10 }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: 'white', }}>Ibu Hamil Anemia</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ marginTop: '10%' }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Nama Ibu</Text>
            <TextInput 
              style={styles.input} 
              placeholder='Nama Ibu' 
              placeholderTextColor='gray' 
              value={form.namaibu}
              onChangeText={value => setForm({ ...form, namaibu: value })}
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Anak Ke-</Text>
            <TextInput 
              style={styles.input} 
              placeholder='Anak Ke-' 
              placeholderTextColor='gray' 
              keyboardType='numeric' 
              value={form.anakke}
              onChangeText={value => setForm({ ...form, anakke: value })} 
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>NIK</Text>
            <TextInput 
              style={styles.input} 
              placeholder='NIK' 
              placeholderTextColor='gray' 
              keyboardType='numeric' 
              value={form.nik}
              onChangeText={value => setForm({ ...form, nik: value })} 
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Ibu</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Usia Ibu"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.usiaibu}
                onChangeText={value => setForm({ ...form, usiaibu: value })}
              />
              <Text style={styles.rowText}>Tahun</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Alamat (Kecamatan)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.alamat}
                style={styles.picker}
                onValueChange={(itemValue) => setForm({ ...form, alamat: itemValue, desa: getDesaOptions(itemValue)[0]?.value || '' })}
              >
                {kecamatanOptions.map((option, index) => (
                  <Picker.Item key={index} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
            {form.alamat !== '' && (
              <>
                <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Desa</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={form.desa}
                    style={styles.picker}
                    onValueChange={(itemValue) => setForm({ ...form, desa: itemValue })}
                  >
                    {getDesaOptions(form.alamat).map((option, index) => (
                      <Picker.Item key={index} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </>
            )}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Kehamilan</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Usia Kehamilan"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.usiakehamilan}
                onChangeText={value => setForm({ ...form, usiakehamilan: value })}
              />
              <Text style={styles.rowText}>Berapa Minggu</Text>
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran HB</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Hasil Pengukuran HB"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.hasilpengukuranhb}
                onChangeText={value => setForm({ ...form, hasilpengukuranhb: value })}
              />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Waktu Pendataan</Text>
            <View style={styles.dateContainer}>
              <View>
                <Text style={{...styles.dateText, color: selectedDateTextColor }}>
                  {selectedDateText}
                </Text>
              </View>
              <View style={{ top: 15, left: -10 }}>
                <PickerDate />
              </View>
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Pendata</Text>
            <TextInput 
              style={styles.input} 
              placeholder='Pendata' 
              placeholderTextColor='gray' 
              value={form.pendata}
              onChangeText={value => setForm({ ...form, pendata: value })}
            />
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

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5', 
    borderRadius: 5, 
    borderWidth: 1, 
    height: 40, 
    fontFamily: 'Poppins-Regular', 
    fontSize: 12, 
    color: 'black',
    paddingRight: 10, 
    paddingLeft: 10,
  },
  picker: {
    height: 40,
    backgroundColor: '#dedede',
    borderRadius: 10,
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  pickerContainer: {
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    backgroundColor: '#f5f5f5',
    marginTop: 10
  },
  row: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    backgroundColor: '#f5f5f5'
  },
  inputRow: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    fontSize: 12,
    color: 'black',
    paddingLeft: 10,
    height: 40,
    fontFamily: 'Poppins-Regular',
    borderRadius: 5,
  },
  rowText: {
    left: -10, 
    fontFamily: 'Poppins-Regular', 
    fontSize: 12, 
    color: 'black'
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
  dateContainer: {
    flexDirection: 'row', 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    backgroundColor: '#f5f5f5', 
    height: 40, 
    justifyContent: 'space-between'
  },
  dateText: {
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    bottom: 0,
    top: 0,
    left: 10,
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
    textAlign: 'center'
  },
});
