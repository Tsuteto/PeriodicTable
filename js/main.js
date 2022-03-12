(function(d) {
var config = {
    kitId: 'tef5xzv',
    scriptTimeout: 3000,
    async: true
},
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);

var query = (function() {
    let querystr = window.location.search;
    let query = {};
    let re = /[?&]([^=]+)=([^&#]+|.+$)/g;
    while (re.exec(querystr)) {
        query[RegExp.$1] = RegExp.$2;
    }

    let mode = query["mode"] || "en";
    let skin = query["skin"] || "std";

    let $html = document.getElementsByTagName("html")[0];
    $html.setAttribute("data-mode", mode);

    let $head = document.getElementsByTagName("head")[0];

    let skinLink = document.createElement("link");
    skinLink.rel = "stylesheet";
    skinLink.href = `css/skin-${skin}.css`;
    $head.appendChild(skinLink);

    let $script;

    $script = document.createElement("script");
    $script.src = `js/skin-${skin}.js`;
    $head.appendChild($script);

    $script = document.createElement("script");
    $script.src = `js/context_${mode}.js`;
    $head.appendChild($script);

    return query;
})();

class PeriodicTable {
    static GROUP_LIST = {
        1: "IA", 2: "IIA",
        3: "IIIB", 4: "IVB", 5: "VB", 6: "VIB", 7: "VIIB", 8: "VIIIB", 9: "VIIIB", 10: "VIIIB", 11: "IB", 12: "IIB",
        13: "IIIA", 14: "IVA", 15: "VA", 16: "VIA", 17: "VIIA", 18: "VIIIA"
    };

    constructor(query) {
        this.query = query;
    }

    init() {
        this.context = this.initContext(DEFAULT_CONTEXT, this.query.mode);

        let $body = document.getElementsByTagName("body")[0];
        let res = this.query["res"];
        if (res) {
            $body.className = `res-${res}`;
        }

        this.elements = ELEMENT_DATA.map(e => new Element(e));

        let title = document.getElementById("title");
        title.innerHTML = this.context.title;

        this.createElementLegend();
        this.createBlockLegend();
        this.buildTable();

        addEventListener("resize", this.onWindowResized.bind(this));
        setTimeout(this.onWindowResized.bind(this), 1);
    }

    initContext(context) {
        return context;
    }

    buildTable() {
        // MAIN TABLE
        let mainTable = document.getElementById("table-main");

        for (let g = 1; g <= 18; g++) {
            let $cell = this.createGroup(g);
            mainTable.appendChild($cell);
        }
        for (let p = 1; p <= 7; p++) {
            let $cell = this.createPeriod(p);
            mainTable.appendChild($cell);
        }

        this.elements
            .filter(e => e.no <= 118)
            .filter(e => e.group != Group.LANTHANOID)
            .filter(e => e.group != Group.ACTINOID)
            .map(e => this.createCell(e))
            .forEach(cell => mainTable.appendChild(cell));
        mainTable.appendChild(this.createLanthanoidCell());
        mainTable.appendChild(this.createActinoidCell());
        mainTable.appendChild(this.createPyykkoExt("ex6", "block-f", "57-71"));
        mainTable.appendChild(this.createPyykkoExt("ex7", "block-f", "89-103"));

        // LANTHANOID
        let lanthanoidTable = document.getElementById("table-lanthanoid");
        this.elements
            .filter(e => e.group == Group.LANTHANOID)
            .map(e => this.createCell(e))
            .forEach(cell => {
                lanthanoidTable.appendChild(cell);
            });
        lanthanoidTable.appendChild(this.createLanthanoidCell());

        // ACTINOID
        let actinoidTable = document.getElementById("table-actinoid");
        this.elements
            .filter(e => e.group == Group.ACTINOID)
            .map(e => this.createCell(e))
            .forEach(cell => {
                actinoidTable.appendChild(cell);
            });
        actinoidTable.appendChild(this.createActinoidCell());

        // Pyykko s/d/p
        let pyykkoExt1Table = document.getElementById("table-pyykko-sdp");
        this.elements
            .filter(e => e.no > 118)
            .filter(e => "sdp".indexOf(e.block) > -1)
            .map(e => this.createCell(e))
            .forEach(cell => {
                pyykkoExt1Table.appendChild(cell);
            });
        for (let p = 8; p <= 10; p++) {
            pyykkoExt1Table.appendChild(this.createPeriod(p));
        }
        pyykkoExt1Table.appendChild(this.createPyykkoExt("ex8g", "block-g", "121-<br/>138"));
        pyykkoExt1Table.appendChild(this.createPyykkoExt("ex8f", "block-f", "141-<br/>155"));
        pyykkoExt1Table.appendChild(this.createPyykkoExt("ex10", "block-g", "173-"));

        // Pyykko f
        let pyykkoExt2Table = document.getElementById("table-pyykko-f");
        this.elements
            .filter(e => e.block == "f")
            .map(e => this.createCell(e))
            .forEach(cell => {
                pyykkoExt2Table.appendChild(cell);
            });
        for (let p = 6; p <= 8; p++) {
            pyykkoExt2Table.appendChild(this.createPeriod(p));
        }
    
        // Pyykko g
        let pyykkoExt3Table = document.getElementById("table-pyykko-g");
        this.elements
            .filter(e => e.no > 118)
            .filter(e => e.block == "g")
            .map(e => this.createCell(e))
            .forEach(cell => {
                pyykkoExt3Table.appendChild(cell);
            });
        [8, 10].forEach(p => {
            pyykkoExt3Table.appendChild(this.createPeriod(p));
        });
    }

    createCell(e) {
        let cell = document.createElement("article");

        let $noSymbol = document.createElement("div");
        $noSymbol.className = "no-symbol";

        cell.className = `element ${e.group.className} ${e.state.className} block-${e.block}`;
        cell.style = `grid-area: e${e.no}`
        cell.id = "e" + e.no;

        $noSymbol.appendChild(this.createDiv(e.no, "no"));

        let symbol = document.createElement("div");
        symbol.className = "symbol symbol-std";
        symbol.textContent = e.symbol;
        symbol.setAttribute("data-symbol", e.symbol);
        $noSymbol.appendChild(symbol);

        let $ksymbol = document.createElement("div");
        $ksymbol.className = "symbol symbol-kanji";
        $ksymbol.setAttribute("data-symbol", e.symbol);
        $noSymbol.appendChild(this.setKanjiName(e, $ksymbol));

        cell.appendChild($noSymbol);

        cell.appendChild(this.createDiv(e.name.en, "name name-en"));
        cell.appendChild(this.createDiv(e.name.jp, "name name-jp"));
        cell.appendChild(this.createDiv(e.name.jpkana, "name name-jpkana"));
        let $kanjiName = document.createElement("div");
        $kanjiName.className = "name name-kanji";
        cell.appendChild(this.setKanjiName(e, $kanjiName));
        cell.appendChild(this.createDiv(e.mass, "detail mass"));
        cell.appendChild(this.createDiv(this.dispElectronAffinity(e), "detail electron-affinity"));
        cell.appendChild(this.createDiv(this.dispElectronegativity(e), "detail electronegativity"));
        cell.appendChild(this.createDiv(this.dispIonization(e), "detail ionization-energy"));
        cell.appendChild(this.createDiv(this.dispDensity(e), "detail density"));
        cell.appendChild(this.createDiv(this.dispRadius(e), "detail radius"));
        cell.appendChild(this.createDiv(this.dispState(e), "detail state"));
        cell.appendChild(this.createDiv(this.dispMeltingAt(e), "detail melting"));
        cell.appendChild(this.createDiv(this.dispMeltingAtC(e), "detail melting-c"));
        cell.appendChild(this.createDiv(this.dispBoilingAt(e), "detail boiling"));
        cell.appendChild(this.createDiv(this.dispBoilingAtC(e), "detail boiling-c"));
        cell.appendChild(this.createDiv(e.electronConfig.expr, "detail electron-config"));
        cell.appendChild(this.createVerticalElectronConfig(e));
        cell.appendChild(this.createDiv(e.discoveredOn, "detail discover-year"));

        return cell;
    }

    createGroup(g) {
        let $cell = document.createElement("div");
        $cell.className = `label label-group group-${g}`;
        $cell.style = `grid-area: g${g}`;
        let $label1 = document.createElement("div");
        $label1.textContent = g;
        let $label2 = document.createElement("div");
        $label2.textContent = PeriodicTable.GROUP_LIST[g];
        $cell.appendChild($label1);
        $cell.appendChild($label2);
        return $cell;
    }

    createPeriod(p) {
        let $cell = document.createElement("div");
        $cell.className = `label label-period period-${p}`;
        $cell.style = `grid-area: p${p}`;
        let $label1 = document.createElement("div");
        $label1.textContent = p;
        $cell.appendChild($label1);
        return $cell;
    }

    dispElectronAffinity(e) {
        if (!e.electronAffinity) {
            return "&mdash;"
        } else {
            return e.electronAffinity;
        }
    }
    dispElectronegativity(e) {
        if (!e.electronegativity) {
            return "&mdash;"
        } else {
            return e.electronegativity;
        }
    }
    dispDensity(e) {
        if (!e.density) return "&mdash;";
        let val, unit;
        if (e.state == State.GAS) {
            val = Math.floor(e.density * 1000 * 1000) / 1000;
            unit = "g/L";
        } else {
            val = Math.floor(e.density * 1000) / 1000;
            unit = "g/cm³";
        }
        return val.toPrecision(3) + unit;
    }
    dispRadius(e) {
        if (!e.radius) {
            return "&mdash;"
        } else {
            return e.radius + "pm";
        }
    }
    dispIonization(e) {
        if (!e.ionizationEnergy) {
            return "&mdash;"
        } else {
            return Number(e.ionizationEnergy).toPrecision(4) + "eV";
        }
    }
    dispMeltingAt(e) {
        if (!e.meltingAt) {
            return "&mdash;"
        } else {
            return e.meltingAt + "K";
        }
    }
    dispMeltingAtC(e) {
        if (!e.meltingAt) {
            return "&mdash;"
        } else {
            return (e.meltingAt - 273.15).toPrecision(4) + "℃";
        }
    }
    dispBoilingAt(e) {
        if (!e.boilingAt) {
            return "&mdash;"
        } else {
            return e.boilingAt + "K";
        }
    }
    dispBoilingAtC(e) {
        if (!e.boilingAt) {
            return "&mdash;"
        } else {
            return (e.boilingAt - 273.15).toPrecision(4) + "℃";
        }
    }
    dispState(e) {
        switch (e.state) {
            case State.SOLID: return this.context.solid;
            case State.GAS: return this.context.gas;
            case State.LIQUID: return this.context.liquid;
            default: return "&mdash;";
        }
    }

    setKanjiName(e, $parent) {
        if (e.no != 117 && e.no != 118) {
            $parent.textContent = e.name.zh;
        } else {
            ["sans", "serif"].forEach(f => {
                ["h", "l"].forEach(w => {
                    let $svg = this.createSvg(`assets/${e.symbol}-kanji-${f}-${w}.svg#body`);
                    $svg.setAttribute("class", `font-${f} weight-${w}`);
                    $parent.appendChild($svg);
                });
            });
        }
        return $parent;
    }

    createVerticalElectronConfig(e) {
        let $list = document.createElement("div");
        $list.className = "detail electron-config-shell";
        e.electronConfig.shell
            .map(num => this.createDiv(num, "conf-shell-val"))
            .forEach($div => $list.appendChild($div));
        return $list
    }

    createDiv(val, className) {
        let elem = document.createElement("div");
        elem.className = className;
        if (typeof val == "object") {
            elem.appendChild(val);
        } else {
            elem.innerHTML = val;
        }
        return elem;
    }

    createLanthanoidCell() {
        let lanthanoidCell = document.createElement("article");
        lanthanoidCell.className = "label lanthanoid";
        lanthanoidCell.style = "grid-area: lant"
        let lanthanoidLabel = document.createElement("div");
        lanthanoidLabel.className = "label-lanthanoid";
        lanthanoidLabel.innerHTML = this.context.lanthanoid;
        lanthanoidCell.appendChild(lanthanoidLabel);
        return lanthanoidCell;
    }

    createActinoidCell() {
        let actinoidCell = document.createElement("article");
        actinoidCell.className = "label actinoid";
        actinoidCell.style = "grid-area: acti";
        let actinoidLabel = document.createElement("div");
        actinoidLabel.className = "label-actinoid";
        actinoidLabel.innerHTML = this.context.actinoid;
        actinoidCell.appendChild(actinoidLabel);
        return actinoidCell;
    }

    createPyykkoExt(name, block, text) {
        let cell = document.createElement("article");
        cell.className = `label label-pyykko ${block}`;
        cell.style = `grid-area: ${name}`
        let label = document.createElement("div");
        label.className = `label-pyykko-${name}`;
        label.innerHTML = text;
        cell.appendChild(label);
        return cell;
    }

    createElementLegend() {
        let $legend = document.getElementById("legend-elements");

        let $title = document.createElement("div");
        $title.className = "title";
        $title.textContent = this.context.legend;

        let $cell = document.createElement("article");
        $cell.className = "element";

        let $noSymbol = document.createElement("div");
        $noSymbol.className = "no-symbol";

        $noSymbol.appendChild(this.createDiv(this.context.no, "no"));
        $noSymbol.appendChild(this.createDiv(this.context.symbol, "symbol-std"));
        $noSymbol.appendChild(this.createDiv(this.context.symbol, "symbol-kanji"));
        $cell.appendChild($noSymbol);

        $cell.appendChild(this.createDiv(this.context.name.en, "name name-en"));
        $cell.appendChild(this.createDiv(this.context.name.jp, "name name-jp"));
        $cell.appendChild(this.createDiv(this.context.name.jpkana, "name name-jpkana"));
        $cell.appendChild(this.createDiv(this.context.name.kanji, "name name-kanji"));
        $cell.appendChild(this.createDiv(this.context.mass, "detail mass"));
        $cell.appendChild(this.createDiv(this.context.electronAffinity, "detail electron-affinity"));
        $cell.appendChild(this.createDiv(this.context.electronegativity, "detail electronegativity"));
        $cell.appendChild(this.createDiv(this.context.ionizationEnergy, "detail ionization-energy"));
        $cell.appendChild(this.createDiv(this.context.density, "detail density"));
        $cell.appendChild(this.createDiv(this.context.radius, "detail radius"));
        $cell.appendChild(this.createDiv(this.context.state, "detail state"));
        $cell.appendChild(this.createDiv(this.context.meltingAt, "detail melting"));
        $cell.appendChild(this.createDiv(this.context.meltingAtC, "detail melting-c"));
        $cell.appendChild(this.createDiv(this.context.boilingAt, "detail boiling"));
        $cell.appendChild(this.createDiv(this.context.boilingAtC, "detail boiling-c"));
        $cell.appendChild(this.createDiv(this.context.electronConfig, "detail electron-config"));
        $cell.appendChild(this.createDiv(this.context.electronConfig, "detail electron-config-shell"));
        $cell.appendChild(this.createDiv(this.context.discoveredOn, "detail discover-year"));

        $legend.appendChild($title);
        $legend.appendChild($cell);
    }

    createBlockLegend() {
        let $legendBlock = document.getElementById("legend-blocks");

        let $title = document.createElement("div");
        $title.className = "title";
        $title.textContent = this.context.legend;
        $legendBlock.appendChild($title);

        ["s", "p", "d", "f", "g"].forEach(g => {
            let $cell = document.createElement("article");
            $cell.className = `label label-block block-${g}`;
            $legendBlock.appendChild($cell);
        });
    }

    createSvg(svgUrl) {
        let $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let $use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        $use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", svgUrl);
        $svg.appendChild($use);
        return $svg;
    }

    getResizeElements() {
        return "article.element .no-symbol, article.element .name, article.element .detail, article.label div";
    }

    onWindowResized(e) {
        let names = document.querySelectorAll(this.getResizeElements());
        names.forEach(e => {
            let scrollWidth = e.scrollWidth;
            let elemWidth = e.clientWidth;
            if (scrollWidth > elemWidth) {
                let ratio = elemWidth / scrollWidth;
                e.style.transform = `scaleX(${ratio})`;
            } else {
                e.style.transform = "";
            }
        })
    }
}

class Element {
    constructor(data) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                this[key] = data[key];
            }
        }
    }
}

class Group {
    static ALKALI_METAL = new Group("alkali-metal");
    static ALKALI_EARTH_METAL = new Group("alkali-earth-metal");
    static TRANSITION_METAL = new Group("transition-metal");
    static OTHER_METAL = new Group("other-metal");
    static LANTHANOID = new Group("lanthanoid");
    static ACTINOID = new Group("actinoid");
    static SUPERACTINOID = new Group("superactinoid");
    static OTHER_NONMETAL = new Group("other-nonmetal");
    static METALLOID = new Group("metalloid");
    static HALOGEN = new Group("halogen");
    static NOBLE_GAS = new Group("noble-gas");
    static UNKNOWN = new Group("unknown");

    constructor(className) {
        this.className = className;
    }
}

class State {
    static GAS = new State("state-gas");
    static SOLID = new State("state-solid");
    static LIQUID = new State("state-liquid");
    static UNKNOWN = new State("state-unknown");

    constructor(className) {
        this.className = className;
    }
}

const ELEMENT_DATA = [
    {no: 1, symbol: "H", name: {en: "Hy&shy;dro&shy;gen", jp: "水素", jpkana: "すいそ", zh: "氫"}, group: Group.OTHER_NONMETAL, block: "s", mass: "1.008", state: State.GAS, electronAffinity: "72.8", electronegativity: "2.20", ionizationEnergy: "13.598", density: "0.00008988", radius: "120", meltingAt: "13.81", boilingAt: "20.28", electronConfig: {expr: "1s<sup>1</sup>", shell:[1], subshell: [1]}, isSynthetic: false, yearDiscovered: "1766"},
    {no: 2, symbol: "He", name: {en: "He&shy;li&shy;um", jp: "ヘリウム", jpkana: "ヘリウム", zh: "氦"}, group: Group.NOBLE_GAS, block: "s", mass: "4.003", state: State.GAS, electronAffinity: "-48", electronegativity: "", ionizationEnergy: "24.587", density: "0.0001785", radius: "140", meltingAt: "0.95", boilingAt: "4.22", electronConfig: {expr: "1s<sup>2</sup>", shell:[2], subshell: [2]}, isSynthetic: false, yearDiscovered: "1868"},
    {no: 3, symbol: "Li", name: {en: "Li&shy;thi&shy;um", jp: "リチウム", jpkana: "リチウム", zh: "鋰"}, group: Group.ALKALI_METAL, block: "s", mass: "6.941", state: State.SOLID, electronAffinity: "59.6326", electronegativity: "0.98", ionizationEnergy: "5.392", density: "0.534", radius: "182", meltingAt: "453.65", boilingAt: "1615", electronConfig: {expr: "[He] 2s<sup>1</sup>", shell:[2, 1], subshell: [2, 1]}, isSynthetic: false, yearDiscovered: "1817"},
    {no: 4, symbol: "Be", name: {en: "Be&shy;ryl&shy;li&shy;um", jp: "ベリリウム", jpkana: "ベリリウム", zh: "鈹"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "9.012", state: State.SOLID, electronAffinity: "-50", electronegativity: "1.57", ionizationEnergy: "9.323", density: "1.85", radius: "153", meltingAt: "1560", boilingAt: "2744", electronConfig: {expr: "[He] 2s<sup>2</sup>", shell:[2, 2], subshell: [2, 2]}, isSynthetic: false, yearDiscovered: "1798"},
    {no: 5, symbol: "B", name: {en: "Bo&shy;ron", jp: "ホウ素", jpkana: "ホウそ", zh: "硼"}, group: Group.METALLOID, block: "p", mass: "10.81", state: State.SOLID, electronAffinity: "26.989", electronegativity: "2.04", ionizationEnergy: "8.298", density: "2.37", radius: "192", meltingAt: "2348", boilingAt: "4273", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>1</sup>", shell:[2, 3], subshell: [2, 2, 1]}, isSynthetic: false, yearDiscovered: "1808"},
    {no: 6, symbol: "C", name: {en: "Car&shy;bon", jp: "炭素", jpkana: "たんそ", zh: "碳"}, group: Group.OTHER_NONMETAL, block: "p", mass: "12.01", state: State.SOLID, electronAffinity: "121.78", electronegativity: "2.55", ionizationEnergy: "11.26", density: "2.267", radius: "170", meltingAt: "3823", boilingAt: "4098", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>2</sup>", shell:[2, 4], subshell: [2, 2, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 7, symbol: "N", name: {en: "Ni&shy;tro&shy;gen", jp: "窒素", jpkana: "ちっそ", zh: "氮"}, group: Group.OTHER_NONMETAL, block: "p", mass: "14.01", state: State.GAS, electronAffinity: "-0.07", electronegativity: "3.04", ionizationEnergy: "14.534", density: "0.0012506", radius: "155", meltingAt: "63.15", boilingAt: "77.36", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>3</sup>", shell:[2, 5], subshell: [2, 2, 3]}, isSynthetic: false, yearDiscovered: "1772"},
    {no: 8, symbol: "O", name: {en: "Ox&shy;y&shy;gen", jp: "酸素", jpkana: "さんそ", zh: "氧"}, group: Group.OTHER_NONMETAL, block: "p", mass: "16.00", state: State.GAS, electronAffinity: "141", electronegativity: "3.44", ionizationEnergy: "13.618", density: "0.001429", radius: "152", meltingAt: "54.36", boilingAt: "90.2", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>4</sup>", shell:[2, 6], subshell: [2, 2, 4]}, isSynthetic: false, yearDiscovered: "1774"},
    {no: 9, symbol: "F", name: {en: "Flu&shy;o&shy;ri&shy;ne", jp: "フッ素", jpkana: "フッそ", zh: "氟"}, group: Group.HALOGEN, block: "p", mass: "19.00", state: State.GAS, electronAffinity: "328", electronegativity: "3.98", ionizationEnergy: "17.423", density: "0.001696", radius: "135", meltingAt: "53.53", boilingAt: "85.03", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>5</sup>", shell:[2, 7], subshell: [2, 2, 5]}, isSynthetic: false, yearDiscovered: "1670"},
    {no: 10, symbol: "Ne", name: {en: "Ne&shy;on", jp: "ネオン", jpkana: "ネオン", zh: "氖"}, group: Group.NOBLE_GAS, block: "p", mass: "20.18", state: State.GAS, electronAffinity: "-116", electronegativity: "", ionizationEnergy: "21.565", density: "0.0008999", radius: "154", meltingAt: "24.56", boilingAt: "27.07", electronConfig: {expr: "[He] 2s<sup>2</sup> 2p<sup>6</sup>", shell:[2, 8], subshell: [2, 2, 6]}, isSynthetic: false, yearDiscovered: "1898"},
    {no: 11, symbol: "Na", name: {en: "So&shy;di&shy;um", jp: "ナトリウム", jpkana: "ナトリウム", zh: "鈉"}, group: Group.ALKALI_METAL, block: "s", mass: "22.99", state: State.SOLID, electronAffinity: "53", electronegativity: "0.93", ionizationEnergy: "5.139", density: "0.97", radius: "227", meltingAt: "370.95", boilingAt: "1156", electronConfig: {expr: "[Ne] 3s<sup>1</sup>", shell:[2, 8, 1], subshell: [2, 2, 6, 1]}, isSynthetic: false, yearDiscovered: "1807"},
    {no: 12, symbol: "Mg", name: {en: "Mag&shy;ne&shy;si&shy;um", jp: "マグネシウム", jpkana: "マグネシウム", zh: "鎂"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "24.31", state: State.SOLID, electronAffinity: "<0", electronegativity: "1.31", ionizationEnergy: "7.646", density: "1.74", radius: "173", meltingAt: "923", boilingAt: "1363", electronConfig: {expr: "[Ne] 3s<sup>2</sup>", shell:[2, 8, 2], subshell: [2, 2, 6, 2]}, isSynthetic: false, yearDiscovered: "1808"},
    {no: 13, symbol: "Al", name: {en: "A&shy;lu&shy;mi&shy;nium", jp: "アルミニウム", jpkana: "アルミニウム", zh: "鋁"}, group: Group.OTHER_METAL, block: "p", mass: "26.98", state: State.SOLID, electronAffinity: "43", electronegativity: "1.61", ionizationEnergy: "5.986", density: "2.7", radius: "184", meltingAt: "933.437", boilingAt: "2792", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>1</sup>", shell:[2, 8, 3], subshell: [2, 2, 6, 2, 1]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 14, symbol: "Si", name: {en: "Sil&shy;i&shy;con", jp: "ケイ素", jpkana: "ケイそ", zh: "硅"}, group: Group.METALLOID, block: "p", mass: "28.09", state: State.SOLID, electronAffinity: "134", electronegativity: "1.90", ionizationEnergy: "8.152", density: "2.3296", radius: "210", meltingAt: "1687", boilingAt: "3538", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>2</sup>", shell:[2, 8, 4], subshell: [2, 2, 6, 2, 2]}, isSynthetic: false, yearDiscovered: "1854"},
    {no: 15, symbol: "P", name: {en: "Phos&shy;pho&shy;rus", jp: "リン", jpkana: "リン", zh: "磷"}, group: Group.OTHER_NONMETAL, block: "p", mass: "30.97", state: State.SOLID, electronAffinity: "72", electronegativity: "2.19", ionizationEnergy: "10.487", density: "1.82", radius: "180", meltingAt: "317.3", boilingAt: "553.65", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>3</sup>", shell:[2, 8, 5], subshell: [2, 2, 6, 2, 3]}, isSynthetic: false, yearDiscovered: "1669"},
    {no: 16, symbol: "S", name: {en: "Sul&shy;fur", jp: "硫黄", jpkana: "いおう", zh: "硫"}, group: Group.OTHER_NONMETAL, block: "p", mass: "32.07", state: State.SOLID, electronAffinity: "200", electronegativity: "2.58", ionizationEnergy: "10.36", density: "2.067", radius: "180", meltingAt: "388.36", boilingAt: "717.75", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>4</sup>", shell:[2, 8, 6], subshell: [2, 2, 6, 2, 4]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 17, symbol: "Cl", name: {en: "Chlo&shy;rine", jp: "塩素", jpkana: "えんそ", zh: "氯"}, group: Group.HALOGEN, block: "p", mass: "35.45", state: State.GAS, electronAffinity: "349", electronegativity: "3.16", ionizationEnergy: "12.968", density: "0.003214", radius: "175", meltingAt: "171.65", boilingAt: "239.11", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>5</sup>", shell:[2, 8, 7], subshell: [2, 2, 6, 2, 5]}, isSynthetic: false, yearDiscovered: "1774"},
    {no: 18, symbol: "Ar", name: {en: "Ar&shy;gon", jp: "アルゴン", jpkana: "アルゴン", zh: "氬"}, group: Group.NOBLE_GAS, block: "p", mass: "39.95", state: State.GAS, electronAffinity: "-96", electronegativity: "", ionizationEnergy: "15.76", density: "0.0017837", radius: "188", meltingAt: "83.8", boilingAt: "87.3", electronConfig: {expr: "[Ne] 3s<sup>2</sup> 3p<sup>6</sup>", shell:[2, 8, 8], subshell: [2, 2, 6, 2, 6]}, isSynthetic: false, yearDiscovered: "1894"},
    {no: 19, symbol: "K", name: {en: "Po&shy;tas&shy;si&shy;um", jp: "カリウム", jpkana: "カリウム", zh: "鉀"}, group: Group.ALKALI_METAL, block: "s", mass: "39.10", state: State.SOLID, electronAffinity: "48", electronegativity: "0.82", ionizationEnergy: "4.341", density: "0.89", radius: "275", meltingAt: "336.53", boilingAt: "1032", electronConfig: {expr: "[Ar] 4s<sup>1</sup>", shell:[2, 8, 8, 1], subshell: [2, 2, 6, 2, 6, 0, 1]}, isSynthetic: false, yearDiscovered: "1807"},
    {no: 20, symbol: "Ca", name: {en: "Cal&shy;ci&shy;um", jp: "カルシウム", jpkana: "カルシウム", zh: "鈣"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "40.08", state: State.SOLID, electronAffinity: "2", electronegativity: "1.00", ionizationEnergy: "6.113", density: "1.54", radius: "231", meltingAt: "1115", boilingAt: "1757", electronConfig: {expr: "[Ar] 4s<sup>2</sup>", shell:[2, 8, 8, 2], subshell: [2, 2, 6, 2, 6, 0, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 21, symbol: "Sc", name: {en: "Scan&shy;di&shy;um", jp: "スカンジウム", jpkana: "スカンジウム", zh: "鈧"}, group: Group.TRANSITION_METAL, block: "d", mass: "44.96", state: State.SOLID, electronAffinity: "18", electronegativity: "1.36", ionizationEnergy: "6.561", density: "2.99", radius: "211", meltingAt: "1814", boilingAt: "3109", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>1</sup>", shell:[2, 8, 9, 2], subshell: [2, 2, 6, 2, 6, 1, 2]}, isSynthetic: false, yearDiscovered: "1879"},
    {no: 22, symbol: "Ti", name: {en: "Ti&shy;ta&shy;ni&shy;um", jp: "チタン", jpkana: "チタン", zh: "鈦"}, group: Group.TRANSITION_METAL, block: "d", mass: "47.87", state: State.SOLID, electronAffinity: "8", electronegativity: "1.54", ionizationEnergy: "6.828", density: "4.5", radius: "187", meltingAt: "1941", boilingAt: "3560", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>2</sup>", shell:[2, 8, 10, 2], subshell: [2, 2, 6, 2, 6, 2, 2]}, isSynthetic: false, yearDiscovered: "1791"},
    {no: 23, symbol: "V", name: {en: "Va&shy;na&shy;di&shy;um", jp: "バナジウム", jpkana: "バナジウム", zh: "釩"}, group: Group.TRANSITION_METAL, block: "d", mass: "50.94", state: State.SOLID, electronAffinity: "51", electronegativity: "1.63", ionizationEnergy: "6.746", density: "6", radius: "179", meltingAt: "2183", boilingAt: "3680", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>3</sup>", shell:[2, 8, 11, 2], subshell: [2, 2, 6, 2, 6, 3, 2]}, isSynthetic: false, yearDiscovered: "1801"},
    {no: 24, symbol: "Cr", name: {en: "Chro&shy;mi&shy;um", jp: "クロム", jpkana: "クロム", zh: "鉻"}, group: Group.TRANSITION_METAL, block: "d", mass: "52.00", state: State.SOLID, electronAffinity: "64", electronegativity: "1.66", ionizationEnergy: "6.767", density: "7.15", radius: "189", meltingAt: "2180", boilingAt: "2944", electronConfig: {expr: "[Ar] 3d<sup>5</sup> 4s<sup>1</sup>", shell:[2, 8, 13, 1], subshell: [2, 2, 6, 2, 6, 5, 1]}, isSynthetic: false, yearDiscovered: "1797"},
    {no: 25, symbol: "Mn", name: {en: "Man&shy;ga&shy;nese", jp: "マンガン", jpkana: "マンガン", zh: "錳"}, group: Group.TRANSITION_METAL, block: "d", mass: "54.94", state: State.SOLID, electronAffinity: "< 0", electronegativity: "1.55", ionizationEnergy: "7.434", density: "7.3", radius: "197", meltingAt: "1519", boilingAt: "2334", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>5</sup>", shell:[2, 8, 13, 2], subshell: [2, 2, 6, 2, 6, 5, 2]}, isSynthetic: false, yearDiscovered: "1774"},
    {no: 26, symbol: "Fe", name: {en: "I&shy;ron", jp: "鉄", jpkana: "てつ", zh: "鐵"}, group: Group.TRANSITION_METAL, block: "d", mass: "55.85", state: State.SOLID, electronAffinity: "15", electronegativity: "1.83", ionizationEnergy: "7.902", density: "7.874", radius: "194", meltingAt: "1811", boilingAt: "3134", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>6</sup>", shell:[2, 8, 14, 2], subshell: [2, 2, 6, 2, 6, 6, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 27, symbol: "Co", name: {en: "Co&shy;balt", jp: "コバルト", jpkana: "コバルト", zh: "鈷"}, group: Group.TRANSITION_METAL, block: "d", mass: "58.93", state: State.SOLID, electronAffinity: "64", electronegativity: "1.88", ionizationEnergy: "7.881", density: "8.86", radius: "192", meltingAt: "1768", boilingAt: "3200", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>7</sup>", shell:[2, 8, 15, 2], subshell: [2, 2, 6, 2, 6, 7, 2]}, isSynthetic: false, yearDiscovered: "1735"},
    {no: 28, symbol: "Ni", name: {en: "Nick&shy;el", jp: "ニッケル", jpkana: "ニッケル", zh: "鎳"}, group: Group.TRANSITION_METAL, block: "d", mass: "58.69", state: State.SOLID, electronAffinity: "112", electronegativity: "1.91", ionizationEnergy: "7.64", density: "8.912", radius: "163", meltingAt: "1728", boilingAt: "3186", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>8</sup>", shell:[2, 8, 16, 2], subshell: [2, 2, 6, 2, 6, 8, 2]}, isSynthetic: false, yearDiscovered: "1751"},
    {no: 29, symbol: "Cu", name: {en: "Cop&shy;per", jp: "銅", jpkana: "どう", zh: "銅"}, group: Group.TRANSITION_METAL, block: "d", mass: "63.55", state: State.SOLID, electronAffinity: "119", electronegativity: "1.90", ionizationEnergy: "7.726", density: "8.933", radius: "140", meltingAt: "1357.77", boilingAt: "2835", electronConfig: {expr: "[Ar] 4s<sup>1</sup> 3d<sup>10</sup>", shell:[2, 8, 18, 1], subshell: [2, 2, 6, 2, 6, 10, 1]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 30, symbol: "Zn", name: {en: "Zinc", jp: "亜鉛", jpkana: "あえん", zh: "鋅"}, group: Group.OTHER_METAL, block: "d", mass: "65.38", state: State.SOLID, electronAffinity: "< 0", electronegativity: "1.65", ionizationEnergy: "9.394", density: "7.134", radius: "139", meltingAt: "692.68", boilingAt: "1180", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup>", shell:[2, 8, 18, 2], subshell: [2, 2, 6, 2, 6, 10, 2]}, isSynthetic: false, yearDiscovered: "1746"},
    {no: 31, symbol: "Ga", name: {en: "Gal&shy;li&shy;um", jp: "ガリウム", jpkana: "ガリウム", zh: "鎵"}, group: Group.OTHER_METAL, block: "p", mass: "69.72", state: State.SOLID, electronAffinity: "41", electronegativity: "1.81", ionizationEnergy: "5.999", density: "5.91", radius: "187", meltingAt: "302.91", boilingAt: "2477", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>1</sup>", shell:[2, 8, 18, 3], subshell: [2, 2, 6, 2, 6, 10, 2, 1]}, isSynthetic: false, yearDiscovered: "1875"},
    {no: 32, symbol: "Ge", name: {en: "Ger&shy;ma&shy;ni&shy;um", jp: "ゲルマニウム", jpkana: "ゲルマニウム", zh: "鍺"}, group: Group.METALLOID, block: "p", mass: "72.63", state: State.SOLID, electronAffinity: "119", electronegativity: "2.01", ionizationEnergy: "7.9", density: "5.323", radius: "211", meltingAt: "1211.4", boilingAt: "3106", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>2</sup>", shell:[2, 8, 18, 4], subshell: [2, 2, 6, 2, 6, 10, 2, 2]}, isSynthetic: false, yearDiscovered: "1886"},
    {no: 33, symbol: "As", name: {en: "Ar&shy;se&shy;nic", jp: "ヒ素", jpkana: "ヒそ", zh: "砷"}, group: Group.METALLOID, block: "p", mass: "74.92", state: State.SOLID, electronAffinity: "79", electronegativity: "2.18", ionizationEnergy: "9.815", density: "5.776", radius: "185", meltingAt: "1090", boilingAt: "887", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>3</sup>", shell:[2, 8, 18, 5], subshell: [2, 2, 6, 2, 6, 10, 2, 3]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 34, symbol: "Se", name: {en: "Se&shy;le&shy;ni&shy;um", jp: "セレン", jpkana: "セレン", zh: "硒"}, group: Group.OTHER_NONMETAL, block: "p", mass: "78.97", state: State.SOLID, electronAffinity: "195", electronegativity: "2.55", ionizationEnergy: "9.752", density: "4.809", radius: "190", meltingAt: "493.65", boilingAt: "958", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>4</sup>", shell:[2, 8, 18, 6], subshell: [2, 2, 6, 2, 6, 10, 2, 4]}, isSynthetic: false, yearDiscovered: "1817"},
    {no: 35, symbol: "Br", name: {en: "Bro&shy;mine", jp: "臭素", jpkana: "しゅうそ", zh: "溴"}, group: Group.HALOGEN, block: "p", mass: "79.90", state: State.LIQUID, electronAffinity: "324", electronegativity: "2.96", ionizationEnergy: "11.814", density: "3.11", radius: "183", meltingAt: "265.95", boilingAt: "331.95", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>5</sup>", shell:[2, 8, 18, 7], subshell: [2, 2, 6, 2, 6, 10, 2, 5]}, isSynthetic: false, yearDiscovered: "1826"},
    {no: 36, symbol: "Kr", name: {en: "Kryp&shy;ton", jp: "クリプトン", jpkana: "クリプトン", zh: "氪"}, group: Group.NOBLE_GAS, block: "p", mass: "83.80", state: State.GAS, electronAffinity: "-96", electronegativity: "3.00", ionizationEnergy: "14", density: "0.003733", radius: "202", meltingAt: "115.79", boilingAt: "119.93", electronConfig: {expr: "[Ar] 4s<sup>2</sup> 3d<sup>10</sup> 4p<sup>6</sup>", shell:[2, 8, 18, 8], subshell: [2, 2, 6, 2, 6, 10, 2, 6]}, isSynthetic: false, yearDiscovered: "1898"},
    {no: 37, symbol: "Rb", name: {en: "Ru&shy;bid&shy;i&shy;um", jp: "ルビジウム", jpkana: "ルビジウム", zh: "銣"}, group: Group.ALKALI_METAL, block: "s", mass: "85.47", state: State.SOLID, electronAffinity: "47", electronegativity: "0.82", ionizationEnergy: "4.177", density: "1.53", radius: "303", meltingAt: "312.46", boilingAt: "961", electronConfig: {expr: "[Kr] 5s<sup>1</sup>", shell:[2, 8, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 0, 0, 1]}, isSynthetic: false, yearDiscovered: "1861"},
    {no: 38, symbol: "Sr", name: {en: "Stron&shy;ti&shy;um", jp: "ストロンチウム", jpkana: "ストロンチウム", zh: "鍶"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "87.62", state: State.SOLID, electronAffinity: "5", electronegativity: "0.95", ionizationEnergy: "5.695", density: "2.64", radius: "249", meltingAt: "1050", boilingAt: "1655", electronConfig: {expr: "[Kr] 5s<sup>2</sup>", shell:[2, 8, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1790"},
    {no: 39, symbol: "Y", name: {en: "Yt&shy;tri&shy;um", jp: "イットリウム", jpkana: "イットリウム", zh: "釔"}, group: Group.TRANSITION_METAL, block: "d", mass: "88.91", state: State.SOLID, electronAffinity: "30", electronegativity: "1.22", ionizationEnergy: "6.217", density: "4.47", radius: "219", meltingAt: "1795", boilingAt: "3618", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>1</sup>", shell:[2, 8, 18, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 1, 0, 2]}, isSynthetic: false, yearDiscovered: "1794"},
    {no: 40, symbol: "Zr", name: {en: "Zir&shy;co&shy;ni&shy;um", jp: "ジルコニウム", jpkana: "ジルコニウム", zh: "鋯"}, group: Group.TRANSITION_METAL, block: "d", mass: "91.22", state: State.SOLID, electronAffinity: "41", electronegativity: "1.33", ionizationEnergy: "6.634", density: "6.52", radius: "186", meltingAt: "2128", boilingAt: "4682", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>2</sup>", shell:[2, 8, 18, 10, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 2, 0, 2]}, isSynthetic: false, yearDiscovered: "1789"},
    {no: 41, symbol: "Nb", name: {en: "Ni&shy;o&shy;bi&shy;um", jp: "ニオブ", jpkana: "ニオブ", zh: "鈮"}, group: Group.TRANSITION_METAL, block: "d", mass: "92.91", state: State.SOLID, electronAffinity: "86", electronegativity: "1.6", ionizationEnergy: "6.759", density: "8.57", radius: "207", meltingAt: "2750", boilingAt: "5017", electronConfig: {expr: "[Kr] 5s<sup>1</sup> 4d<sup>4</sup>", shell:[2, 8, 18, 12, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 4, 0, 1]}, isSynthetic: false, yearDiscovered: "1801"},
    {no: 42, symbol: "Mo", name: {en: "Mo&shy;lyb&shy;de&shy;num", jp: "モリブデン", jpkana: "モリブデン", zh: "鉬"}, group: Group.TRANSITION_METAL, block: "d", mass: "95.95", state: State.SOLID, electronAffinity: "72", electronegativity: "2.16", ionizationEnergy: "7.092", density: "10.2", radius: "209", meltingAt: "2896", boilingAt: "4912", electronConfig: {expr: "[Kr] 5s<sup>1</sup> 4d<sup>5</sup>", shell:[2, 8, 18, 13, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 5, 0, 1]}, isSynthetic: false, yearDiscovered: "1778"},
    {no: 43, symbol: "Tc", name: {en: "Tech&shy;ne&shy;ti&shy;um", jp: "テクネチウム", jpkana: "テクネチウム", zh: "鍀"}, group: Group.TRANSITION_METAL, block: "d", mass: "(99)", state: State.SOLID, electronAffinity: "53", electronegativity: "1.9", ionizationEnergy: "7.28", density: "11", radius: "209", meltingAt: "2430", boilingAt: "4538", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>5</sup>", shell:[2, 8, 18, 13, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 5, 0, 2]}, isSynthetic: false, yearDiscovered: "1937"},
    {no: 44, symbol: "Ru", name: {en: "Ru&shy;the&shy;ni&shy;um", jp: "ルテニウム", jpkana: "ルテニウム", zh: "釕"}, group: Group.TRANSITION_METAL, block: "d", mass: "101.1", state: State.SOLID, electronAffinity: "101", electronegativity: "2.2", ionizationEnergy: "7.361", density: "12.1", radius: "207", meltingAt: "2607", boilingAt: "4423", electronConfig: {expr: "[Kr] 5s<sup>1</sup> 4d<sup>7</sup>", shell:[2, 8, 18, 15, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 7, 0, 1]}, isSynthetic: false, yearDiscovered: "1827"},
    {no: 45, symbol: "Rh", name: {en: "Rho&shy;di&shy;um", jp: "ロジウム", jpkana: "ロジウム", zh: "銠"}, group: Group.TRANSITION_METAL, block: "d", mass: "102.9", state: State.SOLID, electronAffinity: "110", electronegativity: "2.28", ionizationEnergy: "7.459", density: "12.4", radius: "195", meltingAt: "2237", boilingAt: "3968", electronConfig: {expr: "[Kr] 5s<sup>1</sup> 4d<sup>8</sup>", shell:[2, 8, 18, 16, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 8, 0, 1]}, isSynthetic: false, yearDiscovered: "1803"},
    {no: 46, symbol: "Pd", name: {en: "Pal&shy;la&shy;di&shy;um", jp: "パラジウム", jpkana: "パラジウム", zh: "鈀"}, group: Group.TRANSITION_METAL, block: "d", mass: "106.4", state: State.SOLID, electronAffinity: "54", electronegativity: "2.20", ionizationEnergy: "8.337", density: "12", radius: "202", meltingAt: "1828.05", boilingAt: "3236", electronConfig: {expr: "[Kr] 4d<sup>10</sup>", shell:[2, 8, 18, 18], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10]}, isSynthetic: false, yearDiscovered: "1803"},
    {no: 47, symbol: "Ag", name: {en: "Sil&shy;ver", jp: "銀", jpkana: "ぎん", zh: "銀"}, group: Group.TRANSITION_METAL, block: "d", mass: "107.9", state: State.SOLID, electronAffinity: "126", electronegativity: "1.93", ionizationEnergy: "7.576", density: "10.501", radius: "172", meltingAt: "1234.93", boilingAt: "2435", electronConfig: {expr: "[Kr] 5s<sup>1</sup> 4d<sup>10</sup>", shell:[2, 8, 18, 18, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 1]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 48, symbol: "Cd", name: {en: "Cad&shy;mi&shy;um", jp: "カドミウム", jpkana: "カドミウム", zh: "鎘"}, group: Group.OTHER_METAL, block: "d", mass: "112.4", state: State.SOLID, electronAffinity: "< 0", electronegativity: "1.69", ionizationEnergy: "8.994", density: "8.69", radius: "158", meltingAt: "594.22", boilingAt: "1040", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup>", shell:[2, 8, 18, 18, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2]}, isSynthetic: false, yearDiscovered: "1817"},
    {no: 49, symbol: "In", name: {en: "In&shy;di&shy;um", jp: "インジウム", jpkana: "インジウム", zh: "銦"}, group: Group.OTHER_METAL, block: "p", mass: "114.8", state: State.SOLID, electronAffinity: "39", electronegativity: "1.78", ionizationEnergy: "5.786", density: "7.31", radius: "193", meltingAt: "429.75", boilingAt: "2345", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>1</sup>", shell:[2, 8, 18, 18, 3], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 1]}, isSynthetic: false, yearDiscovered: "1863"},
    {no: 50, symbol: "Sn", name: {en: "Tin", jp: "スズ", jpkana: "スズ", zh: "錫"}, group: Group.OTHER_METAL, block: "p", mass: "118.7", state: State.SOLID, electronAffinity: "107", electronegativity: "1.96", ionizationEnergy: "7.344", density: "7.287", radius: "217", meltingAt: "505.08", boilingAt: "2875", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>2</sup>", shell:[2, 8, 18, 18, 4], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 51, symbol: "Sb", name: {en: "An&shy;ti&shy;mo&shy;ny", jp: "アンチモン", jpkana: "アンチモン", zh: "銻"}, group: Group.METALLOID, block: "p", mass: "121.8", state: State.SOLID, electronAffinity: "101", electronegativity: "2.05", ionizationEnergy: "8.64", density: "6.685", radius: "206", meltingAt: "903.78", boilingAt: "1860", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>3</sup>", shell:[2, 8, 18, 18, 5], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 3]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 52, symbol: "Te", name: {en: "Tel&shy;lu&shy;ri&shy;um", jp: "テルル", jpkana: "テルル", zh: "碲"}, group: Group.METALLOID, block: "p", mass: "127.6", state: State.SOLID, electronAffinity: "190", electronegativity: "2.1", ionizationEnergy: "9.01", density: "6.232", radius: "206", meltingAt: "722.66", boilingAt: "1261", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>4</sup>", shell:[2, 8, 18, 18, 6], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 4]}, isSynthetic: false, yearDiscovered: "1782"},
    {no: 53, symbol: "I", name: {en: "I&shy;o&shy;dine", jp: "ヨウ素", jpkana: "ヨウそ", zh: "碘"}, group: Group.HALOGEN, block: "p", mass: "126.9", state: State.SOLID, electronAffinity: "295", electronegativity: "2.66", ionizationEnergy: "10.451", density: "4.93", radius: "198", meltingAt: "386.85", boilingAt: "457.55", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>5</sup>", shell:[2, 8, 18, 18, 7], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 5]}, isSynthetic: false, yearDiscovered: "1811"},
    {no: 54, symbol: "Xe", name: {en: "Xe&shy;non", jp: "キセノン", jpkana: "キセノン", zh: "氙"}, group: Group.NOBLE_GAS, block: "p", mass: "131.3", state: State.GAS, electronAffinity: "-77", electronegativity: "2.6", ionizationEnergy: "12.13", density: "0.005887", radius: "216", meltingAt: "161.36", boilingAt: "165.03", electronConfig: {expr: "[Kr] 5s<sup>2</sup> 4d<sup>10</sup> 5p<sup>6</sup>", shell:[2, 8, 18, 18, 8], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 6]}, isSynthetic: false, yearDiscovered: "1898"},
    {no: 55, symbol: "Cs", name: {en: "Cae&shy;si&shy;um", jp: "セシウム", jpkana: "セシウム", zh: "銫"}, group: Group.ALKALI_METAL, block: "s", mass: "132.9", state: State.SOLID, electronAffinity: "46", electronegativity: "0.79", ionizationEnergy: "3.894", density: "1.93", radius: "343", meltingAt: "301.59", boilingAt: "944", electronConfig: {expr: "[Xe] 6s<sup>1</sup>", shell:[2, 8, 18, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 6, 0, 0, 0, 1]}, isSynthetic: false, yearDiscovered: "1860"},
    {no: 56, symbol: "Ba", name: {en: "Bar&shy;i&shy;um", jp: "バリウム", jpkana: "バリウム", zh: "鋇"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "137.3", state: State.SOLID, electronAffinity: "14", electronegativity: "0.89", ionizationEnergy: "5.212", density: "3.62", radius: "268", meltingAt: "1000", boilingAt: "2170", electronConfig: {expr: "[Xe] 6s<sup>2</sup>", shell:[2, 8, 18, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1808"},
    {no: 57, symbol: "La", name: {en: "Lan&shy;tha&shy;num", jp: "ランタン", jpkana: "ランタン", zh: "鑭"}, group: Group.LANTHANOID, block: "f", mass: "138.9", state: State.SOLID, electronAffinity: "48", electronegativity: "1.1", ionizationEnergy: "5.577", density: "6.15", radius: "240", meltingAt: "1191", boilingAt: "3737", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 5d<sup>1</sup>", shell:[2, 8, 18, 18, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1839"},
    {no: 58, symbol: "Ce", name: {en: "Ce&shy;ri&shy;um", jp: "セリウム", jpkana: "セリウム", zh: "鈰"}, group: Group.LANTHANOID, block: "f", mass: "140.1", state: State.SOLID, electronAffinity: "92", electronegativity: "1.12", ionizationEnergy: "5.539", density: "6.77", radius: "235", meltingAt: "1071", boilingAt: "3697", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>1</sup> 5d<sup>1</sup>", shell:[2, 8, 18, 19, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 1, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1803"},
    {no: 59, symbol: "Pr", name: {en: "Pra&shy;se&shy;o&shy;dym&shy;i&shy;um", jp: "プラセオジム", jpkana: "プラセオジム", zh: "鐠"}, group: Group.LANTHANOID, block: "f", mass: "140.9", state: State.SOLID, electronAffinity: "", electronegativity: "1.13", ionizationEnergy: "5.464", density: "6.77", radius: "239", meltingAt: "1204", boilingAt: "3793", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>3</sup>", shell:[2, 8, 18, 21, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 3, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1885"},
    {no: 60, symbol: "Nd", name: {en: "Ne&shy;o&shy;dym&shy;i&shy;um", jp: "ネオジム", jpkana: "ネオジム", zh: "釹"}, group: Group.LANTHANOID, block: "f", mass: "144.2", state: State.SOLID, electronAffinity: "", electronegativity: "1.14", ionizationEnergy: "5.525", density: "7.01", radius: "229", meltingAt: "1294", boilingAt: "3347", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>4</sup>", shell:[2, 8, 18, 22, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 4, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1885"},
    {no: 61, symbol: "Pm", name: {en: "Pro&shy;me&shy;thi&shy;um", jp: "プロメチウム", jpkana: "プロメチウム", zh: "鉕"}, group: Group.LANTHANOID, block: "f", mass: "(145)", state: State.SOLID, electronAffinity: "", electronegativity: "1.13", ionizationEnergy: "5.55", density: "7.26", radius: "236", meltingAt: "1315", boilingAt: "3273", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>5</sup>", shell:[2, 8, 18, 23, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 5, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1945"},
    {no: 62, symbol: "Sm", name: {en: "Sa&shy;mar&shy;i&shy;um", jp: "サマリウム", jpkana: "サマリウム", zh: "釤"}, group: Group.LANTHANOID, block: "f", mass: "150.4", state: State.SOLID, electronAffinity: "", electronegativity: "1.17", ionizationEnergy: "5.644", density: "7.52", radius: "229", meltingAt: "1347", boilingAt: "2067", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>6</sup>", shell:[2, 8, 18, 24, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 6, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1879"},
    {no: 63, symbol: "Eu", name: {en: "Eu&shy;ro&shy;pi&shy;um", jp: "ユウロピウム", jpkana: "ユウロピウム", zh: "銪"}, group: Group.LANTHANOID, block: "f", mass: "152.0", state: State.SOLID, electronAffinity: "", electronegativity: "1.2", ionizationEnergy: "5.67", density: "5.24", radius: "233", meltingAt: "1095", boilingAt: "1802", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>7</sup>", shell:[2, 8, 18, 25, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 7, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1901"},
    {no: 64, symbol: "Gd", name: {en: "Gad&shy;o&shy;lin&shy;i&shy;um", jp: "ガドリニウム", jpkana: "ガドリニウム", zh: "釓"}, group: Group.LANTHANOID, block: "f", mass: "157.3", state: State.SOLID, electronAffinity: "", electronegativity: "1.2", ionizationEnergy: "6.15", density: "7.9", radius: "237", meltingAt: "1586", boilingAt: "3546", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>7</sup> 5d<sup>1</sup>", shell:[2, 8, 18, 25, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 7, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1880"},
    {no: 65, symbol: "Tb", name: {en: "Ter&shy;bi&shy;um", jp: "テルビウム", jpkana: "テルビウム", zh: "鋱"}, group: Group.LANTHANOID, block: "f", mass: "158.9", state: State.SOLID, electronAffinity: "", electronegativity: "1.1", ionizationEnergy: "5.864", density: "8.23", radius: "221", meltingAt: "1629", boilingAt: "3503", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>9</sup>", shell:[2, 8, 18, 27, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 9, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1843"},
    {no: 66, symbol: "Dy", name: {en: "Dys&shy;pro&shy;si&shy;um", jp: "ジスプロシウム", jpkana: "ジスプロシウム", zh: "鏑"}, group: Group.LANTHANOID, block: "f", mass: "162.5", state: State.SOLID, electronAffinity: "", electronegativity: "1.22", ionizationEnergy: "5.939", density: "8.55", radius: "229", meltingAt: "1685", boilingAt: "2840", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>10</sup>", shell:[2, 8, 18, 28, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 10, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1886"},
    {no: 67, symbol: "Ho", name: {en: "Hol&shy;mi&shy;um", jp: "ホルミウム", jpkana: "ホルミウム", zh: "鈥"}, group: Group.LANTHANOID, block: "f", mass: "164.9", state: State.SOLID, electronAffinity: "", electronegativity: "1.23", ionizationEnergy: "6.022", density: "8.8", radius: "216", meltingAt: "1747", boilingAt: "2973", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>11</sup>", shell:[2, 8, 18, 29, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 11, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1878"},
    {no: 68, symbol: "Er", name: {en: "Er&shy;bi&shy;um", jp: "エルビウム", jpkana: "エルビウム", zh: "鉺"}, group: Group.LANTHANOID, block: "f", mass: "167.3", state: State.SOLID, electronAffinity: "", electronegativity: "1.24", ionizationEnergy: "6.108", density: "9.07", radius: "235", meltingAt: "1802", boilingAt: "3141", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>1</sup><sup>2</sup>", shell:[2, 8, 18, 30, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 12, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1843"},
    {no: 69, symbol: "Tm", name: {en: "Thu&shy;li&shy;um", jp: "ツリウム", jpkana: "ツリウム", zh: "銩"}, group: Group.LANTHANOID, block: "f", mass: "168.9", state: State.SOLID, electronAffinity: "99", electronegativity: "1.25", ionizationEnergy: "6.184", density: "9.32", radius: "227", meltingAt: "1818", boilingAt: "2223", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>13</sup>", shell:[2, 8, 18, 31, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 13, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1879"},
    {no: 70, symbol: "Yb", name: {en: "Yt&shy;ter&shy;bi&shy;um", jp: "イッテルビウム", jpkana: "イッテルビウム", zh: "鐿"}, group: Group.LANTHANOID, block: "f", mass: "173.0", state: State.SOLID, electronAffinity: "", electronegativity: "1.1", ionizationEnergy: "6.254", density: "6.9", radius: "242", meltingAt: "1092", boilingAt: "1469", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup>", shell:[2, 8, 18, 32, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1878"},
    {no: 71, symbol: "Lu", name: {en: "Lu&shy;te&shy;ti&shy;um", jp: "ルテチウム", jpkana: "ルテチウム", zh: "鑥"}, group: Group.LANTHANOID, block: "f", mass: "175.0", state: State.SOLID, electronAffinity: "33", electronegativity: "1.27", ionizationEnergy: "5.426", density: "9.84", radius: "221", meltingAt: "1936", boilingAt: "3675", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>1</sup>", shell:[2, 8, 18, 32, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1907"},
    {no: 72, symbol: "Hf", name: {en: "Haf&shy;ni&shy;um", jp: "ハフニウム", jpkana: "ハフニウム", zh: "鉿"}, group: Group.TRANSITION_METAL, block: "d", mass: "178.5", state: State.SOLID, electronAffinity: "2", electronegativity: "1.3", ionizationEnergy: "6.825", density: "13.3", radius: "212", meltingAt: "2506", boilingAt: "4876", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>2</sup>", shell:[2, 8, 18, 32, 10, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 2, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1923"},
    {no: 73, symbol: "Ta", name: {en: "Tan&shy;ta&shy;lum", jp: "タンタル", jpkana: "タンタル", zh: "鉭"}, group: Group.TRANSITION_METAL, block: "d", mass: "180.9", state: State.SOLID, electronAffinity: "31", electronegativity: "1.5", ionizationEnergy: "7.89", density: "16.4", radius: "217", meltingAt: "3290", boilingAt: "5731", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>3</sup>", shell:[2, 8, 18, 32, 11, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 3, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1802"},
    {no: 74, symbol: "W", name: {en: "Tung&shy;sten", jp: "タングステン", jpkana: "タングステン", zh: "鎢"}, group: Group.TRANSITION_METAL, block: "d", mass: "183.8", state: State.SOLID, electronAffinity: "79", electronegativity: "2.36", ionizationEnergy: "7.98", density: "19.3", radius: "210", meltingAt: "3695", boilingAt: "5828", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>4</sup>", shell:[2, 8, 18, 32, 12, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 4, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1783"},
    {no: 75, symbol: "Re", name: {en: "Rhe&shy;ni&shy;um", jp: "レニウム", jpkana: "レニウム", zh: "錸"}, group: Group.TRANSITION_METAL, block: "d", mass: "186.2", state: State.SOLID, electronAffinity: "14", electronegativity: "1.9", ionizationEnergy: "7.88", density: "20.8", radius: "217", meltingAt: "3459", boilingAt: "5869", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>5</sup>", shell:[2, 8, 18, 32, 13, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 5, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1925"},
    {no: 76, symbol: "Os", name: {en: "Os&shy;mi&shy;um", jp: "オスミウム", jpkana: "オスミウム", zh: "鋨"}, group: Group.TRANSITION_METAL, block: "d", mass: "190.2", state: State.SOLID, electronAffinity: "104", electronegativity: "2.2", ionizationEnergy: "8.7", density: "22.57", radius: "216", meltingAt: "3306", boilingAt: "5285", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>6</sup>", shell:[2, 8, 18, 32, 14, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 6, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1803"},
    {no: 77, symbol: "Ir", name: {en: "I&shy;ri&shy;di&shy;um", jp: "イリジウム", jpkana: "イリジウム", zh: "銥"}, group: Group.TRANSITION_METAL, block: "d", mass: "192.2", state: State.SOLID, electronAffinity: "150", electronegativity: "2.20", ionizationEnergy: "9.1", density: "22.42", radius: "202", meltingAt: "2719", boilingAt: "4701", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>7</sup>", shell:[2, 8, 18, 32, 15, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 7, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1803"},
    {no: 78, symbol: "Pt", name: {en: "Plat&shy;i&shy;num", jp: "白金", jpkana: "はっきん", zh: "鉑"}, group: Group.TRANSITION_METAL, block: "d", mass: "195.1", state: State.SOLID, electronAffinity: "205", electronegativity: "2.28", ionizationEnergy: "9", density: "21.46", radius: "209", meltingAt: "2041.55", boilingAt: "4098", electronConfig: {expr: "[Xe] 6s<sup>1</sup> 4f<sup>14</sup> 5d<sup>9</sup>", shell:[2, 8, 18, 32, 17, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 9, 0, 0, 1]}, isSynthetic: false, yearDiscovered: "1735"},
    {no: 79, symbol: "Au", name: {en: "Gold", jp: "金", jpkana: "きん", zh: "金"}, group: Group.TRANSITION_METAL, block: "d", mass: "197.0", state: State.SOLID, electronAffinity: "223", electronegativity: "2.54", ionizationEnergy: "9.226", density: "19.282", radius: "166", meltingAt: "1337.33", boilingAt: "3129", electronConfig: {expr: "[Xe] 6s<sup>1</sup> 4f<sup>14</sup> 5d<sup>10</sup>", shell:[2, 8, 18, 32, 18, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 1]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 80, symbol: "Hg", name: {en: "Mer&shy;cu&shy;ry", jp: "水銀", jpkana: "すいぎん", zh: "汞"}, group: Group.OTHER_METAL, block: "d", mass: "200.6", state: State.LIQUID, electronAffinity: "< 0", electronegativity: "2.00", ionizationEnergy: "10.438", density: "13.5336", radius: "209", meltingAt: "234.32", boilingAt: "629.88", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup>", shell:[2, 8, 18, 32, 18, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 81, symbol: "Tl", name: {en: "Thal&shy;li&shy;um", jp: "タリウム", jpkana: "タリウム", zh: "鉈"}, group: Group.OTHER_METAL, block: "p", mass: "204.4", state: State.SOLID, electronAffinity: "36", electronegativity: "1.62", ionizationEnergy: "6.108", density: "11.8", radius: "196", meltingAt: "577", boilingAt: "1746", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>1</sup>", shell:[2, 8, 18, 32, 18, 3], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 1]}, isSynthetic: false, yearDiscovered: "1861"},
    {no: 82, symbol: "Pb", name: {en: "Lead", jp: "鉛", jpkana: "なまり", zh: "鉛"}, group: Group.OTHER_METAL, block: "p", mass: "207.2", state: State.SOLID, electronAffinity: "35", electronegativity: "2.33", ionizationEnergy: "7.417", density: "11.342", radius: "202", meltingAt: "600.61", boilingAt: "2022", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>2</sup>", shell:[2, 8, 18, 32, 18, 4], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 2]}, isSynthetic: false, yearDiscovered: "Ancient"},
    {no: 83, symbol: "Bi", name: {en: "Bis&shy;muth", jp: "ビスマス", jpkana: "ビスマス", zh: "鉍"}, group: Group.OTHER_METAL, block: "p", mass: "209.0", state: State.SOLID, electronAffinity: "91", electronegativity: "2.02", ionizationEnergy: "7.289", density: "9.807", radius: "207", meltingAt: "544.55", boilingAt: "1837", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>3</sup>", shell:[2, 8, 18, 32, 18, 5], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 3]}, isSynthetic: false, yearDiscovered: "1753"},
    {no: 84, symbol: "Po", name: {en: "Po&shy;lo&shy;ni&shy;um", jp: "ポロニウム", jpkana: "ポロニウム", zh: "釙"}, group: Group.OTHER_METAL, block: "p", mass: "(210)", state: State.SOLID, electronAffinity: "183", electronegativity: "2.0", ionizationEnergy: "8.417", density: "9.32", radius: "197", meltingAt: "527", boilingAt: "1235", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>4</sup>", shell:[2, 8, 18, 32, 18, 6], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 4]}, isSynthetic: false, yearDiscovered: "1898"},
    {no: 85, symbol: "At", name: {en: "As&shy;ta&shy;tine", jp: "アスタチン", jpkana: "アスタチン", zh: "砹"}, group: Group.METALLOID, block: "p", mass: "(210)", state: State.SOLID, electronAffinity: "270", electronegativity: "2.2", ionizationEnergy: "9.5", density: "7", radius: "202", meltingAt: "575", boilingAt: "", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>5</sup>", shell:[2, 8, 18, 32, 18, 7], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 5]}, isSynthetic: false, yearDiscovered: "1940"},
    {no: 86, symbol: "Rn", name: {en: "Ra&shy;don", jp: "ラドン", jpkana: "ラドン", zh: "氡"}, group: Group.NOBLE_GAS, block: "p", mass: "(222)", state: State.GAS, electronAffinity: "< 0", electronegativity: "2.2", ionizationEnergy: "10.745", density: "0.00973", radius: "220", meltingAt: "202", boilingAt: "211.45", electronConfig: {expr: "[Xe] 6s<sup>2</sup> 4f<sup>14</sup> 5d<sup>10</sup> 6p<sup>6</sup>", shell:[2, 8, 18, 32, 18, 8], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 6]}, isSynthetic: false, yearDiscovered: "1900"},
    {no: 87, symbol: "Fr", name: {en: "Fran&shy;ci&shy;um", jp: "フランシウム", jpkana: "フランシウム", zh: "鈁"}, group: Group.ALKALI_METAL, block: "s", mass: "(223)", state: State.SOLID, electronAffinity: "47", electronegativity: "0.7", ionizationEnergy: "3.9", density: "", radius: "348", meltingAt: "300", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>1</sup>", shell:[2, 8, 18, 32, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 6, 0, 0, 0, 1]}, isSynthetic: false, yearDiscovered: "1939"},
    {no: 88, symbol: "Ra", name: {en: "Ra&shy;di&shy;um", jp: "ラジウム", jpkana: "ラジウム", zh: "鐳"}, group: Group.ALKALI_EARTH_METAL, block: "s", mass: "(226)", state: State.SOLID, electronAffinity: "10", electronegativity: "0.9", ionizationEnergy: "5.279", density: "5", radius: "283", meltingAt: "973", boilingAt: "1413", electronConfig: {expr: "[Rn] 7s<sup>2</sup>", shell:[2, 8, 18, 32, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1898"},
    {no: 89, symbol: "Ac", name: {en: "Ac&shy;tin&shy;i&shy;um", jp: "アクチニウム", jpkana: "アクチニウム", zh: "錒"}, group: Group.ACTINOID, block: "f", mass: "(227)", state: State.SOLID, electronAffinity: "34", electronegativity: "1.1", ionizationEnergy: "5.17", density: "10.07", radius: "260", meltingAt: "1324", boilingAt: "3471", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 18, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1899"},
    {no: 90, symbol: "Th", name: {en: "Tho&shy;ri&shy;um", jp: "トリウム", jpkana: "トリウム", zh: "釷"}, group: Group.ACTINOID, block: "f", mass: "232.0", state: State.SOLID, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.08", density: "11.72", radius: "237", meltingAt: "2023", boilingAt: "5061", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 6d<sup>2</sup>", shell:[2, 8, 18, 32, 18, 10, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 0, 0, 2, 6, 2, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1828"},
    {no: 91, symbol: "Pa", name: {en: "Prot&shy;ac&shy;tin&shy;i&shy;um", jp: "プロトアクチニウム", jpkana: "プロトアクチニウム", zh: "鏷"}, group: Group.ACTINOID, block: "f", mass: "231.0", state: State.SOLID, electronAffinity: "", electronegativity: "1.5", ionizationEnergy: "5.89", density: "15.37", radius: "243", meltingAt: "1845", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>2</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 20, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 2, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1913"},
    {no: 92, symbol: "U", name: {en: "U&shy;ra&shy;ni&shy;um", jp: "ウラン", jpkana: "ウラン", zh: "鈾"}, group: Group.ACTINOID, block: "f", mass: "238.0", state: State.SOLID, electronAffinity: "", electronegativity: "1.38", ionizationEnergy: "6.194", density: "18.95", radius: "240", meltingAt: "1408", boilingAt: "4404", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>3</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 21, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 3, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1789"},
    {no: 93, symbol: "Np", name: {en: "Nep&shy;tu&shy;ni&shy;um", jp: "ネプツニウム", jpkana: "ネプツニウム", zh: "鎿"}, group: Group.ACTINOID, block: "f", mass: "(237)", state: State.SOLID, electronAffinity: "", electronegativity: "1.36", ionizationEnergy: "6.266", density: "20.25", radius: "221", meltingAt: "917", boilingAt: "4175", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>4</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 22, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 4, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1940"},
    {no: 94, symbol: "Pu", name: {en: "Plu&shy;to&shy;ni&shy;um", jp: "プルトニウム", jpkana: "プルトニウム", zh: "鈈"}, group: Group.ACTINOID, block: "f", mass: "(239)", state: State.SOLID, electronAffinity: "", electronegativity: "1.28", ionizationEnergy: "6.06", density: "19.84", radius: "243", meltingAt: "913", boilingAt: "3501", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>6</sup>", shell:[2, 8, 18, 32, 24, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 6, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: false, yearDiscovered: "1940"},
    {no: 95, symbol: "Am", name: {en: "Am&shy;er&shy;i&shy;ci&shy;um", jp: "アメリシウム", jpkana: "アメリシウム", zh: "鎇"}, group: Group.ACTINOID, block: "f", mass: "(243)", state: State.SOLID, electronAffinity: "", electronegativity: "1.13", ionizationEnergy: "5.993", density: "13.69", radius: "244", meltingAt: "1449", boilingAt: "2284", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>7</sup>", shell:[2, 8, 18, 32, 25, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 7, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1944"},
    {no: 96, symbol: "Cm", name: {en: "Cu&shy;ri&shy;um", jp: "キュリウム", jpkana: "キュリウム", zh: "鋦"}, group: Group.ACTINOID, block: "f", mass: "(247)", state: State.SOLID, electronAffinity: "", electronegativity: "1.28", ionizationEnergy: "6.02", density: "13.51", radius: "245", meltingAt: "1618", boilingAt: "3400", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>7</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 25, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 7, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1944"},
    {no: 97, symbol: "Bk", name: {en: "Ber&shy;ke&shy;li&shy;um", jp: "バークリウム", jpkana: "バークリウム", zh: "錇"}, group: Group.ACTINOID, block: "f", mass: "(247)", state: State.SOLID, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.23", density: "14", radius: "244", meltingAt: "1323", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>9</sup>", shell:[2, 8, 18, 32, 27, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 9, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1949"},
    {no: 98, symbol: "Cf", name: {en: "Cal&shy;i&shy;for&shy;ni&shy;um", jp: "カリホルニウム", jpkana: "カリホルニウム", zh: "鐦"}, group: Group.ACTINOID, block: "f", mass: "(252)", state: State.SOLID, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.3", density: "", radius: "245", meltingAt: "1173", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>10</sup>", shell:[2, 8, 18, 32, 28, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 10, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1950"},
    {no: 99, symbol: "Es", name: {en: "Ein&shy;stein&shy;i&shy;um", jp: "アインスタイニウム", jpkana: "アインスタイニウム", zh: "鎄"}, group: Group.ACTINOID, block: "f", mass: "(252)", state: State.SOLID, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.42", density: "", radius: "245", meltingAt: "1133", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>11</sup>", shell:[2, 8, 18, 32, 29, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 11, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1952"},
    {no: 100, symbol: "Fm", name: {en: "Fer&shy;mi&shy;um", jp: "フェルミウム", jpkana: "フェルミウム", zh: "鐨"}, group: Group.ACTINOID, block: "f", mass: "(257)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.5", density: "", radius: "", meltingAt: "1800", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>12</sup>", shell:[2, 8, 18, 32, 30, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 12, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1952"},
    {no: 101, symbol: "Md", name: {en: "Men&shy;de&shy;le&shy;vi&shy;um", jp: "メンデレビウム", jpkana: "メンデレビウム", zh: "鍆"}, group: Group.ACTINOID, block: "f", mass: "(258)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.58", density: "", radius: "", meltingAt: "1100", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>13</sup>", shell:[2, 8, 18, 32, 31, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 13, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1955"},
    {no: 102, symbol: "No", name: {en: "No&shy;bel&shy;i&shy;um", jp: "ノーベリウム", jpkana: "ノーベリウム", zh: "鍩"}, group: Group.ACTINOID, block: "f", mass: "(259)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "1.3", ionizationEnergy: "6.65", density: "", radius: "", meltingAt: "1100", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup>", shell:[2, 8, 18, 32, 32, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 0, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1957"},
    {no: 103, symbol: "Lr", name: {en: "Law&shy;ren&shy;ci&shy;um", jp: "ローレンシウム", jpkana: "ローレンシウム", zh: "鐒"}, group: Group.ACTINOID, block: "f", mass: "(262)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "1900", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>1</sup>", shell:[2, 8, 18, 32, 32, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 1, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1961"},
    {no: 104, symbol: "Rf", name: {en: "Ruth&shy;er&shy;for&shy;di&shy;um", jp: "ラザホージウム", jpkana: "ラザホージウム", zh: "鑪"}, group: Group.TRANSITION_METAL, block: "d", mass: "(267)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>2</sup>", shell:[2, 8, 18, 32, 32, 10, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 2, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1964"},
    {no: 105, symbol: "Db", name: {en: "Dub&shy;ni&shy;um", jp: "ドブニウム", jpkana: "ドブニウム", zh: "𨧀"}, group: Group.TRANSITION_METAL, block: "d", mass: "(268)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>3</sup>", shell:[2, 8, 18, 32, 32, 11, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 3, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1967"},
    {no: 106, symbol: "Sg", name: {en: "Sea&shy;bor&shy;gi&shy;um", jp: "シーボーギウム", jpkana: "シーボーギウム", zh: "𨭎"}, group: Group.TRANSITION_METAL, block: "d", mass: "(271)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>4</sup>", shell:[2, 8, 18, 32, 32, 12, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 4, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1974"},
    {no: 107, symbol: "Bh", name: {en: "Bohr&shy;i&shy;um", jp: "ボーリウム", jpkana: "ボーリウム", zh: "𨨏"}, group: Group.TRANSITION_METAL, block: "d", mass: "(272)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>5</sup>", shell:[2, 8, 18, 32, 32, 13, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 5, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1976"},
    {no: 108, symbol: "Hs", name: {en: "Has&shy;si&shy;um", jp: "ハッシウム", jpkana: "ハッシウム", zh: "𨭆"}, group: Group.TRANSITION_METAL, block: "d", mass: "(277)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>6</sup>", shell:[2, 8, 18, 32, 32, 14, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 6, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1984"},
    {no: 109, symbol: "Mt", name: {en: "Meit&shy;ner&shy;i&shy;um", jp: "マイトネリウム", jpkana: "マイトネリウム", zh: "䥑"}, group: Group.UNKNOWN, block: "d", mass: "(276)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>7</sup>", shell:[2, 8, 18, 32, 32, 15, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 7, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1982"},
    {no: 110, symbol: "Ds", name: {en: "Darm&shy;stadt&shy;i&shy;um", jp: "ダームスタチウム", jpkana: "ダームスタチウム", zh: "鐽"}, group: Group.UNKNOWN, block: "d", mass: "(281)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>8</sup>", shell:[2, 8, 18, 32, 32, 16, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 8, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1994"},
    {no: 111, symbol: "Rg", name: {en: "Roent&shy;gen&shy;i&shy;um", jp: "レントゲニウム", jpkana: "レントゲニウム", zh: "錀"}, group: Group.UNKNOWN, block: "d", mass: "(280)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>9</sup>", shell:[2, 8, 18, 32, 32, 17, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 9, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1994"},
    {no: 112, symbol: "Cn", name: {en: "Co&shy;per&shy;ni&shy;cium", jp: "コペルニシウム", jpkana: "コペルニシウム", zh: "鎶"}, group: Group.OTHER_METAL, block: "d", mass: "(285)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2]}, isSynthetic: true, yearDiscovered: "1996"},
    {no: 113, symbol: "Nh", name: {en: "Ni&shy;ho&shy;ni&shy;um", jp: "ニホニウム", jpkana: "ニホニウム", zh: "鉨"}, group: Group.UNKNOWN, block: "p", mass: "(278)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>1</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 3], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 1]}, isSynthetic: true, yearDiscovered: "2004"},
    {no: 114, symbol: "Fl", name: {en: "Fle&shy;ro&shy;vi&shy;um", jp: "フレロビウム", jpkana: "フレロビウム", zh: "鈇"}, group: Group.UNKNOWN, block: "p", mass: "(289)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>2</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 4], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 2]}, isSynthetic: true, yearDiscovered: "1998"},
    {no: 115, symbol: "Mc", name: {en: "Mos&shy;co&shy;vi&shy;um", jp: "モスコビウム", jpkana: "モスコビウム", zh: "鏌"}, group: Group.UNKNOWN, block: "p", mass: "(289)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>3</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 5], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 3]}, isSynthetic: true, yearDiscovered: "2003"},
    {no: 116, symbol: "Lv", name: {en: "Liv&shy;er&shy;mo&shy;ri&shy;um", jp: "リバモリウム", jpkana: "リバモリウム", zh: "鉝"}, group: Group.UNKNOWN, block: "p", mass: "(293)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>4</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 6], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 4]}, isSynthetic: true, yearDiscovered: "2000"},
    {no: 117, symbol: "Ts", name: {en: "Ten&shy;nes&shy;sine", jp: "テネシン", jpkana: "テネシン", zh: "鿬"}, group: Group.UNKNOWN, block: "p", mass: "(293)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>5</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 7], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 5]}, isSynthetic: true, yearDiscovered: "2010"},
    {no: 118, symbol: "Og", name: {en: "O&shy;ga&shy;nes&shy;son", jp: "オガネソン", jpkana: "オガネソン", zh: "鿫"}, group: Group.UNKNOWN, block: "p", mass: "(294)", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Rn] 7s<sup>2</sup> 7p<sup>6</sup> 5f<sup>14</sup> 6d<sup>10</sup>", shell:[2, 8, 18, 32, 32, 18, 8], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 6]}, isSynthetic: true, yearDiscovered: "2006"},
    {no: 119, symbol: "Uue", name: {en: "U&shy;nun&shy;en&shy;i&shy;um", jp: "ウンウンエンニウム", jpkana: "ウンウンエンニウム", zh: ""}, group: Group.UNKNOWN, block: "s", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 8s<sup>1</sup>", shell:[2, 8, 18, 32, 32, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 6, 0, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 120, symbol: "Ubn", name: {en: "Unbinilium", jp: "ウンビニリウム", jpkana: "ウンビニリウム", zh: ""}, group: Group.UNKNOWN, block: "s", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 8s<sup>2</sup>", shell:[2, 8, 18, 32, 32, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 0, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 121, symbol: "Ubu", name: {en: "Unbiunium", jp: "ウンビウニウム", jpkana: "ウンビウニウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>1</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 33, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 1, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 122, symbol: "Ubb", name: {en: "Unbibium", jp: "ウンビビウム", jpkana: "ウンビビウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>2</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 34, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 2, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 123, symbol: "Ubt", name: {en: "Unbitrium", jp: "ウンビトリウム", jpkana: "ウンビトリウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>3</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 35, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 3, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 124, symbol: "Ubq", name: {en: "Unbiquadium", jp: "ウンビクアジウム", jpkana: "ウンビクアジウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>4</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 36, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 4, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 125, symbol: "Ubp", name: {en: "Unbipentium", jp: "ウンビペンチウム", jpkana: "ウンビペンチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>5</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 37, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 5, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 126, symbol: "Ubh", name: {en: "Unbihexium", jp: "ウンビヘキシウム", jpkana: "ウンビヘキシウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>6</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 38, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 6, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 127, symbol: "Ubs", name: {en: "Unbiseptium", jp: "ウンビセプチウム", jpkana: "ウンビセプチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>7</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 39, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 7, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 128, symbol: "Ubo", name: {en: "Unbioctium", jp: "ウンビオクチウム", jpkana: "ウンビオクチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>8</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 40, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 8, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 129, symbol: "Ube", name: {en: "Unbiennium", jp: "ウンビエンニウム", jpkana: "ウンビエンニウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>9</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 41, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 9, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 130, symbol: "Utn", name: {en: "Untrinilium", jp: "ウントリニリウム", jpkana: "ウントリニリウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>10</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 42, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 10, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 131, symbol: "Utu", name: {en: "Untriunium", jp: "ウントリウニウム", jpkana: "ウントリウニウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>11</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 43, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 11, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 132, symbol: "Utb", name: {en: "Untribium", jp: "ウントリビウム", jpkana: "ウントリビウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>12</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 44, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 12, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 133, symbol: "Utt", name: {en: "Untritrium", jp: "ウントリトリウム", jpkana: "ウントリトリウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>13</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 45, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 13, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 134, symbol: "Utq", name: {en: "Untriquadium", jp: "ウントリクアジウム", jpkana: "ウントリクアジウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>14</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 46, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 14, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 135, symbol: "Utp", name: {en: "Untripentium", jp: "ウントリペンチウム", jpkana: "ウントリペンチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>15</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 47, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 15, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 136, symbol: "Uth", name: {en: "Untrihexium", jp: "ウントリヘキシウム", jpkana: "ウントリヘキシウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>16</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 48, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 16, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 137, symbol: "Uts", name: {en: "Untriseptium", jp: "ウントリセプチウム", jpkana: "ウントリセプチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 8s<sup>1</sup>", shell:[2, 8, 18, 32, 50, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 0, 0, 2, 6, 0, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 138, symbol: "Uto", name: {en: "Untrioctium", jp: "ウントリオクチウム", jpkana: "ウントリオクチウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 0, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 139, symbol: "Ute", name: {en: "Untriennium", jp: "ウントリエンニウム", jpkana: "ウントリエンニウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>1</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 19, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 1, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 140, symbol: "Uqn", name: {en: "Unquadnilium", jp: "ウンクアドニリウム", jpkana: "ウンクアドニリウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>2</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 20, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 2, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 141, symbol: "Uqu", name: {en: "Unquadunium", jp: "ウンクアドウニウム", jpkana: "ウンクアドウニウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>3</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 21, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 3, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 142, symbol: "Uqb", name: {en: "Unquadbium", jp: "ウンクアドビウム", jpkana: "ウンクアドビウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>4</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 22, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 4, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 143, symbol: "Uqt", name: {en: "Unquadtrium", jp: "ウンクアドトリウム", jpkana: "ウンクアドトリウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>5</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 23, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 5, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 144, symbol: "Uqq", name: {en: "Unquadquadium", jp: "ウンクアドクアジウム", jpkana: "ウンクアドクアジウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>6</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 24, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 6, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 145, symbol: "Uqp", name: {en: "Unquadpentium", jp: "ウンクアドペンチウム", jpkana: "ウンクアドペンチウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>7</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 25, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 7, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 146, symbol: "Uqh", name: {en: "Unquadhexium", jp: "ウンクアドヘキシウム", jpkana: "ウンクアドヘキシウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>8</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 26, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 8, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 147, symbol: "Uqs", name: {en: "Unquadseptium", jp: "ウンクアドセプチウム", jpkana: "ウンクアドセプチウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>9</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 27, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 9, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 148, symbol: "Uqo", name: {en: "Unquadoctium", jp: "ウンクアドオクチウム", jpkana: "ウンクアドオクチウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>10</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 28, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 10, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 149, symbol: "Uqe", name: {en: "Unquadennium", jp: "ウンクアドエンニウム", jpkana: "ウンクアドエンニウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>11</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 29, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 11, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 150, symbol: "Upn", name: {en: "Unpentnilium", jp: "ウンペントニリウム", jpkana: "ウンペントニリウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>12</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 30, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 12, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 151, symbol: "Upu", name: {en: "Unpentunium", jp: "ウンペントウニウム", jpkana: "ウンペントウニウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 8s<sup>1</sup>", shell:[2, 8, 18, 32, 50, 32, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 0, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 152, symbol: "Upb", name: {en: "Unpentbium", jp: "ウンペントビウム", jpkana: "ウンペントビウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 0, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 153, symbol: "Upt", name: {en: "Unpenttrium", jp: "ウンペントトリウム", jpkana: "ウンペントトリウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>1</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 9, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 1, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 154, symbol: "Upq", name: {en: "Unpentquadium", jp: "ウンペントクアジウム", jpkana: "ウンペントクアジウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>2</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 10, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 2, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 155, symbol: "Upp", name: {en: "Unpentpentium", jp: "ウンペントペンチウム", jpkana: "ウンペントペンチウム", zh: ""}, group: Group.UNKNOWN, block: "f", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>3</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 11, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 3, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 156, symbol: "Uph", name: {en: "Unpenthexium", jp: "ウンペントヘキシウム", jpkana: "ウンペントヘキシウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>4</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 12, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 4, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 157, symbol: "Ups", name: {en: "Unpentseptium", jp: "ウンペントセプチウム", jpkana: "ウンペントセプチウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>5</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 13, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 5, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 158, symbol: "Upo", name: {en: "Unpentoctium", jp: "ウンペントオクチウム", jpkana: "ウンペントオクチウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>6</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 14, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 6, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 159, symbol: "Upe", name: {en: "Unpentennium", jp: "ウンペントエンニウム", jpkana: "ウンペントエンニウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>7</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 15, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 7, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 160, symbol: "Uhn", name: {en: "Unhexnilium", jp: "ウンヘキスニリウム", jpkana: "ウンヘキスニリウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>8</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 16, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 8, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 161, symbol: "Uhu", name: {en: "Unhexunium", jp: "ウンヘキスウニウム", jpkana: "ウンヘキスウニウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>1</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 162, symbol: "Uhb", name: {en: "Unhexbium", jp: "ウンヘキスビウム", jpkana: "ウンヘキスビウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 163, symbol: "Uht", name: {en: "Unhextrium", jp: "ウンヘキストリウム", jpkana: "ウンヘキストリウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>1</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 3], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 164, symbol: "Uhq", name: {en: "Unhexquadium", jp: "ウンヘキスクアジウム", jpkana: "ウンヘキスクアジウム", zh: ""}, group: Group.UNKNOWN, block: "d", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 4], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 165, symbol: "Uhp", name: {en: "Unhexpentium", jp: "ウンヘキスペンチウム", jpkana: "ウンヘキスペンチウム", zh: ""}, group: Group.UNKNOWN, block: "s", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>3</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 5], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 3]}, isSynthetic: null, yearDiscovered: null},
    {no: 166, symbol: "Uhh", name: {en: "Unhexhexium", jp: "ウンヘキスヘキシウム", jpkana: "ウンヘキスヘキシウム", zh: ""}, group: Group.UNKNOWN, block: "s", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>4</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 6], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 4]}, isSynthetic: null, yearDiscovered: null},
    {no: 167, symbol: "Uhs", name: {en: "Unhexseptium", jp: "ウンヘキスセプチウム", jpkana: "ウンヘキスセプチウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>5</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 7], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 5]}, isSynthetic: null, yearDiscovered: null},
    {no: 168, symbol: "Uho", name: {en: "Unhexoctium", jp: "ウンヘキスオクチウム", jpkana: "ウンヘキスオクチウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Og] 5g<sup>18</sup> 6f<sup>14</sup> 7d<sup>10</sup> 8s<sup>2</sup> 8p<sup>6</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 8], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 6]}, isSynthetic: null, yearDiscovered: null},
    {no: 169, symbol: "Uhe", name: {en: "Unhexennium", jp: "ウンヘキスエンニウム", jpkana: "ウンヘキスエンニウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Uho] 9s<sup>1</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 8, 1], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 6, 1]}, isSynthetic: null, yearDiscovered: null},
    {no: 170, symbol: "Usn", name: {en: "Unseptnilium", jp: "ウンセプトニリウム", jpkana: "ウンセプトニリウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Uho] 9s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 32, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 0, 2, 6, 10, 2, 6, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 171, symbol: "Usu", name: {en: "Unseptunium", jp: "ウンセプトウニウム", jpkana: "ウンセプトウニウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Uho] 6g<sup>1</sup> 9s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 33, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 1, 2, 6, 10, 2, 6, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 172, symbol: "Usb", name: {en: "Unseptbium", jp: "ウンセプトビウム", jpkana: "ウンセプトビウム", zh: ""}, group: Group.UNKNOWN, block: "p", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Uho] 6g<sup>2</sup> 9s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 34, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 2, 2, 6, 10, 2, 6, 2]}, isSynthetic: null, yearDiscovered: null},
    {no: 173, symbol: "Ust", name: {en: "Unsepttrium", jp: "ウンセプトトリウム", jpkana: "ウンセプトトリウム", zh: ""}, group: Group.UNKNOWN, block: "g", mass: "", state: State.UNKNOWN, electronAffinity: "", electronegativity: "", ionizationEnergy: "", density: "", radius: "", meltingAt: "", boilingAt: "", electronConfig: {expr: "[Uho] 6g<sup>3</sup> 9s<sup>2</sup>", shell:[2, 8, 18, 32, 50, 35, 18, 8, 2], subshell: [2, 2, 6, 2, 6, 10, 2, 6, 10, 14, 2, 6, 10, 14, 18, 2, 6, 10, 14, 3, 2, 6, 10, 2, 6, 2]}, isSynthetic: null, yearDiscovered: null},
];
