import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../../utils/colors'
import { ImahGiziCirle } from '../../assets/img'
import axios from 'axios';
import { LoginURL, storeData } from '../../utils/storedata/storedata';
import { showMessage } from 'react-native-flash-message';

export default function LoginSebagai({navigation}) {

    const [form, setForm] = useState({
        username:'',
        password:'',
    });

    const handlleLogin = () => {
    
        if (!form.username) {
            showMessage({
                type:'default',
                color:'white',
                backgroundColor:colors.errormessage,
                message:'Username Harus diisi!'
            });
        } else if (!form.password) {
            showMessage({
                type:'default',
                color:'white',
                backgroundColor:colors.errormessage,
                message:'Password Harus diisi!'
            });
        } else {

        console.log(form);
        
        axios
        .post(LoginURL, form)
        .then(response => {
            console.log(response.data);
            if (response.data.status == 200) {
                console.log(response.data);
                storeData('user', response.data);
                navigation.replace('HomeScreen');
                alert("Yes!, Login Berhasil.")
          
            } else {
                showMessage({
                    type:'default',
                    color:'white',
                    backgroundColor:colors.errormessage,
                    message:'Sepertinya akun belum terdaftar!'
                });
            }
        })
        .catch(error => {
            console.error(error)
        })

        }
    }

  return (
    <View style={{flex:1, backgroundColor:colors.primary, }}>
    <ScrollView>
     <View style={{padding:10}}>

        <View style={{alignItems:'center', marginTop:'10%'}}>
            <Image style={{width:210, height:200}} source={ImahGiziCirle}/>
        </View>

        <View style={{padding:10, backgroundColor:'white', borderRadius:5, marginTop:50,}}>

        <View>
            <Text style={{fontFamily:'Poppins-Bold', fontSize:20, textAlign:"center"}}>Aplikasi IMAH GIZI</Text>
        </View>

        <View  style={{padding:10, backgroundColor:"#F0B21A", borderRadius:10,}}>
        <Text style={{fontFamily:"Poppins-Bold", textAlign:"center"}}>Login Sebagai</Text>
        <View style={{padding:1, backgroundColor:"white"}}/>
        <View style={{flexDirection:"row",  justifyContent:'space-between', marginTop:10

        }}>

        {/* 1 */}
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{backgroundColor:colors.primary, borderRadius:10, padding:10}}>
        <View>
            <Text style={{ fontFamily:'Poppins-SemiBold', color:'white', textAlign:"center", fontSize:12}}>Tim{'\n'}Pedamping</Text>
        </View>
        </TouchableOpacity>
        
          {/* 1 */}
          <TouchableOpacity style={{backgroundColor:colors.primary, borderRadius:10,  padding:10}}>
        <View>
            <Text style={{ fontFamily:'Poppins-SemiBold', color:'white', textAlign:"center", fontSize:12}}>Perangkat{'\n'}Desa</Text>
        </View>
        </TouchableOpacity>

          {/* 1 */}
          <TouchableOpacity style={{backgroundColor:colors.primary, borderRadius:10,  padding:10}}>
        <View>
            <Text style={{ fontFamily:'Poppins-SemiBold', color:'white', textAlign:"center", fontSize:12, top:10}}>Pukesmas</Text>
        </View>
        </TouchableOpacity>

        </View>
        </View>

        </View>

     </View>
    </ScrollView>
    </View>
  )
}