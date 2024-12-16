import yuag
yuag.clear()

data = yuag.readJSON("pages.json")

def change_nums(num: str):
    return int(num.replace("١", "1").replace("٢", "2").replace("٣", "3").replace("٤", "4").replace("٥", "5").replace("٦", "6").replace("٧", "7").replace("٨", "8").replace("٩", "9").replace("٠", "0"))

for page_num in range(604):
    page_num += 1

    if page_num > 172:
        page = yuag.get_soup(f"https://equran.me/page-{page_num}.html")

        from_sura = page.select(".juz")[0].text.replace("سورة ", "").replace("متابعة القراءة من ", "").strip().replace("َ", "").replace("ُ", "").replace("ِ", "").replace("ّ", "").replace("ٓ", "")
        from_ayah = change_nums(page.select(".read-surah li")[0].text.split("﴿")[1].split("﴾")[0].strip())

        to_sura = page.select(".juz")[-1].text.replace("سورة ", "").replace("متابعة القراءة من ", "").strip().replace("َ", "").replace("ُ", "").replace("ِ", "").replace("ّ", "").replace("ٓ", "")
        to_ayah = change_nums(page.select(".read-surah li")[-1].text.split("﴿")[1].split("﴾")[0].strip())

        data.append({
            "from_sura": from_sura,
            "from_ayah": from_ayah,
            "to_sura": to_sura,
            "to_ayah": to_ayah
        })

        yuag.clear()
        print(page_num)
        yuag.saveJSON(data, "pages.json")

yuag.saveJSON(data, "pages.json")
yuag.doneMessage(0)