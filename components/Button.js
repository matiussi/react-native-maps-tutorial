import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

const Button = ({
   backgroundColor = '#fff',
   width = 50,
   heigth = 50,
   icon,
   onPress
}) => {
   return (
      <TouchableOpacity
         //Adicionando um estilo personalizado de acordo com as props
         style={[
            styles.mapButton,
            {
               backgroundColor: backgroundColor,
               height: heigth,
               width: width
            }
         ]}
         onPress={() => onPress()}
      >
         <Image style={styles.icon} source={icon}>
         </Image>
      </TouchableOpacity>
   );
}
const styles = StyleSheet.create({

   mapButton: {
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   icon: {
      width: 25,
      height: 25,
      resizeMode: 'stretch'
   }
});
export default Button;