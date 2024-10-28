import { View, Text, ScrollView, Image, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';


const SignIn = () => {

    const { setUser, setIsLoggedIn } = useGlobalContext();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, SetIsSubmitting] = useState(false)

    const submit = async () => {
      if( form.email === "" || form.password === "" ) {
       Alert.alert('Error', 'Please fill in all the fields')
      }
 
      SetIsSubmitting(true)

      try {
       await signIn(form.email, form.password);
       const result = await getCurrentUser();
 
       // set it to global state using context
       setUser(result);
       setIsLoggedIn(true);
       Alert.alert("Success", "User signed in successfully");
       router.replace('/home');
       
      } catch ( error ) {
        console.log(error);
         Alert.alert('Error', error.message);
      } finally {
         SetIsSubmitting(false);
      }
     }
  return (
    <SafeAreaView className= "bg-primary h-full " >
      <ScrollView>
        <View className='w-full justify-center h-full px-4 my-6'
        style={{minHeight: Dimensions.get("window").height - 100, }}
        >
            <Image 
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
            />
            <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>
            <FormField 
                      title="Email"
                      value={form.email}
                      handleChangeText={(e) => setForm({
                          ...form,
                          email: e
                      })}
                      otherStyles="mt-7"
                      keyboardType="email-address" placeholder="test@gmail.com"            />
            <FormField 
                      title="Password"
                      value={form.password}
                      handleChangeText={(p) => setForm({
                          ...form,
                          password: p
                      })}
                      otherStyles="mt-7" placeholder={undefined}            />

           <CustomButton 
                      title="Sign In"
                      handlePress={submit}
                      containerStyles="mt-7" textStyles={undefined} isLoading={undefined}           />
           <View className='justify-center pt-5 flex-row gap-2'>
                <Text className='text-lg text-gray-100 font-pregular'>
                    Don't have account?
                </Text>
                <Link href="/sign-up" 
                className="text-lg font-psemibold text-secondary">
                    Sign Up
                </Link>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn