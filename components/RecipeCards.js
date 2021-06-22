import React from 'react'
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import RecipeCard from '../components/RecipeCard'

const RecipeCards = (props) => {
    var recipes = props.recipes;
    return (
        <SafeAreaView style={styles.container} >
            <ScrollView style={styles.scrollView}>
                {
                    recipes.map((recipe) => {
                        return (<RecipeCard navigation={props.navigation} key={recipe.id} recipe={recipe} isBookmarked={recipe.isBookmarked} setSelectedRecipe={props.setSelectedRecipe} />)
                    })
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecipeCards

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
})
