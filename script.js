let selectedSurah = "";let selectedSurahIndex = -1;let currentAyahIndex = -1;
let method = "surahs";
let ayahs = {};
fetch('./soar.json')
    .then(response => response.json())
    .then(data => {
        ayahs = data;
    });
let pages = {};
fetch('./pages.json')
    .then(response => response.json())
    .then(data => {
        pages = data;
    });

function get_randomAyah(data, from_key, to_key, from_index = null, to_index = null) {
    // let data = {
    //     "a": [1, 2, 3, 4],
    //     "b": [5, 6],
    //     "c": [7, 8, 9]
    // };
    
    // let from_key = "a";
    // let to_key = "b";
    // ==> {value: 9, key: "c", index: 2}
    
    // استخراج المفاتيح بين `from_key` و `to_key` بناءً على ترتيبهم
    let keys = Object.keys(data);
    let startIndex = keys.indexOf(from_key);
    let endIndex = keys.indexOf(to_key);
    
    // التحقق من صحة النطاق
    if (startIndex !== -1 && endIndex !== -1 && (startIndex < endIndex || (startIndex == endIndex && from_index <= to_index))) {
        // دمج العناصر بين `from_key` و `to_key` مع تحديد مواقعها
        let mergedArray = keys
            .slice(startIndex, endIndex + 1) // احصل على المفاتيح من `from_key` إلى `to_key`
            .flatMap((key, keyIndex) => {
                let values = data[key];
                
                // إذا كنا على مفتاح البداية أو النهاية، نستخدم الفهرس المحدد
                let start = key === from_key && from_index !== null ? from_index : 0;
                let end = key === to_key && to_index !== null ? to_index + 1 : values.length;

                // قطع القيم من الفهرس المحدد
                return values.slice(start, end).map((value, index) => ({
                    value,
                    key,
                    index: key === from_key ? index + start : index // تعديل الفهرس فقط للمفتاح الأول
                }));
            });

        // اختيار عنصر عشوائي
        console.log(mergedArray);
        let randomItem = mergedArray[Math.floor(Math.random() * mergedArray.length)];
    
        return { value: randomItem.value, key: randomItem.key, index: randomItem.index };
    } else {
        // النطاق معكوس
        return get_randomAyah(data, to_key, from_key, to_index, from_index);
    }
}

function startTest() {
    let from_surah = method == "surahs"? document.getElementById('start-sorah').value : (method == "ayahs"? document.getElementById('ayat-from-surah').value : pages[parseInt(document.getElementById('pages-from-page').value)-1]["from_sura"]);
    let to_surah = method == "surahs"? document.getElementById('end-sorah').value : (method == "ayahs"? document.getElementById('ayat-to-surah').value : pages[parseInt(document.getElementById('pages-to-page').value)-1]["to_sura"]);

    let from_ayah = method == "surahs"? null : (method == "ayahs"? parseInt(document.getElementById('ayat-from-ayah').value) : pages[parseInt(document.getElementById('pages-from-page').value)-1]["from_ayah"]);
    let to_ayah = method == "surahs"? null : (method == "ayahs"? parseInt(document.getElementById('ayat-to-ayah').value) : pages[parseInt(document.getElementById('pages-to-page').value)-1]["to_ayah"]);
    
    let randomAyah = from_ayah == null || to_ayah == null? get_randomAyah(ayahs, from_surah, to_surah, from_ayah, to_ayah) : get_randomAyah(ayahs, from_surah, to_surah, from_ayah - 1, to_ayah - 1);
    selectedSurah = randomAyah.key;
    selectedSurahIndex = Object.keys(ayahs).indexOf(selectedSurah);
    currentAyahIndex = randomAyah.index;

    displayAyah();

    document.getElementById('aya').style.display = 'block';
    document.getElementById('surah-name').style.display = 'block';
    document.getElementById('buttons-container').style.display = 'grid';
    document.getElementById('top-buttons').style.display = 'none';
    document.getElementById('start-test').style.display = 'none';
    
    document.querySelectorAll(".soar-method.cont")[0].style.display = 'none';
    document.querySelectorAll(".pages-method.cont")[0].style.display = 'none';
    document.querySelectorAll(".ayat-method.cont")[0].style.display = 'none';
}

function backToStart() {
    currentAyahIndex = -1;
    selectedSurahIndex = -1;
    document.getElementById('aya').style.display = 'none';
    document.getElementById('surah-name').style.display = 'none';
    document.getElementById('buttons-container').style.display = 'none';
    document.getElementById('top-buttons').style.display = 'flex';
    document.getElementById('start-test').style.display = 'flex';
    
    activateMethod(method);
}

function displayAyah() {
    document.getElementById('aya').style.display = '';
    document.getElementById('aya').innerText = ayahs[selectedSurah][currentAyahIndex];
    document.getElementById('surah-name').innerText = `سورة ${selectedSurah}`;
}

function nextAyah() {
    if (currentAyahIndex < ayahs[selectedSurah].length - 1) {
        currentAyahIndex++;
    } else {
        selectedSurahIndex++;
        selectedSurah = Object.keys(ayahs)[selectedSurahIndex];
        currentAyahIndex = 0;
    }
    
    displayAyah();
}

function previousAyah() {
    if (currentAyahIndex > 0) {
        currentAyahIndex--;
    } else {
        selectedSurahIndex--;
        selectedSurah = Object.keys(ayahs)[selectedSurahIndex];
        currentAyahIndex = ayahs[selectedSurah].length - 1;
    }

    displayAyah();
}

function activateMethod(activeId) {
    document.querySelectorAll('#top-buttons button').forEach(button => {
        if (button.id === activeId) {
            button.classList.add('active');
            method = activeId;

            // إظهار طريقة الإختيار
            if(activeId == 'surahs') {
                document.querySelector('.soar-method').style.display = 'flex';
                document.querySelector('.ayat-method').style.display = 'none';
                document.querySelector('.pages-method').style.display = 'none';
            } else if(activeId == 'ayahs') {
                document.querySelector('.ayat-method').style.display = 'flex';
                document.querySelector('.soar-method').style.display = 'none';
                document.querySelector('.pages-method').style.display = 'none';
            } else if(activeId == 'pages') {
                document.querySelector('.pages-method').style.display = 'flex';
                document.querySelector('.ayat-method').style.display = 'none';
                document.querySelector('.soar-method').style.display = 'none';
            }
        } else {
            button.classList.remove('active');
        }
    });
}

document.querySelectorAll('#top-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        activateMethod(button.id);
    });
});

document.addEventListener('keydown', function(event) {
    if (currentAyahIndex != -1) {
        if (event.key === 'ArrowRight') {
            previousAyah();
        } else if (event.key === 'ArrowLeft') {
            nextAyah();
        }
    }

    if (event.key === 'Enter') {
        startTest();
    } else if (event.key === 'Escape') {
        backToStart();
    }
});

window.onload = function() {
    activateMethod('surahs');
};
