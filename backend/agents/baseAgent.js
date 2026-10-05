export class BaseAgent {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  formatProjectPrompt(projectData) {
    return `
Project Idea: ${projectData.idea || 'N/A'}
Project Title: ${projectData.title || 'Untitled Project'}
Description: ${projectData.description || 'N/A'}
Target Users: ${projectData.targetUsers || 'N/A'}
Main Problem Being Solved: ${projectData.problemStatement || 'N/A'}
Preferred Technologies: ${projectData.preferredTech || 'None specified'}
Project Type: ${projectData.projectType || 'Web Application'}
Available Development Time: ${projectData.timeline || 'Not specified'}
Team Size: ${projectData.teamSize || '1'}
Skill Level: ${projectData.skillLevel || 'Intermediate'}
Approximate Budget: ${projectData.budget || 'Minimal / Student tier'}
    `.trim();
  }
}
