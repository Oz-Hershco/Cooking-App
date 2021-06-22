import React from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const RecipeCookingHeader = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.headerTitle}>{"Cookin' Time".toUpperCase()}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    props.navigation.navigate('Timers')
                }}>
                    <View style={styles.headerMenuItemWrapper}>
                        <MaterialCommunityIcons name="timer" size={22} color={Colors.gray} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default RecipeCookingHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
    },
    returnArrowIconWrapper: {
        width: '10%',
    },
    returnArrowIcon: {
        width: 30,
        height: 35,
        resizeMode: 'contain',
    },
    headerTitleWrapper: {
        flex: 1,
    },
    headerTitle: {
        fontFamily: FamilyFont.HeeboMedium,
        color: Colors.gray,
        fontSize: FontSize.normal,
        textAlign: 'center',
        marginRight:20
    }
})
