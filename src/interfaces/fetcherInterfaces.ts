export interface Fetcher {
  fetch(url: string, method?: string, data?: any): Promise<any>
}
