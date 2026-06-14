// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View, Platform } from 'react-native';
import { adminTabs, networkModes, palette, Role, NetworkKind, staffTabs, studentTabs } from './src/theme';
import { adminKpis, complaintFeed, feedbackBars, pollSeed, rebateClaims, sentimentTags, staffDrafts, staffTasks, studentLogs, voteChoices } from './src/data';
import { BottomTab, GlassCard, LockClockIcon, MetricRing, Pill, PrimaryButton, ReceiptBadge, SectionTitle, SkeletonBlock, StatusBanner, TextField, ToggleRow, copyToClipboard } from './src/components';

type ScreenId = string;
type AuthSession = { email: string; role: Role; token: string };

const walletAddress = '0x71C2b8A9d4F3C7A1e9B8d2C5f0A7b3C9dE3A9f';
const authSessionKey = 'messchain.auth-session';

const roleHome: Record<Role, ScreenId> = {
  admin: 'dashboard',
  student: 'qr-scanner',
  staff: 'dashboard',
};

const roleTabs = { admin: adminTabs, student: studentTabs, staff: staffTabs } as const;
const roleMenus = {
  admin: ['dashboard', 'create-staff', 'complaints', 'feedback-report', 'rebates', 'create-poll', 'beta-settings'],
  student: ['qr-scanner', 'file-complaint', 'file-feedback', 'profile', 'vote'],
  staff: ['dashboard', 'tasks', 'logs', 'inventory', 'settings'],
} as const;

const compactWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

const createSessionToken = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const resolveRoleFromEmail = (email: string): Role => {
  const normalized = email.toLowerCase();
  if (normalized.includes('admin') || normalized.includes('principal') || normalized.includes('manager')) {
    return 'admin';
  }
  if (normalized.includes('staff') || normalized.includes('faculty') || normalized.includes('teacher')) {
    return 'staff';
  }
  return 'student';
};

const readStoredSession = async (): Promise<AuthSession | null> => {
  try {
    const stored = Platform.OS === 'web'
      ? (typeof window !== 'undefined' ? window.localStorage.getItem(authSessionKey) : null)
      : await SecureStore.getItemAsync(authSessionKey);

    return stored ? (JSON.parse(stored) as AuthSession) : null;
  } catch {
    return null;
  }
};

const writeStoredSession = async (session: AuthSession) => {
  const serialized = JSON.stringify(session);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(authSessionKey, serialized);
    }
    return;
  }

  await SecureStore.setItemAsync(authSessionKey, serialized);
};

const clearStoredSession = async () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(authSessionKey);
    }
    return;
  }

  await SecureStore.deleteItemAsync(authSessionKey);
};

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [screen, setScreen] = useState<ScreenId>('dashboard');
  const [network, setNetwork] = useState<NetworkKind>('polygon');
  const [walletCopied, setWalletCopied] = useState(false);
  const [loadingScreens, setLoadingScreens] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [receiptOverlay, setReceiptOverlay] = useState<string | null>(null);
  const [scannedQr, setScannedQr] = useState<string | null>(null);
  const [approvalOverlay, setApprovalOverlay] = useState(false);
  const [revealComplaint, setRevealComplaint] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState(pollSeed);
  const [pollName, setPollName] = useState('Weekend menu preference');
  const [pollWindow, setPollWindow] = useState('Sat 7:00 PM - Sun 11:00 AM');
  const [staffName, setStaffName] = useState('');
  const [staffWallet, setStaffWallet] = useState('');
  const [staffRole, setStaffRole] = useState('Kitchen Lead');
  const [limitedAccess, setLimitedAccess] = useState(true);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintBody, setComplaintBody] = useState('');
  const [attachment, setAttachment] = useState('Receipt.png');
  const [starRating, setStarRating] = useState(4);
  const [mealWindow, setMealWindow] = useState('Lunch');
  const [voteChoice, setVoteChoice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(17418);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const { width } = useWindowDimensions();
  const contentWidth = width > 920 ? 860 : width - 32;
  const columns = width >= 980 ? 3 : width >= 720 ? 2 : 1;
  const currentNetwork = networkModes[network];
  const menu = roleMenus[role];
  const tabs = roleTabs[role];
  const authenticated = Boolean(session);

  useEffect(() => { setScreen(roleHome[role]); }, [role]);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      const storedSession = await readStoredSession();
      if (!mounted) return;

      if (storedSession?.email && storedSession?.role) {
        setSession(storedSession);
        setRole(storedSession.role);
      }

      setBootstrapping(false);
    };

    hydrateSession();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    if (screen === 'complaints' || screen === 'profile') {
      if (loadingScreens[screen]) return;
      setLoadingScreens((prev) => ({ ...prev, [screen]: true }));
      const timer = setTimeout(() => setLoadingScreens((prev) => ({ ...prev, [screen]: false })), 1500);
      return () => clearTimeout(timer);
    }
  }, [authenticated, screen, loadingScreens]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((current) => (current > 0 ? current - 1 : 17418)), 1000);
    return () => clearInterval(timer);
  }, []);

  const launchProcessing = (id: string, callback?: () => void) => {
    setProcessing(id);
    setTimeout(() => {
      setProcessing((current) => (current === id ? null : current));
      callback?.();
    }, 1200);
  };

  const copyWallet = async () => {
    await copyToClipboard(walletAddress);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1200);
  };

  const handleLogin = async () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword.trim()) {
      setLoginError('Enter both email ID and password.');
      return;
    }

    if (!email.includes('@')) {
      setLoginError('Use a valid email ID.');
      return;
    }

    const nextRole = resolveRoleFromEmail(email);
    const nextSession = { email, role: nextRole, token: createSessionToken() };

    await writeStoredSession(nextSession);
    setSession(nextSession);
    setRole(nextRole);
    setScreen(roleHome[nextRole]);
    setLoginError('');
    setLoginPassword('');
  };

  const handleLogout = async () => {
    await clearStoredSession();
    setSession(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setScreen('dashboard');
    setRole('student');
  };

  const handleApprove = (id: string) => {
    launchProcessing(`rebate-${id}`, () => {
      setApprovalOverlay(true);
      setReceiptOverlay(id);
      setTimeout(() => setApprovalOverlay(false), 1800);
      setTimeout(() => setReceiptOverlay(null), 2800);
    });
  };

  const handleAddOption = () => setPollOptions((current) => [...current, { label: `Option ${current.length + 1}`, votes: 0 }]);
  const themeStyles = useMemo(() => ({ accent: currentNetwork.accent, glow: network === 'polygon' ? 'rgba(16,185,129,0.16)' : 'rgba(124,58,237,0.16)' }), [currentNetwork.accent, network]);

  const countdownText = countdownToText(countdown);
  const routeContent = renderRoute();

  if (bootstrapping) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={themeStyles.accent} />
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
          <View style={[styles.glowOrb, { backgroundColor: themeStyles.glow, top: -80, right: -50 }]} />
          <View style={[styles.glowOrb, { backgroundColor: 'rgba(79,70,229,0.18)', bottom: 70, left: -70 }]} />
          <View style={[styles.glowOrb, { backgroundColor: 'rgba(255,255,255,0.08)', top: 180, left: 80 }]} />
        </View>
        <ScrollView contentContainerStyle={styles.loginScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.brandMark, { borderColor: themeStyles.accent }]}>
            <Feather name="hexagon" size={20} color={themeStyles.accent} />
          </View>
          <Text style={styles.brandTitle}>MessChain</Text>
          <Text style={styles.brandSubtitle}>Log in with your Email ID and Password</Text>
          <GlassCard style={{ width: contentWidth, marginTop: 24 }}>
            
          <SectionTitle 
            eyebrow="Welcome Back" 
            title="Sign in to MessChain" 
            subtitle="Enter your institutional credentials to continue" 
          />
          
            <TextField label="Email ID" placeholder="admin@messchain.edu" value={loginEmail} onChangeText={setLoginEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="Password" placeholder="Enter your password" value={loginPassword} onChangeText={setLoginPassword} secureTextEntry />
            {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}
            <View style={styles.loginActionRow}>
              <PrimaryButton label="Sign In" icon="log-in" tone={network === 'polygon' ? 'emerald' : 'violet'} onPress={handleLogin} />
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
        <View style={[styles.glowOrb, { backgroundColor: themeStyles.glow, top: -110, left: -60 }]} />
        <View style={[styles.glowOrb, { backgroundColor: 'rgba(79,70,229,0.18)', top: 120, right: -80 }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.shellScroll, { paddingBottom: 208 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.shellInner, { width: contentWidth }]}>
          <View style={styles.topBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shellTitle}>{role === 'admin' ? 'Admin Page' : role === 'student' ? 'Student Page' : 'Staff Page'}</Text>
              <Text style={styles.shellSub}>Signed in as {session?.email} • route: /{screen} • {menu.length} active modules</Text>
            </View>
            <View style={styles.shellActions}>
              <Pressable onPress={() => setNetwork((current) => (current === 'polygon' ? 'hyperledger' : 'polygon'))} style={({ pressed }) => [styles.networkToggle, pressed && { opacity: 0.8, transform: [{ translateY: -1 }] }]}>
                <Feather name="refresh-cw" size={14} color={palette.text} />
                <Text style={styles.networkToggleText}>{currentNetwork.badge}</Text>
              </Pressable>
              <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.82, transform: [{ translateY: -1 }] }]}>
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

          {walletCopied ? <Text style={styles.toast}>Wallet copied to clipboard.</Text> : null}
          <View style={styles.routeSurface}>{routeContent}</View>
        </View>
      </ScrollView>
      <View style={styles.bottomDock}>
        <View style={[styles.bottomDockInner, { width: contentWidth }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabStrip}>
            {tabs.map((tab) => (<BottomTab key={tab.id} icon={tab.icon as any} label={tab.label} active={screen === tab.id} onPress={() => setScreen(tab.id)} />))}
          </ScrollView>
        </View>
      </View>
      {approvalOverlay ? (
        <View style={styles.lockOverlay} pointerEvents="none">
          <GlassCard style={styles.lockCard}>
            <LockClockIcon />
            <Text style={styles.lockTitle}>Cryptographic verification in progress</Text>
            <Text style={styles.lockSub}>Multi-sig consensus is sealing the rebate execution against the selected ledger.</Text>
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

  function renderRoute() {
    switch (screen) {
      case 'create-staff': return renderCreateStaff();
      case 'complaints': return renderComplaints();
      case 'feedback-report': return renderFeedbackReport();
      case 'rebates': return renderRebates();
      case 'create-poll': return renderCreatePoll();
      case 'beta-settings': return renderBetaSettings();
      case 'qr-scanner': return renderQrScanner();
      case 'file-complaint': return renderFileComplaint();
      case 'file-feedback': return renderFileFeedback();
      case 'profile': return renderProfile();
      case 'vote': return renderVote();
      case 'tasks': return renderStaffTasks();
      case 'logs': return renderStaffLogs();
      case 'inventory': return renderStaffInventory();
      case 'settings': return renderStaffSettings();
      default: return role === 'student' ? renderQrScanner() : renderDashboard();
    }
  }

  function renderDashboard() {
    return (
      <View>
        <SectionTitle title="Overview" />
        <View style={[styles.grid, { gap: 12 }]}>
          {adminKpis.map((item) => (<GlassCard key={item.label} style={[styles.metricCard, { width: columns === 1 ? '100%' : columns === 2 ? '48%' : '31.5%' }]}><Text style={styles.metricLabel}>{item.label}</Text><Text style={styles.metricValue}>{item.value}</Text><Pill label={item.delta} tone={item.label.includes('Open') ? 'amber' : 'emerald'} /></GlassCard>))}
        </View>
        <View style={[styles.grid, { gap: 12, marginTop: 14 }]}>
        </View>
      </View>
    );
  }

  function renderCreateStaff() {
    return (<View><SectionTitle title="Create staff member" /><GlassCard>{staffDrafts.map((field) => (<TextField key={field.label} label={field.label} placeholder={field.placeholder} value={field.label === 'Employee name' ? staffName : field.label === 'Wallet address' ? staffWallet : staffRole} onChangeText={(text) => { if (field.label === 'Employee name') setStaffName(text); if (field.label === 'Wallet address') setStaffWallet(text); if (field.label === 'Role assignment') setStaffRole(text); }} />))}<ToggleRow label="Limited Access" description="Restrict payroll, dispute resolution, and rebate approvals until a supervisor expands privileges." value={limitedAccess} onChange={setLimitedAccess} /><View style={styles.inlineActions}><PrimaryButton label="Create Staff Profile" icon="user-check" tone="emerald" onPress={() => launchProcessing('create-staff')} loading={processing === 'create-staff'} /><Pill label={limitedAccess ? 'Limited access enabled' : 'Full access enabled'} tone={limitedAccess ? 'amber' : 'emerald'} icon="lock" /></View></GlassCard></View>);
  }

  function renderComplaints() {
    if (loadingScreens.complaints) return renderSkeletonFeed('Complaint feed', 4);
    return (<View><SectionTitle eyebrow="Web2 API" title="Complaint feed" />{complaintFeed.map((item) => { const expanded = revealComplaint === item.id; return (<GlassCard key={item.id} style={{ marginBottom: 12 }}><View style={styles.cardHeaderRow}><View style={{ flex: 1 }}><Text style={styles.listTitle}>{item.id}</Text><Text style={styles.listBody}>{item.title}</Text></View><Pill label={item.urgency} tone={item.urgency === 'High' ? 'red' : 'amber'} icon="alert-triangle" /></View><Pressable onPress={() => setRevealComplaint(expanded ? null : item.id)} style={styles.expandRow}><Text style={styles.expandText}>{expanded ? item.body : `${item.body.slice(0, 110)}...`}</Text><Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={palette.muted} /></Pressable><View style={styles.hashRow}><ReceiptBadge label="IPFS hash" value={`${item.ipfs.slice(0, 10)}...${item.ipfs.slice(-8)}`} /><PrimaryButton label="Copy" icon="copy" tone="violet" onPress={() => copyToClipboard(item.ipfs)} /></View><View style={styles.inlineActions}><Pill label={item.status} tone={item.status === 'Resolved' ? 'emerald' : 'indigo'} icon="check-circle" /><Pressable style={styles.selectChip} onPress={() => launchProcessing(`complaint-${item.id}`)}><Text style={styles.selectChipText}>Change resolution</Text><Feather name="chevron-down" size={14} color={palette.text} /></Pressable></View></GlassCard>); })}</View>);
  }

  function renderFeedbackReport() {
    return (<View><SectionTitle eyebrow="Analytics" title="Feedback report" /><View style={[styles.grid, { gap: 12 }]}><GlassCard style={[styles.reportCard, { width: columns === 1 ? '100%' : '31.5%' }]}><MetricRing value={92} label="Average score" accent={network === 'polygon' ? palette.emerald : palette.violet} /></GlassCard><GlassCard style={[styles.reportCard, { width: columns === 1 ? '100%' : '31.5%' }]}><Text style={styles.chartTitle}>Meal ratings</Text>{feedbackBars.map((bar) => (<View key={bar.label} style={styles.chartRow}><Text style={styles.chartLabel}>{bar.label}</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${bar.value}%`, backgroundColor: bar.color }]} /></View><Text style={styles.chartValue}>{bar.value}%</Text></View>))}</GlassCard></View></View>);
  }

  function renderRebates() {
    return (<View><SectionTitle title="Rebates ledger" />{rebateClaims.map((claim) => (<GlassCard key={claim.id} style={{ marginBottom: 12 }}><View style={styles.cardHeaderRow}><View><Text style={styles.listTitle}>{claim.student}</Text><Text style={styles.listBody}>{claim.reason}</Text></View><Text style={styles.amountText}>{claim.amount}</Text></View><View style={styles.lockStrip}><LockClockIcon /><View style={{ flex: 1 }}><Text style={styles.lockStripTitle}>Time lock active</Text><Text style={styles.lockStripBody}>{claim.lock} • receipt {claim.id} • {countdownText}</Text></View></View><View style={styles.hashRow}><ReceiptBadge label="Settlement hash" value={`${claim.hash.slice(0, 10)}...${claim.hash.slice(-8)}`} /><Pill label={claim.status} tone="indigo" icon="shield" /></View><View style={styles.inlineActions}><PrimaryButton label="Approve" icon="check" tone="emerald" onPress={() => handleApprove(claim.id)} loading={processing === `rebate-${claim.id}`} /><PrimaryButton label="Deny" icon="x" tone="red" onPress={() => launchProcessing(`deny-${claim.id}`)} loading={processing === `deny-${claim.id}`} danger /></View></GlassCard>))}</View>);
  }

  function renderCreatePoll() {
    return (<View><SectionTitle eyebrow="Web2 API" title="Poll composer" subtitle="Dynamic options, rearrange-ready option cards, and a custom execution window card." /><GlassCard><TextField label="Poll title" placeholder="Weekend menu preference" value={pollName} onChangeText={setPollName} /><View style={styles.windowCard}><View style={{ flex: 1 }}><Text style={styles.fieldLabel}>Execution window</Text><Text style={styles.windowTitle}>{pollWindow}</Text><Text style={styles.windowSub}>Custom date-time selection card</Text></View><Feather name="calendar" size={22} color={palette.text} /></View>{pollOptions.map((option, index) => (<View key={`${option.label}-${index}`} style={styles.optionCard}><Feather name="menu" size={18} color={palette.muted} /><Text style={styles.optionText}>{option.label}</Text><Text style={styles.optionVote}>{option.votes}</Text></View>))}<View style={styles.inlineActions}><Pressable style={styles.addOptionButton} onPress={handleAddOption}><Feather name="plus" size={16} color={palette.text} /><Text style={styles.addOptionText}>Add Option</Text></Pressable><PrimaryButton label="Schedule Poll" icon="send" tone="violet" onPress={() => launchProcessing('schedule-poll')} loading={processing === 'schedule-poll'} /></View></GlassCard></View>);
  }

  function renderBetaSettings() {
    return (<View><SectionTitle eyebrow="Experimental" title="Beta / Sandbox control area" subtitle="A safety-hazard border treatment for pending architecture routes and ecosystem switching." /><GlassCard style={styles.betaCard}><View style={styles.betaHeader}><Feather name="alert-triangle" size={22} color={palette.warning} /><Text style={styles.betaTitle}>Sandbox operations</Text></View><Text style={styles.betaCopy}>This lane is intentionally isolated. It lets the product swap ecosystem naming, badge markers, and header layout between Polygon and Hyperledger while the rest of the shell stays stable.</Text><View style={styles.networkChooser}><Pressable style={[styles.networkCard, network === 'polygon' && { borderColor: '#10b981' }]} onPress={() => setNetwork('polygon')}><Text style={styles.networkCardLabel}>Polygon</Text><Text style={styles.networkCardSub}>EVM settlement</Text></Pressable><Pressable style={[styles.networkCard, network === 'hyperledger' && { borderColor: '#7c3aed' }]} onPress={() => setNetwork('hyperledger')}><Text style={styles.networkCardLabel}>Hyperledger</Text><Text style={styles.networkCardSub}>Consortium mode</Text></Pressable></View><Pill label={currentNetwork.label} tone={network === 'polygon' ? 'emerald' : 'violet'} icon="settings" /></GlassCard></View>);
  }

  function renderQrScanner() {
    if (!cameraPermission) {
      return (
        <View>
          <SectionTitle eyebrow="Web3 RPC" title="QR scanner" subtitle="Loading camera permissions." />
          <GlassCard style={styles.scannerCard}>
            <View style={styles.permissionPanel}>
              <ActivityIndicator size="large" color={palette.emerald} />
              <Text style={styles.permissionTitle}>Checking camera access</Text>
            </View>
          </GlassCard>
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View>
          <SectionTitle eyebrow="Web3 RPC" title="QR scanner" subtitle="Camera access is required to scan the student QR code." />
          <GlassCard style={styles.scannerCard}>
            <View style={styles.permissionPanel}>
              <Feather name="camera" size={28} color={palette.text} />
              <Text style={styles.permissionTitle}>Camera permission needed</Text>
              <Text style={styles.permissionCopy}>Allow the camera so the app can scan QR codes directly on the student page.</Text>
              <PrimaryButton label="Grant Camera Access" icon="camera" tone="emerald" onPress={requestCameraPermission} />
            </View>
          </GlassCard>
        </View>
      );
    }

    const handleQrScan = ({ data }: { data: string }) => {
      if (scannedQr === data) return;
      setScannedQr(data);
    };

    return (
      <View>
        <SectionTitle eyebrow="Web3 RPC" title="QR scanner" subtitle="Use the live camera to scan a student QR code." />
        <GlassCard style={styles.scannerCard}>
          <View style={styles.cameraFrame}>
            <CameraView
              style={styles.cameraSurface}
              facing={'back' as CameraType}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={handleQrScan}
            />
            <View style={styles.scannerReticle}>
              <View style={styles.reticleCornerTopLeft} />
              <View style={styles.reticleCornerTopRight} />
              <View style={styles.reticleCornerBottomLeft} />
              <View style={styles.reticleCornerBottomRight} />
              <View style={styles.reticlePulse} />
            </View>
            <View style={styles.cameraBottomSheet}>
              <Text style={styles.cameraLabel}>Scanning live session QR</Text>
              <Text style={styles.cameraSub}>Point the camera at the code to capture the student session token.</Text>
            </View>
          </View>
          <View style={styles.inlineActions}>
            <PrimaryButton label="Reset Scan" icon="refresh-cw" tone="violet" onPress={() => setScannedQr(null)} />
          </View>
          {scannedQr ? (
            <View style={styles.scanResultCard}>
              <Text style={styles.scanResultLabel}>Scanned QR data</Text>
              <Text style={styles.scanResultValue}>{scannedQr}</Text>
            </View>
          ) : null}
        </GlassCard>
      </View>
    );
  }

  function renderFileComplaint() {
    return (<View><SectionTitle eyebrow="Web2 API" title="File a complaint"  /><GlassCard><TextField label="Complaint subject" placeholder="Service delay, food quality, or facility issue" value={complaintTitle} onChangeText={setComplaintTitle} /><TextField label="Describe the issue" placeholder="Explain what happened in a concise way." value={complaintBody} onChangeText={setComplaintBody} multiline rows={5} /><View style={styles.attachCard}><Feather name="paperclip" size={18} color={palette.text} /><View style={{ flex: 1 }}><Text style={styles.attachTitle}>Attachment preview</Text><Text style={styles.attachSub}>{attachment} • characters used {complaintBody.length}/320</Text></View></View><View style={styles.inlineActions}><PrimaryButton label="Submit Complaint" icon="send" tone="emerald" onPress={() => launchProcessing('submit-complaint')} loading={processing === 'submit-complaint'} /><Pill label="Draft auto-saved" tone="indigo" icon="save" /></View></GlassCard></View>);
  }

  function renderFileFeedback() {
    return (<View><SectionTitle eyebrow="Web2 API" title="File feedback" /><GlassCard><Text style={styles.ratingPrompt}>Tap to rate the latest meal service</Text><View style={styles.starRow}>{[1, 2, 3, 4, 5].map((star) => (<Pressable key={star} onPress={() => setStarRating(star)} style={({ pressed }) => [styles.starButton, pressed && { transform: [{ scale: 0.96 }] }]}><Feather name="star" size={22} color={star <= starRating ? '#facc15' : 'rgba(255,255,255,0.18)'} /></Pressable>))}</View><View style={styles.mealChips}>{['Breakfast', 'Lunch', 'Dinner'].map((item) => (<Pressable key={item} onPress={() => setMealWindow(item)} style={[styles.mealChip, mealWindow === item && { backgroundColor: 'rgba(16,185,129,0.18)', borderColor: 'rgba(16,185,129,0.38)' }]}><Text style={styles.mealChipText}>{item}</Text></Pressable>))}</View><PrimaryButton label="Send Feedback" icon="send" tone="violet" onPress={() => launchProcessing('send-feedback')} loading={processing === 'send-feedback'} /></GlassCard></View>);
  }

  function renderProfile() {
    if (loadingScreens.profile) return renderSkeletonFeed('Profile', 3);
    return (<View><SectionTitle eyebrow="Hybrid Layer" title="Student profile" /><GlassCard><View style={styles.profileHead}><View style={styles.avatarRing}><Text style={styles.avatarText}>AM</Text></View><View style={{ flex: 1 }}><Text style={styles.profileName}>Aarav Mehta</Text><Text style={styles.profileSub}>Resident ID • Lunch pass active • Wallet linked</Text></View><Pill label="Verified" tone="emerald" icon="check-circle" /></View><View style={styles.profileStats}><ReceiptBadge label="Identity score" value="98.3" /><ReceiptBadge label="On-chain logs" value="42" /><ReceiptBadge label="Sync health" value="Green" /></View><View style={styles.timeline}>{studentLogs.map((item) => (<View key={item.title} style={styles.timelineItem}><View style={styles.timelineDot} /><View style={{ flex: 1 }}><Text style={styles.listTitle}>{item.title}</Text><Text style={styles.listBody}>{item.details}</Text></View></View>))}</View></GlassCard></View>);
  }

  function renderVote() {
    return (<View><SectionTitle eyebrow="Web3 RPC" title="Vote on the next change"  />{voteChoices.map((choice) => { const active = voteChoice === choice.label; const fill = active ? 100 : choice.votes; return (<Pressable key={choice.label} onPress={() => setVoteChoice(choice.label)} style={{ marginBottom: 12 }}><GlassCard><View style={styles.cardHeaderRow}><Text style={styles.listTitle}>{choice.label}</Text><Pill label={`${fill}%`} tone={choice.tone === 'emerald' ? 'emerald' : choice.tone === 'violet' ? 'violet' : 'indigo'} icon="trending-up" /></View><View style={styles.voteTrack}><View style={[styles.voteFill, { width: `${fill}%`, backgroundColor: choice.tone === 'emerald' ? palette.emerald : choice.tone === 'violet' ? palette.violet : palette.indigo }]} /></View></GlassCard></Pressable>); })}</View>);
  }

  function renderStaffTasks() { return (<View><SectionTitle eyebrow="Staff" title="Task board" />{staffTasks.map((task) => (<GlassCard key={task.title} style={{ marginBottom: 12 }}><Text style={styles.listTitle}>{task.title}</Text><Text style={styles.listBody}>{task.note}</Text></GlassCard>))}</View>); }
  function renderStaffLogs() { return (<View><SectionTitle eyebrow="Staff" title="Daily logs" />{studentLogs.map((item) => (<GlassCard key={item.title} style={{ marginBottom: 12 }}><View style={styles.lockStrip}><LockClockIcon /><View style={{ flex: 1 }}><Text style={styles.lockStripTitle}>{item.title}</Text><Text style={styles.lockStripBody}>{item.details}</Text></View></View></GlassCard>))}</View>); }
  function renderStaffInventory() { return (<View><SectionTitle eyebrow="Staff" title="Inventory status"  /><GlassCard><Text style={styles.listTitle}>Kitchen stock</Text><Text style={styles.listBody}>42 active ingredient buckets • 6 replenishment alerts • 99.2% ledger sync</Text></GlassCard></View>); }
  function renderStaffSettings() { return (<View><SectionTitle eyebrow="Staff" title="Preferences"  /><GlassCard><ToggleRow label="Hyperledger theme" description="Switch the shared shell copy and badge accents to consortium mode." value={network === 'hyperledger'} onChange={(value) => setNetwork(value ? 'hyperledger' : 'polygon')} /></GlassCard></View>); }

  function renderSkeletonFeed(title: string, blocks: number) { return (<View><SectionTitle title={title} />{[...Array(blocks)].map((_, index) => (<GlassCard key={index} style={{ marginBottom: 12 }}><SkeletonBlock height={18} width="62%" /><View style={{ height: 12 }} /><SkeletonBlock height={14} width="92%" /><View style={{ height: 8 }} /><SkeletonBlock height={14} width="78%" /></GlassCard>))}</View>); }

  function countdownToText(value: number) { const minutes = Math.floor(value / 60); const seconds = value % 60; return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
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
  loginHintRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  loginActionRow: { marginTop: 18, gap: 10, alignItems: 'stretch' },
  loginHint: { color: palette.muted, fontSize: 12, lineHeight: 18 },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { minWidth: 0 },
  metricLabel: { color: palette.muted, fontSize: 12 },
  metricValue: { color: palette.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 8, marginBottom: 14 },
  heroCard: { minHeight: 170 },
  heroLabel: { color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1.3, fontSize: 11, marginBottom: 10 },
  heroTitle: { color: palette.text, fontSize: 21, fontWeight: '900', letterSpacing: -0.5, lineHeight: 28 },
  heroBody: { color: palette.muted, fontSize: 13.5, lineHeight: 21, marginTop: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  listTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  listBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  cardHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  expandRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  expandText: { flex: 1, color: palette.muted, lineHeight: 20, fontSize: 13 },
  hashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  selectChip: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectChipText: { color: palette.text, fontSize: 12.5, fontWeight: '700' },
  amountText: { color: palette.text, fontSize: 24, fontWeight: '900' },
  lockStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.16)', marginTop: 6 },
  lockStripTitle: { color: palette.text, fontSize: 15, fontWeight: '800' },
  lockStripBody: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
  reportCard: { minHeight: 280 },
  chartTitle: { color: palette.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  chartRow: { marginBottom: 10 },
  chartLabel: { color: palette.muted, fontSize: 12, marginBottom: 6 },
  barTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  chartValue: { color: palette.text, fontSize: 12, marginTop: 6, fontWeight: '700' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fieldLabel: { color: '#d4d4d8', fontSize: 12, marginBottom: 8, fontWeight: '700' },
  windowCard: { marginBottom: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  windowTitle: { color: palette.text, fontSize: 15, fontWeight: '800', marginTop: 4 },
  windowSub: { color: palette.muted, fontSize: 12, marginTop: 4 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  optionText: { flex: 1, color: palette.text, fontWeight: '700' },
  optionVote: { color: palette.muted, fontWeight: '800' },
  addOptionButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  addOptionText: { color: palette.text, fontWeight: '800', fontSize: 12.5 },
  betaCard: { borderStyle: 'solid', borderColor: 'rgba(250,204,21,0.32)' },
  betaHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  betaTitle: { color: palette.text, fontSize: 18, fontWeight: '900' },
  betaCopy: { color: palette.muted, lineHeight: 21, fontSize: 13, marginBottom: 14 },
  networkChooser: { flexDirection: 'row', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  networkCard: { flex: 1, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  networkCardLabel: { color: palette.text, fontWeight: '800', fontSize: 14 },
  networkCardSub: { color: palette.muted, fontSize: 12, marginTop: 5 },
  scannerCard: { minHeight: 420 },
  cameraFrame: { borderRadius: 26, overflow: 'hidden', backgroundColor: '#030712' },
  cameraSurface: { height: 320, backgroundColor: '#020617' },
  scannerReticle: { position: 'absolute', left: '50%', top: '50%', width: 178, height: 178, marginLeft: -89, marginTop: -89, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  reticlePulse: { position: 'absolute', width: 118, height: 118, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(16,185,129,0.7)', shadowColor: palette.emerald, shadowOpacity: 0.5, shadowRadius: 24 },
  reticleCornerTopLeft: { position: 'absolute', left: 8, top: 8, width: 34, height: 34, borderLeftWidth: 3, borderTopWidth: 3, borderColor: palette.emerald, borderTopLeftRadius: 18 },
  reticleCornerTopRight: { position: 'absolute', right: 8, top: 8, width: 34, height: 34, borderRightWidth: 3, borderTopWidth: 3, borderColor: palette.emerald, borderTopRightRadius: 18 },
  reticleCornerBottomLeft: { position: 'absolute', left: 8, bottom: 8, width: 34, height: 34, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: palette.emerald, borderBottomLeftRadius: 18 },
  reticleCornerBottomRight: { position: 'absolute', right: 8, bottom: 8, width: 34, height: 34, borderRightWidth: 3, borderBottomWidth: 3, borderColor: palette.emerald, borderBottomRightRadius: 18 },
  cameraBottomSheet: { padding: 16, backgroundColor: 'rgba(9,9,11,0.9)' },
  cameraLabel: { color: palette.text, fontSize: 15, fontWeight: '800' },
  cameraSub: { color: palette.muted, fontSize: 12.5, marginTop: 6, lineHeight: 18 },
  attachCard: { marginBottom: 16, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  attachTitle: { color: palette.text, fontSize: 13.5, fontWeight: '800' },
  attachSub: { color: palette.muted, fontSize: 12, marginTop: 3 },
  ratingPrompt: { color: palette.text, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  starRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  starButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChips: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  mealChip: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChipText: { color: palette.text, fontWeight: '700', fontSize: 12.5 },
  profileHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarRing: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileName: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileSub: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
  profileStats: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10, flexWrap: 'wrap' },
  timeline: { marginTop: 18 },
  timelineItem: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  timelineDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.emerald, marginTop: 6 },
  voteTrack: { height: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 6 },
  voteFill: { height: '100%', borderRadius: 999 },
  lockOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9,9,11,0.78)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  lockCard: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  lockTitle: { color: palette.text, fontSize: 21, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  lockSub: { color: palette.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  lockMetaRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  receiptHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  reportCard: { minHeight: 280 },
  chartTitle: { color: palette.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  chartRow: { marginBottom: 10 },
  chartLabel: { color: palette.muted, fontSize: 12, marginBottom: 6 },
  barTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  chartValue: { color: palette.text, fontSize: 12, marginTop: 6, fontWeight: '700' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  windowCard: { marginBottom: 12, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  windowTitle: { color: palette.text, fontSize: 15, fontWeight: '800', marginTop: 4 },
  windowSub: { color: palette.muted, fontSize: 12, marginTop: 4 },
  optionCard: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  optionText: { flex: 1, color: palette.text, fontWeight: '700' },
  optionVote: { color: palette.muted, fontWeight: '800' },
  addOptionButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  addOptionText: { color: palette.text, fontWeight: '800', fontSize: 12.5 },
  betaCard: { borderStyle: 'solid', borderColor: 'rgba(250,204,21,0.32)' },
  betaHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  betaTitle: { color: palette.text, fontSize: 18, fontWeight: '900' },
  betaCopy: { color: palette.muted, lineHeight: 21, fontSize: 13, marginBottom: 14 },
  networkChooser: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  networkCard: { flex: 1, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  networkCardLabel: { color: palette.text, fontWeight: '800', fontSize: 14 },
  networkCardSub: { color: palette.muted, fontSize: 12, marginTop: 5 },
  scannerCard: { minHeight: 420 },
  cameraFrame: { borderRadius: 26, overflow: 'hidden', backgroundColor: '#030712' },
  cameraSurface: { height: 320, backgroundColor: '#020617' },
  scannerReticle: { position: 'absolute', left: '50%', top: '50%', width: 178, height: 178, marginLeft: -89, marginTop: -89, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  reticlePulse: { position: 'absolute', width: 118, height: 118, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(16,185,129,0.7)', shadowColor: palette.emerald, shadowOpacity: 0.5, shadowRadius: 24 },
  reticleCornerTopLeft: { position: 'absolute', left: 8, top: 8, width: 34, height: 34, borderLeftWidth: 3, borderTopWidth: 3, borderColor: palette.emerald, borderTopLeftRadius: 18 },
  reticleCornerTopRight: { position: 'absolute', right: 8, top: 8, width: 34, height: 34, borderRightWidth: 3, borderTopWidth: 3, borderColor: palette.emerald, borderTopRightRadius: 18 },
  reticleCornerBottomLeft: { position: 'absolute', left: 8, bottom: 8, width: 34, height: 34, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: palette.emerald, borderBottomLeftRadius: 18 },
  reticleCornerBottomRight: { position: 'absolute', right: 8, bottom: 8, width: 34, height: 34, borderRightWidth: 3, borderBottomWidth: 3, borderColor: palette.emerald, borderBottomRightRadius: 18 },
  cameraBottomSheet: { padding: 16, backgroundColor: 'rgba(9,9,11,0.9)' },
  cameraLabel: { color: palette.text, fontSize: 15, fontWeight: '800' },
  cameraSub: { color: palette.muted, fontSize: 12.5, marginTop: 6, lineHeight: 18 },
  permissionPanel: { minHeight: 320, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  permissionTitle: { color: palette.text, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  permissionCopy: { color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: 19, maxWidth: 280 },
  scanResultCard: { marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  scanResultLabel: { color: palette.muted, fontSize: 11, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  scanResultValue: { color: palette.text, fontSize: 13, lineHeight: 18, fontFamily: 'Courier' },
  attachCard: { marginBottom: 16, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  attachTitle: { color: palette.text, fontSize: 13.5, fontWeight: '800' },
  attachSub: { color: palette.muted, fontSize: 12, marginTop: 3 },
  ratingPrompt: { color: palette.text, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  starRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  starButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChips: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  mealChip: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  mealChipText: { color: palette.text, fontWeight: '700', fontSize: 12.5 },
  profileHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarRing: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileName: { color: palette.text, fontWeight: '900', fontSize: 20 },
  profileSub: { color: palette.muted, fontSize: 12.5, marginTop: 4 },
  profileStats: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  timeline: { marginTop: 18 },
  timelineItem: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  timelineDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.emerald, marginTop: 6 },
  voteTrack: { height: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 6 },
  voteFill: { height: '100%', borderRadius: 999 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9,9,11,0.78)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  lockCard: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  lockTitle: { color: palette.text, fontSize: 21, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  lockSub: { color: palette.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  lockMetaRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  receiptHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});



