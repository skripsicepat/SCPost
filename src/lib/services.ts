import { supabase } from './supabase';
import { Subscription, Chapter } from '@/types/app';

export interface SubscriptionService {
  checkSubscriptionStatus(userId: string): Promise<Subscription | null>;
  createSubscription(userId: string, transactionId: string, amount: number): Promise<Subscription>;
  renewSubscription(userId: string, transactionId: string): Promise<Subscription>;
  isSubscriptionActive(userId: string): Promise<boolean>;
}

export interface RevisionService {
  purchaseRevisions(userId: string, chapterId: string, transactionId: string): Promise<number>;
  decrementRevisionCount(chapterId: string): Promise<number>;
  getRevisionCount(chapterId: string): Promise<number>;
  recordRevision(chapterId: string, feedback: string, previousContent: string, newContent: string): Promise<void>;
  getRevisionHistory(chapterId: string): Promise<RevisionHistoryItem[]>;
}

export interface RevisionHistoryItem {
  id: string;
  chapterId: string;
  feedback: string;
  previousContent: string;
  newContent: string;
  createdAt: string;
}

export const subscriptionService: SubscriptionService = {
  async checkSubscriptionStatus(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      if (!data) return null;

      const expiryDate = new Date(data.expiry_date);
      const now = new Date();
      const isExpired = expiryDate < now;

      if (isExpired && data.status === 'active') {
        await supabase
          .from('subscriptions')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .eq('id', data.id);

        return {
          id: data.id,
          userId: data.user_id,
          paymentDate: data.payment_date,
          expiryDate: data.expiry_date,
          amount: data.amount,
          status: 'expired',
          paymentMethod: data.payment_method,
          transactionId: data.transaction_id,
        };
      }

      return {
        id: data.id,
        userId: data.user_id,
        paymentDate: data.payment_date,
        expiryDate: data.expiry_date,
        amount: data.amount,
        status: data.status,
        paymentMethod: data.payment_method,
        transactionId: data.transaction_id,
      };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }
  },

  async createSubscription(userId: string, transactionId: string, amount: number): Promise<Subscription> {
    const paymentDate = new Date();
    const expiryDate = new Date(paymentDate);
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        payment_date: paymentDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
        amount,
        status: 'active',
        transaction_id: transactionId,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create subscription: ' + error.message);
    }

    return {
      id: data.id,
      userId: data.user_id,
      paymentDate: data.payment_date,
      expiryDate: data.expiry_date,
      amount: data.amount,
      status: data.status,
      transactionId: data.transaction_id,
    };
  },

  async renewSubscription(userId: string, transactionId: string): Promise<Subscription> {
    return subscriptionService.createSubscription(userId, transactionId, 399000);
  },

  async isSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await subscriptionService.checkSubscriptionStatus(userId);
    if (!subscription) return false;

    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();

    return subscription.status === 'active' && expiryDate > now;
  },
};

export const revisionService: RevisionService = {
  async purchaseRevisions(userId: string, chapterId: string, transactionId: string): Promise<number> {
    const { error: purchaseError } = await supabase
      .from('revision_purchases')
      .insert({
        user_id: userId,
        chapter_id: chapterId,
        amount: 99000,
        revisions_added: 5,
        transaction_id: transactionId,
      });

    if (purchaseError) {
      throw new Error('Failed to record revision purchase: ' + purchaseError.message);
    }

    const { data: chapterData, error: fetchError } = await supabase
      .from('chapters')
      .select('revision_count')
      .eq('id', chapterId)
      .single();

    if (fetchError) {
      throw new Error('Failed to fetch chapter: ' + fetchError.message);
    }

    const newCount = (chapterData.revision_count || 0) + 5;

    const { error: updateError } = await supabase
      .from('chapters')
      .update({ 
        revision_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chapterId);

    if (updateError) {
      throw new Error('Failed to update revision count: ' + updateError.message);
    }

    return newCount;
  },

  async decrementRevisionCount(chapterId: string): Promise<number> {
    const { data: chapterData, error: fetchError } = await supabase
      .from('chapters')
      .select('revision_count')
      .eq('id', chapterId)
      .single();

    if (fetchError) {
      throw new Error('Failed to fetch chapter: ' + fetchError.message);
    }

    if ((chapterData.revision_count || 0) <= 0) {
      throw new Error('No revisions remaining for this chapter');
    }

    const newCount = Math.max(0, (chapterData.revision_count || 0) - 1);

    const { error: updateError } = await supabase
      .from('chapters')
      .update({ 
        revision_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chapterId);

    if (updateError) {
      throw new Error('Failed to update revision count: ' + updateError.message);
    }

    return newCount;
  },

  async recordRevision(chapterId: string, feedback: string, previousContent: string, newContent: string): Promise<void> {
    await revisionService.decrementRevisionCount(chapterId);

    const { error } = await supabase
      .from('revision_history')
      .insert({
        chapter_id: chapterId,
        feedback,
        previous_content: previousContent,
        new_content: newContent,
      });

    if (error) {
      throw new Error('Failed to record revision history: ' + error.message);
    }
  },

  async getRevisionHistory(chapterId: string): Promise<RevisionHistoryItem[]> {
    const { data, error } = await supabase
      .from('revision_history')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch revision history: ' + error.message);
    }

    return (data || []).map(item => ({
      id: item.id,
      chapterId: item.chapter_id,
      feedback: item.feedback,
      previousContent: item.previous_content,
      newContent: item.new_content,
      createdAt: item.created_at,
    }));
  },

  async getRevisionCount(chapterId: string): Promise<number> {
    const { data, error } = await supabase
      .from('chapters')
      .select('revision_count')
      .eq('id', chapterId)
      .single();

    if (error) {
      throw new Error('Failed to fetch revision count: ' + error.message);
    }

    return data.revision_count || 0;
  },
};

export interface MidtransService {
  createTransaction(orderId: string, amount: number, email: string, firstName?: string): Promise<string>;
}

export const midtransService: MidtransService = {
  async createTransaction(orderId: string, amount: number, email: string, firstName?: string): Promise<string> {
    const requestBody = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        email,
        first_name: firstName || email.split('@')[0],
      },
      item_details: [
        {
          id: 'skripsi-cepat-subscription',
          name: 'SkripsiCepat - Akses 30 Hari',
          price: amount,
          quantity: 1,
        },
      ],
    };

    // Try different function names in case of slug mismatch
    const functionNames = [
      'midtrans-proxy',
      'supabase-functions-midtrans-proxy',
    ];

    let lastError: unknown = null;
    
    for (const functionName of functionNames) {
      try {
        console.log(`Trying to invoke edge function: ${functionName}`);
        
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: requestBody,
        });

        console.log('Edge function response:', { data, error });

        if (error) {
          console.error(`Error with ${functionName}:`, error);
          lastError = error;
          continue;
        }

        if (!data) {
          lastError = new Error('No data returned from payment gateway');
          continue;
        }

        // Check for error in response body
        if (data.error) {
          if (data.code === 'MISSING_SERVER_KEY') {
            throw new Error('Konfigurasi server belum lengkap. Silakan hubungi admin.');
          }
          throw new Error(data.error);
        }

        if (!data.token) {
          console.error('No token in response:', data);
          throw new Error('Token pembayaran tidak diterima dari gateway');
        }

        return data.token;
      } catch (invokeError: any) {
        console.error(`Failed with ${functionName}:`, invokeError);
        lastError = invokeError;
        // Continue to try next function name
      }
    }

    // If all attempts failed
    if (lastError instanceof Error) throw lastError;
    throw new Error(typeof lastError === 'string' ? lastError : 'Gagal menghubungi payment gateway');
  },
};

export interface ThesisService {
  createThesis(userId: string, subscriptionId: string, title: string, fakultas: string, jurusan: string, peminatan?: string): Promise<string>;
  getThesis(thesisId: string): Promise<any>;
  createChapter(thesisId: string, chapterType: Chapter): Promise<string>;
  updateChapterContent(chapterId: string, content: string): Promise<void>;
  completeChapter(chapterId: string): Promise<void>;
  saveChaptersData(thesisId: string, chaptersData: Record<string, any>): Promise<void>;
}

export const thesisService: ThesisService = {
  async createThesis(userId: string, subscriptionId: string, title: string, fakultas: string, jurusan: string, peminatan?: string): Promise<string> {
    const { data, error } = await supabase
      .from('thesis_drafts')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        title,
        fakultas,
        jurusan,
        peminatan,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error('Failed to create thesis: ' + error.message);
    }

    const chapters: Chapter[] = ['bab-1', 'bab-2', 'bab-3', 'bab-4', 'bab-5', 'daftar-pustaka'];
    
    for (const chapter of chapters) {
      await thesisService.createChapter(data.id, chapter);
    }

    return data.id;
  },

  async getThesis(thesisId: string): Promise<any> {
    const { data, error } = await supabase
      .from('thesis_drafts')
      .select(`
        *,
        chapters (*)
      `)
      .eq('id', thesisId)
      .single();

    if (error) {
      throw new Error('Failed to fetch thesis: ' + error.message);
    }

    return data;
  },

  async createChapter(thesisId: string, chapterType: Chapter): Promise<string> {
    const { data, error } = await supabase
      .from('chapters')
      .insert({
        thesis_id: thesisId,
        chapter_type: chapterType,
        revision_count: 5,
        is_complete: false,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error('Failed to create chapter: ' + error.message);
    }

    return data.id;
  },

  async updateChapterContent(chapterId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('chapters')
      .update({ 
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chapterId);

    if (error) {
      throw new Error('Failed to update chapter content: ' + error.message);
    }
  },

  async completeChapter(chapterId: string): Promise<void> {
    const { error } = await supabase
      .from('chapters')
      .update({ 
        is_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chapterId);

    if (error) {
      throw new Error('Failed to complete chapter: ' + error.message);
    }
  },

  async saveChaptersData(thesisId: string, chaptersData: Record<string, any>): Promise<void> {
    const { error } = await supabase
      .from('thesis_drafts')
      .update({ 
        chapters_data: chaptersData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', thesisId);

    if (error) {
      throw new Error('Failed to save chapters data: ' + error.message);
    }
  },
};

export interface RevisionPromptConfig {
  chapterType: Chapter;
  currentContent: string;
  userFeedback: string;
  existingReferences?: string[];
  otherChaptersSummary?: string;
}

export function generateRevisionPrompt(config: RevisionPromptConfig): string {
  const { chapterType, currentContent, userFeedback, existingReferences, otherChaptersSummary } = config;

  if (chapterType === 'daftar-pustaka') {
    return `
INSTRUKSI REVISI DAFTAR PUSTAKA:

Anda diminta untuk merevisi Daftar Pustaka berikut berdasarkan masukan pengguna.

ATURAN PENTING:
1. JANGAN menghapus referensi yang sudah ada dan valid
2. Hanya perbaiki format sesuai standar APA 7th Edition
3. Tambahkan referensi yang mungkin tertinggal dari bab-bab sebelumnya
4. Pastikan semua sumber yang dikutip di bab 1-5 tercantum di sini

KONTEN DAFTAR PUSTAKA SAAT INI:
${currentContent}

${existingReferences ? `REFERENSI YANG HARUS DIPERTAHANKAN:\n${existingReferences.join('\n')}` : ''}

MASUKAN PENGGUNA:
${userFeedback}

Berikan Daftar Pustaka yang sudah direvisi dengan format yang benar.
`;
  }

  return `
INSTRUKSI REVISI ${chapterType.toUpperCase()}:

Anda diminta untuk merevisi bab ini berdasarkan masukan pengguna.

ATURAN PENTING:
1. Pertahankan semua referensi ilmiah yang sudah digunakan
2. Jaga konsistensi dengan bab-bab lain yang sudah ditulis
3. Pastikan kualitas akademis minimal 2000 kata
4. Gunakan bahasa Indonesia yang baik dan benar
5. Pertahankan struktur dan format yang sudah ada

${otherChaptersSummary ? `RINGKASAN BAB LAIN (untuk konsistensi):\n${otherChaptersSummary}\n` : ''}

KONTEN BAB SAAT INI:
${currentContent}

MASUKAN PENGGUNA:
${userFeedback}

Berikan konten bab yang sudah direvisi dengan mempertimbangkan semua aturan di atas.
`;
}
