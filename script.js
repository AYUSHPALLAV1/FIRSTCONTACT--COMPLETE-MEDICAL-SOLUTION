const API_URL = 'http://localhost:5001/api/auth';

// Basic Tab Switching Logic
function switchTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    // Activate selected tab and form
    if (tab === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

// Display Message Helper
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = `message ${type}`;
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
            // Store token
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            console.log('Token stored:', data.data.token);
            
            // Redirect or update UI (For demo, just alert)
            setTimeout(() => {
                alert(`Welcome back, ${data.data.user.name}!`);
            }, 1000);
        } else {
            showMessage('loginMessage', data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Server error. Please try again.', 'error');
        console.error(error);
    }
});

// Handle Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, role, password })
        });

        const data = await res.json();

        if (data.success) {
            showMessage('registerMessage', 'Registration successful! Redirecting to login...', 'success');
            
            // Redirect to login tab after 1.5 seconds
            setTimeout(() => {
                switchTab('login');
                // Optional: Pre-fill email for convenience
                document.getElementById('loginEmail').value = email;
                showMessage('loginMessage', 'Please login with your new account.', 'success');
                // Clear registration form
                document.getElementById('registerForm').reset();
                document.getElementById('registerMessage').textContent = '';
            }, 1500);
        } else {
            const errorMsg = data.errors ? data.errors[0] : data.message;
            showMessage('registerMessage', errorMsg || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('registerMessage', 'Server error. Please try again.', 'error');
        console.error(error);
    }
});
