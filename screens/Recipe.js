import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native';

import { Colors, FamilyFont, FontSize } from '../constants/styles';
import { uuid } from '../constants/functions';

const Recipe = (props) => {

    const [ingredients, setIngredients] = useState([]);

    const recipe = props.selectedRecipe;
    var durationObj = {
        hour: 0,
        minute: 0,
        second: 0
    }
    var timerStepsArr = recipe.steps.filter(step => step.timer).map(step => step.timer);
    timerStepsArr.forEach(step => {
        durationObj.hour += step.hour;
        durationObj.minute += step.minute;
        durationObj.second += step.second;
    });


    // console.log("timerStepsArr: ")
    // console.log(timerStepsArr)

    useEffect(() => {

        if (!recipe.bookmarked) {
            var ingredientsObjArr = [];
            recipe.ingredients.forEach(ingredient => {
                var ingredientObj = {
                    id: uuid(),
                    name: ingredient,
                    checked: false,
                }
                ingredientsObjArr.push(ingredientObj);
            });
            setIngredients(ingredientsObjArr)
        }
        return () => {
        }
    }, [])

    const handleIngredientCheck = (ingredientId) => {
        ingredients.map((ing) => {
            if (ing.id === ingredientId) {
                ing.checked = !ing.checked;
            }
            return ing;
        });
        setIngredients([...ingredients]);
    }

  

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container} >
                <ScrollView >
                    <View style={styles.coverImageWrapper}>
                        <Image
                            style={styles.thumbnail}
                            source={recipe.thumbnail}
                        />
                    </View>
                    <View style={styles.recipeMetaWrapper}>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                recipe.private ?
                                    (
                                        <View style={styles.recipeMetaItemWrapper}>
                                            <MaterialCommunityIcons name="lock" size={24} color={Colors.midgray} />
                                            <Text style={styles.recipeMetaItemText} >Private</Text>
                                        </View>
                                    ) :
                                    (
                                        <View style={styles.recipeMetaItemWrapper}>
                                            <MaterialCommunityIcons name="earth" size={24} color={Colors.midgray} />
                                            <Text style={styles.recipeMetaItemText}>Public</Text>
                                        </View>
                                    )
                            }
                            {
                                durationObj.minute || durationObj.hour ?
                                    (
                                        <View style={styles.cookingTimeWrapper}>
                                            <MaterialCommunityIcons name="timelapse" size={24} color={Colors.midgray} />
                                            <Text style={styles.cookingTimeLabel}>{durationObj.minute || durationObj.hour ? moment(durationObj).format('HH:mm') : `Unset Cooking Time`}</Text>
                                        </View>
                                    ) :
                                    (
                                        null
                                    )
                            }
                        </View>

                    </View>
                    <View style={styles.ingredientsWrapper}>
                        <Text style={styles.ingredientsWrapperTitle}>INGREDIENTS</Text>
                        {
                            ingredients.map((ingredient) => {
                                return (
                                    <View key={ingredient.id} style={styles.ingredientItemWrapper}>
                                        <TouchableWithoutFeedback onPress={() => {
                                            handleIngredientCheck(ingredient.id);
                                        }}>
                                            <Image
                                                style={styles.ingredientIcon}
                                                source={ingredient.checked ? require('../assets/images/checkmark-icon.png') : require('../assets/images/add-icon.png')}
                                            />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => {
                                            handleIngredientCheck(ingredient.id);
                                        }}>
                                            <Text style={ingredient.checked ? styles.checkedIngredientLabel : styles.ingredientLabel}>{ingredient.name}</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                )
                            })
                        }
                    </View>

                </ScrollView>
                <View style={styles.getCookingButtonWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        props.navigation.navigate("RecipeCooking");
                    }}>
                        <Text style={styles.getCookingButton}>GET COOKIN'!</Text>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>

        </View >
    )
}

export default Recipe

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    coverImageWrapper: {
    },
    thumbnail: {
        width: '100%',
        height: 300,
        resizeMode: 'cover'
    },
    recipeMetaWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderBottomColor: Colors.lightgray
    },
    recipeMetaItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    recipeMetaItemText: {
        color: Colors.midgray,
        fontFamily: FamilyFont.HeeboRegular,
        marginLeft: 3
    },
    cookingTimeWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    cookingTimeLabel: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.small,
        color: Colors.midgray,
        marginLeft: 5
    },
    ingredientsWrapper: {
        padding: 20
    },
    ingredientsWrapperTitle: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        color: Colors.black,
        marginBottom: 15
    },
    ingredientItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 35
    },
    ingredientIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10
    },
    ingredientLabel: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.small,
        color: Colors.gray,
        flexShrink: 1
    },
    checkedIngredientLabel: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.small,
        textDecorationLine: 'line-through',
        color: Colors.secondary,
        flexShrink: 1
    },
    getCookingButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray,
        paddingVertical: 20,
    },
    getCookingButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.xl,
        color: 'white',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    }
})
