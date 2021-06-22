import React from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native'
import { Colors, FamilyFont } from '../constants/styles';

const TypesPicker = (props) => {

    const handleTypeSelect = (tagid) => {
        props.types.forEach(tag => {
            if (tag.id === tagid) {
                tag.checked = !tag.checked;
            }
        });
        props.setTypes([...props.types]);
    }

    return (
        <View style={styles.categoryBody}>
            {
                props.types.map((category) => {
                    return (
                        <TouchableWithoutFeedback key={category.id} onPress={() => {
                            handleTypeSelect(category.id)
                        }}>
                            <View style={styles.categoryContainer}>
                                {
                                    category.checked ?
                                        (
                                            <View style={styles.activeCategoryCard}>
                                                <Image
                                                    style={styles.categoryIcon}
                                                    source={category.activeSrc}
                                                />
                                            </View>
                                        ) :
                                        (
                                            <View style={styles.categoryCard}>
                                                <Image
                                                    style={styles.categoryIcon}
                                                    source={category.src}
                                                />
                                            </View>
                                        )
                                }

                                {/* <Text style={styles.label}>{category.name + ` (${categoryRecipesCount})`}</Text> */}
                                <Text style={category.checked ? styles.activeCategoryLabel : styles.categoryLabel}>{category.name}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })
            }

        </View>
    )
}

export default TypesPicker

const styles = StyleSheet.create({
    categoryBody: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryCard: {
        backgroundColor: Colors.lightgray,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeCategoryCard: {
        backgroundColor: Colors.primary,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryIcon: {
        height: 35,
        width: 55,
        resizeMode: 'contain'
    },
    categoryLabel: {
        color: Colors.gray,
        fontFamily: FamilyFont.HeeboLight,
        marginTop: 5
    },
    activeCategoryLabel: {
        color: Colors.primary,
        fontFamily: FamilyFont.HeeboLight,
        marginTop: 5
    },
})
