import { promises as fs } from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { getSupabaseClient, isSupabaseConfigured } from './supabase'

const EMAILS_FILE = path.join(process.cwd(), 'data', 'emails.json')
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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

// Read emails from Supabase (primary) or file (fallback)
export async function getEmails(): Promise<EmailEntry[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured()) {
    const supabaseClient = getSupabaseClient()
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('emails')
          .select('*')
          .order('timestamp', { ascending: false })
        
        if (error) {
          console.error('Supabase error fetching emails:', error)
          // Fall through to file storage
        } else if (data) {
          return data.map(entry => ({
            email: entry.email,
            university: entry.university,
            major: entry.major,
            timestamp: entry.timestamp,
          }))
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error)
        // Fall through to file storage
      }
    }
  }
  
  // Fallback to file storage
  try {
    await ensureDataDir()
    const fileContent = await fs.readFile(EMAILS_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Save email to Supabase (primary), file (fallback), and send notification
export async function saveEmail(email: string, university: string, major: string): Promise<void> {
  const newEntry: EmailEntry = {
    email,
    university,
    major,
    timestamp: new Date().toISOString(),
  }
  
  // Try Supabase first if configured (primary storage)
  if (isSupabaseConfigured()) {
    const supabaseClient = getSupabaseClient()
    if (supabaseClient) {
      try {
        console.log('Attempting to save to Supabase...')
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
        console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
        
        const { data, error } = await supabaseClient
          .from('emails')
          .insert([newEntry])
          .select()
        
        if (error) {
          console.error('❌ Supabase error saving email:', error)
          console.error('Error code:', error.code)
          console.error('Error message:', error.message)
          console.error('Error details:', JSON.stringify(error, null, 2))
          // Fall through to file storage
        } else {
          console.log('✅ Email saved to Supabase successfully!')
          console.log('Saved data:', data)
          // Still send notification and log, but don't save to file if Supabase succeeds
          sendEmailNotification(newEntry)
          return // Successfully saved to Supabase
        }
      } catch (error) {
        console.error('❌ Exception saving to Supabase:', error)
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
        // Fall through to file storage
      }
    } else {
      console.log('⚠️ Supabase client is null')
    }
  } else {
    console.log('⚠️ Supabase not configured - checking environment variables...')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
  }
  
  // Fallback to file storage if Supabase not configured or failed
  try {
    await ensureDataDir()
    const emails = await getEmails()
    emails.push(newEntry)
    await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf-8')
    console.log('Email saved to file:', newEntry)
  } catch (error) {
    console.error('Error saving email to file:', error)
  }
  
  // Send email notification (bonus feature)
  sendEmailNotification(newEntry)
  
  // Always log to console as final fallback
  console.log('User email:', email)
  console.log('Assessment request:', { email, university, major, timestamp: newEntry.timestamp })
}

// Helper function to send email notification
async function sendEmailNotification(entry: EmailEntry) {
  if (resend && process.env.ADMIN_EMAIL) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL,
        subject: `New Assessment: ${entry.university} - ${entry.major}`,
        html: `
          <h2>New Career Assessment Submission</h2>
          <p><strong>Email:</strong> ${entry.email}</p>
          <p><strong>University:</strong> ${entry.university}</p>
          <p><strong>Major:</strong> ${entry.major}</p>
          <p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated notification from your Reality Check app.</p>
        `,
      })
      console.log('Email notification sent to admin')
    } catch (error) {
      console.error('Error sending email notification:', error)
      // Don't fail the request if email fails
    }
  }
}

