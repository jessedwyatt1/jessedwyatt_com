import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { ProjectWithId } from '@/lib/projects/types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

const initialProjects: ProjectWithId[] = [
  {
    id: nanoid(),
    title: "AI Portfolio Chat",
    description: "Personal website featuring an AI-powered chat interface built with Next.js, TypeScript, and local LLM integration. Implements RAG (Retrieval Augmented Generation) for accurate information retrieval from a structured knowledge base. Features dark mode design, responsive UI, and seamless content management through Markdown files.",
    tech: [
      "Next.js",
      "TypeScript",
      "Ollama",
      "Tailwind CSS",
      "RAG",
      "Markdown",
      "Docker"
    ],
    features: [
      "Local LLM integration via Ollama",
      "RAG system for context retrieval",
      "Dark mode optimized interface",
      "Responsive design",
      "Markdown-based knowledge base",
      "Docker containerization"
    ],
    github: "https://github.com/jessedwyatt1/jessedwyatt_com",
    live: "https://jessedwyatt.com",
    isPublic: true,
    showOnPersonalPage: true
  },
  {
    id: nanoid(),
    title: "MealForks.com",
    description: "A vibrant culinary community platform where users can share recipes, create collections, and engage in cooking challenges. Features include recipe forking (creating variations), private/public collections, and a ranking system for user engagement.",
    tech: [
      "Next.js",
      "React",
      "Redux Toolkit",
      "Chakra UI",
      "Formik",
      "Google Analytics",
      "Facebook SDK"
    ],
    features: [
      "Recipe sharing and forking system",
      "User collections and folders",
      "Rating and review system",
      "User progression/ranking system",
      "Responsive design",
      "Social media integration"
    ],
    live: "https://mealforks.com",
    isPublic: false,
    privateReason: "Protected IP and client data",
    showOnPersonalPage: true
  }
];

async function initProjects() {
  try {
    await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
    await fs.writeFile(
      PROJECTS_FILE, 
      JSON.stringify(initialProjects, null, 2)
    );
    console.log('Projects initialized successfully!');
  } catch (error) {
    console.error('Error initializing projects:', error);
  }
}

initProjects(); 