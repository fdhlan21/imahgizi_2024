import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URLBadutaGizi } from '../../../utils/storedata/storedata';
import { Picker } from '@react-native-picker/picker';
import kecamatanDesaData from '../../../assets/kecamatan_desa.json';

const getDesaOptions = (kecamatan) => {
  return kecamatanDesaData
    .filter(item => item.Kecamatan.toLowerCase().replace(/\s/g, '') === kecamatan)
    .map(item => ({ label: item.Desa, value: item.Desa.toLowerCase().replace(/\s/g, '') }));
};

export default function FormBadutaGizi({ navigation }) {
  const initialKecamatan = 'bantarkalong';

  const [form, setForm] = useState({
    namabayi: '',
    kelamin: '',
    namaibuayah: '',
    nikibuayah: '',
    usiaibu: '',
    alamat: initialKecamatan,
    desa: '',
    usiaanak: '',
    hasilpengukuranbb: '',
    hasilpengukurantb: '',
    waktupendataan: '',
    pendata: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('user');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setForm(prevForm => ({ ...prevForm, pendata: userData.username }));
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    const desaOptions = getDesaOptions(initialKecamatan);
    if (desaOptions.length > 0) {
      setForm(prevForm => ({ ...prevForm, desa: desaOptions[0].value }));
    }

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

  const handleSimpan = async () => {
    if (
      (form.namabayi.length === 0) ||
      (form.kelamin.length === 0) ||
      (form.namaibuayah.length === 0) ||
      (form.nikibuayah.length === 0) ||
      (form.usiaibu.length === 0) ||
      (form.alamat.length === 0) ||
      (form.desa.length === 0) ||
      (form.usiaanak.length === 0) ||
      (form.hasilpengukuranbb.length === 0) ||
      (form.hasilpengukurantb.length === 0) ||
      (form.pendata.length === 0)
    ) {
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

      try {
        await AsyncStorage.setItem('namaibuayah', form.namaibuayah);
        await AsyncStorage.setItem('nikibuayah', form.nikibuayah);
        await AsyncStorage.setItem('kelompok_resiko', 'Baduta Gizi');

        await axios.post(URLBadutaGizi, { ...form, waktupendataan: form.waktupendataan || new Date() });
        alert("Data Berhasil di Simpan!");
        navigation.replace("SubmenuLaporan");
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        alert(`Terjadi Kesalahan: ${error.response ? error.response.data.message : error.message}`);
      }
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
        <View style={{ left: -30 }}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
          </TouchableOpacity>
        </View>

        <View style={{ left: -10 }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: 'white', }}>Baduta Gizi Kurang / Gizi Buruk</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ marginTop: '10%' }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Nama Bayi</Text>
            <TextInput
              style={styles.input}
              placeholder='Nama Bayi'
              placeholderTextColor='gray'
              value={form.namabayi}
              onChangeText={value => setForm({ ...form, namabayi: value })}
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Jenis Kelamin</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.kelamin}
                onValueChange={value => setForm({ ...form, kelamin: value })}
                style={styles.picker}
              >
                <Picker.Item label="Pilih Jenis Kelamin" value="" />
                <Picker.Item label="Laki-laki" value="Laki-laki" />
                <Picker.Item label="Perempuan" value="Perempuan" />
              </Picker>
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Nama Ibu / Ayah</Text>
            <TextInput
              style={styles.input}
              placeholder='Nama Ibu / Ayah'
              placeholderTextColor='gray'
              value={form.namaibuayah}
              onChangeText={value => setForm({ ...form, namaibuayah: value })}
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>NIK Ibu / Ayah</Text>
            <TextInput
              style={styles.input}
              placeholder='NIK Ibu / Ayah'
              placeholderTextColor='gray'
              keyboardType='numeric'
              value={form.nikibuayah}
              onChangeText={value => setForm({ ...form, nikibuayah: value })}
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
                <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 20, left: 2 }}>Desa</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={form.desa}
                    onValueChange={(itemValue) => setForm({ ...form, desa: itemValue })}
                    style={styles.picker}
                  >
                    {getDesaOptions(form.alamat).map((option, index) => (
                      <Picker.Item key={index} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </>
            )}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Anak</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Usia Anak"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.usiaanak}
                onChangeText={value => setForm({ ...form, usiaanak: value })}
              />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran BB</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Hasil Pengukuran BB"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.hasilpengukuranbb}
                onChangeText={value => setForm({ ...form, hasilpengukuranbb: value })}
              />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran TB</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder="Hasil Pengukuran TB"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={form.hasilpengukurantb}
                onChangeText={value => setForm({ ...form, hasilpengukurantb: value })}
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
    borderRadius: 10,
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    top:-9
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
