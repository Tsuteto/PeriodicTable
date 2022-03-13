class PeriodicTableEba extends PeriodicTable {

    initContext(context, mode) {
        if (mode == "jp") {
            context.title = "化学元素<br/>周期表";
            context.forEdu = "<div>教育用</div><div>虚構教育評議委員会発行";
        } else if (mode == "kanji") {
            context.title = "化學元素<br/>周期表";
            context.forEdu = "<div>敎育用</div><div>虛構教育評議委員會發行";
            context.no = "番號";
            context.name.jp = "名稱";
            context.symbol = "記號";
            context.classification = {
                alkaliMetal: "アルカリ金屬",
                alkaliEarthMetal: "アルカリ土類金屬",
                transitionMetal: "遷移金屬",
                otherMetal: "その他の金屬",
                metalloid: "半金屬",
                lanthanoid: "ランタノイド",
                actinoid: "アクチノイド",
                otherNonmetal: "その他の非金屬",
                halogen: "ハロゲン",
                nobleGas: "貴ガス（希ガス）",
                unknown: "不明"
            };
        
        } else if (mode == "en") {
            context.title = "<div>Periodic Table</div><div>of the</div><div>Chemical Elements</div>";
            context.no = "No.";
            context.electronConfig = "Electron Config."
            context.forEdu = "<div>For Education</div><div>Issued by Fictional Council of Education</div>";
        }
        return context;
    }

    init() {
        super.init();

        document.getElementsByClassName("title-left")[0]
                .innerHTML = this.context.forEdu;

        document.querySelectorAll(".label-group :nth-child(1)").forEach(e => {
            let val = e.textContent;
            e.textContent = (val < 10 ? "0" : "") + val;
        });
        document.querySelectorAll(".label-period :nth-child(1)").forEach(e => {
            let val = e.textContent;
            e.textContent = (val < 10 ? "0" : "") + val;
        });
        document.querySelectorAll(
                "#table-lanthanoid label.lanthanoid"
                + "#table-actinoid label.actinoid").forEach(e => {
            e.textContent = "";
        });
    }

    createDiv(text, className) {
        if (className == "no") {
            text = (text < 10 ? "00" : text < 100 ? "0" : "") + text;
        }
        return super.createDiv(text, className);
    }

    getResizeElements() {
        return super.getResizeElements() + ", article.element .no, #title div, .title-left div"
    }
    getStretchElements() {
        return "html[data-mode=kanji] article.label .label-lanthanoid, html[data-mode=kanji] article.label .label-actinoid";
    }
}

let app = new PeriodicTableEba(query);
addEventListener("load", e => app.init());
