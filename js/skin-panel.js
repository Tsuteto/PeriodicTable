class PeriodicTablePanel extends PeriodicTable {
    initContext(context, mode) {

        if (mode == "jp") {
            context.title = "拡張元素周期表<span class='sub'><span>Pyykkö</span><span>版</span></span>";
        }
        if (mode == "en") {
            context.title = "Pyykkö’s Extended Periodic Table of the Elements";
            context.legend = "LEGEND";
        }
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
            .filter(e => "sdp".indexOf(e.blockPyk) > -1)
            .map(e => this.createCell(e))
            .forEach(cell => mainTable.appendChild(cell));
        mainTable.appendChild(this.createPyykkoExt("ex6", "block-f", "57-71"));
        mainTable.appendChild(this.createPyykkoExt("ex7", "block-f", "89-103"));

        // Pyykko s/d/p
        let pyykkoExt1Table = document.getElementById("table-pyykko-sdp");
        this.elements
            .filter(e => e.no > 118)
            .filter(e => "sdp".indexOf(e.blockPyk) > -1)
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
            .filter(e => e.blockPyk == "f")
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
            .filter(e => e.blockPyk == "g")
            .map(e => this.createCell(e))
            .forEach(cell => {
                pyykkoExt3Table.appendChild(cell);
            });
        [8, 10].forEach(p => {
            pyykkoExt3Table.appendChild(this.createPeriod(p));
        });        
    }

    getBlock(e) {
        return e.blockPyk;
    }
}


let app = new PeriodicTablePanel(query);
addEventListener("load", e => app.init());
