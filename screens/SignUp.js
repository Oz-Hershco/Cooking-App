import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, TextInput, Image } from 'react-native'
import BasicHeader from '../components/BasicHeader'
import { validateEmail } from '../constants/functions';

import { Colors, FamilyFont, FontSize } from '../constants/styles';
import { startEmailPasswordSignUp } from '../firebase/auth';

const SignUp = (props) => {

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

                <View>
                    <View style={styles.inputsContainer}>
                        <Text style={styles.inputLabel}>Let's start with your email</Text>
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
                    </View>
                    <View style={styles.inputsContainer}>
                        <Text style={styles.inputLabel}>...and wrap it up with a password</Text>
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
                    </View>
                </View>

                {
                    validateEmail(email) && password.length ?
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                startEmailPasswordSignUp(email, password);
                                // props.onNavigate(4);//recipe cooking screen
                            }}>
                                <Text style={styles.signUpButton}>SIGN UP</Text>
                            </TouchableWithoutFeedback>
                        ) :
                        (
                            <Text style={styles.disabledSignUpButton}>SIGN UP</Text>
                        )
                }


            </View>
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    body: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 40
    },
    inputsContainer: {
        marginBottom: 40
    },
    inputLabel: {
        fontSize: FontSize.normal,
        fontFamily: FamilyFont.HeeboMedium,
        marginBottom: 10
    },
    emailInputWrapper: {
        flexDirection: 'row',
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.gray,
        backgroundColor: Colors.lightgray,
        borderWidth: .5,
        borderTopWidth: 0,
        borderRadius: 5,
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
    signUpButton: {
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
    disabledSignUpButton: {
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
