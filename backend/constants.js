const DOMAINS_LIST = [
  "Web Development",
  "Mobile Apps",
  "AI/ML",
  "UI/UX Design",
  "Data Science",
  "IOT",
  "Other",
];

// Common & Basic Skills (used in multiple domains)
const COMMON_SKILLS = [
  "Git",
  "GitHub",
  "Python",
  "Java",
  "SQL",
  "JavaScript",
  "HTML",
  "CSS",
];

// Web Development
const WEB_DEV_SKILLS = [
  "React.js",
  "Vue.js",
  "Angular",
  "Next.js",
  "Node.js",
  "Express.js",
  "PHP",
  "MongoDB",
  "Django",
  "Flask",
  "Spring Boot",
  "Tailwind CSS",
  "Bootstrap",
];

// Mobile Apps
const MOBILE_APP_SKILLS = [
  "React Native",
  "Flutter",
  "Kotlin",
  "Swift",
  "C#",
  "Firebase",
];

// AI/ML
const AI_ML_SKILLS = ["TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas"];

// UI/UX Design
const UI_UX_SKILLS = ["Figma", "Adobe XD", "Tailwind CSS", "Bootstrap"];

//Data Science
const DATA_SCIENCE_SKILLS = [
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter Notebook",
];

// IoT
const IOT_SKILLS = ["C", "C++", "MQTT", "Arduino", "Raspberry Pi"];

const SKILLS_LIST = [
  ...COMMON_SKILLS,
  ...WEB_DEV_SKILLS,
  ...MOBILE_APP_SKILLS,
  ...AI_ML_SKILLS,
  ...UI_UX_SKILLS,
  ...DATA_SCIENCE_SKILLS,
  ...IOT_SKILLS,
];

module.exports = {
  DOMAINS_LIST,
  COMMON_SKILLS,
  WEB_DEV_SKILLS,
  MOBILE_APP_SKILLS,
  AI_ML_SKILLS,
  UI_UX_SKILLS,
  DATA_SCIENCE_SKILLS,
  IOT_SKILLS,
  SKILLS_LIST,
};
