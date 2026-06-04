export const runtime = 'edge'
export const revalidate = 3600

export async function GET() {
  try {
    const res = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', {
      next: { revalidate: 3600 }
    })
    const xmlText = await res.text()
    
    const dateMatch = xmlText.match(/Tarih="([^"]+)"/)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
    
    const rates: Record<string, { buying: number, selling: number }> = {}
    const currenciesToExtract = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'SAR', 'AED']
    
    // Safer regex parsing for specific currencies
    const currencyRegex = /<Currency[^>]*CurrencyCode="([^"]+)"[^>]*>[\s\S]*?<ForexBuying>([^<]*)<\/ForexBuying>[\s\S]*?<ForexSelling>([^<]*)<\/ForexSelling>[\s\S]*?<\/Currency>/g
    let match
    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const code = match[1]
      if (currenciesToExtract.includes(code)) {
        rates[code] = {
          buying: parseFloat(match[2]),
          selling: parseFloat(match[3])
        }
      }
    }
    
    return Response.json({ date, rates })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch TCMB rates', date: new Date().toISOString() }, { status: 500 })
  }
}
