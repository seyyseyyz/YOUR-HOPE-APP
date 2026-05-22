/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — data.js
   All static data: DASS-21 questions, clinic list, translation strings
   ═══════════════════════════════════════════════════════════════════ */

const QUESTIONS = [
  {id:1,s:'s',
   eng:"I found it hard to wind down (It was difficult for me to relax and calm down.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាពិបាកក្នុងការធ្វើឱ្យចិត្តស្ងប់ ឬសម្រាកឱ្យធូរស្រាល។"},

  {id:2,s:'a',
   eng:"I was aware of dryness of my mouth (My mouth felt dry.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាស្ងួតមាត់។"},

  {id:3,s:'d',
   eng:"I couldn’t seem to experience any positive feeling at all",
   kh:"ខ្ញុំហាក់ដូចជាមិនមានអារម្មណ៍សប្បាយរីករាយទាល់តែសោះ។"},

  {id:4,s:'a',
   eng:"I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion) (I had trouble breathing, like breathing quickly or feeling out of breath, even when I was not moving.)",
   kh:"ខ្ញុំមានការពិបាកដកដង្ហើម (ឧទាហរណ៍៖ ដកដង្ហើមញាប់ខ្លាំង ឬថប់ដង្ហើម ទោះបីជាមិនបានធ្វើការធ្ងន់ក៏ដោយ)។"},

  {id:5,s:'d',
   eng:"I found it difficult to work up the initiative to do things (I had no energy to do anything or to start tasks.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាពិបាកក្នុងការផ្ដើមធ្វើអ្វីមួយ (ខ្វះការតាំងចិត្ត ឬទឹកចិត្តក្នុងការធ្វើការងារ)។"},

  {id:6,s:'s',
   eng:"I tended to over-react to situations (I got upset or angry very easily, even for small reasons.)",
   kh:"ខ្ញុំមានប្រតិកម្មឆ្លើយតបខ្លាំង ចំពោះគ្រប់ស្ថានភាព គ្រប់ពេល។"},

  {id:7,s:'a',
   eng:"I experienced trembling (e.g. in the hands) (I felt shaking in my body, like my hands shaking.)",
   kh:"ខ្ញុំមានអាការៈញ័រ (ឧទាហរណ៍៖ ញ័រដៃ)។"},

  {id:8,s:'s',
   eng:"I felt that I was using a lot of nervous energy (I felt very nervous all the time and it made me tired.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាភ័យព្រួយខ្លាំងគ្រប់ពេលវេលា ហើយវាធ្វើឱ្យខ្ញុំអស់កម្លាំងខ្លាំងណាស់។"},

  {id:9,s:'a',
   eng:"I was worried about situations in which I might panic and make a fool of myself",
   kh:"ខ្ញុំមានការព្រួយបារម្ភអំពីស្ថានភាពដែលអាចធ្វើឱ្យខ្ញុំស្លន់ស្លោ និងក្លាយជាមនុស្សគួរឱ្យអស់សំណើច។"},

  {id:10,s:'d',
   eng:"I felt that I had nothing to look forward to",
   kh:"ខ្ញុំមានអារម្មណ៍ថា គ្មានអ្វីដែលត្រូវរំពឹងទុក ឬរង់ចាំមើលក្នុងពេលអនាគតឡើយ។"},

  {id:11,s:'s',
   eng:"I found myself getting agitated (I became upset, nervous, or angry easily.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាខ្លួនឯងមានការមួម៉ៅ ឬមិនស្រណុកក្នុងចិត្ត។"},

  {id:12,s:'s',
   eng:"I found it difficult to relax",
   kh:"ខ្ញុំមានអារម្មណ៍ថាពិបាកក្នុងការសម្រាកកាយ។"},

  {id:13,s:'d',
   eng:"I felt down-hearted and blue (I felt very sad or unhappy.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាបាក់ទឹកចិត្ត និងស្រងេះស្រងោច។"},

  {id:14,s:'s',
   eng:"I was intolerant of anything that kept me from getting on with what I was doing (I was easily annoyed by things that stopped me from doing what I wanted.)",
   kh:"ខ្ញុំមិនមានការអត់ធ្មត់ចំពោះអ្វីដែលរំខាន ឬរារាំងដល់ការងារដែលខ្ញុំកំពុងធ្វើនោះទេ។"},

  {id:15,s:'a',
   eng:"I felt I was close to panic",
   kh:"ខ្ញុំមានអារម្មណ៍ថាខ្ញុំឆាប់មានការស្លន់ស្លោ។"},

  {id:16,s:'d',
   eng:"I was unable to become enthusiastic about anything (I couldn’t get excited about anything, even things I used to like.)",
   kh:"ខ្ញុំមិនអាចមានអារម្មណ៍រំភើប ចំពោះរឿងអ្វីទាំងអស់។"},

  {id:17,s:'d',
   eng:"I felt I wasn’t worth much as a person",
   kh:"ខ្ញុំមានអារម្មណ៍ថាខ្លួនឯងជាមនុស្សមិនសូវមានតម្លៃ។"},

  {id:18,s:'s',
   eng:"I felt that I was rather touchy (I got upset or annoyed easily, even over small things.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាឆាប់ប៉ះទង្គិចចិត្ត ឬងាយនឹងខឹងសម្បារ។"},

  {id:19,s:'a',
   eng:"I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat) (I could feel my heart beating faster or skipping beats, even when I wasn’t doing anything.)",
   kh:"ខ្ញុំអាចដឹងថាបេះដូងរបស់ខ្ញុំលោតញាប់ជាងមុន ឬដើរខុសចង្វាក់ ទោះបីជាក្នុងពេលដែលខ្ញុំមិនបានធ្វើសកម្មភាពអ្វីសោះក៏ដោយ។"},

  {id:20,s:'a',
   eng:"I felt scared without any good reason",
   kh:"ខ្ញុំមានអារម្មណ៍ភ័យខ្លាចដោយគ្មានមូលហេតុច្បាស់លាស់។"},

  {id:21,s:'d',
   eng:"I felt that life was meaningless (I felt like life had no purpose or that nothing was important.)",
   kh:"ខ្ញុំមានអារម្មណ៍ថាជីវិតគ្មានន័យទាល់តែសោះ។"}
];

/* ── RECOMMENDATIONS ───────────────────────── */
const RECOMMENDATIONS = {
  Normal: {
    title: {
      eng: "Normal Level",
      kh: "កម្រិតធម្មតា"
    },

    summary: {
      eng: "Your scores are in a healthy range. Keep maintaining good mental habits.",
      kh: "ពិន្ទុរបស់អ្នកស្ថិតក្នុងកម្រិតល្អ។ សូមបន្តរក្សាទម្លាប់ល្អសម្រាប់សុខភាពផ្លូវចិត្ត។"
    },

    tips: {
      eng: [
        "Keep a regular sleep schedule and get 7–9 hours of sleep.",
        "Set goals, but do not be too hard on yourself.",
        "Practice mindfulness such as deep breathing or mindful walking.",
        "Exercise regularly.",
        "Try journaling or gratitude practice."
      ],

      kh: [
        "រក្សាកាលវិភាគគេងឱ្យបានទៀងទាត់ និងគេងឱ្យបាន ៧-៩ ម៉ោងក្នុងមួយយប់។",
        "កំណត់គោលដៅខ្ពស់ ប៉ុន្តែកុំតឹងរ៉ឹងជាមួយខ្លួនឯងខ្លាំងពេក។",
        "អនុវត្តការហាត់ចិត្ត ដូចជាការដកដង្ហើមវែងៗ ឬការដើរដោយផ្ដោតអារម្មណ៍។",
        "ហាត់ប្រាណឱ្យបានទៀងទាត់។",
        "សាកល្បងសរសេរកំណត់ហេតុ ឬអរគុណចំពោះអ្វីដែលអ្នកមាន។"
      ]
    }
  },

  Mild: {
    title: {
      eng: "Mild Level",
      kh: "កម្រិតស្រាល"
    },

    summary: {
      eng: "Some symptoms are present. Small daily habits may help improve your mental wellness.",
      kh: "មានរោគសញ្ញាមួយចំនួន។ ទម្លាប់ល្អប្រចាំថ្ងៃអាចជួយឱ្យសុខភាពផ្លូវចិត្តប្រសើរឡើង។"
    },

    tips: {
      eng: [
        "Avoid screens before sleeping.",
        "Be kinder to yourself and focus on effort, not perfection.",
        "Practice short mindfulness exercises.",
        "Exercise regularly to reduce anxiety.",
        "Write your feelings in a journal."
      ],

      kh: [
        "ចៀសវាងការប្រើទូរស័ព្ទមុនពេលចូលគេង។",
        "រៀនផ្ដល់ក្ដីស្រឡាញ់ដល់ខ្លួនឯង និងផ្ដោតលើការខិតខំប្រឹងប្រែង។",
        "សាកល្បងលំហាត់ហាត់ចិត្តខ្លីៗ។",
        "ហាត់ប្រាណដើម្បីកាត់បន្ថយការថប់បារម្ភ។",
        "សាកល្បងសរសេរអារម្មណ៍របស់អ្នកក្នុងកំណត់ហេតុ។"
      ]
    }
  },

  Moderate: {
    title: {
      eng: "Moderate Level",
      kh: "កម្រិតមធ្យម"
    },

    summary: {
      eng: "Your symptoms are more noticeable. Consider getting support early.",
      kh: "រោគសញ្ញារបស់អ្នកចាប់ផ្ដើមមានឥទ្ធិពលខ្លាំង។ សូមពិចារណាស្វែងរកជំនួយឱ្យបានឆាប់។"
    },

    tips: {
      eng: [
        "Follow a bedtime routine to improve sleep.",
        "Talk to a counselor or therapist if needed.",
        "Join mindfulness groups or classes.",
        "Try yoga or gentle exercise.",
        "Use relaxation techniques before bed."
      ],

      kh: [
        "បង្កើតទម្លាប់មុនពេលចូលគេង ដើម្បីជួយឱ្យគេងបានលក់ស្រួល។",
        "ពិគ្រោះជាមួយអ្នកប្រឹក្សា ឬអ្នកជំនាញផ្លូវចិត្ត ប្រសិនបើចាំបាច់។",
        "ចូលរួមក្រុម ឬថ្នាក់ហាត់ចិត្ត។",
        "សាកល្បងហាត់យោគៈ ឬលំហាត់ប្រាណស្រាលៗ។",
        "ប្រើបច្ចេកទេសសម្រាកកាយមុនពេលចូលគេង។"
      ]
    }
  },

  Severe: {
    title: {
      eng: "Severe Level",
      kh: "កម្រិតធ្ងន់"
    },

    summary: {
      eng: "Your symptoms are high. Professional support is strongly recommended.",
      kh: "រោគសញ្ញារបស់អ្នកមានកម្រិតខ្ពស់។ សូមស្វែងរកជំនួយពីអ្នកជំនាញ។"
    },

    tips: {
      eng: [
        "Seek professional mental health support.",
        "Consult a sleep specialist if sleep problems continue.",
        "Therapy such as CBT may help reduce anxiety.",
        "Join support groups if available.",
        "Visit a clinic or hospital if symptoms affect daily life."
      ],

      kh: [
        "ស្វែងរកជំនួយពីអ្នកជំនាញសុខភាពផ្លូវចិត្ត។",
        "ពិគ្រោះជាមួយអ្នកជំនាញការគេង ប្រសិនបើមានបញ្ហាគេងមិនលក់។",
        "ការព្យាបាលតាមបែប CBT អាចជួយកាត់បន្ថយការថប់បារម្ភ។",
        "ចូលរួមក្រុមគាំទ្រ ប្រសិនបើអាចធ្វើបាន។",
        "ទៅកាន់គ្លីនិក ឬមន្ទីរពេទ្យ ប្រសិនបើរោគសញ្ញាប៉ះពាល់ដល់ជីវិតប្រចាំថ្ងៃ។"
      ]
    }
  },

  "Extremely Severe": {
    title: {
      eng: "Extremely Severe Level",
      kh: "កម្រិតធ្ងន់ធ្ងរបំផុត"
    },

    summary: {
      eng: "Your symptoms are very severe. Please seek professional help as soon as possible.",
      kh: "រោគសញ្ញារបស់អ្នកស្ថិតក្នុងកម្រិតធ្ងន់ធ្ងរ។ សូមស្វែងរកជំនួយពីអ្នកជំនាញឱ្យបានឆាប់តាមដែលអាចធ្វើទៅបាន។"
    },

    tips: {
      eng: [
        "Contact a mental health professional immediately.",
        "Medication may be needed together with therapy.",
        "Consider intensive therapy such as CBT or MBCT.",
        "Get regular support from mental health professionals.",
        "Visit emergency support services if necessary."
      ],

      kh: [
        "ទាក់ទងអ្នកជំនាញសុខភាពផ្លូវចិត្តភ្លាមៗ។",
        "ការប្រើប្រាស់ថ្នាំអាចចាំបាច់ រួមជាមួយការព្យាបាល។",
        "ពិចារណាការព្យាបាលយ៉ាងយកចិត្តទុកដាក់ ដូចជា CBT ឬ MBCT។",
        "ទទួលការគាំទ្រជាប្រចាំពីអ្នកជំនាញសុខភាពផ្លូវចិត្ត។",
        "ទៅកាន់សេវាជំនួយបន្ទាន់ ប្រសិនបើចាំបាច់។"
      ]
    }
  }
};

const QUOTE_CATEGORIES = [
  { key: 'all', eng: 'All', kh: 'ទាំងអស់' },
  { key: 'hope', eng: 'Hope', kh: 'សង្ឃឹម' },
  { key: 'strength', eng: 'Strength', kh: 'ភាពរឹងមាំ' },
  { key: 'selfCare', eng: 'Self-care', kh: 'ថែទាំខ្លួនឯង' },
  { key: 'mindfulness', eng: 'Mindfulness', kh: 'ការយកចិត្តទុកដំ' },
  { key: 'growth', eng: 'Growth', kh: 'ការលូតលាស់' },
  { key: 'gratitude', eng: 'Gratitude', kh: 'ការដឹងគុណ' }
];

const QUOTES = {
  eng: {
    hope: [
      "If we didn't have nightmares, we wouldn't wake up every morning chasing our dreams",
      'Look forward with hope, not backwards with regret',
      'Remember, no matter what this week brings, you can handle it.',
      'Your worries are lying to you. You are loved, you are accepted, and you are wanted.',
      'Even your worst days only have twenty-four hours. The sun will set, and a new day will begin.',
      "If you're always wishing for a better tomorrow, maybe it's time to enjoy the best of today.",
      'This page might not be your favorite, but the next chapter of your life will be incredible.',
      'Life can be stormy. Hold your umbrella high and be patient. The skies will clear for you soon.',
      "It won't always be easy. It won't always be fun. But in the end, it'll always be worth it.",
      'You are needed, you deserve the best, you are here for a reason.',
      'Everything happens for a reason. Life puts you down, only so you can get back up for the better things. Live life, forgive and forget. Let go of the past.'
    ],
    strength: [
      "Day will come when you don't want to fight, but you must put the gloves on, anyway.",
      'The strongest people are the people who have faced defeat and decided to punch it in the face.',
      "You are pushing yourself even when you're tired and want to quit. I see the warrior in you.",
      'You have gone through fire. Now it is time to let those flames light the way forward.',
      'Even when things are difficult, you have within you everything you need to get through it.',
      "Keep going, even when you feel like you can't take another step.",
      'Sometimes it takes an overwhelming breakdown to have an undeniable breakthrough.',
      'Do what is best for your heart, even if that means leaving'
    ],
    selfCare: [
      'They say "Follow your heart". But I can\'t follow you where you\'re going',
      'Follow your soul. It knows the way.',
      'I stopped measuring my life against people who inherited their starting line.',
      'Social anxiety results from being around people who are resolutely opposed to who you are.',
      'We don\'t get to choose our family, but we can choose our friends. With courage, we can weed out narcissistic people. We can focus on those who do appreciate us, love us, and treat us with respect.',
      'Family is supposed to be our safe heaven. Very often, it\'s the place where we find the deepest heartache.',
      'Sometimes you need to distance yourself to see things clearly.',
      'Know what makes you happy and do more of it.',
      'Your imperfections and flaws are the best parts of you, be proud of them.',
      'When your heart and your brain are at war, listen to the one that urges you to keep going.',
      'Do what is best for your heart, even if that means leaving'
    ],
    mindfulness: [
      'The mind is like water. When it\'s turbulent, it\'s difficult to see. When it\'s calm, everything becomes clear.',
      'I found it difficult to relax',
      'Stop the overthinking and watch how easily the good vibes will overflow.',
      'Release what no longer serves you.',
      'Your thoughts will change your life. Choose them wisely.',
      'This is no losing. There are only opportunities to learn and grow.',
      "If you're always wishing for a better tomorrow, maybe it's time to enjoy the best of today."
    ],
    growth: [
      'Obstacles and struggles are a gift; they encourage you to grow.',
      'Working on your dream whenever it is convenient for you will not work. When you dare to dream, you should also dare to do.',
      'Dreams become regrets when left in the mind, never planted in the soil of action',
      'A rose grows through the concrete regardless of the terrain, it still pushed through. Be that rose and grow.',
      'Sometimes it takes an overwhelming breakdown to have an undeniable breakthrough.'
    ],
    gratitude: [
      'If you have good thoughts, they will shine out of your face like sunbeams, and you will always look lovely',
      'After a good dinner, one can forgive anybody, even one\'s own relations.',
      'Be grateful for every opportunity that life gives you.',
      'Celebrate your strengths, you\'ve fought hard to achieve them.'
    ]
  },
  kh: {
    hope: [
      'ប្រសិនបើយើងមិនមានសុបិន្តអាក្រក់នោះយើងនឹងមិនដឹងថាលូតលាស់ពេញលេញ',
      'មើលទៅមុខដោយសង្ឃឹម មិនមើលថយក្រោយដោយស្ទាក់ស្ទើរ',
      'ចងចាំថា មិនថាសប្តាហ៍នេះនាំមកផ្លូវដូចម្តេចក្តី អ្នកអាចគាំងវាបាន',
      'ការថប់បារម្ភរបស់អ្នកឈកចាប់របស់អ្នក អ្នកត្រូវបានស្រឡាញ់ អ្នកត្រូវបានទទួលយក ហើយអ្នកត្រូវការ',
      'សូម្បីថ្ងៃខាងក្រោមរបស់អ្នកក្៏ខណៈពេលដប៉ាន់ម៉ាង។ ព្រះអាទិត្យនឹងលិច ហើយថ្ងៃថ្មីនឹងក្រោក',
      'ប្រសិនបើអ្នកក្រោកស្មោះបដិរដើម្បីថ្ងៃក្រោយល្អ ប្រាប់ឡើងវិលមកវិលលេងថ្ងៃថ្មីដែលល្អ',
      'ទំព័ររឌ័រនេះប្រហែលជាមិនដែលរបស់អ្នកទេ ប៉ុន្តែវគ្គចាប់ក្រោយក្រោយក្នុងជីវិតរបស់អ្នក នឹងវាលឆ្ងាយ',
      'ជីវិតអាចមានព្យុះលេចចេញ។ ឡើងកម្ពស់ ហើយដោះលែងក្នុងការរង្ហន់។ ឈាក់នឹងប្រឹងឡើងយ៉ាងលឿន',
      'វាមិនតែងតែងាយស្រួល វាមិនតែងតែសប្បាយក្បាលទេ។ ប៉ុន្ដែលលទ្ធផល វាតែងតែមានតម្លៃ',
      'អ្នកត្រូវការ អ្នកសមរម្យដែលល្អបំផុត អ្នកនៅទីនេះដោយហេតុផល',
      'អ្វីគ្រប់យ៉ាងកើតឡើងដោយហេតុផល។ ជីវិតបង្វិលក្នុងលោងក្រោយ ដូច្នេះអ្នកអាចរំណើរដ្ឆាប់។ រស់នៅក្នុងជីវិត ឆាប់ឆ្ងើយ ឡើងលែង។ ដោះលែងចាប់ពីអតីតកាល'
    ],
    strength: [
      'ថ្ងៃនឹងមកដែលអ្នកមិនចង់싸싹ដល់ប៉ុន្តែបង្ខំឱ្យលើកស្រមាប់រំលាក់',
      'មនុស្សខ្លាំងបំផុតគឺមនុស្សដែលបានប្រឈមប្រឈង ហើយសម្រេចចិត្តលង្គឹងវា',
      'អ្នកបង្ខំខ្លួនឯង ថែមទាំងពេលដែលអ្នកស្ថិតក្នុងភាពយ៉ាង ខ្ញុំឃើញលេបរណ្ដៅក្នុងអ្នក',
      'អ្នកបានឆ្លងកាត់불 ឥឡូវ វេលាកសិកម្មដ្ឆាប់វាឡើងមុខ',
      'ឬឯងក្នុងស្ថានការណ៍ដ៏ពិបាក អ្នកមានគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីឆ្លងកាត់វា',
      'វាមិនតែងតែងាយស្រួល វាមិនតែងតែសប្បាយក្បាលទេ។ ប៉ុន្ដែលលទ្ធផល វាតែងតែមានតម្លៃ',
      'ពេលខ្លះវាត្រូវការស្វាលក្រោយមកដើម្បីឈានទៅចៀងថ្មី',
      'ធ្វើការល្អបំផុតដែលស្ដិតរបស់អ្នក ឯណាយ៉ាងក៏ដោយ'
    ],
    selfCare: [
      'ពួកគេនិយាយថា "បង្វែលចិត្តរបស់អ្នក" ប៉ុន្តែខ្ញុំមិនអាចធ្វើតាមអ្នកបានទេ',
      'ធ្វើឱ្យបង្វែលក្រុមទីពីររបស់អ្នក វាដឹងលក្ខណៈផ្លូវ',
      'ខ្ញុំឈប់ស្វាងជីវិតរបស់ខ្ញុំប្រឆាំងនឹងមនុស្សដែលបានទទួលផ្តើមដោយស្វាភាវិក',
      'ការថប់បារម្ភសង្គមបង្កើតចេញពីការស្ថិតក្នុងរង្វង់បងប្អូនដែលប្រឆាំងនឹងអ្នក',
      'យើងមិនបានជ្រើសរើសក្រុមគ្រួសាររបស់យើង ប៉ុន្តែយើងអាចជ្រើសរើសមិត្ត។ ដោយក្លាហាន យើងអាចលុបបង្គោលមនុស្សឆ្កួត ហើយផ្តោតលើអ្នកដែលពិតជាគោរពយើង',
      'គ្រួសារគឺគួរតែជាដ្ឋានសុវត្ថិភាពរបស់យើង ប៉ុន្តែឯកសារច្រើនដង វាជាកន្លែងដែលយើងរកឃើញការឈឺចាប់ជ្រើលជ្រាល',
      'ពេលខ្លះអ្នកត្រូវរំដោះខ្លួនឱ្យឃើញយ៉ាងច្បាស់',
      'ស្វាយថាតើអ្វីដែលធ្វើឱ្យលេងលឺ ហើយធ្វើវាច្រើនទៀត',
      'ពិការភាព និងកង្វល់របស់អ្នកគឺផ្នែកល្អបំផុតរបស់អ្នក ធ្វើឱ្យមាននឹក',
      'នៅពេលដែលស្ដិតរបស់អ្នក និងខួរក្បាលស្ស្ស័ నుఌើង បង្វែលលេងលឺ',
      'ធ្វើការល្អបំផុតដែលស្ដិតរបស់អ្នក ឯណាយ៉ាងក៏ដោយ'
    ],
    mindfulness: [
      'ចិត្តគឺដូចទឹក។ នៅពេលដែលវាវឹកវរ ពិបាកក្នុងការឃើញ។ នៅពេលដែលវាស្ងប់ សេចក្តីលែងក្លាយជាច្បាស់លាស់។',
      'ខ្ញុំមានអារម្មណ៍ថាពិបាកក្នុងការសម្រាកកាយ',
      'ឈប់ការគិតគូរច្រើនដង ហើយមើលថាតើរលាយល្អរីករាយកើតឡើងដោយរបៀបណា',
      'ដោះលែងដូចម្តេចដែលលែងបម្រើយើង',
      'គំនិតរបស់អ្នកនឹងផ្លាស់ប្តូរជីវិតរបស់អ្នក។ ជ្រើសរើសវាដោយប្រាជ្ញា',
      'គ្មានការបាត់បង់ទេ មានតែឱកាសក្នុងការរៀនសូត្របង្វឺត',
      'ប្រសិនបើអ្នកក្រោកស្មោះបដិរដើម្បីថ្ងៃក្រោយល្អ ប្រាប់ឡើងវិលមកវិលលេងថ្ងៃថ្មីដែលល្អ'
    ],
    growth: [
      'ឧបសគ្គ និងការលំបាកគឺជាវមនីយ; ពួកវាលើកទឹកចិត្តឱ្យអ្នកលូតលាស់។',
      'ធ្វើការលើសុបិន្តរបស់អ្នកក្នុងពេលវេលាដែលងាយស្រួលនឹងមិនដំណើរការទេ។ ពេលដែលអ្នកក្លាហាននឹងសុបិន្ត អ្នកក៏ត្រូវក្លាហាននឹងលទ្ធផល។',
      'សុបិន្តក្លាយជាសក្សមចាប់តាំងពីវាស្ថិតក្នុងចិត្ត មិនដាំក្នុងដីនៃសកម្មភាពទេ',
      'ផ្កាកូសនឹងរីកចម្រើននៅក្នុងបេតុង ក្រោយក្រោយក្រោយ វាឈានទៅមុខ។ ក្លាយជាផ្កាលោក ហើយលូតលាស់',
      'ពេលខ្លះវាត្រូវការស្វាលក្រោយមកដើម្បីឈានទៅចៀងថ្មី'
    ],
    gratitude: [
      'ប្រសិនបើអ្នកមានគំនិតល្អ វានឹងភ្លឺលាស់ដូចកាំរស្មីព្រះអាទិត្យ ហើយអ្នកនឹងតែងតែមើលឃើញពន្លឺ',
      'បន្ទាប់ពីរៀបចំឡាន អ្នកអាចលើកលែងឱ្យមនុស្សណាម្នាក់ សូម្បីតែក្រុមគ្រួសាររបស់ខ្លួនក៏ដោយ',
      'សូមស្វាគមន៍ចំពោះឱកាសគ្រប់គ្រាន់ដែលជីវិតផ្តល់ឱ្យអ្នក',
      'ប្រកាសលម្អដែលអ្នកបានប្រឹងប្រសិន'
    ]
  }
};


/* ── DASS-21 SCORING THRESHOLDS ─────────────────────────────────── */
function getLevel(scale, score) {
  if (scale === 'd') {
    if (score <= 9)  return 'Normal';
    if (score <= 13) return 'Mild';
    if (score <= 20) return 'Moderate';
    if (score <= 27) return 'Severe';
    return 'Extremely Severe';
  }
  if (scale === 'a') {
    if (score <= 7)  return 'Normal';
    if (score <= 9)  return 'Mild';
    if (score <= 14) return 'Moderate';
    if (score <= 19) return 'Severe';
    return 'Extremely Severe';
  }
  // stress
  if (score <= 14) return 'Normal';
  if (score <= 18) return 'Mild';
  if (score <= 25) return 'Moderate';
  if (score <= 33) return 'Severe';
  return 'Extremely Severe';
}

/* ── CLINIC DATA (100 entries from dataset) ─────────────────────── */
const CLINICS = [
  {id:1,  name:"Sombok Psychology",                                          loc:"Boeung Keng Kang", tel:"077566110",  type:"Clinic",   cat:"Mental Health Service",      hours:"Mon-Fri 8:00AM-5:00PM, Sat 8:00AM-7:00PM",             target:"Children, Adolescents, Adults",  nssf:"No",  services:"Counseling, Therapy"},
  {id:2,  name:"Mind Care Clinic",                                           loc:"Russey Keo",       tel:"N/A",        type:"Clinic",   cat:"Mental Health Clinic",       hours:"N/A",                                                   target:"N/A",                            nssf:"No",  services:"N/A"},
  {id:3,  name:"TPO Cambodia",                                               loc:"Sen Sok",          tel:"095777004",  type:"NGO",      cat:"Non-profit Organization",    hours:"Mon-Sun 8:00AM-4:00PM",                                 target:"Community, Vulnerable groups",   nssf:"No",  services:"Mental health support, Counseling, Community programs"},
  {id:4,  name:"Sunrise Mental Cabinet",                                     loc:"Sen Sok",          tel:"085545545",  type:"Clinic",   cat:"Mental Health Service",      hours:"Mon-Sun 8:00AM-6:00PM",                                 target:"Adults",                         nssf:"No",  services:"Counseling, Therapy"},
  {id:5,  name:"Royal Phnom Penh Hospital",                                  loc:"Sen Sok",          tel:"023991000",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare, emergency care"},
  {id:6,  name:"Bright Minds",                                               loc:"Chamkar Mon",      tel:"077532041",  type:"Clinic",   cat:"Mental Health Service",      hours:"Mon-Fri 9:00AM-6:00PM, Sat 9:00AM-2:00PM",             target:"Adults",                         nssf:"No",  services:"Counseling, therapy"},
  {id:7,  name:"Mental Heath Trust by Prof. Heng Sovandara",                 loc:"Russey Keo",       tel:"012388128",  type:"Clinic",   cat:"Mental Health Service",      hours:"Mon-Fri 1:00-9:00PM, Sat-Sun 7:00AM-9:00PM",           target:"Adults",                         nssf:"No",  services:"Counseling, Therapy"},
  {id:8,  name:"Calmette Hospital (Mental Health Unit)",                     loc:"Daun Penh",        tel:"023426948",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"Psychiatric services, mental health consultation, counseling"},
  {id:9,  name:"Khmer-Soviet Friendship Hospital (Psychiatry Dept.)",        loc:"Mean Chey",        tel:"023217524",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"Psychiatric services, mental health consultation, counseling"},
  {id:10, name:"Sunrise Japan Hospital Phnom Penh",                          loc:"Chroy Changvar",   tel:"023260152",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare, emergency care, mental health services"},
  {id:11, name:"International Organization for Migration",                   loc:"Daun Penh",        tel:"095805306",  type:"NGO",      cat:"Mental Health Service",      hours:"Mon-Fri 7:30AM-5:00PM",                                 target:"Community, vulnerable groups",   nssf:"No",  services:"Mental health support, psychosocial support, counseling"},
  {id:12, name:"International SOS Clinic",                                   loc:"Tuol Kouk",        tel:"023216932",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Fri 8:00AM-5:00PM",                                 target:"All ages",                       nssf:"No",  services:"General healthcare, emergency care, mental health support"},
  {id:13, name:"Raffles Medical Phnom Penh",                                 loc:"Daun Penh",        tel:"023216911",  type:"Clinic",   cat:"Healthcare Provider",        hours:"Mon-Sun 7:00AM-9:00PM",                                 target:"All ages",                       nssf:"No",  services:"General healthcare, consultation, mental health support"},
  {id:14, name:"Central Hospital (Phnom Penh)",                              loc:"Daun Penh",        tel:"023214955",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare, consultation, medical treatment"},
  {id:15, name:"Sen Sok International University Hospital",                  loc:"Sen Sok",          tel:"070888251",  type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare, consultation, medical treatment"},
  {id:16, name:"Khema International Polyclinic",                             loc:"Boeung Keng Kang", tel:"098911811",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare, consultation, mental health support"},
  {id:17, name:"WHO Cambodia (mental health initiatives)",                   loc:"Boeung Keng Kang", tel:"N/A",        type:"NGO",      cat:"Non-profit Organization",    hours:"N/A",                                                   target:"Community, vulnerable groups",   nssf:"No",  services:"Mental health support, policy development, program support"},
  {id:18, name:"Amari Mental Health Center",                                 loc:"Daun Penh",        tel:"0966965999", type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sat 8:00AM-7:00PM",                                 target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:19, name:"Serena Clinic",                                              loc:"Sen Sok",          tel:"086988289",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sun 8:00AM-8:00PM",                                 target:"Adults, Adolescents",            nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:20, name:"Piphup Panha Mental Care Clinic",                            loc:"Tuol Kouk",        tel:"015788773",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sun 6:00AM-8:00PM",                                 target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:21, name:"Counselling Centre for Living Well",                         loc:"Sen Sok",          tel:"092677021",  type:"Service",  cat:"Mental Health Service",      hours:"Tue-Fri 9:00AM-5:00PM",                                 target:"Adults",                         nssf:"No",  services:"Counseling, psychotherapy, mental health support"},
  {id:22, name:"TTK Mental Clinic",                                          loc:"Mean Chey",        tel:"012650115",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Fri 7:00AM-7:00PM, Sat-Sun 7:30AM-6:00PM",         target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:23, name:"Mental Care Dr. Toun Sovannith",                             loc:"Sen Sok",          tel:"012375733",  type:"Clinic",   cat:"Mental Health Service",      hours:"Mon-Fri 9:00AM-5:00PM",                                 target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:24, name:"SMC Clinic Hypnosis and Psychoanalysis",                     loc:"Boeung Keng Kang", tel:"017545565",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Fri 7:30AM-6:00PM",                                 target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:25, name:"Early Intervention and Complex Care in Psychiatry",          loc:"Russey Keo",       tel:"012388128",  type:"Service",  cat:"Mental Health Clinic",       hours:"Mon-Fri 1:00PM-9:00PM, Sat-Sun 7:00AM-9:00PM",         target:"Children, Adolescents",          nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:26, name:"Develda Medical Center",                                     loc:"Tuol Kouk",        tel:"017277077",  type:"Service",  cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare"},
  {id:27, name:"Mental Clinic Spécialiste en psychologie",                   loc:"Dangkor",          tel:"087744913",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sat 9:00AM-12:00AM",                                target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:28, name:"Indradhanu Child & Adolescent Mental Health Clinic",         loc:"Russey Keo",       tel:"012775572",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sun 8:00AM-5:00PM",                                 target:"Children",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:29, name:"Dr Krzysztof Kosminski (psychiatrist)",                      loc:"Daun Penh",        tel:"087449754",  type:"Service",  cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"Adults",                         nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:30, name:"Khema International Hospital",                               loc:"Tuol Kouk",        tel:"099667066",  type:"Service",  cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare"},
  {id:31, name:"CMMC / Jeremiah's Hope Cambodia",                            loc:"Tuol Kouk",        tel:"017603607",  type:"Service",  cat:"Healthcare Provider",        hours:"Mon-Fri 8:00AM-5:00PM",                                 target:"Community / Children",           nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:32, name:"Procare Medical Center (International Doctors)",             loc:"Daun Penh",        tel:"061828410",  type:"Service",  cat:"General",                    hours:"Mon-Sat 8:30AM-6PM",                                    target:"All ages",                       nssf:"No",  services:"General healthcare"},
  {id:33, name:"AROM Station",                                               loc:"Sen Sok",          tel:"095991599",  type:"Service",  cat:"Healthcare Provider",        hours:"Mon-Sun 6:00AM-6:00PM",                                 target:"Community",                      nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:34, name:"Sihanouk Hospital Center of HOPE",                           loc:"7 Makara",         tel:"023882484",  type:"Hospital", cat:"Healthcare Provider",        hours:"Mon-Sun 7:30AM-5:00PM",                                 target:"All ages",                       nssf:"No",  services:"General healthcare"},
  {id:35, name:"Olympia Medical Center",                                     loc:"7 Makara",         tel:"N/A",        type:"Service",  cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"No",  services:"General healthcare"},
  {id:36, name:"Preah Ang Duong Hospital",                                   loc:"Daun Penh",        tel:"023218875",  type:"Hospital", cat:"General",                    hours:"Mon-Sat 8:00AM-5:00PM",                                 target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:37, name:"National Pediatric Hospital",                                loc:"Tuol Kouk",        tel:"023884137",  type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"Children",                       nssf:"Yes", services:"General healthcare"},
  {id:38, name:"Preah Ket Mealea Hospital",                                  loc:"Daun Penh",        tel:"023427229",  type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"Adults (military + general)",    nssf:"Yes", services:"General healthcare"},
  {id:39, name:"Techo Santepheap National Hospital",                         loc:"Sen Sok",          tel:"087781119",  type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:40, name:"Preah Kossamak Hospital (Psychiatry)",                       loc:"Tuol Kouk",        tel:"017 335 774",type:"Hospital", cat:"Healthcare Provider",        hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"Mental health consultation, counseling, therapy"},
  {id:41, name:"Mental health clinic (Dangkor)",                             loc:"Dangkor",          tel:"081856007",  type:"Hospital", cat:"Mental Health Clinic",       hours:"Mon-Fri 11:30AM-8PM, Sat-Sun 8:30AM-8:00PM",           target:"All ages",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:42, name:"Phnom Penh Meditation (សមាធិ)",                             loc:"Tuol Kouk",        tel:"012207104",  type:"Service",  cat:"Meditation",                 hours:"Mon-Sat 9:00AM-9:00PM",                                 target:"Adults",                         nssf:"No",  services:"Meditation for mental health, consultation"},
  {id:43, name:"Luang Mè Hospital",                                          loc:"Dangkor",          tel:"010 228 965",type:"Hospital", cat:"General",                    hours:"Mon-Sun 8:00AM-5:00PM",                                 target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:44, name:"National Institute of Public Health (NIPH)",                 loc:"Tuol Kouk",        tel:"011 919 147",type:"Hospital", cat:"General",                    hours:"Mon-Sun 7:30AM-12:00PM & 1:30-5:30PM",                  target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:45, name:"16 Ouksaphea Hospital",                                      loc:"Chbar Ampov",      tel:"012 875 787",type:"Hospital", cat:"General",                    hours:"Mon-Sun 7:00AM-5:00PM",                                 target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:46, name:"Phnom Penh Municipal Referral Hospital",                     loc:"7 Makara",         tel:"077 559 983",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:47, name:"Chaktomuk Referral Hospital",                                loc:"Russey Keo",       tel:"098 597 777",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:48, name:"Samdech Euv Samdech Mè Referral Hospital",                  loc:"Russey Keo",       tel:"012 864 684",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:49, name:"Sen Sok Cambodia-China Friendship Referral Hospital",        loc:"Russey Keo",       tel:"012 781 874",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:50, name:"Pochentong Referral Hospital",                               loc:"Por Senchey",      tel:"096 776 6883",type:"Hospital",cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:51, name:"Chbar Ampov Referral Hospital",                              loc:"Chbar Ampov",      tel:"077 524 256",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:52, name:"Prek Pnov Referral Hospital",                                loc:"Prek Pnov",        tel:"012 656 639",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:53, name:"Dangkor Referral Hospital",                                  loc:"Dangkor",          tel:"012 934 190",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:54, name:"Daun Penh Health Center",                                    loc:"Daun Penh",        tel:"012 844 777",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:55, name:"Toul Kork Health Center",                                    loc:"Tuol Kouk",        tel:"011 833 339",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:56, name:"Toul Svay Prey Health Center",                               loc:"Chamkar Mon",      tel:"011 219 922",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:57, name:"Phsar Daem Thkov Health Center",                             loc:"Chamkar Mon",      tel:"098 222 243",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:58, name:"Kaoh Dach Health Center",                                    loc:"Chroy Changvar",   tel:"012 771 994",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:59, name:"Kilometer No.9 Health Center",                               loc:"Russey Keo",       tel:"012 972 308",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:60, name:"Kilometer No.6 Health Center",                               loc:"Russey Keo",       tel:"012 553 494",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:61, name:"Chroy Changvar Health Center",                               loc:"Chroy Changvar",   tel:"077 637 616",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:62, name:"Krangtnong Health Center",                                   loc:"Sen Sok",          tel:"015 797 922",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:63, name:"Khmounh Health Center",                                      loc:"Sen Sok",          tel:"015 524 020",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:64, name:"Teuk Thla Health Center",                                    loc:"Sen Sok",          tel:"012 825 844",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:65, name:"Phnom Penh Thmey Health Center",                             loc:"Sen Sok",          tel:"012 306 449",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:66, name:"Anlongkgan Health Center",                                   loc:"Sen Sok",          tel:"017 866 002",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:67, name:"Kamboul Health Center",                                      loc:"Por Senchey",      tel:"012 281 914",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:68, name:"Spean Thmor Health Center",                                  loc:"Daun Penh",        tel:"081 438 181",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:69, name:"Boeng Thom Health Center",                                   loc:"Por Senchey",      tel:"017 583 598",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:70, name:"Sak Sampov Health Center (Daun Penh)",                       loc:"Daun Penh",        tel:"086 818 386",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:71, name:"Samaky Health Center",                                       loc:"Por Senchey",      tel:"011 214 297",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:72, name:"Snor Health Center",                                         loc:"Por Senchey",      tel:"015 897 670",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:73, name:"Samraongkrom Health Center",                                 loc:"Por Senchey",      tel:"093 749 477",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:74, name:"Ovlaok Health Center",                                       loc:"Por Senchey",      tel:"017 588 388",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:75, name:"Kbal Koah Health Center",                                    loc:"Chbar Ampov",      tel:"012 277 909",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:76, name:"Chak Angre Health Center",                                   loc:"Mean Chey",        tel:"092 923 766",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:77, name:"Chbor Ampoeu Health Center",                                 loc:"Chbar Ampov",      tel:"012 852 233",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:78, name:"Niroth Health Center",                                       loc:"Chbar Ampov",      tel:"012 211 651",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:79, name:"Sak Sampov Health Center (Dangkor)",                         loc:"Dangkor",          tel:"086 818 386",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:80, name:"Prey Sor Health Center",                                     loc:"Dangkor",          tel:"078 789 822",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:81, name:"Prey Veng Health Center",                                    loc:"Dangkor",          tel:"097 696 8990",type:"Hospital",cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:82, name:"Prek Kampues Health Center",                                 loc:"Dangkor",          tel:"089 770 778",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:83, name:"Porng Toeuk Health Center",                                  loc:"Dangkor",          tel:"096 773 2518",type:"Hospital",cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:84, name:"Pralaplang Health Center",                                   loc:"Dangkor",          tel:"096 624 0251",type:"Hospital",cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:85, name:"Choeung Ek Health Center",                                   loc:"Dangkor",          tel:"095 980 656",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:86, name:"Chamkar Doung Health Centre",                                loc:"Dangkor",          tel:"078 558 977",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:87, name:"Rolous Health Center",                                       loc:"Dangkor",          tel:"097 714 6846",type:"Hospital",cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:88, name:"Samrong Health Center",                                      loc:"Prek Pnov",        tel:"012 517 205",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:89, name:"Pormungkal Health Center",                                   loc:"Prek Pnov",        tel:"070 656 680",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:90, name:"Penseng Health Center",                                      loc:"Prek Pnov",        tel:"012 946 575",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:91, name:"Ponhea Pun Health Center",                                   loc:"Prek Pnov",        tel:"012 636 014",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:92, name:"Kork Roka Health Center",                                    loc:"Prek Pnov",        tel:"012 775 472",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:93, name:"Steung Meanchey Health Center",                              loc:"Mean Chey",        tel:"012 839 162",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:94, name:"Prek Eng Health Center",                                     loc:"Chbar Ampov",      tel:"017 942 643",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:95, name:"Prek Thmei Health Center",                                   loc:"Chbar Ampov",      tel:"012 202 270",type:"Hospital", cat:"General",                    hours:"Open 24/7",                                             target:"All ages",                       nssf:"Yes", services:"General healthcare"},
  {id:96, name:"Koeut Chhunly Clinic Hypnosis and Psychoanalysis",           loc:"Chamkar Mon",      tel:"011878258",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sun 6:30-7:30AM, 5-8PM",                            target:"All ages",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:97, name:"Hout Linna Mental and Brain Clinic",                         loc:"Daun Penh",        tel:"012653879",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"N/A",                                                   target:"All ages",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:98, name:"Dr. PAUV Bunthoeun, Psychiatrist",                           loc:"Tuol Kouk",        tel:"012851484",  type:"Clinic",   cat:"Mental Health Clinic",       hours:"Mon-Sun 6-7AM, 11:30AM-12:30PM, 5-8PM",                 target:"All ages",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:99, name:"Dr. Heng Sopheap Psychiatrist",                              loc:"Sen Sok",          tel:"061 545 565",type:"Clinic",   cat:"Mental Health Clinic",       hours:"N/A",                                                   target:"All ages",                       nssf:"No",  services:"Mental health consultation, counseling, therapy"},
  {id:100,name:"Visith Clinic",                                               loc:"Sen Sok",          tel:"092199030",  type:"Clinic",   cat:"General",                    hours:"Mon-Sun 7:00am-8:00pm",                                 target:"All ages",                       nssf:"No",  services:"General healthcare"},
];

/* ── i18n TRANSLATION STRINGS ───────────────────────────────────── */
const T = {
  eng: {
    brandName:'YOUR HOPE', brandTag:'Phnom Penh Mental Health',
    hEye:'Mental Health · Phnom Penh', hTitle:'Your mental health <em>matters.</em>',
    hSub:'Take a validated DASS-21 screening and discover trusted mental health services across Phnom Penh.',
    hStat1:'Services', hStat2:'Questions', hStat3:'Scales',
    hc1l:'Screening', hc1t:'DASS-21 Test', hc1d:'21 questions · ~5 min<br>Depression, Anxiety & Stress', hc1b:'Start assessment →',
    hc2l:'Directory', hc2t:'Find Services From Professionals', hc2d:'100 locations across all districts of Phnom Penh', hc2b:'Browse clinics →',
    hc3l:'AI Chat', hc3t:'AI Support', hc3d:'Ask questions, understand your results, find help', hc3b:'Chat now →',
    hc4l:'Export', hc4t:'Print Results', hc4d:"Save your DASS-21 PDF to share with your doctor", hc4b:'Export PDF →',
    hc5l:'Quotes', hc5t:'Daily Inspiration', hc5d:'Browse categorized quotes for hope, strength, and calm.', hc5b:'View quotes →',
    qEye:'Daily Inspiration', qTitle:'Motivational Quotes', qSub:'Browse encouraging quotes by category.',
    hDisc:'This app is for informational purposes only. The DASS-21 is a validated screening tool, not a clinical diagnosis. If you are in crisis, please contact a healthcare professional immediately.',
    tEye:'Mental Health Screening', tTitle:'DASS-21 Assessment', tSub:'21 items measuring Depression, Anxiety and Stress over the past week. Takes about 5 minutes.',
    tScaleTitle:'Rating scale',
    rl0:'Did not apply at all', rl1:'Some of the time', rl2:'A good part of time', rl3:'Most of the time',
    tStartBtn:'Begin assessment →', tPrivacy:'Your answers are private and never stored.',
    tNote:'All questions on this page must be answered before continuing.',
    rHeading:'Assessment Complete', rSubhead:'Scores × 2 per official DASS-21 scoring guidelines',
    rRetake:'Retake', rFind:'Find services →', rPdf:'Export PDF',
    rDisc:'Screening results are not a clinical diagnosis. Please consult a qualified mental health professional.',
    sEye:'Phnom Penh', sTitle:'Mental Health Services', sSub:'Filter and explore mental health services across Phnom Penh by type and location.',
    svList:'List', svMap:'Map',
    cEye:'Powered by Claude AI', cTitle:'AI Mental Health Support', cSub:'Ask anything about mental health, your DASS-21 results, or finding the right clinic.',
    cDisc:'AI responses are for general information only. Always consult a qualified professional.',
    navHome:'Home', navTest:'DASS-21', navServices:'Services', navQuotes:'Quotes', navChat:'AI Support',
    qEye:'Daily Inspiration', qTitle:'Words of Hope', qSub:'Take a moment to find your daily dose of motivation and encouragement',
    aiGreeting:"Hello! I'm here to support you. You can ask me about mental health, your DASS-21 results, or how to find the right clinic in Phnom Penh. What would you like to know?",
    chips:['What is DASS-21?','I feel anxious lately','How to find a clinic?','What do my scores mean?','I feel depressed','Stress management tips'],
    scales:{d:'Depression',a:'Anxiety',s:'Stress'},
    tagLabels:{d:'Depression',a:'Anxiety',s:'Stress'},
    lvLabels:{Normal:'Normal',Mild:'Mild',Moderate:'Moderate',Severe:'Severe','Extremely Severe':'Extremely Severe'},
    interpN:{cls:'good',icon:'💚',t:'Your scores are in the normal range',b:'Your responses suggest your depression, anxiety and stress levels are currently within a healthy range. Continue to monitor your wellbeing and seek support if things change.'},
    interpM:{cls:'mild',icon:'💛',t:'Mild to moderate levels detected',b:'Some scores are elevated. Consider speaking with a counsellor or therapist. Browse the Services tab to find mental health clinics near you in Phnom Penh.'},
    interpS:{cls:'bad',icon:'🔴',t:'We recommend speaking with a professional',b:'Your scores indicate elevated levels. Please reach out to a mental health clinic or hospital. Use the Services tab to find help near you in Phnom Penh.'},
    searchPH:'Search name or district…',
    websiteBtn:'Website', callBtn:'Call', mapBtn:'Map', noTel:'No phone',
    recTitle:'Recommended services for your result',
    recSevere:'Your result includes a severe or extremely severe level. Hospitals and psychiatric services are highlighted first.',
    // Auth translations
    authTitle:'Create Account', authSubtitle:'Welcome to YOUR HOPE', authLabelName:'Full Name',
    authLabelEmail:'Email', authLabelPassword:'Password', authLabelConfirm:'Confirm Password',
    signupBtn:'Sign Up', signinBtn:'Sign In', toggleLogin:'Sign In', toggleSignup:'Sign Up',
    alreadyAccount:'Already have an account?', noAccount:'Don\'t have an account?',
    authDisclaimer:'YOUR HOPE is for informational purposes only. Always seek professional help if needed.',
    logoutBtn:'Sign Out',
    // Auth prompt modal
    authPromptTitle:'Sign Up Required',
    authPromptTestMsg:'Please sign up to access the DASS-21 assessment and save your results.',
    authPromptServicesMsg:'Please sign up to browse mental health services and get personalized recommendations.',
    authPromptSignin:'Sign In',
    authPromptSignup:'Create Account',
    // Validation messages
    nameRequired:'Name is required', emailRequired:'Email is required', invalidEmail:'Invalid email format',
    passwordRequired:'Password is required', passwordMin:'Password must be at least 6 characters',
    passwordMismatch:'Passwords do not match', emailExists:'Email already registered',
    invalidEmailPassword:'Invalid email or password',
    recModerate:'Your result includes a moderate level. Mental health clinics and counseling services are highlighted first.',
    recNormal:'Your result is in the normal range. NGOs, wellness support, and optional counseling services are highlighted.',
    pmMeta:'DASS-21 Screening Results', pScore:'Score', pLevel:'Level', pDep:'Depression', pAnx:'Anxiety', pStr:'Stress',
  },
  kh: {
    brandName:'ក្តីសង្ឈឹមរបស់អ្នក', brandTag:'សុខភាពផ្លូវចិត្ត ភ្នំពេញ',
    hEye:'សុខភាពផ្លូវចិត្ត · ភ្នំពេញ', hTitle:'សុខភាពផ្លូវចិត្តរបស់អ្នក <em>សំខាន់ណាស់</em>',
    hSub:'ធ្វើការតេស្ត DASS-21 ដែលត្រូវបានផ្ទៀងផ្ទាត់ ហើយស្វែងរកសេវាកម្មសុខភាពផ្លូវចិត្ត។',
    hStat1:'សេវាកម្ម', hStat2:'សំណួរ', hStat3:'ស្កែល',
    hc1l:'ការស្ទង់មតិ', hc1t:'តេស្ត DASS-21', hc1d:'២១ សំណួរ · ~៥ នាទី<br>ធ្លាក់ទឹកចិត្ត ការថប់បារម្ភ ភាពតានតឹង', hc1b:'ចាប់ផ្តើម →',
    hc2l:'ប្រព័ន្ធ', hc2t:'ស្វែងរកសេវាកម្មពីអ្នកជំនាញ', hc2d:'១០០ កន្លែងទូទាំងភ្នំពេញ', hc2b:'រកមើលគ្លីនិក →',
    hc3l:'AI', hc3t:'ជំនួយ AI', hc3d:'សួរអំពីសុខភាពផ្លូវចិត្ត ហើយទទួលបានការគាំទ្រ', hc3b:'ជជែកឥឡូវ →',
    hc4l:'នាំចេញ', hc4t:'បោះពុម្ពលទ្ធផល', hc4d:'រក្សាទុក PDF ដើម្បីចែករំលែកជាមួយវេជ្ជបណ្ឌិត', hc4b:'នាំចេញ PDF →',
    hc5l:'ពាក្យសុបិន្ត', hc5t:'ការលើកទឹកចិត្តប្រចាំថ្ងៃ', hc5d:'ស្វែងរកសមេដ្ឋានតាមប្រភេទសម្រាប់សង្ឃឹម ភាពរឹងមាំ និងការស្ងប់ស្ងាត់។', hc5b:'មើលពាក្យ →',
    qEye:'ការលើកទឹកចិត្តប្រចាំថ្ងៃ', qTitle:'ពាក្យលើកទឹកចិត្ត', qSub:'ស្វែងរកពាក្យលើកទឹកចិត្តតាមប្រភេទ។',
    hDisc:'កម្មវិធីនេះសម្រាប់ជាព័ត៌មានប៉ុណ្ណោះ។ DASS-21 គឺជាឧបករណ៍ស្ទង់មតិ មិនមែនការធ្វើរោគវិនិច្ឆ័យ។',
    tEye:'ការស្ទង់មតិសុខភាពផ្លូវចិត្ត', tTitle:'ការវាយតម្លៃ DASS-21', tSub:'២១ ចំណុចដែលវាស់ស្ទង់ការធ្លាក់ទឹកចិត្ត ការថប់បារម្ភ និងភាពតានតឹង រយៈពេល ~៥ នាទី។',
    tScaleTitle:'ស្កែលវាយតម្លៃ',
    rl0:'មិនអនុវត្តទាល់តែសោះ', rl1:'ពេលខ្លះ', rl2:'ច្រើនដង', rl3:'ភាគច្រើន',
    tStartBtn:'ចាប់ផ្តើមការវាយតម្លៃ →', tPrivacy:'ចម្លើយមិនត្រូវបានរក្សាទុក ឬចែករំលែកទេ។',
    tNote:'សូមឆ្លើយសំណួរទាំងអស់នៅក្នុងទំព័រនេះ។',
    rHeading:'ការវាយតម្លៃបានបញ្ចប់', rSubhead:'ពិន្ទុគុណ ២ ដូចគោលការណ៍ DASS-21 ផ្លូវការ',
    rRetake:'ធ្វើម្ដងទៀត', rFind:'ស្វែងរកសេវាកម្ម →', rPdf:'នាំចេញ PDF',
    rDisc:'ការស្ទង់មតិនេះមិនមែនជាការធ្វើរោគវិនិច្ឆ័យ។ សូមពិគ្រោះជាមួយអ្នកជំនាញ។',
    sEye:'ភ្នំពេញ', sTitle:'សេវាកម្មសុខភាពផ្លូវចិត្ត', sSub:'ចម្រាញ់ និងស្វែងរកសេវាកម្មសុខភាពផ្លូវចិត្តនៅភ្នំពេញតាមប្រភេទ និងទីតាំង។',
    svList:'បញ្ជី', svMap:'ផែនទី',
    cEye:'ប្រើ Claude AI', cTitle:'ការគាំទ្រ AI', cSub:'សួរអំពីសុខភាពផ្លូវចិត្ត លទ្ធផល ឬការស្វែងរកគ្លីនិក។',
    cDisc:'ចម្លើយ AI សម្រាប់ព័ត៌មានទូទៅ។ ត្រូវតែពិគ្រោះជំនាញ។',
    navHome:'ផ្ទះ', navTest:'DASS-21', navServices:'សេវាកម្ម', navQuotes:'ដង្ហើម', navChat:'AI',
    qEye:'ការលើកទឹកចិត្តប្រចាំថ្ងៃ', qTitle:'ពាក្យនៃសង្ឈឹម', qSub:'ចំណាយពេលដើម្បីស្វាយមើលការលើកទឹកចិត្តប្រចាំថ្ងៃ',
    aiGreeting:'សួស្ដី! ខ្ញុំនៅទីនេះដើម្បីគាំទ្រអ្នក។ អ្នកអាចសួរខ្ញុំអំពីសុខភាពផ្លូវចិត្ត លទ្ធផល DASS-21 ឬរកគ្លីនិក។',
    chips:['DASS-21 ជាអ្វី?','ខ្ញុំមានការថប់បារម្ភ','រករកគ្លីនិក','ពន្យល់ពិន្ទុ','ខ្ញុំមានការសោកស្ដាយ','គន្លឹះការគ្រប់គ្រងភាពតានតឹង'],
    scales:{d:'ធ្លាក់ទឹកចិត្ត',a:'ការថប់បារម្ភ',s:'ភាពតានតឹង'},
    tagLabels:{d:'ធ្លាក់ទឹកចិត្ត',a:'ការថប់បារម្ភ',s:'ភាពតានតឹង'},
    lvLabels:{Normal:'ធម្មតា',Mild:'តិចតួច',Moderate:'មធ្យម',Severe:'ធ្ងន់','Extremely Severe':'ធ្ងន់ណាស់'},
    interpN:{cls:'good',icon:'💚',t:'ពិន្ទុរបស់អ្នកស្ថិតក្នុងជួរធម្មតា',b:'ការឆ្លើយតបរបស់អ្នកបង្ហាញថាកម្រិតធ្លាក់ទឹកចិត្ត ការថប់បារម្ភ និងភាពតានតឹងនៅក្នុងជួរសុខភាពល្អ។'},
    interpM:{cls:'mild',icon:'💛',t:'រកឃើញកម្រិតតិចតួចទៅមធ្យម',b:'ពិន្ទុខ្លះរបស់អ្នកខ្ពស់ជាងប្រក្រតី។ សូមពិចារណាពិភាក្សាជាមួយអ្នកប្រឹក្សា ឬអ្នកព្យាបាល។'},
    interpS:{cls:'bad',icon:'🔴',t:'យើងណែនាំឱ្យពិភាក្សាជាមួយអ្នកជំនាញ',b:'ពិន្ទុរបស់អ្នកបង្ហាញកម្រិតខ្ពស់។ សូមទំនាក់ទំនងគ្លីនិក ឬមន្ទីរពេទ្យ។'},
    searchPH:'ស្វែងរកតាមឈ្មោះ ឬស្រុក…',
    websiteBtn:'គេហទំព័រ', callBtn:'ទូរស័ព្ទ', mapBtn:'ផែនទី', noTel:'គ្មានលេខ',
    recTitle:'សេវាកម្មដែលបានណែនាំសម្រាប់លទ្ធផលរបស់អ្នក',
    recSevere:'លទ្ធផលរបស់អ្នកមានកម្រិតធ្ងន់ ឬធ្ងន់ណាស់។ មន្ទីរពេទ្យ និងសេវាវិកលចរិតត្រូវបានបង្ហាញមុន។',
    recModerate:'លទ្ធផលរបស់អ្នកមានកម្រិតមធ្យម។ គ្លីនិកសុខភាពផ្លូវចិត្ត និងសេវាប្រឹក្សាត្រូវបានបង្ហាញមុន។',
    recNormal:'លទ្ធផលរបស់អ្នកស្ថិតក្នុងជួរធម្មតា។ NGO សេវាសុខុមាលភាព និងការប្រឹក្សាជាជម្រើសត្រូវបានណែនាំ។',
    pmMeta:'លទ្ធផល DASS-21', pScore:'ពិន្ទុ', pLevel:'កម្រិត', pDep:'ធ្លាក់ទឹកចិត្ត', pAnx:'ការថប់បារម្ភ', pStr:'ភាពតានតឹង',
    // Auth translations
    authTitle:'បង្កើតគណនី', authSubtitle:'សូមស្វាគមន៍មក', authLabelName:'ឈ្មោះពេញលេញ',
    authLabelEmail:'អ៊ីមែល', authLabelPassword:'ពាក្យសម្ងាត់', authLabelConfirm:'បញ្ជាក់ពាក្យសម្ងាត់',
    signupBtn:'ចុះឈ្មោះ', signinBtn:'ចូលក្នុង', toggleLogin:'ចូលក្នុង', toggleSignup:'ចុះឈ្មោះ',
    // Auth prompt modal
    authPromptTitle:'តម្រូវឱ្យចុះឈ្មោះ',
    authPromptTestMsg:'សូមចុះឈ្មោះ ដើម្បីចូលប្រើការវាយតម្លៃ DASS-21 និងរក្សាទុកលទ្ធផលរបស់អ្នក។',
    authPromptServicesMsg:'សូមចុះឈ្មោះ ដើម្បីរកមើល សេវាកម្មសុខភាពផ្លូវចិត្ត និងទទួលបានការណែនាំផ្ទាល់ខ្លួន។',
    authPromptSignin:'ចូល',
    authPromptSignup:'បង្កើតគណនី',
    alreadyAccount:'មានគណនីរួចហើយ?', noAccount:'គ្មានគណនីឬ?', logoutBtn:'ចាកចេញ',
    nameRequired:'ត្រូវការឈ្មោះ', emailRequired:'ត្រូវការអ៊ីមែល', invalidEmail:'អ៊ីមែលមិនត្រឹមត្រូវ',
    passwordRequired:'ត្រូវការពាក្យសម្ងាត់', passwordMin:'ពាក្យសម្ងាត់ត្រូវមាន ៦ ឬច្រើន',
    passwordMismatch:'ពាក្យសម្ងាត់មិនដូច', emailExists:'អ៊ីមែលបានចុះឈ្មោះ',
    invalidEmailPassword:'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
  }
};
