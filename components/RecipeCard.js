import React from 'react'
import moment from 'moment';
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FamilyFont, FontSize } from '../constants/styles';

const RecipeCard = (props) => {

    var recipe = props.recipe;

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

    return (
        <TouchableWithoutFeedback onPress={() => {
            props.setSelectedRecipe(recipe);
            props.navigation.navigate("Recipe");
        }}>
            <View style={styles.card}>
                <View style={styles.thumbnailWrapper}>
                    <Image
                        style={styles.thumbnail}
                        source={recipe.thumbnail}
                    />
                </View>
                <View style={styles.recipeInfoWrapper}>

                    <View style={styles.recipeInfoTop}>
                        <View style={styles.recipeInfoRow}>
                            {
                                props.isBookmarked ?
                                    (
                                        <View style={styles.recipeBookmarkWrapper}>
                                            <Image
                                                style={styles.bookmarkIcon}
                                                source={require('../assets/images/bookmark-active-icon.png')}
                                            />
                                            <Text style={styles.recipeName}>{recipe.name}</Text>
                                        </View>
                                    ) :
                                    (
                                        <Text style={styles.recipeName}>{recipe.name}</Text>
                                    )
                            }
                            {
                                recipe.likes.length ?
                                    (
                                        <View style={styles.recipeLikesWrapper}>
                                            <Image
                                                style={styles.likeIcon}
                                                source={require('../assets/images/like-active-icon.png')}
                                            />
                                            <Text style={styles.likeLabel}>{recipe.likes.length}</Text>
                                        </View>
                                    ) : null
                            }
                        </View>
                        <View style={styles.recipeInfoRow}>
                            <Text style={styles.recipeTimestamp}>
                                {moment(recipe.timestamp.seconds ? recipe.timestamp.toDate() : recipe.timestamp).format('MMMM Do YYYY')}
                            </Text>
                        </View>
                        <View style={styles.recipeInfoRow}>
                            <Text style={styles.recipeDifficultyLabel}>{recipe.difficulty.toUpperCase()}</Text>
                        </View>
                        {
                            recipe.private ?
                                (
                                    <MaterialCommunityIcons name="lock" size={20} color={Colors.midgray} />

                                ) :
                                (
                                    <MaterialCommunityIcons name="earth" size={20} color={Colors.midgray} />
                                )
                        }

                    </View>

                    <View style={styles.recipeInfoBottom}>

                        {/* {
                            durationObj.minute || durationObj.hour ?
                                <View style={styles.cookingTimeWrapper}>
                                    <Image
                                        style={styles.timeIcon}
                                        source={require('../assets/images/time-purple-icon.png')}
                                    />
                                    <Text style={styles.cookingTimeLabel}>{moment(durationObj).format('HH:mm')}</Text>
                                </View> :
                                <View></View>
                        } */}
                        <View></View>
                        <Image
                            style={styles.chevIcon}
                            source={require('../assets/images/chev-icon.png')}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

    )
}

export default RecipeCard

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 160,
        borderBottomColor: Colors.gray,
        borderBottomWidth: .5
    },
    thumbnailWrapper: {
        flex: 1
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    recipeInfoWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 2
    },
    recipeInfoTop: {

    },
    recipeInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    recipeBookmarkWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bookmarkIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 5
    },
    recipeName: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.normal,
        maxWidth: 160,
    },
    recipeLikesWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    likeIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 3
    },
    likeLabel: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.tiny,
        color: Colors.accent
    },
    recipeTimestamp: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.tiny,
        color: Colors.gray
    },
    recipeDifficultyLabel: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.tiny,
        color: Colors.gray
    },
    recipeInfoBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
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
        color: Colors.primary,
        marginLeft: 5
    },
    chevIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})
