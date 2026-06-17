import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, LockClockIcon, Pill, PrimaryButton, ReceiptBadge, SectionTitle } from '../../components';
import { useRebates } from '../../hooks/useRebates';
import { NetworkContext } from '../../context/NetworkContext';
import { palette } from '../../theme';

export default function RebatesScreen() {
  const { rebates, countdownText, triggerApprove, triggerDeny } = useRebates();

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('RebatesScreen must be used within a NetworkProvider');
  }
  const { processing } = networkContext;

  return (
    <View>
      <SectionTitle eyebrow="" title="Rebates ledger" />
      {rebates.map((claim) => (
        <GlassCard key={claim.id} style={{ marginBottom: 12 }}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.listTitle}>
                {claim.student ? `${claim.student.slice(0, 8)}...${claim.student.slice(-6)}` : 'Unknown Student'}
              </Text>
              {/* CHANGED: Provided fallback text value string for on-chain entries lacking context reasons */}
              <Text style={styles.listBody}>{claim.reason || 'Leave of absence / Mess rebate claim request'}</Text>
            </View>
            <Text style={styles.amountText}>{claim.amount} tokens</Text>
          </View>
          <View style={styles.lockStrip}>
            <LockClockIcon />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockStripTitle}>Time lock active</Text>
              <Text style={styles.lockStripBody}>
                {claim.lock || 'Standard Protocol'} • receipt #{claim.id} • {countdownText}
              </Text>
            </View>
          </View>
          <View style={styles.hashRow}>
            {/* Added defensive guard checks to protect string slice evaluations against undefined structures */}
            <ReceiptBadge
              label="Settlement hash"
              value={claim.hash ? `${claim.hash.slice(0, 10)}...${claim.hash.slice(-8)}` : 'Pending Blockchain Tx'}
            />
            <Pill label={claim.status || 'Unprocessed'} tone="indigo" icon="shield" />
          </View>
          <View style={styles.inlineActions}>
            <PrimaryButton
              label="Approve"
              icon="check"
              tone="emerald"
              onPress={() => triggerApprove(claim.id)}
              loading={processing === `rebate-${claim.id}`}
            />
            <PrimaryButton
              label="Deny"
              icon="x"
              tone="red"
              onPress={() => triggerDeny(claim.id)}
              loading={processing === `deny-${claim.id}`}
              danger
            />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  amountText: { color: palette.text, fontSize: 24, fontWeight: '900' },
  lockStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.16)', marginTop: 6 },
  lockStripTitle: { color: palette.text, fontSize: 15, fontWeight: '800' },
  lockStripBody: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
  hashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
});