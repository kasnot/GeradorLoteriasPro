import { useState, useEffect } from 'react';
import './index.css';
import App from './App';
import {
  Dice1,
  Download,
  Trash2,
  Save,
  TrendingUp,
  CheckCircle,
  Bell,
  Share2,
  Moon,
  Sun,
  BarChart3,
  Settings,
  Users,
  Crown,
} from 'lucide-react';

/* =========================
   CONFIGURAÇÕES GLOBAIS
========================= */

const LOTERIAS_CONFIG = {
  megasena: {
    nome: 'Mega-Sena',
    min: 1,
    max: 60,
    quantidade: 6,
    cor: 'bg-green-600',
    topNumeros: [
      10, 5, 23, 37, 33, 53, 54, 4, 17, 30, 42, 51, 27, 13, 41, 38, 28, 35, 43,
      29,
    ],
  },
  megavirada: {
    nome: 'Mega da Virada',
    min: 1,
    max: 60,
    quantidade: 6,
    cor: 'bg-yellow-600',
    especial: true,
    topNumeros: [
      10, 5, 23, 37, 33, 53, 54, 4, 17, 30, 42, 51, 27, 13, 41, 38, 28, 35, 43,
      29,
    ],
  },
  lotofacil: {
    nome: 'Lotofacil',
    min: 1,
    max: 25,
    quantidade: 15,
    cor: 'bg-purple-600',
    topNumeros: [
      13, 5, 10, 20, 11, 23, 4, 3, 2, 14, 25, 24, 1, 22, 18, 12, 6, 15, 21, 16,
    ],
  },
  quina: {
    nome: 'Quina',
    min: 1,
    max: 80,
    quantidade: 5,
    cor: 'bg-blue-600',
    topNumeros: [
      4, 49, 53, 30, 44, 3, 36, 23, 15, 10, 41, 33, 38, 24, 18, 64, 27, 31, 51,
      14,
    ],
  },
  lotomania: {
    nome: 'Lotomania',
    min: 0,
    max: 99,
    quantidade: 50,
    cor: 'bg-orange-600',
    topNumeros: [
      53, 5, 66, 24, 23, 44, 61, 32, 70, 50, 28, 38, 54, 4, 42, 10, 58, 37, 2,
      64,
    ],
  },
  duplasena: {
    nome: 'Dupla Sena',
    min: 1,
    max: 50,
    quantidade: 6,
    cor: 'bg-red-600',
    topNumeros: [
      10, 38, 33, 5, 13, 35, 27, 42, 4, 24, 28, 34, 3, 37, 44, 47, 8, 14, 23,
      29,
    ],
  },
  timemania: {
    nome: 'Timemania',
    min: 1,
    max: 80,
    quantidade: 10,
    cor: 'bg-lime-600',
    temTime: true,
    topNumeros: [
      24, 56, 3, 70, 33, 62, 32, 20, 30, 9, 52, 2, 26, 40, 53, 59, 5, 23, 27,
      78,
    ],
  },
  diasorte: {
    nome: 'Dia de Sorte',
    min: 1,
    max: 31,
    quantidade: 7,
    cor: 'bg-amber-600',
    temMes: true,
    topNumeros: [
      10, 23, 2, 15, 25, 13, 20, 3, 31, 17, 5, 8, 12, 27, 29, 6, 7, 14, 21, 26,
    ],
  },
  supersete: {
    nome: 'Super Sete',
    min: 0,
    max: 9,
    quantidade: 7,
    cor: 'bg-teal-600',
    tipoColunas: true,
    topNumeros: [3, 7, 0, 9, 5, 8, 1, 4, 6, 2],
  },
  maismilionaria: {
    nome: '+Milionaria',
    min: 1,
    max: 50,
    quantidade: 6,
    cor: 'bg-indigo-600',
    temTrevos: true,
    topNumeros: [
      13, 42, 5, 28, 44, 9, 14, 26, 33, 18, 3, 24, 21, 38, 7, 30, 46, 11, 35,
      48,
    ],
  },
};

const TIMES_CORACAO = [
  'Corinthians/SP',
  'Flamengo/RJ',
  'Fluminense/RJ',
  'Gremio/RS',
  'Palmeiras/SP',
  'Santos/SP',
  'Sao Paulo/SP',
  'Vasco/RJ',
  'Atletico/MG',
  'Cruzeiro/MG',
  'Botafogo/RJ',
  'Internacional/RS',
];

const MESES_SORTE = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

/* =========================
   COMPONENTE PRINCIPAL
========================= */

export default function GeradorLoterias() {
  const [loteriaAtual, setLoteriaAtual] = useState('megasena');
  const [quantidadeJogos, setQuantidadeJogos] = useState(5);
  const [numerosPreferidos, setNumerosPreferidos] = useState('');
  const [usarTopNumeros, setUsarTopNumeros] = useState(true);
  const [topQuantidade, setTopQuantidade] = useState(15);
  const [jogosGerados, setJogosGerados] = useState([]);
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('gerador');
  const [numerosConferencia, setNumerosConferencia] = useState('');
  const [resultadoConferencia, setResultadoConferencia] = useState(null);
  const [alertasAtivos, setAlertasAtivos] = useState(false);
  const [modoSurpresinha, setModoSurpresinha] = useState(false);
  const [timeEscolhido, setTimeEscolhido] = useState('');
  const [mesEscolhido, setMesEscolhido] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const config = LOTERIAS_CONFIG[loteriaAtual];

  const LIMITE_FREE = 5;
  const LIMITE_PREMIUM = 50;

  useEffect(() => {
  // 1. Verifica Premium salvo
  const premiumSalvo = localStorage.getItem('premium');
  if (premiumSalvo === 'true') {
    setIsPremium(true);
  }

  // 2. Detecta retorno do Stripe (?premium=true)
  const params = new URLSearchParams(window.location.search);
  if (params.get('premium') === 'true') {
    localStorage.setItem('premium', 'true');
    setIsPremium(true);

    alert('🎉 Premium ativado com sucesso!');
    window.history.replaceState({}, document.title, '/');
  }

  // 3. Carrega dados locais
  const carregarDados = async () => {
    try {
      const jogos = await window.storage.get('jogos-salvos');
      if (jogos?.value) setJogosSalvos(JSON.parse(jogos.value));

      const tema = await window.storage.get('tema-escuro');
      if (tema?.value) setModoEscuro(tema.value === 'true');

      const alertas = await window.storage.get('alertas-ativos');
      if (alertas?.value) setAlertasAtivos(alertas.value === 'true');
    } catch (error) {
      console.log('Dados iniciais não carregados');
    }
  };

  carregarDados();
}, []);

  function ativarPremium() {
    localStorage.setItem('usuario_premium', 'true');
    setIsPremium(true);
  }

  function cancelarPremium() {
    localStorage.removeItem('usuario_premium');
    setIsPremium(false);
  }

  const salvarTema = async (escuro) => {
    setModoEscuro(escuro);
    try {
      await window.storage.set('tema-escuro', String(escuro));
    } catch (error) {
      console.error('Erro');
    }
  };

  const toggleAlertas = async () => {
    const novoEstado = !alertasAtivos;
    setAlertasAtivos(novoEstado);
    try {
      await window.storage.set('alertas-ativos', String(novoEstado));
      if (novoEstado) {
        alert('Alertas ativados!');
      }
    } catch (error) {
      console.error('Erro');
    }
  };

  const gerarNumeroAleatorio = (min, max, excluir = []) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excluir.includes(num));
    return num;
  };

  const gerarJogo = (preferidos, topNums) => {
    const jogo = new Set();

    if (modoSurpresinha) {
      while (jogo.size < config.quantidade) {
        const num = gerarNumeroAleatorio(
          config.min,
          config.max,
          Array.from(jogo)
        );
        jogo.add(num);
      }
      return Array.from(jogo).sort((a, b) => a - b);
    }

    preferidos.forEach((num) => {
      if (jogo.size < config.quantidade) {
        jogo.add(num);
      }
    });

    while (jogo.size < config.quantidade && topNums.length > 0) {
      const idx = Math.floor(Math.random() * topNums.length);
      jogo.add(topNums[idx]);
      topNums.splice(idx, 1);
    }

    while (jogo.size < config.quantidade) {
      const num = gerarNumeroAleatorio(
        config.min,
        config.max,
        Array.from(jogo)
      );
      jogo.add(num);
    }

    return Array.from(jogo).sort((a, b) => a - b);
  };

  const gerarTrevos = () => {
    const trevosGerados = new Set();
    while (trevosGerados.size < 2) {
      trevosGerados.add(gerarNumeroAleatorio(1, 6, Array.from(trevosGerados)));
    }
    return Array.from(trevosGerados).sort((a, b) => a - b);
  };

  const gerarJogosSupersete = () => {
    const novosJogos = [];
    for (let i = 0; i < quantidadeJogos; i++) {
      const colunas = [];
      for (let col = 0; col < 7; col++) {
        colunas.push(gerarNumeroAleatorio(0, 9, []));
      }
      novosJogos.push({
        id: Date.now() + i + Math.random(),
        numeros: colunas,
        loteria: loteriaAtual,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: 'supersete',
      });
    }
    return novosJogos;
  };

  const gerarJogos = () => {
    if (config.tipoColunas) {
      setJogosGerados(gerarJogosSupersete());
      return;
    }

    const preferidos = numerosPreferidos
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n >= config.min && n <= config.max);

    const topNums =
      usarTopNumeros && !modoSurpresinha
        ? [...config.topNumeros.slice(0, topQuantidade)]
        : [];

    const novosJogos = [];
    const jogosUnicos = new Set();
    let tentativas = 0;
    const maxTentativas = quantidadeJogos * 100;

    while (novosJogos.length < quantidadeJogos && tentativas < maxTentativas) {
      tentativas++;
      const topDisponiveis = [
        ...topNums.filter((n) => !preferidos.includes(n)),
      ];
      const jogo = gerarJogo([...preferidos], topDisponiveis);
      const jogoStr = jogo.join('-');

      if (!jogosUnicos.has(jogoStr)) {
        jogosUnicos.add(jogoStr);

        const jogoObj = {
          id: Date.now() + novosJogos.length + Math.random(),
          numeros: jogo,
          loteria: loteriaAtual,
          data: new Date().toLocaleDateString('pt-BR'),
        };

        if (config.temTime) {
          jogoObj.time =
            timeEscolhido ||
            TIMES_CORACAO[Math.floor(Math.random() * TIMES_CORACAO.length)];
        }
        if (config.temMes) {
          jogoObj.mes =
            mesEscolhido ||
            MESES_SORTE[Math.floor(Math.random() * MESES_SORTE.length)];
        }
        if (config.temTrevos) {
          jogoObj.trevos = gerarTrevos();
        }

        novosJogos.push(jogoObj);
      }
    }

    setJogosGerados(novosJogos);
  };

  const conferirJogo = () => {
    const numerosJogo = numerosConferencia
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    if (numerosJogo.length === 0) {
      alert('Digite os numeros sorteados');
      return;
    }

    const resultados = jogosGerados.map((jogo, idx) => {
      const acertos = jogo.numeros.filter((n) => numerosJogo.includes(n));
      return {
        jogo: idx + 1,
        acertos: acertos.length,
        numerosAcertados: acertos,
      };
    });

    const melhorJogo = resultados.reduce(
      (max, r) => (r.acertos > max.acertos ? r : max),
      resultados[0] || { acertos: 0 }
    );

    setResultadoConferencia({ resultados, melhorJogo });
  };

  const salvarJogos = async () => {
    if (!isPremium) {
      alert('Recurso exclusivo para usuários Premium 🚀');
      return;
    }

    const novosJogosSalvos = [...jogosSalvos, ...jogosGerados];
    setJogosSalvos(novosJogosSalvos);

    try {
      await window.storage.set(
        'jogos-salvos',
        JSON.stringify(novosJogosSalvos)
      );
      alert('Jogos salvos!');
    } catch (error) {
      alert('Erro ao salvar');
    }
  };

  const removerJogoSalvo = async (id) => {
    const novosJogos = jogosSalvos.filter((j) => j.id !== id);
    setJogosSalvos(novosJogos);

    try {
      await window.storage.set('jogos-salvos', JSON.stringify(novosJogos));
    } catch (error) {
      console.error('Erro');
    }
  };

  const exportarPDF = () => {
    if (!isPremium) {
      alert('Recurso exclusivo para usuários Premium 🚀');
      return;
    }

    const conteudo = jogosGerados
      .map((jogo, idx) => `Jogo ${idx + 1}: ${jogo.numeros.join(' - ')}`)
      .join('\n');

    const blob = new Blob(
      [
        `JOGOS - ${config.nome}\n`,
        `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`,
        conteudo,
      ],
      { type: 'text/plain' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jogos-${loteriaAtual}.txt`;
    a.click();
  };

  const compartilharWhatsApp = () => {
    const texto = jogosGerados
      .map((jogo, idx) => `Jogo ${idx + 1}: ${jogo.numeros.join(' - ')}`)
      .join('\n');

    const mensagem = encodeURIComponent(
      `Meus jogos da ${config.nome}\n\n${texto}`
    );

    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
  };

  const calcularEstatisticas = () => {
    if (!isPremium) {
      alert('Recurso exclusivo para usuários Premium 🚀');
      return;
    }

    const frequencia = {};
    jogosSalvos.forEach((jogo) => {
      jogo.numeros.forEach((num) => {
        frequencia[num] = (frequencia[num] || 0) + 1;
      });
    });

    return Object.entries(frequencia)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  };

  const irParaCheckout = async () => {
    try {
      const response = await fetch(
        'http://localhost:4242/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao iniciar pagamento');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor');
    }
  };

  const bgClass = modoEscuro
    ? 'bg-slate-900'
    : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
  const cardClass = modoEscuro ? 'bg-slate-800/90' : 'bg-white/10';
  const textClass = modoEscuro ? 'text-slate-200' : 'text-white';

  return (
    <div
      className={`min-h-screen ${bgClass} p-4 transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto">
        {/* 👑 INDICADOR PREMIUM */}
        {isPremium && (
          <div className="mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold py-2 px-4 rounded-xl shadow-lg">
            <Crown size={20} />
            <span>Plano Premium Ativo</span>
          </div>
        )}
        <div
          className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Dice1 size={40} className="text-yellow-400" />
              <div>
                <h1 className={`text-3xl font-bold ${textClass}`}>
                  Gerador de Loterias PRO
                </h1>
                <p
                  className={`text-sm ${
                    modoEscuro ? 'text-slate-400' : 'text-white/80'
                  }`}
                >
                  Mega da Virada 2025
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleAlertas}
                className={`p-3 rounded-lg ${
                  alertasAtivos ? 'bg-green-600' : 'bg-slate-700'
                } hover:scale-105 transition-all`}
              >
                <Bell size={20} className="text-white" />
              </button>
              <button
                onClick={() => salvarTema(!modoEscuro)}
                className="p-3 bg-slate-700 rounded-lg hover:scale-105 transition-all"
              >
                {modoEscuro ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
              </button>
              
               <button
                 onClick={irParaCheckout}
                 className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold px-4 py-2 rounded-xl"
               >
                <Crown size={18} />
                Virar Premium
              </button>

            </div>
          </div>
        </div>

        <div
          className={`${cardClass} backdrop-blur-lg rounded-2xl p-2 mb-6 border border-white/20`}
        >
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'gerador', label: 'Gerador', icon: Dice1 },
              { id: 'conferencia', label: 'Conferencia', icon: CheckCircle },
              { id: 'estatisticas', label: 'Estatisticas', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAbaSelecionada(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  abaSelecionada === tab.id
                    ? 'bg-yellow-500 text-slate-900'
                    : `${
                        modoEscuro
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-white/20 text-white'
                      } hover:bg-white/30`
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {abaSelecionada === 'gerador' && (
          <>
            <div
              className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
            >
              <h2 className={`text-xl font-bold ${textClass} mb-4`}>
                Escolha a Loteria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(LOTERIAS_CONFIG).map(([key, lot]) => (
                  <button
                    key={key}
                    onClick={() => setLoteriaAtual(key)}
                    className={`${lot.cor} ${
                      loteriaAtual === key ? 'ring-4 ring-yellow-400' : ''
                    } 
                      text-white font-bold py-4 px-4 rounded-xl hover:scale-105 transition-all relative`}
                  >
                    {lot.nome}
                    {lot.especial && (
                      <span className="absolute top-1 right-1 text-xs bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full">
                        *
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
            >
              <h2 className={`text-xl font-bold ${textClass} mb-4`}>
                Configuracoes
              </h2>

              <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border-2 border-pink-400/50">
                <label
                  className={`flex items-center gap-3 ${textClass} font-bold cursor-pointer`}
                >
                  <input
                    type="checkbox"
                    checked={modoSurpresinha}
                    onChange={(e) => setModoSurpresinha(e.target.checked)}
                    className="w-6 h-6 rounded"
                  />
                  <Dice1 className="text-pink-400" size={24} />
                  <div>
                    <div>MODO SURPRESINHA</div>
                    <div className="text-sm font-normal opacity-80">
                      Numeros 100% aleatorios
                    </div>
                  </div>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${textClass} mb-2 font-semibold`}>
                    Quantidade de Jogos
                    {!isPremium && (
                      <span className="ml-2 text-xs text-yellow-400">
                        (Free até 5)
                      </span>
                    )}
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={isPremium ? 100 : 5}
                    value={quantidadeJogos}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value);

                      if (!isPremium && valor > 5) {
                        alert(
                          'Plano Free permite até 5 jogos. Seja Premium 🚀'
                        );
                        return;
                      }

                      setQuantidadeJogos(valor);
                    }}
                    className={`w-full px-4 py-3 rounded-lg ${
                      modoEscuro
                        ? 'bg-slate-700 text-white'
                        : 'bg-white/20 text-white'
                    } border border-white/30`}
                  />
                </div>

                <div>
                  <label className={`block ${textClass} mb-2 font-semibold`}>
                    Numeros Preferidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 7, 13, 21"
                    value={numerosPreferidos}
                    onChange={(e) => setNumerosPreferidos(e.target.value)}
                    disabled={modoSurpresinha}
                    className={`w-full px-4 py-3 rounded-lg ${
                      modoEscuro
                        ? 'bg-slate-700 text-white'
                        : 'bg-white/20 text-white'
                    } border border-white/30 disabled:opacity-50`}
                  />
                </div>
              </div>

              {config.temTime && (
                <div className="mt-4">
                  <label className={`block ${textClass} mb-2 font-semibold`}>
                    Time
                  </label>
                  <select
                    value={timeEscolhido}
                    onChange={(e) => setTimeEscolhido(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg ${
                      modoEscuro
                        ? 'bg-slate-700 text-white'
                        : 'bg-white/20 text-white'
                    } border border-white/30`}
                  >
                    <option value="">Aleatorio</option>
                    {TIMES_CORACAO.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {config.temMes && (
                <div className="mt-4">
                  <label className={`block ${textClass} mb-2 font-semibold`}>
                    Mes
                  </label>
                  <select
                    value={mesEscolhido}
                    onChange={(e) => setMesEscolhido(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg ${
                      modoEscuro
                        ? 'bg-slate-700 text-white'
                        : 'bg-white/20 text-white'
                    } border border-white/30`}
                  >
                    <option value="">Aleatorio</option>
                    {MESES_SORTE.map((mes) => (
                      <option key={mes} value={mes}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!modoSurpresinha && (
                <div className="mt-6 flex items-center gap-4">
                  <label
                    className={`flex items-center gap-2 ${textClass} font-semibold`}
                  >
                    <input
                      type="checkbox"
                      checked={usarTopNumeros}
                      onChange={(e) => setUsarTopNumeros(e.target.checked)}
                      className="w-5 h-5"
                    />
                    Usar numeros mais sorteados
                  </label>

                  {usarTopNumeros && (
                    <select
                      value={topQuantidade}
                      onChange={(e) =>
                        setTopQuantidade(parseInt(e.target.value))
                      }
                      className={`px-3 py-2 rounded-lg ${
                        modoEscuro
                          ? 'bg-slate-700 text-white'
                          : 'bg-white/20 text-white'
                      } border border-white/30`}
                    >
                      <option value={10}>Top 10</option>
                      <option value={15}>Top 15</option>
                      <option value={20}>Top 20</option>
                    </select>
                  )}
                </div>
              )}

              <button
                onClick={gerarJogos}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Dice1 size={24} />
                {modoSurpresinha ? 'Gerar Surpresinha' : 'Gerar Jogos'}
              </button>
            </div>
          </>
        )}

        {abaSelecionada === 'conferencia' && (
          <div
            className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
          >
            <h2 className={`text-xl font-bold ${textClass} mb-4`}>
              Conferir Jogos
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ex: 5, 10, 23, 33, 42, 51"
                value={numerosConferencia}
                onChange={(e) => setNumerosConferencia(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  modoEscuro
                    ? 'bg-slate-700 text-white'
                    : 'bg-white/20 text-white'
                } border border-white/30`}
              />
              <button
                onClick={conferirJogo}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all"
              >
                Conferir
              </button>
              {resultadoConferencia && (
                <div
                  className={`p-4 ${
                    modoEscuro ? 'bg-slate-700' : 'bg-white/20'
                  } rounded-lg`}
                >
                  {resultadoConferencia.resultados.map((r) => (
                    <div key={r.jogo} className="mb-2 text-white">
                      Jogo {r.jogo}: {r.acertos} acertos
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {abaSelecionada === 'estatisticas' && (
          <div
            className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
          >
            <h2 className={`text-xl font-bold ${textClass} mb-4`}>
              Estatisticas
            </h2>
            {jogosSalvos.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {calcularEstatisticas().map(([num, freq]) => (
                  <div
                    key={num}
                    className={`p-4 ${
                      modoEscuro ? 'bg-slate-700' : 'bg-white/20'
                    } rounded-lg text-center`}
                  >
                    <div className={`text-3xl font-bold ${textClass}`}>
                      {num}
                    </div>
                    <div className="text-sm text-white/70">{freq}x</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={textClass}>Salve jogos para ver estatisticas</p>
            )}
          </div>
        )}

        {jogosGerados.length > 0 && (
          <div
            className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20`}
          >
            <div className="flex justify-between mb-4">
              <h2 className={`text-xl font-bold ${textClass}`}>
                Jogos ({jogosGerados.length})
              </h2>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={compartilharWhatsApp}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Share2 size={18} />
                </button>

                <button
                  onClick={salvarJogos}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={18} />
                </button>

                <button
                  onClick={exportarPDF}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Lista de jogos */}
            <div className="grid md:grid-cols-2 gap-4">
              {jogosGerados.map((jogo, idx) => (
                <div
                  key={jogo.id}
                  className={`${
                    modoEscuro ? 'bg-slate-700/50' : 'bg-white/20'
                  } rounded-xl p-4`}
                >
                  <div className={`font-bold ${textClass} mb-2`}>
                    Jogo {idx + 1}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jogo.tipo === 'supersete'
                      ? jogo.numeros.map((num, colIdx) => (
                          <div
                            key={colIdx}
                            className="flex flex-col items-center"
                          >
                            <div className="text-xs text-white/60 mb-1">
                              Col {colIdx + 1}
                            </div>
                            <div
                              className={`${config.cor} text-white font-bold w-12 h-12 rounded-lg flex items-center justify-center`}
                            >
                              {num}
                            </div>
                          </div>
                        ))
                      : jogo.numeros.map((num) => (
                          <div
                            key={num}
                            className={`${config.cor} text-white font-bold w-12 h-12 rounded-full flex items-center justify-center`}
                          >
                            {num}
                          </div>
                        ))}
                  </div>
                  {jogo.trevos && (
                    <div className="mt-2 flex gap-2">
                      {jogo.trevos.map((t) => (
                        <div
                          key={t}
                          className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                  {jogo.time && (
                    <div className="mt-2 text-white">Time: {jogo.time}</div>
                  )}
                  {jogo.mes && (
                    <div className="mt-2 text-white">Mes: {jogo.mes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {jogosSalvos.length > 0 && (
          <div
            className={`${cardClass} backdrop-blur-lg rounded-2xl p-6 border border-white/20`}
          >
            <h2 className={`text-xl font-bold ${textClass} mb-4`}>
              Salvos ({jogosSalvos.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {jogosSalvos.map((jogo) => (
                <div
                  key={jogo.id}
                  className={`${
                    modoEscuro ? 'bg-slate-700/50' : 'bg-white/20'
                  } rounded-xl p-4`}
                >
                  <div className="flex justify-between mb-2">
                    <div className={`font-bold ${textClass}`}>
                      {LOTERIAS_CONFIG[jogo.loteria].nome}
                    </div>
                    <button
                      onClick={() => removerJogoSalvo(jogo.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jogo.numeros.map((num) => (
                      <div
                        key={num}
                        className={`${
                          LOTERIAS_CONFIG[jogo.loteria].cor
                        } text-white font-bold w-10 h-10 rounded-full flex items-center justify-center`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`text-center ${
            modoEscuro ? 'text-slate-400' : 'text-white/60'
          } mt-6 text-sm`}
        >
          Jogue com responsabilidade • Mega da Virada 2025
        </div>
      </div>
    </div>
  );
}
