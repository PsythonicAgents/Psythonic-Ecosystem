import { exec } from "child_process"

/**
 * Execute a shell command and return stdout or throw on error.
 * @param command Shell command to run (e.g., "ls -la")
 * @param timeoutMs Optional timeout in milliseconds (default 30s)
 * @param cwd Optional working directory
 * @param env Optional environment variables
 */
export function execCommand(
  command: string,
  timeoutMs: number = 30_000,
  cwd?: string,
  env?: NodeJS.ProcessEnv
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = exec(
      command,
      {
        timeout: timeoutMs,
        cwd,
        env: env ? { ...process.env, ...env } : process.env,
        maxBuffer: 10 * 1024 * 1024, // 10 MB buffer
      },
      (error, stdout, stderr) => {
        if (error) {
          const msg = `Command "${command}" failed: ${stderr || error.message}`
          return reject(new Error(msg))
        }
        resolve(stdout.trim())
      }
    )

    // Inherit error events
    proc.on("error", err => reject(err))
  })
}

/**
 * Execute multiple shell commands sequentially and collect results.
 */
export async function execCommands(
  commands: string[],
  opts?: { timeoutMs?: number; cwd?: string; env?: NodeJS.ProcessEnv }
): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  for (const cmd of commands) {
    out[cmd] = await execCommand(cmd, opts?.timeoutMs, opts?.cwd, opts?.env)
  }
  return out
}

/**
 * Try to execute a command and return null on failure instead of throwing.
 */
export async function tryExecCommand(
  command: string,
  timeoutMs: number = 30_000
): Promise<string | null> {
  try {
    return await execCommand(command, timeoutMs)
  } catch {
    return null
  }
}
