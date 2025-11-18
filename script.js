document.getElementById("btn").addEventListener("click", async () => {
    const domain = document.getElementById("domain").value.trim();
    const proxy = "https://corsproxy.io/?url=";
    const out = document.getElementById("output");

    if (!domain) {
        out.textContent = "Введите домен!";
        return;
    }

    out.textContent = "Загрузка...";

    const targetUrl = "https://nic.kz/cgi-bin/whois";
    const params = new URLSearchParams();
    params.append("query", domain);

    const url = proxy ? proxy + encodeURIComponent(targetUrl) : targetUrl;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        });

        const text = await response.text();

        // Парсим HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Ищем блок <pre>
        const pre = doc.querySelector("pre");
        if (!pre) {
            out.textContent = "Не найден блок <pre> в ответе.";
            return;
        }

        let content = pre.innerHTML;

        // Ищем email Cloudflare
        const cfLink = pre.querySelector("a.__cf_email__");
        if (cfLink && cfLink.dataset.cfemail) {
            const cfemail = cfLink.dataset.cfemail;

            // Функция для расшифровки
            function decodeCfEmail(cfemail) {
                let r = parseInt(cfemail.substr(0, 2), 16);
                let email = '';
                for (let n = 2; n < cfemail.length; n += 2) {
                    let c = parseInt(cfemail.substr(n, 2), 16) ^ r;
                    email += String.fromCharCode(c);
                }
                return email;
            }

            const email = decodeCfEmail(cfemail);
            content = content.replace(cfLink.outerHTML, email);
        }

        // Заменяем HTML-сущности на текст
        content = content.replace(/<br\s*\/?>/gi, "\n")
                         .replace(/&nbsp;/gi, " ")
                         .replace(/&amp;/gi, "&")
                         .replace(/<[^>]+>/g, "");

        out.textContent = content;

    } catch (e) {
        out.textContent = "Ошибка запроса:\n" + e;
    }
});
