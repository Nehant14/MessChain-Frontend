import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, SectionTitle } from '../../components';
import { staffTasks } from '../../data';
import { palette } from '../../theme';
import { StaffTask } from '../../types/staff.types';

export default function TasksScreen() {
  return (
    <View>
      <SectionTitle eyebrow="Staff" title="Task board" />
      {(staffTasks as StaffTask[]).map((task, index) => (
        // Added defensive fallback composite tracking keys to handle repetitive titles cleanly
        <GlassCard key={`${task.title}-${index}`} style={{ marginBottom: 12 }}>
          <Text style={styles.listTitle}>{task.title}</Text>
          {task.note ? <Text style={styles.listBody}>{task.note}</Text> : null}
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
});