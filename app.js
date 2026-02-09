// CodeNexus - Laboratório Multi-Linguagem
// Executa Python e Lua no navegador!

document.addEventListener('DOMContentLoaded', async function() {
    // Configurações
    const config = {
        currentLanguage: 'python',
        theme: 'dark',
        fontSize: 14,
        tabSize: 4,
        autoSave: true,
        autoRun: false
    };

    // Estado da aplicação
    const state = {
        editor: null,
        pyodide: null,
        fengari: null,
        isPyodideLoaded: false,
        isFengariLoaded: false,
        consoleHistory: [],
        errors: [],
        isAssistantOpen: true
    };

    // Elementos DOM
    const elements = {
        // Containers
        loading: document.getElementById('loading'),
        monacoContainer: document.getElementById('monaco-container'),
        
        // Botões de linguagem
        langButtons: document.querySelectorAll('.lang-btn'),
        
        // Botões de controle
        runCode: document.getElementById('run-code'),
        formatCode: document.getElementById('format-code'),
        clearCode: document.getElementById('clear-code'),
        saveCode: document.getElementById('save-code'),
        
        // Botões AI
        explainCode: document.getElementById('explain-code'),
        optimizeCode: document.getElementById('optimize-code'),
        debugCode: document.getElementById('debug-code'),
        
        // View tabs
        viewButtons: document.querySelectorAll('.view-btn'),
        tabs: document.querySelectorAll('.tab'),
        
        // Theme
        themeButtons: document.querySelectorAll('.theme-btn'),
        
        // Console
        consoleToggle: document.getElementById('console-toggle'),
        consoleContent: document.getElementById('console-content'),
        clearConsole: document.getElementById('clear-console'),
        copyOutput: document.getElementById('copy-output'),
        consoleInput: document.getElementById('console-input'),
        
        // Errors
        errorsToggle: document.getElementById('errors-toggle'),
        errorPanel: document.getElementById('error-panel'),
        errorList: document.getElementById('error-list'),
        errorCount: document.querySelector('.error-count'),
        refreshErrors: document.getElementById('refresh-errors'),
        
        // Modals
        contactModal: document.getElementById('contact-modal'),
        settingsModal: document.getElementById('settings-modal'),
        contactBtn: document.getElementById('contact-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        closeModals: document.querySelectorAll('.close-modal'),
        
        // Status indicators
        pythonStatus: document.getElementById('python-status'),
        luaStatus: document.getElementById('lua-status'),
        langIndicator: document.getElementById('lang-indicator'),
        currentFile: document.getElementById('current-file'),
        currentExt: document.getElementById('current-ext'),
        
        // Assistant
        assistantChat: document.getElementById('assistant-chat'),
        aiInput: document.getElementById('ai-input'),
        sendAi: document.getElementById('send-ai'),
        closeAssistant: document.getElementById('close-assistant'),
        quickActions: document.querySelectorAll('.quick-action'),
        
        // Toast
        toastContainer: document.getElementById('toast-container')
    };

    // Inicialização
    async function init() {
        // Inicializar carregamento
        updateLoadingStatus('js-status', 'ready');
        
        // Carregar Pyodide (Python)
        await loadPyodide();
        
        // Carregar Fengari (Lua)
        await loadFengari();
        
        // Inicializar Monaco Editor
        await initMonaco();
        
        // Carregar configurações salvas
        loadSettings();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Carregar exemplo inicial
        loadExampleCode();
        
        // Finalizar loading
        finishLoading();
    }

    async function loadPyodide() {
        try {
            showToast('Carregando Python runtime...', 'info');
            updateLoadingStatus('py-status', 'loading');
            
            // Pyodide já está carregado via CDN no HTML
            state.pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
            });
            
            // Instalar pacotes básicos
            await state.pyodide.loadPackage(['numpy', 'micropip']);
            
            state.isPyodideLoaded = true;
            updateLoadingStatus('py-status', 'ready');
            showToast('Python runtime pronto!', 'success');
            
        } catch (error) {
            console.error('Erro ao carregar Pyodide:', error);
            updateLoadingStatus('py-status', 'error');
            showToast('Erro ao carregar Python. Recarregue a página.', 'error');
        }
    }

    async function loadFengari() {
        try {
            showToast('Carregando Lua runtime...', 'info');
            updateLoadingStatus('lua-status', 'loading');
            
            // Fengari já está carregado via CDN
            // Criar ambiente Lua
            state.fengari = fengari;
            
            // Testar execução básica
            const luaCode = `print("Lua runtime carregado!")`;
            executeLuaCode(luaCode);
            
            state.isFengariLoaded = true;
            updateLoadingStatus('lua-status', 'ready');
            showToast('Lua runtime pronto!', 'success');
            
        } catch (error) {
            console.error('Erro ao carregar Fengari:', error);
            updateLoadingStatus('lua-status', 'error');
            showToast('Erro ao carregar Lua. Recarregue a página.', 'error');
        }
    }

    function updateLoadingStatus(elementId, status) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('i');
        
        switch(status) {
            case 'loading':
                icon.className = 'fas fa-circle-notch fa-spin';
                element.style.color = 'var(--accent)';
                break;
            case 'ready':
                icon.className = 'fas fa-circle';
                element.style.color = 'var(--secondary)';
                break;
            case 'error':
                icon.className = 'fas fa-times-circle';
                element.style.color = 'var(--danger)';
                break;
        }
    }

    async function initMonaco() {
        // Configurar caminho para Monaco
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' } });
        
        // Carregar Monaco
        await new Promise((resolve) => {
            require(['vs/editor/editor.main'], function() {
                // Criar editor
                state.editor = monaco.editor.create(elements.monacoContainer, {
                    value: '',
                    language: 'python',
                    theme: 'vs-dark',
                    fontSize: config.fontSize,
                    automaticLayout: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false
                    },
                    suggestOnTriggerCharacters: true,
                    tabSize: config.tabSize,
                    insertSpaces: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnPaste: true,
                    formatOnType: true
                });
                
                // Event listeners do editor
                state.editor.onDidChangeModelContent(handleCodeChange);
                state.editor.onDidChangeCursorPosition(updateCursorPosition);
                
                resolve();
            });
        });
    }

    function setupEventListeners() {
        // Botões de linguagem
        elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
        });
        
        // Executar código
        elements.runCode.addEventListener('click', executeCode);
        
        // Formatar código
        elements.formatCode.addEventListener('click', formatCode);
        
        // Limpar código
        elements.clearCode.addEventListener('click', clearCode);
        
        // Salvar código
        elements.saveCode.addEventListener('click', saveCode);
        
        // Botões AI
        elements.explainCode.addEventListener('click', explainCode);
        elements.optimizeCode.addEventListener('click', optimizeCode);
        elements.debugCode.addEventListener('click', debugCode);
        
        // Tabs
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
        
        // Views
        elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });
        
        // Temas
        elements.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
        });
        
        // Console
        elements.consoleToggle.addEventListener('click', toggleConsole);
        elements.clearConsole.addEventListener('click', clearConsoleOutput);
        elements.copyOutput.addEventListener('click', copyConsoleOutput);
        elements.consoleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeConsoleCommand();
        });
        
        // Errors
        elements.errorsToggle.addEventListener('click', toggleErrorPanel);
        elements.refreshErrors.addEventListener('click', checkForErrors);
        
        // Modals
        elements.contactBtn.addEventListener('click', () => showModal('contact-modal'));
        elements.settingsBtn.addEventListener('click', () => showModal('settings-modal'));
        elements.closeModals.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Assistant
        elements.sendAi.addEventListener('click', sendAiMessage);
        elements.aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAiMessage();
        });
        elements.closeAssistant.addEventListener('click', toggleAssistant);
        
        elements.quickActions.forEach(action => {
            action.addEventListener('click', () => handleQuickAction(action.dataset.action));
        });
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.copy;
                navigator.clipboard.writeText(text);
                showToast('Copiado para a área de transferência!', 'success');
            });
        });
        
        // Submit issue
        document.getElementById('submit-issue').addEventListener('click', submitIssue);
        
        // Configurações
        document.getElementById('auto-save').addEventListener('change', (e) => {
            config.autoSave = e.target.checked;
            saveSettings();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
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
            clearConsoleOutput();
        }
    }

    function switchLanguage(lang) {
        config.currentLanguage = lang;
        
        // Atualizar botões
        elements.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Atualizar indicador
        updateLanguageIndicator(lang);
        
        // Mudar linguagem no editor
        const monacoLang = getMonacoLanguage(lang);
        monaco.editor.setModelLanguage(state.editor.getModel(), monacoLang);
        
        // Carregar exemplo da linguagem
        loadExampleCode();
        
        // Salvar configurações
        saveSettings();
        
        showToast(`Linguagem alterada para ${lang.toUpperCase()}`, 'info');
    }

    function getMonacoLanguage(lang) {
        const map = {
            'html': 'html',
            'css': 'css',
            'javascript': 'javascript',
            'python': 'python',
            'lua': 'lua'
        };
        return map[lang] || 'plaintext';
    }

    function updateLanguageIndicator(lang) {
        const icons = {
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'javascript': 'fab fa-js',
            'python': 'fab fa-python',
            'lua': 'fas fa-code'
        };
        
        const names = {
            'html': 'HTML',
            'css': 'CSS',
            'javascript': 'JavaScript',
            'python': 'Python',
            'lua': 'Lua'
        };
        
        const extensions = {
            'html': 'html',
            'css': 'css',
            'javascript': 'js',
            'python': 'py',
            'lua': 'lua'
        };
        
        elements.langIndicator.innerHTML = `
            <i class="${icons[lang]}"></i> ${names[lang]}
        `;
        
        elements.currentFile.textContent = 'script.';
        elements.currentExt.textContent = extensions[lang];
    }

    function switchTab(tab) {
        elements.tabs.forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        // Mostrar tab correspondente
        const containers = ['monaco-container', 'output-console', 'preview-pane'];
        containers.forEach(container => {
            const element = document.getElementById(container);
            if (container.replace('-', '_') === tab) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Se for preview, executar código
        if (tab === 'preview') {
            if (config.currentLanguage === 'html') {
                executeCode();
            } else {
                addToConsole('Preview disponível apenas para HTML', 'warning');
            }
        }
    }

    function switchView(view) {
        elements.viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Implementar lógica de layout aqui
        // (split view, full editor, etc.)
    }

    function switchTheme(theme) {
        config.theme = theme;
        document.body.className = `${theme}-theme`;
        
        elements.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        // Atualizar tema do Monaco
        const monacoTheme = theme === 'dark' ? 'vs-dark' : 
                           theme === 'light' ? 'vs' : 'hc-black';
        monaco.editor.setTheme(monacoTheme);
        
        saveSettings();
        showToast(`Tema alterado para ${theme}`, 'info');
    }

    async function executeCode() {
        const code = state.editor.getValue();
        
        if (!code.trim()) {
            showToast('Digite algum código primeiro!', 'warning');
            return;
        }
        
        // Limpar console se configurado
        if (document.getElementById('clear-on-run').checked) {
            clearConsoleOutput();
        }
        
        addToConsole(`Executando ${config.currentLanguage.toUpperCase()}...`, 'info');
        
        try {
            switch(config.currentLanguage) {
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
                    await executePython(code);
                    break;
                case 'lua':
                    await executeLua(code);
                    break;
            }
            
            checkForErrors();
            
        } catch (error) {
            addToConsole(`Erro: ${error.message}`, 'error');
            showToast('Erro na execução', 'error');
        }
    }

    function executeHTML(code) {
        // Renderizar HTML no preview
        const iframe = document.getElementById('preview-frame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
        
        // Executar JavaScript inline
        try {
            const scripts = iframeDoc.querySelectorAll('script');
            scripts.forEach(script => {
                iframe.contentWindow.eval(script.textContent);
            });
        } catch (e) {
            addToConsole(`Erro no script: ${e.message}`, 'error');
        }
        
        addToConsole('HTML executado com sucesso!', 'success');
    }

    function executeCSS(code) {
        // Aplicar CSS no preview
        const iframe = document.getElementById('preview-frame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Criar página básica com o CSS
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${code}</style>
            </head>
            <body>
                <div class="demo">
                    <h1>CSS Preview</h1>
                    <p>Este é um exemplo do seu CSS aplicado.</p>
                    <button class="btn">Botão de exemplo</button>
                    <div class="box">Caixa com estilo</div>
                </div>
            </body>
            </html>
        `;
        
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
        
        addToConsole('CSS aplicado no preview', 'success');
    }

    function executeJavaScript(code) {
        try {
            const result = eval(code);
            if (result !== undefined) {
                addToConsole(`Resultado: ${result}`, 'info');
            }
            addToConsole('JavaScript executado com sucesso!', 'success');
        } catch (error) {
            addToConsole(`Erro: ${error.message}`, 'error');
        }
    }

    async function executePython(code) {
        if (!state.isPyodideLoaded) {
            addToConsole('Python runtime não carregado!', 'error');
            return;
        }
        
        try {
            // Capturar output do Python
            const output = [];
            state.pyodide.runPython(`
                import sys
                import io
                sys.stdout = io.StringIO()
            `);
            
            // Executar código
            await state.pyodide.runPythonAsync(code);
            
            // Capturar output
            const result = state.pyodide.runPython('sys.stdout.getvalue()');
            
            if (result) {
                const lines = result.split('\n').filter(line => line.trim());
                lines.forEach(line => addToConsole(line, 'info'));
            }
            
            addToConsole('Python executado com sucesso!', 'success');
            
        } catch (error) {
            addToConsole(`Erro Python: ${error.message}`, 'error');
        }
    }

    async function executeLua(code) {
        if (!state.isFengariLoaded) {
            addToConsole('Lua runtime não carregado!', 'error');
            return;
        }
        
        try {
            // Executar código Lua
            const result = executeLuaCode(code);
            
            if (result && result.trim()) {
                addToConsole(result, 'info');
            }
            
            addToConsole('Lua executado com sucesso!', 'success');
            
        } catch (error) {
            addToConsole(`Erro Lua: ${error.message}`, 'error');
        }
    }

    function executeLuaCode(code) {
        try {
            // Criar estado Lua
            const L = state.fengari;
            const lua = new L.Lua.State();
            
            // Redirecionar print para o console
            lua.push(function(L) {
                const args = [];
                const n = L.gettop();
                for (let i = 1; i <= n; i++) {
                    args.push(L.toString(i));
                }
                addToConsole(args.join(' '), 'info');
                return 0;
            });
            lua.setglobal('print');
            
            // Executar código
            return lua.doString(code);
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    function formatCode() {
        const code = state.editor.getValue();
        
        // Formatação básica (em produção, use uma biblioteca)
        let formatted = code;
        
        switch(config.currentLanguage) {
            case 'html':
                formatted = formatHTML(code);
                break;
            case 'css':
                formatted = formatCSS(code);
                break;
            case 'javascript':
                formatted = formatJavaScript(code);
                break;
            case 'python':
                formatted = formatPython(code);
                break;
            case 'lua':
                formatted = formatLua(code);
                break;
        }
        
        state.editor.setValue(formatted);
        showToast('Código formatado!', 'success');
    }

    function formatHTML(code) {
        // Formatação básica de HTML
        return code
            .replace(/>\s+</g, '>\n<')
            .replace(/</g, '\n<')
            .replace(/>/g, '>\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }

    function formatCSS(code) {
        return code
            .replace(/{/g, ' {\n')
            .replace(/}/g, '\n}\n\n')
            .replace(/;/g, ';\n')
            .split('\n')
            .map(line => '    ' + line.trim())
            .join('\n');
    }

    function formatJavaScript(code) {
        return code
            .replace(/{/g, '{\n')
            .replace(/}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/\n\s*\n/g, '\n')
            .split('\n')
            .map(line => '    ' + line.trim())
            .join('\n');
    }

    function formatPython(code) {
        return code
            .replace(/:\s*/g, ':\n    ')
            .replace(/\b(def|class|if|elif|else|for|while|try|except|finally)\b/g, '\n$1')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }

    function formatLua(code) {
        return code
            .replace(/\b(function|if|else|elseif|for|while|repeat)\b/g, '\n$1')
            .replace(/end\b/g, 'end\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
    }

    function clearCode() {
        if (confirm('Tem certeza que deseja limpar todo o código?')) {
            state.editor.setValue('');
            showToast('Código limpo', 'info');
        }
    }

    function saveCode() {
        const code = state.editor.getValue();
        const lang = config.currentLanguage;
        
        const extensions = {
            'html': 'html',
            'css': 'css',
            'javascript': 'js',
            'python': 'py',
            'lua': 'lua'
        };
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `codigo_${lang}_${Date.now()}.${extensions[lang] || 'txt'}`;
        a.click();
        
        URL.revokeObjectURL(url);
        showToast('Código salvo com sucesso!', 'success');
    }

    function explainCode() {
        const code = state.editor.getValue();
        if (!code.trim()) {
            showToast('Digite algum código primeiro!', 'warning');
            return;
        }
        
        addAiMessage(`Analisando código ${config.currentLanguage}...`);
        
        setTimeout(() => {
            const explanation = generateExplanation(code, config.currentLanguage);
            addAiMessage(explanation, 'ai');
        }, 1000);
    }

    function optimizeCode() {
        const code = state.editor.getValue();
        if (!code.trim()) {
            showToast('Digite algum código primeiro!', 'warning');
            return;
        }
        
        addAiMessage(`Otimizando código ${config.currentLanguage}...`);
        
        setTimeout(() => {
            const optimizations = generateOptimizations(code, config.currentLanguage);
            addAiMessage(optimizations, 'ai');
        }, 1000);
    }

    function debugCode() {
        checkForErrors();
        
        if (state.errors.length === 0) {
            addAiMessage('Nenhum erro encontrado no código!', 'ai');
        } else {
            addAiMessage(`Encontrei ${state.errors.length} problema(s):\n\n${
                state.errors.map(e => `• ${e.message}`).join('\n')
            }`, 'ai');
        }
    }

    function generateExplanation(code, lang) {
        const lines = code.split('\n').length;
        const chars = code.length;
        
        const analysis = {
            'html': `Este é um documento HTML com ${lines} linhas. ` +
                   `Contém tags HTML para estruturação de página web.`,
            'css': `Este é um arquivo CSS com ${lines} linhas. ` +
                  `Define estilos visuais para elementos HTML.`,
            'javascript': `Este é um script JavaScript com ${lines} linhas. ` +
                        `Implementa lógica e interatividade para a página.`,
            'python': `Este é um script Python com ${lines} linhas. ` +
                     `Pode conter funções, classes e lógica de programação.`,
            'lua': `Este é um script Lua com ${lines} linhas. ` +
                  `Comum em desenvolvimento de jogos e automação.`
        };
        
        return analysis[lang] || `Código em ${lang} com ${lines} linhas e ${chars} caracteres.`;
    }

    function generateOptimizations(code, lang) {
        const tips = {
            'html': [
                'Use tags semânticas (header, nav, main, footer)',
                'Adicione atributos alt em todas as imagens',
                'Valide seu HTML com o W3C Validator'
            ],
            'css': [
                'Use variáveis CSS para cores e tamanhos',
                'Evite !important quando possível',
                'Use flexbox/grid para layouts responsivos'
            ],
            'javascript': [
                'Use const/let em vez de var',
                'Evite funções aninhadas profundamente',
                'Use métodos de array (map, filter, reduce)'
            ],
            'python': [
                'Use list comprehensions para loops simples',
                'Evite globais, use parâmetros de função',
                'Use f-strings para formatação de texto'
            ],
            'lua': [
                'Use tabelas locais quando possível',
                'Evite criar variáveis globais',
                'Use ipairs/pairs para iterar tabelas'
            ]
        };
        
        const langTips = tips[lang] || ['Mantenha o código organizado e comentado'];
        
        return `Sugestões de otimização para ${lang}:\n\n${
            langTips.map(tip => `• ${tip}`).join('\n')
        }`;
    }

    function addToConsole(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        const prompt = type === 'info' ? '$' : '!';
        line.innerHTML = `<span class="prompt">${prompt}</span> ${message}`;
        
        elements.consoleContent.appendChild(line);
        elements.consoleContent.scrollTop = elements.consoleContent.scrollHeight;
        
        // Limitar histórico
        const maxLines = parseInt(document.getElementById('console-history').value) || 100;
        const lines = elements.consoleContent.querySelectorAll('.console-line');
        if (lines.length > maxLines) {
            lines[0].remove();
        }
    }

    function clearConsoleOutput() {
        elements.consoleContent.innerHTML = '';
        addToConsole('Console limpo.', 'info');
    }

    function copyConsoleOutput() {
        const text = Array.from(elements.consoleContent.querySelectorAll('.console-line'))
            .map(line => line.textContent)
            .join('\n');
        
        navigator.clipboard.writeText(text);
        showToast('Console copiado!', 'success');
    }

    function executeConsoleCommand() {
        const command = elements.consoleInput.value.trim();
        if (!command) return;
        
        addToConsole(`> ${command}`, 'command');
        
        // Comandos básicos do console
        const commands = {
            'clear': () => clearConsoleOutput(),
            'help': () => addToConsole('Comandos: clear, theme [dark/light/matrix], run, save', 'info'),
            'theme': (arg) => {
                if (['dark', 'light', 'matrix'].includes(arg)) {
                    switchTheme(arg);
                    return `Tema alterado para ${arg}`;
                }
                return 'Tema inválido. Use: dark, light ou matrix';
            },
            'run': () => executeCode(),
            'save': () => saveCode()
        };
        
        const parts = command.split(' ');
        const cmd = parts[0];
        const arg = parts[1];
        
        if (commands[cmd]) {
            const result = commands[cmd](arg);
            if (result) addToConsole(result, 'info');
        } else {
            addToConsole(`Comando não encontrado: ${cmd}`, 'error');
        }
        
        elements.consoleInput.value = '';
    }

    function toggleConsole() {
        const isActive = document.querySelector('.tab[data-tab="output"]').classList.contains('active');
        if (!isActive) {
            switchTab('output');
        } else {
            switchTab('code');
        }
    }

    function toggleErrorPanel() {
        const currentTransform = elements.errorPanel.style.transform;
        if (currentTransform === 'translateY(0px)' || currentTransform === '') {
            elements.errorPanel.style.transform = 'translateY(calc(100% - 40px))';
        } else {
            elements.errorPanel.style.transform = 'translateY(0)';
            checkForErrors();
        }
    }

    function checkForErrors() {
        const code = state.editor.getValue();
        state.errors = [];
        
        // Verificações básicas por linguagem
        switch(config.currentLanguage) {
            case 'python':
                checkPythonErrors(code);
                break;
            case 'lua':
                checkLuaErrors(code);
                break;
            case 'javascript':
                checkJavaScriptErrors(code);
                break;
            case 'html':
                checkHTMLErrors(code);
                break;
        }
        
        updateErrorDisplay();
    }

    function checkPythonErrors(code) {
        try {
            // Tentar analisar com Pyodide
            state.pyodide.runPython('import ast');
            state.pyodide.runPython(`ast.parse("""${code.replace(/"/g, '\\"')}""")`);
        } catch (error) {
            state.errors.push({
                type: 'error',
                message: error.message.split('\n')[0],
                line: extractLineNumber(error.message)
            });
        }
    }

    function checkLuaErrors(code) {
        try {
            executeLuaCode(code);
        } catch (error) {
            state.errors.push({
                type: 'error',
                message: error.message,
                line: extractLineNumber(error.message)
            });
        }
    }

    function checkJavaScriptErrors(code) {
        try {
            new Function(code);
        } catch (error) {
            state.errors.push({
                type: 'error',
                message: error.message,
                line: extractLineNumber(error.message)
            });
        }
    }

    function checkHTMLErrors(code) {
        // Verificar tags não fechadas
        const divs = (code.match(/<div/gi) || []).length;
        const divsClose = (code.match(/<\/div/gi) || []).length;
        
        if (divs !== divsClose) {
            state.errors.push({
                type: 'warning',
                message: 'Tags div podem não estar balanceadas',
                line: 1
            });
        }
    }

    function extractLineNumber(errorMessage) {
        const match = errorMessage.match(/line (\d+)/i);
        return match ? parseInt(match[1]) : 1;
    }

    function updateErrorDisplay() {
        elements.errorList.innerHTML = '';
        elements.errorCount.textContent = state.errors.length;
        
        if (state.errors.length === 0) {
            elements.errorList.innerHTML = `
                <div class="no-errors">
                    <i class="fas fa-check-circle"></i>
                    <p>Nenhum problema encontrado</p>
                </div>
            `;
            return;
        }
        
        state.errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-item';
            
            errorDiv.innerHTML = `
                <div class="error-title">
                    <i class="fas fa-exclamation-circle ${error.type}"></i>
                    ${error.message}
                </div>
                <div class="error-line">Linha ${error.line}</div>
            `;
            
            elements.errorList.appendChild(errorDiv);
        });
    }

    function handleCodeChange() {
        if (config.autoSave) {
            saveToLocalStorage();
        }
        
        if (config.autoRun) {
            debounce(executeCode, 1000)();
        }
    }

    function updateCursorPosition() {
        const position = state.editor.getPosition();
        document.getElementById('current-line').textContent = position.lineNumber;
        document.getElementById('current-col').textContent = position.column;
    }

    function toggleAssistant() {
        elements.assistantPanel.style.display = 
            elements.assistantPanel.style.display === 'none' ? 'flex' : 'none';
    }

    function sendAiMessage() {
        const message = elements.aiInput.value.trim();
        if (!message) return;
        
        addAiMessage(message, 'user');
        elements.aiInput.value = '';
        
        // Simular resposta do AI
        setTimeout(() => {
            const response = generateAiResponse(message);
            addAiMessage(response, 'ai');
        }, 1000);
    }

    function addAiMessage(message, sender = 'ai') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? 'Você' : 'AI';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        elements.assistantChat.appendChild(messageDiv);
        elements.assistantChat.scrollTop = elements.assistantChat.scrollHeight;
    }

    function generateAiResponse(message) {
        const responses = [
            "Entendi sua dúvida! Posso ajudar a analisar o código específico.",
            "Baseado no seu código, sugiro verificar a sintaxe na linha mencionada.",
            "Isso parece ser um problema comum. Vou te mostrar a solução.",
            "Precisa de exemplos de como implementar isso? Posso fornecer!",
            "Sua abordagem está boa, mas posso sugerir algumas otimizações."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function handleQuickAction(action) {
        const actions = {
            'syntax': 'Vou analisar a sintaxe do seu código...',
            'logic': 'Analisando a lógica do programa...',
            'performance': 'Verificando possíveis otimizações de performance...'
        };
        
        if (actions[action]) {
            addAiMessage(actions[action], 'ai');
        }
    }

    function showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    function submitIssue() {
        const text = document.getElementById('issue-text').value.trim();
        if (!text) {
            showToast('Descreva o problema primeiro!', 'warning');
            return;
        }
        
        // Em produção, enviaria para um backend
        console.log('Problema reportado:', text);
        
        document.getElementById('issue-text').value = '';
        showToast('Problema reportado com sucesso!', 'success');
        
        setTimeout(() => {
            showToast('Nossa equipe responderá em breve!', 'info');
        }, 2000);
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function loadSettings() {
        const saved = localStorage.getItem('codenexus_settings');
        if (saved) {
            Object.assign(config, JSON.parse(saved));
        }
        
        // Aplicar configurações
        switchTheme(config.theme);
        updateLanguageIndicator(config.currentLanguage);
        
        // Carregar código salvo
        const savedCode = localStorage.getItem(`codenexus_code_${config.currentLanguage}`);
        if (savedCode) {
            state.editor.setValue(savedCode);
        }
    }

    function saveSettings() {
        localStorage.setItem('codenexus_settings', JSON.stringify(config));
    }

    function saveToLocalStorage() {
        const code = state.editor.getValue();
        localStorage.setItem(`codenexus_code_${config.currentLanguage}`, code);
    }

    function loadExampleCode() {
        const examples = {
            python: `# Calculadora Científica em Python
import math

def calcular_raiz_quadrada(numero):
    """Calcula a raiz quadrada de um número"""
    return math.sqrt(numero)

def calcular_potencia(base, expoente):
    """Calcula base elevada ao expoente"""
    return math.pow(base, expoente)

def calcular_fatorial(numero):
    """Calcula o fatorial de um número"""
    if numero <= 1:
        return 1
    return numero * calcular_fatorial(numero - 1)

def calcular_media(numeros):
    """Calcula a média de uma lista de números"""
    return sum(numeros) / len(numeros)

# Exemplo de uso
if __name__ == "__main__":
    print("🧮 CALCULADORA CIENTÍFICA")
    print("=" * 30)
    
    # Testar funções
    numeros = [10, 20, 30, 40, 50]
    print(f"Números: {numeros}")
    print(f"Média: {calcular_media(numeros):.2f}")
    print(f"Raiz quadrada de 25: {calcular_raiz_quadrada(25):.2f}")
    print(f"2 elevado a 8: {calcular_potencia(2, 8)}")
    print(f"Fatorial de 5: {calcular_fatorial(5)}")
    
    # List comprehension
    quadrados = [x**2 for x in range(1, 11)]
    print(f"\\nQuadrados de 1 a 10: {quadrados}")
    
    # Dicionário
    aluno = {
        "nome": "Maria",
        "idade": 22,
        "curso": "Ciência da Computação",
        "notas": [8.5, 9.0, 7.5, 10.0]
    }
    
    print(f"\\n📚 Dados do Aluno:")
    for chave, valor in aluno.items():
        print(f"{chave}: {valor}")`,

            lua: `-- Jogo de Adivinhação em Lua

-- Configurações do jogo
local CONFIG = {
    NUMERO_MINIMO = 1,
    NUMERO_MAXIMO = 100,
    MAX_TENTATIVAS = 7
}

-- Estado do jogo
local Jogo = {
    numero_secreto = 0,
    tentativas = 0,
    historico = {},
    jogando = false
}

-- Função para gerar número aleatório
function gerar_numero_secreto(min, max)
    math.randomseed(os.time())
    return math.random(min, max)
end

-- Função para inicializar novo jogo
function novo_jogo()
    Jogo.numero_secreto = gerar_numero_secreto(CONFIG.NUMERO_MINIMO, CONFIG.NUMERO_MAXIMO)
    Jogo.tentativas = 0
    Jogo.historico = {}
    Jogo.jogando = true
    
    print("=====================================")
    print("🎮 JOGO DE ADIVINHAÇÃO")
    print("=====================================")
    print("Estou pensando em um número entre " .. CONFIG.NUMERO_MINIMO .. " e " .. CONFIG.NUMERO_MAXIMO)
    print("Você tem " .. CONFIG.MAX_TENTATIVAS .. " tentativas para adivinhar!")
    print("Digite 'sair' para encerrar o jogo")
    print("=====================================\\n")
    
    return true
end

-- Função para processar palpite
function processar_palpite(palpite)
    if not Jogo.jogando then
        print("Inicie um novo jogo primeiro!")
        return false
    end
    
    local numero = tonumber(palpite)
    
    if not numero then
        print("Por favor, digite um número válido!")
        return false
    end
    
    Jogo.tentativas = Jogo.tentativas + 1
    table.insert(Jogo.historico, {tentativa = Jogo.tentativas, palpite = numero})
    
    if numero == Jogo.numero_secreto then
        print("🎉 PARABÉNS! Você acertou!")
        print("O número secreto era: " .. Jogo.numero_secreto)
        print("Tentativas usadas: " .. Jogo.tentativas)
        mostrar_historico()
        Jogo.jogando = false
        return true
    elseif numero < Jogo.numero_secreto then
        print("📈 Muito baixo! Tente um número maior.")
    else
        print("📉 Muito alto! Tente um número menor.")
    end
    
    local tentativas_restantes = CONFIG.MAX_TENTATIVAS - Jogo.tentativas
    print("Tentativas restantes: " .. tentativas_restantes)
    
    if Jogo.tentativas >= CONFIG.MAX_TENTATIVAS then
        print("\\n💀 FIM DE JOGO!")
        print("O número secreto era: " .. Jogo.numero_secreto)
        Jogo.jogando = false
    end
    
    return false
end

-- Função para mostrar histórico
function mostrar_historico()
    print("\\n📋 HISTÓRICO DE TENTATIVAS")
    print("==========================")
    for i, item in ipairs(Jogo.historico) do
        local resultado = item.palpite < Jogo.numero_secreto and "⬆️" or
                         item.palpite > Jogo.numero_secreto and "⬇️" or "🎯"
        print(string.format("%02d. %3d %s", item.tentativa, item.palpite, resultado))
    end
    print("==========================\\n")
end

-- Função para mostrar estatísticas
function mostrar_estatisticas()
    if #Jogo.historico == 0 then
        print("Nenhuma estatística disponível. Jogue primeiro!")
        return
    end
    
    print("\\n📊 ESTATÍSTICAS DO JOGO")
    print("========================")
    print("Total de tentativas: " .. Jogo.tentativas)
    
    local menor = math.huge
    local maior = -math.huge
    
    for _, item in ipairs(Jogo.historico) do
        if item.palpite < menor then menor = item.palpite end
        if item.palpite > maior then maior = item.palpite end
    end
    
    print("Menor palpite: " .. menor)
    print("Maior palpite: " .. maior)
    print("========================")
end

-- Exemplo de uso
print("🧮 EXEMPLOS EM LUA")
print("=" * 40)

-- Testar funções matemáticas
print("\\n🔢 Matemática:")
print("7 é primo?", eh_primo(7) and "Sim" or "Não")
print("Fatorial de 5:", fatorial(5))
print("Fibonacci(10):", table.concat(fibonacci(10), ", "))

-- Iniciar jogo de exemplo
novo_jogo()
print("\\n💡 Dica: O número secreto foi definido para testes!")
print("Tente adivinhar...\\n")

-- Funções matemáticas auxiliares
function eh_primo(n)
    if n <= 1 then return false end
    if n <= 3 then return true end
    if n % 2 == 0 or n % 3 == 0 then return false end
    
    local i = 5
    while i * i <= n do
        if n % i == 0 or n % (i + 2) == 0 then
            return false
        end
        i = i + 6
    end
    return true
end

function fatorial(n)
    if n <= 1 then return 1 end
    return n * fatorial(n - 1)
end

function fibonacci(n)
    local seq = {0, 1}
    for i = 3, n do
        seq[i] = seq[i-1] + seq[i-2]
    end
    return seq
end`,

            javascript: `// Sistema de Gerenciamento de Tarefas

class GerenciadorTarefas {
    constructor() {
        this.tarefas = [];
        this.idContador = 1;
        this.carregarLocalStorage();
    }
    
    adicionarTarefa(titulo, descricao, prioridade = 'normal') {
        const tarefa = {
            id: this.idContador++,
            titulo,
            descricao,
            prioridade,
            concluida: false,
            dataCriacao: new Date().toISOString(),
            dataConclusao: null
        };
        
        this.tarefas.push(tarefa);
        this.salvarLocalStorage();
        console.log(\`✅ Tarefa "\${titulo}" adicionada!\`);
        return tarefa;
    }
    
    concluirTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.concluida = true;
            tarefa.dataConclusao = new Date().toISOString();
            this.salvarLocalStorage();
            console.log(\`🎉 Tarefa "\${tarefa.titulo}" concluída!\`);
            return true;
        }
        console.log(\`❌ Tarefa #\${id} não encontrada.\`);
        return false;
    }
    
    removerTarefa(id) {
        const index = this.tarefas.findIndex(t => t.id === id);
        if (index !== -1) {
            const [removida] = this.tarefas.splice(index, 1);
            this.salvarLocalStorage();
            console.log(\`🗑️ Tarefa "\${removida.titulo}" removida.\`);
            return true;
        }
        return false;
    }
    
    listarTarefas(filtro = 'todas') {
        let tarefasFiltradas = this.tarefas;
        
        switch(filtro) {
            case 'pendentes':
                tarefasFiltradas = this.tarefas.filter(t => !t.concluida);
                break;
            case 'concluidas':
                tarefasFiltradas = this.tarefas.filter(t => t.concluida);
                break;
            case 'prioridade-alta':
                tarefasFiltradas = this.tarefas.filter(t => t.prioridade === 'alta');
                break;
        }
        
        console.log(\`📋 Lista de Tarefas (\${filtro}):\`);
        console.log(\`Total: \${tarefasFiltradas.length} tarefa(s)\`);
        console.log('='.repeat(50));
        
        tarefasFiltradas.forEach(tarefa => {
            const status = tarefa.concluida ? '✅' : '⏳';
            const prioridade = tarefa.prioridade === 'alta' ? '🔥' : 
                              tarefa.prioridade === 'baixa' ? '❄️' : '⚡';
            
            console.log(\`\${status} \${prioridade} #\${tarefa.id}: \${tarefa.titulo}\`);
            console.log(\`   Descrição: \${tarefa.descricao}\`);
            console.log(\`   Criada em: \${new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')}\`);
            
            if (tarefa.concluida) {
                console.log(\`   Concluída em: \${new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}\`);
            }
            console.log('-'.repeat(50));
        });
        
        return tarefasFiltradas;
    }
    
    calcularEstatisticas() {
        const total = this.tarefas.length;
        const concluidas = this.tarefas.filter(t => t.concluida).length;
        const pendentes = total - concluidas;
        const porcentagem = total > 0 ? ((concluidas / total) * 100).toFixed(1) : 0;
        
        console.log('📊 ESTATÍSTICAS:');
        console.log(\`Total de tarefas: \${total}\`);
        console.log(\`Concluídas: \${concluidas} (\${porcentagem}%)\`);
        console.log(\`Pendentes: \${pendentes}\`);
        
        return { total, concluidas, pendentes, porcentagem };
    }
    
    salvarLocalStorage() {
        localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
        localStorage.setItem('idContador', this.idContador.toString());
    }
    
    carregarLocalStorage() {
        const tarefasSalvas = localStorage.getItem('tarefas');
        const idSalvo = localStorage.getItem('idContador');
        
        if (tarefasSalvas) {
            this.tarefas = JSON.parse(tarefasSalvas);
        }
        
        if (idSalvo) {
            this.idContador = parseInt(idSalvo);
        }
    }
}

// Demonstração do sistema
console.log('🚀 SISTEMA DE GERENCIAMENTO DE TAREFAS');
console.log('='.repeat(50));

const gerenciador = new GerenciadorTarefas();

// Adicionar tarefas de exemplo
gerenciador.adicionarTarefa(
    'Estudar JavaScript',
    'Completar exercícios de arrays e objetos',
    'alta'
);

gerenciador.adicionarTarefa(
    'Fazer compras',
    'Comprar itens do supermercado',
    'normal'
);

gerenciador.adicionarTarefa(
    'Reunião com equipe',
    'Planejamento do próximo sprint',
    'alta'
);

// Listar todas as tarefas
gerenciador.listarTarefas();

// Concluir uma tarefa
gerenciador.concluirTarefa(1);

// Listar pendentes
gerenciador.listarTarefas('pendentes');

// Calcular estatísticas
gerenciador.calcularEstatisticas();

// Exemplo com arrays
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pares = numeros.filter(n => n % 2 === 0);
const quadrados = numeros.map(n => n * n);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log('\\n🔢 Exemplo com Arrays:');
console.log(\`Números: \${numeros.join(', ')}\`);
console.log(\`Pares: \${pares.join(', ')}\`);
console.log(\`Quadrados: \${quadrados.join(', ')}\`);
console.log(\`Soma: \${soma}\`);`,

            html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeNexus - Laboratório</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
            --primary: #6366f1;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow);
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
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
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
            background: var(--light);
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 2px solid transparent;
        }
        
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
            border-color: var(--primary);
        }
        
        .feature i {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        .feature h3 {
            margin-bottom: 0.5rem;
            color: var(--dark);
        }
        
        .demo-area {
            background: var(--light);
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 2rem;
        }
        
        .code-display {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            margin: 1rem 0;
            overflow-x: auto;
        }
        
        .controls {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        button {
            padding: 0.75rem 1.5rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s, transform 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        button:hover {
            background: #4f46e5;
            transform: translateY(-2px);
        }
        
        button.secondary {
            background: var(--secondary);
        }
        
        button.secondary:hover {
            background: #0da271;
        }
        
        footer {
            text-align: center;
            padding: 1.5rem;
            background: var(--light);
            color: var(--dark);
            border-top: 1px solid #e2e8f0;
        }
        
        @media (max-width: 600px) {
            h1 {
                font-size: 2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
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
            <h1>🚀 CodeNexus</h1>
            <p class="tagline">Laboratório Multi-Linguagem Profissional</p>
        </header>
        
        <main>
            <h2>✨ Recursos Incríveis</h2>
            <p>Desenvolva, teste e execute código em múltiplas linguagens diretamente no navegador!</p>
            
            <div class="features">
                <div class="feature">
                    <i class="fas fa-code"></i>
                    <h3>5 Linguagens</h3>
                    <p>HTML, CSS, JavaScript, Python e Lua</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-play-circle"></i>
                    <h3>Execução Real</h3>
                    <p>Execute Python e Lua no navegador</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-robot"></i>
                    <h3>AI Assistant</h3>
                    <p>Assistente inteligente integrado</p>
                </div>
                
                <div class="feature">
                    <i class="fas fa-bug"></i>
                    <h3>Debug Integrado</h3>
                    <p>Detecção automática de erros</p>
                </div>
            </div>
            
            <div class="demo-area">
                <h3>💻 Demonstração Interativa</h3>
                <p>Clique no botão abaixo para ver a mágica acontecer:</p>
                
                <div class="code-display" id="demo-code">
                    // Seu código aparece aqui
                    console.log("Bem-vindo ao CodeNexus!");
                </div>
                
                <div class="controls">
                    <button onclick="executarDemo()">
                        <i class="fas fa-play"></i> Executar Código
                    </button>
                    <button class="secondary" onclick="alterarTema()">
                        <i class="fas fa-palette"></i> Alterar Tema
                    </button>
                </div>
                
                <div id="demo-output" style="margin-top: 1rem;"></div>
            </div>
        </main>
        
        <footer>
            <p>© 2024 CodeNexus | Laboratório de Desenvolvimento Profissional</p>
            <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">
                Desenvolvido com ❤️ para programadores
            </p>
        </footer>
    </div>
    
    <script>
        function executarDemo() {
            const output = document.getElementById('demo-output');
            output.innerHTML = '<div style="background: #d1fae5; padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">🎉 Código executado com sucesso!<br>Confira o console do navegador para ver os resultados.</div>';
            
            // Executar código de demonstração
            console.log('🚀 CodeNexus Demo');
            console.log('='.repeat(40));
            console.log('📦 Recursos disponíveis:');
            console.log('• Python no navegador (Pyodide)');
            console.log('• Lua no navegador (Fengari)');
            console.log('• Editor VS Code integrado');
            console.log('• Debug automático');
            console.log('='.repeat(40));
            
            // Animação
            output.style.animation = 'fadeIn 0.5s ease-out';
            
            // Reset após 5 segundos
            setTimeout(() => {
                output.style.opacity = '0.5';
            }, 5000);
        }
        
        function alterarTema() {
            const body = document.body;
            const isDark = body.style.background.includes('#1e293b');
            
            if (isDark) {
                body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            } else {
                body.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
            }
        }
        
        // Inicializar
        console.log('Bem-vindo ao CodeNexus! 🎯');
    </script>
</body>
</html>`,

            css: `/* Design System Moderno - CodeNexus */

:root {
    /* Cores Principais */
    --primary-50: #eef2ff;
    --primary-100: #e0e7ff;
    --primary-200: #c7d2fe;
    --primary-300: #a5b4fc;
    --primary-400: #818cf8;
    --primary-500: #6366f1;
    --primary-600: #4f46e5;
    --primary-700: #4338ca;
    --primary-800: #3730a3;
    --primary-900: #312e81;
    
    /* Cores Neutras */
    --neutral-50: #f8fafc;
    --neutral-100: #f1f5f9;
    --neutral-200: #e2e8f0;
    --neutral-300: #cbd5e1;
    --neutral-400: #94a3b8;
    --neutral-500: #64748b;
    --neutral-600: #475569;
    --neutral-700: #334155;
    --neutral-800: #1e293b;
    --neutral-900: #0f172a;
    
    /* Cores de Feedback */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Espaçamento */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    --space-16: 4rem;
    
    /* Tipografia */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-mono: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;
    
    /* Bordas */
    --radius-sm: 0.25rem;
    --radius: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    
    /* Transições */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset e Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-sans);
    line-height: 1.6;
    color: var(--neutral-900);
    background: var(--neutral-50);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Container Responsivo */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
}

@media (min-width: 640px) {
    .container { max-width: 640px; }
}

@media (min-width: 768px) {
    .container { max-width: 768px; }
}

@media (min-width: 1024px) {
    .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
    .container { max-width: 1280px; }
}

/* Grid System */
.grid {
    display: grid;
    gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

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
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

/* Componentes */
.card {
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow);
    border: 1px solid var(--neutral-200);
    transition: var(--transition);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card-header {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 2px solid var(--primary-100);
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    background: var(--primary-500);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    font-size: 0.875rem;
}

.btn:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
}

.btn:active {
    transform: translateY(0);
}

.btn-secondary {
    background: var(--neutral-200);
    color: var(--neutral-800);
}

.btn-secondary:hover {
    background: var(--neutral-300);
}

.btn-outline {
    background: transparent;
    border: 2px solid var(--primary-500);
    color: var(--primary-500);
}

.btn-outline:hover {
    background: var(--primary-50);
}

.btn-success {
    background: var(--success);
}

.btn-success:hover {
    background: #0da271;
}

.btn-error {
    background: var(--error);
}

.btn-error:hover {
    background: #dc2626;
}

/* Formulários */
.input-group {
    margin-bottom: var(--space-4);
}

label {
    display: block;
    margin-bottom: var(--space-2);
    font-weight: 500;
    color: var(--neutral-700);
}

input, select, textarea {
    width: 100%;
    padding: var(--space-3);
    border: 2px solid var(--neutral-300);
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 1rem;
    transition: var(--transition-fast);
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
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
    background: var(--primary-100);
    color: var(--primary-700);
}

.badge-success {
    background: #d1fae5;
    color: #065f46;
}

.badge-warning {
    background: #fef3c7;
    color: #92400e;
}

.badge-error {
    background: #fee2e2;
    color: #991b1b;
}

/* Alerts */
.alert {
    padding: var(--space-4);
    border-radius: var(--radius);
    margin-bottom: var(--space-4);
    border-left: 4px solid;
}

.alert-success {
    background: #d1fae5;
    border-color: var(--success);
    color: #065f46;
}

.alert-warning {
    background: #fef3c7;
    border-color: var(--warning);
    color: #92400e;
}

.alert-error {
    background: #fee2e2;
    border-color: var(--error);
    color: #991b1b;
}

.alert-info {
    background: #dbeafe;
    border-color: var(--info);
    color: #1e40af;
}

/* Animations */
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
    animation: fadeIn 0.5s ease-out;
}

.animate-slide {
    animation: slideIn 0.3s ease-out;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Code Display */
.code-block {
    background: var(--neutral-900);
    color: var(--neutral-100);
    padding: var(--space-4);
    border-radius: var(--radius);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    overflow-x: auto;
    margin: var(--space-4) 0;
}

.code-block .keyword { color: #c678dd; }
.code-block .string { color: #98c379; }
.code-block .comment { color: #7f848e; font-style: italic; }
.code-block .function { color: #61afef; }
.code-block .number { color: #d19a66; }

/* Utilidades de Espaçamento */
.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mt-8 { margin-top: var(--space-8); }

.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }

.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

/* Text Utilities */
.text-center { text-align: center; }
.text-right { text-align: right; }

.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

.text-primary { color: var(--primary-600); }
.text-success { color: var(--success); }
.text-error { color: var(--error); }

/* Responsividade */
@media (max-width: 768px) {
    .mobile\\:stack {
        flex-direction: column;
    }
    
    .mobile\\:text-center {
        text-align: center;
    }
    
    .mobile\\:full-width {
        width: 100%;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    body {
        background: var(--neutral-900);
        color: var(--neutral-100);
    }
    
    .card {
        background: var(--neutral-800);
        border-color: var(--neutral-700);
    }
    
    input, select, textarea {
        background: var(--neutral-800);
        border-color: var(--neutral-700);
        color: var(--neutral-100);
    }
}
`
        };
        
        if (examples[config.currentLanguage]) {
            state.editor.setValue(examples[config.currentLanguage]);
        }
    }

    function finishLoading() {
        setTimeout(() => {
            elements.loading.style.opacity = '0';
            setTimeout(() => {
                elements.loading.style.display = 'none';
                showToast('CodeNexus carregado com sucesso! 🚀', 'success');
            }, 500);
        }, 1000);
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Inicializar a aplicação
    await init();
});
