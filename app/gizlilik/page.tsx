import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | HesapMatik",
  description: "HesapMatik'in çerez kullanımı, veri işleme ve KVKK kapsamındaki aydınlatma yükümlülükleri hakkında bilgi.",
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold font-syne mb-8">
        Gizlilik Politikası ve <span className="gradient-text">KVKK</span> Aydınlatma Metni
      </h1>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">1. Veri Sorumlusu</h2>
          <p>
            HesapMatik ("Site"), hesapmatik.site alan adı altında hizmet veren ücretsiz bir hesaplama
            aracı platformudur. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili
            mevzuat kapsamında kullanıcıları bilgilendirmek amacıyla hazırlanmıştır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">2. İşlenen Veriler ve Toplama Yöntemi</h2>
          <p>
            Hesaplayıcılara girdiğiniz değerler (maaş, kira, kredi tutarı vb.) yalnızca tarayıcınızda,
            sizin cihazınızda hesaplanır; bu değerler sunucularımıza gönderilmez veya kaydedilmez.
            İstisna: "AI ile Açıklat" özelliğini kullandığınızda, girdiğiniz değerler ve sonuç, açıklama
            üretmek amacıyla üçüncü taraf bir yapay zeka servis sağlayıcısına (Groq) iletilir ve
            kalıcı olarak saklanmaz.
          </p>
          <p className="mt-2">
            Ayrıca site kullanımını analiz etmek amacıyla anonim/istatistiksel ölçüm verileri
            (ziyaret edilen sayfa, tarayıcı bilgisi vb.) Vercel Analytics aracılığıyla toplanabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">3. Çerezler</h2>
          <p>
            Site; tema tercihinizi hatırlamak (localStorage) ve Google AdSense aracılığıyla reklam
            göstermek amacıyla çerezler kullanır. Google AdSense, ilgi alanına dayalı reklam sunmak için
            kendi çerezlerini kullanabilir. Çerez tercihinizi site üzerindeki bildirimden yönetebilir,
            tarayıcı ayarlarınızdan tüm çerezleri reddedebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">4. Verilerin Aktarımı</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü kişilerle paylaşılmaz. AI açıklama
            özelliği kullanıldığında ilgili girdi verisi, hizmeti sağlayan Groq Inc. altyapısına iletilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">5. Haklarınız</h2>
          <p>
            KVKK'nın 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
            buna ilişkin bilgi talep etme, işlenme amacını öğrenme, düzeltme veya silinmesini isteme
            haklarına sahipsiniz. Talepleriniz için sayfa altındaki e-posta adresinden bize
            ulaşabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">6. Güncellemeler</h2>
          <p>
            Bu politika, mevzuat veya site işleyişindeki değişikliklere göre güncellenebilir. Güncel
            sürüm her zaman bu sayfada yayınlanır.
          </p>
        </section>
      </div>
    </div>
  );
}
