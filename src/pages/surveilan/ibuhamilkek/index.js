import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import axios from 'axios';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import { URLIbuHamilKEK } from '../../../utils/storedata/storedata';

export default function FormIbuHamilKEK({ navigation }) {
  const [form, setForm] = useState({
    namaibu: '',
    anakke: '',
    nik: '',
    usiaibu: '',
    alamat: '',
    usiakehamilan: '',
    hasilpengukuranlila: '',
    waktupendataan: '',
  });

  const [selectedDateText, setSelectedDateText] = useState('Waktu Pendataan');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateTextColor, setSelectedDateTextColor] = useState('gray');

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
            <TouchableOpacity onPress={toggleDatePicker}>
              <TouchableOpacity onPress={handleSaveDate} style={styles.button}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  };

  const handleSimpan = () => {
    if ((form.namaibu.length == 0) || (form.anakke.length == 0) || (form.nik.length == 0) || (form.usiaibu.length == 0) || (form.alamat.length == 0) || (form.usiakehamilan.length == 0) || (form.hasilpengukuranlila.length == 0)) {
      alert("Mohon Isi Semua Field");
    } else {
      axios
        .post(URLIbuHamilKEK, form)
        .then(response => {
          console.log('Response:', response.data);
          if (response.data.status == 200) {
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
      <View style={{ padding: 10, backgroundColor: colors.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <TouchableOpacity onPress={handleBack}>
              <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
            </TouchableOpacity>
          </View>
          <View style={{ left: -110 }}>
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, color: 'white' }}>Ibu Hamil KEK</Text>
          </View>
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
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Alamat</Text>
            <TextInput 
              style={styles.input} 
              placeholder='Alamat' 
              placeholderTextColor='gray' 
              value={form.alamat}
              onChangeText={value => setForm({ ...form, alamat: value })} 
            />
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
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran LILA</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Hasil Pengukuran LILA"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.hasilpengukuranlila}
                onChangeText={value => setForm({ ...form, hasilpengukuranlila: value })}
              />
              <Text style={styles.rowText}>Berapa cm</Text>
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
