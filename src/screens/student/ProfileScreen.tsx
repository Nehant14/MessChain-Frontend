import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, Pill, ReceiptBadge, SectionTitle, SkeletonBlock } from '../../components';
import { useStudent } from '../../hooks/useStudent';
import { palette } from '../../theme';

export default function ProfileScreen() {
  const { profile, loading } = useStudent();

  if (loading || !profile) {
    return renderSkeletonFeed('Profile', 3);
  }

  return (
    <View>
      <SectionTitle eyebrow="Hybrid Layer" title="Student profile" />
      <GlassCard>
        <View style={styles.profileHead}>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSub}>
              {profile.role} • {profile.passStatus} • {profile.walletStatus}
            </Text>
          </View>
          <Pill label="Verified" tone="emerald" icon="check-circle" />
        </View>
        <View style={styles.profileStats}>
          <ReceiptBadge label="Identity score" value={profile.score} />
          <ReceiptBadge label="On-chain logs" value={profile.logsCount} />
          <ReceiptBadge label="Sync health" value={profile.sync} />
        </View>
        <View style={styles.timeline}>
          {profile.timeline.map((item: any) => (
            <View key={item.title} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listBody}>{item.details}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>
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
  profileHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarRing: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileName: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileSub: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
  profileStats: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10, flexWrap: 'wrap' },
  timeline: { marginTop: 18 },
  timelineItem: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  timelineDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.emerald, marginTop: 6 },
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
});
