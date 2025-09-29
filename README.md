# TaskForceAI

A generative AI-powered healthcare copilot built at HackGT!

---

## 🚑 Problem Statement

Healthcare professionals are drowning in EMR screens, insurance confusion, and notification overload. Critical insights and evidence get buried, workflows get messy, and burnout is real. Providers need *clarity, context, and more time for patients*—not just more data.

---

## 🌟 Solution Overview

TaskForceAI is an ecosystem of 7 intelligent, orchestrated AI agents that deliver clinical, cost, and research context—auto-magically and on demand.  
Built with:
- **Impiricus** (clinical + billing brain)
- **CedarOS** (agentic, modern interface)
- **Mastra/Ergo** (agent orchestration engine)

---

## 🧠 Agent Functionalities (What Each Agent Does)

| Agent Name             | Functionality |
|------------------------|---------------------------------------------------------------------------------------|
| **Questionnaire Agent**| Collects patient intake, pre-visit data, preferences |
| **EMR Agent**          | Parses and summarizes full patient EMR: demographics, history, diagnoses, allergies, meds, labs, health trends |
| **Payer Agent**        | Retrieves payer, coverage, cost estimate, prior-auth status, real-time billing clarity |
| **Notifier Agent**     | Surfaces only the most critical alerts, fighting alert fatigue |
| **Evidence Agent**     | Finds and summarizes the latest clinical studies and guidance for any given scenario |
| **SummaryGen Agent**   | Auto-creates complete visit/clinical briefings with EMR, payer, evidence, and trends when appointments are booked |
| **StarterAgent**       | Main orchestrator—routes user queries, triggers agent workflows, and answers on demand |

---

## 📑 Data & Mock Integration

We integrated and showcased **2500 test patients** with real clinical structure from Mocarro & Kaggle:
- Preprocessed in Python: handled missing (NAN) values, normalized fields
- Key fields used:  
  - `patient_id, age, gender, specialty, chief_complaint, symptoms, diagnoses, medications, lab_results, allergies, insurance details, intake preferences`
- This rich dataset allows instant agent demo for:
  - EMR chart review
  - Insurance/cost workflow
  - Real-time evidence
  - Longitudinal (multi-visit) tracking

---

## 🛠️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/JoshithReddyAleti/HackGT_2025.git
cd HackGT_2025
```

### 2. Install pnpm globally (if needed)
```bash
npm install -g pnpm
```

### 3. Install dependencies

#### Frontend
```bash
cd src/app
pnpm install
```

#### Backend
```bash
cd ../../src/backend
pnpm install
```

### 4. Configure Environment Variables
- Go to the project root
- Create a `.env` file and add your OpenAI/Mastra API key:
```env
OPENAI_API_KEY=your_real_api_key_here
```

### 5. Learn by example
**Highly recommended:** Before diving in, please review:
- **CEDAR_CHAT_ENHANCEMENTS.md**
- **Cedar-OS + Mastra Starter Template.md**
- **CLINICAL_COPILOT_IMPLEMENTATION.md**

These documents explain advanced agent orchestration, UI/UX enhancements, and system implementation details.

---

## ▶️ How to Run the Project

- Start both backend and frontend
- Open your browser to `http://localhost:3000`
- Open your browser to `http://localhost:4111/agents` to see backend agents
- Enjoy interactive, agentic healthcare dashboards with all features live

---

## 💡 Sample Prompts for Demo

Copy into the chat or dashboard to see all agents in action!

- **Relevant Literature & Studies**  
  `Find and summarize the most recent studies related to [patient complaint: chest pain]. Include PubMed IDs.`

- **EMR Case Reports**  
  `Search EMR records for similar patient case reports matching [diabetes + hypertension]. Summarize outcomes.`

- **Drug / Treatment Relevance**  
  `Check if [drug: Metformin XR] is relevant to Dr. Smith’s prescribing history. Return supporting rationale.`

- **Health Trends (Highlighted Section in Screenshot)**  
  `Analyze patient EMR. Highlight recurring health trends and conditions that should be addressed in today’s visit.`

- **Commercial Potential**  
  `Simulate insurer + provider workflow for verifying cost estimation of [treatment: knee replacement] across major payers. Output comparison in table.`  
  - Accept / Reject / Edit feature supported

---

## ✨ Features

- EMR chart lookup and summary for any test patient (from 2,500 real records)
- Insurance/cost analysis and comparison workflows
- Real-time evidence/research matching
- Visit summary & health trend highlights
- Modular agent orchestration and smart notifications
- Adaptive learning, accepts user corrections or edits

---

## 🔔 Necessity of TaskForceAI

Healthcare's data overload, alert fatigue, and complex cost/coverage issues demand more than just more software—they require real-time, adaptive agentic intelligence. TaskForceAI unifies EMR, billing, evidence, notifications, and workflow orchestration at the clinician interface, unlocking faster, safer, smarter medicine for providers and patients alike.

---

## 📞 Support / Issues

Open an issue here, or reach out directly on LinkedIn!  
Joshith Reddy Aleti : [LinkedIn Profile](https://www.linkedin.com/in/joshith-reddy-aleti/)

---

Let's bring sanity, clarity, and joy back to healthcare—one agentic copilot at a time.
