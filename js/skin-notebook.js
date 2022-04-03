class PeriodicTableNotebook extends PeriodicTable {
    buildTable() {
        super.buildTable();

        document.querySelectorAll(".title-side").forEach(parent => {
            let no = this.createDiv(
                this.createDiv("No.", "head-lbl head-no-lbl"), "head-no");
            let date = this.createDiv(
                this.createDiv("Date", "head-lbl head-date-lbl"), "head-date");

            let noFld = this.createDiv("", "head-fld head-no-fld");
            let dateFld1 = this.createDiv("", "head-fld head-date-fld");
            let dateFld2 = this.createDiv("", "head-fld head-date-fld");
            let dateFld3 = this.createDiv("", "head-fld head-date-fld");
            noFld.setAttribute("contenteditable", "true");
            dateFld1.setAttribute("contenteditable", "true");
            dateFld2.setAttribute("contenteditable", "true");
            dateFld3.setAttribute("contenteditable", "true");
            no.append(noFld);
            date.append(dateFld1);
            date.append(dateFld2);
            date.append(dateFld3);

            parent.append(no);
            parent.append(date);
        });

        let guidesTop = ["guide-top-left", "guide-top-right"];
        let guidesBottom = ["guide-bottom-left", "guide-bottom-right"];
        guidesTop.forEach(name => {
            let div = document.createElement("div");
            div.className = `guide guide-top ${name}`;
            document.querySelector("section.tables").prepend(div);
        });
        guidesBottom.forEach(name => {
            let div = document.createElement("div");
            div.className = `guide guide-bottom ${name}`;
            document.querySelector("section.tables").append(div);
        });
    }

    setKanjiName(e, $parent) {
        $parent.textContent = e.name.zh;
        return $parent;
    }

}

let app = new PeriodicTableNotebook(query);
addEventListener("load", e => app.init());
