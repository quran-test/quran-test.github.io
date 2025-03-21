import yuag
yuag.clear()

# data = yuag.readJSON("soar.json")
data = {}

def change_nums(num: str):
    return int(num.replace("١", "1").replace("٢", "2").replace("٣", "3").replace("٤", "4").replace("٥", "5").replace("٦", "6").replace("٧", "7").replace("٨", "8").replace("٩", "9").replace("٠", "0"))

for sura_num in range(114):
    sura_num += 1
    data[sura_num] = []
    if sura_num > 0:
        sura = yuag.get_soup(f"https://equran.me/read-{sura_num}.html")

        for aya in sura.select(".read-surah li"):
            data[sura_num].append(aya.text.strip())

        yuag.clear()
        print(sura_num)
        yuag.saveJSON(data, "soar.json")

yuag.saveJSON(data, "soar.json")
yuag.doneMessage(0)