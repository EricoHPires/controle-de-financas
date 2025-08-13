import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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

export default function ListaReceitas() {

    const { mes, somaReceitas } = useLocalSearchParams();
    const [historico, setHistorico] = useState<MesFinanceiro>(
        {
            saldoInicial: 0.00,
            receitas: [],
            gastos: []
        })
    const [somaR, setSomaR] = useState<string | string[]>("");
    const router = useRouter();

    const carregarDados = async () => {
        const historico = await AsyncStorage.getItem(`@${mes}_2025`);
        const historicoAtualizado: MesFinanceiro = historico ? JSON.parse(historico) : {
            saldoInicial: 0.00,
            receitas: [],
            gastos: []
        }
        setHistorico(historicoAtualizado);
        const somaR = somaReceitas;
        setSomaR(somaR);
    }

    useEffect(() => {
        carregarDados();
    }, [])

    const renderizaItem = ({ item }: { item: Transacao }) => {

        const valor = formatarMoeda(item.valor);

        return (
            <View style={styles.containerItem}>
                <Text style={styles.itemNomeTexto}>{item.nome}</Text>
                <View style={styles.valorELixeiraContainer}>
                    <Text style={styles.itemValorTexto}>{valor}</Text>
                    <Ionicons name='trash-outline' size={24} color='#022202ff' onPress={() => excluirItem(item)} />
                </View>
            </View>
        )
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

    const linkVoltar = () => {
        router.replace({
            pathname: '/opcoesMes',
            params: { mes }
        });
    }

    const excluirHistorico = () => {
        Alert.alert(
            "Confirmação",
            `Você realmente deseja excluir todas as receitas cadastradas em ${mes}?`,
            [
                {
                    text: "CANCELAR",
                    style: 'cancel'
                },
                {
                    text: "EXCLUIR",
                    onPress: () => {
                        const gastos = historico.gastos;
                        const saldo = historico.saldoInicial;

                        const novoHistorico: MesFinanceiro = {
                            saldoInicial: saldo,
                            receitas: [],
                            gastos: gastos,
                        }

                        setHistorico(novoHistorico);
                        AsyncStorage.setItem(`@${mes}_2025`, JSON.stringify(novoHistorico))
                        setSomaR("R$ 0,00");
                        Alert.alert(
                            "Confirmação",
                            `Registros de receitas em ${mes} excluídos com sucesso!`,

                            [
                                {
                                    text: "OK"
                                }
                            ]
                        )
                    }
                }
            ]
        )
    }

    const excluirItem = (item: Transacao) => {
        Alert.alert(
            "CONFIRMAÇÃO",
            "Você realmente deseja remover este item do histórico?",
            [
                {
                    text: "Cancelar",
                    style: 'cancel',
                },
                {
                    text: "Remover",
                    onPress: () => {
                        const receitasAtualizadas = historico.receitas.filter(x => x.id !== item.id);
                        const novoHistorico: MesFinanceiro = {
                            saldoInicial: historico.saldoInicial,
                            receitas: receitasAtualizadas,
                            gastos: historico.gastos
                        }
                        setHistorico(novoHistorico);
                        AsyncStorage.setItem(`${mes}_2025`, JSON.stringify(novoHistorico));
                    }
                }
            ])
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top', 'bottom']}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Ionicons name='cellular' size={32} color='green'></Ionicons>
                    <Text style={styles.headerTitulo}>Gerenciador Financeiro</Text>
                </View>
                <View style={styles.listaContainer}>
                    <View style={styles.tituloListaContainer}>
                        <Text style={styles.nomeListaTitulo}>RECEITAS EM {mes}</Text>
                    </View>

                    <FlatList
                        data={historico.receitas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())}
                        renderItem={renderizaItem}
                        keyExtractor={(item) => item.id}
                    />

                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalTitulo}>TOTAL:</Text>
                    <Text style={styles.totalValor}>{somaR}</Text>
                </View>

                <View style={styles.containerBotoes}>
                    <Pressable
                        style={[styles.botaoVoltar, styles.botaoExcluir]}
                        onPress={() => excluirHistorico()}
                    >
                        <Ionicons
                            name='trash'
                            size={48}
                            color={'#FFF'}
                        />
                        <Text style={styles.botaoTexto}>LIMPAR</Text>
                    </Pressable>
                    <Pressable
                        style={styles.botaoVoltar}
                        onPress={() => linkVoltar()}
                    >
                        <Ionicons name='arrow-back' size={48} color={'#FFF'}></Ionicons>
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
        alignItems: 'center',
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
    listaContainer: {
        flex: 1,
        width: '95%',
        marginTop: 10,
        backgroundColor: '#f5f4f0',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: '#f4f9fc',
        borderRightColor: '#f4f9fc',
    },
    tituloListaContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#10380eff',
        width: '100%',
        marginBottom: 10,
        borderRadius: 16
    },
    nomeListaTitulo: {
        justifyContent: 'center',
        color: '#FFF'
    },
    containerItem: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        marginBottom: '1%',
        marginTop: '1%',
    },
    valorELixeiraContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 0.7,
        gap: 20
    },
    itemNomeTexto: {
        fontSize: 16,
    },
    itemValorTexto: {
        fontSize: 18,
        fontWeight: 800,
    },
    totalContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
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
    containerBotoes: {
        flexDirection: 'row',
        width: '100%',
        flex: 0.4,
        gap: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoVoltar: {
        width: '40%',
        backgroundColor: '#4e8564ff',
        paddingVertical: 24,
        borderLeftColor: 'black',
        borderRightColor: 'black',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        borderRadius: 10
    },
    botaoExcluir: {
        backgroundColor: '#882222ff',
    }

})