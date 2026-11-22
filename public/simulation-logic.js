(function attachSecondOrderLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SecondOrderLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildSecondOrderLogic() {
  const GROUPS = ["stats", "threats", "domestic", "sentiment", "economy", "systems"];

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function average(values) {
    const valid = values.filter(Number.isFinite);
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
  }

  function emptyGroupedDeltas() {
    return GROUPS.reduce((output, group) => {
      output[group] = {};
      return output;
    }, {});
  }

  function addDelta(grouped, group, key, value) {
    if (!grouped[group] || !Number.isFinite(Number(value)) || Number(value) === 0) return;
    grouped[group][key] = clamp((grouped[group][key] || 0) + Number(value), -8, 8);
  }

  function mergeGroupedDeltas(target, source, factor = 1) {
    GROUPS.forEach((group) => {
      Object.entries((source && source[group]) || {}).forEach(([key, value]) => {
        addDelta(target, group, key, Math.round(Number(value || 0) * factor));
      });
    });
    return target;
  }

  function profileComponents(profile) {
    if (profile && Array.isArray(profile.components) && profile.components.length) return profile.components;
    return profile ? [profile] : [];
  }

  function normalizedStyle(component) {
    const style = String((component && component.style) || "business").toLowerCase();
    if (style === "pilot") return "product";
    return style;
  }

  function businessFundamentals(state) {
    return Math.round(average([
      state.stats.FiscalHealth,
      state.stats.EconomicStability,
      state.stats.DiplomaticStanding,
      state.systems.MarketConfidence,
      state.systems.HealthcareCapacity,
      state.systems.SupplyChainIntegrity,
    ]));
  }

  const BUSINESS_DECISION_CONTRACTS = {
    discounting: {
      label: "Discount-led volume",
      readiness: { cash: 0.25, market: 0.25, trust: 0.3, management: 0.2 },
      preconditions: [],
      directMax: 6,
      affected: {
        stats: ["FiscalHealth", "EconomicStability", "PublicConfidence", "AirQuality"],
        threats: ["EconomicPressure", "DisinformationRisk", "PollutionCrisis"],
        economy: ["CurrencyValue", "StockIndex"],
        systems: ["MarketConfidence"],
      },
      directEffect: "Discounting can protect short-term volume and cash conversion, but it reduces margin and brand quality.",
      tradeoff: "Pricing power, investor confidence, and brand trust weaken when discounting becomes the default growth lever.",
      delayedEffects: [{ delayMinutes: 70, actor: "Investors", tone: "concerned", reason: "Repeated discount dependence weakens pricing power and the quality of reported growth.", deltas: { economy: { CurrencyValue: -3, StockIndex: -2 }, domestic: { ParliamentApproval: -2, OppositionPressure: 3 }, stats: { PublicConfidence: -2 } } }],
    },
    expansion: {
      label: "Aggressive expansion",
      readiness: { cash: 0.3, supply: 0.25, service: 0.2, management: 0.25 },
      preconditions: [{ dimension: "cash", minimum: 52 }, { dimension: "supply", minimum: 54 }, { dimension: "service", minimum: 52 }, { dimension: "management", minimum: 52 }],
      directMax: 9,
      affected: {
        stats: ["NationalSecurity", "EconomicStability", "FiscalHealth", "PublicConfidence", "AirQuality", "DiplomaticStanding"],
        threats: ["EconomicPressure", "BorderTension", "PollutionCrisis", "DisinformationRisk"],
        economy: ["StockIndex", "CurrencyValue"],
        systems: ["MarketConfidence", "SupplyChainIntegrity", "HealthcareCapacity", "InfrastructureIntegrity"],
      },
      directEffect: "Expansion can create growth, but only when cash, supply capacity, service capacity, and management bandwidth can support it.",
      tradeoff: "Growth ahead of operating readiness converts ambition into integration cost, service failure, and board scrutiny.",
      delayedEffects: [{ delayMinutes: 55, actor: "Board Risk Committee", tone: "concerned", reason: "The board tests whether expansion milestones are supported by cash and operating capacity.", deltas: { domestic: { ParliamentApproval: -3, OppositionPressure: 3 }, systems: { MarketConfidence: -2 } } }],
    },
    service: {
      label: "Service and trust investment",
      readiness: { cash: 0.25, service: 0.35, management: 0.2, trust: 0.2 },
      preconditions: [{ dimension: "cash", minimum: 34 }, { dimension: "management", minimum: 42 }],
      directMax: 7,
      affected: {
        stats: ["PublicConfidence", "DiplomaticStanding", "FiscalHealth", "NationalSecurity"],
        threats: ["DisinformationRisk", "TerrorThreat", "EconomicPressure"],
        economy: ["StockIndex"],
        systems: ["HealthcareCapacity", "MarketConfidence", "InfrastructureIntegrity"],
      },
      directEffect: "Service investment consumes cash and management attention before customers experience the benefit.",
      tradeoff: "Near-term margin is exchanged for lower warranty friction, stronger trust, and more credible growth later.",
      delayedEffects: [{ delayMinutes: 80, actor: "Customers", tone: "supportive", reason: "Measured warranty turnaround and service reliability improve trust after execution evidence appears.", deltas: { stats: { PublicConfidence: 4, DiplomaticStanding: 2 }, sentiment: { TrustInGovernment: 3 }, systems: { HealthcareCapacity: 2, MarketConfidence: 2 }, domestic: { ParliamentApproval: 2, OppositionPressure: -2 } } }],
    },
    supply: {
      label: "Supply and operating resilience",
      readiness: { cash: 0.25, supply: 0.35, management: 0.25, market: 0.15 },
      preconditions: [{ dimension: "cash", minimum: 35 }, { dimension: "management", minimum: 40 }],
      directMax: 8,
      affected: {
        stats: ["FiscalHealth", "DiplomaticStanding", "EconomicStability", "NationalSecurity", "AirQuality"],
        threats: ["EconomicPressure", "PollutionCrisis", "BorderTension"],
        economy: ["CurrencyValue", "OilPrice", "StockIndex"],
        systems: ["SupplyChainIntegrity", "OilStability", "MarketConfidence", "InfrastructureIntegrity", "HealthcareCapacity"],
      },
      directEffect: "Operating resilience costs money now but reduces launch, inventory, and quality failure risk.",
      tradeoff: "The benefit appears through fewer disruptions rather than an immediate demand spike.",
      delayedEffects: [{ delayMinutes: 90, actor: "Operations Council", tone: "supportive", reason: "Supplier and execution controls reduce disruption risk after operating milestones are verified.", deltas: { systems: { SupplyChainIntegrity: 3, MarketConfidence: 2 }, stats: { FiscalHealth: 1, DiplomaticStanding: 2 }, threats: { EconomicPressure: -2 } } }],
    },
    finance: {
      label: "Financial discipline",
      readiness: { cash: 0.35, management: 0.25, market: 0.25, trust: 0.15 },
      preconditions: [],
      directMax: 7,
      affected: {
        stats: ["FiscalHealth", "EconomicStability", "DiplomaticStanding", "PublicConfidence"],
        threats: ["EconomicPressure", "DisinformationRisk", "PollutionCrisis"],
        economy: ["CurrencyValue", "StockIndex", "Inflation"],
        systems: ["MarketConfidence"],
      },
      directEffect: "Cash, unit-economics, and margin controls improve financial resilience and decision credibility.",
      tradeoff: "Financial discipline can slow growth and may face channel resistance if it is not paired with customer value.",
      delayedEffects: [{ delayMinutes: 65, actor: "Investors", tone: "supportive", reason: "Auditable margin and cash controls improve confidence once evidence is available.", deltas: { domestic: { ParliamentApproval: 3, OppositionPressure: -3 }, economy: { StockIndex: 2 }, systems: { MarketConfidence: 2 } } }],
    },
    product: {
      label: "Focused product investment",
      readiness: { cash: 0.2, supply: 0.25, service: 0.25, management: 0.15, market: 0.15 },
      preconditions: [{ dimension: "supply", minimum: 44 }, { dimension: "service", minimum: 42 }],
      directMax: 7,
      affected: {
        stats: ["NationalSecurity", "PublicConfidence", "FiscalHealth", "AirQuality", "EconomicStability"],
        threats: ["PollutionCrisis", "DisinformationRisk", "EconomicPressure", "TerrorThreat"],
        economy: ["CurrencyValue", "StockIndex"],
        systems: ["InfrastructureIntegrity", "MarketConfidence", "SupplyChainIntegrity", "HealthcareCapacity"],
      },
      directEffect: "Focused product choices can improve portfolio quality, differentiation, and repeat purchase potential.",
      tradeoff: "Product ambition creates little value when quality, supply, or service systems cannot support the promise.",
      delayedEffects: [{ delayMinutes: 85, actor: "Product Council", tone: "neutral", reason: "Quality, repeat purchase, and service evidence determine whether the product decision creates durable value.", deltas: { stats: { NationalSecurity: 2, PublicConfidence: 2 }, systems: { MarketConfidence: 2, HealthcareCapacity: 1 } } }],
    },
    brand: {
      label: "Brand and demand investment",
      readiness: { cash: 0.25, trust: 0.3, market: 0.25, service: 0.2 },
      preconditions: [{ dimension: "cash", minimum: 38 }, { dimension: "trust", minimum: 42 }],
      directMax: 6,
      affected: {
        stats: ["PublicConfidence", "AirQuality", "FiscalHealth", "EconomicStability"],
        threats: ["DisinformationRisk", "EconomicPressure", "PollutionCrisis"],
        economy: ["StockIndex", "CurrencyValue"],
        systems: ["MarketConfidence"],
      },
      directEffect: "Brand investment can lift awareness and demand when the promise is distinctive and credible.",
      tradeoff: "Campaign spend cannot compensate for weak service, weak products, or unresolved margin pressure.",
      delayedEffects: [{ delayMinutes: 70, actor: "Consumers", tone: "neutral", reason: "Customer response depends on whether campaign claims match product and service experience.", deltas: { stats: { PublicConfidence: 2 }, sentiment: { TrustInGovernment: 2 }, systems: { MarketConfidence: 1 } } }],
    },
    channel: {
      label: "Channel and distribution move",
      readiness: { supply: 0.25, market: 0.3, cash: 0.2, management: 0.15, service: 0.1 },
      preconditions: [{ dimension: "supply", minimum: 42 }, { dimension: "cash", minimum: 36 }],
      directMax: 6,
      affected: {
        stats: ["EconomicStability", "FiscalHealth", "PublicConfidence"],
        threats: ["EconomicPressure", "BorderTension"],
        economy: ["StockIndex", "CurrencyValue"],
        systems: ["MarketConfidence", "SupplyChainIntegrity"],
      },
      directEffect: "Channel choices affect sell-through, replenishment quality, reach, and working-capital efficiency.",
      tradeoff: "Bought visibility or shipment-led growth can hide weak sell-through and create inventory pressure.",
      delayedEffects: [{ delayMinutes: 75, actor: "Retail Partners", tone: "neutral", reason: "Sell-through and replenishment data determine whether channel growth is healthy or inventory-led.", deltas: { systems: { MarketConfidence: 2, SupplyChainIntegrity: 1 }, stats: { EconomicStability: 2 } } }],
    },
    trust_violation: {
      label: "Trust-violating action",
      readiness: { trust: 0.4, management: 0.3, market: 0.2, cash: 0.1 },
      preconditions: [],
      directMax: 10,
      affected: {
        stats: ["DiplomaticStanding", "PublicConfidence", "FiscalHealth", "EconomicStability", "AirQuality"],
        threats: ["DisinformationRisk", "EconomicPressure", "TerrorThreat", "PollutionCrisis"],
        economy: ["StockIndex", "CurrencyValue"],
        systems: ["MarketConfidence", "InfrastructureIntegrity", "HealthcareCapacity"],
      },
      directEffect: "Misleading claims or manipulated evidence can create a temporary appearance of progress but violate the simulation's credibility boundary.",
      tradeoff: "Trust violations create asymmetric downside across consumers, employees, investors, regulators, and the board.",
      delayedEffects: [{ delayMinutes: 30, actor: "Consumers and Board", tone: "hostile", reason: "The credibility breach triggers scrutiny, loss of trust, and governance consequences.", deltas: { stats: { PublicConfidence: -7, DiplomaticStanding: -6 }, threats: { DisinformationRisk: 8, EconomicPressure: 4 }, systems: { MarketConfidence: -7 }, domestic: { ParliamentApproval: -8, OppositionPressure: 8, MediaHostility: 8 }, sentiment: { TrustInGovernment: -7 } } }],
    },
    governance: {
      label: "Governance and control",
      readiness: { management: 0.4, cash: 0.2, trust: 0.25, market: 0.15 },
      preconditions: [{ dimension: "management", minimum: 35 }],
      directMax: 7,
      affected: {
        stats: ["DiplomaticStanding", "PublicConfidence", "FiscalHealth", "EconomicStability"],
        threats: ["DisinformationRisk", "EconomicPressure", "PollutionCrisis"],
        economy: ["StockIndex", "CurrencyValue"],
        systems: ["MarketConfidence", "InfrastructureIntegrity", "HealthcareCapacity", "SupplyChainIntegrity"],
      },
      directEffect: "Governance creates decision quality, accountability, and credible evidence for stakeholders.",
      tradeoff: "Controls add process cost but reduce execution errors and unsupported promises.",
      delayedEffects: [{ delayMinutes: 60, actor: "Board", tone: "supportive", reason: "Clear owners, audited controls, and measurable milestones improve board confidence.", deltas: { domestic: { ParliamentApproval: 3, OppositionPressure: -3, MediaHostility: -2 }, systems: { MarketConfidence: 2 }, stats: { DiplomaticStanding: 2 } } }],
    },
  };

  function businessMetric(state, group, key, fallback = 50) {
    const value = Number(state && state[group] && state[group][key]);
    return Number.isFinite(value) ? value : fallback;
  }

  function businessReadinessDimensions(state) {
    return {
      cash: businessMetric(state, "stats", "FiscalHealth"),
      supply: businessMetric(state, "systems", "SupplyChainIntegrity"),
      service: businessMetric(state, "systems", "HealthcareCapacity"),
      management: average([
        businessMetric(state, "domestic", "ParliamentApproval"),
        businessMetric(state, "systems", "InfrastructureIntegrity"),
        100 - businessMetric(state, "domestic", "OppositionPressure"),
      ]),
      market: average([
        businessMetric(state, "stats", "EconomicStability"),
        businessMetric(state, "systems", "MarketConfidence"),
        100 - businessMetric(state, "threats", "EconomicPressure"),
      ]),
      trust: average([
        businessMetric(state, "stats", "PublicConfidence"),
        businessMetric(state, "sentiment", "TrustInGovernment"),
        100 - businessMetric(state, "threats", "DisinformationRisk"),
      ]),
    };
  }

  function businessContractKey(component) {
    const style = normalizedStyle(component);
    const text = `${component && component.id || ""} ${component && component.title || ""} ${component && component.domain || ""}`.toLowerCase();
    if (/discount|price war|ultra-low|cut ad spend/.test(text)) return "discounting";
    if (style === "unethical" || /fake|mislead|false claim|manipulat|review farm|fraud/.test(text)) return "trust_violation";
    if (style === "overreach" || /aggressively acquire|enter three new categories|flood the market|all categories/.test(text)) return "expansion";
    if (/service|warranty|quality dashboard|turnaround/.test(text)) return "service";
    if (/supplier|manufactur|supply|dual-source|redundancy|operation/.test(text)) return "supply";
    if (style === "finance" || style === "pricing" || /margin|cash|ipo|unit economics|data room/.test(text)) return "finance";
    if (style === "product" || /product|portfolio|sku|earbud|audio/.test(text)) return "product";
    if (style === "brand") return "brand";
    if (style === "market" || /channel|dealer|marketplace|retail/.test(text)) return "channel";
    return "governance";
  }

  function weightedReadiness(dimensions, weights) {
    const entries = Object.entries(weights || {});
    const totalWeight = entries.reduce((sum, [, weight]) => sum + Number(weight || 0), 0) || 1;
    return entries.reduce((sum, [dimension, weight]) => sum + Number(dimensions[dimension] || 0) * Number(weight || 0), 0) / totalWeight;
  }

  function businessEnvironmentScore(state, contractKey, dimensions) {
    let score = average([
      dimensions.market,
      dimensions.trust,
      100 - businessMetric(state, "threats", "BorderTension"),
      100 - businessMetric(state, "threats", "PollutionCrisis"),
    ]);
    if ((contractKey === "finance" || contractKey === "governance" || contractKey === "supply") && businessMetric(state, "threats", "EconomicPressure") >= 65) score += 7;
    if ((contractKey === "brand" || contractKey === "expansion") && businessMetric(state, "threats", "EconomicPressure") >= 65) score -= 10;
    return clamp(Math.round(score), 20, 90);
  }

  function businessStrategicConsistency(state, contractKey, dimensions) {
    const reviews = Array.isArray(state && state.decisionReviews) ? state.decisionReviews.slice(-6) : [];
    const foundationKeys = new Set(["finance", "governance", "service", "supply"]);
    const growthKeys = new Set(["expansion", "product", "brand", "channel"]);
    const priorKeys = reviews.flatMap((review) => {
      const components = Array.isArray(review.optionIds) && review.optionIds.length
        ? [{ id: review.optionIds[0], title: review.title, style: review.style, domain: review.domain }]
        : [{ title: review.title, style: review.style, domain: review.domain }];
      return components.map(businessContractKey);
    });
    let score = 62;
    if (growthKeys.has(contractKey) && priorKeys.some((key) => foundationKeys.has(key))) score += 12;
    if (growthKeys.has(contractKey) && average([dimensions.cash, dimensions.supply, dimensions.service, dimensions.management]) < 48) score -= 20;
    if (foundationKeys.has(contractKey) && average([dimensions.cash, dimensions.supply, dimensions.service]) < 52) score += 8;
    const priorities = (state && Array.isArray(state.decisionPriorities) ? state.decisionPriorities : []).join(" ").toLowerCase();
    const priorityTerms = {
      finance: /margin|cash|finance|pricing/,
      governance: /board|governance|confidence/,
      service: /service|trust|warranty/,
      supply: /supply|manufactur|resilience/,
      expansion: /growth|revenue|market share/,
      product: /product|portfolio|quality/,
      brand: /brand|trust|consumer/,
      channel: /channel|retail|revenue/,
      discounting: /revenue|volume|pricing/,
    };
    if (priorities && priorityTerms[contractKey] && priorityTerms[contractKey].test(priorities)) score += 8;
    return clamp(Math.round(score), 25, 92);
  }

  function businessSaturation(state, contractKey) {
    const reviews = Array.isArray(state && state.decisionReviews) ? state.decisionReviews.slice(-6) : [];
    const repetitions = reviews.filter((review) => businessContractKey(review) === contractKey).length;
    const factors = [1, 0.82, 0.68, 0.56, 0.48];
    return { repetitions, factor: factors[Math.min(repetitions, factors.length - 1)] };
  }

  function mergeContractDefinitions(contractKeys) {
    const affected = emptyGroupedDeltas();
    const delayedEffects = [];
    let directMax = 0;
    contractKeys.forEach((key) => {
      const contract = BUSINESS_DECISION_CONTRACTS[key];
      directMax = Math.max(directMax, contract.directMax);
      GROUPS.forEach((group) => {
        (contract.affected[group] || []).forEach((metric) => { affected[group][metric] = true; });
      });
      delayedEffects.push(...contract.delayedEffects);
    });
    return { affected, directMax, delayedEffects: delayedEffects.slice(0, 3) };
  }

  function validateBusinessProfileDeltas(profile, evaluation) {
    const definition = mergeContractDefinitions(evaluation.contractKeys);
    const fieldGroups = { statsDelta: "stats", threatDelta: "threats", economyDelta: "economy", systemsDelta: "systems" };
    const validated = {};
    const rejectedEffects = [];
    Object.entries(fieldGroups).forEach(([field, group]) => {
      validated[field] = {};
      Object.entries(profile && profile[field] || {}).forEach(([key, rawValue]) => {
        if (!definition.affected[group][key]) {
          rejectedEffects.push(`${group}.${key}`);
          return;
        }
        const value = Number(rawValue || 0);
        if (!Number.isFinite(value) || value === 0) return;
        validated[field][key] = Math.round(clamp(value, -definition.directMax, definition.directMax));
      });
    });
    return { ...validated, rejectedEffects, directMax: definition.directMax };
  }

  function evaluateBusinessDecision(state, profile, randomValue = 0.5) {
    const components = profileComponents(profile);
    const contractKeys = [...new Set(components.map(businessContractKey))];
    const contracts = contractKeys.map((key) => BUSINESS_DECISION_CONTRACTS[key]);
    const dimensions = businessReadinessDimensions(state);
    const readinessScore = Math.round(average(contracts.map((contract) => weightedReadiness(dimensions, contract.readiness))));
    const environmentScore = Math.round(average(contractKeys.map((key) => businessEnvironmentScore(state, key, dimensions))));
    const consistencyScore = Math.round(average(contractKeys.map((key) => businessStrategicConsistency(state, key, dimensions))));
    const saturation = contractKeys.map((key) => businessSaturation(state, key));
    const saturationFactor = Math.min(...saturation.map((item) => item.factor));
    const failedPreconditions = [];
    contracts.forEach((contract, index) => contract.preconditions.forEach((condition) => {
      const actual = Math.round(dimensions[condition.dimension]);
      if (actual < condition.minimum) failedPreconditions.push({ contract: contract.label, dimension: condition.dimension, minimum: condition.minimum, actual });
    }));
    const credibility = clamp(Number(profile && profile.legality || 0.5) * 100);
    const risk = clamp(Number(profile && profile.risk || 0.5) * 100);
    const baseImpact = clamp(76 + credibility * 0.08 - risk * 0.15, 48, 86);
    const factor = (score) => 0.7 + score / 300;
    const controlledUncertainty = Math.round((clamp(randomValue, 0, 0.999999) - 0.5) * 8);
    let outcomeScore = baseImpact * factor(readinessScore) * factor(environmentScore) * factor(consistencyScore) * saturationFactor + controlledUncertainty;
    const severeFailure = failedPreconditions.some((item) => item.actual <= item.minimum - 15);
    if (severeFailure) outcomeScore = Math.min(outcomeScore, 36);
    else if (failedPreconditions.length) outcomeScore = Math.min(outcomeScore, 57);
    outcomeScore = Math.round(clamp(outcomeScore, 0, 100));
    const scenario = outcomeScore >= 65 ? "Success" : outcomeScore >= 42 ? "Partial" : "Blowback";
    const definition = mergeContractDefinitions(contractKeys);
    const labels = contracts.map((contract) => contract.label);
    const explanation = failedPreconditions.length
      ? `${labels.join(" + ")} produced a ${scenario.toLowerCase()} result because ${failedPreconditions.map((item) => `${item.dimension} readiness was ${item.actual}/100 against a ${item.minimum}/100 threshold`).join("; ")}.`
      : `${labels.join(" + ")} produced a ${scenario.toLowerCase()} result with readiness ${readinessScore}/100, environment ${environmentScore}/100, strategic consistency ${consistencyScore}/100, and saturation ${Math.round(saturationFactor * 100)}%.`;
    return {
      scenario,
      outcomeScore,
      contractKeys,
      contractLabels: labels,
      readinessScore,
      readinessDimensions: Object.fromEntries(Object.entries(dimensions).map(([key, value]) => [key, Math.round(value)])),
      environmentScore,
      consistencyScore,
      saturationFactor,
      repetitionCount: Math.max(...saturation.map((item) => item.repetitions)),
      controlledUncertainty,
      failedPreconditions,
      directEffects: contracts.map((contract) => contract.directEffect),
      tradeoffs: contracts.map((contract) => contract.tradeoff),
      delayedEffects: definition.delayedEffects,
      likelyStakeholders: [...new Set(definition.delayedEffects.map((effect) => effect.actor))],
      explanation,
    };
  }

  function businessOptionSignals(state, profile) {
    const grouped = emptyGroupedDeltas();
    const notes = [];
    const fundamentals = businessFundamentals(state);
    const highMarginPressure = state.threats.EconomicPressure >= 70;
    const weakExecution = state.systems.HealthcareCapacity < 52 || state.systems.SupplyChainIntegrity < 50;

    profileComponents(profile).forEach((component) => {
      const style = normalizedStyle(component);
      const text = `${component.id || ""} ${component.title || ""}`.toLowerCase();
      const discountDependence = /cut ad spend|rely on price discounts|blanket discount|deep discount|price war|ultra-low/.test(text);
      const ipoNarrative = /ipo|valuation|investor/.test(text);

      if (style === "finance" || style === "pricing") {
        if (discountDependence) {
          addDelta(grouped, "domestic", "ParliamentApproval", -2);
          addDelta(grouped, "domestic", "OppositionPressure", 4);
          addDelta(grouped, "domestic", "ElectionPressure", 3);
          addDelta(grouped, "domestic", "MediaHostility", 2);
          notes.push("Discount-led volume protects short-term cash but increases investor concern about brand and pricing quality.");
        } else {
          const evidenceStrong = fundamentals >= 55;
          addDelta(grouped, "domestic", "ParliamentApproval", evidenceStrong ? 3 : 2);
          addDelta(grouped, "domestic", "OppositionPressure", ipoNarrative && !evidenceStrong ? -1 : evidenceStrong ? -4 : -3);
          addDelta(grouped, "domestic", "ElectionPressure", evidenceStrong ? -3 : -2);
          addDelta(grouped, "domestic", "MediaHostility", ipoNarrative && !evidenceStrong ? 1 : -1);
          notes.push(ipoNarrative && !evidenceStrong
            ? "The IPO narrative earns limited confidence until margin, service, and execution evidence become stronger."
            : "Cash and margin discipline directly reduce investor uncertainty, while marketplace resistance remains a separate risk.");
        }
      } else if (style === "governance" || style === "operations") {
        addDelta(grouped, "domestic", "ParliamentApproval", 3);
        addDelta(grouped, "domestic", "OppositionPressure", -3);
        addDelta(grouped, "domestic", "ElectionPressure", -2);
        addDelta(grouped, "domestic", "MediaHostility", -2);
        notes.push("Execution and governance improvements build board and investor confidence after evidence appears.");
      } else if (style === "product") {
        addDelta(grouped, "domestic", "ParliamentApproval", weakExecution ? -1 : 1);
        addDelta(grouped, "domestic", "OppositionPressure", weakExecution ? 2 : -1);
        notes.push(weakExecution
          ? "Product ambition increases investor scrutiny because service or supply capacity is still weak."
          : "Focused product investment is credible because the operating base can support it.");
      } else if (style === "brand" || style === "market") {
        addDelta(grouped, "domestic", "ParliamentApproval", highMarginPressure ? -1 : 1);
        addDelta(grouped, "domestic", "OppositionPressure", highMarginPressure ? 2 : -1);
        notes.push(highMarginPressure
          ? "Growth spending attracts scrutiny while margin pressure remains unresolved."
          : "Measured growth investment supports confidence because financial pressure is under control.");
      } else if (style === "overreach") {
        addDelta(grouped, "domestic", "ParliamentApproval", -4);
        addDelta(grouped, "domestic", "OppositionPressure", 5);
        addDelta(grouped, "domestic", "ElectionPressure", 4);
        notes.push("Overexpansion weakens confidence because integration demands exceed current operating capacity.");
      } else if (style === "unethical") {
        addDelta(grouped, "domestic", "ParliamentApproval", -6);
        addDelta(grouped, "domestic", "OppositionPressure", 7);
        addDelta(grouped, "domestic", "MediaHostility", 6);
        notes.push("A trust violation creates immediate governance and investor consequences.");
      }
    });

    const styles = new Set(profileComponents(profile).map(normalizedStyle));
    if (styles.size > 1) {
      if ((styles.has("finance") || styles.has("pricing")) && (styles.has("governance") || styles.has("operations"))) {
        addDelta(grouped, "domestic", "ParliamentApproval", 1);
        addDelta(grouped, "domestic", "OppositionPressure", -1);
        addDelta(grouped, "systems", "MarketConfidence", 1);
        notes.push("Financial discipline paired with execution reform is more credible than either move alone.");
      }
      if (styles.has("product") && (styles.has("governance") || styles.has("operations"))) {
        addDelta(grouped, "systems", "SupplyChainIntegrity", 1);
        addDelta(grouped, "systems", "HealthcareCapacity", 1);
        addDelta(grouped, "stats", "NationalSecurity", 1);
        notes.push("Product ambition is reinforced by simultaneous operating-capacity investment.");
      }
      if (styles.has("product") && (styles.has("brand") || styles.has("market"))) {
        addDelta(grouped, "stats", "PublicConfidence", weakExecution ? 0 : 1);
        addDelta(grouped, "stats", "EconomicStability", 1);
        if (weakExecution) addDelta(grouped, "systems", "MarketConfidence", -1);
        notes.push(weakExecution
          ? "Demand generation runs ahead of service and supply capacity, limiting the combined benefit."
          : "A focused product and channel combination improves commercial coherence.");
      }
    }

    return { deltas: grouped, notes: notes.slice(0, 5), fundamentals };
  }

  function businessStakeholderTargets(state) {
    const s = state.stats;
    const t = state.threats;
    const y = state.systems;
    return {
      domestic: {
        ParliamentApproval:
          s.DiplomaticStanding * 0.25 + s.FiscalHealth * 0.2 + s.EconomicStability * 0.16 +
          y.MarketConfidence * 0.12 + y.HealthcareCapacity * 0.1 + y.SupplyChainIntegrity * 0.08 +
          (100 - t.EconomicPressure) * 0.09,
        OppositionPressure:
          t.EconomicPressure * 0.24 + t.BorderTension * 0.18 + (100 - s.FiscalHealth) * 0.18 +
          (100 - s.DiplomaticStanding) * 0.16 + t.DisinformationRisk * 0.12 +
          (100 - y.MarketConfidence) * 0.12,
        MediaHostility:
          t.DisinformationRisk * 0.45 + (100 - s.DiplomaticStanding) * 0.3 +
          (100 - s.PublicConfidence) * 0.15 + t.BorderTension * 0.1,
        ProtestRisk:
          (100 - y.MarketConfidence) * 0.3 + (100 - y.HealthcareCapacity) * 0.25 +
          t.BorderTension * 0.2 + (100 - y.SupplyChainIntegrity) * 0.15 +
          (100 - s.PublicConfidence) * 0.1,
        ElectionPressure:
          t.EconomicPressure * 0.3 + (100 - s.FiscalHealth) * 0.25 +
          (100 - s.DiplomaticStanding) * 0.2 + t.BorderTension * 0.15 +
          (100 - s.EconomicStability) * 0.1,
      },
      sentiment: {
        TrustInGovernment:
          s.PublicConfidence * 0.35 + y.MarketConfidence * 0.25 + s.DiplomaticStanding * 0.2 +
          y.HealthcareCapacity * 0.1 + s.EconomicStability * 0.1,
        PanicLevel:
          t.EconomicPressure * 0.25 + t.DisinformationRisk * 0.2 + (100 - s.FiscalHealth) * 0.2 +
          (100 - y.HealthcareCapacity) * 0.15 + (100 - s.EconomicStability) * 0.1 + t.BorderTension * 0.1,
        Nationalism: s.PublicConfidence * 0.35 + s.AirQuality * 0.4 + s.EconomicStability * 0.25,
        CommunalTension:
          t.DisinformationRisk * 0.35 + t.PollutionCrisis * 0.25 + (100 - y.HealthcareCapacity) * 0.2 +
          (100 - y.SupplyChainIntegrity) * 0.2,
      },
    };
  }

  function moveToward(current, target, responsiveness = 0.22, maxStep = 3) {
    const difference = Number(target) - Number(current);
    if (Math.abs(difference) < 2) return clamp(current);
    const rawStep = Math.round(difference * responsiveness);
    const step = Math.max(-maxStep, Math.min(maxStep, rawStep || Math.sign(difference)));
    return clamp(Number(current) + step);
  }

  function rebalanceBusinessStakeholders(state, responsiveness = 0.22, maxStep = 3) {
    const targets = businessStakeholderTargets(state);
    ["domestic", "sentiment"].forEach((group) => {
      Object.entries(targets[group]).forEach(([key, target]) => {
        state[group][key] = moveToward(state[group][key], target, responsiveness, maxStep);
      });
    });
    return targets;
  }

  function businessEventChance(state) {
    const pressure = average([
      state.threats.EconomicPressure,
      state.threats.BorderTension,
      state.threats.PollutionCrisis,
      100 - state.stats.FiscalHealth,
      100 - state.systems.HealthcareCapacity,
    ]);
    return clamp(0.18 + Math.max(0, pressure - 48) / 180, 0.18, 0.42);
  }

  function businessEventCandidates(state, lastDecision) {
    const style = String((lastDecision && lastDecision.style) || "").toLowerCase();
    const title = String((lastDecision && lastDecision.title) || "").toLowerCase();
    const isStyle = (pattern) => pattern.test(`${style} ${title}`);
    return [
      {
        kind: "faculty_pushback",
        weight: 0.8 + Math.max(0, 55 - state.systems.HealthcareCapacity) / 8 + Math.max(0, state.systems.RefugeePressure - 40) / 10,
      },
      {
        kind: "pricing_pushback",
        weight: 0.8 + (isStyle(/pricing|finance|discount|margin/) ? 2.4 : 0) + Math.max(0, state.threats.BorderTension - 65) / 14,
      },
      {
        kind: "product_delay",
        weight: 0.7 + (isStyle(/product|portfolio|sku|premium/) ? 2.2 : 0) + Math.max(0, 55 - state.systems.SupplyChainIntegrity) / 9,
      },
      {
        kind: "runway_pressure",
        weight: 0.7 + Math.max(0, 52 - state.stats.FiscalHealth) / 8 + (isStyle(/brand|campaign|market/) ? 1.2 : 0),
      },
      {
        kind: "pilot_feedback",
        weight: 0.7 + (isStyle(/brand|market|product|pilot/) ? 2 : 0) + (state.stats.PublicConfidence >= 62 ? 0.8 : 0),
      },
      {
        kind: "conversion_review",
        weight: 0.6 + (isStyle(/market|brand|pricing|finance/) ? 1.8 : 0) + (state.stats.EconomicStability >= 58 ? 0.8 : 0),
      },
      {
        kind: "credibility_boost",
        weight: 0.5 + (isStyle(/governance|operations|service|manufactur/) ? 2.6 : 0) +
          (state.systems.HealthcareCapacity >= 55 ? 0.7 : 0) + (state.stats.DiplomaticStanding >= 65 ? 0.7 : 0),
      },
    ];
  }

  function pickWeightedBusinessEvent(state, lastDecision, randomValue, recentKinds = []) {
    const blocked = new Set(recentKinds.slice(-2));
    let candidates = businessEventCandidates(state, lastDecision).filter((item) => !blocked.has(item.kind));
    if (!candidates.length) candidates = businessEventCandidates(state, lastDecision);
    const total = candidates.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
    let cursor = clamp(randomValue, 0, 0.999999) * total;
    for (const candidate of candidates) {
      cursor -= Math.max(0, candidate.weight);
      if (cursor <= 0) return candidate.kind;
    }
    return candidates[candidates.length - 1].kind;
  }

  function mergeOptionDeltas(options, field) {
    const output = {};
    const styleCounts = {};
    options.forEach((option) => {
      const style = normalizedStyle(option);
      const repetition = styleCounts[style] || 0;
      const factor = repetition === 0 ? 1 : 0.7;
      styleCounts[style] = repetition + 1;
      Object.entries(option[field] || {}).forEach(([key, value]) => {
        output[key] = Math.round((output[key] || 0) + Number(value || 0) * factor);
      });
    });
    return output;
  }

  function reviewStyles(review) {
    const rawStyles = Array.isArray(review && review.styles) && review.styles.length
      ? review.styles
      : [review && review.style];
    return [...new Set(rawStyles.filter(Boolean).map((style) => normalizedStyle({ style })))];
  }

  function reviewImpactSummary(review) {
    const phases = Array.isArray(review && review.impactLedger) ? review.impactLedger : [];
    const totals = new Map();
    phases.forEach((phase) => {
      (Array.isArray(phase.changes) ? phase.changes : []).forEach((change) => {
        const delta = Number(change.delta || 0);
        if (!Number.isFinite(delta) || delta === 0 || typeof change.beneficial !== "boolean") return;
        const id = `${change.group || "metric"}:${change.key || change.label || "unknown"}`;
        const current = totals.get(id) || {
          label: change.label || change.key || "Metric",
          delta: 0,
          utility: 0,
        };
        current.delta += delta;
        current.utility += (change.beneficial ? 1 : -1) * Math.abs(delta);
        totals.set(id, current);
      });
    });

    const changes = [...totals.values()];
    const beneficial = changes.reduce((sum, change) => sum + Math.max(0, change.utility), 0);
    const harmful = changes.reduce((sum, change) => sum + Math.max(0, -change.utility), 0);
    const benefits = changes.filter((change) => change.utility > 0).sort((a, b) => b.utility - a.utility);
    const harms = changes.filter((change) => change.utility < 0).sort((a, b) => a.utility - b.utility);
    return {
      beneficial,
      harmful,
      net: beneficial - harmful,
      tradeoff: beneficial >= 2 && harmful >= 2,
      topBenefit: benefits[0] || null,
      topHarm: harms[0] || null,
      changes,
    };
  }

  function decisionQuality(review) {
    const impact = reviewImpactSummary(review);
    const outcome = String((review && review.outcome) || "").toLowerCase();
    const outcomeScore = outcome === "success" ? 90 : outcome === "partial" ? 62 : outcome === "failure" || outcome === "blowback" ? 20 : 50;
    const credibility = clamp(review && review.legality != null ? review.legality : 50);
    const riskControl = 100 - clamp(review && review.risk != null ? review.risk : 50);
    const impactScore = impact.changes.length ? clamp(50 + impact.net * 4) : 50;
    return Math.round(outcomeScore * 0.35 + credibility * 0.2 + riskControl * 0.15 + impactScore * 0.3);
  }

  function readableStyle(style) {
    return String(style || "mixed")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function buildBehaviorAssessment(reviews, options = {}) {
    const items = Array.isArray(reviews) ? reviews.filter(Boolean) : [];
    const isBusiness = Boolean(options.isBusiness);
    if (!items.length) {
      return {
        total: 0,
        confidence: "Insufficient evidence",
        confidenceNote: "No major decision was recorded, so no decision-making profile can be supported.",
        profile: "Unassessed",
        profileSummary: "The result reflects inaction and scenario drift, not a supported behavioural pattern.",
        recommendations: ["Make at least three material decisions so sequencing, trade-offs, and adaptation can be assessed."],
      };
    }

    const enriched = items.map((review, index) => ({
      review,
      index,
      styles: reviewStyles(review),
      impact: reviewImpactSummary(review),
      quality: decisionQuality(review),
    }));
    const styleCounts = {};
    enriched.forEach((item) => item.styles.forEach((style) => {
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    }));
    const rankedStyles = Object.entries(styleCounts).sort((a, b) => b[1] - a[1]);
    const styleSignals = rankedStyles.reduce((sum, [, count]) => sum + count, 0) || 1;
    const dominant = rankedStyles[0] || ["mixed", 0];
    const dominantShare = dominant[1] / styleSignals;
    const avgRisk = Math.round(average(items.map((item) => Number(item.risk))));
    const avgCredibility = Math.round(average(items.map((item) => Number(item.legality))));
    const avgQuality = Math.round(average(enriched.map((item) => item.quality)));
    const totalBenefit = enriched.reduce((sum, item) => sum + item.impact.beneficial, 0);
    const totalHarm = enriched.reduce((sum, item) => sum + item.impact.harmful, 0);

    const strongest = [...enriched].sort((a, b) => b.quality - a.quality || b.impact.net - a.impact.net)[0];
    const harmfulMoves = enriched.filter((item) => item.impact.harmful > 0);
    const costliest = (harmfulMoves.length ? harmfulMoves : enriched)
      .slice()
      .sort((a, b) => (b.impact.harmful - b.impact.beneficial) - (a.impact.harmful - a.impact.beneficial) || a.quality - b.quality)[0];

    const recoveryPairs = [];
    enriched.slice(0, -1).forEach((item, index) => {
      const outcome = String(item.review.outcome || "").toLowerCase();
      if (outcome !== "failure" && outcome !== "blowback") return;
      const next = enriched[index + 1];
      const changedStyle = next.styles.some((style) => !item.styles.includes(style));
      const reducedRisk = Number(next.review.risk || 0) <= Number(item.review.risk || 0) - 10;
      const improvedQuality = next.quality >= item.quality + 8;
      recoveryPairs.push({ adapted: reducedRisk || (changedStyle && improvedQuality), from: item, to: next });
    });
    const recovered = recoveryPairs.filter((pair) => pair.adapted).length;
    const adaptability = !recoveryPairs.length
      ? { label: "Not tested", note: "No failed decision was followed by another major choice." }
      : recovered === recoveryPairs.length
        ? { label: "Strong", note: `The approach changed constructively after ${recovered} of ${recoveryPairs.length} setbacks.` }
        : recovered > 0
          ? { label: "Mixed", note: `The approach changed constructively after ${recovered} of ${recoveryPairs.length} setbacks.` }
          : { label: "Weak", note: `The same risk or approach persisted after ${recoveryPairs.length} setbacks.` };

    const tradeoffs = enriched.filter((item) => item.impact.tradeoff);
    const favorableTradeoffs = tradeoffs.filter((item) => item.impact.net > 0).length;
    const tradeoffAwareness = !tradeoffs.length
      ? { label: "Limited evidence", note: "No decision produced a clearly measurable benefit-cost trade-off." }
      : favorableTradeoffs >= Math.ceil(tradeoffs.length / 2)
        ? { label: "Controlled", note: `${favorableTradeoffs} of ${tradeoffs.length} measurable trade-offs produced more benefit than harm.` }
        : { label: "Uncontrolled", note: `Only ${favorableTradeoffs} of ${tradeoffs.length} measurable trade-offs produced more benefit than harm.` };

    const foundationStyles = isBusiness
      ? new Set(["finance", "pricing", "governance", "operations"])
      : new Set(["domestic", "diplomatic", "information", "cyber", "defensive", "economic"]);
    const expansionStyles = isBusiness
      ? new Set(["product", "brand", "market", "overreach"])
      : new Set(["kinetic", "decapitation", "nuclear", "aggressive"]);
    const firstFoundation = enriched.findIndex((item) => item.styles.some((style) => foundationStyles.has(style)));
    const firstExpansion = enriched.findIndex((item) => item.styles.some((style) => expansionStyles.has(style)));
    const sequence = firstFoundation < 0 || firstExpansion < 0
      ? { label: "Incomplete evidence", note: "The run did not contain both a stabilizing move and a growth/escalation move." }
      : firstFoundation <= firstExpansion
        ? { label: "Foundation first", note: isBusiness ? "Financial or operating foundations preceded expansion." : "Stabilization preceded force escalation." }
        : { label: isBusiness ? "Growth first" : "Escalation first", note: isBusiness ? "Expansion preceded financial or operating foundations." : "Force escalation preceded stabilizing instruments." };

    const consistency = dominantShare >= 0.65
      ? { label: "Concentrated", note: `${readableStyle(dominant[0])} represented ${Math.round(dominantShare * 100)}% of decision signals.` }
      : dominantShare <= 0.45 && rankedStyles.length >= 3
        ? { label: "Balanced", note: `No single approach exceeded ${Math.round(dominantShare * 100)}% of decision signals.` }
        : { label: "Coherent", note: `${readableStyle(dominant[0])} led the approach without fully excluding other levers.` };

    const foundationCount = rankedStyles.filter(([style]) => foundationStyles.has(style)).reduce((sum, [, count]) => sum + count, 0);
    const expansionCount = rankedStyles.filter(([style]) => expansionStyles.has(style)).reduce((sum, [, count]) => sum + count, 0);
    let profile;
    let profileSummary;
    if (avgRisk >= 68 || (styleCounts.overreach || 0) + (styleCounts.unethical || 0) >= 2) {
      profile = isBusiness ? "High-risk expansionist" : "Escalation-first commander";
      profileSummary = "The run repeatedly accepted high downside in exchange for speed or reach.";
    } else if (dominantShare <= 0.45 && rankedStyles.length >= 3) {
      profile = "Balanced integrator";
      profileSummary = "The run combined multiple levers rather than relying on one default response.";
    } else if (isBusiness && (dominant[0] === "finance" || dominant[0] === "pricing")) {
      profile = "Finance-first stabilizer";
      profileSummary = "Cash, pricing, and margin control shaped the largest share of decisions.";
    } else if (isBusiness && (dominant[0] === "governance" || dominant[0] === "operations")) {
      profile = "Execution-led operator";
      profileSummary = "Operating reliability and governance were used as the primary route to confidence.";
    } else if (isBusiness && expansionCount > foundationCount) {
      profile = "Growth-first builder";
      profileSummary = "Product, brand, or market expansion received more attention than operating foundations.";
    } else {
      profile = `${readableStyle(dominant[0])}-led decision maker`;
      profileSummary = `${readableStyle(dominant[0])} was the most repeated instrument, supported by ${Math.max(0, rankedStyles.length - 1)} other approaches.`;
    }

    const confidence = items.length >= 6 ? "High" : items.length >= 3 ? "Moderate" : "Low";
    const recommendations = [];
    if (sequence.label === "Growth first") recommendations.push("Resolve margin, service, or execution constraints before the next expansion move.");
    if (sequence.label === "Escalation first") recommendations.push("Use diplomatic, domestic, information, or defensive options before irreversible escalation.");
    if (avgRisk >= 60) recommendations.push("Use a reversible pilot or staged commitment to lower downside before scaling the decision.");
    if (avgCredibility < 75) recommendations.push("Raise credibility by stating evidence, safeguards, ownership, and an exit condition before acting.");
    if (dominantShare >= 0.65) recommendations.push(`Pair the dominant ${readableStyle(dominant[0]).toLowerCase()} approach with a materially different lever.`);
    if (adaptability.label === "Weak") recommendations.push("After a setback, change either the underlying assumption, the instrument, or the risk level rather than repeating the same pattern.");
    if (totalHarm > totalBenefit) recommendations.push("Set explicit stop-loss thresholds because recorded harmful parameter movement exceeded recorded benefit.");
    if (!recommendations.length) recommendations.push("Preserve the current balance, but define success and stop-loss thresholds before each major move.");

    return {
      total: items.length,
      confidence,
      confidenceNote: `${confidence} confidence based on ${items.length} recorded major decision${items.length === 1 ? "" : "s"}.`,
      profile,
      profileSummary,
      avgRisk,
      avgCredibility,
      avgQuality,
      consistency,
      adaptability,
      tradeoffAwareness,
      sequence,
      strongest: {
        title: strongest.review.title || "Decision",
        time: strongest.review.time || "n/a",
        quality: strongest.quality,
        outcome: strongest.review.outcome || "Unknown",
        topBenefit: strongest.impact.topBenefit,
        topHarm: strongest.impact.topHarm,
      },
      costliest: {
        title: costliest.review.title || "Decision",
        time: costliest.review.time || "n/a",
        quality: costliest.quality,
        outcome: costliest.review.outcome || "Unknown",
        topBenefit: costliest.impact.topBenefit,
        topHarm: costliest.impact.topHarm,
      },
      recommendations: [...new Set(recommendations)].slice(0, 3),
    };
  }

  return {
    BUSINESS_DECISION_CONTRACTS,
    GROUPS,
    average,
    businessEventCandidates,
    businessEventChance,
    businessFundamentals,
    businessContractKey,
    businessReadinessDimensions,
    businessOptionSignals,
    businessStakeholderTargets,
    buildBehaviorAssessment,
    decisionQuality,
    emptyGroupedDeltas,
    evaluateBusinessDecision,
    mergeGroupedDeltas,
    mergeOptionDeltas,
    moveToward,
    pickWeightedBusinessEvent,
    profileComponents,
    reviewImpactSummary,
    reviewStyles,
    rebalanceBusinessStakeholders,
    validateBusinessProfileDeltas,
  };
});
