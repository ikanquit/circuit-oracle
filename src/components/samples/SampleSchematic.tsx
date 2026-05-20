/**
 * Hand-drawn SVG schematics for each sample. Rendered inline for performance
 * and so we can re-tint them with the card's accent color.
 *
 * Each schematic is drawn in a 200×140 viewBox with a 0.5 px stroke at the
 * "thin" base unit. preserveAspectRatio keeps them readable at any size.
 */
"use client";

import type { JSX } from "react";
import type { SchematicKey } from "@/lib/samples";

interface SchematicProps {
  schematic: SchematicKey;
  color?: string;
  size?: "thumb" | "full";
}

interface FragProps {
  c: string;
  thick: boolean;
}

// ---------- 1. VOLTAGE DIVIDER ----------
function VoltageDividerSchematic({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* +V rail */}
      <text x={36} y={16} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+5V</text>
      <path d="M50 20 V32" />
      <circle cx={50} cy={20} r={1.8} fill={c} stroke="none" />
      {/* R1 zigzag (vertical) */}
      <path d="M50 32 L44 36 L56 40 L44 44 L56 48 L44 52 L50 56" />
      <text x={62} y={47} fontSize={6} fontFamily="monospace" fill={c} stroke="none">R1</text>
      <text x={62} y={55} fontSize={6} fontFamily="monospace" fill={c} stroke="none" opacity={0.65}>10k</text>
      {/* Tap */}
      <path d="M50 56 V68" />
      <circle cx={50} cy={68} r={2} fill={c} stroke="none" />
      <path d="M50 68 H140" />
      <text x={148} y={71} fontSize={7} fontFamily="monospace" fill={c} stroke="none">Vout</text>
      {/* R2 */}
      <path d="M50 68 V72 L44 76 L56 80 L44 84 L56 88 L44 92 L50 96" />
      <text x={62} y={84} fontSize={6} fontFamily="monospace" fill={c} stroke="none">R2</text>
      <text x={62} y={92} fontSize={6} fontFamily="monospace" fill={c} stroke="none" opacity={0.65}>10k</text>
      {/* GND */}
      <path d="M50 96 V108" />
      <path d="M42 108 H58" />
      <path d="M44 112 H56" />
      <path d="M47 116 H53" />
    </g>
  );
}

// ---------- 2. RC LOW-PASS ----------
function RCLowPass({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vin */}
      <text x={6} y={36} fontSize={7} fontFamily="monospace" fill={c} stroke="none">Vin</text>
      <circle cx={20} cy={40} r={1.8} fill={c} stroke="none" />
      <path d="M20 40 H40" />
      {/* R1 horizontal zigzag */}
      <path d="M40 40 L44 34 L52 46 L60 34 L68 46 L76 34 L80 40" />
      <text x={48} y={26} fontSize={6} fontFamily="monospace" fill={c} stroke="none">R1 10k</text>
      <path d="M80 40 H120" />
      {/* tap node */}
      <circle cx={120} cy={40} r={2} fill={c} stroke="none" />
      <path d="M120 40 H172" />
      <text x={176} y={43} fontSize={7} fontFamily="monospace" fill={c} stroke="none">Vout</text>
      {/* C1 to GND (vertical from tap) */}
      <path d="M120 40 V58" />
      <path d="M108 58 H132" />
      <path d="M108 64 H132" />
      <text x={138} y={64} fontSize={6} fontFamily="monospace" fill={c} stroke="none">C1 100n</text>
      <path d="M120 64 V76" />
      {/* GND */}
      <path d="M112 76 H128" />
      <path d="M114 80 H126" />
      <path d="M117 84 H123" />
      {/* Bode response curve at the bottom */}
      <g opacity={0.55}>
        <path d="M6 110 H190" strokeDasharray="2 3" />
        <path d="M14 96 V112" strokeDasharray="2 3" />
        <path d="M14 100 H80 Q100 100 110 106 L180 124" strokeWidth={sw * 0.9} />
        <text x={82} y={120} fontSize={5} fontFamily="monospace" fill={c} stroke="none">fc</text>
        <path d="M82 110 V114" />
      </g>
    </g>
  );
}

// ---------- 3. INVERTING AMPLIFIER ----------
function InvertingAmp({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vin -> Rin */}
      <text x={6} y={52} fontSize={7} fontFamily="monospace" fill={c} stroke="none">Vin</text>
      <circle cx={18} cy={56} r={1.8} fill={c} stroke="none" />
      <path d="M18 56 H40" />
      {/* Rin zigzag */}
      <path d="M40 56 L44 50 L52 62 L60 50 L68 62 L76 50 L80 56" />
      <text x={48} y={42} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Rin 10k</text>
      <path d="M80 56 H96" />
      {/* Op-amp triangle */}
      <path d="M96 40 L96 72 L132 56 Z" strokeLinejoin="miter" />
      <text x={100} y={50} fontSize={7} fontFamily="monospace" fill={c} stroke="none">−</text>
      <text x={100} y={68} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+</text>
      {/* Non-inverting to GND via Rb */}
      <path d="M96 66 H88 V88" />
      <path d="M82 88 L94 94" />
      <path d="M82 88 H94" opacity={0} />
      {/* GND symbol */}
      <path d="M82 100 H94" />
      <path d="M84 104 H92" />
      <path d="M87 108 H89" />
      <path d="M88 88 V100" />
      {/* Output */}
      <path d="M132 56 H180" />
      <text x={170} y={50} fontSize={7} fontFamily="monospace" fill={c} stroke="none">Vout</text>
      <circle cx={180} cy={56} r={1.8} fill={c} stroke="none" />
      {/* Feedback Rf */}
      <path d="M96 48 V30 H110" />
      <path d="M110 30 L114 26 L122 34 L130 26 L138 34 L146 26 L150 30" />
      <text x={114} y={20} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Rf 100k</text>
      <path d="M150 30 H162 V56" />
    </g>
  );
}

// ---------- 4. COMMON EMITTER ----------
function CommonEmitter({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vcc rail */}
      <text x={6} y={16} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+12V</text>
      <path d="M30 20 H170" />
      {/* R1 (top divider) */}
      <path d="M50 20 V26 L44 30 L56 34 L44 38 L56 42 L44 46 L50 50" />
      <text x={60} y={38} fontSize={6} fontFamily="monospace" fill={c} stroke="none">R1 47k</text>
      {/* Rc (collector) */}
      <path d="M120 20 V26 L114 30 L126 34 L114 38 L126 42 L114 46 L120 50" />
      <text x={130} y={38} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Rc 4k7</text>
      {/* Base node */}
      <circle cx={50} cy={56} r={1.5} fill={c} stroke="none" />
      <path d="M50 50 V72" />
      <path d="M50 56 H80" />
      {/* Cin */}
      <path d="M30 56 H38" />
      <path d="M38 50 V62" />
      <path d="M42 50 V62" />
      <path d="M42 56 H50" />
      <text x={28} y={48} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Cin</text>
      <circle cx={26} cy={56} r={1.8} fill={c} stroke="none" />
      <text x={6} y={50} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Vin</text>
      {/* Transistor Q1 - drawn as circle with B/C/E */}
      <circle cx={92} cy={70} r={9} />
      <path d="M83 70 H89" />
      <path d="M89 64 L92 60" />
      <path d="M89 76 L94 80" />
      {/* arrow on emitter */}
      <path d="M91 78 L94 80 L91.5 77 Z" fill={c} stroke="none" />
      {/* Collector from Q1 up to Rc */}
      <path d="M92 60 V50" />
      <path d="M92 50 H120" />
      {/* Vout - taken from collector */}
      <circle cx={120} cy={50} r={1.8} fill={c} stroke="none" />
      <path d="M120 50 V30" opacity={0} />
      {/* Cout */}
      <path d="M120 50 H140" />
      <path d="M140 44 V56" />
      <path d="M144 44 V56" />
      <path d="M144 50 H172" />
      <text x={148} y={42} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Cout</text>
      <text x={158} y={46} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Vout</text>
      {/* R2 base divider to GND */}
      <path d="M50 72 V80 L44 84 L56 88 L44 92 L56 96 L44 100 L50 104" />
      <text x={60} y={92} fontSize={6} fontFamily="monospace" fill={c} stroke="none">R2 10k</text>
      {/* Re */}
      <path d="M94 80 V86 L88 90 L100 94 L88 98 L100 102 L94 106" />
      <text x={104} y={96} fontSize={6} fontFamily="monospace" fill={c} stroke="none">Re 1k</text>
      {/* GND rail */}
      <path d="M40 116 H110" />
      <path d="M44 120 H106" />
      <path d="M50 124 H100" />
      <path d="M50 104 V116" />
      <path d="M94 106 V116" />
    </g>
  );
}

// ---------- 5. 555 ASTABLE ----------
function NE555Astable({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vcc rail */}
      <text x={6} y={14} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+5V</text>
      <path d="M20 18 H180" />
      {/* IC body */}
      <rect x={70} y={36} width={70} height={56} rx={1} />
      <circle cx={75} cy={42} r={1.2} fill={c} stroke="none" />
      <text x={88} y={68} fontSize={9} fontFamily="monospace" fill={c} stroke="none" fontWeight="700">NE555</text>
      {/* Pin labels (left) */}
      <text x={65} y={49} fontSize={4} fontFamily="monospace" fill={c} stroke="none" textAnchor="end" opacity={0.7}>GND</text>
      <text x={65} y={61} fontSize={4} fontFamily="monospace" fill={c} stroke="none" textAnchor="end" opacity={0.7}>TRG</text>
      <text x={65} y={73} fontSize={4} fontFamily="monospace" fill={c} stroke="none" textAnchor="end" opacity={0.7}>OUT</text>
      <text x={65} y={85} fontSize={4} fontFamily="monospace" fill={c} stroke="none" textAnchor="end" opacity={0.7}>RST</text>
      {/* Pin labels (right) */}
      <text x={145} y={49} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>Vcc</text>
      <text x={145} y={61} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>DSC</text>
      <text x={145} y={73} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>THR</text>
      <text x={145} y={85} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>CTL</text>
      {/* Pins */}
      <path d="M62 48 H70" />
      <path d="M62 60 H70" />
      <path d="M62 72 H70" />
      <path d="M62 84 H70" />
      <path d="M140 48 H148" />
      <path d="M140 60 H148" />
      <path d="M140 72 H148" />
      <path d="M140 84 H148" />
      {/* Vcc to pin 8 + pin 4 */}
      <path d="M148 48 V20" />
      <path d="M148 84 V100 H40 V18" opacity={0} />
      <path d="M148 84 H156 V18" />
      {/* Reset to Vcc */}
      <path d="M148 84 V20" opacity={0} />
      {/* Ra: Vcc to pin 7 */}
      <path d="M148 60 V70 L142 74 L154 78 L142 82 L154 86 L142 90 L148 94" />
      <text x={158} y={80} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Ra 10k</text>
      <path d="M148 60 V18" opacity={0} />
      {/* Rb: pin 7 to pin 6 */}
      <path d="M148 94 V102 L142 106 L154 110 L142 114 L154 118 L148 122" />
      <text x={158} y={114} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Rb 10k</text>
      <path d="M148 122 V126 H140" />
      <path d="M148 122 H172 V72 H148" />
      {/* C1 to GND */}
      <path d="M148 126 V130" />
      <path d="M140 130 H156" />
      <path d="M140 134 H156" />
      <text x={120} y={138} fontSize={5} fontFamily="monospace" fill={c} stroke="none">C1 100n</text>
      <path d="M148 134 V142" />
      <path d="M140 142 H156" />
      <path d="M142 145 H154" />
      <path d="M145 148 H151" />
      {/* C2 control pin */}
      <path d="M148 84 H164" opacity={0} />
      {/* GND pin 1 to ground */}
      <path d="M70 48 H40 V142 H72" />
      <path d="M62 142 H78" />
      <path d="M66 145 H74" />
      <path d="M68 148 H72" />
      {/* OUT pin 3 */}
      <circle cx={70} cy={72} r={0} />
      <path d="M62 72 H32 V60" opacity={0} />
      <text x={20} y={75} fontSize={7} fontFamily="monospace" fill={c} stroke="none">OUT</text>
      <circle cx={26} cy={72} r={1.8} fill={c} stroke="none" />
      <path d="M26 72 H62" />
    </g>
  );
}

// ---------- 6. MULTIVIBRATOR ----------
function Multivibrator({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vcc rail */}
      <text x={6} y={14} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+5V</text>
      <path d="M20 18 H180" />
      {/* R1 / R4 collector resistors */}
      <path d="M50 18 V24 L44 28 L56 32 L44 36 L56 40 L44 44 L50 48" />
      <text x={28} y={36} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="end">R1 1k</text>
      <path d="M150 18 V24 L144 28 L156 32 L144 36 L156 40 L144 44 L150 48" />
      <text x={172} y={36} fontSize={5} fontFamily="monospace" fill={c} stroke="none">R4 1k</text>
      {/* R3 (Q1 base) and R2 (Q2 base) */}
      <path d="M80 18 V24 L74 28 L86 32 L74 36 L86 40 L74 44 L80 48" />
      <text x={62} y={36} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="end">R3 100k</text>
      <path d="M120 18 V24 L114 28 L126 32 L114 36 L126 40 L114 44 L120 48" />
      <text x={138} y={36} fontSize={5} fontFamily="monospace" fill={c} stroke="none">R2 100k</text>
      {/* Cross-coupling: C1 from Q1 collector to Q2 base, C2 from Q2 collector to Q1 base */}
      {/* Q1 collector node = 50, Q2 base node = 120 */}
      <circle cx={50} cy={56} r={1.5} fill={c} stroke="none" />
      <path d="M50 48 V60" />
      <path d="M50 56 H70" />
      {/* C1 plates */}
      <path d="M70 50 V62" />
      <path d="M74 50 V62" />
      <text x={70} y={48} fontSize={5} fontFamily="monospace" fill={c} stroke="none">C1</text>
      <path d="M74 56 H120" />
      {/* Q2 base */}
      <circle cx={120} cy={56} r={1.5} fill={c} stroke="none" />
      <path d="M120 48 V64" />
      {/* C2 (mirror) */}
      <circle cx={150} cy={56} r={1.5} fill={c} stroke="none" />
      <path d="M150 48 V60" />
      <path d="M150 56 H130" />
      <path d="M126 50 V62" />
      <path d="M130 50 V62" />
      <text x={130} y={48} fontSize={5} fontFamily="monospace" fill={c} stroke="none">C2</text>
      <path d="M126 56 H80" />
      <circle cx={80} cy={56} r={1.5} fill={c} stroke="none" />
      <path d="M80 48 V64" />
      {/* Q1 transistor */}
      <circle cx={60} cy={80} r={8} />
      <path d="M52 80 H58" />
      <path d="M58 75 L60 70" />
      <path d="M58 84 L62 92" />
      <path d="M59 91 L62 92 L60 89 Z" fill={c} stroke="none" />
      <path d="M60 70 V60" />
      <path d="M58 80 H80" opacity={0} />
      <path d="M52 80 H40" />
      <path d="M40 80 V64" opacity={0} />
      {/* Q2 transistor (mirror) */}
      <circle cx={140} cy={80} r={8} />
      <path d="M148 80 H142" />
      <path d="M142 75 L140 70" />
      <path d="M142 84 L138 92" />
      <path d="M141 91 L138 92 L140 89 Z" fill={c} stroke="none" />
      <path d="M140 70 V60" />
      <path d="M148 80 H160" />
      {/* Bases */}
      <path d="M52 80 H40 V64" />
      <path d="M148 80 H160 V64" />
      {/* Emitters to GND */}
      <path d="M62 92 V104" />
      <path d="M138 92 V104" />
      <path d="M30 104 H170" />
      <path d="M38 108 H162" />
      <path d="M50 112 H150" />
      <path d="M88 116 H112" />
      {/* labels */}
      <text x={64} y={104} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Q1</text>
      <text x={142} y={104} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Q2</text>
    </g>
  );
}

// ---------- 7. H-BRIDGE ----------
function HBridge({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vmotor rail */}
      <text x={6} y={14} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+12V</text>
      <path d="M30 18 H170" />
      {/* Q1 (top-left, P-channel) - drawn as a box with S/G/D */}
      <rect x={42} y={28} width={20} height={18} />
      <text x={52} y={40} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle">Q1</text>
      <path d="M52 28 V18" />
      <path d="M52 46 V62" />
      <path d="M42 37 H36" />
      <text x={32} y={40} fontSize={4} fontFamily="monospace" fill={c} stroke="none" textAnchor="end">PWM</text>
      {/* Q3 (top-right) */}
      <rect x={138} y={28} width={20} height={18} />
      <text x={148} y={40} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle">Q3</text>
      <path d="M148 28 V18" />
      <path d="M148 46 V62" />
      <path d="M158 37 H164" />
      <text x={168} y={40} fontSize={4} fontFamily="monospace" fill={c} stroke="none">PWM</text>
      {/* Motor in the middle */}
      <circle cx={100} cy={70} r={14} />
      <text x={100} y={73} fontSize={7} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle">M</text>
      {/* Motor leads */}
      <path d="M52 62 H86" />
      <circle cx={86} cy={70} r={1.5} fill={c} stroke="none" />
      <path d="M86 62 V70" />
      <path d="M148 62 H114" />
      <circle cx={114} cy={70} r={1.5} fill={c} stroke="none" />
      <path d="M114 62 V70" />
      {/* Q2 (bottom-left, N-channel) */}
      <rect x={42} y={94} width={20} height={18} />
      <text x={52} y={106} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle">Q2</text>
      <path d="M52 78 V94" />
      <path d="M86 78 H52" />
      <path d="M52 112 V124" />
      <path d="M42 103 H36" />
      {/* Q4 (bottom-right) */}
      <rect x={138} y={94} width={20} height={18} />
      <text x={148} y={106} fontSize={5} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle">Q4</text>
      <path d="M148 78 V94" />
      <path d="M148 78 H114" />
      <path d="M148 112 V124" />
      <path d="M158 103 H164" />
      {/* GND rail */}
      <path d="M30 124 H170" />
      <path d="M40 128 H160" />
      <path d="M50 132 H150" />
      <path d="M90 136 H110" />
      {/* Freewheel diodes (small triangles) */}
      <g opacity={0.85}>
        <path d="M70 31 L74 35 L70 39 Z" />
        <path d="M68 39 H76" />
        <path d="M126 31 L130 35 L126 39 Z" />
        <path d="M124 39 H132" />
        <path d="M70 109 L74 105 L70 101 Z" />
        <path d="M68 101 H76" />
        <path d="M126 109 L130 105 L126 101 Z" />
        <path d="M124 101 H132" />
      </g>
    </g>
  );
}

// ---------- 8. BUCK CONVERTER ----------
function BuckConverter({ c, thick }: FragProps): JSX.Element {
  const sw = thick ? 1.4 : 1;
  return (
    <g stroke={c} strokeWidth={sw} fill="none" strokeLinecap="square" strokeLinejoin="miter">
      {/* Vin */}
      <text x={6} y={14} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+12V</text>
      <circle cx={18} cy={18} r={1.8} fill={c} stroke="none" />
      <path d="M18 18 H40" />
      {/* Cin */}
      <path d="M30 18 V28" />
      <path d="M24 28 H36" />
      <path d="M24 32 H36" />
      <text x={6} y={36} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Cin</text>
      <path d="M30 32 V42" />
      {/* IC: LM2596 */}
      <rect x={56} y={20} width={48} height={36} rx={1} />
      <circle cx={60} cy={24} r={1} fill={c} stroke="none" />
      <text x={80} y={42} fontSize={7} fontFamily="monospace" fill={c} stroke="none" textAnchor="middle" fontWeight="700">LM2596</text>
      {/* IC pins */}
      <path d="M40 30 H56" />
      <text x={42} y={28} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>Vin</text>
      <path d="M104 30 H120" />
      <text x={106} y={28} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>SW</text>
      <path d="M40 50 H56" />
      <text x={42} y={48} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>GND</text>
      <path d="M104 50 H120" />
      <text x={108} y={48} fontSize={4} fontFamily="monospace" fill={c} stroke="none" opacity={0.7}>FB</text>
      {/* SW node */}
      <circle cx={120} cy={30} r={1.5} fill={c} stroke="none" />
      {/* Inductor L1 (loops) */}
      <path d="M120 30 H132" />
      <path d="M132 30 Q136 24 140 30 Q144 24 148 30 Q152 24 156 30 Q160 24 164 30" />
      <text x={138} y={20} fontSize={5} fontFamily="monospace" fill={c} stroke="none">L1 33µ</text>
      <path d="M164 30 H180" />
      {/* Vout node */}
      <circle cx={180} cy={30} r={1.8} fill={c} stroke="none" />
      <text x={172} y={20} fontSize={7} fontFamily="monospace" fill={c} stroke="none">+5V</text>
      {/* Cout */}
      <path d="M180 30 V40" />
      <path d="M174 40 H186" />
      <path d="M174 44 H186" />
      <text x={188} y={48} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Cout</text>
      <path d="M180 44 V58" />
      {/* Freewheel diode D1 (anode GND, cathode SW) */}
      <path d="M120 30 V42" />
      <path d="M116 42 L124 42 L120 50 Z" />
      <path d="M116 50 H124" />
      <text x={104} y={56} fontSize={5} fontFamily="monospace" fill={c} stroke="none">D1</text>
      <path d="M120 50 V58" />
      {/* GND rail */}
      <path d="M30 58 H180" />
      <path d="M40 62 H170" />
      <path d="M70 66 H140" />
      <path d="M90 70 H120" />
      {/* Feedback divider */}
      <path d="M180 30 H188 V90" opacity={0} />
      {/* PWM waveform inside switch node area - decorative */}
      <g opacity={0.5}>
        <path d="M30 84 H190" strokeDasharray="2 3" />
        <path d="M40 80 V94 H56 V80 H72 V94 H88 V80 H104 V94 H120 V80 H136" />
        <text x={30} y={100} fontSize={5} fontFamily="monospace" fill={c} stroke="none">SW</text>
        <path d="M40 102 H190" strokeDasharray="2 3" />
        <path d="M40 108 H190" />
        <text x={30} y={112} fontSize={5} fontFamily="monospace" fill={c} stroke="none">Vout</text>
      </g>
    </g>
  );
}

const SCHEMATICS: Record<SchematicKey, (p: FragProps) => JSX.Element> = {
  "voltage-divider": VoltageDividerSchematic,
  "rc-low-pass": RCLowPass,
  "inverting-amp": InvertingAmp,
  "common-emitter": CommonEmitter,
  "555-astable": NE555Astable,
  multivibrator: Multivibrator,
  "h-bridge": HBridge,
  "buck-converter": BuckConverter,
};

export default function SampleSchematic({
  schematic,
  color = "var(--co-phosphor)",
  size = "thumb",
}: SchematicProps): JSX.Element {
  const Frag = SCHEMATICS[schematic];
  const thick = size === "full";

  return (
    <svg
      viewBox="0 0 200 140"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <Frag c={color} thick={thick} />
    </svg>
  );
}
