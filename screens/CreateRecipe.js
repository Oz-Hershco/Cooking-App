import React, { useState, useEffect, useRef } from 'react'
import Toast from 'react-native-simple-toast';
import { StyleSheet, Text, TextInput, View, Image, ScrollView, SafeAreaView, ActivityIndicator, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { uuid } from '../constants/functions';
import BottomSheet from 'reanimated-bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import RecipeStep from '../components/RecipeStep';
import ImageSelector from '../components/ImageSelector';
import IngredientsPicker from '../components/IngredientsPicker';
import TypesPicker from '../components/TypesPicker';
import BasicHeader from '../components/BasicHeader'
import { Colors, FamilyFont, FontSize } from '../constants/styles';
import { sections } from '../constants/variables';
import { firebase, usersCollection, storage } from '../firebase/firebase';

const CreateRecipe = (props) => {

    const [startedCreating, setStartedCreating] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [ingredientInput, onChangeIngredient] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [types, setTypes] = useState([]);
    const [isBackDropVisible, setIsBackDropVisible] = useState(false);
    const [steps, setSteps] = useState([
        {
            id: uuid(),
            instruction: "",
            ingredients: []
        }
    ]);
    var user = props.user;
    var editableRecipe = props.editableRecipe;
    // console.log(title)
    const ingredientsBottomSheetRef = useRef(null);

    const ingredientsBottomSheetHeader = () => (
        <View style={styles.bottomSheetHeader}>
            <Image
                fadeDuration={0}
                style={styles.bottomSheetDragIcon}
                source={require('../assets/images/bottom-sheet-drag-icon.png')}
            />
        </View>
    )
    const ingredientsBottomSheet = () => (
        <View style={styles.bottomSheet} >

            <View style={styles.bottomSheetBody}>
                <Text style={styles.bottomSheetBodyTitle}>INGREDIENTS</Text>
                <View style={styles.bottomSheetBodySections}>
                    <SafeAreaView style={styles.container} >
                        <ScrollView >
                            <View style={styles.ingredientTagsWrapper}>
                                {
                                    ingredients.map((ingredient, i) => {
                                        return (
                                            < View style={styles.ingredientTagWrapper} key={i} >
                                                <Text style={styles.ingredientTag}>{ingredient.name}</Text>
                                                <MaterialCommunityIcons onPress={() => { handleIngredientRemove(ingredient.id) }} name="delete-circle" size={32} color={Colors.accent} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView >
                    </SafeAreaView  >
                    <View style={styles.ingredientsInputWrapper}>
                        <View style={styles.ingredientInputWrapper}>
                            <TextInput
                                keyboardType="default"
                                textContentType="none"
                                placeholder="Enter ingredient and amount"
                                style={styles.input}
                                onChangeText={text => onChangeIngredient(text)}
                                onSubmitEditing={handleIngredientAdd}
                                value={ingredientInput}
                            />
                        </View>
                        <TouchableWithoutFeedback onPress={handleIngredientAdd}>
                            <Text style={styles.ingredientInputAddButton}>ADD</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </View >
    );

    const handleIngredientAdd = () => {
        if (ingredientInput.length) {
            var ingredientObj = {
                id: uuid(),
                name: ingredientInput,
                checked: false,
            }
            ingredients.unshift(ingredientObj);
            setIngredients([...ingredients])
            onChangeIngredient("");
        }
    }

    const handleIngredientRemove = (id) => {
        setIngredients([...ingredients.filter(ingredient => ingredient.id !== id)])
    }

    useEffect(() => {

        const unsubscribe = props.navigation.addListener('blur', () => {
            props.setEditableRecipe(null);
        });

        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        var editableRecipe = props.editableRecipe;
        if (editableRecipe) {
            setTitle(editableRecipe.name);
            setDifficulty(editableRecipe.difficulty);
            setIngredients(editableRecipe.steps[0].ingredients.map((ingredient) => {
                return {
                    id: ingredient.id,
                    name: ingredient.name,
                    checked: false,
                }
            }));
            setImage(editableRecipe.thumbnail.uri);
            setTypes([...sections[0].categories, ...sections[1].categories].map((category) => {
                category.checked = editableRecipe.tags.filter(tag => tag.id === category.id).length ? true : false;
                return category;
            }));
            setSteps(editableRecipe.steps)
        } else {
            setTypes([...sections[0].categories, ...sections[1].categories].map((category) => {
                category.checked = false;
                return category;
            }));
        }

        return unsubscribe;

    }, []);

    const handleNewStepAdd = () => {
        steps.push({
            id: uuid(),
            instruction: "",
            ingredients: ingredients.map((ingredient) => {
                return {
                    id: ingredient.id,
                    name: ingredient.name,
                    checked: false,
                }
            })
        })
        setIngredients(ingredients.map((ingredient) => {
            ingredient.checked = false;
            return ingredient;
        }))
        setSteps([...steps])
    }

    const handleStepRemove = (stepId) => {
        setSteps([...steps.filter((step) => step.id !== stepId)])
    }

    const handleStepInstructionUpdate = (stepId, text) => {
        steps.forEach(step => {
            if (step.id === stepId) {
                step.instruction = text;
            }
        });
        setSteps([...steps])
    }

    const handleStepRelatedIngredientsUpdate = (stepId, stepIngredients) => {
        steps.forEach(step => {
            if (step.id === stepId) {
                step.ingredients = stepIngredients;
            }
        });
        setSteps([...steps])
    }

    const handleSubmitValidation = () => {
        return steps.length > 1 && title.length && difficulty.length && ingredients.length && image && types.filter(type => type.checked).length;
        // return true;
    }

    const handleCreateRecipe = () => {
        var recipeId = uuid();
        var myRecipes = props.myRecipes;
        var recipe = {
            id: recipeId,
            timestamp: new Date(),
            difficulty: difficulty,
            ingredients: ingredients.map(tag => tag.name),
            likes: [],
            name: title,
            steps: steps.filter((step) => { return step.id.length && step.instruction.length }),
            tags: types.filter(tag => tag.checked).map((tag) => { return { id: tag.id, name: tag.name } }),
            thumbnail: {
                uri: ""
            },
            author: {
                uid: user.uid
            },
            private: true
        };
        myRecipes.push(recipe);
        setSteps([
            {
                id: "153c1450-3cd3-46c1-a48a-2427147e3a3e",
                instruction: "",
                timer: {
                    hour: null,
                    minute: null,
                    second: null
                },
                ingredients: []
            }
        ]);
        setTitle("");
        setDifficulty("");
        setIngredients([]);
        setImage(null);
        setTypes([]);
        setStartedCreating(true);
        //Add New Recipe Doc in Firebase
        usersCollection.doc(props.user.uid).update({ myRecipes: myRecipes.filter(recipe => recipe.private) })
            .then(function () {
                console.log("Finished adding my new recipe to firebase db.");
                fileUploadHandler(recipeId, props.user.uid, myRecipes)
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                setStartedCreating(false);
            });

    }

    const fileUploadHandler = async (recipeId, userId, myRecipes) => {
        var storageRef = storage.ref();
        var currentTime = new Date().getTime();
        var imgId = currentTime + '-' + uuid() + '-' + title.trim();
        const imgBlob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });
        var uploadTask = storageRef.child('images/recipes/' + imgId).put(imgBlob);

        uploadTask.on('state_changed', function (snapshot) {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                default:
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
            setStartedCreating(false);
        }, function () {

            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                // console.log('File available at', downloadURL);
                //Update post with image data after upload to firebase

                myRecipes.forEach(myRecipe => {
                    if (myRecipe.id === recipeId) {
                        myRecipe.thumbnail = {
                            id: imgId,
                            uri: downloadURL
                        };
                    }
                });
                props.setMyRecipes([...myRecipes]);
                usersCollection.doc(userId).update({ myRecipes: myRecipes.filter(recipe => recipe.private) }).then(function () {
                    console.log("Finished updating my recipe with image data in firebase db.");
                    setStartedCreating(false);
                    props.navigation.goBack();
                    Toast.show("Recipe Created");
                })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
            });
        });
    }

    const handleUpdateRecipe = () => {
        var recipeId = editableRecipe.id;
        var myRecipes = props.myRecipes;

        myRecipes.map((myRecipe) => {
            if (myRecipe.id === recipeId) {
                myRecipe.id = recipeId;
                myRecipe.timestamp = editableRecipe.timestamp;
                myRecipe.difficulty = difficulty;
                myRecipe.ingredients = ingredients.map(tag => tag.name);
                myRecipe.likes = editableRecipe.likes;
                myRecipe.name = title;
                myRecipe.steps = steps.filter((step) => { return step.id.length && step.instruction.length });
                myRecipe.tags = types.filter(tag => tag.checked).map((tag) => { return { id: tag.id, name: tag.name } });
                myRecipe.thumbnail = {
                    uri: editableRecipe.thumbnail.uri,
                    id: editableRecipe.thumbnail.id
                };
                myRecipe.author = {
                    uid: user.uid
                };
                myRecipe.private = editableRecipe.private;
            }
            return myRecipe;
        });;
        props.setMyRecipes([...myRecipes]);

        setStartedCreating(true);

        //Add New Recipe Doc in Firebase
        usersCollection.doc(props.user.uid).update({ myRecipes: myRecipes.filter(recipe => recipe.private) })
            .then(function () {
                console.log("Finished adding my new recipe to firebase db.");
                // fileUploadHandler(recipeId, props.user.uid, myRecipes)
                setStartedCreating(false);
                props.navigation.goBack();
                Toast.show("Recipe Saved");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                setStartedCreating(false);
            });

    }
    return startedCreating ?
        (
            <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View >
        ) :
        (
            <View style={styles.container}>
                <SafeAreaView style={styles.container} >
                    <ScrollView >
                        <ImageSelector image={image} setImage={setImage} />
                        <View style={styles.headerInputsWrapper}>
                            <View style={styles.titleInputWrapper}>
                                <TextInput
                                    keyboardType="default"
                                    textContentType="none"
                                    placeholder="Recipe Title"
                                    style={styles.titleInput}
                                    onChangeText={text => setTitle(text)}
                                    value={title}
                                />
                            </View>
                            <View style={styles.difficultyPickerWrapper}>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={difficulty}
                                    style={styles.picker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setDifficulty(itemValue)
                                    }>
                                    <Picker.Item label="Easy" value="easy" />
                                    <Picker.Item label="Medium" value="medium" />
                                    <Picker.Item label="Hard" value="hard" />
                                    <Picker.Item label="Challenging" value="challenging" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.bodyWrapper}>
                            <IngredientsPicker ingredients={ingredients} ingredientsBottomSheetRef={ingredientsBottomSheetRef} />

                            <Text style={styles.recipeTypeLabel}>CHOOSE RECIPE TYPE</Text>
                            <TypesPicker types={types} setTypes={setTypes} />
                            <View style={styles.addNewStepsSectionWrapper}>
                                <Text style={styles.recipeStepsLabel}>STEPS</Text>

                                {
                                    steps.map((step, i) => {
                                        return (
                                            <RecipeStep
                                                key={i} index={i}
                                                id={step.id}
                                                instruction={step.instruction}
                                                ingredients={editableRecipe ? ingredients.map((ingredient) => {
                                                    return {
                                                        id: ingredient.id,
                                                        name: ingredient.name,
                                                        checked: step.ingredients.filter(sing => sing.id === ingredient.id)[0].checked,
                                                    }
                                                }) : ingredients}
                                                handleStepRemove={handleStepRemove}
                                                handleStepInstructionUpdate={handleStepInstructionUpdate}
                                                handleStepRelatedIngredientsUpdate={handleStepRelatedIngredientsUpdate}
                                            />
                                        )
                                    })
                                }
                                <TouchableWithoutFeedback onPress={() => { handleNewStepAdd() }}>
                                    <Text style={styles.addNewStepButton}>NEW STEP +</Text>
                                </TouchableWithoutFeedback>
                            </View>

                        </View>

                    </ScrollView >
                </SafeAreaView  >
                <View style={styles.createRecipeButtonWrapper}>
                    {
                        !handleSubmitValidation() ?
                            (
                                <Text style={styles.createRecipeButtonDisabled}>{editableRecipe ? "UPDATE RECIPE" : "CREATE RECIPE"}</Text>
                            ) :
                            (
                                <TouchableWithoutFeedback onPress={() => {
                                    if (editableRecipe) {
                                        handleUpdateRecipe();
                                    } else {
                                        handleCreateRecipe();
                                    }
                                }}>
                                    <Text style={styles.createRecipeButton}>{editableRecipe ? "UPDATE RECIPE" : "CREATE RECIPE"}</Text>
                                </TouchableWithoutFeedback>
                            )
                    }
                </View>
                <BottomSheet
                    ref={ingredientsBottomSheetRef}
                    snapPoints={[400, 300, 0]}
                    borderRadius={0}
                    renderHeader={ingredientsBottomSheetHeader}
                    renderContent={ingredientsBottomSheet}
                    initialSnap={2}
                    onOpenStart={() => { setIsBackDropVisible(true) }}
                    onCloseEnd={() => { setIsBackDropVisible(false) }}
                    enabledContentTapInteraction={false}
                    enabledContentGestureInteraction={false}
                />
                {
                    isBackDropVisible ?
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                setIsBackDropVisible(false);
                                ingredientsBottomSheetRef.current.snapTo(2);
                            }}>
                                <View style={styles.backdrop}></View>
                            </TouchableWithoutFeedback>
                        ) : (null)
                }
            </View>
        )
}

export default CreateRecipe

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    spinnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    backdrop: {
        backgroundColor: 'black',
        opacity: 0.5,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },

    headerInputsWrapper: {
        paddingVertical: 30,
        borderBottomWidth: .5,
        marginHorizontal: 20,
        borderColor: Colors.gray,
    },
    titleInputWrapper: {
        flexDirection: 'row',
        borderColor: Colors.gray,
        backgroundColor: 'white',
        borderWidth: .5,
        borderRadius: 5,
        marginBottom: 20,
    },
    titleInput: {
        flex: 1,
        height: 50,
        fontSize: FontSize.large,
        color: Colors.gray,
        paddingHorizontal: 15,
        fontFamily: FamilyFont.HeeboMedium
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: FontSize.small,
        paddingHorizontal: 15
    },
    difficultyPickerWrapper: {
        borderColor: Colors.gray,
        borderWidth: .5,
        borderRadius: 5,
        paddingLeft: 10
    },
    picker: {
        color: Colors.gray,
    },

    bodyWrapper: {
        paddingVertical: 20,
        marginHorizontal: 20,
    },
    addNewIngredientsSectionWrapper: {
        marginBottom: 20,
        borderBottomWidth: .5,
        borderColor: Colors.gray,
        paddingBottom: 20,
    },
    addNewIngredientsTextButtonWrapper: {
        flexDirection: 'row',
    },
    addNewIngredientsTextButton: {
        color: Colors.primary,
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
    },

    recipeTypeLabel: {
        color: Colors.gray,
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.normal,
    },
    bottomSheet: {
        backgroundColor: 'white',
        padding: 16,
        height: 400,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 20
    },
    bottomSheetDragIcon: {
        resizeMode: 'contain',
        height: 10,
        width: 45,
        marginBottom: 10
    },
    bottomSheetBody: {
        paddingHorizontal: 10,
        flex: 1,
    },
    bottomSheetBodyTitle: {
        color: Colors.gray,
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.normal,
    },
    bottomSheetBodySections: {
        justifyContent: 'space-between',
        flex: 1,
        paddingBottom: 20,
    },
    ingredientsInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ingredientInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderRadius: 5,
        marginVertical: 20
    },
    ingredientInputAddButton: {
        marginLeft: 15,
        color: Colors.primary,
        fontFamily: FamilyFont.HeeboMedium,
        fontSize: FontSize.normal
    },
    ingredientTagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10
    },
    ingredientTagWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRightWidth: .5,
        borderRightColor: Colors.midgray
    },
    ingredientTag: {
        backgroundColor: Colors.primaryDark,
        color: 'white',
        alignSelf: 'flex-start',
        padding: 5,
        fontFamily: FamilyFont.HeeboMedium,
        borderRadius: 5,
        marginRight: 5
    },
    addNewStepsSectionWrapper: {
        paddingVertical: 15,
        marginVertical: 15,
        borderTopWidth: .5,
        borderColor: Colors.gray,
        paddingBottom: 20,
    },
    recipeStepsLabel: {
        color: Colors.gray,
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.normal,
    },
    addNewStepButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        color: Colors.primary,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 5,
        borderRadius: 5,
        borderWidth: .2,
        borderColor: Colors.gray
    },
    createRecipeButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray,
        paddingVertical: 20,
    },
    createRecipeButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.xl,
        color: 'white',
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    createRecipeButtonDisabled: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.xl,
        color: Colors.midgray,
        backgroundColor: Colors.lightgray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    }
})
