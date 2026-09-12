import type { Exercise } from '../types'

// Helper to keep entries terse while staying typed & explicit.
const ex = (
  id: string,
  name: string,
  category: Exercise['category'],
  equipment: Exercise['equipment'],
  logType: Exercise['logType'],
  secondaryMuscles: Exercise['secondaryMuscles'],
  instructions: string[],
): Exercise => ({ id, name, category, equipment, logType, secondaryMuscles, instructions })

export const EXERCISE_LIBRARY: Exercise[] = [
  // ---- Chest ----
  ex('bb-bench-press', 'Barbell Bench Press', 'Chest', 'Barbell', 'weight_reps', ['Triceps', 'Shoulders'], [
    'Lie flat on the bench with eyes under the bar and feet planted on the floor.',
    'Grip the bar slightly wider than shoulder width and unrack it over your chest.',
    'Lower the bar with control to mid-chest, keeping elbows at ~45°.',
    'Press the bar back up to lockout without flaring your shoulders.',
  ]),
  ex('db-bench-press', 'Dumbbell Bench Press', 'Chest', 'Dumbbell', 'weight_reps', ['Triceps', 'Shoulders'], [
    'Sit on a flat bench with a dumbbell in each hand resting on your thighs.',
    'Kick the dumbbells up as you lie back, positioning them above your chest.',
    'Lower the dumbbells to chest level with elbows bent to about 45°.',
    'Press them back up until your arms are extended and dumbbells nearly touch.',
  ]),
  ex('incline-bb-bench-press', 'Incline Barbell Bench Press', 'Chest', 'Barbell', 'weight_reps', ['Shoulders', 'Triceps'], [
    'Set the bench to a 30-45° incline and lie back with a stable foot position.',
    'Unrack the bar with a shoulder-width grip.',
    'Lower the bar to your upper chest under control.',
    'Drive the bar back up to lockout.',
  ]),
  ex('incline-db-press', 'Incline Dumbbell Press', 'Chest', 'Dumbbell', 'weight_reps', ['Shoulders', 'Triceps'], [
    'Set the bench to 30-45° incline, dumbbells resting on your thighs.',
    'Kick the weights up into starting position at shoulder height.',
    'Press up and slightly inward until arms are extended.',
    'Lower with control back to the start.',
  ]),
  ex('decline-bb-bench-press', 'Decline Barbell Bench Press', 'Chest', 'Barbell', 'weight_reps', ['Triceps'], [
    'Secure your legs on the decline bench and lie back.',
    'Unrack the bar with a shoulder-width grip.',
    'Lower the bar to your lower chest.',
    'Press back up to lockout.',
  ]),
  ex('chest-fly-machine', 'Chest Fly Machine', 'Chest', 'Machine', 'weight_reps', [], [
    'Sit with your back against the pad and grab the handles with elbows slightly bent.',
    'Squeeze your chest to bring the handles together in front of you.',
    'Pause briefly, then return under control to the stretch position.',
  ]),
  ex('cable-crossover', 'Cable Crossover', 'Chest', 'Cable', 'weight_reps', ['Shoulders'], [
    'Set both pulleys high and grab a handle in each hand.',
    'Step forward with a slight forward lean and soft elbow bend.',
    'Pull the handles down and together in front of your hips.',
    'Return slowly to the starting stretch.',
  ]),
  ex('pec-deck', 'Pec Deck', 'Chest', 'Machine', 'weight_reps', [], [
    'Sit tall with forearms against the pads, elbows at shoulder height.',
    'Squeeze your chest to bring the pads together.',
    'Return slowly to the stretched position.',
  ]),
  ex('push-up', 'Push Up', 'Chest', 'Bodyweight', 'bodyweight_reps', ['Triceps', 'Shoulders', 'Abs'], [
    'Start in a plank with hands slightly wider than shoulders.',
    'Lower your chest toward the floor keeping your body in a straight line.',
    'Press back up to full arm extension.',
  ]),
  ex('dips-chest', 'Chest Dip', 'Chest', 'Bodyweight', 'weighted_bodyweight', ['Triceps', 'Shoulders'], [
    'Support yourself on parallel bars with arms locked out.',
    'Lean forward and lower your body until your shoulders are below your elbows.',
    'Press back up to the starting position.',
  ]),
  ex('svend-press', 'Svend Press', 'Chest', 'Plate', 'weight_reps', ['Shoulders'], [
    'Hold a weight plate between both palms at chest height.',
    'Press the plate straight out in front of you, squeezing your chest.',
    'Return the plate back to your chest with control.',
  ]),

  // ---- Back ----
  ex('deadlift', 'Barbell Deadlift', 'Back', 'Barbell', 'weight_reps', ['Hamstrings', 'Glutes', 'Traps'], [
    'Stand with mid-foot under the bar, feet hip-width apart.',
    'Hinge down and grip the bar just outside your shins.',
    'Brace your core, flatten your back, and drive through the floor to stand tall.',
    'Lower the bar back down with control, hinging at the hips first.',
  ]),
  ex('pull-up', 'Pull Up', 'Back', 'Bodyweight', 'weighted_bodyweight', ['Biceps', 'Lats'], [
    'Hang from a bar with an overhand grip slightly wider than shoulders.',
    'Pull your chin above the bar by driving your elbows down and back.',
    'Lower yourself back to a full hang under control.',
  ]),
  ex('chin-up', 'Chin Up', 'Back', 'Bodyweight', 'weighted_bodyweight', ['Biceps'], [
    'Hang from a bar with an underhand, shoulder-width grip.',
    'Pull yourself up until your chin clears the bar.',
    'Lower back down with control to a full hang.',
  ]),
  ex('lat-pulldown', 'Lat Pulldown', 'Back', 'Cable', 'weight_reps', ['Biceps', 'Lats'], [
    'Sit and secure your knees under the pad, grip the bar wider than shoulders.',
    'Pull the bar down to your upper chest while keeping your chest up.',
    'Slowly extend your arms back to the top.',
  ]),
  ex('seated-cable-row', 'Seated Cable Row', 'Back', 'Cable', 'weight_reps', ['Biceps'], [
    'Sit with knees slightly bent, grip the handle with arms extended.',
    'Pull the handle to your torso, squeezing your shoulder blades together.',
    'Extend your arms back out with control.',
  ]),
  ex('bb-bent-over-row', 'Barbell Bent Over Row', 'Back', 'Barbell', 'weight_reps', ['Biceps', 'Lats'], [
    'Hinge at the hips holding the bar with an overhand grip, back flat.',
    'Pull the bar to your lower ribs, driving elbows up and back.',
    'Lower the bar back down with control.',
  ]),
  ex('db-row', 'One Arm Dumbbell Row', 'Back', 'Dumbbell', 'weight_reps', ['Biceps', 'Lats'], [
    'Support one knee and hand on a bench, back flat and parallel to the floor.',
    'Row the dumbbell up to your hip, keeping your elbow close to your body.',
    'Lower back down under control.',
  ]),
  ex('t-bar-row', 'T-Bar Row', 'Back', 'Machine', 'weight_reps', ['Biceps'], [
    'Straddle the T-bar with knees bent and back flat.',
    'Row the handle to your chest, squeezing your shoulder blades.',
    'Lower with control back to the start.',
  ]),
  ex('face-pull', 'Face Pull', 'Back', 'Cable', 'weight_reps', ['Shoulders'], [
    'Set the pulley to head height with a rope attachment.',
    'Pull the rope towards your face, flaring elbows out and rotating shoulders back.',
    'Return slowly to the start.',
  ]),
  ex('hyperextension', 'Back Extension', 'Back', 'Bodyweight', 'bodyweight_reps', ['Glutes', 'Hamstrings'], [
    'Position your hips on the pad with legs secured.',
    'Lower your torso down while keeping your back flat.',
    'Raise back up until your body forms a straight line.',
  ]),
  ex('straight-arm-pulldown', 'Straight Arm Pulldown', 'Back', 'Cable', 'weight_reps', ['Lats'], [
    'Grip a straight bar attached to a high pulley, arms extended.',
    'Keeping arms straight, pull the bar down to your thighs.',
    'Return with control to the starting position.',
  ]),
  ex('shrug', 'Barbell Shrug', 'Traps', 'Barbell', 'weight_reps', ['Back'], [
    'Hold a barbell in front of your thighs with an overhand grip.',
    'Elevate your shoulders straight up toward your ears.',
    'Lower back down with control.',
  ]),

  // ---- Shoulders ----
  ex('ohp-barbell', 'Overhead Press', 'Shoulders', 'Barbell', 'weight_reps', ['Triceps'], [
    'Hold the bar at shoulder height with hands just outside shoulders.',
    'Brace your core and press the bar overhead to lockout.',
    'Lower the bar back to shoulder height with control.',
  ]),
  ex('db-shoulder-press', 'Dumbbell Shoulder Press', 'Shoulders', 'Dumbbell', 'weight_reps', ['Triceps'], [
    'Sit or stand holding dumbbells at shoulder height, palms forward.',
    'Press the dumbbells overhead until arms are extended.',
    'Lower back to shoulder height with control.',
  ]),
  ex('lateral-raise', 'Dumbbell Lateral Raise', 'Shoulders', 'Dumbbell', 'weight_reps', [], [
    'Stand holding dumbbells at your sides with a slight elbow bend.',
    'Raise the dumbbells out to the sides until arms are parallel to the floor.',
    'Lower back down with control.',
  ]),
  ex('front-raise', 'Dumbbell Front Raise', 'Shoulders', 'Dumbbell', 'weight_reps', [], [
    'Stand holding dumbbells in front of your thighs.',
    'Raise one or both dumbbells forward to shoulder height.',
    'Lower back down with control.',
  ]),
  ex('rear-delt-fly', 'Rear Delt Fly', 'Shoulders', 'Dumbbell', 'weight_reps', ['Back'], [
    'Hinge forward at the hips with a flat back, dumbbells hanging down.',
    'Raise the dumbbells out to the sides, squeezing your rear delts.',
    'Lower back down with control.',
  ]),
  ex('arnold-press', 'Arnold Press', 'Shoulders', 'Dumbbell', 'weight_reps', ['Triceps'], [
    'Hold dumbbells in front of your shoulders with palms facing you.',
    'Press up while rotating your palms to face forward at the top.',
    'Reverse the motion back to the start.',
  ]),
  ex('upright-row', 'Upright Row', 'Shoulders', 'Barbell', 'weight_reps', ['Traps'], [
    'Hold the bar with a narrow overhand grip in front of your thighs.',
    'Pull the bar straight up to chest height, leading with your elbows.',
    'Lower back down with control.',
  ]),
  ex('cable-lateral-raise', 'Cable Lateral Raise', 'Shoulders', 'Cable', 'weight_reps', [], [
    'Stand side-on to a low pulley, handle in the far hand.',
    'Raise your arm out to the side until parallel to the floor.',
    'Lower back down with control.',
  ]),

  // ---- Biceps ----
  ex('bb-curl', 'Barbell Curl', 'Biceps', 'Barbell', 'weight_reps', ['Forearms'], [
    'Stand holding the bar with an underhand, shoulder-width grip.',
    'Curl the bar up toward your shoulders, keeping elbows tucked.',
    'Lower back down with control.',
  ]),
  ex('db-curl', 'Dumbbell Curl', 'Biceps', 'Dumbbell', 'weight_reps', ['Forearms'], [
    'Stand holding dumbbells at your sides, palms facing forward.',
    'Curl the weights up toward your shoulders.',
    'Lower back down with control.',
  ]),
  ex('hammer-curl', 'Hammer Curl', 'Biceps', 'Dumbbell', 'weight_reps', ['Forearms'], [
    'Stand holding dumbbells with a neutral, palms-in grip.',
    'Curl the weights up keeping your wrists neutral.',
    'Lower back down with control.',
  ]),
  ex('preacher-curl', 'Preacher Curl', 'Biceps', 'EZ Bar', 'weight_reps', ['Forearms'], [
    'Rest your upper arms on the preacher pad, gripping the EZ bar underhand.',
    'Curl the bar up towards your shoulders.',
    'Lower back down without fully locking out.',
  ]),
  ex('cable-curl', 'Cable Curl', 'Biceps', 'Cable', 'weight_reps', ['Forearms'], [
    'Stand facing a low pulley with a straight bar attachment.',
    'Curl the bar up toward your shoulders, keeping elbows fixed.',
    'Lower back down with control.',
  ]),
  ex('concentration-curl', 'Concentration Curl', 'Biceps', 'Dumbbell', 'weight_reps', ['Forearms'], [
    'Sit and brace your elbow against your inner thigh.',
    'Curl the dumbbell up toward your shoulder.',
    'Lower back down slowly.',
  ]),

  // ---- Triceps ----
  ex('tricep-pushdown', 'Triceps Pushdown', 'Triceps', 'Cable', 'weight_reps', [], [
    'Stand facing a high pulley with a straight or rope attachment.',
    'Keeping elbows pinned to your sides, push the attachment down to full extension.',
    'Return with control to the start.',
  ]),
  ex('skull-crusher', 'Skull Crusher', 'Triceps', 'EZ Bar', 'weight_reps', [], [
    'Lie on a bench holding the EZ bar above your chest, arms extended.',
    'Bend your elbows to lower the bar toward your forehead.',
    'Extend back up to the starting position.',
  ]),
  ex('close-grip-bench', 'Close Grip Bench Press', 'Triceps', 'Barbell', 'weight_reps', ['Chest'], [
    'Lie on a bench and grip the bar just inside shoulder width.',
    'Lower the bar to your lower chest, elbows close to your body.',
    'Press back up to lockout.',
  ]),
  ex('overhead-tricep-extension', 'Overhead Triceps Extension', 'Triceps', 'Dumbbell', 'weight_reps', [], [
    'Hold a dumbbell overhead with both hands, arms extended.',
    'Lower the dumbbell behind your head by bending your elbows.',
    'Extend back up to the start.',
  ]),
  ex('dips-triceps', 'Triceps Dip', 'Triceps', 'Bodyweight', 'weighted_bodyweight', ['Chest', 'Shoulders'], [
    'Support yourself on parallel bars, torso upright.',
    'Lower your body by bending your elbows straight back.',
    'Press back up to lockout.',
  ]),
  ex('bench-dip', 'Bench Dip', 'Triceps', 'Bodyweight', 'bodyweight_reps', ['Chest'], [
    'Place your hands on a bench behind you, legs extended in front.',
    'Lower your hips toward the floor by bending your elbows.',
    'Press back up to the start.',
  ]),

  // ---- Forearms ----
  ex('wrist-curl', 'Wrist Curl', 'Forearms', 'Barbell', 'weight_reps', [], [
    'Sit and rest your forearms on your thighs, palms up, holding the bar.',
    'Curl your wrists upward.',
    'Lower back down with control.',
  ]),
  ex('farmers-carry', "Farmer's Carry", 'Forearms', 'Dumbbell', 'duration', ['Abs', 'Full Body'], [
    'Hold a heavy dumbbell or kettlebell in each hand.',
    'Stand tall and walk forward for the target distance or time.',
    'Keep your core braced and shoulders back throughout.',
  ]),
  ex('reverse-curl', 'Reverse Curl', 'Forearms', 'Barbell', 'weight_reps', ['Biceps'], [
    'Hold the bar with an overhand grip in front of your thighs.',
    'Curl the bar up toward your shoulders keeping wrists flat.',
    'Lower back down with control.',
  ]),

  // ---- Finger & Grip ----
  ex('dead-hang', 'Dead Hang', 'Finger & Grip', 'Bodyweight', 'duration', ['Forearms', 'Back'], [
    'Grip a pull-up bar with hands slightly wider than shoulder width.',
    'Let your body hang fully with arms straight and shoulders relaxed but engaged.',
    'Hold for time, keeping your grip firm without swinging.',
  ]),
  ex('fat-grip-dead-hang', 'Fat Bar Dead Hang', 'Finger & Grip', 'Other', 'duration', ['Forearms'], [
    'Use a thick bar, towel wrap, or Fat Gripz attachment on a pull-up bar.',
    'Grip it as securely as possible and hang with arms fully extended.',
    'Hold for time, resisting the urge to let the bar roll out of your hand.',
  ]),
  ex('plate-pinch', 'Plate Pinch Hold', 'Finger & Grip', 'Plate', 'duration', ['Forearms'], [
    'Pinch two weight plates together (smooth sides out) between your fingers and thumb.',
    'Lift them off the floor or a rack and hold at your side.',
    'Keep your wrist straight and hold for time without letting the plates slide apart.',
  ]),
  ex('hand-gripper', 'Hand Gripper Squeeze', 'Finger & Grip', 'Other', 'reps_only', ['Forearms'], [
    'Hold a gripper in one hand with the handles against your palm and fingers.',
    'Squeeze the handles together until they close or for maximum effort.',
    'Release with control and repeat for reps, then switch hands.',
  ]),
  ex('fingertip-pushup', 'Fingertip Push-Up', 'Finger & Grip', 'Bodyweight', 'bodyweight_reps', ['Chest', 'Triceps'], [
    'Set up in a push-up position balanced on your fingertips instead of flat palms.',
    'Lower your chest toward the floor with elbows at about 45°.',
    'Press back up to full extension, keeping fingers spread and rigid throughout.',
  ]),
  ex('wrist-roller', 'Wrist Roller', 'Finger & Grip', 'Other', 'reps_only', ['Forearms'], [
    'Hold a wrist roller device at shoulder height with arms extended in front of you.',
    'Rotate your wrists to wind the rope up and lift the weight.',
    'Reverse the motion to lower it back down under control.',
  ]),
  ex('towel-pull-up-hang', 'Towel Grip Hang', 'Finger & Grip', 'Other', 'duration', ['Forearms', 'Back'], [
    'Drape two towels over a pull-up bar and grip one in each hand.',
    'Hang with arms extended, gripping the fabric as tightly as possible.',
    'Hold for time, keeping your shoulders active and core braced.',
  ]),
  ex('rice-bucket-twist', 'Rice Bucket Rotations', 'Finger & Grip', 'Other', 'reps_only', ['Forearms'], [
    'Bury your hand in a bucket of rice up to the wrist.',
    'Open and close your fist, then rotate and twist your wrist through the rice.',
    'Continue for the target reps or time, then switch hands.',
  ]),
  ex('one-arm-dead-hang', 'One-Arm Dead Hang', 'Finger & Grip', 'Bodyweight', 'duration', ['Forearms', 'Back'], [
    'Grip a pull-up bar with one hand, using an assist band or the other hand lightly for balance if needed.',
    'Hang with the working arm fully extended and shoulder engaged.',
    'Hold for time, then switch sides.',
  ]),
  ex('finger-curl', 'Barbell Finger Curl', 'Finger & Grip', 'Barbell', 'weight_reps', ['Forearms'], [
    'Hold a light barbell with an overhand grip, letting it roll down to your fingertips.',
    'Curl your fingers to roll the bar back up into your palms.',
    'Lower with control and repeat.',
  ]),

  // ---- Abs ----
  ex('crunch', 'Crunch', 'Abs', 'Bodyweight', 'bodyweight_reps', [], [
    'Lie on your back with knees bent and hands lightly behind your head.',
    'Curl your shoulders up off the floor, squeezing your abs.',
    'Lower back down with control.',
  ]),
  ex('plank', 'Plank', 'Abs', 'Bodyweight', 'duration', ['Back'], [
    'Support yourself on your forearms and toes, body in a straight line.',
    'Brace your core and hold the position without sagging your hips.',
  ]),
  ex('hanging-leg-raise', 'Hanging Leg Raise', 'Abs', 'Bodyweight', 'bodyweight_reps', ['Forearms'], [
    'Hang from a pull-up bar with arms extended.',
    'Raise your legs up until they are parallel to the floor or higher.',
    'Lower back down with control.',
  ]),
  ex('cable-crunch', 'Cable Crunch', 'Abs', 'Cable', 'weight_reps', [], [
    'Kneel below a high pulley holding a rope attachment at your head.',
    'Crunch down, bringing your elbows toward your knees.',
    'Return to the start with control.',
  ]),
  ex('russian-twist', 'Russian Twist', 'Abs', 'Bodyweight', 'bodyweight_reps', [], [
    'Sit with knees bent and lean back slightly, feet off the floor if possible.',
    'Rotate your torso to touch the floor on each side.',
  ]),
  ex('ab-wheel-rollout', 'Ab Wheel Rollout', 'Abs', 'Other', 'bodyweight_reps', ['Back', 'Shoulders'], [
    'Kneel on the floor holding the ab wheel with both hands.',
    'Roll forward slowly, extending your body while keeping your core braced.',
    'Roll back to the starting position.',
  ]),
  ex('sit-up', 'Sit Up', 'Abs', 'Bodyweight', 'bodyweight_reps', [], [
    'Lie on your back with knees bent, feet anchored if needed.',
    'Curl your torso all the way up until your chest nears your knees.',
    'Lower back down with control.',
  ]),

  // ---- Quadriceps ----
  ex('back-squat', 'Barbell Back Squat', 'Quadriceps', 'Barbell', 'weight_reps', ['Glutes', 'Hamstrings'], [
    'Position the bar on your upper back and unrack it with feet shoulder-width.',
    'Brace your core and squat down until hips are below knee level.',
    'Drive through your feet to stand back up.',
  ]),
  ex('front-squat', 'Front Squat', 'Quadriceps', 'Barbell', 'weight_reps', ['Glutes', 'Abs'], [
    'Rest the bar on your front shoulders with elbows high.',
    'Squat down keeping your torso upright.',
    'Drive back up to standing.',
  ]),
  ex('leg-press', 'Leg Press', 'Quadriceps', 'Machine', 'weight_reps', ['Glutes', 'Hamstrings'], [
    'Sit in the machine with feet shoulder-width on the platform.',
    'Lower the platform by bending your knees toward your chest.',
    'Press back up without locking your knees out hard.',
  ]),
  ex('leg-extension', 'Leg Extension', 'Quadriceps', 'Machine', 'weight_reps', [], [
    'Sit with the pad resting on your lower shins, knees bent.',
    'Extend your legs until straight, squeezing your quads.',
    'Lower back down with control.',
  ]),
  ex('walking-lunge', 'Walking Lunge', 'Quadriceps', 'Dumbbell', 'weight_reps', ['Glutes', 'Hamstrings'], [
    'Hold dumbbells at your sides and step forward into a lunge.',
    'Lower your back knee toward the floor.',
    'Push off to bring your back foot forward into the next lunge.',
  ]),
  ex('bulgarian-split-squat', 'Bulgarian Split Squat', 'Quadriceps', 'Dumbbell', 'weight_reps', ['Glutes'], [
    'Place one foot behind you on a bench, holding dumbbells at your sides.',
    'Lower your back knee toward the floor by bending the front leg.',
    'Push through the front foot to return to standing.',
  ]),
  ex('goblet-squat', 'Goblet Squat', 'Quadriceps', 'Dumbbell', 'weight_reps', ['Glutes'], [
    'Hold a dumbbell vertically against your chest.',
    'Squat down between your knees, keeping your chest up.',
    'Drive back up to standing.',
  ]),
  ex('hack-squat', 'Hack Squat', 'Quadriceps', 'Machine', 'weight_reps', ['Glutes'], [
    'Position your shoulders under the pads and feet shoulder-width on the platform.',
    'Bend your knees to lower the sled down.',
    'Press back up through your heels.',
  ]),
  ex('step-up', 'Dumbbell Step Up', 'Quadriceps', 'Dumbbell', 'weight_reps', ['Glutes'], [
    'Hold dumbbells at your sides facing a bench or box.',
    'Step up fully onto the platform with one leg.',
    'Step back down with control and repeat.',
  ]),

  // ---- Hamstrings ----
  ex('rdl', 'Romanian Deadlift', 'Hamstrings', 'Barbell', 'weight_reps', ['Glutes', 'Back'], [
    'Hold the bar in front of your thighs with a shoulder-width grip.',
    'Hinge at the hips, pushing them back while lowering the bar along your legs.',
    'Drive your hips forward to return to standing.',
  ]),
  ex('leg-curl-lying', 'Lying Leg Curl', 'Hamstrings', 'Machine', 'weight_reps', [], [
    'Lie face down with the pad resting against your lower calves.',
    'Curl your heels toward your glutes.',
    'Lower back down with control.',
  ]),
  ex('seated-leg-curl', 'Seated Leg Curl', 'Hamstrings', 'Machine', 'weight_reps', [], [
    'Sit with the pad resting against the back of your lower legs.',
    'Curl your legs down and back.',
    'Return with control to the start.',
  ]),
  ex('good-morning', 'Good Morning', 'Hamstrings', 'Barbell', 'weight_reps', ['Back', 'Glutes'], [
    'Position the bar on your upper back as in a squat.',
    'Hinge forward at the hips keeping a flat back until torso is near parallel.',
    'Drive your hips forward to return upright.',
  ]),
  ex('nordic-curl', 'Nordic Hamstring Curl', 'Hamstrings', 'Bodyweight', 'bodyweight_reps', ['Glutes'], [
    'Kneel with your ankles anchored securely.',
    'Lower your torso forward as slowly as possible, resisting with your hamstrings.',
    'Use your hands to catch yourself and push back to the start.',
  ]),

  // ---- Glutes ----
  ex('hip-thrust', 'Barbell Hip Thrust', 'Glutes', 'Barbell', 'weight_reps', ['Hamstrings'], [
    'Sit with your upper back against a bench, barbell over your hips.',
    'Drive through your heels to raise your hips until your body forms a straight line.',
    'Lower back down with control.',
  ]),
  ex('glute-bridge', 'Glute Bridge', 'Glutes', 'Bodyweight', 'bodyweight_reps', ['Hamstrings'], [
    'Lie on your back with knees bent, feet flat on the floor.',
    'Drive through your heels to raise your hips up.',
    'Lower back down with control.',
  ]),
  ex('cable-kickback', 'Cable Glute Kickback', 'Glutes', 'Cable', 'weight_reps', ['Hamstrings'], [
    'Attach an ankle strap to a low pulley and face the machine.',
    'Kick your leg back and up, squeezing your glute at the top.',
    'Return with control to the start.',
  ]),
  ex('hip-abduction-machine', 'Hip Abduction Machine', 'Abductors', 'Machine', 'weight_reps', ['Glutes'], [
    'Sit in the machine with your legs against the pads.',
    'Push your legs outward against the resistance.',
    'Return with control to the start.',
  ]),
  ex('hip-adduction-machine', 'Hip Adduction Machine', 'Adductors', 'Machine', 'weight_reps', [], [
    'Sit in the machine with your legs against the pads, spread apart.',
    'Squeeze your legs together against the resistance.',
    'Return with control to the start.',
  ]),

  // ---- Calves ----
  ex('standing-calf-raise', 'Standing Calf Raise', 'Calves', 'Machine', 'weight_reps', [], [
    'Position your shoulders under the pads with the balls of your feet on the platform.',
    'Rise up onto your toes as high as possible.',
    'Lower back down until you feel a stretch in your calves.',
  ]),
  ex('seated-calf-raise', 'Seated Calf Raise', 'Calves', 'Machine', 'weight_reps', [], [
    'Sit with the pad resting on your lower thighs, balls of feet on the platform.',
    'Raise your heels as high as possible.',
    'Lower back down for a full stretch.',
  ]),
  ex('db-calf-raise', 'Dumbbell Calf Raise', 'Calves', 'Dumbbell', 'weight_reps', [], [
    'Stand holding dumbbells at your sides, balls of your feet on a raised surface.',
    'Rise up onto your toes.',
    'Lower back down for a full stretch.',
  ]),

  // ---- Cardio / Full Body ----
  ex('treadmill-run', 'Treadmill Run', 'Cardio', 'Machine', 'distance_duration', ['Full Body'], [
    'Set your desired pace and incline on the treadmill.',
    'Maintain steady form throughout the run.',
    'Cool down with a slower pace for the final minutes.',
  ]),
  ex('rowing-machine', 'Rowing Machine', 'Cardio', 'Machine', 'distance_duration', ['Back', 'Full Body'], [
    'Strap your feet in and grip the handle with arms extended.',
    'Drive with your legs, then lean back and pull the handle to your torso.',
    'Reverse the sequence to return to the start.',
  ]),
  ex('cycling', 'Stationary Bike', 'Cardio', 'Machine', 'distance_duration', ['Quadriceps'], [
    'Adjust the seat height so your knee is slightly bent at full extension.',
    'Pedal at your target intensity for the desired duration.',
  ]),
  ex('jump-rope', 'Jump Rope', 'Cardio', 'Other', 'duration', ['Calves', 'Full Body'], [
    'Hold the rope handles at hip height and swing it overhead.',
    'Jump just high enough to clear the rope as it passes underfoot.',
  ]),
  ex('burpee', 'Burpee', 'Full Body', 'Bodyweight', 'bodyweight_reps', ['Chest', 'Quadriceps', 'Abs'], [
    'From standing, drop into a squat and place your hands on the floor.',
    'Kick your feet back into a plank, then perform a push-up.',
    'Jump your feet back to your hands and explode upward into a jump.',
  ]),
  ex('kettlebell-swing', 'Kettlebell Swing', 'Full Body', 'Kettlebell', 'weight_reps', ['Glutes', 'Hamstrings', 'Back'], [
    'Stand with feet shoulder-width, kettlebell on the floor in front of you.',
    'Hinge and swing the kettlebell back between your legs.',
    'Drive your hips forward to swing the kettlebell up to chest height.',
  ]),
  ex('clean-and-jerk', 'Clean and Jerk', 'Full Body', 'Barbell', 'weight_reps', ['Shoulders', 'Quadriceps', 'Back'], [
    'Pull the bar explosively from the floor to your shoulders in one motion.',
    'Dip slightly and drive the bar overhead to lockout.',
    'Stabilize with feet in a split or squat stance, then stand tall.',
  ]),
  ex('thruster', 'Barbell Thruster', 'Full Body', 'Barbell', 'weight_reps', ['Quadriceps', 'Shoulders'], [
    'Hold the bar in a front rack position and squat down.',
    'Drive up out of the squat and press the bar overhead in one fluid motion.',
    'Lower the bar back to the rack position and repeat.',
  ]),
  ex('mountain-climber', 'Mountain Climber', 'Full Body', 'Bodyweight', 'duration', ['Abs', 'Quadriceps'], [
    'Start in a plank position with hands under your shoulders.',
    'Drive one knee toward your chest, then quickly switch legs.',
    'Keep your hips low and core braced throughout.',
  ]),
]

export const MUSCLE_GROUPS: Exercise['category'][] = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Abs',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardio', 'Full Body',
  'Traps', 'Lats', 'Neck', 'Adductors', 'Abductors', 'Finger & Grip',
]

export const EQUIPMENT_TYPES: Exercise['equipment'][] = [
  'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell',
  'Resistance Band', 'Smith Machine', 'EZ Bar', 'Plate', 'Other', 'None',
]
