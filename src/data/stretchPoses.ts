/**
 * 3D pose data for the stretch figure.
 *
 * A bone direction is [azimuth, elevation] in degrees, in world space:
 *   azimuth   0 = +X (the direction the figure faces), 90 = toward the viewer, 180 = behind
 *   elevation 0 = horizontal, +90 = straight down, -90 = straight up
 *
 * Every stretch picks a base body position and patches only the bones that
 * differ from it, so a fix to a base improves every stretch built on it.
 * A stretch with a single keyframe gets a subtle breathing motion generated
 * for it; movement stretches list the keyframes they travel through.
 */

export type Ang = [number, number]

export interface FigurePose {
  pelvis: [number, number, number]
  hipAxis: Ang
  shoulderAxis: Ang
  lumbar: Ang
  thorax: Ang
  neck: Ang
  /** [upper arm, forearm] — N is the side nearer the viewer. */
  armN: [Ang, Ang]
  armF: [Ang, Ang]
  /** [thigh, shin, foot] */
  legN: [Ang, Ang, Ang]
  legF: [Ang, Ang, Ang]
}

export type PosePatch = Partial<FigurePose>

export type Prop =
  | { kind: 'wall'; x: number }
  | { kind: 'chair'; x: number; y: number }
  | { kind: 'bar'; y: number }

export interface StretchAnim {
  base: BaseName
  kf: PosePatch[]
  ground?: number
  yaw?: number
  pitch?: number
  period?: number
  prop?: Prop
}

// ---------------------------------------------------------------- limb presets

const ARM_DOWN_N: [Ang, Ang] = [[93, 85], [93, 87]]
const ARM_DOWN_F: [Ang, Ang] = [[-93, 85], [-93, 87]]
const ARM_UP_N: [Ang, Ang] = [[95, -82], [95, -87]]
const ARM_UP_F: [Ang, Ang] = [[-95, -82], [-95, -87]]
const ARM_FLOOR_N: [Ang, Ang] = [[90, 88], [-90, 89]]
const ARM_FLOOR_F: [Ang, Ang] = [[-90, 88], [90, 89]]

const LEG_STAND_N: [Ang, Ang, Ang] = [[95, 86], [95, 88], [0, 0]]
const LEG_STAND_F: [Ang, Ang, Ang] = [[-95, 86], [-95, 88], [0, 0]]
const LEG_KNEEL_N: [Ang, Ang, Ang] = [[90, 86], [180, 2], [180, 6]]
const LEG_KNEEL_F: [Ang, Ang, Ang] = [[-90, 86], [180, 2], [180, 6]]
const LEG_FLOOR_N: [Ang, Ang, Ang] = [[5, 12], [0, 8], [0, -40]]
const LEG_FLOOR_F: [Ang, Ang, Ang] = [[-5, 12], [0, 8], [0, -40]]
/** Front leg of a deep lunge — thigh level, shin vertical, foot planted. */
const LEG_LUNGE_FRONT: [Ang, Ang, Ang] = [[5, 4], [184, 84], [0, 0]]

// ---------------------------------------------------------------- base poses

export type BaseName =
  | 'standing' | 'fold' | 'squat'
  | 'kneeling' | 'halfKneeling' | 'allFours'
  | 'seatedFloor' | 'seatedChair'
  | 'supine' | 'prone' | 'sideLying'
  | 'hanging'

interface Base extends FigurePose {
  ground: number
  yaw: number
  pitch: number
}

export const BASES: Record<BaseName, Base> = {
  standing: {
    ground: 180, yaw: -20, pitch: 6,
    pelvis: [104, 110, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -88], thorax: [0, -89], neck: [0, -88],
    armN: ARM_DOWN_N, armF: ARM_DOWN_F, legN: LEG_STAND_N, legF: LEG_STAND_F,
  },
  fold: {
    ground: 180, yaw: -20, pitch: 6,
    pelvis: [96, 112, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -24], thorax: [0, -12], neck: [0, 8],
    armN: [[90, 86], [90, 88]], armF: [[-90, 86], [-90, 88]],
    legN: [[95, 84], [95, 87], [0, 0]], legF: [[-95, 84], [-95, 87], [0, 0]],
  },
  squat: {
    ground: 180, yaw: -22, pitch: 10,
    pelvis: [104, 140, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -80], thorax: [0, -84], neck: [0, -84],
    armN: [[50, 60], [20, 40]], armF: [[-50, 60], [-20, 40]],
    legN: [[22, 17], [202, 60], [0, 0]], legF: [[-22, 17], [-202, 60], [0, 0]],
  },
  kneeling: {
    ground: 180, yaw: -22, pitch: 8,
    pelvis: [110, 144, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -88], thorax: [0, -89], neck: [0, -88],
    armN: ARM_DOWN_N, armF: ARM_DOWN_F, legN: LEG_KNEEL_N, legF: LEG_KNEEL_F,
  },
  halfKneeling: {
    ground: 180, yaw: -22, pitch: 8,
    pelvis: [108, 144, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -88], thorax: [0, -89], neck: [0, -88],
    armN: ARM_DOWN_N, armF: ARM_DOWN_F,
    legN: LEG_LUNGE_FRONT, legF: LEG_KNEEL_F,
  },
  allFours: {
    ground: 180, yaw: -25, pitch: 12,
    pelvis: [140, 144, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [180, -23], thorax: [180, -23], neck: [180, -12],
    armN: ARM_FLOOR_N, armF: ARM_FLOOR_F,
    legN: [[90, 84], [0, 0], [0, 8]], legF: [[-90, 84], [0, 0], [0, 8]],
  },
  seatedFloor: {
    ground: 180, yaw: -22, pitch: 10,
    pelvis: [96, 158, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -84], thorax: [0, -86], neck: [0, -85],
    armN: [[80, 70], [40, 60]], armF: [[-80, 70], [-40, 60]],
    legN: LEG_FLOOR_N, legF: LEG_FLOOR_F,
  },
  seatedChair: {
    ground: 180, yaw: -22, pitch: 8,
    pelvis: [100, 142, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -86], thorax: [0, -88], neck: [0, -87],
    armN: [[70, 75], [30, 65]], armF: [[-70, 75], [-30, 65]],
    legN: [[8, 10], [185, 88], [0, 0]], legF: [[-8, 10], [-185, 88], [0, 0]],
  },
  supine: {
    ground: 182, yaw: -24, pitch: 34,
    pelvis: [116, 168, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, 0], thorax: [0, 0], neck: [0, 0],
    armN: [[175, 25], [178, 10]], armF: [[-175, 25], [-178, 10]],
    legN: [[178, -2], [180, 0], [180, -70]], legF: [[-178, -2], [-180, 0], [180, -70]],
  },
  prone: {
    ground: 182, yaw: -24, pitch: 28,
    pelvis: [116, 172, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, 0], thorax: [0, 0], neck: [0, 0],
    armN: [[172, 12], [176, 6]], armF: [[-172, 12], [-176, 6]],
    legN: [[178, -2], [180, 0], [180, -12]], legF: [[-178, -2], [-180, 0], [180, -12]],
  },
  sideLying: {
    ground: 182, yaw: -20, pitch: 26,
    pelvis: [100, 166, 0], hipAxis: [0, -90], shoulderAxis: [0, -90],
    lumbar: [0, 0], thorax: [0, 0], neck: [0, 0],
    armN: [[88, 2], [90, 0]], armF: [[90, 0], [90, 0]],
    legN: [[178, 6], [178, 2], [185, -10]], legF: [[176, 10], [176, 6], [185, -10]],
  },
  hanging: {
    ground: 192, yaw: -36, pitch: 8,
    pelvis: [104, 120, 0], hipAxis: [90, 0], shoulderAxis: [90, 0],
    lumbar: [0, -90], thorax: [0, -90], neck: [0, -86],
    armN: [[90, -80], [90, -84]], armF: [[-90, -80], [-90, -84]],
    legN: [[90, 82], [90, 86], [0, -20]], legF: [[-90, 82], [-90, 86], [0, -20]],
  },
}

const WALL: Prop = { kind: 'wall', x: 166 }
const BENCH: Prop = { kind: 'chair', x: 128, y: 150 }
const BAR: Prop = { kind: 'bar', y: 34 }

// ---------------------------------------------------------------- the library

export const STRETCH_ANIMATIONS: Record<string, StretchAnim> = {
  // ---- Neck ----
  'neck-side-bend': { base: 'standing', kf: [{ neck: [82, -66] }] },
  'neck-rotation-stretch': { base: 'standing', kf: [{ neck: [52, -80] }] },
  'chin-tuck': { base: 'standing', kf: [{ neck: [180, -80] }] },
  'neck-flexion-stretch': { base: 'standing', kf: [{ neck: [0, -34], armN: [[40, -40], [150, -30]], armF: [[-40, -40], [-150, -30]] }] },
  'levator-scapulae-stretch': { base: 'standing', kf: [{ neck: [55, -52], armN: [[60, -50], [140, -35]] }] },
  'neck-circles': {
    base: 'standing', period: 1500,
    kf: [{ neck: [0, -42] }, { neck: [90, -58] }, { neck: [180, -52] }],
  },

  // ---- Shoulders ----
  'cross-body-shoulder-stretch': {
    base: 'standing',
    kf: [{ armN: [[-50, 2], [-76, 4]], armF: [[-34, 26], [26, -6]] }],
  },
  'sleeper-stretch': {
    base: 'sideLying', yaw: -34,
    kf: [{ armF: [[70, 6], [80, -46]], armN: [[80, -30], [86, 24]] }],
  },
  'shoulder-external-rotation-stretch': {
    base: 'standing', prop: WALL, yaw: -34,
    kf: [{ armN: [[10, 4], [8, -74]] }],
  },
  'wall-shoulder-flexion-stretch': {
    base: 'standing', prop: WALL,
    kf: [{ lumbar: [0, -62], thorax: [0, -56], neck: [0, -56], armN: [[3, -38], [3, -58]], armF: [[-3, -34], [-3, -54]] }],
  },
  'band-shoulder-pass-through': {
    base: 'standing', period: 1400,
    kf: [
      { armN: [[5, 42], [5, 38]], armF: [[-5, 42], [-5, 38]] },
      { armN: [[6, -72], [6, -78]], armF: [[-6, -72], [-6, -78]] },
      { armN: [[174, -46], [174, -36]], armF: [[-174, -46], [-174, -36]] },
    ],
  },
  'shoulder-rolls': {
    base: 'standing', period: 1100,
    kf: [{ shoulderAxis: [90, -10] }, { shoulderAxis: [90, 10], armN: [[104, 82], [100, 86]], armF: [[-104, 82], [-100, 86]] }],
  },
  'shoulder-blade-squeezes': {
    base: 'standing', period: 1000,
    kf: [{}, { armN: [[124, 80], [128, 84]], armF: [[-124, 80], [-128, 84]], thorax: [0, -86] }],
  },

  // ---- Chest ----
  'doorway-chest-stretch': {
    base: 'standing', prop: WALL, yaw: -38,
    kf: [{ lumbar: [0, -86], thorax: [-6, -86], armN: [[16, 6], [14, -66]], legN: [[14, 74], [8, 86], [0, 0]] }],
  },
  'wall-pec-stretch-high': {
    base: 'standing', prop: WALL, yaw: -38,
    kf: [{ armN: [[14, -34], [10, -48]], thorax: [-8, -86] }],
  },
  'floor-chest-opener': {
    base: 'supine',
    kf: [{ armN: [[150, -4], [140, -10]], armF: [[-150, -4], [-140, -10]] }],
  },
  'clasped-hands-chest-stretch': {
    base: 'standing',
    kf: [{ armN: [[150, 56], [168, 44]], armF: [[-150, 56], [-168, 44]], thorax: [0, -92] }],
  },
  'foam-roller-chest-opener': {
    base: 'supine',
    kf: [{ pelvis: [116, 164, 0], armN: [[148, -14], [136, -20]], armF: [[-148, -14], [-136, -20]] }],
  },
  'standing-chest-opener-pulses': {
    base: 'standing', period: 900,
    kf: [
      { armN: [[148, 58], [166, 46]], armF: [[-148, 58], [-166, 46]] },
      { armN: [[140, 44], [158, 30]], armF: [[-140, 44], [-158, 30]] },
    ],
  },

  // ---- Upper Back ----
  'cat-cow': {
    base: 'allFours', period: 1500,
    kf: [
      { lumbar: [180, -8], thorax: [180, -36], neck: [180, -25] },
      { lumbar: [180, -38], thorax: [180, -10], neck: [180, 25] },
    ],
  },
  'thread-the-needle': {
    base: 'allFours', period: 2400, yaw: -28,
    kf: [
      {},
      {
        lumbar: [180, -14], thorax: [180, -8], neck: [170, 40], shoulderAxis: [90, 55],
        armN: [[-75, 22], [-88, 12]], armF: [[-90, 88], [0, 90]],
      },
    ],
  },
  'open-book-stretch': {
    base: 'sideLying', period: 1700, yaw: -20,
    kf: [
      { legN: [[65, 0], [190, 0], [200, 10]], legF: [[60, 4], [193, 2], [203, 8]] },
      {
        shoulderAxis: [-90, -60], thorax: [0, 4], neck: [-15, -10],
        armN: [[90, -55], [95, -35]],
        legN: [[65, 0], [190, 0], [200, 10]], legF: [[60, 4], [193, 2], [203, 8]],
      },
      {
        shoulderAxis: [-90, -20], thorax: [0, 6], neck: [-28, -4],
        armN: [[-88, -8], [-92, 5]],
        legN: [[65, 0], [190, 0], [200, 10]], legF: [[60, 4], [193, 2], [203, 8]],
      },
    ],
  },
  'childs-pose': {
    base: 'kneeling', yaw: -30, pitch: 36,
    kf: [{
      pelvis: [92, 166, 0],
      lumbar: [0, 10], thorax: [0, 14], neck: [0, 16],
      armN: [[6, 6], [4, 2]], armF: [[-6, 6], [-4, 2]],
      legN: [[10, 22], [186, -8], [186, 0]], legF: [[-10, 22], [-186, -8], [186, 0]],
    }],
  },
  'seated-thoracic-rotation': {
    base: 'seatedChair', prop: BENCH, yaw: -34,
    kf: [{ shoulderAxis: [58, 0], neck: [40, -80], armN: [[-40, 30], [-110, 20]], armF: [[-150, 30], [-70, 24]] }],
  },
  'foam-roller-thoracic-extension': {
    base: 'supine',
    kf: [{
      pelvis: [116, 172, 0], lumbar: [0, -14], thorax: [0, -22], neck: [0, -16],
      armN: [[130, -30], [96, -44]], armF: [[-130, -30], [-96, -44]],
      legN: [[172, 28], [190, 78], [0, 0]], legF: [[-172, 28], [-190, 78], [0, 0]],
    }],
  },
  'thoracic-rotation-reach': {
    base: 'allFours', period: 1500, yaw: -28,
    kf: [
      { armN: [[-40, 50], [-70, 20]], shoulderAxis: [90, 20] },
      { armN: [[100, -60], [110, -70]], shoulderAxis: [90, -45], neck: [160, -40] },
    ],
  },

  // ---- Lats ----
  'overhead-lat-stretch': {
    base: 'standing',
    kf: [{ lumbar: [90, -78], thorax: [90, -76], neck: [80, -80], armN: [[95, -70], [100, -76]], armF: [[100, -66], [104, -72]] }],
  },
  'kneeling-lat-stretch': {
    base: 'kneeling', prop: BENCH, yaw: -26, pitch: 12,
    kf: [{
      pelvis: [116, 150, 0], lumbar: [0, -24], thorax: [0, -6], neck: [0, 2],
      armN: [[4, -20], [2, -14]], armF: [[-4, -20], [-2, -14]],
    }],
  },
  'hanging-lat-stretch': { base: 'hanging', prop: BAR, kf: [{}] },
  'doorway-lat-stretch': {
    base: 'standing', prop: WALL, yaw: -30,
    kf: [{ lumbar: [-80, -80], thorax: [-70, -78], armN: [[8, -60], [6, -74]] }],
  },
  'standing-side-reach-pulses': {
    base: 'standing', period: 1000,
    kf: [
      { lumbar: [90, -80], thorax: [90, -78], armN: [[96, -72], [98, -80]] },
      { lumbar: [90, -70], thorax: [90, -68], armN: [[96, -64], [98, -72]] },
    ],
  },

  // ---- Triceps ----
  'overhead-triceps-stretch': {
    base: 'standing',
    kf: [{ armN: [[95, -80], [170, -30]], armF: [[-40, -60], [30, -74]] }],
  },
  'behind-back-triceps-stretch': {
    base: 'standing',
    kf: [{ armN: [[110, -74], [168, -20]], armF: [[150, 66], [160, 10]] }],
  },
  'triceps-wall-stretch': {
    base: 'standing', prop: WALL, yaw: -30,
    kf: [{ armN: [[70, -80], [160, -26]], armF: ARM_DOWN_F }],
  },
  'overhead-triceps-pulses': {
    base: 'standing', period: 900,
    kf: [
      { armN: [[95, -80], [170, -30]], armF: [[-40, -60], [30, -74]] },
      { armN: [[110, -76], [176, -12]], armF: [[-40, -60], [24, -70]] },
    ],
  },

  // ---- Biceps ----
  'wall-bicep-stretch': {
    base: 'standing', prop: WALL, yaw: -40,
    kf: [{ thorax: [-10, -86], armN: [[150, -6], [166, 0]], armF: ARM_DOWN_F }],
  },
  'extended-arm-bicep-stretch': {
    base: 'standing',
    kf: [{ armN: [[80, -4], [84, 4]], armF: [[-80, -4], [-84, 4]] }],
  },
  'doorway-bicep-stretch': {
    base: 'standing', prop: WALL, yaw: -40,
    kf: [{ thorax: [-8, -86], armN: [[20, -20], [14, -10]] }],
  },
  'arm-swings': {
    base: 'standing', period: 850,
    kf: [
      { armN: [[10, 40], [8, 30]], armF: [[176, 50], [174, 40]] },
      { armN: [[176, 50], [174, 40]], armF: [[10, 40], [8, 30]] },
    ],
  },

  // ---- Forearms ----
  'wrist-flexor-stretch': {
    base: 'standing',
    kf: [{ armN: [[8, -2], [6, 4]], armF: [[-30, 10], [40, -14]] }],
  },
  'wrist-extensor-stretch': {
    base: 'standing',
    kf: [{ armN: [[8, 4], [6, 10]], armF: [[-30, 14], [40, -8]] }],
  },
  'prayer-stretch': {
    base: 'standing',
    kf: [{ armN: [[54, 30], [10, 6]], armF: [[-54, 30], [-10, 6]] }],
  },
  'wrist-circles': {
    base: 'standing', period: 900,
    kf: [{ armN: [[8, -6], [6, -14]], armF: [[-8, -6], [-6, -14]] }, { armN: [[8, 6], [6, 16]], armF: [[-8, 6], [-6, 16]] }],
  },
  'wall-wrist-flexor-stretch': {
    base: 'fold', prop: WALL, yaw: -30,
    kf: [{ lumbar: [0, -40], thorax: [0, -30], neck: [0, -20], armN: [[6, 40], [4, 62]], armF: [[-6, 40], [-4, 62]] }],
  },
  'wrist-flexion-extension-pumps': {
    base: 'standing', period: 700,
    kf: [{ armN: [[8, -4], [6, -22]], armF: [[-8, -4], [-6, -22]] }, { armN: [[8, -4], [6, 20]], armF: [[-8, -4], [-6, 20]] }],
  },

  // ---- Finger & Grip ----
  'finger-extension-stretch': {
    base: 'standing',
    kf: [{ armN: [[10, -8], [8, -2]], armF: [[-28, 8], [42, -18]] }],
  },
  'tendon-glide': {
    base: 'standing', period: 1100,
    kf: [{ armN: [[10, -10], [6, -16]], armF: [[-10, -10], [-6, -16]] }, { armN: [[10, -4], [6, -2]], armF: [[-10, -4], [-6, -2]] }],
  },
  'rubber-band-finger-extension': {
    base: 'standing', period: 900,
    kf: [{ armN: [[12, -6], [8, -4]], armF: [[-12, -6], [-8, -4]] }, { armN: [[12, -2], [8, 4]], armF: [[-12, -2], [-8, 4]] }],
  },
  'thumb-extension-stretch': {
    base: 'standing',
    kf: [{ armN: [[12, -6], [10, 0]], armF: [[-26, 10], [44, -16]] }],
  },
  'finger-walks-on-wall': {
    base: 'standing', prop: WALL, period: 1300, yaw: -30,
    kf: [{ armN: [[6, 20], [4, -10]], armF: ARM_DOWN_F }, { armN: [[6, -40], [4, -62]], armF: ARM_DOWN_F }],
  },

  // ---- Abs ----
  'cobra-stretch': {
    base: 'prone',
    kf: [{
      lumbar: [0, -34], thorax: [0, -46], neck: [0, -50],
      armN: [[150, 40], [176, 76]], armF: [[-150, 40], [-176, 76]],
    }],
  },
  'standing-back-extension': {
    base: 'standing',
    kf: [{ lumbar: [180, -80], thorax: [180, -76], neck: [180, -64], armN: [[140, 62], [160, 50]], armF: [[-140, 62], [-160, 50]] }],
  },
  'kneeling-ab-stretch': {
    base: 'kneeling',
    kf: [{ lumbar: [180, -84], thorax: [180, -80], neck: [180, -70], armN: ARM_UP_N, armF: ARM_UP_F }],
  },
  'camel-pose': {
    base: 'kneeling',
    kf: [{
      lumbar: [180, -78], thorax: [180, -62], neck: [180, -40],
      armN: [[150, 46], [170, 62]], armF: [[-150, 46], [-170, 62]],
    }],
  },
  'standing-cat-cow': {
    base: 'standing', period: 1200,
    kf: [
      { lumbar: [0, -70], thorax: [0, -80], neck: [0, -50], armN: [[30, 60], [16, 52]], armF: [[-30, 60], [-16, 52]], legN: [[95, 80], [95, 84], [0, 0]], legF: [[-95, 80], [-95, 84], [0, 0]] },
      { lumbar: [0, -84], thorax: [0, -70], neck: [0, -84], armN: [[30, 60], [16, 52]], armF: [[-30, 60], [-16, 52]], legN: [[95, 80], [95, 84], [0, 0]], legF: [[-95, 80], [-95, 84], [0, 0]] },
    ],
  },

  // ---- Obliques ----
  'standing-side-bend': {
    base: 'standing',
    kf: [{ lumbar: [90, -76], thorax: [90, -72], neck: [80, -78], armN: [[96, -68], [98, -76]], armF: ARM_DOWN_F }],
  },
  'seated-side-reach': {
    base: 'seatedFloor', yaw: -26,
    kf: [{
      lumbar: [90, -76], thorax: [90, -70], neck: [80, -76],
      armN: [[96, -66], [98, -74]], armF: [[-70, 70], [-60, 76]],
      legN: [[30, 20], [150, 30], [0, -30]], legF: [[-30, 20], [-150, 30], [0, -30]],
    }],
  },
  'side-plank-reach-through': {
    base: 'sideLying', period: 1600, yaw: -30,
    kf: [
      { pelvis: [100, 156, 0], armF: [[76, 40], [86, 84]], armN: [[80, -60], [84, -70]] },
      { pelvis: [100, 160, 0], armF: [[76, 40], [86, 84]], armN: [[-70, 30], [-84, 40]], shoulderAxis: [-40, -60] },
    ],
  },
  'standing-trunk-rotations': {
    base: 'standing', period: 900,
    kf: [
      { shoulderAxis: [56, 0], neck: [30, -82], armN: [[-30, 40], [-100, 34]], armF: [[-140, 40], [-60, 36]] },
      { shoulderAxis: [124, 0], neck: [150, -82], armN: [[40, 40], [110, 34]], armF: [[140, 40], [70, 36]] },
    ],
  },

  // ---- Lower Back ----
  'knee-to-chest-stretch': {
    base: 'supine',
    kf: [{
      legN: [[10, -30], [176, 40], [170, 0]],
      armN: [[-40, 20], [-10, 40]], armF: [[-150, 26], [-170, 16]],
    }],
  },
  'double-knee-to-chest': {
    base: 'supine',
    kf: [{
      legN: [[16, -32], [176, 40], [170, 0]], legF: [[-16, -32], [-176, 40], [170, 0]],
      armN: [[-30, 24], [0, 44]], armF: [[30, 24], [0, 44]],
    }],
  },
  'supine-spinal-twist': {
    base: 'supine',
    kf: [{
      hipAxis: [50, 0],
      legN: [[120, 6], [176, 20], [170, 0]], legF: [[120, 16], [176, 30], [170, 0]],
      armN: [[150, -6], [140, -12]], armF: [[-150, -6], [-140, -12]],
      neck: [-30, 0],
    }],
  },
  'standing-lower-back-rotation': {
    base: 'standing',
    kf: [{ shoulderAxis: [56, 0], neck: [30, -82], armN: [[-34, 46], [-104, 40]], armF: [[-146, 46], [-64, 42]] }],
  },
  'sphinx-pose': {
    base: 'prone',
    kf: [{
      lumbar: [0, -22], thorax: [0, -34], neck: [0, -40],
      armN: [[156, 34], [10, 66]], armF: [[-156, 34], [-10, 66]],
    }],
  },
  'seated-cat-stretch': {
    base: 'seatedChair', prop: BENCH,
    kf: [{ lumbar: [0, -70], thorax: [0, -50], neck: [0, -20], armN: [[26, 60], [14, 66]], armF: [[-26, 60], [-14, 66]] }],
  },
  'pelvic-tilts': {
    base: 'supine', period: 1300,
    kf: [
      { pelvis: [116, 168, 0], legN: [[160, 30], [190, 76], [0, 0]], legF: [[-160, 30], [-190, 76], [0, 0]], lumbar: [0, -6] },
      { pelvis: [116, 170, 0], legN: [[160, 30], [190, 76], [0, 0]], legF: [[-160, 30], [-190, 76], [0, 0]], lumbar: [0, 6] },
    ],
  },

  // ---- Glutes ----
  'pigeon-pose': {
    base: 'seatedFloor', ground: 176, yaw: -22, pitch: 10,
    kf: [{
      pelvis: [116, 152, 0],
      lumbar: [0, -78], thorax: [0, -70], neck: [0, -72],
      armN: [[95, 80], [90, 85]], armF: [[-95, 80], [-90, 85]],
      legN: [[25, 30], [195, 8], [190, 0]], legF: [[182, 16], [182, 12], [182, 2]],
    }],
  },
  'figure-four-stretch': {
    base: 'supine',
    kf: [{
      legF: [[-14, -30], [176, 44], [170, 0]],
      legN: [[-60, -6], [172, 30], [176, 10]],
      armN: [[-40, 26], [-4, 44]], armF: [[-150, 30], [-172, 20]],
    }],
  },
  'seated-figure-four-stretch': {
    base: 'seatedChair', prop: BENCH, yaw: -28,
    kf: [{
      lumbar: [0, -70], thorax: [0, -62], neck: [0, -60],
      legN: [[46, 16], [-50, 6], [-40, -20]],
      armN: [[40, 60], [20, 56]], armF: [[-40, 60], [-20, 56]],
    }],
  },
  'standing-figure-four-stretch': {
    base: 'standing', prop: WALL, yaw: -26,
    kf: [{
      pelvis: [104, 124, 0],
      lumbar: [0, -76], thorax: [0, -80], neck: [0, -80],
      legN: [[40, 20], [-46, 20], [-40, -10]],
      legF: [[-96, 70], [-92, 84], [0, 0]],
      armN: [[10, -10], [6, -20]], armF: [[-30, 40], [-20, 50]],
    }],
  },
  'lying-piriformis-stretch': {
    base: 'supine',
    kf: [{
      legF: [[-10, -24], [176, 40], [170, 0]],
      legN: [[-56, 0], [174, 26], [176, 6]],
      armN: [[-36, 30], [-2, 46]], armF: [[-152, 28], [-174, 18]],
    }],
  },
  'half-kneeling-glute-stretch': {
    base: 'halfKneeling',
    kf: [{ lumbar: [0, -82], thorax: [0, -84], legN: [[30, 14], [200, 66], [0, 0]] }],
  },
  'fire-hydrants': {
    base: 'allFours', period: 900,
    kf: [
      {},
      { legN: [[70, 24], [30, 40], [10, 30]] },
    ],
  },

  // ---- Hip Flexors ----
  'couch-stretch': {
    base: 'halfKneeling', prop: BENCH, yaw: -26,
    kf: [{ legF: [[-170, 50], [170, -30], [170, -50]], lumbar: [0, -86], thorax: [0, -88] }],
  },
  'kneeling-hip-flexor-stretch': {
    base: 'halfKneeling',
    kf: [{ lumbar: [0, -84], thorax: [0, -86], neck: [0, -86] }],
  },
  'standing-hip-flexor-reach': {
    base: 'standing', prop: WALL, yaw: -28,
    kf: [{
      lumbar: [176, -82], thorax: [176, -80], neck: [170, -82],
      armN: [[92, -74], [94, -82]], armF: [[-20, -20], [-14, -30]],
      legF: [[-170, 72], [-176, 80], [0, 0]],
    }],
  },
  'half-kneeling-hip-flexor-rock': {
    base: 'halfKneeling', period: 1200,
    kf: [
      { pelvis: [108, 144, 0], lumbar: [0, -86], thorax: [0, -88] },
      { pelvis: [116, 146, 0], lumbar: [0, -82], thorax: [0, -86], legN: [[5, 14], [188, 80], [0, 0]] },
    ],
  },
  'low-lunge-stretch': {
    base: 'halfKneeling',
    kf: [{ pelvis: [112, 150, 0], lumbar: [0, -80], thorax: [0, -84], armN: [[20, 40], [10, 56]], armF: [[-20, 40], [-10, 56]] }],
  },
  'reclined-hip-flexor-stretch': {
    base: 'supine', prop: BENCH,
    kf: [{
      legN: [[16, -34], [176, 42], [170, 0]],
      legF: [[-172, 40], [-176, 56], [180, -20]],
      armN: [[-34, 26], [-4, 46]], armF: [[-150, 28], [-172, 18]],
    }],
  },
  'standing-marching': {
    base: 'standing', period: 800,
    kf: [
      { armN: [[30, 60], [10, 46]], armF: [[-150, 60], [-170, 46]] },
      { legN: [[20, -26], [186, 40], [0, -20]], armN: [[150, 60], [170, 46]], armF: [[-30, 60], [-10, 46]] },
    ],
  },

  // ---- Adductors ----
  'butterfly-stretch': {
    base: 'seatedFloor', ground: 176, yaw: -20, pitch: 14,
    kf: [{
      pelvis: [110, 162, 0],
      lumbar: [0, -85], thorax: [0, -82], neck: [0, -85],
      armN: [[50, 45], [-25, 48]], armF: [[-50, 45], [25, 48]],
      legN: [[55, 15], [-62, 1], [0, -30]], legF: [[-55, 15], [62, 1], [0, -30]],
    }],
  },
  'frog-stretch': {
    base: 'allFours', yaw: -28, pitch: 18,
    kf: [{
      pelvis: [146, 150, 0], lumbar: [180, -12], thorax: [180, -14],
      legN: [[62, 40], [16, 6], [0, 0]], legF: [[-62, 40], [-16, 6], [0, 0]],
    }],
  },
  'side-lunge-stretch': {
    base: 'standing', yaw: -40, pitch: 8,
    kf: [{
      pelvis: [104, 128, 0],
      legN: [[70, 32], [100, 78], [10, 0]],
      legF: [[-86, 40], [-90, 50], [0, 0]],
      armN: [[40, 50], [20, 60]], armF: [[-40, 50], [-20, 60]],
    }],
  },
  'seated-wide-leg-straddle': {
    base: 'seatedFloor', yaw: -34, pitch: 18,
    kf: [{
      lumbar: [0, -40], thorax: [0, -24], neck: [0, -16],
      legN: [[52, 10], [46, 8], [0, -40]], legF: [[-52, 10], [-46, 8], [0, -40]],
      armN: [[20, 24], [10, 30]], armF: [[-20, 24], [-10, 30]],
    }],
  },
  'standing-adductor-stretch': {
    base: 'standing', yaw: -40,
    kf: [{
      pelvis: [104, 130, 0],
      legN: [[74, 34], [102, 76], [10, 0]],
      legF: [[-84, 42], [-88, 52], [0, 0]],
      lumbar: [0, -80], armN: [[40, 56], [24, 66]], armF: [[-60, 40], [-70, 30]],
    }],
  },
  'lateral-lunges': {
    base: 'standing', period: 1000, yaw: -40,
    kf: [
      { armN: [[30, 40], [16, 50]], armF: [[-30, 40], [-16, 50]] },
      {
        pelvis: [104, 128, 0],
        legN: [[70, 32], [100, 78], [10, 0]], legF: [[-86, 40], [-90, 50], [0, 0]],
        armN: [[30, 40], [16, 50]], armF: [[-30, 40], [-16, 50]],
      },
    ],
  },

  // ---- Abductors ----
  'cross-leg-forward-fold': {
    base: 'fold',
    kf: [{ legN: [[100, 84], [96, 87], [0, 0]], legF: [[-70, 84], [-80, 87], [0, 0]] }],
  },
  'it-band-foam-rolling': {
    base: 'sideLying', yaw: -30,
    kf: [{
      pelvis: [100, 162, 0],
      armF: [[80, 30], [90, 78]], armN: [[60, 20], [40, 40]],
      legN: [[178, 2], [178, 0], [186, -14]], legF: [[176, 8], [176, 4], [186, -10]],
    }],
  },
  'lying-cross-body-hip-stretch': {
    base: 'supine',
    kf: [{
      legN: [[130, 4], [172, 16], [176, 0]],
      armN: [[150, -4], [142, -10]], armF: [[-150, -4], [-142, -10]],
      neck: [-36, 0],
    }],
  },
  'standing-it-band-stretch': {
    base: 'standing', prop: WALL, yaw: -34,
    kf: [{
      lumbar: [-84, -80], thorax: [-80, -80],
      legN: [[-70, 82], [-80, 86], [0, 0]], legF: [[-110, 84], [-100, 87], [0, 0]],
      armN: [[10, -30], [6, -44]], armF: [[-100, 70], [-96, 78]],
    }],
  },
  'standing-hip-abduction-kicks': {
    base: 'standing', prop: WALL, period: 900, yaw: -34,
    kf: [
      { armN: [[10, -20], [6, -34]] },
      { armN: [[10, -20], [6, -34]], legF: [[-80, 40], [-84, 46], [0, 0]] },
    ],
  },

  // ---- Quadriceps ----
  'standing-quad-stretch': {
    base: 'standing', prop: WALL, yaw: -30,
    kf: [{
      legN: [[150, 76], [160, -10], [170, -40]],
      armN: [[140, 56], [160, 20]], armF: [[-10, -30], [-6, -44]],
    }],
  },
  'kneeling-quad-stretch': {
    base: 'halfKneeling',
    kf: [{
      legF: [[-160, 60], [168, -20], [170, -40]],
      armN: [[150, 50], [166, 16]], armF: ARM_DOWN_F,
      lumbar: [0, -84],
    }],
  },
  'prone-quad-stretch': {
    base: 'prone',
    kf: [{
      legN: [[176, 6], [170, -66], [176, -60]],
      armN: [[164, 20], [172, -26]], armF: [[-160, 26], [-174, 40]],
      lumbar: [0, -14], thorax: [0, -20], neck: [0, -24],
    }],
  },
  'side-lying-quad-stretch': {
    base: 'sideLying', yaw: -30,
    kf: [{
      legN: [[172, -20], [166, -60], [176, -50]],
      armN: [[150, -10], [170, -40]], armF: [[40, -20], [20, -40]],
    }],
  },
  'foam-roller-quad-release': {
    base: 'prone',
    kf: [{
      pelvis: [116, 166, 0],
      lumbar: [0, -20], thorax: [0, -28], neck: [0, -30],
      armN: [[158, 30], [6, 62]], armF: [[-158, 30], [-6, 62]],
    }],
  },
  'butt-kicks': {
    base: 'standing', period: 700,
    kf: [
      { armN: [[30, 60], [14, 46]], armF: [[-150, 60], [-166, 46]] },
      { legN: [[140, 80], [160, -30], [170, -50]], armN: [[150, 60], [166, 46]], armF: [[-30, 60], [-14, 46]] },
    ],
  },

  // ---- Hamstrings ----
  'standing-forward-fold': { base: 'fold', kf: [{}] },
  'seated-forward-fold': {
    base: 'seatedFloor', yaw: -26, pitch: 14,
    kf: [{
      lumbar: [0, -40], thorax: [0, -18], neck: [0, -6],
      armN: [[10, 14], [6, 24]], armF: [[-10, 14], [-6, 24]],
    }],
  },
  'single-leg-forward-fold': {
    base: 'fold', prop: BENCH, yaw: -26,
    kf: [{
      pelvis: [96, 116, 0],
      legN: [[8, 26], [4, 24], [0, -40]],
      legF: [[-96, 82], [-94, 86], [0, 0]],
      armN: [[16, 40], [10, 52]], armF: [[-16, 40], [-10, 52]],
    }],
  },
  'lying-hamstring-stretch-strap': {
    base: 'supine',
    kf: [{
      legN: [[6, -64], [4, -70], [10, -30]],
      armN: [[-30, -16], [-10, -34]], armF: [[-150, 20], [-170, 10]],
    }],
  },
  'doorway-hamstring-stretch': {
    base: 'supine', prop: WALL,
    kf: [{
      legN: [[4, -78], [4, -84], [10, -40]],
      armN: [[150, 20], [140, 14]], armF: [[-150, 20], [-140, 14]],
    }],
  },
  'dynamic-leg-swings': {
    base: 'standing', prop: WALL, period: 800, yaw: -30,
    kf: [
      { legN: [[20, 50], [14, 64], [0, -10]], armN: [[10, -20], [6, -34]] },
      { legN: [[168, 66], [174, 78], [0, -10]], armN: [[10, -20], [6, -34]] },
    ],
  },

  // ---- Calves ----
  'standing-calf-stretch': {
    base: 'standing', prop: WALL, yaw: -18,
    kf: [{
      pelvis: [104, 116, 0],
      lumbar: [0, -78], thorax: [0, -72], neck: [0, -70],
      armN: [[1, 12], [1, -37]], armF: [[-1, 12], [-1, -37]],
      legN: [[5, 57], [186, 84], [0, 0]], legF: [[183, 66], [183, 66], [0, 0]],
    }],
  },
  'bent-knee-calf-stretch': {
    base: 'standing', prop: WALL, yaw: -18,
    kf: [{
      pelvis: [104, 124, 0],
      lumbar: [0, -76], thorax: [0, -70], neck: [0, -68],
      armN: [[1, 16], [1, -32]], armF: [[-1, 16], [-1, -32]],
      legN: [[5, 48], [186, 80], [0, 0]], legF: [[178, 50], [186, 76], [0, 0]],
    }],
  },
  'downward-dog-calf-pumps': {
    base: 'allFours', period: 1000, yaw: -26, pitch: 12,
    kf: [
      {
        pelvis: [150, 108, 0], lumbar: [180, -4], thorax: [180, -4], neck: [180, 10],
        legN: [[94, 72], [94, 78], [0, 0]], legF: [[-94, 66], [-94, 72], [0, -14]],
      },
      {
        pelvis: [150, 108, 0], lumbar: [180, -4], thorax: [180, -4], neck: [180, 10],
        legN: [[94, 66], [94, 72], [0, -14]], legF: [[-94, 72], [-94, 78], [0, 0]],
      },
    ],
  },
  'seated-calf-stretch-towel': {
    base: 'seatedFloor', yaw: -26, pitch: 14,
    kf: [{
      lumbar: [0, -60], thorax: [0, -46], neck: [0, -40],
      armN: [[12, 10], [8, 16]], armF: [[-12, 10], [-8, 16]],
      legN: [[5, 10], [0, 6], [0, -60]],
    }],
  },
  'step-edge-calf-stretch': {
    base: 'standing', prop: BENCH, yaw: -24,
    kf: [{
      pelvis: [104, 106, 0],
      legN: [[95, 84], [95, 86], [0, 30]], legF: [[-95, 84], [-95, 86], [0, 30]],
      armN: [[20, 30], [10, 20]], armF: [[-20, 30], [-10, 20]],
    }],
  },
  'calf-raises': {
    base: 'standing', period: 800,
    kf: [
      { armN: [[20, 40], [10, 30]], armF: [[-20, 40], [-10, 30]] },
      {
        pelvis: [104, 102, 0],
        legN: [[95, 86], [95, 88], [0, 40]], legF: [[-95, 86], [-95, 88], [0, 40]],
        armN: [[20, 40], [10, 30]], armF: [[-20, 40], [-10, 30]],
      },
    ],
  },

  // ---- Ankles ----
  'ankle-circles': {
    base: 'standing', period: 900,
    kf: [
      { legN: [[14, 60], [8, 70], [10, -30]], armN: [[30, 50], [16, 40]], armF: [[-30, 50], [-16, 40]] },
      { legN: [[14, 60], [8, 70], [40, 20]], armN: [[30, 50], [16, 40]], armF: [[-30, 50], [-16, 40]] },
    ],
  },
  'kneeling-ankle-dorsiflexion-stretch': {
    base: 'halfKneeling', prop: WALL, yaw: -24,
    kf: [{ pelvis: [116, 146, 0], legN: [[6, 20], [190, 76], [0, 0]], lumbar: [0, -70], thorax: [0, -74] }],
  },
  'plantar-fascia-stretch': {
    base: 'seatedChair', prop: BENCH, yaw: -28,
    kf: [{
      lumbar: [0, -70], thorax: [0, -60], neck: [0, -58],
      legN: [[44, 18], [-48, 8], [-40, -24]],
      armN: [[40, 62], [16, 60]], armF: [[-40, 62], [-16, 60]],
    }],
  },
  'toe-spread-stretch': {
    base: 'seatedFloor', yaw: -22, pitch: 16,
    kf: [{
      lumbar: [0, -66], thorax: [0, -56], neck: [0, -52],
      legN: [[30, 22], [-40, 14], [0, -50]], legF: [[-30, 22], [40, 14], [0, -50]],
      armN: [[26, 44], [10, 50]], armF: [[-26, 44], [-10, 50]],
    }],
  },
  'ball-roll-foot-massage': {
    base: 'seatedChair', prop: BENCH,
    kf: [{ legN: [[10, 14], [186, 84], [0, 20]], armN: [[60, 70], [30, 60]], armF: [[-60, 70], [-30, 60]] }],
  },
  'ankle-alphabet': {
    base: 'seatedChair', prop: BENCH, period: 900,
    kf: [
      { legN: [[12, 6], [4, 10], [0, -30]] },
      { legN: [[12, 6], [4, 10], [30, 20]] },
    ],
  },

  // ---- Full Body ----
  'worlds-greatest-stretch': {
    base: 'halfKneeling', period: 1600, yaw: -28,
    kf: [
      {
        pelvis: [108, 148, 0], legF: [[-176, 30], [178, 10], [178, -10]],
        armN: [[30, 60], [16, 76]], armF: [[-20, 62], [-10, 78]],
      },
      {
        pelvis: [108, 148, 0], legF: [[-176, 30], [178, 10], [178, -10]],
        armN: [[86, -66], [90, -78]], armF: [[-20, 62], [-10, 78]], shoulderAxis: [90, -40], neck: [80, -60],
      },
    ],
  },
  'inchworm': {
    base: 'fold', period: 1500, yaw: -24,
    kf: [
      { armN: [[80, 84], [86, 88]], armF: [[-80, 84], [-86, 88]] },
      {
        pelvis: [150, 130, 0], lumbar: [180, -6], thorax: [180, -6], neck: [180, -2],
        armN: [[90, 84], [-90, 88]], armF: [[-90, 84], [90, 88]],
        legN: [[-6, 6], [-4, 4], [0, -20]], legF: [[6, 6], [4, 4], [0, -20]],
      },
    ],
  },
  'walking-lunge-with-twist': {
    base: 'halfKneeling', period: 1500, yaw: -28,
    kf: [
      { pelvis: [108, 146, 0], legF: [[-172, 40], [178, 16], [178, -6]], armN: [[40, 40], [20, 50]], armF: [[-40, 40], [-20, 50]] },
      {
        pelvis: [108, 146, 0], legF: [[-172, 40], [178, 16], [178, -6]],
        shoulderAxis: [40, 0], neck: [30, -80],
        armN: [[-20, 20], [-60, 10]], armF: [[-120, 20], [-40, 14]],
      },
    ],
  },
  'arm-circles': {
    base: 'standing', period: 800,
    kf: [
      { armN: [[80, -10], [84, -20]], armF: [[-80, -10], [-84, -20]] },
      { armN: [[80, 20], [84, 10]], armF: [[-80, 20], [-84, 10]] },
    ],
  },
  'standing-side-to-side-sway': {
    base: 'standing', period: 1100, yaw: -40,
    kf: [
      { pelvis: [104, 126, 0], legN: [[72, 32], [100, 76], [10, 0]], legF: [[-86, 40], [-90, 50], [0, 0]], lumbar: [70, -80] },
      { pelvis: [104, 126, 0], legN: [[86, 40], [90, 50], [0, 0]], legF: [[-72, 32], [-100, 76], [10, 0]], lumbar: [-70, -80] },
    ],
  },
  'sun-salutation-flow': {
    base: 'standing', period: 1700, yaw: -24,
    kf: [
      { armN: ARM_UP_N, armF: ARM_UP_F, lumbar: [180, -86], thorax: [180, -86] },
      {
        pelvis: [96, 112, 0], lumbar: [0, -24], thorax: [0, -12], neck: [0, 8],
        armN: [[90, 86], [90, 88]], armF: [[-90, 86], [-90, 88]],
      },
    ],
  },
  'deep-squat-hold': { base: 'squat', kf: [{}] },

  // ---- Massage Gun ----
  'massage-gun-neck': { base: 'standing', kf: [{ armN: [[70, -60], [140, -30]], neck: [40, -76] }] },
  'massage-gun-shoulders': { base: 'standing', kf: [{ armN: [[30, -30], [110, -14]] }] },
  'massage-gun-chest': { base: 'standing', kf: [{ armN: [[-30, 20], [-70, -16]] }] },
  'massage-gun-upper-back': { base: 'standing', kf: [{ armN: [[100, -66], [172, -6]] }] },
  'massage-gun-lats': { base: 'standing', kf: [{ armF: ARM_UP_F, armN: [[70, 10], [130, -14]], lumbar: [-70, -84] }] },
  'massage-gun-triceps': { base: 'standing', kf: [{ armF: [[-40, -50], [20, -66]], armN: [[-50, 10], [-110, -18]] }] },
  'massage-gun-biceps': { base: 'seatedChair', prop: BENCH, kf: [{ armF: [[-10, 10], [-6, 16]], armN: [[-40, 24], [-80, 20]] }] },
  'massage-gun-forearms': { base: 'seatedChair', prop: BENCH, kf: [{ armF: [[-6, 16], [-4, 10]], armN: [[-30, 34], [-70, 30]] }] },
  'massage-gun-grip': { base: 'seatedChair', prop: BENCH, kf: [{ armF: [[-8, 12], [-6, 6]], armN: [[-26, 30], [-64, 26]] }] },
  'massage-gun-abs': { base: 'standing', kf: [{ armN: [[-20, 36], [-50, 18]] }] },
  'massage-gun-obliques': { base: 'standing', kf: [{ armN: [[46, 40], [86, 30]], lumbar: [-60, -84] }] },
  'massage-gun-lower-back': { base: 'standing', kf: [{ armN: [[130, 40], [170, 20]] }] },
  'massage-gun-glutes': { base: 'standing', kf: [{ armN: [[140, 50], [176, 34]] }] },
  'massage-gun-hip-flexors': { base: 'standing', kf: [{ armN: [[-16, 56], [-40, 44]] }] },
  'massage-gun-adductors': {
    base: 'seatedFloor', yaw: -28, pitch: 16,
    kf: [{
      legN: [[56, 16], [-60, 2], [0, -30]],
      armN: [[40, 50], [10, 62]], armF: [[-40, 50], [-14, 60]],
      lumbar: [0, -78], thorax: [0, -74],
    }],
  },
  'massage-gun-abductors': {
    base: 'sideLying', yaw: -30,
    kf: [{ armF: [[80, 30], [90, 76]], armN: [[50, 10], [20, 34]] }],
  },
  'massage-gun-quads': { base: 'seatedChair', prop: BENCH, kf: [{ armN: [[16, 46], [10, 60]], armF: [[-40, 60], [-20, 66]] }] },
  'massage-gun-hamstrings': {
    base: 'prone',
    kf: [{
      lumbar: [0, -18], thorax: [0, -26], neck: [0, -28],
      armN: [[176, 30], [172, 56]], armF: [[-158, 30], [-6, 62]],
    }],
  },
  'massage-gun-calves': {
    base: 'seatedFloor', yaw: -26, pitch: 14,
    kf: [{
      lumbar: [0, -56], thorax: [0, -44], neck: [0, -40],
      legN: [[5, 10], [0, 6], [0, -50]],
      armN: [[10, 20], [4, 34]], armF: [[-14, 24], [-8, 38]],
    }],
  },
  'massage-gun-feet': {
    base: 'seatedChair', prop: BENCH, yaw: -28,
    kf: [{
      lumbar: [0, -70], thorax: [0, -60], neck: [0, -58],
      legN: [[44, 18], [-48, 8], [-40, -24]],
      armN: [[40, 60], [14, 58]], armF: [[-40, 62], [-16, 60]],
    }],
  },
  'massage-gun-full-body': { base: 'standing', kf: [{ armN: [[10, 62], [6, 76]], lumbar: [0, -80], thorax: [0, -84] }] },
}

// ---------------------------------------------------------------- resolution

/** Merge a keyframe patch onto its base pose. */
export function resolvePose(anim: StretchAnim, index: number): FigurePose {
  const base = BASES[anim.base]
  const patch = anim.kf[index] ?? {}
  return {
    pelvis: patch.pelvis ?? base.pelvis,
    hipAxis: patch.hipAxis ?? base.hipAxis,
    shoulderAxis: patch.shoulderAxis ?? base.shoulderAxis,
    lumbar: patch.lumbar ?? base.lumbar,
    thorax: patch.thorax ?? base.thorax,
    neck: patch.neck ?? base.neck,
    armN: patch.armN ?? base.armN,
    armF: patch.armF ?? base.armF,
    legN: patch.legN ?? base.legN,
    legF: patch.legF ?? base.legF,
  }
}

/** A held stretch gets a second pose generated so it breathes rather than freezing. */
function breathe(p: FigurePose): FigurePose {
  return {
    ...p,
    lumbar: [p.lumbar[0], p.lumbar[1] + 2.5],
    thorax: [p.thorax[0], p.thorax[1] + 2.5],
    neck: [p.neck[0], p.neck[1] + 1.5],
  }
}

export function keyframesFor(anim: StretchAnim): FigurePose[] {
  const poses = anim.kf.map((_, i) => resolvePose(anim, i))
  return poses.length > 1 ? poses : [poses[0], breathe(poses[0])]
}

export function stageFor(anim: StretchAnim) {
  const base = BASES[anim.base]
  return {
    ground: anim.ground ?? base.ground,
    yaw: anim.yaw ?? base.yaw,
    pitch: anim.pitch ?? base.pitch,
    period: anim.period ?? 3200,
    prop: anim.prop,
  }
}

export function hasStretchAnimation(stretchId: string | undefined): boolean {
  return !!stretchId && stretchId in STRETCH_ANIMATIONS
}
