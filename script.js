document.addEventListener('DOMContentLoaded', () => {
    const kebabNameElement = document.getElementById('kebabName');
    const container = document.querySelector('.container');
    const tweetBtnContainer = document.getElementById('tweetBtnContainer');
    let kelimeler = [];
    let sonSecilenKebap = "";

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

    function updateTweetButton(kebapAdi) {
        if (!tweetBtnContainer) return;

        // Tweet metni: "KOLTUK KEBABI | Kafeterya Müdürlüğü"
        const tweetText = `${kebapAdi.toLocaleUpperCase('tr-TR')} | Kafeterya Müdürlüğü`;
        const shareUrl = "https://karagozk.github.io/random-kebab-generator/";
        const viaUser = "karagozkaaan";
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&via=${encodeURIComponent(viaUser)}`;

        tweetBtnContainer.innerHTML = '';

        const tweetLink = document.createElement('a');
        tweetLink.href = intentUrl;
        tweetLink.className = 'twitter-share-button';
        tweetLink.setAttribute('data-text', tweetText);
        tweetLink.setAttribute('data-url', shareUrl);
        tweetLink.setAttribute('data-via', viaUser);
        tweetLink.setAttribute('data-lang', 'tr');
        tweetLink.setAttribute('data-size', 'm');
        tweetLink.setAttribute('data-show-count', 'false');
        tweetLink.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> Post`;

        tweetLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(intentUrl, 'twitter-share', 'width=550,height=420,resizable=yes,scrollbars=yes');
        });

        tweetBtnContainer.appendChild(tweetLink);

        // Twitter widgets.js hazır ise iframe'e dönüştür
        if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load(tweetBtnContainer);
        }
    }

    function rastgeleKebapSec() {
        if (!kelimeler || kelimeler.length === 0) {
            kelimeler = YEDEK_KELIMELER;
        }
        const randomIndex = Math.floor(Math.random() * kelimeler.length);
        const secilenKelime = kelimeler[randomIndex];
        sonSecilenKebap = `${basHarfleriBuyut(secilenKelime)} Kebabı`;
        kebabNameElement.textContent = sonSecilenKebap;
        updateTweetButton(sonSecilenKebap);
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

    // Twitter widget kütüphanesini yükle
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));

    if (window.twttr && window.twttr.ready) {
        window.twttr.ready(() => {
            if (sonSecilenKebap) {
                updateTweetButton(sonSecilenKebap);
            }
        });
    }

    // Başlat
    kelimeleriYukle();
});
