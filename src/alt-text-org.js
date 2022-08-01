import {DCT, diagonalSnake} from "./dct";

function ts() {
    return new Date().toISOString();
}

async function loadImageFromUrl(url) {
    let img = document.createElement("img")
    img.crossOrigin = "Anonymous"

    let promise = new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img)
        }
        img.onerror = (err) => {
            reject(err)
        }
    })

    img.src = url

    return await promise.catch((err) => {
        console.log(`${ts()}: Failed to fetch '${url}'`)
        console.log(err)
        return null
    })
}

async function loadImageByUrl(url) {
    const sourceLoad = await loadImageFromUrl(url)

    if (sourceLoad) {
        return sourceLoad
    } else {
        console.log(`${ts()}: Couldn't load '${url}' from source, proxying`)
        return await loadImageFromUrl(`https://api.alt-text.org/v1/image/proxy?url=${encodeURIComponent(url)}`)
    }
}

async function searchablesForUrl(cv, url) {
    let image = await loadImageByUrl(url)
    if (!image) {
        console.log(`${ts()}: Failed to load image for ${url}`)
        return null
    }

    image.crossOrigin = "Anonymous"

    const canvas = document.createElement("canvas")
    canvas.width = image.width;
    canvas.height = image.height;

    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    const imageData = context
        .getImageData(0, 0, canvas.width, canvas.height);

    return {
        searches: await searchablesForImageData(cv, image, imageData),
        imageDataUrl: canvas.toDataURL()
    }
}

async function fetchAltTextForUrl(cv, url, lang) {
    return await searchablesForUrl(cv, url)
        .then(async searches => {
            if (!searches) {
                throw new Error(`Failed to generate searchables for '${url}'`)
            }

            if (!searches.searches) {
                return {
                    alt_text: null,
                    imageDataUrl: searches.imageDataUrl
                };
            }

            const altTextResult = await fetch("https://api.alt-text.org/v1/alt-library/fetch", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    searches: searches.searches, language: lang || "en"
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

            return {
                imageDataUrl: searches.imageDataUrl,
                altText: altTextResult
            }
        })
}

async function imageBase64ToImageData(imageBase64) {
    const image = document.createElement("img");

    let prom = new Promise(res => {
        image.onload = () => {
            res()
        }
    })

    image.src = imageBase64;
    await prom

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, image.width, image.height)
    ctx.drawImage(image, 0, 0)

    return {
        image: image,
        imageData: ctx.getImageData(0, 0, image.width, image.height),
        imageDataUrl: canvas.toDataURL()
    };
}

async function fetchAltForImageBase64(cv, imageBase64, lang) {
    let {image, imageData, imageDataUrl} = await imageBase64ToImageData(imageBase64)
    return {
        altText: await fetchAltTextForRaw(cv, image, imageData, lang),
        imageDataUrl: imageDataUrl
    }
}

async function fetchAltTextForRaw(cv, image, imageData, lang) {
    let searches = await searchablesForImageData(cv, image, imageData)

    let resp = await fetch("https://api.alt-text.org/v1/alt-library/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            searches: searches, language: lang || "en"
        })
    });

    if (resp.ok) {
        return await resp.json();
    } else if (resp.status === 404) {
        return null;
    } else {
        console.log(`${ts()}: Failed to fetch for raw image hash: ${searches.sha256}: Status: ${resp.status} Body: ${await resp.text()}`);
        return null;
    }
}

function shrinkImage(image, imageData, edgeLength) {
    let canvas = document.createElement("canvas")

    let ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, imageData.width, imageData.height, 0, 0, edgeLength, edgeLength)
    return ctx.getImageData(0, 0, edgeLength, edgeLength);
}

function toGreyscale(imageData) {
    let rgba = new Uint8Array(imageData.data.buffer);
    let greyscale = new Uint8Array(rgba.length / 4);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j++) {
        let intensity = (rgba[i] + rgba[i + 1] + rgba[i + 2]) * (rgba[i + 3] / 255.0);
        greyscale[j] = Math.round((intensity / 765) * 255);
    }

    return greyscale;
}

function getTopLeft(pixels, edgeLength) {
    let res = Array(edgeLength).fill('').map(() => []);

    for (let row = 0; row < edgeLength; row++) {
        for (let col = 0; col < edgeLength; col++) {
            res[row][col] = pixels[row][col];
        }
    }

    return res;
}

function toMatrix(arr, rows, cols) {
    if (arr.length !== rows * cols) {
        throw new Error("Array length must equal requested rows * columns")
    }

    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = arr[(i * cols) + j];
        }
    }

    return matrix;
}

async function searchablesForImageData(cv, image, imageData) {
    return {
        sha256: await sha256Image(image, imageData),
        dct: await dctImage(image, imageData),
        // sift: await siftImage(cv, image)
    }
}

async function siftImage(cv, image) {
    const mat = cv.imread(image)
    const greyscale = cv.cvtColor(mat, cv.COLOR_BGR2GRAY)
    const sift = cv.SIFT_create()
    const keyPoints = sift.detect(greyscale)
    console.log(JSON.stringify(keyPoints))

    return [];
}

function dctImage(image, imageData) {
    return new Promise(resolve => {
        let shrunk = shrinkImage(image, imageData, 32);
        let greyed = toGreyscale(shrunk);
        let matrix = toMatrix(greyed, 32, 32)
        let dct = DCT(matrix);
        let trimmed = getTopLeft(dct, 8);
        let snaked = diagonalSnake(trimmed, 8, 8)
        resolve(snaked)
    })
}

async function sha256Image(image, imageData) {
    let resized = shrinkImage(image, imageData, 100)
    let greyscale = toGreyscale(resized)
    const hash = await crypto.subtle.digest('SHA-256', greyscale)
    const hashArray = Array.from(new Uint8Array(hash));                     // convert buffer to byte array

    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default class AltTextOrgClient {
    // constructor(cvPromise) {
    //     this.cvPromise = cvPromise
    // }

    async searchFile(file) {
        const toBase64 = f => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(f);
        });

        const base64 = await toBase64(file)
        return await fetchAltForImageBase64(null, base64, "ignored")
    }

    async searchUrl(url) {
        return await fetchAltTextForUrl(null, url, "ignored")
    }

    async report(author_uuid, sha256, language, reason) {
        let resp = await fetch("https://api.alt-text.org/v1/alt-library/report", {
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
