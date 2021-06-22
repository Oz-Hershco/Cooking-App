import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Colors, FamilyFont, FontSize } from '../constants/styles';

const ActiveTimer = (props) => {

    const [isPlaying, setIsPlaying] = useState(true);

    // const triggerNotificationHandler = () => {
    //     Notifications.cancelAllScheduledNotificationsAsync();
    //     Notifications.scheduleNotificationAsync({
    //         content: {
    //             title: "⏰ Time's up!",
    //             body: "You can continue to the next step and get Cookin'"
    //         },
    //         trigger: {
    //             seconds: seconds + (minutes * 60) + (hours * 3600) /**/
    //         },
    //         sound: 'default'
    //     })
    // }
    // useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('blur', () => {
    //         props.navigation.goBack();
    //     });
    //     return unsubscribe;
    // }, []);

    return (
        <View style={styles.container}>
            <View style={styles.activeTimerContainer}>
                <CountdownCircleTimer
                    strokeWidth={8}
                    size={280}
                    isPlaying={isPlaying}
                    duration={props.duration}
                    colors={[[Colors.secondary, 0.3], [Colors.primary, 0.3], [Colors.accent, 0.3], [Colors.midgray, 0.1]]}
                    onComplete={() => {
                        console.log('ON_COMPLETE BEFORE RETURN')
                        return [false, 0]
                    }}
                >

                    {
                        ({ remainingTime, animatedColor }) => {
                            const hours = Math.floor(remainingTime / 3600)
                            const minutes = Math.floor((remainingTime % 3600) / 60)
                            const seconds = remainingTime % 60
                            return (
                                <Animated.Text
                                    style={{ ...styles.remainingTime, color: animatedColor }}>
                                    {`${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
                                </Animated.Text>
                            )
                        }
                    }
                </CountdownCircleTimer>
            </View>

            <View style={styles.stepsNavigationWrapper}>
                {
                    isPlaying ?
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                setIsPlaying(false);
                            }}>
                                <Text style={styles.pauseButton}>PAUSE</Text>
                            </TouchableWithoutFeedback>
                        ) :
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                setIsPlaying(true);
                            }}>
                                <Text style={styles.playButton}>PLAY</Text>
                            </TouchableWithoutFeedback>
                        )
                }

                <TouchableWithoutFeedback onPress={() => {
                    setIsPlaying(false);
                    props.navigation.pop(2);
                }}>
                    <Text style={styles.cancelButton}>CANCEL</Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default ActiveTimer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    activeTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingTime: {
        fontSize: 46,
    },
    stepsNavigationWrapper: {
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray
    },
    pauseButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.small,
        backgroundColor: Colors.gray,
        color: 'white',
        width: 120,
        paddingVertical: 12,
        borderRadius: 5,
        textAlign: 'center'
    },
    playButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.small,
        backgroundColor: Colors.secondary,
        color: 'white',
        width: 120,
        paddingVertical: 12,
        borderRadius: 5,
        textAlign: 'center'
    },
    cancelButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.small,
        backgroundColor: Colors.accent,
        color: 'white',
        width: 120,
        paddingVertical: 12,
        borderRadius: 5,
        textAlign: 'center'
    },
})
