import React, { useContext, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { NetworkProvider, NetworkContext } from './src/context/NetworkContext';
import { palette, adminTabs, studentTabs, staffTabs } from './src/theme';
import {
  BottomTab,
  GlassCard,
  LockClockIcon,
  PrimaryButton,
  ReceiptBadge,
  SectionTitle,
  StatusBanner,
  TextField,
  copyToClipboard,
} from './src/components';

import DashboardScreen from './src/screens/admin/DashboardScreen';
import CreateStaffScreen from './src/screens/admin/CreateStaffScreen';
import ComplaintsScreen from './src/screens/admin/ComplaintsScreen';
import FeedbackReportScreen from './src/screens/admin/FeedbackReportScreen';
import RebatesScreen from './src/screens/admin/RebatesScreen';
import CreatePollScreen from './src/screens/admin/CreatePollScreen';
import BetaSettingsScreen from './src/screens/admin/BetaSettingsScreen';

import QrScannerScreen from './src/screens/student/QrScannerScreen';
import FileComplaintScreen from './src/screens/student/FileComplaintScreen';
import FileFeedbackScreen from './src/screens/student/FileFeedbackScreen';
import ProfileScreen from './src/screens/student/ProfileScreen';
import VoteScreen from './src/screens/student/VoteScreen';

import TasksScreen from './src/screens/staff/TasksScreen';
import LogsScreen from './src/screens/staff/LogsScreen';
import InventoryScreen from './src/screens/staff/InventoryScreen';
import SettingsScreen from './src/screens/staff/SettingsScreen';

const walletAddress = '0x71C2b8A9d4F3C7A1e9B8d2C5f0A7b3C9dE3A9f';
const compactWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

const roleTabs = { admin: adminTabs, student: studentTabs, staff: staffTabs } as const;
const roleMenus = {
  admin: ['dashboard', 'create-staff', 'complaints', 'feedback-report', 'rebates', 'create-poll', 'beta-settings'],
  student: ['qr-scanner', 'file-complaint', 'file-feedback', 'profile', 'vote'],
  staff: ['tasks', 'logs', 'inventory', 'settings'],
} as const;

function AppContent() {
  const auth = useContext(AuthContext);
  const networkContext = useContext(NetworkContext);

  if (!auth || !networkContext) {
    return null;
  }

  const {
    session,
    role,
    bootstrapping,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    screen,
    setScreen,
    handleLogin,
    handleLogout,
  } = auth;

  const {
    network,
    setNetwork,
    currentNetwork,
    approvalOverlay,
    receiptOverlay,
  } = networkContext;

  const [walletCopied, setWalletCopied] = useState(false);
  const { width } = useWindowDimensions();
  const contentWidth = width > 920 ? 860 : width - 32;
  const menu = roleMenus[role];
  const tabs = roleTabs[role];
  const authenticated = Boolean(session);

  const copyWallet = async () => {
    await copyToClipboard(walletAddress);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1200);
  };

  const renderRoute = () => {
    switch (screen) {
      case 'create-staff': return <CreateStaffScreen />;
      case 'complaints': return <ComplaintsScreen />;
      case 'feedback-report': return <FeedbackReportScreen />;
      case 'rebates': return <RebatesScreen />;
      case 'create-poll': return <CreatePollScreen />;
      case 'beta-settings': return <BetaSettingsScreen />;
      case 'qr-scanner': return <QrScannerScreen />;
      case 'file-complaint': return <FileComplaintScreen />;
      case 'file-feedback': return <FileFeedbackScreen />;
      case 'profile': return <ProfileScreen />;
      case 'vote': return <VoteScreen />;
      case 'tasks': return <TasksScreen />;
      case 'logs': return <LogsScreen />;
      case 'inventory': return <InventoryScreen />;
      case 'settings': return <SettingsScreen />;
      default:
        return role === 'student' ? (
          <QrScannerScreen />
        ) : role === 'staff' ? (
          <TasksScreen />
        ) : (
          <DashboardScreen />
        );
    }
  };

  if (bootstrapping) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={currentNetwork.accent} />
          <Text style={styles.loadingTitle}>Loading secure session</Text>
          <Text style={styles.loadingCopy}>Restoring your last role before showing the app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.backdrop}>
          <View style={[styles.glowOrb, { backgroundColor: network === 'polygon' ? 'rgba(16,185,129,0.16)' : 'rgba(124,58,237,0.16)', top: -80, right: -50 }]} />
          <View style={[styles.glowOrb, { backgroundColor: 'rgba(79,70,229,0.18)', bottom: 70, left: -70 }]} />
          <View style={[styles.glowOrb, { backgroundColor: 'rgba(255,255,255,0.08)', top: 180, left: 80 }]} />
        </View>
        <ScrollView contentContainerStyle={styles.loginScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.brandMark, { borderColor: currentNetwork.accent }]}>
            <Feather name="hexagon" size={20} color={currentNetwork.accent} />
          </View>
          <Text style={styles.brandTitle}>MessChain</Text>
          <Text style={styles.brandSubtitle}>Log in with your Email ID and Password</Text>
          <GlassCard style={{ width: contentWidth, marginTop: 24 }}>
            <SectionTitle
              eyebrow="Welcome Back"
              title="Sign in to MessChain"
              subtitle="Enter your institutional credentials to continue"
            />
            <TextField
              label="Email ID"
              placeholder="admin@messchain.edu"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextField
              label="Password"
              placeholder="Enter your password"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}
            <View style={styles.loginActionRow}>
              <PrimaryButton
                label="Sign In"
                icon="log-in"
                tone={network === 'polygon' ? 'emerald' : 'violet'}
                onPress={handleLogin}
              />
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.screenBg}>
        <View style={[styles.glowOrb, { backgroundColor: network === 'polygon' ? 'rgba(16,185,129,0.16)' : 'rgba(124,58,237,0.16)', top: -110, left: -60 }]} />
        <View style={[styles.glowOrb, { backgroundColor: 'rgba(79,70,229,0.18)', top: 120, right: -80 }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.shellScroll, { paddingBottom: 208 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.shellInner, { width: contentWidth }]}>
          <View style={styles.topBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shellTitle}>
                {role === 'admin' ? 'Admin Page' : role === 'student' ? 'Student Page' : 'Staff Page'}
              </Text>
              <Text style={styles.shellSub}>
                Signed in as {session?.email} • route: /{screen} • {menu.length} active modules
              </Text>
            </View>
            <View style={styles.shellActions}>
              <Pressable
                onPress={() => setNetwork((current) => (current === 'polygon' ? 'hyperledger' : 'polygon'))}
                style={({ pressed }) => [styles.networkToggle, pressed && { opacity: 0.8, transform: [{ translateY: -1 }] }]}
              >
                <Feather name="refresh-cw" size={14} color={palette.text} />
                <Text style={styles.networkToggleText}>{currentNetwork.badge}</Text>
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.82, transform: [{ translateY: -1 }] }]}
              >
                <Feather name="log-out" size={14} color={palette.text} />
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>

          {screen === 'profile' && (
            <>
              <StatusBanner network={network} wallet={compactWallet} onCopyWallet={copyWallet} />
              {walletCopied ? <Text style={styles.toast}>Wallet copied to clipboard.</Text> : null}
            </>
          )}

          <View style={styles.routeSurface}>{renderRoute()}</View>
        </View>
      </ScrollView>

      <View style={styles.bottomDock}>
        <View style={[styles.bottomDockInner, { width: contentWidth }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabStrip}>
            {tabs.map((tab) => (
              <BottomTab
                key={tab.id}
                icon={tab.icon as any}
                label={tab.label}
                active={screen === tab.id}
                onPress={() => setScreen(tab.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {approvalOverlay ? (
        <View style={styles.lockOverlay} pointerEvents="none">
          <GlassCard style={styles.lockCard}>
            <LockClockIcon />
            <Text style={styles.lockTitle}>Cryptographic verification in progress</Text>
            <Text style={styles.lockSub}>
              Multi-sig consensus is sealing the rebate execution against the selected ledger.
            </Text>
            <View style={styles.lockMetaRow}>
              <ReceiptBadge label="Network" value={currentNetwork.label} />
              <ReceiptBadge label="Quorum" value="4 of 5 validators" />
            </View>
          </GlassCard>
        </View>
      ) : null}

      {receiptOverlay ? (
        <View style={styles.lockOverlay} pointerEvents="none">
          <GlassCard style={styles.lockCard}>
            <View style={styles.receiptHeaderRow}>
              <LockClockIcon />
              <View style={{ flex: 1 }}>
                <Text style={styles.lockTitle}>Settlement sealed</Text>
                <Text style={styles.lockSub}>Transaction receipt anchored successfully.</Text>
              </View>
            </View>
            <View style={styles.lockMetaRow}>
              <ReceiptBadge label="Receipt hash" value="0x8c9f...4a71" />
              <ReceiptBadge label="Block time" value="12:41:22 UTC" />
            </View>
          </GlassCard>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <AppContent />
      </NetworkProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  backdrop: { ...StyleSheet.absoluteFill },
  screenBg: { ...StyleSheet.absoluteFill },
  glowOrb: { position: 'absolute', width: 240, height: 240, borderRadius: 999, opacity: 0.7 },
  loginScroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 42 },
  brandMark: { width: 60, height: 60, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  brandTitle: { color: palette.text, fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 14 },
  brandSubtitle: { color: palette.muted, textAlign: 'center', maxWidth: 360, marginTop: 10, lineHeight: 22, fontSize: 14 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  loadingTitle: { color: palette.text, fontSize: 18, fontWeight: '800' },
  loadingCopy: { color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: 19, maxWidth: 280 },
  loginError: { color: palette.red, marginTop: 2, marginBottom: 8, fontSize: 12.5, fontWeight: '700' },
  loginActionRow: { marginTop: 18, gap: 10, alignItems: 'stretch' },
  shellScroll: { flexGrow: 1, paddingTop: 30, paddingHorizontal: 12, alignItems: 'center' },
  shellInner: { flex: 1, minWidth: 0 },
  topBar: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12, paddingTop: 8 },
  shellTitle: { color: palette.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  shellSub: { color: palette.muted, marginTop: 4, fontSize: 12.5, flexShrink: 1, maxWidth: '100%' },
  shellActions: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-start' },
  networkToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  networkToggleText: { color: palette.text, fontWeight: '800', fontSize: 12 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.22)' },
  logoutText: { color: palette.text, fontWeight: '800', fontSize: 12 },
  toast: { color: palette.emerald, marginBottom: 12, fontSize: 12 },
  routeSurface: { width: '100%' },
  bottomDock: { position: 'absolute', left: 0, right: 0, bottom: 12, paddingHorizontal: 12, paddingBottom: 18, paddingTop: 6, backgroundColor: 'rgba(9,9,11,0.82)', alignItems: 'center' },
  bottomDockInner: { alignSelf: 'center', maxWidth: '100%' },
  tabStrip: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 2 },
  lockOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9,9,11,0.78)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  lockCard: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  lockTitle: { color: palette.text, fontSize: 21, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  lockSub: { color: palette.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  lockMetaRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  receiptHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});