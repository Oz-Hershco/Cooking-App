import React from 'react'
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback } from 'react-native'
import { Colors, FamilyFont, FontSize } from '../constants/styles';

const Navbar = (props) => {

    var currentScreenIndex = props.currentScreenIndex;

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => {
                props.onNavigate(0);//explore screen
            }}>
                <View style={styles.navItemContainer}>
                    <Image
                        fadeDuration={0}
                        style={styles.navItemIcon}
                        source={currentScreenIndex == 0 ? require('../assets/images/explore-nav-active-icon.png') : require('../assets/images/explore-nav-icon.png')}
                    />
                    <Text style={currentScreenIndex == 0 ? styles.activeNavItemLabel : styles.navItemLabel}>Explore</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                props.onNavigate(8);//my recipes screen
            }}>
                <View style={styles.navItemContainer}>
                    <Image
                        fadeDuration={0}
                        style={styles.navItemIcon}
                        source={currentScreenIndex == 8 ? require('../assets/images/recipes-nav-active-icon.png') : require('../assets/images/recipes-nav-icon.png')}
                    />
                    <Text style={currentScreenIndex == 8 ? styles.activeNavItemLabel : styles.navItemLabel}>My Recipes</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                props.onNavigate(1);//favorites screen
            }}>
                <View style={styles.navItemContainer}>
                    <Image
                        fadeDuration={0}
                        style={styles.navItemIcon}
                        source={currentScreenIndex == 1 ? require('../assets/images/favorites-nav-active-icon.png') : require('../assets/images/favorites-nav-icon.png')}
                    />
                    <Text style={currentScreenIndex == 1 ? styles.activeNavItemLabel : styles.navItemLabel}>Liked</Text>
                </View>
            </TouchableWithoutFeedback>
            {/* <View style={styles.disabledNavItem}>
                <Image
                    fadeDuration={0}
                    style={styles.navItemIcon}
                    source={require('../assets/images/bookmarks-nav-icon.png')}
                />
                <Text style={styles.navItemLabel}>Bookmarks</Text>
            </View> */}


        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray,
    },
    navItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        flex: 1,
    },
    navItemIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    navItemLabel: {
        color: Colors.gray,
        fontSize: FontSize.xtiny,
        fontFamily: FamilyFont.HeeboRegular
    },
    activeNavItemLabel: {
        color: Colors.secondary,
        fontSize: FontSize.xtiny,
        fontFamily: FamilyFont.HeeboRegular
    },
    disabledNavItem: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        flex: 1,
        opacity: 0.5
    }
})
