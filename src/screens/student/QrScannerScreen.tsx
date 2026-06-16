import React, { useState, useContext } from 'react'; // CHANGED: Imported useContext tracking hooks
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native'; // CHANGED: Added native Alert handler
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { GlassCard, PrimaryButton, SectionTitle } from '../../components';
import { palette } from '../../theme';
import { NetworkContext } from '../../context/NetworkContext'; // CHANGED: Linked app-wide context managers
import { scanQrCode } from '../../services/student'; // CHANGED: Linked verification functionality

export default function QrScannerScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scannedQr, setScannedQr] = useState<string | null>(null);

  // CHANGED: Consume Network Context state configuration
  const networkContext = useContext(NetworkContext);
  const { processing, launchProcessing } = networkContext || { processing: null, launchProcessing: (id: string, fn: any) => fn() };

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
        <SectionTitle
          eyebrow="Web3 RPC"
          title="QR scanner"
          subtitle="Camera access is required to scan the student QR code."
        />
        <GlassCard style={styles.scannerCard}>
          <View style={styles.permissionPanel}>
            <Feather name="camera" size={28} color={palette.text} />
            <Text style={styles.permissionTitle}>Camera permission needed</Text>
            <Text style={styles.permissionCopy}>
              Allow the camera so the app can scan QR codes directly on the student page.
            </Text>
            <PrimaryButton
              label="Grant Camera Access"
              icon="camera"
              tone="emerald"
              onPress={requestCameraPermission}
            />
          </View>
        </GlassCard>
      </View>
    );
  }

  const handleQrScan = ({ data }: { data: string }) => {
    if (scannedQr === data) return;
    setScannedQr(data);

    // CHANGED: Added automatic background transaction dispatch on scan event
    launchProcessing('verify-meal', async () => {
      try {
        const response = await scanQrCode(data);
        Alert.alert("Success", response.message || "Meal verified successfully!");
      } catch (err: any) {
        Alert.alert("Verification Failed", err.message || "Failed to parse on-chain block record.");
      }
    });
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
            <Text style={styles.cameraLabel}>
              {/* CHANGED: Visually communicate dynamic load processing states via labels */}
              {processing === 'verify-meal' ? "Processing Timelock Tx..." : "Scanning live session QR"}
            </Text>
            <Text style={styles.cameraSub}>
              Point the camera at the code to capture the student session token.
            </Text>
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

const styles = StyleSheet.create({
  scannerCard: { minHeight: 420 },
  permissionPanel: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  permissionTitle: { color: palette.text, fontSize: 18, fontWeight: '800' },
  permissionCopy: { color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: 19, maxWidth: 280, marginBottom: 14 },
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
  inlineActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  scanResultCard: { marginTop: 14, padding: 14, borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.16)' },
  scanResultLabel: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  scanResultValue: { color: palette.text, fontSize: 13, marginTop: 6, fontFamily: 'Courier' },
});