import { View, Text, ScrollView, TouchableOpacity, Image, TouchableNativeFeedback, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconHome, IconProfile, ImahGiziCirle, MenuLapaoran1, MenuLapaoran2, MenuLapaoran3, MenuSurveilan1, MenuSurveilan2, MenuSurveilan3, Slider1, logout } from '../../assets/img'
import colors from '../../utils/colors'
import { MYAPP, getData, storeData } from '../../utils/storedata/storedata';

export default function SubmenuLaporan({navigation}) {

    const [data, setData] = useState({});
    useEffect(() => {
        getData("user").then(response => {
          setData(response);
          console.log('data user', response)
        });
        console.log('TES CUY');
        },[])

    const keluar  = () => [
        Alert.alert(MYAPP, 'Apakah Anda Yakin Ingin Keluar?', [
            {
                text:'Batal',
                style:"cancel"
            },
            {
                text:'Keluar',
                onPress: () => {
                    storeData('user', null);

                    navigation.reset({
                        index: 0,
                        routes: [{name: 'SplashScreen'}],
                    })
                }
            }
        ])
    ];
  return (
    <View style={{flex:1, backgroundColor:colors.primary}}>
     <ScrollView>
        <View style={{padding:10, }}>

    <View  style={{alignSelf:'center', alignItems:"center"}}>
        <Image style={{width:340, height:170,  borderRadius:5, }} source={Slider1}/>
    </View>

    
    <View style={{marginTop:'10%'}}>
        {/* MENU SURVEIAN */}
       
   {/* MENU SURVEIAN */}
        <View style={{marginTop: '10%'}}>
            <Text style={{fontFamily:'Poppins-SemiBold', left:40, marginBottom:0, color:'white', fontSize:18}}>Menu Laporan</Text>
            <Text style={{fontFamily:'Poppins-Regular', left:40, marginBottom:10, color:'white'}}>Kegiatan perdampingan{'\n'}keluarga risiko Stunting</Text>
            <View style={{flexDirection:'row', justifyContent:'space-evenly',}}>
                <TouchableOpacity onPress={() => navigation.navigate("FromKonseling")}>
                    <Image style={{height:70, width:70, }} source={MenuLapaoran1}/>
                       <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:"white", top:5}}>Konseling</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("FromBantuanSocial")}>
                    <Image style={{height:70, width:70, }} source={MenuLapaoran2}/>
                    <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:"white", top:5}}>Bantuan{'\n'}Sosial</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("FromRujukan")}>
                    <Image style={{height:70, width:70, }} source={MenuLapaoran3}/>
                    <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:"white", top:5}}>Rujukan</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>

        <View style={{alignItems:'center', marginTop:'11%'}}>
            <Image style={{height:115, width:120}} source={ImahGiziCirle}/>
        </View>
        </View>
     </ScrollView>
     <View style={{padding:0, backgroundColor:'white', flexDirection:"row", justifyContent:'space-around'}}>
        {/* Home */}
        <View style={{padding:10,}}>
        <TouchableNativeFeedback>
            <View style={{}}>
                <Image source={IconHome} style={{
                    width:30, height:30,  tintColor:colors.primary
                }}/>
            </View>
        </TouchableNativeFeedback>
        </View>

         {/* Logout */}
         <View style={{padding:10,}}>
        <TouchableNativeFeedback onPress={keluar}>
            <View style={{}}>
                <Image source={logout} style={{
                    width:30, height:30, tintColor:colors.primary
                }}/>
            </View>
        </TouchableNativeFeedback>
        </View>

        {/* PROFILE */}
        <View style={{padding:10,}}>
        <TouchableNativeFeedback onPress={() => navigation.navigate('ProfileScreen')}>
            <View style={{}}>
                <Image source={IconProfile} style={{
                    width:30, height:30, tintColor:colors.primary
                }}/>
            </View>
        </TouchableNativeFeedback>
        </View>


     </View>
    </View>
  )
}