// Gemini removed; generate deterministic recommendations

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recommendationId, diseaseType = "Rust Disease", cropType = "Wheat", severity = "moderate" } = body

    // Deterministic rule-based recommendations
    const severityToActions: Record<string, string[]> = {
      low: [
        "Increase monitoring frequency",
        "Optimize irrigation to avoid leaf wetness",
      ],
      moderate: [
        "Apply targeted fungicide per label",
        "Remove heavily infected leaves",
      ],
      high: [
        "Apply systemic fungicide immediately",
        "Isolate affected area and sanitize tools",
      ],
      critical: [
        "Begin emergency containment protocol",
        "Consult agronomist for field visit",
      ],
    }

    const recommendations = severityToActions[severity.toLowerCase()] || severityToActions["moderate"]

    const treatmentPlan = {
      id: recommendationId,
      title: `${diseaseType} Treatment Plan - ${cropType}`,
      severity,
      affectedArea: "2.5 hectares",
      recommendations,
      detailedAnalysis: {
        diseaseType,
        infectionLevel: "35%",
        spreadRate: severity,
        weatherImpact: "High humidity may accelerate spread",
      },
      estimatedCost: "$450 per hectare",
      timeline: "3-4 weeks for full recovery",
      successRate: "85%",
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Treatment details generated:", treatmentPlan)

    return Response.json({
      success: true,
      data: treatmentPlan,
    })
  } catch (error) {
    console.error("[v0] Treatment details error:", error)
    return Response.json({ success: false, message: "Failed to retrieve treatment details" }, { status: 500 })
  }
}
