import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import authService from '../../services/authService';

const TwoFactorSetup = ({ onComplete, onCancel }) => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setup2FA();
  }, []);

  const setup2FA = async () => {
    try {
      const result = await authService.setup2FA();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (error) {
      setError('Failed to setup 2FA');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.verify2FA(secret, verificationCode);
      onComplete();
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Setup Two-Factor Authentication
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Scan the QR code with Google Authenticator
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {qrCode && (
          <div className="text-center">
            <img src={qrCode} alt="QR Code" className="mx-auto border rounded-lg" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manual Entry Key
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={secret}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <button
              type="button"
              onClick={copySecret}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleVerify}>
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorSetup;