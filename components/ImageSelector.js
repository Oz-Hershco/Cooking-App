import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, Platform } from 'react-native'
import { Colors, FamilyFont, FontSize } from '../constants/styles';

const ImageSelector = (props) => {

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            base64: false,
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            props.setImage(result.uri);
        }
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={pickImage}>
                {
                    props.image ?
                        (
                            <Image source={{ uri: props.image }} style={styles.thumbnail} />
                        ) :
                        (
                            <View style={styles.coverImageWrapper}>
                                <View style={styles.coverImageSelectWrapper}>
                                    <Text style={styles.uploadText}>SELECT COVER IMAGE</Text>
                                    <Image
                                        fadeDuration={0}
                                        style={styles.uploadIcon}
                                        source={require('../assets/images/upload-icon.png')}
                                    />
                                </View>
                            </View>
                        )
                }
            </TouchableWithoutFeedback>
        </View>
    )
}

export default ImageSelector

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 300,
        resizeMode: 'cover'
    },
    coverImageWrapper: {
        backgroundColor: Colors.lightgray,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    coverImageSelectWrapper: {
        flexDirection: 'row'
    },
    uploadIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
    },
    uploadText: {
        fontFamily: FamilyFont.HeeboMedium,
        fontSize: FontSize.normal,
        color: Colors.gray,
        marginRight: 10
    },
})
