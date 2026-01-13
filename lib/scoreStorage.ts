import { promises as fs } from 'fs'
import path from 'path'

const ASSESSMENTS_FILE = path.join(process.cwd(), 'data', 'assessments.json')

export interface AssessmentEntry {
  singularity_score: number
  major: string
  university: string
  timestamp: string
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read assessments from file
export async function getAssessments(): Promise<AssessmentEntry[]> {
  try {
    await ensureDataDir()
    const fileContent = await fs.readFile(ASSESSMENTS_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Save assessment to file (or just log on Vercel where file system is read-only)
export async function saveAssessment(
  singularity_score: number,
  major: string,
  university: string
): Promise<void> {
  const newEntry: AssessmentEntry = {
    singularity_score,
    major,
    university,
    timestamp: new Date().toISOString(),
  }
  
  // Try to save to file (works locally, fails on Vercel - that's okay)
  try {
    await ensureDataDir()
    const assessments = await getAssessments()
    assessments.push(newEntry)
    await fs.writeFile(ASSESSMENTS_FILE, JSON.stringify(assessments, null, 2), 'utf-8')
    console.log('Assessment saved to file:', newEntry)
  } catch (error) {
    // File system is read-only on Vercel - just log instead
    // This is expected behavior on serverless functions
    console.log('Assessment data (logged only - file system read-only on Vercel):', newEntry)
  }
}

