import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

export default function inserirRecebido() {
    const { mes } = useLocalSearchParams();
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [valor, setValor] = useState("");
    const [valorDouble, setValorDouble] = useState(0.00);
    const [carregando, setCarregando] = useState(false);

    const handleValorChanged = (text) => {
        const cleanedText = text.replace(/[^0-9.]/g, '')
        const parts = cleanedText.split('.');
        let valorFormatado = parts.length > 2 ?
            `${parts[0]}.${parts.slice(1).join('')}`
            : cleanedText;

        setValor(valorFormatado);
        setValorDouble(parseFloat(valorFormatado) || 0.00);
    }

    const adicionarTransacao = async (): Promise<boolean> => {
        try {
            setCarregando(true);

            const historicoAtualizado = await AsyncStorage.getItem(`@${mes}_2025`)

            const dados: MesFinanceiro = historicoAtualizado ? JSON.parse(historicoAtualizado) : {
                saldoInicial: 0.00,
                receitas: [],
                gastos: []
            }

            const transacao: Transacao = {
                id: Date.now().toString(),
                tipo: "receita",
                categoria: "receita",
                nome: nome,
                valor: valorDouble,
                data: new Date().toISOString()
            }

            dados.receitas.push(transacao);
            await AsyncStorage.setItem(`@${mes}_2025`, JSON.stringify(dados));

            setNome("");
            setValor("");
            setValorDouble(0.00);

            Alert.alert(
                "Confirmação",
                "Receita registrada com sucesso!",
                [
                    {
                        text: "OK",
                        style: 'default',
                    }
                ]
            )

            return true;
        }
        catch (error) {
            console.error("Erro:", error);
            return false;
        }
        finally {
            setCarregando(false);
        }

    }

    const linkVoltar = () => {
        router.replace({
            pathname: '/opcoesMes',
            params: { mes }
        });
    }


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name='cellular' size={32} color='green'></Ionicons>
                    <Text style={styles.headerTitulo}>Gerenciador Financeiro</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.mesTitulo}>INSERIR VALOR RECEBIDO EM {mes}</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Descrição:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={"Digite o nome do valor recebido"}
                            value={nome}
                            onChangeText={setNome}
                        />
                        <Text style={styles.inputLabel}>Valor:</Text>
                        <TextInput
                            style={styles.input}
                            value={valor}
                            onChangeText={handleValorChanged}
                            placeholder={"0.00"}
                            keyboardType="numeric"

                        />
                    </View>

                </View>
                <Pressable
                    style={[styles.botaoVoltar, styles.botaoSalvar]}
                    onPress={() => adicionarTransacao()}//mudar para salvar e criar função
                >
                    <Ionicons
                        name='save'
                        size={48}
                        color={'#FFF'}
                    />
                    <Text style={styles.botaoTexto}>SALVAR</Text>
                </Pressable>
                <Pressable
                    style={styles.botaoVoltar}
                    onPress={() => linkVoltar()}
                >
                    <Ionicons name='arrow-back' size={48} color={'#FFF'}></Ionicons>
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
    body: {
        flex: 1,
        paddingTop: 24,
        gap: 10,
        alignItems: 'center',
        width: '95%',
    },
    inputContainer: {
        width: '100%',
        gap: 15,
        paddingVertical: 16,
        alignItems: 'center'
    },
    inputLabel: {
        fontSize: 18,
    },
    input: {
        width: '85%',
        borderWidth: 1,
        height: 50,
    },
    mesTitulo: {
        fontSize: 20,
        color: '#2F4538',
        fontWeight: 800,
        textAlign: 'center',
        paddingBottom: 16
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

    },
    botaoSalvar: {
        backgroundColor: '#446b54ff',
        marginBottom: 5
    }
})