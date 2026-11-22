(() => {
  const STORAGE_KEY = "pm-warroom-state-v3";
  const OLLAMA_SETTINGS_KEY = "secondorder-ollama-settings";
  const OLLAMA_BASE_URL = "http://localhost:11434";
  const OLLAMA_BASE_URLS = [];
  const DEFAULT_OLLAMA_MODEL = "hf.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q4_K_M";
  const TICK_MINUTES = 10;
  const REALTIME_TICK_MS = 30000;
  const SESSION_DURATION_MS = 7 * 60 * 1000;
  const ANALYSIS_WINDOW_MS = 1 * 60 * 1000;
  const BUSINESS_DECISION_COOLDOWN_MS = 40 * 1000;
  const CRISIS_RESPONSE_WINDOW_MS = 2 * 60 * 1000;
  const CRISIS_ACTION_COOLDOWN_MS = 10 * 1000;
  const BOARD_TOLERANCE_MAX = 50;
  const CONSTITUTIONAL_TOLERANCE_MAX = 100;
  const DEFAULT_SCENARIO_ID = "mumbai_terror";
  const BUSINESS_SCENARIO_ID = "secondorder_business";
  const deterministicLogic = window.SecondOrderLogic;
  if (!deterministicLogic) throw new Error("SecondOrder deterministic logic module failed to load.");
  const BOAT_LOGO_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="70%">
          <stop offset="0" stop-color="#2f2f2f"/>
          <stop offset="0.48" stop-color="#242424"/>
          <stop offset="1" stop-color="#1c1c1c"/>
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.55"/>
        </filter>
        <pattern id="panels" width="360" height="260" patternUnits="userSpaceOnUse">
          <rect width="360" height="260" fill="#2a2a2a" opacity="0.42"/>
          <rect x="8" y="8" width="164" height="112" fill="#3a3a3a" opacity="0.18"/>
          <rect x="188" y="18" width="152" height="96" fill="#444" opacity="0.14"/>
          <rect x="36" y="142" width="122" height="86" fill="#111" opacity="0.2"/>
          <rect x="204" y="136" width="126" height="96" fill="#555" opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#bg)"/>
      <rect x="250" y="48" width="700" height="505" fill="url(#panels)" opacity="0.55"/>
      <rect width="1200" height="600" fill="#000" opacity="0.2"/>
      <g filter="url(#softShadow)" font-family="Arial, Helvetica, sans-serif" font-weight="300">
        <text x="383" y="380" font-size="210" fill="#f6f6f6" letter-spacing="-18">bo</text>
        <text x="632" y="380" font-size="210" fill="#ed1c24" font-weight="800" letter-spacing="-20">A</text>
        <text x="760" y="380" font-size="210" fill="#f6f6f6" letter-spacing="-18">t</text>
      </g>
    </svg>
  `)}`;
  const BUSINESS_BOARDROOM_IMAGE = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Exec_Boardroom.jpg";

  const STAT_KEYS = [
    "NationalSecurity",
    "MilitaryReadiness",
    "PublicConfidence",
    "CommunalHarmony",
    "EconomicStability",
    "FiscalHealth",
    "DiplomaticStanding",
    "AirQuality",
  ];

  const THREAT_KEYS = [
    "TerrorThreat",
    "BorderTension",
    "EconomicPressure",
    "PollutionCrisis",
    "DisinformationRisk",
  ];

  const DOMESTIC_KEYS = [
    "ParliamentApproval",
    "OppositionPressure",
    "MediaHostility",
    "ProtestRisk",
    "ElectionPressure",
  ];

  const SENTIMENT_KEYS = [
    "TrustInGovernment",
    "PanicLevel",
    "Nationalism",
    "CommunalTension",
  ];

  const ECONOMY_KEYS = [
    "StockIndex",
    "CurrencyValue",
    "OilPrice",
    "Inflation",
    "Unemployment",
    "DefenseSpending",
  ];

  const SYSTEM_KEYS = [
    "MarketConfidence",
    "OilStability",
    "SupplyChainIntegrity",
    "InfrastructureIntegrity",
    "HealthcareCapacity",
    "RefugeePressure",
  ];

  const LABELS = {
    NationalSecurity: "National Security",
    MilitaryReadiness: "Military Readiness",
    PublicConfidence: "Public Confidence",
    CommunalHarmony: "Communal Harmony",
    EconomicStability: "Economic Stability",
    FiscalHealth: "Fiscal Health",
    DiplomaticStanding: "Diplomatic Standing",
    AirQuality: "Air Quality",
    TerrorThreat: "Terror Threat",
    BorderTension: "Border Tension",
    EconomicPressure: "Economic Pressure",
    PollutionCrisis: "Pollution Crisis",
    DisinformationRisk: "Disinformation Risk",
    ParliamentApproval: "Parliament Approval",
    OppositionPressure: "Opposition Pressure",
    MediaHostility: "Media Hostility",
    ProtestRisk: "Protest Risk",
    ElectionPressure: "Election Pressure",
    TrustInGovernment: "Trust in Govt",
    PanicLevel: "Panic Level",
    Nationalism: "Nationalism",
    CommunalTension: "Communal Tension",
    StockIndex: "Stock Market",
    CurrencyValue: "Rupee Strength",
    OilPrice: "Oil Stability",
    Inflation: "Inflation Control",
    Unemployment: "Employment Stability",
    DefenseSpending: "Defense Budget Health",
    MarketConfidence: "Market Confidence",
    OilStability: "Oil Stability",
    SupplyChainIntegrity: "Supply Chains",
    InfrastructureIntegrity: "Infrastructure",
    HealthcareCapacity: "Healthcare Capacity",
    RefugeePressure: "Refugee Pressure",
  };

  const SCENARIO_LABELS = {
    secondorder_business: {
      NationalSecurity: "Product Portfolio Strength",
      MilitaryReadiness: "Execution Capacity",
      PublicConfidence: "Brand Love",
      CommunalHarmony: "Channel Alignment",
      EconomicStability: "Revenue Momentum",
      FiscalHealth: "Margin Health",
      DiplomaticStanding: "Brand Credibility",
      AirQuality: "Positioning Clarity",
      TerrorThreat: "Category Churn Risk",
      BorderTension: "Competitive Pressure",
      EconomicPressure: "Margin Pressure",
      PollutionCrisis: "Product Commoditization",
      DisinformationRisk: "Brand Dilution Risk",
      ParliamentApproval: "Board Confidence",
      OppositionPressure: "Investor Scrutiny",
      MediaHostility: "Market Skepticism",
      ProtestRisk: "Retailer Pushback",
      ElectionPressure: "IPO Pressure",
      TrustInGovernment: "Consumer Trust",
      PanicLevel: "Team Stress",
      Nationalism: "Brand Energy",
      CommunalTension: "Org Misalignment",
      StockIndex: "Sales Momentum",
      CurrencyValue: "Pricing Power",
      OilPrice: "Inventory Buffer",
      Inflation: "Cost Control",
      Unemployment: "Hiring Stability",
      DefenseSpending: "Innovation Budget",
      MarketConfidence: "Retailer Confidence",
      OilStability: "Working Capital Buffer",
      SupplyChainIntegrity: "Manufacturing Resilience",
      InfrastructureIntegrity: "D2C Platform Reliability",
      HealthcareCapacity: "Service Capacity",
      RefugeePressure: "Warranty Backlog",
    },
  };

  const BAD_METRICS = new Set([
    "TerrorThreat",
    "BorderTension",
    "EconomicPressure",
    "PollutionCrisis",
    "DisinformationRisk",
    "OppositionPressure",
    "MediaHostility",
    "ProtestRisk",
    "ElectionPressure",
    "PanicLevel",
    "CommunalTension",
    "RefugeePressure",
  ]);

  const ESCALATION_LADDER = [
    { min: 0, label: "Diplomatic Protest" },
    { min: 15, label: "Sanctions & Coercive Diplomacy" },
    { min: 30, label: "Proxy / Covert Conflict" },
    { min: 45, label: "Limited Conventional Warfare" },
    { min: 60, label: "Regional War" },
    { min: 75, label: "Strategic Weapons Signaling" },
    { min: 90, label: "Nuclear Exchange Trajectory" },
  ];

  const BUSINESS_PRESSURE_LADDER = [
    { min: 0, label: "Category Review" },
    { min: 15, label: "Channel Calibration" },
    { min: 30, label: "Portfolio Pressure" },
    { min: 45, label: "Margin & Brand Stress" },
    { min: 60, label: "IPO Readiness Crunch" },
    { min: 75, label: "Board Intervention Risk" },
    { min: 90, label: "Brand / Margin Crisis" },
  ];

  const ALLIANCES = [
    {
      id: "NATOLike",
      label: "Transatlantic Security Network",
      members: ["USA", "EU"],
      collectiveDefense: 0.86,
      intelSharing: 0.78,
      sanctionsCoord: 0.92,
    },
    {
      id: "ChinaPak",
      label: "China-Pakistan Strategic Coordination",
      members: ["China", "Pakistan"],
      collectiveDefense: 0.77,
      intelSharing: 0.84,
      sanctionsCoord: 0.15,
    },
    {
      id: "Quad",
      label: "Quad Cooperation Channel",
      members: ["India", "USA"],
      collectiveDefense: 0.36,
      intelSharing: 0.8,
      sanctionsCoord: 0.45,
    },
    {
      id: "SCO",
      label: "SCO Political Hotline",
      members: ["India", "Pakistan", "China", "Russia"],
      collectiveDefense: 0.12,
      intelSharing: 0.3,
      sanctionsCoord: 0.1,
    },
  ];

  const ADVISORS = [
    { id: "defence", name: "Defence Minister", personality: "aggressive" },
    { id: "finance", name: "Finance Minister", personality: "cautious" },
    { id: "home", name: "Home Minister", personality: "political" },
    { id: "external", name: "External Affairs Minister", personality: "strategic" },
    { id: "raw", name: "RAW Chief", personality: "covert" },
    { id: "nsa", name: "NSA", personality: "strategic" },
    { id: "army", name: "Army Chief", personality: "aggressive" },
    { id: "air", name: "Air Chief", personality: "aggressive" },
    { id: "navy", name: "Navy Chief", personality: "strategic" },
  ];

  const BUSINESS_ADVISORS = [
    { id: "ceo", name: "CEO / Co-founder", personality: "strategic" },
    { id: "cfo", name: "CFO", personality: "cautious" },
    { id: "product", name: "Head of Product", personality: "product" },
    { id: "marketing", name: "Chief Marketing Officer", personality: "brand" },
    { id: "ecommerce", name: "Head of E-commerce", personality: "growth" },
    { id: "retail", name: "Retail Distribution Head", personality: "channel" },
    { id: "ops", name: "Supply Chain Lead", personality: "execution" },
    { id: "investor", name: "Board / Investor Representative", personality: "risk" },
  ];

  const BUSINESS_COVER_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0b0d10"/>
          <stop offset="0.55" stop-color="#171b22"/>
          <stop offset="1" stop-color="#4b0f16"/>
        </linearGradient>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#g)"/>
      <rect width="1600" height="900" fill="url(#grid)"/>
      <text x="90" y="170" fill="#ffffff" font-family="Arial, sans-serif" font-size="82" font-weight="700">boAt Strategy Boardroom</text>
      <text x="94" y="245" fill="#d8d8d8" font-family="Arial, sans-serif" font-size="38">Audio strength. Wearables slowdown. Margin pressure.</text>
      <g transform="translate(120 360)">
        <rect width="300" height="170" rx="18" fill="#111822" stroke="#ef233c" stroke-width="5"/>
        <text x="30" y="64" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">Audio</text>
        <text x="30" y="115" fill="#bfc6d1" font-family="Arial, sans-serif" font-size="26">Core category</text>
      </g>
      <g transform="translate(520 360)">
        <rect width="300" height="170" rx="18" fill="#111822" stroke="#ef233c" stroke-width="5"/>
        <text x="30" y="64" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">Wearables</text>
        <text x="30" y="115" fill="#bfc6d1" font-family="Arial, sans-serif" font-size="26">Pressure zone</text>
      </g>
      <g transform="translate(920 360)">
        <rect width="300" height="170" rx="18" fill="#111822" stroke="#ef233c" stroke-width="5"/>
        <text x="30" y="64" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">Brand</text>
        <text x="30" y="115" fill="#bfc6d1" font-family="Arial, sans-serif" font-size="26">Youth engine</text>
      </g>
      <path d="M430 445H505M830 445H905" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <path d="M495 425L525 445L495 465M895 425L925 445L895 465" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="94" y="760" fill="#ffffff" font-family="Arial, sans-serif" font-size="34">Case inputs: affordable audio, D2C growth, celebrity marketing, offline scale, local manufacturing, IPO discipline.</text>
    </svg>
  `)}`;

  const SCENARIOS = [
    {
      id: "mumbai_terror",
      name: "Mumbai Terror Aftermath",
      description: "A mass-casualty terror incident with public anger, retaliatory pressure, and urgent intelligence uncertainty.",
      media: {
        title: "Taj Mahal Hotel Cordoned Off After 26/11",
        caption: "Real image of the Taj Mahal Hotel cordoned off in the days after the November 2008 Mumbai attacks.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/2008_Mumbai_terror_attacks_Taj_Hotel_cordoned_off.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:2008_Mumbai_terror_attacks_Taj_Hotel_cordoned_off.jpg",
      },
    },
    {
      id: BUSINESS_SCENARIO_ID,
      name: "boAt Limited Business Case",
      description: "A boardroom simulation based on the attached boAt case studies: audio leadership, wearables slowdown, youth branding, marketplace/offline channels, margin pressure, domestic manufacturing, and IPO-readiness.",
      media: {
        title: "boAt Lifestyle Logo",
        caption: "Official-style boAt brand mark used as the case dashboard identity for the business simulation.",
        imageUrl: BOAT_LOGO_IMAGE,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Boat-logo.png",
        sourceLabel: "Logo source",
      },
    },
  ];

  const SCENARIO_OPTION_LIBRARY = {
    default: [
      {
        id: "D1",
        title: "Issue calibrated diplomatic demarche and request multilateral consultations",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 9,
        risk: 0.24,
        legality: 0.96,
        targets: ["External"],
        statsDelta: { DiplomaticStanding: 3, PublicConfidence: 1 },
        threatDelta: { BorderTension: -2, TerrorThreat: -1, EconomicPressure: -1 },
        economyDelta: { StockIndex: 1, CurrencyValue: 1 },
      },
      {
        id: "H1",
        title: "Expand domestic screening, patrol visibility, and hospital readiness",
        domain: "Internal",
        style: "domestic",
        severity: 10,
        risk: 0.31,
        legality: 0.88,
        targets: ["Domestic"],
        statsDelta: { NationalSecurity: 2, PublicConfidence: 1, FiscalHealth: -1 },
        threatDelta: { TerrorThreat: -2, DisinformationRisk: 1 },
        economyDelta: { DefenseSpending: -1 },
      },
      {
        id: "E1",
        title: "Release a limited market-calming and fuel-buffer package",
        domain: "Economy",
        style: "economic",
        severity: 8,
        risk: 0.28,
        legality: 0.92,
        targets: ["Domestic"],
        statsDelta: { EconomicStability: 2, FiscalHealth: -2 },
        threatDelta: { EconomicPressure: -3 },
        economyDelta: { StockIndex: 2, CurrencyValue: 1, Inflation: -1 },
      },
      {
        id: "C1",
        title: "Run coordinated public briefings and misinformation rebuttal cells",
        domain: "Information",
        style: "information",
        severity: 7,
        risk: 0.22,
        legality: 0.95,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 2, CommunalHarmony: 2 },
        threatDelta: { DisinformationRisk: -4 },
        economyDelta: {},
      },
      {
        id: "Y1",
        title: "Raise cyber monitoring and isolate critical network choke points",
        domain: "Cyber",
        style: "cyber",
        severity: 8,
        risk: 0.27,
        legality: 0.9,
        targets: ["Domestic"],
        statsDelta: { NationalSecurity: 2, EconomicStability: 1, FiscalHealth: -1 },
        threatDelta: { DisinformationRisk: -2, EconomicPressure: -1 },
        economyDelta: { StockIndex: 1 },
      },
    ],
    mumbai_terror: [
      {
        id: "M1",
        title: "Seal transport hubs, push visible urban deployment, and run mass-casualty response drills",
        domain: "Security",
        style: "domestic",
        severity: 14,
        risk: 0.36,
        legality: 0.86,
        targets: ["Domestic"],
        statsDelta: { NationalSecurity: 3, PublicConfidence: 2, FiscalHealth: -1 },
        threatDelta: { TerrorThreat: -3, DisinformationRisk: 1 },
        economyDelta: { DefenseSpending: -1 },
      },
      {
        id: "M2",
        title: "Share limited intelligence dossiers with partners and demand quiet cooperation",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 9,
        risk: 0.29,
        legality: 0.95,
        targets: ["External"],
        statsDelta: { DiplomaticStanding: 3, NationalSecurity: 1 },
        threatDelta: { TerrorThreat: -2, BorderTension: -1 },
        economyDelta: { StockIndex: 1 },
      },
      {
        id: "M3",
        title: "Run controlled public messaging to prevent panic and communal backlash",
        domain: "Information",
        style: "information",
        severity: 7,
        risk: 0.2,
        legality: 0.95,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 2, CommunalHarmony: 3 },
        threatDelta: { DisinformationRisk: -4 },
        economyDelta: {},
      },
      {
        id: "M4",
        title: "Authorize limited covert surveillance expansion against suspected handlers",
        domain: "Covert",
        style: "covert",
        severity: 12,
        risk: 0.42,
        legality: 0.7,
        targets: ["Pakistan"],
        statsDelta: { NationalSecurity: 2, DiplomaticStanding: -1 },
        threatDelta: { TerrorThreat: -3, BorderTension: 2 },
        economyDelta: { StockIndex: -1 },
      },
      {
        id: "M5",
        title: "Release business continuity support for tourism, transport, and urban services",
        domain: "Economy",
        style: "economic",
        severity: 8,
        risk: 0.24,
        legality: 0.92,
        targets: ["Domestic"],
        statsDelta: { EconomicStability: 2, PublicConfidence: 1, FiscalHealth: -2 },
        threatDelta: { EconomicPressure: -2 },
        economyDelta: { StockIndex: 2, Unemployment: 1 },
      },
    ],
    secondorder_business: [
      {
        id: "BOAT1",
        title: "Double down on premium audio while reducing dependence on low-margin smartwatches",
        domain: "Portfolio",
        style: "product",
        severity: 12,
        risk: 0.34,
        legality: 0.97,
        targets: ["Audio", "Wearables"],
        statsDelta: { NationalSecurity: 5, EconomicStability: 3, FiscalHealth: 4, DiplomaticStanding: 2 },
        threatDelta: { PollutionCrisis: -4, EconomicPressure: -3, TerrorThreat: -2, BorderTension: 1 },
        economyDelta: { CurrencyValue: 3, StockIndex: 2, DefenseSpending: 2 },
        systemsDelta: { MarketConfidence: 3, SupplyChainIntegrity: 1 },
      },
      {
        id: "BOAT2",
        title: "Launch a controlled premiumisation push around ANC earbuds and Nirvana-style high ASP audio",
        domain: "Product",
        style: "product",
        severity: 11,
        risk: 0.38,
        legality: 0.96,
        targets: ["Premium Audio"],
        statsDelta: { NationalSecurity: 4, PublicConfidence: 2, EconomicStability: 2, AirQuality: 3 },
        threatDelta: { PollutionCrisis: -5, DisinformationRisk: -2, EconomicPressure: 1 },
        economyDelta: { CurrencyValue: 4, DefenseSpending: -2, StockIndex: 2 },
        systemsDelta: { InfrastructureIntegrity: 2, MarketConfidence: 2 },
      },
      {
        id: "BOAT3",
        title: "Shift from blanket discounts to disciplined festive bundles with clear margin floors",
        domain: "Finance",
        style: "pricing",
        severity: 9,
        risk: 0.28,
        legality: 0.98,
        targets: ["Pricing", "Marketplaces"],
        statsDelta: { FiscalHealth: 5, EconomicStability: 2, DiplomaticStanding: 1 },
        threatDelta: { EconomicPressure: -5, DisinformationRisk: -1, BorderTension: 2 },
        economyDelta: { CurrencyValue: 5, Inflation: 2, StockIndex: 1 },
        systemsDelta: { MarketConfidence: 1 },
      },
      {
        id: "BOAT4",
        title: "Expand offline retail selectively in Tier 2/3 cities without weakening D2C marketplace economics",
        domain: "Channels",
        style: "market",
        severity: 12,
        risk: 0.42,
        legality: 0.95,
        targets: ["Retail", "D2C"],
        statsDelta: { EconomicStability: 4, PublicConfidence: 3, CommunalHarmony: 3, FiscalHealth: -2 },
        threatDelta: { BorderTension: -2, EconomicPressure: 2 },
        economyDelta: { StockIndex: 5, OilPrice: -2 },
        systemsDelta: { MarketConfidence: 5, SupplyChainIntegrity: -2, HealthcareCapacity: -1 },
      },
      {
        id: "BOAT5",
        title: "Increase celebrity and creator campaigns, but tie spend to measurable sales lift and brand recall",
        domain: "Brand",
        style: "brand",
        severity: 10,
        risk: 0.36,
        legality: 0.96,
        targets: ["Youth Consumers"],
        statsDelta: { PublicConfidence: 5, AirQuality: 4, EconomicStability: 1, FiscalHealth: -3 },
        threatDelta: { DisinformationRisk: -3, EconomicPressure: 3 },
        economyDelta: { StockIndex: 3, CurrencyValue: 1 },
        systemsDelta: { MarketConfidence: 2 },
      },
      {
        id: "BOAT6",
        title: "Invest in service, warranty turnaround, and product quality before pushing another category",
        domain: "Trust",
        style: "governance",
        severity: 10,
        risk: 0.24,
        legality: 0.99,
        targets: ["Customer Trust"],
        statsDelta: { DiplomaticStanding: 4, PublicConfidence: 4, CommunalHarmony: 2, NationalSecurity: 2, FiscalHealth: -2 },
        threatDelta: { TerrorThreat: -5, DisinformationRisk: -4, PollutionCrisis: -3 },
        economyDelta: { CurrencyValue: 2, StockIndex: 1 },
        systemsDelta: { HealthcareCapacity: 6, RefugeePressure: -5, MarketConfidence: 3 },
      },
      {
        id: "BOAT7",
        title: "Localize manufacturing and component sourcing to protect supply resilience and IPO narrative",
        domain: "Operations",
        style: "operations",
        severity: 11,
        risk: 0.33,
        legality: 0.97,
        targets: ["Manufacturing"],
        statsDelta: { FiscalHealth: 2, DiplomaticStanding: 3, NationalSecurity: 2, EconomicStability: 1 },
        threatDelta: { EconomicPressure: -2, PollutionCrisis: -2 },
        economyDelta: { OilPrice: 4, DefenseSpending: 2, CurrencyValue: 1 },
        systemsDelta: { SupplyChainIntegrity: 6, OilStability: 3 },
      },
      {
        id: "BOAT8",
        title: "Flood the market with ultra-low-price smartwatches to fight Noise and Fire-Boltt",
        domain: "Aggressive Growth",
        style: "overreach",
        severity: 20,
        risk: 0.72,
        legality: 0.88,
        targets: ["Wearables"],
        statsDelta: { EconomicStability: 2, FiscalHealth: -8, AirQuality: -5, DiplomaticStanding: -3 },
        threatDelta: { EconomicPressure: 9, PollutionCrisis: 7, DisinformationRisk: 6, BorderTension: 5 },
        economyDelta: { StockIndex: 2, CurrencyValue: -6, Inflation: -2 },
        systemsDelta: { SupplyChainIntegrity: -5, HealthcareCapacity: -4, MarketConfidence: -3 },
      },
    ],
    india_china_border: [
      {
        id: "B1",
        title: "Increase ISR flights and forward logistics without crossing into strike posture",
        domain: "Security",
        style: "kinetic",
        severity: 12,
        risk: 0.33,
        legality: 0.84,
        targets: ["China"],
        statsDelta: { MilitaryReadiness: 2, NationalSecurity: 1, FiscalHealth: -1 },
        threatDelta: { BorderTension: 2 },
        economyDelta: { DefenseSpending: -1 },
      },
      {
        id: "B2",
        title: "Activate hotline diplomacy and corps-level deconfliction talks",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 8,
        risk: 0.19,
        legality: 0.97,
        targets: ["China"],
        statsDelta: { DiplomaticStanding: 3 },
        threatDelta: { BorderTension: -3 },
        economyDelta: { CurrencyValue: 1 },
      },
      {
        id: "B3",
        title: "Pre-position medical evacuation and winter sustainment assets",
        domain: "Internal",
        style: "domestic",
        severity: 7,
        risk: 0.16,
        legality: 0.95,
        targets: ["Domestic"],
        statsDelta: { MilitaryReadiness: 1, PublicConfidence: 1, FiscalHealth: -1 },
        threatDelta: {},
        economyDelta: {},
      },
      {
        id: "B4",
        title: "Quietly brief key partners and watch for sanctions or shipping exposure",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 6,
        risk: 0.18,
        legality: 0.96,
        targets: ["External"],
        statsDelta: { DiplomaticStanding: 2 },
        threatDelta: { EconomicPressure: -1 },
        economyDelta: { StockIndex: 1 },
      },
      {
        id: "B5",
        title: "Tighten public messaging to avoid accidental war panic",
        domain: "Information",
        style: "information",
        severity: 6,
        risk: 0.14,
        legality: 0.96,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 1 },
        threatDelta: { DisinformationRisk: -3 },
        economyDelta: {},
      },
    ],
    indopacific_standoff: [
      {
        id: "N1",
        title: "Re-route high-value shipping and increase naval escort presence",
        domain: "Security",
        style: "kinetic",
        severity: 10,
        risk: 0.29,
        legality: 0.86,
        targets: ["Maritime"],
        statsDelta: { NationalSecurity: 1, MilitaryReadiness: 2, FiscalHealth: -1 },
        threatDelta: { BorderTension: 1, EconomicPressure: -1 },
        economyDelta: { OilPrice: 1 },
      },
      {
        id: "N2",
        title: "Open a maritime deconfliction line with outside powers and insurers",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 7,
        risk: 0.18,
        legality: 0.97,
        targets: ["External"],
        statsDelta: { DiplomaticStanding: 3 },
        threatDelta: { BorderTension: -2 },
        economyDelta: { StockIndex: 1, CurrencyValue: 1 },
      },
      {
        id: "N3",
        title: "Stress-test port logistics and fuel reserve release channels",
        domain: "Economy",
        style: "economic",
        severity: 8,
        risk: 0.23,
        legality: 0.92,
        targets: ["Domestic"],
        statsDelta: { EconomicStability: 2, FiscalHealth: -1 },
        threatDelta: { EconomicPressure: -2 },
        economyDelta: { OilPrice: 2, StockIndex: 1 },
      },
      {
        id: "N4",
        title: "Expand satellite and signals surveillance over sea-lane choke points",
        domain: "Cyber",
        style: "cyber",
        severity: 8,
        risk: 0.24,
        legality: 0.9,
        targets: ["Maritime"],
        statsDelta: { NationalSecurity: 2 },
        threatDelta: { DisinformationRisk: -1 },
        economyDelta: {},
      },
      {
        id: "N5",
        title: "Issue a restrained public advisory to lower speculative panic",
        domain: "Information",
        style: "information",
        severity: 5,
        risk: 0.12,
        legality: 0.96,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 1 },
        threatDelta: { DisinformationRisk: -2 },
        economyDelta: { StockIndex: 1 },
      },
    ],
    grid_cyber_war: [
      {
        id: "G1",
        title: "Isolate affected grid zones and switch to manual continuity protocols",
        domain: "Cyber",
        style: "cyber",
        severity: 11,
        risk: 0.26,
        legality: 0.93,
        targets: ["Domestic"],
        statsDelta: { NationalSecurity: 2, EconomicStability: 1, FiscalHealth: -1 },
        threatDelta: { EconomicPressure: -2, DisinformationRisk: -1 },
        economyDelta: { StockIndex: 1 },
      },
      {
        id: "G2",
        title: "Bring in emergency private-sector grid and telecom coordination cells",
        domain: "Internal",
        style: "domestic",
        severity: 9,
        risk: 0.19,
        legality: 0.94,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 1, EconomicStability: 2, FiscalHealth: -1 },
        threatDelta: { EconomicPressure: -2 },
        economyDelta: { Unemployment: 1 },
      },
      {
        id: "G3",
        title: "Request technical intelligence support from trusted partners",
        domain: "Diplomacy",
        style: "diplomatic",
        severity: 7,
        risk: 0.17,
        legality: 0.97,
        targets: ["External"],
        statsDelta: { DiplomaticStanding: 2, NationalSecurity: 1 },
        threatDelta: { DisinformationRisk: -2 },
        economyDelta: {},
      },
      {
        id: "G4",
        title: "Run rolling public outage briefings to prevent panic buying and rumors",
        domain: "Information",
        style: "information",
        severity: 6,
        risk: 0.14,
        legality: 0.97,
        targets: ["Domestic"],
        statsDelta: { PublicConfidence: 2 },
        threatDelta: { DisinformationRisk: -4 },
        economyDelta: { StockIndex: 1 },
      },
      {
        id: "G5",
        title: "Launch a targeted liquidity and fuel-priority buffer for essential sectors",
        domain: "Economy",
        style: "economic",
        severity: 8,
        risk: 0.24,
        legality: 0.93,
        targets: ["Domestic"],
        statsDelta: { EconomicStability: 2, FiscalHealth: -2 },
        threatDelta: { EconomicPressure: -3 },
        economyDelta: { StockIndex: 2, CurrencyValue: 1 },
      },
    ],
  };

  SCENARIO_OPTION_LIBRARY.mumbai_terror.push(
    {
      id: "M6",
      title: "Create a joint police-NIA evidence cell with daily judicial oversight",
      domain: "Legal Process",
      style: "domestic",
      severity: 8,
      risk: 0.22,
      legality: 0.96,
      targets: ["Domestic"],
      statsDelta: { NationalSecurity: 2, PublicConfidence: 2, CommunalHarmony: 1 },
      threatDelta: { TerrorThreat: -2, DisinformationRisk: -2 },
      economyDelta: {},
    },
    {
      id: "M7",
      title: "Push a rapid compensation and hospital-support package for victims and responders",
      domain: "Public Relief",
      style: "economic",
      severity: 7,
      risk: 0.18,
      legality: 0.97,
      targets: ["Domestic"],
      statsDelta: { PublicConfidence: 3, CommunalHarmony: 1, FiscalHealth: -2 },
      threatDelta: { EconomicPressure: -1, DisinformationRisk: -1 },
      economyDelta: { StockIndex: 1 },
      systemsDelta: { HealthcareCapacity: 4 },
    },
    {
      id: "M8",
      title: "Quietly raise coastal surveillance and port screening without public war signalling",
      domain: "Security",
      style: "defensive",
      severity: 10,
      risk: 0.27,
      legality: 0.91,
      targets: ["Domestic"],
      statsDelta: { NationalSecurity: 3, MilitaryReadiness: 1, FiscalHealth: -1 },
      threatDelta: { TerrorThreat: -3, BorderTension: 1 },
      economyDelta: { DefenseSpending: -1 },
    },
    {
      id: "M9",
      title: "Convene all-party briefing to reduce partisan escalation pressure",
      domain: "Political Management",
      style: "domestic",
      severity: 6,
      risk: 0.16,
      legality: 0.98,
      targets: ["Domestic"],
      statsDelta: { PublicConfidence: 1, DiplomaticStanding: 1 },
      threatDelta: { DisinformationRisk: -2, EconomicPressure: -1 },
      economyDelta: {},
    },
    {
      id: "M10",
      title: "Ask major powers for private terror-finance pressure instead of public megaphone diplomacy",
      domain: "Diplomacy",
      style: "diplomatic",
      severity: 8,
      risk: 0.24,
      legality: 0.96,
      targets: ["External"],
      statsDelta: { DiplomaticStanding: 3, NationalSecurity: 1 },
      threatDelta: { TerrorThreat: -2, BorderTension: -2, EconomicPressure: -1 },
      economyDelta: { CurrencyValue: 1 },
    },
    {
      id: "M11",
      title: "Authorize a visible punitive airstrike package before attribution is fully verified",
      domain: "Kinetic Escalation",
      style: "kinetic",
      severity: 24,
      risk: 0.74,
      legality: 0.48,
      targets: ["Pakistan"],
      statsDelta: { NationalSecurity: 1, PublicConfidence: 2, DiplomaticStanding: -6, FiscalHealth: -4 },
      threatDelta: { BorderTension: 12, TerrorThreat: -2, DisinformationRisk: 5, EconomicPressure: 4 },
      economyDelta: { StockIndex: -4, CurrencyValue: -3, DefenseSpending: -4 },
    },
    {
      id: "M12",
      title: "Freeze suspected terror-linked assets through banks and enforcement agencies",
      domain: "Finance & Enforcement",
      style: "economic",
      severity: 9,
      risk: 0.3,
      legality: 0.88,
      targets: ["Domestic", "External"],
      statsDelta: { NationalSecurity: 2, EconomicStability: 1 },
      threatDelta: { TerrorThreat: -3, EconomicPressure: -1, DisinformationRisk: 1 },
      economyDelta: { StockIndex: 1 },
    },
    {
      id: "M13",
      title: "Temporarily restrict inflammatory broadcasts and push verified casualty briefings",
      domain: "Information",
      style: "information",
      severity: 8,
      risk: 0.26,
      legality: 0.78,
      targets: ["Domestic"],
      statsDelta: { CommunalHarmony: 3, PublicConfidence: 1 },
      threatDelta: { DisinformationRisk: -5 },
      economyDelta: {},
    },
    {
      id: "M14",
      title: "Expand city evacuation, school closure, and public-place security protocols for 72 hours",
      domain: "Public Safety",
      style: "domestic",
      severity: 11,
      risk: 0.32,
      legality: 0.9,
      targets: ["Domestic"],
      statsDelta: { NationalSecurity: 2, PublicConfidence: 1, FiscalHealth: -2 },
      threatDelta: { TerrorThreat: -4, EconomicPressure: 2 },
      economyDelta: { StockIndex: -1 },
      systemsDelta: { HealthcareCapacity: 2 },
    },
    {
      id: "M15",
      title: "Open a backchannel with Pakistan's civilian leadership while publicly hardening security",
      domain: "Diplomacy",
      style: "diplomatic",
      severity: 9,
      risk: 0.34,
      legality: 0.93,
      targets: ["Pakistan"],
      statsDelta: { DiplomaticStanding: 3, NationalSecurity: 1 },
      threatDelta: { BorderTension: -3, TerrorThreat: -1 },
      economyDelta: { CurrencyValue: 1 },
    },
    {
      id: "M16",
      title: "Centralize command under a national crisis cell and pause overlapping state-level orders",
      domain: "Coordination",
      style: "domestic",
      severity: 10,
      risk: 0.28,
      legality: 0.87,
      targets: ["Domestic"],
      statsDelta: { NationalSecurity: 2, PublicConfidence: 1 },
      threatDelta: { TerrorThreat: -2, DisinformationRisk: -1 },
      economyDelta: {},
      systemsDelta: { HealthcareCapacity: 2, InfrastructureIntegrity: 1 },
    }
  );

  SCENARIO_OPTION_LIBRARY.secondorder_business.push(
    {
      id: "BOAT9",
      title: "Run a 90-day smartwatch SKU cleanup and kill weak inventory before the festive push",
      domain: "Portfolio",
      style: "product",
      severity: 10,
      risk: 0.31,
      legality: 0.98,
      targets: ["Wearables"],
      statsDelta: { NationalSecurity: 3, FiscalHealth: 3, EconomicStability: 2 },
      threatDelta: { PollutionCrisis: -4, EconomicPressure: -2, TerrorThreat: -2 },
      economyDelta: { CurrencyValue: 2, StockIndex: 1 },
      systemsDelta: { SupplyChainIntegrity: 2, MarketConfidence: 1 },
    },
    {
      id: "BOAT10",
      title: "Build a service-quality dashboard and make warranty turnaround a board metric",
      domain: "Trust",
      style: "governance",
      severity: 9,
      risk: 0.2,
      legality: 0.99,
      targets: ["Customer Trust"],
      statsDelta: { PublicConfidence: 4, DiplomaticStanding: 3, NationalSecurity: 1 },
      threatDelta: { DisinformationRisk: -4, TerrorThreat: -2 },
      economyDelta: { StockIndex: 1 },
      systemsDelta: { HealthcareCapacity: 5, MarketConfidence: 2 },
    },
    {
      id: "BOAT11",
      title: "Negotiate marketplace exclusives only where unit economics stay positive",
      domain: "Channels",
      style: "market",
      severity: 9,
      risk: 0.33,
      legality: 0.96,
      targets: ["Marketplaces"],
      statsDelta: { EconomicStability: 3, FiscalHealth: 2 },
      threatDelta: { EconomicPressure: -3, BorderTension: 1 },
      economyDelta: { StockIndex: 2, CurrencyValue: 2 },
      systemsDelta: { MarketConfidence: 3 },
    },
    {
      id: "BOAT12",
      title: "Delay category expansion and protect cash until margin health crosses safe levels",
      domain: "Finance",
      style: "finance",
      severity: 8,
      risk: 0.22,
      legality: 0.98,
      targets: ["Board"],
      statsDelta: { FiscalHealth: 5, EconomicStability: 1, DiplomaticStanding: 1 },
      threatDelta: { EconomicPressure: -5, PollutionCrisis: -1 },
      economyDelta: { CurrencyValue: 3, Inflation: 1 },
      systemsDelta: { MarketConfidence: 1 },
    },
    {
      id: "BOAT13",
      title: "Acquire a small audio-tech capability team instead of buying a full competitor",
      domain: "M&A",
      style: "operations",
      severity: 12,
      risk: 0.44,
      legality: 0.94,
      targets: ["Audio"],
      statsDelta: { NationalSecurity: 4, AirQuality: 2, FiscalHealth: -3 },
      threatDelta: { PollutionCrisis: -3, EconomicPressure: 2, BorderTension: 2 },
      economyDelta: { StockIndex: 2, CurrencyValue: -1 },
      systemsDelta: { SupplyChainIntegrity: 1, MarketConfidence: 2 },
    },
    {
      id: "BOAT14",
      title: "Aggressively acquire a large rival to buy market share quickly",
      domain: "M&A",
      style: "overreach",
      severity: 23,
      risk: 0.76,
      legality: 0.86,
      targets: ["Competitors"],
      statsDelta: { EconomicStability: 2, FiscalHealth: -9, PublicConfidence: -2 },
      threatDelta: { EconomicPressure: 8, BorderTension: 7, PollutionCrisis: 5, DisinformationRisk: 3 },
      economyDelta: { StockIndex: -2, CurrencyValue: -6 },
      systemsDelta: { MarketConfidence: -4, SupplyChainIntegrity: -4 },
    },
    {
      id: "BOAT15",
      title: "Create a campus creator program to grow boAtheads without celebrity overspend",
      domain: "Brand",
      style: "brand",
      severity: 8,
      risk: 0.27,
      legality: 0.97,
      targets: ["Youth Consumers"],
      statsDelta: { PublicConfidence: 4, AirQuality: 3, FiscalHealth: -1 },
      threatDelta: { DisinformationRisk: -3, EconomicPressure: 1 },
      economyDelta: { StockIndex: 1 },
      systemsDelta: { MarketConfidence: 2 },
    },
    {
      id: "BOAT16",
      title: "Build Make-in-India supplier redundancy before promising faster launches",
      domain: "Operations",
      style: "operations",
      severity: 10,
      risk: 0.3,
      legality: 0.97,
      targets: ["Manufacturing"],
      statsDelta: { DiplomaticStanding: 2, FiscalHealth: 1, EconomicStability: 1 },
      threatDelta: { EconomicPressure: -2, PollutionCrisis: -1 },
      economyDelta: { OilPrice: 2, CurrencyValue: 1 },
      systemsDelta: { SupplyChainIntegrity: 5, OilStability: 2 },
    },
    {
      id: "BOAT17",
      title: "Cut ad spend sharply and rely on price discounts to protect volume",
      domain: "Finance",
      style: "pricing",
      severity: 14,
      risk: 0.55,
      legality: 0.93,
      targets: ["Pricing", "Brand"],
      statsDelta: { FiscalHealth: 3, PublicConfidence: -4, AirQuality: -3 },
      threatDelta: { EconomicPressure: -1, DisinformationRisk: 5, PollutionCrisis: 4 },
      economyDelta: { CurrencyValue: 2, StockIndex: -2 },
      systemsDelta: { MarketConfidence: -3 },
    },
    {
      id: "BOAT18",
      title: "Prepare IPO-readiness narrative around margin discipline, service quality, and focused growth",
      domain: "IPO Readiness",
      style: "finance",
      severity: 9,
      risk: 0.29,
      legality: 0.98,
      targets: ["Investors"],
      statsDelta: { DiplomaticStanding: 4, FiscalHealth: 3, EconomicStability: 2 },
      threatDelta: { EconomicPressure: -3, DisinformationRisk: -2 },
      economyDelta: { StockIndex: 3, CurrencyValue: 2 },
      systemsDelta: { MarketConfidence: 4 },
    },
    {
      id: "BOAT19",
      title: "Pilot one premium earbud with a 500-user quality beta before national launch",
      domain: "Product",
      style: "product",
      severity: 8,
      risk: 0.2,
      legality: 0.99,
      targets: ["Premium Audio"],
      statsDelta: { NationalSecurity: 4, PublicConfidence: 3, FiscalHealth: 1, AirQuality: 3 },
      threatDelta: { PollutionCrisis: -5, DisinformationRisk: -3, EconomicPressure: -1 },
      economyDelta: { CurrencyValue: 2, StockIndex: 1 },
      systemsDelta: { InfrastructureIntegrity: 4, MarketConfidence: 2 },
    },
    {
      id: "BOAT20",
      title: "Retire overlapping SKUs and fund only categories with repeat purchase evidence",
      domain: "Portfolio",
      style: "product",
      severity: 9,
      risk: 0.26,
      legality: 0.99,
      targets: ["Portfolio"],
      statsDelta: { FiscalHealth: 4, EconomicStability: 2, NationalSecurity: 3 },
      threatDelta: { PollutionCrisis: -6, EconomicPressure: -3, TerrorThreat: -2 },
      economyDelta: { CurrencyValue: 3, StockIndex: 1 },
      systemsDelta: { SupplyChainIntegrity: 3, MarketConfidence: 2 },
    },
    {
      id: "BOAT21",
      title: "Create a weekly contribution-margin war room by SKU and channel",
      domain: "Finance",
      style: "finance",
      severity: 8,
      risk: 0.18,
      legality: 0.99,
      targets: ["Finance", "Pricing"],
      statsDelta: { FiscalHealth: 6, EconomicStability: 2, DiplomaticStanding: 2 },
      threatDelta: { EconomicPressure: -6, DisinformationRisk: -1 },
      economyDelta: { CurrencyValue: 4, StockIndex: 2 },
      systemsDelta: { MarketConfidence: 3 },
    },
    {
      id: "BOAT22",
      title: "Pilot dealer replenishment in three cities using sell-through instead of shipment targets",
      domain: "Channels",
      style: "market",
      severity: 9,
      risk: 0.27,
      legality: 0.98,
      targets: ["Retail", "Distributors"],
      statsDelta: { EconomicStability: 4, PublicConfidence: 2, FiscalHealth: 1 },
      threatDelta: { BorderTension: -3, EconomicPressure: -2 },
      economyDelta: { StockIndex: 3, CurrencyValue: 1 },
      systemsDelta: { MarketConfidence: 4, SupplyChainIntegrity: 2 },
    },
    {
      id: "BOAT23",
      title: "Replace one celebrity burst with customer proof, comparison demos, and service stories",
      domain: "Brand",
      style: "brand",
      severity: 8,
      risk: 0.22,
      legality: 0.99,
      targets: ["Consumers", "Creators"],
      statsDelta: { PublicConfidence: 5, AirQuality: 4, FiscalHealth: 1 },
      threatDelta: { DisinformationRisk: -5, PollutionCrisis: -2 },
      economyDelta: { StockIndex: 2, CurrencyValue: 1 },
      systemsDelta: { MarketConfidence: 4 },
    },
    {
      id: "BOAT24",
      title: "Guarantee a published seven-day warranty turnaround in the top 20 cities",
      domain: "Trust",
      style: "governance",
      severity: 9,
      risk: 0.25,
      legality: 0.99,
      targets: ["Customer Trust", "Service"],
      statsDelta: { PublicConfidence: 6, DiplomaticStanding: 4, FiscalHealth: -2 },
      threatDelta: { DisinformationRisk: -5, TerrorThreat: -4, EconomicPressure: 1 },
      economyDelta: { StockIndex: 2 },
      systemsDelta: { HealthcareCapacity: 6, MarketConfidence: 4 },
    },
    {
      id: "BOAT25",
      title: "Dual-source critical batteries and chips with quarterly supplier stress tests",
      domain: "Operations",
      style: "operations",
      severity: 10,
      risk: 0.28,
      legality: 0.98,
      targets: ["Manufacturing", "Supply Chain"],
      statsDelta: { FiscalHealth: 1, DiplomaticStanding: 3, EconomicStability: 2 },
      threatDelta: { EconomicPressure: -3, PollutionCrisis: -2 },
      economyDelta: { CurrencyValue: 2, OilPrice: 2 },
      systemsDelta: { SupplyChainIntegrity: 7, OilStability: 3 },
    },
    {
      id: "BOAT26",
      title: "Enter three new categories this quarter before service and supply readiness catches up",
      domain: "Aggressive Growth",
      style: "overreach",
      severity: 18,
      risk: 0.69,
      legality: 0.9,
      targets: ["New Categories"],
      statsDelta: { EconomicStability: 2, FiscalHealth: -7, PublicConfidence: -3, AirQuality: -4 },
      threatDelta: { EconomicPressure: 8, PollutionCrisis: 8, DisinformationRisk: 5, BorderTension: 4 },
      economyDelta: { StockIndex: 1, CurrencyValue: -5 },
      systemsDelta: { SupplyChainIntegrity: -6, HealthcareCapacity: -5, MarketConfidence: -4 },
    },
    {
      id: "BOAT27",
      title: "Take a minority stake in an audio software startup with milestone-based control rights",
      domain: "M&A",
      style: "operations",
      severity: 10,
      risk: 0.34,
      legality: 0.96,
      targets: ["Audio Technology"],
      statsDelta: { NationalSecurity: 4, AirQuality: 3, FiscalHealth: -2 },
      threatDelta: { PollutionCrisis: -4, EconomicPressure: 1, BorderTension: 1 },
      economyDelta: { StockIndex: 2, CurrencyValue: 1 },
      systemsDelta: { InfrastructureIntegrity: 3, MarketConfidence: 3 },
    },
    {
      id: "BOAT28",
      title: "Build an IPO data room with audited unit economics, risk owners, and monthly controls",
      domain: "IPO Readiness",
      style: "finance",
      severity: 9,
      risk: 0.21,
      legality: 0.99,
      targets: ["Investors", "Board"],
      statsDelta: { DiplomaticStanding: 5, FiscalHealth: 4, EconomicStability: 2 },
      threatDelta: { EconomicPressure: -4, DisinformationRisk: -3 },
      economyDelta: { StockIndex: 4, CurrencyValue: 2 },
      systemsDelta: { MarketConfidence: 6 },
    }
  );

  const ROLE_LIBRARY = {
    mumbai_terror: [
      {
        id: "pm_india",
        name: "Prime Minister of India",
        description: "Full-spectrum political leader balancing security decisions, diplomacy, economy, media pressure, and cabinet control.",
      },
      {
        id: "nsa_india",
        name: "National Security Advisor",
        description: "Strategic coordinator focused on intelligence, force signaling, covert responses, and escalation management.",
      },
      {
        id: "home_india",
        name: "Home Minister",
        description: "Internal-security decision-maker focused on police response, public order, federal coordination, and communal stability.",
      },
      {
        id: "crisis_cabinet",
        name: "Emergency Crisis Cabinet Chair",
        description: "A cross-government crisis manager balancing ministries, institutional friction, and nationwide system stability.",
      },
    ],
    secondorder_business: [
      {
        id: "ceo_boat",
        name: "CEO / Co-founder",
        description: "Owns the overall trade-off between audio leadership, wearables slowdown, profitability, manufacturing, brand equity, and IPO-readiness.",
      },
      {
        id: "cfo_boat",
        name: "CFO",
        description: "Owns gross margin, discount discipline, advertising efficiency, working capital, investor confidence, and the IPO story.",
      },
      {
        id: "product_boat",
        name: "Head of Product",
        description: "Owns the product portfolio across audio, TWS, speakers, smartwatches, quality, differentiation, and premiumisation.",
      },
      {
        id: "marketing_boat",
        name: "Chief Marketing Officer",
        description: "Owns youth positioning, boAtheads community, creator campaigns, celebrity partnerships, and brand recall.",
      },
      {
        id: "category_boat",
        name: "Category Manager - Wearables",
        description: "Mid-level decision-maker managing smartwatch economics, competitor pressure, inventory, and category-level execution.",
      },
    ],
  };

  const LEADERS = ROLE_LIBRARY[DEFAULT_SCENARIO_ID];

  const DOM_IDS = {
    entryFlow: "entryFlow",
    introScreen: "introScreen",
    setupScreen: "setupScreen",
    simulationShell: "simulationShell",
    simulationNav: "simulationNav",
    simulationLayout: "simulationLayout",
    simPageHint: "simPageHint",
    firstDecisionNudge: "firstDecisionNudge",
    boardroomMeetingNavBtn: "boardroomMeetingNavBtn",
    boardroomMeetingNavTitle: "boardroomMeetingNavTitle",
    boardroomMeetingNavState: "boardroomMeetingNavState",
    boardroomMeetingNavBadge: "boardroomMeetingNavBadge",
    beginBriefingBtn: "beginBriefingBtn",
    resumeSavedBtn: "resumeSavedBtn",
    backToIntroBtn: "backToIntroBtn",
    launchSimulationBtn: "launchSimulationBtn",
    onboardingPanel: "onboardingPanel",
    onboardingTitle: "onboardingTitle",
    onboardingStepLabel: "onboardingStepLabel",
    onboardingProgress: "onboardingProgress",
    onboardingBody: "onboardingBody",
    onboardingCue: "onboardingCue",
    tourSpotlight: "tourSpotlight",
    tourCoachmark: "tourCoachmark",
    onboardingBackBtn: "onboardingBackBtn",
    onboardingNextBtn: "onboardingNextBtn",
    onboardingStartBtn: "onboardingStartBtn",
    leaderSelect: "leaderSelect",
    leaderDescription: "leaderDescription",
    scenarioDescription: "scenarioDescription",
    caseBrief: "caseBrief",
    caseBriefScreen: "caseBriefScreen",
    caseBriefScenarioName: "caseBriefScenarioName",
    caseBriefRoleName: "caseBriefRoleName",
    caseBriefStepLabel: "caseBriefStepLabel",
    caseBriefProgress: "caseBriefProgress",
    caseBriefPartNumber: "caseBriefPartNumber",
    caseBriefEyebrow: "caseBriefEyebrow",
    caseBriefTitle: "caseBriefTitle",
    caseBriefBody: "caseBriefBody",
    caseBriefCue: "caseBriefCue",
    caseBriefBackBtn: "caseBriefBackBtn",
    caseBriefPreviousBtn: "caseBriefPreviousBtn",
    caseBriefNextBtn: "caseBriefNextBtn",
    caseBriefContinueBtn: "caseBriefContinueBtn",
    changeScenarioBtn: "changeScenarioBtn",
    roleMeta: "roleMeta",
    sessionMeta: "sessionMeta",
    sessionTimerRing: "sessionTimerRing",
    sessionTimerLabel: "sessionTimerLabel",
    toleranceLabel: "toleranceLabel",
    toleranceTitle: "toleranceTitle",
    toleranceBar: "toleranceBar",
    toleranceNote: "toleranceNote",
    clockMeta: "clockMeta",
    escalationMeta: "escalationMeta",
    saveBadge: "saveBadge",
    statusLine: "statusLine",
    scenarioSelect: "scenarioSelect",
    applyScenarioBtn: "applyScenarioBtn",
    connectFileBtn: "connectFileBtn",
    exportBtn: "exportBtn",
    importInput: "importInput",
    resetBtn: "resetBtn",
    tickToggleBtn: "tickToggleBtn",
    reloadBtn: "reloadBtn",
    scenarioImage: "scenarioImage",
    dashboardTitle: "dashboardTitle",
    timerPanelTitle: "timerPanelTitle",
    decisionConsoleTitle: "decisionConsoleTitle",
    priorityModeDetails: "priorityModeDetails",
    prioritySummary: "prioritySummary",
    priorityPicker: "priorityPicker",
    reflectionPanel: "reflectionPanel",
    reflectionPrompt: "reflectionPrompt",
    reflectionDecisionLabel: "reflectionDecisionLabel",
    reflectionQuestionList: "reflectionQuestionList",
    reflectionInput: "reflectionInput",
    reflectionSaveBtn: "reflectionSaveBtn",
    decisionPreview: "decisionPreview",
    advisorChallenge: "advisorChallenge",
    meetingPanelTitle: "meetingPanelTitle",
    briefingPanelTitle: "briefingPanelTitle",
    impactPanelTitle: "impactPanelTitle",
    domesticPanelTitle: "domesticPanelTitle",
    sentimentPanelTitle: "sentimentPanelTitle",
    headlinesPanelTitle: "headlinesPanelTitle",
    worldPanelTitle: "worldPanelTitle",
    economyPanelTitle: "economyPanelTitle",
    leadershipPanelTitle: "leadershipPanelTitle",
    liveMediaTitle: "liveMediaTitle",
    liveMediaCaption: "liveMediaCaption",
    liveMediaLink: "liveMediaLink",
    heatMaps: "heatMaps",
    liveFeedSummary: "liveFeedSummary",
    alertFeed: "alertFeed",
    crisisTimerList: "crisisTimerList",
    pendingList: "pendingList",
    optionsWrap: "optionsWrap",
    customAction: "customAction",
    analysisMeta: "analysisMeta",
    executeBtn: "executeBtn",
    meetingPanel: "meetingPanel",
    boardroomTransition: "boardroomTransition",
    boardroomWorkspace: "boardroomWorkspace",
    boardroomPromptChips: "boardroomPromptChips",
    meetingTimerBadge: "meetingTimerBadge",
    meetingChatLog: "meetingChatLog",
    meetingInput: "meetingInput",
    sendMeetingBtn: "sendMeetingBtn",
    ollamaModelInput: "ollamaModelInput",
    ollamaTestBtn: "ollamaTestBtn",
    ollamaStatus: "ollamaStatus",
    meetingNotice: "meetingNotice",
    exitMeetingBtn: "exitMeetingBtn",
    outcomeSummary: "outcomeSummary",
    outcome: "outcome",
    operationsPanel: "operationsPanel",
    operationsTitle: "operationsTitle",
    operationsBadge: "operationsBadge",
    operationsVisual: "operationsVisual",
    operationsInputLabel: "operationsInputLabel",
    militaryOperationInput: "militaryOperationInput",
    executeMilitaryOperationBtn: "executeMilitaryOperationBtn",
    covertPanel: "covertPanel",
    covertTitle: "covertTitle",
    covertBadge: "covertBadge",
    covertOpsList: "covertOpsList",
    emergencyStrategyPanel: "emergencyStrategyPanel",
    emergencyCrisisBadge: "emergencyCrisisBadge",
    strategyRoomBoardroomVisual: "strategyRoomBoardroomVisual",
    strategyRoomCrisisKicker: "strategyRoomCrisisKicker",
    strategyRoomCrisisTitle: "strategyRoomCrisisTitle",
    controversyRoomBriefing: "controversyRoomBriefing",
    controversyTracker: "controversyTracker",
    controversyMediaWall: "controversyMediaWall",
    crisisControlStrip: "crisisControlStrip",
    controversyResponseOptions: "controversyResponseOptions",
    publicStatementOptions: "publicStatementOptions",
    controversyMajorDecisions: "controversyMajorDecisions",
    controversyMeetingBtn: "controversyMeetingBtn",
    controversyLiveFeed: "controversyLiveFeed",
    controversyModal: "controversyModal",
    crisisTransition: "crisisTransition",
    controversyModalCard: "controversyModalCard",
    controversyModalKicker: "controversyModalKicker",
    controversyModalTitle: "controversyModalTitle",
    controversyModalSeverity: "controversyModalSeverity",
    controversyNewspaper: "controversyNewspaper",
    controversyTweet: "controversyTweet",
    controversyVideo: "controversyVideo",
    controversyReel: "controversyReel",
    controversyModalSentiment: "controversyModalSentiment",
    controversyGoRoomBtn: "controversyGoRoomBtn",
    controversyModalCloseBtn: "controversyModalCloseBtn",
    intelBriefing: "intelBriefing",
    intelConfidenceBadge: "intelConfidenceBadge",
    domesticGrid: "domesticGrid",
    sentimentGrid: "sentimentGrid",
    headlineFeed: "headlineFeed",
    tabDomesticBtn: "tabDomesticBtn",
    tabWorldBtn: "tabWorldBtn",
    tabEconomyBtn: "tabEconomyBtn",
    tabDomesticPanel: "tabDomesticPanel",
    tabWorldPanel: "tabWorldPanel",
    tabEconomyPanel: "tabEconomyPanel",
    impactCompareStrip: "impactCompareStrip",
    impactCompareStatus: "impactCompareStatus",
    viewPreDecisionBtn: "viewPreDecisionBtn",
    viewCurrentScenarioBtn: "viewCurrentScenarioBtn",
    globalReactionFeed: "globalReactionFeed",
    economyGrid: "economyGrid",
    businessScorecardPanel: "businessScorecardPanel",
    standardImpactTabs: "standardImpactTabs",
    businessKpiGrid: "businessKpiGrid",
    businessTrendChart: "businessTrendChart",
    businessHealthDonut: "businessHealthDonut",
    businessHealthScore: "businessHealthScore",
    businessHealthLegend: "businessHealthLegend",
    businessScorecardMetrics: "businessScorecardMetrics",
    businessHeadlineDeck: "businessHeadlineDeck",
    companyStockMarket: "companyStockMarket",
    companyStockPrice: "companyStockPrice",
    companyStockChange: "companyStockChange",
    companyStockDirection: "companyStockDirection",
    companyStockChart: "companyStockChart",
    companyStockOpen: "companyStockOpen",
    companyStockHigh: "companyStockHigh",
    companyStockLow: "companyStockLow",
    companyStockVolume: "companyStockVolume",
    companyStockFundamentals: "companyStockFundamentals",
    leadershipCard: "leadershipCard",
    leadershipBadge: "leadershipBadge",
    leadershipPanel: "leadershipPanel",
    sessionReportPanel: "sessionReportPanel",
    sessionReportContent: "sessionReportContent",
    reportRestartBtn: "reportRestartBtn",
    reportSetupBtn: "reportSetupBtn",
  };

  function createFallbackElement(id) {
    const isCanvas = id.toLowerCase().includes("canvas");
    const node = document.createElement(isCanvas ? "canvas" : "div");
    node.id = `${id}-fallback`;
    if (isCanvas) {
      node.width = 640;
      node.height = 320;
    }
    return node;
  }

  const missingDomIds = [];
  const els = {};
  Object.keys(DOM_IDS).forEach((key) => {
    const id = DOM_IDS[key];
    const node = document.getElementById(id);
    if (node) {
      els[key] = node;
      return;
    }
    missingDomIds.push(id);
    els[key] = createFallbackElement(id);
  });

  let state = null;
  let selectedOptionIds = new Set();
  let connectedFileHandle = null;
  let dynamicEngineOn = true;
  let tickTimer = null;
  let uiTimer = null;
  let marketUiTick = 0;
  let lastSavedAt = "";
  let hasSavedCampaign = false;
  let activeInsightTab = "domestic";
  let activeSimulationPage = "command";
  let impactSnapshotMode = false;
  let boardroomEntering = false;
  const deskView = { category: null, compare: false, visited: new Set() };
  const hubView = { roundId: null, visible: {}, inspector: null, pendingPrompt: "" };
  let lastDeskMarkup = "";
  let lastHubMarkup = "";
  let crisisEntering = false;
  let crisisTransitionTimer = null;
  let onboardingStep = 0;
  let caseBriefStep = 0;
  let caseBriefDirection = "forward";
  let tourPositionRaf = null;
  let ollamaBusy = false;
  let ollamaEventBusy = false;
  let ollamaImpactBusy = false;
  let aiBoardroomBusy = false;
  let boardroomRequestController = null;
  let ollamaStatus = "Ollama optional. Fallback rules active.";

  if (missingDomIds.length) {
    console.warn(`Missing DOM nodes detected: ${missingDomIds.join(", ")}`);
  }

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  function seededRandom(seed) {
    let t = seed + 0x6d2b79f5;
    return function () {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadOllamaSettings() {
    try {
      const raw = localStorage.getItem(OLLAMA_SETTINGS_KEY);
      if (!raw) return { model: DEFAULT_OLLAMA_MODEL };
      const parsed = JSON.parse(raw);
      return { model: parsed.model || DEFAULT_OLLAMA_MODEL };
    } catch {
      return { model: DEFAULT_OLLAMA_MODEL };
    }
  }

  function saveOllamaSettings() {
    try {
      localStorage.setItem(OLLAMA_SETTINGS_KEY, JSON.stringify({ model: els.ollamaModelInput.value.trim() || DEFAULT_OLLAMA_MODEL }));
    } catch {
      // Local model selection is a convenience setting; the simulation can run without it.
    }
  }

  function renderOllamaControls() {
    if (!els.ollamaModelInput || !els.ollamaStatus) return;
    const controls = els.ollamaModelInput.closest(".llm-controls");
    if (controls) controls.classList.add("hidden");
    els.ollamaTestBtn.disabled = true;
    els.sendMeetingBtn.disabled = false;
  }

  function setOllamaStatus(text, isError = false) {
    ollamaStatus = text;
    if (els.ollamaStatus) {
      els.ollamaStatus.textContent = text;
      els.ollamaStatus.classList.toggle("error-text", Boolean(isError));
    }
  }

  function ollamaConnectionHelp(error) {
    const detail = error && error.message ? error.message : "connection failed";
    if (window.location.protocol === "file:") {
      return `SecondOrder is opened as file://, so the browser blocks reliable Ollama access. Close this tab, double-click "Start SecondOrder.cmd", then use http://localhost:8000/pm-interface.html. Detail: ${detail}`;
    }
    return `Ollama not reachable from ${window.location.origin}. Open Ollama, or quit Ollama fully and launch with "Start SecondOrder.cmd" so OLLAMA_ORIGINS includes this app. Detail: ${detail}`;
  }

  function weightedPick(items, key, rand) {
    const total = items.reduce((s, x) => s + Number(x[key] || 0), 0);
    if (!Number.isFinite(total) || total <= 0) return items[0];
    const r = rand() * total;
    let c = 0;
    for (const item of items) {
      c += Number(item[key] || 0);
      if (r <= c) return item;
    }
    return items[items.length - 1];
  }

  function chance(randomFn, probability) {
    const p = Math.max(0, Math.min(1, Number(probability) || 0));
    return randomFn() < p;
  }

  function isBadMetric(key) {
    return BAD_METRICS.has(key);
  }

  function band(value, bad = false) {
    if (!bad) {
      if (value >= 80) return "Strong";
      if (value >= 65) return "Stable";
      if (value >= 45) return "Strained";
      if (value >= 25) return "Weak";
      return "Fragile";
    }
    if (value >= 80) return "Critical";
    if (value >= 65) return "High";
    if (value >= 45) return "Elevated";
    if (value >= 25) return "Managed";
    return "Low";
  }

  function stageFromEscalation(index) {
    let stage = ESCALATION_LADDER[0].label;
    ESCALATION_LADDER.forEach((s) => {
      if (index >= s.min) stage = s.label;
    });
    return stage;
  }

  function businessStageFromPressure(index) {
    let stage = BUSINESS_PRESSURE_LADDER[0].label;
    BUSINESS_PRESSURE_LADDER.forEach((s) => {
      if (index >= s.min) stage = s.label;
    });
    return stage;
  }

  function stageForState(stateObj, index = stateObj.escalationIndex) {
    return isBusinessScenario(stateObj) ? businessStageFromPressure(index) : stageFromEscalation(index);
  }

  function formatTime(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${da} ${h}:${min}`;
  }

  function addMinutes(iso, minutes) {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  }

  function minutesFromNowIso(durationMs) {
    return new Date(Date.now() + durationMs).toISOString();
  }

  function remainingMs(iso) {
    if (!iso) return 0;
    return Math.max(0, new Date(iso).getTime() - Date.now());
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentScenario(stateObj = state) {
    return SCENARIOS.find((item) => item.id === stateObj.scenarioId) || SCENARIOS[0];
  }

  function isBusinessScenario(stateObj = state) {
    return Boolean(stateObj && stateObj.scenarioId === BUSINESS_SCENARIO_ID);
  }

  function toleranceMaximum(stateObj = state) {
    return isBusinessScenario(stateObj) ? BOARD_TOLERANCE_MAX : CONSTITUTIONAL_TOLERANCE_MAX;
  }

  function tolerancePercent(stateObj = state) {
    return clamp(((stateObj.toleranceLoad || 0) / toleranceMaximum(stateObj)) * 100);
  }

  function validScenarioId(id) {
    return SCENARIOS.some((scenario) => scenario.id === id) ? id : DEFAULT_SCENARIO_ID;
  }

  function getLeadersForScenario(scenarioId = DEFAULT_SCENARIO_ID) {
    return ROLE_LIBRARY[validScenarioId(scenarioId)] || ROLE_LIBRARY[DEFAULT_SCENARIO_ID];
  }

  function getAdvisorsForScenario(stateObj = state) {
    return isBusinessScenario(stateObj) ? BUSINESS_ADVISORS : ADVISORS;
  }

  function getMetricLabel(key, stateObj = state) {
    const overrides = stateObj ? SCENARIO_LABELS[stateObj.scenarioId] : null;
    return (overrides && overrides[key]) || LABELS[key] || key;
  }

  function roleFormOfAddress(stateObj = state) {
    const map = {
      pm_india: "Prime Minister",
      nsa_india: "Advisor",
      home_india: "Minister",
      crisis_cabinet: "Chair",
      ceo_boat: "CEO",
      cfo_boat: "CFO",
      product_boat: "Product Head",
      marketing_boat: "CMO",
      category_boat: "Category Manager",
    };
    return map[stateObj.roleId] || stateObj.roleName || "Sir";
  }

  function addressLeader(stateObj = state) {
    return roleFormOfAddress(stateObj);
  }

  function composeStrategicSummary(stateObj, type, context = {}) {
    const latestReaction = stateObj.globalReactions[0];
    const latestAlert = stateObj.alerts[0];
    const recentOutcome = stateObj.history[0];

    if (type === "live") {
      if (isBusinessScenario(stateObj)) {
        const topPressure = [
          `retailer confidence ${stateObj.systems.MarketConfidence}/100`,
          `portfolio strength ${stateObj.stats.NationalSecurity}/100`,
          `margin pressure ${stateObj.threats.EconomicPressure}/100`,
        ].join(", ");
        const linkedOutcome = recentOutcome ? `Latest decision effect: ${recentOutcome.title} led to ${recentOutcome.outcome}.` : "No recent decision is shaping the business case yet.";
        const reactionLine = latestReaction ? `${latestReaction.actor} is currently the most visible stakeholder responder.` : "Stakeholders are waiting for the first concrete move.";
        return `Business case model: the live picture is being driven by ${topPressure}. ${reactionLine} ${linkedOutcome}`;
      }
      const topPressure = [
        `terror ${stateObj.threats.TerrorThreat}/100`,
        `border ${stateObj.threats.BorderTension}/100`,
        `economic ${stateObj.threats.EconomicPressure}/100`,
      ].join(", ");
      const linkedOutcome = recentOutcome ? `Latest decision effect: ${recentOutcome.title} led to ${recentOutcome.outcome}.` : "No recent decision is shaping the live feed yet.";
      const reactionLine = latestReaction ? `${latestReaction.actor} is currently the most visible outside responder.` : "External actors are still assessing the situation.";
      return `Strategic briefing model: the live picture is being driven by ${topPressure}. ${reactionLine} ${linkedOutcome}`;
    }

    if (type === "consequence") {
      const nextEvent = (stateObj.pendingEvents || [])
        .slice()
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];
      const nextPressure = nextEvent
        ? nextEvent.description
        : "No immediate delayed reaction queued.";
      if (isBusinessScenario(stateObj)) {
        return `${context.outcomeLabel || "Decision logged"} | Retailer confidence ${stateObj.systems.MarketConfidence}/100 | Margin health ${stateObj.stats.FiscalHealth}/100 | Brand love ${stateObj.stats.PublicConfidence}/100 | Next: ${nextPressure}`;
      }
      return `${context.outcomeLabel || "Decision logged"} | Stage ${stateObj.escalationStage} | Trust ${stateObj.sentiment.TrustInGovernment}/100 | Panic ${stateObj.sentiment.PanicLevel}/100 | Next: ${nextPressure}`;
    }

    if (type === "meeting") {
      return getAdvisorsForScenario(stateObj).map((advisor) => {
        const advice = generateMeetingSummaryCard(advisor, stateObj);
        return {
          id: advisor.id,
          name: advisor.name,
          text: advice,
        };
      });
    }

    return "Strategic model unavailable.";
  }

  function relationToIndia(actorName) {
    const map = {
      India: 100,
      Pakistan: -95,
      China: -56,
      USA: 34,
      EU: 24,
      Russia: 10,
      UN: 0,
    };
    return map[actorName] ?? 0;
  }

  function createActors() {
    return {
      India: {
        militaryCapability: 84,
        ideology: "Federal Democracy",
        riskTolerance: 54,
        allianceCommitments: 58,
        domesticStability: 62,
        economicResilience: 64,
        nuclearState: true,
        doctrine: { retaliationBase: 0.95, launchOnWarning: 0.26, secondStrike: true },
      },
      Pakistan: {
        militaryCapability: 67,
        ideology: "Civil-Military Hybrid",
        riskTolerance: 63,
        allianceCommitments: 72,
        domesticStability: 44,
        economicResilience: 39,
        nuclearState: true,
        doctrine: { retaliationBase: 0.96, launchOnWarning: 0.52, secondStrike: true },
      },
      China: {
        militaryCapability: 90,
        ideology: "Party-State",
        riskTolerance: 49,
        allianceCommitments: 64,
        domesticStability: 70,
        economicResilience: 75,
        nuclearState: true,
        doctrine: { retaliationBase: 0.91, launchOnWarning: 0.33, secondStrike: true },
      },
      USA: {
        militaryCapability: 96,
        ideology: "Presidential Democracy",
        riskTolerance: 44,
        allianceCommitments: 88,
        domesticStability: 61,
        economicResilience: 85,
        nuclearState: true,
        doctrine: { retaliationBase: 0.98, launchOnWarning: 0.61, secondStrike: true },
      },
      EU: {
        militaryCapability: 58,
        ideology: "Liberal Institutional",
        riskTolerance: 26,
        allianceCommitments: 79,
        domesticStability: 68,
        economicResilience: 78,
        nuclearState: false,
        doctrine: { retaliationBase: 0, launchOnWarning: 0, secondStrike: false },
      },
      Russia: {
        militaryCapability: 82,
        ideology: "Centralized Executive",
        riskTolerance: 57,
        allianceCommitments: 46,
        domesticStability: 55,
        economicResilience: 53,
        nuclearState: true,
        doctrine: { retaliationBase: 0.97, launchOnWarning: 0.58, secondStrike: true },
      },
      UN: {
        militaryCapability: 5,
        ideology: "Multilateral",
        riskTolerance: 5,
        allianceCommitments: 100,
        domesticStability: 80,
        economicResilience: 10,
        nuclearState: false,
        doctrine: { retaliationBase: 0, launchOnWarning: 0, secondStrike: false },
      },
    };
  }

  function baseState(scenarioId = DEFAULT_SCENARIO_ID) {
    scenarioId = validScenarioId(scenarioId);
    const now = new Date("2026-03-09T08:00:00.000Z").toISOString();
    const defaultRole = getLeadersForScenario(scenarioId)[0];
    const s = {
      version: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenarioId,
      pmName: defaultRole.name,
      roleId: defaultRole.id,
      roleName: defaultRole.name,
      onboardingComplete: false,
      sessionEndsAt: null,
      analysisWindowEndsAt: null,
      meetingUsed: false,
      meetingActive: false,
      meetingEndsAt: null,
      meetingStartedAt: null,
      boardroomClockPause: null,
      meetingChat: [],
      meetingRounds: [],
      sessionReportShown: false,
      dismissed: false,
      dismissalReason: "",
      dismissalAt: null,
      redLineViolations: 0,
      toleranceLoad: 0,
      accountabilityNote: "No red-line pressure yet.",
      strategicAttackOnIndia: false,
      justifiedRetaliationUntil: null,
      decisionMetrics: {
        total: 0,
        aggressive: 0,
        diplomatic: 0,
        domestic: 0,
        economic: 0,
        informational: 0,
        legalWeight: 0,
        riskWeight: 0,
        successCount: 0,
        partialCount: 0,
        failureCount: 0,
        product: 0,
        sales: 0,
        finance: 0,
        trust: 0,
        focus: 0,
        ethicalRisk: 0,
      },
      decisionReviews: [],
      dynamicEventHistory: [],
      lastImpactLedger: [],
      lastPreDecisionSnapshot: null,
      lastCausalNotes: [],
      lastRealityAudit: null,
      decisionPriorities: [],
      firstDecisionNudgeDismissed: false,
      reflections: [],
      pendingReflection: null,
      reflectionPromptsShown: 0,
      lastReflectionPromptAt: null,
      emergencyControversy: {
        active: false,
        current: null,
        history: [],
        triggeredCount: 0,
        popupOpen: false,
        lastTriggerDecision: 0,
        responseEndsAt: null,
        nextActionAt: null,
        windowExpired: false,
        missedWindowApplied: false,
        statementIssuedThisSession: false,
        statementIssuedAt: null,
        statementChoiceId: null,
      },
      outcomeSummary: "Decision summary will appear here after you act.",
      outcomeText: "No decision executed yet.",
      liveFeedSummary: "Strategic live summary will appear here.",
      turn: 1,
      clock: now,
      tickMinutes: TICK_MINUTES,
      escalationIndex: 28,
      escalationStage: stageFromEscalation(28),
      leadership: 62,
      stats: {
        NationalSecurity: 46,
        MilitaryReadiness: 68,
        PublicConfidence: 44,
        CommunalHarmony: 52,
        EconomicStability: 58,
        FiscalHealth: 55,
        DiplomaticStanding: 62,
        AirQuality: 38,
      },
      threats: {
        TerrorThreat: 84,
        BorderTension: 72,
        EconomicPressure: 57,
        PollutionCrisis: 79,
        DisinformationRisk: 67,
      },
      domestic: {
        ParliamentApproval: 52,
        OppositionPressure: 48,
        MediaHostility: 46,
        ProtestRisk: 34,
        ElectionPressure: 39,
      },
      sentiment: {
        TrustInGovernment: 49,
        PanicLevel: 58,
        Nationalism: 62,
        CommunalTension: 47,
      },
      economy: {
        StockIndex: 61,
        CurrencyValue: 57,
        OilPrice: 54,
        Inflation: 49,
        Unemployment: 56,
        DefenseSpending: 58,
      },
      systems: {
        MarketConfidence: 59,
        OilStability: 56,
        SupplyChainIntegrity: 63,
        InfrastructureIntegrity: 71,
        HealthcareCapacity: 61,
        RefugeePressure: 21,
      },
      adaptation: {
        guerrillaShift: 24,
        blackMarketNetwork: 22,
        cyberHardening: 29,
        misinformationAgility: 31,
      },
      actors: createActors(),
      alliances: deepClone(ALLIANCES),
      military: {
        airSquadrons: [
          { id: "air-1", name: "Western Air Command", region: "Northwest", readiness: 74 },
          { id: "air-2", name: "Central Air Command", region: "Central", readiness: 71 },
        ],
        navalFleets: [
          { id: "navy-1", name: "Western Fleet", region: "Arabian Sea", readiness: 69 },
          { id: "navy-2", name: "Eastern Fleet", region: "Bay of Bengal", readiness: 67 },
        ],
        missileDefense: { active: false, effectiveness: 62 },
        specialForces: { deployed: 1, readiness: 76 },
        satellites: { operational: 84 },
        operationLog: [],
      },
      hotspots: [
        { id: "hs-1", type: "terror", region: "Mumbai", severity: 74 },
        { id: "hs-2", type: "drone", region: "LoC Sector-7", severity: 68 },
        { id: "hs-3", type: "naval", region: "Arabian Sea", severity: 52 },
      ],
      alerts: [],
      intelligence: {
        confidence: 64,
        reports: [],
      },
      headlines: [],
      globalReactions: [],
      crisisTimers: [
        { id: "timer-1", label: "Terror Plot Window", hoursLeft: 18, severity: 78, onExpire: "terror_strike" },
        { id: "timer-2", label: "Cyberattack Containment", hoursLeft: 6, severity: 66, onExpire: "cyber_breach" },
        { id: "timer-3", label: "Parliament Vote", hoursLeft: 12, severity: 58, onExpire: "parliament_crisis" },
      ],
      pendingEvents: [],
      history: [],
      fogOfWar: {
        uncertainty: 36,
      },
    };

    applyScenarioPreset(s, scenarioId);
    s.metricBaselines = captureMetricBaselines(s);
    seedInitialNarrative(s);
    return s;
  }

  function captureMetricBaselines(stateObj) {
    return {
      ...stateObj.stats,
      ...stateObj.threats,
      ...stateObj.domestic,
      ...stateObj.sentiment,
      ...stateObj.economy,
      ...stateObj.systems,
      escalationIndex: stateObj.escalationIndex,
      leadership: stateObj.leadership,
      toleranceLoad: stateObj.toleranceLoad || 0,
    };
  }

  function capturePreDecisionSnapshot(stateObj, decisionTitle = "Next decision") {
    return {
      capturedAt: stateObj.clock,
      decisionTitle,
      scenarioId: stateObj.scenarioId,
      roleName: stateObj.roleName,
      escalationIndex: stateObj.escalationIndex,
      escalationStage: stateObj.escalationStage,
      leadership: stateObj.leadership,
      stats: deepClone(stateObj.stats),
      threats: deepClone(stateObj.threats),
      domestic: deepClone(stateObj.domestic),
      sentiment: deepClone(stateObj.sentiment),
      economy: deepClone(stateObj.economy),
      systems: deepClone(stateObj.systems),
      headlines: deepClone(stateObj.headlines || []),
      globalReactions: deepClone(stateObj.globalReactions || []),
    };
  }

  function storePreDecisionSnapshot(stateObj, decisionTitle) {
    stateObj.lastPreDecisionSnapshot = capturePreDecisionSnapshot(stateObj, decisionTitle);
  }

  function activePreDecisionSnapshot() {
    const snapshot = state.lastPreDecisionSnapshot;
    if (!impactSnapshotMode || !snapshot || typeof snapshot !== "object") return null;
    return snapshot;
  }

  function impactViewSource() {
    return activePreDecisionSnapshot() || state;
  }

  function impactViewLabel() {
    const snapshot = activePreDecisionSnapshot();
    if (!snapshot) return "Current live scenario";
    return `Before last decision: ${snapshot.decisionTitle || "decision"} at ${formatTime(snapshot.capturedAt || state.clock)}`;
  }

  function renderImpactCompareControls() {
    if (!els.impactCompareStrip || !els.impactCompareStatus || !els.viewPreDecisionBtn || !els.viewCurrentScenarioBtn) return;
    const snapshot = state.lastPreDecisionSnapshot;
    const activeSnapshot = activePreDecisionSnapshot();
    els.impactCompareStatus.textContent = snapshot
      ? impactViewLabel()
      : "No decision snapshot yet. Make a decision first.";
    els.viewPreDecisionBtn.disabled = !snapshot || Boolean(activeSnapshot);
    els.viewCurrentScenarioBtn.disabled = !activeSnapshot;
    els.impactCompareStrip.classList.toggle("snapshot-active", Boolean(activeSnapshot));
  }
  function metricBaselineForKey(key, stateObj = state) {
    const baselines = stateObj && stateObj.metricBaselines;
    if (!baselines || !Number.isFinite(baselines[key])) return null;
    return clamp(Math.round(baselines[key]));
  }

  function applyScenarioPreset(stateObj, scenarioId) {
    if (scenarioId === "india_china_border") {
      stateObj.threats.BorderTension = 86;
      stateObj.threats.TerrorThreat = 58;
      stateObj.escalationIndex = 44;
      stateObj.military.navalFleets[1].region = "Andaman Sea";
      stateObj.hotspots.push({ id: "hs-b1", type: "troops", region: "Ladakh", severity: 82 });
      stateObj.crisisTimers[0] = { id: "timer-b1", label: "Border Incursion Window", hoursLeft: 10, severity: 82, onExpire: "border_skirmish" };
    }

    if (scenarioId === "mumbai_terror") {
      stateObj.threats.TerrorThreat = 91;
      stateObj.threats.DisinformationRisk = 74;
      stateObj.sentiment.PanicLevel = 64;
      stateObj.hotspots.push({ id: "hs-m1", type: "terror", region: "Mumbai Transit", severity: 92 });
      stateObj.crisisTimers[0] = { id: "timer-m1", label: "Second-Wave Attack Risk", hoursLeft: 8, severity: 88, onExpire: "terror_strike" };
    }

    if (scenarioId === BUSINESS_SCENARIO_ID) {
      stateObj.escalationIndex = 38;
      stateObj.stats = {
        NationalSecurity: 67,
        MilitaryReadiness: 59,
        PublicConfidence: 76,
        CommunalHarmony: 54,
        EconomicStability: 61,
        FiscalHealth: 43,
        DiplomaticStanding: 72,
        AirQuality: 58,
      };
      stateObj.threats = {
        TerrorThreat: 58,
        BorderTension: 79,
        EconomicPressure: 76,
        PollutionCrisis: 71,
        DisinformationRisk: 46,
      };
      stateObj.domestic = {
        ParliamentApproval: 55,
        OppositionPressure: 68,
        MediaHostility: 52,
        ProtestRisk: 44,
        ElectionPressure: 74,
      };
      stateObj.sentiment = {
        TrustInGovernment: 69,
        PanicLevel: 51,
        Nationalism: 78,
        CommunalTension: 48,
      };
      stateObj.economy = {
        StockIndex: 57,
        CurrencyValue: 42,
        OilPrice: 49,
        Inflation: 45,
        Unemployment: 61,
        DefenseSpending: 53,
      };
      stateObj.systems = {
        MarketConfidence: 58,
        OilStability: 44,
        SupplyChainIntegrity: 52,
        InfrastructureIntegrity: 64,
        HealthcareCapacity: 47,
        RefugeePressure: 55,
      };
      stateObj.hotspots = [
        { id: "biz-1", type: "audio", region: "Premium Audio Bet", severity: 64 },
        { id: "biz-2", type: "wearables", region: "Smartwatch Price War", severity: 82 },
        { id: "biz-3", type: "channels", region: "Marketplace vs Offline Mix", severity: 69 },
        { id: "biz-4", type: "service", region: "Warranty & Service Backlog", severity: 58 },
      ];
      stateObj.military.operationLog = [];
      stateObj.crisisTimers = [
        { id: "timer-biz1", label: "Marketplace Discount Deadline", hoursLeft: 5.5, initialHours: 5.5, severity: 78, onExpire: "pricing_pushback" },
        { id: "timer-biz2", label: "Wearables Portfolio Decision", hoursLeft: 6.5, initialHours: 6.5, severity: 82, onExpire: "pilot_delay" },
        { id: "timer-biz3", label: "Investor IPO Credibility Review", hoursLeft: 7.5, initialHours: 7.5, severity: 74, onExpire: "runway_pressure" },
        { id: "timer-biz4", label: "Warranty Backlog Escalation", hoursLeft: 4.5, initialHours: 4.5, severity: 66, onExpire: "trust_crisis" },
      ];
    }

    if (scenarioId === "indopacific_standoff") {
      stateObj.threats.BorderTension = 78;
      stateObj.threats.EconomicPressure = 68;
      stateObj.economy.OilPrice = 42;
      stateObj.hotspots.push({ id: "hs-i1", type: "naval", region: "Indian Ocean", severity: 83 });
      stateObj.crisisTimers[0] = { id: "timer-i1", label: "Naval Intercept Risk", hoursLeft: 14, severity: 76, onExpire: "naval_clash" };
    }

    if (scenarioId === "grid_cyber_war") {
      stateObj.threats.DisinformationRisk = 88;
      stateObj.threats.EconomicPressure = 74;
      stateObj.systems.InfrastructureIntegrity = 54;
      stateObj.systems.MarketConfidence = 48;
      stateObj.hotspots.push({ id: "hs-c1", type: "cyber", region: "Maharashtra Grid", severity: 86 });
      stateObj.crisisTimers[0] = { id: "timer-c1", label: "Grid Recovery Window", hoursLeft: 5, severity: 84, onExpire: "cyber_breach" };
    }

    stateObj.escalationStage = stageForState(stateObj);
  }

  function seedInitialNarrative(stateObj) {
    const openingAlerts = {
      india_china_border: [
        ["border", "Forward surveillance reports repeated probing activity and new field fortifications along sensitive sectors."],
        ["military", "Indian formations remain on elevated readiness as the frontier command anticipates a coercive signalling cycle."],
        ["economy", "Markets are pricing a longer Himalayan standoff and a possible drag on logistics, insurance, and fuel confidence."],
      ],
      mumbai_terror: [
        ["terror", "Intercepts suggest surviving handlers are still trying to move operatives, propaganda, and panic into the city."],
        ["security", "Hospitals, transit hubs, hotels, and police control rooms are under continuous pressure after the mass-casualty incident."],
        ["economy", "Tourism, hospitality, transport, and insurance desks are repricing Mumbai risk within hours of the attack."],
      ],
      secondorder_business: [
        ["market", "boAt remains culturally strong with young consumers, but wearables pricing pressure is testing whether volume-led growth can still protect margins."],
        ["product", "The case pressure is shifting from launch speed to portfolio discipline: audio premiumisation, smartwatch rationalisation, and service quality."],
        ["finance", "Investors are watching whether advertising spend, discounting, inventory, and domestic manufacturing can support an IPO-ready profitability story."],
      ],
      indopacific_standoff: [
        ["naval", "Commercial traffic advisories flag elevated naval shadowing and possible interference near major sea-lane chokepoints."],
        ["military", "Indian maritime patrol assets are tracking denser foreign movement across exposed Indian Ocean corridors."],
        ["economy", "Shipping insurers and energy traders are widening risk premiums as the naval standoff deepens."],
      ],
      grid_cyber_war: [
        ["cyber", "Grid telemetry shows coordinated anomalies across dispatch, telecom, and backup-control layers in multiple states."],
        ["infrastructure", "Restoration crews are struggling to stabilize affected substations while outage rumors outrun verified information."],
        ["economy", "Banks, logistics operators, and industrial users are warning that prolonged outages will compound economic losses."],
      ],
      default: [
        ["terror", "Coordinated terror alerts persist across major transport nodes."],
        ["military", "Border surveillance indicates elevated troop readiness in adjacent sectors."],
        ["economy", "Currency volatility is increasing as global energy prices fluctuate."],
      ],
    };

    (openingAlerts[stateObj.scenarioId] || openingAlerts.default).forEach(([level, text]) => {
      pushAlert(stateObj, level, text);
    });
    seedOpeningWorldReactions(stateObj);
    refreshHeadlines(stateObj);
    refreshIntelReport(stateObj);
    refreshStrategicSummaries(stateObj);
  }

  function seedOpeningWorldReactions(stateObj) {
    if (stateObj.globalReactions.length) return;

    const scenarioId = stateObj.scenarioId || "default";
    const opening = {
      india_china_border: [
        ["China", "Foreign ministry calls Indian movements provocative while PLA channels remain active along the frontier.", "hostile"],
        ["United States", "Indo-Pacific desk requests de-escalation and quietly offers satellite deconfliction support.", "supportive"],
        ["Russia", "Offers a military-to-military hotline format to prevent patrol-level incidents from turning strategic.", "neutral"],
        ["Global Markets", "Asia risk desks mark Indian and Chinese defense-linked equities higher while broader markets turn cautious.", "concerned"],
      ],
      mumbai_terror: [
        ["UN Security Council", "Members condemn the attack and request evidence before any cross-border attribution is accepted.", "supportive"],
        ["United States", "Offers counterterror intelligence support while urging India to preserve escalation control.", "supportive"],
        ["Pakistan", "Publicly denies state involvement and places border formations on visible alert.", "hostile"],
        ["Global Markets", "Airline, hotel, insurance, and rupee risk premiums rise as investors wait for India's response.", "concerned"],
      ],
      secondorder_business: [
        ["Marketplaces", "Amazon and Flipkart desks want aggressive festive pricing, but margin discipline is becoming harder to defend.", "concerned"],
        ["Offline Retailers", "Regional distributors want stronger schemes and faster replenishment before giving boAt more shelf space.", "neutral"],
        ["Consumers", "Youth brand recall remains high, but reviews increasingly compare sound quality, battery life, and service experience.", "supportive"],
        ["Investors", "Board attention is on profitability, premiumisation, domestic manufacturing, and IPO-readiness rather than pure shipment growth.", "concerned"],
      ],
      indopacific_standoff: [
        ["China", "Naval spokesperson warns against Indian interdiction of commercial shipping near contested corridors.", "hostile"],
        ["United States", "Signals freedom-of-navigation support but avoids treaty-like commitments.", "supportive"],
        ["Japan", "Raises maritime domain awareness sharing through existing Indo-Pacific channels.", "supportive"],
        ["Marine Insurers", "War-risk premiums rise for vessels transiting exposed Indian Ocean routes.", "concerned"],
      ],
      grid_cyber_war: [
        ["United States", "Cyber liaison team offers incident-response support while asking India not to attribute prematurely.", "supportive"],
        ["EU", "Critical-infrastructure regulators warn of contagion risk to multinational energy and logistics firms.", "concerned"],
        ["Adversary Channels", "State-linked media denies involvement and pushes narratives of Indian administrative failure.", "hostile"],
        ["Global Markets", "Power, banking, and logistics stocks move lower on outage-contagion concerns.", "concerned"],
      ],
      default: [
        ["UN", "Requests a formal briefing as overlapping security, economic, and environmental pressures rise.", "neutral"],
        ["United States", "Offers limited intelligence sharing but asks India to avoid uncontrolled military signaling.", "supportive"],
        ["China", "Monitors the crisis for opportunities to pressure India along diplomatic and border channels.", "concerned"],
        ["Global Markets", "Investors price a higher India risk premium until the government's first decisions clarify direction.", "concerned"],
      ],
    };

    (opening[scenarioId] || opening.default).forEach(([actor, action, tone]) => {
      pushGlobalReaction(stateObj, actor, action, tone);
    });
  }

  function pushAlert(stateObj, level, text) {
    stateObj.alerts.unshift({
      id: `al-${Math.random().toString(36).slice(2, 9)}`,
      time: formatTime(stateObj.clock),
      level,
      text,
    });
    stateObj.alerts = stateObj.alerts.slice(0, 80);
  }

  function pushGlobalReaction(stateObj, actor, action, tone = "neutral") {
    stateObj.globalReactions.unshift({
      id: `gr-${Math.random().toString(36).slice(2, 9)}`,
      time: formatTime(stateObj.clock),
      actor,
      action,
      tone,
    });
    stateObj.globalReactions = stateObj.globalReactions.slice(0, 70);
  }

  function pushWorldResponsesForDecision(stateObj, profile, outcome) {
    const style = profile.style;
    const risk = Math.round((profile.risk || 0.4) * 100);
    const legality = Math.round((profile.legality || 0.5) * 100);
    const actionName = profile.title || "Indian decision";
    const scenarioName = currentScenario(stateObj).name;

    if (isBusinessScenario(stateObj)) {
      if (["market", "brand"].includes(style)) {
        pushGlobalReaction(stateObj, "Consumers", `Brand energy improves if ${actionName} feels authentic rather than another paid celebrity blast. Risk level: ${risk}/100.`, "supportive");
        pushGlobalReaction(stateObj, "Marketplaces", "Traffic teams expect a sales lift, but they will push for discount support during the next campaign window.", "neutral");
        pushGlobalReaction(stateObj, "Investors", "Investors ask whether brand spend is translating into contribution margin, not just reach.", "concerned");
        return;
      }
      if (["product", "governance", "operations"].includes(style)) {
        pushGlobalReaction(stateObj, "Consumers", "Trust improves if product quality, battery life, service, and warranty promises become visibly better.", "supportive");
        pushGlobalReaction(stateObj, "Retailers", "Retailers support portfolio clarity because fewer weak SKUs make inventory planning easier.", "supportive");
        pushGlobalReaction(stateObj, "Investors", `The move supports a more defensible IPO story if execution holds. Credibility: ${legality}/100.`, "neutral");
        return;
      }
      if (style === "pricing" || style === "finance") {
        pushGlobalReaction(stateObj, "Marketplaces", "Marketplace teams accept margin floors reluctantly and may shift promotion slots to more aggressive rivals.", "concerned");
        pushGlobalReaction(stateObj, "Investors", "Revenue discipline improves if discount control does not trigger sudden share loss.", "supportive");
        return;
      }
      if (style === "overreach" || style === "unethical") {
        pushGlobalReaction(stateObj, "Consumers", "Trust weakens if boAt looks like it is chasing cheap volume rather than dependable products.", "hostile");
        pushGlobalReaction(stateObj, "Investors", "Concern rises that management is defending share through margin-destructive tactics.", "concerned");
        pushGlobalReaction(stateObj, "Competitors", "Noise, Fire-Boltt, Boult, JBL, and premium challengers gain room to attack weak segments.", "hostile");
        return;
      }
      pushGlobalReaction(stateObj, "Consumer Electronics Market", `Stakeholders reassess boAt after ${actionName}; confidence depends on category economics and execution proof.`, "neutral");
      return;
    }

    if (style === "nuclear") {
      pushGlobalReaction(stateObj, "UN Security Council", `Emergency session called after ${actionName}. Members treat nuclear retaliation, mass-casualty exposure, and Indian isolation as immediate risks.`, "hostile");
      pushGlobalReaction(stateObj, "United States", `Washington activates crisis hotlines, moves strategic assets to monitoring posture, and warns India that additional escalation will trigger punitive measures.`, "hostile");
      pushGlobalReaction(stateObj, "China", `Beijing raises theatre readiness and frames ${scenarioName} as a regional strategic emergency, with possible military coordination against India.`, "hostile");
      pushGlobalReaction(stateObj, "Global Markets", `Trading desks price severe war, sanctions, oil shock, insurance disruption, and supply-chain breakdown after the nuclear threshold is crossed.`, "hostile");
      return;
    }

    if (style === "kinetic" || style === "decapitation") {
      pushGlobalReaction(stateObj, "Pakistan", `Military command signals reciprocal options after ${actionName}; forward units and proxy channels become more active.`, "hostile");
      pushGlobalReaction(stateObj, "United States", `Calls for restraint while asking for evidence and target-selection details. Perceived legal strength: ${legality}/100.`, "concerned");
      pushGlobalReaction(stateObj, "China", `Warns India against widening the conflict and increases monitoring near Chinese border and maritime interests.`, "concerned");
      pushGlobalReaction(stateObj, "UN", `Emergency consultations requested as escalation risk reaches ${risk}/100 and humanitarian spillover becomes plausible.`, "neutral");
      return;
    }

    if (style === "covert" || style === "cyber") {
      pushGlobalReaction(stateObj, "Five Eyes Channels", `Partners request attribution confidence and legal boundaries before deeper intelligence support is released.`, "neutral");
      pushGlobalReaction(stateObj, "Adversary Media", `Claims Indian deniability is cover for escalation; disinformation pressure against Indian leadership intensifies.`, "hostile");
      pushGlobalReaction(stateObj, "Technology Markets", `Cyber-risk premium rises as firms check exposure to Indian banks, ports, telecom, and grid vendors.`, "concerned");
      return;
    }

    if (style === "diplomatic" || style === "economic") {
      pushGlobalReaction(stateObj, "EU", `Signals support for legal pressure but warns India against measures that trigger humanitarian, trade, or migration spillovers.`, "neutral");
      pushGlobalReaction(stateObj, "United States", `Offers back-channel support and asks India to keep evidence standards high before wider coalition action.`, "supportive");
      pushGlobalReaction(stateObj, "Pakistan", `Rejects Indian framing publicly while quietly testing diplomatic counter-pressure and domestic mobilization.`, "hostile");
      return;
    }

    if (style === "domestic" || style === "information") {
      pushGlobalReaction(stateObj, "Foreign Missions", `Monitor whether ${actionName} restores order without triggering civil-liberty, communal, or governance concerns.`, "neutral");
      pushGlobalReaction(stateObj, "Global Markets", `Analysts focus on continuity, consumer confidence, and whether the government's internal response contains the crisis.`, "concerned");
      return;
    }

    pushGlobalReaction(stateObj, "UN", `Requests a briefing on ${actionName} and its expected civilian, diplomatic, and regional consequences.`, "neutral");
    pushGlobalReaction(stateObj, "Global Markets", `Analysts reassess India risk after ${outcome.scenario || "the decision"}.`, "concerned");
  }

  function controversyTemplates() {
    const commonResponses = [
      {
        id: "audit_apology",
        title: "Acknowledge concern + independent review",
        note: "Slower but credible. Reduces outrage and board panic while creating short-term legal and cost exposure.",
        deltas: {
          stats: { PublicConfidence: 5, DiplomaticStanding: 5, FiscalHealth: -2 },
          threats: { DisinformationRisk: -5, EconomicPressure: 1 },
          domestic: { ParliamentApproval: 4, MediaHostility: -4, OppositionPressure: -2 },
          sentiment: { TrustInGovernment: 4, PanicLevel: -4 },
          economy: { StockIndex: -1 },
          systems: { MarketConfidence: 2 },
        },
        tracker: { outrage: -12, mediaPressure: -9, boardPanic: -7, boycott: -6 },
      },
      {
        id: "deny_counter",
        title: "Deny strongly and counter the narrative",
        note: "May reassure loyalists briefly, but if facts shift, trust damage compounds.",
        deltas: {
          stats: { PublicConfidence: -5, DiplomaticStanding: -7, FiscalHealth: 1 },
          threats: { DisinformationRisk: 8, EconomicPressure: 2 },
          domestic: { MediaHostility: 7, OppositionPressure: 5, ParliamentApproval: -5 },
          sentiment: { TrustInGovernment: -5, PanicLevel: 5 },
          economy: { StockIndex: 1 },
          systems: { MarketConfidence: -3 },
        },
        tracker: { outrage: 12, mediaPressure: 10, boardPanic: 5, boycott: 7 },
      },
      {
        id: "pause_campaign",
        title: "Pause the campaign/product push and open stakeholder outreach",
        note: "Cuts oxygen to the controversy but sacrifices momentum and campaign spend.",
        deltas: {
          stats: { PublicConfidence: 4, EconomicStability: -3, FiscalHealth: -2, DiplomaticStanding: 3 },
          threats: { DisinformationRisk: -4, BorderTension: -3, EconomicPressure: 3 },
          domestic: { MediaHostility: -3, ProtestRisk: -4 },
          sentiment: { PanicLevel: -5, TrustInGovernment: 3 },
          economy: { StockIndex: -3 },
          systems: { MarketConfidence: 1 },
        },
        tracker: { outrage: -10, mediaPressure: -6, boardPanic: -3, boycott: -11 },
      },
      {
        id: "legal_pressure",
        title: "Send legal notices to accounts amplifying claims",
        note: "Can stop a few false claims, but often looks like intimidation during a viral crisis.",
        deltas: {
          stats: { PublicConfidence: -4, DiplomaticStanding: -3 },
          threats: { DisinformationRisk: 4, EconomicPressure: 2 },
          domestic: { MediaHostility: 6, OppositionPressure: 4 },
          sentiment: { TrustInGovernment: -4, PanicLevel: 4 },
          economy: { StockIndex: -1 },
        },
        tracker: { outrage: 8, mediaPressure: 9, boardPanic: 4, boycott: 5 },
      },
      {
        id: "evidence_room",
        title: "Open a verified evidence room for media and partners",
        note: "Publish a timestamped fact pack, named owners, and correction log without speculating beyond verified evidence.",
        deltas: {
          stats: { PublicConfidence: 4, DiplomaticStanding: 4, FiscalHealth: -1 },
          threats: { DisinformationRisk: -7, EconomicPressure: 1 },
          domestic: { MediaHostility: -5, OppositionPressure: -2 },
          sentiment: { TrustInGovernment: 4, PanicLevel: -3 },
          systems: { MarketConfidence: 3 },
        },
        tracker: { outrage: -6, mediaPressure: -11, boardPanic: -5, boycott: -3 },
      },
      {
        id: "retailer_protection",
        title: "Protect retailers, staff, and customer support first",
        note: "Fund store security, escalation scripts, refunds, and partner communication while the central response is prepared.",
        deltas: {
          stats: { PublicConfidence: 3, EconomicStability: 2, FiscalHealth: -4 },
          threats: { DisinformationRisk: -2, EconomicPressure: 1, BorderTension: -3 },
          domestic: { ProtestRisk: -5, MediaHostility: -2 },
          sentiment: { PanicLevel: -4, TrustInGovernment: 2 },
          economy: { StockIndex: -1 },
          systems: { MarketConfidence: 4, HealthcareCapacity: 2 },
        },
        tracker: { outrage: -5, mediaPressure: -3, boardPanic: -4, boycott: -9 },
      },
    ];

    commonResponses.push(...window.SecondOrderEmergencyFlow.additionalOptions());
    const majorDecisions = [
      {
        id: "independent_panel",
        title: "Create independent crisis review panel",
        note: "Third-party investigators, weekly disclosure rhythm, public dashboard.",
        deltas: { stats: { DiplomaticStanding: 8, PublicConfidence: 5, FiscalHealth: -4 }, threats: { DisinformationRisk: -8 }, domestic: { ParliamentApproval: 6, MediaHostility: -5 }, economy: { StockIndex: -2 }, systems: { MarketConfidence: 4 } },
        tracker: { outrage: -14, mediaPressure: -12, boardPanic: -9, boycott: -8 },
      },
      {
        id: "leadership_accountability",
        title: "Visible leadership accountability move",
        note: "Senior owner steps aside from the campaign/workstream while investigation runs.",
        deltas: { stats: { PublicConfidence: 7, DiplomaticStanding: 5, EconomicStability: -2 }, threats: { DisinformationRisk: -5 }, domestic: { ParliamentApproval: 5, OppositionPressure: -4 }, sentiment: { TrustInGovernment: 5, PanicLevel: -5 }, economy: { StockIndex: -3 } },
        tracker: { outrage: -12, mediaPressure: -9, boardPanic: -8, boycott: -10 },
      },
      {
        id: "values_reset",
        title: "Brand values reset + affected community repair fund",
        note: "Expensive but high-signal: training, creator code, vendor audit, community repair fund.",
        deltas: { stats: { PublicConfidence: 8, DiplomaticStanding: 7, FiscalHealth: -7, AirQuality: 4 }, threats: { DisinformationRisk: -6, EconomicPressure: 4 }, domestic: { ProtestRisk: -6, MediaHostility: -4 }, sentiment: { TrustInGovernment: 7, PanicLevel: -4 }, economy: { StockIndex: -2 }, systems: { MarketConfidence: 5, HealthcareCapacity: 2 } },
        tracker: { outrage: -15, mediaPressure: -8, boardPanic: -5, boycott: -13 },
      },
      {
        id: "governance_gate",
        title: "Install a permanent high-risk approval gate",
        note: "Require legal, culture, customer, and finance sign-off before sensitive campaigns or launches go live.",
        deltas: { stats: { PublicConfidence: 5, DiplomaticStanding: 6, FiscalHealth: -3 }, threats: { DisinformationRisk: -6 }, domestic: { MediaHostility: -3, OppositionPressure: -3 }, sentiment: { TrustInGovernment: 4 }, systems: { MarketConfidence: 5 } },
        tracker: { outrage: -8, mediaPressure: -7, boardPanic: -12, boycott: -5 },
      },
      {
        id: "partner_stabilization",
        title: "Launch a 72-hour channel stabilization plan",
        note: "Give retailers, creators, and service teams one verified brief, escalation owner, and customer remedy policy.",
        deltas: { stats: { PublicConfidence: 4, EconomicStability: 3, FiscalHealth: -4 }, threats: { DisinformationRisk: -4, EconomicPressure: -2 }, domestic: { ProtestRisk: -3, MediaHostility: -2 }, sentiment: { PanicLevel: -4 }, economy: { StockIndex: 1 }, systems: { MarketConfidence: 6, SupplyChainIntegrity: 2 } },
        tracker: { outrage: -6, mediaPressure: -5, boardPanic: -7, boycott: -11 },
      },
    ];

    return [
      {
        id: "religious_campaign_backlash",
        type: "religion-based controversy",
        title: "Festival Campaign Accused Of Mocking Faith Symbols",
        kicker: "Fictional social controversy",
        severity: 82,
        hashtags: ["#BoycottboAt", "#RespectFaith", "#BrandAccountability"],
        clipping: "National Business Herald: Consumer-tech brand faces backlash after a festive creative is accused of trivialising sacred imagery. Opposition voices and creator networks demand an apology.",
        tweet: "@CivicConsumer: This is not edgy marketing. This is a values failure. boAt needs to explain who approved this. #RespectFaith",
        video: "YouTube Live: Panel debate asks whether youth brands are crossing cultural lines for virality.",
        reel: "Reel: Split-screen shows campaign frame beside angry campus reactions and retailer shutters in two cities.",
        brief: "A fictional festival campaign is being interpreted as disrespectful by multiple communities. Retail partners fear store-level protests, investors want containment, and the board is asking whether the campaign approval process failed.",
        tracker: { outrage: 74, mediaPressure: 71, boardPanic: 63, boycott: 68 },
        immediateDeltas: { stats: { PublicConfidence: -10, DiplomaticStanding: -9, FiscalHealth: -3 }, threats: { DisinformationRisk: 11, EconomicPressure: 5, BorderTension: 4 }, domestic: { MediaHostility: 12, OppositionPressure: 9, ProtestRisk: 8, ParliamentApproval: -8 }, sentiment: { TrustInGovernment: -10, PanicLevel: 8, CommunalTension: 5 }, economy: { StockIndex: -6 }, systems: { MarketConfidence: -8 } },
        responses: commonResponses,
        majorDecisions,
      },
      {
        id: "influencer_accusation",
        type: "influencer accusation",
        title: "Creator Alleges Hidden Sponsorship And Defective Review Units",
        kicker: "Fictional influencer storm",
        severity: 74,
        hashtags: ["#ReviewGate", "#UnboxTheTruth", "#boAtResponds"],
        clipping: "Creator Economy Ledger: A mid-tier tech creator claims review scripts were pressured and replacement units were selectively supplied to avoid public criticism.",
        tweet: "@TechWatchDesk: If true, this goes beyond one bad review. It questions trust in the entire launch funnel. #ReviewGate",
        video: "Creator claim summary: reviewer says battery concerns and leaked chats raise trust questions.",
        reel: "Creator-community signal: multiple reviewers question whether paid reviews are crowding out real user feedback.",
        brief: "An influencer has accused the brand of manipulating review narratives around a launch. The issue threatens creator trust, consumer confidence, and the premiumisation strategy.",
        tracker: { outrage: 66, mediaPressure: 69, boardPanic: 57, boycott: 49 },
        immediateDeltas: { stats: { PublicConfidence: -8, DiplomaticStanding: -7, AirQuality: -5 }, threats: { DisinformationRisk: 12, EconomicPressure: 3 }, domestic: { MediaHostility: 9, OppositionPressure: 6, ParliamentApproval: -5 }, sentiment: { TrustInGovernment: -8, PanicLevel: 5 }, economy: { StockIndex: -4 }, systems: { MarketConfidence: -6 } },
        responses: commonResponses,
        majorDecisions,
      },
      {
        id: "employee_misconduct_leak",
        type: "employee misconduct",
        title: "Leaked Workplace Chat Sparks Misconduct And Culture Crisis",
        kicker: "Fictional internal leak",
        severity: 78,
        hashtags: ["#boAtLeaks", "#WorkplaceCulture", "#LeadershipTest"],
        clipping: "Workplace Wire: Screenshots of an internal team chat appear to show dismissive language toward customer complaints and junior staff.",
        tweet: "@PeopleOpsDaily: Culture shows up under pressure. This leak is now a leadership test, not just an HR issue.",
        video: "Leak summary: internal chat screenshots are being discussed as a culture and governance problem.",
        reel: "Employee signal: anonymous former-employee stories connect the leak to pressure, returns, and launch deadlines.",
        brief: "A leaked internal communication has shifted the crisis from external marketing to company culture. Employees are watching management response, and the board fears attrition and governance questions before IPO readiness.",
        tracker: { outrage: 61, mediaPressure: 64, boardPanic: 72, boycott: 43 },
        immediateDeltas: { stats: { PublicConfidence: -7, DiplomaticStanding: -8, MilitaryReadiness: -5, FiscalHealth: -3 }, threats: { DisinformationRisk: 9, EconomicPressure: 5 }, domestic: { MediaHostility: 8, OppositionPressure: 8, ParliamentApproval: -7 }, sentiment: { TrustInGovernment: -9, PanicLevel: 7 }, economy: { StockIndex: -5 }, systems: { MarketConfidence: -5, HealthcareCapacity: -6 } },
        responses: commonResponses,
        majorDecisions,
      },
      {
        id: "political_boycott",
        type: "political backlash",
        title: "Regional Political Group Calls For Product Boycott",
        kicker: "Fictional political pressure event",
        severity: 70,
        hashtags: ["#BoycottAudioBrand", "#LocalRespect", "#ConsumerChoice"],
        clipping: "Retail Monitor: A regional political group alleges the brand ignored local sentiment in a campus activation. Offline retailers ask for security and communication support.",
        tweet: "@MarketPulse: Boycott chatter is moving from social media to offline trade WhatsApp groups. Retailers want clarity by tonight.",
        video: "Retail summary: boycott chatter is now being tied to festive sales and offline shelf confidence.",
        reel: "Consumer signal: street-level reactions ask whether buyers will switch to rival brands.",
        brief: "A boycott call is spreading through regional political and retail networks. The danger is not only online outrage; offline distributors may reduce shelf priority if the issue reaches stores.",
        tracker: { outrage: 59, mediaPressure: 58, boardPanic: 56, boycott: 72 },
        immediateDeltas: { stats: { PublicConfidence: -6, EconomicStability: -5, DiplomaticStanding: -5 }, threats: { DisinformationRisk: 7, EconomicPressure: 7, BorderTension: 6 }, domestic: { ProtestRisk: 9, MediaHostility: 7, ParliamentApproval: -5 }, sentiment: { TrustInGovernment: -6, PanicLevel: 5 }, economy: { StockIndex: -5 }, systems: { MarketConfidence: -9, SupplyChainIntegrity: -3 } },
        responses: commonResponses,
        majorDecisions,
      },
    ];
  }

  function blankControversyState() {
    return {
      active: false,
      current: null,
      history: [],
      triggeredCount: 0,
      popupOpen: false,
      lastTriggerDecision: 0,
      responseEndsAt: null,
      nextActionAt: null,
      windowExpired: false,
      missedWindowApplied: false,
      statementIssuedThisSession: false,
      statementIssuedAt: null,
      statementChoiceId: null,
    };
  }

  function controversyStatusText(crisis) {
    if (!crisis) return "No active controversy.";
    return `${crisis.title} | Stage ${crisis.stage}/5 | Outrage ${crisis.tracker.outrage}/100 | Boycott ${crisis.tracker.boycott}/100 | Board panic ${crisis.tracker.boardPanic}/100`;
  }

  function applyControversyTracker(crisis, delta = {}) {
    if (!crisis || !crisis.tracker) return;
    Object.entries(delta).forEach(([key, value]) => {
      crisis.tracker[key] = clamp((crisis.tracker[key] || 0) + Math.round(value || 0));
    });
  }

  function pushControversyUpdate(stateObj, text, level = "update") {
    const crisis = stateObj.emergencyControversy && stateObj.emergencyControversy.current;
    if (!crisis) return;
    crisis.updates.unshift({ time: formatTime(stateObj.clock), text, level });
    crisis.updates = crisis.updates.slice(0, 18);
  }

  function publicStatementOptions() {
    return [
      {
        id: "accountability",
        title: "Credible accountability statement",
        note: "Acknowledge concern, announce independent review, and commit to an update timeline.",
        internal: "Transparent employee note + manager Q&A within two hours",
        deltas: { stats: { PublicConfidence: 5, DiplomaticStanding: 4, FiscalHealth: -2 }, threats: { DisinformationRisk: -6 }, domestic: { MediaHostility: -5, ParliamentApproval: 3 }, sentiment: { TrustInGovernment: 4, PanicLevel: -3 }, systems: { MarketConfidence: 3 } },
        tracker: { outrage: -10, mediaPressure: -8, boardPanic: -6, boycott: -5 },
      },
      {
        id: "fact_finding",
        title: "Fact-finding statement",
        note: "Say facts are being verified and ask stakeholders not to jump to conclusions.",
        internal: "Legal hold + factual manager briefing",
        deltas: { stats: { PublicConfidence: 1, DiplomaticStanding: 2 }, threats: { DisinformationRisk: -2 }, domestic: { MediaHostility: -1 }, systems: { MarketConfidence: 1 } },
        tracker: { outrage: -3, mediaPressure: -2, boardPanic: -2, boycott: -1 },
      },
      {
        id: "defensive_denial",
        title: "Defensive denial statement",
        note: "Call allegations misleading and warn against false claims.",
        internal: "Restricted legal note, no broad employee Q&A",
        deltas: { stats: { PublicConfidence: -5, DiplomaticStanding: -4 }, threats: { DisinformationRisk: 6, EconomicPressure: 1 }, domestic: { MediaHostility: 6, ParliamentApproval: -4 }, sentiment: { TrustInGovernment: -4, PanicLevel: 3 }, systems: { MarketConfidence: -3 } },
        tracker: { outrage: 8, mediaPressure: 7, boardPanic: 4, boycott: 4 },
      },
      {
        id: "consumer_repair",
        title: "Consumer-first repair statement",
        note: "Pause the disputed campaign, protect customers/creators, and open a support channel.",
        internal: "Customer-care escalation note + creator-relations taskforce",
        deltas: { stats: { PublicConfidence: 4, DiplomaticStanding: 3, FiscalHealth: -3, EconomicStability: -1 }, threats: { DisinformationRisk: -4, EconomicPressure: 2 }, domestic: { MediaHostility: -3, ProtestRisk: -3 }, sentiment: { TrustInGovernment: 3, PanicLevel: -3 }, systems: { MarketConfidence: 2 } },
        tracker: { outrage: -8, mediaPressure: -5, boardPanic: -3, boycott: -8 },
      },
      {
        id: "evidence_update",
        title: "Evidence-led update with a fixed deadline",
        note: "Share what is confirmed, what remains unknown, and the exact time of the next public update.",
        internal: "Single source-of-truth brief + scheduled employee update",
        deltas: { stats: { PublicConfidence: 3, DiplomaticStanding: 3 }, threats: { DisinformationRisk: -5 }, domestic: { MediaHostility: -4 }, sentiment: { TrustInGovernment: 3, PanicLevel: -2 }, systems: { MarketConfidence: 2 } },
        tracker: { outrage: -5, mediaPressure: -7, boardPanic: -4, boycott: -3 },
      },
      {
        id: "leader_qa",
        title: "Leadership Q&A with hard commitments",
        note: "Put one accountable leader on record with three measurable actions and no scripted deflection.",
        internal: "Leadership town hall + written commitments and owners",
        deltas: { stats: { PublicConfidence: 5, DiplomaticStanding: 3, FiscalHealth: -2 }, threats: { DisinformationRisk: -4 }, domestic: { MediaHostility: -3, ParliamentApproval: 3 }, sentiment: { TrustInGovernment: 5, PanicLevel: -3 }, systems: { MarketConfidence: 3 } },
        tracker: { outrage: -7, mediaPressure: -6, boardPanic: -8, boycott: -4 },
      },
    ];
  }

  function emergencyBlocked(stateObj = state) {
    return window.SecondOrderEmergencyFlow.blocked(stateObj);
  }

  function emergencyActionOptions() {
    const crisis = state.emergencyControversy?.current;
    if (!crisis) return [];
    return [
      ...(crisis.responses || []).map(item => ({ ...item, kind: "response", used: (crisis.usedResponses || []).includes(item.id) })),
      ...publicStatementOptions().map(item => ({ ...item, kind: "statement", used: Boolean(crisis.statementReleased) })),
      ...(crisis.majorDecisions || []).map(item => ({ ...item, kind: "major", used: (crisis.usedMajorDecisions || []).includes(item.id) })),
    ].map(item => ({ ...item, trade: window.SecondOrderEmergencyFlow.evaluate(state, item).trade }));
  }

  function finalizeEmergencyOutcome(stateObj, result) {
    if (!result || !result.outcome) return;
    applyGroupedDeltas(stateObj, result.deltas);
    updateDomesticAndLeadership(stateObj);
    const crisis = stateObj.emergencyControversy.current;
    crisis.journey.businessAfter = window.SecondOrderEmergencyFlow.business(stateObj);
    pushControversyUpdate(stateObj, crisis.resolution, result.outcome);
    pushAlert(stateObj, result.outcome === "contained" ? "resolved" : "crisis", crisis.resolution);
    stateObj.outcomeSummary = crisis.resolution;
  }

  function advanceEmergencyJourney(stateObj = state) {
    const result = window.SecondOrderEmergencyFlow.advance(stateObj);
    if (!result) return false;
    finalizeEmergencyOutcome(stateObj, result);
    return true;
  }

  function performEmergencyAction(kind, id) {
    if (advanceEmergencyJourney(state)) { saveState(); renderAll(); return; }
    const flow = window.SecondOrderEmergencyFlow.journey(state);
    if (!flow || !window.SecondOrderEmergencyFlow.available(state)) return;
    const option = emergencyActionOptions().find(item => item.kind === kind && item.id === id);
    if (!option || option.used) return;
    const crisis = state.emergencyControversy.current;
    const now = Date.now();
    const assessment = window.SecondOrderEmergencyFlow.evaluate(state, option);
    const before = { pressure: deepClone(crisis.tracker), business: window.SecondOrderEmergencyFlow.business(state) };
    if (kind === "response") crisis.usedResponses.push(id);
    if (kind === "major") crisis.usedMajorDecisions.push(id);
    if (kind === "statement") {
      crisis.statementReleased = true; crisis.statementChoiceId = id; crisis.internalChoice = option.internal;
      state.emergencyControversy.statementIssuedThisSession = true;
      state.emergencyControversy.statementChoiceId = id;
    }
    crisis.responseCount += kind === "major" ? 2 : 1;
    if (flow.actions.length === 0) queueEmergencyReflection(crisis, option, "Emergency response");
    applyGroupedDeltas(state, assessment.deltas);
    applyControversyTracker(crisis, assessment.tracker);
    updateDomesticAndLeadership(state);
    const afterAction = { pressure: deepClone(crisis.tracker), business: window.SecondOrderEmergencyFlow.business(state) };
    window.SecondOrderEmergencyFlow.record(state, option, kind, assessment, before, afterAction, now);
    pushControversyUpdate(state, `${option.title}. ${assessment.why}`, assessment.breach ? "process-breach" : "decision");
    saveState(); renderAll();
  }

  function renderEmergencyExperience() {
    const flow = window.SecondOrderEmergencyFlow.journey(state);
    const visible = Boolean(flow && flow.phase !== "closed" && !els.simulationShell.classList.contains("hidden") && !state.sessionReportShown);
    window.SecondOrderEmergencyRoom.update({
      visible, state, flow, crisis: state.emergencyControversy?.current,
      options: flow ? emergencyActionOptions() : [],
      mainMs: window.SecondOrderSessionClock.remaining(state),
      remainingMs: window.SecondOrderEmergencyFlow.remaining(state),
      reviewMs: window.SecondOrderEmergencyFlow.reviewRemaining(state),
      business: isBusinessScenario(state) ? window.SecondOrderEmergencyFlow.business(state) : {},
      claim: cleanCrisisClaim(state.emergencyControversy?.current?.clipping),
      onStart: () => { if (window.SecondOrderEmergencyFlow.start(state)) { activeSimulationPage = "operations"; saveState(); renderAll(); } },
      onApply: option => performEmergencyAction(option.kind, option.id),
      onNote: text => { const currentFlow = window.SecondOrderEmergencyFlow.journey(state); if (currentFlow?.phase === "review") { currentFlow.noteDraft = text; saveState(); } },
      onReturn: () => {
        if (!window.SecondOrderEmergencyFlow.resume(state)) return;
        const crisis = state.emergencyControversy.current;
        state.emergencyControversy.history = [deepClone(crisis), ...(state.emergencyControversy.history || []).filter(item => item.startedAt !== crisis.startedAt)].slice(0, 6);
        impactSnapshotMode = false; activeSimulationPage = "impact";
        saveState(); renderAll(); setStatus("Emergency outcome carried to Scorecards. Main simulation resumed.");
      },
    });
  }

  function crisisWindowOpen(crisisState) {
    if (crisisState?.current?.journey) return window.SecondOrderEmergencyFlow.available({ ...state, emergencyControversy: crisisState });
    return Boolean(crisisState && crisisState.active && !crisisState.windowExpired && remainingMs(crisisState.responseEndsAt) > 0);
  }

  function crisisActionCooldownMs(crisisState) {
    return remainingMs(crisisState && crisisState.nextActionAt);
  }

  function crisisActionDisabledReason(crisisState, extraLocked = false, extraReason = "Used") {
    if (!crisisWindowOpen(crisisState)) return "Crisis window closed";
    if (extraLocked) return extraReason;
    const cooldownMs = crisisActionCooldownMs(crisisState);
    if (cooldownMs > 0) return `Wait ${formatCountdown(cooldownMs)}`;
    return "";
  }

  function setCrisisActionCooldown(crisisState) {
    if (!crisisState) return;
    crisisState.nextActionAt = minutesFromNowIso(CRISIS_ACTION_COOLDOWN_MS);
  }

  function expireCrisisWindowIfNeeded(stateObj) {
    if (stateObj.emergencyControversy?.current?.journey) return advanceEmergencyJourney(stateObj);
    const crisisState = stateObj.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    if (!crisisState || !crisisState.active || !crisis) return false;
    if (crisisState.windowExpired || remainingMs(crisisState.responseEndsAt) > 0) return false;
    crisisState.windowExpired = true;
    crisis.responseWindowExpiredAt = new Date().toISOString();
    pushControversyUpdate(stateObj, "Three-minute crisis response window closed. Remaining actions are now read-only.", "window-closed");
    if (!crisisState.missedWindowApplied && (crisis.responseCount || 0) === 0 && !crisis.statementReleased) {
      crisisState.missedWindowApplied = true;
      applyGroupedDeltas(stateObj, {
        stats: { PublicConfidence: -6, DiplomaticStanding: -4, EconomicStability: -2 },
        threats: { DisinformationRisk: 7, EconomicPressure: 3 },
        domestic: { MediaHostility: 6, OppositionPressure: 4, ParliamentApproval: -4 },
        sentiment: { TrustInGovernment: -5, PanicLevel: 4 },
        economy: { StockIndex: -3 },
        systems: { MarketConfidence: -4 },
      });
      applyControversyTracker(crisis, { outrage: 8, mediaPressure: 7, boardPanic: 6, boycott: 5 });
      pushControversyUpdate(stateObj, "No meaningful response landed before the window closed; media and board pressure intensified.", "missed-window");
      pushGlobalReaction(stateObj, "Board", "Directors view the delayed crisis posture as weak governance under pressure.", "hostile");
      updateDomesticAndLeadership(stateObj);
    }
    return true;
  }

  function triggerEmergencyControversy(stateObj, template, sourceDecision = "recent decision") {
    const crisis = {
      ...template,
      active: true,
      stage: 1,
      startedAt: stateObj.clock,
      sourceDecision,
      updates: [],
      usedResponses: [],
      usedMajorDecisions: [],
      statementReleased: false,
      internalChoice: "transparent",
      responseCount: 0,
      tracker: { ...template.tracker },
      responses: template.responses.map((item) => deepClone(item)),
      majorDecisions: template.majorDecisions.map((item) => deepClone(item)),
    };
    stateObj.emergencyControversy.active = true;
    stateObj.emergencyControversy.current = crisis;
    stateObj.emergencyControversy.popupOpen = true;
    stateObj.emergencyControversy.responseEndsAt = null;
    stateObj.emergencyControversy.nextActionAt = null;
    stateObj.emergencyControversy.windowExpired = false;
    stateObj.emergencyControversy.missedWindowApplied = false;
    stateObj.emergencyControversy.triggeredCount = (stateObj.emergencyControversy.triggeredCount || 0) + 1;
    stateObj.emergencyControversy.lastTriggerDecision = stateObj.decisionMetrics.total || 0;
    stateObj.emergencyControversy.statementIssuedThisSession = false;
    stateObj.emergencyControversy.statementChoiceId = null;
    window.SecondOrderEmergencyFlow.begin(stateObj);
    if (stateObj === state) crisisEntering = false;
    applyGroupedDeltas(stateObj, template.immediateDeltas || {});
    updateEscalation(stateObj, 5, "Emergency controversy erupted");
    pushControversyUpdate(stateObj, `Crisis desk opened after ${sourceDecision}. Social velocity is rising faster than the normal brand team can contain.`, "breaking");
    pushAlert(stateObj, "breaking", `Emergency controversy: ${template.title}`);
    pushGlobalReaction(stateObj, "Public Internet", `${template.hashtags[0]} begins trending with boycott and accountability posts.`, "hostile");
    pushGlobalReaction(stateObj, "Board", "Emergency reputation call requested. Directors ask for a response plan before the next media cycle.", "concerned");
    stateObj.liveFeedSummary = `${template.title}. ${template.brief}`;
    scheduleEvent(stateObj, "controversy_pulse", 40, { reason: "first media cycle" }, "Emergency controversy update: first media cycle lands.");
  }

  function maybeTriggerEmergencyControversy(stateObj, profile) {
    if (!isBusinessScenario(stateObj) || !stateObj.emergencyControversy) return false;
    const crisisState = stateObj.emergencyControversy;
    const existing = crisisState.current;
    if (crisisState.active) return false;
    if (existing && !existing.resolvedAt) return false;
    const total = stateObj.decisionMetrics.total || 0;
    if (total < 2 || (crisisState.triggeredCount || 0) >= 2) return false;
    if (existing && total - (crisisState.lastTriggerDecision || 0) < 2) return false;
    const pressure = averageValues([
      stateObj.threats.DisinformationRisk,
      stateObj.threats.EconomicPressure,
      stateObj.domestic.MediaHostility,
      100 - stateObj.stats.PublicConfidence,
      100 - stateObj.stats.DiplomaticStanding,
    ]);
    const random = seededRandom(stateObj.turn * 1609 + total * 197 + Math.round(pressure) * 11);
    const chance = total === 2 ? 0.42 : total === 3 ? 0.68 : 0.9;
    if (random() > chance) return false;
    const templates = controversyTemplates();
    const style = effectiveDecisionStyle(stateObj, profile || {});
    const preferredId = /brand|market/.test(style)
      ? "influencer_accusation"
      : /operations|governance/.test(style)
        ? "employee_misconduct_leak"
        : /pricing|finance|overreach/.test(style)
          ? "political_boycott"
          : "religious_campaign_backlash";
    const preferred = templates.find((item) => item.id === preferredId) || templates[Math.floor(random() * templates.length)];
    const selected = random() < 0.62 ? preferred : templates[Math.floor(random() * templates.length)];
    triggerEmergencyControversy(stateObj, selected, profile && profile.title ? profile.title : "recent board decision");
    return true;
  }

  function progressEmergencyControversy(stateObj, reason = "media cycle") {
    if (window.SecondOrderEmergencyFlow.journey(stateObj)) return;
    const crisisState = stateObj.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    if (!crisisState || !crisisState.active || !crisis) return;
    const responseRelief = Math.min(18, (crisis.responseCount || 0) * 4 + (crisis.statementReleased ? 5 : 0) + (crisis.usedMajorDecisions || []).length * 5);
    const pressureLift = Math.max(2, Math.round((crisis.tracker.mediaPressure + crisis.tracker.outrage + crisis.tracker.boycott) / 90) - responseRelief / 5);
    crisis.stage = clamp((crisis.stage || 1) + 1, 1, 5);
    applyControversyTracker(crisis, {
      outrage: pressureLift,
      mediaPressure: pressureLift + 2,
      boardPanic: Math.max(1, pressureLift - 1),
      boycott: Math.max(1, pressureLift - 2),
    });
    applyGroupedDeltas(stateObj, {
      stats: { PublicConfidence: -Math.max(1, pressureLift - 1), DiplomaticStanding: -Math.max(1, pressureLift - 2), EconomicStability: -1 },
      threats: { DisinformationRisk: Math.max(1, pressureLift), EconomicPressure: Math.max(1, Math.round(pressureLift / 2)) },
      domestic: { MediaHostility: Math.max(1, pressureLift), OppositionPressure: Math.max(1, Math.round(pressureLift / 2)), ParliamentApproval: -Math.max(1, Math.round(pressureLift / 2)) },
      sentiment: { TrustInGovernment: -Math.max(1, Math.round(pressureLift / 2)), PanicLevel: Math.max(1, Math.round(pressureLift / 2)) },
      economy: { StockIndex: -Math.max(1, Math.round(pressureLift / 2)) },
      systems: { MarketConfidence: -Math.max(1, Math.round(pressureLift / 2)) },
    });
    const update = crisis.stage >= 5
      ? "The controversy has entered mainstream business television; board members now treat this as a survival-level reputation event."
      : `New ${reason}: hashtags, creator commentary, and retailer calls are still compounding faster than official answers.`;
    pushControversyUpdate(stateObj, update, crisis.stage >= 5 ? "critical" : "update");
    pushAlert(stateObj, "controversy", update);
    if (crisis.stage < 5) {
      scheduleEvent(stateObj, "controversy_pulse", 55, { reason: "next media cycle" }, "Emergency controversy update: next media cycle.");
    }
  }

  function applyControversyResponse(responseId) {
    if (window.SecondOrderEmergencyFlow.journey(state)) return performEmergencyAction("response", responseId);
    const crisisState = state.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    expireCrisisWindowIfNeeded(state);
    if (!crisis || !crisisWindowOpen(crisisState)) return;
    if (crisisActionCooldownMs(crisisState) > 0) return;
    const response = (crisis.responses || []).find((item) => item.id === responseId);
    if (!response || crisis.usedResponses.includes(responseId)) return;
    crisis.usedResponses.push(responseId);
    crisis.responseCount += 1;
    if (crisis.responseCount === 1) queueEmergencyReflection(crisis, response, "Crisis response");
    setCrisisActionCooldown(crisisState);
    applyGroupedDeltas(state, response.deltas || {});
    applyControversyTracker(crisis, response.tracker || {});
    pushControversyUpdate(state, `Response chosen: ${response.title}. ${response.note}`, "decision");
    pushAlert(state, "crisis-response", `Emergency response: ${response.title}`);
    pushGlobalReaction(state, "Crisis Stakeholders", response.note, response.tracker && response.tracker.outrage < 0 ? "supportive" : "concerned");
    updateDomesticAndLeadership(state);
    resolveOrContinueControversy(state);
    saveState();
    renderAll();
  }

  function applyMajorControversyDecision(decisionId) {
    if (window.SecondOrderEmergencyFlow.journey(state)) return performEmergencyAction("major", decisionId);
    const crisisState = state.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    expireCrisisWindowIfNeeded(state);
    if (!crisis || !crisisWindowOpen(crisisState)) return;
    if (crisisActionCooldownMs(crisisState) > 0) return;
    const decision = (crisis.majorDecisions || []).find((item) => item.id === decisionId);
    if (!decision || crisis.usedMajorDecisions.includes(decisionId)) return;
    crisis.usedMajorDecisions.push(decisionId);
    crisis.responseCount += 2;
    if (crisis.responseCount === 2 && !(state.reflections || []).some((item) => item.contextType === "emergency" && item.emergencyStartedAt === crisis.startedAt)) {
      queueEmergencyReflection(crisis, decision, "Major emergency decision");
    }
    setCrisisActionCooldown(crisisState);
    applyGroupedDeltas(state, decision.deltas || {});
    applyControversyTracker(crisis, decision.tracker || {});
    pushControversyUpdate(state, `Major call made: ${decision.title}. ${decision.note}`, "major");
    pushAlert(state, "board", `Major controversy decision: ${decision.title}`);
    pushGlobalReaction(state, "Board", decision.note, "supportive");
    scheduleEvent(state, "controversy_pulse", 70, { reason: "post-decision scrutiny" }, "Emergency controversy update: response credibility test.");
    updateDomesticAndLeadership(state);
    resolveOrContinueControversy(state);
    saveState();
    renderAll();
  }

  function releaseControversyStatement(statementId) {
    if (window.SecondOrderEmergencyFlow.journey(state)) return performEmergencyAction("statement", statementId);
    const crisisState = state.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    expireCrisisWindowIfNeeded(state);
    if (!crisis || !crisisWindowOpen(crisisState)) return;
    if (crisisActionCooldownMs(crisisState) > 0) return;
    if (crisisState.statementIssuedThisSession || crisis.statementReleased) return;
    const statement = publicStatementOptions().find((item) => item.id === statementId);
    if (!statement) return;
    crisis.statementReleased = true;
    crisis.statementChoiceId = statement.id;
    crisis.internalChoice = statement.internal;
    crisis.responseCount += 1;
    if (crisis.responseCount === 1) queueEmergencyReflection(crisis, statement, "Public statement");
    crisisState.statementIssuedThisSession = true;
    crisisState.statementIssuedAt = new Date().toISOString();
    crisisState.statementChoiceId = statement.id;
    setCrisisActionCooldown(crisisState);
    applyGroupedDeltas(state, statement.deltas || {});
    applyControversyTracker(crisis, statement.tracker || {});
    pushControversyUpdate(state, `Public statement issued: ${statement.title}. Internal posture: ${statement.internal}.`, statement.tracker && statement.tracker.outrage < 0 ? "statement" : "statement-risk");
    pushAlert(state, "statement", `Public statement: ${statement.title}`);
    pushGlobalReaction(state, "Consumers & Creators", statement.note, statement.tracker && statement.tracker.outrage < 0 ? "supportive" : "concerned");
    updateDomesticAndLeadership(state);
    resolveOrContinueControversy(state);
    saveState();
    renderAll();
  }
  function conveneControversyMeeting() {
    if (window.SecondOrderEmergencyFlow.journey(state)) return;
    const crisis = state.emergencyControversy && state.emergencyControversy.current;
    if (!crisis || !state.emergencyControversy.active) return;
    [
      "CEO: Own the issue fast. If we hide, the board will assume we do not know the facts.",
      "CMO: Pause paid amplification until we know which creative, creator, or message is driving anger.",
      "Legal: Do not over-admit facts, but acknowledge harm and preserve all internal records.",
      "HR / People: Employees need one internal truth source before screenshots and rumors fill the vacuum.",
      "CFO: Every hour of confusion increases return risk, marketplace pressure, and IPO narrative damage.",
    ].forEach((line) => pushControversyUpdate(state, line, "meeting"));
    applyControversyTracker(crisis, { boardPanic: -3, mediaPressure: -1 });
    saveState();
    renderAll();
  }

  function resolveOrContinueControversy(stateObj) {
    if (window.SecondOrderEmergencyFlow.journey(stateObj)) return;
    const crisisState = stateObj.emergencyControversy;
    const crisis = crisisState && crisisState.current;
    if (!crisis) return;
    const averageHeat = averageValues([crisis.tracker.outrage, crisis.tracker.mediaPressure, crisis.tracker.boardPanic, crisis.tracker.boycott]);
    if (averageHeat <= 34 && crisis.responseCount >= 2) {
      crisisState.active = false;
      crisisState.popupOpen = false;
      crisis.resolvedAt = stateObj.clock;
      crisis.resolution = "Contained with credible response architecture.";
      crisisState.history.unshift(deepClone(crisis));
      crisisState.history = crisisState.history.slice(0, 6);
      pushAlert(stateObj, "resolved", `Controversy contained: ${crisis.title}`);
      pushGlobalReaction(stateObj, "Board", "Crisis moves from survival threat to monitored recovery plan.", "supportive");
    }
  }
  function ensureSessionClock(stateObj, forceReset = false) {
    if (!stateObj.sessionEndsAt || forceReset) {
      stateObj.sessionEndsAt = minutesFromNowIso(SESSION_DURATION_MS);
      stateObj.boardroomClockPause = null;
      stateObj.emergencyClockPause = null;
    }
  }

  function startAnalysisWindow(stateObj) {
    const duration = isBusinessScenario(stateObj) ? BUSINESS_DECISION_COOLDOWN_MS : ANALYSIS_WINDOW_MS;
    stateObj.analysisWindowEndsAt = minutesFromNowIso(duration);
    if (stateObj.emergencyClockPause) stateObj.emergencyClockPause.analysisRemainingMs = duration;
  }

  function analysisWindowActive(stateObj) {
    return remainingMs(stateObj.analysisWindowEndsAt) > 0;
  }

  function sessionExpired(stateObj) {
    if (stateObj.dismissed) return true;
    if (!stateObj.sessionEndsAt) return false;
    return window.SecondOrderSessionClock.remaining(stateObj) === 0;
  }

  function meetingActive(stateObj) {
    return stateObj.meetingActive && remainingMs(stateObj.meetingEndsAt) > 0;
  }

  function getScenarioUi(stateObj = state) {
    const common = {
      showOperations: true,
      showCovert: true,
      showWorld: true,
      showDomestic: true,
      showEconomy: true,
      expectedDecisions: 3,
    };

    const map = {
      default: {
        ...common,
        operationsMode: "strategic",
        operationsTitle: "Strategic Operations",
        operationsBadge: "Command Interface",
        operationsLabel: "Open Strategic Operation",
        operationsPlaceholder: "Example: Shift emergency response units, harden cyber surveillance, and pre-position rapid reaction teams near vulnerable transport hubs.",
        operationsButton: "Execute Operation",
        operationsRender: "strategic",
        covertTitle: "Covert Operations",
        covertBadge: "Secret Actions",
        covertTemplates: [
          { id: "cv1", name: "Neutralize terror financier network", success: 63, exposure: 22, style: "covert" },
          { id: "cv2", name: "Sabotage hostile missile logistics", success: 48, exposure: 35, style: "kinetic" },
          { id: "cv3", name: "Cyber infiltration of command relay", success: 71, exposure: 28, style: "cyber" },
          { id: "cv4", name: "Recruit insider informant", success: 57, exposure: 18, style: "intel" },
        ],
      },
      india_china_border: {
        ...common,
        expectedDecisions: 3,
        operationsMode: "military",
        operationsTitle: "Military Operations Map",
        operationsBadge: "Frontier Command",
        operationsLabel: "Open Military Operation",
        operationsPlaceholder: "Example: Move mountain reserves toward Ladakh, activate air defence, and expand ISR over forward sectors.",
        operationsButton: "Execute Military Order",
        operationsRender: "military",
        covertTitle: "Cross-Border Intelligence",
        covertBadge: "Covert Options",
        covertTemplates: [
          { id: "cv1", name: "Interdict hostile logistics route", success: 58, exposure: 26, style: "covert" },
          { id: "cv2", name: "Sabotage forward missile resupply", success: 46, exposure: 34, style: "kinetic" },
          { id: "cv3", name: "Cyber probe border command relay", success: 69, exposure: 29, style: "cyber" },
          { id: "cv4", name: "Recruit staging-area informant", success: 55, exposure: 20, style: "intel" },
        ],
      },
      mumbai_terror: {
        ...common,
        expectedDecisions: 4,
        operationsMode: "security",
        operationsTitle: "Homeland Security Operations",
        operationsBadge: "Internal Security",
        operationsLabel: "Open Security Operation",
        operationsPlaceholder: "Example: Move NSG teams to transit hubs, expand hospital surge capacity, and run coordinated search operations across suspected safe houses.",
        operationsButton: "Execute Security Order",
        operationsRender: "security",
        covertTitle: "Intelligence & Manhunt",
        covertBadge: "Counterterror",
        covertTemplates: [
          { id: "cv1", name: "Trace handler finance route", success: 66, exposure: 18, style: "covert" },
          { id: "cv2", name: "Raid suspected logistics safehouse", success: 54, exposure: 31, style: "kinetic" },
          { id: "cv3", name: "Intercept terror chatter node", success: 73, exposure: 22, style: "cyber" },
          { id: "cv4", name: "Turn local facilitator", success: 61, exposure: 16, style: "intel" },
        ],
      },
      secondorder_business: {
        ...common,
        showCovert: false,
        showWorld: true,
        expectedDecisions: 3,
        operationsMode: "business",
        operationsTitle: "boAt Strategy Board",
        operationsBadge: "Consumer Tech Case",
        operationsLabel: "Open-Ended boAt Business Move",
        operationsPlaceholder: "Example: Cut weak smartwatch SKUs, push premium ANC audio, hold margin floors in festive sales, and improve warranty turnaround in Tier 2/3 cities.",
        operationsButton: "Execute Business Move",
        operationsRender: "business",
        covertTitle: "Hidden",
        covertBadge: "Hidden",
        covertTemplates: [],
        labels: {
          dashboardTitle: "boAt Case Dashboard",
          timerTitle: "Business Pressure Timers",
          decisionTitle: "boAt Decision Console",
          meetingTitle: "Boardroom Stakeholder Meeting",
          briefingTitle: "Case Briefing",
          impactTitle: "Company Scorecard",
          domesticTitle: "Board, Investors & Channels",
          sentimentTitle: "Consumer & Team Sentiment",
          headlinesTitle: "Market Signals",
          worldTitle: "Stakeholder Response Dashboard",
          economyTitle: "Margins & Unit Economics",
          leadershipTitle: "Board Confidence Meter",
          leadershipBadge: "Management Stability",
          tabDomestic: "Board/Channels",
          tabWorld: "Market",
          tabEconomy: "Margins",
          meetingButton: "Boardroom Meeting (4:00, one use)",
        },
      },
      indopacific_standoff: {
        ...common,
        expectedDecisions: 3,
        operationsMode: "maritime",
        operationsTitle: "Maritime Operations Map",
        operationsBadge: "Naval Interface",
        operationsLabel: "Open Maritime Operation",
        operationsPlaceholder: "Example: Move escort groups toward sea-lane chokepoints, expand maritime ISR, and increase port-defense readiness.",
        operationsButton: "Execute Maritime Order",
        operationsRender: "maritime",
        covertTitle: "Signals & Surveillance",
        covertBadge: "Maritime Intel",
        covertTemplates: [
          { id: "cv1", name: "Track hostile shipping support chain", success: 62, exposure: 21, style: "covert" },
          { id: "cv2", name: "Disrupt hostile radar logistics", success: 49, exposure: 32, style: "kinetic" },
          { id: "cv3", name: "Infiltrate maritime tracking network", success: 72, exposure: 27, style: "cyber" },
          { id: "cv4", name: "Recruit port-source informant", success: 56, exposure: 18, style: "intel" },
        ],
      },
      grid_cyber_war: {
        ...common,
        expectedDecisions: 4,
        operationsMode: "infrastructure",
        operationsTitle: "Grid Response Operations",
        operationsBadge: "Infrastructure Command",
        operationsLabel: "Open Infrastructure Order",
        operationsPlaceholder: "Example: Isolate affected grid zones, move backup crews to western substations, and harden telecom and dispatch control nodes.",
        operationsButton: "Execute Grid Order",
        operationsRender: "infrastructure",
        covertTitle: "Cyber Countermeasures",
        covertBadge: "Technical Response",
        covertTemplates: [
          { id: "cv1", name: "Patch compromised dispatch credentials", success: 68, exposure: 14, style: "cyber" },
          { id: "cv2", name: "Sinkhole hostile command-and-control node", success: 57, exposure: 24, style: "covert" },
          { id: "cv3", name: "Audit substation firmware supply chain", success: 63, exposure: 12, style: "intel" },
          { id: "cv4", name: "Deploy deceptive telemetry beacons", success: 71, exposure: 19, style: "cyber" },
        ],
      },
    };

    return map[stateObj.scenarioId] || map.default;
  }

  function getStructuredOptions(stateObj = state) {
    const library = SCENARIO_OPTION_LIBRARY[stateObj.scenarioId] || SCENARIO_OPTION_LIBRARY.default;
    return library.map((option) => deepClone(option));
  }

  function getCovertOpsTemplates(stateObj = state) {
    return getScenarioUi(stateObj).covertTemplates.map((op) => deepClone(op));
  }

  function assessStrategicInput(text, mode = "decision") {
    const lower = text.toLowerCase().trim();
    const questionLead = /^(should|can|could|would|will|am i|is this|what if|do we|shall we|kya|kya main|kya mai)\b/;
    const offTopicPattern = /\b(god|bhagwan|allah|jesus|religion|horoscope|astrology|girlfriend|boyfriend|dating|marry|wedding|song|movie|cricket score|football|lunch|dinner|vacation|holiday)\b/;
    const philosophicalPattern = /\b(am i god|who am i|meaning of life|why are we here|kya mai.*bhagwan|kya main.*bhagwan|mai.*bhagwan|main.*bhagwan|bhagwan hun|bhagwan hoon)\b/;
    const attackPattern = /\b(attack|strike|missile|bomb|raid|destroy|invade|launch|hit|assassinat|kill|eliminat|airstrike|artillery|commando|hamla|yudh|jung)\b/;
    const nonsenseInstrumentPattern = /\b(7\s?up|soda|soft drink|coke|pepsi|sprite|fanta|potato|banana|tomato|shoe|slipper|spoon|pillow|cricket bat|water bottle|sandwich|biscuit|eraser|pen)\b/;
    const credibleInstrumentPattern = /\b(missile|missiles|drone|drones|fighter|fighters|aircraft|artillery|commando|special forces|troops|fleet|carrier|naval|cyber|malware|sanction|sanctions|diplomacy|diplomatic|demarche|intelligence|surveillance|radar|air defense|missile defense|shield|interceptor|police|nsg|satellite)\b/;
    const strategicTerms = /\b(nuclear|nuke|atomic|warhead|assassinat|kill|eliminat|airstrike|strike|missile|bomb|raid|attack|artillery|special forces|commando|cyber|hack|malware|grid|radar|network|satellite|signal|diplomac|fatf|sanction|coalition|treaty|mediate|econom|market|rupee|stock|oil|inflation|fiscal|rbi|jobs|trade|public|media|parliament|protest|election|riot|communal|panic|legal|law|evidence|court|border|terror|china|pakistan|army|navy|air force|police|hospital|evacuat|surveillance|intelligence|raw|curfew|patrol|fleet|missile defense|air defense|shield|intercept|briefing|fuel|supply chain|trade route|arrest|seize|screening|hamla|yudh|jung|bazaar|arthvyavastha|seema|sena|fauj|suraksha)\b/;
    const militaryTerms = /\b(army|navy|air force|air|troop|troops|missile|fleet|carrier|escort|border|lac|loc|naval|radar|intercept|air defense|missile defense|commando|special forces|surveillance|sortie|patrol|mobiliz|deploy|ship|coast|sea|ocean|infiltrat|artillery|brigade|squadron|forward post)\b/;
    const securityTerms = /\b(police|nsg|rescue|evacuat|checkpoint|screening|search|hospital|ambulance|metro|station|manhunt|arrest|curfew|safe house|patrol)\b/;
    const infrastructureTerms = /\b(grid|substation|dispatch|load|telecom|power|generator|scada|outage|restore|backup|isolate|patch|firmware|server|network|control room|transformer)\b/;
    const maritimeTerms = /\b(navy|naval|fleet|escort|carrier|shipping|port|harbor|sea lane|maritime|coast|ocean|submarine|frigate|destroyer|convoy)\b/;
    const businessTerms = /\b(boat|boAt|audio|earbud|earbuds|earphone|headphone|speaker|tws|smartwatch|wearable|wearables|anc|nirvana|premium|asp|portfolio|sku|product|roadmap|quality|warranty|service|repair|return|replacement|pricing|price|revenue|margin|profit|discount|bundle|festive|sale|cashback|marketplace|amazon|flipkart|d2c|retail|offline|dealer|distributor|channel|customer|consumer|youth|gen z|brand|campaign|celebrity|influencer|creator|cricket|ipl|bollywood|boathead|community|manufactur|make in india|local|component|chip|supplier|supply chain|inventory|working capital|factory|vendor|funding|investor|ipo|valuation|team|ceo|cfo|cmo|category|competition|competitor|competitors|acquire|acquisition|merger|m&a|takeover|noise|fire-boltt|boult|jbl|sony|apple|strategy|business)\b/;
    const isQuestion = questionLead.test(lower) || /\?/.test(text);
    const methodMatch = lower.match(/\b(?:with|using)\s+(?:an?\s+)?([a-z0-9][a-z0-9\s-]{0,40})/);
    const methodText = methodMatch ? methodMatch[1].trim() : "";

    if (attackPattern.test(lower) && (nonsenseInstrumentPattern.test(lower) || (methodText && !credibleInstrumentPattern.test(methodText)))) {
      return {
        valid: false,
        category: "absurd_instrument",
        reason: "This is not a credible state instrument or military method.",
        guidance: "Use a real state action such as sanctions, police action, cyber defense, force movement, diplomacy, intelligence collection, or a limited strike.",
      };
    }

    if (offTopicPattern.test(lower) || philosophicalPattern.test(lower)) {
      return {
        valid: false,
        category: "irrelevant",
        reason: "This input is irrelevant to the crisis simulation.",
        guidance: "Use the decision console for executable state actions and the emergency meeting for strategic questions tied to the crisis.",
      };
    }

    if (mode !== "meeting" && isQuestion) {
      return {
        valid: false,
        category: "question_not_order",
        reason: "This field expects an executable order, not a question.",
        guidance: "If you want advice or a what-if analysis, use the Emergency Meeting. If you want to act, write a direct order.",
      };
    }

    if (!strategicTerms.test(lower) && !businessTerms.test(lower)) {
      return {
        valid: false,
        category: "unclear",
        reason: "The input is too vague or non-strategic to simulate credibly.",
        guidance: "Specify a real action such as product portfolio changes, pricing discipline, marketplace/offline channel strategy, brand campaign design, service improvement, manufacturing localization, or investor/IPO preparation.",
      };
    }

    if (mode === "business" && !businessTerms.test(lower)) {
      return {
        valid: false,
        category: "not_business",
        reason: "This does not read like a boAt business, product, brand, channel, finance, service, or operations decision.",
        guidance: "Use this panel for audio/wearables portfolio choices, pricing, marketplace/offline channels, creator campaigns, service quality, manufacturing, margin discipline, or IPO-readiness.",
      };
    }

    if (mode === "military" && !militaryTerms.test(lower)) {
      return {
        valid: false,
        category: "not_military",
        reason: "This does not read like a military command or force-posture order.",
        guidance: "Use this panel for troop movement, surveillance, readiness changes, missile defense, naval posture, air patrols, or special forces tasks.",
      };
    }

    if (mode === "security" && !securityTerms.test(lower)) {
      return {
        valid: false,
        category: "not_security",
        reason: "This does not read like an internal-security or emergency-response order.",
        guidance: "Use this panel for police deployments, evacuations, hospital surge, arrests, checkpoints, search operations, or public-protection measures.",
      };
    }

    if (mode === "infrastructure" && !infrastructureTerms.test(lower)) {
      return {
        valid: false,
        category: "not_infrastructure",
        reason: "This does not read like a grid, telecom, or infrastructure-response order.",
        guidance: "Use this panel for isolation, restoration, telecom hardening, dispatch control, backup crews, patching, or outage-containment orders.",
      };
    }

    if (mode === "maritime" && !maritimeTerms.test(lower)) {
      return {
        valid: false,
        category: "not_maritime",
        reason: "This does not read like a maritime or naval response order.",
        guidance: "Use this panel for escorts, fleet movement, shipping security, port posture, surveillance, or sea-lane protection.",
      };
    }

    return { valid: true, category: "credible", reason: "", guidance: "" };
  }

  function rejectStrategicInput(label, text, assessment) {
    state.outcomeSummary = `${label} not implemented: ${assessment.reason}`;
    state.outcomeText = `${label} not implemented.\n\nSubmitted text: ${text}\n\nWhy it was rejected: ${assessment.reason}\n\nWhat to do instead: ${assessment.guidance}`;
    els.outcome.textContent = state.outcomeText;
    setStatus(`${label} rejected: ${assessment.reason}`, true);
    saveState();
    renderAll();
  }

  function businessProfileFromCustom(text) {
    const lower = text.toLowerCase();
    const profile = {
      id: "CUSTOM",
      title: text,
      domain: "Business",
      style: "business",
      severity: 12,
      risk: 0.38,
      legality: 0.92,
      targets: ["Consumer Electronics Market"],
      statsDelta: { EconomicStability: 1, PublicConfidence: 1 },
      threatDelta: { EconomicPressure: 1 },
      economyDelta: { StockIndex: 1 },
      systemsDelta: { MarketConfidence: 1 },
    };

    if (/fake|fabricat|mislead|inflate|lie|false claim|fake traction|fake revenue|manipulat|hide defect|hide return|fake review|undisclosed paid review/.test(lower)) {
      return {
        ...profile,
        domain: "Ethics",
        style: "unethical",
        severity: 74,
        risk: 0.94,
        legality: 0.06,
        statsDelta: { DiplomaticStanding: -18, PublicConfidence: -16, EconomicStability: -12, FiscalHealth: -10, AirQuality: -12 },
        threatDelta: { DisinformationRisk: 22, EconomicPressure: 14, TerrorThreat: 16, BorderTension: 10 },
        economyDelta: { StockIndex: -14, CurrencyValue: -12 },
        systemsDelta: { MarketConfidence: -18, InfrastructureIntegrity: -6 },
      };
    }

    if (/all categor|everything|simultaneously|at once|every segment|every sku|flood|ultra.?low|loss leader|race to bottom|price war/.test(lower)) {
      profile.domain = "Strategy";
      profile.style = "overreach";
      profile.severity = 18;
      profile.risk = 0.68;
      profile.legality = 0.84;
      profile.statsDelta = { AirQuality: -5, FiscalHealth: -5, NationalSecurity: -3, EconomicStability: -2 };
      profile.threatDelta = { DisinformationRisk: 8, PollutionCrisis: 7, EconomicPressure: 6, BorderTension: 4 };
      profile.economyDelta = { StockIndex: 1, CurrencyValue: -4, DefenseSpending: -4 };
      profile.systemsDelta = { SupplyChainIntegrity: -6, InfrastructureIntegrity: -5, HealthcareCapacity: -4 };
    }

    if (/retail|offline|distributor|dealer|tier 2|tier 3|store|shelf|channel|marketplace|amazon|flipkart|d2c|website/.test(lower)) {
      profile.domain = "Channels";
      profile.style = "market";
      profile.severity += 2;
      profile.risk = Math.min(profile.risk, 0.44);
      profile.statsDelta = { ...(profile.statsDelta || {}), EconomicStability: 3, PublicConfidence: 2, CommunalHarmony: 3, FiscalHealth: -1 };
      profile.threatDelta = { ...(profile.threatDelta || {}), BorderTension: -2, EconomicPressure: 2 };
      profile.economyDelta = { ...(profile.economyDelta || {}), StockIndex: 4, OilPrice: -1 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), MarketConfidence: 4, SupplyChainIntegrity: -1 };
    }

    if (/audio|earbud|earphone|headphone|speaker|anc|nirvana|premium|asp|sound quality|battery|product|portfolio|sku|smartwatch|wearable/.test(lower)) {
      profile.domain = "Product";
      profile.style = "product";
      profile.statsDelta = { ...(profile.statsDelta || {}), NationalSecurity: 5, PublicConfidence: 2, DiplomaticStanding: 1, FiscalHealth: /premium|asp|anc|nirvana/.test(lower) ? 3 : -1 };
      profile.threatDelta = { ...(profile.threatDelta || {}), PollutionCrisis: -5, DisinformationRisk: -2, TerrorThreat: /smartwatch|wearable/.test(lower) ? 2 : -2 };
      profile.economyDelta = { ...(profile.economyDelta || {}), DefenseSpending: /premium|innovation|anc/.test(lower) ? -2 : 1, CurrencyValue: /premium|asp/.test(lower) ? 3 : 1 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), InfrastructureIntegrity: 2, SupplyChainIntegrity: 2 };
    }

    if (/price|pricing|revenue|margin|profit|discount|bundle|festive|sale|cashback|free|cheap|cut price|asp|ipo|valuation/.test(lower)) {
      profile.domain = "Finance";
      profile.style = /free|cheap|cut price|blanket discount|deep discount/.test(lower) ? "pricing" : "finance";
      profile.statsDelta = { ...(profile.statsDelta || {}), EconomicStability: 2, FiscalHealth: /free|cheap|deep discount/.test(lower) ? -4 : 4 };
      profile.threatDelta = { ...(profile.threatDelta || {}), EconomicPressure: /free|cheap|deep discount/.test(lower) ? 5 : -4 };
      profile.economyDelta = { ...(profile.economyDelta || {}), CurrencyValue: /free|cheap|deep discount/.test(lower) ? -3 : 4, StockIndex: 2 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), MarketConfidence: 2 };
    }

    if (/warranty|service|return|replacement|quality|defect|customer support|repair|trust|review|complaint|governance/.test(lower)) {
      profile.domain = "Trust";
      profile.style = "governance";
      profile.risk = Math.min(profile.risk, 0.26);
      profile.legality = 0.98;
      profile.statsDelta = { ...(profile.statsDelta || {}), DiplomaticStanding: 5, PublicConfidence: 4, CommunalHarmony: 2, FiscalHealth: -1 };
      profile.threatDelta = { ...(profile.threatDelta || {}), DisinformationRisk: -5, PollutionCrisis: -2 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), MarketConfidence: 3, HealthcareCapacity: 5, RefugeePressure: -4 };
    }

    if (/manufactur|make in india|local|component|chip|supplier|supply chain|inventory|working capital|factory|vendor/.test(lower)) {
      profile.domain = "Operations";
      profile.style = "operations";
      profile.statsDelta = { ...(profile.statsDelta || {}), FiscalHealth: 2, MilitaryReadiness: 2, DiplomaticStanding: 2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), EconomicPressure: -2, PollutionCrisis: -2 };
      profile.economyDelta = { ...(profile.economyDelta || {}), OilPrice: 3, DefenseSpending: 2 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), SupplyChainIntegrity: 5, OilStability: 2 };
    }

    if (/celebrity|influencer|creator|cricket|ipl|bollywood|boathead|campaign|brand|youth|gen z|community|social/.test(lower)) {
      profile.domain = "Brand";
      profile.style = "brand";
      profile.statsDelta = { ...(profile.statsDelta || {}), PublicConfidence: 5, AirQuality: 4, FiscalHealth: -2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), DisinformationRisk: -3, EconomicPressure: 2 };
      profile.economyDelta = { ...(profile.economyDelta || {}), StockIndex: 3 };
      profile.systemsDelta = { ...(profile.systemsDelta || {}), MarketConfidence: 2 };
    }

    return profile;
  }
  function optionProfileFromCustom(text) {
    const assessment = assessStrategicInput(text, "decision");
    if (!assessment.valid) {
      return {
        id: "INVALID",
        title: text,
        invalid: true,
        invalidReason: assessment.reason,
        invalidGuidance: assessment.guidance,
        invalidCategory: assessment.category,
      };
    }

    if (isBusinessScenario(state)) {
      return businessProfileFromCustom(text);
    }

    const lower = text.toLowerCase();
    const profile = {
      id: "CUSTOM",
      title: text,
      domain: "Mixed",
      style: "mixed",
      severity: 18,
      risk: 0.5,
      legality: 0.7,
      targets: [],
      statsDelta: {},
      threatDelta: {},
      economyDelta: {},
      systemsDelta: {},
    };

    if (/nuclear|nuke|atomic/.test(lower)) {
      profile.domain = "Strategic";
      profile.style = "nuclear";
      profile.severity = 96;
      profile.risk = 0.99;
      profile.legality = 0.0;
      profile.targets = lower.includes("china") ? ["China"] : ["Pakistan"];
      profile.nuclearRetaliationClaimed = /\b(retaliat|second[-\s]?strike|respond|response|reprisal|counterstrike|after)\b/.test(lower) ||
        /\b(pakistan|china|enemy|adversary)\b.*\b(nuke|nuked|nuclear|atomic|warhead|bombed)\b.*\bindia\b/.test(lower);
      profile.statsDelta = { NationalSecurity: -24, PublicConfidence: -25, EconomicStability: -30, DiplomaticStanding: -36, CommunalHarmony: -18, AirQuality: -14 };
      profile.threatDelta = { BorderTension: 38, EconomicPressure: 32, PollutionCrisis: 16, DisinformationRisk: 24, TerrorThreat: 10 };
      profile.economyDelta = { StockIndex: -30, CurrencyValue: -28, OilPrice: -18, Inflation: -16, DefenseSpending: -20 };
      return profile;
    }

    if (/assassinat|decapitat|kill\s+prime\s+minister/.test(lower)) {
      profile.domain = "Extra-Legal";
      profile.style = "decapitation";
      profile.severity = 80;
      profile.risk = 0.96;
      profile.legality = 0.02;
      profile.targets = lower.includes("china") ? ["China"] : ["Pakistan"];
      profile.statsDelta = { NationalSecurity: -14, PublicConfidence: -18, EconomicStability: -15, DiplomaticStanding: -30, CommunalHarmony: -12 };
      profile.threatDelta = { BorderTension: 30, EconomicPressure: 22, DisinformationRisk: 18, TerrorThreat: 8 };
      profile.economyDelta = { StockIndex: -22, CurrencyValue: -18, Inflation: -9 };
      return profile;
    }

    if (/airstrike|strike|missile|raid|artillery/.test(lower)) {
      profile.style = "kinetic";
      profile.domain = "Security";
      profile.severity += 16;
      profile.risk += 0.2;
      profile.targets.push("Pakistan");
      profile.statsDelta = { NationalSecurity: 5, PublicConfidence: 3, DiplomaticStanding: -3 };
      profile.threatDelta = { TerrorThreat: -6, BorderTension: 9, DisinformationRisk: 4 };
      profile.economyDelta = { StockIndex: -4, CurrencyValue: -3 };
    }

    if (/diplom|un|fatf|sanction|coalition|backchannel/.test(lower)) {
      profile.style = "diplomatic";
      profile.domain = "Diplomacy";
      profile.severity += 4;
      profile.risk -= 0.08;
      profile.statsDelta = { ...(profile.statsDelta || {}), DiplomaticStanding: 6, PublicConfidence: 1 };
      profile.threatDelta = { ...(profile.threatDelta || {}), BorderTension: -4, TerrorThreat: -2 };
      profile.economyDelta = { ...(profile.economyDelta || {}), StockIndex: 2, CurrencyValue: 2 };
    }

    if (/econom|relief|liquidity|market|rupee|fiscal|rbi/.test(lower)) {
      profile.style = "economic";
      profile.domain = "Economy";
      profile.severity += 2;
      profile.risk -= 0.05;
      profile.statsDelta = { ...(profile.statsDelta || {}), EconomicStability: 6, FiscalHealth: -3, PublicConfidence: 2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), EconomicPressure: -8 };
      profile.economyDelta = { ...(profile.economyDelta || {}), StockIndex: 6, CurrencyValue: 4, Unemployment: 2 };
    }

    if (/pollution|air|smog|health|emission|crop/.test(lower)) {
      profile.style = "environment";
      profile.domain = "Environment";
      profile.statsDelta = { ...(profile.statsDelta || {}), AirQuality: 8, PublicConfidence: 2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), PollutionCrisis: -10 };
    }

    if (/cyber|grid|network|digital|radar/.test(lower)) {
      profile.style = "cyber";
      profile.domain = "Cyber";
      profile.severity += 8;
      profile.risk += 0.03;
      profile.statsDelta = { ...(profile.statsDelta || {}), NationalSecurity: 3, EconomicStability: 2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), DisinformationRisk: -4, EconomicPressure: -3 };
    }

    if (/media|communication|narrative|community|fact/.test(lower)) {
      profile.style = "information";
      profile.domain = "Information";
      profile.statsDelta = { ...(profile.statsDelta || {}), PublicConfidence: 5, CommunalHarmony: 4 };
      profile.threatDelta = { ...(profile.threatDelta || {}), DisinformationRisk: -10 };
    }

    if (/police|hospital|evacuat|curfew|screening|arrest|rescue|internal security|nsg/.test(lower)) {
      profile.style = "domestic";
      profile.domain = "Internal";
      profile.severity += 6;
      profile.risk -= 0.05;
      profile.statsDelta = { ...(profile.statsDelta || {}), NationalSecurity: 3, PublicConfidence: 2 };
      profile.threatDelta = { ...(profile.threatDelta || {}), TerrorThreat: -4, DisinformationRisk: -2 };
    }

    if (/intelligence|raw|surveillance|monitor|intercept|handler|informant/.test(lower)) {
      profile.style = "covert";
      profile.domain = "Intelligence";
      profile.severity += 8;
      profile.risk += 0.04;
      profile.legality = Math.min(profile.legality, 0.68);
      profile.statsDelta = { ...(profile.statsDelta || {}), NationalSecurity: 4 };
      profile.threatDelta = { ...(profile.threatDelta || {}), TerrorThreat: -4, DisinformationRisk: -1 };
    }

    if (/navy|naval|fleet|escort|carrier|sea|ocean|coast/.test(lower)) {
      profile.style = "kinetic";
      profile.domain = "Security";
      profile.severity += 10;
      profile.risk += 0.08;
      profile.statsDelta = { ...(profile.statsDelta || {}), MilitaryReadiness: 4 };
      profile.threatDelta = { ...(profile.threatDelta || {}), BorderTension: 4 };
    }

    if (/missile defense|air defense|shield|intercept/.test(lower)) {
      profile.style = "defensive";
      profile.domain = "Security";
      profile.severity += 5;
      profile.risk -= 0.08;
      profile.legality = Math.max(profile.legality, 0.9);
      profile.statsDelta = { ...(profile.statsDelta || {}), MilitaryReadiness: 4, PublicConfidence: 1 };
      profile.threatDelta = { ...(profile.threatDelta || {}), TerrorThreat: -1 };
    }

    if (!profile.targets.length && (profile.style === "kinetic" || profile.style === "covert" || profile.style === "decapitation")) {
      profile.targets = ["Pakistan"];
    }

    profile.risk = Math.max(0.15, Math.min(0.99, profile.risk));
    profile.severity = clamp(profile.severity, 1, 100);

    return profile;
  }

  function generateAdvisorAdvice(advisor, stateObj) {
    const style = advisor.personality;
    const escalation = stateObj.escalationStage;
    const terror = stateObj.threats.TerrorThreat;
    const economy = stateObj.economy.StockIndex;
    const panic = stateObj.sentiment.PanicLevel;

    if (style === "aggressive") {
      return terror > 70
        ? "We need rapid kinetic pressure before hostile networks regroup. Delay helps the adversary."
        : "Maintain force posture and show credible retaliation capability to preserve deterrence.";
    }
    if (style === "cautious") {
      return economy < 50
        ? "Any escalation now could trigger currency stress and capital outflows. Stabilize markets first."
        : "Contain risk. Calibrated response with fiscal shielding is safer than broad escalation.";
    }
    if (style === "political") {
      return panic > 55
        ? "Public anxiety is high. We need visible action plus social-cohesion messaging immediately."
        : "Parliament and opposition pressure can be managed if we sequence communication before force.";
    }
    if (style === "covert") {
      return "A deniable operation can reduce threat without immediate public escalation, but exposure risk remains.";
    }
    return `Current stage is ${escalation}. We should preserve diplomatic space while preparing controlled contingencies.`;
  }

  function generateMeetingSummaryCard(advisor, stateObj) {
    const scenario = currentScenario(stateObj);
    if (isBusinessScenario(stateObj)) {
      const summaries = {
        ceo: `Protect audio leadership while fixing weak wearables economics. Retailer confidence is ${stateObj.systems.MarketConfidence}/100 and positioning clarity is ${stateObj.stats.AirQuality}/100.`,
        cfo: `Margin health is ${stateObj.stats.FiscalHealth}/100. Discounting must defend share without damaging IPO-readiness.`,
        product: `Portfolio strength is ${stateObj.stats.NationalSecurity}/100. Premium audio and fewer weak smartwatch SKUs are the product bottleneck.`,
        marketing: `Brand love is ${stateObj.stats.PublicConfidence}/100. Campaigns must feel cultural, not just paid celebrity noise.`,
        ecommerce: `Sales momentum is ${stateObj.economy.StockIndex}/100. Marketplaces want discounts; D2C needs stronger conversion economics.`,
        retail: `Channel alignment is ${stateObj.stats.CommunalHarmony}/100. Offline expansion needs inventory discipline and retailer trust.`,
        ops: `Manufacturing resilience is ${stateObj.systems.SupplyChainIntegrity}/100. Local sourcing helps only if quality and working capital hold.`,
        investor: `Investor scrutiny is ${stateObj.domestic.OppositionPressure}/100. The board wants profitable growth, service quality, and an IPO-ready story.`,
      };
      return summaries[advisor.id] || "Stay focused on portfolio discipline, margin control, brand equity, channel execution, and service quality.";
    }

    const border = stateObj.threats.BorderTension;
    const terror = stateObj.threats.TerrorThreat;
    const markets = stateObj.economy.StockIndex;

    const summaries = {
      defence: terror > 75 || border > 70
        ? "Wants visible readiness and a credible response line, but not a move that traps India into uncontrolled escalation."
        : "Supports quiet force protection and deterrent signaling while waiting for a cleaner trigger."
      ,
      finance: markets < 55
        ? "Focused on preventing panic in the rupee, insurers, and fuel markets before any public escalation."
        : "Prepared to absorb short stress, but not an open-ended conflict shock."
      ,
      home: terror > 80
        ? "Focused on urban security, panic control, and preventing communal backlash after the incident."
        : "Focused on keeping public order stable while avoiding overreaction."
      ,
      external: `Wants India's first move in ${scenario.name} to be explainable in law, diplomacy, and alliance politics.`,
      raw: "Pushing for cleaner attribution, selective covert disruption, and tighter evidence before the loudest step.",
      nsa: "Trying to sequence the room: objective first, response ladder second, public line third.",
      army: border > 72
        ? "Prepared for retaliation on the frontier and wary of any move that creates a two-front posture problem."
        : "Prefers readiness and contingency depth over theatrical signaling."
      ,
      air: "Wants any strike discussion tied to weather, air-defense exposure, and a defined political end state.",
      navy: "Watching sea-lane security, maritime signaling, and the risk that a land crisis spills into shipping.",
    };

    return summaries[advisor.id] || generateAdvisorAdvice(advisor, stateObj);
  }

  function refreshIntelReport(stateObj) {
    const random = seededRandom(stateObj.turn * 113 + stateObj.escalationIndex * 7 + stateObj.fogOfWar.uncertainty * 13);
    const confidence = clamp(
      62 - Math.round(stateObj.fogOfWar.uncertainty / 2) + Math.round(random() * 22) - 10,
      28,
      88
    );

    const attackProb = clamp(
      40 + Math.round(stateObj.threats.TerrorThreat * 0.35) - Math.round(stateObj.adaptation.guerrillaShift * 0.15),
      12,
      94
    );
    const outageProb = clamp(32 + Math.round((100 - stateObj.systems.InfrastructureIntegrity) * 0.55), 10, 96);
    const interceptProb = clamp(28 + Math.round(stateObj.threats.BorderTension * 0.48), 12, 95);

    const maybeFalse = chance(random, stateObj.fogOfWar.uncertainty / 180);
    const reportsByScenario = {
      india_china_border: [
        {
          section: "Frontier Movements",
          text: maybeFalse
            ? "Cloud cover and terrain masking are degrading confidence in fresh troop counts across two northern sectors."
            : "Forward logistics activity and shelter construction continue near at least two Chinese staging points.",
        },
        {
          section: "Patrol Contact Risk",
          text: `Probability of a physical confrontation or patrol detention within 48 hours: ${interceptProb}%.`,
        },
        {
          section: "Air & ISR Picture",
          text: "Air-defense radars are active deeper in theatre, but there is no clear evidence of strike packages forming yet.",
        },
        {
          section: "Diplomatic Signals",
          text: "Backchannels remain open, but Beijing is pairing talks with coercive military signaling rather than de-escalation.",
        },
        {
          section: "Covert Windows",
          text: "Low-visibility ISR expansion is feasible; sabotage or deniable cross-border disruption carries immediate exposure risk.",
        },
      ],
      mumbai_terror: [
        {
          section: "Handler Chatter",
          text: `Encrypted traffic suggests surviving handlers may attempt a second-wave disruption. Probability estimate within 72 hours: ${attackProb}%.`,
        },
        {
          section: "Urban Security Picture",
          text: maybeFalse
            ? "Witness reports from transit hubs are contradictory; suspect movement timelines remain unreliable."
            : "Police and technical surveillance indicate at least one support network may still be active inside the metro region.",
        },
        {
          section: "Hospital & Rescue Load",
          text: "Trauma centers remain under strain, but surge beds and blood inventories are still within emergency tolerance.",
        },
        {
          section: "Cross-Border Attribution",
          text: "Initial foreign liaison feedback supports external-handler involvement, but evidentiary standards remain incomplete.",
        },
        {
          section: "Public Information Risk",
          text: "Rumor velocity remains elevated; communal flashpoint potential rises sharply if official messaging fragments.",
        },
      ],
      secondorder_business: [
        {
          section: "Category Demand Signals",
          text: `Audio demand remains healthier than smartwatches, but customers are comparing battery, ANC, service, and price more sharply. Sales momentum estimate: ${clamp(stateObj.economy.StockIndex + Math.round(stateObj.systems.MarketConfidence * 0.2), 18, 88)}%.`,
        },
        {
          section: "Portfolio Pressure",
          text: maybeFalse
            ? "Smartwatch profitability and premium audio execution are unclear because channel feedback is incomplete."
            : "Core tension: protect audio leadership, rationalize weak smartwatch economics, and avoid launching too many similar SKUs.",
        },
        {
          section: "Pricing & Margin",
          text: "Marketplace discounting can defend share, but repeated deep cuts weaken ASP, gross margin, and IPO-readiness.",
        },
        {
          section: "Competitive Landscape",
          text: "Noise and Fire-Boltt attack smartwatches, Boult pressures budget audio, while JBL, Sony, Apple, and premium challengers shape quality expectations.",
        },
        {
          section: "Trust Requirements",
          text: "Warranty turnaround, service consistency, product durability, and clear claims matter as much as celebrity campaigns once the brand scales.",
        },
      ],
      indopacific_standoff: [
        {
          section: "Naval Movements",
          text: maybeFalse
            ? "Satellite revisit gaps leave convoy and escort counts uncertain in the eastern corridor."
            : "Hostile escort patterns are tightening near exposed shipping lanes and strategic chokepoints.",
        },
        {
          section: "Interception Risk",
          text: `Probability of a coercive intercept, shadowing incident, or unsafe maneuver in the next 48 hours: ${interceptProb}%.`,
        },
        {
          section: "Commercial Exposure",
          text: "Insurers and shippers are rerouting selectively, with war-risk premiums rising fastest on energy-linked routes.",
        },
        {
          section: "Alliance Signaling",
          text: "Partners will share maritime awareness data, but none are signaling automatic military backing for Indian coercive action.",
        },
        {
          section: "Signals & Surveillance",
          text: "Electronic signatures suggest active radar discipline and targeting support around contested sea-lane corridors.",
        },
      ],
      grid_cyber_war: [
        {
          section: "Grid Intrusions",
          text: maybeFalse
            ? "Telemetry from two affected substations is inconsistent, leaving the precise malware path unresolved."
            : "Intrusion signatures indicate coordinated access attempts against dispatch, telecom, and backup-control layers.",
        },
        {
          section: "Outage Spread Risk",
          text: `Probability of additional cascading outages in the next 24 hours: ${outageProb}%.`,
        },
        {
          section: "Restoration Status",
          text: "Manual continuity protocols are slowing recovery but reducing the chance of a wider uncontrolled grid collapse.",
        },
        {
          section: "Attribution Signals",
          text: "Technical indicators point toward a sophisticated hostile actor, but partner agencies still want cleaner attribution before public blame.",
        },
        {
          section: "Public Order Risk",
          text: "Cash access, fuel queues, and outage rumors are becoming the main stress multipliers for confidence and compliance.",
        },
      ],
      default: [
        {
          section: "Foreign Military Movements",
          text: maybeFalse
            ? "Satellite imagery partially obscured; troop movement estimates remain uncertain in the western sector."
            : "Increased logistics movement observed near two forward staging points.",
        },
        {
          section: "Terror Chatter",
          text: `Encrypted handler traffic indicates potential high-impact attempt within 72 hours. Probability estimate: ${attackProb}%.`,
        },
        {
          section: "Cyber Threats",
          text: "Grid intrusion signatures indicate coordinated probing against dispatch control systems.",
        },
        {
          section: "Diplomatic Signals",
          text: "Backchannel messages suggest major powers seek de-escalation but are preparing sanction options.",
        },
        {
          section: "Covert Operations",
          text: "Two proposed covert windows identified; exposure risk remains above baseline due media saturation.",
        },
      ],
    };

    const reports = reportsByScenario[stateObj.scenarioId] || reportsByScenario.default;

    stateObj.intelligence.confidence = confidence;
    stateObj.intelligence.reports = reports;
  }

  function refreshHeadlines(stateObj) {
    const lastDecision = stateObj.history[0];
    const headsByScenario = {
      india_china_border: [
        stateObj.threats.BorderTension > 75
          ? "Breaking: Forward sectors report visible reinforcement and harder signaling across the frontier."
          : "Border formations remain tense but no major breakthrough or withdrawal is visible yet.",
        stateObj.economy.StockIndex < 55
          ? "Markets turn cautious as traders price a longer India-China military standoff."
          : "Investors remain watchful for signs that the frontier crisis will hit trade or fuel confidence.",
        stateObj.domestic.OppositionPressure > 55
          ? "Opposition presses government to explain escalation thresholds and end-state planning."
          : "Political class waits for clarity on whether the crisis remains controlled or shifts toward confrontation.",
        stateObj.systems.SupplyChainIntegrity < 58
          ? "Logistics planners warn that a prolonged mountain posture could strain movement and supply depth."
          : "Military logistics remain stretched but stable across the main northern support routes.",
        lastDecision
          ? `After ${lastDecision.title}, analysts debate whether India has strengthened deterrence or narrowed diplomatic space.`
          : "Security analysts warn that misreading intent on the frontier could trigger a preventable incident.",
      ],
      mumbai_terror: [
        stateObj.threats.TerrorThreat > 80
          ? "Breaking: Agencies warn that the network behind the attack may still retain operational capacity."
          : "Security agencies say the immediate urban threat may be narrowing but remains unresolved.",
        stateObj.sentiment.PanicLevel > 58
          ? "Panic buying, school closures, and transport anxiety spread as the city absorbs the shock."
          : "City services continue under guard as officials try to keep public confidence from collapsing.",
        stateObj.domestic.OppositionPressure > 55
          ? "Opposition demands answers on prior warnings, preparedness, and the government's next steps."
          : "Political critics hold fire for now but are demanding faster clarity on accountability.",
        stateObj.systems.HealthcareCapacity < 58
          ? "Trauma centers and emergency services report mounting strain after the attack."
          : "Hospitals remain under pressure but emergency capacity is still holding.",
        lastDecision
          ? `After ${lastDecision.title}, debate intensifies over whether the response is containing the threat or fueling backlash.`
          : "Officials warn that rumor control and communal stability now matter almost as much as the manhunt itself.",
      ],
      secondorder_business: [
        stateObj.systems.MarketConfidence > 55
          ? "Retailers and marketplaces show stronger confidence as boAt clarifies channel economics."
          : "Marketplaces remain cautious; rivals are using discounting to pressure boAt's hero categories.",
        stateObj.stats.FiscalHealth < 45
          ? "Margin pressure forces management to choose between share defense, ad spend, and profitability."
          : "Margin health remains manageable if discounting and inventory are controlled.",
        stateObj.threats.PollutionCrisis > 70
          ? "Commoditization warning: too many similar low-cost SKUs are weakening differentiation."
          : "Portfolio discipline improves as premium audio and service quality receive more focus.",
        stateObj.threats.DisinformationRisk > 70
          ? "Brand dilution risk rises as aggressive discounting makes boAt look less premium."
          : "Positioning improves around affordable lifestyle tech with clearer premium audio ambitions.",
        lastDecision
          ? `After ${lastDecision.title}, stakeholders debate whether the move protects brand equity or stretches execution.`
          : "The case begins at a strategic crossroads: audio strength, wearables pressure, and IPO discipline.",
      ],
      indopacific_standoff: [
        stateObj.threats.BorderTension > 72
          ? "Breaking: Naval tracking shows more aggressive maneuvering around exposed Indian Ocean corridors."
          : "Sea-lane traffic remains tense but open as fleets test each other's limits.",
        stateObj.economy.StockIndex < 55
          ? "Shipping and energy-linked stocks slide as insurers widen war-risk pricing."
          : "Markets remain sensitive to any sign that the standoff will disrupt shipping or energy routes.",
        stateObj.domestic.OppositionPressure > 55
          ? "Opposition asks whether maritime signaling is backed by a coherent trade and alliance strategy."
          : "Domestic debate centers on whether India can deter without choking its own commerce.",
        stateObj.systems.SupplyChainIntegrity < 58
          ? "Logistics planners warn that prolonged escort operations could strain shipping reliability."
          : "Commercial routes remain open, but carriers are building in wider risk buffers.",
        lastDecision
          ? `After ${lastDecision.title}, maritime analysts debate whether India improved leverage or invited a sharper naval contest.`
          : "Regional observers say the next few patrol cycles will reveal whether signaling remains controlled.",
      ],
      grid_cyber_war: [
        stateObj.systems.InfrastructureIntegrity < 55
          ? "Breaking: Grid instability and telecom disruption continue across affected zones."
          : "Engineers report partial stabilization, but the outage chain remains fragile.",
        stateObj.economy.StockIndex < 55
          ? "Markets slide as traders price longer outages, banking friction, and industrial slowdown."
          : "Markets are holding, but investors remain hypersensitive to recovery credibility.",
        stateObj.domestic.OppositionPressure > 55
          ? "Opposition demands answers on infrastructure resilience, attribution, and preparedness."
          : "Political scrutiny grows as citizens ask how long essential outages will continue.",
        stateObj.sentiment.PanicLevel > 58
          ? "Fuel queues, ATM stress, and rumor cascades are becoming secondary drivers of the crisis."
          : "Public anxiety remains elevated, but orderly communication is preventing a broader panic wave.",
        lastDecision
          ? `After ${lastDecision.title}, analysts debate whether the recovery plan is genuinely stabilizing the grid or merely buying time.`
          : "Officials warn that confidence now depends as much on restoration discipline as on cyber attribution.",
      ],
      default: [
        stateObj.threats.BorderTension > 68
          ? "Breaking: Border surveillance detects posture changes across forward sectors."
          : "Border command reports guarded but stable force posture.",
        stateObj.economy.StockIndex < 55
          ? "Markets volatile as investors price in prolonged crisis risk."
          : "Markets hold but remain sensitive to escalation signals.",
        stateObj.domestic.OppositionPressure > 55
          ? "Opposition demands immediate parliamentary disclosure on crisis decisions."
          : "Political opposition calibrates response while awaiting the next government move.",
        stateObj.systems.HealthcareCapacity < 58
          ? "Hospitals report rising operational strain in high-pressure districts."
          : "State health systems remain functional but are monitoring stress indicators closely.",
        lastDecision
          ? `After ${lastDecision.title}, analysts debate whether the move will stabilize or widen the crisis.`
          : "Security agencies warn that misinformation pressure is complicating public understanding of events.",
      ],
    };
    const heads = headsByScenario[stateObj.scenarioId] || headsByScenario.default;

    stateObj.headlines = heads.map((h, i) => ({ id: `hd-${i}`, time: formatTime(stateObj.clock), text: h }));
  }

  function refreshStrategicSummaries(stateObj, outcomeContext = null) {
    stateObj.liveFeedSummary = composeStrategicSummary(stateObj, "live");
    stateObj.outcomeSummary = outcomeContext
      ? composeStrategicSummary(stateObj, "consequence", outcomeContext)
      : stateObj.outcomeSummary || "Decision summary will appear here after you act.";
  }
  function updateEscalation(stateObj, delta, reason = "") {
    stateObj.escalationIndex = clamp(stateObj.escalationIndex + delta, 0, 100);
    stateObj.escalationStage = stageForState(stateObj);
    if (reason) {
      pushAlert(stateObj, "escalation", `${reason}: escalation index ${stateObj.escalationIndex}.`);
    }
  }

  function scheduleEvent(stateObj, kind, delayMinutes, payload = {}, description = "") {
    stateObj.pendingEvents.push({
      id: `ev-${Math.random().toString(36).slice(2, 9)}`,
      kind,
      dueAt: addMinutes(stateObj.clock, delayMinutes),
      payload,
      description: description || kind,
      createdAt: stateObj.clock,
    });
  }

  function applyMetricMap(target, map, successFactor = 1) {
    Object.keys(map || {}).forEach((k) => {
      target[k] = clamp((target[k] || 0) + Math.round(map[k] * successFactor));
    });
  }

  function stateGroupForKey(stateObj, group) {
    return {
      stats: stateObj.stats,
      threats: stateObj.threats,
      domestic: stateObj.domestic,
      sentiment: stateObj.sentiment,
      economy: stateObj.economy,
      systems: stateObj.systems,
    }[group] || null;
  }

  function applyGroupedDeltas(stateObj, grouped = {}, factor = 1) {
    ["stats", "threats", "domestic", "sentiment", "economy", "systems"].forEach((group) => {
      const target = stateGroupForKey(stateObj, group);
      if (target) applyMetricMap(target, grouped[group], factor);
    });
  }

  function applyDecisionMetricMap(target, map, outcome) {
    const scenario = outcome && outcome.scenario ? outcome.scenario : "Partial";
    const benefitFactor = scenario === "Success" ? 1.1 : scenario === "Partial" ? 0.65 : 0.3;
    const harmFactor = scenario === "Success" ? 0.75 : scenario === "Partial" ? 1 : 1.25;
    Object.entries(map || {}).forEach(([key, rawValue]) => {
      const value = Number(rawValue || 0);
      if (!Number.isFinite(value) || value === 0) return;
      const beneficial = isBadMetric(key) ? value < 0 : value > 0;
      target[key] = clamp((target[key] || 0) + Math.round(value * (beneficial ? benefitFactor : harmFactor)));
    });
  }

  function applyOutcomeWeightedDeltas(stateObj, grouped = {}, outcome) {
    const scenario = outcome && outcome.scenario ? outcome.scenario : "Partial";
    const positiveFactor = scenario === "Success" ? 1 : scenario === "Partial" ? 0.58 : 0.22;
    const negativeFactor = scenario === "Success" ? 0.68 : scenario === "Partial" ? 1 : 1.35;
    ["stats", "threats", "domestic", "sentiment", "economy", "systems"].forEach((group) => {
      const target = stateGroupForKey(stateObj, group);
      const source = grouped[group] || {};
      if (!target) return;
      Object.entries(source).forEach(([key, rawValue]) => {
        const value = Number(rawValue || 0);
        if (!Number.isFinite(value) || value === 0) return;
        const beneficial = isBadMetric(key) ? value < 0 : value > 0;
        const factor = beneficial ? positiveFactor : negativeFactor;
        target[key] = clamp((target[key] || 0) + Math.round(value * factor));
      });
    });
  }

  function scheduleStakeholderReaction(stateObj, delayMinutes, actor, tone, reason, deltas = {}, escalationDelta = 0, leadershipDelta = 0) {
    scheduleEvent(
      stateObj,
      "stakeholder_reaction",
      delayMinutes,
      { actor, tone, reason, deltas, escalationDelta, leadershipDelta },
      `${actor} response: ${reason}`
    );
  }

  function recentDecisionCount(stateObj, predicate) {
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews.slice(-6) : [];
    return reviews.filter(predicate).length;
  }

  function mergeCausalLayer(target, source, immediateFactor = 1, reactionFactor = 1) {
    deterministicLogic.mergeGroupedDeltas(target.immediate, source.immediate || {}, immediateFactor);
    (source.reactions || []).forEach((reaction) => {
      const scaled = deterministicLogic.emptyGroupedDeltas();
      deterministicLogic.mergeGroupedDeltas(scaled, reaction.deltas || {}, reactionFactor);
      target.reactions.push({ ...reaction, deltas: scaled });
    });
    target.notes.push(...(source.notes || []));
    return target;
  }

  function metricSnapshot(stateObj) {
    const snapshot = {};
    deterministicLogic.GROUPS.forEach((group) => {
      snapshot[group] = { ...(stateObj[group] || {}) };
    });
    return snapshot;
  }

  function metricDeltaSummary(before, stateObj, limit = 7) {
    const changes = [];
    deterministicLogic.GROUPS.forEach((group) => {
      Object.entries(stateObj[group] || {}).forEach(([key, value]) => {
        const previous = Number(before[group] && before[group][key]);
        const delta = Math.round(Number(value) - previous);
        if (!Number.isFinite(delta) || delta === 0) return;
        changes.push({
          group,
          key,
          label: getMetricLabel(key, stateObj),
          delta,
          beneficial: isBadMetric(key) ? delta < 0 : delta > 0,
        });
      });
    });
    return changes
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, limit);
  }

  function recordImpactPhase(stateObj, label, before) {
    const changes = metricDeltaSummary(before, stateObj);
    if (changes.length) stateObj.lastImpactLedger.push({ label, changes });
    return metricSnapshot(stateObj);
  }

  function impactLedgerLine(stateObj) {
    const phases = Array.isArray(stateObj.lastImpactLedger) ? stateObj.lastImpactLedger : [];
    const entries = phases.flatMap((phase) => phase.changes.map((change) => ({ ...change, phase: phase.label })));
    if (!entries.length) return "No material parameter movement was recorded.";
    return entries.slice(0, 6).map((change) => {
      const sign = change.delta > 0 ? "+" : "";
      return `${change.label} ${sign}${change.delta} (${change.phase})`;
    }).join("; ");
  }

  function causalSummary(stateObj) {
    const notes = Array.isArray(stateObj.lastCausalNotes) ? stateObj.lastCausalNotes.filter(Boolean) : [];
    return notes.length
      ? notes.slice(0, 2).join(" ")
      : "Direct impact applied; delayed stakeholder reactions may still arrive.";
  }

  function conciseActorReaction(stateObj) {
    const items = (stateObj.globalReactions || []).slice(0, 2).map((entry) => {
      const line = String(entry.action || "").split(".")[0].trim();
      return `${entry.actor}: ${line}`;
    });
    return items.length ? items.join(" | ") : "No major external reaction logged yet.";
  }

  function nextRiskSummary(stateObj, processedLogs = []) {
    if (processedLogs.length) return processedLogs[0];
    if (!stateObj.pendingEvents.length) return "No immediate delayed reaction queued.";
    const next = [...stateObj.pendingEvents].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];
    return `${next.description} (due ${formatTime(next.dueAt)})`;
  }

  function simWindowActive(stateObj, iso) {
    return Boolean(iso) && new Date(iso).getTime() >= new Date(stateObj.clock).getTime();
  }

  function isJustifiedNuclearUse(stateObj, profile) {
    if (!profile || effectiveDecisionStyle(stateObj, profile) !== "nuclear") return false;
    const confirmedStrategicAttack = stateObj.strategicAttackOnIndia && simWindowActive(stateObj, stateObj.justifiedRetaliationUntil);
    const claimedSecondStrike = Boolean(profile.nuclearRetaliationClaimed) && (stateObj.redLineViolations || 0) === 0;
    return confirmedStrategicAttack || claimedSecondStrike;
  }

  function assessAccountabilityPressure(stateObj, profile) {
    if (!profile) {
      return { load: 0, strike: false, category: "none", note: stateObj.accountabilityNote || "No red-line pressure yet." };
    }

    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);

    if (isBusinessScenario(stateObj)) {
      if (effectiveStyle === "unethical") {
        return {
          load: 38,
          strike: true,
          category: "trust_violation",
          note: "Misleading traction, fake claims, or privacy shortcuts count as board-level trust violations.",
        };
      }
      if (effectiveStyle === "overreach") {
        return {
          load: 18,
          strike: false,
          category: "focus_risk",
          note: "Overexpansion increases board tolerance load because it weakens execution focus.",
        };
      }
      if (profile.risk > 0.72) {
        return {
          load: 14,
          strike: false,
          category: "business_risk",
          note: "High-risk business move increases board and investor scrutiny.",
        };
      }
      return {
        load: Math.max(0, Math.round((profile.risk || 0) * 7 - (profile.legality || 0.5) * 3)),
        strike: false,
        category: "routine_business",
        note: "Decision remains inside normal board tolerance.",
      };
    }

    if (effectiveStyle === "nuclear") {
      if (isJustifiedNuclearUse(stateObj, profile)) {
        return {
          load: 12,
          strike: false,
          category: "strategic_retaliation",
          note: "Nuclear retaliation context recognized; legitimacy cost remains high, but it is not counted as reckless first use.",
        };
      }
      return {
        load: 42,
        strike: true,
        category: "reckless_first_use",
        note: "Nuclear first use treated as a red-line decision. Two such red-line strikes are tolerated for learning; the third ends the run.",
      };
    }

    if (effectiveStyle === "decapitation") {
      return {
        load: 34,
        strike: true,
        category: "extra_legal",
        note: "Extra-legal leadership targeting counts as a red-line strike against constitutional legitimacy.",
      };
    }

    if (profile.legality <= 0.05 && profile.risk >= 0.92) {
      return {
        load: 30,
        strike: true,
        category: "unlawful_extreme",
        note: "Unlawful extreme-risk action counts as a red-line strike.",
      };
    }

    if (profile.legality < 0.45 || profile.risk > 0.82) {
      return {
        load: 10,
        strike: false,
        category: "high_risk",
        note: "High-risk action increases constitutional tolerance load but does not count as a red-line strike.",
      };
    }

    return {
      load: Math.max(0, Math.round((profile.risk || 0) * 6 - (profile.legality || 0.5) * 3)),
      strike: false,
      category: "routine",
      note: "Decision remains inside normal democratic tolerance.",
    };
  }

  function effectiveDecisionStyle(stateObj, profile) {
    if (profile && profile.primaryStyle) return profile.primaryStyle;
    const rawStyle = profile && profile.style ? profile.style : "mixed";
    if (rawStyle && rawStyle !== "mixed" && rawStyle !== "business") return rawStyle;
    const text = `${profile && profile.title ? profile.title : ""} ${profile && profile.domain ? profile.domain : ""}`.toLowerCase();
    if (isBusinessScenario(stateObj)) {
      if (/unethical|fake|mislead|false|manipulat|review farm|fraud/.test(text)) return "unethical";
      if (/flood|all categor|every sku|overexpand|acquire|acquisition|takeover|price war|ultra-low/.test(text)) return "overreach";
      if (/margin|pricing|discount|bundle|finance|cash|ipo|valuation|profit|asp/.test(text)) return "pricing";
      if (/portfolio|sku|audio|earbud|watch|wearable|product|premium|anc|nirvana/.test(text)) return "product";
      if (/service|warranty|quality|manufactur|supply|operation|governance|component/.test(text)) return "operations";
      if (/brand|creator|celebrity|campaign|consumer|youth|community/.test(text)) return "brand";
      if (/retail|marketplace|offline|d2c|dealer|channel|amazon|flipkart/.test(text)) return "market";
      return "business";
    }
    if (/nuclear|warhead|atomic/.test(text)) return "nuclear";
    if (/assassin|decapitat|leader/.test(text)) return "decapitation";
    if (/airstrike|strike|missile|special forces|raid/.test(text)) return "kinetic";
    if (/cyber|covert|intel|surveillance|raw/.test(text)) return "cyber";
    if (/diplomat|coalition|un|fatf|sanction/.test(text)) return "diplomatic";
    if (/home|police|judicial|public|relief|domestic|media|information/.test(text)) return "domestic";
    return rawStyle || "mixed";
  }
  function buildBusinessCausalLayer(stateObj, profile) {
    const style = effectiveDecisionStyle(stateObj, profile);
    const highMarginPressure = stateObj.threats.EconomicPressure >= 70;
    const weakService = stateObj.systems.HealthcareCapacity <= 50;
    const repeatedStyle = recentDecisionCount(stateObj, (item) => item.style === style);
    const repeatedCommercialPush = recentDecisionCount(stateObj, (item) => /market|brand|pricing|finance/i.test(item.style || ""));
    const layer = { immediate: {}, reactions: [], notes: [] };

    const addReaction = (delay, actor, tone, reason, deltas, escalationDelta = 0, leadershipDelta = 0) => {
      layer.reactions.push({ delay, actor, tone, reason, deltas, escalationDelta, leadershipDelta });
    };

    if (style === "product" || style === "pilot") {
      layer.immediate = {
        stats: { NationalSecurity: 4, AirQuality: 2, FiscalHealth: -1 },
        threats: { PollutionCrisis: -3, TerrorThreat: -2 },
        systems: { HealthcareCapacity: weakService ? -3 : -1, SupplyChainIntegrity: -1 },
      };
      layer.notes.push("Portfolio focus improves strategic clarity, but service and supply-chain capacity must absorb the added complexity.");
      addReaction(50, "Product Council", "mixed", "Portfolio review checks whether premium audio gains are being funded by weak smartwatch economics.", {
        stats: { NationalSecurity: 2, FiscalHealth: highMarginPressure ? -2 : 0 },
        threats: { PollutionCrisis: -2, EconomicPressure: highMarginPressure ? 2 : 0 },
        systems: { SupplyChainIntegrity: weakService ? -2 : 1 },
      });
      addReaction(90, "Service Desk", weakService ? "concerned" : "neutral", "Warranty and replacement queues reveal whether the product move is executable beyond launch day.", {
        stats: { PublicConfidence: weakService ? -3 : 1 },
        systems: { HealthcareCapacity: weakService ? -3 : 2 },
        domestic: { ProtestRisk: weakService ? 3 : -1 },
      });
    } else if (style === "pricing" || style === "finance") {
      layer.immediate = {
        stats: { FiscalHealth: 4, EconomicStability: highMarginPressure ? 1 : 0, PublicConfidence: -1 },
        threats: { EconomicPressure: -3, BorderTension: 1 },
        systems: { MarketConfidence: highMarginPressure ? 1 : 0 },
        economy: { CurrencyValue: 2, StockIndex: 1 },
      };
      layer.notes.push("Margin discipline helps IPO-readiness, but customers and platforms may read it as weaker value if brand differentiation is not clear.");
      addReaction(40, "CFO Office", "supportive", "Finance team welcomes margin guardrails but asks for demand-risk proof before scaling.", {
        stats: { FiscalHealth: 2 },
        economy: { CurrencyValue: 2 },
        domestic: { ParliamentApproval: 2, OppositionPressure: -2, ElectionPressure: -1 },
      }, -1, 1);
      addReaction(70, "Marketplaces", "concerned", "Platforms test boAt's willingness to sacrifice margin for hero placement and festive visibility.", {
        systems: { MarketConfidence: -2 },
        threats: { EconomicPressure: 2, BorderTension: 2 },
        stats: { EconomicStability: -1 },
      }, 1, 0);
    } else if (style === "market" || style === "brand") {
      layer.immediate = {
        stats: { PublicConfidence: 4, AirQuality: 3, FiscalHealth: -2, EconomicStability: 1 },
        threats: { DisinformationRisk: repeatedCommercialPush >= 2 ? 4 : 1, EconomicPressure: 2 },
        systems: { MarketConfidence: 2 },
      };
      layer.notes.push("Brand energy can lift demand, but repeated campaign-led moves create cash burn and authenticity risk.");
      addReaction(45, "Consumers", "mixed", "Youth audiences respond to campaign authenticity, not just celebrity or creator spend.", {
        stats: { PublicConfidence: repeatedCommercialPush >= 2 ? -2 : 3, AirQuality: 2 },
        threats: { DisinformationRisk: repeatedCommercialPush >= 2 ? 3 : -1 },
      });
      addReaction(85, "Retail Partners", "neutral", "Retailers compare campaign demand with actual replenishment, warranty speed, and sell-through quality.", {
        systems: { MarketConfidence: weakService ? -2 : 3, SupplyChainIntegrity: weakService ? -2 : 1 },
        domestic: { ProtestRisk: weakService ? 2 : -1 },
      });
    } else if (style === "governance" || style === "operations") {
      layer.immediate = {
        stats: { DiplomaticStanding: 4, PublicConfidence: 1, FiscalHealth: -1 },
        threats: { DisinformationRisk: -4, PollutionCrisis: -2 },
        systems: { HealthcareCapacity: 4, SupplyChainIntegrity: 3, InfrastructureIntegrity: 2 },
        domestic: { ParliamentApproval: 2, MediaHostility: -2 },
      };
      layer.notes.push("Operational discipline is slower, but it improves credibility because it attacks service, supply, and governance bottlenecks.");
      addReaction(60, "Investors", "supportive", "Investor confidence improves if service quality, manufacturing resilience, and governance cadence become measurable.", {
        stats: { DiplomaticStanding: 3, FiscalHealth: 1 },
        domestic: { ParliamentApproval: 3, OppositionPressure: -3 },
        systems: { MarketConfidence: 2 },
      }, -1, 1);
    } else if (style === "overreach") {
      layer.immediate = {
        stats: { NationalSecurity: -4, FiscalHealth: -5, AirQuality: -4, PublicConfidence: -3 },
        threats: { EconomicPressure: 6, PollutionCrisis: 6, BorderTension: 4, DisinformationRisk: 3 },
        systems: { MarketConfidence: -4, SupplyChainIntegrity: -4, HealthcareCapacity: -3 },
        domestic: { ParliamentApproval: -5, OppositionPressure: 5 },
      };
      layer.notes.push("Overexpansion increases visible ambition but weakens focus, margins, service quality, and board confidence.");
      addReaction(40, "Board Risk Committee", "hostile", "Board challenges category sprawl because integration risk rises faster than operating capacity.", {
        domestic: { ParliamentApproval: -6, OppositionPressure: 5, ElectionPressure: 4 },
        stats: { FiscalHealth: -3 },
        systems: { MarketConfidence: -3 },
      }, 3, -2);
      addReaction(80, "Category Teams", "concerned", "Execution teams report SKU overload and unclear prioritization.", {
        stats: { NationalSecurity: -3, AirQuality: -3 },
        systems: { SupplyChainIntegrity: -3, HealthcareCapacity: -2 },
      }, 2, 0);
    } else if (style === "unethical") {
      layer.immediate = {
        stats: { DiplomaticStanding: -8, PublicConfidence: -8, FiscalHealth: -3, EconomicStability: -4 },
        threats: { DisinformationRisk: 10, EconomicPressure: 6, TerrorThreat: 4 },
        systems: { MarketConfidence: -8, InfrastructureIntegrity: -3 },
        domestic: { ParliamentApproval: -10, OppositionPressure: 10, MediaHostility: 10, ProtestRisk: 8 },
        sentiment: { TrustInGovernment: -8, PanicLevel: 5 },
      };
      layer.notes.push("Trust violations are not normal strategy risk; they directly damage brand equity, governance credibility, and board tolerance.");
      addReaction(30, "Consumers", "hostile", "Consumer trust drops as claims and quality promises appear unreliable.", {
        stats: { PublicConfidence: -7, DiplomaticStanding: -5 },
        threats: { DisinformationRisk: 8 },
        domestic: { ProtestRisk: 6, MediaHostility: 7 },
      }, 4, -3);
    } else {
      layer.immediate = {
        stats: { EconomicStability: 1, PublicConfidence: 1, FiscalHealth: -1 },
        systems: { MarketConfidence: 1 },
      };
      layer.notes.push("The move has a modest operational effect because stakeholders need proof before materially changing confidence.");
    }

    if (highMarginPressure && !/pricing|finance|governance|operations/i.test(style)) {
      layer.immediate.stats = { ...(layer.immediate.stats || {}), FiscalHealth: (layer.immediate.stats && layer.immediate.stats.FiscalHealth || 0) - 2 };
      layer.immediate.threats = { ...(layer.immediate.threats || {}), EconomicPressure: (layer.immediate.threats && layer.immediate.threats.EconomicPressure || 0) + 2 };
      layer.notes.push("High margin pressure makes non-financial moves harder to convert into board confidence.");
    }

    if (repeatedStyle >= 2 && !/governance|operations/i.test(style)) {
      layer.immediate.domestic = { ...(layer.immediate.domestic || {}), ParliamentApproval: (layer.immediate.domestic && layer.immediate.domestic.ParliamentApproval || 0) - 2 };
      layer.immediate.threats = { ...(layer.immediate.threats || {}), DisinformationRisk: (layer.immediate.threats && layer.immediate.threats.DisinformationRisk || 0) + 2 };
      layer.notes.push("Repeated use of the same playbook reduces stakeholder patience unless results have already appeared.");
    }

    return layer;
  }

  function buildSecurityCausalLayer(stateObj, profile) {
    const style = effectiveDecisionStyle(stateObj, profile);
    const highPanic = stateObj.sentiment.PanicLevel >= 65;
    const weakLegality = (profile.legality || 0.5) < 0.55;
    const highEscalation = stateObj.escalationIndex >= 70;
    const layer = { immediate: {}, reactions: [], notes: [] };
    const addReaction = (delay, actor, tone, reason, deltas, escalationDelta = 0, leadershipDelta = 0) => {
      layer.reactions.push({ delay, actor, tone, reason, deltas, escalationDelta, leadershipDelta });
    };

    if (style === "diplomatic" || style === "economic") {
      layer.immediate = {
        stats: { DiplomaticStanding: 4, FiscalHealth: style === "economic" ? -1 : 0, PublicConfidence: highPanic ? -1 : 1 },
        threats: { BorderTension: -2, EconomicPressure: style === "economic" ? 2 : -1, DisinformationRisk: -1 },
        domestic: { ParliamentApproval: highPanic ? -1 : 2, OppositionPressure: highPanic ? 2 : -1 },
      };
      layer.notes.push("Diplomatic/economic pressure preserves legitimacy, but it can look slow if public panic is already high.");
      addReaction(60, "UN / Major Powers", "supportive", "External actors reward proportionality and legal sequencing with diplomatic space.", {
        stats: { DiplomaticStanding: 3 },
        threats: { BorderTension: -2 },
        economy: { StockIndex: 1, CurrencyValue: 1 },
      }, -1, 1);
    } else if (style === "domestic" || style === "defensive" || style === "information") {
      layer.immediate = {
        stats: { PublicConfidence: 3, NationalSecurity: 2, CommunalHarmony: 2 },
        threats: { TerrorThreat: -3, DisinformationRisk: -4 },
        sentiment: { PanicLevel: -4, TrustInGovernment: 3, CommunalTension: -2 },
        systems: { InfrastructureIntegrity: 1, HealthcareCapacity: 1 },
      };
      layer.notes.push("Domestic resilience reduces follow-on attack risk and panic, but it does not instantly solve external deterrence pressure.");
      addReaction(50, "State Governments", "supportive", "Local agencies improve crowd control, hospital load, and rumor response if coordination stays credible.", {
        stats: { PublicConfidence: 2, CommunalHarmony: 2 },
        sentiment: { PanicLevel: -3, TrustInGovernment: 2 },
      }, -1, 1);
    } else if (style === "kinetic" || style === "covert" || style === "cyber" || style === "decapitation") {
      layer.immediate = {
        stats: { NationalSecurity: 3, MilitaryReadiness: -2, DiplomaticStanding: weakLegality ? -6 : -2, PublicConfidence: highPanic ? 1 : -2 },
        threats: { BorderTension: 6, DisinformationRisk: 3, EconomicPressure: 3, TerrorThreat: style === "kinetic" ? -2 : -1 },
        domestic: { OppositionPressure: weakLegality ? 5 : 2, MediaHostility: weakLegality ? 5 : 2, ProtestRisk: 2 },
        sentiment: { PanicLevel: 3, Nationalism: 4, CommunalTension: 2 },
        systems: { MarketConfidence: -3, SupplyChainIntegrity: -2 },
      };
      layer.notes.push("Hard-power moves can create deterrence, but the second-order cost is retaliation risk, diplomatic pressure, and market uncertainty.");
      addReaction(40, "Adversary Command", "hostile", "Retaliation planning accelerates because the action changes the opponent's domestic and military incentives.", {
        threats: { BorderTension: 5, TerrorThreat: 2, DisinformationRisk: 3 },
        systems: { InfrastructureIntegrity: -2 },
      }, 3, 0);
      addReaction(80, "Global Markets", "concerned", "Investors price in wider conflict risk and policy uncertainty.", {
        economy: { StockIndex: -4, CurrencyValue: -3, OilPrice: -2 },
        stats: { EconomicStability: -3, FiscalHealth: -2 },
        threats: { EconomicPressure: 4 },
      }, 1, -1);
    } else if (style === "nuclear") {
      const justified = isJustifiedNuclearUse(stateObj, profile);
      layer.immediate = justified
        ? {
            stats: { NationalSecurity: -8, DiplomaticStanding: -8, EconomicStability: -10, PublicConfidence: -6, AirQuality: -8 },
            threats: { BorderTension: 10, EconomicPressure: 12, PollutionCrisis: 10, DisinformationRisk: 8 },
            sentiment: { PanicLevel: 10, TrustInGovernment: -4 },
            systems: { MarketConfidence: -10, HealthcareCapacity: -8, SupplyChainIntegrity: -9 },
          }
        : {
            stats: { NationalSecurity: -18, DiplomaticStanding: -22, EconomicStability: -20, PublicConfidence: -20, AirQuality: -16 },
            threats: { BorderTension: 20, EconomicPressure: 20, PollutionCrisis: 18, DisinformationRisk: 12, TerrorThreat: 8 },
            domestic: { ParliamentApproval: -18, OppositionPressure: 20, MediaHostility: 16, ProtestRisk: 18 },
            sentiment: { PanicLevel: 20, TrustInGovernment: -20, CommunalTension: 12 },
            systems: { MarketConfidence: -18, HealthcareCapacity: -16, SupplyChainIntegrity: -16, InfrastructureIntegrity: -10 },
          };
      layer.notes.push(justified
        ? "Nuclear retaliation is treated as survival logic, but the national and global damage remains severe."
        : "Nuclear first-use is a democratic, strategic, economic, and humanitarian catastrophe, not a normal escalation option.");
      addReaction(20, "Nuclear Command Systems", "hostile", "Strategic forces move to launch-on-warning and retaliatory posture.", {
        threats: { BorderTension: 12, EconomicPressure: 8, PollutionCrisis: 8 },
        systems: { MarketConfidence: -8, HealthcareCapacity: -8 },
        sentiment: { PanicLevel: 8 },
      }, 8, -3);
      addReaction(50, "UN Security Council", "hostile", "Emergency international response isolates the initiator and accelerates sanctions architecture.", {
        stats: { DiplomaticStanding: -10, EconomicStability: -8 },
        economy: { StockIndex: -8, CurrencyValue: -7 },
        threats: { EconomicPressure: 8 },
      }, 5, -2);
    } else {
      layer.immediate = { stats: { PublicConfidence: 1 }, threats: { DisinformationRisk: -1 } };
      layer.notes.push("The decision creates limited movement because institutions wait for verifiable follow-through.");
    }

    if (highEscalation && !/diplomatic|defensive|domestic|information/i.test(style)) {
      layer.immediate.threats = { ...(layer.immediate.threats || {}), BorderTension: (layer.immediate.threats && layer.immediate.threats.BorderTension || 0) + 3 };
      layer.immediate.stats = { ...(layer.immediate.stats || {}), DiplomaticStanding: (layer.immediate.stats && layer.immediate.stats.DiplomaticStanding || 0) - 2 };
      layer.notes.push("High escalation makes every additional coercive step more likely to create non-linear blowback.");
    }

    return layer;
  }

  function applyScenarioCausalImpact(stateObj, profile, outcome) {
    let layer;
    if (isBusinessScenario(stateObj)) {
      const components = deterministicLogic.profileComponents(profile);
      if (components.length > 1) {
        layer = { immediate: deterministicLogic.emptyGroupedDeltas(), reactions: [], notes: [] };
        components.forEach((component) => {
          mergeCausalLayer(layer, buildBusinessCausalLayer(stateObj, component), 0.58, 0.72);
        });
      } else {
        layer = buildBusinessCausalLayer(stateObj, profile);
      }
      const optionSignals = deterministicLogic.businessOptionSignals(stateObj, profile);
      deterministicLogic.mergeGroupedDeltas(layer.immediate, optionSignals.deltas);
      layer.notes.push(...optionSignals.notes);
      if (outcome.reality) {
        layer.notes.unshift(outcome.reality.explanation);
        layer.notes.push(...outcome.reality.tradeoffs.slice(0, 2));
        outcome.reality.delayedEffects.forEach((effect) => {
          const scaled = deterministicLogic.emptyGroupedDeltas();
          deterministicLogic.GROUPS.forEach((group) => {
            Object.entries(effect.deltas && effect.deltas[group] || {}).forEach(([key, rawValue]) => {
              const value = Number(rawValue || 0);
              const beneficial = isBadMetric(key) ? value < 0 : value > 0;
              const factor = outcome.scenario === "Success"
                ? (beneficial ? 1 : 0.7)
                : outcome.scenario === "Partial"
                  ? (beneficial ? 0.6 : 1)
                  : (beneficial ? 0.25 : 1.2);
              scaled[group][key] = Math.round(value * factor);
            });
          });
          layer.reactions.unshift({
            delay: effect.delayMinutes,
            actor: effect.actor,
            tone: effect.tone,
            reason: effect.reason,
            deltas: scaled,
            escalationDelta: 0,
            leadershipDelta: 0,
          });
        });
      }
    } else {
      layer = buildSecurityCausalLayer(stateObj, profile);
    }
    applyOutcomeWeightedDeltas(stateObj, layer.immediate, outcome);
    (layer.reactions || []).slice(0, 6).forEach((reaction) => {
      scheduleStakeholderReaction(
        stateObj,
        reaction.delay,
        reaction.actor,
        reaction.tone,
        reaction.reason,
        reaction.deltas,
        reaction.escalationDelta,
        reaction.leadershipDelta
      );
    });
    stateObj.lastCausalNotes = (layer.notes || []).slice(0, 6);
    if (stateObj.lastCausalNotes.length) {
      pushAlert(stateObj, "impact", `Causal layer: ${stateObj.lastCausalNotes[0]}`);
    }
    return stateObj.lastCausalNotes;
  }

  function applyFeedbackLoops(stateObj) {
    if (isBusinessScenario(stateObj)) {
      const deltas = { stats: {}, threats: {}, domestic: {}, sentiment: {}, economy: {}, systems: {} };
      if (stateObj.threats.EconomicPressure >= 70) {
        deltas.stats.FiscalHealth = -1;
        deltas.systems.MarketConfidence = -1;
        deltas.domestic.OppositionPressure = 1;
      }
      if (stateObj.threats.BorderTension >= 76) {
        deltas.stats.EconomicStability = -1;
        deltas.systems.MarketConfidence = -1;
      }
      if (stateObj.threats.PollutionCrisis >= 70) {
        deltas.stats.NationalSecurity = -1;
        deltas.stats.PublicConfidence = -1;
      }
      if (stateObj.systems.HealthcareCapacity <= 50) {
        deltas.stats.PublicConfidence = (deltas.stats.PublicConfidence || 0) - 1;
        deltas.threats.DisinformationRisk = 1;
      }
      if (stateObj.stats.FiscalHealth <= 42) {
        deltas.economy.StockIndex = -1;
        deltas.domestic.ParliamentApproval = (deltas.domestic.ParliamentApproval || 0) - 1;
      }
      applyGroupedDeltas(stateObj, deltas);
      return;
    }

    const deltas = { stats: {}, threats: {}, domestic: {}, sentiment: {}, economy: {}, systems: {} };
    if (stateObj.threats.TerrorThreat >= 82) {
      deltas.stats.NationalSecurity = -1;
      deltas.stats.PublicConfidence = -1;
      deltas.sentiment.PanicLevel = 1;
    }
    if (stateObj.threats.BorderTension >= 80) {
      deltas.stats.DiplomaticStanding = -1;
      deltas.stats.EconomicStability = -1;
      deltas.threats.EconomicPressure = 1;
    }
    if (stateObj.systems.InfrastructureIntegrity <= 55) {
      deltas.stats.EconomicStability = (deltas.stats.EconomicStability || 0) - 1;
      deltas.sentiment.PanicLevel = (deltas.sentiment.PanicLevel || 0) + 1;
    }
    if (stateObj.sentiment.PanicLevel >= 70) {
      deltas.domestic.ProtestRisk = 1;
      deltas.domestic.MediaHostility = 1;
      deltas.stats.PublicConfidence = (deltas.stats.PublicConfidence || 0) - 1;
    }
    applyGroupedDeltas(stateObj, deltas);
  }
  function applyImmediateNationalShock(stateObj, profile, outcome) {
    const outcomeFactor = outcome.scenario === "Success" ? 1 : outcome.scenario === "Partial" ? 1.2 : 1.45;
    const legalShock = profile.legality < 0.2 ? 1.2 : 1;

    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);

    if (isBusinessScenario(stateObj)) {
      if (effectiveStyle === "unethical") {
        applyMetricMap(stateObj.domestic, {
          ParliamentApproval: -18,
          OppositionPressure: 24,
          MediaHostility: 22,
          ProtestRisk: 16,
          ElectionPressure: 20,
        }, outcomeFactor);
        applyMetricMap(stateObj.sentiment, {
          TrustInGovernment: -18,
          PanicLevel: 14,
          CommunalTension: 12,
        }, outcomeFactor);
        pushAlert(stateObj, "governance", "Trust shock: misleading product, quality, or review claims damage brand credibility.");
        return;
      }

      if (effectiveStyle === "overreach") {
        applyMetricMap(stateObj.domestic, {
          ParliamentApproval: -6,
          OppositionPressure: 10,
          MediaHostility: 9,
          ProtestRisk: 7,
          ElectionPressure: 8,
        }, outcomeFactor);
        applyMetricMap(stateObj.sentiment, {
          TrustInGovernment: -5,
          PanicLevel: 8,
          CommunalTension: 5,
        }, outcomeFactor);
        pushAlert(stateObj, "strategy", "Focus shock: too many categories and SKUs stretch product quality, channel execution, and service capacity.");
        return;
      }

      if (["pilot", "product", "governance", "pricing", "finance", "market", "brand", "operations"].includes(effectiveStyle)) {
        const highMarginPressure = stateObj.threats.EconomicPressure >= 70;
        const weakService = stateObj.systems.HealthcareCapacity <= 50;
        let approvalDelta = 0;
        let trustDelta = 0;
        if (effectiveStyle === "governance" || effectiveStyle === "operations") {
          approvalDelta = 3;
          trustDelta = 2;
        } else if (effectiveStyle === "pricing" || effectiveStyle === "finance") {
          approvalDelta = highMarginPressure ? 2 : 1;
          trustDelta = stateObj.stats.PublicConfidence >= 70 ? 0 : -1;
        } else if (effectiveStyle === "product" || effectiveStyle === "pilot") {
          approvalDelta = weakService ? -1 : 1;
          trustDelta = weakService ? -1 : 1;
        } else if (effectiveStyle === "market" || effectiveStyle === "brand") {
          approvalDelta = highMarginPressure ? -2 : 1;
          trustDelta = highMarginPressure ? 0 : 2;
        }
        applyMetricMap(stateObj.domestic, {
          ParliamentApproval: approvalDelta,
          OppositionPressure: approvalDelta < 0 ? 3 : -1,
          ProtestRisk: trustDelta < 0 ? 2 : -1,
        }, outcome.scenario === "Blowback" ? 0.35 : 1);
        applyMetricMap(stateObj.sentiment, {
          TrustInGovernment: trustDelta,
          PanicLevel: approvalDelta < 0 ? 2 : -1,
          Nationalism: effectiveStyle === "brand" ? 1 : 0,
        }, outcome.scenario === "Blowback" ? 0.35 : 1);
        return;
      }
    }

    if (effectiveStyle === "nuclear") {
      const justified = isJustifiedNuclearUse(stateObj, profile);
      const shockScale = justified ? 0.45 : 1;
      applyMetricMap(stateObj.domestic, {
        ParliamentApproval: -34,
        OppositionPressure: 42,
        MediaHostility: 36,
        ProtestRisk: 44,
        ElectionPressure: 38,
      }, outcomeFactor * shockScale);
      applyMetricMap(stateObj.sentiment, {
        TrustInGovernment: -36,
        PanicLevel: 34,
        Nationalism: 14,
        CommunalTension: 22,
      }, outcomeFactor * shockScale);
      applyMetricMap(stateObj.systems, {
        MarketConfidence: -24,
        OilStability: -16,
        SupplyChainIntegrity: -20,
        InfrastructureIntegrity: -10,
        HealthcareCapacity: -12,
        RefugeePressure: 22,
      }, outcomeFactor * shockScale);
      applyMetricMap(stateObj.economy, { StockIndex: -18, CurrencyValue: -14, Inflation: -8 }, outcomeFactor * shockScale);
      pushAlert(stateObj, "politics", justified
        ? "Nuclear retaliation context recognized; democratic oversight pressure rises but first-use recklessness is not charged."
        : "Domestic backlash spikes after nuclear first-use authorization; cabinet, parliament, and states move into emergency response.");
      return;
    }

    if (effectiveStyle === "decapitation") {
      applyMetricMap(stateObj.domestic, {
        ParliamentApproval: -18,
        OppositionPressure: 24,
        MediaHostility: 20,
        ProtestRisk: 18,
        ElectionPressure: 16,
      }, outcomeFactor * legalShock);
      applyMetricMap(stateObj.sentiment, {
        TrustInGovernment: -16,
        PanicLevel: 14,
        Nationalism: 8,
        CommunalTension: 10,
      }, outcomeFactor * legalShock);
      applyMetricMap(stateObj.systems, { MarketConfidence: -10, SupplyChainIntegrity: -8, HealthcareCapacity: -4 }, outcomeFactor);
      pushAlert(stateObj, "politics", "An extra-legal decapitation move triggers immediate democratic and diplomatic shock.");
      return;
    }

    if (effectiveStyle === "kinetic") {
      applyMetricMap(stateObj.domestic, {
        ParliamentApproval: profile.legality < 0.45 ? -5 : -2,
        OppositionPressure: profile.legality < 0.45 ? 9 : 4,
        MediaHostility: 5,
        ProtestRisk: 5,
        ElectionPressure: 4,
      }, outcomeFactor);
      applyMetricMap(stateObj.sentiment, {
        TrustInGovernment: profile.legality < 0.45 ? -5 : -1,
        PanicLevel: 5,
        Nationalism: 5,
        CommunalTension: 3,
      }, outcomeFactor);
      applyMetricMap(stateObj.systems, { MarketConfidence: -4, SupplyChainIntegrity: -3 }, outcomeFactor);
      return;
    }

    if (effectiveStyle === "covert" || effectiveStyle === "cyber") {
      applyMetricMap(stateObj.domestic, {
        ParliamentApproval: profile.legality < 0.5 ? -3 : -1,
        OppositionPressure: 3,
        MediaHostility: 4,
        ProtestRisk: 2,
      }, outcomeFactor);
      applyMetricMap(stateObj.sentiment, {
        TrustInGovernment: profile.legality < 0.5 ? -3 : 0,
        PanicLevel: 3,
      }, outcomeFactor);
      return;
    }

    if (effectiveStyle === "diplomatic" || effectiveStyle === "economic" || effectiveStyle === "domestic" || effectiveStyle === "defensive" || effectiveStyle === "information") {
      applyMetricMap(stateObj.domestic, {
        ParliamentApproval: 2,
        OppositionPressure: -1,
        ProtestRisk: -2,
      }, outcome.scenario === "Blowback" ? 0.4 : 1);
      applyMetricMap(stateObj.sentiment, {
        TrustInGovernment: 2,
        PanicLevel: -2,
      }, outcome.scenario === "Blowback" ? 0.4 : 1);
    }
  }

  function dismissLeader(stateObj, reason) {
    if (stateObj.dismissed) return true;
    stateObj.dismissed = true;
    stateObj.dismissalReason = reason;
    stateObj.dismissalAt = formatTime(stateObj.clock);
    stateObj.meetingActive = false;
    stateObj.boardroomClockPause = null;
    stateObj.meetingEndsAt = new Date().toISOString();
    stateObj.analysisWindowEndsAt = new Date().toISOString();
    stateObj.sessionEndsAt = new Date().toISOString();
    stateObj.outcomeSummary = `Run terminated: ${reason}`;
    stateObj.outcomeText = isBusinessScenario(stateObj)
      ? [
          "- Board outcome: decision-maker removed from the simulation role.",
          `- Reason: ${reason}`,
          `- Stakeholder state: board confidence ${stateObj.domestic.ParliamentApproval}/100, retailer pushback ${stateObj.domestic.ProtestRisk}/100, team stress ${stateObj.sentiment.PanicLevel}/100.`,
          `- Business impact: portfolio strength ${stateObj.stats.NationalSecurity}/100, revenue momentum ${stateObj.stats.EconomicStability}/100, brand credibility ${stateObj.stats.DiplomaticStanding}/100, D2C reliability ${stateObj.systems.InfrastructureIntegrity}/100.`,
          `- Market environment: ${conciseActorReaction(stateObj)}`,
        ].join("\n")
      : [
          "- Constitutional outcome: leadership removed from office.",
          `- Reason: ${reason}`,
          `- Domestic state: parliament ${stateObj.domestic.ParliamentApproval}/100, protest risk ${stateObj.domestic.ProtestRisk}/100, panic ${stateObj.sentiment.PanicLevel}/100.`,
          `- National impact: security ${stateObj.stats.NationalSecurity}/100, economy ${stateObj.stats.EconomicStability}/100, diplomacy ${stateObj.stats.DiplomaticStanding}/100, infrastructure ${stateObj.systems.InfrastructureIntegrity}/100.`,
          `- External environment: ${conciseActorReaction(stateObj)}`,
        ].join("\n");
    pushAlert(stateObj, "politics", `Leadership removed from office: ${reason}`);
    return true;
  }

  function evaluateLeadershipRemoval(stateObj, triggerProfile = null) {
    if (stateObj.dismissed) return true;
    const toleranceMax = toleranceMaximum(stateObj);

    if (triggerProfile) {
      const pressure = assessAccountabilityPressure(stateObj, triggerProfile);
      const scaledLoad = isBusinessScenario(stateObj)
        ? Math.round(pressure.load * (BOARD_TOLERANCE_MAX / CONSTITUTIONAL_TOLERANCE_MAX))
        : pressure.load;
      stateObj.toleranceLoad = clamp((stateObj.toleranceLoad || 0) + scaledLoad, 0, toleranceMax);
      stateObj.accountabilityNote = pressure.note;
      if (pressure.strike) {
        stateObj.redLineViolations = (stateObj.redLineViolations || 0) + 1;
      }
      pushAlert(
        stateObj,
        "politics",
        `${isBusinessScenario(stateObj) ? "Board" : "Constitutional"} tolerance load ${stateObj.toleranceLoad}/${toleranceMax}. ${pressure.note}`
      );
    }

    if ((stateObj.redLineViolations || 0) > 2) {
      return dismissLeader(
        stateObj,
        isBusinessScenario(stateObj)
          ? "Termination letter issued: repeated trust violations exceeded the board tolerance limit."
          : "Termination letter issued: repeated reckless red-line decisions exceeded the democratic tolerance limit."
      );
    }

    if ((stateObj.toleranceLoad || 0) >= toleranceMax) {
      return dismissLeader(
        stateObj,
        isBusinessScenario(stateObj)
          ? `Termination letter issued: board tolerance load reached ${toleranceMax}/${toleranceMax}.`
          : "Termination letter issued: constitutional tolerance load reached 100/100."
      );
    }

    return false;
  }

  function computeDecisionOutcome(profile, stateObj) {
    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);
    const random = seededRandom(stateObj.turn * 271 + stateObj.escalationIndex * 17 + stateObj.fogOfWar.uncertainty * 23);

    if (isBusinessScenario(stateObj)) {
      const reality = deterministicLogic.evaluateBusinessDecision(stateObj, profile, random());
      return {
        scenario: reality.scenario,
        intelFailure: false,
        accidentalEsc: false,
        reality,
      };
    }

    const intelligenceFailureProb =
      (effectiveStyle === "covert" || effectiveStyle === "kinetic" ? 0.16 : 0.07) +
      stateObj.fogOfWar.uncertainty / 220 +
      stateObj.threats.DisinformationRisk / 600;

    const accidentalEscProb = stateObj.escalationIndex / 220 + stateObj.threats.DisinformationRisk / 620;

    let successProb = 0.56 - profile.risk * 0.28 + profile.legality * 0.2;
    successProb -= (100 - stateObj.stats.PublicConfidence) / 500;
    successProb = Math.max(0.08, Math.min(0.78, successProb));

    let partialProb = 0.3 + profile.risk * 0.14;
    if (successProb + partialProb > 0.92) partialProb = 0.92 - successProb;

    const intelFailure = random() < intelligenceFailureProb;
    const accidentalEsc = random() < accidentalEscProb;
    const r = random();

    let scenario = "Blowback";
    if (r <= successProb && !intelFailure) scenario = "Success";
    else if (r <= successProb + partialProb || intelFailure) scenario = "Partial";

    return { scenario, intelFailure, accidentalEsc };
  }

  function applyDecisionCore(stateObj, profile, decisionLabel) {
    const outcome = computeDecisionOutcome(profile, stateObj);
    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);

    const validated = outcome.reality
      ? deterministicLogic.validateBusinessProfileDeltas(profile, outcome.reality)
      : profile;
    applyDecisionMetricMap(stateObj.stats, validated.statsDelta, outcome);
    applyDecisionMetricMap(stateObj.threats, validated.threatDelta, outcome);
    applyDecisionMetricMap(stateObj.economy, validated.economyDelta, outcome);
    applyDecisionMetricMap(stateObj.systems, validated.systemsDelta, outcome);
    stateObj.lastRealityAudit = outcome.reality
      ? { ...deepClone(outcome.reality), rejectedEffects: validated.rejectedEffects || [], directEffectCap: validated.directMax }
      : null;

    if (outcome.scenario === "Blowback") {
      if (isBusinessScenario(stateObj)) {
        const failures = outcome.reality ? outcome.reality.failedPreconditions : [];
        failures.forEach((failure) => {
          if (failure.dimension === "cash") {
            applyMetricMap(stateObj.stats, { FiscalHealth: -3, EconomicStability: -1 }, 1);
            applyMetricMap(stateObj.threats, { EconomicPressure: 3 }, 1);
          } else if (failure.dimension === "supply") {
            applyMetricMap(stateObj.systems, { SupplyChainIntegrity: -3, MarketConfidence: -1 }, 1);
            applyMetricMap(stateObj.threats, { PollutionCrisis: 2 }, 1);
          } else if (failure.dimension === "service") {
            applyMetricMap(stateObj.systems, { HealthcareCapacity: -3 }, 1);
            applyMetricMap(stateObj.stats, { PublicConfidence: -3 }, 1);
            applyMetricMap(stateObj.domestic, { ProtestRisk: 2 }, 1);
          } else if (failure.dimension === "management") {
            applyMetricMap(stateObj.domestic, { ParliamentApproval: -3, OppositionPressure: 3 }, 1);
            applyMetricMap(stateObj.systems, { MarketConfidence: -2 }, 1);
          }
        });
        if (!failures.length) {
          applyMetricMap(stateObj.stats, { PublicConfidence: -2 }, 1);
          applyMetricMap(stateObj.systems, { MarketConfidence: -2 }, 1);
        }
      } else {
        applyMetricMap(stateObj.threats, { BorderTension: 4, DisinformationRisk: 4, EconomicPressure: 3 }, 1);
        applyMetricMap(stateObj.stats, { PublicConfidence: -3, DiplomaticStanding: -2 }, 1);
      }
    }

    if (outcome.intelFailure) {
      if (isBusinessScenario(stateObj)) {
        applyMetricMap(stateObj.stats, { NationalSecurity: -2, PublicConfidence: -2, DiplomaticStanding: -1 }, 1);
        applyMetricMap(stateObj.threats, { PollutionCrisis: 3, DisinformationRisk: 4, TerrorThreat: 2 }, 1);
        pushAlert(stateObj, "case", `Market, channel, or consumer assumption error reduced ${decisionLabel} effectiveness.`);
      } else {
        applyMetricMap(stateObj.stats, { NationalSecurity: -2, PublicConfidence: -2 }, 1);
        applyMetricMap(stateObj.threats, { TerrorThreat: 3, DisinformationRisk: 3 }, 1);
        pushAlert(stateObj, "intel", `Intelligence assessment error reduced ${decisionLabel} effectiveness.`);
      }
    }

    if (outcome.accidentalEsc) {
      if (isBusinessScenario(stateObj)) {
        applyMetricMap(stateObj.threats, { BorderTension: 4, EconomicPressure: 3 }, 1);
        updateEscalation(stateObj, 3, "Execution-risk spillover materialized");
      } else {
        applyMetricMap(stateObj.threats, { BorderTension: 5 }, 1);
        updateEscalation(stateObj, 6, "Accidental escalation risk materialized");
      }
    }

    const escDelta = Math.round(profile.severity * 0.38) + (outcome.scenario === "Success" ? -4 : outcome.scenario === "Partial" ? 2 : 9);
    updateEscalation(stateObj, escDelta, `${decisionLabel} impact`);

    if (effectiveStyle === "kinetic") stateObj.adaptation.guerrillaShift = clamp(stateObj.adaptation.guerrillaShift + 8);
    if (effectiveStyle === "economic" || effectiveStyle === "diplomatic") stateObj.adaptation.blackMarketNetwork = clamp(stateObj.adaptation.blackMarketNetwork + 6);
    if (effectiveStyle === "cyber") stateObj.adaptation.cyberHardening = clamp(stateObj.adaptation.cyberHardening + 8);
    if (effectiveStyle === "covert" || effectiveStyle === "information") stateObj.adaptation.misinformationAgility = clamp(stateObj.adaptation.misinformationAgility + 6);

    stateObj.fogOfWar.uncertainty = clamp(
      stateObj.fogOfWar.uncertainty + (effectiveStyle === "covert" ? 5 : 1) + (outcome.scenario === "Blowback" ? 4 : -1),
      10,
      90
    );

    applyImmediateNationalShock(stateObj, profile, outcome);

    return outcome;
  }

  function scheduleNuclearRetaliation(stateObj, targetActorName, profile) {
    const actor = stateObj.actors[targetActorName];
    if (!actor || !actor.nuclearState) return;

    const base = actor.doctrine.retaliationBase || 0.9;
    const pRetaliate = Math.max(0.9, Math.min(0.995, base + stateObj.escalationIndex / 500 + actor.riskTolerance / 500));

    pushAlert(stateObj, "strategic", `${targetActorName} retaliation doctrine check: ${Math.round(pRetaliate * 100)}%.`);

    const random = seededRandom(stateObj.turn * 421 + targetActorName.length * 31 + stateObj.escalationIndex);
    if (random() < pRetaliate) {
      const delay = actor.doctrine.launchOnWarning >= 0.5 ? 30 : 90;
      scheduleEvent(
        stateObj,
        "nuclear_retaliation",
        delay,
        { source: targetActorName, target: "India", doctrine: actor.doctrine, provokedByIndia: true },
        `${targetActorName} prepares retaliatory strategic response.`
      );
    }

    scheduleEvent(stateObj, "global_market_crash", 20, { source: "Global" }, "Global markets begin rapid selloff.");
    scheduleEvent(stateObj, "oil_shock", 120, { source: "Energy" }, "Oil shock ripples across import-dependent economies.");
    scheduleEvent(stateObj, "refugee_wave", 180, { source: targetActorName }, "Large-scale displacement starts from affected zones.");
  }

  function scheduleAllianceResponses(stateObj, attackedActor, profile) {
    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);
    const random = seededRandom(stateObj.turn * 607 + attackedActor.length * 17 + stateObj.escalationIndex);

    stateObj.alliances
      .filter((a) => a.members.includes(attackedActor))
      .forEach((alliance) => {
        alliance.members
          .filter((m) => m !== attackedActor)
          .forEach((member) => {
            const actor = stateObj.actors[member];
            if (!actor) return;

            const domesticBrake = (100 - actor.domesticStability) / 120;
            const p = Math.max(0.05, Math.min(0.95, alliance.collectiveDefense * (actor.allianceCommitments / 100) - domesticBrake));

            if (random() < p) {
              if (effectiveStyle === "nuclear") {
                scheduleEvent(
                  stateObj,
                  "military_mobilization",
                  90,
                  { source: member, target: "India", alliance: alliance.id },
                  `${member} activates military mobilization under ${alliance.label}.`
                );
              } else {
                scheduleEvent(
                  stateObj,
                  "intel_support",
                  120,
                  { source: member, beneficiary: attackedActor, alliance: alliance.id },
                  `${member} extends intelligence support to ${attackedActor}.`
                );
              }
              pushGlobalReaction(stateObj, member, `Alliance reaction through ${alliance.label}.`, "concerned");
            }
          });
      });
  }

  function scheduleStateReactions(stateObj, profile) {
    const effectiveStyle = effectiveDecisionStyle(stateObj, profile);
    if (isBusinessScenario(stateObj)) {
      if (effectiveStyle === "market" || effectiveStyle === "brand") {
        scheduleEvent(stateObj, "pilot_feedback", 90, { source: "Consumers" }, "Campaign feedback window: youth consumers react to positioning, influencers, and value claims.");
        scheduleEvent(stateObj, "conversion_review", 240, { source: "Marketplaces" }, "Marketplace review: sales lift is compared against discount depth and ad spend.");
      }
      if (effectiveStyle === "product") {
        scheduleEvent(stateObj, "product_delay", 180, { source: "Product Team" }, "Product portfolio review: premium audio and smartwatch SKUs are tested against quality and margin goals.");
      }
      if (effectiveStyle === "pricing" || effectiveStyle === "finance") {
        scheduleEvent(stateObj, "pricing_pushback", 180, { source: "Marketplaces" }, "Pricing pushback: platforms and rivals test whether boAt will hold margin floors.");
      }
      if (effectiveStyle === "governance" || effectiveStyle === "operations") {
        scheduleEvent(stateObj, "credibility_boost", 180, { source: "Board" }, "Execution review: quality, service, supply chain, and IPO readiness affect investor confidence.");
      }
      if (effectiveStyle === "overreach") {
        scheduleEvent(stateObj, "focus_drift", 90, { source: "Category Teams" }, "Portfolio drift: excessive SKU/category aggression strains margins, inventory, and service quality.");
      }
      if (effectiveStyle === "unethical") {
        scheduleEvent(stateObj, "trust_crisis", 30, { source: "Market" }, "Trust crisis: stakeholders question claims, quality promises, and governance discipline.");
      }
      return;
    }

    const targets = profile.targets.length ? profile.targets : ["Pakistan"];

    if (effectiveStyle === "nuclear") {
      targets.forEach((t) => scheduleNuclearRetaliation(stateObj, t, profile));
      ["USA", "EU", "China", "Russia"].forEach((actor) => {
        scheduleEvent(stateObj, "sanctions_wave", 180, { source: actor }, `${actor} considers high-severity sanctions.`);
      });
      targets.forEach((t) => scheduleAllianceResponses(stateObj, t, profile));
      return;
    }

    targets.forEach((target) => {
      if (!["Pakistan", "China"].includes(target)) return;

      if (effectiveStyle === "kinetic" || effectiveStyle === "covert" || effectiveStyle === "decapitation") {
        scheduleEvent(stateObj, "retaliatory_strike", 120, { source: target }, `${target} prepares limited retaliatory strike options.`);
        scheduleEvent(stateObj, "cyber_retaliation", 90, { source: target }, `${target} cyber retaliation cells activate.`);
      }

      if (effectiveStyle === "diplomatic" || effectiveStyle === "economic") {
        scheduleEvent(stateObj, "black_market_adaptation", 240, { source: target }, `${target} shifts pressure through gray-market channels.`);
      }

      scheduleAllianceResponses(stateObj, target, profile);
    });

    if (profile.legality < 0.45 || effectiveStyle === "kinetic" || effectiveStyle === "decapitation") {
      scheduleEvent(stateObj, "sanctions_wave", 240, { source: "EU" }, "EU sanctions committee begins emergency process.");
      scheduleEvent(stateObj, "sanctions_wave", 240, { source: "USA" }, "US considers targeted sanctions and export controls.");
    }

    scheduleEvent(stateObj, "un_session", 180, { source: "UN", legality: profile.legality }, "UN emergency consultation called.");
  }

  function processEvent(stateObj, event) {
    const kind = event.kind;

    if (kind === "controversy_pulse") {
      progressEmergencyControversy(stateObj, event.payload && event.payload.reason ? event.payload.reason : "media cycle");
      return;
    }

    if (kind === "stakeholder_reaction") {
      const payload = event.payload || {};
      applyGroupedDeltas(stateObj, payload.deltas || {});
      if (Number.isFinite(Number(payload.escalationDelta || 0)) && Number(payload.escalationDelta || 0) !== 0) {
        updateEscalation(stateObj, Number(payload.escalationDelta || 0), `${payload.actor || "Stakeholder"} reaction`);
      }
      if (Number.isFinite(Number(payload.leadershipDelta || 0)) && Number(payload.leadershipDelta || 0) !== 0) {
        stateObj.leadership = clamp(stateObj.leadership + Number(payload.leadershipDelta || 0));
      }
      pushGlobalReaction(stateObj, payload.actor || "Stakeholder", payload.reason || event.description, payload.tone || "neutral");
      pushAlert(stateObj, isBusinessScenario(stateObj) ? "stakeholder" : "response", `${payload.actor || "Stakeholder"}: ${payload.reason || event.description}`);
      return;
    }

    if (isBusinessScenario(stateObj)) {
      if (kind === "pilot_feedback") {
        applyMetricMap(stateObj.stats, { PublicConfidence: 3, DiplomaticStanding: 2, AirQuality: 2 });
        applyMetricMap(stateObj.threats, { DisinformationRisk: -2, TerrorThreat: -2 });
        applyMetricMap(stateObj.systems, { MarketConfidence: 3, HealthcareCapacity: -1 });
        applyMetricMap(stateObj.domestic, { ParliamentApproval: 1, OppositionPressure: -1, MediaHostility: -1 });
        pushAlert(stateObj, "brand", "Consumer feedback clarifies whether boAt's youth positioning still feels authentic.");
        return;
      }
      if (kind === "conversion_review") {
        applyMetricMap(stateObj.stats, { EconomicStability: 3, FiscalHealth: 2, PublicConfidence: 1 });
        applyMetricMap(stateObj.economy, { StockIndex: 4, CurrencyValue: 3 });
        applyMetricMap(stateObj.systems, { MarketConfidence: 4 });
        applyMetricMap(stateObj.domestic, { ParliamentApproval: 1, OppositionPressure: -1 });
        pushGlobalReaction(stateObj, "Marketplaces", "Promotion review shows sales lift, but platforms want deeper discounts for hero slots.", "concerned");
        return;
      }
      if (kind === "product_delay") {
        applyMetricMap(stateObj.stats, { NationalSecurity: -3, PublicConfidence: -2, FiscalHealth: -2 });
        applyMetricMap(stateObj.threats, { PollutionCrisis: 5, DisinformationRisk: 3 });
        applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -4, SupplyChainIntegrity: -2 });
        pushAlert(stateObj, "product", "Premium audio and smartwatch roadmap slips; weaker SKUs increase commoditization risk.");
        return;
      }
      if (kind === "pricing_pushback") {
        applyMetricMap(stateObj.stats, { EconomicStability: -1, FiscalHealth: -2 });
        applyMetricMap(stateObj.economy, { CurrencyValue: -3, StockIndex: -1 });
        applyMetricMap(stateObj.threats, { EconomicPressure: 4, TerrorThreat: 3 });
        applyMetricMap(stateObj.domestic, { OppositionPressure: 2, ElectionPressure: 1 });
        pushAlert(stateObj, "pricing", "Marketplaces and rivals push price cuts; pricing power weakens unless differentiation is clearer.");
        return;
      }
      if (kind === "credibility_boost") {
        applyMetricMap(stateObj.stats, { DiplomaticStanding: 5, PublicConfidence: 2, CommunalHarmony: 2 });
        applyMetricMap(stateObj.threats, { DisinformationRisk: -5, PollutionCrisis: -2 });
        applyMetricMap(stateObj.systems, { MarketConfidence: 4, SupplyChainIntegrity: 2, HealthcareCapacity: 2 });
        applyMetricMap(stateObj.domestic, { ParliamentApproval: 4, OppositionPressure: -4, MediaHostility: -2, ElectionPressure: -2 });
        pushAlert(stateObj, "credibility", "Service quality, manufacturing resilience, and board discipline improve investor confidence.");
        return;
      }
      if (kind === "focus_drift") {
        applyMetricMap(stateObj.stats, { NationalSecurity: -4, FiscalHealth: -4, AirQuality: -5, EconomicStability: -2 });
        applyMetricMap(stateObj.threats, { DisinformationRisk: 7, PollutionCrisis: 7, EconomicPressure: 5, BorderTension: 4 });
        applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -5, SupplyChainIntegrity: -5, HealthcareCapacity: -3 });
        pushAlert(stateObj, "strategy", "Portfolio drift compounds: too many SKUs and categories dilute product quality, margins, and channel execution.");
        return;
      }
      if (kind === "trust_crisis") {
        applyMetricMap(stateObj.stats, { DiplomaticStanding: -14, PublicConfidence: -12, EconomicStability: -8, FiscalHealth: -6 });
        applyMetricMap(stateObj.domestic, { ParliamentApproval: -14, OppositionPressure: 18, MediaHostility: 18, ProtestRisk: 12, ElectionPressure: 14 });
        applyMetricMap(stateObj.threats, { DisinformationRisk: 18, TerrorThreat: 10, EconomicPressure: 9 });
        applyMetricMap(stateObj.systems, { MarketConfidence: -14, InfrastructureIntegrity: -4 });
        pushGlobalReaction(stateObj, "Consumers", "Trust weakens until product claims, warranty promises, and quality gaps are addressed.", "hostile");
        pushAlert(stateObj, "governance", "Trust crisis compounds after a questionable brand or quality decision.");
        return;
      }
      if (kind === "pilot_delay") {
        applyMetricMap(stateObj.stats, { NationalSecurity: -2, EconomicStability: -2, FiscalHealth: -2 });
        applyMetricMap(stateObj.threats, { TerrorThreat: 4, EconomicPressure: 3 });
        pushAlert(stateObj, "portfolio", "Wearables review slips; inventory and price pressure keep compounding.");
        return;
      }
      if (kind === "runway_pressure") {
        applyMetricMap(stateObj.stats, { FiscalHealth: -5, EconomicStability: -3 });
        applyMetricMap(stateObj.threats, { EconomicPressure: 6 });
        applyMetricMap(stateObj.economy, { OilPrice: -4, CurrencyValue: -2 });
        applyMetricMap(stateObj.domestic, { OppositionPressure: 3, ElectionPressure: 2, ParliamentApproval: -1 });
        pushAlert(stateObj, "finance", "IPO readiness review tightens margin, ad-spend, and working-capital choices.");
        return;
      }
      if (kind === "faculty_pushback") {
        applyMetricMap(stateObj.stats, { PublicConfidence: -4, DiplomaticStanding: -2 });
        applyMetricMap(stateObj.domestic, { ProtestRisk: 5, MediaHostility: 4 });
        applyMetricMap(stateObj.domestic, { ParliamentApproval: -1, OppositionPressure: 2 });
        applyMetricMap(stateObj.threats, { DisinformationRisk: 4 });
        pushAlert(stateObj, "service", "Warranty backlog and service complaints start affecting consumer trust.");
        return;
      }
    }

    if (kind === "nuclear_retaliation") {
      const interceptChance = stateObj.military.missileDefense.active
        ? Math.min(0.45, stateObj.military.missileDefense.effectiveness / 120)
        : 0.12;
      const random = seededRandom(stateObj.turn * 811 + stateObj.escalationIndex * 37 + event.id.length);
      const intercepted = random() < interceptChance;
      const f = intercepted ? 0.6 : 1;

      applyMetricMap(stateObj.stats, {
        NationalSecurity: Math.round(-40 * f),
        MilitaryReadiness: Math.round(-24 * f),
        PublicConfidence: Math.round(-32 * f),
        CommunalHarmony: Math.round(-24 * f),
        EconomicStability: Math.round(-35 * f),
        FiscalHealth: Math.round(-26 * f),
        AirQuality: Math.round(-22 * f),
      });
      applyMetricMap(stateObj.threats, { BorderTension: 34, EconomicPressure: 28, PollutionCrisis: 20, DisinformationRisk: 18, TerrorThreat: 12 });
      applyMetricMap(stateObj.economy, { StockIndex: -28, CurrencyValue: -24, OilPrice: -18, Inflation: -14, Unemployment: -12 });
      applyMetricMap(stateObj.systems, { MarketConfidence: -30, SupplyChainIntegrity: -28, InfrastructureIntegrity: -34, HealthcareCapacity: -30, RefugeePressure: 26 });
      if (event.payload && event.payload.target === "India" && !event.payload.provokedByIndia) {
        stateObj.strategicAttackOnIndia = true;
        stateObj.justifiedRetaliationUntil = addMinutes(stateObj.clock, 720);
        stateObj.accountabilityNote = "Confirmed strategic attack on India: retaliatory options are now judged under necessity, proportionality, and survival logic.";
      }
      updateEscalation(stateObj, 24, "Nuclear retaliation event");
      pushAlert(stateObj, "strategic", intercepted ? "Partial interception achieved; severe damage still occurred." : "Retaliatory strike impacts strategic and civilian systems.");
      pushGlobalReaction(stateObj, event.payload.source, "Retaliatory doctrine executed.", "hostile");
      return;
    }

    if (kind === "retaliatory_strike") {
      applyMetricMap(stateObj.stats, { NationalSecurity: -7, MilitaryReadiness: -5, PublicConfidence: -4, FiscalHealth: -3 });
      applyMetricMap(stateObj.threats, { BorderTension: 10, TerrorThreat: 3, DisinformationRisk: 4 });
      applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -7, HealthcareCapacity: -3 });
      updateEscalation(stateObj, 8, "Retaliatory strike");
      pushAlert(stateObj, "military", `${event.payload.source} retaliatory strike window opened.`);
      pushGlobalReaction(stateObj, event.payload.source, "Retaliatory strike pressure applied.", "hostile");
      return;
    }

    if (kind === "cyber_retaliation") {
      applyMetricMap(stateObj.stats, { EconomicStability: -5, PublicConfidence: -3 });
      applyMetricMap(stateObj.threats, { DisinformationRisk: 8, EconomicPressure: 4 });
      applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -10, MarketConfidence: -6, SupplyChainIntegrity: -4 });
      updateEscalation(stateObj, 4, "Cyber retaliation");
      pushAlert(stateObj, "cyber", `${event.payload.source} cyber retaliation impacts grid and logistics systems.`);
      return;
    }

    if (kind === "military_mobilization") {
      applyMetricMap(stateObj.stats, { FiscalHealth: -3, DiplomaticStanding: -2 });
      applyMetricMap(stateObj.threats, { BorderTension: 8, EconomicPressure: 3 });
      updateEscalation(stateObj, 6, "Military mobilization");
      pushGlobalReaction(stateObj, event.payload.source, "Military mobilization initiated.", "concerned");
      return;
    }

    if (kind === "sanctions_wave") {
      applyMetricMap(stateObj.stats, { EconomicStability: -8, FiscalHealth: -5, DiplomaticStanding: -6 });
      applyMetricMap(stateObj.threats, { EconomicPressure: 10, DisinformationRisk: 2 });
      applyMetricMap(stateObj.economy, { StockIndex: -10, CurrencyValue: -8, Unemployment: -3, DefenseSpending: -2 });
      applyMetricMap(stateObj.systems, { MarketConfidence: -9, SupplyChainIntegrity: -8, OilStability: -4 });
      pushGlobalReaction(stateObj, event.payload.source || "Global", "Sanctions architecture activated.", "hostile");
      return;
    }

    if (kind === "un_session") {
      if ((event.payload.legality || 0.5) < 0.4) {
        applyMetricMap(stateObj.stats, { DiplomaticStanding: -6, PublicConfidence: -1 });
        applyMetricMap(stateObj.threats, { BorderTension: 2 });
      } else {
        applyMetricMap(stateObj.stats, { DiplomaticStanding: 2 });
        applyMetricMap(stateObj.threats, { BorderTension: -3 });
        updateEscalation(stateObj, -2, "UN de-escalation channel");
      }
      pushGlobalReaction(stateObj, "UN", "Emergency session response issued.", "neutral");
      return;
    }

    if (kind === "intel_support") {
      if (event.payload.beneficiary === "India") {
        applyMetricMap(stateObj.stats, { NationalSecurity: 3, DiplomaticStanding: 2 });
        applyMetricMap(stateObj.threats, { TerrorThreat: -4, BorderTension: -2 });
      } else {
        applyMetricMap(stateObj.threats, { TerrorThreat: 2, BorderTension: 2 });
      }
      return;
    }

    if (kind === "global_market_crash") {
      applyMetricMap(stateObj.economy, { StockIndex: -14, CurrencyValue: -9, Inflation: -4 });
      applyMetricMap(stateObj.stats, { EconomicStability: -8, PublicConfidence: -3 });
      applyMetricMap(stateObj.systems, { MarketConfidence: -16, SupplyChainIntegrity: -6 });
      pushAlert(stateObj, "economy", "Global markets drop sharply amid strategic uncertainty.");
      return;
    }

    if (kind === "oil_shock") {
      applyMetricMap(stateObj.economy, { OilPrice: -12, Inflation: -5, CurrencyValue: -4 });
      applyMetricMap(stateObj.threats, { EconomicPressure: 8 });
      applyMetricMap(stateObj.systems, { OilStability: -12, SupplyChainIntegrity: -3 });
      pushAlert(stateObj, "economy", "Oil shock feeds inflation and import stress.");
      return;
    }

    if (kind === "refugee_wave") {
      applyMetricMap(stateObj.systems, { RefugeePressure: 18, HealthcareCapacity: -8, InfrastructureIntegrity: -5 });
      applyMetricMap(stateObj.stats, { CommunalHarmony: -5, PublicConfidence: -3, EconomicStability: -3 });
      applyMetricMap(stateObj.threats, { DisinformationRisk: 5, EconomicPressure: 4 });
      pushAlert(stateObj, "humanitarian", "Displacement surge creates humanitarian and governance pressure.");
      return;
    }

    if (kind === "black_market_adaptation") {
      stateObj.adaptation.blackMarketNetwork = clamp(stateObj.adaptation.blackMarketNetwork + 8);
      applyMetricMap(stateObj.threats, { EconomicPressure: 4, TerrorThreat: 2 });
      pushAlert(stateObj, "covert", "Adversary adaptation: black-market channels are bypassing pressure." );
      return;
    }

    if (kind === "terror_strike") {
      applyMetricMap(stateObj.stats, { PublicConfidence: -8, NationalSecurity: -5, CommunalHarmony: -6 });
      applyMetricMap(stateObj.threats, { TerrorThreat: 9, DisinformationRisk: 5 });
      updateEscalation(stateObj, 7, "Major terror incident");
      pushAlert(stateObj, "terror", "Major terror incident reported in urban corridor.");
      return;
    }

    if (kind === "cyber_breach") {
      applyMetricMap(stateObj.stats, { EconomicStability: -5, PublicConfidence: -4 });
      applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -12, MarketConfidence: -6 });
      applyMetricMap(stateObj.threats, { DisinformationRisk: 7, EconomicPressure: 4 });
      pushAlert(stateObj, "cyber", "Critical infrastructure cyber breach expands outage risk.");
      return;
    }

    if (kind === "parliament_crisis") {
      applyMetricMap(stateObj.domestic, { ParliamentApproval: -8, OppositionPressure: 10, MediaHostility: 6, ProtestRisk: 5, ElectionPressure: 4 });
      pushAlert(stateObj, "politics", "Parliamentary deadlock weakens crisis policy throughput.");
      return;
    }

    if (kind === "border_skirmish" || kind === "naval_clash") {
      applyMetricMap(stateObj.stats, { NationalSecurity: -4, PublicConfidence: -3, DiplomaticStanding: -3 });
      applyMetricMap(stateObj.threats, { BorderTension: 10, EconomicPressure: 3 });
      updateEscalation(stateObj, 8, "Military confrontation event");
      pushAlert(stateObj, "military", event.kind === "naval_clash" ? "Naval clash reported in forward waters." : "Border skirmish with casualties reported.");
    }
  }

  function processDueEvents(stateObj) {
    const due = stateObj.pendingEvents.filter((e) => new Date(e.dueAt).getTime() <= new Date(stateObj.clock).getTime());
    if (!due.length) return [];

    stateObj.pendingEvents = stateObj.pendingEvents.filter((e) => new Date(e.dueAt).getTime() > new Date(stateObj.clock).getTime());

    const logs = [];
    due.forEach((event) => {
      processEvent(stateObj, event);
      logs.push(`${event.kind}: ${event.description}`);
    });

    return logs;
  }

  function updateDomesticAndLeadership(stateObj) {
    if (isBusinessScenario(stateObj)) {
      deterministicLogic.rebalanceBusinessStakeholders(stateObj, 0.22, 3);

      const leadershipRaw =
        stateObj.stats.FiscalHealth * 0.18 +
        stateObj.stats.EconomicStability * 0.16 +
        stateObj.stats.NationalSecurity * 0.14 +
        stateObj.stats.DiplomaticStanding * 0.14 +
        stateObj.systems.MarketConfidence * 0.14 +
        stateObj.domestic.ParliamentApproval * 0.1 +
        (100 - stateObj.domestic.OppositionPressure) * 0.08 +
        (100 - stateObj.threats.PollutionCrisis) * 0.06;

      stateObj.leadership = clamp(Math.round(leadershipRaw));
      if (stateObj.leadership < 32) pushAlert(stateObj, "board", "Board confidence is weakening as execution credibility falls.");
      if (stateObj.leadership < 24) pushAlert(stateObj, "board", "Founder-removal pressure is now severe.");
      return;
    }

    const stress =
      (100 - stateObj.stats.PublicConfidence) * 0.16 +
      stateObj.threats.EconomicPressure * 0.15 +
      stateObj.threats.BorderTension * 0.11 +
      stateObj.sentiment.PanicLevel * 0.14 +
      stateObj.systems.RefugeePressure * 0.08 +
      (100 - stateObj.systems.MarketConfidence) * 0.13 +
      (100 - stateObj.systems.InfrastructureIntegrity) * 0.11 +
      (100 - stateObj.stats.DiplomaticStanding) * 0.08 +
      stateObj.escalationIndex * 0.04;

    stateObj.domestic.ParliamentApproval = clamp(
      stateObj.domestic.ParliamentApproval +
      Math.round((stateObj.stats.PublicConfidence - 50) / 9) +
      Math.round((stateObj.stats.DiplomaticStanding - 50) / 16) -
      Math.round((stress - 50) / 18)
    );
    stateObj.domestic.OppositionPressure = clamp(
      stateObj.domestic.OppositionPressure +
      Math.round((stress - 48) / 10) +
      Math.round((100 - stateObj.stats.DiplomaticStanding) / 30)
    );
    stateObj.domestic.MediaHostility = clamp(
      stateObj.domestic.MediaHostility +
      Math.round((stateObj.threats.DisinformationRisk - 45) / 12) +
      Math.round((100 - stateObj.stats.PublicConfidence) / 24)
    );
    stateObj.domestic.ProtestRisk = clamp(
      stateObj.domestic.ProtestRisk +
      Math.round((stress - 46) / 9) +
      Math.round((100 - stateObj.systems.MarketConfidence) / 28)
    );
    stateObj.domestic.ElectionPressure = clamp(
      stateObj.domestic.ElectionPressure +
      Math.round((stress - 48) / 11) +
      Math.round((100 - stateObj.domestic.ParliamentApproval) / 35)
    );

    stateObj.sentiment.TrustInGovernment = clamp(
      stateObj.sentiment.TrustInGovernment +
      Math.round((stateObj.stats.PublicConfidence - 50) / 10) -
      Math.round((stateObj.domestic.OppositionPressure - 50) / 35)
    );
    stateObj.sentiment.PanicLevel = clamp(
      stateObj.sentiment.PanicLevel +
      Math.round((stress - 48) / 8) +
      Math.round((100 - stateObj.systems.InfrastructureIntegrity) / 34)
    );
    stateObj.sentiment.Nationalism = clamp(stateObj.sentiment.Nationalism + Math.round((stateObj.escalationIndex - 46) / 12));
    stateObj.sentiment.CommunalTension = clamp(
      stateObj.sentiment.CommunalTension +
      Math.round((stateObj.threats.DisinformationRisk - 46) / 14) +
      Math.round((stateObj.sentiment.PanicLevel - 50) / 30)
    );

    const leadershipRaw =
      stateObj.stats.PublicConfidence * 0.18 +
      stateObj.stats.EconomicStability * 0.16 +
      stateObj.stats.NationalSecurity * 0.16 +
      stateObj.domestic.ParliamentApproval * 0.16 +
      (100 - stateObj.domestic.OppositionPressure) * 0.1 +
      (100 - stateObj.domestic.ProtestRisk) * 0.1 +
      stateObj.stats.DiplomaticStanding * 0.06 +
      stateObj.systems.MarketConfidence * 0.08;

    stateObj.leadership = clamp(Math.round(leadershipRaw));

    if (stateObj.leadership < 32) {
      pushAlert(stateObj, "politics", "Cabinet revolt pressure rising as leadership credibility falls.");
    }
    if (stateObj.leadership < 24) {
      pushAlert(stateObj, "politics", "Resignation and snap-election pressure now severe.");
    }
  }

  function processCrisisTimers(stateObj) {
    const elapsedHours = stateObj.tickMinutes / 60;
    const expired = [];
    stateObj.crisisTimers.forEach((t) => {
      t.hoursLeft = Math.max(0, t.hoursLeft - elapsedHours);
      if (t.hoursLeft === 0) expired.push(t);
    });

    stateObj.crisisTimers = stateObj.crisisTimers.filter((t) => t.hoursLeft > 0);

    expired.forEach((timer) => {
      scheduleEvent(stateObj, timer.onExpire, 0, { source: "Timer", severity: timer.severity }, `${timer.label} reached zero.`);
      pushAlert(stateObj, "timer", `${timer.label} expired.`);
    });
  }

  function adjustPressureTimersForDecision(stateObj, profile) {
    if (!Array.isArray(stateObj.crisisTimers) || !profile) return;
    const style = profile.style || "";
    const domain = profile.domain || "";
    stateObj.crisisTimers.forEach((timer) => {
      timer.initialHours = Number.isFinite(timer.initialHours) ? timer.initialHours : Math.max(Number(timer.hoursLeft) || 1, 1);
      let delta = 0;
      if (isBusinessScenario(stateObj)) {
        if (/pricing|finance/i.test(style) && /Discount|IPO|Credibility/i.test(timer.label)) delta += 1.0;
        if (/product|portfolio/i.test(`${style} ${domain}`) && /Wearables|Portfolio/i.test(timer.label)) delta += 1.1;
        if (/governance|operations/i.test(style) && /Warranty|Credibility|Backlog/i.test(timer.label)) delta += 1.0;
        if (/market|brand/i.test(style) && /Discount|Marketplace/i.test(timer.label)) delta += 0.45;
        if (/overreach|unethical/i.test(style)) delta -= 1.2;
      } else {
        if (/domestic|defensive|information/i.test(style) && /Attack|Terror|Parliament/i.test(timer.label)) delta += 0.7;
        if (/diplomatic|economic/i.test(style) && /Parliament|Cyber|Attack/i.test(timer.label)) delta += 0.35;
        if (/kinetic|decapitation|nuclear/i.test(style)) delta -= 0.9;
      }
      timer.hoursLeft = Math.max(0.2, Number(timer.hoursLeft) + delta);
      timer.severity = clamp((timer.severity || 50) + (delta < 0 ? 6 : -2));
    });
  }

  function dynamicBlackSwan(stateObj) {
    const random = seededRandom(stateObj.turn * 503 + stateObj.escalationIndex * 19 + stateObj.fogOfWar.uncertainty * 11);
    const triggerChance = isBusinessScenario(stateObj) ? 0.09 : 0.22;
    if (random() > triggerChance) return;

    if (isBusinessScenario(stateObj)) {
      const pool = [
        { weight: 4, text: "Noise cuts smartwatch prices before the festive sale window.", apply: () => { applyMetricMap(stateObj.threats, { BorderTension: 7, TerrorThreat: 4, EconomicPressure: 4 }); applyMetricMap(stateObj.systems, { MarketConfidence: -3 }); } },
        { weight: 3, text: "A warranty complaint thread starts trending in a Tier 2 city.", apply: () => { applyMetricMap(stateObj.stats, { PublicConfidence: -5, DiplomaticStanding: -3 }); applyMetricMap(stateObj.domestic, { ProtestRisk: 6 }); applyMetricMap(stateObj.systems, { RefugeePressure: 6 }); } },
        { weight: 2, text: "A component supplier warns of delayed shipments for premium earbuds.", apply: () => { applyMetricMap(stateObj.stats, { NationalSecurity: -3 }); applyMetricMap(stateObj.systems, { SupplyChainIntegrity: -5, OilStability: -3 }); } },
        { weight: 3, text: "A creator campaign unexpectedly boosts demand for premium audio.", apply: () => { applyMetricMap(stateObj.economy, { StockIndex: 5, CurrencyValue: 2 }); applyMetricMap(stateObj.systems, { MarketConfidence: 4 }); } },
      ];
      const choice = weightedPick(pool, "weight", () => random());
      choice.apply();
      pushAlert(stateObj, "black-swan", `Business surprise: ${choice.text}`);
      return;
    }

    const pool = [
      { kind: "satellite_failure", text: "Satellite surveillance degraded by technical failure.", apply: () => { stateObj.military.satellites.operational = clamp(stateObj.military.satellites.operational - 12); stateObj.fogOfWar.uncertainty = clamp(stateObj.fogOfWar.uncertainty + 10); } },
      { kind: "coup_risk", text: "Coup rumors emerge in neighboring command structure.", apply: () => { updateEscalation(stateObj, 6, "Regional instability"); applyMetricMap(stateObj.threats, { BorderTension: 6, DisinformationRisk: 4 }); } },
      { kind: "earthquake", text: "Major earthquake disrupts logistics during ongoing crisis.", apply: () => { applyMetricMap(stateObj.systems, { InfrastructureIntegrity: -10, HealthcareCapacity: -8 }); applyMetricMap(stateObj.stats, { FiscalHealth: -4, PublicConfidence: -3 }); } },
      { kind: "assassination_attempt", text: "Assassination attempt on key figure triggers panic wave.", apply: () => { applyMetricMap(stateObj.sentiment, { PanicLevel: 8, TrustInGovernment: -4 }); applyMetricMap(stateObj.threats, { DisinformationRisk: 7 }); } },
    ];

    const choice = weightedPick(pool, "kind", () => random());
    choice.apply();
    pushAlert(stateObj, "black-swan", `Black Swan: ${choice.text}`);
  }

  function dynamicEventTick(stateObj) {
    if (!dynamicEngineOn) return;

    stateObj.clock = addMinutes(stateObj.clock, stateObj.tickMinutes);
    stateObj.turn += 1;

    processCrisisTimers(stateObj);

    const dueLogs = processDueEvents(stateObj);
    dueLogs.forEach((log) => pushAlert(stateObj, "event", log));

    const random = seededRandom(stateObj.turn * 997 + stateObj.escalationIndex * 31);
    const lastDecision = stateObj.history[0];
    const eventChance = isBusinessScenario(stateObj) ? deterministicLogic.businessEventChance(stateObj) : 0.52;
    if (random() < eventChance) {
      if (isBusinessScenario(stateObj)) {
        const eventKind = deterministicLogic.pickWeightedBusinessEvent(
          stateObj,
          lastDecision,
          random(),
          stateObj.dynamicEventHistory || []
        );
        const eventDefinitions = {
          faculty_pushback: ["Service Desk", "Warranty backlog forces a service-quality review."],
          pricing_pushback: ["Marketplace", "Marketplace teams test whether pricing discipline can hold against competitive discounting."],
          product_delay: ["Product", "Product scope is tested against supply, quality, and service capacity."],
          runway_pressure: ["Finance", "IPO-readiness review tests margin, ad-spend, and working-capital discipline."],
          pilot_feedback: ["Consumers", "Consumers return detailed brand, product, and service feedback."],
          conversion_review: ["Retailer", "Channel partners compare sales lift with promotion cost and inventory quality."],
          credibility_boost: ["Board", "Execution evidence improves confidence in service, supply, and governance discipline."],
        };
        const [source, description] = eventDefinitions[eventKind];
        scheduleEvent(stateObj, eventKind, 0, { source }, description);
        stateObj.dynamicEventHistory = [...(stateObj.dynamicEventHistory || []), eventKind].slice(-8);
        processDueEvents(stateObj).forEach((x) => pushAlert(stateObj, "event", x));
        dynamicBlackSwan(stateObj);
        applyFeedbackLoops(stateObj);
        refreshIntelReport(stateObj);
        refreshHeadlines(stateObj);
        refreshStrategicSummaries(stateObj);
        updateDomesticAndLeadership(stateObj);
        if (stateObj === state && evaluateLeadershipRemoval(stateObj)) {
          saveState();
          openSessionReport();
          setStatus(stateObj.dismissalReason, true);
        }
        return;
      }

      const incidents = [
        () => scheduleEvent(stateObj, "border_skirmish", 0, { source: "Border" }, "Forward units report probing fire after overnight force movement."),
        () => scheduleEvent(stateObj, "cyber_breach", 0, { source: "Grid" }, "Grid anomaly spreads into logistics and payment rails."),
        () => scheduleEvent(stateObj, "terror_strike", 0, { source: "Network" }, "Residual terror cell chatter points to a possible opportunistic strike."),
        () => scheduleEvent(stateObj, "parliament_crisis", 0, { source: "Politics" }, "Parliamentary pressure rises as ministers demand tighter justification for the crisis line."),
      ];

      if (lastDecision && /airstrike|strike|kinetic|special forces/i.test(lastDecision.title)) {
        incidents.push(
          () => scheduleEvent(stateObj, "retaliatory_strike", 0, { source: "Pakistan" }, "Adversary response posture hardens after recent kinetic action."),
          () => scheduleEvent(stateObj, "cyber_retaliation", 0, { source: "Pakistan" }, "Hostile cyber operators answer recent pressure with disruption attempts.")
        );
      }

      if (lastDecision && /diplomatic|coalition|fatf|sanction/i.test(lastDecision.title)) {
        incidents.push(
          () => scheduleEvent(stateObj, "sanctions_wave", 0, { source: "EU" }, "Diplomatic pressure generates compliance stress and evasive financial behavior."),
          () => scheduleEvent(stateObj, "black_market_adaptation", 0, { source: "Network" }, "Sanctions pressure pushes adversary finance into informal channels.")
        );
      }

      incidents[Math.floor(random() * incidents.length)]();
      processDueEvents(stateObj).forEach((x) => pushAlert(stateObj, "event", x));
    }

    dynamicBlackSwan(stateObj);
    applyFeedbackLoops(stateObj);
    refreshIntelReport(stateObj);
    refreshHeadlines(stateObj);
    refreshStrategicSummaries(stateObj);
    updateDomesticAndLeadership(stateObj);
    if (stateObj === state && evaluateLeadershipRemoval(stateObj)) {
      saveState();
      openSessionReport();
      setStatus(stateObj.dismissalReason, true);
      return;
    }
  }
  function getDynamicOptions(stateObj) {
    const base = getStructuredOptions(stateObj);
    const weights = {
      Security: stateObj.threats.TerrorThreat + stateObj.threats.BorderTension,
      Covert: stateObj.threats.TerrorThreat + stateObj.fogOfWar.uncertainty,
      Diplomacy: stateObj.escalationIndex + stateObj.threats.BorderTension,
      Internal: stateObj.threats.TerrorThreat + stateObj.threats.DisinformationRisk,
      Economy: stateObj.threats.EconomicPressure,
      Environment: stateObj.threats.PollutionCrisis,
      Information: stateObj.threats.DisinformationRisk,
      Cyber: stateObj.threats.DisinformationRisk + stateObj.threats.EconomicPressure,
      "Legal Process": stateObj.threats.TerrorThreat + stateObj.domestic.OppositionPressure,
      "Public Relief": stateObj.sentiment.PanicLevel + stateObj.systems.HealthcareCapacity,
      "Public Safety": stateObj.threats.TerrorThreat + stateObj.sentiment.PanicLevel,
      "Political Management": stateObj.domestic.OppositionPressure + stateObj.domestic.MediaHostility,
      "Finance & Enforcement": stateObj.threats.TerrorThreat + stateObj.threats.EconomicPressure,
      Coordination: stateObj.threats.TerrorThreat + stateObj.fogOfWar.uncertainty,
      "Kinetic Escalation": stateObj.threats.TerrorThreat + stateObj.sentiment.Nationalism,
      Sales: stateObj.systems.MarketConfidence + stateObj.economy.StockIndex,
      Product: (100 - stateObj.systems.InfrastructureIntegrity) + stateObj.threats.PollutionCrisis,
      Finance: stateObj.threats.EconomicPressure + (100 - stateObj.stats.FiscalHealth),
      "M&A": stateObj.threats.BorderTension + (100 - stateObj.stats.NationalSecurity),
      "IPO Readiness": stateObj.threats.EconomicPressure + (100 - stateObj.stats.DiplomaticStanding),
      Growth: stateObj.threats.TerrorThreat + stateObj.stats.AirQuality,
      Trust: stateObj.threats.DisinformationRisk + (100 - stateObj.stats.DiplomaticStanding),
      Strategy: stateObj.threats.BorderTension + stateObj.threats.PollutionCrisis,
      Portfolio: stateObj.threats.PollutionCrisis + (100 - stateObj.stats.NationalSecurity),
      Channels: stateObj.threats.BorderTension + (100 - stateObj.systems.MarketConfidence),
      Brand: stateObj.threats.DisinformationRisk + (100 - stateObj.stats.PublicConfidence),
      Operations: (100 - stateObj.systems.SupplyChainIntegrity) + stateObj.systems.RefugeePressure,
      "Aggressive Growth": stateObj.threats.BorderTension + stateObj.threats.EconomicPressure,
      "Extra-Legal": 0,
    };

    return base
      .map((o) => ({ ...o, score: (weights[o.domain] || 0) - o.risk * 12 + o.legality * 10 }))
      .sort((a, b) => b.score - a.score);
  }

  function setStatus(text, isError = false) {
    els.statusLine.textContent = text;
    els.statusLine.style.color = isError ? "var(--danger)" : "#395062";
  }

  function liveMetricValueForKey(key) {
    const groups = [state.stats, state.threats, state.domestic, state.sentiment, state.economy, state.systems];
    for (const group of groups) {
      if (group && Number.isFinite(group[key])) return clamp(Math.round(group[key]));
    }
    return null;
  }
  function metricCard(key, value, bad = false, labelOverride = null) {
    const current = clamp(Math.round(value));
    const fillWidth = current;
    const cls = bad ? "fill alert" : "fill";
    const label = labelOverride || getMetricLabel(key);
    const baseline = metricBaselineForKey(key);
    const marker = baseline === null
      ? ""
      : `<span class="baseline-marker" style="left:${baseline}%" title="Starting baseline: ${baseline}/100" aria-label="Starting baseline ${baseline} out of 100"></span>`;
    const startLabel = baseline === null ? "" : `<span class="baseline-note">Start ${baseline}</span>`;
    const liveValue = activePreDecisionSnapshot() ? liveMetricValueForKey(key) : null;
    const compareLabel = liveValue === null ? "" : `<span class="baseline-note">Now ${liveValue}</span>`;
    return `
      <div class="metric">
        <div class="metric-head"><strong>${label}</strong><span>${current}/100</span></div>
        <div class="track">
          <div class="${cls}" style="width:${fillWidth}%"></div>
          ${marker}
        </div>
        <small>${band(value, bad)}${startLabel}${compareLabel}</small>
      </div>
    `;
  }

  function renderMetricGrid(container, source, keys) {
    if (!container) return;
    container.innerHTML = keys
      .map((k) => metricCard(k, source[k], isBadMetric(k)))
      .join("");
  }

  function renderHeatMaps() {
    const heat = isBusinessScenario(state)
      ? [
          { key: "EconomicPressure", label: "Margin Pressure", value: state.threats.EconomicPressure, bad: true },
          { key: "PollutionCrisis", label: "Commoditization", value: state.threats.PollutionCrisis, bad: true },
          { key: "DisinformationRisk", label: "Brand Dilution", value: state.threats.DisinformationRisk, bad: true },
          { key: "BorderTension", label: "Competitive Pressure", value: state.threats.BorderTension, bad: true },
        ]
      : [
          { key: "EconomicPressure", label: "Economic Stress", value: state.threats.EconomicPressure, bad: true },
          { key: "ProtestRisk", label: "Public Unrest", value: state.domestic.ProtestRisk, bad: true },
          { key: "PollutionCrisis", label: "Pollution", value: state.threats.PollutionCrisis, bad: true },
          { key: "TerrorThreat", label: "Terror Threat", value: state.threats.TerrorThreat, bad: true },
        ];

    els.heatMaps.innerHTML = heat
      .map((h) => metricCard(h.key, h.value, true, h.label))
      .join("");
  }

  function renderAlertFeed() {
    els.liveFeedSummary.textContent = state.liveFeedSummary || composeStrategicSummary(state, "live");
    els.alertFeed.innerHTML = state.alerts
      .slice(0, 12)
      .map((a) => `<div class="item"><strong>${a.time}</strong> - ${a.text}</div>`)
      .join("");
  }

  function renderLiveMedia() {
    const scenario = SCENARIOS.find((item) => item.id === state.scenarioId) || SCENARIOS[0];
    const media = scenario.media || SCENARIOS[0].media;

    els.liveMediaTitle.textContent = media.title;
    els.liveMediaCaption.textContent = media.caption;
    els.liveMediaLink.href = media.sourceUrl;
    els.liveMediaLink.textContent = media.sourceLabel || "Image source";
    els.scenarioImage.classList.toggle("logo-media", isBusinessScenario(state));
    if (els.scenarioImage.getAttribute("src") !== media.imageUrl) {
      els.scenarioImage.setAttribute("src", media.imageUrl);
    }
  }

  function renderCrisisTimers() {
    if (!state.crisisTimers.length) {
      els.crisisTimerList.innerHTML = `<div class="item">No active countdowns.</div>`;
      return;
    }
    els.crisisTimerList.innerHTML = state.crisisTimers
      .map((t) => {
        const initial = Math.max(Number(t.initialHours) || Number(t.hoursLeft) || 1, 1);
        const pct = clamp(Math.round((Number(t.hoursLeft) / initial) * 100));
        const pressure = clamp(Math.round((100 - pct) * 0.55 + (t.severity || 50) * 0.45));
        return `
          <div class="item timer-item">
            <div class="timer-row"><strong>${escapeHtml(t.label)}</strong><span>${Number(t.hoursLeft).toFixed(1)}h</span></div>
            <div class="timer-track" aria-label="${escapeHtml(t.label)} remaining time">
              <div class="timer-fill" style="width:${pct}%"></div>
            </div>
            <small>Pressure ${pressure}/100 | Trigger: ${escapeHtml(t.onExpire || "delayed response")}</small>
          </div>
        `;
      })
      .join("");
  }

  function renderPendingEvents() {
    if (!state.pendingEvents.length) {
      els.pendingList.innerHTML = `<div class="item">No delayed reactions queued.</div>`;
      return;
    }

    const items = [...state.pendingEvents]
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      .slice(0, 10);

    els.pendingList.innerHTML = items
      .map((e) => `<div class="item"><strong>${formatTime(e.dueAt)}</strong><br>${e.description}</div>`)
      .join("");
  }

  function applyScenarioLayout() {
    const ui = getScenarioUi(state);
    const labels = ui.labels || {};
    const business = isBusinessScenario(state);
    els.simulationShell.classList.toggle("business-mode", business);
    els.simulationNav.classList.toggle("business-navigation", business);
    els.businessScorecardPanel.classList.toggle("hidden", !business);
    els.standardImpactTabs.classList.toggle("hidden", business);
    els.leadershipPanel.classList.toggle("hidden", business);
    els.operationsPanel.classList.toggle("hidden", business || !ui.showOperations);
    els.covertPanel.classList.toggle("hidden", !ui.showCovert);
    els.dashboardTitle.textContent = labels.dashboardTitle || "War Room Dashboard";
    els.timerPanelTitle.textContent = labels.timerTitle || "Crisis Timers";
    els.decisionConsoleTitle.textContent = labels.decisionTitle || "Decision Console";
    els.meetingPanelTitle.textContent = labels.meetingTitle || "Emergency Meeting";
    els.briefingPanelTitle.textContent = labels.briefingTitle || "Intelligence Briefing";
    els.impactPanelTitle.textContent = labels.impactTitle || "Impact Windows";
    els.domesticPanelTitle.textContent = labels.domesticTitle || "Domestic Politics & Media";
    els.sentimentPanelTitle.textContent = labels.sentimentTitle || "National Sentiment";
    els.headlinesPanelTitle.textContent = labels.headlinesTitle || "Headlines";
    els.worldPanelTitle.textContent = labels.worldTitle || "World Response Dashboard";
    els.economyPanelTitle.textContent = labels.economyTitle || "Economy Simulator";
    els.leadershipPanelTitle.textContent = labels.leadershipTitle || "Leadership Meter";
    els.tabDomesticBtn.textContent = labels.tabDomestic || "Domestic";
    els.tabWorldBtn.textContent = labels.tabWorld || "World";
    els.tabEconomyBtn.textContent = labels.tabEconomy || "Economy";
    els.operationsTitle.textContent = ui.operationsTitle;
    els.operationsBadge.textContent = ui.operationsBadge;
    els.operationsInputLabel.textContent = ui.operationsLabel;
    els.militaryOperationInput.placeholder = ui.operationsPlaceholder;
    els.executeMilitaryOperationBtn.textContent = ui.operationsButton;
    els.covertTitle.textContent = ui.covertTitle;
    els.covertBadge.textContent = ui.covertBadge;

    const tabs = [
      { key: "domestic", show: ui.showDomestic, btn: els.tabDomesticBtn, panel: els.tabDomesticPanel },
      { key: "world", show: ui.showWorld, btn: els.tabWorldBtn, panel: els.tabWorldPanel },
      { key: "economy", show: ui.showEconomy, btn: els.tabEconomyBtn, panel: els.tabEconomyPanel },
    ];
    const visibleTabs = [];
    tabs.forEach((tab) => {
      tab.btn.classList.toggle("hidden", !tab.show);
      tab.panel.classList.toggle("hidden", !tab.show || activeInsightTab !== tab.key);
      if (tab.show) visibleTabs.push(tab.key);
    });
    if (!visibleTabs.includes(activeInsightTab)) {
      activeInsightTab = visibleTabs[0] || "domestic";
    }
  }

  function getSimulationPageConfig() {
    const ui = getScenarioUi(state);
    const business = isBusinessScenario(state);
    const pages = [
      {
        id: "command",
        label: business ? "Strategy Desk" : "Command",
        hint: business ? "Make the next board-level move and review the concise consequence chain." : "Make the next crisis decision and review the concise consequence chain.",
      },
    ];

    if (!business) {
      pages.push({
        id: "dashboard",
        label: "War Room",
        hint: "Track the incident image, national heat maps, live alerts, timers, and delayed reactions.",
      }, {
        id: "briefing",
        label: "Briefing",
        hint: "Read intelligence inputs, uncertainty, chatter, and operational signals.",
      });
    }

    if (ui.showOperations || ui.showCovert) {
      pages.push({
        id: "operations",
        label: business ? "Strategy Room" : "Operations",
        hint: business ? "Review strategic moves and manage emergency decisions with live company and stakeholder signals." : "Run open-ended operational moves in parallel with the main decision panel.",
      });
    }

    if (ui.showDomestic || ui.showWorld || ui.showEconomy) {
      pages.push({
        id: "impact",
        label: business ? "Scorecards" : "Impact",
        hint: business ? "Review company health, performance trends, decision-critical metrics, and stakeholder signals in one scorecard." : "Inspect how decisions affect domestic politics, world response, economy, and leadership stability.",
      });
    }

    return pages;
  }

  function renderSimulationPages() {
    const pages = getSimulationPageConfig();
    const validPageIds = pages.map((page) => page.id);
    if (!validPageIds.includes(activeSimulationPage)) {
      activeSimulationPage = validPageIds[0] || "command";
    }

    if (els.simulationLayout) {
      els.simulationLayout.querySelectorAll("[data-sim-page-panel]").forEach((panel) => {
        panel.classList.toggle("active-page-panel", panel.dataset.simPagePanel === activeSimulationPage);
      });
    }

    if (els.simulationNav) {
      els.simulationNav.querySelectorAll("[data-sim-page]").forEach((btn) => {
        const page = pages.find((item) => item.id === btn.dataset.simPage);
        btn.classList.toggle("hidden", !page);
        btn.classList.toggle("active", Boolean(page && page.id === activeSimulationPage));
        if (page) btn.textContent = page.label;
      });
    }

    const activePage = pages.find((page) => page.id === activeSimulationPage) || pages[0];
    const latestDecision = state.history && state.history[0];
    const latestText = latestDecision
      ? ` Latest: ${latestDecision.title} -> ${latestDecision.outcome}.`
      : "";
    if (els.simPageHint && activePage) {
      els.simPageHint.textContent = `${activePage.hint}${latestText}`;
    }
    const showFirstDecisionNudge = isBusinessScenario(state)
      && state.onboardingComplete
      && activeSimulationPage === "impact"
      && Number(state.decisionMetrics && state.decisionMetrics.total || 0) === 0
      && !state.firstDecisionNudgeDismissed;
    els.firstDecisionNudge.classList.toggle("hidden", !showFirstDecisionNudge);
    if (isBusinessScenario(state) && activeSimulationPage === "impact") {
      requestAnimationFrame(renderBusinessScorecard);
    }
  }

  function setSimulationPage(pageId) {
    if (pageId === "command"
      && isBusinessScenario(state)
      && state.onboardingComplete
      && Number(state.decisionMetrics && state.decisionMetrics.total || 0) === 0) {
      state.firstDecisionNudgeDismissed = true;
      saveState();
    }
    activeSimulationPage = pageId;
    renderSimulationPages();
  }

  function renderMilitaryOperations() {
    const ui = getScenarioUi(state);
    if (isBusinessScenario(state)) {
      els.operationsVisual.replaceChildren();
      return;
    }
    const latestOperation = state.military.operationLog && state.military.operationLog[0];
    const hot = state.hotspots.slice(0, 4);
    const imageUrlByMode = {
      military: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Troops_during_a_exercise_with_US_Army.jpg",
      maritime: currentScenario(state).media.imageUrl,
      security: currentScenario(state).media.imageUrl,
      infrastructure: currentScenario(state).media.imageUrl,
      business: BUSINESS_BOARDROOM_IMAGE,
      strategic: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Troops_during_a_exercise_with_US_Army.jpg",
    };
    const imageUrl = imageUrlByMode[ui.operationsRender] || imageUrlByMode.strategic;
    const volatility = clamp(Math.round((state.threats.BorderTension + state.threats.TerrorThreat + state.escalationIndex) / 3));
    const postureMap = {
      military: volatility > 78 ? "War-footing readiness" : volatility > 62 ? "Forward alert" : volatility > 45 ? "Heightened watch" : "Controlled posture",
      maritime: volatility > 78 ? "Sea-lane crisis posture" : volatility > 62 ? "Escort posture" : volatility > 45 ? "Maritime watch" : "Controlled maritime stance",
      security: volatility > 78 ? "Urban emergency posture" : volatility > 62 ? "High alert" : volatility > 45 ? "Visible security surge" : "Controlled internal-security stance",
      infrastructure: state.systems.InfrastructureIntegrity < 50 ? "Grid emergency mode" : state.systems.InfrastructureIntegrity < 68 ? "Stabilization mode" : "Controlled recovery posture",
      business: state.stats.FiscalHealth < 45 ? "Margin-pressure board review" : state.threats.PollutionCrisis > 70 ? "Portfolio-commoditization stress" : "Focused consumer-tech execution",
      strategic: volatility > 78 ? "National emergency posture" : volatility > 62 ? "Forward alert" : volatility > 45 ? "Heightened watch" : "Controlled posture",
    };
    const posture = postureMap[ui.operationsRender] || postureMap.strategic;
    const responseWindow = state.pendingEvents.find((event) => /retaliat|cyber|alliance|sanction|pilot|conversion|pricing|product|faculty|runway|trust|focus|credibility|brand|warranty|service|marketplace|portfolio|margin|ipo|category|sku/i.test(`${event.kind || ""} ${event.description || ""}`));

    const readiness = Math.round(
      (state.military.airSquadrons.reduce((sum, unit) => sum + unit.readiness, 0) +
        state.military.navalFleets.reduce((sum, unit) => sum + unit.readiness, 0) +
        state.military.specialForces.readiness) /
        (state.military.airSquadrons.length + state.military.navalFleets.length + 1)
    );
    const panelMap = {
      military: {
        alt: "Indian troops during field exercise",
        overlay: `${posture} | Theatre volatility: ${volatility}/100 | Readiness: ${readiness}/100 | Missile defence: ${state.military.missileDefense.active ? "Active" : "Standby"}`,
        tiles: [
          ["Air Commands", state.military.airSquadrons.map((sq) => `${escapeHtml(sq.name)}: ${sq.readiness}/100`).join("<br>")],
          ["Naval Fleets", state.military.navalFleets.map((fleet) => `${escapeHtml(fleet.name)}: ${escapeHtml(fleet.region)}, ${fleet.readiness}/100`).join("<br>")],
          ["Active Hotspots", hot.map((h) => `${escapeHtml(h.region)}: ${escapeHtml(h.type)}, ${h.severity}/100`).join("<br>") || "No major hotspot registered."],
          ["Response Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate military response window queued."],
          ["Latest Operation", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No open-ended operation executed yet."],
        ],
      },
      maritime: {
        alt: "Indian Navy posture image",
        overlay: `${posture} | Sea-lane tension: ${state.threats.BorderTension}/100 | Shipping resilience: ${state.systems.SupplyChainIntegrity}/100 | Fleet readiness: ${Math.round(averageValues(state.military.navalFleets.map((fleet) => fleet.readiness)))}/100`,
        tiles: [
          ["Naval Fleets", state.military.navalFleets.map((fleet) => `${escapeHtml(fleet.name)}: ${escapeHtml(fleet.region)}, ${fleet.readiness}/100`).join("<br>")],
          ["Shipping Stress", `Supply chains: ${state.systems.SupplyChainIntegrity}/100<br>Oil stability: ${state.systems.OilStability}/100<br>Market confidence: ${state.systems.MarketConfidence}/100`],
          ["Maritime Hotspots", hot.map((h) => `${escapeHtml(h.region)}: ${escapeHtml(h.type)}, ${h.severity}/100`).join("<br>") || "No active maritime hotspot registered."],
          ["Response Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate maritime response window queued."],
          ["Latest Operation", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No open-ended maritime order executed yet."],
        ],
      },
      security: {
        alt: "Mumbai crisis reference image",
        overlay: `${posture} | Terror threat: ${state.threats.TerrorThreat}/100 | Public panic: ${state.sentiment.PanicLevel}/100 | Healthcare load: ${100 - state.systems.HealthcareCapacity}/100`,
        tiles: [
          ["Rapid Response", `Special units deployed: ${state.military.specialForces.deployed}<br>Readiness: ${state.military.specialForces.readiness}/100<br>National security: ${state.stats.NationalSecurity}/100`],
          ["Civil Support", `Healthcare capacity: ${state.systems.HealthcareCapacity}/100<br>Public confidence: ${state.stats.PublicConfidence}/100<br>Communal harmony: ${state.stats.CommunalHarmony}/100`],
          ["Urban Hotspots", hot.map((h) => `${escapeHtml(h.region)}: ${escapeHtml(h.type)}, ${h.severity}/100`).join("<br>") || "No major hotspot registered."],
          ["Response Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate security response window queued."],
          ["Latest Operation", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No open-ended security order executed yet."],
        ],
      },
      infrastructure: {
        alt: "Indian power-grid infrastructure image",
        overlay: `${posture} | Infrastructure integrity: ${state.systems.InfrastructureIntegrity}/100 | Economic pressure: ${state.threats.EconomicPressure}/100 | Cyber pressure: ${state.threats.DisinformationRisk}/100`,
        tiles: [
          ["Grid Integrity", `Infrastructure: ${state.systems.InfrastructureIntegrity}/100<br>Market confidence: ${state.systems.MarketConfidence}/100<br>Healthcare capacity: ${state.systems.HealthcareCapacity}/100`],
          ["Recovery Status", `Supply chains: ${state.systems.SupplyChainIntegrity}/100<br>Rupee strength: ${state.economy.CurrencyValue}/100<br>Stock market: ${state.economy.StockIndex}/100`],
          ["Affected Zones", hot.map((h) => `${escapeHtml(h.region)}: ${escapeHtml(h.type)}, ${h.severity}/100`).join("<br>") || "No major infrastructure hotspot registered."],
          ["Response Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate infrastructure response window queued."],
          ["Latest Operation", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No infrastructure order executed yet."],
        ],
      },
      business: {
        alt: "boAt business case cover",
        overlay: `${posture} | Retailer confidence: ${state.systems.MarketConfidence}/100 | Portfolio strength: ${state.stats.NationalSecurity}/100 | Margin health: ${state.stats.FiscalHealth}/100`,
        tiles: [
          ["Sales & Channels", `Sales momentum: ${state.economy.StockIndex}/100<br>Pricing power: ${state.economy.CurrencyValue}/100<br>Retailer confidence: ${state.systems.MarketConfidence}/100`],
          ["Portfolio & Supply", `Portfolio strength: ${state.stats.NationalSecurity}/100<br>D2C reliability: ${state.systems.InfrastructureIntegrity}/100<br>Manufacturing resilience: ${state.systems.SupplyChainIntegrity}/100`],
          ["Brand & Service Risks", `Brand love: ${state.stats.PublicConfidence}/100<br>Commoditization: ${state.threats.PollutionCrisis}/100<br>Warranty backlog: ${state.systems.RefugeePressure}/100`],
          ["Next Business Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate business response window queued."],
          ["Latest Move", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No open-ended business move executed yet."],
        ],
      },
      strategic: {
        alt: "Strategic response image",
        overlay: `${posture} | Threat load: ${volatility}/100 | National security: ${state.stats.NationalSecurity}/100 | Crisis readiness: ${readiness}/100`,
        tiles: [
          ["Response Assets", `Special forces: ${state.military.specialForces.readiness}/100<br>Air readiness: ${Math.round(averageValues(state.military.airSquadrons.map((sq) => sq.readiness)))}/100<br>Naval readiness: ${Math.round(averageValues(state.military.navalFleets.map((fleet) => fleet.readiness)))}/100`],
          ["System Stress", `Economy: ${state.stats.EconomicStability}/100<br>Diplomacy: ${state.stats.DiplomaticStanding}/100<br>Public confidence: ${state.stats.PublicConfidence}/100`],
          ["Active Hotspots", hot.map((h) => `${escapeHtml(h.region)}: ${escapeHtml(h.type)}, ${h.severity}/100`).join("<br>") || "No major hotspot registered."],
          ["Response Window", responseWindow ? `${escapeHtml(responseWindow.description)}<br>Due: ${formatTime(responseWindow.dueAt)}` : "No immediate response window queued."],
          ["Latest Operation", latestOperation ? `${escapeHtml(latestOperation.time)}<br>${escapeHtml(latestOperation.text)}` : "No open-ended operation executed yet."],
        ],
      },
    };
    const panel = panelMap[ui.operationsRender] || panelMap.strategic;

    els.operationsVisual.innerHTML = `
      <div class="operations-hero">
        <img src="${imageUrl}" alt="${panel.alt}">
        <div class="operations-overlay">
          ${panel.overlay}
        </div>
      </div>
      <div class="operations-grid">
        ${panel.tiles.map(([title, text]) => `<div class="operation-tile"><strong>${title}</strong>${text}</div>`).join("")}
      </div>
    `;
  }

  function decisionPriorityDefinitions() {
    if (isBusinessScenario(state)) {
      return [
        { id: "revenue", label: "Revenue" },
        { id: "margin", label: "Margins" },
        { id: "brand", label: "Brand Trust" },
        { id: "channels", label: "Channels" },
        { id: "operations", label: "Execution" },
        { id: "governance", label: "Board Confidence" },
      ];
    }
    return [
      { id: "security", label: "Security" },
      { id: "economy", label: "Economy" },
      { id: "public", label: "Public Trust" },
      { id: "diplomacy", label: "Diplomacy" },
      { id: "stability", label: "Stability" },
      { id: "legality", label: "Legitimacy" },
    ];
  }

  function optionDelta(option, field, key) {
    return Number(option && option[field] && option[field][key]) || 0;
  }

  function optionMatchesPriority(option, priorityId) {
    const style = String(option.style || "").toLowerCase();
    if (isBusinessScenario(state)) {
      if (priorityId === "revenue") return optionDelta(option, "statsDelta", "EconomicStability") > 0 || optionDelta(option, "economyDelta", "StockIndex") > 0;
      if (priorityId === "margin") return optionDelta(option, "statsDelta", "FiscalHealth") > 0 || optionDelta(option, "threatDelta", "EconomicPressure") < 0 || optionDelta(option, "economyDelta", "CurrencyValue") > 0;
      if (priorityId === "brand") return optionDelta(option, "statsDelta", "PublicConfidence") > 0 || optionDelta(option, "statsDelta", "DiplomaticStanding") > 0 || optionDelta(option, "threatDelta", "DisinformationRisk") < 0;
      if (priorityId === "channels") return optionDelta(option, "systemsDelta", "MarketConfidence") > 0 || optionDelta(option, "statsDelta", "CommunalHarmony") > 0 || /market|brand/.test(style);
      if (priorityId === "operations") return optionDelta(option, "systemsDelta", "SupplyChainIntegrity") > 0 || optionDelta(option, "systemsDelta", "HealthcareCapacity") > 0 || /operations|governance/.test(style);
      if (priorityId === "governance") return /finance|governance|operations/.test(style) || Number(option.legality || 0) >= 0.97;
      return false;
    }
    if (priorityId === "security") return optionDelta(option, "statsDelta", "NationalSecurity") > 0 || optionDelta(option, "threatDelta", "TerrorThreat") < 0;
    if (priorityId === "economy") return optionDelta(option, "statsDelta", "EconomicStability") > 0 || optionDelta(option, "statsDelta", "FiscalHealth") > 0;
    if (priorityId === "public") return optionDelta(option, "statsDelta", "PublicConfidence") > 0 || optionDelta(option, "sentimentDelta", "TrustInGovernment") > 0;
    if (priorityId === "diplomacy") return optionDelta(option, "statsDelta", "DiplomaticStanding") > 0 || style === "diplomatic";
    if (priorityId === "stability") return optionDelta(option, "threatDelta", "BorderTension") < 0 || optionDelta(option, "sentimentDelta", "PanicLevel") < 0;
    if (priorityId === "legality") return Number(option.legality || 0) >= 0.85;
    return false;
  }

  function priorityMatchesForOption(option) {
    const selected = Array.isArray(state.decisionPriorities) ? state.decisionPriorities : [];
    return selected.filter((priorityId) => optionMatchesPriority(option, priorityId));
  }

  function optionEffectEntries(option) {
    const mappings = [
      ["statsDelta", "stats"],
      ["threatDelta", "threats"],
      ["domesticDelta", "domestic"],
      ["sentimentDelta", "sentiment"],
      ["economyDelta", "economy"],
      ["systemsDelta", "systems"],
    ];
    const effects = [];
    mappings.forEach(([field, group]) => {
      Object.entries(option[field] || {}).forEach(([key, rawValue]) => {
        const value = Number(rawValue || 0);
        if (!Number.isFinite(value) || value === 0) return;
        effects.push({
          group,
          key,
          label: getMetricLabel(key),
          value,
          beneficial: isBadMetric(key) ? value < 0 : value > 0,
        });
      });
    });
    return effects;
  }

  function reversibilityForOptions(options) {
    const maxRisk = Math.max(...options.map((option) => Number(option.risk || 0)));
    const styles = options.map((option) => String(option.style || "").toLowerCase());
    if (styles.some((style) => /unethical|overreach|nuclear|decapitation/.test(style)) || maxRisk >= 0.72) return "Low";
    if (maxRisk >= 0.42) return "Moderate";
    return "High";
  }

  function advisorChallengeForOptions(options) {
    const styles = new Set(options.map((option) => String(option.style || "").toLowerCase()));
    const maxRisk = Math.max(...options.map((option) => Number(option.risk || 0)));
    if (maxRisk >= 0.7) return "CFO challenge: What is the stop-loss condition if the first signal turns against us?";
    if (styles.has("finance") || styles.has("pricing")) return "CMO challenge: Will this protect margin without weakening customer preference or channel support?";
    if (styles.has("brand") || styles.has("market")) return "CFO challenge: Which measurable sales or trust signal justifies this spend?";
    if (styles.has("product")) return "Operations challenge: Can service, supply, and quality capacity support this promise?";
    if (styles.has("operations") || styles.has("governance")) return "CEO challenge: How quickly will this operational improvement become visible to customers and investors?";
    if (styles.has("kinetic") || styles.has("nuclear")) return "Security challenge: What prevents this action from creating a larger escalation cycle?";
    if (styles.has("diplomatic")) return "Security challenge: What is the fallback if dialogue does not change adversary behavior?";
    return "Board challenge: What evidence would make you reverse or expand this decision?";
  }

  function renderDecisionPreview() {
    const options = getStructuredOptions(state).filter((option) => selectedOptionIds.has(option.id));
    const visible = options.length > 0;
    els.decisionPreview.classList.toggle("hidden", !visible);
    els.advisorChallenge.classList.toggle("hidden", !visible);
    if (!visible) return;

    const effects = options.flatMap(optionEffectEntries);
    const benefits = effects.filter((effect) => effect.beneficial).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const costs = effects.filter((effect) => !effect.beneficial).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const targets = [...new Set(options.flatMap((option) => option.targets || []))].slice(0, 4);
    const benefitText = benefits.length ? benefits.slice(0, 2).map((effect) => effect.label).join(", ") : "No clear upside signal";
    const costText = costs.length ? costs.slice(0, 2).map((effect) => effect.label).join(", ") : "Limited direct downside";
    els.decisionPreview.innerHTML = `
      <div><span>Likely upside</span><strong>${escapeHtml(benefitText)}</strong></div>
      <div><span>Watch closely</span><strong>${escapeHtml(costText)}</strong></div>
      <div><span>Reversibility</span><strong>${reversibilityForOptions(options)}</strong></div>
      <div><span>Affected</span><strong>${escapeHtml(targets.join(", ") || "Multiple stakeholders")}</strong></div>
    `;
    els.advisorChallenge.innerHTML = `<strong>One-line challenge</strong><span>${escapeHtml(advisorChallengeForOptions(options))}</span>`;
  }

  function reflectionQuestionsFor(review, pending = {}) {
    if (Array.isArray(pending.questions) && pending.questions.length) return pending.questions.slice(0, 3);
    const style = String((review && review.style) || "").toLowerCase();
    return [
      "What outcome were you prioritizing over the available alternatives?",
      style === "finance" || style === "pricing"
        ? "What financial trade-off were you consciously willing to accept?"
        : style === "product" || style === "market" || style === "brand"
          ? "What evidence suggested the organization was ready to support this growth move?"
          : style === "operations" || style === "governance"
            ? "How quickly did you expect this foundation to become visible in business results?"
            : "What downside or second-order effect were you consciously willing to accept?",
    ];
  }

  function renderReflectionPrompt() {
    const pending = state.pendingReflection;
    if (emergencyBlocked()) { els.reflectionPanel.classList.add("hidden"); return; }
    els.reflectionPanel.classList.toggle("hidden", !pending);
    document.body.classList.toggle("experience-open", Boolean(pending) || meetingActive(state));
    if (!pending) {
      els.reflectionInput.value = "";
      delete els.reflectionPanel.dataset.reviewId;
      return;
    }
    const review = (state.decisionReviews || []).find((item) => item.id === pending.reviewId);
    const questions = reflectionQuestionsFor(review, pending);
    els.reflectionPrompt.textContent = pending.prompt || "Why did you choose this direction?";
    els.reflectionDecisionLabel.textContent = pending.decisionTitle;
    els.reflectionQuestionList.innerHTML = questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("");
    if (els.reflectionPanel.dataset.reviewId !== pending.reviewId) {
      els.reflectionInput.value = "";
      els.reflectionPanel.dataset.reviewId = pending.reviewId;
      requestAnimationFrame(() => els.reflectionInput.focus());
    }
  }

  function renderDecisionUtilities() {
    const definitions = decisionPriorityDefinitions();
    const allowed = new Set(definitions.map((item) => item.id));
    state.decisionPriorities = (Array.isArray(state.decisionPriorities) ? state.decisionPriorities : []).filter((id) => allowed.has(id)).slice(0, 3);
    els.prioritySummary.textContent = `${state.decisionPriorities.length}/3 pinned`;
    els.priorityPicker.innerHTML = definitions.map((item) => `
      <button type="button" class="priority-chip ${state.decisionPriorities.includes(item.id) ? "active" : ""}" data-priority-id="${item.id}">${escapeHtml(item.label)}</button>
    `).join("");

    renderReflectionPrompt();
    renderDecisionPreview();
  }

  function renderOptions() {
    const options = getDynamicOptions(state).map((option) => ({ ...option, priorityMatches: priorityMatchesForOption(option), effects: optionEffectEntries(option) }));
    const groups = window.SecondOrderWorkspaces.groupOptions(options);
    if (!groups.some(([domain]) => domain === deskView.category)) deskView.category = groups[0]?.[0];
    if (deskView.category) deskView.visited.add(deskView.category);
    const markup = window.SecondOrderWorkspaces.renderDesk({ options, selectedIds: [...selectedOptionIds], activeCategory: deskView.category, compare: deskView.compare, visited: [...deskView.visited] });
    if (markup === lastDeskMarkup) return;
    const openDetails = [...els.optionsWrap.querySelectorAll("details[open][data-option-details]")].map((node) => node.dataset.optionDetails);
    const focusedId = els.optionsWrap.contains(document.activeElement) ? document.activeElement.dataset.optionId : null;
    els.optionsWrap.innerHTML = markup;
    lastDeskMarkup = markup;
    els.optionsWrap.querySelectorAll("[data-option-details]").forEach((node) => { node.open = openDetails.includes(node.dataset.optionDetails); });
    if (focusedId) [...els.optionsWrap.querySelectorAll("[data-option-id]")].find((node) => node.dataset.optionId === focusedId)?.focus({ preventScroll: true });
  }

  function saveDecisionReflection() {
    const pending = state.pendingReflection;
    if (!pending) return;
    const text = els.reflectionInput.value.trim();
    if (!text) {
      setStatus("Add a response before submitting it to the board.", true);
      return;
    }
    const review = (state.decisionReviews || []).find((item) => item.id === pending.reviewId);
    const questions = reflectionQuestionsFor(review, pending);
    if (review) review.reflection = text;
    if (!Array.isArray(state.reflections)) state.reflections = [];
    state.reflections.push({
      reviewId: pending.reviewId,
      decisionTitle: pending.decisionTitle,
      contextType: pending.contextType || "decision",
      prompt: pending.prompt || "Why did you choose this direction?",
      questions,
      selectedChoice: pending.selectedChoice || pending.decisionTitle,
      choiceDetails: pending.choiceDetails || "",
      emergencyStartedAt: pending.emergencyStartedAt || null,
      emergencyTitle: pending.emergencyTitle || "",
      emergencyBrief: pending.emergencyBrief || "",
      text,
      time: new Date().toISOString(),
    });
    state.reflections = state.reflections.slice(-30);
    state.pendingReflection = null;
    saveState();
    renderAll();
    setStatus("Reflection saved to the final learning assessment.");
  }

  function queueEmergencyReflection(crisis, choice, choiceType) {
    if (!crisis || !choice || state.pendingReflection) return;
    const alreadyCaptured = (state.reflections || []).some((item) => item.contextType === "emergency" && item.emergencyStartedAt === crisis.startedAt);
    if (alreadyCaptured) return;
    state.pendingReflection = {
      reviewId: `emergency-${crisis.startedAt || Date.now()}-${choice.id || "choice"}`,
      decisionTitle: choice.title || "Emergency response",
      contextType: "emergency",
      prompt: "The board wants to know why you made this emergency choice.",
      questions: [
        "What immediate risk were you trying to contain?",
        "Why was this response stronger than the available alternatives?",
        "What second-order consequence or stakeholder reaction did you anticipate?",
      ],
      selectedChoice: choice.title || "Emergency response",
      choiceDetails: `${choiceType || "Emergency action"}: ${choice.note || "No decision note recorded."}`,
      emergencyStartedAt: crisis.startedAt || null,
      emergencyTitle: crisis.title || "Emergency situation",
      emergencyBrief: crisis.brief || "",
      createdAt: new Date().toISOString(),
    };
  }

  function renderCovertOps() {
    els.covertOpsList.innerHTML = getCovertOpsTemplates(state)
      .map((op) => `
        <article class="option">
          <div class="option-head"><strong>${op.name}</strong></div>
          <div class="meta">Success chance: ${op.success}% | Exposure risk: ${op.exposure}%</div>
          <button class="ghost covert-btn" data-covert-id="${op.id}">Launch Operation</button>
        </article>
      `)
      .join("");

    els.covertOpsList.querySelectorAll(".covert-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const opId = btn.getAttribute("data-covert-id");
        launchCovertOperation(opId);
      });
    });
  }

  function renderIntel() {
    els.intelConfidenceBadge.textContent = `Confidence: ${state.intelligence.confidence}%`;
    els.intelBriefing.innerHTML = state.intelligence.reports
      .map((r) => `<div class="item"><strong>${r.section}</strong><br>${r.text}</div>`)
      .join("");
  }

  function renderHeadlines() {
    const view = impactViewSource();
    els.headlineFeed.innerHTML = (view.headlines || [])
      .slice(0, 8)
      .map((h) => `<div class="item"><strong>${h.time}</strong><br>${h.text}</div>`)
      .join("");
  }

  function renderGlobalReactions() {
    const view = impactViewSource();
    const reactions = view.globalReactions || [];
    if (!reactions.length) {
      els.globalReactionFeed.innerHTML = `<div class="item">No major external reactions yet.</div>`;
      return;
    }

    els.globalReactionFeed.innerHTML = reactions
      .slice(0, 10)
      .map((g) => `<div class="item"><strong>${g.time} | ${g.actor}</strong><br>${g.action}</div>`)
      .join("");
  }

  function controversyTrackerHtml(crisis) {
    if (!crisis || !crisis.tracker) return "";
    const rows = [
      ["Outrage Velocity", crisis.tracker.outrage, true],
      ["Media Pressure", crisis.tracker.mediaPressure, true],
      ["Board Panic", crisis.tracker.boardPanic, true],
      ["Boycott Risk", crisis.tracker.boycott, true],
    ];
    return rows.map(([label, value, danger]) => `
      <div class="controversy-metric">
        <div class="controversy-metric-head"><span>${escapeHtml(label)}</span><strong>${clamp(value)}/100</strong></div>
        <div class="controversy-track"><div class="controversy-fill ${danger ? "danger" : ""}" style="width:${clamp(value)}%"></div></div>
      </div>
    `).join("");
  }

  function cleanCrisisClaim(text = "") {
    return String(text || "").replace(/^[^:]{3,80}:\s*/, "").replace(/YouTube Thumbnail:\s*/i, "").replace(/Instagram Reel:\s*/i, "").trim();
  }

  function controversyRiskLine(crisis) {
    if (!crisis || !crisis.tracker) return "The situation requires a credible response before stakeholder trust deteriorates.";
    const heat = averageValues([crisis.tracker.outrage, crisis.tracker.mediaPressure, crisis.tracker.boardPanic, crisis.tracker.boycott]);
    if (heat >= 70) return "High-risk cycle: consumer trust, board confidence, and sales momentum can deteriorate quickly if the response looks defensive.";
    if (heat >= 50) return "Medium-risk cycle: the issue is visible enough to affect brand trust, creator confidence, and retailer conversations.";
    return "Contained but sensitive: a credible response can prevent the issue from becoming a larger reputation story.";
  }

  function mediaCardHtml(kind, label, text) {
    return `<div class="signal-card ${kind}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(text)}</strong></div>`;
  }

  function controversySnapshotCards(crisis) {
    const hashtags = (crisis.hashtags || []).join("  ");
    return [
      mediaCardHtml("signal-what", "What happened", crisis.brief || crisis.title),
      mediaCardHtml("signal-claim", "Claim being amplified", cleanCrisisClaim(crisis.clipping)),
      mediaCardHtml("signal-public", "Public signal", `${cleanCrisisClaim(crisis.tweet)}${hashtags ? ` | ${hashtags}` : ""}`),
      mediaCardHtml("signal-risk", "Business risk", controversyRiskLine(crisis)),
    ].join("");
  }

  function crisisActionButtonHtml({ item, dataAttr, className, used, disabledReason, index = 0 }) {
    const disabled = Boolean(used || disabledReason);
    const reason = disabledReason || (used ? "Used" : "");
    return `<button class="${className}" type="button" ${dataAttr}="${escapeHtml(item.id)}" ${disabled ? "disabled" : ""} title="${escapeHtml(reason || "Available")}"><i class="crisis-choice-index">${index + 1}</i><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.note)}</span>${reason ? `<em class="disabled-reason">${escapeHtml(reason)}</em>` : ""}</button>`;
  }

  function renderEmergencyStrategyRoom() {
    if (!els.emergencyStrategyPanel) return;
    const business = isBusinessScenario(state);
    els.emergencyStrategyPanel.classList.toggle("hidden", !business);
    if (!business) return;
    const crisisState = state.emergencyControversy || blankControversyState();
    const crisis = crisisState.current;
    if (crisis && expireCrisisWindowIfNeeded(state)) saveState();
    if (!crisis) {
      els.strategyRoomBoardroomVisual.classList.remove("crisis-active");
      els.strategyRoomCrisisKicker.textContent = "Situation monitoring";
      els.strategyRoomCrisisTitle.textContent = "Boardroom standing by";
      els.emergencyCrisisBadge.textContent = "Monitoring";
      els.controversyRoomBriefing.textContent = "No viral controversy is active yet. After 2-3 strategic decisions, social and stakeholder risk can break into the simulation without warning.";
      els.controversyTracker.innerHTML = "";
      els.controversyMediaWall.innerHTML = `<div class="item">No active situation snapshot yet.</div>`;
      if (els.crisisControlStrip) els.crisisControlStrip.innerHTML = `<span>Crisis Window: Waiting</span><span>Next Action: Locked</span><span>Statement: ${crisisState.statementIssuedThisSession ? "Issued" : "Available"}</span>`;
      els.controversyResponseOptions.innerHTML = `<div class="item">Crisis-response MCQs unlock when a controversy appears.</div>`;
      if (els.publicStatementOptions) els.publicStatementOptions.innerHTML = `<div class="item">Public statement MCQs unlock during an active controversy.</div>`;
      els.controversyMajorDecisions.innerHTML = `<div class="item">Major strategic calls unlock during an active controversy.</div>`;
      els.controversyLiveFeed.innerHTML = `<div class="item">No emergency updates yet.</div>`;
      if (els.controversyStatementBtn) els.controversyStatementBtn.disabled = true;
      if (els.controversyMeetingBtn) els.controversyMeetingBtn.disabled = true;
      return;
    }

    if (crisis.journey) {
      els.strategyRoomBoardroomVisual.classList.toggle("crisis-active", crisis.journey.phase !== "closed");
      els.strategyRoomCrisisKicker.textContent = "Emergency response record";
      els.strategyRoomCrisisTitle.textContent = crisis.title;
      els.emergencyCrisisBadge.textContent = crisis.journey.outcome || "Active";
      els.controversyRoomBriefing.textContent = crisis.resolution || crisis.brief;
      els.controversyTracker.innerHTML = controversyTrackerHtml(crisis);
      els.controversyMediaWall.innerHTML = `<div class="item">${escapeHtml(crisis.journey.outcome ? "The response window is closed. Its effects are included in Scorecards." : "Use the active emergency window to respond.")}</div>`;
      els.crisisControlStrip.innerHTML = "";
      els.controversyResponseOptions.innerHTML = `<div class="item">${crisis.journey.actions.length} responses recorded. Choices are available only inside the timed response window.</div>`;
      els.publicStatementOptions.innerHTML = `<div class="item">${crisis.statementReleased ? "Public statement recorded." : "No public statement issued."}</div>`;
      els.controversyMajorDecisions.innerHTML = "";
      els.controversyLiveFeed.innerHTML = (crisis.updates || []).slice(0, 6).map(item => `<div class="item">${escapeHtml(item.text)}</div>`).join("");
      els.controversyMeetingBtn.disabled = true;
      return;
    }

    const windowMs = remainingMs(crisisState.responseEndsAt);
    const cooldownMs = crisisActionCooldownMs(crisisState);
    const windowOpen = crisisWindowOpen(crisisState);
    const commonDisabledReason = crisisActionDisabledReason(crisisState);
    if (els.controversyStatementBtn) els.controversyStatementBtn.disabled = true;
    if (els.controversyMeetingBtn) els.controversyMeetingBtn.disabled = !crisisState.active;
    els.emergencyCrisisBadge.textContent = crisisState.active
      ? (windowOpen ? `Crisis Window ${formatCountdown(windowMs)}` : "Crisis Window Closed")
      : "Contained";
    els.strategyRoomBoardroomVisual.classList.add("crisis-active");
    els.strategyRoomCrisisKicker.textContent = crisisState.active ? "Emergency protocol active" : "Incident contained";
    els.strategyRoomCrisisTitle.textContent = crisis.title;
    els.controversyRoomBriefing.innerHTML = `
      <strong>${escapeHtml(crisis.title)}</strong><br>
      ${escapeHtml(crisis.brief)}<br>
      <span class="mini-note">Source: ${escapeHtml(crisis.sourceDecision || "recent decision")} | ${escapeHtml(controversyStatusText(crisis))}</span>
    `;
    els.controversyTracker.innerHTML = controversyTrackerHtml(crisis);
    els.controversyMediaWall.innerHTML = controversySnapshotCards(crisis);
    if (els.crisisControlStrip) {
      els.crisisControlStrip.innerHTML = [
        `<span><strong>Crisis Window:</strong> ${windowOpen ? formatCountdown(windowMs) : "Closed"}</span>`,
        `<span><strong>Next Action:</strong> ${windowOpen ? (cooldownMs > 0 ? formatCountdown(cooldownMs) : "Ready") : "Closed"}</span>`,
        `<span><strong>Statement:</strong> ${crisisState.statementIssuedThisSession ? "Issued" : "Available"}</span>`,
      ].join("");
    }
    els.controversyResponseOptions.innerHTML = (crisis.responses || []).map((item, index) => {
      const used = (crisis.usedResponses || []).includes(item.id);
      const reason = crisisActionDisabledReason(crisisState, used, "Used");
      return crisisActionButtonHtml({ item, dataAttr: "data-crisis-response", className: "crisis-option", used, disabledReason: reason, index });
    }).join("");
    if (els.publicStatementOptions) {
      els.publicStatementOptions.innerHTML = publicStatementOptions().map((item, index) => {
        const issued = crisisState.statementIssuedThisSession || crisis.statementReleased;
        const selected = crisisState.statementChoiceId === item.id || crisis.statementChoiceId === item.id;
        const reason = issued
          ? (selected ? "Issued" : "Statement already issued")
          : commonDisabledReason;
        return crisisActionButtonHtml({ item, dataAttr: "data-statement-choice", className: "crisis-option statement-option", used: selected, disabledReason: reason, index });
      }).join("");
    }
    els.controversyMajorDecisions.innerHTML = (crisis.majorDecisions || []).map((item, index) => {
      const used = (crisis.usedMajorDecisions || []).includes(item.id);
      const reason = crisisActionDisabledReason(crisisState, used, "Used");
      return crisisActionButtonHtml({ item, dataAttr: "data-major-decision", className: "major-decision", used, disabledReason: reason, index });
    }).join("");
    const feed = (crisis.updates || []).length ? crisis.updates : [{ time: formatTime(state.clock), text: "Emergency room opened. Awaiting first response.", level: "update" }];
    els.controversyLiveFeed.innerHTML = feed.slice(0, 12).map((item) => `<div class="item"><strong>${escapeHtml(item.time)} | ${escapeHtml(item.level || "update")}</strong><br>${escapeHtml(item.text)}</div>`).join("");
  }
  function renderControversyModal() {
    if (!els.controversyModal) return;
    if (window.SecondOrderEmergencyFlow.journey(state)) { els.controversyModal.classList.add("hidden"); return; }
    const crisisState = state.emergencyControversy || blankControversyState();
    const crisis = crisisState.current;
    const open = Boolean(crisisState.popupOpen && crisis);
    els.controversyModal.classList.toggle("hidden", !open);
    if (!open) {
      els.crisisTransition.classList.add("hidden");
      els.controversyModalCard.classList.remove("hidden");
      return;
    }
    els.crisisTransition.classList.toggle("hidden", !crisisEntering);
    els.controversyModalCard.classList.toggle("hidden", crisisEntering);
    if (crisisEntering && !crisisTransitionTimer) {
      crisisTransitionTimer = window.setTimeout(() => {
        crisisEntering = false;
        crisisTransitionTimer = null;
        els.crisisTransition.classList.add("hidden");
        els.controversyModalCard.classList.remove("hidden");
      }, 1450);
    }
    els.controversyModalKicker.textContent = crisis.kicker || "Emergency Alert";
    els.controversyModalTitle.textContent = crisis.title;
    els.controversyModalSeverity.textContent = `Severity ${crisis.severity}/100`;
    els.controversyNewspaper.className = "signal-card signal-what";
    els.controversyTweet.className = "signal-card signal-claim";
    els.controversyVideo.className = "crisis-live-footage";
    els.controversyReel.className = "signal-card signal-risk";
    els.controversyNewspaper.innerHTML = `<span>What happened</span><strong>${escapeHtml(crisis.brief || crisis.title)}</strong>`;
    els.controversyTweet.innerHTML = `<span>Claim being amplified</span><strong>${escapeHtml(cleanCrisisClaim(crisis.clipping))}</strong>`;
    els.controversyVideo.innerHTML = `<span class="live-chip"><i></i> Live signal</span><strong>${escapeHtml(cleanCrisisClaim(crisis.video || crisis.tweet))}</strong><small>${escapeHtml((crisis.hashtags || []).join("  "))}</small><span class="footage-progress"><i></i></span>`;
    els.controversyReel.innerHTML = `<span>Business risk</span><strong>${escapeHtml(controversyRiskLine(crisis))}</strong>`;
    els.controversyModalSentiment.innerHTML = [
      ["Outrage", crisis.tracker.outrage],
      ["Media", crisis.tracker.mediaPressure],
      ["Board", crisis.tracker.boardPanic],
      ["Boycott", crisis.tracker.boycott],
    ].map(([label, value]) => `<div class="sentiment-pill"><span>${escapeHtml(label)}</span><strong>${clamp(value)}/100</strong></div>`).join("");
  }
  function renderLeadership() {
    const view = impactViewSource();
    const snapshot = activePreDecisionSnapshot();
    if (state.dismissed && !snapshot) {
      els.leadershipBadge.textContent = "Leadership: Removed";
      els.leadershipCard.textContent = state.dismissalReason || "Leadership removed from office.";
      return;
    }
    const leadershipValue = Number.isFinite(view.leadership) ? view.leadership : state.leadership;
    const uiLabels = getScenarioUi(state).labels || {};
    els.leadershipBadge.textContent = `${uiLabels.leadershipBadge || "Leadership"}: ${leadershipValue}/100${snapshot ? " before" : ""}`;
    if (isBusinessScenario(state)) {
      let mood = "Management position is currently stable.";
      if (leadershipValue < 55) mood = "Management is under visible board and investor stress.";
      if (leadershipValue < 35) mood = "CEO, category-head, or CFO replacement pressure is high.";
      els.leadershipCard.textContent = `${mood}\n${snapshot ? `Before-decision comparison active. Current leadership is ${state.leadership}/100.\n` : ""}Margin health, category focus, brand love, service quality, channel confidence, and IPO-readiness are shaping this score.`;
      return;
    }
    let mood = "Leadership position is currently stable.";
    if (leadershipValue < 55) mood = "Leadership position is under visible stress.";
    if (leadershipValue < 35) mood = "Leadership crisis risk is high: cabinet revolt/election pressure rising.";

    els.leadershipCard.textContent = `${mood}\n${snapshot ? `Before-decision comparison active. Current leadership is ${state.leadership}/100.\n` : ""}Decision speed, economic performance, military outcomes, and domestic stability are shaping this score.`;
  }

  function renderToleranceMeter() {
    const maximum = toleranceMaximum(state);
    const load = clamp(state.toleranceLoad || 0, 0, maximum);
    const percent = tolerancePercent(state);
    const strikes = state.redLineViolations || 0;
    const retaliationContext = state.strategicAttackOnIndia && simWindowActive(state, state.justifiedRetaliationUntil);
    els.toleranceTitle.textContent = isBusinessScenario(state) ? "Board tolerance" : "Tolerance load";
    els.toleranceLabel.textContent = `${load}/${maximum}`;
    els.toleranceBar.style.width = `${percent}%`;
    els.toleranceBar.classList.toggle("warning", percent >= 60 && percent < 85);
    els.toleranceBar.classList.toggle("critical", percent >= 85);
    if (state.dismissed) {
      els.toleranceNote.textContent = "Terminated";
      return;
    }
    if (retaliationContext) {
      els.toleranceNote.textContent = "Retaliation context active";
      return;
    }
    els.toleranceNote.textContent = isBusinessScenario(state) ? `Trust violations ${strikes}/3` : `Red-line strikes ${strikes}/3`;
  }

  function renderDecisionPacing() {
    const analysisMs = remainingMs(state.analysisWindowEndsAt);
    const sessionStarted = Boolean(state.onboardingComplete && state.sessionEndsAt);
    const sessionMs = sessionStarted ? window.SecondOrderSessionClock.remaining(state) : SESSION_DURATION_MS;
    const totalSessionMs = SESSION_DURATION_MS;
    const pct = Math.max(0, Math.min(1, sessionMs / totalSessionMs));
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct);

    els.sessionMeta.textContent = sessionStarted ? `Session Timer: ${formatCountdown(sessionMs)} remaining` : "Session Timer: Paused for orientation";
    els.sessionTimerLabel.textContent = sessionStarted ? formatCountdown(sessionMs) : "Ready";
    const boardroomPaused = Boolean(state.boardroomClockPause && meetingActive(state));
    if (boardroomPaused) els.sessionMeta.textContent = `Session Timer: ${formatCountdown(sessionMs)} paused during boardroom consultation`;
    els.sessionTimerLabel.title = boardroomPaused ? "Main simulation timer paused during the boardroom meeting" : "Main simulation time remaining";
    if (emergencyBlocked()) {
      els.sessionMeta.textContent = `Session Timer: ${formatCountdown(sessionMs)} paused for emergency response`;
      els.sessionTimerLabel.title = "Main simulation paused until you return from the emergency outcome";
    }
    els.sessionTimerRing.style.strokeDasharray = `${circumference}`;
    els.sessionTimerRing.style.strokeDashoffset = `${offset}`;
    els.sessionTimerRing.style.stroke = sessionMs <= 60 * 1000
      ? "#d65d24"
      : sessionMs <= 2 * 60 * 1000
        ? "#f0b24d"
        : "#1e7a8c";
    renderToleranceMeter();
    els.analysisMeta.textContent = !sessionStarted
      ? "Orientation active. The timer and decision engine are paused."
      : analysisMs > 0
      ? (isBusinessScenario(state)
          ? `Business decision cooldown active: ${formatCountdown(analysisMs)} before the next decision`
          : `Analysis window active: ${formatCountdown(analysisMs)} before another major decision`)
      : (isBusinessScenario(state)
          ? "Business decision channel open. Next move will trigger a 40-second cooldown."
          : "Decision channel open. No active analysis window.");

    const meetingOpen = meetingActive(state);
    els.boardroomMeetingNavTitle.textContent = isBusinessScenario(state) ? "Boardroom Meeting" : "Emergency Meeting";
    els.boardroomMeetingNavBtn.classList.toggle("live", meetingOpen);
    els.boardroomMeetingNavBtn.classList.toggle("used", state.meetingUsed && !meetingOpen);
    if (!sessionStarted) {
      els.boardroomMeetingNavState.textContent = "Available after orientation";
      els.boardroomMeetingNavBadge.textContent = "Locked";
      els.boardroomMeetingNavBtn.disabled = true;
    } else if (meetingOpen) {
      els.boardroomMeetingNavState.textContent = `${formatCountdown(remainingMs(state.meetingEndsAt))} consultation in progress`;
      els.boardroomMeetingNavBadge.textContent = "Live";
      els.boardroomMeetingNavBtn.disabled = false;
    } else if (state.meetingUsed) {
      els.boardroomMeetingNavState.textContent = "Consultation already used";
      els.boardroomMeetingNavBadge.textContent = "Used";
      els.boardroomMeetingNavBtn.disabled = true;
    } else if (sessionExpired(state)) {
      els.boardroomMeetingNavState.textContent = "Unavailable after session end";
      els.boardroomMeetingNavBadge.textContent = "Closed";
      els.boardroomMeetingNavBtn.disabled = true;
    } else {
      els.boardroomMeetingNavState.textContent = "3-minute consultation · one use";
      els.boardroomMeetingNavBadge.textContent = "Open";
      els.boardroomMeetingNavBtn.disabled = false;
    }
    els.executeBtn.disabled = analysisMs > 0 || sessionExpired(state) || meetingOpen || emergencyBlocked();
    if (emergencyBlocked()) els.boardroomMeetingNavBtn.disabled = true;
    if (els.executeMilitaryOperationBtn) {
      els.executeMilitaryOperationBtn.disabled = (isBusinessScenario(state) && analysisMs > 0) || sessionExpired(state) || meetingOpen || emergencyBlocked();
    }

    if (sessionExpired(state)) {
      els.analysisMeta.textContent = state.dismissed
        ? "Simulation terminated: leadership removed from office."
        : "Session timer expired. Reload or relaunch the simulation to continue.";
    }
  }

  function renderOutcomeSummary() {
    els.outcomeSummary.textContent = state.outcomeSummary || "Decision summary will appear here after you act.";
  }

  function renderOutcomeText() {
    els.outcome.textContent = state.outcomeText || "No decision executed yet.";
  }

  function averageValues(values) {
    const safe = values.filter((value) => Number.isFinite(value));
    if (!safe.length) return 0;
    return safe.reduce((sum, value) => sum + value, 0) / safe.length;
  }

  function computeSessionScore(stateObj) {
    if (stateObj.dismissed) return 0;
    const metrics = stateObj.decisionMetrics;
    const total = metrics.total;
    const initial = baseState(stateObj.scenarioId || DEFAULT_SCENARIO_ID);
    const expectedDecisions = Math.max(1, getScenarioUi(stateObj).expectedDecisions || 3);

    const positionScore = averageValues([
      stateObj.stats.NationalSecurity,
      stateObj.stats.EconomicStability,
      stateObj.stats.DiplomaticStanding,
      stateObj.stats.PublicConfidence,
      stateObj.stats.CommunalHarmony,
      stateObj.systems.InfrastructureIntegrity,
      stateObj.systems.MarketConfidence,
      stateObj.leadership,
    ]);

    const pressureScore = averageValues([
      100 - stateObj.threats.BorderTension,
      100 - stateObj.threats.TerrorThreat,
      100 - stateObj.threats.EconomicPressure,
      100 - stateObj.sentiment.PanicLevel,
      100 - stateObj.domestic.ProtestRisk,
      100 - stateObj.sentiment.CommunalTension,
      stateObj.systems.HealthcareCapacity,
    ]);

    const deltaSeries = [
      stateObj.stats.NationalSecurity - initial.stats.NationalSecurity,
      stateObj.stats.EconomicStability - initial.stats.EconomicStability,
      stateObj.stats.DiplomaticStanding - initial.stats.DiplomaticStanding,
      stateObj.stats.PublicConfidence - initial.stats.PublicConfidence,
      stateObj.stats.CommunalHarmony - initial.stats.CommunalHarmony,
      stateObj.systems.InfrastructureIntegrity - initial.systems.InfrastructureIntegrity,
      stateObj.systems.MarketConfidence - initial.systems.MarketConfidence,
      initial.threats.BorderTension - stateObj.threats.BorderTension,
      initial.threats.TerrorThreat - stateObj.threats.TerrorThreat,
      initial.threats.EconomicPressure - stateObj.threats.EconomicPressure,
      initial.sentiment.PanicLevel - stateObj.sentiment.PanicLevel,
      initial.sentiment.CommunalTension - stateObj.sentiment.CommunalTension,
      initial.domestic.ProtestRisk - stateObj.domestic.ProtestRisk,
    ];
    const trendScore = clamp(50 + (averageValues(deltaSeries) * 2.6), 0, 100);

    const discipline = total > 0
      ? averageValues([
          metrics.legalWeight / total,
          100 - Math.min(100, (metrics.riskWeight / total) * 100),
        ])
      : 0;

    const outcomeQuality = total > 0
      ? clamp(
          ((metrics.successCount * 100) + (metrics.partialCount * 65) + (metrics.failureCount * 20)) / total,
          0,
          100
        )
      : 0;

    const engagementScore = clamp((total / expectedDecisions) * 100, 0, 100);
    const unresolvedBurden = averageValues([
      stateObj.threats.BorderTension,
      stateObj.threats.TerrorThreat,
      stateObj.threats.EconomicPressure,
      stateObj.sentiment.PanicLevel,
      stateObj.domestic.ProtestRisk,
      100 - stateObj.systems.InfrastructureIntegrity,
    ]);
    const escalationOverhang = Math.max(0, stateObj.escalationIndex - initial.escalationIndex);
    const inactionPenalty = total === 0 ? 24 : Math.max(0, expectedDecisions - total) * 5;
    const accountabilityPenalty = tolerancePercent(stateObj) * 0.22;
    const meaningfulReflections = (stateObj.reflections || []).filter((item) => String(item.text || "").trim().length > 0).length;
    const reflectionBonus = Math.min(4, meaningfulReflections * 1.25);

    const score = Math.round(
      (positionScore * 0.3) +
      (pressureScore * 0.2) +
      (trendScore * 0.2) +
      (discipline * 0.12) +
      (outcomeQuality * 0.1) +
      (engagementScore * 0.08) -
      (unresolvedBurden * 0.14) -
      (escalationOverhang * 0.35) -
      accountabilityPenalty -
      inactionPenalty +
      reflectionBonus
    );

    return clamp(score, 0, 100);
  }

  function sessionScoreLabel(score) {
    if (score >= 85) return "Exceptional crisis management";
    if (score >= 70) return "Strong crisis management";
    if (score >= 55) return "Mixed performance";
    if (score >= 40) return "Weak performance";
    return "Failed crisis handling";
  }

  function businessScoreLabel(score) {
    if (score >= 85) return "Exceptional business judgment";
    if (score >= 70) return "Strong business judgment";
    if (score >= 55) return "Mixed execution judgment";
    if (score >= 40) return "Weak execution judgment";
    return "Failed business handling";
  }

  function assessmentBand(score) {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Adequate";
    if (score >= 40) return "Weak";
    return "Critical";
  }

  function formatScoreLine(label, score, note) {
    return `<div class="assessment-row"><span>${escapeHtml(label)}</span><strong>${score}/100</strong><em>${escapeHtml(note)}</em></div>`;
  }

  function decisionReviewSummary(stateObj) {
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews : [];
    if (!reviews.length) return "No recorded decisions. The crisis compounded without meaningful intervention.";
    return reviews
      .slice(-5)
      .map((item, index) => `${index + 1}. ${item.time || "n/a"} - ${item.title || "Decision"} (${item.style || "mixed"}, risk ${item.risk}/100, legality ${item.legality}/100, outcome ${item.outcome})`)
      .join("\n");
  }

  function assessmentImpactEvidence(change) {
    if (!change) return "no single parameter dominated the recorded effect";
    const sign = change.delta > 0 ? "+" : "";
    return `${change.label} ${sign}${change.delta}`;
  }

  function renderBehaviorProfile(assessment) {
    if (!assessment.total) return `<span>${escapeHtml(assessment.profileSummary)}</span>`;
    return `
      <div class="learning-review">
        <p><strong>${escapeHtml(assessment.profile)}</strong>: ${escapeHtml(assessment.profileSummary)}</p>
        <p><strong>Evidence confidence:</strong> ${escapeHtml(assessment.confidenceNote)} This describes choices made in this run, not the participant's personality.</p>
        <ul>
          <li><strong>Decision quality:</strong> ${assessment.avgQuality}/100 average across outcome, credibility, risk control, and recorded parameter movement.</li>
          <li><strong>Consistency:</strong> ${escapeHtml(assessment.consistency.label)}. ${escapeHtml(assessment.consistency.note)}</li>
          <li><strong>Adaptability:</strong> ${escapeHtml(assessment.adaptability.label)}. ${escapeHtml(assessment.adaptability.note)}</li>
          <li><strong>Trade-off control:</strong> ${escapeHtml(assessment.tradeoffAwareness.label)}. ${escapeHtml(assessment.tradeoffAwareness.note)}</li>
          <li><strong>Sequencing:</strong> ${escapeHtml(assessment.sequence.label)}. ${escapeHtml(assessment.sequence.note)}</li>
        </ul>
      </div>
    `;
  }

  function renderNextRunPriorities(assessment) {
    const priorities = (assessment.recommendations || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<div class="learning-review"><p>These are generated from the weakest observed patterns in this run.</p><ul>${priorities}</ul></div>`;
  }

  function buildLearningReview(stateObj, assessment) {
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews : [];
    if (!reviews.length) {
      return {
        html: `<span>No major decisions were taken. Core learning: inaction is also a decision; pressure timers, public confidence, markets, and adversary/stakeholder behavior keep moving even when the user does nothing.</span>`,
      };
    }

    const framework = isBusinessScenario(stateObj)
      ? "Framework used: STP, 4Ps, unit economics, brand equity, channel discipline, and After Action Review."
      : "Framework used: OODA Loop, PMESII-PT, DIME-FIL, Cynefin fit, and After Action Review.";
    const strongest = assessment.strongest;
    const costliest = assessment.costliest;
    const costlyLabel = costliest.topHarm ? "Costliest move" : "Least effective move";

    return {
      html: `
        <div class="learning-review">
          <p>${framework}</p>
          <h4>Strongest Move</h4>
          <p><strong>${escapeHtml(strongest.time)} - ${escapeHtml(strongest.title)}</strong>: quality ${strongest.quality}/100, outcome ${escapeHtml(strongest.outcome)}. Main recorded benefit: ${escapeHtml(assessmentImpactEvidence(strongest.topBenefit))}${strongest.topHarm ? `. Main cost: ${escapeHtml(assessmentImpactEvidence(strongest.topHarm))}` : ""}.</p>
          <h4>${costlyLabel}</h4>
          <p><strong>${escapeHtml(costliest.time)} - ${escapeHtml(costliest.title)}</strong>: quality ${costliest.quality}/100, outcome ${escapeHtml(costliest.outcome)}. ${costliest.topHarm ? `Main recorded cost: ${escapeHtml(assessmentImpactEvidence(costliest.topHarm))}` : "No material harmful parameter movement was recorded"}${costliest.topBenefit ? `. Offset by: ${escapeHtml(assessmentImpactEvidence(costliest.topBenefit))}` : ""}.</p>
          <p><strong>Core learning:</strong> ${escapeHtml((assessment.recommendations || ["Define success and stop-loss thresholds before each major move."])[0])}</p>
        </div>
      `,
    };
  }

  function computeMumbaiFrameworkAssessment(stateObj) {
    const metrics = stateObj.decisionMetrics;
    const total = metrics.total || 0;
    const reflectionScore = total
      ? Math.round(clamp(((stateObj.decisionReviews || []).filter((review) => String(review.reflection || "").trim().length > 0).length / total) * 100))
      : 0;
    const initial = baseState(stateObj.scenarioId || DEFAULT_SCENARIO_ID);
    const expectedDecisions = Math.max(1, getScenarioUi(stateObj).expectedDecisions || 3);
    const avgLegality = total ? Math.round(metrics.legalWeight / total) : 0;
    const avgRisk = total ? Math.round((metrics.riskWeight / total) * 100) : 100;
    const outcomeQuality = total
      ? Math.round(clamp(((metrics.successCount * 100) + (metrics.partialCount * 65) + (metrics.failureCount * 20)) / total, 0, 100))
      : 0;
    const engagementScore = Math.round(clamp((total / expectedDecisions) * 100, 0, 100));
    const diversityCount = [
      metrics.aggressive,
      metrics.diplomatic,
      metrics.domestic,
      metrics.economic,
      metrics.informational,
    ].filter((value) => value > 0).length;
    const diversityScore = Math.round(clamp((diversityCount / 5) * 100 - Math.max(0, metrics.aggressive - 2) * 8, 0, 100));
    const redLinePenalty = Math.min(45, tolerancePercent(stateObj) * 0.45);
    const trendDeltas = [
      stateObj.stats.NationalSecurity - initial.stats.NationalSecurity,
      stateObj.stats.EconomicStability - initial.stats.EconomicStability,
      stateObj.stats.DiplomaticStanding - initial.stats.DiplomaticStanding,
      stateObj.stats.PublicConfidence - initial.stats.PublicConfidence,
      stateObj.stats.CommunalHarmony - initial.stats.CommunalHarmony,
      initial.threats.TerrorThreat - stateObj.threats.TerrorThreat,
      initial.threats.BorderTension - stateObj.threats.BorderTension,
      initial.sentiment.PanicLevel - stateObj.sentiment.PanicLevel,
      initial.domestic.ProtestRisk - stateObj.domestic.ProtestRisk,
    ];
    const trendScore = Math.round(clamp(50 + averageValues(trendDeltas) * 2.4, 0, 100));

    const oodaObserve = clamp(engagementScore + metrics.informational * 10 + metrics.domestic * 5 - (total ? 0 : 35), 0, 100);
    const oodaOrient = clamp((avgLegality * 0.5) + ((100 - avgRisk) * 0.35) + (diversityScore * 0.15), 0, 100);
    const oodaDecide = clamp(engagementScore - redLinePenalty + (metrics.diplomatic + metrics.domestic + metrics.informational) * 4, 0, 100);
    const oodaAct = clamp(outcomeQuality * 0.65 + trendScore * 0.35 - redLinePenalty * 0.5, 0, 100);
    const oodaScore = Math.round(averageValues([oodaObserve, oodaOrient, oodaDecide, oodaAct]));

    const pmesii = {
      Politics: Math.round(averageValues([stateObj.stats.PublicConfidence, 100 - stateObj.domestic.ProtestRisk, stateObj.leadership])),
      Military: Math.round(averageValues([stateObj.stats.NationalSecurity, stateObj.stats.MilitaryReadiness, 100 - stateObj.threats.BorderTension, 100 - stateObj.threats.TerrorThreat])),
      Economy: Math.round(averageValues([stateObj.stats.EconomicStability, stateObj.stats.FiscalHealth, stateObj.systems.MarketConfidence, 100 - stateObj.threats.EconomicPressure])),
      Society: Math.round(averageValues([stateObj.stats.CommunalHarmony, stateObj.sentiment.TrustInGovernment, 100 - stateObj.sentiment.PanicLevel, 100 - stateObj.sentiment.CommunalTension])),
      Information: Math.round(averageValues([100 - stateObj.threats.DisinformationRisk, stateObj.sentiment.TrustInGovernment, stateObj.stats.PublicConfidence])),
      Infrastructure: Math.round(averageValues([stateObj.systems.InfrastructureIntegrity, stateObj.systems.HealthcareCapacity, stateObj.systems.SupplyChainIntegrity])),
      Environment: Math.round(averageValues([stateObj.stats.AirQuality, 100 - stateObj.threats.PollutionCrisis])),
      Time: Math.round(clamp(engagementScore - Math.max(0, expectedDecisions - total) * 12, 0, 100)),
    };
    const pmesiiScore = Math.round(averageValues(Object.values(pmesii)));

    const dimeScores = {
      Diplomacy: Math.round(clamp(metrics.diplomatic * 34 + stateObj.stats.DiplomaticStanding * 0.35, 0, 100)),
      Information: Math.round(clamp(metrics.informational * 34 + (100 - stateObj.threats.DisinformationRisk) * 0.35, 0, 100)),
      Military: Math.round(clamp(metrics.aggressive * 28 + stateObj.stats.MilitaryReadiness * 0.25 - Math.max(0, metrics.aggressive - 2) * 16, 0, 100)),
      Economy: Math.round(clamp(metrics.economic * 34 + stateObj.stats.EconomicStability * 0.35, 0, 100)),
      Finance: Math.round(clamp(metrics.economic * 28 + stateObj.stats.FiscalHealth * 0.45, 0, 100)),
      Intelligence: Math.round(clamp(metrics.informational * 28 + (100 - stateObj.threats.TerrorThreat) * 0.35, 0, 100)),
      Law: Math.round(clamp(metrics.domestic * 34 + avgLegality * 0.45, 0, 100)),
    };
    const dimeScore = Math.round(averageValues(Object.values(dimeScores)));

    const chaoticPressure = averageValues([
      stateObj.threats.TerrorThreat,
      stateObj.sentiment.PanicLevel,
      stateObj.threats.BorderTension,
      stateObj.escalationIndex,
    ]);
    const complexPressure = averageValues([
      stateObj.threats.EconomicPressure,
      stateObj.threats.DisinformationRisk,
      stateObj.domestic.ProtestRisk,
    ]);
    const cynefinFit = Math.round(clamp(
      (chaoticPressure > 70 ? metrics.domestic * 18 + metrics.informational * 16 + metrics.aggressive * 8 : diversityScore * 0.7) +
      (complexPressure > 60 ? metrics.diplomatic * 14 + metrics.economic * 14 + metrics.informational * 10 : 20) +
      avgLegality * 0.25 -
      redLinePenalty,
      0,
      100
    ));

    const aarScore = Math.round(clamp(
      outcomeQuality * 0.3 +
      trendScore * 0.25 +
      avgLegality * 0.2 +
      diversityScore * 0.15 +
      engagementScore * 0.1 -
      redLinePenalty,
      0,
      100
    ));

    const weakestPmesii = Object.entries(pmesii).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([key, value]) => `${key} ${value}/100`).join(", ");
    const strongestDime = Object.entries(dimeScores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key, value]) => `${key} ${value}/100`).join(", ");
    const overall = Math.round(averageValues([oodaScore, pmesiiScore, dimeScore, cynefinFit, aarScore]));

    return {
      overall,
      competencies: [
        {
          label: "Strategic Judgment",
          score: Math.round(averageValues([oodaOrient, oodaDecide, cynefinFit])),
          note: "Quality of framing, response choice, and fit with the type of crisis.",
          detail: `Orient ${Math.round(oodaOrient)}/100 · Decide ${Math.round(oodaDecide)}/100 · Cynefin fit ${cynefinFit}/100`,
        },
        {
          label: "Systems Understanding",
          score: pmesiiScore,
          note: "Ability to account for political, security, economic, social, and infrastructure effects.",
          detail: `PMESII-PT ${pmesiiScore}/100 · DIME-FIL ${dimeScore}/100`,
        },
        {
          label: "Execution Discipline",
          score: Math.round(averageValues([oodaAct, aarScore, outcomeQuality, reflectionScore])),
          note: "Follow-through, outcome quality, and learning from recorded effects.",
          detail: `Act ${Math.round(oodaAct)}/100 · Outcome quality ${outcomeQuality}/100 · AAR ${aarScore}/100 · Reflection evidence ${reflectionScore}/100`,
        },
        {
          label: "Governance & Risk",
          score: Math.round(averageValues([avgLegality, 100 - avgRisk, oodaObserve])),
          note: "Legitimacy, restraint, evidence gathering, and control of irreversible downside.",
          detail: `Legality ${avgLegality}/100 · Risk control ${100 - avgRisk}/100 · Observe ${Math.round(oodaObserve)}/100`,
        },
      ],
      html: `
        <div class="assessment-stack">
          ${formatScoreLine("OODA Loop", oodaScore, `${assessmentBand(oodaScore)} decision cycle: observe ${Math.round(oodaObserve)}, orient ${Math.round(oodaOrient)}, decide ${Math.round(oodaDecide)}, act ${Math.round(oodaAct)}.`)}
          ${formatScoreLine("PMESII-PT", pmesiiScore, `${assessmentBand(pmesiiScore)} systems impact. Weakest national dimensions: ${weakestPmesii}.`)}
          ${formatScoreLine("DIME-FIL", dimeScore, `${assessmentBand(dimeScore)} use of national power. Strongest instruments: ${strongestDime}.`)}
          ${formatScoreLine("Cynefin Fit", cynefinFit, `${assessmentBand(cynefinFit)} match between crisis type and response style.`)}
          ${formatScoreLine("After Action Review", aarScore, `${assessmentBand(aarScore)} learning value based on results, restraint, and second-order effects.`)}
        </div>
      `,
      summary: `Framework score ${overall}/100. The report evaluates choices made inside the simulation only, not the participant as a person.`,
      reviewText: decisionReviewSummary(stateObj),
    };
  }

  function computeBusinessFrameworkAssessment(stateObj) {
    const metrics = stateObj.decisionMetrics;
    const total = metrics.total || 0;
    const reflectionScore = total
      ? Math.round(clamp(((stateObj.decisionReviews || []).filter((review) => String(review.reflection || "").trim().length > 0).length / total) * 100))
      : 0;
    const initial = baseState(stateObj.scenarioId || BUSINESS_SCENARIO_ID);
    const expectedDecisions = Math.max(1, getScenarioUi(stateObj).expectedDecisions || 3);
    const avgCredibility = total ? Math.round(metrics.legalWeight / total) : 0;
    const avgRisk = total ? Math.round((metrics.riskWeight / total) * 100) : 100;
    const outcomeQuality = total
      ? Math.round(clamp(((metrics.successCount * 100) + (metrics.partialCount * 65) + (metrics.failureCount * 20)) / total, 0, 100))
      : 0;
    const engagementScore = Math.round(clamp((total / expectedDecisions) * 100, 0, 100));
    const redLinePenalty = Math.min(45, tolerancePercent(stateObj) * 0.45);
    const disciplineScore = Math.round(clamp(
      avgCredibility * 0.42 +
      (100 - avgRisk) * 0.28 +
      outcomeQuality * 0.18 +
      engagementScore * 0.12 -
      redLinePenalty,
      0,
      100
    ));

    const categoryDepth = Math.round(clamp((metrics.product || 0) * 24 + stateObj.stats.NationalSecurity * 0.35, 0, 100));
    const commercialDepth = Math.round(clamp((metrics.sales || 0) * 22 + stateObj.systems.MarketConfidence * 0.35, 0, 100));
    const financeDepth = Math.round(clamp((metrics.finance || 0) * 24 + stateObj.stats.FiscalHealth * 0.35, 0, 100));
    const trustDepth = Math.round(clamp((metrics.trust || 0) * 24 + stateObj.stats.PublicConfidence * 0.3, 0, 100));
    const focusPenalty = Math.min(32, (metrics.focus || 0) * 8 + (metrics.ethicalRisk || 0) * 15);

    const stpFit = Math.round(clamp(averageValues([
      stateObj.stats.AirQuality,
      stateObj.stats.PublicConfidence,
      stateObj.stats.DiplomaticStanding,
      100 - stateObj.threats.DisinformationRisk,
      commercialDepth,
    ]) - focusPenalty * 0.25, 0, 100));

    const fourPs = {
      Product: Math.round(averageValues([stateObj.stats.NationalSecurity, categoryDepth, 100 - stateObj.threats.PollutionCrisis])),
      Price: Math.round(averageValues([stateObj.stats.FiscalHealth, stateObj.economy.CurrencyValue, 100 - stateObj.threats.EconomicPressure, financeDepth])),
      Place: Math.round(averageValues([stateObj.systems.MarketConfidence, stateObj.systems.InfrastructureIntegrity, stateObj.systems.SupplyChainIntegrity, commercialDepth])),
      Promotion: Math.round(averageValues([stateObj.stats.PublicConfidence, stateObj.stats.AirQuality, 100 - stateObj.threats.DisinformationRisk, trustDepth])),
    };
    const fourPsScore = Math.round(clamp(averageValues(Object.values(fourPs)) - focusPenalty * 0.15, 0, 100));

    const unitEconomics = Math.round(clamp(averageValues([
      stateObj.stats.FiscalHealth,
      stateObj.economy.CurrencyValue,
      stateObj.economy.OilStability,
      stateObj.economy.Inflation,
      100 - stateObj.threats.EconomicPressure,
      financeDepth,
    ]) - Math.max(0, stateObj.economy.Unemployment - initial.economy.Unemployment) * 0.25, 0, 100));

    const brandEquity = Math.round(clamp(averageValues([
      stateObj.stats.PublicConfidence,
      stateObj.stats.DiplomaticStanding,
      stateObj.sentiment.TrustInGovernment,
      stateObj.stats.AirQuality,
      100 - stateObj.threats.DisinformationRisk,
      trustDepth,
    ]) - (metrics.ethicalRisk || 0) * 12, 0, 100));

    const channelStrategy = Math.round(clamp(averageValues([
      stateObj.systems.MarketConfidence,
      stateObj.systems.InfrastructureIntegrity,
      stateObj.systems.SupplyChainIntegrity,
      stateObj.stats.EconomicStability,
      100 - stateObj.domestic.ProtestRisk,
      commercialDepth,
    ]) - Math.max(0, stateObj.threats.EconomicPressure - initial.threats.EconomicPressure) * 0.18, 0, 100));

    const portfolioDiscipline = Math.round(clamp(averageValues([
      stateObj.stats.NationalSecurity,
      stateObj.stats.AirQuality,
      100 - stateObj.threats.PollutionCrisis,
      100 - stateObj.threats.TerrorThreat,
      categoryDepth,
    ]) - (metrics.focus || 0) * 6, 0, 100));

    const executionRiskControl = Math.round(clamp(averageValues([
      stateObj.stats.MilitaryReadiness,
      stateObj.systems.SupplyChainIntegrity,
      stateObj.systems.HealthcareCapacity,
      100 - stateObj.sentiment.PanicLevel,
      100 - stateObj.threats.BorderTension,
      disciplineScore,
    ]) - Math.max(0, stateObj.escalationIndex - initial.escalationIndex) * 0.35, 0, 100));

    const governanceJudgment = Math.round(clamp(averageValues([
      disciplineScore,
      outcomeQuality,
      engagementScore,
      avgCredibility,
      100 - avgRisk,
      100 - tolerancePercent(stateObj),
    ]), 0, 100));

    const fourPsWeakest = Object.entries(fourPs).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([key, value]) => `${key} ${value}/100`).join(", ");
    const strongestBusiness = {
      "Category/Product": categoryDepth,
      "Brand/Trust": trustDepth,
      "Finance/Pricing": financeDepth,
      "Channels/Sales": commercialDepth,
    };
    const strongestLevers = Object.entries(strongestBusiness).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key, value]) => `${key} ${value}/100`).join(", ");
    const overall = Math.round(averageValues([
      stpFit,
      fourPsScore,
      unitEconomics,
      brandEquity,
      channelStrategy,
      portfolioDiscipline,
      executionRiskControl,
      governanceJudgment,
    ]));

    return {
      overall,
      competencies: [
        {
          label: "Strategic Judgment",
          score: Math.round(averageValues([stpFit, portfolioDiscipline, disciplineScore])),
          note: "Clarity of target, portfolio focus, and sequencing of major choices.",
          detail: `STP ${stpFit}/100 · Portfolio ${portfolioDiscipline}/100 · Decision discipline ${disciplineScore}/100`,
        },
        {
          label: "Commercial Understanding",
          score: Math.round(averageValues([fourPsScore, unitEconomics, brandEquity, channelStrategy])),
          note: "Balance across customer value, margins, brand strength, and route to market.",
          detail: `4Ps ${fourPsScore}/100 · Unit economics ${unitEconomics}/100 · Brand ${brandEquity}/100 · Channels ${channelStrategy}/100`,
        },
        {
          label: "Execution Discipline",
          score: Math.round(averageValues([executionRiskControl, outcomeQuality, engagementScore, reflectionScore])),
          note: "Operational follow-through, service readiness, and conversion of choices into results.",
          detail: `Execution control ${executionRiskControl}/100 · Outcome quality ${outcomeQuality}/100 · Participation ${engagementScore}/100 · Reflection evidence ${reflectionScore}/100`,
        },
        {
          label: "Governance & Risk",
          score: governanceJudgment,
          note: "Board-ready credibility, risk control, accountability, and decision safeguards.",
          detail: `Governance judgment ${governanceJudgment}/100 · Credibility ${avgCredibility}/100 · Risk control ${100 - avgRisk}/100`,
        },
      ],
      html: `
        <div class="assessment-stack">
          ${formatScoreLine("STP Fit", stpFit, `${assessmentBand(stpFit)} segmentation-targeting-positioning clarity for boAt's youth, audio, and wearables choices.`)}
          ${formatScoreLine("4Ps Marketing Mix", fourPsScore, `${assessmentBand(fourPsScore)} product-price-place-promotion balance. Weakest mix areas: ${fourPsWeakest}.`)}
          ${formatScoreLine("Unit Economics", unitEconomics, `${assessmentBand(unitEconomics)} margin, pricing power, cash discipline, and discount control.`)}
          ${formatScoreLine("Brand Equity", brandEquity, `${assessmentBand(brandEquity)} brand love, credibility, trust, and dilution control.`)}
          ${formatScoreLine("Channel Strategy", channelStrategy, `${assessmentBand(channelStrategy)} D2C, marketplace, offline retail, and service-channel execution.`)}
          ${formatScoreLine("Portfolio Discipline", portfolioDiscipline, `${assessmentBand(portfolioDiscipline)} audio depth, wearables focus, SKU control, and commoditization risk.`)}
          ${formatScoreLine("Execution Risk Control", executionRiskControl, `${assessmentBand(executionRiskControl)} supply chain, service capacity, team stress, and operational follow-through.`)}
          ${formatScoreLine("Governance Judgment", governanceJudgment, `${assessmentBand(governanceJudgment)} board-ready discipline. Strongest decision levers: ${strongestLevers}.`)}
        </div>
      `,
      summary: `Framework score ${overall}/100. The report evaluates choices made inside the boAt simulation only, not the participant as a person.`,
      reviewText: decisionReviewSummary(stateObj),
    };
  }

  function reportDecisionStory(stateObj) {
    const reviews = (Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews : []).map((review) => ({
      review,
      quality: deterministicLogic.decisionQuality(review),
      impact: deterministicLogic.reviewImpactSummary(review),
    }));
    if (!reviews.length) {
      return `<div class="report-empty">No material decision was recorded. The main lesson is that scenario pressure continued to move during inaction.</div>`;
    }

    const strongest = [...reviews].sort((a, b) => b.quality - a.quality || b.impact.net - a.impact.net)[0];
    const weakest = [...reviews].sort((a, b) => a.quality - b.quality || b.impact.harmful - a.impact.harmful)[0];
    const turning = [...reviews].sort((a, b) => {
      const weight = (item) => (/failure|blowback/i.test(item.review.outcome || "") ? 100 : 0) + item.impact.harmful * 5 + Number(item.review.risk || 0);
      return weight(b) - weight(a);
    })[0];
    const moments = [];
    const addMoment = (role, item, explanation) => {
      if (!item || moments.some((moment) => moment.item.review.id === item.review.id)) return;
      moments.push({ role, item, explanation });
    };
    addMoment("Strongest move", strongest, strongest.impact.topBenefit
      ? `Best recorded benefit: ${assessmentImpactEvidence(strongest.impact.topBenefit)}.`
      : "This produced the strongest combined outcome, credibility, and risk-control score.");
    addMoment("Weakest move", weakest, weakest.impact.topHarm
      ? `Largest recorded cost: ${assessmentImpactEvidence(weakest.impact.topHarm)}.`
      : "This produced the weakest combined decision-quality score.");
    addMoment("Turning point", turning, /failure|blowback/i.test(turning.review.outcome || "")
      ? "This setback created the clearest need to adapt the next decision."
      : "This carried the run's highest combination of risk and second-order pressure.");
    reviews.forEach((item) => addMoment("Key decision", item, "This materially changed the direction of the simulation."));

    return moments.slice(0, 3).map(({ role, item, explanation }, index) => `
      <article class="report-moment">
        <span class="report-moment-index">0${index + 1}</span>
        <div>
          <span class="report-moment-role">${escapeHtml(role)}</span>
          <strong>${escapeHtml(item.review.title || "Decision")}</strong>
          <p>${escapeHtml(item.review.outcome || "Unknown")} outcome · Quality ${item.quality}/100</p>
          <em>${escapeHtml(explanation)}</em>
          ${item.review.reflection ? `<blockquote><span>Your reasoning</span>${escapeHtml(String(item.review.reflection).slice(0, 220))}</blockquote>` : ""}
        </div>
      </article>
    `).join("");
  }

  function reportCompetencyGrid(competencies) {
    return competencies.map((item) => `
      <article class="report-competency">
        <div class="report-competency-head">
          <span>${escapeHtml(item.label)}</span>
          <strong>${item.score}<small>/100</small></strong>
        </div>
        <div class="report-competency-track"><span style="width:${item.score}%"></span></div>
        <p>${escapeHtml(item.note)}</p>
        <details>
          <summary>View underlying measures</summary>
          <span>${escapeHtml(item.detail)}</span>
        </details>
      </article>
    `).join("");
  }

  function reportVisualTrend(stateObj, business) {
    const initial = baseState(stateObj.scenarioId || (business ? BUSINESS_SCENARIO_ID : DEFAULT_SCENARIO_ID));
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews.slice(-7) : [];
    const valueAt = (snapshot) => business
      ? averageValues([
          scorecardMetricValue(snapshot, "stats", "EconomicStability"),
          scorecardMetricValue(snapshot, "stats", "FiscalHealth"),
          scorecardMetricValue(snapshot, "stats", "PublicConfidence"),
          scorecardMetricValue(snapshot, "systems", "MarketConfidence"),
        ])
      : averageValues([
          scorecardMetricValue(snapshot, "stats", "NationalSecurity"),
          scorecardMetricValue(snapshot, "stats", "PublicConfidence"),
          scorecardMetricValue(snapshot, "systems", "InfrastructureIntegrity"),
          100 - scorecardMetricValue(snapshot, "sentiment", "PanicLevel"),
        ]);
    const values = [valueAt(initial), ...reviews.map((review) => valueAt(review.stateAfter || stateObj))];
    if (values.length === 1) values.push(valueAt(stateObj));
    const width = 360;
    const height = 128;
    const points = values.map((value, index) => {
      const x = 14 + (index / Math.max(1, values.length - 1)) * (width - 28);
      const y = 10 + ((100 - clamp(value)) / 100) * (height - 30);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    const dots = points.split(" ").map((point, index) => {
      const [x, y] = point.split(",");
      return `<circle cx="${x}" cy="${y}" r="3.6"><title>${index ? `Decision ${index}` : "Start"}: ${Math.round(values[index])}/100</title></circle>`;
    }).join("");
    return `
      <svg class="report-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Performance trajectory across the simulation">
        <defs><linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#36aeb4" stop-opacity=".28"/><stop offset="1" stop-color="#36aeb4" stop-opacity="0"/></linearGradient></defs>
        <path class="report-chart-grid" d="M14 25H346 M14 57H346 M14 89H346"/>
        <polyline class="report-chart-area" points="14,108 ${points} 346,108"/>
        <polyline class="report-chart-line" points="${points}"/>
        <g class="report-chart-dots">${dots}</g>
      </svg>
      <div class="report-chart-axis"><span>Start</span><span>${reviews.length ? `Decision ${reviews.length}` : "Live"}</span></div>`;
  }

  function compactReportDecisionRows(stateObj) {
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews.slice(-7) : [];
    if (!reviews.length) return `<div class="report-empty">No decisions were recorded.</div>`;
    return reviews.map((review, index) => {
      const quality = deterministicLogic.decisionQuality(review);
      const tone = /success/i.test(review.outcome || "") ? "good" : /failure|blowback/i.test(review.outcome || "") ? "bad" : "mixed";
      return `<div class="report-decision-row ${tone}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(review.title || "Decision")}</strong><small>${escapeHtml(review.outcome || "Recorded")}</small><b>${quality}</b></div>`;
    }).join("");
  }

  function reportEvidenceRows(stateObj) {
    const rows = [];
    (Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews : []).forEach((review, decisionIndex) => {
      (Array.isArray(review.impactLedger) ? review.impactLedger : []).slice(0, 2).forEach((item) => {
        const label = item.label || item.metric || item.key || item.parameter || "Recorded parameter movement";
        const value = Number(item.delta);
        rows.push({ id: `D${decisionIndex + 1}`, label, impact: Number.isFinite(value) ? `${value > 0 ? "+" : ""}${Math.round(value)}` : "Tracked" });
      });
    });
    if (!rows.length) {
      (Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews : []).slice(0, 5).forEach((review, index) => rows.push({ id: `D${index + 1}`, label: review.title || "Decision evidence", impact: review.outcome || "Recorded" }));
    }
    return rows.slice(0, 6).map((row) => `<div class="report-evidence-row"><span>${escapeHtml(row.id)}</span><strong>${escapeHtml(String(row.label))}</strong><small>${escapeHtml(String(row.impact))}</small></div>`).join("") || `<div class="report-empty">Evidence will appear after the first decision.</div>`;
  }

  function renderSessionReport() {
    const metrics = state.decisionMetrics;
    const total = metrics.total;
    const avgCredibility = total ? Math.round(metrics.legalWeight / total) : 0;
    const reflectionCount = (state.decisionReviews || []).filter((review) => String(review.reflection || "").trim().length > 0).length;
    const cumulativeScore = computeSessionScore(state);
    const business = isBusinessScenario(state);
    const scoreLabel = state.dismissed
      ? (business ? "Removed by board" : "Removed from office")
      : (business ? businessScoreLabel(cumulativeScore) : sessionScoreLabel(cumulativeScore));
    const behavior = deterministicLogic.buildBehaviorAssessment(state.decisionReviews, { isBusiness: business });
    const framework = business ? computeBusinessFrameworkAssessment(state) : computeMumbaiFrameworkAssessment(state);
    const recommendations = [...(behavior.recommendations || [])];
    const fallbackActions = business
      ? [
          "Define a measurable commercial objective before selecting the next move.",
          "Set margin, trust, and execution stop-loss thresholds before scaling.",
          "Pair growth choices with a service, supply, or governance safeguard.",
        ]
      : [
          "Define the intended security and public-confidence result before acting.",
          "Set legitimacy and escalation thresholds before irreversible action.",
          "Pair the primary response with a stabilizing diplomatic or domestic lever.",
        ];
    fallbackActions.forEach((item) => {
      if (recommendations.length < 3 && !recommendations.includes(item)) recommendations.push(item);
    });
    const toleranceTitle = business ? "Board tolerance" : "Constitutional tolerance";
    const outcomeMix = total
      ? `${metrics.successCount} success · ${metrics.partialCount} partial · ${metrics.failureCount} failed`
      : "No decisions recorded";
    const verdict = behavior.total
      ? `${behavior.profile}. ${behavior.profileSummary}`
      : "Insufficient decision evidence. This score mainly reflects scenario drift and inaction.";

    const reviews = Array.isArray(state.decisionReviews) ? state.decisionReviews : [];
    const crisisState = state.emergencyControversy || {};
    const emergencies = [...(Array.isArray(crisisState.history) ? crisisState.history : [])];
    if (crisisState.current && !emergencies.includes(crisisState.current)) emergencies.push(crisisState.current);
    const emergencyScore = emergencies.length
      ? Math.round(clamp(100 - averageValues(emergencies.map((item) => Number(item.severity || 50))) * 0.35 - (crisisState.windowExpired ? 22 : 0) + (crisisState.statementIssuedThisSession ? 14 : 0)))
      : 0;
    const meetingRounds = Array.isArray(state.meetingRounds) ? state.meetingRounds : [];
    const boardroomScore = meetingRounds.length ? Math.round(clamp(55 + meetingRounds.length * 9 + Math.min(18, total * 3))) : 0;
    const reflections = reviews.filter((review) => String(review.reflection || "").trim()).slice(-3);
    const strongestCompetency = [...framework.competencies].sort((a, b) => b.score - a.score)[0];
    const developmentCompetency = [...framework.competencies].sort((a, b) => a.score - b.score)[0];

    els.sessionReportContent.innerHTML = `
      <div class="report-capability-strip" aria-label="Assessment characteristics">
        <span><i>◉</i> Real-time decisions</span><span><i>◇</i> Evidence backed</span><span><i>◎</i> Decision insight</span><span><i>▥</i> Development focused</span>
      </div>
      ${state.dismissed ? `<div class="report-alert"><strong>${business ? "Board outcome" : "Constitutional outcome"}</strong><span>${escapeHtml(state.dismissalReason)}</span></div>` : ""}
      <div class="visual-report-grid">
        <section class="visual-report-card report-cover-card">
          <span class="visual-report-index">01</span>
          <span class="report-eyebrow">Performance assessment report</span>
          <h3>${business ? "Live Board Review" : "Crisis Leadership Review"}</h3>
          <p>${escapeHtml(state.roleName || "Decision-maker")} · ${total} recorded decisions</p>
          <div class="cover-boardroom-visual" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <small>${escapeHtml(scoreLabel)}</small>
        </section>

        <section class="visual-report-card report-scorecard-card">
          <span class="visual-report-index">02</span><h4>Executive Scorecard</h4>
          <div class="visual-scorecard-main">
            <div class="report-score-ring compact" style="--report-score:${cumulativeScore * 3.6}deg"><div><strong>${cumulativeScore}</strong><span>/100</span></div></div>
            <div class="report-dimension-list">${framework.competencies.map((item) => `<div><span>${escapeHtml(item.label)}</span><i><b style="width:${item.score}%"></b></i><strong>${item.score}</strong></div>`).join("")}</div>
          </div>
          <div class="report-mini-stats"><span><b>${total}</b> Decisions</span><span><b>${avgCredibility}</b> Credibility</span><span><b>${reflectionCount}</b> Reflections</span></div>
        </section>

        <section class="visual-report-card report-reconstruction-card">
          <span class="visual-report-index">03</span><h4>Case Reconstruction</h4>
          <div class="report-decision-list">${compactReportDecisionRows(state)}</div>
        </section>

        <section class="visual-report-card">
          <span class="visual-report-index">04</span><h4>Performance Over Time</h4>
          ${reportVisualTrend(state, business)}
          <div class="report-callout"><span>Outcome mix</span><strong>${escapeHtml(outcomeMix)}</strong></div>
        </section>

        <section class="visual-report-card">
          <span class="visual-report-index">05</span><h4>Emergency Response Review</h4>
          <div class="report-review-score ${emergencies.length ? "" : "muted"}"><strong>${emergencies.length ? emergencyScore : "—"}</strong><span>${emergencies.length ? "/100" : "No emergency recorded"}</span></div>
          <div class="report-check-grid">
            <span class="${emergencies.length ? "checked" : ""}">Situation recognized</span>
            <span class="${crisisState.statementIssuedThisSession ? "checked" : ""}">Public response issued</span>
            <span class="${!crisisState.windowExpired && emergencies.length ? "checked" : ""}">Acted inside window</span>
          </div>
        </section>

        <section class="visual-report-card">
          <span class="visual-report-index">06</span><h4>Boardroom Question Quality</h4>
          <div class="report-review-score ${meetingRounds.length ? "amber" : "muted"}"><strong>${meetingRounds.length ? boardroomScore : "—"}</strong><span>${meetingRounds.length ? "/100" : "No consultation used"}</span></div>
          <div class="report-question-mix"><i style="--slice:${meetingRounds.length ? 68 : 0}%"></i><p><span>Questions asked <b>${meetingRounds.length}</b></span><span>Evidence-linked <b>${meetingRounds.filter((round) => normalizedRoundResponses(round).some((entry) => entry.evidence.length)).length}</b></span></p></div>
        </section>

        <section class="visual-report-card">
          <span class="visual-report-index">07</span><h4>Reasoning Excerpts</h4>
          <div class="report-quote-stack">${reflections.length ? reflections.map((review) => `<blockquote><span>${escapeHtml(review.title || "Decision reasoning")}</span><p>“${escapeHtml(String(review.reflection).slice(0, 150))}”</p></blockquote>`).join("") : `<div class="report-empty">No written reasoning was captured.</div>`}</div>
        </section>

        <section class="visual-report-card">
          <span class="visual-report-index">08</span><h4>Evidence Citations</h4>
          <div class="report-evidence-table"><div class="head"><span>ID</span><strong>Evidence used</strong><small>Impact</small></div>${reportEvidenceRows(state)}</div>
        </section>

        <section class="visual-report-card report-development-card">
          <span class="visual-report-index">09</span><h4>Recommended Development Plan</h4>
          <div class="development-focus"><span>Focus area</span><strong>${escapeHtml(developmentCompetency ? developmentCompetency.label : "Decision discipline")}</strong><small>Strongest area: ${escapeHtml(strongestCompetency ? strongestCompetency.label : "Not established")}</small></div>
          <ol class="report-actions compact-actions">${recommendations.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </section>
      </div>
      <p class="report-footnote">This assessment evaluates decisions made inside the simulation, not the participant's personality.</p>
    `;
  }

  function scorecardMetricValue(source, group, key) {
    const value = source && source[group] ? Number(source[group][key]) : NaN;
    return Number.isFinite(value) ? clamp(Math.round(value)) : 0;
  }

  function scorecardDelta(current, initial, bad = false) {
    const delta = Math.round(current - initial);
    const beneficial = bad ? delta < 0 : delta > 0;
    return {
      delta,
      beneficial,
      label: delta === 0 ? "No change vs start" : `${delta > 0 ? "+" : ""}${delta} vs start`,
    };
  }

  const BUSINESS_KPI_HELP = {
    "Revenue Momentum": "Shows whether the sales and demand trajectory is strengthening. Compare it with margin and trust before treating growth as healthy.",
    "Margin Health": "Shows how much economic room the company retains after pricing, promotion, product, and operating choices.",
    "Board Confidence": "Reflects whether directors see the strategy as focused, governable, and supported by credible execution.",
    "Consumer Trust": "Reflects confidence in product quality, service, warranty delivery, and the honesty of brand promises.",
  };

  function businessKpiCard(label, value, initial, bad = false) {
    const change = scorecardDelta(value, initial, bad);
    const directionClass = change.delta === 0 ? "neutral" : change.beneficial ? "positive" : "negative";
    const help = BUSINESS_KPI_HELP[label] || "Compare this value with the starting position and the previous decision.";
    return `
      <article class="scorecard-kpi ${directionClass}">
        <div class="scorecard-kpi-head"><span>${escapeHtml(label)} <b class="metric-info" tabindex="0" role="note" title="${escapeHtml(help)}" aria-label="${escapeHtml(help)}">i</b></span><i></i></div>
        <strong>${value}<small>/100</small></strong>
        <div class="scorecard-kpi-track"><span style="width:${value}%"></span></div>
        <em>${escapeHtml(change.label)}</em>
      </article>
    `;
  }

  function businessSupportingMetric(label, value, initial, bad = false) {
    const change = scorecardDelta(value, initial, bad);
    const directionClass = change.delta === 0 ? "neutral" : change.beneficial ? "positive" : "negative";
    return `
      <article class="scorecard-metric ${directionClass}">
        <div class="scorecard-metric-head">
          <span>${escapeHtml(label)}</span>
          <strong>${value}/100</strong>
        </div>
        <div class="scorecard-kpi-track"><span style="width:${value}%"></span></div>
        <small>${escapeHtml(change.label)}</small>
      </article>
    `;
  }

  function businessTrendPoints(view) {
    const initial = baseState(state.scenarioId || BUSINESS_SCENARIO_ID);
    const points = [{
      label: "Start",
      revenue: scorecardMetricValue(initial, "stats", "EconomicStability"),
      margin: scorecardMetricValue(initial, "stats", "FiscalHealth"),
      trust: scorecardMetricValue(initial, "stats", "PublicConfidence"),
    }];
    const reviews = Array.isArray(state.decisionReviews) ? state.decisionReviews.slice(-6) : [];
    reviews.forEach((review, index) => {
      const after = review && review.stateAfter;
      if (!after) return;
      points.push({
        label: `D${Math.max(1, state.decisionReviews.length - reviews.length + index + 1)}`,
        revenue: scorecardMetricValue(after, "stats", "EconomicStability"),
        margin: scorecardMetricValue(after, "stats", "FiscalHealth"),
        trust: scorecardMetricValue(after, "stats", "PublicConfidence"),
      });
    });
    points.push({
      label: activePreDecisionSnapshot() ? "Before" : "Live",
      revenue: scorecardMetricValue(view, "stats", "EconomicStability"),
      margin: scorecardMetricValue(view, "stats", "FiscalHealth"),
      trust: scorecardMetricValue(view, "stats", "PublicConfidence"),
    });
    return points;
  }

  function drawBusinessTrendChart(view) {
    const canvas = els.businessTrendChart;
    if (!canvas || !canvas.getContext) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 120) return;
    const width = Math.round(rect.width);
    const height = 220;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const points = businessTrendPoints(view);
    const pad = { left: 34, right: 14, top: 18, bottom: 28 };
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xFor = (index) => pad.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
    const yFor = (value) => pad.top + ((100 - clamp(value)) / 100) * plotHeight;

    ctx.font = '11px "Archivo", sans-serif';
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [25, 50, 75, 100].forEach((tick) => {
      const y = yFor(tick);
      ctx.strokeStyle = "#ececf5";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = "#999bb0";
      ctx.fillText(String(tick), pad.left - 7, y);
    });

    const series = [
      { key: "revenue", color: "#168c96" },
      { key: "margin", color: "#0b2349" },
      { key: "trust", color: "#62bfc3" },
    ];
    series.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      points.forEach((point, index) => {
        const x = xFor(index);
        const y = yFor(point[line.key]);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      points.forEach((point, index) => {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xFor(index), yFor(point[line.key]), 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    });

    ctx.fillStyle = "#85879d";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    points.forEach((point, index) => ctx.fillText(point.label, xFor(index), height - pad.bottom + 8));
  }

  const BUSINESS_STOCK_OPEN_PRICE = 842.6;

  function businessStockComposite(source) {
    const weighted = [
      ["stats", "EconomicStability", 0.18, false],
      ["stats", "FiscalHealth", 0.17, false],
      ["domestic", "ParliamentApproval", 0.14, false],
      ["sentiment", "TrustInGovernment", 0.14, false],
      ["stats", "PublicConfidence", 0.10, false],
      ["economy", "CurrencyValue", 0.07, false],
      ["systems", "SupplyChainIntegrity", 0.06, false],
      ["systems", "HealthcareCapacity", 0.04, false],
      ["domestic", "OppositionPressure", 0.05, true],
      ["threats", "EconomicPressure", 0.05, true],
    ];
    return weighted.reduce((sum, [group, key, weight, bad]) => {
      const value = scorecardMetricValue(source, group, key);
      return sum + (bad ? 100 - value : value) * weight;
    }, 0);
  }

  function businessStockFundamentalPrice(source, openingScore) {
    const scoreDelta = businessStockComposite(source) - openingScore;
    return BUSINESS_STOCK_OPEN_PRICE * clamp(1 + scoreDelta * 0.0075, 0.52, 1.7);
  }

  function businessStockSeries(view) {
    const initial = baseState(state.scenarioId || BUSINESS_SCENARIO_ID);
    const openingScore = businessStockComposite(initial);
    const decisions = (Array.isArray(state.decisionReviews) ? state.decisionReviews : [])
      .filter((review) => review && review.stateAfter)
      .slice(-10)
      .map((review) => review.stateAfter);
    if (!decisions.length) {
      return {
        prices: Array(12).fill(BUSINESS_STOCK_OPEN_PRICE),
        openingScore,
        currentScore: businessStockComposite(view),
        decisions: 0,
      };
    }
    const anchors = [initial, ...decisions, view];
    const anchorPrices = anchors.map((source) => businessStockFundamentalPrice(source, openingScore));
    const prices = [];
    anchorPrices.forEach((price, index) => {
      if (index === 0) {
        prices.push(price);
        return;
      }
      const previous = anchorPrices[index - 1];
      for (let step = 1; step <= 5; step += 1) {
        const progress = step / 5;
        const trend = previous + (price - previous) * progress;
        const wave = Math.sin((index * 7 + step * 3) * 1.17) * 0.0018;
        prices.push(trend * (1 + wave));
      }
    });
    const fundamental = anchorPrices[anchorPrices.length - 1];
    const liveNoise = decisions.length
      ? Math.sin((marketUiTick + decisions.length * 5) * 0.82) * 0.0015
        + Math.cos((marketUiTick + 3) * 0.41) * 0.0007
      : 0;
    prices.push(fundamental * (1 + liveNoise));
    return { prices, openingScore, currentScore: businessStockComposite(view), decisions: decisions.length };
  }

  function drawBusinessStockChart(prices, positive) {
    const canvas = els.companyStockChart;
    if (!canvas || !canvas.getContext) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 120) return;
    const width = Math.round(rect.width);
    const height = 210;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const pad = { left: 12, right: 54, top: 18, bottom: 22 };
    const chartWidth = width - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const spread = Math.max(BUSINESS_STOCK_OPEN_PRICE * 0.012, rawMax - rawMin);
    const min = rawMin - spread * 0.22;
    const max = rawMax + spread * 0.22;
    const xFor = (index) => pad.left + (index / Math.max(1, prices.length - 1)) * chartWidth;
    const yFor = (price) => pad.top + ((max - price) / Math.max(1, max - min)) * chartHeight;
    const lineColor = positive ? "#139a73" : "#df5a67";

    ctx.setLineDash([3, 5]);
    ctx.lineWidth = 1;
    for (let row = 0; row < 4; row += 1) {
      const y = pad.top + (row / 3) * chartHeight;
      ctx.strokeStyle = "rgba(109, 130, 144, 0.2)";
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      const label = max - (row / 3) * (max - min);
      ctx.fillStyle = "#8ba0ac";
      ctx.font = '10px "Archivo", sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label.toFixed(2), width - pad.right + 8, y);
    }
    ctx.setLineDash([]);

    const area = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    area.addColorStop(0, positive ? "rgba(19, 154, 115, 0.28)" : "rgba(223, 90, 103, 0.25)");
    area.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.beginPath();
    prices.forEach((price, index) => {
      if (index === 0) ctx.moveTo(xFor(index), yFor(price));
      else ctx.lineTo(xFor(index), yFor(price));
    });
    ctx.lineTo(xFor(prices.length - 1), height - pad.bottom);
    ctx.lineTo(xFor(0), height - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = area;
    ctx.fill();

    ctx.beginPath();
    prices.forEach((price, index) => {
      if (index === 0) ctx.moveTo(xFor(index), yFor(price));
      else ctx.lineTo(xFor(index), yFor(price));
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    const lastX = xFor(prices.length - 1);
    const lastY = yFor(prices[prices.length - 1]);
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = positive ? "rgba(19, 154, 115, 0.28)" : "rgba(223, 90, 103, 0.28)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  function renderBusinessStockMarket(view = impactViewSource()) {
    if (!isBusinessScenario(state) || !els.companyStockMarket) return;
    const market = businessStockSeries(view);
    const open = market.prices[0];
    const price = market.prices[market.prices.length - 1];
    const change = price - open;
    const changePct = (change / open) * 100;
    const positive = change >= 0;
    const flat = Math.abs(changePct) < 0.03;
    const high = Math.max(...market.prices);
    const low = Math.min(...market.prices);
    const scoreDelta = market.currentScore - market.openingScore;
    const volume = Math.round((220000 + market.decisions * 54000 + Math.abs(changePct) * 21000 + (marketUiTick % 4) * 6500) / 1000) * 1000;
    const formatPrice = (value) => `₹${value.toFixed(2)}`;

    els.companyStockMarket.classList.toggle("positive", positive && !flat);
    els.companyStockMarket.classList.toggle("negative", !positive && !flat);
    els.companyStockMarket.classList.toggle("flat", flat);
    els.companyStockPrice.textContent = formatPrice(price);
    els.companyStockChange.innerHTML = `${change >= 0 ? "+" : "−"}${formatPrice(Math.abs(change))} <b>${changePct >= 0 ? "+" : "−"}${Math.abs(changePct).toFixed(2)}%</b>`;
    els.companyStockDirection.textContent = market.decisions
      ? `${scoreDelta >= 0 ? "Fundamentals strengthening" : "Fundamentals weakening"} after ${market.decisions} recorded decision${market.decisions === 1 ? "" : "s"}`
      : "Awaiting the first company decision";
    els.companyStockOpen.textContent = formatPrice(open);
    els.companyStockHigh.textContent = formatPrice(high);
    els.companyStockLow.textContent = formatPrice(low);
    els.companyStockVolume.textContent = volume >= 1000000 ? `${(volume / 1000000).toFixed(2)}M` : `${Math.round(volume / 1000)}K`;
    els.companyStockFundamentals.textContent = `Composite company health ${market.currentScore.toFixed(1)}/100 · ${scoreDelta >= 0 ? "+" : ""}${scoreDelta.toFixed(1)} vs session open`;
    drawBusinessStockChart(market.prices, positive);
  }

  function classifyBusinessHeadline(text) {
    const lower = String(text || "").toLowerCase();
    if (/margin|pricing|discount|profit|asp/.test(lower)) {
      return { label: "Margin watch", cue: "Compare the move against margin health and pricing power before committing." };
    }
    if (/retailer|channel|marketplace|distribution|sales/.test(lower)) {
      return { label: "Channel pulse", cue: "Check whether the decision strengthens retailer confidence without buying short-term volume." };
    }
    if (/service|warranty|quality|return/.test(lower)) {
      return { label: "Customer signal", cue: "Service capacity and product quality may determine whether this promise builds trust." };
    }
    if (/brand|consumer|trust|boycott|reputation/.test(lower)) {
      return { label: "Brand signal", cue: "Consider the likely trust response, not only the immediate commercial result." };
    }
    if (/portfolio|product|audio|watch|sku|category/.test(lower)) {
      return { label: "Portfolio move", cue: "Test whether this supports category focus or creates more execution complexity." };
    }
    if (/investor|ipo|board|governance/.test(lower)) {
      return { label: "Board watch", cue: "Look for measurable evidence that can withstand board and investor scrutiny." };
    }
    return { label: "Market pulse", cue: "Treat this as a directional signal and validate it against the scorecard before acting." };
  }

  function renderBusinessHeadlines(view) {
    const headlines = (view.headlines || []).slice(0, 3);
    const items = headlines.length ? headlines : [{
      time: "Latest",
      text: "The market is waiting for the next material company decision.",
    }];
    els.businessHeadlineDeck.innerHTML = items.map((item, index) => {
      const signal = classifyBusinessHeadline(item.text);
      return `
        <details class="scorecard-headline ${index === 0 ? "lead" : ""}">
          <summary>
            <span class="headline-index">0${index + 1}</span>
            <span class="headline-copy">
              <span class="headline-meta"><b>${escapeHtml(signal.label)}</b><time>${escapeHtml(item.time || "Latest")}</time></span>
              <strong>${escapeHtml(item.text || "No headline available.")}</strong>
            </span>
            <span class="headline-open" aria-hidden="true">+</span>
          </summary>
          <div class="headline-decision-cue"><span>Decision lens</span><p>${escapeHtml(signal.cue)}</p></div>
        </details>
      `;
    }).join("");
  }

  function renderBusinessScorecard() {
    if (!isBusinessScenario(state)) return;
    const view = impactViewSource();
    const initial = baseState(state.scenarioId || BUSINESS_SCENARIO_ID);
    const kpis = [
      ["Revenue Momentum", "stats", "EconomicStability", false],
      ["Margin Health", "stats", "FiscalHealth", false],
      ["Board Confidence", "domestic", "ParliamentApproval", false],
      ["Consumer Trust", "sentiment", "TrustInGovernment", false],
    ];
    els.businessKpiGrid.innerHTML = kpis.map(([label, group, key, bad]) => businessKpiCard(
      label,
      scorecardMetricValue(view, group, key),
      scorecardMetricValue(initial, group, key),
      bad
    )).join("");

    const supporting = [
      ["Brand Love", "stats", "PublicConfidence", false],
      ["Pricing Power", "economy", "CurrencyValue", false],
      ["Investor Scrutiny", "domestic", "OppositionPressure", true],
      ["Margin Pressure", "threats", "EconomicPressure", true],
      ["Manufacturing Resilience", "systems", "SupplyChainIntegrity", false],
      ["Service Capacity", "systems", "HealthcareCapacity", false],
    ];
    els.businessScorecardMetrics.innerHTML = supporting.map(([label, group, key, bad]) => businessSupportingMetric(
      label,
      scorecardMetricValue(view, group, key),
      scorecardMetricValue(initial, group, key),
      bad
    )).join("");

    const health = {
      Growth: Math.round(averageValues([
        scorecardMetricValue(view, "stats", "EconomicStability"),
        scorecardMetricValue(view, "economy", "StockIndex"),
        scorecardMetricValue(view, "systems", "MarketConfidence"),
      ])),
      Trust: Math.round(averageValues([
        scorecardMetricValue(view, "stats", "PublicConfidence"),
        scorecardMetricValue(view, "stats", "DiplomaticStanding"),
        scorecardMetricValue(view, "sentiment", "TrustInGovernment"),
      ])),
      Resilience: Math.round(averageValues([
        scorecardMetricValue(view, "stats", "FiscalHealth"),
        scorecardMetricValue(view, "systems", "SupplyChainIntegrity"),
        scorecardMetricValue(view, "systems", "HealthcareCapacity"),
        100 - scorecardMetricValue(view, "threats", "EconomicPressure"),
      ])),
    };
    const total = Math.max(1, Object.values(health).reduce((sum, value) => sum + value, 0));
    const growthEnd = (health.Growth / total) * 100;
    const trustEnd = growthEnd + (health.Trust / total) * 100;
    const overall = Math.round(averageValues(Object.values(health)));
    els.businessHealthDonut.style.background = `conic-gradient(#168c96 0 ${growthEnd}%, #0b2349 ${growthEnd}% ${trustEnd}%, #62bfc3 ${trustEnd}% 100%)`;
    els.businessHealthDonut.setAttribute("aria-label", `Company health mix: growth ${health.Growth}, trust ${health.Trust}, resilience ${health.Resilience}`);
    els.businessHealthScore.textContent = String(overall);
    const colors = { Growth: "#168c96", Trust: "#0b2349", Resilience: "#62bfc3" };
    els.businessHealthLegend.innerHTML = Object.entries(health).map(([label, value]) => `
      <div><span><i style="background:${colors[label]}"></i>${label}</span><strong>${value}/100</strong></div>
    `).join("");

    renderBusinessHeadlines(view);
    drawBusinessTrendChart(view);
    renderBusinessStockMarket(view);
  }

  function openSessionReport() {
    if (state.sessionReportShown) return;
    if (emergencyBlocked()) {
      if (!state.dismissed) return;
      finalizeEmergencyOutcome(state, window.SecondOrderEmergencyFlow.finish(state, "escalated"));
      window.SecondOrderEmergencyFlow.resume(state);
    }
    state.sessionReportShown = true;
    dynamicEngineOn = false;
    els.tickToggleBtn.textContent = "Dynamic Engine: Off";
    renderSessionReport();
    showSetupStage("report");
    saveState();
    setStatus(state.dismissed ? state.dismissalReason : "Session complete. Review the summary report.", state.dismissed);
  }

  function renderInsightTabs() {
    if (isBusinessScenario(state)) {
      els.businessScorecardPanel.classList.remove("hidden");
      els.standardImpactTabs.classList.add("hidden");
      return;
    }
    els.businessScorecardPanel.classList.add("hidden");
    els.standardImpactTabs.classList.remove("hidden");
    const ui = getScenarioUi(state);
    const tabs = [
      { key: "domestic", visible: ui.showDomestic, btn: els.tabDomesticBtn, panel: els.tabDomesticPanel },
      { key: "world", visible: ui.showWorld, btn: els.tabWorldBtn, panel: els.tabWorldPanel },
      { key: "economy", visible: ui.showEconomy, btn: els.tabEconomyBtn, panel: els.tabEconomyPanel },
    ];

    tabs.forEach((tab) => {
      const active = tab.visible && activeInsightTab === tab.key;
      tab.btn.classList.toggle("tab-btn-active", active);
      tab.panel.classList.toggle("hidden", !active);
    });
  }

  function renderMeetingPanel() {
    const active = meetingActive(state);
    document.body.classList.toggle("experience-open", active || Boolean(state.pendingReflection));
    els.meetingPanel.classList.toggle("hidden", !active);
    els.boardroomTransition.classList.toggle("hidden", !active || !boardroomEntering);
    els.boardroomWorkspace.classList.toggle("hidden", active && boardroomEntering);
    renderOllamaControls();

    if (!active) {
      els.meetingTimerBadge.textContent = "03:00";
      els.meetingNotice.textContent = state.meetingUsed
        ? "Emergency meeting already used for this simulation."
        : "This option can be used only once per simulation.";
      return;
    }

    const markup = window.SecondOrderWorkspaces.renderHub({
      rounds: state.meetingRounds || [], selectedRoundId: hubView.roundId,
      visibleCount: hubView.visible[hubView.roundId] || 2, inspector: hubView.inspector,
      context: boardroomContextSnapshot(), advisors: getAdvisorsForScenario(state),
      busy: aiBoardroomBusy, pendingPrompt: hubView.pendingPrompt, aiMode: aiAssistedSimulationActive(),
    });
    // Timer refreshes must not collapse details, lose focus, or reset the reading position.
    if (markup !== lastHubMarkup) {
      const scrollTop = els.meetingChatLog.scrollTop;
      const openDetails = [...els.meetingChatLog.querySelectorAll("details[open]")].map((node) => node.dataset.basisId || node.className);
      els.meetingChatLog.innerHTML = markup;
      els.meetingChatLog.querySelectorAll("details").forEach((node) => { node.open = openDetails.includes(node.dataset.basisId || node.className); });
      els.meetingChatLog.scrollTop = scrollTop;
      lastHubMarkup = markup;
    }

    els.meetingTimerBadge.textContent = formatCountdown(remainingMs(state.meetingEndsAt));
    els.meetingNotice.textContent = "Main simulation timer paused. This consultation ends after three minutes; you may leave early.";
  }

  function boardroomContextSnapshot() {
    const metrics = isBusinessScenario(state) ? [
      { label: "Revenue momentum", value: state.stats.EconomicStability },
      { label: "Margin health", value: state.stats.FiscalHealth },
      { label: "Board confidence", value: state.domestic.ParliamentApproval },
      { label: "Consumer trust", value: state.sentiment.TrustInGovernment },
    ] : Object.entries(state.stats || {}).slice(0, 4).map(([key, value]) => ({ label: getMetricLabel(key), value }));
    const crisis = state.emergencyControversy?.current;
    return {
      metrics, decisionCount: (state.decisionReviews || []).length,
      decisions: (state.decisionReviews || []).slice(-4).map((review) => ({ title: review.title, outcome: review.outcome, time: review.time })),
      emergency: crisis ? `${crisis.title || "Emergency"}: ${crisis.brief || ""}` : "No active emergency recorded.",
    };
  }

  function normalizedRoundResponses(round) {
    return (Array.isArray(round.responses) ? round.responses : [])
      .filter((entry) => entry && !/Situation Assessment|Board Synthesis|Crisis-Room Synthesis/i.test(entry.name || ""))
      .slice(0, 5)
      .map((entry, index) => ({
        id: entry.id || `advisor-${index}`,
        name: entry.name || "Board Member",
        text: entry.text || "No response recorded.",
        stance: entry.stance || (index === 1 ? "challenge" : "condition"),
        evidence: Array.isArray(entry.evidence) ? entry.evidence.slice(0, 3) : [],
        selectionReason: entry.selectionReason || "This perspective is relevant to the trade-off raised in the question.",
      }));
  }


  function renderWarRoom() {
    applyScenarioLayout();
    const impactView = impactViewSource();
    renderMetricGrid(els.domesticGrid, impactView.domestic || state.domestic, DOMESTIC_KEYS);
    renderMetricGrid(els.sentimentGrid, impactView.sentiment || state.sentiment, SENTIMENT_KEYS);
    renderMetricGrid(els.economyGrid, impactView.economy || state.economy, ECONOMY_KEYS);
    renderLiveMedia();
    renderHeatMaps();
    renderAlertFeed();
    renderCrisisTimers();
    renderPendingEvents();
    renderMilitaryOperations();
  }

  function renderMeta() {
    els.clockMeta.textContent = `Cycle Time: ${formatTime(state.clock)} | Tick: ${state.tickMinutes} min`;
    els.escalationMeta.textContent = isBusinessScenario(state)
      ? `Business Pressure Index: ${state.escalationIndex} | Stage: ${state.escalationStage}`
      : `Escalation Index: ${state.escalationIndex} | Stage: ${state.escalationStage}`;
  }

  function renderAll() {
    renderRoleMeta();
    renderMeta();
    renderDecisionPacing();
    renderWarRoom();
    renderOptions();
    renderDecisionUtilities();
    renderCovertOps();
    renderEmergencyStrategyRoom();
    renderControversyModal();
    renderIntel();
    renderHeadlines();
    renderGlobalReactions();
    renderBusinessScorecard();
    renderLeadership();
    renderImpactCompareControls();
    renderInsightTabs();
    renderOutcomeSummary();
    renderOutcomeText();
    renderMeetingPanel();
    renderSimulationPages();
    renderEmergencyExperience();
  }

  function buildDecisionProfileFromSelection() {
    const ids = [...selectedOptionIds];
    const options = getStructuredOptions(state).filter((o) => ids.includes(o.id));
    if (!options.length) return null;

    if (options.length === 1) return deepClone(options[0]);

    const merged = {
      id: options.map((o) => o.id).join("+"),
      title: options.map((o) => o.title).join(" + "),
      domain: "Combined",
      style: "mixed",
      primaryStyle: [...options].sort((a, b) => b.severity - a.severity)[0].style,
      components: options.map((option) => deepClone(option)),
      severity: clamp(Math.round(options.reduce((s, o) => s + o.severity, 0) / options.length + 6), 1, 100),
      risk: Math.min(0.98, options.reduce((s, o) => s + o.risk, 0) / options.length + 0.05),
      legality: options.reduce((s, o) => s + o.legality, 0) / options.length,
      targets: [...new Set(options.flatMap((o) => o.targets))],
      statsDelta: deterministicLogic.mergeOptionDeltas(options, "statsDelta"),
      threatDelta: deterministicLogic.mergeOptionDeltas(options, "threatDelta"),
      economyDelta: deterministicLogic.mergeOptionDeltas(options, "economyDelta"),
      systemsDelta: deterministicLogic.mergeOptionDeltas(options, "systemsDelta"),
    };

    return merged;
  }

  function buildConsequenceNarrative(profile, outcome, processedLogs) {
    if (isBusinessScenario(state)) {
      const teamLine = state.dismissed
        ? `Team reaction: consumer trust ${state.sentiment.TrustInGovernment}/100, team stress ${state.sentiment.PanicLevel}/100, retailer pushback ${state.domestic.ProtestRisk}/100. Decision-maker removed.`
        : `Team reaction: consumer trust ${state.sentiment.TrustInGovernment}/100, team stress ${state.sentiment.PanicLevel}/100, retailer pushback ${state.domestic.ProtestRisk}/100, board tolerance ${state.toleranceLoad || 0}/${toleranceMaximum(state)}.`;

      return [
        `- Outcome: ${outcome.scenario}. Business pressure ${state.escalationIndex}/100.`,
        `- Stakeholder/cause: ${conciseActorReaction(state)} ${causalSummary(state)}`,
        `- Parameter trail: ${impactLedgerLine(state)}`,
        `- ${teamLine}`,
        `- Business impact: portfolio strength ${state.stats.NationalSecurity}/100, revenue momentum ${state.stats.EconomicStability}/100, brand credibility ${state.stats.DiplomaticStanding}/100, manufacturing resilience ${state.systems.SupplyChainIntegrity}/100.`,
        `- Next risk: ${nextRiskSummary(state, processedLogs)}`,
      ].join("\n");
    }

    const domesticLine = state.dismissed
      ? `Domestic reaction: trust ${state.sentiment.TrustInGovernment}/100, panic ${state.sentiment.PanicLevel}/100, protest risk ${state.domestic.ProtestRisk}/100. Leadership removed.`
      : `Domestic reaction: trust ${state.sentiment.TrustInGovernment}/100, panic ${state.sentiment.PanicLevel}/100, protest risk ${state.domestic.ProtestRisk}/100, tolerance load ${state.toleranceLoad || 0}/${toleranceMaximum(state)}.`;

    return [
      `- Outcome: ${outcome.scenario}. Escalation ${state.escalationStage} (${state.escalationIndex}/100).`,
      `- External/cause: ${conciseActorReaction(state)} ${causalSummary(state)}`,
      `- Parameter trail: ${impactLedgerLine(state)}`,
      `- ${domesticLine}`,
      `- National impact: security ${state.stats.NationalSecurity}/100, economy ${state.stats.EconomicStability}/100, diplomacy ${state.stats.DiplomaticStanding}/100, infrastructure ${state.systems.InfrastructureIntegrity}/100.`,
      `- Next risk: ${nextRiskSummary(state, processedLogs)}`,
    ].join("\n");
  }

  function executeDecision() {
    if (emergencyBlocked()) { setStatus("Complete the active emergency response window before another business decision.", true); return; }
    if (!state.onboardingComplete) {
      setStatus("Complete orientation and select Start Playing before making a decision.", true);
      return;
    }
    if (sessionExpired(state)) {
      setStatus(state.dismissed ? "Simulation terminated: leadership removed from office." : "Session timer expired. Relaunch or reload to continue.", true);
      return;
    }
    if (meetingActive(state)) {
      setStatus("Close the emergency meeting before implementing a decision.", true);
      return;
    }
    if (analysisWindowActive(state)) {
      setStatus("Analysis window is active. Review the live feed and consequence summary before the next move.", true);
      return;
    }

    const profile = buildDecisionProfileFromSelection();
    if (!profile) {
      setStatus("Select one or two MCQ options before implementing a decision.", true);
      return;
    }
    if (profile.invalid) {
      rejectStrategicInput("Decision", profile.title, {
        reason: profile.invalidReason,
        guidance: profile.invalidGuidance,
      });
      return;
    }

    const decisionLabel = profile.id === "CUSTOM" ? "Custom Decision" : profile.id;
    storePreDecisionSnapshot(state, profile.title || decisionLabel);
    impactSnapshotMode = false;
    const decisionStartMetrics = metricSnapshot(state);
    state.lastImpactLedger = [];
    let phaseSnapshot = decisionStartMetrics;
    const effectiveStyle = effectiveDecisionStyle(state, profile);
    const outcome = applyDecisionCore(state, profile, decisionLabel);
    phaseSnapshot = recordImpactPhase(state, "selected option", phaseSnapshot);
    applyScenarioCausalImpact(state, profile, outcome);
    phaseSnapshot = recordImpactPhase(state, "causal effects", phaseSnapshot);
    adjustPressureTimersForDecision(state, profile);
    scheduleStateReactions(state, profile);
    pushWorldResponsesForDecision(state, profile, outcome);

    if (effectiveStyle === "kinetic") {
      scheduleEvent(state, "retaliatory_strike", 180, { source: "Pakistan" }, "Enemy retaliation chain: limited strike phase.");
      scheduleEvent(state, "border_skirmish", 360, { source: "LoC" }, "Consequence chain: border clash risk rises.");
      scheduleEvent(state, "un_session", 480, { source: "UN", legality: profile.legality }, "Consequence chain: diplomatic crisis forum opens.");
    }

    if (effectiveStyle === "decapitation") {
      scheduleEvent(state, "retaliatory_strike", 120, { source: "Pakistan" }, "Consequence chain: rapid military retaliation posture.");
      scheduleEvent(state, "sanctions_wave", 360, { source: "EU" }, "Consequence chain: sanctions regime escalates.");
    }

    if (effectiveStyle === "nuclear") {
      scheduleEvent(state, "global_market_crash", 10, { source: "Global" }, "Consequence chain: immediate global financial shock.");
    }

    state.clock = addMinutes(state.clock, 30);
    const processed = processDueEvents(state).map((x) => x);
    applyFeedbackLoops(state);
    phaseSnapshot = recordImpactPhase(state, "existing pressures", phaseSnapshot);

    refreshIntelReport(state);
    refreshHeadlines(state);
    updateDomesticAndLeadership(state);
    recordImpactPhase(state, "stakeholder adjustment", phaseSnapshot);

    state.history.unshift({
      id: `hist-${Math.random().toString(36).slice(2, 9)}`,
      time: formatTime(state.clock),
      title: profile.title,
      style: effectiveStyle,
      outcome: outcome.scenario,
      escalation: state.escalationIndex,
    });

    updateDecisionMetrics(profile, outcome.scenario, decisionStartMetrics);
    maybeTriggerEmergencyControversy(state, profile);
    startAnalysisWindow(state);
    pushAlert(state, "decision", `Decision executed: ${profile.title}`);
    const removed = evaluateLeadershipRemoval(state, profile);
    refreshStrategicSummaries(state, { outcomeLabel: `${profile.title} produced a ${outcome.scenario.toLowerCase()} outcome.` });
    if (!removed) {
      state.outcomeText = buildConsequenceNarrative(profile, outcome, processed);
      els.outcome.textContent = state.outcomeText;
    }

    selectedOptionIds.clear();
    els.customAction.value = "";

    if (removed) {
      saveState();
      openSessionReport();
      setStatus(state.dismissalReason, true);
      return;
    }
    saveState();
    activeSimulationPage = "impact";
    renderAll();
    setStatus("Decision resolved by the deterministic simulation engine.");
  }

  function launchCovertOperation(opId) {
    if (emergencyBlocked()) return;
    if (sessionExpired(state)) {
      setStatus(state.dismissed ? "Simulation terminated: leadership removed from office." : "Session timer expired. Relaunch or reload to continue.", true);
      return;
    }
    if (isBusinessScenario(state) && analysisWindowActive(state)) {
      setStatus(`Business decision cooldown active. Wait ${formatCountdown(remainingMs(state.analysisWindowEndsAt))} before the next boAt move.`, true);
      return;
    }
    const ui = getScenarioUi(state);
    const op = getCovertOpsTemplates(state).find((x) => x.id === opId);
    if (!op) return;

    storePreDecisionSnapshot(state, op.name || "Covert operation");
    impactSnapshotMode = false;
    const covertStartMetrics = metricSnapshot(state);
    state.lastImpactLedger = [];

    const random = seededRandom(state.turn * 733 + op.success * 17 + state.escalationIndex);
    const success = random() < op.success / 100;
    const exposed = random() < op.exposure / 100;
    const outcomeLabel = success ? (exposed ? "Partial" : "Success") : "Failure";

    if (ui.operationsMode === "infrastructure") {
      if (success) {
        applyMetricMap(state.stats, { NationalSecurity: 2, EconomicStability: 2, PublicConfidence: 1 });
        applyMetricMap(state.threats, { EconomicPressure: -3, DisinformationRisk: -4 });
        applyMetricMap(state.systems, { InfrastructureIntegrity: 5, SupplyChainIntegrity: 3, MarketConfidence: 4 });
        applyMetricMap(state.economy, { StockIndex: 2, CurrencyValue: 1 });
        pushAlert(state, "cyber", `Technical countermeasure succeeded: ${op.name}.`);
      } else {
        applyMetricMap(state.stats, { NationalSecurity: -1, EconomicStability: -2, PublicConfidence: -1 });
        applyMetricMap(state.threats, { EconomicPressure: 3, DisinformationRisk: 4 });
        applyMetricMap(state.systems, { InfrastructureIntegrity: -4, MarketConfidence: -3 });
        pushAlert(state, "cyber", `Technical countermeasure failed: ${op.name}.`);
      }
    } else if (ui.operationsMode === "security") {
      if (success) {
        applyMetricMap(state.stats, { NationalSecurity: 4, PublicConfidence: 2, CommunalHarmony: 1 });
        applyMetricMap(state.threats, { TerrorThreat: -5, DisinformationRisk: -2 });
        applyMetricMap(state.sentiment, { PanicLevel: -3, TrustInGovernment: 2, CommunalTension: -1 });
        pushAlert(state, "security", `Counterterror action succeeded: ${op.name}.`);
      } else {
        applyMetricMap(state.stats, { NationalSecurity: -2, DiplomaticStanding: -1, PublicConfidence: -2 });
        applyMetricMap(state.threats, { TerrorThreat: 3, DisinformationRisk: 3 });
        applyMetricMap(state.sentiment, { PanicLevel: 4, CommunalTension: 2 });
        pushAlert(state, "security", `Counterterror action failed: ${op.name}.`);
      }
    } else if (ui.operationsMode === "maritime") {
      if (success) {
        applyMetricMap(state.stats, { NationalSecurity: 3, DiplomaticStanding: 1 });
        applyMetricMap(state.threats, { BorderTension: -2, EconomicPressure: -1 });
        applyMetricMap(state.systems, { SupplyChainIntegrity: 4, OilStability: 3, MarketConfidence: 2 });
        pushAlert(state, "naval", `Maritime intelligence action succeeded: ${op.name}.`);
      } else {
        applyMetricMap(state.stats, { NationalSecurity: -1, DiplomaticStanding: -2 });
        applyMetricMap(state.threats, { BorderTension: 3, EconomicPressure: 2 });
        applyMetricMap(state.systems, { SupplyChainIntegrity: -3, OilStability: -2 });
        pushAlert(state, "naval", `Maritime intelligence action failed: ${op.name}.`);
      }
    } else {
      if (success) {
        applyMetricMap(state.stats, { NationalSecurity: 4 });
        applyMetricMap(state.threats, { TerrorThreat: -5 });
        pushAlert(state, "covert", `Covert operation succeeded: ${op.name}.`);
      } else {
        applyMetricMap(state.stats, { NationalSecurity: -2, DiplomaticStanding: -2 });
        applyMetricMap(state.threats, { TerrorThreat: 2, DisinformationRisk: 3 });
        pushAlert(state, "covert", `Covert operation failed: ${op.name}.`);
      }
    }

    if (exposed) {
      applyMetricMap(state.stats, { DiplomaticStanding: -5, PublicConfidence: -2 });
      applyMetricMap(state.threats, { BorderTension: 4, DisinformationRisk: 4 });
      if (ui.operationsMode === "infrastructure") {
        applyMetricMap(state.systems, { MarketConfidence: -3 });
      }
      scheduleEvent(state, "un_session", 180, { source: "UN", legality: 0.3 }, "Operation exposure triggers diplomatic fallout.");
      pushAlert(state, "covert", "Operation exposure: adversaries publicize covert activity.");
    }

    let covertPhaseSnapshot = recordImpactPhase(state, "operation result", covertStartMetrics);
    updateDomesticAndLeadership(state);
    recordImpactPhase(state, "stakeholder adjustment", covertPhaseSnapshot);
    updateDecisionMetrics(
      {
        id: op.id,
        title: op.name,
        domain: ui.covertTitle,
        style: op.style || (success ? "covert" : "information"),
        legality: exposed ? 0.42 : 0.68,
        risk: exposed ? 0.58 : 0.36,
      },
      outcomeLabel,
      covertStartMetrics
    );
    const covertProfile = { style: op.style || "covert", legality: exposed ? 0.42 : 0.68, risk: exposed ? 0.58 : 0.36 };
    const removed = evaluateLeadershipRemoval(state, covertProfile);
    refreshStrategicSummaries(state, { outcomeLabel: `${op.name} concluded ${success ? "successfully" : "unsuccessfully"}.` });
    if (!removed) {
      state.outcomeText = [
        `- Outcome: ${outcomeLabel}. Exposure ${exposed ? "yes" : "no"}.`,
        `- External reaction: ${conciseActorReaction(state)}`,
        `- Parameter trail: ${impactLedgerLine(state)}`,
        `- Domestic reaction: trust ${state.sentiment.TrustInGovernment}/100, panic ${state.sentiment.PanicLevel}/100, protest risk ${state.domestic.ProtestRisk}/100, tolerance load ${state.toleranceLoad || 0}/${toleranceMaximum(state)}.`,
        `- National impact: security ${state.stats.NationalSecurity}/100, economy ${state.stats.EconomicStability}/100, diplomacy ${state.stats.DiplomaticStanding}/100, infrastructure ${state.systems.InfrastructureIntegrity}/100.`,
        `- Next risk: ${nextRiskSummary(state)}`,
      ].join("\n");
    }
    if (removed) {
      saveState();
      openSessionReport();
      setStatus(state.dismissalReason, true);
      return;
    }
    saveState();
    activeSimulationPage = "impact";
    renderAll();
    setStatus("Operation resolved by the deterministic simulation engine.");
  }

  function inferOperationRegion(text) {
    const lower = text.toLowerCase();
    if (/ladakh|galwan|lac|pangong|china|tawang|arunachal/.test(lower)) return "Northern / LAC Theatre";
    if (/mumbai|maharashtra|coast|arabian|pakistan|loc|kashmir/.test(lower)) return "Western / Coastal Theatre";
    if (/andaman|malacca|bay of bengal|indian ocean|naval|fleet|sea/.test(lower)) return "Indian Ocean Theatre";
    if (/grid|power|bank|telecom|cyber|radar|satellite/.test(lower)) return "Cyber / Critical Infrastructure";
    if (/audio|earbud|speaker|smartwatch|wearable|retail|marketplace|amazon|flipkart|d2c|warranty|manufactur|inventory|campaign|brand|margin|ipo/.test(lower)) return "boAt Business Theatre";
    if (state.scenarioId === "india_china_border") return "Northern / LAC Theatre";
    if (state.scenarioId === "mumbai_terror") return "Western / Urban Security Theatre";
    if (state.scenarioId === "indopacific_standoff") return "Indian Ocean Theatre";
    if (state.scenarioId === "grid_cyber_war") return "Cyber / Critical Infrastructure";
    if (state.scenarioId === BUSINESS_SCENARIO_ID) return "boAt Business Theatre";
    return "National Command Theatre";
  }

  function updateMilitaryPosture(style, risk) {
    const readinessShift = style === "defensive" ? 2 : style === "cyber" ? 1 : Math.max(2, Math.round(risk * 6));
    state.military.airSquadrons.forEach((unit) => {
      unit.readiness = clamp(unit.readiness + readinessShift);
    });
    state.military.navalFleets.forEach((unit) => {
      unit.readiness = clamp(unit.readiness + Math.max(1, readinessShift - 1));
    });
    state.military.specialForces.readiness = clamp(state.military.specialForces.readiness + (style === "covert" ? 4 : 1));
    state.military.satellites.operational = clamp(state.military.satellites.operational - (risk > 0.55 ? 2 : 0));
  }

  function executeMilitaryOperation() {
    if (emergencyBlocked()) return;
    if (sessionExpired(state)) {
      setStatus(state.dismissed ? "Simulation terminated: leadership removed from office." : "Session timer expired. Relaunch or reload to continue.", true);
      return;
    }
    const ui = getScenarioUi(state);
    const operationLabelMap = {
      strategic: "strategic operation",
      military: "military order",
      maritime: "maritime order",
      security: "security order",
      infrastructure: "infrastructure order",
      business: "business move",
    };
    const operationLabel = operationLabelMap[ui.operationsMode] || "operation";
    const text = els.militaryOperationInput.value.trim();
    if (!text) {
      setStatus(`Enter an open-ended ${operationLabel} first.`, true);
      return;
    }

    const assessment = assessStrategicInput(text, ui.operationsMode);
    if (!assessment.valid) {
      pushAlert(state, "operations", `Command rejected proposed ${operationLabel}: ${text}`);
      state.military.operationLog.unshift({ time: formatTime(state.clock), text: `Rejected: ${text}` });
      state.military.operationLog = state.military.operationLog.slice(0, 10);
      rejectStrategicInput(ui.operationsTitle, text, assessment);
      return;
    }

    storePreDecisionSnapshot(state, text);
    impactSnapshotMode = false;
    const operationStartMetrics = metricSnapshot(state);
    state.lastImpactLedger = [];

    const lower = text.toLowerCase();
    let style = ui.operationsMode === "business" ? "business" : ui.operationsMode === "infrastructure" ? "cyber" : ui.operationsMode === "security" ? "domestic" : "defensive";
    let risk = ui.operationsMode === "business" ? 0.32 : ui.operationsMode === "infrastructure" ? 0.24 : ui.operationsMode === "security" ? 0.28 : 0.34;
    let legality = ui.operationsMode === "business" ? 0.94 : ui.operationsMode === "infrastructure" ? 0.93 : ui.operationsMode === "security" ? 0.88 : 0.82;
    const deltas = {
      stats: {},
      threats: {},
      economy: {},
      systems: {},
      sentiment: {},
      domestic: {},
    };

    if (ui.operationsMode === "business") {
      const businessProfile = businessProfileFromCustom(text);
      style = businessProfile.style;
      risk = businessProfile.risk;
      legality = businessProfile.legality;
      deltas.stats = businessProfile.statsDelta || {};
      deltas.threats = businessProfile.threatDelta || {};
      deltas.economy = businessProfile.economyDelta || {};
      deltas.systems = businessProfile.systemsDelta || {};
      if (style === "market" || style === "brand") {
        scheduleEvent(state, "pilot_feedback", 120, { source: "Consumers" }, "Open business move creates a consumer and channel feedback window.");
      }
      if (style === "product") {
        scheduleEvent(state, "product_delay", 180, { source: "Product Team" }, "Product execution review follows the new portfolio commitment.");
      }
      if (style === "pricing" || style === "finance") {
        scheduleEvent(state, "pricing_pushback", 180, { source: "Marketplaces" }, "Pricing pushback follows the commercial move.");
      }
      if (style === "governance" || style === "operations") {
        scheduleEvent(state, "credibility_boost", 180, { source: "Board" }, "Quality, supply chain, and IPO discipline enter credibility review.");
      }
      if (style === "overreach") {
        scheduleEvent(state, "focus_drift", 90, { source: "Category Teams" }, "Aggressive category expansion creates focus-drift risk.");
      }
      if (style === "unethical") {
        scheduleEvent(state, "trust_crisis", 30, { source: "Market" }, "Questionable business move creates brand-trust crisis risk.");
      }
    } else if (ui.operationsMode === "infrastructure") {
      style = /patch|firmware|server|network|scada|telecom|cyber|dispatch/.test(lower) ? "cyber" : "defensive";
      deltas.stats = { NationalSecurity: 1, EconomicStability: 1, PublicConfidence: 1, FiscalHealth: -1 };
      deltas.threats = { EconomicPressure: -2, DisinformationRisk: -2 };
      deltas.economy = { StockIndex: 1, CurrencyValue: 1 };
      deltas.systems = { InfrastructureIntegrity: 4, MarketConfidence: 3, SupplyChainIntegrity: 2 };

      if (/isolate|manual|backup|restore|crew|repair|transformer|substation/.test(lower)) {
        deltas.systems.InfrastructureIntegrity += 3;
        deltas.systems.HealthcareCapacity = (deltas.systems.HealthcareCapacity || 0) + 2;
        deltas.threats.EconomicPressure -= 1;
      }
      if (/public|brief|outage|load shedding|consumer|state utility/.test(lower)) {
        deltas.stats.PublicConfidence += 1;
        deltas.sentiment.PanicLevel = -3;
        deltas.threats.DisinformationRisk -= 1;
      }
      if (/hack back|offensive|sinkhole|retaliat|counter.?attack/.test(lower)) {
        style = "covert";
        risk = 0.46;
        legality = 0.7;
        deltas.stats.DiplomaticStanding = -2;
        deltas.threats.BorderTension = 2;
        scheduleEvent(state, "cyber_retaliation", 120, { source: "Adversary" }, "Hostile cyber operators probe restored grid nodes after Indian counter-action.");
        scheduleEvent(state, "un_session", 240, { source: "UN", legality }, "Cross-border cyber countermeasures trigger attribution and legality scrutiny.");
      }
    } else if (ui.operationsMode === "security") {
      style = /raid|assault|breach|special|nsg/.test(lower) ? "kinetic" : "domestic";
      risk = style === "kinetic" ? 0.48 : 0.28;
      legality = style === "kinetic" ? 0.72 : 0.88;
      deltas.stats = { NationalSecurity: 3, PublicConfidence: 1, FiscalHealth: -1 };
      deltas.threats = { TerrorThreat: -4, DisinformationRisk: -1 };
      deltas.sentiment = { PanicLevel: -2, TrustInGovernment: 2 };
      deltas.domestic = { ParliamentApproval: 1, OppositionPressure: 1 };

      if (/hospital|ambulance|trauma|evacuat|rescue/.test(lower)) {
        deltas.systems.HealthcareCapacity = 4;
        deltas.stats.PublicConfidence += 1;
        deltas.sentiment.PanicLevel -= 2;
      }
      if (/checkpoint|curfew|screening|search|arrest|manhunt|safe house/.test(lower)) {
        deltas.threats.TerrorThreat -= 2;
        deltas.sentiment.CommunalTension = -1;
        deltas.domestic.OppositionPressure += 1;
      }
      if (/raid|assault|breach|special|nsg/.test(lower)) {
        deltas.threats.TerrorThreat -= 2;
        deltas.stats.PublicConfidence += 1;
        deltas.domestic.OppositionPressure += 2;
        state.military.specialForces.deployed = clamp(state.military.specialForces.deployed + 1, 0, 10);
        state.military.specialForces.readiness = clamp(state.military.specialForces.readiness + 3);
        scheduleEvent(state, "terror_strike", 180, { source: "Residual Cell" }, "Residual cells consider a hurried follow-on attack after the visible crackdown.");
      }
    } else if (ui.operationsMode === "maritime") {
      style = /carrier|submarine|board|interdict|blockade/.test(lower) ? "kinetic" : /surveillance|isr|patrol|drone/.test(lower) ? "cyber" : "defensive";
      risk = style === "kinetic" ? 0.56 : style === "cyber" ? 0.3 : 0.32;
      legality = style === "kinetic" ? 0.68 : 0.86;
      deltas.stats = { NationalSecurity: 2, DiplomaticStanding: 1, FiscalHealth: -1 };
      deltas.threats = { BorderTension: 1, EconomicPressure: -1 };
      deltas.systems = { SupplyChainIntegrity: 3, OilStability: 2, MarketConfidence: 1 };
      deltas.economy = { DefenseSpending: -1 };

      if (/escort|convoy|shipping|port|harbor|sea lane/.test(lower)) {
        deltas.threats.EconomicPressure -= 2;
        deltas.systems.SupplyChainIntegrity += 2;
      }
      if (/carrier|submarine|board|interdict|blockade/.test(lower)) {
        deltas.stats.DiplomaticStanding = -3;
        deltas.threats.BorderTension += 6;
        scheduleEvent(state, "naval_clash", 180, { source: "Chinese Fleet" }, "Naval contact risk rises after Indian maritime coercive action.");
      }
      state.military.navalFleets[0].region = "Indian Ocean";
      state.military.navalFleets[0].readiness = clamp(state.military.navalFleets[0].readiness + 3);
      updateMilitaryPosture(style, risk);
    } else {
      style = "kinetic";
      risk = 0.34;
      legality = 0.78;
      deltas.stats = { MilitaryReadiness: 1, FiscalHealth: -1 };
      deltas.threats = { BorderTension: 2 };
      deltas.economy = { DefenseSpending: -1 };

      if (/cyber|radar|network|satellite|signal|surveillance/.test(lower)) {
        style = "cyber";
        risk = 0.42;
        deltas.stats = { NationalSecurity: 2, DiplomaticStanding: -1 };
        deltas.threats = { DisinformationRisk: 2, BorderTension: 2 };
        scheduleEvent(state, "cyber_retaliation", 120, { source: "Adversary" }, "Enemy cyber response after Indian network activity.");
      }
      if (/air|strike|missile|bomb|attack|raid/.test(lower)) {
        style = "kinetic";
        risk = 0.62;
        legality = 0.58;
        deltas.stats = { NationalSecurity: 2, PublicConfidence: 1, DiplomaticStanding: -4, FiscalHealth: -3 };
        deltas.threats = { BorderTension: 8, TerrorThreat: -2, DisinformationRisk: 3 };
        scheduleEvent(state, "retaliatory_strike", 180, { source: "Pakistan" }, "Adversary retaliation window opens after visible military action.");
      }
      if (/defen|air defence|air defense|missile defense|shield|intercept/.test(lower)) {
        style = "defensive";
        risk = 0.24;
        legality = 0.9;
        state.military.missileDefense.active = true;
        state.military.missileDefense.effectiveness = clamp(state.military.missileDefense.effectiveness + 5);
        deltas.stats = { MilitaryReadiness: 3, FiscalHealth: -2 };
        deltas.threats = { BorderTension: 1, TerrorThreat: -1 };
      }
      if (/navy|naval|fleet|sea|ocean|carrier|escort/.test(lower)) {
        state.military.navalFleets[0].region = state.scenarioId === "indopacific_standoff" ? "Indian Ocean" : "Arabian Sea";
        state.military.navalFleets[0].readiness = clamp(state.military.navalFleets[0].readiness + 3);
        deltas.threats.BorderTension = (deltas.threats.BorderTension || 0) + 2;
      }
      if (/special|commando|sf|covert|infiltrat/.test(lower)) {
        style = "covert";
        risk = Math.max(risk, 0.5);
        legality = Math.min(legality, 0.62);
        state.military.specialForces.deployed = clamp(state.military.specialForces.deployed + 1, 0, 10);
        deltas.stats.NationalSecurity = (deltas.stats.NationalSecurity || 0) + 2;
        deltas.threats.TerrorThreat = (deltas.threats.TerrorThreat || 0) - 2;
        scheduleEvent(state, "un_session", 240, { source: "UN", legality }, "Covert military movement creates diplomatic scrutiny risk.");
      }
      updateMilitaryPosture(style, risk);
    }

    const metricStyle = ui.operationsMode === "security"
      ? "domestic"
      : ui.operationsMode === "infrastructure"
        ? "cyber"
        : style === "defensive"
          ? "information"
          : style;
    const reactionStyle = ui.operationsMode === "security"
      ? "domestic"
      : ui.operationsMode === "infrastructure"
        ? "cyber"
        : style;

    applyMetricMap(state.stats, deltas.stats);
    applyMetricMap(state.threats, deltas.threats);
    applyMetricMap(state.economy, deltas.economy || {});
    applyMetricMap(state.systems, deltas.systems || {});
    applyMetricMap(state.sentiment, deltas.sentiment || {});
    applyMetricMap(state.domestic, deltas.domestic || {});
    updateEscalation(state, Math.round(risk * 10), ui.operationsTitle);
    state.hotspots.unshift({
      id: `hs-op-${Math.random().toString(36).slice(2, 9)}`,
      type: ui.operationsMode === "infrastructure" ? "grid" : ui.operationsMode === "security" ? "security" : style,
      region: inferOperationRegion(text),
      severity: clamp(42 + Math.round(risk * 45) + Math.round(state.escalationIndex / 8)),
    });
    state.hotspots = state.hotspots.slice(0, 12);
    state.military.operationLog.unshift({ time: formatTime(state.clock), text });
    state.military.operationLog = state.military.operationLog.slice(0, 10);
    pushAlert(state, "operations", `${ui.operationsTitle} executed: ${text}`);
    pushWorldResponsesForDecision(state, { title: text, style: reactionStyle, risk, legality, domain: "Operations" }, { scenario: "Partial" });
    const operationPhaseSnapshot = recordImpactPhase(state, "operation result", operationStartMetrics);
    maybeTriggerEmergencyControversy(state, { style: metricStyle, legality, risk, title: text, domain: ui.operationsTitle });
    adjustPressureTimersForDecision(state, { style: metricStyle, domain: ui.operationsTitle });
    if (isBusinessScenario(state)) startAnalysisWindow(state);
    updateDomesticAndLeadership(state);
    recordImpactPhase(state, "stakeholder adjustment", operationPhaseSnapshot);
    updateDecisionMetrics({ style: metricStyle, legality, risk, title: text, domain: ui.operationsTitle }, "Partial", operationStartMetrics);
    refreshIntelReport(state);
    refreshHeadlines(state);
    const operationProfile = { style: reactionStyle, legality, risk };
    const removed = evaluateLeadershipRemoval(state, operationProfile);
    refreshStrategicSummaries(state, { outcomeLabel: `${text} changed the ${ui.operationsTitle.toLowerCase()} posture.` });
    if (!removed) {
      state.outcomeText = isBusinessScenario(state)
          ? [
            `- Outcome: Partial. Business pressure ${state.escalationIndex}/100.`,
            `- Stakeholder reaction: ${conciseActorReaction(state)}`,
            `- Parameter trail: ${impactLedgerLine(state)}`,
            `- Team reaction: consumer trust ${state.sentiment.TrustInGovernment}/100, team stress ${state.sentiment.PanicLevel}/100, retailer pushback ${state.domestic.ProtestRisk}/100, board tolerance ${state.toleranceLoad || 0}/${toleranceMaximum(state)}.`,
            `- Business impact: portfolio strength ${state.stats.NationalSecurity}/100, revenue momentum ${state.stats.EconomicStability}/100, brand credibility ${state.stats.DiplomaticStanding}/100, D2C reliability ${state.systems.InfrastructureIntegrity}/100.`,
            `- Next risk: ${nextRiskSummary(state)}`,
          ].join("\n")
        : [
            `- Outcome: Partial. Escalation ${state.escalationStage} (${state.escalationIndex}/100).`,
            `- External reaction: ${conciseActorReaction(state)}`,
            `- Parameter trail: ${impactLedgerLine(state)}`,
            `- Domestic reaction: trust ${state.sentiment.TrustInGovernment}/100, panic ${state.sentiment.PanicLevel}/100, protest risk ${state.domestic.ProtestRisk}/100, tolerance load ${state.toleranceLoad || 0}/${toleranceMaximum(state)}.`,
            `- National impact: security ${state.stats.NationalSecurity}/100, economy ${state.stats.EconomicStability}/100, diplomacy ${state.stats.DiplomaticStanding}/100, infrastructure ${state.systems.InfrastructureIntegrity}/100.`,
            `- Next risk: ${nextRiskSummary(state)}`,
          ].join("\n");
    }
    els.militaryOperationInput.value = "";
    if (removed) {
      saveState();
      openSessionReport();
      setStatus(state.dismissalReason, true);
      return;
    }
    saveState();
    activeSimulationPage = "impact";
    renderAll();
    setStatus("Operation resolved by the deterministic simulation engine.");
  }
  function saveState() {
    try { window.SecondOrderValidation?.observe(state); } catch { /* Research must never interrupt play. */ }
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lastSavedAt = state.updatedAt;
    hasSavedCampaign = true;
    updateResumeButton();

    if (connectedFileHandle) {
      connectedFileHandle
        .createWritable()
        .then((writable) => writable.write(JSON.stringify(state, null, 2)).then(() => writable.close()))
        .then(() => {
          els.saveBadge.textContent = "Save: File + Local";
        })
        .catch(() => {
          els.saveBadge.textContent = "Save: Local (file write failed)";
        });
    } else {
      els.saveBadge.textContent = "Save: Local";
    }
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function normalizeState(raw) {
    const safeScenarioId = validScenarioId(raw && raw.scenarioId ? raw.scenarioId : DEFAULT_SCENARIO_ID);
    const defaults = baseState(safeScenarioId);
    if (!raw || typeof raw !== "object") return defaults;

    const rawVersion = Number(raw.version || 0);
    const merged = { ...defaults, ...raw, scenarioId: safeScenarioId };
    merged.version = defaults.version;
    merged.onboardingComplete = Object.prototype.hasOwnProperty.call(raw, "onboardingComplete")
      ? Boolean(raw.onboardingComplete)
      : Boolean(raw.sessionEndsAt || (Array.isArray(raw.history) && raw.history.length) || raw.sessionReportShown);
    if (!merged.onboardingComplete) merged.sessionEndsAt = null;
    merged.stats = { ...defaults.stats, ...(raw.stats || {}) };
    merged.threats = { ...defaults.threats, ...(raw.threats || {}) };
    merged.domestic = { ...defaults.domestic, ...(raw.domestic || {}) };
    merged.sentiment = { ...defaults.sentiment, ...(raw.sentiment || {}) };
    merged.economy = { ...defaults.economy, ...(raw.economy || {}) };
    merged.systems = { ...defaults.systems, ...(raw.systems || {}) };
    merged.adaptation = { ...defaults.adaptation, ...(raw.adaptation || {}) };
    merged.military = { ...defaults.military, ...(raw.military || {}) };
    merged.military.airSquadrons = Array.isArray(raw.military && raw.military.airSquadrons) ? raw.military.airSquadrons : defaults.military.airSquadrons;
    merged.military.navalFleets = Array.isArray(raw.military && raw.military.navalFleets) ? raw.military.navalFleets : defaults.military.navalFleets;
    merged.military.operationLog = Array.isArray(raw.military && raw.military.operationLog) ? raw.military.operationLog : defaults.military.operationLog;
    merged.fogOfWar = { ...defaults.fogOfWar, ...(raw.fogOfWar || {}) };
    merged.actors = { ...defaults.actors, ...(raw.actors || {}) };

    merged.alerts = Array.isArray(raw.alerts) ? raw.alerts : defaults.alerts;
    merged.headlines = Array.isArray(raw.headlines) ? raw.headlines : defaults.headlines;
    merged.globalReactions = Array.isArray(raw.globalReactions) && raw.globalReactions.length ? raw.globalReactions : defaults.globalReactions;
    merged.pendingEvents = Array.isArray(raw.pendingEvents) ? raw.pendingEvents : defaults.pendingEvents;
    merged.crisisTimers = Array.isArray(raw.crisisTimers) ? raw.crisisTimers : defaults.crisisTimers;
    merged.crisisTimers = merged.crisisTimers.map((timer) => ({
      ...timer,
      initialHours: Number.isFinite(timer.initialHours) ? timer.initialHours : Math.max(Number(timer.hoursLeft) || 1, 1),
    }));
    if (safeScenarioId === BUSINESS_SCENARIO_ID && merged.crisisTimers.some((timer) => /Festive Sale Margin Lock|Wearables Portfolio Review|IPO Readiness Check/i.test(timer.label || ""))) {
      merged.crisisTimers = defaults.crisisTimers;
    }
    merged.history = Array.isArray(raw.history) ? raw.history : defaults.history;
    merged.hotspots = Array.isArray(raw.hotspots) ? raw.hotspots : defaults.hotspots;
    merged.meetingChat = Array.isArray(raw.meetingChat) ? raw.meetingChat : defaults.meetingChat;
    merged.meetingRounds = Array.isArray(raw.meetingRounds) && raw.meetingRounds.length
      ? raw.meetingRounds
      : rebuildMeetingRoundsFromChat(merged.meetingChat);
    merged.intelligence = { ...defaults.intelligence, ...(raw.intelligence || {}) };
    merged.decisionMetrics = { ...defaults.decisionMetrics, ...(raw.decisionMetrics || {}) };
    merged.decisionReviews = (Array.isArray(raw.decisionReviews) ? raw.decisionReviews : defaults.decisionReviews)
      .slice(-30)
      .map((review, index) => ({
        ...review,
        id: review.id || `legacy-review-${index}-${String(review.time || "unknown").replace(/\W/g, "")}`,
      }));
    merged.decisionPriorities = Array.isArray(raw.decisionPriorities) ? raw.decisionPriorities.slice(0, 3) : defaults.decisionPriorities;
    merged.reflections = Array.isArray(raw.reflections) ? raw.reflections.slice(-30) : defaults.reflections;
    merged.pendingReflection = raw.pendingReflection && typeof raw.pendingReflection === "object"
      ? { ...raw.pendingReflection }
      : defaults.pendingReflection;
    const restoredPromptCount = Number.isFinite(raw.reflectionPromptsShown)
      ? raw.reflectionPromptsShown
      : merged.reflections.length + (merged.pendingReflection ? 1 : 0);
    merged.reflectionPromptsShown = clamp(restoredPromptCount, 0, 2);
    merged.lastReflectionPromptAt = raw.lastReflectionPromptAt
      || (merged.reflections.length ? merged.reflections[merged.reflections.length - 1].time : null)
      || (merged.pendingReflection && merged.pendingReflection.createdAt)
      || null;
    merged.dynamicEventHistory = Array.isArray(raw.dynamicEventHistory) ? raw.dynamicEventHistory.slice(-8) : defaults.dynamicEventHistory;
    merged.lastImpactLedger = Array.isArray(raw.lastImpactLedger) ? raw.lastImpactLedger.slice(0, 6) : defaults.lastImpactLedger;
    merged.lastPreDecisionSnapshot = raw.lastPreDecisionSnapshot && typeof raw.lastPreDecisionSnapshot === "object" ? raw.lastPreDecisionSnapshot : defaults.lastPreDecisionSnapshot;
    merged.emergencyControversy = raw.emergencyControversy && typeof raw.emergencyControversy === "object"
      ? { ...defaults.emergencyControversy, ...raw.emergencyControversy }
      : defaults.emergencyControversy;
    if (merged.emergencyControversy.current && typeof merged.emergencyControversy.current !== "object") {
      merged.emergencyControversy.current = null;
      merged.emergencyControversy.active = false;
    }
    if (merged.emergencyControversy.current && merged.emergencyControversy.active && !merged.emergencyControversy.current.journey && !merged.emergencyControversy.responseEndsAt) {
      merged.emergencyControversy.responseEndsAt = minutesFromNowIso(CRISIS_RESPONSE_WINDOW_MS);
    }
    if (merged.emergencyControversy.current && merged.emergencyControversy.current.statementReleased) {
      merged.emergencyControversy.statementIssuedThisSession = true;
      merged.emergencyControversy.statementChoiceId = merged.emergencyControversy.statementChoiceId || merged.emergencyControversy.current.statementChoiceId || "legacy";
    }
    if (merged.emergencyControversy.current && safeScenarioId === BUSINESS_SCENARIO_ID) {
      const currentCrisis = merged.emergencyControversy.current;
      const latestTemplate = controversyTemplates().find((item) => item.id === currentCrisis.id);
      if (latestTemplate) {
        currentCrisis.responses = latestTemplate.responses.map((item) => deepClone(item));
        currentCrisis.majorDecisions = latestTemplate.majorDecisions.map((item) => deepClone(item));
      }
    }
    merged.emergencyControversy.windowExpired = Boolean(merged.emergencyControversy.windowExpired);
    merged.emergencyControversy.missedWindowApplied = Boolean(merged.emergencyControversy.missedWindowApplied);
    merged.emergencyControversy.statementIssuedThisSession = Boolean(merged.emergencyControversy.statementIssuedThisSession);
    merged.lastCausalNotes = Array.isArray(raw.lastCausalNotes) ? raw.lastCausalNotes.slice(0, 4) : defaults.lastCausalNotes;
    merged.metricBaselines = raw.metricBaselines && typeof raw.metricBaselines === "object"
      ? { ...defaults.metricBaselines, ...raw.metricBaselines }
      : defaults.metricBaselines;

    merged.escalationIndex = clamp(merged.escalationIndex || defaults.escalationIndex);
    merged.escalationStage = stageForState(merged);
    merged.leadership = clamp(merged.leadership || defaults.leadership);
    const scenarioRoles = getLeadersForScenario(merged.scenarioId);
    const restoredRole = scenarioRoles.find((item) => item.id === raw.roleId) || scenarioRoles[0];
    merged.roleId = restoredRole.id;
    merged.roleName = restoredRole.name;
    merged.sessionEndsAt = merged.onboardingComplete ? (raw.sessionEndsAt || defaults.sessionEndsAt) : null;
    merged.analysisWindowEndsAt = raw.analysisWindowEndsAt || defaults.analysisWindowEndsAt;
    merged.meetingUsed = Boolean(raw.meetingUsed);
    merged.meetingActive = Boolean(raw.meetingActive);
    merged.meetingEndsAt = raw.meetingEndsAt || defaults.meetingEndsAt;
    merged.meetingStartedAt = raw.meetingStartedAt || null;
    merged.boardroomClockPause = raw.boardroomClockPause || null;
    merged.sessionReportShown = Boolean(raw.sessionReportShown);
    merged.dismissed = Boolean(raw.dismissed);
    merged.dismissalReason = raw.dismissalReason || defaults.dismissalReason;
    merged.dismissalAt = raw.dismissalAt || defaults.dismissalAt;
    merged.redLineViolations = Number.isFinite(raw.redLineViolations) ? raw.redLineViolations : defaults.redLineViolations;
    const rawTolerance = Number.isFinite(raw.toleranceLoad) ? raw.toleranceLoad : defaults.toleranceLoad;
    merged.toleranceLoad = safeScenarioId === BUSINESS_SCENARIO_ID && rawVersion < defaults.version
      ? clamp(Math.round(rawTolerance / 2), 0, BOARD_TOLERANCE_MAX)
      : clamp(rawTolerance, 0, toleranceMaximum(merged));
    merged.accountabilityNote = raw.accountabilityNote || defaults.accountabilityNote;
    window.SecondOrderSessionClock.restore(merged);
    if (merged.emergencyControversy.active && !merged.emergencyControversy.current?.journey) window.SecondOrderEmergencyFlow.begin(merged, Date.now(), true);
    if (merged.emergencyControversy.current?.journey && !merged.emergencyClockPause && emergencyBlocked(merged) && !merged.dismissed && !merged.sessionReportShown) {
      merged.emergencyClockPause = { remainingMs: window.SecondOrderSessionClock.remaining(merged), startedAt: new Date().toISOString(), analysisRemainingMs: 0 };
    }
    finalizeEmergencyOutcome(merged, window.SecondOrderEmergencyFlow.advance(merged));
    merged.strategicAttackOnIndia = Boolean(raw.strategicAttackOnIndia);
    merged.justifiedRetaliationUntil = raw.justifiedRetaliationUntil || defaults.justifiedRetaliationUntil;
    merged.outcomeSummary = raw.outcomeSummary || defaults.outcomeSummary;
    merged.outcomeText = raw.outcomeText || defaults.outcomeText;
    merged.liveFeedSummary = raw.liveFeedSummary || defaults.liveFeedSummary;
    return merged;
  }

  function showSetupStage(stage) {
    const showIntro = stage === "intro";
    const showSetup = stage === "setup";
    const showBrief = stage === "brief";
    const showSim = stage === "simulation";
    const showReport = stage === "report";

    els.entryFlow.classList.toggle("hidden", showSim || showReport);
    els.introScreen.classList.toggle("hidden", !showIntro);
    els.setupScreen.classList.toggle("hidden", !showSetup);
    els.caseBriefScreen.classList.toggle("hidden", !showBrief);
    els.simulationShell.classList.toggle("hidden", !showSim);
    els.sessionReportPanel.classList.toggle("hidden", !showReport);
  }

  function updateResumeButton() {
    els.resumeSavedBtn.disabled = !hasSavedCampaign;
    els.resumeSavedBtn.textContent = hasSavedCampaign ? "Resume Saved Simulation" : "No Saved Simulation Found";
  }

  function populateLeaderSelect() {
    const scenarioId = els.scenarioSelect.value || state.scenarioId || DEFAULT_SCENARIO_ID;
    const leaders = getLeadersForScenario(scenarioId);
    els.leaderSelect.innerHTML = leaders.map((leader) => `<option value="${leader.id}">${leader.name}</option>`).join("");
    const currentLeader = leaders.find((leader) => leader.id === state.roleId) || leaders[0];
    els.leaderSelect.value = currentLeader.id;
    updateLeaderDescription();
  }

  function populateScenarioSelect() {
    els.scenarioSelect.innerHTML = SCENARIOS.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    els.scenarioSelect.value = validScenarioId(state.scenarioId);
    updateScenarioDescription();
    populateLeaderSelect();
  }

  function updateLeaderDescription() {
    const leaders = getLeadersForScenario(els.scenarioSelect.value || state.scenarioId);
    const leader = leaders.find((item) => item.id === els.leaderSelect.value) || leaders[0];
    els.leaderDescription.textContent = leader.description;
  }

  function getOpeningCaseBrief(scenarioId) {
    const briefs = {
      mumbai_terror: {
        title: "Mumbai Terror Aftermath",
        steps: [
          {
            eyebrow: "Situation",
            title: "What this case is about",
            body: "You enter immediately after a major urban terror attack. Public anger is high, intelligence remains incomplete, markets are nervous, and pressure for visible retaliation is building.",
            points: ["Incomplete intelligence", "High public pressure", "Escalation risk"],
            cue: "Your first challenge is to separate what is known from what is politically urgent.",
          },
          {
            eyebrow: "Mandate",
            title: "What you are responsible for",
            body: "Protect citizens and prevent follow-on attacks while preserving legal and democratic legitimacy. You must manage public emotion without allowing short-term pressure to trigger uncontrolled regional escalation.",
            points: ["Protect lives", "Preserve legitimacy", "Maintain strategic control"],
            cue: "A strong response must remain executable, proportionate, and defensible after the immediate crisis passes.",
          },
          {
            eyebrow: "Decision Rules",
            title: "How your choices will work",
            body: "Choose one or two compatible actions in each decision cycle. Every move affects security, diplomacy, markets, institutional confidence, public sentiment, and delayed reactions from other actors.",
            points: ["Read risk and legality", "Expect delayed effects", "Avoid optimizing one metric"],
            cue: "The most forceful option is not automatically the most effective option.",
          },
          {
            eyebrow: "Navigation",
            title: "Where to find what you need",
            body: "Use Command for decisions, Status for live conditions and timers, Briefing for intelligence, Operations for posture, and Impact for domestic, global, and economic consequences.",
            points: ["Command: act", "Status and Briefing: assess", "Impact: learn"],
            cue: "The next orientation will guide you through these pages before the timer starts.",
          },
        ],
      },
      secondorder_business: {
        title: "boAt Limited Business Case",
        steps: [
          {
            eyebrow: "Situation",
            title: "What this case is about",
            body: "You take control of boAt during a strategic pressure window. Audio remains the strongest franchise, wearables are under pressure, margins are tight, and investors want a more credible path to focused growth.",
            points: ["Strong audio franchise", "Wearables under pressure", "Investor scrutiny"],
            cue: "The company still has momentum, but weak sequencing can quickly turn growth into margin and execution stress.",
          },
          {
            eyebrow: "Mandate",
            title: "What you are responsible for",
            body: "Defend the brand while improving margin discipline, portfolio quality, service reliability, and channel economics. Your broader mandate is to create an operating story that can withstand board and IPO-level scrutiny.",
            points: ["Protect brand strength", "Repair operating fundamentals", "Build credible growth"],
            cue: "You are balancing commercial growth with the evidence needed to make that growth believable.",
          },
          {
            eyebrow: "Decision Rules",
            title: "How your choices will work",
            body: "Choose one or two compatible actions per decision cycle. Outcomes depend on cash health, service and supply readiness, previous choices, market pressure, stakeholder confidence, and delayed second-order effects.",
            points: ["Check readiness", "Respect trade-offs", "Expect diminishing returns"],
            cue: "A decision that works in a healthy company may fail when capacity or cash falls below a safe threshold.",
          },
          {
            eyebrow: "Navigation",
            title: "Where to find what you need",
            body: "Use Strategy Desk to act, Strategy Room to manage emergencies, Scorecards to diagnose company health, and the Boardroom Meeting to pressure-test one critical assumption before committing.",
            points: ["Scorecards: diagnose", "Strategy Desk: decide", "Boardroom: challenge assumptions"],
            cue: "The next orientation will take you through each workspace before the seven-minute timer begins.",
          },
        ],
      },
    };
    return briefs[scenarioId] || briefs.mumbai_terror;
  }

  function renderOpeningCaseBrief() {
    if (!els.caseBrief) return;
    const brief = getOpeningCaseBrief(els.scenarioSelect.value || state.scenarioId);
    const leaders = getLeadersForScenario(els.scenarioSelect.value || state.scenarioId);
    const leader = leaders.find((item) => item.id === els.leaderSelect.value) || leaders[0];
    const steps = brief.steps;
    caseBriefStep = Math.max(0, Math.min(caseBriefStep, steps.length - 1));
    const step = steps[caseBriefStep];
    els.caseBriefScenarioName.textContent = brief.title;
    const selectedScenarioId = els.scenarioSelect.value || state.scenarioId;
    els.caseBriefRoleName.textContent = `${selectedScenarioId === BUSINESS_SCENARIO_ID ? "Designation" : "Role"}: ${leader.name}`;
    els.caseBriefStepLabel.textContent = `Part ${caseBriefStep + 1} of ${steps.length}`;
    els.caseBriefPartNumber.textContent = String(caseBriefStep + 1).padStart(2, "0");
    els.caseBriefEyebrow.textContent = step.eyebrow;
    els.caseBriefTitle.textContent = step.title;
    els.caseBriefBody.innerHTML = `
      <p>${escapeHtml(step.body)}</p>
      <div class="case-brief-keypoints">${step.points.map((point) => `<span>${escapeHtml(point)}</span>`).join("")}</div>
    `;
    els.caseBriefCue.textContent = step.cue;
    [...els.caseBriefProgress.querySelectorAll("i")].forEach((dot, index) => dot.classList.toggle("active", index <= caseBriefStep));
    els.caseBriefPreviousBtn.classList.toggle("hidden", caseBriefStep === 0);
    els.caseBriefNextBtn.classList.toggle("hidden", caseBriefStep === steps.length - 1);
    els.caseBriefContinueBtn.classList.toggle("hidden", caseBriefStep !== steps.length - 1);
    els.caseBrief.classList.remove("brief-enter-forward", "brief-enter-back");
    void els.caseBrief.offsetWidth;
    els.caseBrief.classList.add(caseBriefDirection === "back" ? "brief-enter-back" : "brief-enter-forward");
  }

  function openCaseBrief() {
    caseBriefStep = 0;
    caseBriefDirection = "forward";
    showSetupStage("brief");
    renderOpeningCaseBrief();
    setStatus("Case brief ready. Review all four parts before orientation.");
  }

  function updateScenarioDescription() {
    const scenario = SCENARIOS.find((item) => item.id === els.scenarioSelect.value) || SCENARIOS[0];
    els.scenarioDescription.textContent = scenario.description;
    renderOpeningCaseBrief();
    populateLeaderSelect();
  }

  function applySelectedLeader() {
    const leaders = getLeadersForScenario(els.scenarioSelect.value || state.scenarioId);
    const leader = leaders.find((item) => item.id === els.leaderSelect.value) || leaders[0];
    state.roleId = leader.id;
    state.roleName = leader.name;
    state.pmName = leader.name;
  }

  function renderRoleMeta() {
    els.roleMeta.textContent = `${isBusinessScenario(state) ? "Designation" : "Role"}: ${state.roleName}`;
  }

  function onboardingSteps() {
    if (!isBusinessScenario(state)) {
      return [
        { page: "command", target: "#optionsWrap", title: "Command", body: "Choose one or two compatible actions. Read the risk and legality details before implementing a decision.", cue: "After acting, use the consequence chain to identify direct and delayed effects." },
        { page: "operations", target: "#operationsPanel", title: "Operations", body: "Use this page to understand active operational posture and emergency-response capabilities.", cue: "Operational information supports the main decision; it does not replace a command choice." },
        { page: "impact", target: "#standardImpactTabs", title: "Impact", body: "Review domestic, world, and economic effects together rather than optimizing one parameter in isolation.", cue: "Compare direction and trade-offs after every major decision." },
        { page: "command", target: "#boardroomMeetingNavBtn", title: "Emergency Meeting", body: "Use the one-time consultation to pressure-test a difficult assumption before you act.", cue: "The session timer remains paused until you select Start Playing." },
      ];
    }
    return [
      {
        page: "command",
        target: "#optionsWrap",
        title: "Strategy Desk",
        body: "This is where decisions are made. Review the categories, select up to two compatible choices, then use Implement Decision. The consequence chain below records what changed and why.",
        cue: "Do not choose only by the most attractive immediate outcome; check risk, fit, and second-order effects.",
      },
      {
        page: "operations",
        target: "#strategyRoomBoardroomVisual",
        title: "Strategy Room",
        body: "This room activates when an emergency situation emerges. It combines the incident brief, pressure indicators, public-statement choices, and major strategic calls.",
        cue: "Use it when the simulation signals a controversy; otherwise keep making normal decisions from the Strategy Desk.",
      },
      {
        page: "impact",
        target: "#businessKpiGrid",
        title: "Scorecards: core indicators",
        body: "<ul><li><strong>Revenue Momentum</strong> tracks demand and sales direction.</li><li><strong>Board Confidence</strong> reflects focus, governance, and execution credibility.</li><li><strong>Consumer Trust</strong> reflects product, service, and promise reliability.</li><li><strong>Margin Health</strong> shows the economic room left after your choices.</li></ul>",
        cue: "A higher number is not automatically healthy if another critical measure is falling sharply.",
      },
      {
        page: "impact",
        target: "#performanceTrendCard",
        title: "How to read Performance Trend",
        body: "Each point shows the position after a recorded decision. If Decision 1 moves 60 to 52 and Decision 2 moves it to 56, the second move is a recovery, but performance is still below the starting point.",
        cue: "Read direction, size, and consistency together. Mixed lines indicate a trade-off that needs investigation, not an automatic failure.",
      },
      {
        page: "command",
        target: "#boardroomMeetingNavBtn",
        title: "Boardroom Meeting",
        body: "This one-time consultation lasts up to three minutes. Your main simulation timer pauses while you challenge assumptions, and resumes when you leave or the meeting ends.",
        cue: "One final step: establish your priorities from the current scorecard before making the first move.",
      },
      {
        page: "command",
        target: "#priorityModeDetails",
        title: "Set your first priorities",
        body: "<ol><li>You have reviewed the Scorecards and current baseline.</li><li>Identify where the company is strongest and where pressure is already visible.</li><li>Use Priorities here to pin up to three parameters you want to influence first.</li><li>Choose decisions that support those priorities without ignoring their trade-offs.</li></ol>",
        cue: "One final orientation step will bring the whole Scorecards page together before the timer starts.",
      },
      {
        page: "impact",
        target: "#businessScorecardPanel",
        title: "Your operating picture",
        body: "<p>This is the company's current situation. Analyze it, choose the priority areas you want to improve, then go to Strategy Desk to make your first move.</p>",
        cue: "You can return to Scorecards at any time to track progress and reassess your priorities.",
      },
    ];
  }

  function positionTourCoachmark(scrollTarget = false) {
    if (els.onboardingPanel.classList.contains("hidden")) return;
    const step = onboardingSteps()[onboardingStep];
    const target = document.querySelector(step && step.target) || els.simulationNav;
    if (!target) return;
    if (scrollTarget) target.scrollIntoView({ block: "center", inline: "nearest" });

    const place = () => {
      const rect = target.getBoundingClientRect();
      const pad = 7;
      const top = Math.max(8, rect.top - pad);
      const left = Math.max(8, rect.left - pad);
      const right = Math.min(window.innerWidth - 8, rect.right + pad);
      const bottom = Math.min(window.innerHeight - 8, rect.bottom + pad);
      els.tourSpotlight.style.cssText = `top:${top}px;left:${left}px;width:${Math.max(24, right - left)}px;height:${Math.max(24, bottom - top)}px;`;

      const coach = els.tourCoachmark;
      coach.classList.remove("coach-right", "coach-left", "coach-above", "coach-below", "coach-floating");
      coach.style.removeProperty("top");
      coach.style.removeProperty("right");
      coach.style.removeProperty("bottom");
      coach.style.removeProperty("left");
      const coachRect = coach.getBoundingClientRect();
      const gap = 18;
      const margin = 14;
      const roomRight = window.innerWidth - right;
      const roomLeft = left;
      const roomBelow = window.innerHeight - bottom;
      const roomAbove = top;

      if (roomRight >= coachRect.width + gap) {
        coach.classList.add("coach-right");
        coach.style.left = `${right + gap}px`;
        coach.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - coachRect.height - margin))}px`;
      } else if (roomLeft >= coachRect.width + gap) {
        coach.classList.add("coach-left");
        coach.style.left = `${left - coachRect.width - gap}px`;
        coach.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - coachRect.height - margin))}px`;
      } else if (roomBelow >= coachRect.height + gap) {
        coach.classList.add("coach-below");
        coach.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - coachRect.width - margin))}px`;
        coach.style.top = `${bottom + gap}px`;
      } else if (roomAbove >= coachRect.height + gap) {
        coach.classList.add("coach-above");
        coach.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - coachRect.width - margin))}px`;
        coach.style.top = `${top - coachRect.height - gap}px`;
      } else {
        coach.classList.add("coach-floating");
        coach.style.right = `${margin}px`;
        coach.style.bottom = `${margin}px`;
      }
    };

    if (tourPositionRaf) window.cancelAnimationFrame(tourPositionRaf);
    tourPositionRaf = window.requestAnimationFrame(() => {
      place();
      window.setTimeout(place, scrollTarget ? 180 : 0);
    });
  }

  function renderOnboarding() {
    const steps = onboardingSteps();
    onboardingStep = Math.max(0, Math.min(onboardingStep, steps.length - 1));
    const step = steps[onboardingStep];
    activeSimulationPage = step.page;
    renderAll();
    if (step.target === "#priorityModeDetails") els.priorityModeDetails.open = true;
    [...els.onboardingProgress.querySelectorAll("i")].forEach((dot, index) => {
      dot.classList.toggle("hidden", index >= steps.length);
      dot.classList.toggle("active", index <= onboardingStep && index < steps.length);
    });
    els.onboardingStepLabel.textContent = `Guided tour ${onboardingStep + 1} of ${steps.length}`;
    els.onboardingTitle.textContent = step.title;
    els.onboardingBody.innerHTML = step.body;
    els.onboardingCue.textContent = step.cue;
    els.onboardingBackBtn.classList.toggle("hidden", onboardingStep === 0);
    els.onboardingNextBtn.classList.toggle("hidden", onboardingStep === steps.length - 1);
    els.onboardingStartBtn.classList.toggle("hidden", onboardingStep !== steps.length - 1);
    positionTourCoachmark(true);
  }

  function openOnboarding() {
    onboardingStep = 0;
    state.onboardingComplete = false;
    state.sessionEndsAt = null;
    state.analysisWindowEndsAt = null;
    dynamicEngineOn = false;
    els.tickToggleBtn.textContent = "Dynamic Engine: Paused";
    els.onboardingPanel.classList.remove("hidden");
    renderOnboarding();
  }

  function beginOnboardingRun(statusText) {
    selectedOptionIds.clear();
    deskView.category = null;
    deskView.compare = false;
    deskView.visited.clear();
    hubView.roundId = null;
    hubView.visible = {};
    hubView.inspector = null;
    activeSimulationPage = "command";
    showSetupStage("simulation");
    renderAll();
    openOnboarding();
    saveState();
    setStatus(statusText || "Orientation ready. The timer has not started.");
  }

  function startPlaying() {
    state.onboardingComplete = true;
    state.firstDecisionNudgeDismissed = false;
    ensureSessionClock(state, true);
    dynamicEngineOn = true;
    els.tickToggleBtn.textContent = "Dynamic Engine: On";
    els.onboardingPanel.classList.add("hidden");
    activeSimulationPage = isBusinessScenario(state) ? "impact" : "command";
    renderAll();
    saveState();
    setStatus(isBusinessScenario(state)
      ? "Simulation started. Assess the Scorecards, then use Strategy Desk for your first decision."
      : "Simulation started. Seven-minute decision window active.");
  }

  function launchConfiguredSimulation() {
    const id = els.scenarioSelect.value;
    state = baseState(id);
    state.scenarioId = id;
    applySelectedLeader();
    state.sessionReportShown = false;
    openCaseBrief();
  }

  function resumeSavedSimulation() {
    const loaded = loadState();
    if (!loaded) {
      hasSavedCampaign = false;
      updateResumeButton();
      setStatus("No saved simulation found.", true);
      return;
    }

    state = normalizeState(loaded);
    if (state.onboardingComplete) ensureSessionClock(state);
    dynamicEngineOn = Boolean(state.onboardingComplete);
    els.tickToggleBtn.textContent = state.onboardingComplete ? "Dynamic Engine: On" : "Dynamic Engine: Paused";
    selectedOptionIds.clear();
    activeSimulationPage = "command";
    populateScenarioSelect();
    populateLeaderSelect();
    renderAll();
    if (state.dismissed || state.sessionReportShown) {
      if (state.dismissed && !state.sessionReportShown) {
        openSessionReport();
      } else {
        renderSessionReport();
        showSetupStage("report");
        setStatus(state.dismissed ? state.dismissalReason : "Saved session report restored.", state.dismissed);
        saveState();
      }
      return;
    }
    showSetupStage("simulation");
    if (!state.onboardingComplete) {
      openOnboarding();
      renderAll();
      setStatus("Saved orientation resumed. The timer has not started.");
    } else {
      setStatus("Saved simulation resumed.");
    }
  }

  function openSetupFromSimulation() {
    populateScenarioSelect();
    populateLeaderSelect();
    showSetupStage("setup");
    setStatus("Adjust role or scenario, then relaunch the simulation.");
  }

  function applyScenarioSelection() {
    const id = validScenarioId(state.scenarioId || DEFAULT_SCENARIO_ID);
    const leaders = getLeadersForScenario(id);
    const roleId = state.roleId || leaders[0].id;
    const role = leaders.find((item) => item.id === roleId) || leaders[0];
    state = baseState(id);
    state.scenarioId = id;
    state.roleId = role.id;
    state.roleName = role.name;
    state.pmName = role.name;
    state.sessionReportShown = false;
    populateLeaderSelect();
    populateScenarioSelect();
    const scenarioObj = SCENARIOS.find((s) => s.id === id);
    beginOnboardingRun(`Scenario reloaded: ${scenarioObj ? scenarioObj.name : id}. Complete orientation to begin.`);
  }

  function connectSaveFile() {
    if (!window.showSaveFilePicker) {
      setStatus("File save API not available in this browser. Local save remains active.", true);
      return;
    }

    window
      .showSaveFilePicker({
        suggestedName: "secondorder_state.json",
        types: [{ description: "JSON Save", accept: { "application/json": [".json"] } }],
      })
      .then((handle) => {
        connectedFileHandle = handle;
        saveState();
        setStatus("File save connected.");
      })
      .catch(() => {
        setStatus("File save connection cancelled.", true);
      });
  }

  function exportSave() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `secondorder_turn_${state.turn}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Save exported.");
  }

  function importSave(file) {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text);
        state = normalizeState(parsed);
        if (state.onboardingComplete) ensureSessionClock(state);
        dynamicEngineOn = Boolean(state.onboardingComplete);
        els.tickToggleBtn.textContent = state.onboardingComplete ? "Dynamic Engine: On" : "Dynamic Engine: Paused";
        selectedOptionIds.clear();
        activeSimulationPage = "command";
        hasSavedCampaign = true;
        updateResumeButton();
        populateLeaderSelect();
        populateScenarioSelect();
        renderAll();
        saveState();
        if (state.dismissed || state.sessionReportShown) {
          renderSessionReport();
          showSetupStage("report");
          setStatus(state.dismissed ? state.dismissalReason : "Save imported with completed report.", state.dismissed);
        } else {
          showSetupStage("simulation");
          if (!state.onboardingComplete) {
            openOnboarding();
            renderAll();
            setStatus("Save imported. Complete orientation to begin the timer.");
          } else {
            setStatus("Save imported successfully.");
          }
        }
      })
      .catch(() => {
        setStatus("Invalid save file.", true);
      });
  }

  function openEmergencyMeeting() {
    if (emergencyBlocked()) return;
    if (!state.onboardingComplete) return;
    if (!window.SecondOrderSessionClock.startMeeting(state)) return;
    state.meetingChat = [];
    state.meetingRounds = [];
    boardroomEntering = true;

    renderAll();
    saveState();
    window.setTimeout(() => {
      if (!meetingActive(state)) return;
      boardroomEntering = false;
      els.boardroomTransition.classList.add("hidden");
      els.boardroomWorkspace.classList.remove("hidden");
      els.meetingInput.focus();
    }, 1100);
    setStatus("Boardroom opened. Main timer paused; three-minute consultation active. You may leave early.");
  }

  function openMeetingFromNavigation() {
    activeSimulationPage = "command";
    if (!meetingActive(state)) openEmergencyMeeting();
    else {
      boardroomEntering = false;
      renderAll();
      requestAnimationFrame(() => els.meetingInput.focus());
    }
  }

  function closeEmergencyMeeting(reasonText = "Emergency meeting closed.") {
    boardroomEntering = false;
    boardroomRequestController?.abort();
    window.SecondOrderSessionClock.endMeeting(state);
    renderAll();
    saveState();
    setStatus(reasonText);
  }

  function rebuildMeetingRoundsFromChat(chat) {
    if (!Array.isArray(chat) || !chat.length) return [];
    const rounds = [];
    let currentRound = null;

    chat.forEach((entry) => {
      if (!entry || !entry.speaker) return;

      if (entry.speaker === "You") {
        currentRound = {
          id: entry.id || `mr-${Math.random().toString(36).slice(2, 9)}`,
          prompt: entry.text || "",
          time: entry.time || null,
          responses: [],
        };
        rounds.push(currentRound);
        return;
      }

      if (!currentRound) {
        currentRound = {
          id: `mr-${Math.random().toString(36).slice(2, 9)}`,
          prompt: "Recovered exchange",
          time: null,
          responses: [],
        };
        rounds.push(currentRound);
      }

      currentRound.responses.push({
        name: entry.speaker,
        text: entry.text || "",
      });
    });

    return rounds.slice(-6);
  }

  function detectMeetingIntent(prompt) {
    const assessment = assessStrategicInput(prompt, "meeting");
    const lower = prompt.toLowerCase();
    const seriousKeywords = /\b(nuclear|nuke|atomic|warhead|assassinat|kill|eliminat|airstrike|strike|missile|bomb|raid|attack|artillery|special forces|commando|cyber|hack|malware|grid|radar|network|satellite|signal|diplomac|fatf|sanction|coalition|treaty|mediate|econom|market|rupee|stock|oil|inflation|fiscal|rbi|jobs|trade|public|media|parliament|protest|election|riot|communal|panic|legal|law|evidence|court|border|terror|china|pakistan|army|navy|air force|hamla|yudh|jung|bazaar|arthvyavastha|seema|sena|fauj|suraksha)\b/;
    const businessKeywords = /\b(boat|audio|earbud|earphone|headphone|speaker|tws|smartwatch|wearable|anc|nirvana|premium|asp|portfolio|sku|product|roadmap|quality|warranty|service|pricing|revenue|margin|profit|discount|marketplace|amazon|flipkart|d2c|retail|offline|dealer|distributor|channel|customer|consumer|youth|brand|campaign|celebrity|influencer|creator|cricket|ipl|manufactur|supplier|supply chain|inventory|investor|ipo|category|competition|competitor|competitors|acquire|acquisition|merger|m&a|takeover|noise|fire-boltt|boult|jbl|business|strategy)\b/;
    const offTopicPattern = /\b(god|bhagwan|allah|jesus|religion|horoscope|astrology|girlfriend|boyfriend|dating|marry|wedding|song|movie|cricket score|football|lunch|dinner|vacation|holiday)\b/;
    const philosophicalPattern = /\b(am i god|who am i|meaning of life|why are we here|kya mai.*bhagwan|kya main.*bhagwan|mai.*bhagwan|main.*bhagwan|bhagwan hun|bhagwan hoon)\b/;
    const unseriousPattern = /\b(7\s?up|soda|soft drink|coke|pepsi|sprite|fanta|potato|banana|shoe|slipper|spoon|pillow|dragon|alien|meme|joke|cricket bat)\b/;

    return {
      lower,
      assessment,
      absurd: assessment.category === "absurd_instrument" || unseriousPattern.test(lower),
      irrelevant: assessment.category === "irrelevant" || offTopicPattern.test(lower) || philosophicalPattern.test(lower),
      philosophical: philosophicalPattern.test(lower),
      serious: seriousKeywords.test(lower) || businessKeywords.test(lower),
      business: businessKeywords.test(lower),
      product: /audio|earbud|earphone|headphone|speaker|smartwatch|wearable|anc|nirvana|premium|product|portfolio|sku|roadmap|quality/.test(lower),
      sales: /retail|offline|dealer|distributor|marketplace|amazon|flipkart|d2c|sales|channel|customer|consumer|campaign|brand|celebrity|influencer|creator/.test(lower),
      pricing: /price|pricing|revenue|margin|profit|discount|free|sale|bundle|cashback|asp|ipo|valuation/.test(lower),
      trust: /warranty|service|return|replacement|quality|defect|complaint|trust|review|governance|manufactur|supplier|supply chain/.test(lower),
      focus: /all categor|every sku|all markets|everything|at once|simultaneously|price war|flood|aggressive acquisition|large rival|buy market share/.test(lower),
      unethical: /fake|fabricat|mislead|inflate|lie|false claim|fake traction|fake revenue|manipulat|hide defect|fake review/.test(lower),
      nuclear: /\b(nuclear|nuke|atomic|warhead|hydrogen bomb)\b/.test(lower),
      assassination: /assassinat|kill\s+(the\s+)?(prime minister|president|leader)|eliminat(e|ing)\s+(the\s+)?(prime minister|president|leader)/.test(lower),
      kinetic: /airstrike|strike|missile|bomb|raid|invasion|attack|artillery|special forces|commando|hamla|yudh|jung/.test(lower),
      cyber: /cyber|hack|malware|grid|radar|network|satellite|signal/.test(lower),
      diplomacy: /diplomac|un\b|fatf|sanction|coalition|backchannel|embassy|treaty|mediate/.test(lower),
      economy: /econom|market|rupee|stock|oil|inflation|fiscal|rbi|jobs|trade|bazaar|arthvyavastha/.test(lower),
      domestic: /public|media|parliament|protest|election|riot|communal|panic|janata|danga|ghabrahat/.test(lower),
      legality: /legal|law|evidence|international law|court|un charter|legitimate/.test(lower),
    };
  }

  function meetingSnapshot() {
    return {
      escalation: state.escalationStage,
      border: state.threats.BorderTension,
      terror: state.threats.TerrorThreat,
      markets: state.economy.StockIndex,
      rupee: state.economy.CurrencyValue,
      panic: state.sentiment.PanicLevel,
      diplomacy: state.stats.DiplomaticStanding,
      readiness: state.stats.MilitaryReadiness,
      productReadiness: state.stats.NationalSecurity,
      runway: state.stats.FiscalHealth,
      buyerConfidence: state.systems.MarketConfidence,
      platformReliability: state.systems.InfrastructureIntegrity,
      productDebt: state.threats.PollutionCrisis,
      positioningConfusion: state.threats.DisinformationRisk,
    };
  }

  function meetingMetricLine(advisorId, intent, snapshot) {
    if (intent.kinetic || intent.nuclear || intent.assassination) {
      if (advisorId === "finance") return `Markets are ${snapshot.markets}/100 and the rupee is ${snapshot.rupee}/100.`;
      if (advisorId === "home") return `Public panic is ${snapshot.panic}/100.`;
      if (advisorId === "defence" || advisorId === "army" || advisorId === "air" || advisorId === "navy") return `Readiness is ${snapshot.readiness}/100 and border tension is ${snapshot.border}/100.`;
    }

    if (intent.cyber) {
      if (advisorId === "finance") return `Banks and payments will feel it immediately.`;
      if (advisorId === "home") return `If services fail in cities, the public reaction will be immediate.`;
    }

    if (intent.diplomacy || intent.economy || intent.legality) {
      if (advisorId === "external") return `Diplomatic standing is ${snapshot.diplomacy}/100.`;
      if (advisorId === "finance") return `Markets are fragile but still manageable.`;
    }

    return "";
  }

  function irrelevantMeetingResponse(advisor, prompt, intent) {
    const leader = addressLeader();
    const redirect = intent.philosophical
      ? "That is a philosophical question, not a crisis-room question."
      : "That is not relevant to the meeting.";

    const replies = {
      defence: `${leader}, ${redirect} Give me a real military question.`,
      finance: `${leader}, ${redirect} We should stay on markets, state capacity, or escalation.`,
      home: `${leader}, ${redirect} We need to stay on public order and threat control.`,
      external: `${leader}, ${redirect} We should stay on policy.`,
      raw: `${leader}, ${redirect} Intelligence cannot act on that.`,
      nsa: `${leader}, ${redirect} Let us return to the actual decision.`,
      army: `${leader}, ${redirect} The Army needs executable direction.`,
      air: `${leader}, ${redirect} Ask the operational question directly.`,
      navy: `${leader}, ${redirect} Ask what posture you want at sea.`,
    };

    return replies[advisor.id] || `${leader}, ${redirect} We should return to the agenda.`;
  }

  function absurdMeetingResponse(advisor) {
    const leader = addressLeader();
    const shared = `${leader}, that is not a serious instrument of state power.`;
    const replies = {
      defence: `${shared} Ask about force posture or a limited strike if that is the real issue.`,
      finance: `${shared} The market reads that as instability.`,
      home: `${shared} It weakens authority in a live crisis.`,
      external: `${shared} No serious government would treat that as policy.`,
      raw: `${shared} Give me a real target or there is nothing to assess.`,
      nsa: `${shared} Let me bring the room back to the decision at hand.`,
      army: `${shared} The Army needs orders and objectives, not symbolism.`,
      air: `${shared} Ask for a real signaling option and I will answer it.`,
      navy: `${shared} Maritime action needs a real purpose.`,
    };
    return replies[advisor.id] || `${shared} We should restate the objective and choose a real instrument.`;
  }

  function nuclearMeetingResponse(advisor) {
    const snapshot = meetingSnapshot();
    const leader = addressLeader();
    const shared = `${leader}, nuclear use would likely trigger retaliation within minutes.`;
    const replies = {
      defence: `${shared} My advice is simple: do not cross that line.`,
      finance: `${shared} Markets and the rupee would break first. ${meetingMetricLine("finance", { nuclear: true, kinetic: true }, snapshot)}`,
      home: `${shared} Civil defense would be overwhelmed. ${meetingMetricLine("home", { nuclear: true, kinetic: true }, snapshot)}`,
      external: `${shared} Expect emergency UN action and rapid diplomatic isolation.`,
      raw: `${shared} Intelligence cannot remove doctrine or miscalculation risk.`,
      nsa: `${shared} Strengthen deterrence and off-ramps instead of discussing first use.`,
      army: `${shared} Forward formations would become retaliation targets.`,
      air: `${shared} Air bases and cities would enter target packages immediately.`,
      navy: `${shared} Ports and sea lanes would be at direct risk as well.`,
    };
    return replies[advisor.id] || shared;
  }

  function assassinationMeetingResponse(advisor) {
    const leader = addressLeader();
    const shared = `${leader}, assassinating a foreign leader is illegal and strategically reckless.`;
    const replies = {
      defence: `${shared} It creates an escalation problem without a stable end state.`,
      finance: `${shared} Markets would price India as a sanctions risk immediately.`,
      home: `${shared} Expect blowback and retaliatory plot risk at home.`,
      external: `${shared} We would lose the legal high ground immediately.`,
      raw: `${shared} That is not how intelligence creates durable advantage.`,
      nsa: `${shared} Use controllable legal tools instead.`,
      army: `${shared} It could easily produce a harsher military response.`,
      air: `${shared} It would trigger retaliation cycles without a clean objective.`,
      navy: `${shared} We would then manage escalation at sea as well.`,
    };
    return replies[advisor.id] || shared;
  }

  function businessMeetingResponse(advisor, prompt, intent) {
    const snapshot = meetingSnapshot();
    const leader = addressLeader();

    if (intent.nuclear || intent.assassination || intent.kinetic) {
      const shared = `${leader}, that is outside a legitimate business-case decision.`;
      const replies = {
        ceo: `${shared} Bring the question back to product portfolio, brand, pricing, channels, service, or manufacturing.` ,
        cfo: `${shared} It creates meaningless risk and zero shareholder logic.` ,
        product: `${shared} A consumer-tech portfolio is fixed through product choices, not violence.` ,
        marketing: `${shared} That would destroy brand credibility, not build culture.` ,
        ecommerce: `${shared} Marketplaces need pricing and supply discipline, not theatrics.` ,
        retail: `${shared} Retail partners would treat that as unserious leadership.` ,
        ops: `${shared} Give me an executable supply, quality, or service operation.` ,
        investor: `${shared} A board would stop this line of thinking immediately.` ,
      };
      return replies[advisor.id] || `${shared} Reframe it as a business trade-off.`;
    }

    if (intent.unethical) {
      const shared = `${leader}, hiding defects or inflating claims would damage boAt's consumer trust.`;
      const replies = {
        ceo: `${shared} Correct the issue and protect the brand before the market forces us to.` ,
        cfo: `${shared} Short-term sales from false claims can become warranty, legal, and IPO risk.` ,
        product: `${shared} Fix quality; do not ask marketing to cover product gaps.` ,
        marketing: `${shared} Fake reviews or exaggerated claims will backfire with young consumers.` ,
        ecommerce: `${shared} Marketplace ratings punish this quickly.` ,
        retail: `${shared} Retailers will demand compensation if returns spike.` ,
        ops: `${shared} Trace the defect, isolate affected SKUs, and clean the service pipeline.` ,
        investor: `${shared} Governance failure is worse than a weak quarter.` ,
      };
      return replies[advisor.id] || shared;
    }

    if (/acquire|acquisition|merger|m&a|takeover|competitor|competitors|rival/i.test(prompt)) {
      const replies = {
        ceo: `${leader}, I would not buy market share blindly. A small capability acquisition can help; a large rival acquisition risks distraction.`,
        cfo: `${leader}, acquisition only works if debt, integration cost, and margin dilution are capped before signing.`,
        product: `${leader}, buy technology or talent, not bloated SKU portfolios we will later have to clean up.`,
        marketing: `${leader}, acquiring a rival can confuse the brand unless the consumer story is very clear.`,
        ecommerce: `${leader}, marketplace overlap will create channel conflict unless we decide which SKUs survive.`,
        retail: `${leader}, dealers will ask whether acquired inventory gets pushed onto them. That risk is real.`,
        ops: `${leader}, integration will hit service centers, suppliers, and warranty workflows before it helps strategy.`,
        investor: `${leader}, the board will prefer disciplined capability M&A over a vanity takeover.`,
      };
      return replies[advisor.id] || replies.ceo;
    }

    if (intent.focus) {
      const replies = {
        ceo: `${leader}, fighting every category at once will dilute boAt. Pick the battles: audio leadership first, wearables selectively.` ,
        cfo: `${leader}, margin health is ${snapshot.runway}/100. A price war across SKUs can ruin the IPO story.` ,
        product: `${leader}, cut weak SKUs before launching more. Portfolio discipline beats noisy breadth.` ,
        marketing: `${leader}, too many categories blur the brand. Youth positioning needs one clear story.` ,
        ecommerce: `${leader}, marketplace volume may rise, but contribution margin can collapse.` ,
        retail: `${leader}, offline partners need stable winners, not endless inventory churn.` ,
        ops: `${leader}, supply chain resilience is ${state.systems.SupplyChainIntegrity}/100. More SKUs add service and inventory risk.` ,
        investor: `${leader}, the board will support focus over vanity shipment growth.` ,
      };
      return replies[advisor.id] || replies.ceo;
    }

    if (intent.product) {
      const replies = {
        ceo: `${leader}, premium audio is strategically safer than chasing every low-margin wearable segment.` ,
        cfo: `${leader}, product investment is justified if ASP and repeat purchase improve.` ,
        product: `${leader}, prioritize ANC, battery, durability, and fewer stronger SKUs. Product strength is ${snapshot.productReadiness}/100.` ,
        marketing: `${leader}, give me a product truth worth marketing; colorways alone will not defend premiumisation.` ,
        ecommerce: `${leader}, strong product pages and ratings will reduce dependence on discounts.` ,
        retail: `${leader}, retailers need clear hero products and fewer slow-moving variants.` ,
        ops: `${leader}, premium promises require stable components and tighter quality checks.` ,
        investor: `${leader}, differentiated audio supports valuation better than commodity smartwatch volume.` ,
      };
      return replies[advisor.id] || replies.product;
    }

    if (intent.sales || intent.pricing) {
      const replies = {
        ceo: `${leader}, do not confuse market share with strategic strength. Discount only where it protects the core.` ,
        cfo: `${leader}, pricing power is ${state.economy.CurrencyValue}/100. Set margin floors before festive offers go live.` ,
        product: `${leader}, if product differentiation is weak, discounts become permanent.` ,
        marketing: `${leader}, campaign spend should be tied to sales lift, brand recall, and margin impact.` ,
        ecommerce: `${leader}, marketplaces will ask for deeper deals. We should trade discounts for visibility only on hero SKUs.` ,
        retail: `${leader}, offline schemes need guardrails or dealers will train customers to wait for discounts.` ,
        ops: `${leader}, inventory planning must match channel promises or returns will spike.` ,
        investor: `${leader}, the board will tolerate slower growth if gross margin and cash conversion improve.` ,
      };
      return replies[advisor.id] || replies.cfo;
    }

    if (intent.trust) {
      const replies = {
        ceo: `${leader}, service quality is brand strategy now. Warranty pain can erase years of youth-brand goodwill.` ,
        cfo: `${leader}, service investment hurts near-term cost but protects returns, ratings, and repeat purchase.` ,
        product: `${leader}, returns data should feed the SKU roadmap immediately.` ,
        marketing: `${leader}, do not overclaim. Let improved reviews carry the brand story.` ,
        ecommerce: `${leader}, ratings and reviews are the conversion engine on marketplaces.` ,
        retail: `${leader}, faster replacements make dealers more willing to push boAt over rivals.` ,
        ops: `${leader}, set turnaround targets, spare-parts buffers, and defect tracking by SKU.` ,
        investor: `${leader}, this is exactly the operational discipline an IPO committee will examine.` ,
      };
      return replies[advisor.id] || replies.ops;
    }

    return `${leader}, tie the question to boAt's portfolio, premium audio, wearables, pricing, brand campaigns, D2C/marketplace/offline channels, service quality, manufacturing, or IPO-readiness. Otherwise the boardroom cannot give useful advice.`;
  }
  function policyMeetingResponse(advisor, prompt, intent) {
    const snapshot = meetingSnapshot();

    if (intent.kinetic) {
      const replies = {
        defence: `A strike only makes sense if it is limited and intelligence-backed. ${meetingMetricLine("defence", intent, snapshot)}`,
        finance: `Shield markets first if you do this. ${meetingMetricLine("finance", intent, snapshot)}`,
        home: `Expect a public-order test if retaliation follows. ${meetingMetricLine("home", intent, snapshot)}`,
        external: `Move only with evidence and immediate diplomatic calls.`,
        raw: `Do not go loud without cleaner confidence.`,
        nsa: `Define the objective, legal basis, and exit condition first.`,
        army: `Read this with likely border retaliation, not as a standalone strike.`,
        air: `Air options exist, but collateral risk and air defense matter.`,
        navy: `If this widens, trade-route security becomes a naval problem.`,
      };
      return replies[advisor.id] || replies.nsa;
    }

    if (intent.cyber) {
      const replies = {
        defence: `Cyber can help, but it is not risk-free.`,
        finance: `Banks and telecom will feel blowback first. ${meetingMetricLine("finance", intent, snapshot)}`,
        home: `If public services fail, the public will not care how elegant the operation was. ${meetingMetricLine("home", intent, snapshot)}`,
        external: `Keep defensive hardening separate from offensive messaging.`,
        raw: `Use cyber access only where the value justifies exposure.`,
        nsa: `Defend, attribute, harden, then disrupt if justified.`,
        army: `Cyber helps command links, but it does not replace readiness.`,
        air: `Assume immediate probing of radar and air-defense systems.`,
        navy: `Harden port and maritime systems in parallel.`,
      };
      return replies[advisor.id] || replies.nsa;
    }

    if (intent.diplomacy || intent.economy || intent.legality) {
      const replies = {
        defence: `Diplomacy works better if readiness is visible behind it.`,
        finance: `This is the most stabilizing lane available. ${meetingMetricLine("finance", intent, snapshot)}`,
        home: `Diplomacy will look weak unless internal security is visible.`,
        external: `This gives India legitimacy and coalition space. ${meetingMetricLine("external", intent, snapshot)}`,
        raw: `Use selective disclosure, not a full intelligence dump.`,
        nsa: `This path is slower, but much more controllable.`,
        army: `Restraint is fine, but forward positions cannot look exposed.`,
        air: `Raise air-defense readiness quietly, not theatrically.`,
        navy: `Surveillance and escort readiness can support diplomacy cleanly.`,
      };
      return replies[advisor.id] || replies.nsa;
    }

    if (intent.domestic) {
      const replies = {
        defence: `Do not run operations on television timelines.`,
        finance: `Panic becomes an economic problem very quickly.`,
        home: `The real danger is misinformation, communal tension, and police overload.`,
        external: `Domestic rhetoric will affect India abroad as well.`,
        raw: `Enemy information cells will exploit anger and confusion.`,
        nsa: `Keep the public line simple and disciplined.`,
        army: `Troop movement should not become political theatre.`,
        air: `Do not reveal operational detail for reassurance.`,
        navy: `Reassure commerce without exposing patrol patterns.`,
      };
      return replies[advisor.id] || replies.nsa;
    }

    return `${addressLeader()}, tighten the question. Ask directly about force, law, diplomacy, economy, or domestic control.`;
  }

  function generateMeetingReply(advisor, prompt) {
    const intent = detectMeetingIntent(prompt);
    if (intent.irrelevant && !intent.serious) return irrelevantMeetingResponse(advisor, prompt, intent);
    if (intent.absurd) return absurdMeetingResponse(advisor);
    if (isBusinessScenario(state)) return businessMeetingResponse(advisor, prompt, intent);
    if (intent.nuclear) return nuclearMeetingResponse(advisor);
    if (intent.assassination) return assassinationMeetingResponse(advisor);
    return policyMeetingResponse(advisor, prompt, intent);
  }

  function buildFallbackMeetingResponses(prompt) {
    return getAdvisorsForScenario(state).map((advisor) => ({
      name: advisor.name,
      text: generateMeetingReply(advisor, prompt),
    }));
  }

  function decisionMemoryLine(stateObj = state, limit = 6) {
    const reviews = Array.isArray(stateObj.decisionReviews) ? stateObj.decisionReviews.slice(-limit) : [];
    if (!reviews.length) return "No previous user decisions recorded.";
    return reviews
      .map((item) => `${item.time}: ${item.title} | ${item.domain}/${item.style} | risk ${item.risk}/100 | legality ${item.legality}/100 | outcome ${item.outcome} | escalation ${item.escalation}/100`)
      .join(" || ");
  }

  function meetingMemoryLine(stateObj = state, limit = 4) {
    const rounds = Array.isArray(stateObj.meetingRounds) ? stateObj.meetingRounds.slice(-limit) : [];
    if (!rounds.length) return "No earlier boardroom questions.";
    return rounds.map((round) => `${round.prompt || round.question || "Question"} -> ${(round.responses || []).slice(0, 2).map((entry) => `${entry.name}: ${entry.text}`).join(" / ")}`).join(" || ");
  }

  function buildOllamaSystemPrompt(prompt) {
    const scenario = SCENARIOS.find((item) => item.id === state.scenarioId);
    const snapshot = meetingSnapshot();
    const intent = detectMeetingIntent(prompt);
    const recentAlerts = state.alerts
      .slice(0, 5)
      .map((item) => `${item.time}: ${item.text}`)
      .join(" | ") || "No major alerts yet.";
    const advisors = getAdvisorsForScenario(state);
    const advisorList = advisors.map((advisor) => `${advisor.id}: ${advisor.name} (${advisor.personality})`).join("; ");

    return [
      isBusinessScenario(state)
        ? "You are the stakeholder-room engine for SecondOrder's boAt Limited business case simulation."
        : "You are the emergency meeting engine for SecondOrder, a realistic crisis simulation.",
      isBusinessScenario(state)
        ? "You must answer as boAt boardroom stakeholders: CEO, CFO, product, marketing, e-commerce, retail, supply chain, and investor voices."
        : "You must answer as multiple Indian crisis stakeholders, not as a generic chatbot.",
      "Return only valid JSON: an array of objects with id, name, and text. No markdown.",
      "Each text must be concise: one or two sentences, maximum 35 words.",
      "Be natural and direct. If the user's question is absurd or irrelevant, say so respectfully and redirect to the crisis.",
      "Do not provide operational instructions for real-world violence, assassination, terrorism, cyber abuse, or weapons use. Discuss strategic consequences and legal/political constraints at a high level.",
      "Do not invent facts beyond the scenario state below. If uncertain, say what must be verified.",
      `User role: ${state.roleName}. Address them according to this role, not always as Prime Minister.`,
      `Scenario: ${scenario ? scenario.name : state.scenarioId}.`,
      `Escalation: ${state.escalationStage} (${state.escalationIndex}/100).`,
      isBusinessScenario(state)
        ? `Business pressures: competitive ${state.threats.BorderTension}/100, category churn ${state.threats.TerrorThreat}/100, margin pressure ${state.threats.EconomicPressure}/100, brand dilution ${state.threats.DisinformationRisk}/100, commoditization ${state.threats.PollutionCrisis}/100.`
        : `Threats: border ${state.threats.BorderTension}/100, terror ${state.threats.TerrorThreat}/100, economic pressure ${state.threats.EconomicPressure}/100, disinformation ${state.threats.DisinformationRisk}/100.`,
      isBusinessScenario(state)
        ? `Business condition: portfolio strength ${state.stats.NationalSecurity}/100, revenue momentum ${state.stats.EconomicStability}/100, brand credibility ${state.stats.DiplomaticStanding}/100, brand love ${state.stats.PublicConfidence}/100, margin health ${state.stats.FiscalHealth}/100.`
        : `National condition: security ${state.stats.NationalSecurity}/100, economy ${state.stats.EconomicStability}/100, diplomacy ${state.stats.DiplomaticStanding}/100, public confidence ${state.stats.PublicConfidence}/100.`,
      isBusinessScenario(state)
        ? `Team and stakeholders: team stress ${state.sentiment.PanicLevel}/100, org misalignment ${state.sentiment.CommunalTension}/100, retailer pushback ${state.domestic.ProtestRisk}/100.`
        : `Public mood: panic ${state.sentiment.PanicLevel}/100, communal tension ${state.sentiment.CommunalTension}/100, protest risk ${state.domestic.ProtestRisk}/100.`,
      isBusinessScenario(state)
        ? `Business indicators: sales momentum ${snapshot.markets}/100, pricing power ${snapshot.rupee}/100, execution capacity ${snapshot.readiness}/100.`
        : `Markets and readiness: stock index ${snapshot.markets}/100, rupee ${snapshot.rupee}/100, military readiness ${snapshot.readiness}/100.`,
      `${isBusinessScenario(state) ? "Board" : "Constitutional"} tolerance: load ${state.toleranceLoad || 0}/${toleranceMaximum(state)}, red-line strikes ${state.redLineViolations || 0}/3, note: ${state.accountabilityNote || "none"}.`,
      `Recent alerts: ${recentAlerts}`,
      `Decision memory: ${decisionMemoryLine(state)}.`,
      `Boardroom memory: ${meetingMemoryLine(state)}.`,
      `Advisors to answer: ${advisorList}`,
      `Detected prompt flags: absurd=${intent.absurd}, irrelevant=${intent.irrelevant}, nuclear=${intent.nuclear}, assassination=${intent.assassination}, kinetic=${intent.kinetic}, cyber=${intent.cyber}, diplomacy=${intent.diplomacy}, economy=${intent.economy}, domestic=${intent.domestic}.`,
      "Make each stakeholder sound human, role-specific, and aware of previous decisions.",
      "Make each stakeholder explicitly agree or disagree with at least one likely boardroom position when useful.",
      "Do not repeat the same sentence across stakeholders. Avoid generic template language.",
    ].join("\n");
  }

  function parseOllamaMeetingResponses(rawText, prompt) {
    const fallback = buildFallbackMeetingResponses(prompt);
    if (!rawText || typeof rawText !== "string") return fallback;

    const start = rawText.indexOf("[");
    const end = rawText.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) return fallback;

    try {
      const parsed = JSON.parse(rawText.slice(start, end + 1));
      if (!Array.isArray(parsed)) return fallback;
      const byId = new Map();
      parsed.forEach((entry) => {
        if (!entry || !entry.text) return;
        const id = String(entry.id || "").toLowerCase().trim();
        const name = String(entry.name || "").toLowerCase().trim();
        byId.set(id || name, String(entry.text).trim());
      });

      return getAdvisorsForScenario(state).map((advisor) => {
        const exact = byId.get(advisor.id) || byId.get(advisor.name.toLowerCase());
        return {
          name: advisor.name,
          text: exact || generateMeetingReply(advisor, prompt),
        };
      });
    } catch {
      return fallback;
    }
  }

  async function fetchOllamaJson(path, payload = null, timeoutMs = 45000, method = "POST") {
    throw new Error("Local Ollama is unavailable on this hosted Site. Use standard boardroom responses or choose AI-assisted mode from the opening page.");
    if (window.location.protocol === "file:") {
      throw new Error("file-opened page cannot call Ollama reliably");
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    let lastError = null;
    try {
      for (const baseUrl of OLLAMA_BASE_URLS) {
        try {
          const options = {
            method,
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          };
          if (payload) options.body = JSON.stringify(payload);
          const response = await fetch(`${baseUrl}${path}`, options);
          if (!response.ok) throw new Error(`${baseUrl} HTTP ${response.status}`);
          return await response.json();
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("Ollama request failed.");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function buildOllamaMeetingResponses(prompt) {
    const model = els.ollamaModelInput.value.trim();
    if (!model) throw new Error("No Ollama model selected.");
    saveOllamaSettings();

    await fetchOllamaJson("/api/tags", null, 8000, "GET").catch((error) => {
      throw new Error(ollamaConnectionHelp(error));
    });

    const result = await fetchOllamaJson("/api/chat", {
      model,
      stream: false,
      format: "json",
      messages: [
        { role: "system", content: buildOllamaSystemPrompt(prompt) },
        { role: "user", content: prompt },
      ],
      options: {
        temperature: 0.45,
        top_p: 0.9,
        num_predict: 900,
      },
    });

    const content = result && result.message ? result.message.content : "";
    return parseOllamaMeetingResponses(content, prompt);
  }

  async function testOllamaConnection() {
    if (ollamaBusy) return;
    if (window.location.protocol === "file:") {
      const help = ollamaConnectionHelp(new Error("opened by double-clicking pm-interface.html"));
      setOllamaStatus(help, true);
      setStatus(help, true);
      return;
    }
    const model = els.ollamaModelInput.value.trim() || DEFAULT_OLLAMA_MODEL;
    els.ollamaModelInput.value = model;
    saveOllamaSettings();
    ollamaBusy = true;
    setOllamaStatus(`Testing local Ollama model "${model}"...`);
    renderOllamaControls();
    try {
      await fetchOllamaJson("/api/chat", {
        model,
        stream: false,
        messages: [
          { role: "system", content: "Reply with exactly: READY" },
          { role: "user", content: "Connection test." },
        ],
        options: { temperature: 0, num_predict: 8 },
      }, 20000);
      setOllamaStatus(`Ollama connected: ${model}`);
      setStatus(`Local LLM connected: ${model}`);
    } catch (error) {
      const help = ollamaConnectionHelp(error);
      setOllamaStatus(help, true);
      setStatus(help, true);
    } finally {
      ollamaBusy = false;
      renderOllamaControls();
    }
  }

  function buildOllamaEventPrompt(profile, outcome) {
    return [
      isBusinessScenario(state)
        ? "You generate realistic second-order business events for the boAt Limited case simulation."
        : "You generate realistic second-order crisis events for the Mumbai terror crisis simulation.",
      "Return only valid JSON: an array of 2 to 4 objects.",
      "Each object must have: type, headline, detail, actor, tone.",
      "Keep events realistic, concise, and grounded in the provided state. Do not invent impossible facts.",
      "Do not provide tactical instructions for violence, cyber abuse, weapons, or terrorism.",
      `Scenario: ${currentScenario(state).name}.`,
      `User role: ${state.roleName}.`,
      `Latest decision: ${profile.title || profile.id}. Domain ${profile.domain}; style ${profile.style}; risk ${Math.round((profile.risk || 0.5) * 100)}/100; legality ${Math.round((profile.legality || 0.5) * 100)}/100; outcome ${outcome.scenario}.`,
      `Current pressure: ${state.escalationStage} ${state.escalationIndex}/100.`,
      isBusinessScenario(state)
        ? `Business state: margin pressure ${state.threats.EconomicPressure}/100, competitive pressure ${state.threats.BorderTension}/100, portfolio strength ${state.stats.NationalSecurity}/100, brand love ${state.stats.PublicConfidence}/100, market confidence ${state.systems.MarketConfidence}/100.`
        : `National state: terror threat ${state.threats.TerrorThreat}/100, border tension ${state.threats.BorderTension}/100, public panic ${state.sentiment.PanicLevel}/100, diplomacy ${state.stats.DiplomaticStanding}/100.`,
      `Decision memory: ${decisionMemoryLine(state, 5)}.`,
      "Events should create game texture: stakeholder reactions, media narrative, market move, operational bottleneck, or delayed risk.",
    ].join("\n");
  }

  function parseOllamaEvents(rawText) {
    if (!rawText || typeof rawText !== "string") return [];
    const start = rawText.indexOf("[");
    const end = rawText.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) return [];
    try {
      const parsed = JSON.parse(rawText.slice(start, end + 1));
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && item.headline && item.detail)
        .slice(0, 4)
        .map((item) => ({
          type: String(item.type || "event").slice(0, 30),
          headline: String(item.headline).slice(0, 120),
          detail: String(item.detail).slice(0, 220),
          actor: String(item.actor || "System").slice(0, 60),
          tone: String(item.tone || "neutral").slice(0, 30),
        }));
    } catch {
      return [];
    }
  }

  async function enrichLiveEventsWithOllama(profile, outcome) {
    if (window.location.protocol === "file:" || ollamaEventBusy || !state || state.sessionReportShown) return;
    const model = els.ollamaModelInput.value.trim() || DEFAULT_OLLAMA_MODEL;
    ollamaEventBusy = true;
    try {
      const result = await fetchOllamaJson("/api/chat", {
        model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: buildOllamaEventPrompt(profile, outcome) },
          { role: "user", content: "Generate the next live-feed events." },
        ],
        options: { temperature: 0.72, top_p: 0.9, num_predict: 600 },
      }, 30000);
      const content = result && result.message ? result.message.content : "";
      const events = parseOllamaEvents(content);
      if (!events.length) return;
      events.forEach((event) => {
        pushAlert(state, event.type, `${event.headline}: ${event.detail}`);
        pushGlobalReaction(state, event.actor, event.detail, event.tone);
      });
      state.liveFeedSummary = `${events[0].headline} ${events[0].detail}`;
      saveState();
      renderAll();
    } catch {
      // Dynamic events are an enhancement only; the deterministic engine remains authoritative.
    } finally {
      ollamaEventBusy = false;
    }
  }

  function pressureTimerSnapshot(stateObj = state) {
    return (stateObj.crisisTimers || [])
      .map((timer) => {
        const initial = Math.max(Number(timer.initialHours) || Number(timer.hoursLeft) || 1, 1);
        const remainingPct = clamp(Math.round((Number(timer.hoursLeft) / initial) * 100));
        return `${timer.label}: ${Number(timer.hoursLeft).toFixed(1)}h left, ${remainingPct}% remaining, severity ${timer.severity || 50}/100`;
      })
      .join(" | ") || "No active pressure timers.";
  }

  function shouldUseOllamaImpact(profile, outcome) {
    if (!profile || !outcome || window.location.protocol === "file:" || state.sessionReportShown) return false;
    const recent = Array.isArray(state.decisionReviews) ? state.decisionReviews.slice(-5) : [];
    const effectiveStyle = effectiveDecisionStyle(state, profile);
    const repeatedStyle = recent.filter((item) => item.style === effectiveStyle || item.style === profile.style).length >= 2;
    const repeatedDomain = recent.filter((item) => item.domain === profile.domain).length >= 2;
    const timerUrgency = (state.crisisTimers || []).some((timer) => {
      const initial = Math.max(Number(timer.initialHours) || Number(timer.hoursLeft) || 1, 1);
      return (Number(timer.hoursLeft) / initial) <= 0.35;
    });
    const highPressure = isBusinessScenario(state)
      ? state.threats.EconomicPressure >= 70 || state.threats.BorderTension >= 75 || state.stats.FiscalHealth <= 45 || state.domestic.ParliamentApproval <= 45
      : state.threats.TerrorThreat >= 85 || state.threats.BorderTension >= 80 || state.sentiment.PanicLevel >= 70 || state.stats.DiplomaticStanding <= 45;
    const businessContextualReview = isBusinessScenario(state) && /product|pilot|pricing|finance|market|brand|governance|operations|overreach|unethical/i.test(effectiveStyle || "");
    return (
      businessContextualReview ||
      (profile.risk || 0) >= 0.52 ||
      ["overreach", "unethical", "kinetic", "decapitation", "nuclear"].includes(effectiveStyle) ||
      outcome.scenario === "Blowback" ||
      repeatedStyle ||
      repeatedDomain ||
      timerUrgency ||
      highPressure
    );
  }

  function buildOllamaImpactPrompt(profile, outcome) {
    const scenarioCatalog = SCENARIOS.map((item) => `${item.id}: ${item.name}`).join(" | ");
    const optionContext = getStructuredOptions(state)
      .slice(0, 40)
      .map((option) => `${option.id}:${option.domain}/${option.style}/risk${Math.round(option.risk * 100)}-${option.title}`)
      .join(" || ");
    return [
      "You are SecondOrder's guarded second-order impact analyst.",
      "Your job is not to roleplay. Your job is to suggest small, realistic parameter corrections after the rule engine has already applied the base MCQ impact.",
      "Return only valid JSON with this shape:",
      '{"apply":true,"reason":"short reason","deltas":{"stats":{},"threats":{},"domestic":{},"sentiment":{},"economy":{},"systems":{}},"escalationDelta":0,"leadershipDelta":0,"delayedReactions":[{"delayMinutes":60,"actor":"stakeholder","tone":"supportive|neutral|concerned|hostile","reason":"short reaction","deltas":{"stats":{},"threats":{},"domestic":{},"sentiment":{},"economy":{},"systems":{}},"escalationDelta":0,"leadershipDelta":0}]}',
      "All metric deltas must be integers between -8 and 8. Use negative values where a seemingly good decision creates backlash.",
      "Do not always increase confidence. If timing, pressure, repetition, integration risk, or weak fundamentals create concern, reduce confidence metrics.",
      "For boAt, Board Confidence is domestic.ParliamentApproval and Retailer Confidence is systems.MarketConfidence.",
      "For boAt, if aggressive acquisition, overexpansion, or discount-led growth happens while margin pressure is high, Board Confidence should usually fall.",
      "For Mumbai, if kinetic escalation happens without strong legality, diplomacy and public confidence should usually fall while tension rises.",
      "Do not change more than 8 immediate metrics. Be conservative and explain the main tradeoff.",
      "You may add up to 2 delayed stakeholder reactions. Each delayed reaction must be realistic, delayed 40-180 minutes, and have at most 5 small metric deltas.",
      "Use delayed reactions for board, investors, marketplaces, consumers, competitors, adversaries, global markets, or institutions when their response would not be instant.",
      `Scenario catalog: ${scenarioCatalog}.`,
      `Active scenario: ${currentScenario(state).name}. User role: ${state.roleName}.`,
      `Selected decision: ${profile.id || "decision"} | ${profile.title} | domain ${profile.domain} | style ${profile.style} | risk ${Math.round((profile.risk || 0.5) * 100)}/100 | legality ${Math.round((profile.legality || 0.5) * 100)}/100 | base outcome ${outcome.scenario}.`,
      isBusinessScenario(state)
        ? `Current boAt state: Board Confidence ${state.domestic.ParliamentApproval}/100, Investor Scrutiny ${state.domestic.OppositionPressure}/100, Margin Health ${state.stats.FiscalHealth}/100, Margin Pressure ${state.threats.EconomicPressure}/100, Brand Love ${state.stats.PublicConfidence}/100, Retailer Confidence ${state.systems.MarketConfidence}/100, Competitive Pressure ${state.threats.BorderTension}/100.`
        : `Current national state: Security ${state.stats.NationalSecurity}/100, Diplomacy ${state.stats.DiplomaticStanding}/100, Public Confidence ${state.stats.PublicConfidence}/100, Panic ${state.sentiment.PanicLevel}/100, Terror Threat ${state.threats.TerrorThreat}/100, Border Tension ${state.threats.BorderTension}/100.`,
      `Pressure timers: ${pressureTimerSnapshot(state)}.`,
      `Decision memory: ${decisionMemoryLine(state, 7)}.`,
      `Current scenario option universe: ${optionContext}.`,
    ].join("\n");
  }

  function parseOllamaImpact(rawText) {
    if (!rawText || typeof rawText !== "string") return null;
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      const parsed = JSON.parse(rawText.slice(start, end + 1));
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function emptyImpactDeltas() {
    return { stats: {}, threats: {}, domestic: {}, sentiment: {}, economy: {}, systems: {} };
  }

  function fallbackContextualImpact(profile, outcome) {
    const deltas = emptyImpactDeltas();
    const delayedReactions = [];
    let reason = "";
    const effectiveStyle = effectiveDecisionStyle(state, profile);
    if (isBusinessScenario(state)) {
      if (effectiveStyle === "overreach" || (profile.risk || 0) >= 0.68) {
        deltas.domestic.ParliamentApproval = -6;
        deltas.domestic.OppositionPressure = 5;
        deltas.systems.MarketConfidence = -4;
        deltas.threats.EconomicPressure = 4;
        reason = "High-risk growth under margin and integration pressure reduced board confidence.";
        delayedReactions.push({ delayMinutes: 70, actor: "Board Risk Committee", tone: "concerned", reason: "Board asks for integration, margin, and service-capacity gates before further scaling.", deltas: { domestic: { ParliamentApproval: -3, OppositionPressure: 3 }, systems: { MarketConfidence: -2 }, threats: { EconomicPressure: 2 } }, escalationDelta: 1, leadershipDelta: -1 });
      } else if ((effectiveStyle === "pricing" || effectiveStyle === "finance") && state.stats.PublicConfidence < 65) {
        deltas.stats.FiscalHealth = 2;
        deltas.stats.PublicConfidence = -2;
        deltas.domestic.ParliamentApproval = -1;
        reason = "Financial discipline helped margins but created short-term brand and growth anxiety.";
        delayedReactions.push({ delayMinutes: 60, actor: "Marketplaces", tone: "concerned", reason: "Platforms pressure boAt for deeper offers after margin guardrails are announced.", deltas: { systems: { MarketConfidence: -2 }, threats: { BorderTension: 2, EconomicPressure: 1 } }, escalationDelta: 0, leadershipDelta: 0 });
      } else if (effectiveStyle === "product" && state.systems.HealthcareCapacity < 55) {
        deltas.stats.NationalSecurity = 2;
        deltas.systems.HealthcareCapacity = -2;
        deltas.domestic.ParliamentApproval = -2;
        reason = "Product focus improved portfolio logic but service capacity remained a board concern.";
        delayedReactions.push({ delayMinutes: 80, actor: "Service Desk", tone: "concerned", reason: "Service queues test whether the portfolio decision can be executed without warranty blowback.", deltas: { stats: { PublicConfidence: -2 }, systems: { HealthcareCapacity: -2 }, domestic: { ProtestRisk: 2 } }, escalationDelta: 0, leadershipDelta: 0 });
      }
    } else if (effectiveStyle === "kinetic" || effectiveStyle === "decapitation" || effectiveStyle === "nuclear") {
      deltas.stats.DiplomaticStanding = -5;
      deltas.sentiment.PanicLevel = 4;
      deltas.threats.BorderTension = 5;
      deltas.domestic.OppositionPressure = 4;
      reason = "Escalatory action created institutional, diplomatic, and public-order backlash.";
      delayedReactions.push({ delayMinutes: 70, actor: "Global Markets", tone: "concerned", reason: "Investors price in escalation and retaliation risk after the coercive move.", deltas: { economy: { StockIndex: -3, CurrencyValue: -2 }, threats: { EconomicPressure: 3 }, systems: { MarketConfidence: -2 } }, escalationDelta: 1, leadershipDelta: -1 });
    } else if (outcome.scenario === "Blowback") {
      deltas.stats.PublicConfidence = -3;
      deltas.threats.DisinformationRisk = 3;
      deltas.domestic.MediaHostility = 3;
      reason = "Blowback worsened public interpretation and media pressure.";
      delayedReactions.push({ delayMinutes: 50, actor: "Media Ecosystem", tone: "concerned", reason: "Contradictory claims keep public pressure alive after the failed move.", deltas: { domestic: { MediaHostility: 3, OppositionPressure: 2 }, sentiment: { PanicLevel: 2 }, threats: { DisinformationRisk: 2 } }, escalationDelta: 0, leadershipDelta: -1 });
    }
    return reason ? { apply: true, reason, deltas, escalationDelta: 0, leadershipDelta: 0, delayedReactions } : null;
  }

  function mergeImpactSuggestions(primary, fallback) {
    if (!primary || primary.apply === false) return fallback;
    if (!fallback) return primary;
    const merged = {
      ...primary,
      reason: `${primary.reason || "Ollama adjustment"} Guardrail: ${fallback.reason}`,
      deltas: emptyImpactDeltas(),
      escalationDelta: Number(primary.escalationDelta || 0) + Number(fallback.escalationDelta || 0),
      leadershipDelta: Number(primary.leadershipDelta || 0) + Number(fallback.leadershipDelta || 0),
      delayedReactions: [
        ...((Array.isArray(primary.delayedReactions) ? primary.delayedReactions : []).slice(0, 2)),
        ...((Array.isArray(fallback.delayedReactions) ? fallback.delayedReactions : []).slice(0, 2)),
      ].slice(0, 3),
    };
    Object.keys(merged.deltas).forEach((group) => {
      merged.deltas[group] = { ...(primary.deltas && primary.deltas[group] ? primary.deltas[group] : {}) };
      Object.entries((fallback.deltas && fallback.deltas[group]) || {}).forEach(([key, value]) => {
        merged.deltas[group][key] = Number(merged.deltas[group][key] || 0) + Number(value || 0);
      });
    });
    return merged;
  }

  function validateImpactSuggestion(suggestion, profile) {
    if (!suggestion || suggestion.apply === false) return null;
    const allowed = {
      stats: Object.keys(state.stats || {}),
      threats: Object.keys(state.threats || {}),
      domestic: Object.keys(state.domestic || {}),
      sentiment: Object.keys(state.sentiment || {}),
      economy: Object.keys(state.economy || {}),
      systems: Object.keys(state.systems || {}),
    };
    const rawEscalationDelta = Math.round(Number(suggestion.escalationDelta || 0));
    const rawLeadershipDelta = Math.round(Number(suggestion.leadershipDelta || 0));
    const result = {
      reason: String(suggestion.reason || "Contextual second-order adjustment.").slice(0, 220),
      deltas: emptyImpactDeltas(),
      escalationDelta: Number.isFinite(rawEscalationDelta) ? clamp(rawEscalationDelta, -5, 6) : 0,
      leadershipDelta: Number.isFinite(rawLeadershipDelta) ? clamp(rawLeadershipDelta, -6, 4) : 0,
      delayedReactions: [],
    };
    const sanitizeReactionDeltas = (source, maxCount = 5) => {
      const output = emptyImpactDeltas();
      let count = 0;
      Object.keys(allowed).forEach((group) => {
        const groupSource = source && typeof source[group] === "object" ? source[group] : {};
        Object.entries(groupSource).forEach(([key, rawValue]) => {
          if (!allowed[group].includes(key) || count >= maxCount) return;
          const value = clamp(Math.round(Number(rawValue || 0)), -6, 6);
          if (!Number.isFinite(value) || value === 0) return;
          output[group][key] = value;
          count += 1;
        });
      });
      return output;
    };
    const effectiveStyle = profile ? effectiveDecisionStyle(state, profile) : "mixed";
    let appliedCount = 0;
    Object.keys(allowed).forEach((group) => {
      const source = suggestion.deltas && typeof suggestion.deltas[group] === "object" ? suggestion.deltas[group] : {};
      Object.entries(source).forEach(([key, rawValue]) => {
        if (!allowed[group].includes(key) || appliedCount >= 8) return;
        let value = clamp(Math.round(Number(rawValue || 0)), -8, 8);
        if (!Number.isFinite(value) || value === 0) return;
        if (isBusinessScenario(state) && profile && (effectiveStyle === "overreach" || (profile.risk || 0) >= 0.7)) {
          if (group === "domestic" && key === "ParliamentApproval") value = Math.min(value, -3);
          if (group === "systems" && key === "MarketConfidence") value = Math.min(value, 0);
        }
        if (!isBusinessScenario(state) && profile && ["kinetic", "decapitation", "nuclear"].includes(effectiveStyle)) {
          if (group === "stats" && key === "DiplomaticStanding") value = Math.min(value, -2);
          if (group === "threats" && key === "BorderTension") value = Math.max(value, 2);
        }
        result.deltas[group][key] = value;
        appliedCount += 1;
      });
    });
    if (Array.isArray(suggestion.delayedReactions)) {
      suggestion.delayedReactions.slice(0, 3).forEach((reaction) => {
        if (!reaction || typeof reaction !== "object") return;
        const delayedDeltas = sanitizeReactionDeltas(reaction.deltas || {}, 5);
        const hasDelayedDeltas = Object.values(delayedDeltas).some((group) => Object.keys(group).length);
        const delayMinutes = clamp(Math.round(Number(reaction.delayMinutes || 60)), 40, 180);
        const delayedEscalation = clamp(Math.round(Number(reaction.escalationDelta || 0)), -3, 4);
        const delayedLeadership = clamp(Math.round(Number(reaction.leadershipDelta || 0)), -4, 3);
        if (!hasDelayedDeltas && delayedEscalation === 0 && delayedLeadership === 0) return;
        result.delayedReactions.push({
          delayMinutes,
          actor: String(reaction.actor || (isBusinessScenario(state) ? "Stakeholder" : "External Actor")).slice(0, 60),
          tone: /supportive|neutral|concerned|hostile|contextual/i.test(String(reaction.tone || "")) ? String(reaction.tone).toLowerCase() : "neutral",
          reason: String(reaction.reason || "Delayed stakeholder response.").slice(0, 180),
          deltas: delayedDeltas,
          escalationDelta: delayedEscalation,
          leadershipDelta: delayedLeadership,
        });
      });
    }

    const hasMetricDelta = Object.values(result.deltas).some((group) => Object.keys(group).length);
    const hasDelayedReaction = result.delayedReactions.length > 0;
    if (!hasMetricDelta && !hasDelayedReaction && result.escalationDelta === 0 && result.leadershipDelta === 0) return null;
    return result;
  }

  function applyImpactAdjustment(adjustment, sourceLabel = "Ollama impact review") {
    if (!adjustment) return false;
    applyMetricMap(state.stats, adjustment.deltas.stats);
    applyMetricMap(state.threats, adjustment.deltas.threats);
    applyMetricMap(state.domestic, adjustment.deltas.domestic);
    applyMetricMap(state.sentiment, adjustment.deltas.sentiment);
    applyMetricMap(state.economy, adjustment.deltas.economy);
    applyMetricMap(state.systems, adjustment.deltas.systems);
    if (adjustment.escalationDelta) updateEscalation(state, adjustment.escalationDelta, sourceLabel);
    if (adjustment.leadershipDelta) state.leadership = clamp(state.leadership + adjustment.leadershipDelta);
    refreshIntelReport(state);
    refreshHeadlines(state);
    refreshStrategicSummaries(state, { outcomeLabel: `${sourceLabel}: ${adjustment.reason}` });
    state.outcomeText = [
      state.outcomeText || "Decision implemented.",
      `- Context impact: ${adjustment.reason}`,
      `- Updated snapshot: ${isBusinessScenario(state)
        ? `board confidence ${state.domestic.ParliamentApproval}/100, margin health ${state.stats.FiscalHealth}/100, margin pressure ${state.threats.EconomicPressure}/100, retailer confidence ${state.systems.MarketConfidence}/100.`
        : `security ${state.stats.NationalSecurity}/100, diplomacy ${state.stats.DiplomaticStanding}/100, border tension ${state.threats.BorderTension}/100, panic ${state.sentiment.PanicLevel}/100.`}`,
    ].join("\n");
    (adjustment.delayedReactions || []).forEach((reaction) => {
      scheduleStakeholderReaction(
        state,
        reaction.delayMinutes,
        reaction.actor,
        reaction.tone,
        reaction.reason,
        reaction.deltas,
        reaction.escalationDelta,
        reaction.leadershipDelta
      );
    });
    pushAlert(state, "impact", `${sourceLabel}: ${adjustment.reason}`);
    if ((adjustment.delayedReactions || []).length) {
      pushAlert(state, "event", `${sourceLabel}: ${adjustment.delayedReactions.length} delayed stakeholder response(s) queued.`);
    }
    pushGlobalReaction(state, sourceLabel, adjustment.reason, "contextual");
    return true;
  }

  async function applyOllamaImpactAdjustment(profile, outcome) {
    if (!shouldUseOllamaImpact(profile, outcome) || ollamaImpactBusy) return;
    ollamaImpactBusy = true;
    const fallback = fallbackContextualImpact(profile, outcome);
    try {
      const model = els.ollamaModelInput.value.trim() || DEFAULT_OLLAMA_MODEL;
      setStatus("Ollama is stress-testing second-order parameter impact...");
      const result = await fetchOllamaJson("/api/chat", {
        model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: buildOllamaImpactPrompt(profile, outcome) },
          { role: "user", content: "Suggest guarded parameter corrections for this decision." },
        ],
        options: { temperature: 0.35, top_p: 0.88, num_predict: 700 },
      }, 35000);
      const content = result && result.message ? result.message.content : "";
      const parsed = parseOllamaImpact(content);
      const validated = validateImpactSuggestion(mergeImpactSuggestions(parsed, fallback), profile);
      if (validated && applyImpactAdjustment(validated, "Ollama impact review")) {
        saveState();
        renderAll();
        setStatus("Ollama impact review applied with rule caps.");
      }
    } catch {
      const validated = validateImpactSuggestion(fallback, profile);
      if (validated && applyImpactAdjustment(validated, "Rule fallback impact review")) {
        saveState();
        renderAll();
        setStatus("Ollama impact review unavailable; fallback contextual adjustment applied.");
      }
    } finally {
      ollamaImpactBusy = false;
    }
  }

  function shouldPromptForReflection(totalDecisions) {
    const shown = clamp(Number(state.reflectionPromptsShown || 0), 0, 2);
    if (shown >= 2 || state.pendingReflection) return false;
    if (shown === 0) return totalDecisions >= 1;

    const lastPromptMs = state.lastReflectionPromptAt ? new Date(state.lastReflectionPromptAt).getTime() : 0;
    const adequatelySpaced = !lastPromptMs || Date.now() - lastPromptMs >= 60 * 1000;
    const lateInSession = window.SecondOrderSessionClock.remaining(state) <= 2 * 60 * 1000;
    return adequatelySpaced && (totalDecisions >= 3 || lateInSession);
  }

  function updateDecisionMetrics(profile, outcomeScenario, stateBefore = null) {
    const metrics = state.decisionMetrics;
    const legality = Number.isFinite(profile.legality) ? profile.legality : 0.5;
    const risk = Number.isFinite(profile.risk) ? profile.risk : 0.5;
    const effectiveStyle = effectiveDecisionStyle(state, profile);
    metrics.total += 1;
    metrics.legalWeight += legality * 100;
    metrics.riskWeight += risk;

    const representedStyles = [...new Set(
      deterministicLogic.profileComponents(profile).map((component) => component.style || effectiveStyle)
    )];
    representedStyles.forEach((style) => {
      if (style === "kinetic" || style === "decapitation" || style === "nuclear") metrics.aggressive += 1;
      if (style === "diplomatic") metrics.diplomatic += 1;
      if (style === "domestic") metrics.domestic += 1;
      if (style === "economic") metrics.economic += 1;
      if (style === "information" || style === "cyber" || style === "covert" || style === "intel" || style === "defensive") metrics.informational += 1;
      if (style === "product") metrics.product = (metrics.product || 0) + 1;
      if (style === "pilot" || style === "market" || style === "brand") metrics.sales = (metrics.sales || 0) + 1;
      if (style === "pricing" || style === "finance") metrics.finance = (metrics.finance || 0) + 1;
      if (style === "governance" || style === "operations") metrics.trust = (metrics.trust || 0) + 1;
      if (style === "overreach") metrics.focus = (metrics.focus || 0) + 1;
      if (style === "unethical") metrics.ethicalRisk = (metrics.ethicalRisk || 0) + 1;
    });

    if (outcomeScenario === "Success") metrics.successCount += 1;
    else if (outcomeScenario === "Partial") metrics.partialCount += 1;
    else metrics.failureCount += 1;

    if (!Array.isArray(state.decisionReviews)) state.decisionReviews = [];
    const review = {
      id: `review-${Date.now()}-${metrics.total}`,
      time: formatTime(state.clock),
      optionIds: deterministicLogic.profileComponents(profile).map((component) => component.id).filter(Boolean),
      title: profile.title || profile.id || "Operational decision",
      style: effectiveStyle || profile.style || "mixed",
      styles: deterministicLogic.profileComponents(profile).map((component) => component.style || "mixed"),
      domain: profile.domain || "General",
      domains: deterministicLogic.profileComponents(profile).map((component) => component.domain || "General"),
      risk: Math.round(risk * 100),
      legality: Math.round(legality * 100),
      outcome: outcomeScenario,
      escalation: state.escalationIndex,
      toleranceLoad: state.toleranceLoad || 0,
      causalNotes: Array.isArray(state.lastCausalNotes) ? [...state.lastCausalNotes] : [],
      realityAudit: state.lastRealityAudit ? deepClone(state.lastRealityAudit) : null,
      impactLedger: deepClone(state.lastImpactLedger || []),
      stateBefore: stateBefore ? deepClone(stateBefore) : null,
      stateAfter: metricSnapshot(state),
      impact: isBusinessScenario(state)
        ? `portfolio ${state.stats.NationalSecurity}/100, margin ${state.stats.FiscalHealth}/100, brand love ${state.stats.PublicConfidence}/100, retailer confidence ${state.systems.MarketConfidence}/100, board confidence ${state.domestic.ParliamentApproval}/100, investor scrutiny ${state.domestic.OppositionPressure}/100`
        : `security ${state.stats.NationalSecurity}/100, diplomacy ${state.stats.DiplomaticStanding}/100, public confidence ${state.stats.PublicConfidence}/100, panic ${state.sentiment.PanicLevel}/100`,
    };
    state.decisionReviews.push(review);
    if (shouldPromptForReflection(metrics.total)) {
      const createdAt = new Date().toISOString();
      state.pendingReflection = {
        reviewId: review.id,
        decisionTitle: review.title,
        createdAt,
      };
      state.reflectionPromptsShown = clamp(Number(state.reflectionPromptsShown || 0) + 1, 0, 2);
      state.lastReflectionPromptAt = createdAt;
    }
    if (state.decisionReviews.length > 30) {
      state.decisionReviews = state.decisionReviews.slice(-30);
    }
    return review;
  }

  function buildBoardroomSynthesis(prompt, responses) {
    const highRisk = /acquire|acquisition|nuclear|strike|discount|layoff|kill|bomb|war|overexpand/i.test(prompt);
    const names = responses.slice(0, 3).map((entry) => entry.name).join(", ");
    if (isBusinessScenario(state)) {
      return highRisk
        ? `Board tension: ${names} are not aligned. Treat this as a staged option with finance, integration, brand, and service-risk gates before approval.`
        : `Board synthesis: the room wants a measurable pilot, margin guardrails, and one clear owner before this becomes a full company move.`;
    }
    return highRisk
      ? `Crisis-room tension: the advisors are warning against irreversible escalation without evidence, legality, proportionality, and an exit path.`
      : `Crisis-room synthesis: sequence the move, protect public confidence, and keep diplomatic and operational channels open.`;
  }

  function aiAssistedSimulationActive() {
    return window.location.protocol !== "file:" && /\/pm-interface-ai(?:\.html)?\/?$/i.test(window.location.pathname);
  }

  function buildAiBoardroomContext(prompt) {
    const scenario = SCENARIOS.find((item) => item.id === state.scenarioId);
    const decisions = (Array.isArray(state.decisionReviews) ? state.decisionReviews : []).slice(-12).map((review, index) => ({
      evidenceId: `D${Math.max(1, (state.decisionReviews || []).length - Math.min(12, (state.decisionReviews || []).length) + index + 1)}`,
      time: review.time || "",
      title: review.title || "Decision",
      optionIds: Array.isArray(review.optionIds) ? review.optionIds.slice(0, 2) : [],
      domains: Array.isArray(review.domains) ? review.domains.slice(0, 3) : [review.domain || "General"],
      styles: Array.isArray(review.styles) ? review.styles.slice(0, 3) : [review.style || "mixed"],
      risk: Number(review.risk || 0),
      credibility: Number(review.legality || 0),
      outcome: review.outcome || "Unknown",
      causalNotes: Array.isArray(review.causalNotes) ? review.causalNotes.slice(0, 6) : [],
      realityAudit: review.realityAudit || null,
      impactLedger: Array.isArray(review.impactLedger) ? review.impactLedger.slice(0, 6) : [],
      reflection: String(review.reflection || "").slice(0, 1200),
    }));
    const crisisState = state.emergencyControversy || {};
    const emergencies = [...(Array.isArray(crisisState.history) ? crisisState.history : [])];
    if (crisisState.current && !emergencies.some((item) => item && item.startedAt === crisisState.current.startedAt)) emergencies.push(crisisState.current);
    return {
      schemaVersion: 1,
      scenario: { id: state.scenarioId, name: scenario ? scenario.name : state.scenarioId, clock: state.clock },
      participantRole: state.roleName,
      question: prompt,
      priorities: (Array.isArray(state.decisionPriorities) ? state.decisionPriorities : []).slice(0, 3),
      scoreboard: {
        revenueMomentum: state.stats.EconomicStability,
        marginHealth: state.stats.FiscalHealth,
        boardConfidence: state.domestic.ParliamentApproval,
        consumerTrust: state.sentiment.TrustInGovernment,
        brandLove: state.stats.PublicConfidence,
        pricingPower: state.economy.CurrencyValue,
        investorScrutiny: state.domestic.OppositionPressure,
        marginPressure: state.threats.EconomicPressure,
        manufacturingResilience: state.systems.SupplyChainIntegrity,
        serviceCapacity: state.systems.HealthcareCapacity,
        marketConfidence: state.systems.MarketConfidence,
        portfolioStrength: state.stats.NationalSecurity,
        stockIndex: state.economy.StockIndex,
        boardToleranceLoad: state.toleranceLoad || 0,
      },
      decisions,
      reflections: (Array.isArray(state.reflections) ? state.reflections : []).slice(-6).map((item, index) => ({
        evidenceId: `R${index + 1}`,
        decisionTitle: item.decisionTitle || "Decision",
        text: String(item.text || "").slice(0, 1200),
        time: item.time || "",
      })),
      emergencies: emergencies.slice(-3).map((crisis, index) => ({
        evidenceId: `E${index + 1}`,
        title: crisis.title || "Emergency",
        brief: crisis.brief || "",
        responses: Array.isArray(crisis.usedResponses) ? crisis.usedResponses.slice(0, 8) : [],
        majorDecisions: Array.isArray(crisis.usedMajorDecisions) ? crisis.usedMajorDecisions.slice(0, 6) : [],
        statementChoice: crisis.statementChoiceId || null,
        resolution: crisis.resolution || null,
      })),
      boardroomHistory: (Array.isArray(state.meetingRounds) ? state.meetingRounds : []).slice(-4).map((round) => ({
        question: round.prompt || "",
        source: round.source || "",
        responses: (Array.isArray(round.responses) ? round.responses : []).slice(0, 10).map((entry) => ({ name: entry.name, text: String(entry.text || "").slice(0, 500) })),
      })),
    };
  }

  async function requestAiBoardroomAdvice(prompt) {
    const controller = new AbortController();
    boardroomRequestController = controller;
    const timeout = window.setTimeout(() => controller.abort(), Math.min(70000, remainingMs(state.meetingEndsAt)));
    try {
      const context = buildAiBoardroomContext(prompt);
      const response = await fetch("/api/boardroom-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `AI boardroom request failed with status ${response.status}.`);
      const advice = payload.advice || {};
      const advisors = getAdvisorsForScenario(state);
      const advisorMap = new Map(advisors.map((advisor) => [advisor.id, advisor]));
      const inferredDisposition = advice.questionDisposition || (/\b(breakup|ex\b|dinner|tomato|personal life|relationship)\b/i.test(prompt) ? "off_topic" : "strategic");
      const voiceLimit = inferredDisposition === "strategic" ? 5 : 1;
      const responses = (Array.isArray(advice.responses) ? advice.responses : []).slice(0, voiceLimit).map((entry, index) => ({
        id: entry.id,
        name: advisorMap.get(entry.id)?.name || entry.id,
        text: entry.text,
        stance: entry.stance || (inferredDisposition === "strategic" ? (index === 1 ? "challenge" : "condition") : "redirect"),
        evidence: Array.isArray(entry.evidence) && entry.evidence.length ? entry.evidence : ["Live scorecard and decision timeline"],
        selectionReason: entry.selectionReason || "Luna selected this role because its operating responsibility is relevant to the question.",
      }));
      if (responses.length < 1) throw new Error("Luna returned no usable stakeholder response.");
      const legacySynthesis = String(advice.synthesis || advice.situationAssessment || "").trim();
      return {
        responses,
        questionDisposition: inferredDisposition,
        situationAssessment: advice.situationAssessment || legacySynthesis,
        observedBehavior: advice.observedBehavior || {
          currentOptimization: context.decisions.length ? "The latest recorded choices define the current operating direction." : "No completed decision pattern is available yet.",
          repeatedPattern: context.decisions.length > 1 ? "Compare the latest choices for a repeated strategic preference." : "One decision is not enough to establish a repeated pattern.",
          blindSpot: "Test the assumption that would most weaken the proposed action.",
          nextQuestion: "What measurable threshold would change this recommendation?",
        },
        tensionSummary: advice.tensionSummary || {
          agreement: legacySynthesis || "The board agrees that the next move needs a measurable operating test.",
          disagreement: "The selected roles place different weight on speed, cash protection, customer impact, and execution readiness.",
          missingInformation: "Verify the operating assumption most likely to change the recommendation.",
        },
        takeForward: advice.takeForward || {
          recommendation: legacySynthesis || responses[0].text,
          guardrail: "Set a stop-loss threshold before committing additional cash or operating capacity.",
          metric: "Margin health, service capacity, and cash impact",
        },
        synthesis: legacySynthesis || responses.map((entry) => entry.text).join(" "),
        model: payload.model || "OpenAI",
        responseId: payload.responseId || "",
      };
    } finally {
      window.clearTimeout(timeout);
      if (boardroomRequestController === controller) boardroomRequestController = null;
    }
  }

  async function sendMeetingMessage() {
    if (aiBoardroomBusy) return;
    if (!meetingActive(state)) {
      setStatus("Emergency meeting is not active.", true);
      return;
    }
    const prompt = els.meetingInput.value.trim();
    if (!prompt) {
      setStatus("Enter a question or challenge for the stakeholder.", true);
      return;
    }

    const contextSnapshot = boardroomContextSnapshot();
    hubView.pendingPrompt = prompt;

    state.meetingChat.push({
      id: `mt-${Math.random().toString(36).slice(2, 9)}`,
      speaker: "You",
      text: prompt,
    });

    els.meetingInput.value = "";
    let responses;
    let synthesis;
    let responseSource = "Deterministic advisor model";
    let situationAssessment = "";
    let aiResponseId = "";
    let questionDisposition = "strategic";
    let observedBehavior = null;
    let tensionSummary = null;
    let takeForward = null;
    const shouldUseAiBoardroom = aiAssistedSimulationActive() && isBusinessScenario(state);
    if (shouldUseAiBoardroom) {
      aiBoardroomBusy = true;
      els.sendMeetingBtn.disabled = true;
      els.sendMeetingBtn.textContent = "Assessing situation...";
      setStatus("AI boardroom is reviewing the live scorecard and decision timeline...");
      renderMeetingPanel();
      try {
        const advice = await requestAiBoardroomAdvice(prompt);
        if (!meetingActive(state)) return;
        responses = advice.responses;
        questionDisposition = advice.questionDisposition;
        situationAssessment = advice.situationAssessment;
        observedBehavior = advice.observedBehavior;
        tensionSummary = advice.tensionSummary;
        takeForward = advice.takeForward;
        synthesis = { name: "Board Synthesis", text: advice.synthesis };
        responseSource = `AI board analysis · ${advice.model}`;
        aiResponseId = advice.responseId;
        setStatus("Boardroom advice generated from the current simulation evidence.");
      } catch (error) {
        if (!meetingActive(state)) return;
        responses = buildFallbackMeetingResponses(prompt).slice(0, 5).map((entry, index) => ({
          ...entry,
          id: `fallback-${index}`,
          stance: index === 1 ? "challenge" : "condition",
          evidence: [],
          selectionReason: "Selected by the deterministic fallback because this role is relevant to the question.",
        }));
        synthesis = { name: "Board Synthesis", text: buildBoardroomSynthesis(prompt, responses) };
        responseSource = "Deterministic fallback · AI unavailable";
        setStatus(`AI boardroom unavailable; deterministic advice used. ${error.message}`, true);
      } finally {
        aiBoardroomBusy = false;
        hubView.pendingPrompt = "";
        els.sendMeetingBtn.disabled = !meetingActive(state);
        els.sendMeetingBtn.textContent = "Ask the Board";
      }
    } else {
      responses = buildFallbackMeetingResponses(prompt).slice(0, 5).map((entry, index) => ({
        ...entry,
        id: `fallback-${index}`,
        stance: index === 1 ? "challenge" : "condition",
        evidence: [],
        selectionReason: "Selected by the deterministic advisor model for this question.",
      }));
      synthesis = {
        name: isBusinessScenario(state) ? "Board Synthesis" : "Crisis-Room Synthesis",
        text: buildBoardroomSynthesis(prompt, responses),
      };
      setStatus("Emergency meeting response generated by deterministic stakeholder rules.");
    }

    responses.forEach((entry) => {
      state.meetingChat.push({
        id: `mt-${Math.random().toString(36).slice(2, 9)}`,
        speaker: entry.name,
        text: entry.text,
      });
    });
    state.meetingChat.push({
      id: `mt-${Math.random().toString(36).slice(2, 9)}`,
      speaker: synthesis.name,
      text: synthesis.text,
    });

    state.meetingRounds.push({
      id: `mr-${Math.random().toString(36).slice(2, 9)}`,
      prompt,
      time: formatTime(state.clock),
      source: responseSource,
      contextSnapshot,
      responses,
      questionDisposition,
      situationAssessment,
      observedBehavior,
      tensionSummary,
      takeForward,
      synthesis: synthesis.text,
      aiResponseId,
    });

    state.meetingChat = state.meetingChat.slice(-30);
    hubView.roundId = state.meetingRounds[state.meetingRounds.length - 1].id;
    hubView.inspector = null;
    hubView.pendingPrompt = "";
    renderMeetingPanel();
    renderAll();
    saveState();
  }

  function reloadFromStorage() {
    const loaded = loadState();
    if (!loaded) {
      hasSavedCampaign = false;
      updateResumeButton();
      setStatus("No saved state found.", true);
      return;
    }
    state = normalizeState(loaded);
    if (state.onboardingComplete) ensureSessionClock(state);
    dynamicEngineOn = Boolean(state.onboardingComplete);
    els.tickToggleBtn.textContent = state.onboardingComplete ? "Dynamic Engine: On" : "Dynamic Engine: Paused";
    selectedOptionIds.clear();
    activeSimulationPage = "command";
    hasSavedCampaign = true;
    updateResumeButton();
    populateLeaderSelect();
    populateScenarioSelect();
    renderAll();
    if (state.dismissed || state.sessionReportShown) {
      renderSessionReport();
      showSetupStage("report");
      setStatus(state.dismissed ? state.dismissalReason : "Session report restored.");
    } else {
      showSetupStage("simulation");
      if (!state.onboardingComplete) {
        openOnboarding();
        renderAll();
        setStatus("Orientation reloaded. The timer has not started.");
      } else {
        setStatus("State reloaded from local storage.");
      }
    }
    if (state.dismissed && !state.sessionReportShown) {
      openSessionReport();
    } else {
      saveState();
    }
  }

  function resetCampaign() {
    if (!window.confirm("Reset the current campaign?")) return;
    state = baseState(state.scenarioId || DEFAULT_SCENARIO_ID);
    applySelectedLeader();
    state.sessionReportShown = false;
    populateScenarioSelect();
    populateLeaderSelect();
    beginOnboardingRun("Campaign reset. Complete orientation to begin the new run.");
  }

  function toggleDynamicEngine() {
    if (!state.onboardingComplete) {
      setStatus("The decision engine remains paused until orientation is complete.", true);
      return;
    }
    dynamicEngineOn = !dynamicEngineOn;
    els.tickToggleBtn.textContent = `Dynamic Engine: ${dynamicEngineOn ? "On" : "Off"}`;
    setStatus(`Dynamic event engine ${dynamicEngineOn ? "enabled" : "paused"}.`);
  }

  function refreshRealtimeWindows() {
    if (!state) return;
    if (advanceEmergencyJourney()) { saveState(); renderAll(); }
    renderEmergencyExperience();
    if (emergencyBlocked()) { renderDecisionPacing(); return; }

    if (state.meetingActive && remainingMs(state.meetingEndsAt) === 0) {
      closeEmergencyMeeting("Emergency meeting expired.");
      return;
    }

    if (sessionExpired(state) && !state.sessionReportShown) {
      openSessionReport();
      return;
    }

    if (sessionExpired(state)) {
      dynamicEngineOn = false;
      els.tickToggleBtn.textContent = "Dynamic Engine: Off";
    }

    if (expireCrisisWindowIfNeeded(state)) saveState();
    renderDecisionPacing();
    renderEmergencyStrategyRoom();
    if (state.meetingUsed) renderMeetingPanel();
    if (isBusinessScenario(state) && activeSimulationPage === "impact") {
      marketUiTick += 1;
      renderBusinessStockMarket();
    }
  }

  function tickLoop() {
    if (!dynamicEngineOn || !state.onboardingComplete) return;
    if (sessionExpired(state) || meetingActive(state) || emergencyBlocked()) return;
    dynamicEventTick(state);
    renderAll();
    saveState();
  }

  function init() {
    const existing = loadState();
    state = normalizeState(existing || baseState(DEFAULT_SCENARIO_ID));
    document.body.append(els.meetingPanel, els.reflectionPanel, els.controversyModal, els.onboardingPanel);
    hasSavedCampaign = Boolean(existing);
    const ollamaSettings = loadOllamaSettings();
    els.ollamaModelInput.value = ollamaSettings.model;
    renderOllamaControls();

    populateScenarioSelect();
    populateLeaderSelect();
    updateResumeButton();
    showSetupStage("intro");

    els.beginBriefingBtn.addEventListener("click", () => {
      populateScenarioSelect();
      populateLeaderSelect();
      showSetupStage("setup");
      setStatus("Choose your role and scenario.");
    });
    els.resumeSavedBtn.addEventListener("click", resumeSavedSimulation);
    els.backToIntroBtn.addEventListener("click", () => {
      showSetupStage("intro");
      setStatus("Simulation briefing ready.");
    });
    els.launchSimulationBtn.addEventListener("click", launchConfiguredSimulation);
    els.caseBriefBackBtn.addEventListener("click", () => {
      showSetupStage("setup");
      setStatus("Adjust the scenario or designation, then continue to the case brief.");
    });
    els.caseBriefPreviousBtn.addEventListener("click", () => {
      caseBriefDirection = "back";
      caseBriefStep = Math.max(0, caseBriefStep - 1);
      renderOpeningCaseBrief();
    });
    els.caseBriefNextBtn.addEventListener("click", () => {
      caseBriefDirection = "forward";
      caseBriefStep = Math.min(getOpeningCaseBrief(state.scenarioId).steps.length - 1, caseBriefStep + 1);
      renderOpeningCaseBrief();
    });
    els.caseBriefContinueBtn.addEventListener("click", () => {
      const scenarioObj = SCENARIOS.find((item) => item.id === state.scenarioId);
      beginOnboardingRun(`Orientation ready for ${scenarioObj ? scenarioObj.name : state.scenarioId}. The timer has not started.`);
    });
    els.onboardingBackBtn.addEventListener("click", () => {
      onboardingStep = Math.max(0, onboardingStep - 1);
      renderOnboarding();
    });
    els.onboardingNextBtn.addEventListener("click", () => {
      onboardingStep = Math.min(onboardingSteps().length - 1, onboardingStep + 1);
      renderOnboarding();
    });
    els.onboardingStartBtn.addEventListener("click", startPlaying);
    els.leaderSelect.addEventListener("change", updateLeaderDescription);
    els.scenarioSelect.addEventListener("change", updateScenarioDescription);
    els.changeScenarioBtn.addEventListener("click", openSetupFromSimulation);
    els.simulationNav.addEventListener("click", (event) => {
      if (event.target.closest("#firstDecisionNudge")) {
        setSimulationPage("command");
        return;
      }
      const btn = event.target.closest("[data-sim-page]");
      if (!btn) return;
      if (!state.onboardingComplete) {
        renderOnboarding();
        return;
      }
      setSimulationPage(btn.dataset.simPage);
    });
    window.addEventListener("resize", () => positionTourCoachmark(false));
    window.addEventListener("scroll", () => positionTourCoachmark(false), true);
    els.priorityPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-priority-id]");
      if (!button) return;
      const priorityId = button.dataset.priorityId;
      const priorities = new Set(state.decisionPriorities || []);
      if (priorities.has(priorityId)) {
        priorities.delete(priorityId);
      } else if (priorities.size >= 3) {
        setStatus("Priority Mode supports up to 3 pinned outcomes.", true);
        return;
      } else {
        priorities.add(priorityId);
      }
      state.decisionPriorities = [...priorities];
      saveState();
      renderOptions();
      renderDecisionUtilities();
    });
    els.reflectionSaveBtn.addEventListener("click", saveDecisionReflection);
    els.reflectionInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveDecisionReflection();
      }
    });
    els.tabDomesticBtn.addEventListener("click", () => {
      activeInsightTab = "domestic";
      renderInsightTabs();
    });
    els.tabWorldBtn.addEventListener("click", () => {
      activeInsightTab = "world";
      renderInsightTabs();
    });
    els.tabEconomyBtn.addEventListener("click", () => {
      activeInsightTab = "economy";
      renderInsightTabs();
    });
    els.viewPreDecisionBtn.addEventListener("click", () => {
      if (!state.lastPreDecisionSnapshot) {
        setStatus("No before-decision snapshot available yet. Make a decision first.", true);
        return;
      }
      impactSnapshotMode = true;
      activeSimulationPage = "impact";
      renderAll();
      setStatus("Showing parameters exactly as they looked before the last decision.");
    });
    els.viewCurrentScenarioBtn.addEventListener("click", () => {
      impactSnapshotMode = false;
      activeSimulationPage = "impact";
      renderAll();
      setStatus("Returned to current live scenario parameters.");
    });
    els.controversyResponseOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-crisis-response]");
      if (!button) return;
      applyControversyResponse(button.dataset.crisisResponse);
    });
    els.controversyMajorDecisions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-major-decision]");
      if (!button) return;
      applyMajorControversyDecision(button.dataset.majorDecision);
    });
    els.publicStatementOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-statement-choice]");
      if (!button) return;
      releaseControversyStatement(button.dataset.statementChoice);
    });
    els.controversyMeetingBtn.addEventListener("click", conveneControversyMeeting);
    els.controversyModalCloseBtn.addEventListener("click", () => {
      if (state.emergencyControversy) state.emergencyControversy.popupOpen = false;
      saveState();
      renderAll();
    });
    els.controversyGoRoomBtn.addEventListener("click", () => {
      if (state.emergencyControversy) state.emergencyControversy.popupOpen = false;
      activeSimulationPage = "operations";
      saveState();
      renderAll();
      setStatus("Emergency Strategy Room opened.");
    });
    els.boardroomMeetingNavBtn.addEventListener("click", openMeetingFromNavigation);
    els.optionsWrap.addEventListener("change", (event) => {
      const input = event.target.closest("[data-option-id]");
      if (!input) return;
      const id = input.dataset.optionId;
      if (input.checked && selectedOptionIds.size >= 2) {
        input.checked = false;
        setStatus("You can select maximum 2 structured decisions.", true);
        return;
      }
      if (input.checked) selectedOptionIds.add(id);
      else selectedOptionIds.delete(id);
      renderOptions();
      renderDecisionUtilities();
    });
    els.optionsWrap.addEventListener("click", (event) => {
      const category = event.target.closest("[data-desk-category]");
      const remove = event.target.closest("[data-desk-remove]");
      const compare = event.target.closest("[data-desk-compare]");
      if (category) {
        deskView.category = window.SecondOrderWorkspaces.groupOptions(getDynamicOptions(state))[Number(category.dataset.deskCategory)]?.[0];
      } else if (remove) selectedOptionIds.delete(remove.dataset.deskRemove);
      else if (compare) deskView.compare = !deskView.compare;
      else return;
      renderOptions();
      renderDecisionUtilities();
      if (category) els.optionsWrap.querySelector(`[data-desk-category="${category.dataset.deskCategory}"]`)?.focus({ preventScroll: true });
      if (compare) {
        els.optionsWrap.querySelector("[data-desk-compare]")?.focus({ preventScroll: true });
        els.optionsWrap.querySelector(".explorer-comparison")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
    els.boardroomPromptChips.addEventListener("click", (event) => {
      const button = event.target.closest("[data-boardroom-prompt]");
      if (!button) return;
      els.meetingInput.value = button.dataset.boardroomPrompt || "";
      els.meetingInput.focus();
    });
    els.meetingChatLog.addEventListener("click", (event) => {
      const roundButton = event.target.closest("[data-hub-round]");
      const speaker = event.target.closest("[data-hub-speaker]");
      const reveal = event.target.closest("[data-hub-reveal]");
      const collapse = event.target.closest("[data-hub-collapse]");
      const inspector = event.target.closest("[data-hub-inspector]");
      const rounds = state.meetingRounds || [];
      const round = rounds.find((item) => item.id === hubView.roundId) || rounds[rounds.length - 1];
      if (roundButton) {
        hubView.roundId = roundButton.dataset.hubRound;
        hubView.inspector = null;
      } else if ((speaker || reveal || collapse) && round) {
        hubView.roundId = round.id;
        const count = window.SecondOrderWorkspaces.roundResponses(round).length;
        hubView.visible[round.id] = collapse ? 2 : reveal ? count : Math.max(hubView.visible[round.id] || 2, Number(speaker.dataset.hubSpeaker) + 1);
        hubView.inspector = null;
      } else if (inspector) hubView.inspector = inspector.dataset.hubInspector === "close" || hubView.inspector === inspector.dataset.hubInspector ? null : inspector.dataset.hubInspector;
      else return;
      renderMeetingPanel();
      if (roundButton) {
        els.meetingChatLog.scrollTop = 0;
        [...els.meetingChatLog.querySelectorAll("[data-hub-round]")].find((node) => node.dataset.hubRound === hubView.roundId)?.focus({ preventScroll: true });
      }
      if (speaker || reveal) {
        const message = els.meetingChatLog.querySelector(`[data-hub-message="${speaker ? speaker.dataset.hubSpeaker : 2}"]`);
        message?.focus({ preventScroll: true });
        message?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      if (collapse) els.meetingChatLog.querySelector("[data-hub-reveal]")?.focus({ preventScroll: true });
      if (inspector && hubView.inspector) {
        els.meetingChatLog.querySelector('[data-hub-inspector="close"]')?.focus({ preventScroll: true });
        els.meetingChatLog.querySelector(".hub-inspector")?.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      if (inspector && !hubView.inspector) els.meetingChatLog.querySelector(`[data-hub-inspector="${inspector.dataset.hubInspector === "close" ? "evidence" : inspector.dataset.hubInspector}"]`)?.focus({ preventScroll: true });
    });
    els.sendMeetingBtn.addEventListener("click", sendMeetingMessage);
    els.ollamaTestBtn.addEventListener("click", testOllamaConnection);
    els.ollamaModelInput.addEventListener("change", () => {
      saveOllamaSettings();
      setOllamaStatus(`Ollama model set to ${els.ollamaModelInput.value.trim() || DEFAULT_OLLAMA_MODEL}.`);
      renderOllamaControls();
    });
    els.exitMeetingBtn.addEventListener("click", () => closeEmergencyMeeting("Emergency meeting closed."));
    els.meetingInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        sendMeetingMessage();
      }
    });
    els.executeMilitaryOperationBtn.addEventListener("click", executeMilitaryOperation);
    els.executeBtn.addEventListener("click", executeDecision);
    els.applyScenarioBtn.addEventListener("click", applyScenarioSelection);
    els.connectFileBtn.addEventListener("click", connectSaveFile);
    els.exportBtn.addEventListener("click", exportSave);
    els.importInput.addEventListener("change", (e) => {
      importSave(e.target.files[0]);
      e.target.value = "";
    });
    els.resetBtn.addEventListener("click", resetCampaign);
    els.tickToggleBtn.addEventListener("click", toggleDynamicEngine);
    els.reloadBtn.addEventListener("click", reloadFromStorage);
    els.reportRestartBtn.addEventListener("click", () => {
      state = baseState(state.scenarioId || DEFAULT_SCENARIO_ID);
      applySelectedLeader();
      state.sessionReportShown = false;
      beginOnboardingRun("New run ready. Complete orientation to start the timer.");
    });
    els.reportSetupBtn.addEventListener("click", () => {
      state.sessionReportShown = false;
      showSetupStage("setup");
      setStatus("Review setup and relaunch when ready.");
    });

    tickTimer = window.setInterval(tickLoop, REALTIME_TICK_MS);
    uiTimer = window.setInterval(refreshRealtimeWindows, 1000);
    const initText = missingDomIds.length
      ? `Interface initialized with missing UI nodes: ${missingDomIds.join(", ")}.`
      : "Briefing ready. Start from the introduction screen to launch a simulation.";
    setStatus(initText, missingDomIds.length > 0);
  }

  try {
    init();
  } catch (error) {
    console.error(error);
    const status = document.getElementById("statusLine");
    if (status) {
      status.textContent = `Initialization error: ${error.message}`;
      status.style.color = "#a12020";
    }
  }
})();


























