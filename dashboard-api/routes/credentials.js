const express = require('express');
const router = express.Router();

// Get all credentials (without values)
router.get('/', (req, res) => {
  try {
    const { db } = req.app.locals;
    const credentials = db.getAllCredentials();
    
    res.json({
      success: true,
      data: credentials,
      count: credentials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific credential (decrypted)
router.get('/:name', (req, res) => {
  try {
    const { db, vault } = req.app.locals;
    const credential = db.getCredential(req.params.name);
    
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Decrypt the value
    const decryptedValue = vault.decrypt({
      encrypted: credential.encrypted_value,
      iv: credential.iv,
      salt: credential.iv, // Using IV as salt for simplicity
      tag: credential.encrypted_value.slice(-32) // Last 32 chars as tag
    });
    
    // Update last used timestamp
    db.updateCredentialLastUsed(req.params.name);
    
    res.json({
      success: true,
      data: {
        name: credential.name,
        value: decryptedValue,
        service: credential.service,
        last_used: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create or update credential
router.post('/', (req, res) => {
  try {
    const { db, vault, broadcast } = req.app.locals;
    const { name, value, service } = req.body;
    
    // Validate required fields
    if (!name || !value) {
      return res.status(400).json({
        success: false,
        error: 'name and value are required'
      });
    }
    
    // Validate credential strength
    const strength = vault.validateCredentialStrength(value);
    
    if (strength.level === 'weak') {
      return res.status(400).json({
        success: false,
        error: 'Credential is too weak',
        strength: strength
      });
    }
    
    // Encrypt the credential
    const encrypted = vault.encrypt(value);
    
    // Store in database
    db.saveCredential(
      name,
      encrypted.encrypted + encrypted.tag, // Combine encrypted and tag
      encrypted.iv,
      service || null
    );
    
    // Log audit event
    db.logAudit(
      'credential_saved',
      req.headers['x-user'] || 'system',
      `credential:${name}`,
      { service, strength: strength.level },
      req.ip
    );
    
    // Broadcast update (without value)
    broadcast({
      type: 'credential_updated',
      data: {
        name,
        service,
        action: 'created'
      },
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Credential saved successfully',
      data: {
        name,
        service,
        strength: strength.level
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update credential
router.put('/:name', (req, res) => {
  try {
    const { db, vault, broadcast } = req.app.locals;
    const name = req.params.name;
    const { value, service } = req.body;
    
    // Check if credential exists
    const existing = db.getCredential(name);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Validate required fields
    if (!value) {
      return res.status(400).json({
        success: false,
        error: 'value is required'
      });
    }
    
    // Validate credential strength
    const strength = vault.validateCredentialStrength(value);
    
    if (strength.level === 'weak') {
      return res.status(400).json({
        success: false,
        error: 'Credential is too weak',
        strength: strength
      });
    }
    
    // Encrypt the credential
    const encrypted = vault.encrypt(value);
    
    // Update in database
    db.saveCredential(
      name,
      encrypted.encrypted + encrypted.tag,
      encrypted.iv,
      service || existing.service
    );
    
    // Log audit event
    db.logAudit(
      'credential_updated',
      req.headers['x-user'] || 'system',
      `credential:${name}`,
      { service: service || existing.service, strength: strength.level },
      req.ip
    );
    
    // Broadcast update
    broadcast({
      type: 'credential_updated',
      data: {
        name,
        service: service || existing.service,
        action: 'updated'
      },
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Credential updated successfully',
      data: {
        name,
        service: service || existing.service,
        strength: strength.level
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete credential
router.delete('/:name', (req, res) => {
  try {
    const { db, broadcast } = req.app.locals;
    const name = req.params.name;
    
    // Check if credential exists
    const existing = db.getCredential(name);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }
    
    // Delete from database
    db.deleteCredential(name);
    
    // Log audit event
    db.logAudit(
      'credential_deleted',
      req.headers['x-user'] || 'system',
      `credential:${name}`,
      { service: existing.service },
      req.ip
    );
    
    // Broadcast update
    broadcast({
      type: 'credential_updated',
      data: {
        name,
        action: 'deleted'
      },
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Credential deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Validate credential strength
router.post('/validate', (req, res) => {
  try {
    const { vault } = req.app.locals;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({
        success: false,
        error: 'value is required'
      });
    }
    
    const strength = vault.validateCredentialStrength(value);
    
    res.json({
      success: true,
      data: strength
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate secure token
router.post('/generate', (req, res) => {
  try {
    const { vault } = req.app.locals;
    const length = parseInt(req.body.length) || 32;
    
    if (length < 16 || length > 128) {
      return res.status(400).json({
        success: false,
        error: 'Length must be between 16 and 128'
      });
    }
    
    const token = vault.generateToken(length);
    
    res.json({
      success: true,
      data: {
        token,
        length: token.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
