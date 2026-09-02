export const runtime = 'edge'

interface ExplainRequest {
  title: string
  description?: string
  kaynaklar?: string[]
  inputs: { label: string; value: string }[]
  result: { label: string; value: string }[]
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
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

  const systemPrompt = `Sen HesapMatik adlı Türkiye hesaplama sitesinde çalışan, alanında uzman bir finans/hukuk/sağlık danışmanı asistansın. Kullanıcılara hesaplama sonuçlarını sade ama derinlikli bir şekilde açıklıyorsun. Sadece sonucu tekrar etmiyorsun; sonucun kullanıcı için PRATİKTE ne anlama geldiğini, nelere dikkat etmesi gerektiğini ve varsa mantıklı bir sonraki adımı da söylüyorsun. Uydurma rakam veya yasa maddesi üretme; sadece sana verilen verilere dayan.`

  const prompt = `Hesaplayıcı: ${title}
${description ? `Açıklama: ${description}` : ''}

Kullanıcının girdiği değerler:
${inputLines}

Hesaplanan sonuç:
${resultLines}${kaynakLine}

Görevin: Bu sonucu kullanıcıya açıkla. Şu yapıyı izle:
1) Sonucun ne anlama geldiğini 1-2 cümlede günlük dille özetle.
2) Sonucun girilen değerlerle nasıl bağlantılı olduğunu kısaca belirt (örn. hangi değer sonucu en çok etkiliyor).
3) Varsa kullanıcının dikkat etmesi gereken bir nüans, risk veya pratik bir öneri ekle (yasal dayanak varsa kısaca değin).
Toplam 4-6 cümle, akıcı paragraf halinde yaz. Selamlama/kapanış cümlesi, madde işareti, başlık kullanma; doğrudan açıklamaya gir.`

  const callGroq = (model: string) =>
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    })

  try {
    let aiRes = await callGroq('openai/gpt-oss-120b')
    if (!aiRes.ok && (aiRes.status === 400 || aiRes.status === 404)) {
      aiRes = await callGroq('llama-3.3-70b-versatile')
    }

    if (!aiRes.ok) {
      return Response.json({ error: 'AI açıklama alınamadı, lütfen tekrar deneyin.' }, { status: 502 })
    }

    const data = await aiRes.json()
    const explanation = data?.choices?.[0]?.message?.content?.trim()
    if (!explanation) {
      return Response.json({ error: 'AI açıklama alınamadı, lütfen tekrar deneyin.' }, { status: 502 })
    }

    return Response.json({ explanation })
  } catch {
    return Response.json({ error: 'AI açıklama servisine ulaşılamadı.' }, { status: 502 })
  }
}
