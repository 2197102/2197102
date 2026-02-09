// discord.js - Integração com Webhook do Discord

const DISCORD_CONFIG = {
    WEBHOOK_URL: 'https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI', // SUBSTITUA COM SEU WEBHOOK
    COLORS: {
        INFO: 0x6366f1,    // Roxo
        SUCCESS: 0x10b981, // Verde
        WARNING: 0xf59e0b, // Laranja
        ERROR: 0xef4444,   // Vermelho
        BUG: 0xdc2626,     // Vermelho escuro
        FEATURE: 0x8b5cf6, // Violeta
        COMPLIMENT: 0xfbbf24 // Amarelo
    },
    EMOJIS: {
        FEEDBACK: '📬',
        BUG: '🐛',
        FEATURE: '✨',
        COMPLIMENT: '🌟',
        SUGGESTION: '💡',
        CODE: '💻',
        USER: '👤',
        TIME: '🕒',
        VERSION: '📦',
        DEV: '👨‍💻'
    }
};

class DiscordWebhook {
    constructor() {
        this.webhookUrl = DISCORD_CONFIG.WEBHOOK_URL;
    }
    
    async sendFeedback(feedbackData) {
        if (!this.webhookUrl || this.webhookUrl.includes('SEU_WEBHOOK_AQUI')) {
            console.warn('❌ Webhook do Discord não configurado. Configure em discord.js');
            return { success: false, message: 'Webhook não configurado' };
        }
        
        try {
            const embed = this.createFeedbackEmbed(feedbackData);
            const payload = this.createPayload(embed, 'feedback');
            
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✅ Feedback enviado para Discord com sucesso!');
                return { success: true, message: 'Feedback enviado!' };
            } else {
                console.error('❌ Erro ao enviar para Discord:', await response.text());
                return { success: false, message: 'Erro ao enviar' };
            }
            
        } catch (error) {
            console.error('❌ Erro na conexão com Discord:', error);
            return { success: false, message: error.message };
        }
    }
    
    createFeedbackEmbed(data) {
        const typeConfig = this.getTypeConfig(data.type);
        
        return {
            title: `${typeConfig.emoji} Novo Feedback - MalkLabs`,
            color: typeConfig.color,
            fields: [
                {
                    name: `${DISCORD_CONFIG.EMOJIS.USER} Usuário`,
                    value: data.email || 'Não informado',
                    inline: true
                },
                {
                    name: `${typeConfig.emoji} Tipo`,
                    value: typeConfig.name,
                    inline: true
                },
                {
                    name: `${DISCORD_CONFIG.EMOJIS.CODE} Linguagem`,
                    value: data.language.toUpperCase(),
                    inline: true
                },
                {
                    name: `${DISCORD_CONFIG.EMOJIS.FEEDBACK} Mensagem`,
                    value: data.message.length > 1000 
                        ? data.message.substring(0, 1000) + '...' 
                        : data.message
                }
            ],
            footer: {
                text: `MalkLabs v${data.appVersion} • ${DISCORD_CONFIG.EMOJIS.DEV} ${data.devName} - ${data.devAlias}`
            },
            timestamp: data.timestamp
        };
    }
    
    getTypeConfig(type) {
        const configs = {
            suggestion: {
                name: 'Sugestão',
                emoji: DISCORD_CONFIG.EMOJIS.SUGGESTION,
                color: DISCORD_CONFIG.COLORS.INFO
            },
            bug: {
                name: 'Reportar Bug',
                emoji: DISCORD_CONFIG.EMOJIS.BUG,
                color: DISCORD_CONFIG.COLORS.BUG
            },
            feature: {
                name: 'Pedir Feature',
                emoji: DISCORD_CONFIG.EMOJIS.FEATURE,
                color: DISCORD_CONFIG.COLORS.FEATURE
            },
            compliment: {
                name: 'Elogio',
                emoji: DISCORD_CONFIG.EMOJIS.COMPLIMENT,
                color: DISCORD_CONFIG.COLORS.COMPLIMENT
            },
            other: {
                name: 'Outro',
                emoji: '📝',
                color: DISCORD_CONFIG.COLORS.INFO
            }
        };
        
        return configs[type] || configs.other;
    }
    
    createPayload(embed, type = 'feedback') {
        const avatars = {
            feedback: 'https://cdn.discordapp.com/embed/avatars/1.png',
            bug: 'https://cdn.discordapp.com/embed/avatars/4.png',
            feature: 'https://cdn.discordapp.com/embed/avatars/3.png'
        };
        
        return {
            username: 'MalkLabs Feedback System',
            avatar_url: avatars[type] || avatars.feedback,
            embeds: [embed]
        };
    }
}

// Função global para enviar feedback
async function sendFeedbackToDiscord(feedbackData) {
    const webhook = new DiscordWebhook();
    
    // Adicionar informações do desenvolvedor
    feedbackData.devName = 'MalkDev0';
    feedbackData.devAlias = 'Jmfxp22';
    
    return await webhook.sendFeedback(feedbackData);
}

// Expor globalmente
window.DiscordWebhook = DiscordWebhook;
window.sendFeedbackToDiscord = sendFeedbackToDiscord;
