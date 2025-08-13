import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MesFinanceiro {
    saldoInicial: number
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
const categorias = [
    'Moradia', 'Supermercado', 'Restaurante',
    'Transporte', 'Saúde', 'Lazer',
    'Cartão', 'Internet', 'Estudos',
    'Vestuário', 'Academia', 'Pets',
    'Estética', 'Assinaturas', 'Outros'
];

export default function inserirGasto() {
    const { mes } = useLocalSearchParams();
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [valorDouble, setValorDouble] = useState(0.00);
    const [carregando, setCarregando] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleValorChanged = (text) => {
        try {
            const cleanedText = text.replace(/[^0-9.]/g, '');
            const partes = cleanedText.split(".");
            const valorFormatado = partes.length > 2 ? `${partes[0]}.${partes.slice(1).join("")}` : cleanedText;
            setValor(valorFormatado);
            setValorDouble(parseFloat(valorFormatado) || 0.00)
        }
        catch (error) {
            console.error("Erro:", error);
        }
    }

    const AdicionarTransacao = async (): Promise<boolean> => {
        try {
            setCarregando(true);
            const historicoAtualizado = await AsyncStorage.getItem(`@${mes}_2025`);
            const dados: MesFinanceiro = historicoAtualizado ? JSON.parse(historicoAtualizado) : {
                saldoInicial: 0.00,
                receitas: [],
                gastos: []
            }
            const transacao: Transacao = {
                id: Date.now().toString(),
                tipo: "gasto",
                categoria: categoria,
                nome: nome,
                valor: valorDouble,
                data: new Date().toISOString(),
            }

            dados.gastos.push(transacao);
            AsyncStorage.setItem(`@${mes}_2025`, JSON.stringify(dados))

            setNome("");
            setValor("");
            setValorDouble(0.00);
            setCategoria("");

            Alert.alert(
                "Confirmação",
                "Gasto registrado com sucesso!",
                [
                    {
                        text: 'OK',
                        style: 'default'
                    }
                ]
            )

            return true;
        }
        catch (error) {
            console.error("Erro:", error);
            return false;
        }

    }

    const gruposDeCategorias = [];

    for (let i = 0; i < categorias.length; i += 3) {
        gruposDeCategorias.push(categorias.slice(i, i + 3))
    }

    const categoriaClicada = (categoriaEscolhida: string) => {
        setCategoria(categoriaEscolhida);
        Keyboard.dismiss();
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }

    const linkVoltar = () => {
        router.replace({
            pathname: '/opcoesMes',
            params: { mes }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Comportamento diferente por OS
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
                <View style={{ flex: 1, width: '100%' }}>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            width: '100%',
                            paddingBottom: 100 // Espaço para os botões
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >


                        <View style={styles.body}>
                            <Text style={styles.mesTitulo}>INSERIR GASTO EM {mes}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Descrição do valor:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={"Digite o nome do gasto"}
                                value={nome}
                                onChangeText={setNome}
                            />
                            <Text style={styles.inputLabel}>Categoria:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={"Digite ou selecione a categoria"}
                                value={categoria}
                                onChangeText={setCategoria}
                            />
                            <View style={styles.containerCategorias}>
                                {gruposDeCategorias.map((grupo, index) => (
                                    <View
                                        key={`grupo-${index}`}
                                        style={styles.containerTresCategorias}>
                                        {grupo.map((cat) => (
                                            <Pressable
                                                key={cat}
                                                style={styles.mesBotao}
                                                onPress={() => categoriaClicada(cat)}>
                                                <Text style={styles.mesTexto}>{cat}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )
                                )}
                            </View>

                            <Text style={styles.inputLabel}>Valor:</Text>
                            <TextInput
                                style={styles.input}
                                value={valor}
                                onChangeText={handleValorChanged}
                                placeholder={"0.00"}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.containerBotoes}>
                            <Pressable
                                style={[styles.botaoVoltar, styles.botaoSalvar]}
                                onPress={() => AdicionarTransacao()}
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

                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>



    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 0.2,
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
    inputContainer: {
        width: '100%',
        flex: 1,
        gap: 15,
        paddingVertical: 16,
        alignItems: 'center',

    },
    inputLabel: {
        fontSize: 18,
    },
    input: {
        width: '85%',
        borderWidth: 1,
        height: 50,
    },
    containerBotoes: {
        flexDirection: 'row',
        width: '100%',
        flex: 0.5,
        gap: 25,
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'center',
    },
    containerCategorias: {
        flex: 0.7,
        width: '100%',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2
    },
    containerTresCategorias: {
        flexDirection: 'row',
        width: '95%',
        gap: 10,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mesBotao: {
        paddingVertical: 16,
        paddingHorizontal: 1,
        backgroundColor: 'green',
        borderRadius: 5,
        width: '33%',
        textAlign: 'center',

    },
    mesTexto: {
        fontSize: 12,
        color: '#FFF',
        textAlign: 'center'
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
    botaoSalvar: {
        backgroundColor: '#446b54ff',
    }
})