/**
 * Simple task executor: registers and runs tasks by name.
 */
type Handler = (params: any) => Promise<any>

export interface ExecutionTask {
  id: string
  type: string
  params: any
  enqueuedAt: number
}

export interface ExecutionResult {
  id: string
  result?: any
  error?: string
  startedAt: number
  finishedAt: number
}

export class ExecutionEngine {
  private handlers: Record<string, Handler> = {}
  private queue: ExecutionTask[] = []
  private history: ExecutionResult[] = []

  /** Register a handler for a given task type */
  register(type: string, handler: Handler): void {
    this.handlers[type] = handler
  }

  /** Add a new task to the queue */
  enqueue(id: string, type: string, params: any): void {
    if (!this.handlers[type]) throw new Error(`No handler for ${type}`)
    this.queue.push({ id, type, params, enqueuedAt: Date.now() })
  }

  /** Run all queued tasks in sequence */
  async runAll(): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = []
    while (this.queue.length) {
      const task = this.queue.shift()!
      const start = Date.now()
      try {
        const data = await this.handlers[task.type](task.params)
        const result: ExecutionResult = {
          id: task.id,
          result: data,
          startedAt: start,
          finishedAt: Date.now(),
        }
        results.push(result)
        this.history.push(result)
      } catch (err: any) {
        const result: ExecutionResult = {
          id: task.id,
          error: err.message,
          startedAt: start,
          finishedAt: Date.now(),
        }
        results.push(result)
        this.history.push(result)
      }
    }
    return results
  }

  /** Inspect queued tasks */
  getQueue(): ExecutionTask[] {
    return [...this.queue]
  }

  /** Get execution history */
  getHistory(limit = 50): ExecutionResult[] {
    return this.history.slice(-limit)
  }

  /** Clear queue and/or history */
  clear(options: { queue?: boolean; history?: boolean } = {}): void {
    if (options.queue) this.queue = []
    if (options.history) this.history = []
  }
}
