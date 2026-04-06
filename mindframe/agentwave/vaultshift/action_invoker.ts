import type { BaseAction, ActionResponse } from "./base_action"
import { z } from "zod"

interface AgentContext {
  apiEndpoint: string
  apiKey: string
}

/**
 * Central Agent: registers actions and routes invocations with input validation
 */
export class Agent {
  private actions = new Map<string, BaseAction<any, any, AgentContext>>()

  /** Register or replace an action by its unique id */
  register<S extends z.ZodObject<any>, R>(action: BaseAction<S, R, AgentContext>): void {
    this.actions.set(action.id, action)
  }

  /** Remove a previously registered action */
  unregister(id: string): boolean {
    return this.actions.delete(id)
  }

  /** Check if an action is registered */
  has(id: string): boolean {
    return this.actions.has(id)
  }

  /** List all registered action ids */
  list(): string[] {
    return Array.from(this.actions.keys())
  }

  /** Number of registered actions */
  size(): number {
    return this.actions.size
  }

  /** Remove all registered actions */
  clear(): void {
    this.actions.clear()
  }

  /**
   * Invoke an action by id with payload and execution context
   * - Validates payload using the action's Zod schema
   * - Forwards the validated payload to the action executor
   */
  async invoke<R>(
    actionId: string,
    payload: unknown,
    ctx: AgentContext
  ): Promise<ActionResponse<R>> {
    const action = this.actions.get(actionId)
    if (!action) throw new Error(`Unknown action "${actionId}"`)

    // Validate payload against the action schema to ensure type safety at runtime
    const parsed = action.input.parse(payload)
    return action.execute({ payload: parsed, context: ctx }) as Promise<ActionResponse<R>>
  }
}
