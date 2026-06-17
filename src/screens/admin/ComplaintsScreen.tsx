import React, { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard, Pill, PrimaryButton, ReceiptBadge, SectionTitle, SkeletonBlock, copyToClipboard } from '../../components';
import { useComplaints } from '../../hooks/useComplaints';
import { NetworkContext } from '../../context/NetworkContext';
import { palette } from '../../theme';

export default function ComplaintsScreen() {
  const { complaints, loading, resolveComplaint } = useComplaints();
  const [revealComplaint, setRevealComplaint] = useState<string | null>(null);

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('ComplaintsScreen must be used within a NetworkProvider');
  }
  const { processing, launchProcessing } = networkContext;

  const handleChangeResolution = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Resolved' ? 'Needs review' : 'Resolved';
    launchProcessing(`complaint-${id}`, async () => {
      await resolveComplaint(id, nextStatus);
    });
  };

  if (loading) {
    return renderSkeletonFeed('Complaint feed', 4);
  }

  return (
    <View>
      <SectionTitle eyebrow="Web2 API" title="Complaint feed" />
      {complaints.map((item) => {
        const expanded = revealComplaint === item.id;
        return (
          <GlassCard key={item.id} style={{ marginBottom: 12 }}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>Complaint #{item.id}</Text>
                {/* CHANGED: Fallback reference if title is missing from raw blockchain/IPFS text output */}
                <Text style={styles.listBody}>{item.title || 'System Complaint Log'}</Text>
              </View>
              <Pill
                label={item.urgency || 'Normal'}
                tone={item.urgency === 'High' ? 'red' : 'amber'}
                icon="alert-triangle"
              />
            </View>
            <Pressable
              onPress={() => setRevealComplaint(expanded ? null : item.id)}
              style={styles.expandRow}
            >
              {/* CHANGED: Replaced item.body with item.content to read the fetched text string from your backend IPFS resolution mapping */}
              <Text style={styles.expandText}>
                {expanded ? item.content : `${item.content?.slice(0, 110) || ''}...`}
              </Text>
              <Feather
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={palette.muted}
              />
            </Pressable>
            <View style={styles.hashRow}>
              {/* CHANGED: Linked item.ipfs target references to item.cid property matching backend response key */}
              <ReceiptBadge
                label="IPFS hash"
                value={item.cid ? `${item.cid.slice(0, 10)}...${item.cid.slice(-8)}` : 'No CID'}
              />
              <PrimaryButton
                label="Copy"
                icon="copy"
                tone="violet"
                onPress={() => copyToClipboard(item.cid || '')}
              />
            </View>
            <View style={styles.inlineActions}>
              <Pill
                label={item.status || 'Pending'}
                tone={item.status === 'Resolved' ? 'emerald' : 'indigo'}
                icon="check-circle"
              />
              <Pressable
                style={styles.selectChip}
                onPress={() => handleChangeResolution(item.id, item.status)}
              >
                <Text style={styles.selectChipText}>Change resolution</Text>
                {processing === `complaint-${item.id}` ? (
                  <Feather name="loader" size={14} color={palette.text} />
                ) : (
                  <Feather name="chevron-down" size={14} color={palette.text} />
                )}
              </Pressable>
            </View>
          </GlassCard>
        );
      })}
    </View>
  );
}

function renderSkeletonFeed(title: string, blocks: number) {
  return (
    <View>
      <SectionTitle eyebrow="" title={title} />
      {[...Array(blocks)].map((_, index) => (
        <GlassCard key={index} style={{ marginBottom: 12 }}>
          <SkeletonBlock height={18} width="62%" />
          <View style={{ height: 12 }} />
          <SkeletonBlock height={14} width="92%" />
          <View style={{ height: 8 }} />
          <SkeletonBlock height={14} width="78%" />
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  expandRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  expandText: { flex: 1, color: palette.muted, lineHeight: 20, fontSize: 13 },
  hashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  selectChip: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectChipText: { color: palette.text, fontSize: 12.5, fontWeight: '700' },
});