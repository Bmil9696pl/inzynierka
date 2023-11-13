import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RFPercentage } from "react-native-responsive-fontsize";


const DatePicker = ({visible, date, customSetDate, handleDatePicker}) =>{
    
    return(
        <View>
            {visible && (
            <DateTimePicker 
            
            mode="date" 
            display="spinner"
            value={date}
            onChange={customSetDate}
        
            minimumDate={new Date(2015, 1, 1)}
            maximumDate={new Date(2023, 18, 28)}
            //disabled={disabled}
            >
            </DateTimePicker>
              )}
            <TouchableOpacity onPress={handleDatePicker}>
              <Text style={styles.text}>
                {date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear()}
              </Text>
            </TouchableOpacity>
          </View>
    );
}

export default DatePicker;

const styles = StyleSheet.create({
    text: {
        alignSelf: "center",
        color: "#FFFFFF",
        fontSize: RFPercentage(3.5),
      },
})