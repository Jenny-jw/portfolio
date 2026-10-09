export type Project = {
  name: string;
  summary: string;
  tags: string[];
  github: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    name: "Tako's Note",
    summary:
      "Personal blog for notes on life, travel, and books. Comments are reviewed before they appear.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    github: "https://github.com/Jenny-jw/mern-blog",
    demo: "http://takosnote.onrender.com/",
  },
  {
    name: "Asset Manager (ERP)",
    summary: "Asset dashboard and list, with access control for three roles",
    tags: ["TypeScript", "Python"],
    github: "https://github.com/Jenny-jw/assetManager",
  },
  {
    name: "AI Image Classifier",
    summary: "Classifies an uploaded image with pretrained MobileNetV2",
    tags: ["React", "FastAPI", "PyTorch", "MobileNetV2"],
    github: "https://github.com/Jenny-jw/AI-image-classifier",
  },
  {
    name: "Questionnaire",
    summary:
      "Five question types. Admins manage forms with JWT. Invite links expire after seven days.",
    tags: ["TypeScript", "JWT"],
    github: "https://github.com/Jenny-jw/questionnaire",
  },
  {
    name: "Shorten URL",
    summary:
      "Turns a long URL into a short link that redirects to the original address",
    tags: ["Node.js", "Express", "MongoDB", "TypeScript"],
    github: "https://github.com/Jenny-jw/shortenUrl",
  },
];
