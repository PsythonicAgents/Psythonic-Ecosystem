import { execCommand } from "./exec_command"

export interface ShellTask {
  id: string
  command: string
  description?: string
  cwd?: string
  env?: NodeJS.ProcessEnv
  timeoutMs?: number
}

export interface ShellResult {
  taskId: string
  output?: string
  error?: string
  executedAt: number
  durationMs?: number
}

export class ShellTaskRunner {
  private tasks: ShellTask[] = []

  /** Schedule a shell task for execution */
  scheduleTask(task: ShellTask): void {
    this.tasks.push(task)
  }

  /** Execute all scheduled tasks in sequence */
  async runAll(): Promise<ShellResult[]> {
    const results: ShellResult[] = []
    for (const task of this.tasks) {
      const start = Date.now()
      try {
        const output = await execCommand(
          task.command,
          task.timeoutMs ?? 30_000,
          task.cwd,
          task.env
        )
        results.push({
          taskId: task.id,
          output,
          executedAt: start,
          durationMs: Date.now() - start,
        })
      } catch (err: any) {
        results.push({
          taskId: task.id,
          error: err.message ?? String(err),
          executedAt: start,
          durationMs: Date.now() - start,
        })
      }
    }
    this.tasks = []
    return results
  }

  /** Clear all pending tasks */
  clear(): void {
    this.tasks = []
  }

  /** Get number of scheduled tasks */
  size(): number {
    return this.tasks.length
  }

  /** Run a single ad-hoc command immediately */
  async runImmediate(command: string, opts?: Omit<ShellTask, "id" | "command">): Promise<ShellResult> {
    const start = Date.now()
    try {
      const output = await execCommand(command, opts?.timeoutMs, opts?.cwd, opts?.env)
      return { taskId: "immediate", output, executedAt: start, durationMs: Date.now() - start }
    } catch (err: any) {
      return { taskId: "immediate", error: err.message ?? String(err), executedAt: start, durationMs: Date.now() - start }
    }
  }
}
