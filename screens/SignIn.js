import React from 'react'
import { StyleSheet, Text, Image, Button, TextInput, View, TouchableWithoutFeedback } from 'react-native'
import BasicHeader from '../components/BasicHeader'
import { validateEmail } from '../constants/functions';

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const SignIn = (props) => {

    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    const [icon, setIcon] = React.useState("eye");
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);

    const handlePasswordShowHide = () => {
        setIcon(icon === 'eye' ? 'eye-off' : 'eye');
        setIsPasswordHidden(!isPasswordHidden);
    }

    return (
        <View style={styles.container}>
            <View style={styles.body}>

                <View style={styles.inputsContainer}>
                    <View style={styles.emailInputWrapper}>
                        <TextInput
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={text => onChangeEmail(text)}
                            value={email}
                        />
                    </View>
                    <View style={styles.passwordInputWrapper}>
                        <TextInput
                            secureTextEntry={isPasswordHidden}
                            textContentType="password"
                            placeholder="Password"
                            style={styles.input}
                            onChangeText={text => onChangePassword(text)}
                            value={password}
                        />
                        <TouchableWithoutFeedback onPress={() => {
                            handlePasswordShowHide();
                        }}>
                            <Image style={styles.eye} source={icon === 'eye' ? require('../assets/images/eye-off-icon.png') : require('../assets/images/eye-icon.png')} />
                        </TouchableWithoutFeedback>
                    </View>

                    {
                        validateEmail(email) && password.length ?
                            (
                                <TouchableWithoutFeedback onPress={() => {
                                    props.onSignIn(email, password);
                                }}>
                                    <Text style={styles.signInButton}>SIGN IN</Text>
                                </TouchableWithoutFeedback>
                            ) :
                            (
                                <Text style={styles.disabledSignInButton}>SIGN IN</Text>
                            )
                    }


                    <TouchableWithoutFeedback onPress={() => {
                        // props.onNavigate(4);//recipe cooking screen
                    }}>
                        <Text style={styles.forgotPasswordButton}>FORGOT PASSWORD</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>

        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    body: {
        paddingHorizontal: 30
    },
    inputsContainer: {
        marginTop: 20,
    },
    emailInputWrapper: {
        flexDirection: 'row',
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 10
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderTopWidth: 0,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        paddingHorizontal: 10
    },
    input: {
        flex: 1,
        height: 50,
    },
    eye: {
        height: 18,
        width: 30,
        resizeMode: 'contain',
    },
    signInButton: {
        textAlign: "center",
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        color: 'white',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    disabledSignInButton: {
        textAlign: "center",
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.normal,
        color: Colors.gray,
        backgroundColor: Colors.midgray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    forgotPasswordButton: {
        textAlign: "center",
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.small,
        color: Colors.primaryLight,
        marginTop: 20,
    }
})
