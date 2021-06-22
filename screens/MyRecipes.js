import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

import { Colors } from '../constants/styles';
import RecipeCards from '../components/RecipeCards';

const MyRecipes = (props) => {

    const recipes = props.recipes;


    return (
        <View style={recipes.length ? styles.container : styles.emptyContainer}>
            {
                recipes.length ?
                    (
                        <RecipeCards navigation={props.navigation} recipes={recipes} setSelectedRecipe={props.setSelectedRecipe} />
                    ) :
                    (
                        <Text>No recipes added yet. Create something!</Text>
                    )
            }
            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                props.navigation.navigate("CreateRecipe");
            }} style={styles.floatingButton}>
                <Image
                    fadeDuration={0}
                    style={styles.floatingButtonIcon}
                    source={require('../assets/images/plus-white-icon.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

export default MyRecipes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    floatingButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        right: 20,
        bottom: 20,
        backgroundColor: Colors.primaryDark,
        borderRadius: 30,
        elevation: 8,
        alignContent: 'center',
        justifyContent: 'center',
    },
    floatingButtonContainer: {
        flex: 1,

    },
    floatingButtonIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    }
})
