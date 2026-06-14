
/**
 * Universal Fallback Roadmaps
 * These are research-backed, standardized paths that serve as high-fidelity fallbacks
 * when API quotas are met or for instant loading of primary predicted careers.
 */

export const UNIVERSAL_ROADMAPS: Record<string, any> = {
  "AI Research Scientist": {
    careerTitle: "AI Research Scientist",
    overview: "A masterclass in neural architectures and stochastic optimization.",
    phases: [
      {
        title: "Mathematical Foundations",
        milestones: [
          "Master Linear Algebra & Multi-variable Calculus",
          "Advanced Probability Theory & Bayesian Statistics",
          "Optimization Algorithms (Gradient Descent, Newton Methods)"
        ]
      },
      {
        title: "Neural Architectures",
        milestones: [
          "Implement CNNs and RNNs from first principles",
          "Deep Dive: Transformers and Attention Mechanisms",
          "GANs and Variational Autoencoders (VAEs)"
        ]
      }
    ]
  },
  "Sustainable Urban Planner": {
    careerTitle: "Sustainable Urban Planner",
    overview: "Architecting the resilient, green cities of the 21st century.",
    phases: [
      {
        title: "Eco-Systems & GIS",
        milestones: [
          "GIS Spatial Analysis Certification",
          "Urban Ecology Fundamentals",
          "Renewable Energy Integration in Grid Design"
        ]
      },
      {
        title: "Policy & Design",
        milestones: [
          "Circular Economy Frameworks for Cities",
          "Social Equity in Urban Transport",
          "Resilient Infrastructure Engineering"
        ]
      }
    ]
  },
  "Ethical Hacker / Cyber Security": {
    careerTitle: "Ethical Hacker",
    overview: "Deep-layer security analysis and defensive architecture.",
    phases: [
      {
        title: "Network Intrusion",
        milestones: [
          "TCP/IP Stack Manipulation",
          "Cryptographic Protocols Analysis",
          "Advanced Penetration Testing Frameworks"
        ]
      },
      {
        title: "Defensive Engineering",
        milestones: [
          "Zero-Trust Architecture Implementation",
          "Cloud Security Hardening (AWS/GCP)",
          "Automated Threat Hunting with AI"
        ]
      }
    ]
  },
  "Data Architect": {
    careerTitle: "Data Architect",
    overview: "Designing the backbone of massive-scale information systems.",
    phases: [
      {
        title: "Distributed Systems",
        milestones: [
          "CAP Theorem & Consistency Models",
          "NoSQL vs SQL Architecture Patterns",
          "Data Lakehouse Implementation (Delta Lake/Iceberg)"
        ]
      },
      {
        title: "Pipeline Engineering",
        milestones: [
          "Real-time Streaming with Kafka/Flink",
          "ETL/ELT Optimization at Scale",
          "Data Governance and Lineage Frameworks"
        ]
      }
    ]
  },
  "Data Analyst": {
    careerTitle: "Data Analyst",
    overview: "Extracting insights from complex datasets to drive business decisions.",
    phases: [
      {
        title: "Foundations of Quantitative Analysis",
        description: "Establish solid ground of querying structures and statistical concepts necessary to organize unstructured datasets cleanly.",
        milestones: [
          "Master SQL queries (SELECT, JOIN, GROUP BY, CTEs, Window Functions)",
          "Foundations of Descriptive Statistics (Mean, Median, Mode, Variance, Standard Deviation)",
          "Excellence in Spreadsheet Modeling & Pivot Tables (Excel/Google Sheets)",
          "Understanding Relational Database Management Systems (RDBMS)"
        ],
        resources: [
          "SQL for Data Analysis Guide",
          "Khan Academy Descriptive Statistics Course",
          "Advanced Excel for Analytics Bootcamp"
        ]
      },
      {
        title: "Scientific Scripting & EDA (Python/R)",
        description: "Transition from GUI-based analysis to programmatic scripting to unlock complex filtering pipelines and custom calculations.",
        milestones: [
          "Learn Python syntax and data structures (Lists, Dicts, Tuples)",
          "Master Pandas & NumPy libraries for data manipulation and alignment",
          "Perform Exploratory Data Analysis (EDA) to find correlations and outliers",
          "Implement visual plots using Seaborn and Matplotlib"
        ],
        resources: [
          "Kaggle Pandas Tutorials",
          "Exploratory Data Analysis Cookbook",
          "Python for Data Analysis by Wes McKinney"
        ]
      },
      {
        title: "Business Intelligence & Interactive Dashboards",
        description: "Translate complex numeric indexes into intuitive, business-aligned visual representations that drive strategic decisions.",
        milestones: [
          "Design executive-ready interactive dashboards in Tableau or Power BI",
          "Learn dimensional modeling (Stars, Snowflakes schemas)",
          "Define key product KPIs (Retention Rate, CLV, Funnel Conversions)",
          "Implement storytelling with data (Context, Clutter reduction, Visual hierarchy)"
        ],
        resources: [
          "Storytelling with Data by Cole Nussbaumer Knaflic",
          "Tableau Public Dashboard Gallery and Challenges",
          "Microsoft Power BI Data Analyst Certification Path"
        ]
      },
      {
        title: "Statistical Testing & Predictive Modeling",
        description: "Move from historical description to proactive hypothesis validation and trend projection using scientific statistical bounds.",
        milestones: [
          "Formulate Null and Alternative Hypotheses for Business Trials",
          "Run A/B Testing, T-Tests, Chi-Square Tests with statistical safety confidence",
          "Build simple Supervised Regression models (Linear, Logistic)",
          "Identify Multicollinearity, Overfitting, and Bias in predictions"
        ],
        resources: [
          "Hypothesis Testing in Python Practical Walkthrough",
          "Introduction to Statistical Learning (ISLR)",
          "StatQuest with Josh Starmer Regression YouTube Hub"
        ]
      },
      {
        title: "Data Storytelling & Strategic Synthesis",
        description: "Elevate your technical proficiency to high-impact strategic influence, bridging cold numbers with critical human operations.",
        milestones: [
          "Synthesize structured analyst reports into concise executive decks",
          "Present data insights live to cross-functional stakeholders",
          "Engage in data governance, security, and ethical considerations",
          "Establish continuous modern-stack automation using SQL agents or Airflow"
        ],
        resources: [
          "Strategic Communication for Technologists Manual",
          "Data Governance for Modern Lakehouses Guideline",
          "Automating Analytics Workflows with Python Cron and Airflow"
        ]
      }
    ]
  },
  "Surgical Neuro-Specialist": {
    careerTitle: "Surgical Neuro-Specialist",
    overview: "Mastery of high-precision biological systems and cognitive hardware.",
    phases: [
      {
        title: "Micro-Surgical Foundations",
        milestones: [
          "Neuro-Anatomical Mapping Proficiency",
          "Robotic Surgical Interface Certification",
          "Neural Pathway Decoupling Techniques"
        ]
      },
      {
        title: "Experimental Interventions",
        milestones: [
          "Brain-Machine Interface Immersive Training",
          "Real-time Neuro-Monitoring Protocols",
          "Regenerative Neural Grafting Research"
        ]
      }
    ]
  },
  "Cinematic Narrative Designer": {
    careerTitle: "Cinematic Narrative Designer",
    overview: "Sculpting immersive worlds through narrative resonance and spatial logic.",
    phases: [
      {
        title: "World Architecture",
        milestones: [
          "Environmental Storytelling Frameworks",
          "Non-Linear Narrative Branching Logic",
          "Emotional Arc Mapping for Immersive Sets"
        ]
      },
      {
        title: "Synthesis & Resonance",
        milestones: [
          "Sensory Feedback Integration (Visual/Auditory)",
          "Crowd-Psychology Driven Pacing",
          "Global Mythic Structure Application"
        ]
      }
    ]
  },
  "Corporate Legal Counsel": {
    careerTitle: "Corporate Legal Counsel",
    overview: "Expert navigation of regulatory systems and strategic risk mitigation.",
    phases: [
      {
        title: "Systemic Compliance",
        milestones: [
          "Multi-Jurisdictional Regulatory Analysis",
          "Contractual Logic & Semantic Precision",
          "M&A Structural Optimization"
        ]
      },
      {
        title: "Protective Strategy",
        milestones: [
          "Intellectual Property Weaponization/Defense",
          "Crisis Mitigation & Liability Modeling",
          "Shareholder Value Ethics Negotiation"
        ]
      }
    ]
  }
};
