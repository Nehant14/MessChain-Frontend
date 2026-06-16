import React, { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlassCard, PrimaryButton, SectionTitle } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';
import { useFeedback } from '../../hooks/useFeedback';
import { palette } from '../../theme';

export default function FileFeedbackScreen() {
  const [starRating, setStarRating] = useState(4);
  const [mealWindow, setMealWindow] = useState('Lunch');

  const { sendFeedbackReport } = useFeedback();

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('FileFeedbackScreen must be used within a NetworkProvider');
  }
  const { processing, launchProcessing } = networkContext;

  const handleSubmit = () => {
    launchProcessing('send-feedback', async () => {
      await sendFeedbackReport(starRating, mealWindow);
    });
  };

  return (
    <View>
      <SectionTitle eyebrow="Web2 API" title="File feedback" />
      <GlassCard>
        <Text style={styles.ratingPrompt}>Tap to rate the latest meal service</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setStarRating(star)}
              style={({ pressed }) => [styles.starButton, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              <Feather
                name="star"
                size={22}
                color={star <= starRating ? '#facc15' : 'rgba(255,255,255,0.18)'}
              />
            </Pressable>
          ))}
        </View>
        <View style={styles.mealChips}>
          {['Breakfast', 'Lunch', 'Dinner'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setMealWindow(item)}
              style={[
                styles.mealChip,
                mealWindow === item && {
                  backgroundColor: 'rgba(16,185,129,0.18)',
                  borderColor: 'rgba(16,185,129,0.38)',
                },
              ]}
            >
              <Text style={styles.mealChipText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label="Send Feedback"
          icon="send"
          tone="violet"
          onPress={handleSubmit}
          loading={processing === 'send-feedback'}
        />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingPrompt: { color: palette.text, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  starRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  starButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChips: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  mealChip: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChipText: { color: palette.text, fontWeight: '700', fontSize: 12.5 },
});
