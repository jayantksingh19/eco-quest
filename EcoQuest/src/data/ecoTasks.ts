export interface EcoTask {
  id: number;
  level: number;
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  requirements: string[];
  tips: string[];
}

export const ECO_TASKS: EcoTask[] = [
  {
    id: 1,
    level: 1,
    title: "Plant a tree in your community",
    description:
      "Plant a native tree sapling and document the entire process to boost local biodiversity.",
    points: 15,
    difficulty: "Easy",
    timeEstimate: "30-60 minutes",
    requirements: [
      "Take a clear photo of the planted sapling",
      "Film yourself through the planting process",
      "Include the exact location where you planted it",
      "Mention the species you planted",
      "Explain why you chose this location",
    ],
    tips: [
      "Choose native species for better survival rates",
      "Water the sapling thoroughly after planting",
      "Plant during early morning or late afternoon",
    ],
  },
  {
    id: 2,
    level: 1,
    title: "Create a home compost starter",
    description:
      "Build a simple compost setup using kitchen waste and share how it helps reduce landfill waste.",
    points: 15,
    difficulty: "Easy",
    timeEstimate: "45-60 minutes",
    requirements: [
      "Show the materials you used",
      "Record the step-by-step compost setup",
      "Share safety or odor-control tips",
      "Explain what green and brown waste you added",
      "Describe where you placed the compost bin",
    ],
    tips: [
      "Balance wet and dry waste for faster composting",
      "Stir your compost once a week",
      "Avoid adding oily or animal products",
    ],
  },
  {
    id: 3,
    level: 2,
    title: "Organise a micro clean-up",
    description:
      "Clean a small public spot—like a park bench area or bus stop—and showcase the before/after impact.",
    points: 20,
    difficulty: "Medium",
    timeEstimate: "60-90 minutes",
    requirements: [
      "Capture before and after photos",
      "List the type of litter collected",
      "Share how you disposed of the waste responsibly",
      "Mention if friends or family helped",
      "Reflect on how the area looks post-clean-up",
    ],
    tips: [
      "Use gloves and reusable bags",
      "Separate recyclables where possible",
      "Talk to locals about keeping the area clean",
    ],
  },
  {
    id: 4,
    level: 2,
    title: "Build a DIY bird feeder",
    description:
      "Create a bird feeder using upcycled materials and explain how it supports local wildlife.",
    points: 20,
    difficulty: "Medium",
    timeEstimate: "45-60 minutes",
    requirements: [
      "Showcase the materials you upcycled",
      "Record the building process",
      "Display the feeder installed outdoors",
      "Describe which birds you hope to attract",
      "Share maintenance or refill plans",
    ],
    tips: [
      "Place the feeder near trees for safety",
      "Use seeds suited for local bird species",
      "Clean the feeder regularly",
    ],
  },
  {
    id: 5,
    level: 3,
    title: "Set up a rainwater harvesting jar",
    description:
      "Collect rainwater with a simple harvesting setup and describe how you’ll use the stored water.",
    points: 25,
    difficulty: "Medium",
    timeEstimate: "60 minutes",
    requirements: [
      "Show the container and collection area",
      "Film the installation process",
      "Explain safety measures to keep water clean",
      "Share how much water you collected",
      "Describe how you plan to use the water",
    ],
    tips: [
      "Filter debris with a cloth or mesh",
      "Keep the container covered",
      "Use the water for gardening or cleaning",
    ],
  },
  {
    id: 6,
    level: 3,
    title: "Host a mini awareness talk",
    description:
      "Educate a small group about reducing single-use plastics and capture their key takeaways.",
    points: 25,
    difficulty: "Medium",
    timeEstimate: "45 minutes",
    requirements: [
      "Share your presentation or materials",
      "Record a short clip of your talk",
      "Summarise the group’s feedback",
      "List three actions attendees promised to take",
      "Reflect on what you learned from hosting",
    ],
    tips: [
      "Use visuals or props",
      "Keep the session interactive",
      "Provide simple action points",
    ],
  },
  {
    id: 7,
    level: 4,
    title: "Create a zero-waste starter kit",
    description:
      "Assemble a beginner-friendly zero-waste kit and explain how each item reduces waste.",
    points: 30,
    difficulty: "Hard",
    timeEstimate: "60 minutes",
    requirements: [
      "Show every item in the kit",
      "Explain how each item replaces a single-use product",
      "Document giving or presenting the kit to someone",
      "Share their initial reaction or plan to use it",
      "Reflect on items you’d add in the future",
    ],
    tips: [
      "Include reusable cutlery and bottles",
      "Add a small handbook or checklist",
      "Use upcycled packaging for the kit",
    ],
  },
  {
    id: 8,
    level: 4,
    title: "Map biodiversity in a local spot",
    description:
      "Document at least five plant or animal species in a nearby green space and share your findings.",
    points: 30,
    difficulty: "Hard",
    timeEstimate: "90 minutes",
    requirements: [
      "Photograph each species",
      "Share the location and habitat conditions",
      "Note if the species is native or invasive",
      "Mention why biodiversity there matters",
      "Propose one action to protect the spot",
    ],
    tips: [
      "Visit during early morning",
      "Use an identification app for accuracy",
      "Stay on designated paths to avoid disturbance",
    ],
  },
  {
    id: 9,
    level: 5,
    title: "Design a community recycling guide",
    description:
      "Create a guide for your community on how to dispose of waste responsibly and share it digitally.",
    points: 35,
    difficulty: "Hard",
    timeEstimate: "120 minutes",
    requirements: [
      "Include local recycling points",
      "Explain segregation rules",
      "Share common mistakes to avoid",
      "Add tips for reducing waste at source",
      "Document sharing the guide with neighbours",
    ],
    tips: [
      "Use clear icons and graphics",
      "Provide downloadable/printable versions",
      "Encourage feedback from recipients",
    ],
  },
  {
    id: 10,
    level: 5,
    title: "Launch a weekly eco-habit challenge",
    description:
      "Organise a 4-week challenge encouraging friends or classmates to adopt eco-habits and track participation.",
    points: 40,
    difficulty: "Hard",
    timeEstimate: "120+ minutes",
    requirements: [
      "Share the challenge plan and timeline",
      "Introduce each weekly habit",
      "Collect participant updates",
      "Document progress in a recap video",
      "Reflect on the overall impact",
    ],
    tips: [
      "Keep each habit simple and fun",
      "Use a group chat for motivation",
      "Celebrate progress publicly",
    ],
  },
];
