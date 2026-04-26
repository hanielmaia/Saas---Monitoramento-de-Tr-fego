/**
 * Auth Guard - Proteção e Consistência de Autenticação
 * Garante que token e usuário permaneçam no localStorage
 * e que usuário não logado seja redirecionado para login
 */

class AuthGuard {
    constructor() {
        this.redirectDelay = 500;
        this.loginPage = './login.html';
    }

    /**
     * Verifica se usuário está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem('neyes_token');
        const user = localStorage.getItem('neyes_user');
        return !!(token && user);
    }

    /**
     * Obtém usuário atual
     * @returns {Object|null}
     */
    getCurrentUser() {
        const user = localStorage.getItem('neyes_user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Obtém token de autenticação
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('neyes_token');
    }

    /**
     * Valida e restaura autenticação
     * Mantém consistência de token e usuário
     */
    validateAndRefresh() {
        const token = localStorage.getItem('neyes_token');
        const user = localStorage.getItem('neyes_user');

        if (!token || !user) {
            // Se não autenticado, redireciona para login
            this.redirectToLogin();
            return false;
        }

        try {
            // Valida se usuário é JSON válido
            JSON.parse(user);
            return true;
        } catch (e) {
            // Se JSON inválido, limpa e redireciona
            this.logout();
            return false;
        }
    }

    /**
     * Faz logout do usuário
     */
    logout() {
        localStorage.removeItem('neyes_token');
        localStorage.removeItem('neyes_user');
        this.redirectToLogin();
    }

    /**
     * Redireciona para página de login
     */
    redirectToLogin() {
        setTimeout(() => {
            window.location.href = this.loginPage;
        }, this.redirectDelay);
    }

    /**
     * Protege página - redireciona se não autenticado
     */
    protect() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    /**
     * Armazena redirecionamento anterior (para retornar após login)
     */
    saveRedirectUrl() {
        if (window.location.pathname !== '/src/pages/login.html') {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
        }
    }

    /**
     * Restaura redirecionamento anterior (após login bem-sucedido)
     */
    restoreRedirectUrl() {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            return redirectUrl;
        }
        return './home.html';
    }
}

// Instância global
const authGuard = new AuthGuard();

// Auto-proteção ao carregar página
document.addEventListener('DOMContentLoaded', function () {
    // Se página não é login, protege
    if (!window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('register.html') &&
        !window.location.pathname.includes('logout-confirm.html')) {
        authGuard.protect();
    }

    // Sincroniza token e usuário a cada mudança no localStorage
    window.addEventListener('storage', function (e) {
        if (e.key === 'neyes_token' || e.key === 'neyes_user') {
            // Atualiza dados de autenticação em tempo real
            console.log('Autenticação sincronizada entre abas');
        }
    });

    // Mantém token ativo a cada 30 segundos
    setInterval(function () {
        if (authGuard.isAuthenticated()) {
            const user = authGuard.getCurrentUser();
            if (user) {
                // Atualiza timestamp do último acesso
                user.lastAccess = new Date().toISOString();
                localStorage.setItem('neyes_user', JSON.stringify(user));
            }
        }
    }, 30000);
});
