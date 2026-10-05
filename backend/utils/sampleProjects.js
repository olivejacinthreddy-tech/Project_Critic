export const sampleProjects = [
  {
    id: 'sample-smart-campus',
    title: 'AI-Based Smart Campus Assistant',
    idea: 'An intelligent AI-powered campus assistant web and mobile platform that helps university students navigate campus facilities, query real-time lecture timetables, find vacant study rooms via sensor integration, submit academic queries using a customized Retrieval-Augmented Generation (RAG) campus knowledge base, and receive personalized reminders for assignments and campus events.',
    description: 'A comprehensive campus assistant integrating institutional data (courses, maps, schedules) with an AI conversational agent. Solves fragmented student information portals by centralizing routine campus tasks and queries into a single conversational interface.',
    targetUsers: 'Undergraduate and postgraduate students, visiting guests, campus faculty, and department administrators.',
    problemStatement: 'Students waste time checking multiple disjointed departmental websites, bulletin boards, and PDFs for lecture hall changes, room availability, and syllabus queries. Staff are overwhelmed by repetitive informational questions.',
    preferredTech: 'React, Node.js, Express, MongoDB, Gemini API / LangChain, Pinecone Vector DB, Tailwind CSS / Vanilla CSS',
    projectType: 'Web Application',
    timeline: '4–6 weeks',
    teamSize: '3 students',
    skillLevel: 'Intermediate',
    budget: '$50 - $100 for API & hosting',
    isSample: true
  },
  {
    id: 'sample-medichain',
    title: 'Secure Health Records Portal with AI Symptom Pre-Screener',
    idea: 'A role-based medical health portal where patients own and share their encrypted clinical records with healthcare providers, combined with an AI-driven preliminary symptom checker that suggests relevant specialist departments without making direct medical diagnoses.',
    description: 'Addresses patient data fragmentation between clinics while offering an intelligent preliminary triage tool that guides patients to appropriate departments before booking appointments.',
    targetUsers: 'Patients with chronic conditions, outpatient clinics, and private medical practitioners.',
    problemStatement: 'Medical history is siloed in legacy clinic databases, leading to redundant diagnostic tests. Patients frequently self-misdiagnose or schedule appointments with the wrong medical specialty.',
    preferredTech: 'Next.js / React, Node.js, PostgreSQL / MongoDB, Gemini API, Web Crypto API',
    projectType: 'Web Application',
    timeline: '6–8 weeks',
    teamSize: '2 students',
    skillLevel: 'Advanced',
    budget: '$100',
    isSample: true
  },
  {
    id: 'sample-ecotrack-iot',
    title: 'EcoSort: Edge-AI Automated Waste Segregation Bin',
    idea: 'An automated IoT smart dustbin equipped with a camera and Raspberry Pi running a lightweight computer vision model to detect whether discarded items are recyclable plastic, paper, organic, or electronic waste, and automatically rotates a mechanical compartment flap.',
    description: 'Solves municipal waste contamination at the point of disposal using embedded computer vision and cloud telemetry dashboard for sanitation monitoring.',
    targetUsers: 'University cafeterias, public shopping malls, and municipal waste management teams.',
    problemStatement: 'Manual waste segregation suffers from high human error, contaminating recycling batches and increasing landfill burden.',
    preferredTech: 'Python, OpenCV, TensorFlow Lite, Raspberry Pi, Node.js, MongoDB, React',
    projectType: 'IoT',
    timeline: '8–10 weeks',
    teamSize: '4 students',
    skillLevel: 'Intermediate',
    budget: '$150',
    isSample: true
  }
];
