import React from 'react'
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback } from 'react-native'
import { FontSize, FamilyFont, Colors } from '../constants/styles';

const Welcome = ({ navigation }, props) => {
    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <Image
                    fadeDuration={0}
                    style={styles.chefHatIcon}
                    source={require('../assets/images/chef-hat.png')}
                />
                <Image
                    fadeDuration={0}
                    style={styles.logoIcon}
                    source={require('../assets/images/logo.png')}
                />
                <Text style={styles.tagline}>Reach beyond flavor. Mind. Body. Soul.</Text>
            </View>
            <View style={styles.containerBotom}>
                <TouchableWithoutFeedback onPress={() => {
                    navigation.navigate('Sign Up');
                }}>
                    <Text style={styles.primaryButton}>GET STARTED</Text>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => {
                    navigation.navigate('Sign In');
                }}>
                    <Text style={styles.secondaryButton}>I ALREADY HAVE AN ACCOUNT</Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    containerTop: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBotom: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    chefHatIcon: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
    },
    logoIcon: {
        height: 80,
        width: 230,
        resizeMode: 'contain'
    },
    tagline: {
        fontSize: FontSize.normal,
        fontFamily: FamilyFont.HeeboLight,
        color: Colors.gray
    },
    primaryButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: Colors.primary,
        color: 'white',
        paddingVertical: 12,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10
    },

    secondaryButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: 'white',
        color: Colors.primary,
        paddingVertical: 12,
        borderRadius: 5,
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.lightgray,
    },


})
