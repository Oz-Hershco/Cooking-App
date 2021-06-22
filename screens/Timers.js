import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import * as Notifications from 'expo-notifications';

import TimerInput from '../components/TimerInput'
import { Colors, FamilyFont, FontSize } from '../constants/styles'

const Timers = (props) => {

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [num, setNum] = useState(0);

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            })

        });
        Notifications.setNotificationCategoryAsync('daily_question', [
            {
                identifier: 'pause',
                buttonTitle: 'Pause',

            },
            {
                identifier: 'cancel',
                buttonTitle: 'Cancel',
            },
        ]);

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
            const actionType = response.actionIdentifier;

            switch (actionType) {
                case 'cancel':
                    Notifications.dismissAllNotificationsAsync();
                    break;
                case 'pause':
                    break;

                default:
                    break;
            }
        });
        return () => {
            subscription.remove();
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.timerInputContainer}>
                <View style={styles.timerInputItem}>
                    <Text style={styles.timerInputItemLabel}>Hours</Text>
                    <TimerInput dataSource={[...Array(24).keys()].map(x => x < 10 ? '0' + x : x)} onChange={setHours} />
                </View>
                <View style={styles.timerInputItem}>
                    <Text style={styles.timerInputItemLabel}>Minutes</Text>
                    <TimerInput dataSource={[...Array(60).keys()].map(x => x < 10 ? '0' + x : x)} onChange={setMinutes} />
                </View>
                <View style={styles.timerInputItem}>
                    <Text style={styles.timerInputItemLabel}>Seconds</Text>
                    <TimerInput dataSource={[...Array(60).keys()].map(x => x < 10 ? '0' + x : x)} onChange={setSeconds} />
                </View>
            </View>
            <View style={styles.startButtonWrapper}>
                {
                    parseInt(hours) || parseInt(minutes) || parseInt(seconds) ?
                        (
                            <TouchableWithoutFeedback onPress={() => {
                                props.setCurrentTimerDuration((parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds))
                                props.navigation.navigate('ActiveTimer');
                                Notifications.scheduleNotificationAsync({
                                    content: {
                                        categoryIdentifier: 'daily_question',
                                        title: 'Look at that notification',
                                        subtitle: 'Recipe Timer',
                                        body: "This how much we wait for this notification: " + num.toString(),
                                        data: { data: 'goes here' },
                                        sticky: true,
                                    },
                                    trigger: null,
                                }).then((e) => {
                                    console.log(e)
                                    setNum(num + 10)
                                });
                            }}>
                                <Text style={styles.startButton}>START</Text>
                            </TouchableWithoutFeedback>
                        ) :
                        (
                            <Text style={styles.disabledStartButton}>START</Text>
                        )
                }
            </View>
        </View>
    )
}

export default Timers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    timerInputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    timerInputItem: {
        alignItems: 'center'
    },
    timerInputItemLabel: {
        marginBottom: 10,
        color: Colors.gray
    },
    startButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: Colors.lightgray,
        paddingVertical: 20,
    },
    startButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.xl,
        color: 'white',
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    disabledStartButton: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.xl,
        color: Colors.midgray,
        backgroundColor: Colors.lightgray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    }
})
