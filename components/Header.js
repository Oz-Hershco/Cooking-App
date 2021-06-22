import React from 'react'
import { StyleSheet, Image, Text, View, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { Colors } from '../constants/styles';

const Header = (props) => {

    var _menu = null;

    const setMenuRef = ref => {
        _menu = ref;
    };

    const hideMenu = () => {
        _menu.hide();
    };

    const showMenu = () => {
        _menu.show();
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoItemsWrapper}>
                <Image
                    fadeDuration={0}
                    style={styles.logoIcon}
                    source={require('../assets/images/logo.png')}
                />
            </View>

            <View style={styles.logoItemsWrapper}>
                <Menu
                    ref={setMenuRef}
                    button={
                        <TouchableWithoutFeedback onPress={() => {
                            // startLogout();
                            showMenu();
                        }}>
                            <Image
                                fadeDuration={0}
                                style={styles.googlelogo}
                                source={require('../assets/images/settings-icon.png')}
                            />
                        </TouchableWithoutFeedback>
                    }
                >
                    <MenuItem textStyle={styles.headerMenuItemContainer} onPress={() => {
                        hideMenu();
                        props.navigation.navigate('Timers');
                    }}>
                        <View style={styles.headerMenuItemWrapper}>
                            <MaterialCommunityIcons name="timer" size={22} color={Colors.gray} />
                            <Text style={styles.headerMenuItemText}>Set Timer</Text>
                        </View>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem textStyle={styles.headerMenuItemContainerCentered} onPress={props.onLogout}>
                        <View style={styles.headerMenuItemWrapper}>
                            <Text style={styles.headerAccentMenuItemText}>LOG OUT</Text>
                        </View>
                    </MenuItem>
                </Menu>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,

    },
    logoItemsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoIcon: {
        height: 35,
        width: 110,
        resizeMode: 'contain'
    },
    googlelogo: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    headerMenuItemContainer: {
        color: Colors.gray,
    },
    headerMenuItemContainerCentered: {
        color: Colors.gray,
        alignSelf: 'center'
    },
    headerMenuItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerMenuItemText: {
        marginLeft: 5,
        color: Colors.gray
    },
    headerAccentMenuItemText: {
        marginLeft: 5,
        color: Colors.accent
    }
})
