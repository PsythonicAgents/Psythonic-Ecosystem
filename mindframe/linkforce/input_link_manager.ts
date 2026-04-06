export interface InputLink {
  id: string
  source: string
  url: string
  metadata?: Record<string, any>
}

export interface InputLinkResult {
  success: boolean
  link?: InputLink
  error?: string
}

export class InputLinkHandler {
  private links = new Map<string, InputLink>()

  /** Register a new input link */
  register(link: InputLink): InputLinkResult {
    if (this.links.has(link.id)) {
      return { success: false, error: `Link with id "${link.id}" already exists.` }
    }
    this.links.set(link.id, { ...link, metadata: link.metadata ?? {} })
    return { success: true, link }
  }

  /** Retrieve a link by ID */
  get(id: string): InputLinkResult {
    const link = this.links.get(id)
    if (!link) {
      return { success: false, error: `No link found for id "${id}".` }
    }
    return { success: true, link }
  }

  /** List all stored links */
  list(): InputLink[] {
    return Array.from(this.links.values())
  }

  /** Remove a link by ID */
  unregister(id: string): boolean {
    return this.links.delete(id)
  }

  /** Check if a link exists */
  exists(id: string): boolean {
    return this.links.has(id)
  }

  /** Update metadata for a given link */
  updateMetadata(id: string, metadata: Record<string, any>): InputLinkResult {
    const link = this.links.get(id)
    if (!link) {
      return { success: false, error: `Cannot update. No link found for id "${id}".` }
    }
    const updated = { ...link, metadata: { ...link.metadata, ...metadata } }
    this.links.set(id, updated)
    return { success: true, link: updated }
  }

  /** Count total stored links */
  count(): number {
    return this.links.size
  }

  /** Find links by source */
  findBySource(source: string): InputLink[] {
    return Array.from(this.links.values()).filter(l => l.source === source)
  }

  /** Clear all links */
  clear(): void {
    this.links.clear()
  }
}
