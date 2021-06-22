import React from 'react'
import { StyleSheet, Image, Text, View, TouchableWithoutFeedback } from 'react-native';

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const BasicHeader = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <TouchableWithoutFeedback onPress={() => {
                    props.onNavigate(props.returnScreenIndex);
                    props.setEditableRecipe(null);
                }}>
                    <View style={styles.returnArrowIconWrapper}>
                        <Image
                            fadeDuration={0}
                            style={styles.returnArrowIcon}
                            source={require('../assets/images/arrow-icon.png')}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.headerTitle}>{props.title}</Text>
                </View>
            </View>
        </View>
    )
}

export default BasicHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
    },
    returnArrowIcon: {
        width: 30,
        height: 35,
        resizeMode: 'contain',
    },
    headerTitleWrapper: {
        flex:1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        flex:1,
        fontFamily: FamilyFont.HeeboMedium,
        color: Colors.gray,
        fontSize: FontSize.normal,
        textAlign:'center',
        marginRight:20
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    }
})
