import React from 'react'
import { StyleSheet, Image, Text, View, TouchableWithoutFeedback } from 'react-native'

import { Colors, FamilyFont, FontSize } from '../constants/styles';
import { sections } from '../constants/variables';

const RecipesHeader = (props) => {
    const activeRecipeTypeCard = props.selectedRecipeTypeCard;
    const selectedRecipeCardType = activeRecipeTypeCard ? (sections.filter(section => section.id === activeRecipeTypeCard.sectionId)[0].categories.map((category) => {
        return { id: category.id, name: category.name, src: category.src }
    }).filter(category => category.id === activeRecipeTypeCard.categoryId)[0]) : null;

    return activeRecipeTypeCard ? (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerTitleWrapper}>
                    <Image
                        fadeDuration={0}
                        style={styles.headerIcon}
                        source={selectedRecipeCardType.src}
                    />
                    <Text style={styles.headerTitle}>{`${selectedRecipeCardType.name.toUpperCase()} RECIPES`}</Text>
                </View>
            </View>
        </View>
    ) : null
}

export default RecipesHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    returnArrowIcon: {
        width: 30,
        height: 35,
        resizeMode: 'contain',
    },
    headerTitleWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    headerTitle: {
        fontFamily: FamilyFont.HeeboMedium,
        color: Colors.gray,
        marginHorizontal: 10,
        fontSize: FontSize.normal
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    }

})
