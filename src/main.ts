import "./style.css";
import { projects } from "./projects.ts";
import type { Project } from "./projects.ts";

const pageTitle = "Jenny Wei — Portfolio";
const introduction = "Hello, this is my portfolio where I demo some projects~";

const link = (href: string, label: string): HTMLAnchorElement => {
  const url = new URL(href);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Unsupported link: ${href}`);
  }
  const anchor = document.createElement("a");
  anchor.href = url.href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.textContent = label;
  return anchor;
};

const projectCard = (project: Project): HTMLLIElement => {
  if (project.tags.length < 1 || project.tags.length > 4) {
    throw new Error(`${project.name} must have 1 to 4 tags`);
  }

  const item = document.createElement("li");
  item.className = "project";

  const heading = document.createElement("h2");
  heading.textContent = project.name;

  const summary = document.createElement("p");
  summary.textContent = project.summary;

  const tags = document.createElement("ul");
  tags.className = "tags";
  for (const tag of project.tags) {
    const tagItem = document.createElement("li");
    tagItem.textContent = tag;
    tags.append(tagItem);
  }

  const links = document.createElement("div");
  links.className = "links";
  links.append(link(project.github, "GitHub"));
  if (project.demo) links.append(link(project.demo, "Demo"));

  item.append(heading, summary, tags, links);
  return item;
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

const main = document.createElement("main");
main.className = "wrap";

const header = document.createElement("header");
const title = document.createElement("h1");
title.textContent = pageTitle;
const intro = document.createElement("p");
intro.className = "intro";
intro.textContent = introduction;
const profileLinks = document.createElement("div");
profileLinks.className = "links";
profileLinks.append(
  link("https://github.com/Jenny-jw", "GitHub"),
  link("https://www.linkedin.com/in/jenny-wei-38156b192/", "LinkedIn"),
);
header.append(title, intro, profileLinks);

const list = document.createElement("ul");
list.className = "projects";
list.append(...projects.map(projectCard));

main.append(header, list);
app.replaceChildren(main);
document.title = pageTitle;
