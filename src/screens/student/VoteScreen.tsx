import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlassCard, Pill, SectionTitle } from '../../components';
import { usePolls } from '../../hooks/usePolls';
import { palette } from '../../theme';

export default function VoteScreen() {
  const { voteChoices, castVote } = usePolls();
  const [voteChoice, setVoteChoice] = useState<string | null>(null);

  const handleVote = async (choiceLabel: string) => {
    setVoteChoice(choiceLabel);
    await castVote(choiceLabel);
  };

  return (
    <View>
      <SectionTitle eyebrow="Web3 RPC" title="Vote on the next change" />
      {voteChoices.map((choice) => {
        const active = voteChoice === choice.label;
        const fill = active ? 100 : choice.votes;
        const pillTone = choice.tone === 'emerald' || choice.tone === 'violet' ? choice.tone : 'indigo';
        return (
          <Pressable
            key={choice.label}
            onPress={() => handleVote(choice.label)}
            style={{ marginBottom: 12 }}
          >
            <GlassCard>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.listTitle}>{choice.label}</Text>
                <Pill
                  label={`${fill}%`}
                  tone={pillTone}
                  icon="trending-up"
                />
              </View>
              <View style={styles.voteTrack}>
                <View
                  style={[
                    styles.voteFill,
                    {
                      width: `${fill}%`,
                      backgroundColor:
                        choice.tone === 'emerald'
                          ? palette.emerald
                          : choice.tone === 'violet'
                          ? palette.violet
                          : palette.indigo,
                    },
                  ]}
                />
              </View>
            </GlassCard>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  voteTrack: { height: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 6 },
  voteFill: { height: '100%', borderRadius: 999 },
});
