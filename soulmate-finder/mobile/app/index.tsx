import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soulmate Finder</Text>
      <Text style={styles.subtitle}>
        Mobil uygulama deneyimi için Expo ile hazırlandı.
      </Text>
      <Text style={styles.description}>
        Bu uygulama, mevcut Next.js projesinin iş mantığını paylaşacak şekilde
        genişletilebilir. Expo yapılandırması ile iOS derlemesi almak için pnpm
        install komutunu çalıştırdıktan sonra pnpm ios komutunu
        kullanabilirsiniz.
      </Text>
      <Link href="https://github.com/" style={styles.link}>
        Proje hakkında daha fazla bilgi alın
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9fafb'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#e5e7eb'
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#cbd5f5'
  },
  link: {
    fontSize: 16,
    color: '#38bdf8',
    fontWeight: '600'
  }
});
