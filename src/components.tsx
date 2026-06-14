import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { StyleProp } from 'react-native';
import { NetworkKind, networkModes, palette } from './theme';

type BaseProps = { children: React.ReactNode; style?: StyleProp<ViewStyle> };

export const copyToClipboard = async (value: string) => {
  await Clipboard.setStringAsync(value);
};

export function GlassCard({ children, style }: BaseProps) {
  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardOuter, style]}
    >
      <BlurView intensity={38} tint="dark" style={styles.cardBlur}>
        <View style={styles.cardInner}>{children}</View>
      </BlurView>
    </LinearGradient>
  );
}

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionHeading}>{title}</Text>
      {subtitle ? <Text style={styles.sectionBody}>{subtitle}</Text> : null}
    </View>
  );
}

export function Pill({ label, tone = 'neutral', icon }: { label: string; tone?: 'neutral' | 'emerald' | 'violet' | 'amber' | 'red' | 'indigo'; icon?: keyof typeof Feather.glyphMap }) {
  const backgroundMap = {
    neutral: 'rgba(255,255,255,0.07)',
    emerald: 'rgba(16, 185, 129, 0.16)',
    violet: 'rgba(124, 58, 237, 0.16)',
    amber: 'rgba(245, 158, 11, 0.16)',
    red: 'rgba(239, 68, 68, 0.16)',
    indigo: 'rgba(79, 70, 229, 0.16)',
  } as const;

  const colorMap = {
    neutral: palette.text,
    emerald: '#6ee7b7',
    violet: '#d8b4fe',
    amber: '#fcd34d',
    red: '#fca5a5',
    indigo: '#a5b4fc',
  } as const;

  return (
    <View style={[styles.pill, { backgroundColor: backgroundMap[tone] }]}>
      {icon ? <Feather name={icon} size={11} color={colorMap[tone]} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.pillText, { color: colorMap[tone] }]}>{label}</Text>
    </View>
  );
}

export function StatusBanner({
  network,
  wallet,
  onCopyWallet,
}: {
  network: NetworkKind;
  wallet: string;
  onCopyWallet: () => void;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.32, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const networkMeta = networkModes[network];

  return (
    <GlassCard style={styles.statusWrap}>
      <View style={styles.statusRow}>
        <View style={styles.statusLane}>
          <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulse }] }]} />
          <Text style={styles.statusLabel}>API Node: Synchronized</Text>
        </View>
        <Pill label={networkMeta.label} tone={network === 'polygon' ? 'emerald' : 'violet'} icon="globe" />
      </View>
      <View style={styles.walletRow}>
        <Text style={styles.walletMono}>{wallet}</Text>
        <Pressable onPress={onCopyWallet} style={({ pressed }) => [styles.copyButton, pressed && { opacity: 0.78, transform: [{ scale: 0.98 }] }]}>
          <Feather name="copy" size={12} color={palette.text} />
          <Text style={styles.copyButtonText}>Copy</Text>
        </Pressable>
      </View>
      <Text style={styles.statusSubcopy}>{networkMeta.subcopy}</Text>
    </GlassCard>
  );
}

export function SegmentedControl({
  value,
  items,
  onChange,
}: {
  value: string;
  items: { id: string; label: string; helper?: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.segmentWrap}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <Pressable key={item.id} onPress={() => onChange(item.id)} style={({ pressed }) => [styles.segment, active && styles.segmentActive, pressed && { transform: [{ translateY: -1 }] }]}>
            <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{item.label}</Text>
            {item.helper ? <Text style={[styles.segmentHelper, active && styles.segmentHelperActive]}>{item.helper}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  tone = 'emerald',
  onPress,
  loading,
  danger,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  tone?: 'emerald' | 'violet' | 'amber' | 'red';
  onPress: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  const colors = {
    emerald: ['rgba(16,185,129,0.98)', 'rgba(6,95,70,0.98)'],
    violet: ['rgba(124,58,237,0.98)', 'rgba(67,56,202,0.98)'],
    amber: ['rgba(245,158,11,0.98)', 'rgba(217,119,6,0.98)'],
    red: ['rgba(239,68,68,0.98)', 'rgba(190,18,60,0.98)'],
  } as const;

  return (
    <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [styles.buttonOuter, pressed && !loading && { transform: [{ translateY: -2 }, { scale: 0.99 }] }, danger && styles.buttonDanger]}>
      <LinearGradient colors={colors[tone]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonInner}>
        {loading ? <Feather name="loader" size={15} color={palette.text} /> : icon ? <Feather name={icon} size={15} color={palette.text} /> : null}
        <Text style={styles.buttonText}>{loading ? 'Processing' : label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function TextField({ label, placeholder, value, onChangeText, multiline, rows = 1, secureTextEntry, keyboardType, autoCapitalize = 'none' }: { label: string; placeholder: string; value: string; onChangeText: (text: string) => void; multiline?: boolean; rows?: number; secureTextEntry?: boolean; keyboardType?: TextInputProps['keyboardType']; autoCapitalize?: TextInputProps['autoCapitalize']; }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.softMuted}
        multiline={multiline}
        numberOfLines={rows}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[styles.field, multiline && { minHeight: 24 * rows + 20, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
        <View style={[styles.switchKnob, value && styles.switchKnobOn]} />
      </View>
    </Pressable>
  );
}

export function SkeletonBlock({ width = '100%', height = 14, style }: { width?: number | `${number}%`; height?: number; style?: ViewStyle }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 1150, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.48, 0.92, 0.48] });

  return <Animated.View style={[{ width: width as number | `${number}%`, height, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', opacity } as const, style]} />;
}

export function MetricRing({ value, label, accent }: { value: number; label: string; accent: string }) {
  const size = 108;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <View style={styles.ringWrap}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCopy}>
        <Text style={styles.ringValue}>{value}%</Text>
        <Text style={styles.ringLabel}>{label}</Text>
      </View>
    </View>
  );
}

export function LockClockIcon() {
  return (
    <Svg width={86} height={86} viewBox="0 0 86 86">
      <Circle cx={43} cy={43} r={38} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.38)" strokeWidth={2} />
      <Circle cx={43} cy={43} r={28} fill="rgba(9,9,11,0.92)" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
      <Rect x={30} y={41} width={26} height={19} rx={6} fill="rgba(16,185,129,0.16)" stroke="#10b981" strokeWidth={2} />
      <Path d="M35 41v-6a8 8 0 0 1 16 0v6" stroke="#10b981" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1={43} y1={47} x2={43} y2={31} stroke="#f8fafc" strokeWidth={2.5} strokeLinecap="round" />
      <Line x1={43} y1={47} x2={52} y2={50} stroke="#f8fafc" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={43} cy={43} r={2.8} fill="#f8fafc" />
    </Svg>
  );
}

export function ReceiptBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receiptBadge}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={styles.receiptValue}>{value}</Text>
    </View>
  );
}

export function BottomTab({ icon, label, active, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tabItem, active && styles.tabItemActive, pressed && { transform: [{ translateY: -2 }, { scale: 0.98 }] }]}>
      <Feather name={icon} size={17} color={active ? palette.text : palette.muted} />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    overflow: 'hidden',
    backgroundColor: 'rgba(24,24,27,0.72)',
    shadowColor: '#000',
    shadowOpacity: 0.38,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  cardBlur: { flex: 1 },
  cardInner: { padding: 18 },
  sectionTitle: { marginBottom: 14 },
  eyebrow: { color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1.6, fontSize: 11, marginBottom: 6 },
  sectionHeading: { color: palette.text, fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  sectionBody: { color: palette.muted, marginTop: 6, lineHeight: 20, fontSize: 13 },
  pill: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: 12, fontWeight: '700' },
  statusWrap: { marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  statusLane: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  pulseDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.emerald, shadowColor: palette.emerald, shadowOpacity: 0.9, shadowRadius: 10 },
  statusLabel: { color: palette.text, fontWeight: '800', fontSize: 12.5 },
  walletRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  walletMono: { color: '#e5e7eb', fontFamily: 'Courier', fontSize: 13, letterSpacing: 0.5 },
  copyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  copyButtonText: { color: palette.text, fontWeight: '700', fontSize: 12 },
  statusSubcopy: { color: palette.muted, marginTop: 10, fontSize: 12 },
  segmentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: { flexGrow: 1, minWidth: 92, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  segmentActive: { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.18)' },
  segmentLabel: { color: palette.muted, fontWeight: '800', fontSize: 13 },
  segmentLabelActive: { color: palette.text },
  segmentHelper: { color: '#6b7280', fontSize: 11, marginTop: 3 },
  segmentHelperActive: { color: '#cbd5e1' },
  buttonOuter: { borderRadius: 18, overflow: 'hidden', alignSelf: 'flex-start' },
  buttonDanger: { shadowColor: palette.red, shadowOpacity: 0.15 },
  buttonInner: { minHeight: 48, paddingHorizontal: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { color: palette.text, fontWeight: '800', fontSize: 13.5 },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { color: '#d4d4d8', fontSize: 12, marginBottom: 8, fontWeight: '700' },
  field: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', color: palette.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  toggleLabel: { color: palette.text, fontWeight: '800', fontSize: 14 },
  toggleDescription: { color: palette.muted, marginTop: 4, fontSize: 12, lineHeight: 18 },
  switchTrack: { width: 52, height: 30, borderRadius: 999, padding: 3, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center' },
  switchTrackOn: { backgroundColor: 'rgba(16,185,129,0.34)' },
  switchKnob: { width: 24, height: 24, borderRadius: 999, backgroundColor: '#f8fafc' },
  switchKnobOn: { transform: [{ translateX: 22 }], backgroundColor: palette.text },
  ringWrap: { width: 108, height: 108, alignItems: 'center', justifyContent: 'center' },
  ringCopy: { position: 'absolute', alignItems: 'center' },
  ringValue: { color: palette.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  ringLabel: { color: palette.muted, fontSize: 11, marginTop: 2 },
  receiptBadge: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  receiptLabel: { color: palette.muted, fontSize: 11, marginBottom: 4 },
  receiptValue: { color: palette.text, fontWeight: '700', fontSize: 13 },
  tabItem: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabItemActive: { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.16)', transform: [{ translateY: -3 }] },
  tabText: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: palette.text },
});
