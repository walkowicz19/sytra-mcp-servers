/**
 * Security Management Module
 * Handles admin password configuration and dangerous action prompts
 */

class SecurityManager {
    constructor() {
        this.sessionToken = null;
        this.sessionExpiry = null;
        this.pendingAction = null;
        this.init();
    }

    init() {
        // Initialize password form
        this.initPasswordForm();
        
        // Initialize password prompt modal
        this.initPasswordPrompt();
        
        // Check password status
        this.checkPasswordStatus();
        
        // Load security audit log
        this.loadAuditLog();
        
        // Setup refresh button
        const refreshBtn = document.getElementById('refreshAuditBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAuditLog());
        }
    }

    initPasswordForm() {
        const form = document.getElementById('adminPasswordForm');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const toggleNewPassword = document.getElementById('toggleNewPassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

        if (!form) return;

        // Password visibility toggles
        if (toggleNewPassword) {
            toggleNewPassword.addEventListener('click', () => {
                this.togglePasswordVisibility('newPassword', toggleNewPassword);
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                this.togglePasswordVisibility('confirmPassword', toggleConfirmPassword);
            });
        }

        // Password strength indicator
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', () => {
                this.updatePasswordStrength(newPasswordInput.value);
                this.checkPasswordMatch();
            });
        }

        // Password match indicator
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.setAdminPassword();
        });
    }

    initPasswordPrompt() {
        const overlay = document.getElementById('passwordPromptOverlay');
        const denyBtn = document.getElementById('denyActionBtn');
        const allowBtn = document.getElementById('allowActionBtn');
        const togglePassword = document.getElementById('toggleAdminPassword');
        const passwordInput = document.getElementById('adminPasswordInput');

        if (!overlay) return;

        // Deny button
        if (denyBtn) {
            denyBtn.addEventListener('click', () => {
                this.denyAction();
            });
        }

        // Allow button
        if (allowBtn) {
            allowBtn.addEventListener('click', async () => {
                await this.allowAction();
            });
        }

        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility('adminPasswordInput', togglePassword);
            });
        }

        // Enter key to submit
        if (passwordInput) {
            passwordInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    await this.allowAction();
                }
            });
        }
    }

    togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthLevel = document.getElementById('strengthLevel');
        
        if (!strengthFill || !strengthLevel) return;

        let score = 0;
        let level = 'weak';

        // Length check
        if (password.length >= 12) score += 25;
        if (password.length >= 16) score += 10;

        // Complexity checks
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;

        // Determine level
        if (score >= 80) {
            level = 'strong';
        } else if (score >= 60) {
            level = 'medium';
        }

        // Update UI
        strengthFill.className = 'strength-fill ' + level;
        strengthLevel.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        strengthLevel.className = level;
    }

    checkPasswordMatch() {
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const matchIndicator = document.getElementById('passwordMatch');

        if (!newPassword || !confirmPassword || !matchIndicator) return;

        if (confirmPassword.value === '') {
            matchIndicator.textContent = '';
            matchIndicator.className = 'password-match';
            return;
        }

        if (newPassword.value === confirmPassword.value) {
            matchIndicator.textContent = '✓ Passwords match';
            matchIndicator.className = 'password-match match';
        } else {
            matchIndicator.textContent = '✗ Passwords do not match';
            matchIndicator.className = 'password-match no-match';
        }
    }

    async checkPasswordStatus() {
        try {
            const response = await fetch('/api/admin/password-status');
            const data = await response.json();

            const statusDiv = document.querySelector('.password-status .status-indicator');
            if (statusDiv) {
                const icon = statusDiv.querySelector('i');
                const text = statusDiv.querySelector('span');

                if (data.configured) {
                    icon.className = 'bi bi-shield-check';
                    icon.style.color = 'var(--status-healthy)';
                    text.textContent = 'Password Configured';
                } else {
                    icon.className = 'bi bi-shield-x';
                    icon.style.color = 'var(--accent-red)';
                    text.textContent = 'Not Configured';
                }
            }
        } catch (error) {
            console.error('Failed to check password status:', error);
        }
    }

    async setAdminPassword() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const feedback = document.getElementById('passwordFeedback');
        const submitBtn = document.getElementById('setPasswordBtn');

        // Validation
        if (newPassword !== confirmPassword) {
            this.showFeedback('Passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showFeedback('Password must be at least 8 characters long', 'error');
            return;
        }

        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Setting Password...';

        try {
            const response = await fetch('/api/admin/set-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                    currentPassword: currentPassword || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                this.showFeedback('Admin password set successfully!', 'success');
                
                // Clear form
                document.getElementById('adminPasswordForm').reset();
                document.querySelector('.strength-fill').className = 'strength-fill';
                document.getElementById('strengthLevel').textContent = '-';
                document.getElementById('passwordMatch').textContent = '';
                
                // Update status
                await this.checkPasswordStatus();
            } else {
                this.showFeedback(data.error || 'Failed to set password', 'error');
            }
        } catch (error) {
            console.error('Error setting password:', error);
            this.showFeedback('Network error. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-shield-check"></i> Set Admin Password';
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('passwordFeedback');
        if (!feedback) return;

        feedback.textContent = message;
        feedback.className = `feedback-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            feedback.className = 'feedback-message';
        }, 5000);
    }

    async loadAuditLog() {
        try {
            const response = await fetch('/api/admin/audit-log?limit=50');
            const data = await response.json();

            const logContainer = document.getElementById('securityAuditLog');
            if (!logContainer) return;

            if (!data.logs || data.logs.length === 0) {
                logContainer.innerHTML = '<div class="empty-state"><p>No security events logged yet.</p></div>';
                return;
            }

            logContainer.innerHTML = data.logs.map(entry => `
                <div class="audit-entry">
                    <div class="audit-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                    <div class="audit-action">${entry.action}</div>
                    <div class="audit-details">${entry.details || ''}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load audit log:', error);
        }
    }

    // Show password prompt for dangerous actions
    showPasswordPrompt(action) {
        return new Promise((resolve, reject) => {
            // Check if we have a valid session token
            if (this.sessionToken && this.sessionExpiry && Date.now() < this.sessionExpiry) {
                resolve({ allowed: true, sessionToken: this.sessionToken });
                return;
            }

            const overlay = document.getElementById('passwordPromptOverlay');
            const actionType = document.getElementById('actionType');
            const actionTarget = document.getElementById('actionTarget');
            const actionReason = document.getElementById('actionReason');
            const passwordInput = document.getElementById('adminPasswordInput');
            const errorDiv = document.getElementById('passwordError');

            if (!overlay) {
                reject(new Error('Password prompt not found'));
                return;
            }

            // Set action details
            if (actionType) actionType.textContent = action.type || 'Unknown';
            if (actionTarget) actionTarget.textContent = action.target || 'N/A';
            if (actionReason) actionReason.textContent = action.reason || 'Security policy violation';

            // Clear previous input
            if (passwordInput) passwordInput.value = '';
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.classList.remove('show');
            }

            // Store the promise resolver
            this.pendingAction = { resolve, reject, action };

            // Show overlay
            overlay.style.display = 'flex';
            
            // Focus password input
            setTimeout(() => {
                if (passwordInput) passwordInput.focus();
            }, 100);
        });
    }

    async allowAction() {
        const passwordInput = document.getElementById('adminPasswordInput');
        const rememberSession = document.getElementById('rememberSession');
        const errorDiv = document.getElementById('passwordError');
        const allowBtn = document.getElementById('allowActionBtn');

        if (!passwordInput || !this.pendingAction) return;

        const password = passwordInput.value;
        if (!password) {
            this.showPasswordError('Please enter your admin password');
            return;
        }

        // Disable button
        allowBtn.disabled = true;
        allowBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Verifying...';

        try {
            const response = await fetch('/api/admin/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password,
                    context: this.pendingAction.action.type,
                    rememberSession: rememberSession?.checked || false,
                }),
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                // Store session token if remember is checked
                if (rememberSession?.checked && data.sessionToken) {
                    this.sessionToken = data.sessionToken;
                    this.sessionExpiry = Date.now() + (60 * 60 * 1000); // 1 hour
                }

                // Resolve the promise
                this.pendingAction.resolve({
                    allowed: true,
                    sessionToken: data.sessionToken,
                });

                // Hide overlay
                this.hidePasswordPrompt();
            } else {
                this.showPasswordError(data.error || 'Invalid password');
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            this.showPasswordError('Network error. Please try again.');
        } finally {
            // Re-enable button
            allowBtn.disabled = false;
            allowBtn.innerHTML = '<i class="bi bi-shield-check"></i> Allow Action';
        }
    }

    denyAction() {
        if (this.pendingAction) {
            this.pendingAction.resolve({ allowed: false });
        }
        this.hidePasswordPrompt();
    }

    hidePasswordPrompt() {
        const overlay = document.getElementById('passwordPromptOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        this.pendingAction = null;
    }

    showPasswordError(message) {
        const errorDiv = document.getElementById('passwordError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }
}

// Initialize security manager when DOM is ready
let securityManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        securityManager = new SecurityManager();
    });
} else {
    securityManager = new SecurityManager();
}

// Export for use in other modules
window.securityManager = securityManager;

// Made with Bob