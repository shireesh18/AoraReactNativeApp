import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import "../global.css";

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
      isLoading ? "opacity-50" : ""
    }`}
    disabled={isLoading}
  >
    <Text className={`tex-primary font-psemibold text-lg 
        S{textStyles}`}>{title}</Text>
   </TouchableOpacity>
   
  )
}

export default CustomButton
