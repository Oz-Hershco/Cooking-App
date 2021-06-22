import React from 'react'
import { StyleSheet, View } from 'react-native'

import RecipeCards from '../components/RecipeCards';

const RecipesList = (props) => {

    const activeRecipeTypeCard = props.selectedRecipeTypeCard;
    var recipes = props.recipes.filter(recipe => recipe.tags.filter(tag => tag.id === activeRecipeTypeCard.categoryId).length);


    return (
        <View style={styles.container}>
            <RecipeCards navigation={props.navigation} recipes={recipes} setSelectedRecipe={props.setSelectedRecipe} />
        </View>

    )
}

export default RecipesList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    // scrollView: {
    //     backgroundColor: 'pink',
    //     marginHorizontal: 20,
    // },
})
