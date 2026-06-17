import React, { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard, PrimaryButton, SectionTitle, TextField } from '../../components';
import { usePolls } from '../../hooks/usePolls';
import { NetworkContext } from '../../context/NetworkContext';
import { palette } from '../../theme';

export default function CreatePollScreen() {
  const [pollName, setPollName] = useState('Weekend menu preference');
  const [pollWindow, setPollWindow] = useState('Sat 7:00 PM - Sun 11:00 AM');

  const { pollOptions, addOption, createNewPoll } = usePolls();

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('CreatePollScreen must be used within a NetworkProvider');
  }
  const { processing, launchProcessing } = networkContext;

  const handleSchedulePoll = () => {
    launchProcessing('schedule-poll', async () => {
      await createNewPoll(pollName, pollWindow, pollOptions);
    });
  };

  return (
    <View>
      <SectionTitle
        eyebrow="Web2 API"
        title="Poll composer"
        subtitle="Dynamic options, rearrange-ready option cards, and a custom execution window card."
      />
      <GlassCard>
        <TextField
          label="Poll title"
          placeholder="Weekend menu preference"
          value={pollName}
          onChangeText={setPollName}
        />
        <View style={styles.windowCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Execution window</Text>
            <Text style={styles.windowTitle}>{pollWindow}</Text>
            <Text style={styles.windowSub}>Custom date-time selection card</Text>
          </View>
          <Feather name="calendar" size={22} color={palette.text} />
        </View>
        {pollOptions.map((option, index) => (
          <View key={`${option.label}-${index}`} style={styles.optionCard}>
            <Feather name="menu" size={18} color={palette.muted} />
            <Text style={styles.optionText}>{option.label}</Text>
            <Text style={styles.optionVote}>{option.votes}</Text>
          </View>
        ))}
        <View style={styles.inlineActions}>
          <Pressable style={styles.addOptionButton} onPress={addOption}>
            <Feather name="plus" size={16} color={palette.text} />
            <Text style={styles.addOptionText}>Add Option</Text>
          </Pressable>
          <PrimaryButton
            label="Schedule Poll"
            icon="send"
            tone="violet"
            onPress={handleSchedulePoll}
            loading={processing === 'schedule-poll'}
          />
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { color: '#d4d4d8', fontSize: 12, marginBottom: 8, fontWeight: '700' },
  windowCard: { marginBottom: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  windowTitle: { color: palette.text, fontSize: 15, fontWeight: '800', marginTop: 4 },
  windowSub: { color: palette.muted, fontSize: 12, marginTop: 4 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  optionText: { flex: 1, color: palette.text, fontWeight: '700' },
  optionVote: { color: palette.muted, fontWeight: '800' },
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  addOptionButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  addOptionText: { color: palette.text, fontWeight: '800', fontSize: 12.5 },
});