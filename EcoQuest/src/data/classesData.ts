const defaultGame = {
  title: "No Game Available",
  description: "This chapter does not include a game",
  difficulty: "Easy",
  duration: "0 min",
  points: 0,
};

export const classesData = {
  1: {
    chapters: [
      {
        title: "Clean and Dirty Places",
        lessons: [
          {
            title: "Why Clean Places Matter",
            description:
              "Learn why we should keep our home, park, and school clean",
            type: "video" as const,
            duration: "6 min",
            points: 10,
            link: "https://youtu.be/K5NRbh4Wfq8?si=OjW6Kpb2mt0JhgwU",
          },
        ],
        quiz: {
          title: "Cleanliness True/False",
          description:
            "Answer true/false questions like 'Throwing waste in dustbin is good'",
          questions: 5,
          points: 12,
        },
        game: {
          title: "Garbage Sorting Fun",
          description: "Drag-and-drop garbage into the correct bin",
          difficulty: "Easy",
          duration: "8 min",
          points: 18,
        },
      },
      {
        title: "Water is Life",
        lessons: [
          {
            title: "Uses of Water",
            description: "Animated video about why water is important",
            type: "video" as const,
            duration: "7 min",
            points: 10,
            link: "https://youtu.be/QcT6Kf9OiZo?si=1JJf2If8Zn2r6J2E",
          },
        ],
        quiz: {
          title: "Water Awareness",
          description: "Identify where water is being wasted",
          questions: 6,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  2: {
    chapters: [
      {
        title: "Our Animal Friends",
        lessons: [
          {
            title: "Caring for Animals",
            description: "Learn how to care for pets and street animals",
            type: "video" as const,
            duration: "7 min",
            points: 10,
            link: "https://youtu.be/Wl7Ges1snhs?si=Rk7mYFBnbUqvteDX",
          },
        ],
        quiz: {
          title: "Animal Needs",
          description:
            "Match animals with their needs (dog → food, bird → water)",
          questions: 6,
          points: 12,
        },
        game: defaultGame,
      },
      {
        title: "Save Trees",
        lessons: [
          {
            title: "Importance of Trees",
            description: "Understand how trees give us air, fruits, and shade",
            type: "reading" as const,
            duration: "6 min",
            points: 10,
            link: "https://youtu.be/6x8IuJlcXTk?si=_IfUcOezBWSNreMo",
          },
        ],
        quiz: {
          title: "Tree Benefits",
          description: "Multiple-choice questions on tree benefits",
          questions: 5,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  3: {
    chapters: [
      {
        title: "Reduce, Reuse, Recycle",
        lessons: [
          {
            title: "Waste Segregation",
            description: "Learn about reducing waste and reusing materials",
            type: "video" as const,
            duration: "8 min",
            points: 12,
            link: "https://youtu.be/c8YxL0KhXtI?si=OumvaJkxNh-ojWC8",
          },
        ],
        quiz: {
          title: "Waste Sorting",
          description: "Choose which item goes in which bin",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
      {
        title: "Energy at Home",
        lessons: [
          {
            title: "Saving Electricity",
            description: "Tips for saving electricity with lights and devices",
            type: "reading" as const,
            duration: "6 min",
            points: 10,
            link: "https://youtu.be/grx-6CNNV_Q?si=HUn5Dx1mcqhAj1S5",
          },
        ],
        quiz: {
          title: "Energy Habits",
          description: "Identify good and bad energy-saving habits",
          questions: 5,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  4: {
    chapters: [
      {
        title: "Air Around Us",
        lessons: [
          {
            title: "Why Clean Air Matters",
            description: "Understand the importance of fresh air",
            type: "video" as const,
            duration: "7 min",
            points: 12,
            link: "https://youtu.be/h7rhOM2dXtE?si=Tm4OxQlytRJ80BZh",
          },
        ],
        quiz: {
          title: "Air Pollution",
          description: "True/False on smoke and pollution",
          questions: 6,
          points: 12,
        },
        game: defaultGame,
      },
      {
        title: "Sources of Water",
        lessons: [
          {
            title: "Where Water Comes From",
            description: "Learn about rivers, lakes, rain, and wells",
            type: "reading" as const,
            duration: "6 min",
            points: 10,
            link: "https://youtu.be/BJnD_EWcoBQ?si=W7QbzuIN4z9LvEcz",
          },
        ],
        quiz: {
          title: "Water Sources",
          description: "Match each water source to its picture",
          questions: 5,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  5: {
    chapters: [
      {
        title: "Water Cycle Adventure",
        lessons: [
          {
            title: "Rainy the Cloud",
            description:
              "Story of the water cycle through a character named Rainy",
            type: "reading" as const,
            duration: "8 min",
            points: 12,
            link: "https://youtu.be/ncORPosDrjI?si=27pSR5UgM7SRTcmz",
          },
        ],
        quiz: {
          title: "Water Cycle Steps",
          description: "Arrange steps of the water cycle in correct order",
          questions: 5,
          points: 15,
        },
        game: defaultGame,
      },
      {
        title: "Our Forests, Our Friends",
        lessons: [
          {
            title: "Importance of Forests",
            description: "Learn why forests and animals are important",
            type: "video" as const,
            duration: "7 min",
            points: 12,
            link: "https://youtu.be/_dWJVHIE9S8?si=8ppp_hsX6en8itKO",
          },
        ],
        quiz: {
          title: "Animal Habitats",
          description: "Match animals to their natural habitat",
          questions: 6,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  6: {
    chapters: [
      {
        title: "Soil and Farming",
        lessons: [
          {
            title: "Fertile Soil",
            description: "Learn why fertile soil is important for farming",
            type: "video" as const,
            duration: "8 min",
            points: 12,
            link: "https://youtu.be/uo_ntewAemw?si=5IRASX2rhimyNnDh",
          },
        ],
        quiz: {
          title: "Soil Types",
          description: "Identify different types of soil",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
      {
        title: "Renewable Energy",
        lessons: [
          {
            title: "Sources of Energy",
            description: "Learn about energy from the sun, wind, and water",
            type: "reading" as const,
            duration: "7 min",
            points: 10,
            link: "https://youtu.be/Giek094C_l4?si=aYk6UPPxl2LKrd-k",
          },
        ],
        quiz: {
          title: "Renewable vs Non-renewable",
          description: "Classify energy sources as renewable or not",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
    ],
  },
  7: {
    chapters: [
      {
        title: "Human Impact on Environment",
        lessons: [
          {
            title: "Types of Pollution",
            description: "Learn about air, water, and soil pollution",
            type: "video" as const,
            duration: "8 min",
            points: 15,
            link: "https://youtu.be/K10qnzCYH54?si=Hg6H5q_7VV_M5C-k",
          },
        ],
        quiz: {
          title: "Pollution Effects",
          description: "Match pollution types with their effects",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
      {
        title: "Natural Disasters",
        lessons: [
          {
            title: "Disaster Basics",
            description: "Introduction to earthquakes, floods, and cyclones",
            type: "reading" as const,
            duration: "7 min",
            points: 12,
            link: "https://youtu.be/ZZeJq6-xMAM?si=CiZ-KpjgxMaSceoG",
          },
        ],
        quiz: {
          title: "Safety Measures",
          description: "Quiz on safety measures during disasters",
          questions: 6,
          points: 12,
        },
        game: defaultGame,
      },
    ],
  },
  8: {
    chapters: [
      {
        title: "Ecosystems",
        lessons: [
          {
            title: "Food Chains and Webs",
            description: "Understand how energy flows through ecosystems",
            type: "video" as const,
            duration: "8 min",
            points: 15,
            link: "https://youtu.be/sKJoXdrOT70?si=zkd0c2lsrlO5-LwL",
          },
        ],
        quiz: {
          title: "Food Chain Order",
          description: "Arrange animals in the correct food chain sequence",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
      {
        title: "Climate Change",
        lessons: [
          {
            title: "Causes and Effects",
            description: "Learn about greenhouse gases and their impact",
            type: "reading" as const,
            duration: "7 min",
            points: 12,
            link: "https://youtu.be/Y1mPWVzaGQY?si=Ea7vlJzdUaVAK_XG",
          },
        ],
        quiz: {
          title: "Climate Quiz",
          description: "MCQs about climate change and greenhouse gases",
          questions: 6,
          points: 15,
        },
        game: defaultGame,
      },
    ],
  },
  9: {
    chapters: [
      {
        title: "Sustainable Cities",
        lessons: [
          {
            title: "Eco-Friendly Cities",
            description: "Smart transport and waste management practices",
            type: "video" as const,
            duration: "9 min",
            points: 15,
            link: "https://youtu.be/7hEYtozmb5o?si=VKKsGM7BZRyExRup",
          },
        ],
        quiz: {
          title: "City Practices",
          description: "Identify sustainable practices in a city",
          questions: 6,
          points: 15,
        },
        game: {
          title: "Design an Eco-City",
          description: "Build a digital sustainable city",
          difficulty: "Medium",
          duration: "12 min",
          points: 20,
        },
      },
      {
        title: "Deforestation",
        lessons: [
          {
            title: "Impacts of Tree Cutting",
            description: "Understand why deforestation is harmful",
            type: "reading" as const,
            duration: "8 min",
            points: 12,
            link: "https://youtu.be/2UDDXGaUcLE?si=fE9jwX5euib7lZmD",
          },
        ],
        quiz: {
          title: "Tree Facts",
          description: "True/False questions like 'Trees give oxygen'",
          questions: 6,
          points: 12,
        },
        game: {
          title: "Reforestation Challenge",
          description: "Plant more trees than are cut down",
          difficulty: "Medium",
          duration: "10 min",
          points: 18,
        },
      },
    ],
  },
  10: {
    chapters: [
      {
        title: "Waste to Wealth",
        lessons: [
          {
            title: "Recycling Industries",
            description: "Learn how waste materials are turned into products",
            type: "video" as const,
            duration: "9 min",
            points: 15,
            link: "https://youtu.be/IawImOUKQtE?si=7JUTfiB7-vac5mbq",
          },
        ],
        quiz: {
          title: "Recycling Quiz",
          description: "Match waste items to their recycled products",
          questions: 6,
          points: 15,
        },
        game: {
          title: "Recycling Factory",
          description: "Simulate a recycling factory process",
          difficulty: "Medium",
          duration: "12 min",
          points: 20,
        },
      },
      {
        title: "Global Warming",
        lessons: [
          {
            title: "Effects on Earth",
            description: "How global warming affects glaciers and weather",
            type: "reading" as const,
            duration: "8 min",
            points: 12,
            link: "https://youtu.be/vNIjGFbsAq8?si=Xo85vYlhTBXDfsNY",
          },
        ],
        quiz: {
          title: "Global Warming Quiz",
          description: "MCQs on global warming causes and effects",
          questions: 6,
          points: 15,
        },
        game: {
          title: "CO₂ Balance Game",
          description: "Balance a CO₂ meter by making green choices",
          difficulty: "Medium",
          duration: "10 min",
          points: 18,
        },
      },
    ],
  },
  11: {
    chapters: [
      {
        title: "Biodiversity Conservation",
        lessons: [
          {
            title: "Why Biodiversity Matters",
            description: "Learn about endangered species and habitats",
            type: "video" as const,
            duration: "9 min",
            points: 15,
            link: "https://youtu.be/Zl_baTDd2RI?si=JuQne0QxR8KXuMRc",
          },
        ],
        quiz: {
          title: "Endangered Species",
          description: "Identify endangered species from pictures",
          questions: 6,
          points: 15,
        },
        game: {
          title: "Save the Species",
          description: "Protect habitats to save animals",
          difficulty: "Medium",
          duration: "12 min",
          points: 20,
        },
      },
      {
        title: "Sustainable Agriculture",
        lessons: [
          {
            title: "Organic vs Chemical Farming",
            description: "Learn about organic farming and sustainability",
            type: "reading" as const,
            duration: "9 min",
            points: 12,
            link: "https://youtu.be/QxK4YbPrWXk?si=FpFt8ViFuUP87Npc",
          },
        ],
        quiz: {
          title: "Farming Practices",
          description: "MCQs on pros and cons of organic vs chemical farming",
          questions: 6,
          points: 15,
        },
        game: {
          title: "Virtual Farming",
          description: "Choose farming methods to get better yield",
          difficulty: "Medium",
          duration: "12 min",
          points: 20,
        },
      },
    ],
  },
  12: {
    chapters: [
      {
        title: "Renewable Future",
        lessons: [
          {
            title: "Renewable Energy Sources",
            description: "Detailed explanation of renewable energy",
            type: "video" as const,
            duration: "10 min",
            points: 15,
            link: "https://youtu.be/UVf2Yw7uFoE?si=wRcNfcThGGW_gMCw",
          },
        ],
        quiz: {
          title: "Energy Sources",
          description: "Identify which sources are renewable",
          questions: 6,
          points: 15,
        },
        game: {
          title: "Build a Green City",
          description: "Create a renewable energy mix to power a city",
          difficulty: "Hard",
          duration: "15 min",
          points: 25,
        },
      },
      {
        title: "Sustainable Development Goals",
        lessons: [
          {
            title: "UN’s 17 SDGs",
            description: "Focus on environmental SDGs and their importance",
            type: "reading" as const,
            duration: "10 min",
            points: 15,
            link: "https://youtu.be/X5zHBCsz42I?si=3wUkUr-98INRaLZK",
          },
        ],
        quiz: {
          title: "SDG Quiz",
          description: "Match each goal with its description",
          questions: 8,
          points: 18,
        },
        game: {
          title: "Achieve the SDGs",
          description: "Make correct choices to achieve sustainability goals",
          difficulty: "Hard",
          duration: "15 min",
          points: 25,
        },
      },
    ],
  },
};
