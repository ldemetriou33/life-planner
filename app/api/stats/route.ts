import { NextResponse } from "next/server";
import { getAssessments } from "../../../lib/scoreStorage";

// Map major to industry
function getIndustryFromMajor(major: string): string {
  const lowerMajor = major.toLowerCase();
  if (lowerMajor.includes('law') || lowerMajor.includes('legal')) return 'Legal';
  if (lowerMajor.includes('computer') || lowerMajor.includes('software') || lowerMajor.includes('programming') || lowerMajor.includes('data') || lowerMajor.includes('tech')) return 'Technology';
  if (lowerMajor.includes('nursing') || lowerMajor.includes('health') || lowerMajor.includes('medical') || lowerMajor.includes('medicine')) return 'Healthcare';
  if (lowerMajor.includes('construction') || lowerMajor.includes('trade') || lowerMajor.includes('plumb') || lowerMajor.includes('electric')) return 'Construction';
  if (lowerMajor.includes('business') || lowerMajor.includes('management') || lowerMajor.includes('finance') || lowerMajor.includes('account')) return 'Business';
  if (lowerMajor.includes('education') || lowerMajor.includes('teaching')) return 'Education';
  if (lowerMajor.includes('engineer')) return 'Engineering';
  if (lowerMajor.includes('art') || lowerMajor.includes('design') || lowerMajor.includes('creative')) return 'Arts';
  if (lowerMajor.includes('psycholog') || lowerMajor.includes('philosoph')) return 'Social Sciences';
  return 'Other';
}

export async function GET() {
  try {
    const assessments = await getAssessments();
    
    if (assessments.length === 0) {
      return NextResponse.json({
        averageScore: null,
        mostVulnerable: null,
        mostProtected: null,
        message: 'No data yet'
      });
    }

    // Filter assessments from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentAssessments = assessments.filter(assessment => {
      const assessmentDate = new Date(assessment.timestamp);
      return assessmentDate >= oneWeekAgo;
    });

    // Use recent assessments if available, otherwise use all assessments
    const assessmentsToUse = recentAssessments.length > 0 ? recentAssessments : assessments;

    // Calculate average score
    const totalScore = assessmentsToUse.reduce((sum, assessment) => sum + assessment.singularity_score, 0);
    const averageScore = Math.round(totalScore / assessmentsToUse.length);

    // Group by industry and calculate averages
    const industryScores: Record<string, { total: number; count: number }> = {};
    
    assessmentsToUse.forEach(assessment => {
      const industry = getIndustryFromMajor(assessment.major);
      if (!industryScores[industry]) {
        industryScores[industry] = { total: 0, count: 0 };
      }
      industryScores[industry].total += assessment.singularity_score;
      industryScores[industry].count += 1;
    });

    // Calculate average scores per industry
    const industryAverages: Record<string, number> = {};
    Object.keys(industryScores).forEach(industry => {
      industryAverages[industry] = industryScores[industry].total / industryScores[industry].count;
    });

    // Find most vulnerable (lowest average score)
    let mostVulnerable = 'Other';
    let lowestScore = Infinity;
    Object.keys(industryAverages).forEach(industry => {
      if (industryAverages[industry] < lowestScore) {
        lowestScore = industryAverages[industry];
        mostVulnerable = industry;
      }
    });

    // Find most protected (highest average score)
    let mostProtected = 'Other';
    let highestScore = -Infinity;
    Object.keys(industryAverages).forEach(industry => {
      if (industryAverages[industry] > highestScore) {
        highestScore = industryAverages[industry];
        mostProtected = industry;
      }
    });

    return NextResponse.json({
      averageScore,
      mostVulnerable,
      mostProtected
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', error instanceof Error ? error.stack : String(error));
    }
    return NextResponse.json(
      { error: 'Failed to calculate statistics' },
      { status: 500 }
    );
  }
}

