import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppInput from './AppInput';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';
import { formatDate, isValidISODate, parseISODate, toISODate } from '../../utils/dateUtils';

export default function DateField({ label, value, onChange, error }){
    const { colors, isDark } = useTheme();
    const [open, setOpen] = useState(false);

    if(Platform.OS === 'web'){
        return(
            <AppInput 
                label={label}
                value={value}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                error={error}
            />
        )
    }

    const pickerValue = isValidISODate(value) ? parseISODate(value) : new Date();

    const handleChange = (event, selected) => {
        if(Platform.OS === 'android') setOpen(false);
        if(event.type === 'dismissed' || !selected) return;
        onChange(toISODate(selected));
    }

    const borderColor = error ? colors.danger : open ? colors.primary : colors.border;

    return(
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

            <Pressable
                onPress={() => setOpen((current) => !current)}
                style={[ styles.field, { backgroundColor: colors.inputBg, borderColor }]}
            >
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <Text style={[ styles.value, { color: value ? colors.text : colors.muted }]}>{ value ? formatDate(value) : 'Select a date' }</Text>
            </Pressable>

            {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

            {open ? (
                <View>
                    <DateTimePicker
                        value={pickerValue}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleChange}
                        themeVariant={isDark ? 'dark' : 'light'}
                    />
                    {Platform.OS === 'ios' ? (
                        <Pressable onPress={() =>  setOpen(false)} style={styles.done}>
                            <Text style={{ color: colors.primary, fontWeight: fontWeight.bold }}>Done</Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        marginBottom: spacing.sm,
    },
    field: {
        minHeight: 50,
        borderWidth: 1.5,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        marginLeft: spacing.md,
        fontSize: fontSize.md,
    },
    error: {
        fontSize: fontSize.xs,
        marginTop: spacing.xs,
        marginLeft: spacing.xs,
    },
    done: {
        alignSelf: 'flex-end',
        padding: spacing.md,
    },
})