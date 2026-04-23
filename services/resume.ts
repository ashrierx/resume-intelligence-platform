import type {
  JobDescriptionData,
  ResumeData,
  TailoredResume,
} from "../types/resume";

const SECTION_ALIASES: Record<string, string[]> = {
  summary: ["summary", "profile", "about"],
  experience: ["experience", "work experience", "employment", "professional experience"],
  education: ["education", "academic background"],
  skills: ["skills", "technical skills", "core skills"],
};

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function splitLines(value: string) {
  return normalizeText(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function findSection(lines: string[], aliases: string[]) {
  const headerIndex = lines.findIndex((line) => {
    const lowered = line.toLowerCase().replace(/[:\-]/g, "");
    return aliases.some((alias) => lowered === alias || lowered.startsWith(`${alias} `));
  });

  if (headerIndex === -1) {
    return [] as string[];
  }

  const nextHeaderIndex = lines.findIndex((line, index) => {
    if (index <= headerIndex) {
      return false;
    }

    const lowered = line.toLowerCase().replace(/[:\-]/g, "");
    return Object.values(SECTION_ALIASES).some((sectionAliases) =>
      sectionAliases.some((alias) => lowered === alias || lowered.startsWith(`${alias} `)),
    );
  });

  return lines.slice(headerIndex + 1, nextHeaderIndex === -1 ? undefined : nextHeaderIndex);
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function extractPhone(text: string) {
  return (
    text.match(/(?:\+?\d{1,2}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)?.[0] ?? ""
  );
}

function extractSkills(lines: string[]) {
  const sectionLines = findSection(lines, SECTION_ALIASES.skills);
  const skills = sectionLines
    .flatMap((line) => line.split(/[,•|]/g))
    .map((skill) => skill.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return Array.from(new Set(skills));
}

function extractSimpleExperience(lines: string[]) {
  const sectionLines = findSection(lines, SECTION_ALIASES.experience);
  const entries: ResumeData["experience"] = [];

  for (let index = 0; index < sectionLines.length; index += 1) {
    const line = sectionLines[index];
    if (!line || /^[-•*]/.test(line)) {
      continue;
    }

    const [company = "", title = ""] = line.split(/[-|,]/).map((part) => part.trim());
    const description = sectionLines[index + 1]?.startsWith("-") ? sectionLines[index + 1].replace(/^[-*]\s*/, "") : "";

    entries.push({
      company: company || "Unknown Company",
      title: title || "Unknown Title",
      startDate: "",
      endDate: "",
      description,
    });

    if (entries.length === 3) {
      break;
    }
  }

  return entries;
}

function extractSimpleEducation(lines: string[]) {
  const sectionLines = findSection(lines, SECTION_ALIASES.education);
  return sectionLines.slice(0, 3).map((line) => ({
    institution: line,
    degree: "",
    startDate: "",
    endDate: "",
  }));
}

function inferName(lines: string[], fallbackLabel: string) {
  const firstLine = lines[0] ?? fallbackLabel;
  const cleaned = firstLine.replace(/\.(pdf|docx?|txt)$/i, "").replace(/[-_]+/g, " ");
  return toTitleCase(collapseWhitespace(cleaned || fallbackLabel));
}

export function extractResumeData(sourceText: string): ResumeData {
  const lines = splitLines(sourceText);

  return {
    name: inferName(lines, "Resume"),
    email: extractEmail(sourceText),
    phone: extractPhone(sourceText),
    summary: findSection(lines, SECTION_ALIASES.summary).join(" "),
    experience: extractSimpleExperience(lines),
    education: extractSimpleEducation(lines),
    skills: extractSkills(lines),
  };
}

export function parseJobDescription(jobText: string): JobDescriptionData {
  const lines = splitLines(jobText);
  const text = normalizeText(jobText);
  const keywords = Array.from(
    new Set(
      text
        .toLowerCase()
        .match(/\b[a-z][a-z0-9+.-]{2,}\b/g)
        ?.filter((word) => word.length > 3) ?? [],
    ),
  ).slice(0, 20);

  return {
    title: lines[0] ?? "Untitled Role",
    company: "",
    description: text,
    requirements: lines.filter((line) => /require|must|need|qualif/i.test(line)),
    responsibilities: lines.filter((line) => /responsib|will|own|manage/i.test(line)),
    keywords,
  };
}

export function tailorResumeToJob(
  resumeData: ResumeData,
  jobData: JobDescriptionData,
): TailoredResume {
  const matchedSkills = resumeData.skills.filter((skill) =>
    jobData.keywords.some((keyword) => keyword.includes(skill.toLowerCase()) || skill.toLowerCase().includes(keyword)),
  );

  return {
    ...resumeData,
    summary: resumeData.summary || `Tailored for ${jobData.title}`,
    skills: matchedSkills.length > 0 ? matchedSkills : resumeData.skills,
    jobTitle: jobData.title,
    companyName: jobData.company,
  };
}

