import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MesFinanceiro {
    saldoInicial: number,
    receitas: Transacao[],
    gastos: Transacao[]
}

interface Transacao {
    id: string,
    tipo: string,
    categoria: string,
    nome: string,
    valor: number,
    data: string
}


export default function inserirGasto() {
    const { mes } = useLocalSearchParams();
    const router = useRouter();
    const [dados, setDados] = useState("");
    const [somaReceitas, setSomaReceitas] = useState("0.00");
    const [somaGastos, setSomaGastos] = useState("0.00");
    const [saldo, setSaldo] = useState("0.00");

    const linkVoltar = () => {
        router.replace({
            pathname: '/opcoesMes',
            params: { mes }
        });
    }

    const carregarDados = async () => {
        const historico = await AsyncStorage.getItem(`@${mes}_2025`);
        const historicoAtualizado: MesFinanceiro = historico ? JSON.parse(historico) : {
            saldoInicial: 0.00,
            receitas: [],
            gastos: []
        }
        setDados(JSON.stringify(historicoAtualizado));

        const receitas = historicoAtualizado.receitas.reduce((acumulador, valorAtual) => acumulador + valorAtual.valor, 0);
        const receitasFormatadas = formatarMoeda(receitas);
        setSomaReceitas(receitasFormatadas);

        const gastos = historicoAtualizado.gastos.reduce((acumulador, valorAtual) => acumulador + valorAtual.valor, 0);
        const gastosFormatados = formatarMoeda(gastos);
        setSomaGastos(gastosFormatados);

        const saldo = receitas - gastos;
        const saldoFormatado = formatarMoeda(saldo);
        setSaldo(saldoFormatado);

        //console.log("histórico carregado" + JSON.stringify(historicoAtualizado));
    }

    const mostraListaReceitas = () => {
        router.push({
            pathname: '/listaReceitas',
            params: { mes, somaReceitas },
        })
    }

    const mostraListaGastos = () => {
        router.push({
            pathname: '/listaGastos',
            params: { mes, somaGastos },
        })
    }

    const mostraGrafico = () => {
        router.push({
            pathname: '/graficoGastos',
            params: { dados, mes, somaGastos },
        })
    }

    const formatarMoeda = (valor) => {
        const valorArredondado = Math.floor(valor * 100) / 100;

        return valorArredondado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    useEffect(() => {
        carregarDados();
    }, []
    )

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name='cellular' size={32} color='green'></Ionicons>
                    <Text style={styles.headerTitulo}>Gerenciador Financeiro</Text>
                </View>
                <Text style={styles.mesTitulo}>ESTATÍSTICAS DE {mes}</Text>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.containerValores}>
                        <Text style={styles.textoValores}>Receitas no mês: {somaReceitas}</Text>
                        <Pressable style={styles.botaoDetalhes} onPress={mostraListaReceitas}>
                            <Text style={styles.botaoDetalhesTexto}>Ver lista</Text>
                        </Pressable>
                        <Text style={styles.textoValores}>Gastos no mês: {somaGastos}</Text>
                        <View style={styles.containerBotoes}>
                            <Pressable style={styles.botaoDetalhes} onPress={mostraListaGastos}>
                                <Text style={styles.botaoDetalhesTexto}>Ver lista</Text>
                            </Pressable>
                            <Pressable style={styles.botaoDetalhes} onPress={mostraGrafico}>
                                <Text style={styles.botaoDetalhesTexto}>Ver gráfico</Text>
                            </Pressable>
                        </View>


                        <Text style={styles.textoSaldo}>SALDO: {saldo}</Text>
                    </View>

                </ScrollView>

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
        alignItems: 'center'
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
    scrollContainer: {
        flexGrow: 1,
        width: '100%',
        paddingTop: 25,
        paddingBottom: 100,
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mesTitulo: {
        fontSize: 20,
        color: '#2F4538',
        fontWeight: 800,
        textAlign: 'center',
        paddingTop: 24,
        paddingBottom: 16
    },
    containerValores: {
        width: '100%',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 10
    },
    textoValores: {
        fontSize: 18
    },
    textoSaldo: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
    },
    containerBotoes: {
        flexDirection: 'row',
        width: '75%',
        gap: 18,
        alignItems: 'center',
    },
    botaoDetalhes: {
        padding: 12,
        width: 150,
        backgroundColor: 'green',
        borderRadius: 5
    },
    botaoDetalhesTexto: {
        color: 'white',
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
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