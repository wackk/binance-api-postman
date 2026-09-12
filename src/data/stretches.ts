import type { Stretch, StretchEquipment } from '../types'

const st = (
  id: string,
  name: string,
  targetArea: string,
  equipment: StretchEquipment,
  defaultDurationSeconds: number,
  instructions: string[],
  cue?: string,
): Stretch => ({ id, name, targetArea, equipment, defaultDurationSeconds, instructions, cue })

export const STRETCH_LIBRARY: Stretch[] = [
  // ---- Neck ----
  st('neck-side-bend', 'Neck Side Stretch', 'Neck', 'None', 30, [
    'Sit or stand tall with your shoulders relaxed and down.',
    'Gently tilt your right ear toward your right shoulder until you feel a stretch on the left side of your neck.',
    'Hold, then switch sides.',
  ], 'Let gravity do the work — avoid pulling hard with your hand.'),
  st('neck-rotation-stretch', 'Neck Rotation Stretch', 'Neck', 'None', 30, [
    'Sit or stand tall with your chin level.',
    'Slowly turn your head to look over your right shoulder as far as comfortable.',
    'Hold, feeling a stretch along the side of your neck, then return to center and repeat on the left.',
  ]),
  st('chin-tuck', 'Chin Tuck', 'Neck', 'None', 20, [
    'Sit or stand with a tall spine.',
    'Draw your chin straight back, creating a "double chin," without tilting your head down.',
    'Hold briefly, then release and repeat for reps.',
  ], 'Think "tall and back," not "down."'),
  st('neck-flexion-stretch', 'Neck Flexion Stretch', 'Neck', 'None', 30, [
    'Sit tall and interlace your fingers behind your head.',
    'Gently guide your chin toward your chest, feeling a stretch down the back of your neck.',
    'Hold without forcing, keeping your shoulders relaxed.',
  ]),
  st('levator-scapulae-stretch', 'Levator Scapulae Stretch', 'Neck', 'None', 30, [
    'Sit tall and turn your head about 45° to one side.',
    'Tilt your chin down toward your armpit on that side.',
    'Use a light hand-assist on the back of your head if needed, hold, then switch sides.',
  ]),

  // ---- Shoulders ----
  st('cross-body-shoulder-stretch', 'Cross-Body Shoulder Stretch', 'Shoulders', 'None', 30, [
    'Bring one arm straight across your chest at shoulder height.',
    'Use your other arm to gently pull it closer to your body.',
    'Hold, feeling the stretch in the back of the shoulder, then switch sides.',
  ]),
  st('sleeper-stretch', 'Sleeper Stretch', 'Shoulders', 'None', 30, [
    'Lie on your side with your bottom arm out in front at 90° and the elbow bent 90°.',
    'Use your top hand to gently press the bottom forearm down toward the floor.',
    'Hold, feeling a stretch in the back of the shoulder, then switch sides.',
  ], 'Stop at a gentle stretch, not pain — this one is easy to overdo.'),
  st('shoulder-external-rotation-stretch', 'Doorway External Rotation Stretch', 'Shoulders', 'Wall', 30, [
    'Stand in a doorway with your elbow bent 90° and forearm against the frame.',
    'Rotate your body away from that arm until you feel a stretch in the front of the shoulder.',
    'Hold, then switch sides.',
  ]),
  st('wall-shoulder-flexion-stretch', 'Wall Shoulder Flexion Stretch', 'Shoulders', 'Wall', 30, [
    'Face a wall and walk your fingers up it as high as you comfortably can.',
    'Let your chest sink toward the wall while keeping your arm extended.',
    'Hold, feeling a stretch through the front of the shoulder and lat, then lower and repeat.',
  ]),
  st('band-shoulder-pass-through', 'Shoulder Pass-Through', 'Shoulders', 'Strap or Towel', 45, [
    'Hold a towel or resistance band with a wide overhand grip in front of you.',
    'Keeping your arms straight, raise it overhead and continue back behind you as far as comfortable.',
    'Reverse the motion back to the front, moving slowly and smoothly for the set duration.',
  ], 'Widen your grip if your shoulders feel pinched.'),
  st('shoulder-rolls', 'Shoulder Rolls', 'Shoulders', 'None', 30, [
    'Stand tall with your arms relaxed at your sides.',
    'Roll both shoulders up, back, and down in a smooth circular motion.',
    'Continue for several rotations, then reverse direction.',
  ]),

  // ---- Chest ----
  st('doorway-chest-stretch', 'Doorway Chest Stretch', 'Chest', 'Wall', 30, [
    'Stand in a doorway and place your forearm against the frame with your elbow bent 90°.',
    'Step through the doorway with the same-side leg until you feel a stretch across your chest.',
    'Hold, then switch sides.',
  ]),
  st('wall-pec-stretch-high', 'High Wall Pec Stretch', 'Chest', 'Wall', 30, [
    'Place your palm on a wall slightly above shoulder height, fingers pointing back.',
    'Rotate your torso away from the wall until you feel a stretch in the upper chest.',
    'Hold, then switch sides.',
  ]),
  st('floor-chest-opener', 'Floor Chest Opener', 'Chest', 'None', 45, [
    'Lie on your back with arms out to the sides in a "T" position, palms up.',
    'Relax your chest and let gravity open your shoulders toward the floor.',
    'Breathe deeply and hold, releasing a little more tension with each exhale.',
  ]),
  st('clasped-hands-chest-stretch', 'Clasped-Hands Chest Stretch', 'Chest', 'None', 30, [
    'Stand tall and interlace your fingers behind your lower back.',
    'Straighten your arms and gently lift your hands away from your body.',
    'Squeeze your shoulder blades together and hold.',
  ]),
  st('foam-roller-chest-opener', 'Foam Roller Chest Opener', 'Chest', 'Foam Roller', 60, [
    'Lie lengthwise along a foam roller with your head and tailbone supported.',
    'Let your arms fall out to the sides, palms up.',
    'Relax and breathe, allowing your chest to open over several breaths.',
  ]),

  // ---- Upper Back / Thoracic Spine ----
  st('cat-cow', 'Cat-Cow', 'Upper Back', 'None', 45, [
    'Start on hands and knees with wrists under shoulders and knees under hips.',
    'Inhale, drop your belly, and lift your chest and tailbone (cow).',
    'Exhale, round your spine up toward the ceiling and tuck your chin (cat). Alternate smoothly.',
  ]),
  st('thread-the-needle', 'Thread the Needle', 'Upper Back', 'None', 30, [
    'Start on hands and knees.',
    'Slide your right arm underneath your body and across to the left, resting your shoulder and head on the floor.',
    'Hold, feeling a stretch between your shoulder blades, then switch sides.',
  ]),
  st('open-book-stretch', 'Open Book (Thoracic Rotation)', 'Upper Back', 'None', 30, [
    'Lie on your side with knees stacked and bent, arms extended in front of you.',
    'Keeping your lower body still, open your top arm up and across to the opposite side, following it with your eyes.',
    'Let your upper back rotate toward the floor, hold briefly, then return and switch sides.',
  ]),
  st('childs-pose', "Child's Pose", 'Upper Back', 'None', 45, [
    'Kneel with big toes touching and knees spread wide.',
    'Sit your hips back toward your heels and walk your hands forward.',
    'Lower your chest toward the floor and relax your forehead down, breathing deeply.',
  ]),
  st('seated-thoracic-rotation', 'Seated Thoracic Rotation', 'Upper Back', 'Chair or Bench', 30, [
    'Sit tall on a bench or chair with arms crossed over your chest.',
    'Rotate your torso to one side as far as comfortable, keeping your hips square.',
    'Hold, then rotate to the other side.',
  ]),
  st('foam-roller-thoracic-extension', 'Foam Roller Thoracic Extension', 'Upper Back', 'Foam Roller', 45, [
    'Lie with a foam roller positioned horizontally under your upper back, knees bent and feet flat.',
    'Support your head with your hands and gently arch back over the roller.',
    'Roll slightly up and down along your upper back to mobilize each segment.',
  ], 'Keep your lower back off the roller to avoid overextending it.'),

  // ---- Lats ----
  st('overhead-lat-stretch', 'Overhead Lat Stretch', 'Lats', 'None', 30, [
    'Reach both arms overhead and clasp your hands together.',
    'Lean your torso to one side while keeping your arms extended.',
    'Hold, feeling a stretch down your side and lat, then switch sides.',
  ]),
  st('kneeling-lat-stretch', 'Kneeling Lat Stretch', 'Lats', 'Chair or Bench', 30, [
    'Kneel in front of a bench or chair and place one hand on the seat.',
    'Sit your hips back and down while reaching that arm forward, letting your chest drop toward the floor.',
    'Hold, feeling a stretch along your side body and lat, then switch sides.',
  ]),
  st('hanging-lat-stretch', 'Hanging Lat Stretch', 'Lats', 'Pull-up Bar', 30, [
    'Grip a pull-up bar with hands wider than shoulder width.',
    'Let your body hang fully, relaxing your shoulders and lats under your own bodyweight.',
    'Hold, breathing steadily, keeping your core lightly braced.',
  ]),
  st('doorway-lat-stretch', 'Doorway Lat Stretch', 'Lats', 'Wall', 30, [
    'Hold a door frame at about head height with one hand.',
    'Sink your hips away and down, letting your lat and side body lengthen.',
    'Hold, then switch sides.',
  ]),

  // ---- Triceps ----
  st('overhead-triceps-stretch', 'Overhead Triceps Stretch', 'Triceps', 'None', 30, [
    'Raise one arm overhead and bend the elbow, dropping your hand behind your head.',
    'Use your other hand to gently press down on that elbow.',
    'Hold, feeling a stretch along the back of your upper arm, then switch sides.',
  ]),
  st('behind-back-triceps-stretch', 'Behind-the-Back Triceps Stretch', 'Triceps', 'Strap or Towel', 30, [
    'Reach one arm overhead and down behind your back, and the other arm up behind your lower back.',
    'Try to interlace your fingers, or hold a towel between your hands if they don’t reach.',
    'Hold gently, then switch which arm is on top.',
  ]),
  st('triceps-wall-stretch', 'Wall Triceps Stretch', 'Triceps', 'Wall', 30, [
    'Stand facing away from a wall, raise one arm overhead, and bend the elbow so your hand touches between your shoulder blades.',
    'Press your elbow gently back toward the wall behind you.',
    'Hold, then switch sides.',
  ]),

  // ---- Biceps ----
  st('wall-bicep-stretch', 'Wall Bicep Stretch', 'Biceps', 'Wall', 30, [
    'Stand side-on to a wall and place your palm flat against it behind you, arm straight, thumb pointing up.',
    'Slowly rotate your torso away from the wall.',
    'Hold, feeling a stretch along the front of your upper arm, then switch sides.',
  ]),
  st('extended-arm-bicep-stretch', 'Extended Arm Bicep Stretch', 'Biceps', 'None', 30, [
    'Extend one arm straight out to the side at shoulder height, then rotate it so your thumb points down and back.',
    'Gently pull the fingers back with your other hand.',
    'Hold, then switch sides.',
  ]),
  st('doorway-bicep-stretch', 'Doorway Bicep Stretch', 'Biceps', 'Wall', 30, [
    'Stand in a doorway and place one palm on the frame at shoulder height, fingers pointing back.',
    'Rotate your body away from that arm.',
    'Hold, feeling the stretch along the front of the arm, then switch sides.',
  ]),

  // ---- Forearms & Wrists ----
  st('wrist-flexor-stretch', 'Wrist Flexor Stretch', 'Forearms', 'None', 30, [
    'Extend one arm in front of you, palm facing up.',
    'Use your other hand to gently pull the fingers down and back toward you.',
    'Hold, feeling a stretch along the inside of your forearm, then switch sides.',
  ]),
  st('wrist-extensor-stretch', 'Wrist Extensor Stretch', 'Forearms', 'None', 30, [
    'Extend one arm in front of you, palm facing down, fingers pointing forward.',
    'Use your other hand to gently press the back of your hand down and toward you.',
    'Hold, feeling a stretch along the top of your forearm, then switch sides.',
  ]),
  st('prayer-stretch', 'Prayer Stretch', 'Forearms', 'None', 30, [
    'Press both palms together in front of your chest, fingers pointing up.',
    'Slowly lower your hands toward your waist while keeping your palms pressed together.',
    'Hold once you feel a stretch through both wrists and forearms.',
  ]),
  st('wrist-circles', 'Wrist Circles', 'Forearms', 'None', 30, [
    'Extend your arms in front of you and make loose fists.',
    'Rotate your wrists in circles, several reps in each direction.',
    'Keep the motion slow and controlled throughout.',
  ]),
  st('wall-wrist-flexor-stretch', 'Wall Wrist Flexor Stretch', 'Forearms', 'Wall', 30, [
    'Place your palms flat on the floor or a wall at waist height, fingers pointing down, elbows straight.',
    'Lean your weight forward slightly.',
    'Hold, feeling a deep stretch through both forearms.',
  ]),

  // ---- Finger & Grip ----
  st('finger-extension-stretch', 'Finger Extension Stretch', 'Finger & Grip', 'None', 20, [
    'Hold one hand out with fingers spread.',
    'Use your other hand to gently pull the fingers back toward you, one at a time or all together.',
    'Hold, then switch hands.',
  ]),
  st('tendon-glide', 'Tendon Glide', 'Finger & Grip', 'None', 30, [
    'Start with your fingers fully extended and straight.',
    'Slowly curl your fingers into a hook, then a full fist, then a straight-fingers fist, pausing briefly at each position.',
    'Repeat the sequence slowly for several cycles.',
  ]),
  st('rubber-band-finger-extension', 'Rubber Band Finger Extension', 'Finger & Grip', 'Other', 30, [
    'Place a rubber band around all five fingertips of one hand.',
    'Spread your fingers apart against the band’s resistance.',
    'Return with control and repeat for reps.',
  ], 'Great for balancing out heavy gripping work — trains the often-neglected extensors.'),
  st('thumb-extension-stretch', 'Thumb Extension Stretch', 'Finger & Grip', 'None', 20, [
    'Hold one hand out and gently pull your thumb back and away from your palm with the other hand.',
    'Hold, feeling a stretch at the base of the thumb.',
    'Switch hands.',
  ]),

  // ---- Abs / Core ----
  st('cobra-stretch', 'Cobra Stretch', 'Abs', 'None', 30, [
    'Lie face down with your hands planted under your shoulders.',
    'Press through your hands to lift your chest off the floor, keeping your hips down.',
    'Hold, feeling a stretch through your abdomen, then lower back down.',
  ]),
  st('standing-back-extension', 'Standing Back Extension', 'Abs', 'None', 20, [
    'Stand tall with hands on your lower back, fingers pointing down.',
    'Gently lean back, looking up slightly, and keep your knees soft.',
    'Hold briefly, then return to standing.',
  ]),
  st('kneeling-ab-stretch', 'Kneeling Ab Stretch', 'Abs', 'None', 30, [
    'Kneel tall, then reach both arms overhead while gently arching your upper back.',
    'Keep your hips pushed slightly forward to lengthen the front of your body.',
    'Hold, breathing steadily.',
  ]),
  st('camel-pose', 'Camel Pose', 'Abs', 'None', 30, [
    'Kneel with your hips stacked over your knees.',
    'Place your hands on your lower back or reach back to your heels, lifting your chest and arching back.',
    'Hold, keeping your neck long, then return to kneeling slowly.',
  ]),

  // ---- Obliques ----
  st('standing-side-bend', 'Standing Side Bend', 'Obliques', 'None', 30, [
    'Stand tall with feet shoulder-width apart and reach one arm overhead.',
    'Lean your torso to the opposite side, keeping your hips square.',
    'Hold, feeling a stretch along your side, then switch sides.',
  ]),
  st('seated-side-reach', 'Seated Side Reach', 'Obliques', 'Chair or Bench', 30, [
    'Sit tall on a chair or the floor with legs crossed.',
    'Reach one arm overhead and lean over to the opposite side, placing your other hand down for support.',
    'Hold, then switch sides.',
  ]),
  st('side-plank-reach-through', 'Side Plank Reach-Through', 'Obliques', 'None', 30, [
    'Start in a side plank on your forearm.',
    'Reach your top arm underneath your body, rotating your torso down.',
    'Return to the stretched side plank position and repeat, or hold the reach-through.',
  ]),

  // ---- Lower Back ----
  st('knee-to-chest-stretch', 'Knee-to-Chest Stretch', 'Lower Back', 'None', 30, [
    'Lie on your back with both legs extended.',
    'Pull one knee toward your chest with both hands.',
    'Hold, feeling a stretch in your lower back and glute, then switch legs.',
  ]),
  st('double-knee-to-chest', 'Double Knee-to-Chest Stretch', 'Lower Back', 'None', 30, [
    'Lie on your back and pull both knees toward your chest simultaneously.',
    'Wrap your arms around your shins and gently rock side to side if comfortable.',
    'Hold, relaxing your lower back into the floor.',
  ]),
  st('supine-spinal-twist', 'Supine Spinal Twist', 'Lower Back', 'None', 30, [
    'Lie on your back with arms out in a "T," knees bent and together.',
    'Let your knees fall to one side while keeping your shoulders flat on the floor.',
    'Hold, then bring your knees back to center and switch sides.',
  ]),
  st('standing-lower-back-rotation', 'Standing Lower Back Rotation', 'Lower Back', 'None', 30, [
    'Stand with feet shoulder-width apart, hands on hips.',
    'Rotate your torso slowly to one side, then the other, keeping your hips facing forward.',
    'Move through a comfortable range for the set time.',
  ]),
  st('sphinx-pose', 'Sphinx Pose', 'Lower Back', 'None', 45, [
    'Lie face down and prop yourself up on your forearms, elbows under your shoulders.',
    'Let your lower back relax and keep your hips heavy on the floor.',
    'Hold, breathing deeply.',
  ]),
  st('seated-cat-stretch', 'Seated Cat Stretch', 'Lower Back', 'Chair or Bench', 30, [
    'Sit toward the edge of a chair, feet flat on the floor.',
    'Round your spine forward, tucking your chin and pulling your belly button in.',
    'Hold, feeling a stretch along your lower and mid back, then release.',
  ]),

  // ---- Glutes ----
  st('pigeon-pose', 'Pigeon Pose', 'Glutes', 'None', 45, [
    'From hands and knees, bring one knee forward behind your wrist, shin angled across your body.',
    'Extend your other leg straight back behind you.',
    'Square your hips and fold forward over the front leg if comfortable. Hold, then switch sides.',
  ]),
  st('figure-four-stretch', 'Figure-Four Stretch', 'Glutes', 'None', 30, [
    'Lie on your back with knees bent, feet flat.',
    'Cross one ankle over the opposite knee, forming a "4" shape.',
    'Thread your hands around the bottom leg and pull your knees toward your chest. Hold, then switch sides.',
  ]),
  st('seated-figure-four-stretch', 'Seated Figure-Four Stretch', 'Glutes', 'Chair or Bench', 30, [
    'Sit tall in a chair and cross one ankle over the opposite knee.',
    'Gently lean your torso forward, keeping your back straight.',
    'Hold, feeling a stretch in the outer hip and glute, then switch sides.',
  ]),
  st('standing-figure-four-stretch', 'Standing Figure-Four Stretch', 'Glutes', 'Wall', 30, [
    'Stand near a wall for balance and cross one ankle over the opposite knee.',
    'Sit your hips back and down as if sitting into a chair.',
    'Hold, then switch sides.',
  ]),
  st('lying-piriformis-stretch', 'Lying Piriformis Stretch', 'Glutes', 'None', 30, [
    'Lie on your back with knees bent.',
    'Cross one leg over the other, resting the ankle above the knee.',
    'Gently pull the uncrossed leg’s thigh toward your chest, feeling a stretch in the crossed leg’s glute. Switch sides.',
  ]),
  st('half-kneeling-glute-stretch', 'Half-Kneeling Glute Stretch', 'Glutes', 'None', 30, [
    'Kneel with one knee down and the other foot planted in front, shin vertical.',
    'Sit your hips back over the down knee while keeping your torso upright.',
    'Hold, feeling a stretch in the back leg’s glute, then switch sides.',
  ]),

  // ---- Hip Flexors ----
  st('couch-stretch', 'Couch Stretch', 'Hip Flexors', 'Chair or Bench', 45, [
    'Kneel in front of a couch or bench with your back foot’s shin resting up against it.',
    'Step your front foot forward into a lunge position, torso upright.',
    'Squeeze your glute on the back leg and sink your hips forward. Hold, then switch sides.',
  ], 'Intense! Start with less depth and build up over sessions.'),
  st('kneeling-hip-flexor-stretch', 'Kneeling Hip Flexor Stretch', 'Hip Flexors', 'None', 30, [
    'Kneel on one knee with the other foot planted in front, both hips facing forward.',
    'Tuck your pelvis slightly and shift your weight forward into the front leg.',
    'Hold, feeling a stretch in the front of the back leg’s hip, then switch sides.',
  ]),
  st('standing-hip-flexor-reach', 'Standing Hip Flexor Reach', 'Hip Flexors', 'Wall', 30, [
    'Stand tall holding a wall for balance, and step one foot back slightly.',
    'Tuck your pelvis under and reach the same-side arm overhead, leaning slightly away.',
    'Hold, feeling a stretch down the front of the back hip, then switch sides.',
  ]),
  st('half-kneeling-hip-flexor-rock', 'Half-Kneeling Hip Flexor Rock', 'Hip Flexors', 'None', 30, [
    'Kneel in a half-kneeling lunge position.',
    'Gently rock your hips forward and back, keeping your torso upright.',
    'Continue for several slow reps, then switch sides.',
  ]),
  st('low-lunge-stretch', 'Low Lunge Stretch', 'Hip Flexors', 'None', 30, [
    'Step one foot forward into a deep lunge, back knee down on the floor.',
    'Lift your torso tall and press your hips forward and down.',
    'Hold, then switch sides.',
  ]),
  st('reclined-hip-flexor-stretch', 'Reclined Hip Flexor Stretch', 'Hip Flexors', 'Chair or Bench', 30, [
    'Lie on your back near the edge of a bed or bench, letting one leg hang off the edge.',
    'Pull the opposite knee toward your chest to flatten your lower back.',
    'Let the hanging leg relax downward, feeling a stretch in its hip flexor. Switch sides.',
  ]),

  // ---- Adductors / Groin ----
  st('butterfly-stretch', 'Butterfly Stretch', 'Adductors', 'None', 30, [
    'Sit with the soles of your feet together, knees bent out to the sides.',
    'Hold your feet and gently press your knees toward the floor.',
    'Hold, optionally folding your torso forward for a deeper stretch.',
  ]),
  st('frog-stretch', 'Frog Stretch', 'Adductors', 'None', 30, [
    'Start on hands and knees, then widen your knees out to the sides as far as comfortable.',
    'Keep your ankles in line with your knees and rock your hips back slightly.',
    'Hold, breathing deeply, feeling a stretch through the inner thighs.',
  ]),
  st('side-lunge-stretch', 'Side Lunge Stretch', 'Adductors', 'None', 30, [
    'Stand with feet wide apart.',
    'Shift your weight to one side, bending that knee while keeping the other leg straight.',
    'Hold, feeling a stretch in the straight leg’s inner thigh, then switch sides.',
  ]),
  st('seated-wide-leg-straddle', 'Seated Wide-Leg Straddle', 'Adductors', 'None', 30, [
    'Sit with legs extended wide apart to each side.',
    'Walk your hands forward between your legs, keeping your back long.',
    'Hold once you feel a stretch through both inner thighs.',
  ]),
  st('standing-adductor-stretch', 'Standing Adductor Stretch', 'Adductors', 'Wall', 30, [
    'Stand with feet wide, toes pointed slightly out.',
    'Shift your hips to one side and bend that knee, reaching the opposite arm toward that foot.',
    'Hold, then switch sides.',
  ]),

  // ---- Abductors / IT Band / Outer Hip ----
  st('cross-leg-forward-fold', 'Cross-Leg Forward Fold', 'Abductors', 'None', 30, [
    'Stand and cross one ankle in front of the other.',
    'Hinge forward at the hips, reaching toward the floor.',
    'Hold, feeling a stretch along the outer hip of the back leg, then switch sides.',
  ]),
  st('it-band-foam-rolling', 'IT Band Foam Rolling', 'Abductors', 'Foam Roller', 45, [
    'Lie on your side with a foam roller under your outer thigh, supporting yourself on your forearm.',
    'Roll slowly from just below your hip to just above your knee.',
    'Pause on any tender spots for a few extra seconds, then switch sides.',
  ]),
  st('lying-cross-body-hip-stretch', 'Lying Cross-Body Hip Stretch', 'Abductors', 'None', 30, [
    'Lie on your back with legs extended.',
    'Bring one leg across your body toward the opposite side, keeping your shoulders flat on the floor.',
    'Hold, feeling a stretch in the outer hip, then switch sides.',
  ]),
  st('standing-it-band-stretch', 'Standing IT Band Stretch', 'Abductors', 'Wall', 30, [
    'Stand beside a wall and cross the leg farther from the wall behind the other.',
    'Push your hip out toward the wall side while leaning your torso away.',
    'Hold, then switch sides.',
  ]),

  // ---- Quadriceps ----
  st('standing-quad-stretch', 'Standing Quad Stretch', 'Quadriceps', 'Wall', 30, [
    'Stand tall, holding a wall or chair for balance if needed.',
    'Bend one knee and grab that ankle behind you, pulling your heel toward your glute.',
    'Keep your knees close together and hips tucked under. Hold, then switch sides.',
  ]),
  st('kneeling-quad-stretch', 'Kneeling Quad Stretch', 'Quadriceps', 'None', 30, [
    'Kneel on one knee with the other foot planted in front.',
    'Reach back and grab the top of your back foot, gently pulling your heel toward your glute.',
    'Tuck your pelvis under for a deeper stretch, then switch sides.',
  ]),
  st('prone-quad-stretch', 'Prone Quad Stretch', 'Quadriceps', 'None', 30, [
    'Lie face down and bend one knee, reaching back to hold your ankle.',
    'Gently pull your heel toward your glute.',
    'Hold, keeping your hips pressed into the floor, then switch sides.',
  ]),
  st('side-lying-quad-stretch', 'Side-Lying Quad Stretch', 'Quadriceps', 'None', 30, [
    'Lie on your side with legs stacked.',
    'Bend your top knee and grab your ankle, pulling your heel toward your glute.',
    'Hold, keeping your knees together, then switch sides.',
  ]),
  st('foam-roller-quad-release', 'Foam Roller Quad Release', 'Quadriceps', 'Foam Roller', 45, [
    'Lie face down with a foam roller under your thighs, propped on your forearms.',
    'Roll slowly from just above your knees to just below your hips.',
    'Pause on tender spots for a few extra seconds.',
  ]),

  // ---- Hamstrings ----
  st('standing-forward-fold', 'Standing Forward Fold', 'Hamstrings', 'None', 30, [
    'Stand with feet hip-width apart.',
    'Hinge at your hips and fold forward, letting your arms hang or reach toward your toes.',
    'Keep a slight bend in your knees if needed, and let your head relax.',
  ]),
  st('seated-forward-fold', 'Seated Forward Fold', 'Hamstrings', 'None', 30, [
    'Sit with legs extended straight in front of you.',
    'Hinge forward from your hips, reaching toward your feet.',
    'Keep your back long rather than rounding, and hold.',
  ]),
  st('single-leg-forward-fold', 'Single-Leg Forward Fold', 'Hamstrings', 'Chair or Bench', 30, [
    'Place one heel on a low bench or step, leg straight, toes up.',
    'Hinge forward at the hips over the raised leg, keeping your back flat.',
    'Hold, then switch legs.',
  ]),
  st('lying-hamstring-stretch-strap', 'Lying Hamstring Stretch with Strap', 'Hamstrings', 'Strap or Towel', 30, [
    'Lie on your back and loop a towel or strap around one foot.',
    'Keep that leg straight and use the strap to draw it toward your chest.',
    'Keep your other leg flat on the floor. Hold, then switch sides.',
  ]),
  st('doorway-hamstring-stretch', 'Doorway Hamstring Stretch', 'Hamstrings', 'Wall', 30, [
    'Lie on your back near a doorway and place one heel up against the door frame, leg straight.',
    'Scoot your hips closer to the frame to increase the stretch.',
    'Hold, then switch legs.',
  ]),
  st('dynamic-leg-swings', 'Dynamic Leg Swings', 'Hamstrings', 'Wall', 30, [
    'Hold a wall for balance and swing one leg forward and back in a controlled, pendulum motion.',
    'Gradually increase range as your hips warm up.',
    'Continue for the set time, then switch legs.',
  ]),

  // ---- Calves ----
  st('standing-calf-stretch', 'Standing Calf Stretch', 'Calves', 'Wall', 30, [
    'Stand facing a wall with hands pressed against it.',
    'Step one foot back, keeping it straight with the heel down, and lean forward.',
    'Hold, feeling a stretch in the back leg’s calf, then switch sides.',
  ]),
  st('bent-knee-calf-stretch', 'Bent-Knee Calf Stretch', 'Calves', 'Wall', 30, [
    'From the standing calf stretch position, bend the back knee slightly while keeping the heel down.',
    'Lean your hips forward over that bent knee.',
    'Hold, feeling the stretch lower in the calf, then switch sides.',
  ], 'Targets the soleus, lower in the calf than the straight-leg version.'),
  st('downward-dog-calf-pumps', 'Downward Dog Calf Pumps', 'Calves', 'None', 30, [
    'From a downward dog position (hips up, hands and feet on the floor), bend one knee.',
    'Press the opposite heel toward the floor, then switch, "pedaling" the feet.',
    'Continue alternating for the set time.',
  ]),
  st('seated-calf-stretch-towel', 'Seated Calf Stretch with Towel', 'Calves', 'Strap or Towel', 30, [
    'Sit with one leg extended straight, looping a towel around the ball of that foot.',
    'Gently pull the towel to draw your toes back toward you.',
    'Hold, keeping your knee straight, then switch sides.',
  ]),
  st('step-edge-calf-stretch', 'Step Edge Calf Stretch', 'Calves', 'Chair or Bench', 30, [
    'Stand on a step or low platform with your heels hanging off the back edge.',
    'Lower your heels slowly below the level of the step.',
    'Hold, feeling a stretch through your calves.',
  ]),

  // ---- Ankles / Feet ----
  st('ankle-circles', 'Ankle Circles', 'Ankles', 'None', 30, [
    'Sit or stand and lift one foot slightly off the floor.',
    'Rotate your ankle in slow circles, several reps each direction.',
    'Switch feet and repeat.',
  ]),
  st('kneeling-ankle-dorsiflexion-stretch', 'Kneeling Ankle Dorsiflexion Stretch', 'Ankles', 'Wall', 30, [
    'Kneel in a half-kneeling position facing a wall, front foot a few inches away.',
    'Keeping your heel flat, drive your knee forward over your toes toward the wall.',
    'Hold, feeling a stretch in the front of the ankle, then switch sides.',
  ]),
  st('plantar-fascia-stretch', 'Plantar Fascia Stretch', 'Ankles', 'Chair or Bench', 30, [
    'Sit and cross one foot over the opposite knee.',
    'Pull your toes back toward your shin with your hand, feeling a stretch along the arch of your foot.',
    'Hold, then switch feet.',
  ]),
  st('toe-spread-stretch', 'Toe Spread Stretch', 'Ankles', 'None', 20, [
    'Sit and remove your shoes if possible.',
    'Spread your toes apart as wide as you can and hold.',
    'Relax and repeat for several reps.',
  ]),
  st('ball-roll-foot-massage', 'Ball Roll Foot Massage', 'Ankles', 'Other', 45, [
    'Stand or sit and place a small ball (lacrosse or tennis ball) under one foot.',
    'Roll your foot slowly over the ball from heel to toes, applying gentle pressure.',
    'Continue for the set time, then switch feet.',
  ]),

  // ---- Full Body / Dynamic Warm-up ----
  st('worlds-greatest-stretch', "World's Greatest Stretch", 'Full Body', 'None', 45, [
    'Step into a deep lunge with your back leg straight behind you.',
    'Place both hands inside your front foot, then rotate your front-side elbow up toward the ceiling.',
    'Return your hand down and straighten your front leg to add a hamstring stretch, then switch sides.',
  ]),
  st('inchworm', 'Inchworm', 'Full Body', 'None', 45, [
    'Stand tall, then hinge forward and walk your hands out to a plank position.',
    'Hold briefly, then walk your feet up toward your hands.',
    'Stand back up tall and repeat for several reps.',
  ]),
  st('walking-lunge-with-twist', 'Walking Lunge with Twist', 'Full Body', 'None', 45, [
    'Step forward into a lunge, back knee hovering just above the floor.',
    'Rotate your torso toward the front leg, reaching both arms around.',
    'Return to center, stand, and repeat on the other side as you walk forward.',
  ]),
  st('arm-circles', 'Arm Circles', 'Full Body', 'None', 30, [
    'Stand tall and extend both arms out to the sides at shoulder height.',
    'Make small circles, gradually increasing the size.',
    'Reverse direction halfway through.',
  ]),
  st('standing-side-to-side-sway', 'Standing Side-to-Side Sway', 'Full Body', 'None', 30, [
    'Stand with feet wide apart.',
    'Shift your weight from one leg to the other in a smooth, continuous rocking motion, bending the loaded knee.',
    'Keep your chest up and continue for the set time.',
  ]),
  st('sun-salutation-flow', 'Sun Salutation Flow', 'Full Body', 'None', 60, [
    'Start standing tall, reach your arms overhead, then fold forward into a forward fold.',
    'Step back into a plank, lower down, then press up into a gentle backbend (cobra).',
    'Push back into downward dog, then walk or hop forward and stand back up. Repeat the flow smoothly.',
  ]),
]

export const STRETCH_TARGET_AREAS: string[] = [
  'Neck', 'Shoulders', 'Chest', 'Upper Back', 'Lats', 'Triceps', 'Biceps',
  'Forearms', 'Finger & Grip', 'Abs', 'Obliques', 'Lower Back', 'Glutes',
  'Hip Flexors', 'Adductors', 'Abductors', 'Quadriceps', 'Hamstrings',
  'Calves', 'Ankles', 'Full Body',
]
