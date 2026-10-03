import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, shadows, spacing } from '../../themes/layout';

const SIZE = 88;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressHero({ percent, completed, total, todayCount, overdue }) {
    const { colors } = useTheme();

    const filled = (CIRCUMFERENCE * percent) / 100;

    const headline = total === 0 ? 'No tasks yet' : `${completed} of ${total} tasks done`;
    const subline = 
        overdue > 0
            ? `${overdue} overdue · ${todayCount} active today`
            : `${todayCount} ${todayCount === 1 ? 'task' : 'tasks'} active today`;

    return(
        <LinearGradient
            colors={[colors.heroStart, colors.heroEnd]}
            start={{ x: 0, y: 0}}
            end={{ x: 1, y: 1 }}
            style={[ styles.hero, shadows.lifted]}
        >
            <View style={styles.bubble}/>

            <View style={styles.ringWrap}>
                <Svg width={SIZE} height={SIZE}>
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={STROKE}
                    fill="none"
                />
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#FFFFFF"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
                </Svg>
                <Text style={styles.percent}>{percent}%</Text>
            </View>

            <View style={styles.texts}>
                <Text style={styles.small}>Overall progress</Text>
                <Text style={styles.headline}>{headline}</Text>
                <Text style={styles.small}>{subline}</Text>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    right: -30,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
  },
  texts: { flex: 1, marginLeft: spacing.lg },
  headline: {
    color: '#FFFFFF',
    fontSize: fontSize.xl - 2,
    fontWeight: fontWeight.heavy,
    marginVertical: 2,
  },
  small: { color: 'rgba(255,255,255,0.85)', fontSize: fontSize.sm },
});