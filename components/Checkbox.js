import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Checkbox = (props) => {
    const [checked, setChecked] = useState(false);

    const onCheck = () => {
        setChecked(!checked);
        var stepIngredients = props.ingredients.map((ingredient) => {

            if (ingredient.id === props.id) {
                ingredient.checked = !checked;
            }
            return {
                id: ingredient.id,
                checked: ingredient.checked,
                name: ingredient.name
            }
        })

        props.onCheck(stepIngredients);
    }

    useEffect(() => {
        setChecked(props.defaultChecked);
        return () => {
        }
    }, [])

    return (
        <TouchableWithoutFeedback onPress={onCheck}>
            <View style={[styles.checkboxContainer, props.checkboxContainerStyle]}>
                {
                    checked ?
                        (
                            <MaterialCommunityIcons name="checkbox-marked" size={props.checkboxSize ? props.checkboxSize : 24} color={props.checkedColor} />
                        ) :
                        (
                            <MaterialCommunityIcons name="checkbox-blank-outline" size={props.checkboxSize ? props.checkboxSize : 24} color={props.uncheckedColor} />
                        )
                }
                <Text style={[styles.checkboxLabel, props.checkboxLabelStyle]}>{props.label}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Checkbox

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: 5
    }
})
