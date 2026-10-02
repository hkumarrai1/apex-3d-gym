/**
 * ==============================================================================
 * GOOGLE GEMINI AI FITNESS ROUTINE & DYNAMIC WORKOUT GENERATOR
 * ==============================================================================
 */

export async function generateDynamicWorkoutWithGemini({
  muscleGroup = 'Chest',
  experienceLevel = 'Intermediate',
  weekNumber = 1,
  goal = 'Hypertrophy & Size'
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini')) {
    try {
      const prompt = `You are an elite master strength and conditioning coach at Apex 3D Athletics.
Generate a high-performance, progressive single-muscle workout protocol specifically targeting: "${muscleGroup}".
Context:
- Experience Level: ${experienceLevel}
- Week / Variation Cycle: Week ${weekNumber} (Ensure exercises and angles are varied and fresh compared to previous standard weeks)
- Goal: ${goal}

Requirements:
1. Provide 4 to 5 highly effective exercises targeting different heads/angles of the ${muscleGroup} muscle.
2. For each exercise, provide 3 to 4 progressive sets where reps vary progressively (e.g. Set 1: 12 reps, Set 2: 10 reps, Set 3: 8 reps, Set 4: 6 reps).
3. Include suggested rest timer in seconds for each set (e.g. 60, 75, 90).
4. Include concise biomechanical form tips and tempo execution.

Return ONLY a valid JSON object matching this exact schema with NO markdown fences, NO extra text:
{
  "routineTitle": "${muscleGroup} 3D Progressive Protocol (Week ${weekNumber})",
  "muscleTarget": "${muscleGroup}",
  "estimatedDurationMinutes": 50,
  "warmup": "5-7 mins dynamic mobility & warm-up sets",
  "exercises": [
    {
      "id": "ex-1",
      "name": "Exercise Name",
      "equipment": "Dumbbells / Barbell / Cable",
      "formTip": "Form guidance instruction",
      "tempo": "3-1-1 (3 sec eccentric)",
      "sets": [
        { "setNumber": 1, "targetReps": 12, "targetWeightKg": 20, "restSeconds": 60 },
        { "setNumber": 2, "targetReps": 10, "targetWeightKg": 25, "restSeconds": 75 },
        { "setNumber": 3, "targetReps": 8, "targetWeightKg": 30, "restSeconds": 90 }
      ]
    }
  ],
  "cooldownTip": "Cooldown & recovery instruction"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText.trim());
          console.log(`[GEMINI AI] Successfully generated dynamic ${muscleGroup} routine for Week ${weekNumber}`);
          return { success: true, source: 'Gemini AI', workout: parsed };
        }
      } else {
        console.warn(`[GEMINI AI] API request returned status ${response.status}. Using algorithmic generator.`);
      }
    } catch (err) {
      console.warn(`[GEMINI AI ERROR]`, err.message);
    }
  }

  // Smart Algorithmic Fallback with Single Muscle Variation & Dynamic Reps
  return {
    success: true,
    source: 'Algorithmic Engine (Add GEMINI_API_KEY for live AI)',
    workout: generateAlgorithmicSingleMuscleRoutine(muscleGroup, weekNumber)
  };
}

function generateAlgorithmicSingleMuscleRoutine(muscle, week) {
  const muscleDB = {
    Chest: [
      {
        id: 'chest-1',
        name: week % 2 === 1 ? 'Incline Dumbbell Bench Press (30° Angle)' : 'Barbell Incline Guillotine/Standard Press',
        equipment: week % 2 === 1 ? 'Adjustable Bench & Polyurethane Dumbbells' : 'Olympic Barbell & Incline Bench',
        formTip: 'Retract scapulae and press up along clavicular fiber line without flaring elbows.',
        tempo: '3-0-1 (3s negative)',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 20, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 24, restSeconds: 75 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 28, restSeconds: 90 },
          { setNumber: 4, targetReps: 6, targetWeightKg: 32, restSeconds: 90 }
        ]
      },
      {
        id: 'chest-2',
        name: week % 2 === 1 ? 'Flat Barbell Bench Press (Heavy Wave)' : 'Flat Dumbbell Press with Neutral Grip',
        equipment: 'Olympic Flat Bench',
        formTip: 'Touch mid-sternum, drive through feet, maintain tight arch.',
        tempo: '2-1-1 (1s pause at chest)',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 60, restSeconds: 75 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 70, restSeconds: 90 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 80, restSeconds: 90 }
        ]
      },
      {
        id: 'chest-3',
        name: 'Standing High-to-Low Cable Flyes',
        equipment: 'Dual Adjustable Cable Machine',
        formTip: 'Squeeze lower pecs at peak contraction for 1.5 seconds.',
        tempo: '2-0-2 (squeeze at bottom)',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 15, restSeconds: 60 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 17.5, restSeconds: 60 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 20, restSeconds: 75 }
        ]
      },
      {
        id: 'chest-4',
        name: 'Weighted Chest Dips (Forward Lean)',
        equipment: 'Parallel Dip Bars + Weight Belt',
        formTip: 'Lean torso 30° forward to isolate pectoral fibers.',
        tempo: '3-1-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 0, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 10, restSeconds: 75 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 15, restSeconds: 90 }
        ]
      }
    ],
    Back: [
      {
        id: 'back-1',
        name: week % 2 === 1 ? 'Deadlifts / Heavy Rack Pulls' : 'Weighted Neutral Grip Pull-Ups',
        equipment: 'Olympic Platform',
        formTip: 'Engage lats, push floor away through heels, lock hips.',
        tempo: '2-1-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 80, restSeconds: 90 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 100, restSeconds: 90 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 120, restSeconds: 120 },
          { setNumber: 4, targetReps: 6, targetWeightKg: 130, restSeconds: 120 }
        ]
      },
      {
        id: 'back-2',
        name: 'Chest-Supported T-Bar Rows',
        equipment: 'T-Bar Landmine Machine',
        formTip: 'Pull through elbows to target mid-traps and rhomboids.',
        tempo: '3-0-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 40, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 50, restSeconds: 75 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 60, restSeconds: 90 }
        ]
      },
      {
        id: 'back-3',
        name: 'Wide-Grip Lat Pulldown (Behind Neck / Chest)',
        equipment: 'Cable Pulldown Tower',
        formTip: 'Drive elbows down to waist level and avoid swinging.',
        tempo: '2-1-2',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 50, restSeconds: 60 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 57.5, restSeconds: 60 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 65, restSeconds: 75 }
        ]
      },
      {
        id: 'back-4',
        name: 'Single-Arm Dumbbell Kroc Row',
        equipment: 'Flat Bench & Heavy Dumbbell',
        formTip: 'Full stretch at bottom, explosive pull to hip pocket.',
        tempo: '2-0-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 26, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 30, restSeconds: 75 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 36, restSeconds: 75 }
        ]
      }
    ],
    Shoulders: [
      {
        id: 'sh-1',
        name: week % 2 === 1 ? 'Standing Overhead Military Barbell Press' : 'Seated Heavy Dumbbell Shoulder Press',
        equipment: 'Olympic Barbell & Squat Cage',
        formTip: 'Squeeze glutes and core to prevent lumbar hyperextension.',
        tempo: '3-0-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 40, restSeconds: 75 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 47.5, restSeconds: 90 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 55, restSeconds: 90 }
        ]
      },
      {
        id: 'sh-2',
        name: 'Leaning Single-Arm Cable Lateral Raise',
        equipment: 'Cable Machine',
        formTip: 'Lean 15° sideways to place continuous tension on lateral delt head.',
        tempo: '2-1-1',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 7.5, restSeconds: 45 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 10, restSeconds: 60 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 12.5, restSeconds: 60 }
        ]
      },
      {
        id: 'sh-3',
        name: 'Rear Delt Face Pulls with Rope (High Pulley)',
        equipment: 'Cable Machine & Rope Attachment',
        formTip: 'Pull towards forehead and externally rotate wrists backwards.',
        tempo: '2-2-1',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 20, restSeconds: 45 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 25, restSeconds: 60 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 30, restSeconds: 60 }
        ]
      }
    ],
    Legs: [
      {
        id: 'leg-1',
        name: week % 2 === 1 ? 'Barbell Olympic Back Squats' : 'Barbell Front Squats / Safety Bar Squats',
        equipment: 'Squat Cage & Olympic Barbell',
        formTip: 'Break parallel depth, maintain knees tracked over toes.',
        tempo: '3-1-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 80, restSeconds: 90 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 100, restSeconds: 90 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 110, restSeconds: 120 },
          { setNumber: 4, targetReps: 6, targetWeightKg: 120, restSeconds: 120 }
        ]
      },
      {
        id: 'leg-2',
        name: '45-Degree Incline Heavy Leg Press',
        equipment: 'Plate Loaded Leg Press',
        formTip: 'Place feet shoulder-width, lower until 90-degree knee flexion.',
        tempo: '3-0-1',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 160, restSeconds: 75 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 200, restSeconds: 90 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 240, restSeconds: 90 }
        ]
      },
      {
        id: 'leg-3',
        name: 'Romanian Dumbbell Deadlifts (Hamstring Focus)',
        equipment: 'Heavy Dumbbells',
        formTip: 'Hinge hips backwards, slight soft knee, feel deep hamstring stretch.',
        tempo: '3-1-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 28, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 34, restSeconds: 75 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 40, restSeconds: 75 }
        ]
      }
    ],
    Arms: [
      {
        id: 'arm-1',
        name: 'Incline Dumbbell Bicep Curls (Full Stretch)',
        equipment: 'Incline Bench (45°) & Dumbbells',
        formTip: 'Keep elbows locked backwards to maximize long-head bicep stretch.',
        tempo: '3-1-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 12.5, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 15, restSeconds: 60 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 17.5, restSeconds: 75 }
        ]
      },
      {
        id: 'arm-2',
        name: 'Overhead Rope Tricep Extensions (Cable)',
        equipment: 'High Cable & Rope',
        formTip: 'Flourish rope outward at full elbow lockout.',
        tempo: '2-1-1',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 22.5, restSeconds: 45 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 27.5, restSeconds: 60 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 32.5, restSeconds: 60 }
        ]
      },
      {
        id: 'arm-3',
        name: 'EZ-Bar Preacher Curls',
        equipment: 'Preacher Bench & EZ-Bar',
        formTip: 'Strict isolation with zero shoulder assistance.',
        tempo: '3-0-1',
        sets: [
          { setNumber: 1, targetReps: 12, targetWeightKg: 25, restSeconds: 60 },
          { setNumber: 2, targetReps: 10, targetWeightKg: 30, restSeconds: 60 },
          { setNumber: 3, targetReps: 8, targetWeightKg: 35, restSeconds: 75 }
        ]
      }
    ],
    Core: [
      {
        id: 'core-1',
        name: 'Hanging Leg Raises to Bar',
        equipment: 'Pull-Up Bar',
        formTip: 'Tilt pelvis up at peak contraction, avoid swinging.',
        tempo: '2-1-2',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 0, restSeconds: 45 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 0, restSeconds: 45 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 0, restSeconds: 60 }
        ]
      },
      {
        id: 'core-2',
        name: 'Cable Kneeling Woodchoppers / Crunches',
        equipment: 'High Cable Pulley',
        formTip: 'Flex spine using abdominal wall, do not pull with arms.',
        tempo: '2-1-1',
        sets: [
          { setNumber: 1, targetReps: 15, targetWeightKg: 30, restSeconds: 45 },
          { setNumber: 2, targetReps: 12, targetWeightKg: 35, restSeconds: 45 },
          { setNumber: 3, targetReps: 10, targetWeightKg: 40, restSeconds: 45 }
        ]
      }
    ]
  };

  const selectedExercises = muscleDB[muscle] || muscleDB.Chest;

  return {
    routineTitle: `${muscle.toUpperCase()} 3D TARGET PROTOCOL (Cycle Week ${week})`,
    muscleTarget: muscle,
    estimatedDurationMinutes: 45,
    warmup: '5 mins dynamic mobility & rotator cuff / joint activation',
    exercises: selectedExercises,
    cooldownTip: '5 mins deep tissue stretch & post-workout hydration'
  };
}
