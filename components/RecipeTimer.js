import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import * as Notifications from 'expo-notifications';

import { Colors, FamilyFont, FontSize } from '../constants/styles';

const RecipeTimer = (props) => {

    const [endTime, setEndTime] = useState(moment(new Date()).add(props.timer.second + (props.timer.minute * 60) + (props.timer.hour * 3600), 's'));
    const [timer, setTimer] = useState(null);
    const [isTimerActive, setisTimerActive] = useState(false);
    let [eventDate, setEventDate] = useState(moment.duration().add({ hours: props.timer.hour, minutes: props.timer.minute, seconds: props.timer.second }));
    const [hours, setHours] = useState(props.timer.hour);
    const [minutes, setMinutes] = useState(props.timer.minute);
    const [seconds, setSeconds] = useState(props.timer.second);

    const updateTimer = () => {

        triggerNotificationHandler();
        setisTimerActive(true);
        setTimer(setInterval(() => {

            if (eventDate <= 0) {
                clearInterval(timer);
                setisTimerActive(false);
            } else {
                // var startTime = new Date();
                // var endOfTimer = moment(startTime).add(seconds + (minutes * 60) + (hours * 3600), 's');
                // setEndTime(endOfTimer);
                // var remainingTime = moment.duration(endTime.diff(startTime)).asSeconds();
                // console.log(remainingTime)
                eventDate = eventDate.subtract(1, "s")
                const hours = eventDate.hours()
                const mins = eventDate.minutes()
                const secs = eventDate.seconds()

                setHours(hours);
                setMinutes(mins);
                setSeconds(secs);
                setEventDate(eventDate);
            }
        }, 1000));

    }

    const triggerNotificationHandler = () => {
        Notifications.cancelAllScheduledNotificationsAsync();
        Notifications.scheduleNotificationAsync({
            content: {
                title: "⏰ Time's up!",
                body: "You can continue to the next step and get Cookin'"
            },
            trigger: {
                seconds: seconds + (minutes * 60) + (hours * 3600) /**/
            },
            sound: 'default'
        })
    }

    useEffect(() => {
        return () => {
            clearInterval(timer)
            Notifications.cancelAllScheduledNotificationsAsync();
        }
    }, [])


    // var startTime = new Date();
    // var end = moment(startTime).add(seconds + (minutes * 60) + (hours * 3600), 's');
    // console.log("timeleft: ");
    // console.log(moment.duration(end.diff(startTime)).asSeconds());
    // console.log("endTime: ");
    // console.log(moment(startTime).add(seconds + (minutes * 60) + (hours * 3600), 's'));


    return (
        <View style={styles.stepTimerWrapper}>
            <View style={styles.stepTimerHeader}>
                <Image
                    style={styles.timeIcon}
                    source={require('../assets/images/time-gray-icon.png')}
                />
                <Text style={styles.stepTimerHeaderLabel}>STEP TIMER</Text>
            </View>
            <View style={styles.stepTimerContainer}>
                <Text style={styles.stepTimerLabel}>{moment({ hour: hours, minute: minutes, second: seconds }).format('HH:mm:ss')}</Text>
                <View style={styles.stepTimerControlsWrapper}>

                    {
                        isTimerActive ?
                            (
                                <View style={styles.stepTimerControlsWrapper}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        Notifications.cancelAllScheduledNotificationsAsync();
                                        clearInterval(timer);
                                        setisTimerActive(false);
                                    }}>
                                        <Image
                                            style={styles.timerControlsIcon}
                                            source={require('../assets/images/pause-icon.png')}
                                        />
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => {
                                        Notifications.cancelAllScheduledNotificationsAsync();
                                        triggerNotificationHandler();
                                        clearInterval(timer);
                                        eventDate = moment.duration().add({ hours: props.timer.hour, minutes: props.timer.minute, seconds: props.timer.second });
                                        const hours = eventDate.hours()
                                        const mins = eventDate.minutes()
                                        const secs = eventDate.seconds()
                                        setHours(hours);
                                        setMinutes(mins);
                                        setSeconds(secs);
                                        setEventDate(eventDate);
                                        setTimer(setInterval(() => {

                                            if (eventDate <= 0) {
                                                clearInterval(timer);
                                                setisTimerActive(false);
                                            } else {
                                                eventDate = eventDate.subtract(1, "s")
                                                const hours = eventDate.hours()
                                                const mins = eventDate.minutes()
                                                const secs = eventDate.seconds()

                                                setHours(hours);
                                                setMinutes(mins);
                                                setSeconds(secs);
                                                setEventDate(eventDate);
                                            }
                                        }, 1000));
                                    }}>
                                        <Image
                                            style={styles.timerControlsIcon}
                                            source={require('../assets/images/replay-icon.png')}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            ) :
                            (
                                <TouchableWithoutFeedback onPress={() => {
                                    updateTimer();
                                }}>
                                    <Image
                                        style={styles.timerControlsIcon}
                                        source={require('../assets/images/play-icon.png')}
                                    />
                                </TouchableWithoutFeedback>
                            )
                    }

                </View>
            </View>
        </View>
    )
}

export default RecipeTimer

const styles = StyleSheet.create({
    stepTimerWrapper: {
        marginVertical: 20
    },
    stepTimerHeader: {
        flexDirection: 'row'
    },
    timeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 5
    },
    stepTimerHeaderLabel: {
        fontFamily: FamilyFont.HeeboBold,
        fontSize: FontSize.tiny,
        color: Colors.gray,
    },
    stepTimerContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    stepTimerLabel: {
        fontFamily: FamilyFont.HeeboRegular,
        fontSize: FontSize.xxl,
        color: Colors.black,
    },
    stepTimerControlsWrapper: {
        flexDirection: 'row'
    },
    timerControlsIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginLeft: 15
    },
})
