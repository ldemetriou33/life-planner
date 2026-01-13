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

// Save assessment to file
export async function saveAssessment(
  singularity_score: number,
  major: string,
  university: string
): Promise<void> {
  try {
    await ensureDataDir()
    const assessments = await getAssessments()
    
    const newEntry: AssessmentEntry = {
      singularity_score,
      major,
      university,
      timestamp: new Date().toISOString(),
    }
    
    assessments.push(newEntry)
    
    await fs.writeFile(ASSESSMENTS_FILE, JSON.stringify(assessments, null, 2), 'utf-8')
    
    // Also log to console for immediate visibility
    console.log('Assessment saved:', newEntry)
  } catch (error) {
    console.error('Error saving assessment:', error)
    // Still log to console as fallback
    console.log('Assessment data:', { singularity_score, major, university, timestamp: new Date().toISOString() })
  }
}

