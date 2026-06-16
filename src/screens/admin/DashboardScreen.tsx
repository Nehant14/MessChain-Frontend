import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { adminKpis } from '../../data';
import { GlassCard, Pill, SectionTitle } from '../../components';
import { palette } from '../../theme';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const columns = width >= 980 ? 3 : width >= 720 ? 2 : 1;

  return (
    <View>
      <SectionTitle eyebrow="" title="Overview" />
      <View style={[styles.grid, { gap: 12 }]}>
        {adminKpis.map((item) => (
          <GlassCard
            key={item.label}
            style={[styles.metricCard, { width: columns === 1 ? '100%' : columns === 2 ? '48%' : '31.5%' }]}
          >
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={styles.metricValue}>{item.value}</Text>
            <Pill
              label={item.delta}
              tone={item.label.includes('Open') ? 'amber' : 'emerald'}
            />
          </GlassCard>
        ))}
      </View>
      <View style={[styles.grid, { gap: 12, marginTop: 14 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { minWidth: 0 },
  metricLabel: { color: palette.muted, fontSize: 12 },
  metricValue: { color: palette.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 8, marginBottom: 14 },
});
