import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import RecipeCards from '../components/RecipeCards'

const Favorites = (props) => {
    var recipes = props.recipes;

    return recipes.length ?
        (
            <RecipeCards navigation={props.navigation} recipes={recipes} setSelectedRecipe={props.setSelectedRecipe} />
        ) :
        (
            <View style={styles.container}>
                <Text>Nothing saved yet. Like a recipe you favor to save it.</Text>
            </View>
        )
}

export default Favorites

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
})
