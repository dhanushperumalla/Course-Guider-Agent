# **Course Guider Agent**  
**Author:** [Perumalla Venkata Naga Dhanush](https://www.linkedin.com/in/dhanush-perumalla-917b70266/)

An n8n-powered agent that generates structured, engaging, and research-backed learning roadmaps, prerequisites, and job role mappings for any course. It helps learners, educators, and career advisors by providing tailored guidance to master a course effectively within a specified timeframe.  

---

## **Features**  

- **Dynamic Roadmap Generation:** Breaks down any course into a step-by-step learning roadmap with clear milestones and actionable tasks.  
- **Prerequisites and Tools:** Identifies foundational knowledge, frameworks, and tools required to master the course.  
- **Job Role Mapping:** Maps course content to relevant job roles and industries, reflecting up-to-date market trends.  
- **Customizable Duration:** Adapts the roadmap to fit specified timeframes (e.g., 3 months, 6 months, 1 year).  
- **Engaging and Visual Outputs:** Uses emojis and structured formatting to make content visually appealing and easy to follow.  
- **Platform-Ready Content:** Generates concise, shareable outputs for blogs, social media, or direct learner use.  

---

## **How It Works**  

1. Takes the **course name** and **duration** as input.  
2. Analyzes the course topic and breaks it into key learning modules.  
3. Identifies prerequisites, tools, and frameworks required for the course.  
4. Maps the course content to relevant job roles and industries.  
5. Generates a structured roadmap, prerequisites, and job role suggestions in a clean, engaging format.  

---

## **Example Usage**  

### **Input**  
```json
{
    "course": "Web Development",
    "duration": "6 months"
}
```

### **Example Response**  
```
🚀 Roadmap to Mastering Web Development  
Duration: 6 Months  

---

#### Month 1: Foundations  
🎯 Goal: Learn the basics of web development.  
- 🌐 Introduction to HTML & CSS  
- 🎨 Basic styling and responsive design  
- 🔧 Set up your development environment (VS Code, Git)  
- 🛠️ Build a simple static website  

---

#### Month 2-3: Core Skills Development  
🎯 Goal: Dive into front-end and back-end basics.  
- 🖥️ JavaScript fundamentals (ES6+)  
- ⚛️ Introduction to React.js or Vue.js  
- 🗄️ Basics of Node.js and Express.js  
- 🛠️ Build a basic CRUD application  

---

#### Prerequisites, Frameworks, and Tools  

Prerequisites:  
- 🌐 Basic understanding of how the internet works (HTTP/HTTPS, browsers, servers).  
- 💻 Familiarity with basic programming concepts (variables, loops, conditionals).  

Frameworks/Libraries:  
- ⚛️ Front-end: React.js, Vue.js, or Angular for building dynamic user interfaces.  
- 🗄️ Back-end: Express.js (Node.js), Django (Python), or Ruby on Rails for server-side development.  

Tools:  
- 🔧 Code Editors: VS Code, Sublime Text, or Atom.  
- 🐙 Version Control: Git and GitHub for collaboration and version management.  

---

#### Job Roles for Web Development  

Potential Job Roles:  
🤖 Full Stack Developer  

📊 Front-end Developer  

🏗️ Back-end Developer  

🎨 Web Designer  

🔒 Quality Assurance Engineer  
```

---

## **Usage Notes**  

1. Provide **specific course names** for better results.  
2. Specify the **desired duration** (e.g., 3 months, 6 months, 1 year).  
3. The agent focuses on **up-to-date industry trends** and **best practices**.  
4. Outputs are designed to be **shareable** and **platform-ready**.  

---

## **Credentials Required**  

- **Anthropic API Key:** For generating structured and engaging content.  
- **n8n Workflow Access:** To run and customize the agent.  

---

## **Contributing**  

This agent is part of the oTTomator agents collection. For contributions or issues, please refer to the main repository guidelines.


---
