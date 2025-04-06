# Course Guider Agent 🤖

An intelligent AI-powered agent that provides personalized guidance on technology trends and learning paths for aspiring developers.

## 🚀 Installation & Setup

### Prerequisites
- Node.js and npm installed
- Supabase account
- N8N account/self-hosted instance
- Required API keys

### 1. Clone the Repository
```bash
git clone <repository-url>
cd course-guider-agent
```

### 2. N8N Workflow Setup
1. Visit your N8N instance/website
2. Import the `course_guider_agent.json` workflow file
3. Configure the required credentials in N8N
4. Test the workflow to ensure proper functionality

### 3. Database Setup (Supabase)
Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable the pgcrypto extension for UUID generation
-- Note: If you're using Supabase, the pgcrypto extension is already enabled by default.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create messages table
CREATE TABLE messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file and add your API keys and endpoints:
   ```
   VITE_API_ENDPOINT=your_api_endpoint
   VITE_OTHER_REQUIRED_KEYS=your_keys
   VITE_N8N_END_POINT=your_n8n_endpoint
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌟 Features

### 1. Tech Trend Analysis
- Real-time updates on trending technology news
- Focus on emerging technologies and breakthroughs
- Coverage of key sectors like AI, quantum computing, cybersecurity, and more

### 2. Learning Path Generation
- Customized learning roadmaps for different tech domains
- Detailed breakdown of skills and resources needed
- Time-based progression tracking
- Comprehensive curriculum planning

### 3. Career Guidance
- Industry-specific job role recommendations
- Skills mapping to career opportunities
- Industry trends and market analysis

## 🚀 Example Capabilities

1. **Tech Trends Reporting**
   - Provides detailed analysis of tech trends in 2025
   - Covers various domains including:
     - Quantum Computing
     - AI-Powered Cybersecurity
     - 5G/6G Technologies
     - Sustainable Tech
     - Extended Reality (XR)
     - Blockchain and Web3
     - Autonomous Systems
     - Biometric Security

2. **Web Development Learning Path**
   - Comprehensive 2-year roadmap
   - Structured learning phases:
     - Front-End Basics
     - JavaScript & Frameworks
     - Back-End Development
     - Full-Stack Integration
     - Advanced Topics
     - Specialization
   - Project-based learning approach
   - Industry-standard tools and technologies

3. **Career Development**
   - Job role recommendations
   - Industry-specific guidance
   - Technology stack suggestions
   - Market trend analysis

## 💡 How to Use

1. **Ask About Tech Trends**
   ```
   "What are the trending news about tech in 2025?"
   ```

2. **Request Learning Guidance**
   ```
   "Guide me to master Web-Dev in 2025"
   ```

3. **Explore Career Paths**
   ```
   "Show thinking process for web development careers"
   ```

## 🧠 AI Models & Infrastructure

### AI Platform
- **GROQ Platform**: Utilized for high-performance AI inference
- **Model**: DeepSeek-1 for advanced thinking and reasoning capabilities
- **Benefits**:
  - Ultra-fast response times
  - High-quality reasoning
  - Efficient resource utilization
  - Scalable infrastructure

## 🛠️ Technical Stack

- Natural Language Processing via DeepSeek-1
- GROQ Platform for AI inference
- Real-time Data Analysis
- Customized Response Generation
- Interactive Learning Paths
- Career Mapping Algorithms

## 📈 Benefits

- Stay updated with latest tech trends
- Get personalized learning paths
- Understand career opportunities
- Access curated resources
- Track learning progress
- Make informed career decisions

## 🎯 Target Audience

- Aspiring Developers
- Tech Professionals
- Career Changers
- Students
- Tech Enthusiasts
- Learning Path Seekers

## 📝 Note

This agent is continuously updated with the latest information and trends in the technology sector. The responses are AI-generated and should be used as guidance alongside other learning resources.

## 🤝 Contributing

Feel free to contribute to this project by:
1. Suggesting new features
2. Reporting issues
3. Improving documentation
4. Adding new learning resources


---

Built with ❤️ for the tech community 