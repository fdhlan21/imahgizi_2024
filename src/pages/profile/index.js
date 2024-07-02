import { View, Text, Image, TouchableNativeFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import colors from '../../utils/colors';
import { LeftArrow } from '../../assets/img';
import { TouchableOpacity } from 'react-native';
import { getData } from '../../utils/storedata/storedata';

export default function ProfilePage({ navigation }) {
  const [data, setData] = useState({});

  useEffect(() => {
    getData("user").then(response => {
      if (response && response.data) {
        setData(response.data);
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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      {/* Header */}
      <View style={{
        padding: 10, backgroundColor: colors.primary, flexDirection: "row", borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10, justifyContent: 'center',
      }}>
        <View style={{ left: -130 }}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
          </TouchableOpacity>
        </View>

        <View style={{ left: -10 }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: 'white', }}>Profile</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: 10, left: 10 }}>Username</Text>
            <View style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderRadius: 10 }}>
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black' }}>
                <Text style={{ fontWeight: 'bold' }}>{data.username ? data.username : 'Tidak ada data'}</Text>
              </Text>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, marginBottom: 10, left: 10 }}>Role</Text>
            <View style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderRadius: 10 }}>
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black' }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {data.role === '1' ? 'Admin' : 'User'}
                </Text>
              </Text>
            </View>
          </View>

          <View style={{padding:10, marginTop:'10%'}}>
            <TouchableNativeFeedback onPress={() => navigation.navigate('EditProfilePage')}>
              <View style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 10 }}>
                <Text style={{ color: 'white', textAlign: "center", fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>Edit Profile</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
