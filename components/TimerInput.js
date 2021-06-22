import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/styles';
import ScrollingItem from './ScrollingItem';


export default function TimerInput(props) {
    return (
        <View style={styles.container}>
            <ScrollingItem
                dataSource={props.dataSource}
                selectedIndex={0}
                renderItem={(data, index, isSelected) => {
                    //
                }}
                onValueChange={(data, selectedIndex) => {
                    //
                    props.onChange(parseInt(data));
                }}
                wrapperHeight={80}
                wrapperWidth={90}
                wrapperBackground={'white'}
                itemHeight={60}
                highlightColor={Colors.primary}
                highlightBorderWidth={2}
                activeItemTextStyle={styles.activeItemTextStyle}
                itemTextStyle={styles.itemTextStyle}
                itemColor={'#B4B4B4'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeItemTextStyle: {
        fontSize: 30,
        lineHeight: 30,
        textAlign: 'center',
        color: Colors.black
    },
    itemTextStyle: {
        fontSize: 30,
        lineHeight: 30,
        textAlign: 'center',
        color: Colors.midgray
    }
})