import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | HesapMatik",
  description: "HesapMatik'i kullanarak kabul ettiğiniz kullanım koşulları ve sorumluluk reddi.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold font-syne mb-8">
        Kullanım <span className="gradient-text">Koşulları</span>
      </h1>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">1. Hizmetin Kapsamı</h2>
          <p>
            HesapMatik, kullanıcılara ücretsiz olarak maaş, kredi, kira, eğitim, sağlık ve inşaat gibi
            alanlarda tahmini hesaplama araçları sunar. Siteyi kullanarak bu koşulları kabul etmiş
            sayılırsınız.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">2. Sorumluluk Reddi</h2>
          <p>
            Sitedeki tüm hesaplama sonuçları, güncel mevzuat ve kamuya açık verilere dayanarak
            hazırlanmış <strong>tahmini</strong> değerlerdir. HesapMatik; resmi bir kurum, mali müşavir,
            avukat veya sağlık danışmanı değildir ve sonuçlar kesin, bağlayıcı veya profesyonel bir
            tavsiye niteliği taşımaz. Önemli mali, hukuki veya sağlıkla ilgili kararlarınızı vermeden
            önce ilgili resmi kurum veya yetkili bir uzmana danışmanız önerilir.
          </p>
          <p className="mt-2">
            "AI ile Açıklat" özelliği ile üretilen açıklamalar da yapay zeka tarafından otomatik olarak
            oluşturulur; bu açıklamalarda hata veya eksiklik bulunabilir, profesyonel danışmanlığın
            yerine geçmez.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">3. Fikri Mülkiyet</h2>
          <p>
            Sitedeki tasarım, metin ve yazılım HesapMatik'e aittir. İzinsiz kopyalanamaz veya ticari
            amaçla çoğaltılamaz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">4. Değişiklikler</h2>
          <p>
            HesapMatik, hizmetlerinde ve bu koşullarda önceden bildirimde bulunmaksızın değişiklik
            yapma hakkını saklı tutar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold font-syne text-gray-900 dark:text-white mb-2">5. İletişim</h2>
          <p>
            Sorularınız için sayfa altındaki e-posta adresinden bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
