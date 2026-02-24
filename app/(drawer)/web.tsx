import { ThemedView } from '@/components/themed-view'
import { Button, Linking } from 'react-native'

export default function WebLink() {
  const handleClick = () => {
    Linking.openURL('https://neo-wifi.vercel.app')
  }

  return (
    <ThemedView style={{ marginTop: 150 }}>
      <Button title="Ir al sitio." onPress={handleClick} />
    </ThemedView>
  )
}
