import React, { useContext } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { GlassCard, MetricRing, SectionTitle } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';
import { useFeedback } from '../../hooks/useFeedback';
import { palette } from '../../theme';

export default function FeedbackReportScreen() {
  const { width } = useWindowDimensions();
  const columns = width >= 980 ? 3 : width >= 720 ? 2 : 1;

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('FeedbackReportScreen must be used within a NetworkProvider');
  }
  const { network } = networkContext;
  const { feedbackBars } = useFeedback();

  return (
    <View>
      <SectionTitle eyebrow="Analytics" title="Feedback report" />
      <View style={[styles.grid, { gap: 12 }]}>
        <GlassCard style={[styles.reportCard, { width: columns === 1 ? '100%' : '48%' }]}>
          <MetricRing
            value={92}
            label="Average score"
            accent={network === 'polygon' ? palette.emerald : palette.violet}
          />
        </GlassCard>
        <GlassCard style={[styles.reportCard, { width: columns === 1 ? '100%' : '48%' }]}>
          <Text style={styles.chartTitle}>Meal ratings</Text>
          {feedbackBars.map((bar) => (
            <View key={bar.label} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{bar.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${bar.value}%`, backgroundColor: bar.color }]} />
              </View>
              <Text style={styles.chartValue}>{bar.value}%</Text>
            </View>
          ))}
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  reportCard: { minHeight: 280 },
  chartTitle: { color: palette.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  chartRow: { marginBottom: 10 },
  chartLabel: { color: palette.muted, fontSize: 12, marginBottom: 6 },
  barTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  chartValue: { color: palette.text, fontSize: 12, marginTop: 6, fontWeight: '700' },
});
