import { promises as fs } from 'fs'
import path from 'path'

const EMAILS_FILE = path.join(process.cwd(), 'data', 'emails.json')

export interface EmailEntry {
  email: string
  university: string
  major: string
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

// Read emails from file
export async function getEmails(): Promise<EmailEntry[]> {
  try {
    await ensureDataDir()
    const fileContent = await fs.readFile(EMAILS_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Save email to file
export async function saveEmail(email: string, university: string, major: string): Promise<void> {
  try {
    await ensureDataDir()
    const emails = await getEmails()
    
    const newEntry: EmailEntry = {
      email,
      university,
      major,
      timestamp: new Date().toISOString(),
    }
    
    emails.push(newEntry)
    
    await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf-8')
    
    // Also log to console for immediate visibility
    console.log('Email saved:', newEntry)
  } catch (error) {
    console.error('Error saving email:', error)
    // Still log to console as fallback
    console.log('User email:', email)
    console.log('Assessment request:', { email, university, major, timestamp: new Date().toISOString() })
  }
}

