import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';

const kecamatanOptions = [
  { label: 'Bantarkalong', value: 'bantarkalong' },
  { label: 'Bojongasih', value: 'bojongasih' },
  { label: 'Bojonggambir', value: 'bojonggambir' },
  // Tambahkan kecamatan lainnya sesuai kebutuhan
];

const desaOptions = {
  bantarkalong: [
    { label: 'Desa 1-1', value: 'desa1-1' },
    { label: 'Desa 1-2', value: 'desa1-2' },
  ],
  bojongasih: [
    { label: 'Desa 2-1', value: 'desa2-1' },
    { label: 'Desa 2-2', value: 'desa2-2' },
  ],
  bojonggambir: [
    { label: 'Desa 3-1', value: 'desa3-1' },
    { label: 'Desa 3-2', value: 'desa3-2' },
  ],
  // Tambahkan desa lainnya sesuai kebutuhan
};

const PickerKecamatanDesa = ({ form, setForm }) => {
  const handleKecamatanChange = (value) => {
    setForm({ ...form, alamat: value, desa: '' });
  };

  const handleDesaChange = (value) => {
    setForm({ ...form, desa: value });
  };

  return (
    <View>
      <Text style={styles.label}>Alamat (Kecamatan)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.alamat}
          style={styles.picker}
          onValueChange={handleKecamatanChange}
        >
          {kecamatanOptions.map((option, index) => (
            <Picker.Item key={index} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {form.alamat !== '' && desaOptions[form.alamat] && (
        <>
          <Text style={styles.label}>Desa</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.desa}
              style={styles.picker}
              onValueChange={handleDesaChange}
            >
              {desaOptions[form.alamat].map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Poppins-SemiBold',
    left: 2,
    marginTop: 20
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
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
});

export default PickerKecamatanDesa;
