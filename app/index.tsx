import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const meses = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO',
  'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO',
  'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
];

export default function Index() {

  const router = useRouter();
  const gruposDeMeses = [];

  for (let i = 0; i < meses.length; i += 3) {
    gruposDeMeses.push(meses.slice(i, i + 3))
  }

  const abreTelaMes = ({mes}) => {
    router.push(
      {
        pathname: '/opcoesMes',
        params: {mes}
      }
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top', 'bottom']}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Ionicons name='cellular' size={32} color='green'></Ionicons>
          <Text style={styles.headerTitulo}>Gerenciador Financeiro</Text>
        </View>

        <View style={styles.instrucoes}>
          <Text style={styles.instrucoesTexto}>Escolha um mês para visualizar estatísticas, adicionar valores recebidos ou gastos:</Text>
        </View>

        <View style={styles.containerMeses}>
          {gruposDeMeses.map((grupo, index) => (
            <View
              key={`grupo-${index}`}
              style={styles.containerTresMeses}>
              {grupo.map((mes) => (
                <Pressable
                key={mes}
                  style={styles.mesBotao}
                  onPress={() => abreTelaMes({mes})}>
                  <Text style={styles.mesTexto}>{mes}</Text>
                </Pressable>
              ))}
            </View>
          )
          )}
        </View>

      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#2F4538',
    gap: '5%',
  },
  headerTitulo: {
    fontSize: 24,
    color: '#2F4538',
  },
  instrucoes: {
    flex: 0.1,
    width: '95%',
    paddingVertical: 20,
  },
  instrucoesTexto: {
    fontSize: 16,
    color: '#2F4538',
    textAlign: 'center'
  },
  containerMeses: {
    flex: 0.7,
    width: '95%',
    gap: 10,
    alignItems: 'center'
  },
  containerTresMeses: {
    flexDirection: 'row',
    width: '95%',
    gap: 10,
    alignContent: 'center',
    alignItems: 'center'
  },
  mesBotao: {
    padding: 16,
    backgroundColor: 'green',
    borderRadius: 5,
    width: '33%',
    textAlign: 'center'
  },
  mesTexto: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center'
  }
})