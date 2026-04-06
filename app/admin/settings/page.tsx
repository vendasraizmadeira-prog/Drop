import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Configurações' }

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()
  const { data: settings } = await supabase.from('settings').select('*')

  const settingsMap = (settings || []).reduce(
    (acc: Record<string, string>, s) => {
      acc[s.key] = s.value
      return acc
    },
    {} as Record<string, string>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Configurações</h1>
        <p className="text-zinc-500 text-sm mt-1">Gerencie as configurações da loja</p>
      </div>
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
