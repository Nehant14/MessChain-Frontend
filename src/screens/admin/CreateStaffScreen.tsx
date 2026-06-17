import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Pill, PrimaryButton, SectionTitle, TextField, ToggleRow } from '../../components';
import { NetworkContext } from '../../context/NetworkContext';
import { createStaffMember } from '../../api/staff';

export default function CreateStaffScreen() {
  // CHANGED: Aligned component state keys to match active backend controller properties
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [messId, setMessId] = useState('');
  const [limitedAccess, setLimitedAccess] = useState(true);

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('CreateStaffScreen must be used within a NetworkProvider');
  }
  const { processing, launchProcessing } = networkContext;

  const handleCreateStaff = () => {
    launchProcessing('create-staff', async () => {
      await createStaffMember({
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        messId: messId,
      });
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setMessId('');
    });
  };

  return (
    <View>
      <SectionTitle eyebrow="" title="Create staff member" />
      <GlassCard>
        <TextField
          label="Employee Name"
          placeholder="John Doe"
          value={staffName}
          onChangeText={setStaffName}
        />
        <TextField
          label="Email Address"
          placeholder="staff@mess.edu"
          value={staffEmail}
          onChangeText={setStaffEmail}
        />
        <TextField
          label="Password"
          placeholder="••••••••"
          value={staffPassword}
          onChangeText={setStaffPassword}
          secureTextEntry
        />
        <TextField
          label="Mess ID Allocation"
          placeholder="Enter Mess Identifier string"
          value={messId}
          onChangeText={setMessId}
        />
        
        <ToggleRow
          label="Limited Access"
          description="Restrict payroll, dispute resolution, and rebate approvals until a supervisor expands privileges."
          value={limitedAccess}
          onChange={setLimitedAccess}
        />
        <View style={styles.inlineActions}>
          <PrimaryButton
            label="Create Staff Profile"
            icon="user-check"
            tone="emerald"
            onPress={handleCreateStaff}
            loading={processing === 'create-staff'}
          />
          <Pill
            label={limitedAccess ? 'Limited access enabled' : 'Full access enabled'}
            tone={limitedAccess ? 'amber' : 'emerald'}
            icon="lock"
          />
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
});