import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard, Pill, PrimaryButton, SectionTitle, TextField } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';
import { useComplaints } from '../../hooks/useComplaints';
import { palette } from '../../theme';

export default function FileComplaintScreen() {
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintBody, setComplaintBody] = useState('');
  const [attachment, setAttachment] = useState('Receipt.png');

  const { fileComplaint } = useComplaints();

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('FileComplaintScreen must be used within a NetworkProvider');
  }
  const { processing, launchProcessing } = networkContext;

  const handleSubmit = () => {
    launchProcessing('submit-complaint', async () => {
      await fileComplaint(complaintTitle, complaintBody, attachment);
      setComplaintTitle('');
      setComplaintBody('');
    });
  };

  return (
    <View>
      <SectionTitle eyebrow="Web2 API" title="File a complaint" />
      <GlassCard>
        <TextField
          label="Complaint subject"
          placeholder="Service delay, food quality, or facility issue"
          value={complaintTitle}
          onChangeText={setComplaintTitle}
        />
        <TextField
          label="Describe the issue"
          placeholder="Explain what happened in a concise way."
          value={complaintBody}
          onChangeText={setComplaintBody}
          multiline
          rows={5}
        />
        <View style={styles.attachCard}>
          <Feather name="paperclip" size={18} color={palette.text} />
          <View style={{ flex: 1 }}>
            <Text style={styles.attachTitle}>Attachment preview</Text>
            <Text style={styles.attachSub}>
              {attachment} • characters used {complaintBody.length}/320
            </Text>
          </View>
        </View>
        <View style={styles.inlineActions}>
          <PrimaryButton
            label="Submit Complaint"
            icon="send"
            tone="emerald"
            onPress={handleSubmit}
            loading={processing === 'submit-complaint'}
          />
          <Pill label="Draft auto-saved" tone="indigo" icon="save" />
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  attachCard: { marginBottom: 16, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  attachTitle: { color: palette.text, fontSize: 13.5, fontWeight: '800' },
  attachSub: { color: palette.muted, fontSize: 12, marginTop: 3 },
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
});
