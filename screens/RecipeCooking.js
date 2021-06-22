import React, { useState } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native'

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const RecipeCooking = (props) => {

    const [currentStep, setCurrentStep] = useState(0);

    const recipe = props.selectedRecipe;

    const handleNextStep = () => {
        if (currentStep !== recipe.steps.length - 1) {
            var nextStep = currentStep + 1;
            setCurrentStep(nextStep);
        }
    }

    const handlePrevStep = () => {
        if (currentStep !== 0) {
            var prevStep = currentStep - 1;
            setCurrentStep(prevStep);
        }
    }

    const Step = () => {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={styles.SafeAreaViewContainer}>
                    <ScrollView>
                        <View style={styles.container}>

                            <View style={styles.stepWrapper}>
                                <Text style={styles.stepLabel}>{recipe.steps[currentStep].instruction}</Text>
                            </View>
                            {
                                recipe.steps[currentStep].ingredients.length ?
                                    <View style={styles.relatedIngredientsWrapper}>
                                        <Text style={styles.relatedIngredientLabel}>RELATED INGREDIENTS</Text>
                                        <View style={styles.ingredientTagWrapper}>
                                            {
                                                recipe.steps[currentStep].ingredients.filter(ingredient => ingredient.checked).map((ingredient, i) => {
                                                    return <Text key={i} style={styles.ingredientTag}>{ingredient.name ? ingredient.name : ingredient}</Text>
                                                })
                                            }
                                        </View>

                                    </View> : null
                            }

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepHeaderLabel}>STEP {currentStep + 1}</Text>
            </View>
            <Swipeable containerStyle={{ flex: 1 }} childrenContainerStyle={{ flex: 1 }} onSwipeableRightWillOpen={handleNextStep} onSwipeableWillClose={handlePrevStep} renderRightActions={Step}>
                <Step />
            </Swipeable>
            <View style={styles.stepsNavigationWrapper}>
                {
                    currentStep === 0 ? <View></View> :
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                var prevStep = currentStep - 1;
                                setCurrentStep(prevStep);
                            }}>
                                <Text style={styles.prevButton}>PREV</Text>
                            </TouchableWithoutFeedback>
                        )
                }
                {
                    currentStep === recipe.steps.length - 1 ?
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                props.navigation.navigate("Recipe");
                            }}>
                                <Text style={styles.finishButton}>FINISH!</Text>
                            </TouchableWithoutFeedback>
                        )
                        :
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                var nextStep = currentStep + 1;
                                setCurrentStep(nextStep);
                            }}>
                                <Text style={styles.nextButton}>NEXT</Text>
                            </TouchableWithoutFeedback>
                        )
                }
            </View>
        </View >
    )
}

export default RecipeCooking

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    SafeAreaViewContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },
    stepHeader: {
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingHorizontal: 20,
    },
    stepHeaderLabel: {
        color: 'black',
        fontFamily: FamilyFont.HeeboMedium,
        fontSize: FontSize.normal
    },
    stepWrapper: {
        marginVertical: 20
    },
    stepLabel: {
        fontFamily: FamilyFont.HeeboLight,
        fontSize: FontSize.xl,
    },
    relatedIngredientsWrapper: {
        marginVertical: 20
    },
    relatedIngredientLabel: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.small,
        color: Colors.gray
    },
    ingredientTagWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    ingredientTag: {
        fontFamily: FamilyFont.HeeboMedium,
        backgroundColor: Colors.primaryDark,
        fontSize: FontSize.tiny,
        color: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 5,
        borderRadius: 5
    },
    stepsNavigationWrapper: {
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray
    },
    prevButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        backgroundColor: Colors.gray,
        color: 'white',
        paddingHorizontal: 45,
        paddingVertical: 12,
        borderRadius: 5
    },
    nextButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        backgroundColor: Colors.primary,
        color: 'white',
        paddingHorizontal: 45,
        paddingVertical: 12,
        borderRadius: 5
    },
    finishButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        backgroundColor: Colors.secondary,
        color: 'white',
        paddingHorizontal: 37,
        paddingVertical: 12,
        borderRadius: 5
    }
})
