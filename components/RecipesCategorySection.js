import React from 'react';
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback } from 'react-native';
import { Colors, FamilyFont } from '../constants/styles';

const RecipesCategorySection = (props) => {

    var section = props.section;
    // console.log(recipes.filter(recipe => recipe.tags.filter(tag => tag.id === "6f452e04-997f-48b2-9d52-a974e7d9ccff").length))

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{section.name}</Text>
            <View style={styles.body}>
                {
                    section.categories.map((category, i) => {
                        var categoryRecipesCount = props.recipes.filter(recipe => recipe.tags.filter(tag => tag.id === category.id).length).length;
                        return (

                            categoryRecipesCount ?
                                (
                                    <TouchableWithoutFeedback key={category.id} onPress={() => {
                                        props.setSelectedRecipeTypeCard({ sectionId: section.id, categoryId: category.id })
                                        props.navigation.navigate('RecipesList')
                                    }}>
                                        <View style={styles.categoryContainer}>
                                            <View style={styles.categoryCard}>
                                                <Image
                                                    style={styles.categoryIcon}
                                                    source={category.src}
                                                />
                                            </View>
                                            {/* <Text style={styles.label}>{category.name + ` (${categoryRecipesCount})`}</Text> */}
                                            <Text style={styles.label}>{category.name}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ) :
                                (
                                    <View key={category.id} style={styles.disabledCategoryContainer}>
                                        <View style={styles.categoryCard}>
                                            <Image
                                                style={styles.categoryIcon}
                                                source={category.src}
                                            />
                                        </View>
                                        {/* <Text style={styles.label}>{category.name + ` (${categoryRecipesCount})`}</Text> */}
                                        <Text style={styles.label}>{category.name}</Text>
                                    </View>
                                )
                        );
                    })
                }
            </View>
        </View>
    )
}

export default RecipesCategorySection

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 25,
    },
    title: {
        color: Colors.black,
        fontFamily: FamilyFont.HeeboMedium
    },
    body: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledCategoryContainer: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.3
    },
    categoryCard: {
        backgroundColor: Colors.lightgray,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryIcon: {
        height: 35,
        width: 55,
        resizeMode: 'contain'
    },
    label: {
        color: Colors.gray,
        fontFamily: FamilyFont.HeeboLight,
        marginTop: 5
    },
})
