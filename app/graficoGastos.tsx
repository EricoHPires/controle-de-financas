import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";


interface MesFinanceiro {
    saldoInicial: number,
    receitas: Transacao[],
    gastos: Transacao[],
}

interface Transacao {
    id: string,
    tipo: string,
    categoria: string,
    nome: string,
    valor: number,
    data: string
}

export default function graficoGastos() {
    const { dados, mes, somaGastos } = useLocalSearchParams();
    const router = useRouter();
    const [historico, setHistorico] = useState<MesFinanceiro>(
        {
            saldoInicial: 0.00,
            receitas: [],
            gastos: [],
        }
    );

    const [dadosProntos, setDadosProntos] = useState(false);

    const carregarHistorico = async () => {
        const historicoResgatado = await AsyncStorage.getItem(`@${mes}_2025`);
        const historicoAtualizado = historicoResgatado ? JSON.parse(historicoResgatado) : {
            saldoInicial: 0.00,
            receitas: [],
            gastos: [],
        }
        setHistorico(historicoAtualizado);
        setDadosProntos(true);
    }

    useEffect(() => {
        carregarHistorico()
    }, [])

    const linkVoltar = () => {
        router.replace({
            pathname: '/opcoesMes',
            params: { mes }
        });
    }

    const GraficoPizza = ({ transacoes }) => {
        type Tipo = {
            [key: string]: number
        }

        const gastosPorTipo: Tipo = transacoes.reduce((contador, transacao) => {
            if (!contador[transacao.categoria]) {
                contador[transacao.categoria] = transacao.valor;
            }
            else {
                contador[transacao.categoria] += transacao.valor;
            }
            return contador;
        }, {})

        const dadosGrafico = ((Object.keys(gastosPorTipo).map((categoria) => {
            const valor = gastosPorTipo[categoria];
            return {
                name: categoria,
                population: valor,
                color: getRandomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            }
        })))

        return (
            <PieChart
                data={dadosGrafico}
                width={Dimensions.get('window').width - 20}
                height={220}
                accessor="population"
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                backgroundColor="transparent"
                paddingLeft="14"
            />
        )
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top', 'bottom']}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Ionicons name='cellular' size={32} color='green'></Ionicons>
                    <Text style={styles.headerTitulo}>Gerenciador Financeiro</Text>
                </View>

                <View style={styles.body}>
                    <Text style={styles.mesTitulo}>CLASSIFICAÇÃO DOS GASTOS DE {mes}</Text>
                </View>

                {dadosProntos ? (<GraficoPizza
                    transacoes={historico.gastos} />) :
                    (
                        <View>
                            <Text>Carregando dados...</Text>
                        </View>
                    )}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalTitulo}>TOTAL:</Text>
                    <Text style={styles.totalValor}>{somaGastos}</Text>
                </View>

                <Pressable
                    style={styles.botaoVoltar}
                    onPress={() => linkVoltar()}
                >
                    <Ionicons name='arrow-back' size={64} color={'#FFF'}></Ionicons>
                    <Text style={styles.botaoTexto}>VOLTAR</Text>
                </Pressable>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
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
    totalContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16
    },
    body: {
        paddingTop: 24,
        alignItems: 'center',
        width: '100%',
    },
    mesTitulo: {
        fontSize: 20,
        color: '#2F4538',
        fontWeight: 800,
        textAlign: 'center',
        paddingBottom: 16
    },
    totalTitulo: {
        fontSize: 18,
        fontWeight: 600,
    },
    totalValor: {
        fontSize: 20,
        fontWeight: 800
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
        paddingVertical: 24,
        borderLeftColor: 'black',
        borderRightColor: 'black',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        borderRadius: 10,
    }
})

