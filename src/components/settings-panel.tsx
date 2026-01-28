import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Zap, Eye, EyeOff, Check, X, Plug, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SettingsPanelProps {
  onClose?: () => void;
}

const AVAILABLE_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Recommended)' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Email change states
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  useEffect(() => {
    // Load API key and model from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedModel = localStorage.getItem('openai_model');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConnected(true);
    }
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    // Load current user email
    const loadUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentEmail(user.email);
      }
    };
    loadUserEmail();
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Harap masukkan OpenAI API Key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('Format API Key tidak valid. API Key OpenAI dimulai dengan "sk-"');
      return;
    }

    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKey.trim());
    localStorage.setItem('openai_model', selectedModel);
    
    setTimeout(() => {
      setIsSaving(false);
      setIsConnected(true);
      toast.success('🎉 Berhasil Terhubung!', {
        description: `Mesin AI ${AVAILABLE_MODELS.find(m => m.value === selectedModel)?.label} siap digunakan untuk Judul, Bab 1-5, dan Daftar Pustaka.`,
      });
      
      if (onClose) {
        onClose();
      }
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('openai_model');
    setApiKey('');
    setSelectedModel('gpt-4o-mini');
    setIsConnected(false);
    toast.info('Koneksi API telah diputus');
  };
  
  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error('Harap masukkan email baru');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Format email tidak valid');
      return;
    }
    
    if (newEmail === currentEmail) {
      toast.error('Email baru sama dengan email saat ini');
      return;
    }
    
    setIsUpdatingEmail(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim()
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Email berhasil diubah!', {
        description: 'Link konfirmasi telah dikirim ke email baru Anda. Silakan cek inbox dan klik link untuk mengaktifkan email baru.',
      });
      setNewEmail('');
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast.error('Gagal mengubah email', {
        description: error.message || 'Terjadi kesalahan. Silakan coba lagi.'
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2416]/60 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#F9F6F1] border-[#D4A574]/30 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-[#D4A574]/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#6B9080] flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-fraunces text-[#2C2416]">
                  Pengaturan
                </CardTitle>
                <CardDescription className="text-[#2C2416]/60 font-manrope">
                  Kelola akun dan koneksi AI Anda
                </CardDescription>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#2C2416]/5 hover:bg-[#2C2416]/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#2C2416]/60" />
              </button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#D4A574]/10">
              <TabsTrigger 
                value="ai" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#2C2416] font-manrope"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mesin AI
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#2C2416] font-manrope"
              >
                <Mail className="w-4 h-4 mr-2" />
                Akun
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="space-y-5 mt-5">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg border-2 ${isConnected ? 'bg-[#6B9080]/10 border-[#6B9080]/30' : 'bg-[#D4A574]/5 border-[#D4A574]/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[#6B9080] animate-pulse' : 'bg-[#D4A574]'}`} />
                  <span className="text-sm font-manrope font-medium text-[#2C2416]">
                    {isConnected ? '✓ Terhubung dengan OpenAI' : '○ Belum terhubung'}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 bg-[#2C2416]/5 rounded-lg">
                <h4 className="text-sm font-manrope font-semibold text-[#2C2416] mb-2">
                  📌 Cara Mendapatkan API Key:
                </h4>
                <ol className="text-sm text-[#2C2416]/70 space-y-1 list-decimal list-inside font-newsreader">
                  <li>Kunjungi <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#6B9080] underline hover:text-[#6B9080]/80">platform.openai.com/api-keys</a></li>
                  <li>Login atau buat akun OpenAI</li>
                  <li>Klik "Create new secret key"</li>
                  <li>Salin dan tempelkan di kolom bawah</li>
                </ol>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-sm font-manrope font-semibold text-[#2C2416]">
                  Masukkan API Key (sk-...)
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-xxxxxxxxxxxxxxxx"
                    className="pr-10 font-mono text-sm bg-white border-2 border-[#D4A574]/30 focus:border-[#6B9080] focus:ring-[#6B9080]/20 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C2416]/40 hover:text-[#2C2416]/80 transition-colors"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-manrope font-semibold text-[#2C2416]">
                  Pilih Model AI
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full h-12 bg-white border-2 border-[#D4A574]/30 focus:border-[#6B9080] focus:ring-[#6B9080]/20 font-manrope">
                    <SelectValue placeholder="Pilih model AI" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F9F6F1] border-[#D4A574]/30">
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem 
                        key={model.value} 
                        value={model.value}
                        className="font-manrope hover:bg-[#D4A574]/10 cursor-pointer"
                      >
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#2C2416]/50 font-newsreader">
                  GPT-4o Mini memberikan keseimbangan terbaik antara kualitas dan biaya.
                </p>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-2 p-3 bg-[#6B9080]/5 rounded-lg">
                <Check className="w-4 h-4 text-[#6B9080] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#2C2416]/70 font-newsreader">
                  API Key Anda disimpan <strong>hanya di browser</strong> dan tidak dikirim ke server kami. Aman dan privat.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !apiKey.trim()}
                  className="flex-1 bg-gradient-to-r from-[#6B9080] to-[#5a7a6b] hover:from-[#5a7a6b] hover:to-[#4a6a5b] text-white font-manrope font-semibold shadow-lg h-12 text-base"
                >
                  <Plug className="w-5 h-5 mr-2" />
                  {isSaving ? 'Menghubungkan...' : 'Simpan & Hubungkan'}
                </Button>
                
                {isConnected && (
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50 font-manrope h-12"
                  >
                    Putuskan
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-5 mt-5">
              {/* Current Email Display */}
              <div className="p-4 rounded-lg bg-[#6B9080]/10 border-2 border-[#6B9080]/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#6B9080]" />
                  <div>
                    <p className="text-xs font-manrope text-[#2C2416]/60">Email saat ini:</p>
                    <p className="text-sm font-manrope font-semibold text-[#2C2416]">
                      {currentEmail || 'Tidak tersedia'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Email Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newEmail" className="text-sm font-manrope font-semibold text-[#2C2416]">
                    Email Baru
                  </Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="emailbaru@example.com"
                    className="mt-2 bg-white border-2 border-[#D4A574]/30 focus:border-[#6B9080] focus:ring-[#6B9080]/20 h-12 font-manrope"
                    disabled={isUpdatingEmail}
                  />
                </div>

                <div className="p-3 bg-[#D4A574]/5 rounded-lg">
                  <p className="text-xs text-[#2C2416]/70 font-newsreader">
                    ℹ️ Setelah mengubah email, Anda akan menerima link konfirmasi di email baru. 
                    Silakan klik link tersebut untuk mengaktifkan email baru Anda.
                  </p>
                </div>

                <Button
                  onClick={handleUpdateEmail}
                  disabled={isUpdatingEmail || !newEmail.trim()}
                  className="w-full bg-gradient-to-r from-[#6B9080] to-[#5a7a6b] hover:from-[#5a7a6b] hover:to-[#4a6a5b] text-white font-manrope font-semibold shadow-lg h-12"
                >
                  {isUpdatingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Ubah Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export function getSelectedModel(): string {
  return localStorage.getItem('openai_model') || 'gpt-4o-mini';
}
