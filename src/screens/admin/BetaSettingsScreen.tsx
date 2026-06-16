import React, { useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard, Pill, SectionTitle } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';
import { palette } from '../../theme';

export default function BetaSettingsScreen() {
  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('BetaSettingsScreen must be used within a NetworkProvider');
  }
  const { network, setNetwork, currentNetwork } = networkContext;

  return (
    <View>
      <SectionTitle
        eyebrow="Experimental"
        title="Beta / Sandbox control area"
        subtitle="A safety-hazard border treatment for pending architecture routes and ecosystem switching."
      />
      <GlassCard style={styles.betaCard}>
        <View style={styles.betaHeader}>
          <Feather name="alert-triangle" size={22} color={palette.warning} />
          <Text style={styles.betaTitle}>Sandbox operations</Text>
        </View>
        <Text style={styles.betaCopy}>
          This lane is intentionally isolated. It lets the product swap ecosystem naming, badge markers,
          and header layout between Polygon and Hyperledger while the rest of the shell stays stable.
        </Text>
        <View style={styles.networkChooser}>
          <Pressable
            style={[styles.networkCard, network === 'polygon' && { borderColor: '#10b981' }]}
            onPress={() => setNetwork('polygon')}
          >
            <Text style={styles.networkCardLabel}>Polygon</Text>
            <Text style={styles.networkCardSub}>EVM settlement</Text>
          </Pressable>
          <Pressable
            style={[styles.networkCard, network === 'hyperledger' && { borderColor: '#7c3aed' }]}
            onPress={() => setNetwork('hyperledger')}
          >
            <Text style={styles.networkCardLabel}>Hyperledger</Text>
            <Text style={styles.networkCardSub}>Consortium mode</Text>
          </Pressable>
        </View>
        <Pill
          label={currentNetwork.label}
          tone={network === 'polygon' ? 'emerald' : 'violet'}
          icon="settings"
        />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  betaCard: { borderStyle: 'solid', borderColor: 'rgba(250,204,21,0.32)' },
  betaHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  betaTitle: { color: palette.text, fontSize: 18, fontWeight: '900' },
  betaCopy: { color: palette.muted, lineHeight: 21, fontSize: 13, marginBottom: 14 },
  networkChooser: { flexDirection: 'row', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  networkCard: { flex: 1, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  networkCardLabel: { color: palette.text, fontWeight: '800', fontSize: 14 },
  networkCardSub: { color: palette.muted, fontSize: 12, marginTop: 5 },
});
