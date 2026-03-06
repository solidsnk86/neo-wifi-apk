import { ThemedView } from '@/components/themed-view'
import { useHeaderHeight } from '@react-navigation/elements'
import { Button, Linking } from 'react-native'

export default function WebLink() {
  const headerHeight = useHeaderHeight()
  const handleClick = () => {
    Linking.openURL('https://neo-wifi.vercel.app')
  }

  return (
    <ThemedView style={{ paddingTop: headerHeight + 16 }}>
      <Button title="Ir al sitio." onPress={handleClick} />
    </ThemedView>
  )
}
