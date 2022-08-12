function ts() {
    return new Date().toISOString();
}

async function fetchAltTextForUrl(url, lang) {
    return await fetch("https://api.alt-text.org/library/v1/fetch", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            image: {url}, language: lang || "en",
        })
    }).then(async resp => {
        if (resp.ok) {
            return await resp.json();
        } else if (resp.status === 404) {
            return null;
        } else {
            console.log(`${ts()}: Failed to fetch for url '${url}': Status: ${resp.status} Body: ${await resp.text()}`);
            return null;
        }
    }).catch(err => {
        console.log(`${ts()}: Failed to fetch alt for '${url}: ${err}`);
        return null;
    })
}

async function fetchAltForImageBase64(base64, lang) {
    return await fetch("https://api.alt-text.org/library/v1/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: { base64: base64 }, language: lang || "en"
        })
    }).then(async resp => {
        if (resp.ok) {
            return await resp.json();
        } else if (resp.status === 404) {
            return null;
        } else {
            console.log(`${ts()}: Failed to fetch for raw image: Status: ${resp.status} Body: ${await resp.text()}`);
            return null;
        }
    }).catch(err => {
        console.log(`${ts()}: Error fetching for raw image`);
        console.log(err)
        return null
    })
}

export default class AltTextOrgClient {
    async searchFile(file) {
        const toBase64 = f => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(f);
        });

        const base64 = await toBase64(file);
        return {
            img: base64,
            alt: await fetchAltForImageBase64(base64, "ignored")
        }
    }

    async searchUrl(url) {
        return {
            img: url,
            alt: await fetchAltTextForUrl(url, "ignored")
        }
    }

    async report(author_uuid, sha256, language, reason) {
        let resp = await fetch("https://api.alt-text.org/library/v1/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author_uuid, sha256, language, reason
            })
        });

        return resp.ok
    }
}
