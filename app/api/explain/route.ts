export const runtime = 'edge'

interface ExplainRequest {
  title: string
  description?: string
  kaynaklar?: string[]
  inputs: { label: string; value: string }[]
  result: { label: string; value: string }[]
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'AI açıklama özelliği şu anda yapılandırılmamış.' },
      { status: 503 }
    )
  }

  let body: ExplainRequest
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }

  const { title, description, kaynaklar, inputs, result } = body
  if (!title || !Array.isArray(inputs) || !Array.isArray(result)) {
    return Response.json({ error: 'Eksik veri.' }, { status: 400 })
  }

  const inputLines = inputs.map(i => `- ${i.label}: ${i.value}`).join('\n')
  const resultLines = result.map(r => `- ${r.label}: ${r.value}`).join('\n')
  const kaynakLine = kaynaklar && kaynaklar.length > 0 ? `\nYasal dayanak: ${kaynaklar.join(', ')}` : ''

  const prompt = `Sen HesapMatik adlı bir hesaplama sitesinde kullanıcılara sonuçlarını sade Türkçeyle açıklayan bir asistansın.

Hesaplayıcı: ${title}
${description ? `Açıklama: ${description}` : ''}

Kullanıcının girdiği değerler:
${inputLines}

Hesaplanan sonuç:
${resultLines}${kaynakLine}

Görevin: Bu sonucu, hesaplamayı hiç bilmeyen sıradan bir kullanıcıya 3-5 cümlede, günlük dilde açıkla. Sonucun ne anlama geldiğini, girilen değerlerle nasıl bağlantılı olduğunu belirt. Gereksiz teknik jargon kullanma, selamlama/kapanış cümlesi yazma, doğrudan açıklamaya gir. Yasal dayanak varsa kısaca değin ama uzatma.`

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!aiRes.ok) {
      return Response.json({ error: 'AI açıklama alınamadı, lütfen tekrar deneyin.' }, { status: 502 })
    }

    const data = await aiRes.json()
    const explanation = data?.content?.[0]?.text?.trim()
    if (!explanation) {
      return Response.json({ error: 'AI açıklama alınamadı, lütfen tekrar deneyin.' }, { status: 502 })
    }

    return Response.json({ explanation })
  } catch {
    return Response.json({ error: 'AI açıklama servisine ulaşılamadı.' }, { status: 502 })
  }
}
