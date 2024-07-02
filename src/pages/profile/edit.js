import { View, Text, Image, TouchableNativeFeedback, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import colors from '../../utils/colors';
import { LeftArrow } from '../../assets/img';
import { TouchableOpacity } from 'react-native';
import { getData, storeData, updateProfile } from '../../utils/storedata/storedata';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';


export default function EditProfilePage({ navigation }) {
  const [data, setData] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    getData("user").then(response => {
      if (response && response.data) {
        setData(response.data);
        setUsername(response.data.username);
        console.log('data user', response.data);
      } else {
        console.log('No data found');
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const logout = () => {
    storeData("user", null).then(() => {
      navigation.replace('SplashScreen'); // Ganti dengan nama screen splash screen kamu
    }).catch(error => {
      console.error('Error removing data:', error);
    });
  };

  const handleSave = () => {
    if (!username || !password || !confirmPassword) {
     showMessage({
        color : 'white',
        message: 'Mohon Untuk Isi Semua Feild 🙏',
        backgroundColor: colors.errormessage,
     });
      return;
    }
    if (password !== confirmPassword) {
        showMessage({
            color : 'white',
            message: 'Password dan Konfirmasi Password Tidak Sama!',
            backgroundColor: colors.errormessage,
         });
      return;
    }
    const updatedData = { ...data, username: username, password: password };

    axios.post(updateProfile, updatedData)
      .then(response => {
        if (response.data.status === 200) {
            showMessage({
                color : 'white',
                message: 'Profile Berhasil di Update ✅',
                backgroundColor: colors.success,
             });
          logout(); // Logout setelah berhasil update
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('Terjadi kesalahan saat menyimpan data');
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      {/* Header */}
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
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: 'white', }}>Edit Profile</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: 10, left: 10 }}>Username</Text>
            <View style={{ padding: 0, backgroundColor: 'white', borderWidth: 1, borderRadius: 10 }}>
              <TextInput
                style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black', height:40, paddingLeft:10, 
                paddingRight:10,  }}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
              />
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: 10, left: 10 }}>Password</Text>
            <View style={{ padding: 0, backgroundColor: 'white', borderWidth: 1, borderRadius: 10,}}>
              <TextInput
                style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black', height: 40,
                paddingLeft:10,  }}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor='gray'
                secureTextEntry
              />
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: 10, left: 10 }}>Konfirmasi Password</Text>
            <View style={{ padding: 0, backgroundColor: 'white', borderWidth: 1, borderRadius: 10 }}>
              <TextInput
                style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black', height: 40, 
                paddingLeft:10,  }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Konfirmasi Password"
                placeholderTextColor='gray'
                secureTextEntry
              />
            </View>
          </View>

          <View style={{marginTop:'10%', padding:10}}>
            <TouchableNativeFeedback onPress={handleSave}>
              <View style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 10 }}>
                <Text style={{ color: 'white', textAlign: "center", fontFamily: 'Poppins-Regular', fontWeight: 'bold',
                fontSize:15 }}>Simpan Perubahan</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
