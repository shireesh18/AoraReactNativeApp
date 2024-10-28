import { View, Text, ScrollView, Image, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import {createUser} from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider';



const SignUp = () => {

    const { setUser, setIsLoggedIn } = useGlobalContext();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isSubmitting, SetIsSubmitting] = useState(false)

    const submit = async () => {
     if( form.username === "" || form.email === "" || form.password === "") {
      Alert.alert('Error', 'Please fill in all the fields')
     }

     SetIsSubmitting(true)
     try {
      const result = await createUser(form.email, form.password, form.username)
      // set it to global state using context
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/home');
      
     } catch ( error ) {
        Alert.alert('Error', error.message);
     } finally {
        SetIsSubmitting(false);
     }
    }
  return (
    <SafeAreaView className= "bg-primary h-full " >
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4 my-6'
        style={{
          minHeight: Dimensions.get("window").height - 100,
        }}
        >
            <Image 
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
            />
            <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Sign Up to Aora</Text>
            <FormField 
                      title="Username"
                      value={form.username}
                      handleChangeText={(e) => setForm({
                          ...form,
                          username: e
                      })}
                      otherStyles="mt-10"
                       placeholder="john doe"            />

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
                      title="Sign Up"
                      handlePress={submit}
                      containerStyles="mt-7"  isLoading={isSubmitting} 
           />
           <View className='justify-center pt-5 flex-row gap-2'>
                <Text className='text-lg text-gray-100 font-pregular'>
                    Have an account already?
                </Text>
                <Link href="/sign-in" 
                className="text-lg font-psemibold text-secondary">
                    Login
                </Link>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp