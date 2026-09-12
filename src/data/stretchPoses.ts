import type { StretchAnimationEntry } from '../components/StretchAnimation'

/**
 * Pose data for every stretch in STRETCH_LIBRARY. Angles are degrees where
 * 0 = pointing right, 90 = pointing down, -90 = pointing up (see
 * StretchAnimation.tsx). Passive entries omit `activePose` and get an
 * automatic subtle "breathing" crossfade; active entries provide an explicit
 * second pose to crossfade to, suggesting repeated motion.
 */
export const STRETCH_ANIMATIONS: Record<string, StretchAnimationEntry> = {
  // ---- Neck ----
  'neck-side-bend': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 40 } },
  'neck-rotation-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 20 } },
  'chin-tuck': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 55 } },
  'neck-flexion-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 100 } },
  'levator-scapulae-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 75 } },
  'neck-circles': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85, headTilt: 40 },
    activePose: { headTilt: -40 },
  },

  // ---- Shoulders ----
  'cross-body-shoulder-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 175, legL: 95, legR: 85 } },
  'sleeper-stretch': { pose: { orientation: 'lying', torsoAngle: 0, armL: -80, armR: 0, legL: 15, legR: 20 } },
  'shoulder-external-rotation-stretch': { pose: { orientation: 'standing', torsoAngle: -100, armL: 95, armR: -20, legL: 95, legR: 80, prop: 'wall' } },
  'wall-shoulder-flexion-stretch': { pose: { orientation: 'standing', torsoAngle: -40, armL: -75, armR: -65, legL: 100, legR: 80, prop: 'wall' } },
  'band-shoulder-pass-through': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: -90, armR: -90, legL: 95, legR: 85 },
    activePose: { armL: 100, armR: 80 },
  },
  'shoulder-rolls': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 85, legL: 95, legR: 85 },
    activePose: { armL: 70, armR: 60 },
  },
  'shoulder-blade-squeezes': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 95, legR: 85 },
    activePose: { torsoAngle: -95, armL: 85, armR: 95 },
  },

  // ---- Chest ----
  'doorway-chest-stretch': { pose: { orientation: 'standing', torsoAngle: -80, armL: 95, armR: -5, legL: 110, legR: 70, prop: 'wall' } },
  'wall-pec-stretch-high': { pose: { orientation: 'standing', torsoAngle: -75, armL: 95, armR: -100, legL: 95, legR: 85, prop: 'wall' } },
  'floor-chest-opener': { pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 175, legR: 185 } },
  'clasped-hands-chest-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 140, armR: 40, legL: 95, legR: 85 } },
  'foam-roller-chest-opener': { pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 175, legR: 185 } },
  'standing-chest-opener-pulses': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 130, armR: 50, legL: 95, legR: 85 },
    activePose: { armL: 150, armR: 30 },
  },

  // ---- Upper Back ----
  'cat-cow': {
    pose: { orientation: 'all-fours', torsoAngle: 170, armL: 90, armR: 90, legL: 90, legR: 90, headTilt: -10 },
    activePose: { torsoAngle: 200, headTilt: 30 },
  },
  'thread-the-needle': { pose: { orientation: 'all-fours', torsoAngle: 180, armL: 90, armR: 150, legL: 90, legR: 90 } },
  'open-book-stretch': { pose: { orientation: 'lying', torsoAngle: 0, armL: -90, armR: 0, legL: 100, legR: 110 } },
  'childs-pose': { pose: { orientation: 'kneeling', torsoAngle: 30, armL: 20, armR: 15, legL: 100, legR: 80 } },
  'seated-thoracic-rotation': { pose: { orientation: 'seated', torsoAngle: -90, armL: 120, armR: 60, legL: 100, legR: 80, prop: 'chair' } },
  'foam-roller-thoracic-extension': { pose: { orientation: 'lying', torsoAngle: 160, armL: -60, armR: -100, legL: 100, legR: 80, headTilt: -20 } },
  'thoracic-rotation-reach': {
    pose: { orientation: 'all-fours', torsoAngle: 180, armL: 90, armR: -60, legL: 90, legR: 90 },
    activePose: { armR: -140 },
  },

  // ---- Lats ----
  'overhead-lat-stretch': { pose: { orientation: 'standing', torsoAngle: -110, armL: -95, armR: -85, legL: 95, legR: 85 } },
  'kneeling-lat-stretch': { pose: { orientation: 'kneeling', torsoAngle: 10, armL: 10, armR: 30, legL: 100, legR: 80, prop: 'chair' } },
  'hanging-lat-stretch': { pose: { orientation: 'hanging', torsoAngle: -90, armL: -90, armR: -90, legL: 90, legR: 90, prop: 'bar' } },
  'doorway-lat-stretch': { pose: { orientation: 'standing', torsoAngle: -60, armL: 95, armR: -95, legL: 95, legR: 85, prop: 'wall' } },
  'standing-side-reach-pulses': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: -90, armR: 85, legL: 95, legR: 85 },
    activePose: { torsoAngle: -110 },
  },

  // ---- Triceps ----
  'overhead-triceps-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: -150, armR: 85, legL: 95, legR: 85 } },
  'behind-back-triceps-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: -120, armR: 130, legL: 95, legR: 85 } },
  'triceps-wall-stretch': { pose: { orientation: 'standing', torsoAngle: -85, armL: -100, armR: 95, legL: 95, legR: 85, prop: 'wall' } },
  'overhead-triceps-pulses': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: -150, armR: 85, legL: 95, legR: 85 },
    activePose: { armL: -170 },
  },

  // ---- Biceps ----
  'wall-bicep-stretch': { pose: { orientation: 'standing', torsoAngle: -70, armL: 95, armR: -175, legL: 95, legR: 85, prop: 'wall' } },
  'extended-arm-bicep-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 175, legL: 95, legR: 85 } },
  'doorway-bicep-stretch': { pose: { orientation: 'standing', torsoAngle: -75, armL: 95, armR: -100, legL: 95, legR: 85, prop: 'wall' } },
  'arm-swings': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 60, armR: 120, legL: 95, legR: 85 },
    activePose: { armL: 120, armR: 60 },
  },

  // ---- Forearms ----
  'wrist-flexor-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 10, legL: 95, legR: 85 } },
  'wrist-extensor-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: -5, legL: 95, legR: 85 } },
  'prayer-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 60, armR: 120, legL: 95, legR: 85 } },
  'wrist-circles': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 0, armR: 180, legL: 95, legR: 85 },
    activePose: { armL: 20, armR: 160 },
  },
  'wall-wrist-flexor-stretch': { pose: { orientation: 'standing', torsoAngle: -30, armL: 80, armR: 100, legL: 95, legR: 85, prop: 'wall' } },
  'wrist-flexion-extension-pumps': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 5, armR: 175, legL: 95, legR: 85 },
    activePose: { armL: -15, armR: 195 },
  },

  // ---- Finger & Grip ----
  'finger-extension-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 10, legL: 95, legR: 85 } },
  'tendon-glide': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 0, legL: 95, legR: 85 },
    activePose: { armR: 20 },
  },
  'rubber-band-finger-extension': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 5, legL: 95, legR: 85 },
    activePose: { armR: -5 },
  },
  'thumb-extension-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 15, legL: 95, legR: 85 } },
  'finger-walks-on-wall': {
    pose: { orientation: 'standing', torsoAngle: -80, armL: 95, armR: -80, legL: 95, legR: 85, prop: 'wall' },
    activePose: { armR: -110 },
  },

  // ---- Abs ----
  'cobra-stretch': { pose: { orientation: 'lying', torsoAngle: -55, armL: 75, armR: 105, legL: 165, legR: 175 } },
  'standing-back-extension': { pose: { orientation: 'standing', torsoAngle: -110, armL: 130, armR: 50, legL: 95, legR: 85 } },
  'kneeling-ab-stretch': { pose: { orientation: 'kneeling', torsoAngle: -110, armL: -100, armR: -80, legL: 100, legR: 80 } },
  'camel-pose': { pose: { orientation: 'kneeling', torsoAngle: -130, armL: 120, armR: 60, legL: 100, legR: 80 } },
  'standing-cat-cow': {
    pose: { orientation: 'standing', torsoAngle: -100, armL: 70, armR: 110, legL: 95, legR: 85 },
    activePose: { torsoAngle: -75 },
  },

  // ---- Obliques ----
  'standing-side-bend': { pose: { orientation: 'standing', torsoAngle: -110, armL: -95, armR: 85, legL: 95, legR: 85 } },
  'seated-side-reach': { pose: { orientation: 'seated', torsoAngle: -110, armL: -90, armR: 40, legL: 100, legR: 80, prop: 'chair' } },
  'side-plank-reach-through': { pose: { orientation: 'lying', torsoAngle: -20, armL: -70, armR: 110, legL: 175, legR: 185 } },
  'standing-trunk-rotations': {
    pose: { orientation: 'standing', torsoAngle: -80, armL: 60, armR: 120, legL: 95, legR: 85 },
    activePose: { torsoAngle: -100, armL: 120, armR: 60 },
  },

  // ---- Lower Back ----
  'knee-to-chest-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: -70, armR: -50, legL: -60, legR: 185 } },
  'double-knee-to-chest': { pose: { orientation: 'lying', torsoAngle: 180, armL: -50, armR: -70, legL: -60, legR: -70 } },
  'supine-spinal-twist': { pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 140, legR: 130 } },
  'standing-lower-back-rotation': { pose: { orientation: 'standing', torsoAngle: -90, armL: 70, armR: 110, legL: 95, legR: 85 } },
  'sphinx-pose': { pose: { orientation: 'lying', torsoAngle: -45, armL: 60, armR: 100, legL: 165, legR: 175 } },
  'seated-cat-stretch': { pose: { orientation: 'seated', torsoAngle: -60, armL: 80, armR: 100, legL: 100, legR: 80, prop: 'chair' } },
  'pelvic-tilts': {
    pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 140, legR: 150 },
    activePose: { torsoAngle: 170 },
  },

  // ---- Glutes ----
  'pigeon-pose': { pose: { orientation: 'seated', torsoAngle: -60, armL: 30, armR: 50, legL: 150, legR: 15 } },
  'figure-four-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: -60, armR: -75, legL: -40, legR: -55 } },
  'seated-figure-four-stretch': { pose: { orientation: 'seated', torsoAngle: -70, armL: 60, armR: 90, legL: 130, legR: 100, prop: 'chair' } },
  'standing-figure-four-stretch': { pose: { orientation: 'standing', torsoAngle: -95, armL: 100, armR: 95, legL: 130, legR: 95, prop: 'wall' } },
  'lying-piriformis-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: -60, armR: -70, legL: -30, legR: -50 } },
  'half-kneeling-glute-stretch': { pose: { orientation: 'kneeling', torsoAngle: -90, armL: 95, armR: 85, legL: 100, legR: 20 } },
  'fire-hydrants': {
    pose: { orientation: 'all-fours', torsoAngle: 180, armL: 90, armR: 90, legL: 90, legR: 90 },
    activePose: { legR: 30 },
  },

  // ---- Hip Flexors ----
  'couch-stretch': { pose: { orientation: 'kneeling', torsoAngle: -85, armL: 95, armR: 85, legL: 140, legR: 15, prop: 'chair' } },
  'kneeling-hip-flexor-stretch': { pose: { orientation: 'kneeling', torsoAngle: -80, armL: 95, armR: 85, legL: 130, legR: 20 } },
  'standing-hip-flexor-reach': { pose: { orientation: 'standing', torsoAngle: -110, armL: 95, armR: -90, legL: 110, legR: 90, prop: 'wall' } },
  'half-kneeling-hip-flexor-rock': {
    pose: { orientation: 'kneeling', torsoAngle: -95, armL: 95, armR: 85, legL: 130, legR: 20 },
    activePose: { torsoAngle: -75, legL: 140, legR: 10 },
  },
  'low-lunge-stretch': { pose: { orientation: 'kneeling', torsoAngle: -70, armL: 95, armR: 85, legL: 140, legR: 20 } },
  'reclined-hip-flexor-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: -70, armR: -80, legL: 150, legR: -60 } },
  'standing-marching': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 70, armR: 110, legL: 90, legR: 90 },
    activePose: { legL: -30 },
  },

  // ---- Adductors ----
  'butterfly-stretch': { pose: { orientation: 'seated', torsoAngle: -70, armL: 90, armR: 70, legL: 160, legR: 20 } },
  'frog-stretch': { pose: { orientation: 'all-fours', torsoAngle: 190, armL: 90, armR: 90, legL: 60, legR: 120 } },
  'side-lunge-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 50, legR: 130 } },
  'seated-wide-leg-straddle': { pose: { orientation: 'seated', torsoAngle: -40, armL: 15, armR: 165, legL: 160, legR: 20 } },
  'standing-adductor-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: -60, legL: 50, legR: 130, prop: 'wall' } },
  'lateral-lunges': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 90, legR: 90 },
    activePose: { legL: 50, legR: 130 },
  },

  // ---- Abductors ----
  'cross-leg-forward-fold': { pose: { orientation: 'standing', torsoAngle: -30, armL: 10, armR: 170, legL: 95, legR: 100 } },
  'it-band-foam-rolling': { pose: { orientation: 'lying', torsoAngle: 0, armL: 20, armR: -70, legL: 5, legR: 175 } },
  'lying-cross-body-hip-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 120, legR: 185 } },
  'standing-it-band-stretch': { pose: { orientation: 'standing', torsoAngle: -100, armL: 100, armR: -90, legL: 60, legR: 95, prop: 'wall' } },
  'standing-hip-abduction-kicks': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: -85, legL: 90, legR: 90, prop: 'wall' },
    activePose: { legR: 50 },
  },

  // ---- Quadriceps ----
  'standing-quad-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: -90, armR: 150, legL: 90, legR: 150, prop: 'wall' } },
  'kneeling-quad-stretch': { pose: { orientation: 'kneeling', torsoAngle: -85, armL: 95, armR: 170, legL: 160, legR: 20 } },
  'prone-quad-stretch': { pose: { orientation: 'lying', torsoAngle: -30, armL: 75, armR: 140, legL: 175, legR: -100 } },
  'side-lying-quad-stretch': { pose: { orientation: 'lying', torsoAngle: 0, armL: -60, armR: 120, legL: 10, legR: -70 } },
  'foam-roller-quad-release': { pose: { orientation: 'lying', torsoAngle: -45, armL: 60, armR: 100, legL: 165, legR: 175 } },
  'butt-kicks': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 70, armR: 110, legL: 90, legR: 90 },
    activePose: { legR: -120 },
  },

  // ---- Hamstrings ----
  'standing-forward-fold': { pose: { orientation: 'standing', torsoAngle: -20, armL: 10, armR: 170, legL: 95, legR: 85 } },
  'seated-forward-fold': { pose: { orientation: 'seated', torsoAngle: -20, armL: 15, armR: 165, legL: 170, legR: 180 } },
  'single-leg-forward-fold': { pose: { orientation: 'standing', torsoAngle: -30, armL: 10, armR: 170, legL: 95, legR: 160, prop: 'chair' } },
  'lying-hamstring-stretch-strap': { pose: { orientation: 'lying', torsoAngle: 180, armL: -70, armR: -80, legL: -70, legR: 185 } },
  'doorway-hamstring-stretch': { pose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: -85, legR: 185, prop: 'wall' } },
  'dynamic-leg-swings': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: -85, legL: 90, legR: 90, prop: 'wall' },
    activePose: { legR: 140 },
  },

  // ---- Calves ----
  'standing-calf-stretch': {
    pose: { orientation: 'standing', torsoAngle: -65, armL: -15, armR: -8, legL: 100, legR: 80, prop: 'wall' },
  },
  'bent-knee-calf-stretch': { pose: { orientation: 'standing', torsoAngle: -65, armL: -15, armR: -8, legL: 105, legR: 75, prop: 'wall' } },
  'downward-dog-calf-pumps': {
    pose: { orientation: 'all-fours', torsoAngle: 140, armL: 90, armR: 90, legL: 70, legR: 110 },
    activePose: { legL: 110, legR: 70 },
  },
  'seated-calf-stretch-towel': { pose: { orientation: 'seated', torsoAngle: -70, armL: 40, armR: 160, legL: 175, legR: 185 } },
  'step-edge-calf-stretch': { pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 95, legR: 85, prop: 'chair' } },
  'calf-raises': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 95, legR: 85 },
    activePose: { torsoAngle: -95 },
  },

  // ---- Ankles ----
  'ankle-circles': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 80, legL: 95, legR: 85 },
    activePose: { legR: 100 },
  },
  'kneeling-ankle-dorsiflexion-stretch': { pose: { orientation: 'kneeling', torsoAngle: -70, armL: 95, armR: 85, legL: 130, legR: 30, prop: 'wall' } },
  'plantar-fascia-stretch': { pose: { orientation: 'seated', torsoAngle: -60, armL: 90, armR: 140, legL: 130, legR: 100 } },
  'toe-spread-stretch': { pose: { orientation: 'seated', torsoAngle: -70, armL: 60, armR: 120, legL: 175, legR: 185 } },
  'ball-roll-foot-massage': { pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 70, legL: 100, legR: 85 } },
  'deep-squat-hold': { pose: { orientation: 'seated', torsoAngle: -90, armL: 130, armR: 50, legL: 140, legR: 40 } },
  'ankle-alphabet': {
    pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 70, legL: 100, legR: 85 },
    activePose: { legR: 110 },
  },

  // ---- Full Body ----
  'worlds-greatest-stretch': {
    pose: { orientation: 'kneeling', torsoAngle: -80, armL: -60, armR: 60, legL: 140, legR: 20 },
    activePose: { torsoAngle: -100, armR: -90 },
  },
  'inchworm': {
    pose: { orientation: 'standing', torsoAngle: -20, armL: 10, armR: 170, legL: 95, legR: 85 },
    activePose: { orientation: 'lying', torsoAngle: 180, armL: 90, armR: -90, legL: 175, legR: 185 },
  },
  'walking-lunge-with-twist': {
    pose: { orientation: 'kneeling', torsoAngle: -80, armL: 60, armR: 120, legL: 140, legR: 20 },
    activePose: { torsoAngle: -70, armL: 130, armR: 50 },
  },
  'arm-circles': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: 170, armR: -10, legL: 95, legR: 85 },
    activePose: { armL: 190, armR: -10 },
  },
  'standing-side-to-side-sway': {
    pose: { orientation: 'standing', torsoAngle: -100, armL: 100, armR: 80, legL: 50, legR: 130 },
    activePose: { torsoAngle: -80, legL: 130, legR: 50 },
  },
  'sun-salutation-flow': {
    pose: { orientation: 'standing', torsoAngle: -90, armL: -100, armR: -80, legL: 95, legR: 85 },
    activePose: { torsoAngle: -20, armL: 10, armR: 170 },
  },

  // ---- Massage Gun Releases ----
  'massage-gun-neck': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: -40, legL: 95, legR: 85, headTilt: 10 } },
  'massage-gun-shoulders': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: -20, legL: 95, legR: 85 } },
  'massage-gun-chest': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 20, legL: 95, legR: 85 } },
  'massage-gun-upper-back': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 130, legL: 95, legR: 85 } },
  'massage-gun-lats': { pose: { orientation: 'standing', torsoAngle: -90, armL: -90, armR: 60, legL: 95, legR: 85 } },
  'massage-gun-triceps': { pose: { orientation: 'standing', torsoAngle: -90, armL: -150, armR: 170, legL: 95, legR: 85 } },
  'massage-gun-biceps': { pose: { orientation: 'seated', torsoAngle: -90, armL: 10, armR: 50, legL: 100, legR: 80, prop: 'chair' } },
  'massage-gun-forearms': { pose: { orientation: 'seated', torsoAngle: -90, armL: 5, armR: 40, legL: 100, legR: 80, prop: 'chair' } },
  'massage-gun-grip': { pose: { orientation: 'seated', torsoAngle: -90, armL: 10, armR: 30, legL: 100, legR: 80, prop: 'chair' } },
  'massage-gun-abs': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 30, legL: 95, legR: 85 } },
  'massage-gun-obliques': { pose: { orientation: 'standing', torsoAngle: -90, armL: 100, armR: 60, legL: 95, legR: 85 } },
  'massage-gun-lower-back': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 140, legL: 95, legR: 85 } },
  'massage-gun-glutes': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 150, legL: 95, legR: 85 } },
  'massage-gun-hip-flexors': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 50, legL: 95, legR: 85 } },
  'massage-gun-adductors': { pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 100, legL: 140, legR: 40 } },
  'massage-gun-abductors': { pose: { orientation: 'lying', torsoAngle: 0, armL: 20, armR: -60, legL: 10, legR: 170 } },
  'massage-gun-quads': { pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 70, legL: 100, legR: 85 } },
  'massage-gun-hamstrings': { pose: { orientation: 'lying', torsoAngle: -20, armL: 75, armR: 140, legL: 165, legR: 175 } },
  'massage-gun-calves': { pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 110, legL: 175, legR: 85 } },
  'massage-gun-feet': { pose: { orientation: 'seated', torsoAngle: -90, armL: 90, armR: 150, legL: 170, legR: 85 } },
  'massage-gun-full-body': { pose: { orientation: 'standing', torsoAngle: -90, armL: 95, armR: 90, legL: 95, legR: 85 } },
}
