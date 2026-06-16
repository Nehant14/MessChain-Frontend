import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, SectionTitle } from '../../components';
import { palette } from '../../theme';

export default function InventoryScreen() {
  return (
    <View>
      <SectionTitle eyebrow="Staff" title="Inventory status" />
      <GlassCard>
        <Text style={styles.listTitle}>Kitchen stock</Text>
        <Text style={styles.listBody}>
          42 active ingredient buckets • 6 replenishment alerts • 99.2% ledger sync
        </Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
});
