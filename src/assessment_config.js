// assessment.config.js
//
// Single source of truth for the assessment instrument.
// Questions, response options, scoring, and action items all live here.
// When the question format is finalized, update SCORING_FORMAT and
// the options/scoring fields on each question — core app logic stays untouched.
//
// SCORING_FORMAT tells the app how to interpret answers:
//   "scenario"  — Version 1: each option is a maturity level (1, 2, or 3)
//   "binary"    — Version 2: yes/somewhat/not-yet/unsure per sub-question
//   "likert"    — Version 3: 1–5 scale per statement
//
// Maturity levels:
//   1 = Getting Started
//   2 = Building Momentum
//   3 = Leading the Way

export const SCORING_FORMAT = "scenario"; // change to "binary" or "likert" when ready

export const MATURITY_LEVELS = {
  1: {
    id: "getting_started",
    label: "Getting Started",
    description:
      "You're setting your foundation by exploring initial practices, creating buy-in, and putting building blocks in place. This is where every agency begins.",
  },
  2: {
    id: "building_momentum",
    label: "Building Momentum",
    description:
      "You have core practices in place and are working to deepen and systematize them across your agency.",
  },
  3: {
    id: "leading_the_way",
    label: "Leading the Way",
    description:
      "Family strengthening is embedded in your agency's culture. You're sustaining strong practices, continuing to innovate, and modeling your approach for others.",
  },
};

// Thresholds for determining a theme's maturity level from averaged scores.
// A theme score is the mean of all question scores within it (each scored 1–3).
// Adjust cutoffs here if calibration changes during testing.
export const SCORE_THRESHOLDS = {
  getting_started:   { min: 1,    max: 1.66 },
  building_momentum: { min: 1.67, max: 2.33 },
  leading_the_way:   { min: 2.34, max: 3    },
};

export const THEMES = [
  // ─────────────────────────────────────────────
  // THEME 1: Leadership & Vision
  // ─────────────────────────────────────────────
  {
    id: "leadership",
    label: "Leadership & Vision",
    description:
      "Has your leadership team articulated a clear, actionable family strengthening vision? Examine how you model the approach in your own decisions, whether you support workers when they advocate for families, and how you allocate resources.",
    questions: [
      {
        id: "q1",
        text: "How clear is your family strengthening vision communicated to agency staff and external stakeholders?",
        options: [
          {
            value: 1,
            text: "We use family strengthening language, but staff and external stakeholders struggle to explain what it means. We're beginning to develop a clear, written version.",
          },
          {
            value: 2,
            text: "We have a documented family strengthening vision and leaders communicate it regularly, but understanding varies across programs and staff levels.",
          },
          {
            value: 3,
            text: "Our family strengthening vision is clearly defined with specific practice expectations. It is consistently communicated across the agency and with external stakeholders. Staff can articulate what it means in their daily work.",
          },
        ],
      },
      {
        id: "q2",
        text: "How does your agency internally communicate the path to fully implementing family strengthening practices?",
        options: [
          {
            value: 1,
            text: "We've communicated family strengthening values, but haven't clearly outlined the steps, timeline, or roadmap for how we'll get there.",
          },
          {
            value: 2,
            text: "We've developed implementation plans and are communicating them through multiple channels. Staff increasingly understand the vision and specific actions we're taking.",
          },
          {
            value: 3,
            text: "Staff at all levels can explain the family strengthening vision and the specific steps for achieving it. Communication is ongoing and two-way.",
          },
        ],
      },
      {
        id: "q3",
        text: "How visibly does leadership demonstrate their commitment to family strengthening?",
        options: [
          {
            value: 1,
            text: "Leadership articulates family strengthening values in some meetings and communications and is beginning to explore how to model these priorities more visibly.",
          },
          {
            value: 2,
            text: "Leadership is actively working to model family strengthening through visible actions, though this isn't yet consistent across all levels of leadership.",
          },
          {
            value: 3,
            text: "Leadership at all levels model a family strengthening approach through community presence and make decisions that prioritize family engagement. Staff can name inspiring examples.",
          },
        ],
      },
      {
        id: "q4",
        text: "How does leadership stay connected to the reality of family and worker experiences?",
        options: [
          {
            value: 1,
            text: "Leadership learns about family and worker experiences primarily through data, reports, and some internal communications. Direct contact with families and frontline workers is minimal.",
          },
          {
            value: 2,
            text: "Leadership has established mechanisms to stay connected to staff and community and is working to increase frequency and consistency across all leadership positions.",
          },
          {
            value: 3,
            text: "Leadership at all levels regularly conducts field visits, meets with families and community partners, and stays connected to frontline realities.",
          },
        ],
      },
      {
        id: "q5",
        text: "How well do your organizational policies align with family strengthening values?",
        options: [
          {
            value: 1,
            text: "Our policies were developed primarily around compliance, risk management, and legal requirements. We're beginning to examine which policies may need to change.",
          },
          {
            value: 2,
            text: "We're actively reviewing policies to ensure they align with our family strengthening vision and have revised some policies to support family-centered practice.",
          },
          {
            value: 3,
            text: "Our policies are regularly reviewed and revised to align with our family strengthening values. Policies explicitly enable family partnership, cultural responsiveness, and strengths-based practices.",
          },
        ],
      },
      {
        id: "q6",
        text: "How do resource allocation and funding strategies reflect family strengthening priorities?",
        options: [
          {
            value: 1,
            text: "Budget and resource allocation primarily follows historical patterns or compliance requirements. We're beginning to examine how to shift resources toward family strengthening priorities.",
          },
          {
            value: 2,
            text: "We're actively shifting resources toward family strengthening priorities and developing funding strategies for community-based services.",
          },
          {
            value: 3,
            text: "Budget and resource allocation clearly reflect our family strengthening priorities. We have created sustainable funding strategies that support community-based providers and the infrastructure needed for family strengthening to thrive long-term.",
          },
        ],
      },
    ],
    actionItems: {
      getting_started: [
        "Create a plan to engage staff, families, and community partners to map current resources and needs.",
        "Develop a clear, written family strengthening vision through a collaborative process that includes diverse staff, families, and community partners.",
        "Create a plan to consistently share the vision through various methods such as all-staff meetings, written materials, and new staff onboardings.",
        "Ensure leadership at all levels can articulate the vision and explain what it means for their teams.",
        "Begin examining current policies — which ones were designed around compliance versus family strengthening?",
        "Conduct a budget analysis to identify opportunities to reallocate existing resources toward family strengthening.",
      ],
      building_momentum: [
        "Develop an initial family strengthening roadmap with clear milestones, timelines, and stakeholder responsibilities.",
        "Create agency-specific best practice guidance showing what family strengthening looks like in context.",
        "Communicate progress on the implementation roadmap regularly through email, meetings, and other channels.",
        "Encourage supervisors, managers, and executives to participate in field-based activities on a regular cadence.",
        "Review policies using newly defined family strengthening criteria, and engage workers in that process.",
        "Shift agency budget toward family strengthening priorities and develop a comprehensive funding strategy.",
      ],
      leading_the_way: [
        "Center the voice of families by having them serve on advisory boards and hiring committees.",
        "Ensure the family strengthening vision evolves based on continuous learning, data, and feedback.",
        "Sustain and protect leadership's connection to the field and community, even during transitions or busy periods.",
        "Incorporate family voice routinely in policy development and reviews.",
        "Prioritize family strengthening in your budget through robust workforce development and community partnership funding.",
        "Diversify funding streams through Title IV-E, Medicaid, state/local prevention funds, and advocacy for dedicated prevention funding.",
      ],
    },
  },

  // ─────────────────────────────────────────────
  // THEME 2: Workforce
  // ─────────────────────────────────────────────
  {
    id: "workforce",
    label: "Workforce",
    description:
      "How might you continue to build and sustain a workforce that prioritizes family strengthening practices? Consider whether your staff has the relational skills and psychological safety to genuinely engage families.",
    questions: [
      {
        id: "q7",
        text: "What is your approach to worker retention and well-being?",
        options: [
          {
            value: 1,
            text: "We're beginning to acknowledge that retention and well-being need attention and that this is foundational for family strengthening efforts.",
          },
          {
            value: 2,
            text: "We've implemented some supports (e.g., access to staff psychologists, coaching, debriefing) and are starting to address the top reasons for turnover, but it still presents a significant challenge.",
          },
          {
            value: 3,
            text: "Comprehensive staff well-being supports are in place and accessible. Retention is strong. Workers report feeling supported and able to sustain the work long-term.",
          },
        ],
      },
      {
        id: "q8",
        text: "How does your agency support workers who experience secondary trauma?",
        options: [
          {
            value: 1,
            text: "Support exists for staff after critical incidents, but it tends to come after the fact rather than being proactively available.",
          },
          {
            value: 2,
            text: "We provide accessible mental health support and encourage workers to use it, though seeking support may still carry stigma for some staff. We're working to normalize debriefing and self-care.",
          },
          {
            value: 3,
            text: "Secondary trauma support is proactive, accessible, and totally normalized across the agency. Staff routinely debrief, leadership models self-care, and mental health resources are accessible without stigma.",
          },
        ],
      },
      {
        id: "q9",
        text: "How manageable are worker caseloads?",
        options: [
          {
            value: 1,
            text: "Caseloads are high and workers report being overwhelmed. We're beginning to examine what manageable caseloads would look like.",
          },
          {
            value: 2,
            text: "We're actively reducing caseloads or working to protect time for family engagement in other ways. While some progress has been made, caseloads remain a significant challenge.",
          },
          {
            value: 3,
            text: "Staff report that caseloads are manageable and allow adequate time for relationship-building with families. Workload is constantly monitored and adjusted to ensure staff can practice family strengthening without burnout.",
          },
        ],
      },
      {
        id: "q10",
        text: "How psychologically safe do workers feel to advocate for families and make family strengthening decisions?",
        options: [
          {
            value: 1,
            text: "We're building a culture where frontline staff feel supported making judgment calls that prioritize family strengthening. We're working to shift from a blame-oriented culture to a learning-oriented one.",
          },
          {
            value: 2,
            text: "The agency has created structured safe spaces for discussing challenging situations and many workers feel backed up when they make difficult decisions. We're working to ensure psychological safety is consistent across all teams.",
          },
          {
            value: 3,
            text: "Workers consistently feel safe making appropriate judgment calls, challenging professionals when needed, and trying new approaches. This support is sustained across all leadership levels.",
          },
        ],
      },
    ],
    actionItems: {
      getting_started: [
        "Acknowledge that staff well-being and retention are challenges that need systematic attention.",
        "Implement basic supports such as access to mental health professionals and coaches.",
        "Begin examining the top reasons why workers leave through exit interviews or anonymous surveys.",
        "Make psychological safety an explicit priority — communicate that staff should feel supported advocating for families.",
        "Create forums where workers can safely discuss difficult cases (e.g., peer consulting groups, mentoring).",
        "Address instances where workers feel punished or blamed for judgment calls made in good faith.",
      ],
      building_momentum: [
        "Continue building well-being resources such as accessible mental health supports and manageable caseloads.",
        "After identifying top reasons for staff turnover, begin to address them through targeted interventions.",
        "Leaders should model and encourage seeking support in order to normalize it.",
        "Create or formalize safe spaces (e.g., peer consulting groups, learning circles) for staff to openly discuss challenges.",
        "Help staff develop skills for effective family advocacy through training and direct support.",
        "Pay attention to supervisor-worker compatibility and conduct regular check-ins about psychological safety.",
      ],
      leading_the_way: [
        "Ensure comprehensive well-being supports are in place and easily accessible by all staff.",
        "Create clear advancement pathways and promote from within to improve retention.",
        "Treat mistakes as valuable learning opportunities where staff openly discuss what didn't work.",
        "Onboard new staff immediately to the culture of psychological safety through modeling and explicit messaging.",
        "Recognize and celebrate staff who regularly advocate for families effectively.",
        "Regularly assess supervisor-worker relationships for quality and psychological safety.",
      ],
    },
  },

  // ─────────────────────────────────────────────
  // THEME 3: Family Engagement Practices & Tools
  // ─────────────────────────────────────────────
  {
    id: "family_engagement",
    label: "Family Engagement Practices & Tools",
    description:
      "Authentic family engagement is at the heart of family strengthening practice. These questions explore how your agency builds trust with families, involves them as partners in decision-making, and supports their strengths and goals.",
    questions: [
      {
        id: "q11",
        text: "How do workers typically engage with families?",
        options: [
          {
            value: 1,
            text: "Workers perform baseline duties in family engagement — conducting regular visits, sticking to case plan questions, and completing required tasks.",
          },
          {
            value: 2,
            text: "Workers take extra time and thought to support family engagement. They open conversations centered on rapport-building and offer different points of connection beyond standard protocols.",
          },
          {
            value: 3,
            text: "Workers use a strengths-based and family-centered approach. They build rapport and trust before paperwork, offer tailored resource support, and focus on what is working well in the family.",
          },
        ],
      },
      {
        id: "q12",
        text: "How much of a role do families have in decisions about their cases?",
        options: [
          {
            value: 1,
            text: "We are in talks internally to give families a role in some decisions about their case.",
          },
          {
            value: 2,
            text: "Light collaboration is done between caseworkers and families to incorporate the families' decisions or wishes.",
          },
          {
            value: 3,
            text: "There is a productive, collaborative relationship between families and caseworkers. Families feel empowered to advocate for themselves and push back on decisions made by the agency.",
          },
        ],
      },
      {
        id: "q13",
        text: "How are your tools and documents (e.g. case plans, safety plans, communication materials) designed and used?",
        options: [
          {
            value: 1,
            text: "Tools and documentation are designed primarily for agency compliance needs and sometimes use jargon that creates barriers for families.",
          },
          {
            value: 2,
            text: "We're beginning to revise tools and documentation with plain language and some family input. Many still feel like forms to complete rather than conversation guides.",
          },
          {
            value: 3,
            text: "Tools and documentation are designed with family input, use accessible language, and facilitate rather than replace conversation. They can be completed collaboratively with families.",
          },
        ],
      },
      {
        id: "q14",
        text: "How well does your agency take families' cultural backgrounds into consideration?",
        options: [
          {
            value: 1,
            text: "We don't ask questions that identify cultural background, whether in paperwork or during consultations.",
          },
          {
            value: 2,
            text: "We take families' cultural backgrounds into consideration, but in a passive manner — occasionally asking a relevant question.",
          },
          {
            value: 3,
            text: "We heavily rely on desk research and families themselves to honor different cultural backgrounds. We actively look for culturally appropriate resources and hire staff that reflect the families we serve.",
          },
        ],
      },
      {
        id: "q15",
        text: "How well does your agency staff its teams with people of diverse cultural backgrounds and lived expertise that reflects the communities you serve?",
        options: [
          {
            value: 1,
            text: "We are hiring anyone we can get due to our agency's need and are not collecting demographic information for applicants, though we recognize the importance of lived experience representation.",
          },
          {
            value: 2,
            text: "We're beginning to assess if our workforce reflects the demographics and lived experiences of the families we serve and are exploring strategies to recruit and retain staff from diverse backgrounds.",
          },
          {
            value: 3,
            text: "Our staff reflects the diversity of the families and communities we serve. Staff with diverse backgrounds and lived experiences are advancing into leadership roles and their perspectives inform practice and policy.",
          },
        ],
      },
    ],
    actionItems: {
      getting_started: [
        "Identify and analyze the different ways workers engage — or don't engage — with families.",
        "Share collected engagement data with leadership and make a business case for shifting policies toward relational engagement.",
        "Conduct an internal audit to identify which documents are above the Grade 6–8 reading level standard.",
        "Train staff to recognize personal biases, understand systemic harms, and use language that respects family dignity.",
        "Incorporate cultural questions in casework with clear explanations of why they're being asked.",
        "Collect demographic data on the current workforce to identify gaps in representation.",
      ],
      building_momentum: [
        "Draft processes and policies that ensure workers have sufficient time to build rapport with families.",
        "Ensure policies and processes are written in plain language for all levels of staff.",
        "Create templates that provide guidance to workers without scripting them.",
        "Ensure all public-facing materials are readable at a Grade 6–8 reading level.",
        "Build cultural competency and humility into performance evaluations.",
        "Hire staff that reflect the culturally diverse population served.",
      ],
      leading_the_way: [
        "Establish a regular cadence to review and update policies and procedures for effectiveness and relevancy.",
        "Model the process of effectively shifting policies toward relational family engagement for other child welfare agencies.",
        "Create an internal plain language standard and resource for staff to adhere to.",
        "Ensure the workforce meaningfully reflects your community's diversity — including in leadership roles.",
        "Ensure recruitment for diverse backgrounds is proactive and sustained, not reactive.",
      ],
    },
  },

  // ─────────────────────────────────────────────
  // THEME 4: Community Partnerships & Resources
  // ─────────────────────────────────────────────
  {
    id: "community_partnerships",
    label: "Community Partnerships & Resources",
    description:
      "Consider what community partners your agency already holds and what ways your teams may need to expand, build, or deepen these connections in order to meet the needs of families.",
    questions: [
      {
        id: "q16",
        text: "How ready are your agency, partner agencies, and community providers in terms of having the resources, services, and partnerships needed to meet families' needs?",
        options: [
          {
            value: 1,
            text: "The agency holds key contacts with partner agencies and community providers, but does not yet have a plan or vision for how to include them in family strengthening.",
          },
          {
            value: 2,
            text: "Some partner agencies and community providers are interested in supporting the family strengthening vision and have provided feedback.",
          },
          {
            value: 3,
            text: "Partner agencies and community providers have been informed of the direction for family strengthening and are key leaders and champions of it in their communities.",
          },
        ],
      },
      {
        id: "q17",
        text: "How do community partners experience working with your agency?",
        options: [
          {
            value: 1,
            text: "Some community partners or contracts are established, but the agency does not have a good idea of all the types of services and providers families need to access.",
          },
          {
            value: 2,
            text: "The agency has established key community partners, but does not have dedicated resources to check in regularly and identify what is working well or not.",
          },
          {
            value: 3,
            text: "Regular check-ins and feedback are gathered from community partners. The agency understands needs and acts on feedback to improve partnerships and how families are served.",
          },
        ],
      },
      {
        id: "q18",
        text: "How accessible are community resources to workers and families?",
        options: [
          {
            value: 1,
            text: "Knowledge of available resources is individual to specific workers and teams — there is no system-wide coordination or mapping underway.",
          },
          {
            value: 2,
            text: "The agency has conducted a system-wide community needs assessment or mapping activities and is working to develop and maintain a resource that is accessible agency-wide.",
          },
          {
            value: 3,
            text: "The agency works with a system-wide collaborative of agency partners, gathers regular feedback on needs, and is working to fill any resource or service gaps in communities.",
          },
        ],
      },
      {
        id: "q19",
        text: "How do workers find tailored resources for families?",
        options: [
          {
            value: 1,
            text: "Workers rely on resources they've individually researched in order to make referrals for families.",
          },
          {
            value: 2,
            text: "Child welfare teams have dedicated roles to resource-finding for particular needs. Lists of resources are regularly vetted for quality and referrals have a feedback loop back to the agency.",
          },
          {
            value: 3,
            text: "Families are able to self-refer to needed resources or access community navigators with lived expertise. Data is captured to ensure families are connected to the services they need.",
          },
        ],
      },
    ],
    actionItems: {
      getting_started: [
        "Develop community engagement strategies to bring community partners into the design of a family strengthening approach.",
        "Create dedicated resources for running community outreach and engagement activities.",
        "Conduct community needs assessments to understand gaps or areas where families are underserved.",
        "Gather initial information from staff about what resources they currently use.",
        "Create a simple centralized resource list or database with basic information about providers and services.",
      ],
      building_momentum: [
        "Invite educators, District Attorneys, community-based organizations, and health professionals into the planning process.",
        "Make attending community events and partnership building an expected part of all teams' roles.",
        "Map resources and services currently available in communities and identify underserved areas.",
        "Ensure resource quality, cultural appropriateness, and availability in the community.",
        "Include voices of lived expertise to understand challenges and opportunities with resource navigation.",
      ],
      leading_the_way: [
        "Use co-design approaches to ensure community partners and families have regular input on family strengthening strategies.",
        "Hold regular learning and listening circles or planning meetings with community partners.",
        "Ensure dedicated roles for resource-finding and coordination — both internal and external to the agency.",
        "Open the resource database to a broader population of users including external partners and families themselves.",
        "Hire and create capacity-building opportunities for people with lived expertise to support resource navigation.",
      ],
    },
  },
];

// ─────────────────────────────────────────────
// SCORING UTILITY
// ─────────────────────────────────────────────
// Accepts a responses object keyed by question ID (e.g. { q1: 2, q2: 1, ... })
// Returns a maturity level ID for each theme and overall.
export function scoreAssessment(answers) {
  const themeResults = THEMES.map((theme) => {
    const scores = theme.questions
      .map((q) => answers[q.id])
      .filter((v) => v !== undefined && v !== null);

    if (scores.length === 0) return null;

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let level;
    if (avg <= SCORE_THRESHOLDS.getting_started.max) level = "getting_started";
    else if (avg <= SCORE_THRESHOLDS.building_momentum.max) level = "building_momentum";
    else level = "leading_the_way";

    return {
      themeId: theme.id,
      themeLabel: theme.label,
      score: avg,
      level,
      levelLabel: Object.values(MATURITY_LEVELS).find((m) => m.id === level)?.label,
      actionItems: theme.actionItems[level],
    };
  });

  const filteredResults = themeResults.filter(Boolean);

  // Calculate overall maturity level as the mean of all theme scores
  const overallScore =
    filteredResults.reduce((sum, t) => sum + t.score, 0) / filteredResults.length;

  let overallLevel;
  if (overallScore <= SCORE_THRESHOLDS.getting_started.max) overallLevel = "getting_started";
  else if (overallScore <= SCORE_THRESHOLDS.building_momentum.max) overallLevel = "building_momentum";
  else overallLevel = "leading_the_way";

  const overall = {
    score: overallScore,
    level: overallLevel,
    levelLabel: Object.values(MATURITY_LEVELS).find((m) => m.id === overallLevel)?.label,
  };

  return { themes: filteredResults, overall };
}
