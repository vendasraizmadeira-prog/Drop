import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Valida tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Formato inválido. Use JPG, PNG ou WEBP.' }, { status: 400 })
    }

    // Valida tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Imagem muito grande. Máximo 5MB.' }, { status: 400 })
    }

    const supabase = getClient()

    // Nome único para o arquivo
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Converte File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Faz upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { message: `Erro no upload: ${error.message}` },
        { status: 500 }
      )
    }

    // Pega a URL pública
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Erro interno no upload' }, { status: 500 })
  }
}
