import { firebase, usersCollection } from './firebase';

export const startEmailPasswordSignUp = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        console.log("created user successfully")
        var user = firebase.auth().currentUser;
        var uuid = user.uid;

        usersCollection.doc(uuid).set({
            uid: uuid,
            email: user.email,
            likedRecipes:[]
        }).then(function () {
                console.log("User successfully written in db collection!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

export const startEmailPasswordSignIn = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

export const startLogout = () => {
    return firebase.auth().signOut();
}



