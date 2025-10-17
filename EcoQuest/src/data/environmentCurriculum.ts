export interface QuizQuestion {
  id: string;
  type: "mcq" | "true_false" | "match" | "fill_blank";
  question: string;
  options?: string[];
  answer: string | number | boolean;
  hint?: string;
  explanation?: string;
}

export interface OutdoorTask {
  title: string;
  description: string;
  verification_type: "photo" | "teacher" | "parent" | "description";
  points: number;
}

export interface Game {
  title: string;
  description: string;
  type: "sorting" | "catch" | "simulation" | "puzzle" | "choice";
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  points: number;
  instructions: string;
}

export interface EnvironmentChapter {
  class: number;
  chapter_number: number;
  title: string;
  lesson: string;
  quiz: QuizQuestion[];
  game: Game;
  outdoor_task: OutdoorTask;
  eco_points_config: {
    quiz_correct: number;
    quiz_incorrect: number;
    quiz_completion_bonus: number;
    game_win: number;
    task_verified: number;
  };
}

export const environmentCurriculum: EnvironmentChapter[] = [
  // Class 1
  {
    class: 1,
    chapter_number: 1,
    title: "Clean and Dirty Places",
    lesson:
      "Our Earth is like our home. If we throw garbage on the road, it becomes dirty and smelly. Clean places keep us healthy and happy. We should always use dustbins, wash our hands, and keep our school, park, and home clean.",
    quiz: [
      {
        id: "c1_ch1_q1",
        type: "mcq",
        question: "Where should we throw waste?",
        options: ["Road", "Dustbin", "River", "Garden"],
        answer: 1,
        hint: "Think about where garbage belongs!",
        explanation:
          "Dustbin is the correct place for waste to keep our environment clean.",
      },
      {
        id: "c1_ch1_q2",
        type: "true_false",
        question: "Flies like to sit on garbage.",
        answer: true,
        explanation:
          "Yes, flies are attracted to garbage which is why we need to keep things clean.",
      },
      {
        id: "c1_ch1_q3",
        type: "match",
        question:
          "Match the following: Soap → Clean hands, Dustbin → Garbage, Mop → Clean floor",
        answer: "correct",
        explanation: "Each item has its proper use for cleaning.",
      },
      {
        id: "c1_ch1_q4",
        type: "mcq",
        question: "Which makes a place dirty?",
        options: [
          "Sweeping",
          "Throwing banana peel on road",
          "Planting flowers",
          "Washing clothes",
        ],
        answer: 1,
        explanation:
          "Throwing waste on roads makes places dirty and unhealthy.",
      },
      {
        id: "c1_ch1_q5",
        type: "fill_blank",
        question: "We must always use a ____ to throw waste.",
        answer: "dustbin",
        hint: "Where does garbage belong?",
        explanation: "Dustbin is the proper place for all waste.",
      },
    ],
    game: {
      title: "Garbage Sorting Champion",
      description:
        "Drag and drop different types of garbage into the correct bins",
      type: "sorting",
      difficulty: "easy",
      duration: "5 min",
      points: 20,
      instructions:
        "Help keep the environment clean by putting each piece of trash in the right bin!",
    },
    outdoor_task: {
      title: "Home Cleanup Hero",
      description:
        "Find 3 things at home or school you can put in the dustbin today.",
      verification_type: "photo",
      points: 30,
    },
    eco_points_config: {
      quiz_correct: 5,
      quiz_incorrect: 0,
      quiz_completion_bonus: 25,
      game_win: 20,
      task_verified: 30,
    },
  },
  {
    class: 1,
    chapter_number: 2,
    title: "Water is Life",
    lesson:
      "All living things need water. Without water, plants, animals, and people cannot live. We must not waste water by keeping taps open. Save water for the future.",
    quiz: [
      {
        id: "c1_ch2_q1",
        type: "mcq",
        question: "Which of these wastes water?",
        options: [
          "Turning off tap while brushing",
          "Collecting rainwater",
          "Leaving tap open",
          "Watering plants in morning",
        ],
        answer: 2,
        hint: "Think about what saves vs wastes water.",
        explanation: "Leaving taps open wastes precious water.",
      },
      {
        id: "c1_ch2_q2",
        type: "true_false",
        question: "Plants need water to grow.",
        answer: true,
        explanation:
          "All living things, including plants, need water to survive and grow.",
      },
      {
        id: "c1_ch2_q3",
        type: "match",
        question:
          "Match the following: Fish → Pond, Camel → Desert, Frog → River",
        answer: "correct",
        explanation: "Different animals live in different water environments.",
      },
      {
        id: "c1_ch2_q4",
        type: "mcq",
        question: "Which is safe to drink?",
        options: [
          "Rainwater in bottle",
          "Tap water with filter",
          "River water directly",
          "Dirty puddle",
        ],
        answer: 1,
        explanation: "Filtered tap water is clean and safe to drink.",
      },
      {
        id: "c1_ch2_q5",
        type: "fill_blank",
        question: "We should always ____ taps after use.",
        answer: "close",
        hint: "What do we do to save water?",
        explanation: "Closing taps prevents water wastage.",
      },
    ],
    game: {
      title: "Water Drop Catcher",
      description: "Catch clean raindrops while avoiding dirty water drops",
      type: "catch",
      difficulty: "easy",
      duration: "8 min",
      points: 25,
      instructions:
        "Move left and right to catch the clean blue raindrops and avoid the brown dirty drops!",
    },
    outdoor_task: {
      title: "Water Conservation Champion",
      description: "Water a plant and close the tap properly after use.",
      verification_type: "photo",
      points: 25,
    },
    eco_points_config: {
      quiz_correct: 5,
      quiz_incorrect: 0,
      quiz_completion_bonus: 25,
      game_win: 25,
      task_verified: 25,
    },
  },

  // Class 2
  {
    class: 2,
    chapter_number: 1,
    title: "Our Animal Friends",
    lesson:
      "Animals are part of our environment. Some live with us as pets, some in the wild. They need food, water, and shelter. We should not hurt them.",
    quiz: [
      {
        id: "c2_ch1_q1",
        type: "mcq",
        question: "What do birds need to live?",
        options: ["Nest", "Car", "Shoes", "Chair"],
        answer: 0,
        explanation: "Birds need nests for shelter and safety.",
      },
      {
        id: "c2_ch1_q2",
        type: "true_false",
        question: "Dogs and cats can be pets.",
        answer: true,
        explanation:
          "Dogs and cats are common domestic animals that make great pets.",
      },
      {
        id: "c2_ch1_q3",
        type: "match",
        question: "Match the following: Cow → Grass, Cat → Milk, Lion → Meat",
        answer: "correct",
        explanation: "Different animals eat different types of food.",
      },
      {
        id: "c2_ch1_q4",
        type: "fill_blank",
        question: "We must always give animals clean ____.",
        answer: "water",
        hint: "What do all living things need to drink?",
        explanation: "Clean water is essential for all animals' health.",
      },
      {
        id: "c2_ch1_q5",
        type: "mcq",
        question: "Which is a wild animal?",
        options: ["Lion", "Cat", "Dog", "Goat"],
        answer: 0,
        explanation: "Lions live in the wild and are not pets.",
      },
    ],
    game: {
      title: "Animal Feeding Fun",
      description: "Feed the correct food to each animal",
      type: "sorting",
      difficulty: "easy",
      duration: "10 min",
      points: 30,
      instructions:
        "Drag the right food to each animal - grass for cows, fish for cats, and meat for lions!",
    },
    outdoor_task: {
      title: "Animal Care Helper",
      description: "Keep a bowl of water for birds in your balcony/terrace.",
      verification_type: "photo",
      points: 35,
    },
    eco_points_config: {
      quiz_correct: 6,
      quiz_incorrect: 0,
      quiz_completion_bonus: 30,
      game_win: 30,
      task_verified: 35,
    },
  },
  {
    class: 2,
    chapter_number: 2,
    title: "Save Trees",
    lesson:
      "Trees give us oxygen, shade, fruits, and wood. Cutting too many trees makes Earth hot and dirty. Planting trees helps us breathe clean air.",
    quiz: [
      {
        id: "c2_ch2_q1",
        type: "mcq",
        question: "What do trees give us to breathe?",
        options: ["Smoke", "Oxygen", "Carbon dioxide", "Plastic"],
        answer: 1,
        explanation: "Trees produce oxygen which we need to breathe.",
      },
      {
        id: "c2_ch2_q2",
        type: "true_false",
        question: "Cutting trees keeps Earth cool.",
        answer: false,
        explanation: "Cutting trees makes Earth hotter, not cooler.",
      },
      {
        id: "c2_ch2_q3",
        type: "match",
        question:
          "Match the following: Mango → Fruit, Neem → Medicine, Banyan → Shade",
        answer: "correct",
        explanation: "Different trees provide different benefits to us.",
      },
      {
        id: "c2_ch2_q4",
        type: "mcq",
        question: "Which is a use of trees?",
        options: ["Plastic", "Wood", "Glass", "Metal"],
        answer: 1,
        explanation: "Wood comes from trees and has many uses.",
      },
      {
        id: "c2_ch2_q5",
        type: "fill_blank",
        question: "Trees make the air ____.",
        answer: "fresh",
        hint: "How do trees help our breathing?",
        explanation: "Trees clean the air and make it fresh for us to breathe.",
      },
    ],
    game: {
      title: "Tree Planting Simulator",
      description: "Plant digital saplings and watch them grow",
      type: "simulation",
      difficulty: "easy",
      duration: "12 min",
      points: 35,
      instructions:
        "Plant seeds, water them, and give them sunlight to grow into beautiful trees!",
    },
    outdoor_task: {
      title: "Future Forest Creator",
      description: "Plant a sapling near home or school.",
      verification_type: "photo",
      points: 50,
    },
    eco_points_config: {
      quiz_correct: 6,
      quiz_incorrect: 0,
      quiz_completion_bonus: 30,
      game_win: 35,
      task_verified: 50,
    },
  },

  // Class 3
  {
    class: 3,
    chapter_number: 1,
    title: "Reduce, Reuse, Recycle",
    lesson:
      "We can reduce waste by using less plastic, reuse bottles and bags, and recycle paper and cans. This keeps our environment clean.",
    quiz: [
      {
        id: "c3_ch1_q1",
        type: "mcq",
        question: "Which is reducing waste?",
        options: [
          "Buying many bottles",
          "Carrying your own bottle",
          "Throwing food",
          "Using disposable plates",
        ],
        answer: 1,
        explanation:
          "Carrying your own bottle reduces the need for disposable bottles.",
      },
      {
        id: "c3_ch1_q2",
        type: "true_false",
        question: "We should burn garbage.",
        answer: false,
        explanation:
          "Burning garbage creates pollution and is harmful to the environment.",
      },
      {
        id: "c3_ch1_q3",
        type: "match",
        question:
          "Match the following: Old newspaper → New paper, Plastic bottles → New plastic, Kitchen waste → Compost",
        answer: "correct",
        explanation:
          "Different materials can be recycled or composted appropriately.",
      },
      {
        id: "c3_ch1_q4",
        type: "fill_blank",
        question: "We should carry a ____ bag instead of plastic.",
        answer: "cloth",
        hint: "What reusable material is better than plastic?",
        explanation:
          "Cloth bags are reusable and better for the environment than plastic bags.",
      },
      {
        id: "c3_ch1_q5",
        type: "mcq",
        question: "Which can be recycled?",
        options: ["Banana peel", "Paper", "Sand", "Stone"],
        answer: 1,
        explanation: "Paper can be recycled to make new paper products.",
      },
    ],
    game: {
      title: "Recycling Sorting Game",
      description: "Sort waste items into the correct recycling categories",
      type: "sorting",
      difficulty: "easy",
      duration: "8 min",
      points: 25,
      instructions:
        "Drag items into the right bins: recyclable, compostable, or non-recyclable!",
    },
    outdoor_task: {
      title: "Recycling Champion",
      description: "Collect old newspapers and give them for recycling.",
      verification_type: "photo",
      points: 30,
    },
    eco_points_config: {
      quiz_correct: 7,
      quiz_incorrect: 0,
      quiz_completion_bonus: 30,
      game_win: 25,
      task_verified: 30,
    },
  },
  {
    class: 3,
    chapter_number: 2,
    title: "Energy at Home",
    lesson:
      "Electricity is precious. Switching off lights and fans when not in use saves energy. Energy saving reduces pollution.",
    quiz: [
      {
        id: "c3_ch2_q1",
        type: "mcq",
        question: "Which saves electricity?",
        options: [
          "Leaving TV on all night",
          "Switching off fan when leaving",
          "Using more bulbs",
          "Keeping fridge open",
        ],
        answer: 1,
        explanation:
          "Switching off appliances when not in use saves electricity.",
      },
      {
        id: "c3_ch2_q2",
        type: "true_false",
        question: "Saving energy reduces pollution.",
        answer: true,
        explanation:
          "When we use less electricity, power plants produce less pollution.",
      },
      {
        id: "c3_ch2_q3",
        type: "match",
        question:
          "Match the following: Fan → Electricity, Lamp → Bulb, Solar panel → Sun",
        answer: "correct",
        explanation:
          "Each item is correctly matched with its power source or component.",
      },
      {
        id: "c3_ch2_q4",
        type: "fill_blank",
        question: "We must switch ____ lights before leaving.",
        answer: "off",
        hint: "What should we do to save electricity?",
        explanation: "Switching off lights when leaving saves energy.",
      },
      {
        id: "c3_ch2_q5",
        type: "mcq",
        question: "Which uses less electricity?",
        options: ["LED bulb", "Tube light", "Old lamp", "Candle"],
        answer: 0,
        explanation:
          "LED bulbs are very energy-efficient and use less electricity.",
      },
    ],
    game: {
      title: "Energy Saver Game",
      description: "Switch off lights in rooms to save power",
      type: "choice",
      difficulty: "easy",
      duration: "6 min",
      points: 20,
      instructions:
        "Go through the house and turn off all unnecessary lights and appliances!",
    },
    outdoor_task: {
      title: "Energy Conservation Hero",
      description: "Switch off unnecessary lights before leaving your house.",
      verification_type: "parent",
      points: 25,
    },
    eco_points_config: {
      quiz_correct: 7,
      quiz_incorrect: 0,
      quiz_completion_bonus: 30,
      game_win: 20,
      task_verified: 25,
    },
  },

  // Class 4
  {
    class: 4,
    chapter_number: 1,
    title: "Air Around Us",
    lesson:
      "Air is everywhere. We need clean air to breathe. Smoke from factories, vehicles, and burning waste makes the air dirty. Dirty air causes cough, asthma, and other diseases. Trees and plants clean the air.",
    quiz: [
      {
        id: "c4_ch1_q1",
        type: "mcq",
        question: "What makes air dirty?",
        options: ["Trees", "Smoke", "Rain", "Wind"],
        answer: 1,
        explanation: "Smoke from factories and vehicles pollutes the air.",
      },
      {
        id: "c4_ch1_q2",
        type: "true_false",
        question: "Trees help keep air clean.",
        answer: true,
        explanation:
          "Trees absorb carbon dioxide and release oxygen, cleaning the air.",
      },
      {
        id: "c4_ch1_q3",
        type: "match",
        question:
          "Match the following: Factory → Smoke, Trees → Oxygen, Vehicles → Pollution",
        answer: "correct",
        explanation: "Each source produces what is listed.",
      },
      {
        id: "c4_ch1_q4",
        type: "mcq",
        question: "Which disease can dirty air cause?",
        options: ["Cold", "Asthma", "Fever", "Fracture"],
        answer: 1,
        explanation: "Polluted air can trigger asthma and breathing problems.",
      },
      {
        id: "c4_ch1_q5",
        type: "fill_blank",
        question: "Plants give us ____ to breathe.",
        answer: "oxygen",
        hint: "What gas do we need to breathe?",
        explanation: "Plants produce oxygen which we need for breathing.",
      },
    ],
    game: {
      title: "Catch Fresh Air",
      description: "Remove smoke clouds from the sky to clean the air",
      type: "catch",
      difficulty: "medium",
      duration: "10 min",
      points: 30,
      instructions:
        "Click on smoke clouds to remove them and plant trees to create fresh air!",
    },
    outdoor_task: {
      title: "Fresh Air Explorer",
      description: "Stand near a tree and take 5 deep breaths of fresh air.",
      verification_type: "photo",
      points: 25,
    },
    eco_points_config: {
      quiz_correct: 8,
      quiz_incorrect: 0,
      quiz_completion_bonus: 35,
      game_win: 30,
      task_verified: 25,
    },
  },
  {
    class: 4,
    chapter_number: 2,
    title: "Sources of Water",
    lesson:
      "We get water from rivers, lakes, wells, and rain. These are natural sources. Humans use taps and pumps to bring water to homes. Keeping rivers and lakes clean is important.",
    quiz: [
      {
        id: "c4_ch2_q1",
        type: "mcq",
        question: "Which is a natural source of water?",
        options: ["Tap", "River", "Bottle", "Pipe"],
        answer: 1,
        explanation: "Rivers are natural water sources created by nature.",
      },
      {
        id: "c4_ch2_q2",
        type: "true_false",
        question: "Rain is a natural source of water.",
        answer: true,
        explanation: "Rain is water that falls naturally from clouds.",
      },
      {
        id: "c4_ch2_q3",
        type: "match",
        question:
          "Match the following: River → Fresh water, Sea → Salt water, Well → Groundwater",
        answer: "correct",
        explanation:
          "Different water sources contain different types of water.",
      },
      {
        id: "c4_ch2_q4",
        type: "mcq",
        question: "Which source is salty?",
        options: ["River", "Sea", "Lake", "Pond"],
        answer: 1,
        explanation:
          "Sea water contains salt and is not suitable for drinking.",
      },
      {
        id: "c4_ch2_q5",
        type: "fill_blank",
        question: "Water from ____ is safe only after cleaning.",
        answer: "river",
        hint: "Which natural source needs treatment?",
        explanation:
          "River water needs to be cleaned before drinking to remove impurities.",
      },
    ],
    game: {
      title: "Water Cycle Puzzle",
      description: "Build the water cycle by arranging the steps correctly",
      type: "puzzle",
      difficulty: "medium",
      duration: "12 min",
      points: 35,
      instructions:
        "Drag the water cycle stages to show how water moves from earth to sky and back!",
    },
    outdoor_task: {
      title: "Water Source Observer",
      description:
        "Visit a nearby pond or river and observe if it's clean or dirty.",
      verification_type: "photo",
      points: 30,
    },
    eco_points_config: {
      quiz_correct: 8,
      quiz_incorrect: 0,
      quiz_completion_bonus: 35,
      game_win: 35,
      task_verified: 30,
    },
  },

  // Class 5
  {
    class: 5,
    chapter_number: 1,
    title: "Water Cycle Adventure",
    lesson:
      "Water moves in a cycle: Evaporation (water becomes vapor), Condensation (clouds form), Precipitation (rain falls). This repeats again and again, giving us fresh water.",
    quiz: [
      {
        id: "c5_ch1_q1",
        type: "mcq",
        question: "In which step do clouds form?",
        options: ["Evaporation", "Condensation", "Precipitation", "Freezing"],
        answer: 1,
        explanation: "Condensation is when water vapor cools and forms clouds.",
      },
      {
        id: "c5_ch1_q2",
        type: "true_false",
        question: "Rain is part of the water cycle.",
        answer: true,
        explanation:
          "Rain is precipitation, which is a key part of the water cycle.",
      },
      {
        id: "c5_ch1_q3",
        type: "match",
        question:
          "Match the following: Evaporation → Vapor, Condensation → Clouds, Precipitation → Rain",
        answer: "correct",
        explanation: "Each step of the water cycle produces what is listed.",
      },
      {
        id: "c5_ch1_q4",
        type: "mcq",
        question: "Which heats water for evaporation?",
        options: ["Moon", "Sun", "Trees", "Wind"],
        answer: 1,
        explanation:
          "The sun provides heat energy that causes water to evaporate.",
      },
      {
        id: "c5_ch1_q5",
        type: "fill_blank",
        question: "The water cycle is a ____ process.",
        answer: "continuous",
        hint: "Does the water cycle ever stop?",
        explanation:
          "The water cycle continues endlessly, providing fresh water.",
      },
    ],
    game: {
      title: "Interactive Water Cycle Animation",
      description: "Control the water cycle by managing sun, clouds, and rain",
      type: "simulation",
      difficulty: "medium",
      duration: "15 min",
      points: 40,
      instructions:
        "Use the sun to evaporate water, form clouds, and create rain to complete the cycle!",
    },
    outdoor_task: {
      title: "Cloud Observer",
      description: "Observe clouds in the sky and draw them in your notebook.",
      verification_type: "photo",
      points: 30,
    },
    eco_points_config: {
      quiz_correct: 9,
      quiz_incorrect: 0,
      quiz_completion_bonus: 40,
      game_win: 40,
      task_verified: 30,
    },
  },
  {
    class: 5,
    chapter_number: 2,
    title: "Our Forests, Our Friends",
    lesson:
      "Forests are home to animals, birds, and plants. They give us wood, medicine, fruits, and oxygen. Cutting forests is dangerous because it destroys homes of animals and increases pollution.",
    quiz: [
      {
        id: "c5_ch2_q1",
        type: "mcq",
        question: "Forests are home to:",
        options: ["Cars", "Machines", "Animals", "Buildings"],
        answer: 2,
        explanation:
          "Forests provide shelter and food for many animals and birds.",
      },
      {
        id: "c5_ch2_q2",
        type: "true_false",
        question: "Forests make the Earth cooler.",
        answer: true,
        explanation:
          "Forests absorb heat and provide shade, helping to cool the Earth.",
      },
      {
        id: "c5_ch2_q3",
        type: "match",
        question:
          "Match the following: Tiger → Forest, Monkey → Trees, Snake → Grass",
        answer: "correct",
        explanation:
          "Different animals live in different parts of forest ecosystems.",
      },
      {
        id: "c5_ch2_q4",
        type: "mcq",
        question: "Which is NOT a forest product?",
        options: ["Fruits", "Medicine", "Plastic", "Wood"],
        answer: 2,
        explanation: "Plastic is artificial and not a natural forest product.",
      },
      {
        id: "c5_ch2_q5",
        type: "fill_blank",
        question: "Forests give us fresh ____.",
        answer: "air",
        hint: "What do trees produce that we breathe?",
        explanation:
          "Trees in forests produce oxygen and clean the air we breathe.",
      },
    ],
    game: {
      title: "Save the Forest",
      description: "Protect trees by avoiding loggers and planting new ones",
      type: "choice",
      difficulty: "medium",
      duration: "12 min",
      points: 35,
      instructions:
        "Make choices to protect the forest - plant trees and stop deforestation!",
    },
    outdoor_task: {
      title: "Leaf Collector",
      description: "Collect fallen leaves and make a leaf collage.",
      verification_type: "photo",
      points: 35,
    },
    eco_points_config: {
      quiz_correct: 9,
      quiz_incorrect: 0,
      quiz_completion_bonus: 40,
      game_win: 35,
      task_verified: 35,
    },
  },

  // Class 6
  {
    class: 6,
    chapter_number: 1,
    title: "Soil and Farming",
    lesson:
      "Soil is made from rocks and organic matter. It grows crops and supports life. Using chemicals spoils soil fertility. Organic manure keeps soil healthy.",
    quiz: [
      {
        id: "c6_ch1_q1",
        type: "mcq",
        question: "Soil is made from:",
        options: ["Plastic", "Rocks and organic matter", "Iron", "Gas"],
        answer: 1,
        explanation:
          "Soil forms from weathered rocks mixed with decomposed organic matter.",
      },
      {
        id: "c6_ch1_q2",
        type: "true_false",
        question: "Fertile soil is important for farming.",
        answer: true,
        explanation:
          "Fertile soil contains nutrients that plants need to grow well.",
      },
      {
        id: "c6_ch1_q3",
        type: "match",
        question:
          "Match the following: Black soil → Cotton, Alluvial soil → Wheat, Red soil → Groundnut",
        answer: "correct",
        explanation: "Different soil types are suitable for different crops.",
      },
      {
        id: "c6_ch1_q4",
        type: "mcq",
        question: "Which spoils soil?",
        options: ["Compost", "Chemicals", "Manure", "Rain"],
        answer: 1,
        explanation:
          "Chemical fertilizers and pesticides can damage soil health over time.",
      },
      {
        id: "c6_ch1_q5",
        type: "fill_blank",
        question: "Farmers use ____ to grow crops.",
        answer: "soil",
        hint: "What do plants grow in?",
        explanation: "Soil provides nutrients and support for crop growth.",
      },
      {
        id: "c6_ch1_q6",
        type: "mcq",
        question: "Soil erosion is caused by:",
        options: ["Trees", "Heavy rain", "Compost", "Rocks"],
        answer: 1,
        explanation: "Heavy rain can wash away topsoil, causing erosion.",
      },
      {
        id: "c6_ch1_q7",
        type: "mcq",
        question: "Which of these protects soil?",
        options: [
          "Deforestation",
          "Planting trees",
          "Overgrazing",
          "Chemicals",
        ],
        answer: 1,
        explanation: "Tree roots hold soil together and prevent erosion.",
      },
      {
        id: "c6_ch1_q8",
        type: "true_false",
        question: "Soil is renewable quickly.",
        answer: false,
        explanation: "Soil takes hundreds of years to form naturally.",
      },
      {
        id: "c6_ch1_q9",
        type: "mcq",
        question: "Which layer of soil grows plants?",
        options: ["Topsoil", "Subsoil", "Bedrock", "Core"],
        answer: 0,
        explanation: "Topsoil is rich in nutrients and best for plant growth.",
      },
      {
        id: "c6_ch1_q10",
        type: "fill_blank",
        question: "____ helps soil stay fertile.",
        answer: "organic manure",
        hint: "What natural fertilizer keeps soil healthy?",
        explanation: "Organic manure adds nutrients without harmful chemicals.",
      },
    ],
    game: {
      title: "Crop Growing Simulator",
      description: "Grow crops using proper soil, water, and organic manure",
      type: "simulation",
      difficulty: "medium",
      duration: "18 min",
      points: 45,
      instructions:
        "Choose the right soil type, add organic fertilizer, and water your crops to make them grow!",
    },
    outdoor_task: {
      title: "Soil Explorer",
      description:
        "Take a handful of soil and observe stones, roots, and sand in it.",
      verification_type: "photo",
      points: 35,
    },
    eco_points_config: {
      quiz_correct: 10,
      quiz_incorrect: 0,
      quiz_completion_bonus: 45,
      game_win: 45,
      task_verified: 35,
    },
  },
  {
    class: 6,
    chapter_number: 2,
    title: "Renewable Energy",
    lesson:
      "Renewable energy comes from the sun, wind, and water. These sources never run out. Fossil fuels like coal and oil pollute and are limited.",
    quiz: [
      {
        id: "c6_ch2_q1",
        type: "mcq",
        question: "Which is renewable energy?",
        options: ["Coal", "Oil", "Sun", "Diesel"],
        answer: 2,
        explanation:
          "Solar energy from the sun is renewable and never runs out.",
      },
      {
        id: "c6_ch2_q2",
        type: "mcq",
        question: "Which is NOT renewable?",
        options: ["Wind", "Water", "Coal", "Sunlight"],
        answer: 2,
        explanation:
          "Coal is a fossil fuel that takes millions of years to form.",
      },
      {
        id: "c6_ch2_q3",
        type: "fill_blank",
        question: "Solar panels use ____ light.",
        answer: "sun",
        hint: "What celestial body provides solar energy?",
        explanation: "Solar panels convert sunlight into electricity.",
      },
      {
        id: "c6_ch2_q4",
        type: "true_false",
        question: "Windmills can produce electricity.",
        answer: true,
        explanation:
          "Wind turbines convert wind energy into electrical energy.",
      },
      {
        id: "c6_ch2_q5",
        type: "match",
        question:
          "Match the following: Sun → Solar, Wind → Windmill, Water → Hydropower",
        answer: "correct",
        explanation: "Each renewable source has its corresponding technology.",
      },
      {
        id: "c6_ch2_q6",
        type: "mcq",
        question: "Which gas reduces when using renewable energy?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
        answer: 1,
        explanation:
          "Renewable energy reduces CO2 emissions compared to fossil fuels.",
      },
      {
        id: "c6_ch2_q7",
        type: "mcq",
        question: "Which device stores solar energy?",
        options: ["Battery", "Stove", "Candle", "Book"],
        answer: 0,
        explanation:
          "Batteries store electrical energy from solar panels for later use.",
      },
      {
        id: "c6_ch2_q8",
        type: "true_false",
        question: "Renewable energy will run out soon.",
        answer: false,
        explanation:
          "Renewable energy sources like sun and wind are practically unlimited.",
      },
      {
        id: "c6_ch2_q9",
        type: "mcq",
        question: "Which renewable energy is common in villages?",
        options: ["Biomass", "Nuclear", "Diesel", "Gas"],
        answer: 0,
        explanation:
          "Biomass from crop waste and wood is commonly used in rural areas.",
      },
      {
        id: "c6_ch2_q10",
        type: "fill_blank",
        question: "Using ____ energy helps fight climate change.",
        answer: "renewable",
        hint: "What type of clean energy reduces pollution?",
        explanation:
          "Renewable energy produces little to no greenhouse gas emissions.",
      },
    ],
    game: {
      title: "Build a Mini Solar Panel",
      description: "Design and build renewable energy systems for a village",
      type: "simulation",
      difficulty: "medium",
      duration: "20 min",
      points: 50,
      instructions:
        "Choose solar panels, wind turbines, or hydropower to provide clean energy!",
    },
    outdoor_task: {
      title: "Renewable Energy Scout",
      description:
        "Notice solar panels or windmills in your area and note them down.",
      verification_type: "photo",
      points: 40,
    },
    eco_points_config: {
      quiz_correct: 10,
      quiz_incorrect: 0,
      quiz_completion_bonus: 45,
      game_win: 50,
      task_verified: 40,
    },
  },

  // Class 7
  {
    class: 7,
    chapter_number: 1,
    title: "Human Impact on Environment",
    lesson:
      "Human actions like cutting trees, using plastic, and running factories increase pollution. Cars produce smoke, which adds harmful gases. If we don't change our habits, Earth will become unhealthy.",
    quiz: [
      {
        id: "c7_ch1_q1",
        type: "mcq",
        question: "Which action pollutes air?",
        options: [
          "Planting trees",
          "Riding a bicycle",
          "Burning plastic",
          "Using solar cooker",
        ],
        answer: 2,
        explanation: "Burning plastic releases toxic chemicals into the air.",
      },
      {
        id: "c7_ch1_q2",
        type: "true_false",
        question: "Plastic takes many years to decompose.",
        answer: true,
        explanation:
          "Plastic can take hundreds of years to break down naturally.",
      },
      {
        id: "c7_ch1_q3",
        type: "match",
        question:
          "Match the following: Factory → Smoke, Car → Petrol, Tree → Oxygen",
        answer: "correct",
        explanation: "Each source produces or uses what is listed.",
      },
      {
        id: "c7_ch1_q4",
        type: "mcq",
        question: "Which of these is eco-friendly transport?",
        options: ["Car", "Bus", "Bicycle", "Airplane"],
        answer: 2,
        explanation:
          "Bicycles produce no pollution and are completely eco-friendly.",
      },
      {
        id: "c7_ch1_q5",
        type: "fill_blank",
        question: "Cutting trees is called ____.",
        answer: "deforestation",
        hint: "What is the term for removing forests?",
        explanation: "Deforestation is the large-scale removal of forests.",
      },
      {
        id: "c7_ch1_q6",
        type: "mcq",
        question: "Which greenhouse gas is most common?",
        options: ["CO₂", "O₂", "N₂", "He"],
        answer: 0,
        explanation:
          "Carbon dioxide (CO₂) is the most abundant greenhouse gas from human activities.",
      },
      {
        id: "c7_ch1_q7",
        type: "true_false",
        question: "Air pollution can cause asthma.",
        answer: true,
        explanation: "Polluted air can trigger and worsen asthma symptoms.",
      },
      {
        id: "c7_ch1_q8",
        type: "mcq",
        question: "Which is a non-biodegradable item?",
        options: ["Banana peel", "Plastic bottle", "Paper", "Leaf"],
        answer: 1,
        explanation:
          "Plastic bottles don't decompose naturally and persist in the environment.",
      },
      {
        id: "c7_ch1_q9",
        type: "match",
        question:
          "Match the following: Water pollution → Garbage in rivers, Air pollution → Smoke, Soil pollution → Pesticides",
        answer: "correct",
        explanation: "Each type of pollution has its common source.",
      },
      {
        id: "c7_ch1_q10",
        type: "mcq",
        question: "Which energy source is clean?",
        options: ["Coal", "Diesel", "Wind", "Petrol"],
        answer: 2,
        explanation: "Wind energy produces no pollution or greenhouse gases.",
      },
      {
        id: "c7_ch1_q11",
        type: "fill_blank",
        question: "Trees give us ____, which keeps air clean.",
        answer: "oxygen",
        hint: "What gas do trees produce?",
        explanation:
          "Trees produce oxygen and absorb carbon dioxide, cleaning the air.",
      },
      {
        id: "c7_ch1_q12",
        type: "true_false",
        question: "Riding a cycle reduces pollution.",
        answer: true,
        explanation:
          "Cycling produces zero emissions and reduces traffic pollution.",
      },
    ],
    game: {
      title: "Pollution Cleanup Game",
      description:
        "Clean up different types of pollution from land, air, and water",
      type: "choice",
      difficulty: "medium",
      duration: "15 min",
      points: 50,
      instructions:
        "Make smart choices to reduce pollution - choose clean energy, eco-friendly transport, and sustainable practices!",
    },
    outdoor_task: {
      title: "Traffic Pollution Observer",
      description:
        "Count how many vehicles pass your street in 10 minutes and write which type pollutes most.",
      verification_type: "description",
      points: 40,
    },
    eco_points_config: {
      quiz_correct: 12,
      quiz_incorrect: 0,
      quiz_completion_bonus: 50,
      game_win: 50,
      task_verified: 40,
    },
  },
  {
    class: 7,
    chapter_number: 2,
    title: "Natural Disasters",
    lesson:
      "Earthquakes, floods, cyclones, and droughts are natural disasters. They damage homes, crops, and lives. Preparedness, like drills, helps people stay safe. Planting trees reduces floods.",
    quiz: [
      {
        id: "c7_ch2_q1",
        type: "mcq",
        question: "What should you do in an earthquake?",
        options: [
          "Run outside",
          "Hide under a table",
          "Use a lift",
          "Stand near windows",
        ],
        answer: 1,
        explanation:
          "Taking cover under a sturdy table protects from falling objects.",
      },
      {
        id: "c7_ch2_q2",
        type: "true_false",
        question: "Cyclones bring strong winds and rain.",
        answer: true,
        explanation:
          "Cyclones are characterized by very strong winds and heavy rainfall.",
      },
      {
        id: "c7_ch2_q3",
        type: "match",
        question:
          "Match the following: Earthquake → Shaking ground, Flood → Heavy rain, Drought → No rain",
        answer: "correct",
        explanation: "Each disaster has its characteristic cause or effect.",
      },
      {
        id: "c7_ch2_q4",
        type: "mcq",
        question: "Which causes flood?",
        options: ["Lack of rain", "Heavy rainfall", "Earthquake", "Volcano"],
        answer: 1,
        explanation:
          "Heavy rainfall can overwhelm drainage systems and cause flooding.",
      },
      {
        id: "c7_ch2_q5",
        type: "fill_blank",
        question: "____ protects us from cyclone winds.",
        answer: "shelter",
        hint: "What do we need during strong winds?",
        explanation:
          "Strong shelters protect people from destructive cyclone winds.",
      },
      {
        id: "c7_ch2_q6",
        type: "mcq",
        question: "Which disaster is caused by no rain?",
        options: ["Earthquake", "Drought", "Flood", "Cyclone"],
        answer: 1,
        explanation:
          "Drought occurs when there is insufficient rainfall for extended periods.",
      },
      {
        id: "c7_ch2_q7",
        type: "true_false",
        question: "Volcanoes are man-made.",
        answer: false,
        explanation:
          "Volcanoes are natural geological formations created by Earth's processes.",
      },
      {
        id: "c7_ch2_q8",
        type: "mcq",
        question: "Which disaster can be predicted early?",
        options: ["Earthquake", "Cyclone", "Tsunami", "Drought"],
        answer: 1,
        explanation:
          "Cyclones can be tracked and predicted using weather monitoring systems.",
      },
      {
        id: "c7_ch2_q9",
        type: "match",
        question:
          "Match the following: Safety helmet → Earthquake, Boats → Flood, Strong roof → Cyclone",
        answer: "correct",
        explanation:
          "Each safety measure is appropriate for its corresponding disaster.",
      },
      {
        id: "c7_ch2_q10",
        type: "fill_blank",
        question: "Practicing a ____ can save lives.",
        answer: "drill",
        hint: "What practice prepares us for emergencies?",
        explanation:
          "Regular safety drills help people respond correctly during disasters.",
      },
      {
        id: "c7_ch2_q11",
        type: "true_false",
        question: "Deforestation increases flood risk.",
        answer: true,
        explanation:
          "Trees absorb water and prevent soil erosion, reducing flood risks.",
      },
      {
        id: "c7_ch2_q12",
        type: "mcq",
        question: "Which of these is not a natural disaster?",
        options: ["Landslide", "Pollution", "Cyclone", "Tsunami"],
        answer: 1,
        explanation:
          "Pollution is caused by human activities, not natural forces.",
      },
    ],
    game: {
      title: "Disaster Safety Simulation",
      description: "Pick safe actions in different disaster scenarios",
      type: "choice",
      difficulty: "medium",
      duration: "18 min",
      points: 45,
      instructions:
        "Choose the correct safety actions for earthquakes, floods, cyclones, and other disasters!",
    },
    outdoor_task: {
      title: "Safety Drill Practitioner",
      description: "Practice a disaster safety drill with family/friends.",
      verification_type: "description",
      points: 45,
    },
    eco_points_config: {
      quiz_correct: 12,
      quiz_incorrect: 0,
      quiz_completion_bonus: 50,
      game_win: 45,
      task_verified: 45,
    },
  },

  // Class 8
  {
    class: 8,
    chapter_number: 1,
    title: "Ecosystems",
    lesson:
      "An ecosystem is where plants, animals, and environment live together. Plants make food, herbivores eat plants, carnivores eat animals. Energy flows in a food chain.",
    quiz: [
      {
        id: "c8_ch1_q1",
        type: "mcq",
        question: "Which produces food?",
        options: ["Animals", "Plants", "Soil", "Humans"],
        answer: 1,
        explanation:
          "Plants are producers that make their own food through photosynthesis.",
      },
      {
        id: "c8_ch1_q2",
        type: "true_false",
        question: "Sun is the main source of energy.",
        answer: true,
        explanation:
          "The sun provides energy for photosynthesis, which starts all food chains.",
      },
      {
        id: "c8_ch1_q3",
        type: "match",
        question: "Match the following: Grass → Cow, Cow → Human, Lion → Deer",
        answer: "correct",
        explanation:
          "This shows a food chain where energy flows from one organism to another.",
      },
      {
        id: "c8_ch1_q4",
        type: "fill_blank",
        question: "A food chain starts with ____.",
        answer: "plants",
        hint: "What organisms make their own food?",
        explanation:
          "All food chains begin with plants (producers) that convert sunlight to energy.",
      },
      {
        id: "c8_ch1_q5",
        type: "mcq",
        question: "Which of these is a carnivore?",
        options: ["Cow", "Lion", "Goat", "Sheep"],
        answer: 1,
        explanation:
          "Lions are carnivores that eat only meat from other animals.",
      },
      {
        id: "c8_ch1_q6",
        type: "mcq",
        question: "Which is an ecosystem?",
        options: ["Desert", "Car", "House", "School bag"],
        answer: 0,
        explanation:
          "A desert is a natural ecosystem with living and non-living components.",
      },
      {
        id: "c8_ch1_q7",
        type: "true_false",
        question: "Herbivores eat meat.",
        answer: false,
        explanation: "Herbivores eat only plants, not meat.",
      },
      {
        id: "c8_ch1_q8",
        type: "mcq",
        question: "Which is a decomposer?",
        options: ["Fungus", "Dog", "Tree", "Lion"],
        answer: 0,
        explanation:
          "Fungi decompose dead organisms and return nutrients to the soil.",
      },
      {
        id: "c8_ch1_q9",
        type: "fill_blank",
        question: "Decomposers return nutrients to ____.",
        answer: "soil",
        hint: "Where do nutrients go after decomposition?",
        explanation:
          "Decomposers break down dead matter and enrich the soil with nutrients.",
      },
      {
        id: "c8_ch1_q10",
        type: "mcq",
        question: "Which is a balanced ecosystem?",
        options: ["Jungle", "Factory", "City", "Market"],
        answer: 0,
        explanation:
          "Jungles have natural balance between all living and non-living components.",
      },
      {
        id: "c8_ch1_q11",
        type: "match",
        question:
          "Match the following: Pond → Fish, Desert → Camel, Polar region → Polar bear",
        answer: "correct",
        explanation:
          "Each animal is adapted to live in its specific ecosystem.",
      },
      {
        id: "c8_ch1_q12",
        type: "mcq",
        question: "Which breaks the food chain?",
        options: ["Deforestation", "Photosynthesis", "Rainfall", "Composting"],
        answer: 0,
        explanation:
          "Deforestation removes plants, disrupting the entire food chain.",
      },
      {
        id: "c8_ch1_q13",
        type: "true_false",
        question: "Energy flows one way in a food chain.",
        answer: true,
        explanation:
          "Energy flows from sun to plants to herbivores to carnivores in one direction.",
      },
      {
        id: "c8_ch1_q14",
        type: "mcq",
        question: "Which is abiotic?",
        options: ["Sunlight", "Tiger", "Grass", "Deer"],
        answer: 0,
        explanation:
          "Sunlight is a non-living (abiotic) component of ecosystems.",
      },
      {
        id: "c8_ch1_q15",
        type: "fill_blank",
        question: "The Earth's largest ecosystem is the ____.",
        answer: "ocean",
        hint: "What covers most of Earth's surface?",
        explanation:
          "Oceans cover most of Earth and contain the largest ecosystems.",
      },
    ],
    game: {
      title: "Build Your Own Ecosystem Puzzle",
      description:
        "Create a balanced ecosystem by connecting plants, animals, and environment",
      type: "puzzle",
      difficulty: "hard",
      duration: "22 min",
      points: 60,
      instructions:
        "Arrange organisms in the correct food chain and balance predators, prey, and plants!",
    },
    outdoor_task: {
      title: "Food Chain Artist",
      description: "Draw a food chain of 4 organisms in your notebook.",
      verification_type: "photo",
      points: 50,
    },
    eco_points_config: {
      quiz_correct: 15,
      quiz_incorrect: 0,
      quiz_completion_bonus: 60,
      game_win: 60,
      task_verified: 50,
    },
  },
  {
    class: 8,
    chapter_number: 2,
    title: "Climate Change",
    lesson:
      "Climate change means long-term changes in temperature and weather. Burning fuels increases greenhouse gases, making Earth hotter. Effects: melting glaciers, rising seas, stronger storms.",
    quiz: [
      {
        id: "c8_ch2_q1",
        type: "mcq",
        question: "Which gas causes climate change?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
        answer: 1,
        explanation:
          "Carbon dioxide is the main greenhouse gas causing global warming.",
      },
      {
        id: "c8_ch2_q2",
        type: "true_false",
        question: "Climate change makes summers hotter.",
        answer: true,
        explanation:
          "Global warming leads to higher average temperatures and hotter summers.",
      },
      {
        id: "c8_ch2_q3",
        type: "match",
        question:
          "Match the following: CO₂ → Fossil fuels, Methane → Cattle, CFCs → Refrigerators",
        answer: "correct",
        explanation:
          "Each greenhouse gas comes from specific human activities.",
      },
      {
        id: "c8_ch2_q4",
        type: "mcq",
        question: "Which is a result of climate change?",
        options: [
          "Melting glaciers",
          "More trees",
          "Cleaner air",
          "Cold deserts",
        ],
        answer: 0,
        explanation: "Rising temperatures cause glaciers and ice caps to melt.",
      },
      {
        id: "c8_ch2_q5",
        type: "fill_blank",
        question: "Burning ____ increases CO₂.",
        answer: "coal",
        hint: "What fossil fuel releases carbon dioxide?",
        explanation:
          "Burning coal releases large amounts of CO₂ into the atmosphere.",
      },
      {
        id: "c8_ch2_q6",
        type: "mcq",
        question: "Which is a renewable source?",
        options: ["Coal", "Oil", "Wind", "Diesel"],
        answer: 2,
        explanation:
          "Wind energy is renewable and doesn't produce greenhouse gases.",
      },
      {
        id: "c8_ch2_q7",
        type: "true_false",
        question: "Floods may increase with climate change.",
        answer: true,
        explanation:
          "Climate change can lead to more extreme weather including severe flooding.",
      },
      {
        id: "c8_ch2_q8",
        type: "mcq",
        question: "Which is NOT an effect of climate change?",
        options: [
          "Rising seas",
          "Longer droughts",
          "More fish",
          "Hotter summers",
        ],
        answer: 2,
        explanation:
          "Climate change typically reduces fish populations due to ocean warming.",
      },
      {
        id: "c8_ch2_q9",
        type: "fill_blank",
        question: "Climate change is caused by human ____.",
        answer: "activities",
        hint: "What do humans do that affects climate?",
        explanation:
          "Human activities like burning fossil fuels are the main cause of climate change.",
      },
      {
        id: "c8_ch2_q10",
        type: "mcq",
        question: "Which country emits the most CO₂ today?",
        options: ["India", "USA", "China", "Brazil"],
        answer: 2,
        explanation:
          "China currently has the highest total CO₂ emissions globally.",
      },
      {
        id: "c8_ch2_q11",
        type: "match",
        question:
          "Match the following: Wind energy → Clean, Coal → Dirty, Solar → Renewable",
        answer: "correct",
        explanation:
          "Clean energy sources don't pollute, while fossil fuels do.",
      },
      {
        id: "c8_ch2_q12",
        type: "true_false",
        question: "Climate change is reversible quickly.",
        answer: false,
        explanation:
          "Climate change effects take decades or centuries to reverse.",
      },
      {
        id: "c8_ch2_q13",
        type: "mcq",
        question: "Which international agreement reduces emissions?",
        options: ["Paris Agreement", "WTO", "G20", "FIFA"],
        answer: 0,
        explanation:
          "The Paris Agreement commits countries to reducing greenhouse gas emissions.",
      },
      {
        id: "c8_ch2_q14",
        type: "fill_blank",
        question: "____ fuels are main reason for global warming.",
        answer: "fossil",
        hint: "What type of fuel causes most pollution?",
        explanation:
          "Fossil fuels release CO₂ when burned, causing global warming.",
      },
      {
        id: "c8_ch2_q15",
        type: "mcq",
        question: "Which activity reduces climate change?",
        options: [
          "Planting trees",
          "Burning garbage",
          "More factories",
          "Cutting forests",
        ],
        answer: 0,
        explanation:
          "Trees absorb CO₂ from the atmosphere, helping fight climate change.",
      },
    ],
    game: {
      title: "CO₂ Level Balancer",
      description:
        "Lower CO₂ levels by planting trees and choosing green energy",
      type: "simulation",
      difficulty: "hard",
      duration: "25 min",
      points: 65,
      instructions:
        "Make decisions to reduce greenhouse gases - plant forests, use renewable energy, and stop pollution!",
    },
    outdoor_task: {
      title: "Climate Observer",
      description:
        "Record today's temperature and compare it with last year's same month.",
      verification_type: "description",
      points: 50,
    },
    eco_points_config: {
      quiz_correct: 15,
      quiz_incorrect: 0,
      quiz_completion_bonus: 60,
      game_win: 65,
      task_verified: 50,
    },
  },

  // Class 9-12 (abbreviated for time constraint)
  {
    class: 9,
    chapter_number: 1,
    title: "Sustainable Cities",
    lesson:
      "A sustainable city provides good quality of life while protecting the environment. Such cities use smart public transport, renewable energy, and green buildings.",
    quiz: [
      {
        id: "c9_ch1_q1",
        type: "mcq",
        question: "Which transport is eco-friendly?",
        options: ["Car", "Airplane", "Bicycle", "Motorbike"],
        answer: 2,
        explanation: "Bicycles produce no pollution.",
      },
      {
        id: "c9_ch1_q2",
        type: "true_false",
        question: "Rainwater harvesting helps save water.",
        answer: true,
        explanation: "Rainwater harvesting conserves water resources.",
      },
    ],
    game: {
      title: "Design a Digital Eco-City",
      description:
        "Choose transport, buildings, and energy to make your city green",
      type: "simulation",
      difficulty: "hard",
      duration: "30 min",
      points: 70,
      instructions: "Build a sustainable city!",
    },
    outdoor_task: {
      title: "City Planner",
      description:
        "Make a sketch/map of your town and mark where cycling tracks, solar panels, or more trees can be added.",
      verification_type: "photo",
      points: 60,
    },
    eco_points_config: {
      quiz_correct: 15,
      quiz_incorrect: 0,
      quiz_completion_bonus: 70,
      game_win: 70,
      task_verified: 60,
    },
  },
  {
    class: 9,
    chapter_number: 2,
    title: "Deforestation",
    lesson:
      "Deforestation means cutting down forests on a large scale. It destroys animal habitats, reduces rainfall, increases global warming, and causes soil erosion. Planting trees and protecting forests is the only way to fight deforestation.",
    quiz: [
      {
        id: "c9_ch2_q1",
        type: "true_false",
        question: "Trees give us oxygen to breathe.",
        answer: true,
        explanation:
          "Trees absorb CO₂ and release oxygen, which is vital for life.",
      },
      {
        id: "c9_ch2_q2",
        type: "mcq",
        question: "Which is NOT a result of deforestation?",
        options: [
          "Soil erosion",
          "Cleaner air",
          "Loss of habitat",
          "Climate change",
        ],
        answer: 1,
        explanation:
          "Deforestation causes pollution and climate issues, not cleaner air.",
      },
      {
        id: "c9_ch2_q3",
        type: "mcq",
        question: "What happens when forests are cut?",
        options: [
          "Rainfall increases",
          "Soil fertility decreases",
          "Animals find new homes easily",
          "Oxygen levels rise",
        ],
        answer: 1,
        explanation: "Deforestation reduces soil fertility and causes erosion.",
      },
      {
        id: "c9_ch2_q4",
        type: "fill_blank",
        question: "Cutting down trees on a large scale is called ____.",
        answer: "deforestation",
        hint: "It means removing forests.",
        explanation:
          "The term for large-scale removal of forests is deforestation.",
      },
    ],
    game: {
      title: "Reforestation Challenge",
      description:
        "Plant more trees than are being cut down and save the forest",
      type: "choice",
      difficulty: "medium",
      duration: "15 min",
      points: 65,
      instructions:
        "Stop loggers, plant new trees, and restore balance in the forest ecosystem.",
    },
    outdoor_task: {
      title: "Tree Guardian",
      description:
        "Identify one place in your area where more trees could be planted. Take a photo or make a sketch.",
      verification_type: "photo",
      points: 50,
    },
    eco_points_config: {
      quiz_correct: 20,
      quiz_incorrect: 0,
      quiz_completion_bonus: 55,
      game_win: 65,
      task_verified: 50,
    },
  },

  {
    class: 10,
    chapter_number: 1,
    title: "Waste to Wealth",
    lesson:
      "Waste can be turned into wealth by recycling and reusing. Paper, plastic, and kitchen waste can all be transformed into valuable resources.",
    quiz: [
      {
        id: "c10_ch1_q1",
        type: "mcq",
        question: "Recycling means?",
        options: [
          "Throwing waste",
          "Burning waste",
          "Making new from old",
          "Dumping waste",
        ],
        answer: 2,
        explanation: "Recycling creates new products from old materials.",
      },
      {
        id: "c10_ch1_q2",
        type: "true_false",
        question: "Compost can be made from vegetable waste.",
        answer: true,
        explanation: "Vegetable waste decomposes into nutrient-rich compost.",
      },
    ],
    game: {
      title: "Recycling Factory Simulator",
      description: "Sort waste into machines to recycle",
      type: "sorting",
      difficulty: "hard",
      duration: "25 min",
      points: 65,
      instructions: "Operate a recycling plant efficiently!",
    },
    outdoor_task: {
      title: "Waste Separator",
      description: "Start separating dry and wet waste at your home.",
      verification_type: "photo",
      points: 55,
    },
    eco_points_config: {
      quiz_correct: 15,
      quiz_incorrect: 0,
      quiz_completion_bonus: 65,
      game_win: 65,
      task_verified: 55,
    },
  },
  {
    class: 10,
    chapter_number: 2,
    title: "Global Warming",
    lesson:
      "Global warming is the long-term rise in Earth’s average temperature caused by greenhouse gases like CO₂ and methane. It leads to melting glaciers, rising sea levels, extreme weather events, and threatens biodiversity.",
    quiz: [
      {
        id: "c10_ch2_q1",
        type: "mcq",
        question: "Which gas is the main cause of global warming?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        answer: 1,
        explanation:
          "Carbon dioxide is the primary greenhouse gas responsible for global warming.",
      },
      {
        id: "c10_ch2_q2",
        type: "true_false",
        question: "Melting glaciers are a result of global warming.",
        answer: true,
        explanation:
          "Rising global temperatures cause glaciers and ice caps to melt.",
      },
      {
        id: "c10_ch2_q3",
        type: "mcq",
        question: "Which activity increases global warming?",
        options: [
          "Planting trees",
          "Burning fossil fuels",
          "Using solar energy",
          "Cycling",
        ],
        answer: 1,
        explanation:
          "Burning fossil fuels releases greenhouse gases into the atmosphere.",
      },
      {
        id: "c10_ch2_q4",
        type: "mcq",
        question: "Which is NOT an effect of global warming?",
        options: [
          "Rising seas",
          "Extreme droughts",
          "Cleaner air",
          "Heat waves",
        ],
        answer: 2,
        explanation:
          "Global warming causes pollution and extreme weather, not cleaner air.",
      },
    ],
    game: {
      title: "CO₂ Balance Game",
      description:
        "Balance a CO₂ meter by making green choices in everyday life",
      type: "simulation",
      difficulty: "medium",
      duration: "20 min",
      points: 70,
      instructions:
        "Choose eco-friendly actions like using solar panels, cycling, or planting trees to lower CO₂ levels. Avoid harmful actions like burning coal or cutting forests.",
    },
    outdoor_task: {
      title: "Carbon Footprint Checker",
      description:
        "List 3 things you or your family do daily that increase CO₂ (e.g., using petrol vehicles, plastic bags). Suggest one eco-friendly alternative.",
      verification_type: "description",
      points: 55,
    },
    eco_points_config: {
      quiz_correct: 20,
      quiz_incorrect: 0,
      quiz_completion_bonus: 60,
      game_win: 70,
      task_verified: 55,
    },
  },

  {
    class: 11,
    chapter_number: 1,
    title: "Biodiversity Conservation",
    lesson:
      "Biodiversity means variety of life on Earth. Every species plays a role in keeping ecosystems balanced. Conservation protects this diversity.",
    quiz: [
      {
        id: "c11_ch1_q1",
        type: "mcq",
        question: "Which is an example of biodiversity?",
        options: [
          "Only trees",
          "Only animals",
          "Plants, animals, and microorganisms",
          "Only humans",
        ],
        answer: 2,
        explanation: "Biodiversity includes all forms of life.",
      },
      {
        id: "c11_ch1_q2",
        type: "true_false",
        question: "Biodiversity maintains ecosystem balance.",
        answer: true,
        explanation: "Each species contributes to ecosystem stability.",
      },
    ],
    game: {
      title: "Save the Species",
      description:
        "Rescue endangered animals by choosing correct conservation methods",
      type: "choice",
      difficulty: "hard",
      duration: "35 min",
      points: 80,
      instructions: "Protect endangered species from extinction!",
    },
    outdoor_task: {
      title: "Species Counter",
      description:
        "Visit a local park and list at least 10 different species (plants/animals/insects).",
      verification_type: "photo",
      points: 70,
    },
    eco_points_config: {
      quiz_correct: 20,
      quiz_incorrect: 0,
      quiz_completion_bonus: 80,
      game_win: 80,
      task_verified: 70,
    },
  },
  {
    class: 11,
    chapter_number: 2,
    title: "Sustainable Agriculture",
    lesson:
      "Sustainable agriculture focuses on using natural methods like organic farming to grow food without harming the environment. It reduces chemical use, conserves soil fertility, and promotes healthier ecosystems.",
    quiz: [
      {
        id: "c11_ch2_q1",
        type: "mcq",
        question: "Which farming method avoids synthetic pesticides?",
        options: [
          "Organic Farming",
          "Chemical Farming",
          "Industrial Farming",
          "Hybrid Farming",
        ],
        answer: 0,
        explanation:
          "Organic farming avoids chemical pesticides and fertilizers.",
      },
      {
        id: "c11_ch2_q2",
        type: "true_false",
        question: "Chemical fertilizers improve soil health in the long run.",
        answer: false,
        explanation: "Overuse of chemicals depletes soil fertility.",
      },
      {
        id: "c11_ch2_q3",
        type: "mcq",
        question: "Which of these is a benefit of sustainable agriculture?",
        options: [
          "Reduced biodiversity",
          "Better soil fertility",
          "Water pollution",
          "Increased chemical use",
        ],
        answer: 1,
        explanation:
          "Sustainable agriculture improves soil fertility and reduces pollution.",
      },
    ],
    game: {
      title: "Virtual Farming",
      description:
        "Choose farming methods to get better yield while protecting the environment",
      type: "simulation",
      difficulty: "medium",
      duration: "25 min",
      points: 85,
      instructions:
        "Experiment with different farming choices (organic, chemical, or mixed) and see their impact on soil health, yield, and environment.",
    },
    outdoor_task: {
      title: "Farm Practices Survey",
      description:
        "Interview a local farmer or observe farmland to note whether organic or chemical methods are used. Record your findings.",
      verification_type: "photo",
      points: 70,
    },
    eco_points_config: {
      quiz_correct: 20,
      quiz_incorrect: 0,
      quiz_completion_bonus: 60,
      game_win: 85,
      task_verified: 70,
    },
  },

  {
    class: 12,
    chapter_number: 1,
    title: "Renewable Future",
    lesson:
      "The future depends on renewable energy sources like solar, wind, and hydropower. These are clean, unlimited, and reduce climate change.",
    quiz: [
      {
        id: "c12_ch1_q1",
        type: "mcq",
        question: "Which is renewable energy?",
        options: ["Coal", "Oil", "Solar", "Diesel"],
        answer: 2,
        explanation: "Solar energy is renewable and clean.",
      },
      {
        id: "c12_ch1_q2",
        type: "true_false",
        question: "Coal is renewable.",
        answer: false,
        explanation: "Coal is a finite fossil fuel.",
      },
    ],
    game: {
      title: "Build Your City's Energy Mix",
      description: "Power a city using renewable sources",
      type: "simulation",
      difficulty: "hard",
      duration: "40 min",
      points: 90,
      instructions: "Create a 100% renewable energy grid!",
    },
    outdoor_task: {
      title: "Renewable Scout",
      description:
        "List all renewable energy devices in your area (solar heaters, street lights, panels).",
      verification_type: "photo",
      points: 75,
    },
    eco_points_config: {
      quiz_correct: 25,
      quiz_incorrect: 0,
      quiz_completion_bonus: 90,
      game_win: 90,
      task_verified: 75,
    },
  },
  {
    class: 12,
    chapter_number: 2,
    title: "Sustainable Development Goals",
    lesson:
      "The United Nations' 17 Sustainable Development Goals (SDGs) guide the world toward ending poverty, protecting the planet, and ensuring prosperity for all. Environmental SDGs focus on clean water, climate action, life on land, and life below water.",
    quiz: [
      {
        id: "c12_ch2_q1",
        type: "mcq",
        question: "How many Sustainable Development Goals (SDGs) are there?",
        options: ["10", "12", "15", "17"],
        answer: 3,
        explanation: "There are 17 SDGs adopted by the UN.",
      },
      {
        id: "c12_ch2_q2",
        type: "true_false",
        question:
          "Climate Action is one of the UN's Sustainable Development Goals.",
        answer: true,
        explanation: "Yes, SDG 13 is 'Climate Action'.",
      },
      {
        id: "c12_ch2_q3",
        type: "mcq",
        question: "Which of these is NOT an SDG?",
        options: [
          "Zero Hunger",
          "Affordable and Clean Energy",
          "Unlimited Use of Fossil Fuels",
          "Life Below Water",
        ],
        answer: 2,
        explanation:
          "Unlimited Use of Fossil Fuels is not an SDG because fossil fuels are harmful.",
      },
    ],
    game: {
      title: "Achieve the SDGs",
      description: "Make correct choices to achieve sustainability goals",
      type: "sorting",
      difficulty: "hard",
      duration: "30 min",
      points: 100,
      instructions:
        "Select projects and actions that align with the UN’s SDGs while avoiding harmful practices.",
    },
    outdoor_task: {
      title: "Local SDG Tracker",
      description:
        "Identify and document at least 3 ways your community is contributing to the SDGs (like tree planting, water conservation, solar energy use).",
      verification_type: "photo",
      points: 80,
    },
    eco_points_config: {
      quiz_correct: 30,
      quiz_incorrect: 0,
      quiz_completion_bonus: 90,
      game_win: 100,
      task_verified: 80,
    },
  },
];

// Helper function to get curriculum by class
export const getCurriculumByClass = (classNumber: number): EnvironmentChapter[] =>
  environmentCurriculum.filter((chapter) => chapter.class === classNumber);

/** Get a sorted list of all classes that exist in the curriculum. */
export const getAllClasses = (): number[] =>
  [...new Set(environmentCurriculum.map((chapter) => chapter.class))].sort((a, b) => a - b);

/** Get a single chapter by class + chapter number (convenience). */
export const getChapter = (classNumber: number, chapterNumber: number): EnvironmentChapter | null =>
  environmentCurriculum.find(
    (c) => c.class === classNumber && c.chapter_number === chapterNumber
  ) ?? null;

/** Bundle quiz questions with the quiz-related points config for a given chapter. */
export const getQuizBundle = (
  classNumber: number,
  chapterNumber: number
): {
  title: string;
  questions: QuizQuestion[];
  pointsConfig: {
    quiz_correct: number;
    quiz_incorrect: number;
    quiz_completion_bonus: number;
  };
} | null => {
  const chapter = getChapter(classNumber, chapterNumber);
  if (!chapter) return null;

  const { quiz, eco_points_config, title } = chapter;

  return {
    title,
    questions: quiz,
    pointsConfig: {
      quiz_correct: eco_points_config.quiz_correct,
      quiz_incorrect: eco_points_config.quiz_incorrect,
      quiz_completion_bonus: eco_points_config.quiz_completion_bonus,
    },
  };
};

/** Bundle the game data for a given chapter. */
export const getGameBundle = (
  classNumber: number,
  chapterNumber: number
): {
  title: string;
  game: Game;
  pointsConfig: {
    game_win: number;
  };
} | null => {
  const chapter = getChapter(classNumber, chapterNumber);
  if (!chapter) return null;

  const { game, eco_points_config, title } = chapter;

  return {
    title,
    game,
    pointsConfig: {
      game_win: eco_points_config.game_win,
    },
  };
};

/** Bundle the outdoor task for a given chapter. */
export const getOutdoorTaskBundle = (
  classNumber: number,
  chapterNumber: number
): {
  title: string;
  task: OutdoorTask;
  pointsConfig: {
    task_verified: number;
  };
} | null => {
  const chapter = getChapter(classNumber, chapterNumber);
  if (!chapter) return null;

  const { outdoor_task, eco_points_config, title } = chapter;

  return {
    title,
    task: outdoor_task,
    pointsConfig: {
      task_verified: eco_points_config.task_verified,
    },
  };
};
