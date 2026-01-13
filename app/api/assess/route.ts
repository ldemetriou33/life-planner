// app/api/assess/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// 1. SETUP GEMINI (Will be null if no key is found)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

// 2. DEFINE THE OUTPUT SCHEMA (For Real AI)
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    singularity_score: { type: SchemaType.NUMBER },
    human_moat: { type: SchemaType.STRING, enum: ["High", "Medium", "Low"] },
    saturation_year: { type: SchemaType.NUMBER },
    verdict: { type: SchemaType.STRING },
    timeline_context: { type: SchemaType.STRING },
    pivot_strategy: { type: SchemaType.STRING },
  },
  required: ["singularity_score", "human_moat", "saturation_year", "verdict", "pivot_strategy"],
};

export async function POST(req: Request) {
  try {
    const { email, university, major } = await req.json();

    // Store email (log for now, can be extended to database/file storage)
    if (email) {
      console.log('User email:', email)
      console.log('Assessment request:', { email, university, major, timestamp: new Date().toISOString() })
      // TODO: Store email in database or file system for future use
    }

    // ---------------------------------------------------------
    // STRATEGY A: REAL AI (GOOGLE GEMINI)
    // ---------------------------------------------------------
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });

        const prompt = `
        Analyze this career path for the Singularity Era (2025-2035) based on BOTH the university AND major.
        
        University: ${university}
        Major: ${major}
        
        IMPORTANT: Consider BOTH factors:
        - University prestige/reputation affects networking, opportunities, and career trajectory
        - Major/degree determines the core skill set and AI vulnerability
        
        Scoring Rules (base scores, adjust ±5 based on university prestige):
        - "Business/Management" -> Base Score ~65-75. Obsolescence: ~2032. Moat: Medium.
        - "CS/Coding/Data" -> Base Score ~40-60. Obsolescence: ~2029. Moat: Low.
        - "Nursing/Trades/Health" -> Base Score ~90+. Obsolescence: 2045+. Moat: High.
        - Top-tier universities (Ivy League, Oxbridge, etc.) add +3-5 to score
        - Lower-tier universities subtract -2-3 from score
        
        Output valid JSON with singularity_score (0-100), human_moat ("High"/"Medium"/"Low"), saturation_year (2026-2045), verdict (string), timeline_context (string), and pivot_strategy (string).
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);
        
        // Return Real Data
        return NextResponse.json(data);
      } catch (geminiError) {
        console.warn("Gemini Failed (Falling back to offline):", geminiError);
        // Fall through to offline logic below...
      }
    }

    // ---------------------------------------------------------
    // STRATEGY B: OFFLINE BRAIN (6-PHASE EXTINCTION ENGINE)
    // ---------------------------------------------------------
    
    const input = major.toLowerCase();
    
    // ---------------------------------------------------------
    // THE 30-YEAR OBSOLESCENCE ROADMAP (2026-2056)
    // ---------------------------------------------------------
    
    let data;

    // PHASE 1: THE LAPTOP PURGE (2026–2029)
    // CS, Data, Digital Art, Translation, Basic Finance, Marketing
    if (input.match(/comput|softwar|code|data|analy|account|financ|translat|writ|journal|copy|graphic|digit|market/)) {
      data = {
        singularity_score: 15, // CRITICAL
        human_moat: "Low",
        saturation_year: 2028,
        verdict: "The Laptop Purge",
        timeline_context: "If your job happens entirely on a screen, it is already dead. AI Agents (GPT-6 class) will handle 95% of digital workflows by 2028.",
        pivot_strategy: "Abandon 'generation' tasks. Pivot to 'Orchestration' (Managing AI fleets) or 'Physical Interface' (Hardware/Bio-tech). If you stay purely digital, you are obsolete.",
        upskillingRoadmap: [
          "AI Orchestration & Fleet Management",
          "Hardware/Embedded Systems Development",
          "Human-AI Collaboration Protocols",
          "Physical Interface Design",
          "Bio-tech Integration Skills"
        ],
        humanMoatTriggers: [
          "Physical hardware interaction",
          "Real-time decision making in unpredictable environments",
          "Human relationship management",
          "Creative problem-solving requiring intuition"
        ],
        recommendedTools: [
          { name: "AI Fleet Management Platforms", description: "Learn to command, not code" },
          { name: "Embedded Systems Development", description: "Bridge digital and physical worlds" },
          { name: "Human-AI Collaboration Frameworks", description: "Become the human in the loop" }
        ]
      };
    }

    // PHASE 2: THE MIDDLEMAN MASSACRE (2029–2032)
    // Business, Management, HR, Logistics, Supply Chain, Admin, Law (Corporate)
    else if (input.match(/busi|manag|hr|human resource|logistic|supply chain|admin|law/)) {
      data = {
        singularity_score: 45, // DANGER
        human_moat: "Medium",
        saturation_year: 2031,
        verdict: "The Middleman Massacre",
        timeline_context: "Coordination is a math problem. Autonomous AI Agents will replace middle-management, scheduling, and logistics. Agency is the only skill left.",
        pivot_strategy: "You must become a 'Principal' (Decision Maker) or a 'Face' (Client Relater). The 'Process' work is dead. Use your University Network to skip entry-level admin roles.",
        upskillingRoadmap: [
          "Strategic Decision-Making Frameworks",
          "High-Stakes Negotiation Skills",
          "Client Relationship Management",
          "Executive Leadership Training",
          "AI Orchestration for Business"
        ],
        humanMoatTriggers: [
          "High-stakes decision making under uncertainty",
          "Complex multi-party negotiations",
          "Building trust and long-term relationships",
          "Strategic vision and judgment calls"
        ],
        recommendedTools: [
          { name: "Strategic Decision Support Systems", description: "Augment, don't replace judgment" },
          { name: "Relationship Management Platforms", description: "Leverage human connection" },
          { name: "AI Orchestration Tools", description: "Command AI agents, don't compete" }
        ]
      };
    }

    // PHASE 3: THE EXPERT ECLIPSE (2032–2035)
    // Matches: General Medicine, Pharmacy, Law, Radiology, Anesthesiology, Pathology
    else if (input.match(/medicin|pharm|radio|anesthes|anaesthes|pathol|law|legal|engin/)) {
      
      // Sub-logic for Anesthesiology specific verdict
      const isAnesthes = input.match(/anesthes|anaesthes/);
      
      if (isAnesthes) {
        // Detailed Anesthesiology premium data
        data = {
          singularity_score: 55, // Caution (High liability, but high automation)
          human_moat: "Medium",
          saturation_year: 2034,
          verdict: "The Autopilot Paradox",
          timeline_context: "Anesthesiology is 90% data monitoring and 10% physical intervention. 'Closed-Loop' AI systems will automate the monitoring loop by 2034, reducing the need for humans to 1 per 5 operating rooms (Supervisory Role).",
          pivot_strategy: "Don't just be the monitor. Focus on 'Critical Care Medicine' or 'Pain Management'—areas requiring complex human judgment and physical intervention that algorithms can't touch.",
          upskillingRoadmap: [
            "Critical Care Medicine Certification",
            "Pain Management Specialization",
            "Emergency Response Protocols",
            "Human-AI Collaboration in Surgery",
            "Complex Multi-System Patient Management"
          ],
          humanMoatTriggers: [
            "Complex multi-system patient management requiring simultaneous monitoring of cardiovascular, respiratory, and neurological systems",
            "High-stakes decision making under uncertainty when AI systems detect anomalies",
            "Physical intervention during complications (airway management, emergency procedures)",
            "Emotional support for patients and families during high-risk procedures",
            "Judgment calls when AI recommendations conflict with clinical intuition"
          ],
          recommendedTools: [
            { name: "AI-Assisted Monitoring Systems", description: "Learn to supervise, not replace. Master the human oversight role" },
            { name: "Advanced Life Support Protocols", description: "Physical skills AI cannot replicate—emergency airway management, rapid response" },
            { name: "Critical Care Decision Support", description: "Augment judgment with AI, but maintain final authority" }
          ]
        };
      } else {
        data = {
          singularity_score: 55, // Caution (High liability, but high automation)
          human_moat: "Medium",
          saturation_year: 2034,
          verdict: "The Expert Eclipse",
          timeline_context: "AI Diagnostics and Legal Discovery engines will outperform humans by 100x. Only the 'human interface' (bedside manner, courtroom persuasion) survives.",
          pivot_strategy: "Don't just be the monitor. Focus on 'Critical Care Medicine' or 'Pain Management'—areas requiring complex human judgment and physical intervention that algorithms can't touch.",
          upskillingRoadmap: [
            "Patient Relationship Management",
            "Complex Case Interpretation",
            "Human-Centered Communication",
            "Ethical Decision Making",
            "AI-Augmented Diagnostics"
          ],
          humanMoatTriggers: [
            "Building trust with patients and families",
            "Complex ethical decision making",
            "Persuasive communication in high-stakes situations",
            "Interpreting nuanced human behavior"
          ],
          recommendedTools: [
            { name: "AI Diagnostic Assistants", description: "Use AI for analysis, you provide judgment" },
            { name: "Patient Communication Platforms", description: "Leverage human connection" },
            { name: "Ethical Decision Support Systems", description: "Augment moral reasoning" }
          ]
        };
      }
    }

    // PHASE 4: THE PHYSICAL BREACH (2035–2038)
    // Transport, Trucking, Construction (framing), Manufacturing, Culinary, Chef
    else if (input.match(/transport|truck|construct|framing|manufactur|culinar|chef/)) {
      data = {
        singularity_score: 75, // RESILIENT
        human_moat: "Medium",
        saturation_year: 2037,
        verdict: "The Physical Breach",
        timeline_context: "Robotics maturity (Tesla Optimus v5) finally solves gross motor skills. Driving and basic construction become automated. Creativity is your only defense.",
        pivot_strategy: "Pivot to creative, artistic, or highly customized work. Mass production is automated. Hand-crafted, bespoke, and creative physical work remains human.",
        upskillingRoadmap: [
          "Creative Design & Customization",
          "Artisan Craftsmanship Techniques",
          "Bespoke Service Delivery",
          "Human-Centered Design",
          "Premium Experience Creation"
        ],
        humanMoatTriggers: [
          "Creative problem-solving in unpredictable environments",
          "Customization and personalization",
          "Artistic expression and aesthetic judgment",
          "Building emotional connections through craft"
        ],
        recommendedTools: [
          { name: "Design & Customization Software", description: "Augment creativity, not replace it" },
          { name: "Premium Craft Tools", description: "Tools that enhance human skill" },
          { name: "Experience Design Platforms", description: "Create memorable human experiences" }
        ]
      };
    }

    // PHASE 5: THE DEEP MOAT DECAY (2038–2041)
    // Surgery, Plumbing, Electrician, Mechanic, Dentistry
    else if (input.match(/surger|plumb|electric|mechanic|dentist/)) {
      data = {
        singularity_score: 88, // FORTRESS
        human_moat: "High",
        saturation_year: 2040,
        verdict: "The Moravec Firewall",
        timeline_context: "Fine motor skills in chaotic environments are the final frontier. You are safe until the robots become dexterous enough to stitch a vein or thread a pipe.",
        pivot_strategy: "Do nothing. You are the premium asset of the 21st century. Focus on specialized, high-touch skills. The physical world is your fortress.",
        upskillingRoadmap: [
          "Advanced Specialization in Niche Areas",
          "Complex Problem-Solving in Unpredictable Environments",
          "Patient/Client Relationship Building",
          "Emergency Response & Crisis Management",
          "Master-Level Craftsmanship"
        ],
        humanMoatTriggers: [
          "Fine motor skills in chaotic, unpredictable environments",
          "Real-time adaptation to unexpected complications",
          "Building trust through physical presence and touch",
          "Complex multi-step procedures requiring intuition"
        ],
        recommendedTools: [
          { name: "Precision Tools & Equipment", description: "Enhance your physical capabilities" },
          { name: "Emergency Response Systems", description: "Master crisis management" },
          { name: "Patient Communication Tools", description: "Build trust and relationships" }
        ]
      };
    }

    // PHASE 6: THE HUMAN PREMIUM (2041–2056)
    // Philosophy, Psychology, Nursing, Art (fine), Theology, Education (early childhood), Bio-engineering
    else if (input.match(/philosoph|psycholog|nurs|art|fine|theolog|educ|early childhood|bio-engin/)) {
      data = {
        singularity_score: 98, // IMMORTAL
        human_moat: "High",
        saturation_year: 2050,
        verdict: "The Human Premium",
        timeline_context: "In a post-labor economy, we pay for 'Human Connection' and 'Biological Mastery.' You are selling the experience of being human.",
        pivot_strategy: "Market yourself as 'Premium Human Connection.' Don't compete on volume/speed. Compete on trust, authenticity, and physical presence. You are selling the experience of being human.",
        upskillingRoadmap: [
          "Deep Human Connection & Empathy Training",
          "Authentic Communication & Presence",
          "Biological Systems Mastery",
          "Creative Expression & Artistic Development",
          "Ethical Reasoning & Moral Philosophy"
        ],
        humanMoatTriggers: [
          "Genuine emotional connection and empathy",
          "Authentic human presence and touch",
          "Creative expression and artistic vision",
          "Complex moral and ethical reasoning",
          "Nurturing and caregiving relationships"
        ],
        recommendedTools: [
          { name: "Human Connection Platforms", description: "Amplify your human presence" },
          { name: "Creative Expression Tools", description: "Enhance your artistic capabilities" },
          { name: "Biological Systems Knowledge", description: "Master the complexity of life" }
        ]
      };
    }

    // DEFAULT FALLBACK
    else {
      data = {
        singularity_score: 50,
        human_moat: "Low",
        saturation_year: 2030,
        verdict: "Generic Risk",
        timeline_context: "This degree lacks a specific 'Physical' or 'High-Agency' moat. In the age of AI, 'Generalist Knowledge' is worth $0/month (Subscription cost).",
        pivot_strategy: "Pivot immediately to a specialized trade or a high-stakes human relationship role.",
        upskillingRoadmap: [
          "Identify Your Unique Human Advantage",
          "Specialize in a Niche Area",
          "Build Physical or Relationship Skills",
          "Develop AI-Resistant Capabilities",
          "Create Your Personal Brand"
        ],
        humanMoatTriggers: [
          "Specialized knowledge in niche areas",
          "Physical skills and dexterity",
          "Strong human relationships",
          "Creative problem-solving"
        ],
        recommendedTools: [
          { name: "Career Pivot Assessment", description: "Identify your AI-resistant strengths" },
          { name: "Specialization Training", description: "Develop niche expertise" },
          { name: "Relationship Building Tools", description: "Leverage human connection" }
        ]
      };
    }

    // ---------------------------------------------------------
    // UNIVERSITY PRESTIGE BOOSTER (The "Old Boys Network" Factor)
    // ---------------------------------------------------------
    const eliteUnis = ["harvard", "mit", "stanford", "oxford", "cambridge", "yale", "princeton", "imperial", "dartmouth", "columbia", "leeds"]; // Added Leeds for you
    const isElite = eliteUnis.some(u => university.toLowerCase().includes(u));

    if (isElite) {
      data.singularity_score += 12; // Network saves you
      data.timeline_context += " HOWEVER: Your university brand grants you access to 'Gatekeeper' roles that AI cannot penetrate yet.";
    }

    // Cap score at 100
    if (data.singularity_score > 100) data.singularity_score = 100;

    // Simulate Network Latency
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Analysis Failed" }, { status: 500 });
  }
}
