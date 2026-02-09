// CodeNexus - App Principal (Versão Simplificada)

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos principais
    const loadingScreen = document.getElementById('loading');
    const mainApp = document.getElementById('main-app');
    const codeInput = document.getElementById('code-input');
    const outputContent = document.getElementById('output-content');
    const previewFrame = document.getElementById('preview-frame');
    
    // Estado
    let currentLanguage = 'python';
    let currentTheme = 'dark';
    
    // ======================
    // 1. SIMULAR CARREGAMENTO
    // ======================
    console.log('🚀 Iniciando CodeNexus...');
    
    // Atualizar texto de carregamento
    const loadingText = document.getElementById('loading-text');
    const steps = [
        'Carregando interface...',
        'Inicializando editor...',
        'Preparando ambiente...',
        'Quase lá...',
        'Pronto! 🎉'
    ];
    
    let step = 0;
    const loadingInterval = setInterval(() => {
        if (step < steps.length) {
            loadingText.textContent = steps[step];
            step++;
        } else {
            clearInterval(loadingInterval);
            
            // Terminar carregamento
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainApp.style.display = 'flex';
                    
                    // Inicializar app
                    initApp();
                    showToast('CodeNexus carregado com sucesso!', 'success');
                }, 500);
            }, 500);
        }
    }, 400);
    
    // ======================
    // 2. INICIALIZAR APP
    // ======================
    function initApp() {
        console.log('📱 App inicializado!');
        
        // Carregar exemplo inicial
        loadExample();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Atualizar contadores
        updateCounters();
    }
    
    // ======================
    // 3. EXEMPLOS DE CÓDIGO
    // ======================
    function loadExample() {
        const examples = {
            python: `# CodeNexus - Python Example
print("🚀 Bem-vindo ao CodeNexus!")
print("==========================")

# Calculadora simples
def calculadora():
    print("\\n🧮 CALCULADORA")
    print("=" * 20)
    
    num1 = float(input("Digite o primeiro número: "))
    num2 = float(input("Digite o segundo número: "))
    
    print(f"\\n{num1} + {num2} = {num1 + num2}")
    print(f"{num1} - {num2} = {num1 - num2}")
    print(f"{num1} * {num2} = {num1 * num2}")
    
    if num2 != 0:
        print(f"{num1} / {num2} = {num1 / num2:.2f}")
    else:
        print("Divisão por zero não permitida!")

# List comprehension
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pares = [n for n in numeros if n % 2 == 0]
quadrados = [n**2 for n in numeros]

print(f"\\n📊 Lista original: {numeros}")
print(f"Números pares: {pares}")
print(f"Quadrados: {quadrados}")

# Dicionário
aluno = {
    "nome": "Maria Silva",
    "idade": 22,
    "curso": "Ciência da Computação",
    "notas": [8.5, 9.0, 7.5, 10.0]
}

print(f"\\n📚 Dados do Aluno:")
for chave, valor in aluno.items():
    if chave === "notas":
        media = sum(valor) / len(valor)
        print(f"{chave}: {valor} (Média: {media:.1f})")
    else:
        print(f"{chave}: {valor}")

# Executar calculadora (comentado para não bloquear)
# calculadora()

print("\\n✅ Programa Python executado com sucesso!")`,

            lua: `-- CodeNexus - Lua Example
print("🚀 Bem-vindo ao CodeNexus!")
print("==========================")

-- Função de saudação
function saudar(nome)
    return "Olá, " .. nome .. "!"
end

-- Tabela (array)
local frutas = {"maçã", "banana", "laranja", "uva", "morango"}

print("\\n🍎 Lista de Frutas:")
for i, fruta in ipairs(frutas) do
    print(i .. ". " .. fruta)
end

-- Tabela (dicionário)
local pessoa = {
    nome = "Carlos",
    idade = 25,
    profissao = "Desenvolvedor",
    habilidades = {"Lua", "JavaScript", "Python"}
}

print("\\n👤 Dados da Pessoa:")
print("Nome: " .. pessoa.nome)
print("Idade: " .. pessoa.idade)
print("Profissão: " .. pessoa.profissao)
print("Habilidades: " .. table.concat(pessoa.habilidades, ", "))

-- Função matemática
function fibonacci(n)
    if n <= 1 then return n end
    local a, b = 0, 1
    for i = 2, n do
        a, b = b, a + b
    end
    return b
end

print("\\n🔢 Sequência de Fibonacci:")
for i = 1, 10 do
    io.write(fibonacci(i) .. " ")
end
print()

-- Jogo simples de adivinhação
print("\\n🎮 JOGO DE ADIVINHAÇÃO")
print("Tente adivinhar o número entre 1 e 10")
print("(Dica: é o número 7)")

-- Calculadora básica
function calcular(operacao, a, b)
    local operacoes = {
        ["+"] = function(x, y) return x + y end,
        ["-"] = function(x, y) return x - y end,
        ["*"] = function(x, y) return x * y end,
        ["/"] = function(x, y) return x / y end
    }
    
    if operacoes[operacao] then
        return operacoes[operacao](a, b)
    else
        return "Operação inválida"
    end
end

print("\\n🧮 Exemplos de cálculo:")
print("10 + 5 = " .. calcular("+", 10, 5))
print("10 * 5 = " .. calcular("*", 10, 5))
print("10 / 2 = " .. calcular("/", 10, 2))

print("\\n✅ Programa Lua executado com sucesso!")`,

            javascript: `// CodeNexus - JavaScript Example
console.log("🚀 Bem-vindo ao CodeNexus!");
console.log("==========================");

// Funções modernas
const saudacao = (nome) => \`Olá, \${nome}!\`;

// Array methods
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pares = numeros.filter(n => n % 2 === 0);
const quadrados = numeros.map(n => n * n);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log("\\n📊 Arrays em JavaScript:");
console.log(\`Original: \${numeros}\`);
console.log(\`Pares: \${pares}\`);
console.log(\`Quadrados: \${quadrados}\`);
console.log(\`Soma total: \${soma}\`);

// Objeto com métodos
const calculadora = {
    historico: [],
    
    somar(a, b) {
        const resultado = a + b;
        this.historico.push(\`\${a} + \${b} = \${resultado}\`);
        return resultado;
    },
    
    multiplicar(a, b) {
        const resultado = a * b;
        this.historico.push(\`\${a} × \${b} = \${resultado}\`);
        return resultado;
    },
    
    mostrarHistorico() {
        console.log("\\n📋 Histórico da Calculadora:");
        this.historico.forEach((op, i) => {
            console.log(\`\${i + 1}. \${op}\`);
        });
    }
};

// Usando a calculadora
console.log("\\n🧮 Calculadora:");
console.log(\`10 + 5 = \${calculadora.somar(10, 5)}\`);
console.log(\`10 × 3 = \${calculadora.multiplicar(10, 3)}\`);
calculadora.mostrarHistorico();

// Manipulação DOM simulada
console.log("\\n🎯 Simulação DOM:");
const elementos = [
    { id: "titulo", texto: "CodeNexus Rocks!" },
    { id: "subtitulo", texto: "Laboratório de Programação" },
    { id: "botao", texto: "Clique Aqui" }
];

elementos.forEach(elemento => {
    console.log(\`Criando elemento: #\${elemento.id} com texto "\${elemento.texto}"\`);
});

// Fetch API simulada
console.log("\\n🌐 Simulação Fetch API:");
const usuarios = [
    { id: 1, nome: "Ana", idade: 25 },
    { id: 2, nome: "Bruno", idade: 30 },
    { id: 3, nome: "Carla", idade: 22 }
];

console.log("Dados recebidos do servidor:");
usuarios.forEach(usuario => {
    console.log(\`- \${usuario.nome} (\${usuario.idade} anos)\`);
});

// Event handling
console.log("\\n🎮 Event Handling:");
const eventos = ["click", "keypress", "mouseover", "submit"];
eventos.forEach(evento => {
    console.log(\`Configurando listener para: \${evento}\`);
});

console.log("\\n✅ Programa JavaScript executado com sucesso!");`,

            html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeNexus Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        header {
            background: linear-gradient(135deg, #6366f1, #10b981);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        
        .tagline {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        main {
            padding: 2rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .feature {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s;
            border: 2px solid transparent;
        }
        
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-color: #6366f1;
        }
        
        .feature i {
            font-size: 2.5rem;
            color: #6366f1;
            margin-bottom: 1rem;
        }
        
        .demo-area {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 2rem;
        }
        
        button {
            padding: 0.75rem 1.5rem;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-right: 0.5rem;
            margin-top: 1rem;
        }
        
        button:hover {
            background: #4f46e5;
            transform: translateY(-2px);
        }
        
        .result {
            background: #d1fae5;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            border-left: 4px solid #10b981;
            display: none;
        }
        
        footer {
            text-align: center;
            padding: 1.5rem;
            background: #f8fafc;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>
                <i class="fas fa-code"></i>
                CodeNexus
            </h1>
            <p class="tagline">Laboratório Multi-Linguagem Profissional</p>
        </header>
        
        <main>
            <h2>✨ Recursos Incríveis</h2>
            <p>Desenvolva, teste e execute código em múltiplas linguagens!</p>
            
            <div class="features">
                <div class="feature">
                    <i class="fas fa-code"></i>
                    <h3>5 Linguagens</h3>
                    <p>HTML, CSS, JS, Python, Lua</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-play-circle"></i>
                    <h3>Execução Real</h3>
                    <p>Execute código direto no navegador</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-robot"></i>
                    <h3>AI Assistant</h3>
                    <p>Assistente inteligente integrado</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-bolt"></i>
                    <h3>Rápido</h3>
                    <p>Carregamento instantâneo</p>
                </div>
            </div>
            
            <div class="demo-area">
                <h3>💻 Demonstração Interativa</h3>
                <p>Teste as funcionalidades abaixo:</p>
                
                <button onclick="mostrarMensagem()">
                    <i class="fas fa-play"></i> Mostrar Mensagem
                </button>
                
                <button onclick="mudarCor()">
                    <i class="fas fa-palette"></i> Mudar Cor
                </button>
                
                <button onclick="calcular()">
                    <i class="fas fa-calculator"></i> Calcular
                </button>
                
                <div id="result" class="result"></div>
            </div>
        </main>
        
        <footer>
            <p>© 2024 CodeNexus | Desenvolvido com ❤️ para programadores</p>
        </footer>
    </div>
    
    <script>
        function mostrarMensagem() {
            const result = document.getElementById('result');
            result.innerHTML = '<strong>🎉 Funcionando!</strong><br>O CodeNexus está executando JavaScript no navegador.';
            result.style.display = 'block';
        }
        
        function mudarCor() {
            const buttons = document.querySelectorAll('button');
            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            buttons.forEach(btn => {
                btn.style.background = randomColor;
            });
            
            const result = document.getElementById('result');
            result.innerHTML = \`<strong>🎨 Cor alterada!</strong><br>Todos os botões mudaram para: \${randomColor}\`;
            result.style.display = 'block';
        }
        
        function calcular() {
            const a = Math.floor(Math.random() * 100);
            const b = Math.floor(Math.random() * 100);
            const operacoes = ['+', '-', '*', '/'];
            const op = operacoes[Math.floor(Math.random() * operacoes.length)];
            
            let resultado;
            switch(op) {
                case '+': resultado = a + b; break;
                case '-': resultado = a - b; break;
                case '*': resultado = a * b; break;
                case '/': resultado = b !== 0 ? (a / b).toFixed(2) : 'Erro: divisão por zero'; break;
            }
            
            const result = document.getElementById('result');
            result.innerHTML = \`<strong>🧮 Cálculo:</strong><br>\${a} \${op} \${b} = \${resultado}\`;
            result.style.display = 'block';
        }
        
        console.log('CodeNexus Demo carregado! 🚀');
    </script>
</body>
</html>`,

            css: `/* CodeNexus - CSS Example */
/* Design System Moderno */

:root {
    /* Cores principais */
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #10b981;
    --accent: #f59e0b;
    
    /* Tons de cinza */
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e1;
    --gray-400: #94a3b8;
    --gray-500: #64748b;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1e293b;
    --gray-900: #0f172a;
    
    /* Espaçamento */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    
    /* Bordas */
    --radius-sm: 0.25rem;
    --radius: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.6;
    color: var(--gray-900);
    background: var(--gray-50);
    padding: var(--space-6);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Tipografia */
h1, h2, h3, h4 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--space-4);
}

h1 {
    font-size: 2.5rem;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

h2 {
    font-size: 1.875rem;
    color: var(--gray-800);
}

h3 {
    font-size: 1.5rem;
    color: var(--gray-700);
}

p {
    margin-bottom: var(--space-4);
    color: var(--gray-600);
}

/* Cards */
.card {
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow);
    border: 1px solid var(--gray-200);
    transition: all 0.3s ease;
    margin-bottom: var(--space-6);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card-header {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 2px solid var(--primary);
}

/* Botões */
.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-size: 0.875rem;
}

.btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.btn-secondary {
    background: var(--gray-200);
    color: var(--gray-800);
}

.btn-secondary:hover {
    background: var(--gray-300);
}

.btn-success {
    background: var(--secondary);
}

.btn-success:hover {
    background: #0da271;
}

/* Grid */
.grid {
    display: grid;
    gap: var(--space-6);
    margin: var(--space-8) 0;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

@media (min-width: 768px) {
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

/* Badges */
.badge {
    display: inline-block;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge-primary {
    background: var(--primary);
    color: white;
}

.badge-secondary {
    background: var(--secondary);
    color: white;
}

.badge-accent {
    background: var(--accent);
    color: white;
}

/* Alertas */
.alert {
    padding: var(--space-4);
    border-radius: var(--radius);
    margin-bottom: var(--space-4);
    border-left: 4px solid;
}

.alert-success {
    background: #d1fae5;
    border-color: var(--secondary);
    color: #065f46;
}

.alert-warning {
    background: #fef3c7;
    border-color: var(--accent);
    color: #92400e;
}

.alert-info {
    background: #dbeafe;
    border-color: var(--primary);
    color: #1e40af;
}

/* Formulários */
.form-group {
    margin-bottom: var(--space-4);
}

label {
    display: block;
    margin-bottom: var(--space-2);
    font-weight: 500;
    color: var(--gray-700);
}

input, select, textarea {
    width: 100%;
    padding: var(--space-3);
    border: 2px solid var(--gray-300);
    border-radius: var(--radius);
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
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

.animate-fade {
    animation: fadeIn 0.5s ease-out;
}

.animate-slide {
    animation: slideIn 0.3s ease-out;
}

/* Utilitários */
.text-center { text-align: center; }
.mt-4 { margin-top: var(--space-4); }
.mt-8 { margin-top: var(--space-8); }
.mb-4 { margin-bottom: var(--space-4); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }

/* Exemplo de componentes */
.demo-component {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    text-align: center;
    margin: var(--space-8) 0;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin: var(--space-8) 0;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    display: block;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Responsividade */
@media (max-width: 768px) {
    .grid-cols-2,
    .grid-cols-3 {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.5rem;
    }
}

/* Dark mode opcional */
@media (prefers-color-scheme: dark) {
    body {
        background: var(--gray-900);
        color: var(--gray-100);
    }
    
    .card {
        background: var(--gray-800);
        border-color: var(--gray-700);
    }
    
    h2, h3 {
        color: var(--gray-100);
    }
    
    p {
        color: var(--gray-300);
    }
}`
        };
        
        codeInput.value = examples[currentLanguage];
        updateCounters();
    }
    
    // ======================
    // 4. SETUP EVENT LISTENERS
    // ======================
    function setupEventListeners() {
        // Botões de linguagem
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos
                document.querySelectorAll('.lang-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Ativar este
                this.classList.add('active');
                
                // Mudar linguagem
                currentLanguage = this.dataset.lang;
                updateLanguageDisplay();
                loadExample();
            });
        });
        
        // Botão Executar
        document.getElementById('run-btn').addEventListener('click', executeCode);
        
        // Botão Limpar
        document.getElementById('clear-btn').addEventListener('click', function() {
            if (confirm('Tem certeza que deseja limpar o código?')) {
                codeInput.value = '';
                updateCounters();
                showToast('Código limpo!', 'info');
            }
        });
        
        // Botão Salvar
        document.getElementById('save-btn').addEventListener('click', saveCode);
        
        // Botão Formatar
        document.getElementById('format-btn').addEventListener('click', formatCode);
        
        // Botões de tema
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.theme-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                currentTheme = this.dataset.theme;
                document.body.className = currentTheme + '-theme';
                showToast(`Tema ${currentTheme} ativado`, 'info');
            });
        });
        
        // Botão Console
        document.getElementById('console-btn').addEventListener('click', function() {
            switchTab('output');
        });
        
        // Botão Tela Cheia
        document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
        
        // Botão Contato
        document.getElementById('contact-btn').addEventListener('click', function() {
            document.getElementById('contact-modal').classList.add('active');
        });
        
        // Botão Ajuda
        document.getElementById('help-btn').addEventListener('click', function() {
            showToast('📚 Ajuda: Pressione Ctrl+Enter para executar o código', 'info');
        });
        
        // Tabs do editor
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.editor-tab').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                
                const tabName = this.dataset.tab;
                switchTab(tabName);
            });
        });
        
        // Limpar output
        document.getElementById('clear-output').addEventListener('click', function() {
            outputContent.innerHTML = '';
            addOutput('Console limpo.', 'info');
        });
        
        // Fechar modal
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.getElementById('contact-modal').classList.remove('active');
        });
        
        // Copiar contato
        document.querySelectorAll('.copy-contact').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.dataset.copy;
                navigator.clipboard.writeText(text);
                showToast('Copiado para a área de transferência!', 'success');
            });
        });
        
        // Enviar feedback
        document.getElementById('submit-feedback').addEventListener('click', function() {
            const feedback = document.getElementById('feedback-text').value;
            if (feedback.trim()) {
                console.log('Feedback enviado:', feedback);
                document.getElementById('feedback-text').value = '';
                document.getElementById('contact-modal').classList.remove('active');
                showToast('Feedback enviado com sucesso! Obrigado! 🎉', 'success');
            } else {
                showToast('Digite seu feedback primeiro!', 'warning');
            }
        });
        
        // Fechar ajuda
        document.getElementById('close-help').addEventListener('click', function() {
            document.querySelector('.help-panel').style.display = 'none';
        });
        
        // Exemplos rápidos
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const example = this.dataset.example;
                loadQuickExample(example);
            });
        });
        
        // Atalhos de teclado
        document.addEventListener('keydown', function(e) {
            // Ctrl+Enter para executar
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                executeCode();
            }
            
            // Ctrl+S para salvar
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveCode();
            }
            
            // Ctrl+L para limpar console
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                outputContent.innerHTML = '';
                addOutput('Console limpo.', 'info');
            }
        });
        
        // Monitorar input do código
        codeInput.addEventListener('input', updateCounters);
    }
    
    // ======================
    // 5. FUNÇÕES PRINCIPAIS
    // ======================
    function updateLanguageDisplay() {
        const langDisplay = document.getElementById('lang-display');
        const currentExt = document.getElementById('current-ext');
        
        const languages = {
            python: { icon: 'fab fa-python', name: 'Python', ext: 'py' },
            lua: { icon: 'fas fa-code', name: 'Lua', ext: 'lua' },
            javascript: { icon: 'fab fa-js', name: 'JavaScript', ext: 'js' },
            html: { icon: 'fab fa-html5', name: 'HTML', ext: 'html' },
            css: { icon: 'fab fa-css3-alt', name: 'CSS', ext: 'css' }
        };
        
        const lang = languages[currentLanguage];
        langDisplay.innerHTML = `<i class="${lang.icon}"></i> ${lang.name}`;
        currentExt.textContent = lang.ext;
        document.getElementById('current-lang-name').textContent = lang.name;
    }
    
    function switchTab(tabName) {
        // Esconder todas as tabs
        document.getElementById('code-tab').classList.remove('active');
        document.getElementById('output-tab').classList.remove('active');
        document.getElementById('preview-tab').classList.remove('active');
        
        // Mostrar tab selecionada
        document.getElementById(tabName + '-tab').classList.add('active');
        
        // Se for preview e for HTML, executar
        if (tabName === 'preview' && currentLanguage === 'html') {
            executeCode();
        }
    }
    
    function executeCode() {
        const code = codeInput.value;
        
        if (!code.trim()) {
            showToast('Digite algum código primeiro!', 'warning');
            return;
        }
        
        // Limpar output anterior
        outputContent.innerHTML = '';
        addOutput(`Executando ${currentLanguage.toUpperCase()}...`, 'info');
        
        try {
            switch(currentLanguage) {
                case 'html':
                    executeHTML(code);
                    break;
                case 'css':
                    executeCSS(code);
                    break;
                case 'javascript':
                    executeJavaScript(code);
                    break;
                case 'python':
                    executePython(code);
                    break;
                case 'lua':
                    executeLua(code);
                    break;
            }
            
            showToast('Código executado com sucesso! ✅', 'success');
            
        } catch (error) {
            addOutput(`Erro: ${error.message}`, 'error');
            showToast('Erro na execução ❌', 'error');
        }
    }
    
    function executeHTML(code) {
        // Renderizar no iframe
        const iframe = previewFrame;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
        
        addOutput('HTML renderizado com sucesso!', 'success');
    }
    
    function executeCSS(code) {
        // Criar página de teste com o CSS
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
                </div>
            </body>
            </html>
        `;
        
        const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
        
        addOutput('CSS aplicado com sucesso!', 'success');
    }
    
    function executeJavaScript(code) {
        try {
            // Capturar console.log
            const originalLog = console.log;
            let output = '';
            
            console.log = function(...args) {
                output += args.join(' ') + '\n';
                originalLog.apply(console, args);
            };
            
            // Executar código
            const result = eval(code);
            
            // Restaurar console.log
            console.log = originalLog;
            
            // Mostrar output
            if (output) {
                output.split('\n').forEach(line => {
                    if (line.trim()) addOutput(line, 'info');
                });
            }
            
            if (result !== undefined) {
                addOutput(`Resultado: ${result}`, 'success');
            }
            
        } catch (error) {
            throw error;
        }
    }
    
    function executePython(code) {
        // Simulação de Python (em produção use Pyodide)
        const lines = code.split('\n');
        let output = '';
        
        lines.forEach(line => {
            if (line.includes('print(')) {
                const match = line.match(/print\(['"](.*?)['"]\)/);
                if (match) {
                    output += match[1] + '\n';
                }
            }
            
            if (line.includes('# ')) {
                output += line.replace('# ', '') + '\n';
            }
        });
        
        if (output) {
            output.split('\n').forEach(line => {
                if (line.trim()) addOutput(line, 'info');
            });
        }
        
        addOutput('Python executado (simulado)', 'warning');
        addOutput('Em produção: Python real com Pyodide', 'info');
    }
    
    function executeLua(code) {
        // Simulação de Lua (em produção use Fengari)
        const lines = code.split('\n');
        let output = '';
        
        lines.forEach(line => {
            if (line.includes('print(')) {
                const match = line.match(/print\(['"](.*?)['"]\)/);
                if (match) {
                    output += match[1] + '\n';
                }
            }
            
            if (line.includes('-- ')) {
                output += line.replace('-- ', '') + '\n';
            }
        });
        
        if (output) {
            output.split('\n').forEach(line => {
                if (line.trim()) addOutput(line, 'info');
            });
        }
        
        addOutput('Lua executado (simulado)', 'warning');
        addOutput('Em produção: Lua real com Fengari', 'info');
    }
    
    function addOutput(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        
        const prompt = type === 'info' ? '$' : '!';
        line.innerHTML = `<span class="prompt">${prompt}</span> ${message}`;
        
        outputContent.appendChild(line);
        outputContent.scrollTop = outputContent.scrollHeight;
    }
    
    function updateCounters() {
        const code = codeInput.value;
        const lines = code.split('\n').length;
        const chars = code.length;
        
        document.getElementById('line-count').textContent = lines;
        document.getElementById('char-count').textContent = chars;
    }
    
    function saveCode() {
        const code = codeInput.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const ext = currentLanguage === 'python' ? 'py' :
                   currentLanguage === 'lua' ? 'lua' :
                   currentLanguage === 'javascript' ? 'js' :
                   currentLanguage === 'html' ? 'html' : 'css';
        
        a.href = url;
        a.download = `codigo_${currentLanguage}_${Date.now()}.${ext}`;
        a.click();
        
        URL.revokeObjectURL(url);
        showToast('Código salvo com sucesso! 💾', 'success');
    }
    
    function formatCode() {
        const code = codeInput.value;
        let formatted = code;
        
        // Formatação básica
        switch(currentLanguage) {
            case 'python':
                formatted = code.replace(/:\s*/g, ':\n    ');
                break;
            case 'javascript':
                formatted = code.replace(/{/g, '{\n').replace(/}/g, '\n}');
                break;
            case 'html':
                formatted = code.replace(/>\s+</g, '>\n<');
                break;
        }
        
        codeInput.value = formatted;
        updateCounters();
        showToast('Código formatado! ✨', 'success');
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                showToast(`Erro ao entrar em tela cheia: ${err.message}`, 'error');
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    function loadQuickExample(example) {
        const examples = {
            hello: {
                python: 'print("Olá, Mundo!")',
                lua: 'print("Olá, Mundo!")',
                javascript: 'console.log("Olá, Mundo!")',
                html: '<h1>Olá, Mundo!</h1>',
                css: 'h1 { color: blue; }'
            },
            calc: {
                python: 'print(f"2 + 2 = {2 + 2}")',
                lua: 'print("2 + 2 = " .. (2 + 2))',
                javascript: 'console.log(`2 + 2 = ${2 + 2}`)',
                html: '<p>2 + 2 = 4</p>',
                css: 'p { font-size: 20px; color: green; }'
            },
            loop: {
                python: 'for i in range(1, 6):\n    print(f"Número: {i}")',
                lua: 'for i = 1, 5 do\n    print("Número: " .. i)\nend',
                javascript: 'for(let i = 1; i <= 5; i++) {\n    console.log(`Número: ${i}`);\n}',
                html: '<ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n</ul>',
                css: 'li { margin: 10px; padding: 5px; }'
            }
        };
        
        if (examples[example] && examples[example][currentLanguage]) {
            codeInput.value = examples[example][currentLanguage];
            updateCounters();
            showToast(`Exemplo "${example}" carregado!`, 'info');
        }
    }
    
    function showToast(message, type = 'info') {
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
        
        document.getElementById('toast-container').appendChild(toast);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Inicializar display da linguagem
    updateLanguageDisplay();
});
