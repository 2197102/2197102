// MalkLabs - Sistema Principal
// Desenvolvido por MalkDev0 - Jmfxp22

// Configuração Global
const CONFIG = {
    APP_NAME: 'MalkLabs',
    VERSION: '2.0.26',
    DEV_NAME: 'MalkDev0',
    DEV_ALIAS: 'Jmfxp22',
    DEFAULT_LANG: 'javascript',
    WEBHOOK_URL: 'https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI', // SUBSTITUA COM SEU WEBHOOK
    AUTO_SAVE: true,
    AUTO_SAVE_DELAY: 2000,
    MAX_CONSOLE_LINES: 100
};

// Estado da Aplicação
const STATE = {
    currentLanguage: CONFIG.DEFAULT_LANG,
    currentTheme: 'dark',
    code: '',
    consoleHistory: [],
    aiHistory: [],
    autoSaveTimer: null,
    isSidebarOpen: false,
    lastSave: null,
    isConnected: true
};

// Elementos DOM
const ELEMENTS = {
    // Telas
    loading: document.getElementById('loading'),
    app: document.getElementById('app'),
    splash: document.getElementById('splash'),
    
    // Progresso
    progressFill: document.getElementById('progress-fill'),
    progressPercent: document.getElementById('progress-percent'),
    progressMessage: document.getElementById('progress-message'),
    
    // Header
    menuToggle: document.getElementById('menu-toggle'),
    closeSidebar: document.getElementById('close-sidebar'),
    sidebar: document.getElementById('sidebar'),
    runBtn: document.getElementById('run-btn'),
    aiBtn: document.getElementById('ai-btn'),
    
    // Linguagens
    languageSelect: document.getElementById('language-select'),
    langButtons: document.querySelectorAll('.lang-btn'),
    currentFile: document.getElementById('current-file'),
    filename: document.getElementById('filename'),
    
    // Editor
    codeEditor: document.getElementById('code-editor'),
    lineNumbers: document.getElementById('line-numbers'),
    lineCount: document.getElementById('line-count'),
    charCount: document.getElementById('char-count'),
    cursorPosition: document.getElementById('cursor-position'),
    fileStatus: document.getElementById('file-status'),
    
    // Ferramentas
    formatBtn: document.getElementById('format-btn'),
    debugBtn: document.getElementById('debug-btn'),
    exportBtn: document.getElementById('export-btn'),
    shareBtn: document.getElementById('share-btn'),
    copyCode: document.getElementById('copy-code'),
    saveLocal: document.getElementById('save-local'),
    clearCode: document.getElementById('clear-code'),
    
    // Console
    consoleOutput: document.getElementById('console-output'),
    clearConsole: document.getElementById('clear-console'),
    exportConsole: document.getElementById('export-console'),
    consoleCommand: document.getElementById('console-command'),
    sendCommand: document.getElementById('send-command'),
    
    // Preview
    previewFrame: document.getElementById('preview-frame'),
    refreshPreview: document.getElementById('refresh-preview'),
    fullscreenPreview: document.getElementById('fullscreen-preview'),
    
    // AI
    aiChat: document.getElementById('ai-chat'),
    aiInput: document.getElementById('ai-input'),
    sendAi: document.getElementById('send-ai'),
    quickActions: document.querySelectorAll('.quick-action'),
    
    // Tabs
    editorTabs: document.querySelectorAll('.editor-tab'),
    mobileTabs: document.querySelectorAll('.mobile-tab'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Modal
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackBtn: document.getElementById('feedback-btn'),
    closeModal: document.querySelector('.close-modal'),
    cancelFeedback: document.getElementById('cancel-feedback'),
    submitFeedback: document.getElementById('submit-feedback'),
    feedbackType: document.getElementById('feedback-type'),
    feedbackMessage: document.getElementById('feedback-message'),
    feedbackEmail: document.getElementById('feedback-email'),
    includeCode: document.getElementById('include-code'),
    
    // Configurações
    themeSelect: document.getElementById('theme-select'),
    fontSize: document.getElementById('font-size'),
    
    // Toast
    toastContainer: document.getElementById('toast-container')
};

// Inicialização da Aplicação
class MalkLabs {
    constructor() {
        this.init();
    }
    
    async init() {
        console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
        console.log(`👨‍💻 Desenvolvido por ${CONFIG.DEV_NAME} - ${CONFIG.DEV_ALIAS}`);
        
        // Iniciar loading
        await this.startLoading();
        
        // Carregar configurações
        this.loadSettings();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Carregar exemplo inicial
        this.loadInitialCode();
        
        // Atualizar interface
        this.updateInterface();
        
        // Finalizar loading
        this.finishLoading();
    }
    
    async startLoading() {
        // Simular carregamento progressivo
        const steps = [
            { percent: 10, message: 'Inicializando núcleo...' },
            { percent: 25, message: 'Carregando ambientes de execução...' },
            { percent: 45, message: 'Configurando editor...' },
            { percent: 65, message: 'Ativando IA assistente...' },
            { percent: 85, message: 'Preparando interface...' },
            { percent: 100, message: 'Pronto para decolar!' }
        ];
        
        // Atualizar steps visuais
        const stepElements = document.querySelectorAll('.step');
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Atualizar progresso
            ELEMENTS.progressFill.style.width = `${step.percent}%`;
            ELEMENTS.progressPercent.textContent = `${step.percent}%`;
            ELEMENTS.progressMessage.textContent = step.message;
            
            // Atualizar step visual
            if (i < stepElements.length) {
                stepElements.forEach((el, idx) => {
                    el.classList.toggle('active', idx <= i);
                });
            }
            
            // Aguardar entre passos (simulação)
            await this.sleep(400 + Math.random() * 300);
        }
        
        // Aguardar um pouco mais no final
        await this.sleep(800);
    }
    
    finishLoading() {
        // Fade out loading screen
        ELEMENTS.loading.style.opacity = '0';
        
        setTimeout(() => {
            ELEMENTS.loading.style.display = 'none';
            ELEMENTS.app.style.display = 'flex';
            
            // Animar entrada do app
            ELEMENTS.app.style.opacity = '0';
            ELEMENTS.app.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                ELEMENTS.app.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                ELEMENTS.app.style.opacity = '1';
                ELEMENTS.app.style.transform = 'translateY(0)';
                
                // Mostrar toast de boas-vindas
                this.showToast(
                    `${CONFIG.APP_NAME} inicializado com sucesso! 🚀`,
                    'success'
                );
            }, 50);
        }, 500);
    }
    
    loadSettings() {
        // Carregar do localStorage
        const settings = localStorage.getItem('malklabs_settings');
        if (settings) {
            const saved = JSON.parse(settings);
            STATE.currentLanguage = saved.language || CONFIG.DEFAULT_LANG;
            STATE.currentTheme = saved.theme || 'dark';
            
            // Carregar código salvo
            const savedCode = localStorage.getItem(`malklabs_code_${STATE.currentLanguage}`);
            if (savedCode) {
                ELEMENTS.codeEditor.value = savedCode;
                STATE.code = savedCode;
            }
        }
        
        // Aplicar tema
        document.body.className = `${STATE.currentTheme}-theme`;
        if (ELEMENTS.themeSelect) {
            ELEMENTS.themeSelect.value = STATE.currentTheme;
        }
        
        // Aplicar linguagem
        if (ELEMENTS.languageSelect) {
            ELEMENTS.languageSelect.value = STATE.currentLanguage;
        }
        
        // Atualizar botões de linguagem
        ELEMENTS.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === STATE.currentLanguage);
        });
    }
    
    saveSettings() {
        const settings = {
            language: STATE.currentLanguage,
            theme: STATE.currentTheme,
            lastSave: new Date().toISOString()
        };
        
        localStorage.setItem('malklabs_settings', JSON.stringify(settings));
    }
    
    setupEventListeners() {
        // Menu e Sidebar
        ELEMENTS.menuToggle?.addEventListener('click', () => this.toggleSidebar());
        ELEMENTS.closeSidebar?.addEventListener('click', () => this.toggleSidebar(false));
        
        // Executar código
        ELEMENTS.runBtn?.addEventListener('click', () => this.executeCode());
        
        // Linguagens
        ELEMENTS.languageSelect?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        ELEMENTS.langButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeLanguage(btn.dataset.lang);
            });
        });
        
        // Editor
        ELEMENTS.codeEditor?.addEventListener('input', () => {
            this.handleCodeChange();
        });
        
        ELEMENTS.codeEditor?.addEventListener('keydown', (e) => {
            this.handleEditorKeydown(e);
        });
        
        ELEMENTS.codeEditor?.addEventListener('click', () => {
            this.updateCursorPosition();
        });
        
        ELEMENTS.codeEditor?.addEventListener('keyup', () => {
            this.updateCursorPosition();
        });
        
        // Formatar código
        ELEMENTS.formatBtn?.addEventListener('click', () => this.formatCode());
        
        // Limpar código
        ELEMENTS.clearCode?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar todo o código?')) {
                ELEMENTS.codeEditor.value = '';
                STATE.code = '';
                this.updateStats();
                this.showToast('Código limpo!', 'info');
            }
        });
        
        // Copiar código
        ELEMENTS.copyCode?.addEventListener('click', () => {
            navigator.clipboard.writeText(ELEMENTS.codeEditor.value)
                .then(() => this.showToast('Código copiado!', 'success'))
                .catch(() => this.showToast('Erro ao copiar código', 'error'));
        });
        
        // Salvar local
        ELEMENTS.saveLocal?.addEventListener('click', () => this.saveToFile());
        
        // Console
        ELEMENTS.clearConsole?.addEventListener('click', () => this.clearConsole());
        ELEMENTS.sendCommand?.addEventListener('click', () => this.executeConsoleCommand());
        ELEMENTS.consoleCommand?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.executeConsoleCommand();
        });
        
        // Preview
        ELEMENTS.refreshPreview?.addEventListener('click', () => {
            if (STATE.currentLanguage === 'html' || STATE.currentLanguage === 'css') {
                this.executeCode();
            }
        });
        
        // AI
        ELEMENTS.sendAi?.addEventListener('click', () => this.sendAiMessage());
        ELEMENTS.aiInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAiMessage();
        });
        
        ELEMENTS.quickActions?.forEach(action => {
            action.addEventListener('click', () => {
                this.handleQuickAction(action.dataset.action);
            });
        });
        
        // Tabs
        ELEMENTS.editorTabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        ELEMENTS.mobileTabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        // Modal Feedback
        ELEMENTS.feedbackBtn?.addEventListener('click', () => this.showFeedbackModal());
        ELEMENTS.closeModal?.addEventListener('click', () => this.hideFeedbackModal());
        ELEMENTS.cancelFeedback?.addEventListener('click', () => this.hideFeedbackModal());
        ELEMENTS.submitFeedback?.addEventListener('click', () => this.submitFeedback());
        
        // Configurações
        ELEMENTS.themeSelect?.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        ELEMENTS.fontSize?.addEventListener('change', (e) => {
            document.documentElement.style.fontSize = `${e.target.value}px`;
            this.showToast(`Tamanho da fonte alterado para ${e.target.value}px`, 'info');
        });
        
        // Atalhos globais
        document.addEventListener('keydown', (e) => this.handleGlobalShortcuts(e));
        
        // Auto-save
        if (CONFIG.AUTO_SAVE) {
            setInterval(() => {
                if (STATE.code !== ELEMENTS.codeEditor.value) {
                    this.saveToStorage();
                }
            }, CONFIG.AUTO_SAVE_DELAY);
        }
    }
    
    async loadInitialCode() {
        const examples = {
            javascript: `// MalkLabs - Exemplo JavaScript
// Bem-vindo ao laboratório de código!

console.log('🚀 MalkLabs inicializado!');
console.log('👨‍💻 Desenvolvido por MalkDev0 - Jmfxp22');

// Função de exemplo
function calcularMedia(numeros) {
    const soma = numeros.reduce((acc, num) => acc + num, 0);
    return soma / numeros.length;
}

// Array de números
const dados = [10, 20, 30, 40, 50];
console.log(\`📊 Dados: \${dados.join(', ')}\`);

// Cálculos
const media = calcularMedia(dados);
console.log(\`📈 Média: \${media.toFixed(2)}\`);

// Manipulação DOM simulada
console.log('🎯 Simulando manipulação DOM:');
const elementos = ['header', 'main', 'footer', 'nav', 'section'];
elementos.forEach((tag, i) => {
    console.log(\`  Criando <\${tag}> com id="elemento-\${i + 1}"\`);
});

// Promises e Async/Await
async function buscarDados() {
    console.log('🌐 Buscando dados da API...');
    
    return new Promise(resolve => {
        setTimeout(() => {
            const dadosAPI = {
                status: 'success',
                data: {
                    usuario: 'dev_malk',
                    nivel: 'avançado',
                    linguagens: ['JavaScript', 'Python', 'Lua']
                },
                timestamp: new Date().toISOString()
            };
            resolve(dadosAPI);
        }, 1000);
    });
}

// Executar async
(async () => {
    const resultado = await buscarDados();
    console.log('✅ Dados recebidos:', resultado);
})();

console.log('🎉 Exemplo concluído! Pressione Executar para testar.');`,

            python: `# MalkLabs - Exemplo Python
# Bem-vindo ao laboratório de código!

print("🚀 MalkLabs inicializado!")
print("👨‍💻 Desenvolvido por MalkDev0 - Jmfxp22")

# Função de exemplo
def calcular_media(numeros):
    """Calcula a média de uma lista de números"""
    return sum(numeros) / len(numeros)

# Lista de números
dados = [10, 20, 30, 40, 50]
print(f"📊 Dados: {dados}")

# Cálculos
media = calcular_media(dados)
print(f"📈 Média: {media:.2f}")

# List comprehension
quadrados = [x**2 for x in range(1, 11)]
print(f"🔢 Quadrados de 1 a 10: {quadrados}")

# Dicionário
usuario = {
    "nome": "MalkDev",
    "nivel": "avançado",
    "linguagens": ["Python", "JavaScript", "Lua"],
    "ativo": True
}

print("👤 Dados do usuário:")
for chave, valor in usuario.items():
    print(f"  {chave}: {valor}")

# Classes
class Calculadora:
    """Calculadora científica"""
    
    def __init__(self):
        self.historico = []
    
    def somar(self, a, b):
        resultado = a + b
        self.historico.append(f"{a} + {b} = {resultado}")
        return resultado
    
    def mostrar_historico(self):
        print("📋 Histórico da calculadora:")
        for i, operacao in enumerate(self.historico, 1):
            print(f"  {i}. {operacao}")

# Usando a classe
calc = Calculadora()
print(f"🧮 15 + 25 = {calc.somar(15, 25)}")
print(f"🧮 40 + 60 = {calc.somar(40, 60)}")
calc.mostrar_historico()

print("🎉 Exemplo concluído! Pressione Executar para testar.")`,

            lua: `-- MalkLabs - Exemplo Lua
-- Bem-vindo ao laboratório de código!

print("🚀 MalkLabs inicializado!")
print("👨‍💻 Desenvolvido por MalkDev0 - Jmfxp22")

-- Função de exemplo
function calcular_media(numeros)
    local soma = 0
    for _, num in ipairs(numeros) do
        soma = soma + num
    end
    return soma / #numeros
end

-- Tabela de números
local dados = {10, 20, 30, 40, 50}
print("📊 Dados: " .. table.concat(dados, ", "))

-- Cálculos
local media = calcular_media(dados)
print(string.format("📈 Média: %.2f", media))

-- Tabela (dicionário)
local usuario = {
    nome = "MalkDev",
    nivel = "avançado",
    linguagens = {"Lua", "JavaScript", "Python"},
    ativo = true
}

print("👤 Dados do usuário:")
for chave, valor in pairs(usuario) do
    if type(valor) == "table" then
        print("  " .. chave .. ": " .. table.concat(valor, ", "))
    else
        print("  " .. chave .. ": " .. tostring(valor))
    end
end

-- Funções matemáticas
function fibonacci(n)
    if n <= 1 then return n end
    local a, b = 0, 1
    for i = 2, n do
        a, b = b, a + b
    end
    return b
end

print("🔢 Sequência de Fibonacci:")
for i = 1, 10 do
    io.write(fibonacci(i) .. " ")
end
print()

-- Jogo simples
print("\\n🎮 JOGO DE ADIVINHAÇÃO")
print("Estou pensando em um número entre 1 e 100...")
print("(Dica: é o número 42)")

-- Simulação de API
print("\\n🌐 Simulando requisição HTTP...")
local resposta = {
    status = 200,
    mensagem = "Sucesso",
    dados = {
        usuario = "malk_dev",
        pontos = 1500,
        online = true
    }
}

print("✅ Resposta recebida:")
for chave, valor in pairs(resposta) do
    if type(valor) == "table" then
        print("  " .. chave .. ":")
        for k, v in pairs(valor) do
            print("    " .. k .. ": " .. tostring(v))
        end
    else
        print("  " .. chave .. ": " .. tostring(valor))
    end
end

print("🎉 Exemplo concluído! Pressione Executar para testar.")`,

            html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MalkLabs Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        
        :root {
            --primary: #6366f1;
            --secondary: #10b981;
            --accent: #f59e0b;
            --dark: #0f172a;
            --light: #f8fafc;
        }
        
        body {
            background: linear-gradient(135deg, var(--dark), #1e293b);
            color: var(--light);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            padding: 3rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: float 20s linear infinite;
            opacity: 0.3;
        }
        
        @keyframes float {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }
        
        .logo-icon {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            backdrop-filter: blur(5px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        h1 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #fff, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .tagline {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }
        
        .version {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            backdrop-filter: blur(5px);
            position: relative;
            z-index: 1;
        }
        
        main {
            padding: 3rem 2rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 16px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }
        
        .feature:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.1);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
        }
        
        .feature i {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
            background: rgba(255, 255, 255, 0.1);
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin: 0 auto 1rem;
        }
        
        .demo {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 16px;
            margin-top: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .controls {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
        
        button {
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            min-width: 200px;
            justify-content: center;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }
        
        button.secondary {
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
        }
        
        button.secondary:hover {
            background: rgba(99, 102, 241, 0.1);
        }
        
        .result {
            background: rgba(16, 185, 129, 0.1);
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 1.5rem;
            border-left: 4px solid var(--secondary);
            display: none;
        }
        
        footer {
            text-align: center;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .credits {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .credits strong {
            color: var(--primary);
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            button {
                min-width: 100%;
            }
            
            .controls {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <div class="logo-icon">🚀</div>
                <h1>MalkLabs</h1>
            </div>
            <p class="tagline">Laboratório de Código Avançado</p>
            <span class="version">v2.0.26 • Nexus System</span>
        </header>
        
        <main>
            <h2>✨ Demonstração Interativa</h2>
            <p>Teste as funcionalidades do MalkLabs diretamente nesta página.</p>
            
            <div class="features">
                <div class="feature">
                    <i class="fas fa-code"></i>
                    <h3>5 Linguagens</h3>
                    <p>JavaScript, Python, Lua, HTML, CSS</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-bolt"></i>
                    <h3>Execução Real</h3>
                    <p>Execute código diretamente no navegador</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-robot"></i>
                    <h3>IA Integrada</h3>
                    <p>Assistente inteligente para ajudar no código</p>
                </div>
            </div>
            
            <div class="demo">
                <h3>🎮 Teste Rápido</h3>
                <p>Clique nos botões abaixo para ver a mágica acontecer:</p>
                
                <div class="controls">
                    <button onclick="demoAlert()">
                        <i class="fas fa-bell"></i>
                        Mostrar Mensagem
                    </button>
                    
                    <button class="secondary" onclick="demoColor()">
                        <i class="fas fa-palette"></i>
                        Mudar Cores
                    </button>
                    
                    <button onclick="demoCalc()">
                        <i class="fas fa-calculator"></i>
                        Calcular
                    </button>
                </div>
                
                <div id="demoResult" class="result"></div>
            </div>
        </main>
        
        <footer>
            <p class="credits">
                Desenvolvido com ❤️ por <strong>MalkDev0</strong> • <strong>Jmfxp22</strong>
            </p>
            <p style="margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.6;">
                Sistema Nexus • Todos os direitos reservados
            </p>
        </footer>
    </div>
    
    <script>
        function demoAlert() {
            const result = document.getElementById('demoResult');
            result.innerHTML = \`
                <h4>🎉 Funcionando perfeitamente!</h4>
                <p>O MalkLabs está executando JavaScript diretamente no navegador.</p>
                <p><strong>Recursos ativos:</strong></p>
                <ul>
                    <li>✅ Execução de código em tempo real</li>
                    <li>✅ Console integrado</li>
                    <li>✅ Preview automático</li>
                    <li>✅ IA assistente</li>
                </ul>
            \`;
            result.style.display = 'block';
            
            // Log no console
            console.log('[Demo] Botão de mensagem clicado');
            console.log('[Demo] Sistema MalkLabs operacional');
        }
        
        function demoColor() {
            const root = document.documentElement;
            const colors = [
                ['#6366f1', '#10b981'],
                ['#8b5cf6', '#ec4899'],
                ['#f59e0b', '#ef4444'],
                ['#06b6d4', '#84cc16']
            ];
            
            const randomColors = colors[Math.floor(Math.random() * colors.length)];
            root.style.setProperty('--primary', randomColors[0]);
            root.style.setProperty('--secondary', randomColors[1]);
            
            const result = document.getElementById('demoResult');
            result.innerHTML = \`
                <h4>🎨 Cores alteradas!</h4>
                <p>Tema atualizado para nova paleta de cores.</p>
                <p><strong>Cores aplicadas:</strong></p>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <div style="width: 50px; height: 50px; background: \${randomColors[0]}; border-radius: 8px;"></div>
                    <div style="width: 50px; height: 50px; background: \${randomColors[1]}; border-radius: 8px;"></div>
                </div>
            \`;
            result.style.display = 'block';
        }
        
        function demoCalc() {
            const a = Math.floor(Math.random() * 100);
            const b = Math.floor(Math.random() * 50);
            const ops = ['+', '-', '*', '/'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            
            let resultado;
            switch(op) {
                case '+': resultado = a + b; break;
                case '-': resultado = a - b; break;
                case '*': resultado = a * b; break;
                case '/': resultado = b !== 0 ? (a / b).toFixed(2) : 'Erro: divisão por zero'; break;
            }
            
            const result = document.getElementById('demoResult');
            result.innerHTML = \`
                <h4>🧮 Cálculo realizado!</h4>
                <p>Operação matemática executada com sucesso.</p>
                <p style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">
                    \${a} \${op} \${b} = \${resultado}
                </p>
                <p><small>Calculado em tempo real pelo JavaScript</small></p>
            \`;
            result.style.display = 'block';
        }
        
        // Inicialização
        console.log('🚀 MalkLabs Demo carregado!');
        console.log('👨‍💻 Desenvolvido por MalkDev0 - Jmfxp22');
    </script>
</body>
</html>`,

            css: `/* MalkLabs - Exemplo CSS */
/* Sistema de Design Avançado */

:root {
    /* Sistema de Cores */
    --color-primary-50: #eef2ff;
    --color-primary-100: #e0e7ff;
    --color-primary-200: #c7d2fe;
    --color-primary-300: #a5b4fc;
    --color-primary-400: #818cf8;
    --color-primary-500: #6366f1;
    --color-primary-600: #4f46e5;
    --color-primary-700: #4338ca;
    --color-primary-800: #3730a3;
    --color-primary-900: #312e81;
    
    /* Cores Semânticas */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
    --color-info: #3b82f6;
    
    /* Escala de Cinza */
    --color-gray-50: #f8fafc;
    --color-gray-100: #f1f5f9;
    --color-gray-200: #e2e8f0;
    --color-gray-300: #cbd5e1;
    --color-gray-400: #94a3b8;
    --color-gray-500: #64748b;
    --color-gray-600: #475569;
    --color-gray-700: #334155;
    --color-gray-800: #1e293b;
    --color-gray-900: #0f172a;
    
    /* Espaçamento */
    --spacing-px: 1px;
    --spacing-0: 0;
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;
    
    /* Tipografia */
    --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-family-mono: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;
    
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    
    /* Pesos de Fonte */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
    
    /* Linha de Base */
    --line-height-none: 1;
    --line-height-tight: 1.25;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;
    --line-height-loose: 2;
    
    /* Bordas */
    --border-radius-none: 0;
    --border-radius-sm: 0.25rem;
    --border-radius: 0.5rem;
    --border-radius-md: 0.75rem;
    --border-radius-lg: 1rem;
    --border-radius-xl: 1.5rem;
    --border-radius-2xl: 2rem;
    --border-radius-full: 9999px;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    
    /* Transições */
    --transition-duration-75: 75ms;
    --transition-duration-100: 100ms;
    --transition-duration-150: 150ms;
    --transition-duration-200: 200ms;
    --transition-duration-300: 300ms;
    --transition-duration-500: 500ms;
    --transition-duration-700: 700ms;
    --transition-duration-1000: 1000ms;
    
    /* Easing Functions */
    --ease-linear: linear;
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Z-Index */
    --z-index-0: 0;
    --z-index-10: 10;
    --z-index-20: 20;
    --z-index-30: 30;
    --z-index-40: 40;
    --z-index-50: 50;
    --z-index-auto: auto;
}

/* Reset Global */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: var(--font-family-sans);
    line-height: var(--line-height-normal);
    color: var(--color-gray-900);
    background: var(--color-gray-50);
    min-height: 100vh;
}

/* Container */
.container {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
}

/* Grid System */
.grid {
    display: grid;
    gap: var(--spacing-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (min-width: 640px) {
    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .sm\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
    .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

/* Flexbox Utilities */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.gap-2 { gap: var(--spacing-2); }
.gap-4 { gap: var(--spacing-4); }
.gap-6 { gap: var(--spacing-6); }

/* Espaçamento */
.m-0 { margin: 0; }
.m-4 { margin: var(--spacing-4); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-8 { margin-top: var(--spacing-8); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-8 { margin-bottom: var(--spacing-8); }
.p-0 { padding: 0; }
.p-4 { padding: var(--spacing-4); }
.p-8 { padding: var(--spacing-8); }
.py-4 { padding-top: var(--spacing-4); padding-bottom: var(--spacing-4); }
.px-4 { padding-left: var(--spacing-4); padding-right: var(--spacing-4); }

/* Tipografia */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-4xl { font-size: var(--font-size-4xl); }

.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: var(--color-primary-600); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }
.text-gray-500 { color: var(--color-gray-500); }
.text-gray-700 { color: var(--color-gray-700); }

/* Componentes */
.card {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    box-shadow: var(--shadow);
    border: 1px solid var(--color-gray-200);
    transition: all var(--transition-duration-300) var(--ease-in-out);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card-header {
    margin-bottom: var(--spacing-4);
    padding-bottom: var(--spacing-3);
    border-bottom: 2px solid var(--color-primary-100);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-6);
    border-radius: var(--border-radius);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-none);
    cursor: pointer;
    transition: all var(--transition-duration-200) var(--ease-in-out);
    border: 2px solid transparent;
    text-decoration: none;
    user-select: none;
}

.btn-primary {
    background: var(--color-primary-600);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-secondary {
    background: var(--color-gray-100);
    color: var(--color-gray-800);
    border-color: var(--color-gray-300);
}

.btn-secondary:hover {
    background: var(--color-gray-200);
    border-color: var(--color-gray-400);
}

.btn-outline {
    background: transparent;
    border-color: var(--color-primary-600);
    color: var(--color-primary-600);
}

.btn-outline:hover {
    background: var(--color-primary-50);
}

/* Formulários */
.form-group {
    margin-bottom: var(--spacing-4);
}

label {
    display: block;
    margin-bottom: var(--spacing-2);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-700);
}

input,
select,
textarea {
    width: 100%;
    padding: var(--spacing-3);
    border: 2px solid var(--color-gray-300);
    border-radius: var(--border-radius);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-base);
    transition: all var(--transition-duration-200) var(--ease-in-out);
    background: white;
    color: var(--color-gray-900);
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Alertas */
.alert {
    padding: var(--spacing-4);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-4);
    border-left: 4px solid;
}

.alert-success {
    background: #d1fae5;
    border-color: var(--color-success);
    color: #065f46;
}

.alert-warning {
    background: #fef3c7;
    border-color: var(--color-warning);
    color: #92400e;
}

.alert-danger {
    background: #fee2e2;
    border-color: var(--color-danger);
    color: #991b1b;
}

.alert-info {
    background: #dbeafe;
    border-color: var(--color-info);
    color: #1e40af;
}

/* Badges */
.badge {
    display: inline-block;
    padding: var(--spacing-1) var(--spacing-3);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge-primary {
    background: var(--color-primary-100);
    color: var(--color-primary-800);
}

.badge-success {
    background: #d1fae5;
    color: #065f46;
}

.badge-warning {
    background: #fef3c7;
    color: #92400e;
}

/* Animações */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
                transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-fade {
    animation: fadeIn var(--transition-duration-300) var(--ease-out);
}

.animate-slide {
    animation: slideIn var(--transition-duration-300) var(--ease-out);
}

.animate-pulse {
    animation: pulse 2s var(--ease-in-out) infinite;
}

/* Exemplo de Layout */
.demo-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.demo-header {
    background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
    color: white;
    padding: var(--spacing-8) 0;
}

.demo-main {
    flex: 1;
    padding: var(--spacing-8) 0;
}

.demo-footer {
    background: var(--color-gray-100);
    padding: var(--spacing-8) 0;
    border-top: 1px solid var(--color-gray-200);
}

/* Componente de Exemplo */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-6);
    margin: var(--spacing-8) 0;
}

.feature-item {
    text-align: center;
    padding: var(--spacing-6);
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow);
    transition: all var(--transition-duration-300) var(--ease-in-out);
}

.feature-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.feature-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto var(--spacing-4);
    background: var(--color-primary-100);
    border-radius: var(--border-radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-2xl);
    color: var(--color-primary-600);
}

/* Responsividade */
@media (max-width: 768px) {
    .container {
        padding: 0 var(--spacing-4);
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
    
    .grid-cols-2,
    .grid-cols-3,
    .grid-cols-4 {
        grid-template-columns: 1fr;
    }
}

/* Utilitários de Exibição */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    body {
        background: var(--color-gray-900);
        color: var(--color-gray-100);
    }
    
    .card {
        background: var(--color-gray-800);
        border-color: var(--color-gray-700);
    }
    
    input,
    select,
    textarea {
        background: var(--color-gray-800);
        border-color: var(--color-gray-700);
        color: var(--color-gray-100);
    }
    
    .alert-success {
        background: rgba(16, 185, 129, 0.1);
        color: #a7f3d0;
    }
    
    .alert-warning {
        background: rgba(245, 158, 11, 0.1);
        color: #fde68a;
    }
    
    .feature-item {
        background: var(--color-gray-800);
    }
}

/* Impressão */
@media print {
    .no-print {
        display: none;
    }
    
    body {
        background: white;
        color: black;
    }
}
`
        };
        
        if (examples[STATE.currentLanguage]) {
            ELEMENTS.codeEditor.value = examples[STATE.currentLanguage];
            STATE.code = examples[STATE.currentLanguage];
            this.updateStats();
            this.updateLineNumbers();
        }
    }
    
    updateInterface() {
        // Atualizar nome do arquivo
        const extensions = {
            javascript: 'js',
            python: 'py',
            lua: 'lua',
            html: 'html',
            css: 'css'
        };
        
        const ext = extensions[STATE.currentLanguage] || 'txt';
        const filename = `script.${ext}`;
        
        if (ELEMENTS.currentFile) ELEMENTS.currentFile.textContent = filename;
        if (ELEMENTS.filename) ELEMENTS.filename.textContent = filename;
        
        // Atualizar tema
        if (ELEMENTS.themeSelect) {
            ELEMENTS.themeSelect.value = STATE.currentTheme;
        }
    }
    
    updateStats() {
        const code = ELEMENTS.codeEditor.value;
        const lines = code.split('\n').length;
        const chars = code.length;
        
        if (ELEMENTS.lineCount) ELEMENTS.lineCount.textContent = lines;
        if (ELEMENTS.charCount) ELEMENTS.charCount.textContent = chars;
        
        // Atualizar status
        if (ELEMENTS.fileStatus) {
            const now = new Date();
            ELEMENTS.fileStatus.innerHTML = `
                <i class="fas fa-circle"></i>
                ${STATE.lastSave ? 'Salvo' : 'Não salvo'}
            `;
        }
    }
    
    updateLineNumbers() {
        const code = ELEMENTS.codeEditor.value;
        const lines = code.split('\n').length;
        
        let numbers = '';
        for (let i = 1; i <= lines; i++) {
            numbers += `<span>${i}</span>`;
        }
        
        if (ELEMENTS.lineNumbers) {
            ELEMENTS.lineNumbers.innerHTML = numbers;
        }
    }
    
    updateCursorPosition() {
        const textarea = ELEMENTS.codeEditor;
        const cursorPos = textarea.selectionStart;
        const text = textarea.value.substring(0, cursorPos);
        const lines = text.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        if (ELEMENTS.cursorPosition) {
            ELEMENTS.cursorPosition.textContent = `Ln ${line}, Col ${column}`;
        }
    }
    
    // ===== FUNÇÕES PRINCIPAIS =====
    
    changeLanguage(lang) {
        STATE.currentLanguage = lang;
        
        // Salvar código atual
        this.saveToStorage();
        
        // Atualizar interface
        this.updateInterface();
        
        // Atualizar botões
        ELEMENTS.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        if (ELEMENTS.languageSelect) {
            ELEMENTS.languageSelect.value = lang;
        }
        
        // Carregar código salvo para nova linguagem
        const savedCode = localStorage.getItem(`malklabs_code_${lang}`);
        if (savedCode) {
            ELEMENTS.codeEditor.value = savedCode;
            STATE.code = savedCode;
        } else {
            // Carregar exemplo
            this.loadInitialCode();
        }
        
        this.updateStats();
        this.updateLineNumbers();
        
        this.showToast(`Linguagem alterada para ${lang.toUpperCase()}`, 'info');
        this.saveSettings();
    }
    
    changeTheme(theme) {
        STATE.currentTheme = theme;
        document.body.className = `${theme}-theme`;
        this.saveSettings();
        this.showToast(`Tema ${theme} ativado`, 'info');
    }
    
    toggleSidebar(show = null) {
        const shouldShow = show !== null ? show : !STATE.isSidebarOpen;
        STATE.isSidebarOpen = shouldShow;
        
        if (ELEMENTS.sidebar) {
            ELEMENTS.sidebar.classList.toggle('active', shouldShow);
        }
        
        // Overlay para mobile
        if (window.innerWidth < 768) {
            if (shouldShow) {
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 199;
                `;
                overlay.addEventListener('click', () => this.toggleSidebar(false));
                document.body.appendChild(overlay);
            } else {
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            }
        }
    }
    
    switchTab(tabName) {
        // Atualizar tabs
        ELEMENTS.editorTabs?.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        ELEMENTS.mobileTabs?.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Mostrar pane correspondente
        ELEMENTS.tabPanes?.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-pane`);
        });
        
        // Ações específicas por tab
        if (tabName === 'preview') {
            if (STATE.currentLanguage === 'html' || STATE.currentLanguage === 'css') {
                setTimeout(() => this.executeCode(), 100);
            }
        }
    }
    
    async executeCode() {
        const code = ELEMENTS.codeEditor.value;
        
        if (!code.trim()) {
            this.showToast('Digite algum código primeiro!', 'warning');
            return;
        }
        
        // Limpar console se vazio
        if (ELEMENTS.consoleOutput.children.length === 2) { // Apenas as mensagens iniciais
            this.clearConsole();
        }
        
        this.addConsoleLine(`🚀 Executando ${STATE.currentLanguage.toUpperCase()}...`, 'info');
        
        try {
            switch(STATE.currentLanguage) {
                case 'html':
                    await this.executeHTML(code);
                    break;
                case 'css':
                    await this.executeCSS(code);
                    break;
                case 'javascript':
                    await this.executeJavaScript(code);
                    break;
                case 'python':
                    await this.executePython(code);
                    break;
                case 'lua':
                    await this.executeLua(code);
                    break;
                default:
                    throw new Error('Linguagem não suportada');
            }
            
            this.addConsoleLine('✅ Execução concluída com sucesso!', 'success');
            this.showToast('Código executado com sucesso!', 'success');
            
        } catch (error) {
            this.addConsoleLine(`❌ Erro: ${error.message}`, 'error');
            this.showToast('Erro na execução do código', 'error');
            console.error('Erro de execução:', error);
        }
    }
    
    async executeHTML(code) {
        return new Promise((resolve) => {
            const iframe = ELEMENTS.previewFrame;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            iframeDoc.open();
            iframeDoc.write(code);
            iframeDoc.close();
            
            // Executar scripts inline
            try {
                const scripts = iframeDoc.querySelectorAll('script');
                scripts.forEach(script => {
                    iframe.contentWindow.eval(script.textContent);
                });
            } catch (e) {
                this.addConsoleLine(`⚠️ Erro em script: ${e.message}`, 'warning');
            }
            
            resolve();
        });
    }
    
    async executeCSS(code) {
        return new Promise((resolve) => {
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${code}</style>
                </head>
                <body>
                    <div class="demo">
                        <h1>CSS Preview</h1>
                        <p>Este é um preview do seu CSS.</p>
                        <button class="btn">Botão estilizado</button>
                        <div class="card">Card com estilo</div>
                        <div class="alert alert-success">Mensagem de sucesso</div>
                    </div>
                </body>
                </html>
            `;
            
            const iframeDoc = ELEMENTS.previewFrame.contentDocument || ELEMENTS.previewFrame.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            
            resolve();
        });
    }
    
    async executeJavaScript(code) {
        return new Promise((resolve) => {
            // Interceptar console.log
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            console.log = (...args) => {
                this.addConsoleLine(args.join(' '), 'info');
                originalLog.apply(console, args);
            };
            
            console.error = (...args) => {
                this.addConsoleLine(args.join(' '), 'error');
                originalError.apply(console, args);
            };
            
            console.warn = (...args) => {
                this.addConsoleLine(args.join(' '), 'warning');
                originalWarn.apply(console, args);
            };
            
            console.info = (...args) => {
                this.addConsoleLine(args.join(' '), 'info');
                originalInfo.apply(console, args);
            };
            
            try {
                // Executar código
                const result = eval(code);
                
                // Se retornou algo, mostrar
                if (result !== undefined) {
                    this.addConsoleLine(`📦 Retorno: ${result}`, 'info');
                }
                
            } catch (error) {
                throw error;
            } finally {
                // Restaurar console original
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
                console.info = originalInfo;
            }
            
            resolve();
        });
    }
    
    async executePython(code) {
        // Simulação para demo
        // Em produção, integrar com Pyodide
        
        this.addConsoleLine('🐍 Executando Python (simulação)...', 'info');
        
        // Análise básica
        const lines = code.split('\n');
        let printCount = 0;
        let functionCount = 0;
        
        lines.forEach((line, i) => {
            if (line.includes('print(')) {
                printCount++;
                const match = line.match(/print\(['"](.*?)['"]\)/);
                if (match) {
                    this.addConsoleLine(match[1], 'info');
                }
            }
            
            if (line.includes('def ')) {
                functionCount++;
                const match = line.match(/def (\w+)/);
                if (match) {
                    this.addConsoleLine(`📦 Função definida: ${match[1]}()`, 'info');
                }
            }
            
            if (line.includes('# ')) {
                this.addConsoleLine(line.replace('# ', '💡 '), 'info');
            }
        });
        
        this.addConsoleLine(`📊 Estatísticas: ${printCount} prints, ${functionCount} funções`, 'info');
        this.addConsoleLine('💡 Em produção: Use Pyodide para Python real', 'warning');
        
        return Promise.resolve();
    }
    
    async executeLua(code) {
        // Simulação para demo
        // Em produção, integrar com Fengari
        
        this.addConsoleLine('🌙 Executando Lua (simulação)...', 'info');
        
        // Análise básica
        const lines = code.split('\n');
        let printCount = 0;
        let functionCount = 0;
        
        lines.forEach((line, i) => {
            if (line.includes('print(')) {
                printCount++;
                const match = line.match(/print\(['"](.*?)['"]\)/);
                if (match) {
                    this.addConsoleLine(match[1], 'info');
                }
            }
            
            if (line.includes('function ')) {
                functionCount++;
                const match = line.match(/function (\w+)/);
                if (match) {
                    this.addConsoleLine(`📦 Função definida: ${match[1]}()`, 'info');
                }
            }
            
            if (line.includes('-- ')) {
                this.addConsoleLine(line.replace('-- ', '💡 '), 'info');
            }
        });
        
        this.addConsoleLine(`📊 Estatísticas: ${printCount} prints, ${functionCount} funções`, 'info');
        this.addConsoleLine('💡 Em produção: Use Fengari para Lua real', 'warning');
        
        return Promise.resolve();
    }
    
    addConsoleLine(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        line.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="prompt">${type === 'info' ? '$' : type === 'error' ? '!' : '>'}</span>
            <span>${message}</span>
        `;
        
        if (ELEMENTS.consoleOutput) {
            ELEMENTS.consoleOutput.appendChild(line);
            ELEMENTS.consoleOutput.scrollTop = ELEMENTS.consoleOutput.scrollHeight;
            
            // Limitar histórico
            const lines = ELEMENTS.consoleOutput.querySelectorAll('.console-line');
            if (lines.length > CONFIG.MAX_CONSOLE_LINES) {
                lines[0].remove();
            }
        }
    }
    
    clearConsole() {
        if (ELEMENTS.consoleOutput) {
            ELEMENTS.consoleOutput.innerHTML = `
                <div class="console-line info">
                    <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                    <span class="prompt">$</span>
                    <span>Console limpo. Sistema MalkLabs pronto.</span>
                </div>
            `;
        }
    }
    
    executeConsoleCommand() {
        const command = ELEMENTS.consoleCommand?.value.trim();
        if (!command) return;
        
        this.addConsoleLine(`> ${command}`, 'info');
        ELEMENTS.consoleCommand.value = '';
        
        // Comandos do sistema
        const commands = {
            'clear': () => {
                this.clearConsole();
                return 'Console limpo.';
            },
            'help': () => {
                return 'Comandos: clear, theme [dark/light/matrix], lang [js/py/lua/html/css], run, save, export';
            },
            'theme': (arg) => {
                if (['dark', 'light', 'matrix'].includes(arg)) {
                    this.changeTheme(arg);
                    return `Tema alterado para ${arg}`;
                }
                return 'Tema inválido. Use: dark, light ou matrix';
            },
            'lang': (arg) => {
                if (['javascript', 'python', 'lua', 'html', 'css'].includes(arg)) {
                    this.changeLanguage(arg);
                    return `Linguagem alterada para ${arg}`;
                }
                return 'Linguagem inválida. Use: js, py, lua, html ou css';
            },
            'run': () => {
                this.executeCode();
                return 'Executando código...';
            },
            'save': () => {
                this.saveToFile();
                return 'Código salvo como arquivo.';
            },
            'export': () => {
                this.saveToFile();
                return 'Código exportado.';
            }
        };
        
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1];
        
        if (commands[cmd]) {
            const result = commands[cmd](arg);
            if (result) {
                this.addConsoleLine(result, 'info');
            }
        } else {
            this.addConsoleLine(`Comando não encontrado: ${cmd}`, 'error');
            this.addConsoleLine('Digite "help" para ver comandos disponíveis.', 'info');
        }
    }
    
    formatCode() {
        const code = ELEMENTS.codeEditor.value;
        let formatted = code;
        
        // Formatação básica
        switch(STATE.currentLanguage) {
            case 'javascript':
                formatted = this.formatJavaScript(code);
                break;
            case 'python':
                formatted = this.formatPython(code);
                break;
            case 'html':
                formatted = this.formatHTML(code);
                break;
            case 'css':
                formatted = this.formatCSS(code);
                break;
            case 'lua':
                formatted = this.formatLua(code);
                break;
        }
        
        ELEMENTS.codeEditor.value = formatted;
        STATE.code = formatted;
        this.updateStats();
        this.updateLineNumbers();
        
        this.showToast('Código formatado!', 'success');
    }
    
    formatJavaScript(code) {
        // Formatação básica de JavaScript
        return code
            .replace(/\s*{\s*/g, ' {\n')
            .replace(/;\s*/g, ';\n')
            .replace(/}\s*/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n')
            .split('\n')
            .map(line => {
                // Indentação básica
                let indent = 0;
                if (line.includes('}')) indent--;
                line = '    '.repeat(Math.max(0, indent)) + line.trim();
                if (line.includes('{')) indent++;
                return line;
            })
            .join('\n');
    }
    
    formatPython(code) {
        return code
            .replace(/:\s*/g, ':\n    ')
            .replace(/\b(def|class|if|elif|else|for|while|try|except|finally)\b/g, '\n$1')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }
    
    formatHTML(code) {
        return code
            .replace(/>\s+</g, '>\n<')
            .replace(/</g, '\n<')
            .replace(/>/g, '>\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }
    
    formatCSS(code) {
        return code
            .replace(/{/g, ' {\n')
            .replace(/}/g, '\n}\n\n')
            .replace(/;/g, ';\n')
            .split('\n')
            .map(line => '    ' + line.trim())
            .join('\n');
    }
    
    formatLua(code) {
        return code
            .replace(/\b(function|if|else|elseif|for|while|repeat)\b/g, '\n$1')
            .replace(/end\b/g, 'end\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }
    
    saveToFile() {
        const code = ELEMENTS.codeEditor.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const extensions = {
            javascript: 'js',
            python: 'py',
            lua: 'lua',
            html: 'html',
            css: 'css'
        };
        
        const ext = extensions[STATE.currentLanguage] || 'txt';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        a.href = url;
        a.download = `malklabs_${STATE.currentLanguage}_${timestamp}.${ext}`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        this.showToast('Código salvo como arquivo! 💾', 'success');
    }
    
    saveToStorage() {
        const code = ELEMENTS.codeEditor.value;
        STATE.code = code;
        STATE.lastSave = new Date();
        
        localStorage.setItem(`malklabs_code_${STATE.currentLanguage}`, code);
        this.saveSettings();
        
        // Atualizar status
        if (ELEMENTS.fileStatus) {
            ELEMENTS.fileStatus.innerHTML = `
                <i class="fas fa-circle" style="color: var(--secondary)"></i>
                Salvo
            `;
        }
    }
    
    handleCodeChange() {
        STATE.code = ELEMENTS.codeEditor.value;
        this.updateStats();
        this.updateLineNumbers();
        
        // Atualizar status
        if (ELEMENTS.fileStatus && STATE.lastSave) {
            const now = new Date();
            const diff = now - STATE.lastSave;
            const minutes = Math.floor(diff / 60000);
            
            if (minutes > 1) {
                ELEMENTS.fileStatus.innerHTML = `
                    <i class="fas fa-circle" style="color: var(--warning)"></i>
                    Não salvo (${minutes}m)
                `;
            }
        }
    }
    
    handleEditorKeydown(e) {
        // Tab para indentação
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const start = ELEMENTS.codeEditor.selectionStart;
            const end = ELEMENTS.codeEditor.selectionEnd;
            const value = ELEMENTS.codeEditor.value;
            
            // Se há seleção, indentar múltiplas linhas
            if (start !== end) {
                const lines = value.substring(start, end).split('\n');
                const indented = lines.map(line => '    ' + line).join('\n');
                
                ELEMENTS.codeEditor.value = value.substring(0, start) + indented + value.substring(end);
                ELEMENTS.codeEditor.selectionStart = start;
                ELEMENTS.codeEditor.selectionEnd = start + indented.length;
            } else {
                // Apenas inserir tab
                ELEMENTS.codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
                ELEMENTS.codeEditor.selectionStart = ELEMENTS.codeEditor.selectionEnd = start + 4;
            }
            
            this.handleCodeChange();
        }
        
        // Ctrl+Enter para executar
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.executeCode();
        }
        
        // Ctrl+S para salvar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveToStorage();
            this.showToast('Código salvo automaticamente!', 'success');
        }
    }
    
    handleGlobalShortcuts(e) {
        // Ctrl+Shift+S para salvar como arquivo
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            this.saveToFile();
        }
        
        // Ctrl+Shift+L para limpar console
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            this.clearConsole();
        }
        
        // Ctrl+Shift+P para preview
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            this.switchTab('preview');
        }
    }
    
    sendAiMessage() {
        const message = ELEMENTS.aiInput?.value.trim();
        if (!message) return;
        
        this.addAiMessage(message, 'user');
        ELEMENTS.aiInput.value = '';
        
        // Simular resposta da IA
        setTimeout(() => {
            const responses = [
                `Entendi sua pergunta sobre ${STATE.currentLanguage}. Posso te ajudar a otimizar esse código.`,
                `Analisando seu código... Recomendo verificar a sintaxe na linha que mencionou.`,
                `Baseado no padrão do seu código, sugiro usar uma abordagem mais eficiente.`,
                `Isso parece ser um problema comum. A solução típica envolve...`,
                `Excelente pergunta! Vou te explicar o conceito por trás disso.`
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addAiMessage(response, 'ai');
        }, 1000 + Math.random() * 2000);
    }
    
    addAiMessage(message, sender = 'ai') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender === 'user' ? 'user-message' : ''}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <strong>Você</strong>
                        <span class="message-time">Agora</span>
                    </div>
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <strong>Nexus Assistant</strong>
                        <span class="message-time">Agora</span>
                    </div>
                    <p>${message}</p>
                </div>
            `;
        }
        
        if (ELEMENTS.aiChat) {
            ELEMENTS.aiChat.appendChild(messageDiv);
            ELEMENTS.aiChat.scrollTop = ELEMENTS.aiChat.scrollHeight;
        }
    }
    
    handleQuickAction(action) {
        const actions = {
            explain: 'Analisando e explicando o código...',
            optimize: 'Otimizando código para melhor performance...',
            debug: 'Procurando possíveis bugs e problemas...'
        };
        
        if (actions[action]) {
            this.addAiMessage(actions[action], 'ai');
            
            // Simular resposta detalhada
            setTimeout(() => {
                const explanations = {
                    explain: `Seu código em ${STATE.currentLanguage} está bem estruturado. Posso identificar funções principais e seu fluxo lógico.`,
                    optimize: `Sugestões de otimização: 1) Cache de variáveis repetidas, 2) Use métodos nativos quando possível, 3) Evite loops aninhados desnecessários.`,
                    debug: `Pontos para verificar: 1) Verifique tipos de dados, 2) Valide entradas, 3) Trate exceções, 4) Use console.log para debug.`
                };
                
                this.addAiMessage(explanations[action], 'ai');
            }, 1500);
        }
    }
    
    showFeedbackModal() {
        if (ELEMENTS.feedbackModal) {
            ELEMENTS.feedbackModal.classList.add('active');
        }
    }
    
    hideFeedbackModal() {
        if (ELEMENTS.feedbackModal) {
            ELEMENTS.feedbackModal.classList.remove('active');
            // Limpar formulário
            if (ELEMENTS.feedbackMessage) ELEMENTS.feedbackMessage.value = '';
            if (ELEMENTS.feedbackEmail) ELEMENTS.feedbackEmail.value = '';
        }
    }
    
    async submitFeedback() {
        const type = ELEMENTS.feedbackType?.value || 'suggestion';
        const message = ELEMENTS.feedbackMessage?.value.trim();
        const email = ELEMENTS.feedbackEmail?.value.trim();
        const includeCode = ELEMENTS.includeCode?.checked || false;
        
        if (!message) {
            this.showToast('Digite sua mensagem primeiro!', 'warning');
            return;
        }
        
        // Preparar dados para webhook
        const feedbackData = {
            type: type,
            message: message,
            email: email || 'Não informado',
            includeCode: includeCode,
            language: STATE.currentLanguage,
            code: includeCode ? ELEMENTS.codeEditor.value.substring(0, 1000) : null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            appVersion: CONFIG.VERSION
        };
        
        try {
            // Enviar para webhook do Discord
            await sendToDiscordWebhook(feedbackData);
            
            this.showToast('Feedback enviado com sucesso! 🎉', 'success');
            this.hideFeedbackModal();
            
            // Log no console
            this.addConsoleLine('📤 Feedback enviado para o Discord', 'info');
            
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
            this.showToast('Erro ao enviar feedback. Tente novamente.', 'error');
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        if (ELEMENTS.toastContainer) {
            ELEMENTS.toastContainer.appendChild(toast);
            
            // Remover após 5 segundos
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== DISCORD WEBHOOK INTEGRATION =====
async function sendToDiscordWebhook(feedbackData) {
    if (!CONFIG.WEBHOOK_URL || CONFIG.WEBHOOK_URL.includes('SEU_WEBHOOK_AQUI')) {
        console.warn('Webhook do Discord não configurado');
        return Promise.resolve(); // Simular sucesso para desenvolvimento
    }
    
    const embed = {
        title: "📬 Novo Feedback - MalkLabs",
        color: getColorByType(feedbackData.type),
        fields: [
            {
                name: "📋 Tipo",
                value: getTypeEmoji(feedbackData.type) + " " + getTypeName(feedbackData.type),
                inline: true
            },
            {
                name: "👨‍💻 Desenvolvedor",
                value: feedbackData.email,
                inline: true
            },
            {
                name: "💻 Linguagem",
                value: feedbackData.language.toUpperCase(),
                inline: true
            },
            {
                name: "📝 Mensagem",
                value: feedbackData.message.length > 1000 
                    ? feedbackData.message.substring(0, 1000) + "..."
                    : feedbackData.message
            }
        ],
        footer: {
            text: `MalkLabs v${CONFIG.VERSION} • ${CONFIG.DEV_NAME} - ${CONFIG.DEV_ALIAS}`
        },
        timestamp: feedbackData.timestamp
    };
    
    // Adicionar código se solicitado
    if (feedbackData.includeCode && feedbackData.code) {
        embed.fields.push({
            name: "💾 Código (trecho)",
            value: `\`\`\`${feedbackData.language}\n${feedbackData.code}\n\`\`\``
        });
    }
    
    // Adicionar informações técnicas
    embed.fields.push({
        name: "🔧 Informações Técnicas",
        value: `User-Agent: ${feedbackData.userAgent.substring(0, 100)}...`,
        inline: false
    });
    
    const payload = {
        username: "MalkLabs Feedback",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        embeds: [embed]
    };
    
    try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        console.log('Feedback enviado para Discord com sucesso!');
        return true;
        
    } catch (error) {
        console.error('Erro ao enviar para Discord:', error);
        throw error;
    }
}

function getColorByType(type) {
    const colors = {
        suggestion: 0x6366f1, // Roxo
        bug: 0xef4444,        // Vermelho
        feature: 0x10b981,    // Verde
        compliment: 0xf59e0b, // Laranja
        other: 0x64748b       // Cinza
    };
    return colors[type] || 0x6366f1;
}

function getTypeEmoji(type) {
    const emojis = {
        suggestion: '💡',
        bug: '🐛',
        feature: '✨',
        compliment: '🌟',
        other: '📝'
    };
    return emojis[type] || '📝';
}

function getTypeName(type) {
    const names = {
        suggestion: 'Sugestão',
        bug: 'Reportar Bug',
        feature: 'Pedir Feature',
        compliment: 'Elogio',
        other: 'Outro'
    };
    return names[type] || 'Feedback';
}

// ===== INICIALIZAR APLICAÇÃO =====
// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância do MalkLabs
    window.malkLabs = new MalkLabs();
    
    // Expor funções globais
    window.MalkLabs = {
        executeCode: () => window.malkLabs.executeCode(),
        saveCode: () => window.malkLabs.saveToFile(),
        formatCode: () => window.malkLabs.formatCode(),
        showFeedback: () => window.malkLabs.showFeedbackModal()
    };
    
    // Adicionar créditos ao console
    console.log(`%c🚀 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`, 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log(`%c👨‍💻 Desenvolvido por ${CONFIG.DEV_NAME} - ${CONFIG.DEV_ALIAS}`, 'font-size: 16px; color: #10b981;');
    console.log(`%c📧 Envie feedback pelo botão na sidebar!`, 'font-size: 14px; color: #f59e0b;');
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
            console.log('Falha ao registrar Service Worker:', error);
        });
}

// Manifest.json para PWA
const manifest = {
    "name": "MalkLabs",
    "short_name": "MalkLabs",
    "description": "Laboratório de código multi-linguagem",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0f172a",
    "theme_color": "#6366f1",
    "icons": [
        {
            "src": "icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
};

// Service Worker básico
const serviceWorkerCode = `
self.addEventListener('install', event => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativado');
});

self.addEventListener('fetch', event => {
    // Pode adicionar cache strategies aqui
});
`;
