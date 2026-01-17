// JWT Decoder

document.addEventListener('DOMContentLoaded', function() {
    const jwtInput = document.getElementById('jwt-input');
    const decodeBtn = document.getElementById('decode-btn');
    const clearBtn = document.getElementById('clear-btn');
    const decodedOutput = document.getElementById('decoded-output');
    const headerOutput = document.getElementById('header-output');
    const payloadOutput = document.getElementById('payload-output');
    const signatureOutput = document.getElementById('signature-output');
    const headerInfo = document.getElementById('header-info');
    const payloadInfo = document.getElementById('payload-info');
    const signatureInfo = document.getElementById('signature-info');
    const errorMessage = document.getElementById('error-message');

    function base64UrlDecode(str) {
        // Add padding if needed
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        try {
            return decodeURIComponent(
                atob(str)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
        } catch (e) {
            throw new Error('Invalid base64url encoding');
        }
    }

    function formatJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return jsonString;
        }
    }

    function formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString() + ' (' + date.toISOString() + ')';
    }

    function checkExpiration(exp) {
        if (!exp) return '';
        const now = Math.floor(Date.now() / 1000);
        if (exp < now) {
            return '<div style="color: #ef4444; margin-top: 0.5rem;"><strong>⚠ Token has expired</strong></div>';
        } else {
            const timeLeft = exp - now;
            const days = Math.floor(timeLeft / 86400);
            const hours = Math.floor((timeLeft % 86400) / 3600);
            return `<div style="color: #10b981; margin-top: 0.5rem;"><strong>✓ Token expires in ${days} days, ${hours} hours</strong></div>`;
        }
    }

    decodeBtn.addEventListener('click', function() {
        const token = jwtInput.value.trim();
        
        if (!token) {
            showAlert('Please enter a JWT token.', 'error');
            return;
        }

        errorMessage.classList.add('hidden');
        decodedOutput.classList.add('hidden');

        try {
            const parts = token.split('.');
            
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
            }

            const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

            // Decode header
            const headerJson = base64UrlDecode(headerEncoded);
            const headerObj = JSON.parse(headerJson);
            headerOutput.textContent = formatJSON(headerJson);
            headerInfo.innerHTML = `
                <strong>Algorithm:</strong> ${headerObj.alg || 'N/A'}<br>
                <strong>Type:</strong> ${headerObj.typ || 'N/A'}
            `;

            // Decode payload
            const payloadJson = base64UrlDecode(payloadEncoded);
            const payloadObj = JSON.parse(payloadJson);
            payloadOutput.textContent = formatJSON(payloadJson);
            
            let payloadInfoHTML = '';
            if (payloadObj.iss) payloadInfoHTML += `<strong>Issuer:</strong> ${payloadObj.iss}<br>`;
            if (payloadObj.sub) payloadInfoHTML += `<strong>Subject:</strong> ${payloadObj.sub}<br>`;
            if (payloadObj.aud) payloadInfoHTML += `<strong>Audience:</strong> ${payloadObj.aud}<br>`;
            if (payloadObj.exp) {
                payloadInfoHTML += `<strong>Expiration:</strong> ${formatTimestamp(payloadObj.exp)}<br>`;
                payloadInfoHTML += checkExpiration(payloadObj.exp);
            }
            if (payloadObj.iat) payloadInfoHTML += `<strong>Issued At:</strong> ${formatTimestamp(payloadObj.iat)}<br>`;
            if (payloadObj.nbf) payloadInfoHTML += `<strong>Not Before:</strong> ${formatTimestamp(payloadObj.nbf)}<br>`;
            
            payloadInfo.innerHTML = payloadInfoHTML || '<em>No standard claims found</em>';

            // Display signature
            signatureOutput.textContent = signatureEncoded;
            signatureInfo.innerHTML = `
                <strong>Note:</strong> Signature verification requires the secret key. This tool only displays the signature for inspection.
            `;

            decodedOutput.classList.remove('hidden');
            decodedOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            errorMessage.className = 'alert alert-error';
            errorMessage.textContent = 'Error decoding JWT: ' + error.message;
            errorMessage.classList.remove('hidden');
        }
    });

    clearBtn.addEventListener('click', function() {
        jwtInput.value = '';
        decodedOutput.classList.add('hidden');
        errorMessage.classList.add('hidden');
    });
});
