import { View, Text, ScrollView, TouchableOpacity, Image, TouchableNativeFeedback, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconHome, IconProfile, ImahGiziCirle, MenuLapaoran1, MenuLapaoran2, MenuLapaoran3, MenuSurveilan1, MenuSurveilan2, MenuSurveilan3, Slider1, logout } from '../../assets/img'
import colors from '../../utils/colors'
import { MYAPP, getData, storeData } from '../../utils/storedata/storedata';

export default function HomeScreen({navigation}) {
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
        ]

  return (
    <View style={{flex:1, backgroundColor:colors.primary}}>
     <ScrollView>
        <View style={{padding:10, }}>

    <View style={{alignItems:'center'}}>
        <Image style={{width:340, height:170,  borderRadius:5, }} source={Slider1}/>
    </View>

    
    <View style={{marginTop:'10%'}}>
        {/* MENU SURVEIAN */}
        <View>
            <Text style={{fontFamily:'Poppins-SemiBold', left:0, marginBottom:10, color:'white', fontSize:18, textAlign:'center'}}>Menu Surveilan</Text>
            <View style={{flexDirection:'row', justifyContent:'space-evenly',}}>
                <TouchableOpacity onPress={() => navigation.navigate("FromIbuHamilKEK")}>
                    <Image style={{height:70, width:70, }} source={MenuSurveilan1}/>
                    <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:'white', top:5}}>Ibu Hamil{'\n'}KEK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("FromIbuHamilAnemia")}>
                    <Image style={{height:70, width:70, }} source={MenuSurveilan2}/>
                    <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:'white', top:5}}>Ibu Hamil{'\n'}Anemia</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("FromBadutaGizi")}>
                    <Image style={{height:70, width:70, }} source={MenuSurveilan3}/>
                    <Text style={{fontFamily:'Poppins-Medium', fontSize:10, textAlign:'center', left: -0, color:'white', top:5}}>Baduta{'\n'}Gizi Kurang{'\n'}/ Gizi Buruk</Text>
                </TouchableOpacity>
            </View>
        </View>

  
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