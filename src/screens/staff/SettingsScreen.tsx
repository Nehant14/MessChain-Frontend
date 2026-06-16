import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, SectionTitle, ToggleRow } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';

export default function SettingsScreen() {
  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('SettingsScreen must be used within a NetworkProvider');
  }
  const { network, setNetwork } = networkContext;

  return (
    <View>
      <SectionTitle eyebrow="Staff" title="Preferences" />
      <GlassCard>
        <ToggleRow
          label="Hyperledger theme"
          description="Switch the shared shell copy and badge accents to consortium mode."
          value={network === 'hyperledger'}
          onChange={(value) => setNetwork(value ? 'hyperledger' : 'polygon')}
        />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({});
