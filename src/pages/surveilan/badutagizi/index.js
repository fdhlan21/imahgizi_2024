import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../utils/colors';
import { Calendar, LeftArrow } from '../../../assets/img';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import axios from 'axios';
import { URLBadutaGizi } from '../../../utils/storedata/storedata';
import { Picker } from '@react-native-picker/picker';

export default function FromBadutaGizi({ navigation }) {
  const [form, setForm] = useState({
    namabayi: '',
    kelamin: '',
    namaibuayah: '',
    nikibuayah: '',
    usiaibu: '',
    alamat: '',
    usiaanak: '',
    hasilpengukuranbb: '',
    hasilpengukurantb: '',
    waktupendataan: '',
    pendata: '',
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

  const HandleSimpan = () => {
    if (
      (form.namabayi.length == 0) ||
      (form.kelamin.length == 0) ||
      (form.namaibuayah.length == 0) ||
      (form.nikibuayah.length == 0) ||
      (form.usiaibu.length == 0) ||
      (form.alamat.length == 0) ||
      (form.usiaanak.length == 0) ||
      (form.hasilpengukuranbb.length == 0) ||
      (form.hasilpengukurantb.length == 0) ||
      (form.pendata.length == 0)
    ) {
      alert("Mohon Isi Semua Field");
    } else {
      axios
        .post(URLBadutaGizi, form)
        .then(response => {
          console.log(response.data);
          if (response.data.status == 200) {
            alert("Data Berhasil di Simpan!");
            navigation.replace("SubmenuLaporan");
          } else {
            alert("Terjadi Kesalahan");
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
    <>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 10, backgroundColor: colors.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <TouchableOpacity onPress={handleBack}>
              <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
            </TouchableOpacity>
          </View>
          <View style={{ left: -50 }}>
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, color: 'white' }}>Baduta Gizi Kurang / Gizi Buruk</Text>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ marginTop: '10%' }}>
            {/* NAMA BAYI */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Nama Bayi</Text>
            <TextInput
              style={styles.input}
              placeholder='Nama Bayi'
              placeholderTextColor='gray'
              value={form.namabayi}
              onChangeText={value => setForm({ ...form, namabayi: value })}
            />

            {/* JENIS KELAMIN */}
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

            {/* NAMA IBU / AYAH */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Nama Ibu / Ayah</Text>
            <TextInput
              style={styles.input}
              placeholder='Nama Ibu / Ayah'
              placeholderTextColor='gray'
              value={form.namaibuayah}
              onChangeText={value => setForm({ ...form, namaibuayah: value })}
            />

            {/* NIK */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>NIK Ibu / Ayah</Text>
            <TextInput
              style={styles.input}
              placeholder='NIK Ibu / Ayah'
              placeholderTextColor='gray'
              keyboardType='numeric'
              value={form.nikibuayah}
              onChangeText={value => setForm({ ...form, nikibuayah: value })}
            />

            {/* USIA IBU */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Ibu</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder='Usia Ibu'
                placeholderTextColor='gray'
                keyboardType='numeric'
                value={form.usiaibu}
                onChangeText={value => setForm({ ...form, usiaibu: value })}
              />
              <Text style={styles.rowText}>Tahun</Text>
            </View>

            {/* ALAMAT */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Alamat</Text>
            <TextInput
              style={styles.input}
              placeholder='Alamat'
              placeholderTextColor='gray'
              value={form.alamat}
              onChangeText={value => setForm({ ...form, alamat: value })}
            />

            {/* USIA ANAK */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Anak</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder='Usia Anak'
                placeholderTextColor='gray'
                keyboardType='numeric'
                value={form.usiaanak}
                onChangeText={value => setForm({ ...form, usiaanak: value })}
              />
            </View>

            {/* HASIL PENGUKURAN HB */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran HB</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder='Hasil Pengukuran HB'
                placeholderTextColor='gray'
                keyboardType='numeric'
                value={form.hasilpengukuranhb}
                onChangeText={value => setForm({ ...form, hasilpengukuranbb: value })}
              />
            </View>

            {/* HASIL PENGUKURAN TB */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran TB</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputRow}
                placeholder='Hasil Pengukuran TB'
                placeholderTextColor='gray'
                keyboardType='numeric'
                value={form.hasilpengukurantb}
                onChangeText={value => setForm({ ...form, hasilpengukurantb: value })}
              />
            </View>

            {/* WAKTU PENDAFTARAN */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Waktu Pendataan</Text>
            <View style={styles.dateContainer}>
              <View>
                <Text style={{
                  textAlign: 'left',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  bottom: 0,
                  top: 0,
                  left: 10,
                  marginTop: 10,
                  color: selectedDateTextColor
                }}>
                  {selectedDateText}
                </Text>
              </View>
              <View style={{ top: 15, left: -10 }}>
                <PickerDate />
              </View>
            </View>

            {/* PENDATA */}
            <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Pendata</Text>
            <TextInput
              style={styles.input}
              placeholder='Pendata'
              placeholderTextColor='gray'
              value={form.pendata}
              onChangeText={value => setForm({ ...form, pendata: value })}
            />
          </View>

          {/* SIMPAN */}
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={HandleSimpan} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
    </>
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
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
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
    color: 'black',
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
    justifyContent: 'space-between',
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
    textAlign: 'center',
  },
});
