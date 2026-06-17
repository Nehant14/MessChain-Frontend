import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, LockClockIcon, SectionTitle } from '../../components';
import { studentLogs } from '../../data';
import { palette } from '../../theme';

export default function LogsScreen() {
  return (
    <View>
      <SectionTitle eyebrow="Staff" title="Daily logs" />
      {studentLogs.map((item, index) => (
        // Replaced non-unique item.title key with an indexed composite key to prevent state cross-contamination
        <GlassCard key={`${item.title}-${index}`} style={{ marginBottom: 12 }}>
          <View style={styles.lockStrip}>
            <LockClockIcon />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockStripTitle}>{item.title}</Text>
              <Text style={styles.lockStripBody}>{item.details}</Text>
            </View>
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lockStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.16)', marginTop: 6 },
  lockStripTitle: { color: palette.text, fontSize: 15, fontWeight: '800' },
  lockStripBody: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
});