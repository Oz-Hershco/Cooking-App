import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import { FontSize, FamilyFont } from '../constants/styles';

import { sections } from '../constants/variables';
import RecipesCategorySection from '../components/RecipesCategorySection';

const Recipes = (props) => {

    const recipes = props.recipes;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.body}>
                    <Text style={styles.screenInstruction}>Explore new recipes and get cookin'!</Text>
                    {
                        sections.map((section) => {
                            return (<RecipesCategorySection navigation={props.navigation} key={section.id} section={section} recipes={recipes} setSelectedRecipeTypeCard={props.setSelectedRecipeTypeCard} />);
                        })
                    }
                </View>
            </ScrollView >
        </SafeAreaView >
    )
}

export default Recipes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    body: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    screenInstruction: {
        fontSize: FontSize.normal,
        fontFamily: FamilyFont.HeeboLight,
    }
})
