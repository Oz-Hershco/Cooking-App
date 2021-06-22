import React, { useState } from 'react';
import { StyleSheet,  Text, View, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-simple-toast';
import { recipesCollection, usersCollection } from '../firebase/firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { truncateString, uuid } from '../constants/functions';

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const RecipeHeader = (props) => {

    const [alertDeleteShown, setAlertDeleteShown] = useState(false);
    const [alertPublishShown, setAlertPublishShown] = useState(false);
    const [likes, setLikes] = useState(props.recipe.likes);

    const recipes = props.recipes;
    const recipe = props.recipe;
    const user = props.user;

    var _menu = null;

    const setMenuRef = ref => {
        _menu = ref;
    };

    const hideMenu = () => {
        _menu.hide();
    };

    const showMenu = () => {
        _menu.show();
    };

    const handleRecipeLike = () => {

        var ToastMessage = "";
        //setting the current recipe likes state
        var newRecipeLikesArr = [];
        if (likes.filter(likeUser => likeUser.uid === user.uid).length) {
            newRecipeLikesArr = likes.filter(likeUser => likeUser.uid !== user.uid);
        } else {
            likes.push({
                uid: user.uid,
                email: user.email
            });
            newRecipeLikesArr = likes;
        }
        recipes.forEach(rec => {
            if (rec.id === recipe.id) {
                rec.likes = newRecipeLikesArr;
            }
        });
        // console.log(isLiked ? newRecipeLikesArr : recipeLikesArr)
        setLikes([...newRecipeLikesArr]);
        props.setRecipes([...recipes]);

        //update current recipe likes in firebase
        recipesCollection.doc(recipe.id).update({
            likes: newRecipeLikesArr
        })
            .then(function () {
                console.log("Recipe likes updated!");
                //set current user liked recipes state
                var userLikedRecipesArr = user.likedRecipes ? user.likedRecipes : [];
                var newUserLikedRecipesArr = [];
                if (userLikedRecipesArr.filter(rec => rec.id === recipe.id).length) {
                    newUserLikedRecipesArr = userLikedRecipesArr.filter(rec => rec.id !== recipe.id);
                    ToastMessage = "Unliked";
                } else {
                    userLikedRecipesArr.push({
                        id: recipe.id,
                        ingredients: recipe.ingredients.map((ingredient) => {
                            return {
                                id: uuid(),
                                name: ingredient,
                                checked: false,
                            }
                        })
                    });
                    newUserLikedRecipesArr = userLikedRecipesArr;
                    ToastMessage = "Liked";
                }
                user.likedRecipes = newUserLikedRecipesArr;

                //set current user liked recipes in firebase
                var likedRecipesArr = [];
                if (props.likedRecipes.filter(likedRecipe => likedRecipe.id === recipe.id).length) {
                    likedRecipesArr = props.likedRecipes.filter(likedRecipe => likedRecipe.id !== recipe.id);
                } else {
                    props.likedRecipes.push(recipe);
                    likedRecipesArr = props.likedRecipes;
                }

                //update user liked recipes
                usersCollection.doc(user.uid).update({
                    likedRecipes: newUserLikedRecipesArr
                })
                    .then(function () {
                        console.log("Recipe likes updated!");
                        props.setUser(user);
                        props.setLikedRecipes([...likedRecipesArr]);
                        Toast.show(ToastMessage);
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }

    const publishEl = (
        recipe?.author?.uid === user.uid ?
            (
                recipe.private ? (
                    <MenuItem textStyle={styles.headerMenuItemContainer} onPress={() => {
                        hideMenu();
                        setAlertPublishShown(true);
                    }}>
                        <View style={styles.headerMenuItemWrapper}>
                            <MaterialCommunityIcons name="progress-upload" size={22} color={Colors.secondary} />
                            <Text style={styles.headerSecondaryMenuItemText}>PUBLISH</Text>
                        </View>
                    </MenuItem>
                ) : null
            ) : null
    )

    const favoriteEl = (
        recipe?.author?.uid === user.uid ?
            null :
            (
                <MenuItem textStyle={styles.headerMenuItemContainer} onPress={() => {
                    hideMenu();
                    handleRecipeLike();
                }}>
                    <View style={styles.headerMenuItemWrapper}>
                        {
                            likes.filter(likeUser => likeUser.uid === user.uid).length ?
                                (
                                    <MaterialCommunityIcons name="heart" size={22} color={Colors.gray} />
                                ) :
                                (
                                    <MaterialCommunityIcons name="heart-outline" size={22} color={Colors.gray} />
                                )
                        }
                        <Text style={styles.headerMenuItemText}>{likes.filter(likeUser => likeUser.uid === user.uid).length ? "UNLIKE" : "LIKE"}</Text>
                    </View>
                </MenuItem>
            )
    )

    const editEldeletEl = (
        recipe?.author?.uid === user.uid && recipe.private ?
            (
                <View>
                    <MenuItem textStyle={styles.headerMenuItemContainer} onPress={() => {
                        props.handleMyRecipeEdit(recipe, props.navigation);
                        hideMenu();
                    }}>
                        <View style={styles.headerMenuItemWrapper}>
                            <MaterialCommunityIcons name="circle-edit-outline" size={22} color={Colors.gray} />
                            <Text style={styles.headerMenuItemText}>EDIT</Text>
                        </View>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem textStyle={styles.headerMenuItemContainerCentered} onPress={() => {
                        hideMenu();
                        setAlertDeleteShown(true);
                    }}>
                        <View style={styles.headerMenuItemWrapper}>
                            <MaterialCommunityIcons name="delete-circle-outline" size={22} color={Colors.accent} />
                            <Text style={styles.headerAccentMenuItemText}>DELETE</Text>
                        </View>
                    </MenuItem>
                </View>
            ) : null

    )

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerTitleWrapper}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{`${truncateString(recipe.name, 20).toUpperCase()}`}</Text>
                    </View>
                    {/* <Image
                        style={styles.bookmarkIcon}
                        source={require('../assets/images/bookmark-icon.png')}
                    /> */}

                    {
                        publishEl || favoriteEl || editEldeletEl ?
                            (
                                <View style={styles.headerMenuWrapper}>
                                    <Menu
                                        ref={setMenuRef}
                                        button={
                                            <TouchableWithoutFeedback onPress={() => {
                                                // startLogout();
                                                showMenu();
                                            }}>
                                                <View style={{ padding: 5 }}>
                                                    <MaterialCommunityIcons name="dots-horizontal" size={24} color={Colors.gray} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        }
                                    >
                                        <MenuItem textStyle={styles.headerMenuItemContainer} onPress={() => {
                                            hideMenu();
                                            props.navigation.navigate('Timers');
                                        }}>
                                            <View style={styles.headerMenuItemWrapper}>
                                                <MaterialCommunityIcons name="timer" size={22} color={Colors.gray} />
                                                <Text style={styles.headerMenuItemText}>Set Timer</Text>
                                            </View>
                                        </MenuItem>
                                        {publishEl}
                                        {favoriteEl}
                                        {editEldeletEl}
                                    </Menu>
                                </View>
                            ) :
                            null
                    }

                </View>
            </View>
            <AwesomeAlert
                show={alertDeleteShown}
                title="Delete Recipe?"
                message={`You're about to delete ${recipe.name} recipe. Are you sure?`}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, Cancel"
                confirmText="Yes, delete it"
                titleStyle={{ color: Colors.black, fontFamily: FamilyFont.HeeboMedium, fontSize: FontSize.normal }}
                messageStyle={{ color: Colors.gray, fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                confirmButtonColor={Colors.accent}
                cancelButtonColor={Colors.gray}
                cancelButtonTextStyle={{ fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                confirmButtonTextStyle={{ fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                onDismiss={() => {
                    setAlertDeleteShown(false);
                }}
                onCancelPressed={() => {
                    setAlertDeleteShown(false);
                }}
                onConfirmPressed={() => {
                    setAlertDeleteShown(false);
                    props.handleMyRecipeRemoval(recipe.id, recipe, props.navigation);
                }}
            />

            <AwesomeAlert
                show={alertPublishShown}
                title="Publish Recipe?"
                message={`You're about to publish ${recipe.name} recipe. Once approved, your recipe will be visible to all users within the app and you will no longer be able to edit or delete it. Do you still wish to continue?`}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, Cancel"
                confirmText="Yes, Publish"
                titleStyle={{ color: Colors.black, fontFamily: FamilyFont.HeeboMedium, fontSize: FontSize.normal }}
                messageStyle={{ color: Colors.gray, fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                confirmButtonColor={Colors.secondary}
                cancelButtonColor={Colors.gray}
                cancelButtonTextStyle={{ fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                confirmButtonTextStyle={{ fontFamily: FamilyFont.HeeboRegular, fontSize: FontSize.small }}
                onDismiss={() => {
                    setAlertPublishShown(false);
                }}
                onCancelPressed={() => {
                    setAlertPublishShown(false);
                }}
                onConfirmPressed={() => {
                    setAlertPublishShown(false);
                    props.handleMyRecipePublish(recipe);
                }}
            />
        </View >
    )
}

export default RecipeHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderBottomColor: Colors.lightgray
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitleWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontFamily: FamilyFont.HeeboMedium,
        color: Colors.gray,
        fontSize: FontSize.normal,
        textAlign: 'center',
        marginRight: 20
    },
    bookmarkIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 10
    },
    headerMenuWrapper: {

    },
    headerMenuItemContainer: {
        color: Colors.gray,
    },
    headerMenuItemContainerCentered: {
        color: Colors.gray,
        alignSelf: 'center'
    },
    headerMenuItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerMenuItemText: {
        marginLeft: 5,
        color: Colors.gray
    },
    headerSecondaryMenuItemText: {
        marginLeft: 5,
        color: Colors.secondary
    },
    headerAccentMenuItemText: {
        marginLeft: 5,
        color: Colors.accent
    }

})
