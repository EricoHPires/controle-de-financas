import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function opcoesMes() {

    const { mes } = useLocalSearchParams();
    const router = useRouter();

    const linkVoltar = () => {
        router.replace('/');
    }

    const linkInserirRecebido = ({ mes }) => {
        router.replace(
            {
                pathname: '/inserirRecebido',
                params: { mes }
            }
        )
    }

    const linkInserirGasto = ({ mes }) => {
        router.replace(
            {
                pathname: '/inserirGasto',
                params: { mes }
            }
        )
    }
    const linkEstatisticas = ({ mes }) => {
        router.replace(
            {
                pathname: '/visualizarEstatisticas',
                params: { mes }
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
                <View style={styles.body}>
                    <Text style={styles.mesTitulo}>{mes}</Text>

                    <Pressable
                        style={styles.botaoPrincipal}
                        onPress={() => linkEstatisticas({ mes })}
                    >
                        <Ionicons name='bar-chart-outline' size={64} color={'#FFF'}></Ionicons>
                        <Text style={styles.botaoTexto}>VISUALIZAR ESTATÍSTICAS</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.botaoPrincipal, styles.botaoRecebido]}
                        onPress={() => linkInserirRecebido({ mes })}
                    >
                        <Ionicons name='trending-up' size={64} color={'#FFF'}></Ionicons>
                        <Text style={styles.botaoTexto}>INSERIR VALOR RECEBIDO</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.botaoPrincipal, styles.botaoGasto]}
                        onPress={() => linkInserirGasto({ mes })}
                    >
                        <Ionicons name='trending-down' size={64} color={'#FFF'}></Ionicons>
                        <Text style={styles.botaoTexto}>INSERIR GASTO</Text>
                    </Pressable>

                    <Pressable
                        style={styles.botaoVoltar}
                        onPress={() => linkVoltar()}
                    >
                        <Ionicons name='arrow-back' size={64} color={'#FFF'}></Ionicons>
                        <Text style={styles.botaoTexto}>VOLTAR</Text>
                    </Pressable>
                </View>

            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%'
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
    body: {
        flex: 1,
        paddingTop: 24,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',

    },
    mesTitulo: {
        fontSize: 24,
        color: '#2F4538',
        fontWeight: 800,
        textAlign: 'center',
        paddingBottom: 16
    },
    botaoPrincipal: {
        width: '95%',
        backgroundColor: '#2F4538',
        paddingVertical: 18,
        borderLeftColor: 'black',
        borderRightColor: 'black',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        borderRadius: 10,
    },
    botaoRecebido: {
        backgroundColor: '#3c5847ff',
    },
    botaoGasto: {
        backgroundColor: '#436d54ff',
    },
    botaoTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'center',
    },
    botaoVoltar: {
        width: '95%',
        backgroundColor: '#4e8564ff',
        paddingVertical: 18,
        borderLeftColor: 'black',
        borderRightColor: 'black',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        borderRadius: 10,
    }
})