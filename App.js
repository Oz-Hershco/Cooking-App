import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import { StyleSheet, ActivityIndicator, View, LogBox, Image } from 'react-native';

import { startLogout, startEmailPasswordSignIn } from './firebase/auth';
import { firebase, recipesCollection, usersCollection, storage } from './firebase/firebase';
import { Colors } from './constants/styles';

import Header from './components/Header';
import Recipes from './screens/Recipes';
import RecipesList from './screens/RecipesList';
import Recipe from './screens/Recipe';
import RecipeCooking from './screens/RecipeCooking';
import Favorites from './screens/Favorites';
import Welcome from './screens/Welcome';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import MyRecipes from './screens/MyRecipes';
import CreateRecipe from './screens/CreateRecipe';
import Timers from './screens/Timers';
import ActiveTimer from './screens/ActiveTimer';
import RecipesHeader from './components/RecipesHeader';
import RecipeHeader from './components/RecipeHeader';
import RecipeCookingHeader from './components/RecipeCookingHeader';

export default function App() {

  LogBox.ignoreAllLogs();


  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentTimerDuration, setCurrentTimerDuration] = useState(0);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [editableRecipe, setEditableRecipe] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedRecipeTypeCard, setSelectedRecipeTypeCard] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  useEffect(() => {


    _loadFontsAsync();

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // var displayName = user.displayName;
        recipesCollection.get().then(function (querySnapshot) {
          var db = [];
          querySnapshot.forEach(function (doc) {
            db.push(doc.data());
          });
          // console.log("DBBBB:")
          // console.log(db)
          setRecipes(db);

          usersCollection.doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
              var data = doc.data();
              var likedRecipesArr = [];
              var myPublicRecipes = [];
              var myPrivateRecipes = data?.myRecipes?.length ? data.myRecipes : [];
              db.forEach(recipe => {
                data?.likedRecipe?.forEach(likedRecipe => {
                  if (recipe.id === likedRecipe.id) {
                    likedRecipesArr.push(recipe);
                  }
                });
                if (recipe?.author?.uid === user.uid) {
                  myPublicRecipes.push(recipe)
                }
              });
              // console.log(myPublicRecipes)
              user.likedRecipes = data.likedRecipes;
              user.myRecipes = myPrivateRecipes;
              setUser(user);
              setLikedRecipes(likedRecipesArr);
              setMyRecipes(myPublicRecipes.length ? [...myPublicRecipes, ...myPrivateRecipes] : myPrivateRecipes);
              setIsLoading(false);

            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              setIsLoading(false);
            }
          }).catch(function (error) {
            console.log("Error getting document:", error);
            setIsLoading(false);

          });
        });
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // ...
        console.log("signed in");
      } else {
        // User is signed out.
        // ...
        console.log("signed out");
        setIsLoading(false);
      }
    });

  }, [])



  const _loadFontsAsync = async () => {
    try {
      await Font.loadAsync({
        HeeboBlack: require('./assets/fonts/Heebo-Black.ttf'),
        HeeboBold: require('./assets/fonts/Heebo-Bold.ttf'),
        HeeboExtraBold: require('./assets/fonts/Heebo-ExtraBold.ttf'),
        HeeboLight: require('./assets/fonts/Heebo-Light.ttf'),
        HeeboMedium: require('./assets/fonts/Heebo-Medium.ttf'),
        HeeboRegular: require('./assets/fonts/Heebo-Regular.ttf'),
        HeeboThin: require('./assets/fonts/Heebo-Thin.ttf'),
      });
    } catch (e) {
      console.log(e)
    }
    setFontsLoaded(true);
  }

  const handleMyRecipeRemoval = (recipeId, recipe, navigation) => {
    setIsLoading(true);
    var newMyRecipesArr = myRecipes.filter(myrecipe => myrecipe.id !== recipeId);
    usersCollection.doc(user.uid).update({ myRecipes: newMyRecipesArr.filter(recipe => recipe.private) })
      .then(function () {
        console.log("Finished removing my recipe from firebase db.");
        navigation.navigate('MyRecipes');
        setMyRecipes([...newMyRecipesArr]);
        setIsLoading(false);

        var storageRef = storage.ref();
        // Create a reference to the file to delete
        var imageFileRef = storageRef.child('images/recipes/' + recipe.thumbnail.id);

        // Delete the file
        imageFileRef.delete().then(function () {
          // File deleted successfully
          Toast.show("Recipe Deleted");
        }).catch(function (error) {
          // Uh-oh, an error occurred!
        });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        setIsLoading(false);
      });
  }

  const handleMyRecipeEdit = (recipe, navigation) => {
    setEditableRecipe(recipe);
    navigation.navigate('CreateRecipe');
  }

  const handleMyRecipePublish = (recipe) => {

    setIsLoading(true);
    recipe.private = false;
    recipes.push(recipe);

    recipesCollection.doc(recipe.id).set(recipe)
      .then(function () {
        console.log("Finished adding my new recipe to firebase db.");
        setRecipes([...recipes]);
        var newMyRecipesArr = myRecipes.filter(myrecipe => myrecipe.id !== recipe.id);

        usersCollection.doc(user.uid).update({ myRecipes: newMyRecipesArr })
          .then(function () {
            console.log("Finished removing my recipe from firebase db.");
            setIsLoading(false);
            Toast.show("Recipe Published");
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
            setIsLoading(false);
          });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        setIsLoading(false);
      });
  }

  const WelcomeStack = createStackNavigator();

  const WelcomeStackScreen = () => {
    return (
      <WelcomeStack.Navigator initialRouteName="Welcome">
        <WelcomeStack.Screen name="Welcome"
          options={{
            headerShown: false,
          }}
        >
          {props => <Welcome  {...props} />}
        </WelcomeStack.Screen>
        <WelcomeStack.Screen name="Sign In"
          options={{
            title: "Enter Details",
          }}
        >
          {props => <SignIn  {...props} onSignIn={handleSignIn} />}
        </WelcomeStack.Screen>
        <WelcomeStack.Screen name="Sign Up"
          options={{
            title: "Create Details",
          }}
        >
          {props => <SignUp  {...props} />}
        </WelcomeStack.Screen>
      </WelcomeStack.Navigator>
    )
  }

  const AppTab = createBottomTabNavigator();

  const handleSignOut = () => {
    startLogout();
    setUser(null);
  }

  const handleSignIn = (email, password) => {
    setIsLoading(true);
    startEmailPasswordSignIn(email, password);
  }

  const AppTabs = () => {
    return (
      <AppTab.Navigator
        screenOptions={({ route }) => ({

          tabBarIcon: ({ focused, color, size }) => {
            let imgSrc;

            if (route.name === 'Discover') {
              imgSrc = focused
                ? require('./assets/images/explore-nav-active-icon.png')
                : require('./assets/images/explore-nav-icon.png');
            } else if (route.name === 'MyRecipes') {
              imgSrc = focused
                ? require('./assets/images/recipes-nav-active-icon.png')
                : require('./assets/images/recipes-nav-icon.png');
            } else if (route.name === 'LikedRecipes') {
              imgSrc = focused
                ? require('./assets/images/favorites-nav-active-icon.png')
                : require('./assets/images/favorites-nav-icon.png');
            }

            // You can return any component that you like here!
            return <Image
              fadeDuration={0}
              style={styles.navItemIcon}
              source={imgSrc}
            />;
          },
        })}
        tabBarOptions={{
          activeTintColor: Colors.secondary,
          inactiveTintColor: Colors.gray,
          style: styles.navItemsContainer,
          tabStyle: styles.navItem,
        }}
      >

        <AppTab.Screen name="Discover" options={{ title: 'Explore' }}>
          {props => <Recipes {...props} setSelectedRecipeTypeCard={setSelectedRecipeTypeCard} recipes={recipes} />}
        </AppTab.Screen>
        <AppTab.Screen name="MyRecipes" options={{ title: 'My Recipes' }}  >
          {props => <MyRecipes {...props} recipes={myRecipes} setSelectedRecipe={setSelectedRecipe} />}
        </AppTab.Screen>
        <AppTab.Screen name="LikedRecipes" options={{ title: 'Liked Recipes' }}>
          {props => <Favorites  {...props} recipes={likedRecipes} setSelectedRecipe={setSelectedRecipe} />}
        </AppTab.Screen>

      </AppTab.Navigator>
    )
  }

  const AppStack = createStackNavigator();



  const AppScreens = () => {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />

        <AppStack.Navigator
          screenOptions={{
            headerTintColor: Colors.gray,
          }}
        >
          <AppStack.Screen name="Discover" component={AppTabs} options={({ navigation }) => ({ headerTitle: props => <Header navigation={navigation} onLogout={handleSignOut} {...props} /> })} />

          <AppStack.Screen name="RecipesList" options={{ headerTitle: props => <RecipesHeader {...props} selectedRecipeTypeCard={selectedRecipeTypeCard} /> }}>
            {props => <RecipesList  {...props} selectedRecipeTypeCard={selectedRecipeTypeCard} recipes={recipes} setSelectedRecipe={setSelectedRecipe} />}
          </AppStack.Screen>

          <AppStack.Screen name="Recipe" options={({ navigation }) => ({ headerTitle: props => <RecipeHeader {...props} navigation={navigation} setIsLoading={setIsLoading} handleMyRecipeRemoval={handleMyRecipeRemoval} handleMyRecipeEdit={handleMyRecipeEdit} handleMyRecipePublish={handleMyRecipePublish} user={user} setUser={setUser} recipes={recipes} recipe={selectedRecipe} setRecipes={setRecipes} likedRecipes={likedRecipes} setLikedRecipes={setLikedRecipes} /> })} >
            {props => <Recipe  {...props} selectedRecipe={selectedRecipe} user={user} recipes={recipes} />}
          </AppStack.Screen>

          <AppStack.Screen name="RecipeCooking" options={({ navigation }) => ({ headerTitle: props => <RecipeCookingHeader {...props} navigation={navigation} /> })}>
            {props => <RecipeCooking  {...props} selectedRecipe={selectedRecipe} />}
          </AppStack.Screen>

          <AppStack.Screen name="CreateRecipe" options={{ title: editableRecipe ? "EDIT RECIPE" : "CREATE NEW RECIPE" }}>
            {props => <CreateRecipe {...props} user={user} myRecipes={myRecipes} setMyRecipes={setMyRecipes} user={user} editableRecipe={editableRecipe} setEditableRecipe={setEditableRecipe} />}
          </AppStack.Screen>

          <AppStack.Screen name="Timers" options={{ title: "Set Timer" }}>
            {props => <Timers  {...props} setCurrentTimerDuration={setCurrentTimerDuration} setEditableRecipe={setEditableRecipe} />}
          </AppStack.Screen>

          <AppStack.Screen name="ActiveTimer" options={{ title: "Active Timer" }}>
            {props => <ActiveTimer  {...props} duration={currentTimerDuration} setEditableRecipe={setEditableRecipe} />}
          </AppStack.Screen>

        </AppStack.Navigator>

      </View>
    )
  }

  return (
    <NavigationContainer>{
      // isLoading ? (
      //   <View style={styles.spinnerContainer}>
      //     <ActivityIndicator size="large" color={Colors.primary} />
      //   </View >
      // ) :
      //   (
      //     fontsLoaded ?
      //       (
      //         user && recipes.length ?
      //           (
      //             tabNavigatorList
      //           ) :
      //           (
      //             <WelcomeStackScreen />
      //           )


      //       ) :
      //       <View style={styles.spinnerContainer}>
      //         <ActivityIndicator size="large" color={Colors.primary} />
      //       </View >
      //   )
      fontsLoaded ?
        (
          isLoading ?
            (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View >
            ) :
            (
              user && recipes.length && !isLoading ?
                (
                  <AppScreens />
                ) :
                (
                  <WelcomeStackScreen />
                )
            )
        ) :
        (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View >
        )
    }</NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navItemsContainer: {
    height: 65,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navItem: {
    height: 45,
  },
  navItemIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain'
  },
});
