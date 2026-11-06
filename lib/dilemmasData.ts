import { PerspectiveCardData } from "@/components/PerspectiveModal";

export const heroCardsData: Record<string, PerspectiveCardData> = {
  career: {
    category: "Career",
    perspectivesCount: "34 perspectives",
    title: "I want to quit my job, but I'm scared I'll regret it.",
    description: "Navigating the gap between emotional burnout and financial caution when you have zero backup plan.",
    reflections: [
      {
        author: "Marcus T.",
        role: "Former Product Lead",
        time: "3 days ago",
        quote: "I thought having no backup plan meant disaster. What I really needed was a financial runway audit: 4 months of expenses was enough breathing room to reset.",
        whatHelped: "Calculated exact 4-month bare-bones runway before handing in notice.",
        likes: 24,
      },
      {
        author: "Sarah K.",
        role: "UX Researcher",
        time: "1 week ago",
        quote: "I negotiated a 4-day workweek instead of quitting outright. It gave me 20% of my sanity back to interview without desperation.",
        whatHelped: "Proposed a 90-day trial of 80% schedule with pro-rated compensation.",
        likes: 38,
      },
      {
        author: "Anonymous",
        role: "Software Engineer",
        time: "2 weeks ago",
        quote: "The regret of staying in an environment that made me sick was 10x heavier than the temporary anxiety of job hunting.",
        whatHelped: "Documented daily energy levels to prove to myself it wasn't just a 'bad week'.",
        likes: 19,
      },
    ],
  },
  friendships: {
    category: "Life & Friendships",
    categoryBg: "bg-secondary-fixed text-on-secondary-fixed-variant",
    perspectivesCount: "19 people sharing",
    title: "Why is making friends harder after college?",
    description: "Without structured daily proximity, spontaneous hangouts fade. Here is how people rebuilt intentional closeness in their late 20s.",
    reflections: [
      {
        author: "Elena R.",
        role: "Architect",
        time: "Yesterday",
        quote: "College friendships happen through continuous unplanned interaction. In adulthood, you have to create artificial recurring proximity.",
        whatHelped: "Joined a weekly Tuesday ceramics class where attendance was mandatory.",
        likes: 42,
      },
      {
        author: "Devon M.",
        role: "Data Analyst",
        time: "4 days ago",
        quote: "I stopped doing 1-on-1 coffee dates with acquaintances and started hosting casual Sunday pancake mornings. Lower stakes, higher warmth.",
        whatHelped: "Hosting recurring low-prep group breakfasts instead of formal dinners.",
        likes: 31,
      },
    ],
  },
  relationships: {
    category: "Relationships",
    perspectivesCount: "27 reflections",
    title: "I have people around me, but I still feel alone sometimes.",
    description: "Exploring the emotional difference between physical company and genuine emotional attunement.",
    reflections: [
      {
        author: "Anonymous",
        role: "Writer",
        time: "5 days ago",
        quote: "Loneliness isn't being by yourself; it's being surrounded by people who only know your curated, performative self.",
        whatHelped: "Started answering 'How are you?' with one honest sentence instead of 'Good!'",
        likes: 56,
      },
      {
        author: "Julian P.",
        role: "Educator",
        time: "1 week ago",
        quote: "Admitting to my closest friend that I felt lonely even when hanging out broke an invisible barrier. She felt the exact same way.",
        whatHelped: "Initiated a conversation about vulnerability during a quiet walk.",
        likes: 35,
      },
    ],
  },
  moving: {
    category: "Moving",
    perspectivesCount: "16 perspectives",
    title: "I moved to a new city and haven't found my people yet.",
    description: "Seattle → Chicago: The 6-to-12 month timeline no one tells you about settling into a new zip code.",
    reflections: [
      {
        author: "Chloe N.",
        role: "Graphic Designer",
        time: "2 days ago",
        quote: "The first 6 months are always the loneliest. Give yourself grace. It takes seeing the same barista and dog park faces 20 times before it clicks.",
        whatHelped: "Became a regular at one local coffee shop on Saturday mornings.",
        likes: 29,
      },
    ],
  },
};

export const dilemmaCardsData: PerspectiveCardData[] = [
  {
    category: "Work & Identity",
    perspectivesCount: "42 experiences",
    title: "Should I leave a job that's making me unhappy?",
    description: "When it pays well enough but slowly drains your weekends, without an immediate next role lined up.",
    tags: ["Burnout", "Career Pivot", "Financial Runway"],
    reflections: [
      {
        author: "Maya S.",
        role: "Brand Strategist, 29",
        time: "3 days ago",
        quote: "Golden handcuffs are real. I realized the extra salary was going toward therapy, convenience food, and retail therapy to cope with the job.",
        whatHelped: "Audited true hourly wage taking into account emotional recovery time.",
        likes: 47,
      },
      {
        author: "Arjun D.",
        role: "Fullstack Dev, 32",
        time: "1 week ago",
        quote: "I set a firm deadline: If nothing improved by Q3, I would resign with or without an offer. Having a date stopped the daily rumination.",
        whatHelped: "Defined a concrete walk-away deadline and saved 5 months of runway.",
        likes: 36,
      },
    ],
  },
  {
    category: "Relocation",
    perspectivesCount: "58 perspectives",
    title: "How do you make close friends after moving?",
    description: "Beyond casual coworkers and surface-level gym chats, how do people find intentional closeness again?",
    tags: ["New City", "Community", "Loneliness"],
    reflections: [
      {
        author: "Rachel L.",
        role: "San Francisco → Denver",
        time: "4 days ago",
        quote: "Saying 'yes' to things I normally wouldn't (like run clubs and volunteer park cleanups) led me to my current core circle.",
        whatHelped: "Committed to 3 community events every single week for 3 months.",
        likes: 52,
      },
    ],
  },
  {
    category: "Milestones",
    perspectivesCount: "91 reflections",
    title: "Am I the only one who feels behind in life?",
    description: "When friends are buying homes or having kids, and you're still pivoting careers and untangling goals.",
    tags: ["Comparison", "Life Timelines", "Self-Worth"],
    reflections: [
      {
        author: "Anonymous",
        role: "Age 31",
        time: "Yesterday",
        quote: "Comparison is the thief of personal clarity. People project their highlight reels, but behind closed doors, everyone is figuring it out as they go.",
        whatHelped: "Muted peer announcements on social media and defined my own 3 core life values.",
        likes: 84,
      },
      {
        author: "Leo G.",
        role: "Founder, 33",
        time: "5 days ago",
        quote: "I started over at 29 after a failed venture. The life I rebuilt is 100x more authentic than the one I had on the 'traditional timeline'.",
        whatHelped: "Realized timelines are artificial societal scripts with zero legal obligation.",
        likes: 67,
      },
    ],
  },
  {
    category: "Decision Making",
    perspectivesCount: "36 approaches",
    title: "How do I know which advice is right for me?",
    description: "Sorting through contradictory podcasts and well-meaning family advice to find what matches your context.",
    tags: ["Information Overload", "Intuition", "Clarity"],
    reflections: [
      {
        author: "Tara V.",
        role: "Journalist",
        time: "1 week ago",
        quote: "Most advice is autobiographical—people tell you what worked for their temperament, privilege, and circumstances, not yours.",
        whatHelped: "Created a filter question: 'Does this person share my values and risk tolerance?'",
        likes: 41,
      },
    ],
  },
];
