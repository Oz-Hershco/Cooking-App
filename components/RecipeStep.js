import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FamilyFont, FontSize } from '../constants/styles';
import Checkbox from '../components/Checkbox';

const RecipeStep = (props) => {

    const onCheck = (stepIngredients) => {
        // console.log(checkedObj)
        props.handleStepRelatedIngredientsUpdate(props.id, stepIngredients)
    }
    return (
        <View style={styles.RecipeStep}>
            <View style={styles.RecipeStepHeader}>
                <Text style={styles.instructionStepLabel}>Step {props.index + 1}</Text>
                <MaterialCommunityIcons onPress={() => { props.handleStepRemove(props.id) }} name="delete-circle" size={32} color="white" />
            </View>
            <View style={styles.RecipeStepBody}>
                <View style={styles.instructionInputWrapper}>
                    <TextInput
                        keyboardType="default"
                        textContentType="none"
                        placeholder="Enter Instruction"
                        style={styles.instructionInput}
                        onChangeText={text => props.handleStepInstructionUpdate(props.id, text)}
                        value={props.instruction}
                        numberOfLines={5}
                        multiline={true}
                    />
                </View>
                {
                    props.ingredients.length ?
                        (
                            <View>
                                <Text style={styles.relatedIngredientsLabel}>Step Related Ingredients:</Text>
                                {
                                    props.ingredients.map((ingredient, i) => {
                                        return (
                                            <Checkbox
                                                key={i}
                                                id={ingredient.id}
                                                label={ingredient.name}
                                                ingredients={props.ingredients}
                                                defaultChecked={ingredient.checked}
                                                onCheck={onCheck}
                                                checkboxSize={20}
                                                checkboxContainerStyle={styles.checkboxContainer}
                                                checkboxLabelStyle={styles.checkboxLabel}
                                                checkedColor={Colors.secondary}
                                                uncheckedColor={Colors.black}
                                            />
                                        )
                                    })
                                }
                            </View>
                        ) : null
                }
            </View>
        </View>
    )
}

export default RecipeStep

const styles = StyleSheet.create({
    RecipeStep: {
        marginVertical: 15,
    },
    RecipeStepHeader: {
        padding: 12,
        backgroundColor: Colors.primaryDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    instructionStepLabel: {
        color: 'white',
        fontFamily: FamilyFont.HeeboMedium,
        fontSize: FontSize.large,
    },
    RecipeStepBody: {
        padding: 15,
        borderColor: Colors.lightgray,
        borderWidth: 1,
    },
    instructionInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderRadius: 5,
        marginBottom: 15
    },
    instructionInput: {
        flex: 1,
        fontSize: FontSize.small,
        paddingHorizontal: 15,
        paddingVertical: 10,
        textAlignVertical: 'top'
    },
    relatedIngredientsLabel: {
        fontSize: FontSize.small,
        fontFamily: FamilyFont.HeeboMedium,
        marginBottom: 5,
        color: Colors.black
    },
    checkboxContainer: {
        marginVertical: 5,
        marginLeft: 10
    },
    checkbox: {
        alignSelf: "center",
        borderColor: Colors.primary
    },
    checkboxLabel: {
        fontSize: FontSize.normal,
        fontFamily: FamilyFont.HeeboRegular,
        color: Colors.black
    },
})
