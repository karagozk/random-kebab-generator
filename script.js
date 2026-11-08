document.addEventListener('DOMContentLoaded', () => {
    const kebabNameElement = document.getElementById('kebabName');
    const container = document.querySelector('.container');
    let kelimeler = [];

    // Yerel dosya (file://) ile doğrudan açıldığında veya bağlantı sorununda devreye girecek yedek liste
    const YEDEK_KELIMELER = [
        "kapaklardık", "kargolama", "karıncalanmalar", "konukseverleş", "bilgisayar",
        "makine", "otobüs", "helikopter", "tost", "kumanda", "klavye", "şemsiye",
        "çekmece", "pencere", "mandarin", "astronot", "derinlik", "kalorifer", "merdiven"
    ];

    function basHarfleriBuyut(metin) {
        return metin
            .split(' ')
            .map(kelime => kelime ? kelime.charAt(0).toLocaleUpperCase('tr-TR') + kelime.slice(1) : '')
            .join(' ');
    }

    function rastgeleKebapSec() {
        if (!kelimeler || kelimeler.length === 0) {
            kelimeler = YEDEK_KELIMELER;
        }
        const randomIndex = Math.floor(Math.random() * kelimeler.length);
        const secilenKelime = kelimeler[randomIndex];
        kebabNameElement.textContent = `${basHarfleriBuyut(secilenKelime)} Kebabı`;
    }

    async function kelimeleriYukle() {
        try {
            const response = await fetch('kelimeler.txt');
            if (!response.ok) {
                throw new Error(`HTTP Hata: ${response.status}`);
            }

            const data = await response.text();
            kelimeler = data
                .split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);

            if (kelimeler.length === 0) {
                throw new Error("Kelimeler listesi boş.");
            }

            // Sayfa her açıldığında/yenilendiğinde rastgele kebap seç
            rastgeleKebapSec();
        } catch (error) {
            console.warn("kelimeler.txt fetch ile yüklenemedi, yedek liste kullanılıyor:", error);
            kelimeler = YEDEK_KELIMELER;
            rastgeleKebapSec();
        }
    }

    // Kart alanına tıklandığında da yeni bir kebap üretsin
    if (container) {
        container.style.cursor = 'pointer';
        container.title = 'Yeni kebap için tıkla veya sayfayı yenile';
        container.addEventListener('click', rastgeleKebapSec);
    }

    // Başlat
    kelimeleriYukle();
});
