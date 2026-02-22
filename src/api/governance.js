export function detectIssues(table) {
  const issues = [];

  if (!table.owners || table.owners.length === 0) {
    issues.push({
      type: "missing_owner",
      severity: "high",
      message: "No owner assigned",
    });
  }

  if (!table.description || table.description.length < 20) {
    issues.push({
      type: "missing_description",
      severity: "medium",
      message: !table.description
        ? "Description is empty"
        : "Description is too short",
    });
  }

  const piiColumns = table.columns.filter(
    (col) =>
      /email|phone|ssn|address|ip_address|contact/i.test(col.name) &&
      !col.tags?.some((tag) => tag.tagFQN?.startsWith("PII")),
  );

  if (piiColumns.length > 0) {
    issues.push({
      type: "untagged_pii",
      severity: "high",
      message: `Possible PII: ${piiColumns.map((c) => c.name).join(", ")}`,
      affectedColumns: piiColumns,
    });
  }

  return issues;
}

export function generateRecommendations(table, issues) {
  return issues
    .map((issue) => {
      switch (issue.type) {
        case "missing_owner": {
          const suggested = table.name.startsWith("dim_")
            ? "Analytics Team"
            : table.name.startsWith("fact_")
              ? "Data Engineering"
              : table.name.startsWith("stg_")
                ? "Data Engineering"
                : table.name.startsWith("tmp_")
                  ? "Data Engineering"
                  : "Analytics Team";
          return {
            id: `${table.id}-owner`,
            issue,
            title: "Assign Owner",
            suggestion: suggested,
            detail: `Suggested based on table naming convention`,
            confidence: "Medium",
            confidenceScore: 65,
            action: "assign_owner",
            metadata: { owner: suggested },
          };
        }
        case "missing_description": {
          const colNames = table.columns
            .slice(0, 3)
            .map((c) => c.name)
            .join(", ");
          const desc = `${capitalize(table.name.replace(/_/g, " "))} containing ${table.columns.length} columns including ${colNames}${table.columns.length > 3 ? " and more" : ""}.`;
          return {
            id: `${table.id}-desc`,
            issue,
            title: "Generate Description",
            suggestion: desc,
            detail: "Auto-generated from table name and column structure",
            confidence: "Low",
            confidenceScore: 40,
            action: "add_description",
            metadata: { description: desc },
          };
        }
        case "untagged_pii": {
          return {
            id: `${table.id}-pii`,
            issue,
            title: "Add PII Tags",
            suggestion: `Tag ${issue.affectedColumns.length} column${issue.affectedColumns.length > 1 ? "s" : ""} as PII.Sensitive`,
            detail: `Columns: ${issue.affectedColumns.map((c) => c.name).join(", ")}`,
            confidence: "High",
            confidenceScore: 90,
            action: "tag_pii",
            metadata: { columns: issue.affectedColumns },
          };
        }
        default:
          return null;
      }
    })
    .filter(Boolean);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Cost calculations
export function calculateCost(table) {
  const queryCount = table.usageSummary?.dailyStats?.count || 0;
  const storageGB = 100;
  const monthlyCost = queryCount * 30 * 0.5 + storageGB * 0.1;
  return Math.round(monthlyCost);
}

export function categorizeTables(tables) {
  const sorted = [...tables].sort(
    (a, b) =>
      (b.usageSummary?.dailyStats?.count || 0) -
      (a.usageSummary?.dailyStats?.count || 0),
  );

  const tiers = {
    T1: {
      id: "T1",
      name: "Mission Critical",
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.1)",
      tables: [],
    },
    T2: {
      id: "T2",
      name: "High Usage",
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.1)",
      tables: [],
    },
    T3: {
      id: "T3",
      name: "Moderate",
      color: "#3b82f6",
      bgColor: "rgba(59,130,246,0.1)",
      tables: [],
    },
    T4: {
      id: "T4",
      name: "Low Usage",
      color: "#8b5cf6",
      bgColor: "rgba(139,92,246,0.1)",
      tables: [],
    },
    T5: {
      id: "T5",
      name: "Dormant",
      color: "#6b7280",
      bgColor: "rgba(107,114,128,0.1)",
      tables: [],
    },
  };

  sorted.forEach((table, index) => {
    const pct = (index / sorted.length) * 100;
    if (pct < 10) tiers.T1.tables.push(table);
    else if (pct < 30) tiers.T2.tables.push(table);
    else if (pct < 60) tiers.T3.tables.push(table);
    else if (pct < 85) tiers.T4.tables.push(table);
    else tiers.T5.tables.push(table);
  });

  return tiers;
}

export function tierCost(tier) {
  return tier.tables.reduce((sum, t) => sum + calculateCost(t), 0);
}

export function generateCostRecommendations(tiers) {
  const recs = [];

  if (tiers.T5.tables.length > 0) {
    const savings = tierCost(tiers.T5);
    recs.push({
      id: "archive-t5",
      icon: "🗄️",
      title: `Archive ${tiers.T5.tables.length} dormant table${tiers.T5.tables.length > 1 ? "s" : ""}`,
      description:
        "Tables with zero or near-zero usage for 90+ days. Safe to move to cold storage.",
      savings: savings * 0.9,
      impact: "High",
      confidence: "High",
      impactScore: 9,
      tables: tiers.T5.tables,
    });
  }

  const unpartitioned = tiers.T1.tables.filter(
    (t) => !t.description?.includes("partition"),
  );
  if (unpartitioned.length > 0) {
    recs.push({
      id: "partition-t1",
      icon: "⚡",
      title: `Partition ${unpartitioned.length} high-usage table${unpartitioned.length > 1 ? "s" : ""}`,
      description:
        "Add date-based partitioning to mission-critical tables to reduce full-scan costs.",
      savings: 1200,
      impact: "Medium",
      confidence: "Medium",
      impactScore: 6,
      tables: unpartitioned,
    });
  }

  recs.push({
    id: "materialize-views",
    icon: "🔮",
    title: "Materialize 3 frequently-queried views",
    description:
      "Pre-compute expensive joins on high-traffic downstream views to cut compute costs.",
    savings: 800,
    impact: "Medium",
    confidence: "High",
    impactScore: 7,
    tables: [],
  });

  if (tiers.T4.tables.length > 2) {
    recs.push({
      id: "review-t4",
      icon: "🔍",
      title: `Review ${tiers.T4.tables.length} low-usage tables for consolidation`,
      description:
        "These tables have minimal queries. Evaluate for merging or deprecation.",
      savings: tierCost(tiers.T4) * 0.4,
      impact: "Low",
      confidence: "Medium",
      impactScore: 4,
      tables: tiers.T4.tables,
    });
  }

  return recs.sort((a, b) => b.impactScore - a.impactScore);
}
