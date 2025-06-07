export type PlanScope = "user" | "company"

export interface PlanBase {
  name: string
  scope: PlanScope
  max_monitored_items: number
  max_users?: number | null
}

export interface Plan extends PlanBase {
  id: number
}

export interface PlanCreate extends PlanBase {}

export interface PlanUpdate extends Partial<PlanBase> {}

export interface PlanRead extends Plan {}
