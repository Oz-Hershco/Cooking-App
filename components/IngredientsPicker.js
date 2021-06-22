import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import { Colors, FamilyFont, FontSize } from '../constants/styles';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const IngredientsPicker = (props) => {

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => { props.ingredientsBottomSheetRef.current.snapTo(0) }}>
                <View style={styles.addNewIngredientsSectionWrapper}>
                    <View style={styles.addNewIngredientsTextButtonWrapper}>
                        <Text style={styles.addNewIngredientsTextButton}>{props.ingredients.length ? "EDIT INGREDIENTS " : "ADD NEW INGREDIENTS "}</Text>
                        {
                            props.ingredients.length ?
                                <MaterialCommunityIcons name="circle-edit-outline" size={24} color={Colors.primary} /> :
                                <MaterialIcons name="add-box" size={24} color={Colors.primary} />
                        }
                    </View>
                    {
                        props.ingredients.length ?
                            (
                                <View style={styles.ingredientTagsWrapper}>
                                    {
                                        props.ingredients.map((ingredient, i) => {
                                            return (
                                                < View style={styles.ingredientTagWrapper} key={i} >
                                                    <Text style={styles.ingredientTag}>{ingredient.name}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            ) : null
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default IngredientsPicker

const styles = StyleSheet.create({
    addNewIngredientsSectionWrapper: {
        marginBottom: 20,
        borderBottomWidth: .5,
        borderColor: Colors.gray,
        paddingBottom: 20,
    },
    addNewIngredientsTextButtonWrapper: {
        flexDirection: 'row',
    },
    addNewIngredientsTextButton: {
        color: Colors.primary,
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
    },
    ingredientTagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10
    },
    ingredientTagWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRightWidth: .5,
        borderRightColor: Colors.midgray
    },
    ingredientTag: {
        backgroundColor: Colors.primaryDark,
        color: 'white',
        alignSelf: 'flex-start',
        padding: 5,
        fontFamily: FamilyFont.HeeboMedium,
        borderRadius: 5,
        marginRight: 5
    },
})
