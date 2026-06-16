import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Pill, PrimaryButton, SectionTitle, TextField, ToggleRow } from '../../components';
import { staffDrafts } from '../../data';
import { NetworkContext } from '../../context/NetworkContext';
import { createStaffMember } from '../../api/staff';

export default function CreateStaffScreen() {
  const [staffName, setStaffName] = useState('');
  const [staffWallet, setStaffWallet] = useState('');
  const [staffRole, setStaffRole] = useState('Kitchen Lead');
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
        wallet: staffWallet,
        role: staffRole,
        limitedAccess,
      });
      setStaffName('');
      setStaffWallet('');
    });
  };

  return (
    <View>
      <SectionTitle eyebrow="" title="Create staff member" />
      <GlassCard>
        {staffDrafts.map((field) => (
          <TextField
            key={field.label}
            label={field.label}
            placeholder={field.placeholder}
            value={
              field.label === 'Employee name'
                ? staffName
                : field.label === 'Wallet address'
                ? staffWallet
                : staffRole
            }
            onChangeText={(text) => {
              if (field.label === 'Employee name') setStaffName(text);
              if (field.label === 'Wallet address') setStaffWallet(text);
              if (field.label === 'Role assignment') setStaffRole(text);
            }}
          />
        ))}
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
